/* src/config/featuresList.js
   desc: Lista centralizada e inteligente de features do Prana.
   feat: Agrupamento por nível de inteligência e categoria.
*/

const FEATURE_LEVELS = {
  BASIC: 'Básico',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Superior',
  EXTRA: 'Extra',
  VIEW: 'View',
  DASHBOARD: 'Dashboard',
  BIOMODULATOR: 'Biomodulador',
  TEAM: 'Team',
  APP: 'App',
};

// Cada feature tem: id, nome, descrição, nível, categoria, dependências (opcional)
export const featuresList = [
  // Views específicas
  {
    id: 'kaban-view',
    name: 'Kaban View',
    description: 'Visualização Kanban para tarefas e projetos.',
    level: FEATURE_LEVELS.VIEW,
    category: FEATURE_LEVELS.DASHBOARD,
    dependsOn: ['tasks'],
  },
  {
    id: 'mindmap-view',
    name: 'MindMap View',
    description: 'Visualização de mapa mental para projetos.',
    level: FEATURE_LEVELS.VIEW,
    category: FEATURE_LEVELS.DASHBOARD,
    dependsOn: ['tasks'],
  },
  
  // Nível Básico
  {
    id: 'tasks',
    name: 'Tarefas e Projetos',
    description: 'Criar e gerenciar tarefas e projetos manualmente.',
    level: FEATURE_LEVELS.BASIC,
    category: 'core',
  },
  {
    id: 'teams-basic',
    name: 'Teams Básico',
    description: 'Delegação simples de tarefas para membros.',
    level: FEATURE_LEVELS.BASIC,
    category: FEATURE_LEVELS.TEAM,
  },
  
  // Nível Intermediário
  {
    id: 'ai-tasks',
    name: 'Projetos com IA',
    description: 'Criar e gerenciar projetos com auxílio de IA (Ash).',
    level: FEATURE_LEVELS.INTERMEDIATE,
    category: 'core',
    dependsOn: ['tasks'],
  },
  {
    id: 'chat',
    name: 'Chat IA',
    description: 'Chat inteligente com Ash e modos avançados.',
    level: FEATURE_LEVELS.INTERMEDIATE,
    category: 'core',
  },
  {
    id: 'file-upload',
    name: 'Upload de Arquivos',
    description: 'Anexar arquivos ao chat e tarefas.',
    level: FEATURE_LEVELS.INTERMEDIATE,
    category: 'core',
  },
  
  // Nível Superior
  {
    id: 'energy-management',
    name: 'Gestão de Energia',
    description: 'Gerenciamento de energia, mood, biomas e insights holísticos.',
    level: FEATURE_LEVELS.ADVANCED,
    category: 'holistic',
    dependsOn: ['ai-tasks'],
  },
  {
    id: 'biomes',
    name: 'Biomoduladores',
    description: 'Acesso aos biomas e biomoduladores.',
    level: FEATURE_LEVELS.ADVANCED,
    category: FEATURE_LEVELS.BIOMODULATOR,
  },
  
  // 🧩 Extras e Agentes (A Magia Lego V10)
  {
    id: 'olly_agent', 
    name: 'Olly (Agente de Marketing)',
    description: 'Acesso ao agente Olly para marketing e anúncios.',
    level: FEATURE_LEVELS.EXTRA,
    category: 'agent',
  },
  {
    id: 'PACK_NEO_PRO', // 🚀 [NOVO] O Pacote Unificado do Neo
    name: 'Neo Pro (Dev Elite)',
    description: 'Desbloqueia ferramentas de engenharia profunda (Grep, Raio-X, Code Diff) e garante integridade Zero-Preguiça com telemetria via Hard-Code Pack.',
    level: FEATURE_LEVELS.EXTRA, // Pode ser ADVANCED ou EXTRA, dependendo do seu modelo de negócio
    category: 'agent',
  },
  {
    id: 'credits',
    name: 'Créditos de IA',
    description: 'Quantidade de créditos para uso dos agentes e IA.',
    level: FEATURE_LEVELS.EXTRA,
    category: 'core',
  },
  
  // Views e Dashboard
  {
    id: 'dashboard',
    name: 'Dashboard Principal',
    description: 'Acesso ao dashboard principal com widgets.',
    level: FEATURE_LEVELS.VIEW,
    category: FEATURE_LEVELS.DASHBOARD,
  },
  {
    id: 'planner-view',
    name: 'Planner View',
    description: 'Visualização de planejamento.',
    level: FEATURE_LEVELS.VIEW,
    category: FEATURE_LEVELS.DASHBOARD,
  },
  {
    id: 'diary-dashboard',
    name: 'Diary Dashboard',
    description: 'Dashboard de diários e insights.',
    level: FEATURE_LEVELS.VIEW,
    category: FEATURE_LEVELS.DASHBOARD,
  },
  
  // App e Mobile
  {
    id: 'app',
    name: 'App Prana',
    description: 'Acesso ao app Prana (web/mobile).',
    level: FEATURE_LEVELS.APP,
    category: FEATURE_LEVELS.APP,
  },
  {
    id: 'mobile',
    name: 'Versão Mobile',
    description: 'Acesso à versão mobile do Prana.',
    level: FEATURE_LEVELS.APP,
    category: FEATURE_LEVELS.APP,
  },
  
  // TeamsHub (em desenvolvimento)
  {
    id: 'teamshub',
    name: 'TeamsHub',
    description: 'Zona de integração do time + dashboard avançado.',
    level: FEATURE_LEVELS.TEAM,
    category: FEATURE_LEVELS.TEAM,
    status: 'em desenvolvimento',
  },
];

export const FEATURE_LEVELS_ENUM = FEATURE_LEVELS;