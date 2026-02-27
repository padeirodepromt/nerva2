# 🎨 MESSAGE BUBBLES - GUIA DE INTEGRAÇÃO

## O QUE FOI IMPLEMENTADO

### Componentes Criados

1. **TaskListBubble** - Lista de tarefas interativa
2. **QuickActionBubble** - Botões de ação rápida
3. **CalendarBubble** - Mini calendário com seleção de data
4. **FormBubble** - Formulário dinâmico para criar items
5. **BubbleRenderer** - Renderizador automático baseado em tipo

---

## 🎯 EXEMPLOS DE USO

### 1. Task List Bubble

**Quando usar:** Quando Ash responde com uma lista de tarefas

```jsx
// Em chatService.js
const response = {
  role: 'assistant',
  content: 'Aqui estão suas tarefas pendentes:',
  type: 'task_list',
  data: {
    tasks: [
      {
        id: '1',
        title: 'Preparar apresentação',
        due_date: '2025-12-15',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Revisar documentação',
        due_date: '2025-12-20',
        priority: 'medium',
      },
    ],
    maxItems: 5,
  }
};

// No MessageBubble, automaticamente renderiza:
// ┌─────────────────────────────────┐
// │ 📋 2 Tarefas                    │
// ├─────────────────────────────────┤
// │ [ ] Preparar apresentação        │
// │     📅 15/12/2025 🔴 Alta        │
// ├─────────────────────────────────┤
// │ [ ] Revisar documentação         │
// │     📅 20/12/2025 🟡 Média       │
// ├─────────────────────────────────┤
// │     ➕ Ver mais tarefas          │
// └─────────────────────────────────┘
```

**Interações:**
- Click em tarefa → `onTaskSelect(task)`
- Click "Ver mais" → `onCreateTask()`

---

### 2. Quick Action Bubble

**Quando usar:** Para oferecer ações rápidas ("Criar tarefa", "Ver pendências", etc)

```jsx
const response = {
  role: 'assistant',
  content: 'O que você gostaria de fazer?',
  type: 'actions',
  data: {
    actions: [
      {
        id: 'create',
        type: 'create_task',
        label: '✨ Criar Tarefa',
        icon: '✨',
        title: 'Nova tarefa',
      },
      {
        id: 'list',
        type: 'list_tasks',
        label: '📋 Ver Pendências',
        icon: '📋',
      },
      {
        id: 'dashboard',
        type: 'open_view',
        label: '📊 Dashboard',
        icon: '📊',
        viewType: 'DASHBOARD',
      },
    ]
  }
};

// Renderiza:
// ┌──────────────────────────────────────┐
// │ ✨ Criar Tarefa  📋 Ver Pendências   │
// │              📊 Dashboard             │
// └──────────────────────────────────────┘
```

**Ações Suportadas:**
- `create_task` - Cria nova tarefa
- `list_tasks` - Lista tarefas filtradas
- `complete_task` - Marca como completo (requer `taskId`)
- `open_view` - Abre uma view diferente

---

### 3. Calendar Bubble

**Quando usar:** Quando precisa que o usuário selecione uma data

```jsx
const response = {
  role: 'assistant',
  content: 'Quando você gostaria de agendar?',
  type: 'calendar',
  data: {
    month: 0,  // Janeiro (0-11)
    year: 2025,
  }
};

// Renderiza mini calendário interativo:
// ┌─────────────────────────────────┐
// │ ← Janeiro 2025 →                │
// ├─────────────────────────────────┤
// │ Dom Seg Ter Qua Qui Sex Sab    │
// │  1   2   3   4   5   6   7     │
// │  8   9  10  11  12 [13] 14     │ ← hoje
// │ 15  16  17  18  19  20  21     │
// │ 22  23  24  25  26  27  28     │
// │ 29  30  31                      │
// ├─────────────────────────────────┤
// │ 📅 13/01/2025                   │
// └─────────────────────────────────┘
```

**Interações:**
- Click em dia → `onSelectDate(date)`
- Click prev/next → Muda mês

---

### 4. Form Bubble

**Quando usar:** Para criar tarefas, eventos ou items sem deixar o chat

```jsx
const response = {
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
        placeholder: 'Detalhes...',
        rows: 3,
      },
      {
        name: 'due_date',
        label: 'Data',
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

// Renderiza formulário interativo:
// ┌─────────────────────────────────┐
// │ Nova Tarefa                     │
// ├─────────────────────────────────┤
// │ Título *                        │
// │ [___________________]           │
// │                                 │
// │ Descrição                       │
// │ [_____________________        ] │
// │ [_____________________        ] │
// │                                 │
// │ Data                            │
// │ [__________]                    │
// │                                 │
// │ Prioridade                      │
// │ [Selecione...     ▼]            │
// ├─────────────────────────────────┤
// │        [Criar]                  │
// └─────────────────────────────────┘
```

**Validações:**
- Required fields com asterisco
- Mensagens de erro inline
- Submit desabilitado até valid

---

## 🔌 INTEGRAÇÃO COM CHAT SERVICE

### Em `src/ai_services/chatService.js`

```javascript
import { 
  taskListExample,
  quickActionsExample,
  calendarExample,
  formExample 
} from '@/components/chat/MESSAGE_FORMAT_GUIDE';

export async function sendAshMessage(userMessage) {
  // Enviar para Ash
  const response = await ash.chat(userMessage);

  // Detectar tipo de resposta e formatar com bubble
  if (response.type === 'create_task_request') {
    // Ash quer criar tarefa → FormBubble
    return {
      role: 'assistant',
      content: response.message,
      type: 'form',
      data: {
        title: 'Nova Tarefa',
        submitLabel: 'Criar',
        fields: [
          { 
            name: 'title', 
            label: 'Título', 
            type: 'text',
            placeholder: 'O que você quer fazer?',
            required: true 
          },
          { 
            name: 'description', 
            label: 'Descrição', 
            type: 'textarea',
            rows: 3 
          },
          { 
            name: 'due_date', 
            label: 'Data de Vencimento', 
            type: 'date' 
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
  }

  if (response.type === 'list_tasks_response') {
    // Ash quer mostrar tarefas → TaskListBubble
    const tasks = await Task.filter({ completed: false });
    return {
      role: 'assistant',
      content: response.message,
      type: 'task_list',
      data: { tasks },
    };
  }

  if (response.type === 'suggest_actions') {
    // Ash quer oferecer ações → QuickActionBubble
    return {
      role: 'assistant',
      content: response.message,
      type: 'actions',
      data: {
        actions: [
          { 
            id: 'create_task',
            type: 'create_task',
            label: '✨ Criar Tarefa',
            icon: '✨',
          },
          {
            id: 'list_pending',
            type: 'list_tasks',
            label: '📋 Ver Pendências',
            icon: '📋',
          },
          {
            id: 'schedule_event',
            type: 'schedule_event',
            label: '📅 Agendar',
            icon: '📅',
          },
        ]
      }
    };
  }

  if (response.type === 'schedule_request') {
    // Ash quer agendar → CalendarBubble
    return {
      role: 'assistant',
      content: response.message,
      type: 'calendar',
      data: {}
    };
  }

  // Resposta normal (sem bubble)
  return {
    role: 'assistant',
    content: response.message,
  };
}
```

---

## 📱 MOBILE INTEGRATION

Em mobile, os bubbles se adaptam automaticamente:

```javascript
// Em src/components/chat/MessageBubble.jsx
// O BubbleRenderer já é responsivo!

<BubbleRenderer 
  message={message}
  isMobile={isMobile}  // Automático via useMobileDetect
  onInteraction={(action, data) => {
    // Mesmo callback em mobile e desktop
    window.dispatchEvent(new CustomEvent('prana:bubble-interaction', {
      detail: { action, data, messageId: message.id }
    }));
  }}
/>
```

---

## 🎪 FLUXO COMPLETO: Criar Tarefa via Chat

```
USER: "Cria uma tarefa para amanhã"
   ↓
CHAT SERVICE: Detecta "create_task_request"
   ↓
RETURNS: { type: 'form', data: { fields: [...] } }
   ↓
MESSAGE BUBBLE: Renderiza FormBubble
   ↓
USER: Preenche [Título, Descrição, Data, Prioridade]
   ↓
USER: Clica "Criar"
   ↓
FORM BUBBLE: Valida + faz Task.create()
   ↓
EVENT: Dispara 'prana:bubble-interaction'
   ↓
CHAT STORE: Recebe interação
   ↓
ASH: Confirma "✅ Tarefa criada: Fazer compras"
```

---

## 🔄 Ciclo de Resposta Completo

```javascript
// 1. User sends message
useChatStore.sendMessage('Mostre minhas tarefas');

// 2. Chat service processes
const response = await chatService.sendAshMessage(msg);
// Returns: { type: 'task_list', data: { tasks: [...] }, ... }

// 3. Store adds to messages
useChatStore.addMessage(response);

// 4. Component renders
<MessageBubble message={response} />

// 5. BubbleRenderer detects type
<BubbleRenderer message={response} />

// 6. TaskListBubble renders
<TaskListBubble tasks={response.data.tasks} />

// 7. User interacts
user clicks on task
onTaskSelect(task)

// 8. Event dispatched
window.dispatchEvent(...)

// 9. Store handles interaction
useChatStore.handleBubbleInteraction(action, data)

// 10. Chat continues or action executes
Task.update() or navigate or show details
```

---

## 🧪 TESTANDO LOCALMENTE

### 1. Adicionar console logs

```javascript
// Em BubbleRenderer.jsx
const BubbleRenderer = ({ message, onInteraction }) => {
  console.log('🎨 BubbleRenderer received:', message);
  
  return (
    <>
      {/* Render logic */}
    </>
  );
};
```

### 2. Simular resposta de Ash

```javascript
// Em chat component ou SideChat.jsx
const testResponse = {
  role: 'assistant',
  content: 'Teste de bubble',
  type: 'task_list',
  data: {
    tasks: [
      {
        id: '1',
        title: 'Task 1',
        priority: 'high',
        due_date: '2025-12-15'
      }
    ]
  }
};

// Adicionar manualmente ao messages array
messages.push(testResponse);
```

### 3. Verificar evento

```javascript
// No console do browser
window.addEventListener('prana:bubble-interaction', (e) => {
  console.log('💬 Bubble interaction:', e.detail);
});
```

---

## 📊 STATUS FINAL

| Item | Status | Descrição |
|------|--------|-----------|
| TaskListBubble | ✅ Pronto | Lista interativa com swipe mobile |
| QuickActionBubble | ✅ Pronto | Botões com ações automáticas |
| CalendarBubble | ✅ Pronto | Seleção de datas interativa |
| FormBubble | ✅ Pronto | Validação + submit automático |
| BubbleRenderer | ✅ Pronto | Renderização automática por tipo |
| MessageBubble integration | ✅ Pronto | Renderiza bubbles after content |
| Build | ✅ Pronto | 0 erros, 1793 modules |
| Mobile support | ✅ Pronto | Responsivo em todos os tamanhos |

---

## 🚀 PRÓXIMAS FASES

1. ✅ Message Bubbles Implementation - **DONE**
2. ⏳ Ash Tool Calls Integration (comandar views via bubbles)
3. ⏳ Advanced Gestures (long-press, swipe, pinch-zoom)
4. ⏳ Capacitor Setup (native app)
5. ⏳ iOS/Android Builds

---

**Pronto para testar! Abra o app e teste uma resposta com bubble:**

```bash
npm run dev
# Vá para Chat
# Envie mensagem que dispare uma resposta do tipo 'task_list'
# Veja o bubble aparecer! 🎉
```
