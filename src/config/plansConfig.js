/* src/config/plansConfig.js
   desc: Configuração Mestra dos Planos v23.0 (Beta Launch).
   logic: Binary Strategy (Beta Public vs. Admin Lab).
   updates: Planos Legacy preservados (comentados). Plano BETA introduzido.
*/

import { selectBestModel } from '../ai_services/models.js';

// 1. DEFINIÇÃO DE CHAVES
export const PLANS = {
  BETA: 'BETA',   // O único plano público ativo agora
  ADMIN: 'ADMIN', // O laboratório (Você)
  
  // --- LEGACY (Mantidos aqui para referência de chaves) ---
  // SEED: 'SEED',
  // FLUX: 'FLUX',
  // FOREST: 'FOREST',
  // ECOSSISTEM: 'ECOSSISTEM',
};

// ============================================================================
// FEATURES GLOBAIS (O Menu de Capacidades)
// ============================================================================
export const ALL_FEATURES = {
  // --- Acesso & Views ---
  mobile: { id: 'mobile', name: 'App Nativo (iOS/Android)' },
  view_sheet: { id: 'view_sheet', name: 'Sheet (Planilha Inteligente)' },
  view_nexus: { id: 'view_nexus', name: 'Nexus (Visão Neural)' },
  view_mindmap: { id: 'view_mindmap', name: 'MindMap (Brainstorm)' },

  // --- Ferramentas ---
  task_code: { id: 'task_code', name: 'TaskCode (Ambiente Dev)' },
  templates_pro: { id: 'templates_pro', name: 'Workflows Avançados' },
  integrations: { id: 'integrations', name: 'Integrações (Github/Notion)' },

  // --- Inteligência & Consciência (Ash) ---
  proactive_time: { id: 'proactive_time', name: 'Notificações de Tempo/Atraso' },
  proactive_flow: { id: 'proactive_flow', name: 'Análise de Estagnação (Fluxo)' },
  proactive_energy: { id: 'proactive_energy', name: 'Proteção de Energia Vital' },

  // --- Especial ---
  energy_match: { id: 'energy_match', name: 'Match Energia-Tarefa' },
  astrology: { id: 'astrology', name: 'Mapa Astral (Ash)' },
  olly_agent: { id: 'olly_agent', name: 'Olly (Agente Mkt)' },
  pack_neo_pro: { id: 'PACK_NEO_PRO', name: 'Neo Pro (Dev Elite & Telemetria)' }, // 🚀 [NOVO] Adicionado
  context_separation: { id: 'context_separation', name: 'Separação Pessoal/Pro' },
  teams: { id: 'teams', name: 'Colaboração de Equipes' }
};

// ============================================================================
// DETALHES DOS PLANOS ATIVOS
// ============================================================================
export const PLAN_DETAILS = {
  
  // ========================================================================
  // 1. O PLANO PÚBLICO (BETA FOUNDER)
  // ========================================================================
  [PLANS.BETA]: {
    key: PLANS.BETA,
    name: 'Prana Founder Beta',
    subtitle: 'A Sincronização',
    description: 'Sincronize sua energia com seus projetos. O sistema operacional para uma vida intencional.',
    motivation: 'Clareza',
    promise: 'O fim da ansiedade produtiva. Você e o Ash trabalhando juntos.',
    bestFor: 'Founders, Criadores, Líderes Conscientes',
    tradeoff: 'Funcionalidades de equipe ainda em laboratório.',
    
    identity: { arcana: 'THE_STAR', color: 'slate', texture: 'grain-2' }, 
    price: { monthly: 0, yearly: 0 }, // Gratuito para Beta
    cta: 'Solicitar Acesso',
    recommended: true,

    ai_access: {
      tier: 'SMART', 
      router_priority: { google: true, openai: true },
      context_window: 16000,
      allow_tools: true,
      model_display: 'Ash (Beta)'
    },

    limits: {
      projects: 50,
      storage_mb: 5000, // 5GB
      monthly_messages: 1000,
      active_agents: 1, // Apenas o Ash Core
      memory_depth: 20
    },

    // RESTRIÇÕES ESTRATÉGICAS DO BETA
    restrictions: {
      // Bloqueados (Features Alpha/Complexas)
      teams: false,
      olly_agent: false,
      task_code: false, 
      PACK_NEO_PRO: false, // 🚀 [NOVO] Bloqueado para usuários do Beta público (eles não são Devs)
      
      // Liberados (O "Uau" Factor)
      context_separation: true, // Multiverso Habilitado no Beta!
      view_nexus: true,
      view_mindmap: true,
      view_sheet: true,
      mobile: true,
      
      // Inteligência Proativa (O Diferencial do Prana)
      proactive_time: true,
      proactive_flow: true,
      proactive_energy: true, 

      // Conteúdo
      templates_pro: true,
      integrations: true // Apenas Google Calendar e integrações leves
    },

    features: [
      { text: 'Gestão de Projetos & Energia', included: true },
      { text: 'Ash AI (Coach Pessoal)', included: true },
      { text: 'Monitor de Bio-Ritmo', included: true },
      { text: 'Diários & Rituais', included: true },
      { text: 'Views: Lista, Kanban, Nexus, MindMap', included: true },
      { text: 'Ferramentas de Equipe', included: false },
      { text: 'Agentes Especializados', included: false }
    ]
  },

  // ========================================================================
  // 2. O LABORATÓRIO (ADMIN)
  // ========================================================================
  [PLANS.ADMIN]: {
    key: PLANS.ADMIN,
    name: 'System Architect',
    subtitle: 'God Mode',
    description: 'Acesso irrestrito ao núcleo do sistema.',
    motivation: 'Onisciência',
    bestFor: 'Debug & Building',
    identity: { arcana: 'THE_WORLD', color: 'zinc', texture: 'grain-4' },
    price: { monthly: 0, yearly: 0 },
    cta: 'Painel',
    
    ai_access: { 
        tier: 'SMART_PLUS', 
        model_display: 'Ash (Admin)',
        allow_tools: true,
        context_window: 128000
    },
    
    limits: { 
        projects: Infinity, 
        storage_mb: Infinity, 
        monthly_messages: Infinity 
    },
    
    restrictions: {}, // Nada bloqueado, acesso total
    
    features: [
        { text: 'Tudo Liberado', included: true },
        { text: 'Debug Mode', included: true }
    ]
  }

  /* // ========================================================================
  // PLANOS LEGACY (PRESERVADOS PARA FUTURO)
  // ========================================================================

  // 1. SEMENTE (O Silêncio)
  [PLANS.SEED]: {
    key: 'SEED',
    name: 'Semente',
    subtitle: 'O Início',
    description: 'Experimente a fluidez do Prana. Organização essencial.',
    motivation: 'Descoberta',
    promise: 'O primeiro espaço onde sua vida para de vazar.',
    bestFor: 'Início, organização pessoal, curiosidade',
    tradeoff: 'Tudo depende de você. O sistema apenas observa.',
    identity: { arcana: 'THE_SEED', color: 'slate', texture: 'grain-1' },
    price: { monthly: 0, yearly: 0 },
    cta: 'Começar Agora',
    recommended: false,

    ai_access: {
      tier: 'FAST',
      router_priority: { google: false, openai: true },
      context_window: 4000,
      allow_tools: false,
      model_display: 'Ash (Basic)'
    },

    limits: {
      projects: 3,
      storage_mb: 500,
      monthly_messages: 50,
      active_agents: 1,
      memory_depth: 5
    },

    restrictions: {
      mobile: false,
      view_sheet: false,
      view_nexus: false,
      view_mindmap: false,
      task_code: false,
      templates_pro: false,
      integrations: false,
      proactive_time: false,
      proactive_flow: false,
      proactive_energy: false,
      energy_match: false,
      astrology: false,
      olly_agent: false,
      context_separation: false,
      teams: false
    },

    features: [
      { text: '3 Projetos no Jardim', included: true },
      { text: 'Chat Reativo (Você pergunta)', included: true },
      { text: 'Sem Notificações do Ash', included: false }, 
      { text: '50 Mensagens /mês', included: true }
    ]
  },

  // 2. NASCENTE (A Rotina)
  [PLANS.FLUX]: {
    key: 'FLUX',
    name: 'Nascente',
    subtitle: 'O Fluxo',
    description: 'Mais espaço, App Mobile e gestão de tempo ativa.',
    motivation: 'Constância',
    promise: 'Quando a organização começa a fluir sozinha.',
    bestFor: 'Rotina ativa, múltiplos projetos',
    tradeoff: 'Sem automações profundas nem visão estrutural.',
    identity: { arcana: 'THE_RIVER', color: 'blue', texture: 'grain-2' },
    price: { monthly: 29, yearly: 290 },
    cta: 'Entrar no Fluxo',
    recommended: false,

    ai_access: {
      tier: 'FAST',
      router_priority: { google: true, openai: true },
      context_window: 16000,
      allow_tools: true,
      model_display: 'Ash (Flash)'
    },

    limits: {
      projects: 15,
      storage_mb: 10000,
      monthly_messages: 2000,
      active_agents: 1,
      memory_depth: 20
    },

    restrictions: {
      view_nexus: false,
      view_mindmap: false,
      task_code: false,
      integrations: false,
      proactive_flow: false,
      proactive_energy: false,
      astrology: false,
      olly_agent: false,
      context_separation: false,
      teams: false
    },

    features: [
      { text: '15 Projetos Ativos', included: true },
      { text: 'App Mobile Nativo', included: true },
      { text: 'Ash Monitora Prazos (Notificação)', included: true },
      { text: 'Sheet (Planilhas) & Rituais', included: true },
      { text: '2.000 Mensagens/mês', included: true }
    ]
  },

  // 3. FLORESTA (O Sistema)
  [PLANS.FOREST]: {
    key: 'FOREST',
    name: 'Floresta',
    subtitle: 'A Expansão',
    description: 'Para Criadores e Devs. Visão sistêmica e integrações.',
    motivation: 'Construção (Dev)',
    promise: 'Pare de gerenciar. Comece a construir.',
    bestFor: 'Criadores, desenvolvedores, sistemas vivos',
    tradeoff: 'Exige maturidade. O sistema amplifica intenção.',
    identity: { arcana: 'THE_FOREST', color: 'emerald', texture: 'grain-3' },
    price: { monthly: 49, yearly: 470 },
    cta: 'Modo Desenvolvedor',
    recommended: true,

    ai_access: {
      tier: 'SMART',
      router_priority: { google: true, openai: true },
      context_window: 128000,
      allow_tools: true,
      model_display: 'Ash (Pro/GPT-5)'
    },

    limits: {
      projects: Infinity,
      storage_mb: 100000,
      monthly_messages: 10000,
      active_agents: Infinity,
      memory_depth: 50
    },

    restrictions: {
      proactive_energy: false,
      teams: false,
      olly_agent: false
    },

    features: [
      { text: 'Ash Smart (Raciocínio & Code)', included: true },
      { text: 'Projetos Ilimitados', included: true },
      { text: 'Ash Monitora Estagnação (Fluxo)', included: true },
      { text: 'Integração Github & Google', included: true },
      { text: 'TaskCode (Ambiente Dev)', included: true },
      { text: 'Todas as Views (ChainView/MindMap)', included: true }
    ]
  },

  // 4. ECOSSISTEMA (A Vida)
  [PLANS.ECOSSISTEM]: {
    key: 'ECOSSISTEM',
    name: 'Ecossistema',
    subtitle: 'O Legado',
    description: 'Para Negócios e Vida. Acesso a tudo, gestão bio-energética.',
    motivation: 'Soberania',
    isOneTime: true,
    promise: 'O sistema passa a trabalhar (e cuidar) de você.',
    bestFor: 'Líderes, arquitetos de longo prazo',
    tradeoff: 'Sustentação total.',
    identity: { arcana: 'THE_ECOSSISTEM', color: 'violet', texture: 'grain-4' },
    price: { monthly: 0, yearly: 997 },
    cta: 'Escalar',
    recommended: false,

    ai_access: {
      tier: 'SMART_PLUS',
      router_priority: { google: true, openai: true },
      context_window: 1000000,
      allow_tools: true,
      model_display: 'Ash (Sovereign)'
    },

    limits: {
      projects: Infinity,
      storage_mb: 1000000,
      monthly_messages: Infinity,
      active_agents: Infinity,
      memory_depth: 100
    },

    restrictions: {
      // Sem restrições. Ash proativo em TUDO (Tempo, Fluxo, Energia).
    },

    features: [
      { text: 'Tudo do Plano Floresta', included: true },
      { text: 'Ash Protege sua Energia', included: true }, 
      { text: 'Olly (Agente Marketing Beta)', included: true },
      { text: 'HUB de Equipes', included: true }
    ]
  }
  */
};

// ============================================================================
// HELPERS
// ============================================================================
export function getAllPlans() {
  // Retorna apenas os planos ativos para não mostrar os comentados na UI de seleção
  return [PLAN_DETAILS[PLANS.BETA], PLAN_DETAILS[PLANS.ADMIN]];
}

export function getPlanConfig(key) {
  return PLAN_DETAILS[key] || PLAN_DETAILS.BETA;
}

export function canUserAccess(planKey, featureKey) {
  if (planKey === PLANS.ADMIN) return true;

  const plan = getPlanConfig(planKey);
  
  if (plan.restrictions && plan.restrictions[featureKey] === false) {
    return false;
  }
  return true;
}

export function determineModelForUser(planKey, complexity) {
  const plan = getPlanConfig(planKey);
  return selectBestModel(
    plan.ai_access.tier,
    complexity,
    plan.ai_access.router_priority
  );
}

export const getAllPlansList = getAllPlans;

export function getAvailableFeatures(planKey) {
  return getPlanConfig(planKey).features;
}

export function getPlanLimit(planKey, limit) {
  return getPlanConfig(planKey).limits?.[limit] || 0;
}