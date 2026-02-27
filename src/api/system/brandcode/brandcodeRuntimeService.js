/* src/api/system/brandcode/brandcodeRuntimeService.js
   desc: Runtime do BrandCode (resolver DNA ativo do projeto) — V5 (canon)
   role:
     - usado pela Flor (synthesis/apply)
     - usado pelo frontend (runtime + DNA + vitalidade + eventos)
     - ponto canônico para “DNA ativo” e “estado do sistema”
   contracts (importante):
     - routes.js chama:
        resolveActiveDNA(projectId, { userId, includeEvents })
        recordBrandCodeEvent(projectId, event, { userId })
     - frontend pode chamar:
        getProjectRuntimeState({ userId, projectId, includeDNA, includeVitality })
        resolveActiveDNA({ userId, projectId, includeEvents, persistVitality })
*/

import { db } from "../../../db/index.js";
import { and, eq } from "drizzle-orm";

import {
  brandCodes,
  projectSystems,
  userSystems,
} from "../../../db/schema/system.js";

import {
  assertProjectAccess,
  assertBrandCodeEnabled,
  assertConsentToApply,
} from "./brandcodePermissionGuard.js";

import {
  computeVitalitySnapshot,
  persistVitalitySnapshot,
} from "./brandcodeVitalityEngine.js";

const SYSTEM_KEY = "brand_code";

// -----------------------------
// small utils
// -----------------------------
function safeObj(v) {
  return v && typeof v === "object" ? v : {};
}

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

function clampInt(n, min, max) {
  const x = Number(n);
  if (!Number.isFinite(x)) return min;
  return Math.max(min, Math.min(max, Math.round(x)));
}

/**
 * Opinião: eventos “epigenéticos” ficam embutidos no DNA (governance.events)
 * porque:
 * - não depende de schema novo
 * - dá rastreabilidade já
 * - é suficiente para V1 (depois migramos para brand_code_events)
 */
function readEmbeddedEvents(dna) {
  const gov = safeObj(safeObj(dna).governance);
  const events = safeArr(gov.events);
  return events;
}

function writeEmbeddedEvents(dna, nextEvents) {
  const d = safeObj(dna);
  const gov = safeObj(d.governance);
  return {
    ...d,
    governance: {
      ...gov,
      events: nextEvents,
    },
  };
}

/**
 * Resolve as “flags” do ProjectSystem (billing etc.)
 */
function pickProjectFlags(ps) {
  const flags = safeObj(ps?.flags);
  return {
    subscriptionId: flags.subscriptionId || null,
    paymentStatus: flags.paymentStatus || null,
    billingType: flags.billingType || null,
    cycle: flags.cycle || null,
    valueCents: Number.isFinite(flags.valueCents) ? flags.valueCents : null,
  };
}

export const BrandCodeRuntimeService = {
  /**
   * Estado runtime para o frontend (master state)
   * Inclui:
   * - installed (user_systems)
   * - enabled (project_systems)
   * - brandCode row (opcional)
   * - vitality (calculada, não destrutiva)
   */
  async getProjectRuntimeState({
    userId,
    projectId,
    includeDNA = true,
    includeVitality = true,
    includeEvents = false,
  }) {
    if (!userId) throw new Error("Missing userId");
    if (!projectId) throw new Error("Missing projectId");

    await assertProjectAccess({ userId, projectId });

    // installed: userSystems (contratação no shop)
    const [us] = await db
      .select()
      .from(userSystems)
      .where(and(eq(userSystems.userId, userId), eq(userSystems.systemKey, SYSTEM_KEY)))
      .limit(1);

    const installed = !!us;

    // enabled: projectSystems.status === enabled
    const [ps] = await db
      .select()
      .from(projectSystems)
      .where(
        and(
          eq(projectSystems.userId, userId),
          eq(projectSystems.projectId, projectId),
          eq(projectSystems.systemKey, SYSTEM_KEY)
        )
      )
      .limit(1);

    const enabled = ps?.status === "enabled";

    // brandCode row
    const [bc] = await db
      .select()
      .from(brandCodes)
      .where(and(eq(brandCodes.userId, userId), eq(brandCodes.projectId, projectId)))
      .limit(1);

    const base = {
      projectId,
      systemKey: SYSTEM_KEY,

      installed,
      enabled,

      monthlyPriceCents: ps?.monthlyPriceCents ?? null,
      flags: pickProjectFlags(ps),

      brandCode: null,
      vitality: null,
      events: null,

      // compat extra (widget V10 gosta disso pronto)
      status: bc?.status || (enabled ? "empty" : "empty"),
      ready: false,
    };

    if (!bc) return base;

    const dna = safeObj(bc.dna);
    const dnaIncluded = includeDNA ? dna : undefined;

    const ready =
      enabled &&
      bc.status === "active" &&
      includeDNA &&
      Object.keys(dna).length > 0;

    const payload = {
      ...base,
      brandCode: includeDNA ? bc : { ...bc, dna: undefined },
      status: bc.status || "empty",
      ready,
    };

    if (includeVitality && includeDNA) {
      payload.vitality = computeVitalitySnapshot({
        dna,
        updatedAt: bc.updatedAt || bc.createdAt,
      });
    }

    if (includeEvents && includeDNA) {
      payload.events = readEmbeddedEvents(dna).slice(-40);
    }

    return payload;
  },

  /**
   * Resolve o DNA ativo do projeto (Flor + frontend)
   * - exige BrandCode enabled
   */
  async resolveActiveDNA({
    userId,
    projectId,
    persistVitality = false,
    includeEvents = false,
  }) {
    if (!userId) throw new Error("Missing userId");
    if (!projectId) throw new Error("Missing projectId");

    await assertBrandCodeEnabled({ userId, projectId });

    const [bc] = await db
      .select()
      .from(brandCodes)
      .where(and(eq(brandCodes.userId, userId), eq(brandCodes.projectId, projectId)))
      .limit(1);

    if (!bc) {
      const err = new Error("Brand Code not found for project");
      err.code = "BRANDCODE_NOT_FOUND";
      throw err;
    }

    const dna = safeObj(bc.dna);
    const vitality = computeVitalitySnapshot({
      dna,
      updatedAt: bc.updatedAt || bc.createdAt,
    });

    if (persistVitality) {
      // registra snapshot em dna.governance.vitality (latest + history)
      await persistVitalitySnapshot({
        brandCodeId: bc.id,
        dna,
        updatedAt: bc.updatedAt || bc.createdAt,
      });
    }

    const events = includeEvents ? readEmbeddedEvents(dna).slice(-40) : undefined;

    return {
      projectId,
      systemKey: SYSTEM_KEY,

      brandCodeId: bc.id,
      status: bc.status || "empty",

      confidenceScore: bc.confidenceScore ?? 0,
      summary: bc.summary ?? null,

      // herança (quando você ligar de verdade, esses campos virão do bc)
      isInherited: !!bc.isInherited || false,
      inheritedFrom: bc.inheritedFrom || null,

      dna,
      vitality,
      events,

      updatedAt: bc.updatedAt || bc.createdAt,
    };
  },

  /**
   * Registra evento epigenético (best-effort)
   * - exige acesso + enabled
   * - grava em dna.governance.events (últimos 50)
   * - opcionalmente persiste snapshot de vitalidade (porque eventos "contam")
   */
  async recordBrandCodeEvent({ userId, projectId, event }) {
    if (!userId) throw new Error("Missing userId");
    if (!projectId) throw new Error("Missing projectId");
    if (!event || typeof event !== "object") throw new Error("Missing event object");

    await assertBrandCodeEnabled({ userId, projectId });

    const [bc] = await db
      .select()
      .from(brandCodes)
      .where(and(eq(brandCodes.userId, userId), eq(brandCodes.projectId, projectId)))
      .limit(1);

    if (!bc) {
      const err = new Error("Brand Code not found for project");
      err.code = "BRANDCODE_NOT_FOUND";
      throw err;
    }

    const now = new Date();
    const dna = safeObj(bc.dna);

    const normalizedEvent = {
      // mínimos para rastreio
      type: String(event.type || "unknown"),
      at: event.at ? new Date(event.at).toISOString() : now.toISOString(),
      source: String(event.source || "system"), // "flor" | "frontend" | "agent" | "system"
      // payload livre (compactado)
      payload: safeObj(event.payload),
      // opcional: peso sugerido (0..5)
      weight: clampInt(event.weight ?? 1, 0, 5),
    };

    const prevEvents = readEmbeddedEvents(dna);
    const nextEvents = [...prevEvents, normalizedEvent].slice(-50);

    const nextDna = writeEmbeddedEvents(dna, nextEvents);

    // grava DNA com evento embutido
    await db
      .update(brandCodes)
      .set({ dna: nextDna, updatedAt: now })
      .where(eq(brandCodes.id, bc.id));

    // evento pode disparar snapshot (registrável)
    const { snapshot } = await persistVitalitySnapshot({
      brandCodeId: bc.id,
      dna: nextDna,
      updatedAt: now,
    });

    return {
      ok: true,
      projectId,
      brandCodeId: bc.id,
      event: normalizedEvent,
      vitality: snapshot,
      updatedAt: now.toISOString(),
    };
  },

  /**
   * Aplica patch no BrandCode (DNA ativo).
   * - exige consentimento explícito
   * - persiste snapshot pós-update (registrável)
   */
  async applyDNAUpdate({
    userId,
    projectId,
    patch = {},
    consent = null,
    consentToken = null,
    explicit = false,
  }) {
    if (!userId) throw new Error("Missing userId");
    if (!projectId) throw new Error("Missing projectId");

    await assertBrandCodeEnabled({ userId, projectId });
    assertConsentToApply({ explicit, consent, consentToken });

    const [bc] = await db
      .select()
      .from(brandCodes)
      .where(and(eq(brandCodes.userId, userId), eq(brandCodes.projectId, projectId)))
      .limit(1);

    if (!bc) {
      const err = new Error("Brand Code not found for project");
      err.code = "BRANDCODE_NOT_FOUND";
      throw err;
    }

    const now = new Date();

    const next = { updatedAt: now };

    if (patch?.dna && typeof patch.dna === "object") next.dna = patch.dna;
    if (typeof patch?.summary === "string") next.summary = patch.summary;

    if (["empty", "building", "active", "review"].includes(patch?.status)) {
      next.status = patch.status;
    }

    if (Number.isInteger(patch?.confidenceScore)) {
      next.confidenceScore = clampInt(patch.confidenceScore, 0, 100);
    }

    await db.update(brandCodes).set(next).where(eq(brandCodes.id, bc.id));

    const dnaAfter = next.dna || bc.dna || {};
    const { snapshot } = await persistVitalitySnapshot({
      brandCodeId: bc.id,
      dna: dnaAfter,
      updatedAt: now,
    });

    return {
      success: true,
      projectId,
      brandCodeId: bc.id,
      vitality: snapshot,
      updatedAt: now.toISOString(),
    };
  },
};

// ------------------------------------------------------------------
// Named exports para casar com routes.js (canon)
// ------------------------------------------------------------------

/**
 * resolveActiveDNA(projectId, { userId, includeEvents, persistVitality })
 * Retorna shape: { success:true, data: {...runtime} } no routes.
 */
export async function resolveActiveDNA(projectId, opts = {}) {
  const userId = opts.userId;
  const includeEvents = !!opts.includeEvents;
  const persistVitality = !!opts.persistVitality;

  return BrandCodeRuntimeService.resolveActiveDNA({
    userId,
    projectId,
    includeEvents,
    persistVitality,
  });
}

/**
 * recordBrandCodeEvent(projectId, event, { userId })
 */
export async function recordBrandCodeEvent(projectId, event, opts = {}) {
  const userId = opts.userId;
  return BrandCodeRuntimeService.recordBrandCodeEvent({
    userId,
    projectId,
    event,
  });
}

export default BrandCodeRuntimeService;