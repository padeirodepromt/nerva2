/**
 * @file brandcodeService.js
 * @description Serviço central do BrandCode (DNA vivo do projeto).
 *
 * V2 (dna_v2):
 * - genes base (6)
 * - camadas: genotype (estável), expression (dinâmica), epigenetics (ambiental)
 * - governança/consentimento (normativo)
 * - protocolos: company | personal (coleta), mas o DNA final é o mesmo
 */

import { db } from "../../../db/index.js";
import { and, desc, eq } from "drizzle-orm";
import * as schema from "../../../db/schema.js";
import { brandCodes, brandCodeInterviews } from "../../../db/schema/system.js";

/**
 * Genes base (fixos). A metáfora biológica permite “expressão” variar,
 * mas o set de genes base é estável na V1.
 */
export const BRANDCODE_GENES = [
  { key: "identity", label: "Identidade" },
  { key: "problem", label: "Problema & Transformação" },
  { key: "product", label: "Produto & Oferta" },
  { key: "positioning", label: "Posicionamento" },
  { key: "communication", label: "Comunicação & Narrativa" },
  { key: "governance", label: "Governança" },
];

/**
 * Requisitos mínimos por gene (genótipo).
 * Isso alimenta completude e ajuda a manter “precisão registrada”.
 */
export const BRANDCODE_GENE_REQUIREMENTS = {
  identity: {
    required: ["essence", "promise", "values", "emotionalTerritory", "archetype"],
  },
  problem: {
    required: ["rootProblem", "invisibleProblem", "currentState", "futureState", "transformation"],
  },
  product: {
    required: ["mechanisms", "features", "differentials", "benefits", "limits"],
  },
  positioning: {
    required: ["category", "antiCategory", "substitutes", "enemies", "breakModel"],
  },
  communication: {
    required: ["voicePillars", "styleRules", "allowedVocab", "forbiddenVocab", "storyBrand"],
  },
  governance: {
    required: ["whatCanChange", "whatCannotChange", "reviewCadence", "consentRules", "vitalityRules"],
  },
};

/**
 * Eventos (para expressão/epigenética).
 * Esses tipos alimentam VitalityEngine + camadas.
 */
export const BRANDCODE_EVENT_TYPES = {
  PROTOCOL_COMPLETED: "protocol_completed",
  GENE_EDITED: "gene_edited",
  OUTPUT_GENERATED: "output_generated",
  OUTPUT_APPLIED: "output_applied",
  AMENDMENT_PROPOSED: "amendment_proposed",
  AMENDMENT_APPLIED: "amendment_applied",

  // Epigenética (sinais externos/sistêmicos)
  MARKET_SIGNAL: "market_signal",
  PRODUCT_CHANGE: "product_change",
  COMMS_FEEDBACK: "comms_feedback",
  SYSTEM_SIGNAL: "system_signal",
};

function nowIso() {
  return new Date().toISOString();
}

function safeObj(v, fb = {}) {
  return v && typeof v === "object" ? v : fb;
}

function asArray(v) {
  return Array.isArray(v) ? v : (v ? [v] : []);
}

export function getProtocolQuestions({ brandType = "company" } = {}) {
  // Company: mantém “fundation” com peso em produto/posicionamento
  if (brandType === "company") {
    return [
      // Identidade
      { id: "identity_1", q: "Qual é a essência do projeto em uma frase curta?" },
      { id: "identity_2", q: "Qual promessa central você quer que seja verdade sempre que alguém toque seu projeto?" },
      { id: "identity_3", q: "Quais valores operacionais guiam decisões difíceis? (liste 5 a 10)" },
      { id: "identity_4", q: "Qual território emocional você quer causar nas pessoas? (ex: clareza, coragem, calma, potência)" },
      { id: "identity_5", q: "Qual arquétipo comportamental descreve como o projeto age no mundo?" },

      // Problema & transformação
      { id: "problem_1", q: "Qual é o problema raiz que você resolve? (funcional)" },
      { id: "problem_2", q: "Qual é o problema invisível por trás dele? (emocional / simbólico)" },
      { id: "problem_3", q: "Descreva o estado atual do cliente antes de você." },
      { id: "problem_4", q: "Descreva o estado futuro do cliente depois de você." },
      { id: "problem_5", q: "Qual transformação central você entrega, de forma inequívoca?" },

      // Produto & oferta
      { id: "product_1", q: "Quais são os mecanismos que tornam seu resultado possível? (liste)" },
      { id: "product_2", q: "Quais são as features estruturais do produto/serviço? (liste de forma exaustiva)" },
      { id: "product_3", q: "Quais são os diferenciais reais, não cosméticos? (liste)" },
      { id: "product_4", q: "Liste benefícios de forma exaustiva: funcionais, emocionais e simbólicos." },
      { id: "product_5", q: "Quais limites você não vai cruzar? O que você não faz, mesmo se pedirem?" },

      // Posicionamento
      { id: "pos_1", q: "Qual categoria você ocupa e qual anti-categoria você rejeita?" },
      { id: "pos_2", q: "Quais substitutos o cliente usa hoje no lugar de você?" },
      { id: "pos_3", q: "Quais inimigos conceituais você combate? (ideias, não pessoas)" },
      { id: "pos_4", q: "Qual modelo você quebra? Qual modelo novo você propõe?" },
      { id: "pos_5", q: "Qual frase de posicionamento você defenderia em público?" },

      // Comunicação & narrativa
      { id: "comms_1", q: "Quais são 3 a 5 pilares de voz? (como você soa)" },
      { id: "comms_2", q: "Quais regras de estilo são inegociáveis?" },
      { id: "comms_3", q: "Quais palavras/expressões são permitidas e quais são proibidas?" },
      { id: "comms_4", q: "Qual narrativa de transformação (StoryBrand/Jornada) melhor descreve o projeto?" },
      { id: "comms_5", q: "Quais CTAs e microcopies você quer repetir ao longo do tempo?" },

      // Governança
      { id: "gov_1", q: "O que pode mudar no DNA e o que não pode?" },
      { id: "gov_2", q: "Quem tem autoridade para mudar? (papéis)" },
      { id: "gov_3", q: "Qual periodicidade de revisão é saudável? (cadência)" },
      { id: "gov_4", q: "Quais decisões exigem consentimento explícito?" },
      { id: "gov_5", q: "Como vitalidade deve ser medida no seu contexto? (critérios)" },
    ];
  }

  // Personal brand (novo protocolo, DNA final é o mesmo)
  return [
    // Identidade (núcleo humano operacional)
    { id: "identity_1", q: "Quem é você operando no mundo quando ninguém está olhando?" },
    { id: "identity_2", q: "Qual promessa você quer que as pessoas sintam ao te acompanhar?" },
    { id: "identity_3", q: "Quais valores operacionais você não negocia? (liste 5 a 10)" },
    { id: "identity_4", q: "Qual território emocional sua presença deve causar?" },
    { id: "identity_5", q: "Qual arquétipo comportamental descreve como você age no mundo?" },

    // Problema & transformação
    { id: "problem_1", q: "Que tipo de transformação você provoca nas pessoas? (central)" },
    { id: "problem_2", q: "Qual é o problema raiz que você resolve quando aparece?" },
    { id: "problem_3", q: "Qual é o problema invisível que você ajuda a nomear?" },
    { id: "problem_4", q: "Descreva o antes e o depois na vida real (sem marketing)." },
    { id: "problem_5", q: "Qual ruptura necessária você sempre provoca?" },

    // Produto & oferta (como consequência)
    { id: "product_1", q: "Quais mecanismos únicos você usa para gerar resultado do seu jeito?" },
    { id: "product_2", q: "Quais formatos você entrega hoje? (produtos, serviços, conteúdo, comunidade) liste tudo." },
    { id: "product_3", q: "Quais diferenciais existem em você que não dependem de tendência?" },
    { id: "product_4", q: "Liste benefícios de forma exaustiva: funcionais, emocionais e simbólicos." },
    { id: "product_5", q: "O que você NÃO quer fazer, mesmo que dê dinheiro?" },

    // Posicionamento
    { id: "pos_1", q: "Em qual categoria você quer ser lembrado e qual você rejeita?" },
    { id: "pos_2", q: "Quais substitutos as pessoas usam hoje no lugar de você?" },
    { id: "pos_3", q: "Quais inimigos conceituais você combate?" },
    { id: "pos_4", q: "Qual modelo você quebra e qual propõe no lugar?" },
    { id: "pos_5", q: "Qual frase de posicionamento você defenderia em público?" },

    // Comunicação & narrativa
    { id: "comms_1", q: "Como você fala quando está no seu melhor? (ritmo, humor, firmeza, doçura)" },
    { id: "comms_2", q: "Quais regras de estilo protegem sua coerência?" },
    { id: "comms_3", q: "Vocabulário permitido e proibido (por estratégia, saúde ou coerência)." },
    { id: "comms_4", q: "Qual foi o seu antes (tensão real) e o depois (verdade conquistada)?" },
    { id: "comms_5", q: "Qual sensação central você quer causar em quem te acompanha?" },

    // Governança
    { id: "gov_1", q: "O que pode mudar no seu DNA e o que não pode?" },
    { id: "gov_2", q: "Quem decide mudanças? (você, sócios, conselho, ninguém?)" },
    { id: "gov_3", q: "Qual cadência de revisão mantém verdade sem virar ansiedade?" },
    { id: "gov_4", q: "Quais decisões exigem consentimento explícito?" },
    { id: "gov_5", q: "Como vitalidade deve ser medida no seu caso? (critérios)" },
  ];
}

/**
 * Cria DNA v2 vazio (estrutura pronta).
 */
export function createEmptyDNA({ brandType = "company" } = {}) {
  const genes = {
    identity: {
      essence: "",
      promise: "",
      values: [],
      emotionalTerritory: "",
      archetype: "",
    },
    problem: {
      rootProblem: "",
      invisibleProblem: "",
      currentState: "",
      futureState: "",
      transformation: "",
      rupture: "",
    },
    product: {
      mechanisms: [],
      features: [],
      differentials: [],
      benefits: [],
      objections: [],
      proof: [],
      limits: [],
    },
    positioning: {
      category: "",
      antiCategory: "",
      substitutes: [],
      enemies: [],
      breakModel: "",
      positioningStatement: "",
    },
    communication: {
      voicePillars: [],
      styleRules: [],
      allowedVocab: [],
      forbiddenVocab: [],
      microcopy: [],
      ctas: [],
      storyBrand: {
        hero: "",
        problem: "",
        guide: "",
        plan: "",
        stakes: "",
        transformation: "",
        cta: "",
      },
    },
    governance: {
      whatCanChange: [],
      whatCannotChange: [],
      authority: [],
      reviewCadence: "",
      consentRules: [],
      vitalityRules: [],
      policy: {}, // para futuro
    },
  };

  return {
    meta: {
      version: "dna_v2",
      brandType,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      vitality: {}, // engine preenche
      maturity: {},
      expression: {},
      epigenetics: {},
    },

    // “Constituição biológica” (normativo, não jurídico)
    constitution: {
      articleI_identity: {
        principle: "Define a essência e o comportamento do projeto.",
        governs: ["identity", "communication"],
      },
      articleII_product: {
        principle: "Define transformação, mecanismos, limites e promessas do produto.",
        governs: ["problem", "product"],
      },
      articleIII_cognition: {
        principle: "Define autonomia, consentimento e papéis humano/sistema.",
        governs: ["governance"],
      },
      articleIV_governance: {
        principle: "Define como o DNA muda, quem muda e como vitalidade é medida.",
        governs: ["governance"],
      },
    },

    genes,
  };
}

/**
 * Constrói DNA v2 a partir das respostas do protocolo (company/personal).
 * V1: mapeamento direto, com normalização e foco na estrutura.
 */
export function buildDNAFromProtocolAnswers({ brandType = "company", answers = {} } = {}) {
  const dna = createEmptyDNA({ brandType });

  // Helper: pegar respostas por prefixo
  const get = (id) => (answers?.[id] ?? "").toString().trim();

  // Identidade
  dna.genes.identity.essence = get("identity_1");
  dna.genes.identity.promise = get("identity_2");
  dna.genes.identity.values = asArray(get("identity_3").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.identity.emotionalTerritory = get("identity_4");
  dna.genes.identity.archetype = get("identity_5");

  // Problema & transformação
  if (brandType === "company") {
    dna.genes.problem.rootProblem = get("problem_1");
    dna.genes.problem.invisibleProblem = get("problem_2");
    dna.genes.problem.currentState = get("problem_3");
    dna.genes.problem.futureState = get("problem_4");
    dna.genes.problem.transformation = get("problem_5");
  } else {
    // personal: a ordem muda, mas o gene final é o mesmo
    dna.genes.problem.transformation = get("problem_1");
    dna.genes.problem.rootProblem = get("problem_2");
    dna.genes.problem.invisibleProblem = get("problem_3");
    dna.genes.problem.currentState = get("problem_4");
    dna.genes.problem.futureState = get("problem_4");
    dna.genes.problem.rupture = get("problem_5");
  }

  // Produto & oferta
  dna.genes.product.mechanisms = asArray(get("product_1").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.product.features = asArray(get("product_2").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.product.differentials = asArray(get("product_3").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.product.benefits = asArray(get("product_4").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.product.limits = asArray(get("product_5").split("\n").map((s) => s.trim()).filter(Boolean));

  // Posicionamento
  dna.genes.positioning.category = get("pos_1");
  dna.genes.positioning.substitutes = asArray(get("pos_2").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.positioning.enemies = asArray(get("pos_3").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.positioning.breakModel = get("pos_4");
  dna.genes.positioning.positioningStatement = get("pos_5");

  // Comunicação & narrativa
  dna.genes.communication.voicePillars = asArray(get("comms_1").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.communication.styleRules = asArray(get("comms_2").split("\n").map((s) => s.trim()).filter(Boolean));
  const vocab = get("comms_3");
  dna.genes.communication.allowedVocab = asArray(vocab.split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.communication.forbiddenVocab = []; // pode vir separado no futuro
  dna.genes.communication.storyBrand.transformation = get("comms_4");
  dna.genes.communication.ctas = asArray(get("comms_5").split("\n").map((s) => s.trim()).filter(Boolean));

  // Governança
  dna.genes.governance.whatCanChange = asArray(get("gov_1").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.governance.authority = asArray(get("gov_2").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.governance.reviewCadence = get("gov_3");
  dna.genes.governance.consentRules = asArray(get("gov_4").split("\n").map((s) => s.trim()).filter(Boolean));
  dna.genes.governance.vitalityRules = asArray(get("gov_5").split("\n").map((s) => s.trim()).filter(Boolean));

  dna.meta.updatedAt = nowIso();
  return dna;
}

/**
 * Interface existente do sistema (mantida) com upgrade para DNA v2.
 */
export async function ensureBrandCodeRow({ projectId, userId, brandType = "company" }) {
  const rows = await db
    .select()
    .from(brandCodes)
    .where(and(eq(brandCodes.projectId, projectId), eq(brandCodes.userId, userId)))
    .orderBy(desc(brandCodes.updatedAt))
    .limit(1);

  if (rows?.[0]) return rows[0];

  const dna = createEmptyDNA({ brandType });
  const inserted = await db
    .insert(brandCodes)
    .values({
      projectId,
      userId,
      status: "active",
      dna,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return inserted?.[0] || null;
}

export async function startInterview({ projectId, userId, brandType = "company" }) {
  await ensureBrandCodeRow({ projectId, userId, brandType });

  const questions = getProtocolQuestions({ brandType });
  const interview = await db
    .insert(brandCodeInterviews)
    .values({
      projectId,
      userId,
      protocolVersion: brandType === "personal" ? "personal_v1" : "foundation_v1",
      answers: {},
      status: "in_progress",
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();

  return {
    interviewId: interview?.[0]?.id,
    protocolVersion: interview?.[0]?.protocolVersion,
    questions,
  };
}

// -----------------------------------------------------------------------------
// Higher level service helpers used by routes / agents
// -----------------------------------------------------------------------------

const SYSTEM_KEY = "brand_code";

export async function getProjectState(userId, projectId) {
  // minimal state: installed + enabled + last brand code row
  if (!userId || !projectId) throw new Error('userId and projectId are required');

  // project access is not strictly enforced here; assume caller already validated
  const [ps] = await db
    .select()
    .from(schema.projectSystems)
    .where(
      and(
        eq(schema.projectSystems.userId, userId),
        eq(schema.projectSystems.projectId, projectId),
        eq(schema.projectSystems.systemKey, SYSTEM_KEY)
      )
    )
    .limit(1);

  const installed = !!ps;
  const enabled = !!ps && ps.status === 'enabled';

  const [bc] = await db
    .select()
    .from(brandCodes)
    .where(eq(brandCodes.projectId, projectId))
    .orderBy(desc(brandCodes.updatedAt))
    .limit(1);

  return { installed, enabled, brandCode: bc || null };
}

export async function enableForProject(userId, projectId) {
  if (!userId || !projectId) throw new Error('userId and projectId are required');

  const now = new Date();
  const [ps] = await db
    .select()
    .from(schema.projectSystems)
    .where(
      and(
        eq(schema.projectSystems.userId, userId),
        eq(schema.projectSystems.projectId, projectId),
        eq(schema.projectSystems.systemKey, SYSTEM_KEY)
      )
    )
    .limit(1);

  if (ps) {
    await db.update(schema.projectSystems).set({ status: 'enabled', enabledAt: now }).where(eq(schema.projectSystems.id, ps.id));
  } else {
    await db.insert(schema.projectSystems).values({
      userId,
      projectId,
      systemKey: SYSTEM_KEY,
      status: 'enabled',
      enabledAt: now,
      createdAt: now,
    });
  }

  await ensureBrandCodeRow({ projectId, userId });
  return { enabled: true };
}

export async function startProtocol(userId, projectId) {
  const data = await startInterview({ projectId, userId });
  return {
    florKickoff: {
      systemKey: SYSTEM_KEY,
      protocolVersion: data.protocolVersion,
      projectId,
      interviewId: data.interviewId,
      questions: data.questions,
    },
  };
}

export async function updateBrandCode(userId, projectId, patch = {}) {
  // simple merge implementation
  const [row] = await db
    .select()
    .from(brandCodes)
    .where(eq(brandCodes.projectId, projectId))
    .orderBy(desc(brandCodes.updatedAt))
    .limit(1);
  if (!row) throw new Error('BrandCode not found');
  const updated = { ...row.dna, ...patch };
  const [result] = await db.update(brandCodes).set({ dna: updated, updatedAt: new Date() }).where(eq(brandCodes.id, row.id)).returning();
  return result;
}

export async function saveFoundationAnswers(userId, projectId, answers = []) {
  // naive: attach to an interview or update latest brandCode
  return { ok: true, answers };
}

export async function saveDnaDraftToInterview(userId, projectId, interviewId, payload = {}) {
  // naive stub
  return { ok: true, interviewId, payload };
}

// default export for backward compatibility
const BrandCodeService = {
  getProjectState,
  enableForProject,
  startProtocol,
  updateBrandCode,
  saveFoundationAnswers,
  saveDnaDraftToInterview,
  ensureBrandCodeRow,
  startInterview,
  BRANDCODE_GENES,
  BRANDCODE_EVENT_TYPES,
  BRANDCODE_GENE_REQUIREMENTS,
};

export default BrandCodeService;