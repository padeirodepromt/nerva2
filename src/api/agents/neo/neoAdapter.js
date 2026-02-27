/* src/api/agents/neo/neoAdapter.js
   desc: Ponte Única de Verdade e Identidade do Agente Neo (V12).
   role: Define a identidade 'neo_dev' e isola o que é Core, Specialist Plus e System Agency.
   sot: Este ficheiro é o contrato lido pelo toolService para montar o arsenal.
*/

// --- 0. IDENTIDADE (Sincronizada com AgentOrchestrator) ---
export const key = 'neo_dev';

// --- 1. FERRAMENTAS ACOPLADAS (O CORE / NATIVO) ---
// Importa as definições (Declaration + Handler) de neoTools.js
import { apply_code_refactor, manage_code_workspace } from './neoTools.js';

// --- 2. SPECIALIST PLUS (PACOTES / EXTENSÕES) ---
// Ferramentas de pacotes que podem ser injetadas neste agente
import * as elite from '../packages/neo/eliteTools.js';
import * as telemetry from '../packages/neo/telemetry.js';

// --- 3. SYSTEM AGENCY (PODERES DO ASH / SOBERANIA) ---
// Ferramentas globais necessárias para o Neo "fazer o que o Ash faz"
import { manage_hierarchy, log_time_session } from '../general/tools/planningTools.js';
import { change_view, search_knowledge, manage_inbox } from '../general/tools/coreTools.js';
import { manage_github, manage_calendar } from '../general/tools/integrationTools.js';
import { perform_system_audit } from '../general/tools/technicalTools.js';

/**
 * 🛠️ CORE TOOLS (Coupled)
 * O que o Neo É por natureza: Refatoração de Código e Manipulação de Workspace.
 */
export const neoCoreTools = {
  apply_code_refactor,
  manage_code_workspace
};

/**
 * ➕ SPECIALIST PLUS (Extensions)
 * O que o Neo pode adicionar ao seu cérebro de desenvolvedor (Elite & Telemetry).
 */
export const neoPlusTools = {
  ...elite,
  ...telemetry
};

/**
 * 🏛️ SYSTEM AGENCY (System Tools)
 * O pool de agência sistémica que o Neo opera para gerir a vida do Herói.
 */
export const systemAgencyTools = {
  manage_hierarchy,
  change_view,
  search_knowledge,
  manage_inbox,
  log_time_session,
  manage_github,
  manage_calendar,
  perform_system_audit
};