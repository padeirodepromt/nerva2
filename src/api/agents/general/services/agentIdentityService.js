import { getAshPrompts } from '../../../../ai_services/ashPrompts.js';
import { flor } from '../../flor/flor.js';
import { neo } from '../../neo/neo.js';

// O "Kit de Cidadania Prana" que todos os agentes recebem
const BASE_PRANA_CAPABILITIES = ['CORE', 'PLANNING', 'INTEGRATIONS', 'HOLISTIC'];

const AGENT_REGISTRY = {
  ash: {
    agentKey: 'ash',
    name: 'Ash',
    role: 'Mestre Orquestrador',
    getDynamicIdentity: async (language = 'pt') => {
      const complexPrompts = await getAshPrompts(language);
      return { basePrompt: complexPrompts.system, capabilities: ['*'] }; // Ash = Deus do Sistema
    }
  },

  flor: {
    agentKey: 'flor',
    name: 'Flor',
    role: 'Narrative Alchemist',
    basePrompt: flor.prompt || 'Agente de narrativa e beleza.',
    // Flor ganha cidadania base + Ferramentas do Papyrus e Marca
    capabilities: [...BASE_PRANA_CAPABILITIES, 'NARRATIVE'] 
  },

  neo_dev: {
    agentKey: 'neo_dev',
    name: 'Neo',
    role: 'System Architect',
    basePrompt: neo.prompt || 'Agente técnico e pragmático.',
    // Neo ganha cidadania base + Ferramentas de Código e Auditoria
    capabilities: [...BASE_PRANA_CAPABILITIES, 'TECHNICAL']
  }
};

AGENT_REGISTRY['neo'] = AGENT_REGISTRY['neo_dev'];

export const AgentIdentityService = {
  async resolve(agentRef) {
    const key = (typeof agentRef === 'string' ? agentRef : agentRef?.agentKey || 'ash').toLowerCase().trim();
    const entry = AGENT_REGISTRY[key] || AGENT_REGISTRY['ash'];

    if (typeof entry.getDynamicIdentity === 'function') {
      const dynamicData = await entry.getDynamicIdentity();
      return { ...entry, ...dynamicData };
    }
    return entry;
  },

  getCapabilities(agentKey) {
    const agent = AGENT_REGISTRY[agentKey] || AGENT_REGISTRY['ash'];
    return agent.capabilities || BASE_PRANA_CAPABILITIES;
  }
};