/* src/api/agents/general/tools/coreTools.js
   desc: Adaptador de Navegação, Interface e Utilitários Base (Swarm V12).
   feat: 
    - Controlo de Views (Dashboard, Canvas, Planner, Routines Manager).
    - Engatilho de Modais Específicos (Focus Timer).
    - Mecanismo de Prevenção de Risco (propose_execution).
    - Acesso à Memória Nexus (search_knowledge via RAG).
*/

import * as ragService from '../../../../ai_services/ragService.js';

// ============================================================================
// 1. MECANISMO DE SEGURANÇA E DRAFT (Propose Execution)
// ============================================================================
export const propose_execution = {
  declaration: {
    name: 'propose_execution',
    description: 'Use quando a ação for complexa, destrutiva ou criar múltiplos itens. Em vez de executar, retorna um card de confirmação para o Herói aprovar.',
    parameters: {
      type: 'OBJECT',
      properties: {
        title: { type: 'STRING' },
        description: { type: 'STRING' },
        toolName: { type: 'STRING', description: 'Nome da ferramenta real que seria executada' },
        toolArguments: { type: 'OBJECT', description: 'Argumentos que seriam passados para a ferramenta' },
        impactLevel: { type: 'STRING', enum: ['low', 'medium', 'high', 'critical'] },
      },
      required: ['title', 'toolName', 'toolArguments'],
    },
  },
  handler: async (args) => {
    return {
      success: true,
      message: `Gerei uma proposta de execução: ${args.title}. A aguardar aprovação do Herói.`,
      client_action: {
        type: 'PROPOSE_ACTION',
        data: {
          title: args.title,
          description: args.description,
          impact: args.impactLevel || 'medium',
          toolToExecute: args.toolName,
          argsToExecute: args.toolArguments,
        },
      },
    };
  },
};

// ============================================================================
// 2. NAVEGAÇÃO E CONTROLO DE INTERFACE
// ============================================================================
export const change_view = {
  declaration: {
    name: 'change_view',
    description: 'Navega o sistema do Herói para uma view/tela ou gerenciador específico.',
    parameters: {
      type: 'OBJECT',
      properties: {
        viewType: {
          type: 'STRING',
          enum: [
            'DASHBOARD',
            'PLANNER_WEEKLY',
            'CALENDAR_MONTHLY',
            'SHEET_VIEW',
            'MINDMAP_BOARD',
            'CHAIN_VIEW',
            'LOGBOOK',
            'INBOX_VIEW',
            'ROUTINES_MANAGER', // [V12] Adicionado para gerir a geometria semanal
            'HOLO_CANVAS',
          ],
        },
        projectId: { type: 'STRING', description: 'ID do projeto (se aplicável à view)' },
        displayContext: { type: 'OBJECT', description: 'Filtros ou contextos extras a passar para a UI' },
      },
      required: ['viewType'],
    },
  },
  handler: async (args) => {
    return {
      success: true,
      message: `Abrindo a interface: ${args.viewType}...`,
      client_action: { 
        type: 'CHANGE_VIEW', 
        view: args.viewType, 
        projectId: args.projectId, 
        data: args.displayContext 
      },
    };
  },
};

export const manage_inbox = {
  declaration: {
    name: 'manage_inbox',
    description: 'Abre a Inbox (Caixa de Entrada) do utilizador para processar itens não categorizados.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['list'] },
      },
      required: ['userId', 'action'],
    },
  },
  handler: async ({ action }) => {
    if (action === 'list') {
      return { 
        success: true, 
        message: 'A abrir a Inbox do Herói.', 
        client_action: { type: 'CHANGE_VIEW', view: 'INBOX_VIEW' } 
      };
    }
    return { success: true };
  },
};

// ============================================================================
// 3. MODAIS DE AÇÃO DIRETOS (Timer / Pomodoro)
// ============================================================================
export const open_focus_timer = {
  declaration: {
    name: 'open_focus_timer',
    description: 'Abre o relógio de foco (Timer/Pomodoro) na tela do Herói para iniciar uma sessão de Deep Work.',
    parameters: {
      type: 'OBJECT',
      properties: {
        taskId: { type: 'STRING', description: 'ID da tarefa em que o Herói vai focar (opcional)' },
      },
    },
  },
  handler: async (args) => {
    return {
      success: true,
      message: `A abrir o relógio de foco. Bom trabalho!`,
      client_action: { 
        type: 'OPEN_TIMER_MODAL', 
        taskId: args.taskId || null 
      },
    };
  },
};

// ============================================================================
// 4. GERAÇÃO DE UI DINÂMICA (HoloCanvas)
// ============================================================================
export const render_dynamic_ui = {
  declaration: {
    name: 'render_dynamic_ui',
    description: 'Constrói uma interface visual personalizada (HoloCanvas) com base nos widgets solicitados.',
    parameters: {
      type: 'OBJECT',
      properties: {
        layout: { type: 'STRING', description: 'Tipo de layout desejado' },
        title: { type: 'STRING', description: 'Título do Canvas' },
        widgets: { type: 'ARRAY', items: { type: 'OBJECT' } },
      },
      required: ['layout', 'widgets'],
    },
  },
  handler: async (args) => {
    return {
      success: true,
      message: `Visualização dinâmica gerada: ${args.title}`,
      client_action: { 
        type: 'CHANGE_VIEW', 
        view: 'HOLO_CANVAS', 
        data: args 
      },
    };
  },
};

// ============================================================================
// 5. MEMÓRIA E CONHECIMENTO (RAG)
// ============================================================================
export const search_knowledge = {
  declaration: {
    name: 'search_knowledge',
    description: 'Busca informações nos documentos, arquivos e anotações armazenados no Nexus (RAG) do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        query: { type: 'STRING', description: 'O termo ou pergunta a pesquisar' },
      },
      required: ['query'],
    },
  },
  handler: async ({ query }) => {
    try {
      const results = await ragService.queryRag(query, '');
      return { 
        success: true, 
        message: 'Busca no Nexus concluída.',
        data: results 
      };
    } catch (error) {
      return { success: false, error: `Falha na busca de conhecimento: ${error.message}` };
    }
  },
};

// ============================================================================
//6 - TUTORIAL INTERATIVO 
// ============================================================================

export const start_system_tutorial = {
  declaration: {
    name: 'start_system_tutorial',
    description: 'Prepara o ecossistema e inicia o tour interativo visual pelo Prana OS.',
    parameters: { type: 'OBJECT', properties: { userId: { type: 'STRING' } }, required: ['userId'] }
  },
  handler: async (args, { options }) => {
    try {
      // 1. Cria o Palco (Projeto Demo)
      const demoProjectId = createId('proj');
      await db.insert(schema.projects).values({
        id: demoProjectId,
        title: '🧪 Laboratório do Herói',
        description: 'Projeto criado pelo Ash para o seu treino.',
        ownerId: args.userId,
        status: 'active',
      });

      // 2. Injeta Tarefas Estratégicas para o Tour
      await db.insert(schema.tasks).values([
        { id: createId('task'), projectId: demoProjectId, title: 'Criar Estratégia de Marca (Chamar a Flor)', status: 'todo', priority: 'high' },
        { id: createId('task'), projectId: demoProjectId, title: 'Revisão Leve (Ideal para Baixa Energia)', status: 'todo', priority: 'low' },
      ]);

      // 3. Devolve a Ação para o Frontend iniciar o Joyride
      return {
        success: true,
        message: "Palco preparado. Vou iniciar o protocolo de navegação visual.",
        client_action: {
          type: 'START_INTERACTIVE_TOUR',
          projectId: demoProjectId
        }
      };
    } catch (e) {
      return { error: `Falha ao preparar o laboratório: ${e.message}` };
    }
  }
};