// src/data/demoScripts.js

export const DEMO_SCENARIOS = [
  {
    id: "energy",
    label: "Minha bateria tá no fim...",
    icon: "IconFogo", // Referência ao ícone do sistema
    description: "Planejamento Biológico",
    script: [
      {
        type: "message",
        text: "Tô vendo aqui. Sinceramente? Não força. O modelo antigo te mandaria continuar, mas a gente sabe que isso só gera retrabalho.",
        delay: 1000
      },
      {
        type: "message",
        text: "Dá uma olhada na sua semana. Tem essa reunião pesada na Terça que vai te quebrar se você não estiver 100%.",
        delay: 2000
      },
      {
        type: "action",
        target: "view",
        value: "WeeklyPlanner", // Muda a visualização para o Planner
        description: "Abrindo Planejamento Semanal..."
      },
      {
        type: "action",
        target: "highlight",
        selector: "[data-task-id='finance-meeting']", // Foca na tarefa problema
        description: "Identificando sobrecarga..."
      },
      {
        type: "message",
        text: "Vou jogar ela pra Quinta-feira. Seus dados mostram que seu foco costuma ser melhor lá. Bora priorizar seu descanso hoje?",
        delay: 1500
      },
      {
        type: "action",
        target: "moveTask",
        taskId: "finance-meeting",
        fromDay: "Tue",
        toDay: "Thu",
        description: "Realocando tarefa automaticamente..."
      },
      {
        type: "message",
        text: "Pronto. Agenda ajustada. Vai curtir seu descanso sem culpa.",
        delay: 1000
      }
    ]
  },
  {
    id: "chaos",
    label: "Tenho uma ideia gigante (e bagunçada)",
    icon: "IconSankalpa",
    description: "Do Caos à Estrutura",
    script: [
      {
        type: "message",
        text: "Adoro isso. O caos é só o começo da criação. Não precisa organizar nada agora, só me diz qual é a missão principal.",
        delay: 1000
      },
      {
        type: "action",
        target: "openModal",
        value: "SankalpaFormModal", // Abre o modal de Intenção
        description: "Abrindo Forja de Intenção..."
      },
      {
        type: "user_input",
        target: "sankalpaInput",
        value: "Lançar meu Podcast de Design", // Simula o usuário digitando
        description: "Digitando intenção..."
      },
      {
        type: "message",
        text: "Boa! Lançar um podcast envolve muita coisa. Deixa comigo, vou montar a estrutura base pra você não ter que começar do zero.",
        delay: 1500
      },
      {
        type: "action",
        target: "createHierarchy", // Ação visual de criar pastas
        data: {
          root: "Podcast Design",
          children: ["Roteiros (Criativo)", "Convidados (CRM)", "Edição (Foco)"]
        },
        description: "Gerando árvore de projeto..."
      },
      {
        type: "message",
        text: "Tá na mão. Separei o que é criativo do que é operacional pra não misturar as frequências. O terreno tá pronto, só plantar.",
        delay: 1000
      }
    ]
  },
  {
    id: "speed",
    label: "Quero anotar rápido (sem cliques)",
    icon: "IconZap",
    description: "Criação Inteligente",
    script: [
      {
        type: "message",
        text: "Não perde o flow procurando botão. Atalho é vida. Só abre o comando e digita, eu entendo o contexto.",
        delay: 1000
      },
      {
        type: "action",
        target: "openSmartModal", // Abre o Cmd+K
        description: "Ativando Smart Creation..."
      },
      {
        type: "user_input",
        target: "smartInput",
        value: "Revisar contrato amanhã #Financeiro @Foco", // Simulação de digitação real
        description: "Capturando pensamento..."
      },
      {
        type: "action",
        target: "parseSmartTags", // Efeito visual destacando as tags
        tags: ["#Financeiro", "@Foco", "amanhã"],
        description: "Processando linguagem natural..."
      },
      {
        type: "message",
        text: "Peguei. Já tá salvo no projeto Financeiro com data pra amanhã e tag de energia Alta. Pode voltar pro que tava fazendo.",
        delay: 1000
      },
      {
        type: "action",
        target: "notification",
        value: "Tarefa criada com sucesso",
        description: "Confirmação sutil."
      }
    ]
  },
  {
    id: "review",
    label: "Tô avançando ou só ocupado?",
    icon: "IconChart",
    description: "Visão & Consistência",
    script: [
      {
        type: "message",
        text: "Essa é a pergunta de um milhão. 'Estar ocupado' é a maior armadilha que existe. Vamos olhar seus Rituais.",
        delay: 1000
      },
      {
        type: "action",
        target: "view",
        value: "ChainView", // Vai para a visualização de hábitos
        description: "Analisando consistência..."
      },
      {
        type: "action",
        target: "highlight",
        selector: ".chain-streak", // Destaca a corrente de dias
        description: "Destacando progresso..."
      },
      {
        type: "message",
        text: "Olha isso. Você manteve o 'Deep Work' por 4 dias seguidos. A consistência vale muito mais que um dia heróico. Você tá construindo, sim.",
        delay: 2000
      },
      {
        type: "action",
        target: "view",
        value: "Dashboard", // Vai para o Dashboard geral
        description: "Abrindo visão macro..."
      },
      {
        type: "message",
        text: "Seu gráfico tá subindo sólido. Continua nesse ritmo que o resultado vem.",
        delay: 1000
      }
    ]
  }
];