/* src/api/agents/packages/globalPacksAdapter.js
   desc: Ponte Única de Verdade para Pacotes Globais (Sistemas/Upgrades).
   role: Agrupa as ferramentas de elite isoladas do repositório em Packs 
         que o toolService.js pode injetar dinamicamente.
*/

// --- 1. IMPORTAÇÃO DAS FERRAMENTAS REAIS DO REPOSITÓRIO ---

// 🔮 ORACLE PACK
import * as inputTranslator from './oracle/inputTranslator.js';

// 🧠 NEURAL PACK (NTP / Spark Thought)
import * as socraticLoop from './neural/socraticLoop.js';
// Assumindo que o neuralThought seja um módulo na mesma pasta ou 
// uma ferramenta exportada, garantimos a importação:
import * as neuralThought from './neural/neuralThought.js'; 

/**
 * --- 2. REGISTO DOS PACOTES GLOBAIS ---
 * O toolService lê este objeto. Se o utilizador tiver a permissão (ex: PACK_NTP),
 * todas as ferramentas desestruturadas abaixo são injetadas na IA.
 */
export const GLOBAL_PACKS = {
  
  // Pacote de Tradução e Lógica de Input
  PACK_ORACLE: {
    ...inputTranslator
  },

  // Pacote de Raciocínio Profundo e Expansão Socrática
  PACK_NTP: {
    ...socraticLoop,
    ...neuralThought
  }
  
  // Futuros pacotes (ex: SEO, Analytics) serão mapeados aqui.
};