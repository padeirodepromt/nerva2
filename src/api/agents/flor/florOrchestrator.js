/* src/api/agents/flor/florOrchestrator.js
   desc: Motor que une as 5 Camadas de Contexto antes da execução.
*/

import { BrandCodeAPI } from '../../../modules/brandcode/brandcode.api.js';
import { FLOR_TACTICAL_REGISTRY } from './florTacticalRegistry.js';
import { flor } from './flor.js'; // A identidade base da Flor

export const FlorOrchestrator = {
  /**
   * Constrói o contexto completo cruzando as 5 camadas
   */
  async buildSintonia(projectId, taskId, userConfig) {
    // 1. Layer 3: BrandCode (A Constituição)
    const brandCode = await BrandCodeAPI.getEffectiveBrandCode(projectId);
    
    // 2. Layer 2: Base de Conhecimento (Nexus/RAG) 
    // TODO: Integrar com RagService para buscar referências anexadas à tarefa
    const knowledgeBase = "Fatos Técnicos: [Simulação de RAG do Nexus]"; 

    // 3. Layer 5: Camada de Especialização (O Camaleão)
    const expertiseRule = FLOR_TACTICAL_REGISTRY.expertise[userConfig.expertise?.toLowerCase()] || "";
    const objectiveRule = FLOR_TACTICAL_REGISTRY.objectives[userConfig.objective?.toLowerCase()] || "";
    const geoRule = FLOR_TACTICAL_REGISTRY.geo_context[userConfig.geo?.toLowerCase()] || "";

    // 4. Montagem do Prompt de "Sintonia Fina"
    const identityBase = flor.modes.brandcode_foundation.buildPrompt(); // Pega a voz base

    return `
      ${identityBase}

      [LAYER 3: CONSTITUIÇÃO BRANDCODE]
      DNA Ativo: ${brandCode.summary}
      Promessa: ${brandCode.dna?.identity?.promise}

      [LAYER 2: REPERTÓRIO NEXUS]
      ${knowledgeBase}

      [LAYER 5: ESTADO CAMALEÓNICO]
      Assuma agora a pele de: ${userConfig.expertise || 'Generalista'}
      Diretriz técnica: ${expertiseRule}
      Objetivo estratégico: ${objectiveRule.framework}
      Contexto Cultural: ${geoRule}

      [INSTRUÇÃO DE MANIFESTAÇÃO]
      Não anuncie estas camadas. Apenas sintonize a sua voz nelas. 
      Responda com elegância wabi-sabi, preservando a humildade ativa da Flor.
    `;
  }
};