/* src/api/system/brandcode/boot.js
   desc: Boot hook do sistema BrandCode
   role:
     - (opcional) sync do catálogo de agentes
     - seed do Projeto "Prana" (admin-only) com BrandCode já ativo (sem protocolo/billing)
   notes:
     - Importa funções idempotentes
     - Não quebra o boot se faltar ADMIN_USER_ID (só avisa)
*/

import seedPranaBrandCode from "./seedPranaBrandCode.js";
import { AgentRegistryService } from "../../services/agentRegistryService.js";

export async function bootBrandCodeSystem() {
  // 1) Catálogo de agentes (configs -> DB)
  try {
    if (AgentRegistryService?.syncConfigs) {
      await AgentRegistryService.syncConfigs();
    }
  } catch (e) {
    console.warn("[BrandCodeBoot] AgentRegistry sync falhou:", e?.message || e);
  }

  // 2) Seed do projeto "Prana" (admin-only) + BrandCode ativo
  try {
    const res = await seedPranaBrandCode();
    if (!res?.success) {
      console.warn("[BrandCodeBoot] Seed Prana não executado:", res?.reason || "unknown");
    } else {
      console.log(
        `[BrandCodeBoot] Seed Prana OK: admin=${res.adminUserId} project=${res.projectId} system=${res.systemKey}`
      );
    }
  } catch (e) {
    console.warn("[BrandCodeBoot] Seed Prana falhou:", e?.message || e);
  }

  return { success: true };
}

export default bootBrandCodeSystem;