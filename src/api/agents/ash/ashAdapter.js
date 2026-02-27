/* src/api/agents/ash/ashAdapter.js
   desc: Ponte Única de Verdade e Identidade do Agente Ash (V12).
   role: Define o Ash como o Operador Supremo do Prana. Ele não possui 
         ferramentas especialistas (como código ou copy), apenas Agência Sistémica.
   sot: Este ficheiro é o contrato lido pelo toolService para montar o arsenal do Ash.
*/

// --- 0. IDENTIDADE (Sincronizada com AgentOrchestrator) ---
export const key = 'ash'; 

// --- 1. CORE TOOLS (Navegação, Informação e Gestão de Inbox) ---
import { 
  change_view, 
  search_knowledge, 
  manage_inbox
} from '../general/tools/coreTools.js';

// --- 2. PLANNING TOOLS (Agência de Construção e Tempo) ---
import { 
  manage_hierarchy, 
  log_time_session
} from '../general/tools/planningTools.js';

// --- 3. HOLISTIC TOOLS (A Conexão com o Prana) ---
import { 
  analyze_holistic_context, 
  set_sankalpa 
} from '../general/tools/holisticTools.js';

// --- 4. INTEGRATION TOOLS (Comunicação com o Mundo) ---
import { 
  manage_github,
  send_system_communication,
  manage_calendar,
  manage_personal_gmail,
  manage_integration_connection
} from '../general/tools/integrationTools.js';


/**
 * 🛠️ CORE & SYSTEM CAPABILITIES (O que o Ash É)
 * O Ash é o sistema operacional. O seu Core é composto 
 * pelas ferramentas fundamentais de interface e leitura.
 */
export const ashCoreTools = {
  change_view,
  search_knowledge,
  manage_inbox
};

/**
 * 🏛️ PLANNING & ORCHESTRATION (A sua Agência de Produtividade)
 * As ferramentas para organizar a vida do Herói.
 */
export const ashPlanningTools = {
  manage_hierarchy,
  log_time_session
};

/**
 * 🧘 HOLISTIC AWARENESS (A sua Empatia)
 * Acesso ao Santuário para entender o estado humano do utilizador.
 */
export const ashHolisticTools = {
  analyze_holistic_context,
  set_sankalpa
};

/**
 * 🔌 EXTERNAL INTEGRATIONS (Os Braços Longos)
 * Acesso a APIs externas para automatizar o ambiente.
 */
export const ashIntegrationTools = {
  manage_github,
  send_system_communication,
  manage_calendar,
  manage_personal_gmail,
  manage_integration_connection
};