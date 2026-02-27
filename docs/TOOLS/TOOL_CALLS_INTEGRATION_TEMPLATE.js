/**
 * chatServiceToolCallsIntegration.js
 * 
 * TEMPLATE DE INTEGRAÇÃO para quando Ash API estiver retornando tool calls.
 * 
 * Este arquivo demonstra EXATAMENTE como integrar a resposta do Ash
 * no formato de tool calls com o BubbleRenderer.
 * 
 * Copie este código para chatService.js quando Ash API estiver pronta!
 */

// ============================================
// TEMPLATE 1: Detectar Tool Calls na Resposta
// ============================================

/**
 * Se Ash API retorna tool calls desta forma:
 * 
 * {
 *   message: "Vou criar tarefas para você",
 *   toolCalls: [
 *     { id: '1', type: 'create_task', params: {...} },
 *     { id: '2', type: 'create_task', params: {...} }
 *   ]
 * }
 * 
 * Converter para o formato que BubbleRenderer entende:
 */

export const formatAshResponseWithToolCalls = (ashResponse) => {
  // Se não tem tool calls, retornar mensagem simples
  if (!ashResponse.toolCalls || ashResponse.toolCalls.length === 0) {
    return {
      role: 'assistant',
      content: ashResponse.message || ashResponse.text || '',
    };
  }

  // Se tem exatamente 1 tool call
  if (ashResponse.toolCalls.length === 1) {
    return {
      role: 'assistant',
      content: ashResponse.message || 'Aqui está a ação para você executar:',
      type: 'tool_call',
      data: {
        // Garantir que toolCall tem a estrutura esperada
        toolCall: enrichToolCall(ashResponse.toolCalls[0])
      }
    };
  }

  // Se tem múltiplos tool calls
  return {
    role: 'assistant',
    content: ashResponse.message || `Tenho ${ashResponse.toolCalls.length} ações para você:`,
    type: 'tool_calls',
    data: {
      toolCalls: ashResponse.toolCalls.map(tc => enrichToolCall(tc))
    }
  };
};

/**
 * Enriquecer tool call com informações faltantes
 * (icons, titles, descriptions)
 */
const enrichToolCall = (toolCall) => {
  const baseToolCall = {
    id: toolCall.id || `tc-${Date.now()}`,
    type: toolCall.type || 'custom',
    title: getTitleForType(toolCall.type),
    icon: getIconForType(toolCall.type),
    params: toolCall.params || {},
    ...toolCall // Sobrescrever com valores do Ash se existirem
  };

  // Adicionar requiresConfirmation para tipos destrutivos
  if (['delete_task', 'delete_project', 'archive_task'].includes(toolCall.type)) {
    baseToolCall.requiresConfirmation = true;
  }

  return baseToolCall;
};

// ============================================
// TEMPLATE 2: Mapeamento de Tipos
// ============================================

const TOOL_CALL_METADATA = {
  create_task: {
    title: '✨ Criar Tarefa',
    icon: '✨',
    description: 'Nova tarefa será criada'
  },
  create_project: {
    title: '🎯 Criar Projeto',
    icon: '🎯',
    description: 'Novo projeto será criado'
  },
  complete_task: {
    title: '✅ Completar Tarefa',
    icon: '✅',
    description: 'Marcar como concluída'
  },
  update_task: {
    title: '📝 Atualizar Tarefa',
    icon: '📝',
    description: 'Tarefa será atualizada'
  },
  delete_task: {
    title: '🗑️ Arquivar Tarefa',
    icon: '🗑️',
    description: 'Tarefa será arquivada'
  },
  delete_project: {
    title: '🗑️ Deletar Projeto',
    icon: '🗑️',
    description: 'Projeto será deletado'
  },
  navigate_view: {
    title: '🗺️ Navegar',
    icon: '🗺️',
    description: 'Ir para outra view'
  },
  open_dashboard: {
    title: '📊 Dashboard',
    icon: '📊',
    description: 'Abrir dashboard'
  },
  list_tasks: {
    title: '📋 Listar Tarefas',
    icon: '📋',
    description: 'Carregar tarefas'
  },
  list_projects: {
    title: '📦 Listar Projetos',
    icon: '📦',
    description: 'Carregar projetos'
  },
  custom: {
    title: '⚙️ Ação Custom',
    icon: '⚙️',
    description: 'Ação customizada'
  }
};

const getTitleForType = (type) => {
  return TOOL_CALL_METADATA[type]?.title || '⚙️ Ação';
};

const getIconForType = (type) => {
  return TOOL_CALL_METADATA[type]?.icon || '⚙️';
};

// ============================================
// TEMPLATE 3: Integração em chatService.js
// ============================================

/**
 * COPIE E COLE isto no final do runChat():
 */

/*
// No arquivo: src/ai_services/chatService.js
// Adicione isto ANTES do `return { response: text }`:

      // Se Ash retornar tool calls
      let finalResponse = text;
      let toolCallsInResponse = null;
      
      // Tentar extrair tool calls da resposta
      // (Ash pode indicar isto de várias formas)
      if (ashResponse.toolCalls) {
        // Ash retornou explicitamente tool calls
        toolCallsInResponse = ashResponse.toolCalls;
        finalResponse = ashResponse.message || text;
      } else if (responseMessage.function_calls && responseMessage.function_calls.length > 0) {
        // OpenAI retornou function calls
        toolCallsInResponse = responseMessage.function_calls;
      }
      
      // Formatar para BubbleRenderer
      if (toolCallsInResponse && toolCallsInResponse.length > 0) {
        const formattedMessage = formatAshResponseWithToolCalls({
          message: finalResponse,
          toolCalls: toolCallsInResponse
        });
        
        await db.insert(schema.nexusMessages).values({
          nexusId,
          role: 'model',
          content: finalResponse,
          toolCalls: toolCallsInResponse // Salvar para auditoria
        });
        
        return formattedMessage; // BubbleRenderer vai renderizar!
      }
      
      // Senão, retornar como texto normal
      await db.insert(schema.nexusMessages).values({ nexusId, role: 'model', content: text });
      return { response: text };
*/

// ============================================
// TEMPLATE 4: Handler de Resultados
// ============================================

/**
 * Quando ToolCallBubble executa, ele chama onExecute com:
 * {
 *   id: 'tc-1',
 *   type: 'create_task',
 *   result: { id: 'task-123', title: 'Nova Tarefa' }
 * }
 * 
 * Handle isto em SideChat.jsx ou componente pai:
 */

export const handleToolCallExecuted = async (
  toolCallResult,
  { nexusId, userId }
) => {
  // Log para auditoria
  console.log('[Tool Call Executed]', toolCallResult);

  // Notificar Ash que ação foi completa (OPCIONAL)
  // Ash pode precisar disso para continuar o fluxo
  try {
    await notifyAshOfToolCallCompletion(
      nexusId,
      userId,
      toolCallResult
    );
  } catch (error) {
    console.warn('Erro ao notificar Ash:', error);
    // Não falhar o fluxo inteiro se notificação falhar
  }

  // Adicionar confirmação ao chat (OPCIONAL)
  // Mostrar ao usuário que a ação foi completada
  /*
  useChatStore.getState().addMessage({
    role: 'system',
    content: `✅ ${toolCallResult.type} executado com sucesso!`,
    type: 'system_notification'
  });
  */
};

/**
 * Notificar Ash da conclusão (se Ash precisar)
 */
const notifyAshOfToolCallCompletion = async (
  nexusId,
  userId,
  toolCallResult
) => {
  // Implementar baseado no protocolo do Ash
  // Exemplo:
  /*
  const response = await ash.notifyToolCallComplete({
    nexusId,
    userId,
    toolCallId: toolCallResult.id,
    toolType: toolCallResult.type,
    result: toolCallResult.result,
    timestamp: new Date().toISOString()
  });
  
  return response;
  */
};

// ============================================
// TEMPLATE 5: Integração em SideChat.jsx
// ============================================

/**
 * COPIE E COLE isto em SideChat.jsx:
 */

/*
// Em src/components/chat/SideChat.jsx
// Na renderização de mensagens:

{messages.map((msg, i) => (
  <div key={msg.id || i}>
    <MessageBubble 
      message={msg}
      onInteraction={(action, data) => {
        if (action === 'tool_call_executed') {
          handleToolCallExecuted(data, {
            nexusId: activeContext?.id,
            userId: user?.id
          });
        }
      }}
    />
  </div>
))}
*/

// ============================================
// TEMPLATE 6: Exemplos de Respostas do Ash
// ============================================

/**
 * Exemplo 1: Ash retorna 1 tool call
 */
export const EXAMPLE_RESPONSE_SINGLE = {
  message: 'Vou criar esta tarefa para você.',
  toolCalls: [
    {
      id: 'ash-1',
      type: 'create_task',
      params: {
        title: 'Implementar novo feature',
        description: 'Fazer o login com Google',
        due_date: '2025-12-20',
        priority: 'high'
      }
    }
  ]
};

/**
 * Exemplo 2: Ash retorna múltiplos tool calls
 */
export const EXAMPLE_RESPONSE_MULTIPLE = {
  message: 'Vou organizar sua semana:',
  toolCalls: [
    {
      id: 'ash-mon',
      type: 'create_task',
      params: {
        title: 'Segunda: Planning',
        due_date: '2025-12-15',
        priority: 'high'
      }
    },
    {
      id: 'ash-wed',
      type: 'create_task',
      params: {
        title: 'Quarta: Review',
        due_date: '2025-12-17',
        priority: 'medium'
      }
    },
    {
      id: 'ash-fri',
      type: 'navigate_view',
      params: {
        viewType: 'KANBAN'
      }
    }
  ]
};

/**
 * Exemplo 3: Ash retorna tool call com confirmação necessária
 */
export const EXAMPLE_RESPONSE_WITH_CONFIRMATION = {
  message: 'Vou deletar este projeto. Tem certeza?',
  toolCalls: [
    {
      id: 'ash-delete',
      type: 'delete_project',
      params: {
        projectId: 'proj-123'
      },
      requiresConfirmation: true // Flag automática para delete
    }
  ]
};

// ============================================
// EXPORT PARA USO
// ============================================

export default {
  formatAshResponseWithToolCalls,
  enrichToolCall,
  getTitleForType,
  getIconForType,
  handleToolCallExecuted,
  notifyAshOfToolCallCompletion,
  // Examples
  EXAMPLE_RESPONSE_SINGLE,
  EXAMPLE_RESPONSE_MULTIPLE,
  EXAMPLE_RESPONSE_WITH_CONFIRMATION,
};
