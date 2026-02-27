# 🎨 Arquitetura Visual: Chat-Centered Mobile

## 1️⃣ Fluxo Completo (User Perspective)

```
USER JOURNEY: "Criar Tarefa no Mobile"

┌─────────────────────────────────────────────────────────┐
│ STEP 1: Usuário abre app em mobile                     │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Header: Ash ⚡                            │        │
│  ├───────────────────────────────────────────┤        │
│  │ Ash: "Oi! Vejo 3 tarefas hoje.           │        │
│  │      Quer criar mais uma?"                │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ [✓ Tarefa 1]                             │        │
│  │ [✓ Tarefa 2]                             │        │
│  │ [ ] Tarefa 3                             │        │
│  │ [Criar Nova] [Ver Tudo]                  │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  Input: [User: "Sim, criar"]                          │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 2: Ash pede nome da tarefa (conversacional)       │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Ash: "Qual é o nome da tarefa?"           │        │
│  │                                            │        │
│  │ ┌─ Form Bubble (Step 1/3) ────────────┐  │        │
│  │ │ [Nome: _____________] ← autoFocus   │  │        │
│  │ │                                     │  │        │
│  │ │ [← Voltar]                          │  │        │
│  │ └─────────────────────────────────────┘  │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  Input: [User digita: "Escrever relatório"]           │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 3: Ash pede data (transição automática)           │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Ash: "Quando deve ser feita?"             │        │
│  │                                            │        │
│  │ ┌─ Calendar Bubble (Step 2/3) ──────────┐ │        │
│  │ │ < Janeiro 2025 >                      │ │        │
│  │ │ [12][13][14][15][16][17][18]          │ │        │
│  │ │ [19][20][21][22][23][24][25]          │ │        │
│  │ │                                        │ │        │
│  │ │ User clica: [15]                       │ │        │
│  │ └────────────────────────────────────────┘ │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 4: Ash pede prioridade (botões)                  │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Ash: "Qual é a prioridade?"               │        │
│  │                                            │        │
│  │ ┌─ Action Buttons Bubble (Step 3/3) ────┐ │        │
│  │ │ [🔴 Alta] [🟡 Média] [🟢 Baixa]       │ │        │
│  │ │                                        │ │        │
│  │ │ User clica: [🔴 Alta]                  │ │        │
│  │ └────────────────────────────────────────┘ │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 5: Confirmação e opções                           │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ Ash: "Pronto! ✓"                          │        │
│  │                                            │        │
│  │ ┌─ Confirm Bubble ──────────────────────┐ │        │
│  │ │ ✅ Escrever relatório                 │ │        │
│  │ │ 📅 15 de Janeiro                      │ │        │
│  │ │ 🔴 Alta Prioridade                    │ │        │
│  │ │                                        │ │        │
│  │ │ [Ver] [Editar] [Compartilhar]         │ │        │
│  │ └────────────────────────────────────────┘ │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
│  Input: [User: "Ver"]                                 │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ STEP 6: Expandir detalhes (drawer em cima do chat)    │
│                                                         │
│  ┌───────────────────────────────────────────┐        │
│  │ 📋 ESCREVER RELATÓRIO                     │        │
│  │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │        │
│  │                                            │        │
│  │ 🔴 Alta | 📅 15 Jan | 👤 You             │        │
│  │                                            │        │
│  │ Descrição: [vazio - clique para editar] │        │
│  │                                            │        │
│  │ Checklist:                                 │        │
│  │ ☐ Pesquisar dados                        │        │
│  │ ☐ Estruturar documento                   │        │
│  │ ☐ Escrever draft                         │        │
│  │                                            │        │
│  │ [Editar] [Concluir] [Deletar] [Fechar]   │        │
│  └───────────────────────────────────────────┘        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 2️⃣ Arquitetura Técnica (Developer Perspective)

```
DADOS & COMPONENTES FLOW

┌─────────────────────────────────────────────────────────┐
│ ENTRADA: User Input                                     │
│                                                         │
│ "Criar tarefa"                                          │
│        ↓                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CHAT LAYER                                              │
│                                                         │
│ SideChat.jsx                                            │
│  ├─ useState(messages)                                  │
│  ├─ sendMessage("Criar tarefa")                         │
│  │   ↓                                                  │
│  └─ useChatStore().sendMessage()                        │
│        ↓                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ CHAT SERVICE LAYER                                      │
│                                                         │
│ ChatService.js                                          │
│  ├─ sendMessage(userInput)                              │
│  │   ↓                                                  │
│  ├─ OpenAI API Call                                     │
│  │   {                                                  │
│  │     "role": "user",                                  │
│  │     "content": "Criar tarefa"                        │
│  │   }                                                  │
│  │   ↓ Ash responde + tool_calls                        │
│  └─ Response: {                                         │
│      "content": "Qual é o nome?",                       │
│      "tool_calls": [{                                   │
│        "name": "create_task_form",                      │
│        "args": { "step": 1 }                            │
│      }]                                                 │
│     }                                                   │
│        ↓                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ TOOL SERVICE LAYER                                      │
│                                                         │
│ ToolService.js                                          │
│  ├─ processToolCall("create_task_form", { step: 1 })   │
│  │   ↓                                                  │
│  └─ return {                                            │
│      "type": "form",                                    │
│      "fields": ["title"],                               │
│      "step": 1,                                         │
│      "totalSteps": 3                                    │
│     }                                                   │
│        ↓                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ MESSAGE RENDERING LAYER                                 │
│                                                         │
│ MessageBubble.jsx                                       │
│  ├─ props: {                                            │
│  │   "role": "assistant",                               │
│  │   "content": "Qual é o nome?",                       │
│  │   "toolResult": {                                    │
│  │     "type": "form",                                  │
│  │     "fields": ["title"],                             │
│  │     "step": 1                                        │
│  │   }                                                  │
│  │ }                                                    │
│  │   ↓                                                  │
│  ├─ Detecta type === "form"                             │
│  │   ↓                                                  │
│  └─ Renderiza: <FormBubble step={1} fields={...} />   │
│        ↓                                                │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ COMPONENT BUBBLE LAYER (NOVO!)                         │
│                                                         │
│ src/components/chat/bubbles/                            │
│                                                         │
│ FormBubble.jsx                                          │
│  ├─ props: { step: 1, fields: ["title"] }              │
│  ├─ render: <input placeholder="Nome" />               │
│  ├─ onChange: → sendMessage(value)                      │
│  │   ↓ Loop de volta ao CHAT SERVICE                    │
│  └─ Próximo step renderiza CalendarBubble              │
│        ↓                                                │
│ CalendarBubble.jsx                                      │
│  ├─ props: { step: 2, onSelectDate }                   │
│  ├─ render: <Calendar />                                │
│  ├─ onClick: → sendMessage(date)                        │
│  │   ↓ Loop de volta                                    │
│  └─ Próximo step renderiza ActionButtonsBubble         │
│        ↓                                                │
│ ActionButtonsBubble.jsx                                 │
│  ├─ props: { buttons: [Alta, Média, Baixa] }           │
│  ├─ render: <button> para cada ação                     │
│  ├─ onClick: → sendMessage(priority)                    │
│  │   ↓ Loop finaliza                                    │
│  └─ Final: ConfirmBubble                                │
│        ↓                                                │
│ ConfirmBubble.jsx                                       │
│  ├─ props: { task }                                     │
│  ├─ render: Task criado com sucesso ✓                   │
│  └─ buttons: [Ver] [Editar] [Compartilhar]             │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ SAÍDA: UI Renderizada                                   │
│                                                         │
│ Tarefa criada e exibida em detalhes                     │
│        ↓                                                │
│ User pode continuar conversando com Ash                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 3️⃣ Componentes Bubble (Estrutura)

```
src/components/chat/bubbles/
│
├─ FormBubble.jsx
│  ├─ Props: { step, fields, onStepComplete }
│  ├─ State: { currentValue }
│  ├─ Render:
│  │  ┌─ Label: "Qual é o nome?"
│  │  ├─ Input: <input onChange={...} />
│  │  ├─ Navigation: [← Voltar] [Próximo →]
│  │  └─ Step indicator: "1/3"
│  └─ Logic: onChange → onStepComplete → sendMessage
│
├─ CalendarBubble.jsx
│  ├─ Props: { month, onSelectDate }
│  ├─ State: { selectedDate }
│  ├─ Render:
│  │  ┌─ Header: "< Janeiro 2025 >"
│  │  ├─ Grid: [1][2][3]...[31]
│  │  ├─ Highlighted: today + selected
│  │  └─ Events dots: ● se há tarefas
│  └─ Logic: onClick → onSelectDate → sendMessage
│
├─ ActionButtonsBubble.jsx
│  ├─ Props: { actions: [{label, onClick, icon}] }
│  ├─ Render:
│  │  └─ Buttons: [🔴 Alta][🟡 Média][🟢 Baixa]
│  └─ Logic: onClick → action() → sendMessage
│
├─ TaskListBubble.jsx
│  ├─ Props: { tasks, onComplete, onDetails }
│  ├─ State: { expandedTaskId }
│  ├─ Render:
│  │  └─ List:
│  │     ├─ [✓] Tarefa 1 → onComplete(true)
│  │     ├─ [ ] Tarefa 2 → onComplete(false)
│  │     └─ ⋯ → onDetails() → bottom sheet
│  └─ Logic: Swipe esquerda = check, tap ⋯ = detalhes
│
├─ ProjectCardBubble.jsx
│  ├─ Props: { project, onSelect }
│  ├─ Render:
│  │  ├─ Title: "Nome Projeto"
│  │  ├─ Progress: "5/10 tarefas"
│  │  ├─ Members: avatares
│  │  └─ [Ver Detalhes]
│  └─ Logic: Click → onSelect() → bottom sheet
│
├─ ConfirmBubble.jsx
│  ├─ Props: { result, actions }
│  ├─ Render:
│  │  ├─ Status: ✓ ou ✗
│  │  ├─ Details: task/project criado
│  │  └─ Buttons: [Ver] [Editar] [Compartilhar]
│  └─ Logic: Button click → action
│
└─ SearchResultsBubble.jsx
   ├─ Props: { results, onSelect }
   ├─ Render: List de resultados
   └─ Logic: Click → onSelect() → detalhes

```

---

## 4️⃣ Estado & Data Flow

```
STATE MANAGEMENT (useChatStore)

useChatStore {
  // Chat messages
  messages: [
    {
      id: uuid,
      role: 'user' | 'assistant',
      content: string,
      timestamp: Date,
      toolCall?: { name, args },
      toolResult?: { type, data },
      bubble?: React.Component  ← NOVO!
    }
  ],
  
  // Chat context
  currentView: 'chat' | 'list' | 'calendar',
  selectedProjectId?: string,
  
  // Actions
  sendMessage: (content) => void,
  addMessage: (message) => void,
  updateMessage: (id, updates) => void,
  
  // For bubbles
  onFormSubmit: (formData) => void,
  onActionClick: (actionId) => void,
  onTaskUpdate: (taskId, updates) => void,
}

EXAMPLE MESSAGE:

{
  id: 'msg-123',
  role: 'assistant',
  content: 'Qual é o nome da tarefa?',
  timestamp: new Date(),
  toolCall: {
    name: 'create_task_form',
    args: { step: 1 }
  },
  toolResult: {
    type: 'form',
    fields: ['title'],
    step: 1,
    totalSteps: 3
  },
  bubble: <FormBubble step={1} fields={['title']} />
}
```

---

## 5️⃣ Mobile Layout Structure

```
┌─────────────────────────────────┐
│ MobileChatLayout (100vh)        │
│                                 │
│ ┌──────────────────────────────┐│
│ │ MobileHeaderBar (48px)        ││
│ │ Ash ⚡  |  Settings ⚙️         ││
│ └──────────────────────────────┘│
│ ┌──────────────────────────────┐│
│ │                              ││
│ │ Chat Container (flex-grow)   ││
│ │  ┌──────────────────────────┐││
│ │  │ MessageBubble (Ash)      │││
│ │  │ "Como posso ajudar?"     │││
│ │  └──────────────────────────┘││
│ │                              ││
│ │  ┌──────────────────────────┐││
│ │  │ MessageBubble (User)     │││
│ │  │ "Criar tarefa"           │││
│ │  └──────────────────────────┘││
│ │                              ││
│ │  ┌──────────────────────────┐││
│ │  │ FormBubble (Step 1)      │││
│ │  │ [___ nome ___]           │││
│ │  └──────────────────────────┘││
│ │                              ││
│ └──────────────────────────────┘│
│ ┌──────────────────────────────┐│
│ │ ChatInput (56px)              ││
│ │ [___ type... ___] [Send ↑]   ││
│ └──────────────────────────────┘│
│                                 │
│ Bottom Drawer (Opcional)        │
│ quando [Ver Detalhes] acionado  │
│                                 │
└─────────────────────────────────┘

TAMANHOS:
- Header: 48px (touch-friendly)
- Input: 56px (com padding)
- Gaps: 8px (compacto mobile)
- Bubbles padding: 12px
- Buttons: 44px × 44px mínimo
```

---

## 6️⃣ Interação Touch

```
GESTOS MOBILE

1️⃣ SWIPE ESQUERDA (Marcar completa)
   ┌─────────────────────┐
   │ [✓ Tarefa 1]        │  ← Slide esquerda
   └─────────────────────┘
                ↓
   ┌─────────────────────┐
   │ [✓✓ Tarefa 1] [↶]   │  ← Mostra check duplo + undo
   └─────────────────────┘
                ↓
   Envia: { action: 'complete_task', taskId: 123 }


2️⃣ LONG PRESS (Menu contextual)
   ┌─────────────────────┐
   │ [ ] Tarefa 2        │  ← Press 400ms
   └─────────────────────┘
                ↓
   ┌─────────────────────┐
   │ [ ] Tarefa 2        │
   │ [✓] [✎] [🗑] [+]   │  ← Menu flutuante
   └─────────────────────┘


3️⃣ TAP em Button
   [Criar] → onClick → sendMessage → Ash responde → Novo bubble


4️⃣ PULL DOWN (Refresh)
   ┌─────────────────────┐
   │ ↓ Pull to refresh   │
   └─────────────────────┘
                ↓
   Carrega novas tarefas / recarrega chat
```

---

## 7️⃣ Performance Otimizations

```
RENDERING OPTIMIZATION

┌─ Virtual Scrolling (100+ messages)
│  Renderiza apenas visible items
│
├─ Lazy Load Bubbles
│  const TaskListBubble = React.lazy(() => import(...))
│
├─ Memoization
│  const FormBubble = React.memo(({ step, fields }) => ...)
│
├─ Debounce Input
│  onChange → debounce(300ms) → sendMessage
│
├─ Image Optimization
│  Avatar: <img srcSet="..." />
│
└─ CSS Animations
   Only GPU-accelerated properties (transform, opacity)
   Avoid: height, width changes
```

---

## 8️⃣ State Transitions (Exemplo)

```
CREATE TASK FLOW - STATE CHANGES

[Inicial]
{
  messages: [],
  currentView: 'chat'
}

                ↓ User: "Criar tarefa"

[Step 1: Form Input]
{
  messages: [{
    role: 'user',
    content: 'Criar tarefa'
  }, {
    role: 'assistant',
    content: 'Qual é o nome?',
    bubble: <FormBubble step={1} />
  }],
  currentView: 'chat'
}

                ↓ User digita: "Escrever relatório"

[Step 2: Date Input]
{
  messages: [..., {
    role: 'user',
    content: 'Escrever relatório'
  }, {
    role: 'assistant',
    content: 'Qual a data?',
    bubble: <CalendarBubble onSelectDate={...} />
  }],
  currentView: 'chat'
}

                ↓ User clica: 15

[Step 3: Priority Input]
{
  messages: [..., {
    role: 'user',
    content: '15'
  }, {
    role: 'assistant',
    content: 'Qual a prioridade?',
    bubble: <ActionButtonsBubble actions={['Alta','Média','Baixa']} />
  }],
  currentView: 'chat'
}

                ↓ User clica: Alta

[Final: Confirmation]
{
  messages: [..., {
    role: 'assistant',
    content: 'Pronto! ✓',
    bubble: <ConfirmBubble task={{
      title: 'Escrever relatório',
      date: '2025-01-15',
      priority: 'Alta'
    }} />
  }],
  currentView: 'chat'
}

                ↓ User clica: [Ver]

[Drawer Open]
{
  showTaskDetailsDrawer: true,
  selectedTask: { id: 123, ... }
}
```

---

## 🎯 Resumo Arquitetura

| Camada | Responsabilidade | Componentes |
|--------|-----------------|------------|
| **UI/Mobile** | Rendering | MobileChatLayout, MobileHeader, ChatInput |
| **Chat** | Message display | SideChat, MessageBubble |
| **Bubbles** | Interactive UI | FormBubble, CalendarBubble, ActionButtonsBubble... |
| **Service** | Business logic | ChatService, ToolService, taskService |
| **State** | State management | useChatStore |
| **API** | Data access | Entities (Task, Project, etc) |

---

**Status:** 🟢 Arquitetura clara, pronta para implementação

