/* src/services/payments/asaasWebhookHandler.js
   desc: Asaas Webhook Handler V1
   goal: reconcile payment/subscription events into Prana DB state.
*/

import { db } from "../../db/index.js";
import { users } from "../../db/schema/core.js";
import { userSystems, projectSystems } from "../../db/schema/system.js";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || ""; 
// opcional: se você setar no Asaas um token e enviar num header custom,
// a gente valida aqui.

export function verifyAsaasWebhook(req) {
  if (!WEBHOOK_TOKEN) return true;

  const h =
    req.headers["asaas-access-token"] ||
    req.headers["x-asaas-access-token"] ||
    req.headers["x-webhook-token"];

  return h === WEBHOOK_TOKEN;
}

// Parse robusto do “Plano X” que você já usa no paymentRoutes.js
function extractPlanKeyFromDescription(description = "") {
  // ex: "Assinatura Prana - Plano ROOT"
  const m = description.match(/Plano\s+([A-Z_]+)/i);
  if (!m?.[1]) return null;
  return m[1].toUpperCase();
}

function normalizeEventType(evt = "") {
  return String(evt || "").toUpperCase().trim();
}

// Eventos mais comuns do Asaas (pagamento)
function isPaidEvent(eventType) {
  return ["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED"].includes(eventType);
}

function isOverdueEvent(eventType) {
  return ["PAYMENT_OVERDUE"].includes(eventType);
}

function isCancelledEvent(eventType) {
  return ["PAYMENT_DELETED", "PAYMENT_REFUNDED"].includes(eventType);
}

/**
 * Tenta reconciliar por:
 * 1) users.subscriptionId (planos)
 * 2) user_systems.config.subscriptionId (packs)
 * 3) project_systems.config.subscriptionId (por projeto)
 */
export async function handleAsaasWebhook(payload) {
  const eventType = normalizeEventType(payload?.event);
  const payment = payload?.payment || payload?.data || null;

  if (!payment) {
    return { ok: false, reason: "NO_PAYMENT" };
  }

  const subscriptionId = payment?.subscription || null;
  const paymentId = payment?.id || null;

  // 1) Planos (users.subscriptionId)
  if (subscriptionId) {
    const [u] = await db.select().from(users).where(eq(users.subscriptionId, subscriptionId)).limit(1);

    if (u) {
      const planKey = extractPlanKeyFromDescription(payment?.description || "") || u.planType || null;

      if (isPaidEvent(eventType)) {
        await db
          .update(users)
          .set({
            planType: planKey || u.planType,
            planExpiresAt: null,
            updatedAt: new Date()
          })
          .where(eq(users.id, u.id));
      } else if (isOverdueEvent(eventType) || isCancelledEvent(eventType)) {
        // “degradação” de plano pode ser regra de negócio sua.
        // Aqui eu só marco expiração. Você pode mudar para SEED se quiser.
        await db
          .update(users)
          .set({
            planExpiresAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(users.id, u.id));
      }

      return { ok: true, kind: "USER_PLAN", userId: u.id, subscriptionId, paymentId, eventType };
    }
  }

  // 2) Shop: user_systems.config.subscriptionId
  // Sem migração: consulta jsonb via SQL.
  if (subscriptionId) {
    const userSys = await db.execute(sql`
      SELECT * FROM user_systems
      WHERE (config->>'subscriptionId') = ${subscriptionId}
      LIMIT 1
    `);

    const usRow = userSys?.rows?.[0] || null;
    if (usRow) {
      const nextPaymentStatus = isPaidEvent(eventType)
        ? "paid"
        : isOverdueEvent(eventType)
          ? "overdue"
          : isCancelledEvent(eventType)
            ? "cancelled"
            : "unknown";

      await db.execute(sql`
        UPDATE user_systems
        SET config = jsonb_set(
          COALESCE(config, '{}'::jsonb),
          '{paymentStatus}',
          to_jsonb(${nextPaymentStatus}::text),
          true
        ),
        updated_at = NOW()
        WHERE id = ${usRow.id}
      `);

      return { ok: true, kind: "USER_SYSTEM", userSystemId: usRow.id, subscriptionId, paymentId, eventType };
    }

    // 3) Shop por projeto: project_systems.config.subscriptionId
    const projSys = await db.execute(sql`
      SELECT * FROM project_systems
      WHERE (config->>'subscriptionId') = ${subscriptionId}
      LIMIT 1
    `);

    const psRow = projSys?.rows?.[0] || null;
    if (psRow) {
      const nextPaymentStatus = isPaidEvent(eventType)
        ? "paid"
        : isOverdueEvent(eventType)
          ? "overdue"
          : isCancelledEvent(eventType)
            ? "cancelled"
            : "unknown";

      await db.execute(sql`
        UPDATE project_systems
        SET config = jsonb_set(
          COALESCE(config, '{}'::jsonb),
          '{paymentStatus}',
          to_jsonb(${nextPaymentStatus}::text),
          true
        ),
        updated_at = NOW()
        WHERE id = ${psRow.id}
      `);

      return { ok: true, kind: "PROJECT_SYSTEM", projectSystemId: psRow.id, subscriptionId, paymentId, eventType };
    }
  }

  return { ok: true, kind: "IGNORED", subscriptionId, paymentId, eventType };
}