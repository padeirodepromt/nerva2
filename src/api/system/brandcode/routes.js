/* src/api/system/brandcode/routes.js
   desc: BrandCode Routes (V5) - Lego Model B + Runtime + Events + (opcional) Asaas por projeto
   regras:
   - BrandCode é contratado no Shop -> instala user_systems (userSystems)
   - enable ativa no projeto (project_systems) e garante brand_code row
   - enable pode criar assinatura Asaas por projeto ativo (PIX mensal) se configurado e ainda não existir
   - flags do project_systems guardam subscriptionId + paymentStatus + meta do billing
   - runtime/events/start SEMPRE exigem auth (Flor + frontend dependem disso)

   NOTE:
   - req.user é carregado pelo authMiddleware (authenticate)
*/

import express from "express";
import axios from "axios";
import { and, eq } from "drizzle-orm";

import { authenticate } from "../../authMiddleware.js";
import { db } from "../../../db/index.js";

// Ajuste se seu schema exporta de outro lugar
import { users } from "../../../db/schema.js";

// Ajuste se seu schema de systems estiver em outro arquivo
import { userSystems, projectSystems } from "../../../db/schema/system.js";

import BrandCodeService from "./brandcodeService.js";
import { resolveActiveDNA, recordBrandCodeEvent } from "./brandcodeRuntimeService.js";

const router = express.Router();

// aplica auth em TODAS as rotas deste router
router.use(authenticate);

// ===========================
// Config
// ===========================

const ASAAS_API_URL = process.env.ASAAS_API_URL || "https://sandbox.asaas.com/api/v3";
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

const SYSTEM_KEY = "brand_code";
const DEFAULT_MONTHLY_PRICE_CENTS = 2000; // R$ 20,00 / mês por projeto ativo

// ===========================
// Utils Asaas
// ===========================

function toBRL(valueCents) {
  const n = Number(valueCents);
  if (!Number.isFinite(n) || n <= 0) throw new Error("valueCents inválido");
  return Number((n / 100).toFixed(2));
}

function yyyyMmDdFromNow(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function asaasGetOrCreateCustomerId({ name, email, cpfCnpj }) {
  if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY ausente no env.");
  if (!email) throw new Error("email é obrigatório para customer Asaas");

  // 1) busca por email
  const searchRes = await axios.get(`${ASAAS_API_URL}/customers`, {
    params: { email },
    headers: { access_token: ASAAS_API_KEY },
  });

  const found = searchRes?.data?.data?.[0];
  if (found?.id) return found.id;

  // 2) cria se não existir
  const createRes = await axios.post(
    `${ASAAS_API_URL}/customers`,
    { name: name || email, email, cpfCnpj: cpfCnpj || undefined },
    { headers: { access_token: ASAAS_API_KEY } }
  );

  if (!createRes?.data?.id) throw new Error("Falha ao criar customer no Asaas");
  return createRes.data.id;
}

async function asaasCreateSubscription({ customerId, valueCents, description, externalReference }) {
  if (!ASAAS_API_KEY) throw new Error("ASAAS_API_KEY ausente no env.");
  if (!customerId) throw new Error("customerId obrigatório");

  const payload = {
    customer: customerId,
    billingType: "PIX",
    cycle: "MONTHLY",
    value: toBRL(valueCents),
    nextDueDate: yyyyMmDdFromNow(1),
    description: description || "Assinatura Prana",
    externalReference: externalReference || undefined,
  };

  const res = await axios.post(`${ASAAS_API_URL}/subscriptions`, payload, {
    headers: { access_token: ASAAS_API_KEY },
  });

  if (!res?.data?.id) throw new Error("Falha ao criar subscription no Asaas");
  return res.data; // inclui id, status etc.
}

/**
 * Garante billing por projeto ativo:
 * - lê project_systems.flags.subscriptionId
 * - se faltar, cria customer + subscription no Asaas
 * - salva subscriptionId + paymentStatus em flags
 *
 * best-effort: se Asaas não estiver configurado, não quebra enable.
 */
async function ensureProjectBillingBrandCode({ userId, projectId }) {
  if (!ASAAS_API_KEY) {
    console.warn("[BrandCode enable] ASAAS_API_KEY ausente: billing não será criado.");
    return { billed: false, reason: "ASAAS_NOT_CONFIGURED" };
  }

  const [ps] = await db
    .select()
    .from(projectSystems)
    .where(and(eq(projectSystems.userId, userId), eq(projectSystems.projectId, projectId), eq(projectSystems.systemKey, SYSTEM_KEY)))
    .limit(1);

  if (!ps) return { billed: false, reason: "PROJECT_SYSTEM_NOT_FOUND" };

  const existingSubId = ps?.flags?.subscriptionId;
  if (existingSubId) {
    return {
      billed: true,
      already: true,
      subscriptionId: existingSubId,
      paymentStatus: ps?.flags?.paymentStatus || null,
    };
  }

  const [u] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!u) throw new Error("Usuário não encontrado no DB (billing)");

  const email = u.email;
  const name = u.name || u.fullName || email;

  if (!email) throw new Error("Usuário sem email no DB: não dá pra criar customer Asaas");

  const customerId = await asaasGetOrCreateCustomerId({
    name,
    email,
    cpfCnpj: u.cpfCnpj || u.cpf || u.cnpj || null,
  });

  const valueCents =
    Number.isFinite(ps?.monthlyPriceCents) && ps.monthlyPriceCents > 0 ? ps.monthlyPriceCents : DEFAULT_MONTHLY_PRICE_CENTS;

  const subscription = await asaasCreateSubscription({
    customerId,
    valueCents,
    description: `Assinatura Prana - BrandCode (Projeto ${projectId})`,
    externalReference: `user:${userId}:project:${projectId}:system:${SYSTEM_KEY}`,
  });

  const nextFlags = {
    ...(ps.flags || {}),
    subscriptionId: subscription.id,
    paymentStatus: "pending",
    billingType: "PIX",
    cycle: "MONTHLY",
    valueCents,
    asaasCustomerId: customerId,
  };

  await db.update(projectSystems).set({ flags: nextFlags }).where(eq(projectSystems.id, ps.id));

  return {
    billed: true,
    created: true,
    subscriptionId: subscription.id,
    paymentStatus: "pending",
  };
}

// =======================================================================
// GET /api/system/brandcode/project/:projectId
// state do projeto (installed/enabled + brandCode)
// =======================================================================
router.get("/project/:projectId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const state = await BrandCodeService.getProjectState(userId, projectId);

    return res.json({ success: true, data: state });
  } catch (err) {
    console.error("[BrandCode] get state error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Erro ao obter estado do BrandCode",
    });
  }
});

// =======================================================================
// POST /api/system/brandcode/project/:projectId/enable
// enable + garante row + (opcional) billing por projeto
// =======================================================================
router.post("/project/:projectId/enable", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    if (!projectId) {
      return res.status(400).json({ success: false, error: "projectId é obrigatório" });
    }

    // Regra B: precisa estar contratado/instalado no Shop (user_systems)
    const [installed] = await db
      .select()
      .from(userSystems)
      .where(and(eq(userSystems.userId, userId), eq(userSystems.systemKey, SYSTEM_KEY)))
      .limit(1);

    // Admin pode ser exceção (ex: projeto Prana nasce povoado).
    // Se você quiser a exceção aqui, faça via BrandCodeService.isAdminByUserId(userId).
    // Por enquanto: mantém regra estrita.
    if (!installed) {
      return res.status(403).json({
        success: false,
        code: "SHOP_REQUIRED",
        error: "BrandCode não contratado. Instale no Shop para habilitar em projetos.",
      });
    }

    // Enable no domínio (garante project_systems + brand_codes etc.)
    await BrandCodeService.enableForProject(userId, projectId);

    // Billing por projeto ativo (se ainda não existir subscriptionId)
    const billing = await ensureProjectBillingBrandCode({ userId, projectId });

    // Retorna state atualizado
    const state = await BrandCodeService.getProjectState(userId, projectId);

    return res.json({
      success: true,
      data: { state, billing },
    });
  } catch (err) {
    console.error("[BrandCode] enable error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Erro ao habilitar BrandCode",
    });
  }
});

// =======================================================================
// POST /api/system/brandcode/project/:projectId/start
// Inicia/continua protocolo (Flor) e devolve kickoff normalizado
// =======================================================================
router.post("/project/:projectId/start", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const result = await BrandCodeService.startProtocol(userId, projectId);

    // Normalização opcional aqui (se o service já retorna pronto, ok)
    // Mantém compat com o frontend (florKickoff).
    if (result?.florKickoff) {
      return res.json({ success: true, data: result });
    }

    return res.json({
      success: true,
      data: {
        florKickoff: {
          systemKey: SYSTEM_KEY,
          protocolVersion: result?.protocolVersion || "v1",
          projectId,
          interviewId: result?.interviewId,
          questions: result?.questions || [],
        },
      },
    });
  } catch (err) {
    console.error("[BrandCode] start error:", err);
    return res.status(400).json({
      success: false,
      error: err?.message || "Erro ao iniciar protocolo",
    });
  }
});

// =======================================================================
// PATCH /api/system/brandcode/project/:projectId
// Atualiza/aplica alterações no BrandCode (consentimento via service/guard)
// =======================================================================
router.patch("/project/:projectId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const patch = req.body || {};
    const result = await BrandCodeService.updateBrandCode(userId, projectId, patch);

    return res.json({ success: true, data: result });
  } catch (err) {
    console.error("[BrandCode] patch error:", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Erro ao atualizar BrandCode",
    });
  }
});

// =======================================================================
// GET /api/system/brandcode/runtime/:projectId
// Runtime: resolve DNA ativo + metadados (para Flor + frontend)
// =======================================================================
router.get("/runtime/:projectId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const data = await resolveActiveDNA(projectId, { userId, includeEvents: true });

    return res.json({ success: true, data });
  } catch (err) {
    console.error("[brandcode runtime] error", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Runtime error",
    });
  }
});

// =======================================================================
// POST /api/system/brandcode/events/:projectId
// Eventos (expressão/epigenética): registra evento + recalcula se necessário
// =======================================================================
router.post("/events/:projectId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;

    const event = req.body?.event;
    if (!event || typeof event !== "object") {
      return res.status(400).json({ success: false, error: "event é obrigatório (objeto)" });
    }

    const data = await recordBrandCodeEvent(projectId, event, { userId });

    return res.json({ success: true, data });
  } catch (err) {
    console.error("[brandcode events] error", err);
    return res.status(500).json({
      success: false,
      error: err?.message || "Events error",
    });
  }
});

export default router;