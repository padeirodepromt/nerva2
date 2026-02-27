/**
 * Chat Message Format Guide
 * Como formatar mensagens do Ash para renderizar bubbles automaticamente
 */

// ============================================================================
// 1. TASK LIST BUBBLE
// ============================================================================

export const taskListExample = {
  role: 'assistant',
  content: 'Aqui estão suas tarefas pendentes:',
  type: 'task_list',
  data: {
    tasks: [
      {
        id: '1',
        title: 'Preparar apresentação',
        completed: false,
        due_date: '2025-12-15',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Revisar documentação',
        completed: false,
        due_date: '2025-12-20',
        priority: 'medium',
      },
    ],
    maxItems: 5,
  }
};

// ============================================================================
// 2. QUICK ACTION BUBBLE
// ============================================================================

export const quickActionsExample = {
  role: 'assistant',
  content: 'O que você gostaria de fazer agora?',
  type: 'actions',
  data: {
    actions: [
      {
        id: 'create_task',
        type: 'create_task',
        label: '✨ Criar Tarefa',
        icon: '✨',
        title: 'Nova tarefa',
        description: 'Tarefa criada via Ash',
      },
      {
        id: 'list_pending',
        type: 'list_tasks',
        label: '📋 Ver Pendências',
        icon: '📋',
      },
      {
        id: 'open_dashboard',
        type: 'open_view',
        label: '📊 Abrir Dashboard',
        icon: '📊',
        viewType: 'DASHBOARD',
      },
    ]
  }
};

// ============================================================================
// 3. CALENDAR BUBBLE
// ============================================================================

export const calendarExample = {
  role: 'assistant',
  content: 'Quando você gostaria de agendar?',
  type: 'calendar',
  data: {
    month: 0,  // Janeiro (0-11)
    year: 2025,
  }
};

// ============================================================================
// 4. FORM BUBBLE
// ============================================================================

export const formExample = {
  role: 'assistant',
  content: 'Vamos criar uma nova tarefa:',
  type: 'form',
  data: {
    title: 'Nova Tarefa',
    submitLabel: 'Criar',
    fields: [
      {
        name: 'title',
        label: 'Título',
        type: 'text',
        placeholder: 'Ex: Preparar reunião',
        required: true,
      },
      {
        name: 'description',
        label: 'Descrição',
        type: 'textarea',
        placeholder: 'Detalhes da tarefa',
        rows: 3,
      },
      {
        name: 'due_date',
        label: 'Data de Vencimento',
        type: 'date',
        required: false,
      },
      {
        name: 'priority',
        label: 'Prioridade',
        type: 'select',
        options: [
          { value: 'high', label: '🔴 Alta' },
          { value: 'medium', label: '🟡 Média' },
          { value: 'low', label: '🟢 Baixa' },
        ],
        defaultValue: 'medium',
      },
    ],
  }
};

// ============================================================================
// 5. METRICS BUBBLE (Extensível)
// ============================================================================

export const metricsExample = {
  role: 'assistant',
  content: 'Aqui está um resumo de suas atividades:',
  type: 'metrics',
  data: {
    metrics: {
      'Tarefas Concluídas': '12/25',
      'Tempo Médio': '2h 30m',
      'Produtividade': '85%',
    }
  }
};

// ============================================================================
// 6. TIMELINE BUBBLE (Extensível)
// ============================================================================

export const timelineExample = {
  role: 'assistant',
  content: 'Seus próximos eventos:',
  type: 'timeline',
  data: {
    events: [
      { time: '14:00', title: 'Reunião com a equipe' },
      { time: '16:30', title: 'Revisão de código' },
      { time: '18:00', title: 'Planejamento semanal' },
    ]
  }
};

// ============================================================================
// COMO USAR NO CHAT SERVICE
// ============================================================================

/**
 * Em src/ai_services/chatService.js:
 *
 * export async function sendAshMessage(userMessage) {
 *   // ... enviar para Ash
 *   const response = await ash.chat(userMessage);
 *   
 *   // Formatar resposta com bubble
 *   if (response.type === 'create_task_request') {
 *     return {
 *       role: 'assistant',
 *       content: response.message,
 *       type: 'form',
 *       data: {
 *         title: 'Nova Tarefa',
 *         fields: [
 *           { name: 'title', label: 'Título', required: true },
 *           { name: 'description', label: 'Descrição', type: 'textarea' },
 *           { name: 'due_date', label: 'Data', type: 'date' },
 *         ],
 *       }
 *     };
 *   }
 *   
 *   if (response.type === 'list_tasks_response') {
 *     const tasks = await Task.filter({ completed: false });
 *     return {
 *       role: 'assistant',
 *       content: response.message,
 *       type: 'task_list',
 *       data: { tasks },
 *     };
 *   }
 *   
 *   // Resposta normal (sem bubble)
 *   return {
 *     role: 'assistant',
 *     content: response.message,
 *   };
 * }
 */

// ============================================================================
// ESTRUTURA DE RESPOSTA COMPLETA
// ============================================================================

export const fullMessageFormat = {
  id: 'msg-123',
  role: 'assistant',
  content: 'Aqui estão suas opções:',  // Texto sempre presente
  type: 'actions',                      // Tipo de bubble (opcional)
  data: {                               // Dados do bubble (opcional)
    actions: [
      { id: '1', type: 'create_task', label: 'Criar Tarefa' },
      { id: '2', type: 'list_tasks', label: 'Ver Tarefas' },
    ]
  },
  timestamp: new Date().toISOString(),
  metadata: {                           // Metadados (opcional)
    toolsUsed: ['database', 'ui_render'],
    executionTime: 150, // ms
  }
};

// ============================================================================
// INTEGRAÇÃO EM MESSAGEBBUBBLE
// ============================================================================

/**
 * Em src/components/chat/MessageBubble.jsx:
 *
 * import BubbleRenderer from './BubbleRenderer';
 * 
 * export default function MessageBubble({ message, isUser, isMobile }) {
 *   return (
 *     <div className="...">
 *       <p className="text-sm">{message.content}</p>
 *       
 *       // Renderizar bubble se existir
 *       {message.type && (
 *         <BubbleRenderer 
 *           message={message}
 *           onInteraction={(action, data) => {
 *             console.log('User interacted:', action, data);
 *             // Enviar ação de volta ao chat
 *           }}
 *         />
 *       )}
 *     </div>
 *   );
 * }
 */
