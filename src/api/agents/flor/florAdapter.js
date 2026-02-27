/* src/api/agents/flor/florAdapter.js
   desc: Ponte Única de Verdade e Identidade da Agente Flor (V12).
   role: Define a identidade e isola o Core (BrandCode/Workspace) das extensões Holísticas e Agência.
*/

// --- 0. IDENTIDADE ---
export const key = 'flor'; // Baseado na configuração do seu orchestrator

// --- 1. CORE TOOLS (NATIVO / ESTÚDIO DE CRIAÇÃO E BRAND CODE) ---
// Importa o arsenal nativo traduzido de florTools.js
import { 
  manage_content_workspace, 
  sintonize_narrative_context,
  brandcode_get_project_state,
  brandcode_enable_for_project,
  brandcode_start_for_project,
  brandcode_save_foundation_answers,
  brandcode_save_dna_draft,
  brandcode_update_project 
} from './florTools.js';

// --- 2. DOMÍNIO HOLÍSTICO (PLUS - O SANTUÁRIO E A ENERGIA) ---
import { 
  analyze_holistic_context, 
  set_sankalpa, 
  open_sankalpa_form 
} from '../general/tools/holisticTools.js';

// --- 3. SYSTEM AGENCY (PODERES DO ASH) ---
import { manage_hierarchy, log_time_session } from '../general/tools/planningTools.js';
import { change_view, search_knowledge, manage_inbox } from '../general/tools/coreTools.js';
import { manage_calendar, manage_personal_gmail } from '../general/tools/integrationTools.js';

/**
 * 🛠️ FLOR CORE (O que ela É)
 * Operadora Suprema do BrandCode e Gestora do Espaço de Conteúdo.
 */
export const florCoreTools = {
  manage_content_workspace,
  sintonize_narrative_context,
  brandcode_get_project_state,
  brandcode_enable_for_project,
  brandcode_start_for_project,
  brandcode_save_foundation_answers,
  brandcode_save_dna_draft,
  brandcode_update_project
};

/**
 * ➕ FLOR PLUS (Extensões)
 * O Ecossistema Holístico que ela pode usar para aconselhar o Herói.
 */
export const florPlusTools = {
  analyze_holistic_context,
  set_sankalpa,
  open_sankalpa_form
};

/**
 * 🏛️ SYSTEM AGENCY (Agência Prana)
 * Como ela navega e afeta a vida prática do Herói.
 */
export const systemAgencyTools = {
  manage_hierarchy,
  change_view,
  search_knowledge,
  manage_inbox,
  manage_calendar,
  manage_personal_gmail,
  log_time_session
};