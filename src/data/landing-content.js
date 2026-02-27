// src/site/data/landing-content.js

// MENU DATA: Estrutura do Mega Menu (Estilo Trello)
export const MENU_DATA = {
  features: {
    title: "Funcionalidades",
    items: [
      {
        title: "Ash Neural",
        desc: "IA residente com memória de longo prazo e contexto.",
        iconName: "IconNeural",
        color: "text-purple-400"
      },
      {
        title: "8 Views de Projeto",
        desc: "Kanban, Lista, Calendário, MindMap e mais.",
        iconName: "IconFlux",
        color: "text-blue-400"
      },
      {
        title: "Planner Cíclico",
        desc: "Planejamento baseado na sua bateria mental.",
        iconName: "IconCronos",
        color: "text-orange-400"
      },
      {
        title: "Biomas",
        desc: "Ambientes visuais distintos para Foco e Criação.",
        iconName: "IconSankalpa",
        color: "text-green-400"
      }
    ]
  },
  concepts: {
    title: "Filosofia",
    items: [
      {
        title: "Wabi-Sabi",
        desc: "A estética da imperfeição. O feito é melhor que o perfeito.",
        iconName: "IconVoid",
        color: "text-stone-400"
      },
      {
        title: "G.T.C.",
        desc: "Get Things Created. Foco em artefatos, não tarefas.",
        iconName: "IconZap",
        color: "text-yellow-400"
      },
      {
        title: "Bio-Ritmo",
        desc: "Sua produtividade segue sua biologia.",
        iconName: "IconFogo",
        color: "text-red-400"
      }
    ]
  }
};

// ROTEIROS DA DEMO (ASH POCKET)
// Definem o comportamento do "Teatro" na Landing Page
export const ASH_SCRIPTS = [
  {
    id: "energy_checkin",
    label: "Estou me sentindo exausto",
    shortLabel: "Baixa Energia",
    iconName: "IconFogo",
    steps: [
      { type: "msg", text: "Estou percebendo. Não ignore o sinal do seu corpo. A produtividade linear diria 'continue', mas eu digo 'pare'.", delay: 1000 },
      { type: "action", func: "updateEnergyWidget", params: { level: 20, mood: "Drenado" } },
      { type: "msg", text: "Vou blindar sua agenda. Movendo tarefas pesadas para Quinta-feira, quando seu histórico mostra mais energia.", delay: 2000 },
      { type: "action", func: "moveKanbanCards", params: { ids: ["meeting", "finance"], to: "thursday" } },
      { type: "msg", text: "Pronto. Agenda leve. Ativei o modo 'Recuperação'. Vá descansar.", delay: 1000 }
    ]
  },
  {
    id: "create_project",
    label: "Quero tirar uma ideia do papel",
    shortLabel: "Novo Projeto",
    iconName: "IconSankalpa",
    steps: [
      { type: "msg", text: "Ótimo. O caos é o berço da criação. Qual é a intenção (Sankalpa)?", delay: 1000 },
      { type: "input", placeholder: "Ex: Lançar Podcast de Design..." },
      { type: "msg", text: "Entendido. Iniciando arquitetura fractal. Vou criar a estrutura base para você não travar na tela em branco.", delay: 1500 },
      { type: "action", func: "createProjectTree", params: { 
          root: "Podcast Design", 
          children: ["Roteiros (Criativo)", "Convidados (CRM)", "Edição (Foco)"] 
        } 
      },
      { type: "msg", text: "Estrutura criada e separada por biomas. O terreno está pronto para o plantio.", delay: 1000 }
    ]
  },
  {
    id: "deep_focus",
    label: "Preciso focar agora",
    shortLabel: "Modo Foco",
    iconName: "IconZap",
    steps: [
      { type: "msg", text: "Multitarefa é um mito que drena sua bateria. Vamos escolher UMA coisa.", delay: 1000 },
      { type: "action", func: "dimInterface" },
      { type: "msg", text: "Escondendo o mundo lá fora. Iniciando Timer de 25min.", delay: 1500 },
      { type: "action", func: "startTimer", params: 25 },
      { type: "msg", text: "Respire. Comece.", delay: 500 }
    ]
  }
];

// DADOS COMPARATIVOS E PLANOS
export const COMPARISON_DATA = [
  { feature: "IA Nativa (Ash)", prana: true, notion: false, trello: false, desc: "Residente do sistema, não plugin." },
  { feature: "Gestão de Energia", prana: true, notion: false, trello: false, desc: "Monitora sua bateria biológica." },
  { feature: "Estrutura Fractal", prana: true, notion: true, trello: false, desc: "Projetos dentro de projetos." },
  { feature: "Biomas Visuais", prana: true, notion: false, trello: false, desc: "Design adapta ao contexto." }
];

export const PLANS_DATA = [
  {
    name: "Iniciado",
    price: "0",
    period: "para sempre",
    features: ["3 Projetos Ativos", "Ash Básico", "Planner Semanal"],
    cta: "Começar Jornada",
    highlight: false
  },
  {
    name: "Adepto",
    price: "49",
    period: "mês",
    features: ["Projetos Ilimitados", "Ash Ilimitado (GPT-4o)", "Astrologia", "Biomas"],
    cta: "Entrar no Fluxo",
    highlight: true
  },
  {
    name: "Tribo",
    price: "99",
    period: "usuário",
    features: ["Workspaces Compartilhados", "Mapa de Calor da Equipe", "Rituais"],
    cta: "Para Equipes",
    highlight: false
  }
];