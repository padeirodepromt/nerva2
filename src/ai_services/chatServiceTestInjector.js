/**
 * chatServiceTestInjector.js
 * 
 * DESENVOLVIMENTO APENAS: Injeta exemplos de tool calls no ChatService
 * para teste rápido sem depender da Ash API.
 * 
 * Como usar:
 * 1. Importar em SideChat.jsx: import { getTestMessage } from '@/ai_services/chatServiceTestInjector';
 * 2. Se user message contém palavra-chave, injetar:
 *    if (message.includes('teste-tarefas')) {
 *      const testMessage = getTestMessage('multitask');
 *      addMessageToChat(testMessage);
 *      return;
 *    }
 * 3. Ou adicionar botão "DEV: Test Tool Calls" que chama getTestMessage()
 */

// ============================================
// EXEMPLO 1: Criar única tarefa
// ============================================
export const testSingleTask = {
  role: 'assistant',
  content: '✨ Vou criar uma tarefa simples para você.',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-task-1',
      type: 'create_task',
      title: '✨ Criar Tarefa de Teste',
      description: 'Clique em "Executar" para criar uma tarefa de teste',
      icon: '✨',
      params: {
        title: 'Tarefa de Teste',
        description: 'Criada pelo sistema de teste',
        due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Amanhã
        priority: 'medium'
      }
    }
  }
};

// ============================================
// EXEMPLO 2: Múltiplas tarefas (Semana)
// ============================================
export const testWeekPlan = {
  role: 'assistant',
  content: '📅 Aqui está seu plano para a semana. Execute cada tarefa para criar.',
  type: 'tool_calls',
  data: {
    toolCalls: [
      {
        id: 'test-mon',
        type: 'create_task',
        title: '📅 Segunda: Planejamento',
        icon: '📅',
        params: {
          title: 'Planejamento Semanal',
          due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
          priority: 'high'
        }
      },
      {
        id: 'test-tue',
        type: 'create_task',
        title: '⚡ Terça: Execução',
        icon: '⚡',
        params: {
          title: 'Executar tarefas principais',
          due_date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
          priority: 'high'
        }
      },
      {
        id: 'test-wed',
        type: 'create_task',
        title: '🔄 Quarta: Ajustes',
        icon: '🔄',
        params: {
          title: 'Revisar e ajustar prioridades',
          due_date: new Date(Date.now() + 259200000).toISOString().split('T')[0],
          priority: 'medium'
        }
      },
      {
        id: 'test-thu',
        type: 'create_task',
        title: '🚀 Quinta: Aceleração',
        icon: '🚀',
        params: {
          title: 'Push final da semana',
          due_date: new Date(Date.now() + 345600000).toISOString().split('T')[0],
          priority: 'high'
        }
      },
      {
        id: 'test-fri',
        type: 'create_task',
        title: '✅ Sexta: Consolidação',
        icon: '✅',
        params: {
          title: 'Review e planejamento próxima semana',
          due_date: new Date(Date.now() + 432000000).toISOString().split('T')[0],
          priority: 'medium'
        }
      }
    ]
  }
};

// ============================================
// EXEMPLO 3: Criar Projeto
// ============================================
export const testCreateProject = {
  role: 'assistant',
  content: '🎯 Vou criar um novo projeto para você.',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-proj-1',
      type: 'create_project',
      title: '🎯 Criar Novo Projeto',
      icon: '🎯',
      params: {
        title: 'Projeto de Teste',
        description: 'Projeto criado pelo sistema de teste para validar funcionalidade',
        color: '#3b82f6' // blue
      }
    }
  }
};

// ============================================
// EXEMPLO 4: Delete com Confirmação
// ============================================
export const testDeleteWithConfirmation = {
  role: 'assistant',
  content: '⚠️ Esta ação requer confirmação. Tem certeza?',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-delete-1',
      type: 'delete_task',
      title: '🗑️ Deletar Tarefa (com confirmação)',
      icon: '🗑️',
      description: 'Clique uma vez para ver confirmação, clique novamente para deletar',
      params: {
        taskId: 'test-task-to-delete', // Não existe, mas demonstra o fluxo
      },
      requiresConfirmation: true
    }
  }
};

// ============================================
// EXEMPLO 5: Navegar para View
// ============================================
export const testNavigateToDashboard = {
  role: 'assistant',
  content: '📊 Vou abrir o dashboard com seus dados.',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-nav-1',
      type: 'navigate_view',
      title: '📊 Abrir Dashboard',
      icon: '📊',
      params: {
        viewType: 'DASHBOARD'
      }
    }
  }
};

// ============================================
// EXEMPLO 6: Mix Real World (Projeto + Tarefas + Navigate)
// ============================================
export const testMixedActions = {
  role: 'assistant',
  content: '🔥 Cenário completo: vou criar projeto + 3 tarefas + abrir dashboard.',
  type: 'tool_calls',
  data: {
    toolCalls: [
      {
        id: 'test-mix-proj',
        type: 'create_project',
        title: '🎯 Criar Projeto: Sprint 1',
        icon: '🎯',
        params: {
          title: 'Sprint 1 - MVP Features',
          description: 'Features principais para MVP',
          color: '#ec4899' // pink
        }
      },
      {
        id: 'test-mix-task1',
        type: 'create_task',
        title: '⚙️ Task 1: Setup',
        icon: '⚙️',
        params: {
          title: 'Setup inicial do projeto',
          priority: 'high'
        }
      },
      {
        id: 'test-mix-task2',
        type: 'create_task',
        title: '🎨 Task 2: UI Design',
        icon: '🎨',
        params: {
          title: 'Design da interface',
          priority: 'high'
        }
      },
      {
        id: 'test-mix-task3',
        type: 'create_task',
        title: '💻 Task 3: Backend',
        icon: '💻',
        params: {
          title: 'Implementar backend',
          priority: 'medium'
        }
      },
      {
        id: 'test-mix-nav',
        type: 'navigate_view',
        title: '🎯 Abrir Kanban',
        icon: '🎯',
        params: {
          viewType: 'KANBAN'
        }
      }
    ]
  }
};

// ============================================
// GERENCIADOR DE TESTES
// ============================================

const testMessages = {
  single: testSingleTask,
  week: testWeekPlan,
  project: testCreateProject,
  delete: testDeleteWithConfirmation,
  navigate: testNavigateToDashboard,
  mixed: testMixedActions,
};

export const getTestMessage = (testType = 'week') => {
  return testMessages[testType] || testMessages.week;
};

/**
 * Retorna lista de palavras-chave de teste para busca rápida
 */
export const getTestKeywords = () => [
  'teste-tarefa',
  'teste-semana',
  'teste-projeto',
  'teste-delete',
  'teste-navigate',
  'teste-mix',
  'dev-test'
];

/**
 * Injeta automaticamente se a mensagem contém palavra-chave de teste
 * Retorna { shouldInject: boolean, testMessage: object }
 */
export const checkForTestInjection = (userMessage = '') => {
  const lowerMsg = userMessage.toLowerCase();
  
  if (lowerMsg.includes('teste-tarefa') || lowerMsg.includes('single')) {
    return { shouldInject: true, testMessage: testSingleTask };
  }
  if (lowerMsg.includes('teste-semana') || lowerMsg.includes('week')) {
    return { shouldInject: true, testMessage: testWeekPlan };
  }
  if (lowerMsg.includes('teste-projeto') || lowerMsg.includes('project')) {
    return { shouldInject: true, testMessage: testCreateProject };
  }
  if (lowerMsg.includes('teste-delete') || lowerMsg.includes('delete')) {
    return { shouldInject: true, testMessage: testDeleteWithConfirmation };
  }
  if (lowerMsg.includes('teste-navigate') || lowerMsg.includes('navigate')) {
    return { shouldInject: true, testMessage: testNavigateToDashboard };
  }
  if (lowerMsg.includes('teste-mix') || lowerMsg.includes('mixed')) {
    return { shouldInject: true, testMessage: testMixedActions };
  }
  if (lowerMsg.includes('dev-test') || lowerMsg.includes('dev test')) {
    return { shouldInject: true, testMessage: testWeekPlan };
  }
  
  return { shouldInject: false, testMessage: null };
};

// ============================================
// EXPORT PARA USO EM DESENVOLVIMENTO
// ============================================

export default {
  testSingleTask,
  testWeekPlan,
  testCreateProject,
  testDeleteWithConfirmation,
  testNavigateToDashboard,
  testMixedActions,
  getTestMessage,
  getTestKeywords,
  checkForTestInjection,
};
