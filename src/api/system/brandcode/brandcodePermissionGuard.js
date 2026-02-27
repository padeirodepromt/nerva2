/* src/api/system/brandcode/brandcodePermissionGuard.js
   desc: Guardião de permissão do BrandCode — V3 (Prana-ready)
   role:
     - validar acesso do user ao projectId (owner + collab opcional)
     - validar se system está enabled no projeto
     - validar consentimento (quando aplicável)
   notes:
     - este guard não decide “shop installed” (isso é regra de enable/start)
     - este guard é usado pelo runtime (leitura/aplicação) e por rotas sensíveis
*/

import { db } from "../../../db/index.js";
import { and, eq } from "drizzle-orm";

import { projects } from "../../../db/schema.js";
import { projectSystems } from "../../../db/schema/system.js";

const SYSTEM_KEY = "brand_code";

/**
 * Verifica se user tem acesso ao projeto.
 * V1: ownerId
 * V2 (futuro): collab/teams (expandir aqui).
 */
export async function assertProjectAccess({ userId, projectId }) {
  if (!userId) {
    const err = new Error("Missing userId");
    err.code = "MISSING_USER_ID";
    throw err;
  }
  if (!projectId) {
    const err = new Error("Missing projectId");
    err.code = "MISSING_PROJECT_ID";
    throw err;
  }

  const [p] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.ownerId, userId)))
    .limit(1);

  if (!p) {
    const err = new Error("Project access denied");
    err.code = "PROJECT_ACCESS_DENIED";
    throw err;
  }

  return p;
}

/**
 * Verifica se BrandCode está enabled para o projeto
 * Obs: BrandCode pode existir no DB, mas estar "latente" (não enabled).
 * Runtime canônico exige enabled para "resolveActiveDNA" por padrão.
 */
export async function assertBrandCodeEnabled({ userId, projectId }) {
  await assertProjectAccess({ userId, projectId });

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

  // status esperado: "enabled"
  const enabled = ps?.status === "enabled";

  if (!ps || !enabled) {
    const err = new Error("BrandCode is not enabled for this project");
    err.code = "BRANDCODE_NOT_ENABLED";
    err.details = {
      hasProjectSystem: !!ps,
      status: ps?.status || null,
    };
    throw err;
  }

  return ps;
}

/**
 * Consentimento para aplicar alteração no DNA (mutação consciente).
 *
 * Regra:
 * - explicit precisa ser true (reduz "aplicar sem querer")
 * - E (consentToken válido) OU (consent.granted === true)
 *
 * Observação:
 * - consentToken aqui é só validação de formato (V1).
 * - Quando você quiser harden, substitui por assinatura/JWT expiráveis.
 */
export function assertConsentToApply({ explicit, consent, consentToken }) {
  if (explicit !== true) {
    const err = new Error("Explicit consent required");
    err.code = "CONSENT_REQUIRED";
    throw err;
  }

  if (consentToken != null) {
    if (typeof consentToken !== "string") {
      const err = new Error("Invalid consent token");
      err.code = "CONSENT_TOKEN_INVALID";
      throw err;
    }

    // validação leve (V1)
    const token = consentToken.trim();
    if (token.length < 10) {
      const err = new Error("Invalid consent token");
      err.code = "CONSENT_TOKEN_INVALID";
      throw err;
    }

    return true;
  }

  if (!consent || consent.granted !== true) {
    const err = new Error("Consent not granted");
    err.code = "CONSENT_NOT_GRANTED";
    throw err;
  }

  return true;
}