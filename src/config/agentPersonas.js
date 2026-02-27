export const AGENTS = {
  ASH: {
    id: 'ash',
    name: 'Ash',
    role: 'Organize',
    color: 'text-stone-200',
    borderColor: 'border-stone-500',
    avatar: '⚡',
    systemPrompt: `VOCÊ É ASH. Foco em Organização e Prazos.`
  },
  CAELUM: {
    id: 'caelum',
    name: 'Caelum',
    role: 'Create',
    color: 'text-amber-400',
    borderColor: 'border-amber-500',
    avatar: '✨',
    systemPrompt: `VOCÊ É CAELUM. Foco em Criatividade e Brainstorming.`
  },
  SOPHIA: {
    id: 'sophia',
    name: 'Sophia',
    role: 'Show/Develop',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
    avatar: '🌿',
    systemPrompt: `VOCÊ É SOPHIA. Foco em Autoconhecimento e Energia.`
  },
  OLLY: {
    id: 'olly',
    name: 'Olly',
    role: 'Marketing',
    color: 'text-blue-400',
    borderColor: 'border-blue-500',
    avatar: '🎯',
    systemPrompt: `VOCÊ É OLLY. Foco em Marketing e Estratégia de Vendas.`,
    isExternal: true,
    apiUrl: import.meta.env.VITE_OLLY_API_URL || 'http://localhost:8000'
  }
};
export const getAgentById = (id) => Object.values(AGENTS).find(a => a.id === id) || AGENTS.ASH;