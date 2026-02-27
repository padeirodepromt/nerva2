/* src/api/system/brandcode/brandcodeVitalityEngine.js
   desc: Vitality Engine do BrandCode (V2)
   role:
     - calcula vitalidade por gene (macro) a partir do DNA ativo (genótipo)
     - calcula maturidade (macro) e fase
     - registra evolução por eventos (best-effort)
   notas:
     - engine é determinística: mesma entrada => mesma saída
     - persistência de snapshot:
        - sempre salva latest + history compacto dentro de dna.governance.vitality
        - opcionalmente tenta salvar event log (se tabela existir), sem quebrar caso não exista
*/

import { db } from "../../../db/index.js";
import { eq } from "drizzle-orm";
import { brandCodes } from "../../../db/schema/system.js";

// =========================================================
// 0) UTILS
// =========================================================

const clamp01 = (n) => Math.max(0, Math.min(1, n));

function safeObj(v) {
  return v && typeof v === "object" && !Array.isArray(v) ? v : {};
}

function safeArr(v) {
  return Array.isArray(v) ? v : [];
}

/**
 * Conta "preenchimento" de forma robusta.
 * - string: trim > 0
 * - number: finito
 * - boolean: sempre preenchido
 * - array: length > 0 (ou algum item preenchido se array de objetos)
 * - object: tem ao menos 1 chave preenchida
 */
export function isFilled(value) {
  if (value === undefined || value === null) return false;

  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value === "boolean") return true;

  if (Array.isArray(value)) {
    if (value.length === 0) return false;
    // se for array "rica", tenta detectar conteúdo
    return value.some((x) => isFilled(x));
  }

  if (typeof value === "object") {
    const keys = Object.keys(value);
    if (keys.length === 0) return false;
    return keys.some((k) => isFilled(value[k]));
  }

  return false;
}

function getPath(obj, path) {
  if (!obj || typeof obj !== "object") return undefined;
  const parts = String(path).split(".");
  let cur = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== "object") return undefined;
    cur = cur[p];
  }
  return cur;
}

function daysSince(ts) {
  const now = Date.now();
  const t = ts ? new Date(ts).getTime() : now;
  const diff = Math.max(0, now - t);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Recency: vira um multiplicador suave (1..0.62)
 * determinístico em função dos dias desde updatedAt
 */
function recencyFactorFromDays(days) {
  if (days <= 3) return 1.0;
  if (days <= 14) return 0.92;
  if (days <= 30) return 0.84;
  if (days <= 60) return 0.72;
  return 0.62;
}

// =========================================================
// 1) GENE MAP (constituição em macro genes)
// =========================================================

/**
 * Essenciais por gene.
 * IMPORTANTE: isso precisa acompanhar a estrutura constitucional final.
 * Aqui já está alinhado com:
 * - identity
 * - product (problema + transformação + oferta)
 * - positioning
 * - communication
 * - cognitiveModel
 * - governance
 */
const ESSENTIAL = {
  identity: [
    "essence",
    "promise",
    "values",
    "territory",
    "archetype",
  ],
  product: [
    "rootProblem",
    "invisibleProblem",
    "transformation",
    "mechanisms",
    "differentials",
    "limits",
  ],
  positioning: [
    "category",
    "antiCategory",
    "mechanism",
    "differentials",
    "substitutes",
    "villain",
  ],
  communication: [
    "voice.tone",
    "voice.rules",
    "voice.vocabularyAllowed",
    "voice.vocabularyForbidden",
    "story.storybrand",
    "story.narrative",
    "cta",
  ],
  cognitiveModel: [
    "humanRole",
    "systemRole",
    "automationRole",
    "autonomyLevel",
    "decisionsRequiringConsent",
    "bounds",
  ],
  governance: [
    "cadence",
    "consentModel",
    "mutable",
    "immutable",
    "maturityCriteria",
    "vitalityCriteria",
  ],
};

// pesos macro para maturidade global
const MATURITY_WEIGHTS = {
  identity: 0.20,
  product: 0.18,
  positioning: 0.16,
  communication: 0.16,
  cognitiveModel: 0.18,
  governance: 0.12,
};

// =========================================================
// 2) COERÊNCIA (boosts pequenos, mas consistentes)
// =========================================================

function coherenceBoostIdentity(dna) {
  const id = safeObj(dna.identity);
  const hasPromise = isFilled(id.promise);
  const hasValues = isFilled(id.values);
  const hasTerritory = isFilled(id.territory);

  if (hasPromise && hasValues && hasTerritory) return 0.08;
  if ((hasPromise && hasValues) || (hasPromise && hasTerritory) || (hasValues && hasTerritory)) return 0.04;
  return 0.0;
}

function coherenceBoostCommunication(dna) {
  // Se há tom + regras + vocabulário proibido, tende a estar “operacional”
  const comm = safeObj(dna.communication);
  const voice = safeObj(comm.voice);
  const hasTone = isFilled(voice.tone);
  const hasRules = isFilled(voice.rules);
  const hasForbidden = isFilled(voice.vocabularyForbidden);

  if (hasTone && hasRules && hasForbidden) return 0.06;
  if ((hasTone && hasRules) || (hasTone && hasForbidden) || (hasRules && hasForbidden)) return 0.03;
  return 0.0;
}

function coherenceBoostCognitiveModel(dna) {
  // se há autonomia + bounds + decisões com consentimento, o modelo está “usável”
  const cm = safeObj(dna.cognitiveModel);
  const hasAutonomy = isFilled(cm.autonomyLevel);
  const hasBounds = isFilled(cm.bounds);
  const hasConsent = isFilled(cm.decisionsRequiringConsent);

  if (hasAutonomy && hasBounds && hasConsent) return 0.07;
  if ((hasAutonomy && hasBounds) || (hasAutonomy && hasConsent) || (hasBounds && hasConsent)) return 0.035;
  return 0.0;
}

// =========================================================
// 3) COMPUTE SNAPSHOT (determinístico)
// =========================================================

function completenessForGene(dna, geneKey) {
  const geneObj = safeObj(dna?.[geneKey]);
  const paths = ESSENTIAL[geneKey] || [];
  if (paths.length === 0) return 0;

  let filled = 0;
  for (const p of paths) {
    if (isFilled(getPath(geneObj, p))) filled += 1;
  }
  return filled / paths.length; // 0..1
}

/**
 * Entrada mínima:
 *  - dna: object
 *  - updatedAt: date/iso/number
 * Retorno:
 *  - vitalityByGene: 0..1
 *  - maturity: 0..1 (média ponderada)
 *  - maturityScore: 0..100
 *  - phase: seed/growth/mature/excellent
 *  - recencyDays, recencyFactor
 *  - computedAt
 */
export function computeVitalitySnapshot({ dna, updatedAt }) {
  const safeDna = safeObj(dna);

  // recência determinística em função do updatedAt do BrandCode (ou agora)
  const recencyDays = daysSince(updatedAt);
  const recencyFactor = recencyFactorFromDays(recencyDays);

  const genes = Object.keys(ESSENTIAL);

  const vitalityByGene = {};

  for (const g of genes) {
    const base = completenessForGene(safeDna, g);

    let coherence = 0;
    if (g === "identity") coherence = coherenceBoostIdentity(safeDna);
    if (g === "communication") coherence = coherenceBoostCommunication(safeDna);
    if (g === "cognitiveModel") coherence = coherenceBoostCognitiveModel(safeDna);

    // fórmula:
    // - completude pesa mais (genótipo)
    // - recência pesa pouco, mas evita “DNA morto”
    // - coerência é um bônus pequeno
    const v = clamp01(base * 0.80 + recencyFactor * 0.16 + coherence);

    vitalityByGene[g] = Number(v.toFixed(3));
  }

  // maturidade ponderada
  let maturity = 0;
  for (const [gene, w] of Object.entries(MATURITY_WEIGHTS)) {
    maturity += (vitalityByGene[gene] ?? 0) * w;
  }
  maturity = clamp01(maturity);

  const vitalityOverall = Number(maturity.toFixed(3));

  const phase =
    vitalityOverall < 0.35
      ? "seed"
      : vitalityOverall < 0.60
      ? "growth"
      : vitalityOverall < 0.80
      ? "mature"
      : "excellent";

  return {
    vitalityByGene,
    vitalityOverall,
    maturityScore: Number((vitalityOverall * 100).toFixed(1)),
    recencyDays,
    recencyFactor: Number(recencyFactor.toFixed(3)),
    phase,
    computedAt: new Date().toISOString(),
  };
}

// =========================================================
// 4) EVENT LOG (best-effort)
// =========================================================

/**
 * Best-effort insert em tabela de eventos, se existir.
 * Não quebra se:
 * - schema não tiver
 * - tabela não estiver exportada
 * - permissão falhar
 *
 * Estratégia:
 * - tenta executar SQL simples
 * - se falhar, ignora
 */
async function tryInsertEvent({ brandCodeId, type, payload }) {
  try {
    // Ajuste aqui quando você criar a tabela real.
    // Exemplo de tabela:
    // brand_code_events(id, brandCodeId, type, payload, createdAt)
    //
    // Como não temos schema garantido aqui, fazemos um SQL "tentativo".
    // Drizzle: db.execute(sql`...`) exige import de sql.
    // Para manter este arquivo 100% compatível sem adivinhar stack SQL,
    // deixamos desligado por padrão.
    //
    // Se você quiser o event log ativo agora, eu plugo com o schema/tabela real.
    void brandCodeId;
    void type;
    void payload;
    return { ok: false, skipped: true };
  } catch (e) {
    return { ok: false, error: String(e?.message || e) };
  }
}

// =========================================================
// 5) PERSIST SNAPSHOT (snapshot + histórico compacto)
// =========================================================

function didSnapshotChange(prev, next) {
  if (!prev) return true;

  const prevOverall = Number(prev?.vitalityOverall ?? 0);
  const nextOverall = Number(next?.vitalityOverall ?? 0);

  // muda se overall variar >= 0.02
  if (Math.abs(prevOverall - nextOverall) >= 0.02) return true;

  const nextGenes = safeObj(next?.vitalityByGene);
  const prevGenes = safeObj(prev?.vitalityByGene);

  // muda se qualquer gene variar >= 0.04
  for (const [g, val] of Object.entries(nextGenes)) {
    const a = Number(prevGenes[g] ?? 0);
    const b = Number(val ?? 0);
    if (Math.abs(a - b) >= 0.04) return true;
  }
  return false;
}

/**
 * Persistência:
 * - salva snapshot em dna.governance.vitality.latest
 * - mantém history (últimos 12)
 * - retorna { snapshot, changed }
 */
export async function persistVitalitySnapshot({ brandCodeId, dna, updatedAt }) {
  if (!brandCodeId) throw new Error("brandCodeId is required");

  const snapshot = computeVitalitySnapshot({ dna, updatedAt });

  const safeDna = safeObj(dna);
  const gov = safeObj(safeDna.governance);

  const prevLatest = gov?.vitality?.latest || null;
  const prevHistory = safeArr(gov?.vitality?.history);

  const changed = didSnapshotChange(prevLatest, snapshot);

  const nextGov = {
    ...gov,
    vitality: {
      latest: snapshot,
      history: [...prevHistory, snapshot].slice(-12),
    },
  };

  const nextDna = {
    ...safeDna,
    governance: nextGov,
  };

  // salva sempre latest/history (determinístico e consultável)
  await db
    .update(brandCodes)
    .set({ dna: nextDna, updatedAt: new Date() })
    .where(eq(brandCodes.id, brandCodeId));

  // best-effort event log (se houve mudança relevante)
  if (changed) {
    await tryInsertEvent({
      brandCodeId,
      type: "brandcode.vitality.snapshot",
      payload: snapshot,
    });
  }

  return { snapshot, changed };
}

// =========================================================
// 6) READ HELPERS
// =========================================================

export async function getStoredVitalitySnapshotByBrandCodeId(brandCodeId) {
  const [bc] = await db.select().from(brandCodes).where(eq(brandCodes.id, brandCodeId)).limit(1);
  return bc?.dna?.governance?.vitality?.latest || null;
}

export async function getStoredVitalityHistoryByBrandCodeId(brandCodeId) {
  const [bc] = await db.select().from(brandCodes).where(eq(brandCodes.id, brandCodeId)).limit(1);
  const history = bc?.dna?.governance?.vitality?.history || [];
  return Array.isArray(history) ? history : [];
}