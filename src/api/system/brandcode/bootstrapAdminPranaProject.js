/* src/api/system/brandcode/bootstrapAdminPranaProject.js
   desc: Bootstrap do Projeto "Prana" (admin-only) já com BrandCode instalado
   role:
     - Cria o projeto interno "Prana" no primeiro boot
     - Instala BrandCode inicial do próprio Prana
     - NÃO passa por protocolos de contratação
     - Executa apenas para ADMIN_USER_ID
*/

import { db } from "../../../db/index.js";
import * as schema from "../../../db/schema.js";
import { eq } from "drizzle-orm";
import { createId } from "../../../utils/id.js";
import { assertAdmin, getAdminUserId } from "./adminGuard.js";

async function ensureAdminProjectExists() {
  const adminId = getAdminUserId();
  if (!adminId) throw new Error("ADMIN_USER_ID não configurado.");

  // verifica se já existe projeto "Prana"
  const existing = await db.query.projects.findFirst({
    where: eq(schema.projects.title, "Prana"),
  });

  if (existing) return existing;

  const projectId = createId("proj");

  await db.insert(schema.projects).values({
    id: projectId,
    title: "Prana",
    description: "Projeto interno do sistema Prana (admin).",
    ownerId: adminId,
    realmId: "system",
    status: "active",
    color: "#111111",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: projectId };
}

async function ensureAdminBrandCode(projectId) {
  // verifica se já existe BrandCode instalado
  const existing = await db.query.brandCodes.findFirst({
    where: eq(schema.brandCodes.projectId, projectId),
  });

  if (existing) return existing;

  const brandCodeId = createId("bcd");

  await db.insert(schema.brandCodes).values({
    id: brandCodeId,
    projectId,
    dna: {
      identity: {
        essence: "Prana como sistema operacional de vida e trabalho consciente",
        promise: "Clareza operacional + presença",
        values: ["consciência", "ritmo", "profundidade", "simplicidade"],
      },
      positioning: {
        category: "Life OS",
        mechanism: "Operação sistêmica de atenção + execução",
        differentiators: ["biomas", "holístico", "agentes especializados"],
      },
      personas: {
        primary: "empreendedor consciente",
        secondary: "criador sistêmico",
      },
      voice: {
        tone: "calmo, direto, sensível",
        rules: ["sem ruído", "sem exageros", "clareza"],
      },
      story: {
        narrative: "retorno à presença enquanto constrói o mundo",
      },
      governance: {
        cadence: "mensal",
        consentModel: "draft + apply",
      },
    },
    vitality: 1,
    source: "SYSTEM_ADMIN_SEED",
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return { id: brandCodeId };
}

export async function bootstrapAdminPranaProject() {
  const adminId = getAdminUserId();
  if (!adminId) {
    console.warn("[BrandCodeBootstrap] ADMIN_USER_ID ausente. Ignorando bootstrap.");
    return;
  }

  assertAdmin(adminId);

  const project = await ensureAdminProjectExists();
  const brandCode = await ensureAdminBrandCode(project.id);

  console.log("🧬 [BrandCode] Projeto Prana pronto (admin).", {
    projectId: project.id,
    brandCodeId: brandCode.id,
  });

  return {
    success: true,
    projectId: project.id,
    brandCodeId: brandCode.id,
  };
}

export default {
  bootstrapAdminPranaProject,
};