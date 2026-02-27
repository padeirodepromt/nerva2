# 🔧 ASH TOOL CALLS - GUIA DE INTEGRAÇÃO

## O QUE SÃO TOOL CALLS

Tool calls permitem que **Ash execute ações** via bubbles interativas no chat.

Diferente de simples botões, tool calls:
- ✅ Executam ações de verdade (criar, atualizar, deletar)
- ✅ Têm confirmação (para ações críticas)
- ✅ Retornam resultados
- ✅ Mostram estado (loading, sucesso, erro)
- ✅ Integram com banco de dados

---

## TIPOS DE TOOL CALLS SUPORTADOS

### 1. CREATE_TASK
Cria nova tarefa

```javascript
{
  role: 'assistant',
  content: 'Vou criar uma tarefa para você:',
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'task-001',
      type: 'create_task',
      title: '✨ Criar Tarefa: Preparar Apresentação',
      description: 'Vou criar uma tarefa de alta prioridade para amanhã',
      icon: '✨',
      params: {
        title: 'Preparar apresentação',
        description: 'Slides e demo para cliente',
        due_date: '2025-12-13',
        priority: 'high',
      },
      requiresConfirmation: false, // true para ações críticas
    }
  }
}
```

### 2. CREATE_PROJECT
Cria novo projeto

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'proj-001',
      type: 'create_project',
      title: '📁 Novo Projeto: Website Redesign',
      icon: '📁',
      params: {
        title: 'Website Redesign',
        description: 'Redesign completo do site',
        color: '#3B82F6',
      },
      requiresConfirmation: false,
    }
  }
}
```

### 3. COMPLETE_TASK
Marca tarefa como completa

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'task-complete-001',
      type: 'complete_task',
      title: '✅ Completar: Preparar apresentação',
      icon: '✅',
      params: {
        taskId: 'task-123', // ID da tarefa real
      },
      requiresConfirmation: false,
    }
  }
}
```

### 4. UPDATE_TASK
Atualiza tarefa existente

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'task-update-001',
      type: 'update_task',
      title: '✏️ Atualizar: Mudar prioridade',
      icon: '✏️',
      params: {
        taskId: 'task-123',
        priority: 'low', // Mudando para prioridade baixa
        due_date: '2025-12-20',
      },
      requiresConfirmation: false,
    }
  }
}
```

### 5. DELETE_TASK (Archive)
Arquiva tarefa

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'task-delete-001',
      type: 'delete_task',
      title: '🗑️ Arquivar: Limpeza de desktop',
      description: 'Esta ação não pode ser desfeita.',
      icon: '🗑️',
      params: {
        taskId: 'task-456',
      },
      requiresConfirmation: true, // IMPORTANTE: requer confirmação
    }
  }
}
```

### 6. NAVIGATE_VIEW
Navega para uma view diferente

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'nav-001',
      type: 'navigate_view',
      title: '📊 Abrir Dashboard',
      icon: '📊',
      params: {
        viewType: 'DASHBOARD',
        viewData: { filterBy: 'today' },
      },
      requiresConfirmation: false,
    }
  }
}
```

### 7. OPEN_DASHBOARD
Abre dashboard com filtros

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'dash-001',
      type: 'open_dashboard',
      title: '📈 Dashboard: Productivity',
      icon: '📈',
      params: {
        dashboardData: {
          period: 'week',
          metrics: ['completed', 'pending', 'overdue'],
        },
      },
      requiresConfirmation: false,
    }
  }
}
```

### 8. LIST_TASKS
Carrega lista de tarefas

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'list-001',
      type: 'list_tasks',
      title: '📋 Listar: Tarefas de hoje',
      icon: '📋',
      params: {
        filter: {
          completed: false,
          due_date: '2025-12-12',
        },
      },
      requiresConfirmation: false,
    }
  }
}
```

### 9. LIST_PROJECTS
Carrega lista de projetos

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'proj-list-001',
      type: 'list_projects',
      title: '📁 Listar: Meus projetos',
      icon: '📁',
      params: {
        filter: {
          active: true,
        },
      },
      requiresConfirmation: false,
    }
  }
}
```

### 10. CUSTOM
Tool call customizado (extensível)

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'custom-001',
      type: 'custom',
      title: '🎯 Ação Customizada',
      icon: '🎯',
      params: {
        customAction: 'archive_completed_tasks',
        days: 7,
      },
      requiresConfirmation: true,
    }
  }
}
```

---

## MÚLTIPLOS TOOL CALLS

Ash pode retornar várias ações de uma vez:

```javascript
{
  role: 'assistant',
  content: 'Vou preparar sua semana:',
  type: 'tool_calls', // Note: PLURAL
  data: {
    toolCalls: [
      {
        id: 'tc-1',
        type: 'create_task',
        title: '✨ Segunda-feira',
        params: { title: 'Reunião de planejamento', due_date: '2025-12-15' },
      },
      {
        id: 'tc-2',
        type: 'create_task',
        title: '✨ Terça-feira',
        params: { title: 'Revisar código', due_date: '2025-12-16' },
      },
      {
        id: 'tc-3',
        type: 'create_task',
        title: '✨ Quarta-feira',
        params: { title: 'Deploy em produção', due_date: '2025-12-17', priority: 'high' },
      },
    ]
  }
}
```

Cada um com seu próprio botão executável!

---

## INTEGRAÇÃO EM CHATSERVICE

### Passo 1: Detectar Tool Calls

```javascript
// src/ai_services/chatService.js

export async function sendAshMessage(userMessage) {
  const response = await ash.chat(userMessage);

  // Ash retorna tool calls na resposta?
  if (response.toolCalls && response.toolCalls.length > 0) {
    // Formatar como bubble
    return {
      role: 'assistant',
      content: response.message,
      type: response.toolCalls.length === 1 ? 'tool_call' : 'tool_calls',
      data: {
        toolCall: response.toolCalls[0], // single
        toolCalls: response.toolCalls,    // multiple
      }
    };
  }

  // Tool call único?
  if (response.toolCall) {
    return {
      role: 'assistant',
      content: response.message,
      type: 'tool_call',
      data: { toolCall: response.toolCall }
    };
  }

  // Resposta normal
  return {
    role: 'assistant',
    content: response.message,
  };
}
```

### Passo 2: Handle Tool Call Results

```javascript
// Em SideChat.jsx ou componente pai

import { useChatStore } from '@/stores/useChatStore';

export default function SideChat() {
  const { messages, addMessage } = useChatStore();

  const handleBubbleInteraction = (action, data) => {
    if (action === 'tool_call_executed') {
      console.log('✅ Tool call executado:', data);

      // Adicionar mensagem de confirmação ao chat
      addMessage({
        role: 'assistant',
        content: `✅ ${data.type}: Ação executada com sucesso!`,
        toolCallResult: data,
      });

      // Opcionalmente, notificar Ash
      chatService.notifyToolCallComplete(data);
    }
  };

  return (
    <div>
      {messages.map(msg => (
        <MessageBubble
          key={msg.id}
          message={msg}
          onInteraction={handleBubbleInteraction}
        />
      ))}
    </div>
  );
}
```

---

## FLUXO COMPLETO: Criar 3 Tarefas para a Semana

```
USER: "Cria 3 tarefas para essa semana"
  │
  ├─ Enviado para Ash
  │
CHAT SERVICE:
  ├─ Ash detecta: user quer 3 tarefas
  ├─ Responde com 3 tool calls
  ├─ Retorna:
  │   {
  │     content: "Preparei 3 tarefas para você!",
  │     type: 'tool_calls',
  │     data: { toolCalls: [...] }
  │   }
  │
MESSAGE BUBBLE: Renderiza texto
  │
BUBBLE RENDERER: Detecta type='tool_calls'
  │
TOOL CALL BUBBLE: Renderiza 3 botões
  │   ✨ Segunda-feira: Reunião
  │   ✨ Terça-feira: Código
  │   ✨ Quarta-feira: Deploy
  │
USER: Clica em "Executar" para cada uma
  │
  ├─ Task.create() para cada tarefa
  ├─ Toast: ✅ Tarefa criada
  │
ASH: Recebe feedback
  │
CHAT STORE: Atualiza messages
  │
CHAT: Mostra confirmação
  │
✅ DONE: 3 tarefas criadas!
```

---

## CONFIRMAÇÃO (Para Ações Críticas)

```javascript
{
  type: 'tool_call',
  data: {
    toolCall: {
      id: 'delete-all',
      type: 'delete_task',
      title: '🚨 DELETAR: Todos as tarefas antigas',
      description: 'Isso vai deletar 50 tarefas. Tem certeza?',
      icon: '🚨',
      params: { taskIds: [...] },
      requiresConfirmation: true, // ← MUITO IMPORTANTE
    }
  }
}
```

Fluxo com confirmação:
```
USER: Clica "Executar"
  │
BUBBLE: Mostra aviso ⚠️
  │
  └─ "Tem certeza? Esta ação não pode ser desfeita."
  
BUBBLE: Muda botão para 🚨 Confirmar
  │
USER: Clica "Confirmar"
  │
EXECUTE: Task.update() realmente executado
  │
✅ Ação confirmada e executada
```

---

## FEEDBACK & STATES

ToolCallBubble mostra 3 estados:

### 1. Normal (Não executado)
```
┌──────────────────────────┐
│ ✨ Criar Tarefa          │
│                          │
│ Preparar apresentação    │
│ Slides e demo para...    │
│                          │
│ [▶ Executar]             │
└──────────────────────────┘
```

### 2. Executando (Loading)
```
┌──────────────────────────┐
│ ✨ Criar Tarefa          │
│                          │
│ Preparar apresentação    │
│ Slides e demo para...    │
│                          │
│ [⚡] (spinning)          │
└──────────────────────────┘
```

### 3. Sucesso
```
┌──────────────────────────┐
│ ✅ Criar Tarefa          │
│                          │
│ Ação executada com sucesso
└──────────────────────────┘
```

### 4. Erro
```
┌──────────────────────────┐
│ ❌ Criar Tarefa          │
│                          │
│ Erro: [mensagem erro]    │
└──────────────────────────┘
```

---

## EXEMPLO REAL: Ash Planejador de Semana

```javascript
// User: "Planeje minha semana"
// Ash responde com múltiplas ações

{
  role: 'assistant',
  content: 'Aqui está seu planejamento para a semana:',
  type: 'tool_calls',
  data: {
    toolCalls: [
      // SEGUNDA
      {
        id: 'mon-1',
        type: 'create_task',
        title: '📅 Segunda: Preparar apresentação',
        icon: '📅',
        params: {
          title: 'Preparar apresentação Q4',
          description: 'Slides, demo, handout',
          due_date: '2025-12-15',
          priority: 'high',
        },
      },
      // TERÇA
      {
        id: 'tue-1',
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
      // QUARTA
      {
        id: 'wed-1',
        type: 'create_task',
        title: '📅 Quarta: Deploy em staging',
        icon: '📅',
        params: {
          title: 'Deploy em staging',
          description: 'V2.5.0 features',
          due_date: '2025-12-17',
          priority: 'high',
        },
      },
      // QUINTA
      {
        id: 'thu-1',
        type: 'create_task',
        title: '📅 Quinta: Testes de QA',
        icon: '📅',
        params: {
          title: 'QA testing',
          description: 'Cenários críticos',
          due_date: '2025-12-18',
          priority: 'medium',
        },
      },
      // SEXTA
      {
        id: 'fri-1',
        type: 'create_task',
        title: '📅 Sexta: Deploy em produção',
        icon: '📅',
        params: {
          title: 'Deploy em produção',
          description: 'V2.5.0 release',
          due_date: '2025-12-19',
          priority: 'high',
        },
      },
      // DASHBOARD
      {
        id: 'dashboard',
        type: 'open_dashboard',
        title: '📊 Abrir Dashboard de Produtividade',
        icon: '📊',
        params: {
          dashboardData: { period: 'week' },
        },
      },
    ]
  }
}
```

Resultado no chat:
```
┌──────────────────────────────────────┐
│ Aqui está seu planejamento...         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📅 Segunda: Preparar apresentação    │
│ [▶ Executar]                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📅 Terça: Code review                │
│ [▶ Executar]                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📅 Quarta: Deploy em staging         │
│ [▶ Executar]                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📅 Quinta: Testes de QA              │
│ [▶ Executar]                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📅 Sexta: Deploy em produção         │
│ [▶ Executar]                         │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│ 📊 Abrir Dashboard de Produtividade   │
│ [▶ Executar]                         │
└──────────────────────────────────────┘
```

User clica cada um → 5 tarefas criadas + dashboard aberto!

---

## ESTENDENDO: CUSTOM TOOL CALLS

Para adicionar suas próprias ações:

```javascript
// Em ToolCallBubble.jsx, no switch:

case 'archive_old_tasks':
  // Sua lógica customizada
  const archived = await Task.archiveOlderThan(params.days);
  toast.success(`✅ Arquivadas ${archived.length} tarefas`);
  setResult({ success: true, data: archived });
  onExecute?.({ type, id, result: archived });
  break;

case 'generate_report':
  // Gerar relatório
  const report = await generateWeeklyReport(params.period);
  toast.success('✅ Relatório gerado!');
  // Opcionalmente: download PDF
  window.open(report.downloadUrl);
  setResult({ success: true, data: report });
  break;
```

---

## ✅ CHECKLIST: IMPLEMENTAÇÃO

- [ ] ToolCallBubble.jsx criado
- [ ] BubbleRenderer atualizado com 'tool_call'
- [ ] Exportações atualizadas
- [ ] ChatService atualizado para detectar tool calls
- [ ] Handlers em SideChat/componente pai
- [ ] Testado com exemplo simples
- [ ] Testado com múltiplos tool calls
- [ ] Confirmação funcionando (delete, etc)
- [ ] Toast notifications aparecem
- [ ] Build: 0 erros

---

## 🚀 PRÓXIMO PASSO

Testar com exemplo real:

```javascript
// Manualmente, em chatService.js

const mockToolCall = {
  role: 'assistant',
  content: 'Vou criar 3 tarefas para você:',
  type: 'tool_calls',
  data: {
    toolCalls: [
      {
        id: 'test-1',
        type: 'create_task',
        title: '✨ Test Task 1',
        icon: '✨',
        params: { title: 'Test Task 1', priority: 'high' },
      },
      {
        id: 'test-2',
        type: 'create_task',
        title: '✨ Test Task 2',
        icon: '✨',
        params: { title: 'Test Task 2', priority: 'medium' },
      },
    ]
  }
};

// Retornar este mock por enquanto
return mockToolCall;
```

Depois, quando Ash API estiver pronta, substituir pela integração real.
