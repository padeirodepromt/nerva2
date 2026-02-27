/* src/api/system/brandcode/seedPranaBrandCode.js
   desc: Seed idempotente do Projeto "Prana" (admin-only) + BrandCode já ativo (sem protocolo / sem billing)
   notes:
     - Node ESM
     - Drizzle ORM
     - Não duplica nada (idempotente)
     - Evita depender de colunas "flags" em projects: usa description markers + projectSystems.flags
*/

import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { userSystems, projectSystems, brandCodes } from "../../../db/schema/system.js";
import { and, eq, isNull, desc } from "drizzle-orm";
import { createId } from "../../../utils/id.js";

const SYSTEM_KEY = "brand_code";
const PRANA_SYSTEM_PROJECT_KEY = "prana_core";
const PRANA_PROJECT_TITLE = "Prana";
const PRANA_PROJECT_MARKERS =
  `[system_project:${PRANA_SYSTEM_PROJECT_KEY}]\n` +
  `[admin_only:true]\n` +
  `[no_billing:true]\n` +
  `[brandcode_seeded:true]\n`;

function pranaDnaSeedV1() {
  return {
    identity: {
      essence: "Sistema operacional humano para vida, foco e criação, com consciência e execução real.",
      purpose: "Transformar intenção em ação sustentável, sem perder saúde, presença e beleza.",
      promise: "Clareza, ritmo e decisões boas, todos os dias.",
      values: [
        "clareza",
        "consistência",
        "simplicidade",
        "verdade",
        "ritmo sustentável",
        "autonomia",
        "integração corpo-mente",
      ],
      behaviors: [
        "menos, porém certo",
        "fechar ciclos",
        "medir com suavidade",
        "decidir com presença",
        "construir sem ruído",
      ],
      boundaries: [
        "sem produtividade vazia",
        "sem gamificação invasiva",
        "sem promessas mágicas",
        "sem excesso de complexidade",
      ],
      emotionalTerritory: {
        coreFeeling: "calma afiada",
        cycle: ["desordem", "clareza", "execução leve"],
      },
    },

    positioning: {
      category: "Operating System for human performance",
      forWhom: "Pessoas que constroem (solo/pequenas equipes) e querem performance sem colapso.",
      problem: "Muito controle gera ansiedade; pouca estrutura vira caos. Falta um sistema vivo e humano.",
      uniqueMechanism:
        "Protocolos de retorno (Voltar) + Sistemas modulares (Widgets) + SideChat (Ash/Flor) com consentimento.",
      differentiators: [
        "VS Code como ambiente mental",
        "biomas opcionais (modulação, não distração)",
        "BrandCode aplicado ao próprio produto",
        "consentimento como regra do sistema",
      ],
      proof: [
        "arquitetura modular",
        "toolService registry por agente",
        "BrandCodeSystem com enable/start/patch",
      ],
    },

    personas: {
      brandPersona: {
        oneLiner: "Elegante, direto, vivo, com presença e pragmatismo.",
        voiceVibe: ["humano", "editorial", "sensível", "prático", "cool sem caricatura"],
        lifeSignals: ["rituais simples", "dados com gentileza", "pouco ruído", "alto impacto"],
      },
      marketPersonas: [
        {
          name: "Construtor Solo",
          momentOfLife: "crescimento com sobrecarga",
          jobToBeDone: "executar prioridades com saúde",
          pain: ["ansiedade", "excesso de tarefas", "falta de clareza"],
          desire: ["ritmo", "foco", "resultados consistentes"],
          objections: ["mais um app", "vai me distrair"],
          whatTheyNeedToHear: [
            "menos features, mais decisões",
            "seu sistema se adapta ao seu estado",
            "nada é aplicado sem você dizer sim",
          ],
        },
      ],
      humanAvatar: {
        age: 33,
        genderExpression: "qualquer",
        profession: "empreendedor(a)/criador(a)/líder técnico(a)",
        dailyLife: "muitas frentes, pouco espaço mental",
        incomeLevel: "médio a alto",
        habits: ["treino leve", "café bom", "blocos de foco", "anotações"],
        cultureSignals: ["wabi-sabi", "editorial", "resort sustentável", "design quiet"],
        aspiration: "crescer com beleza, saúde e presença",
      },
    },

    voice: {
      voicePillars: [
        {
          name: "Clareza calma",
          do: ["frases humanas", "direto sem dureza", "orientação prática"],
          avoid: ["jargão", "excesso de hype", "ameaça/culpa"],
        },
        {
          name: "Editorial real",
          do: ["textura", "metáforas discretas", "sensação de revista"],
          avoid: ["misticismo vago", "infantilização"],
        },
      ],
      styleRules: {
        sentenceShape: "naturais e completas, com ritmo",
        informality: "pontual, elegante",
        humor: "discreto para tirar peso",
        questionsAtEnd: "quando ajuda a abrir espaço",
        bannedPatterns: ["não é X", "você deve", "hack milagroso"],
      },
      examples: {
        microcopy: ["Voltar", "Fechar ciclo", "Uma coisa certa agora"],
        cta: ["Iniciar protocolo", "Revisar DNA", "Aplicar com consentimento"],
        openingLines: ["Vamos reduzir ruído e decidir o que importa."],
      },
    },

    story: {
      storybrand: {
        hero: "A pessoa que constrói e quer um ritmo sustentável.",
        villain: "Ruído, excesso e ansiedade operacional.",
        problemExternal: "tarefas demais e prioridade confusa",
        problemInternal: "cansaço mental, culpa, sensação de estar atrasado",
        problemPhilosophical: "não faz sentido vencer perdendo a si mesmo",
        guideEmpathy: "eu vejo sua sobrecarga e respeito seu tempo",
        guideAuthority: "protocolos + sistema modular com execução",
        plan: ["clarear", "proteger foco", "fechar ciclos"],
        callToActionDirect: "Iniciar protocolo",
        callToActionTransitional: "Fazer check-in",
        success: { identityAspirational: "Eu ajo com calma e impacto, todos os dias." },
        failureAvoided: "colapso, procrastinação crônica, ruído permanente",
        shouldnt: ["viver no modo apagar incêndio", "perder saúde por produtividade"],
        wont: ["o sistema não decide por você", "nada é aplicado sem consentimento"],
      },
      heroJourney: {
        before: "muita ação, pouca clareza",
        crossing: "protocolos de retorno + estrutura",
        after: "ritmo, decisões boas, crescimento com saúde",
      },
    },

    governance: {
      // EXCEÇÃO controlada: para o projeto do admin (Prana), a edição é direta (sem protocolo).
      consentRequired: false,
      protocol: { agent: "flor", version: "v1" },
      maintenanceCadence: "mensal (e sempre que houver mudança estrutural do produto)",
      reviewTriggers: ["mudança de posicionamento", "nova categoria de widget", "mudança de público-alvo"],
      systemProject: true,
      systemKey: PRANA_SYSTEM_PROJECT_KEY,
    },
  };
}

async function resolveAdminUserId() {
  // Preferência 1: ENV explícita
  if (process.env.ADMIN_USER_ID) return process.env.ADMIN_USER_ID;

  // Preferência 2: tentar encontrar user admin (schema pode variar; tentamos campos comuns)
  try {
    // Caso exista users.isAdmin
    const u1 = await db.query.users?.findFirst?.({
      where: eq(schema.users.isAdmin, true),
      orderBy: desc(schema.users.createdAt),
    });
    if (u1?.id) return u1.id;
  } catch (_) {}

  try {
    // Caso exista users.role
    const u2 = await db.query.users?.findFirst?.({
      where: eq(schema.users.role, "admin"),
      orderBy: desc(schema.users.createdAt),
    });
    if (u2?.id) return u2.id;
  } catch (_) {}

  return null;
}

export async function seedPranaBrandCode({ adminUserId } = {}) {
  const ownerId = adminUserId || (await resolveAdminUserId());
  if (!ownerId) {
    console.warn(
      "[seedPranaBrandCode] Nenhum adminUserId encontrado. Defina ADMIN_USER_ID no env ou passe {adminUserId}."
    );
    return { success: false, reason: "missing_admin_user" };
  }

  // 1) Garante projeto "Prana" (admin-only via markers na description + projectSystems.flags)
  let project = await db.query.projects.findFirst({
    where: and(
      eq(schema.projects.ownerId, ownerId),
      eq(schema.projects.title, PRANA_PROJECT_TITLE),
      isNull(schema.projects.deletedAt)
    ),
  });

  if (!project) {
    const projectId = createId("proj");

    await db.insert(schema.projects).values({
      id: projectId,
      title: PRANA_PROJECT_TITLE,
      parentId: null,
      ownerId,
      realmId: "professional",
      status: "active",
      color: "#3B82F6",
      description: PRANA_PROJECT_MARKERS,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    project = await db.query.projects.findFirst({
      where: eq(schema.projects.id, projectId),
    });
  } else {
    // garante markers na description
    const descText = String(project.description || "");
    if (!descText.includes(`[system_project:${PRANA_SYSTEM_PROJECT_KEY}]`)) {
      await db
        .update(schema.projects)
        .set({
          description: (descText ? descText + "\n\n" : "") + PRANA_PROJECT_MARKERS,
          updatedAt: new Date(),
        })
        .where(eq(schema.projects.id, project.id));

      project = await db.query.projects.findFirst({
        where: eq(schema.projects.id, project.id),
      });
    }
  }

  const projectId = project.id;

  // 2) Garante userSystems do BrandCode instalado pro admin
  const [existingUS] = await db
    .select()
    .from(userSystems)
    .where(and(eq(userSystems.userId, ownerId), eq(userSystems.systemKey, SYSTEM_KEY)))
    .limit(1);

  if (!existingUS) {
    await db.insert(userSystems).values({
      userId: ownerId,
      systemKey: SYSTEM_KEY,
      status: "installed",
      config: {},
    });
  }

  // 3) Garante projectSystems habilitado (sem billing)
  const [existingPS] = await db
    .select()
    .from(projectSystems)
    .where(
      and(
        eq(projectSystems.userId, ownerId),
        eq(projectSystems.projectId, projectId),
        eq(projectSystems.systemKey, SYSTEM_KEY)
      )
    )
    .limit(1);

  if (!existingPS) {
    await db.insert(projectSystems).values({
      userId: ownerId,
      projectId,
      systemKey: SYSTEM_KEY,
      status: "enabled",
      enabledAt: new Date(),
      monthlyPriceCents: 0,
      flags: {
        noBilling: true,
        adminOnly: true,
        systemProject: true,
        systemKey: PRANA_SYSTEM_PROJECT_KEY,
        seeded: true,
        lockedProtocol: true,
      },
    });
  } else if (existingPS.status !== "enabled" || existingPS.monthlyPriceCents !== 0) {
    await db
      .update(projectSystems)
      .set({
        status: "enabled",
        monthlyPriceCents: 0,
        enabledAt: existingPS.enabledAt || new Date(),
        updatedAt: new Date(),
        flags: {
          ...(existingPS.flags || {}),
          noBilling: true,
          adminOnly: true,
          systemProject: true,
          systemKey: PRANA_SYSTEM_PROJECT_KEY,
          seeded: true,
          lockedProtocol: true,
        },
      })
      .where(eq(projectSystems.id, existingPS.id));
  }

  // 4) Garante brandCodes com DNA já ativo e sem protocolo
  const [existingBC] = await db
    .select()
    .from(brandCodes)
    .where(and(eq(brandCodes.userId, ownerId), eq(brandCodes.projectId, projectId)))
    .limit(1);

  if (!existingBC) {
    await db.insert(brandCodes).values({
      userId: ownerId,
      projectId,
      status: "active",
      dna: pranaDnaSeedV1(),
      summary:
        "Prana é um sistema operacional humano para vida, foco e criação: clareza, ritmo e execução leve. Modular, com consentimento como regra (exceto no projeto admin seed).",
      confidenceScore: 85,
    });
  } else {
    // se já existe, só garante que não está "empty" e que governança está como seed
    const dna = existingBC.dna || {};
    const governance = dna.governance || {};
    const patchedDna = {
      ...dna,
      governance: {
        ...governance,
        consentRequired: false,
        systemProject: true,
        systemKey: PRANA_SYSTEM_PROJECT_KEY,
      },
    };

    await db
      .update(brandCodes)
      .set({
        status: existingBC.status === "empty" ? "active" : existingBC.status,
        dna: patchedDna,
        summary: existingBC.summary || "Prana (seed) BrandCode ativo no projeto admin.",
        confidenceScore: Number.isInteger(existingBC.confidenceScore) ? existingBC.confidenceScore : 85,
        updatedAt: new Date(),
      })
      .where(eq(brandCodes.id, existingBC.id));
  }

  return {
    success: true,
    adminUserId: ownerId,
    projectId,
    systemKey: SYSTEM_KEY,
    systemProjectKey: PRANA_SYSTEM_PROJECT_KEY,
    seeded: true,
  };
}

export default seedPranaBrandCode;