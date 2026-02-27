/**
 * TOOL CALLS TESTING EXAMPLES
 * 
 * Copie estes exemplos e use no seu chat para testar
 * os tool calls sem precisar da integração real com Ash API
 */

// ============================================================================
// EXEMPLO 1: Criar uma tarefa simples
// ============================================================================

export const testCreateTask = {
  role: 'assistant',
  content: 'Vou criar uma tarefa para você:',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-create-1',
      type: 'create_task',
      title: '✨ Criar Tarefa: Estudar React',
      description: 'Uma tarefa de exemplo para teste',
      icon: '✨',
      params: {
        title: 'Estudar React Hooks',
        description: 'Entender useState, useEffect, useContext',
        due_date: '2025-12-15',
        priority: 'high',
      },
      requiresConfirmation: false,
    }
  }
};

// ============================================================================
// EXEMPLO 2: Múltiplas tarefas (Ash planeja semana)
// ============================================================================

export const testMultipleTasks = {
  role: 'assistant',
  content: 'Preparei sua semana de trabalho:',
  type: 'tool_calls',
  data: {
    toolCalls: [
      {
        id: 'week-mon',
        type: 'create_task',
        title: '📅 Segunda: Reunião de planejamento',
        icon: '📅',
        params: {
          title: 'Reunião de planejamento semanal',
          description: 'Com a equipe',
          due_date: '2025-12-15',
          priority: 'high',
        },
      },
      {
        id: 'week-tue',
        type: 'create_task',
        title: '📅 Terça: Code review',
        icon: '📅',
        params: {
          title: 'Revisar PRs da equipe',
          description: 'Frontend + Backend',
          due_date: '2025-12-16',
          priority: 'medium',
        },
      },
      {
        id: 'week-wed',
        type: 'create_task',
        title: '📅 Quarta: Deploy staging',
        icon: '📅',
        params: {
          title: 'Deploy em ambiente de staging',
          description: 'Versão 2.5.0',
          due_date: '2025-12-17',
          priority: 'high',
        },
      },
      {
        id: 'week-thu',
        type: 'create_task',
        title: '📅 Quinta: Testes QA',
        icon: '📅',
        params: {
          title: 'Testes de QA',
          description: 'Cenários críticos e edge cases',
          due_date: '2025-12-18',
          priority: 'medium',
        },
      },
      {
        id: 'week-fri',
        type: 'create_task',
        title: '📅 Sexta: Deploy produção',
        icon: '📅',
        params: {
          title: 'Deploy em produção',
          description: 'Release v2.5.0',
          due_date: '2025-12-19',
          priority: 'high',
        },
      },
    ]
  }
};

// ============================================================================
// EXEMPLO 3: Ação que requer confirmação
// ============================================================================

export const testDeleteWithConfirmation = {
  role: 'assistant',
  content: 'Encontrei tarefas antigas que podem ser arquivadas:',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'test-delete-old',
      type: 'delete_task',
      title: '🚨 Arquivar: Tarefas com mais de 30 dias',
      description: 'Isso vai arquivar 15 tarefas antigas. Tem certeza?',
      icon: '🚨',
      params: {
        taskId: 'old-task-123', // Exemplo
        older_than_days: 30,
      },
      requiresConfirmation: true, // ← IMPORTANTE
    }
  }
};

// ============================================================================
// EXEMPLO 4: Completar tarefas
// ============================================================================

export const testCompleteTask = {
  role: 'assistant',
  content: 'Vejo que você terminou essas tarefas:',
  type: 'tool_calls',
  data: {
    toolCalls: [
      {
        id: 'complete-1',
        type: 'complete_task',
        title: '✅ Completar: Preparar apresentação',
        icon: '✅',
        params: {
          taskId: 'task-001', // ID real da tarefa
        },
      },
      {
        id: 'complete-2',
        type: 'complete_task',
        title: '✅ Completar: Revisar código',
        icon: '✅',
        params: {
          taskId: 'task-002',
        },
      },
    ]
  }
};

// ============================================================================
// EXEMPLO 5: Navegar para view
// ============================================================================

export const testNavigateView = {
  role: 'assistant',
  content: 'Vou abrir o dashboard de produtividade:',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'nav-dash',
      type: 'navigate_view',
      title: '📊 Dashboard: Produtividade Semanal',
      icon: '📊',
      params: {
        viewType: 'DASHBOARD',
        viewData: {
          period: 'week',
          metrics: ['completed', 'pending', 'overdue'],
        },
      },
    }
  }
};

// ============================================================================
// EXEMPLO 6: Criar projeto
// ============================================================================

export const testCreateProject = {
  role: 'assistant',
  content: 'Vou criar um novo projeto para você:',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'proj-create-1',
      type: 'create_project',
      title: '📁 Novo Projeto: Website Redesign',
      icon: '📁',
      params: {
        title: 'Website Redesign Q4 2025',
        description: 'Redesign completo do site corporativo com nova identidade visual',
        color: '#3B82F6', // Azul
      },
    }
  }
};

// ============================================================================
// EXEMPLO 7: Mix de ações (real world)
// ============================================================================

export const testMixedActions = {
  role: 'assistant',
  content: 'Aqui está meu plano para você alcançar seus objetivos:',
  type: 'tool_calls',
  data: {
    toolCalls: [
      // 1. Criar novo projeto
      {
        id: 'proj-1',
        type: 'create_project',
        title: '📁 Novo Projeto: Produto X',
        icon: '📁',
        params: {
          title: 'Desenvolvimento do Produto X',
          description: 'Novo SaaS para gestão de vendas',
        },
      },
      // 2. Criar várias tasks
      {
        id: 'task-1',
        type: 'create_task',
        title: '✨ Design de UX/UI',
        icon: '✨',
        params: {
          title: 'Design de UX/UI',
          description: 'Wireframes e design system',
          due_date: '2025-12-20',
          priority: 'high',
        },
      },
      {
        id: 'task-2',
        type: 'create_task',
        title: '✨ Desenvolvimento Backend',
        icon: '✨',
        params: {
          title: 'Desenvolvimento Backend',
          description: 'APIs REST, database, auth',
          due_date: '2025-12-27',
          priority: 'high',
        },
      },
      {
        id: 'task-3',
        type: 'create_task',
        title: '✨ Testes e QA',
        icon: '✨',
        params: {
          title: 'Testes e QA',
          description: 'Unit tests, integration tests, manual testing',
          due_date: '2026-01-10',
          priority: 'medium',
        },
      },
      // 3. Abrir dashboard
      {
        id: 'dash-1',
        type: 'open_dashboard',
        title: '📊 Dashboard do Produto X',
        icon: '📊',
        params: {
          dashboardData: {
            projectId: 'proj-1',
            period: 'month',
          },
        },
      },
    ]
  }
};

// ============================================================================
// COMO USAR ESTES EXEMPLOS
// ============================================================================

/**
 * OPÇÃO 1: Direto no ChatService (para teste rápido)
 * 
 * Em src/ai_services/chatService.js:
 * 
 * import { testCreateTask } from '@/components/chat/TOOL_CALLS_TESTING';
 * 
 * export async function sendAshMessage(userMessage) {
 *   // ... código normal
 *   
 *   // PARA TESTAR: retornar exemplo
 *   if (userMessage.includes('test') || userMessage.includes('exemplo')) {
 *     return testCreateTask; // ou qualquer outro
 *   }
 *   
 *   // DEPOIS: integração real com Ash
 * }
 */

/**
 * OPÇÃO 2: Mock completo em teste isolado
 * 
 * import * as examples from '@/components/chat/TOOL_CALLS_TESTING';
 * import { render, screen } from '@testing-library/react';
 * import MessageBubble from '@/components/chat/MessageBubble';
 * 
 * test('renders tool call bubble', () => {
 *   render(<MessageBubble message={examples.testCreateTask} />);
 *   screen.getByText('Criar Tarefa: Estudar React');
 * });
 */

/**
 * OPÇÃO 3: Adicionar botão de teste em dev
 * 
 * {process.env.NODE_ENV === 'development' && (
 *   <button onClick={() => {
 *     useChatStore.addMessage(testMultipleTasks);
 *   }}>
 *     🧪 Test Tool Calls
 *   </button>
 * )}
 */

/**
 * OPÇÃO 4: Cypress E2E test
 * 
 * describe('Tool Calls', () => {
 *   it('executes create_task tool call', () => {
 *     cy.visit('/');
 *     // Simular resposta de Ash
 *     cy.intercept('POST', '/api/chat', {
 *       body: testCreateTask
 *     });
 *     // Enviar mensagem
 *     cy.get('[data-testid=chat-input]').type('criar tarefa');
 *     cy.get('[data-testid=send-btn]').click();
 *     // Verificar bubble apareceu
 *     cy.get('[data-testid=tool-call-bubble]').should('exist');
 *     // Clicar em executar
 *     cy.contains('Executar').click();
 *     // Verificar sucesso
 *     cy.get('[data-testid=tool-call-success]').should('exist');
 *   });
 * });
 */
