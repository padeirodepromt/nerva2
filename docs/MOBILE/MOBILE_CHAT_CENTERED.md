# 🎯 ESTRATÉGIA: Chat-Centered Mobile para Prana 3.0

**Data:** 12 de Dezembro de 2025  
**Conceito:** Ash comanda tudo via Chat. Views são renderizadas como MessageBubbles dentro do Chat.

---

## 🔄 O Sistema que JÁ Existe

### ✅ Tool Calls Architecture (Já Funcional)

```
Ash (Chat) → Tool Call → System → Response UI → Message Bubble
   ↓           ↓           ↓         ↓            ↓
User Input  [createTask]  Backend  JSON/UI    Renderiza em Chat
            [listTasks]           
            [editProject]
            [viewCalendar]
```

### 📋 Tool Calls Disponíveis (já implementados)

**Arquivo:** `src/ai_services/toolService.js`

| Tool | Função | Output |
|------|--------|--------|
| `list_tasks` | Listar tarefas do projeto | JSON list |
| `create_task` | Criar nova tarefa | Task object |
| `update_task` | Atualizar tarefa | Updated object |
| `complete_task` | Marcar completa | Status update |
| `list_projects` | Listar projetos | JSON list |
| `create_project` | Criar projeto | Project object |
| `get_calendar` | Ver calendário | Calendar data |
| `search` | Buscar tarefas/projetos | Search results |

**Arquivos relevantes:**
- `src/ai_services/toolService.js` - Define tools
- `src/ai_services/chatService.js` - Processa responses
- `src/components/chat/SideChat.jsx` - Renderiza chat

---

## 💭 Conceito: Chat como Centro

### Visualização do Fluxo Mobile

```
┌─────────────────────────────────┐
│         CHAT ONLY               │
│  ┌───────────────────────────┐  │
│  │ Ash: "Olá! Vejo que você │  │
│  │ tem 3 tarefas hoje. Quer │  │
│  │ ver?"                      │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │ ← Message Bubble
│  │ [List de 3 tarefas]       │  │   com componentes
│  │ ☐ Tarefa 1               │  │   interativos
│  │ ☐ Tarefa 2               │  │
│  │ ☐ Tarefa 3               │  │
│  │ [Ver Detalhes] [Criar]   │  │
│  └───────────────────────────┘  │
│                                 │
│  User: "Marcar primeira como pronta"
│                                 │
│  ┌───────────────────────────┐  │
│  │ Ash: "Pronto! Movei       │  │
│  │ Tarefa 1 para completas"  │  │
│  └───────────────────────────┘  │
│                                 │
│  Input: [_______________] [Send]│
└─────────────────────────────────┘
```

**Vantagem:** User nunca sai do chat. Tudo acontece ali dentro.

---

## 🏗️ Arquitetura Chat-Centered Mobile

### 1. Layout Principal (MobileChatLayout.jsx)

```jsx
// Mobile = 100% Chat, nada mais
<div className="h-screen flex flex-col">
  <MobileHeader />
  <ChatContainer /> {/* 100% do espaço */}
  <ChatInput />
</div>
```

### 2. Message Bubble com Componentes (Existente)

**Arquivo:** `src/components/chat/MessageBubble.jsx`

```jsx
const renderContent = (message) => {
  // Se tool call response → renderiza componente
  if (message.toolResult?.type === 'task_list') {
    return <TaskListBubble tasks={message.toolResult.data} />
  }
  if (message.toolResult?.type === 'project') {
    return <ProjectCardBubble project={message.toolResult.data} />
  }
  // Senão → texto normal
  return <p>{message.content}</p>
}
```

### 3. Componentes Renderizáveis em Bubble (Novos)

```
src/components/chat/bubbles/
├─ TaskListBubble.jsx       ← Lista de tarefas clickável
├─ ProjectCardBubble.jsx    ← Card de projeto
├─ CalendarBubble.jsx       ← Mini calendar
├─ FormBubble.jsx           ← Formulário step-by-step
├─ ConfirmBubble.jsx        ← Confirmação
└─ ActionButtonsBubble.jsx  ← Buttons para ações
```

---

## 🎯 Fluxos Mobile Chat-Centered

### Fluxo 1: Listar Tarefas (Existe)

```
User: "Quais são minhas tarefas?"
  ↓
Ash: [chama list_tasks tool]
  ↓
Sistema retorna: { type: 'task_list', data: [...] }
  ↓
MessageBubble renderiza: <TaskListBubble tasks={[...]} />
  ↓
User vê lista DENTRO do chat com:
  - Checkbox para marcar completa
  - Botão "Ver Detalhes" (abre drawer)
  - Botão "Criar Tarefa"
```

**Implementação:**
```jsx
// TaskListBubble.jsx - JÁ PODE EXISTIR
export function TaskListBubble({ tasks, onTaskUpdate }) {
  return (
    <div className="space-y-2 p-3 bg-white/5 rounded-lg">
      {tasks.map(task => (
        <div key={task.id} className="flex items-center gap-2">
          <input 
            type="checkbox"
            checked={task.completed}
            onChange={() => onTaskUpdate(task.id, { completed: !task.completed })}
            className="w-5 h-5" {/* Touch-friendly */}
          />
          <span className="flex-1">{task.title}</span>
          <button onClick={() => openDrawer(task)}>⋯</button>
        </div>
      ))}
    </div>
  )
}
```

### Fluxo 2: Criar Tarefa (Step-by-Step)

```
User: "Criar tarefa"
  ↓
Ash: "Qual o nome da tarefa?"
  ↓
MessageBubble renderiza: <TextInputBubble placeholder="Nome" />
  ↓
User digita: "Escrever relatório"
  ↓
Ash: "Quando deve ser feita?"
  ↓
MessageBubble renderiza: <DatePickerBubble />
  ↓
User escolhe data
  ↓
Ash: "Priority?" 
  ↓
MessageBubble renderiza: <PriorityButtonsBubble />
  ↓
Ash: "Pronto! Criei a tarefa ✓"
  ↓
MessageBubble renderiza: <ConfirmBubble taskCreated={...} />
```

**Vantagem:** Conversacional, natural, step-by-step.

### Fluxo 3: Ver Detalhes (Drawer dentro de Chat)

```
User: "Ver detalhes de 'Escrever relatório'"
  ↓
Ash: [chama get_task tool]
  ↓
MessageBubble renderiza: <TaskDetailsBubble task={...} />
  ↓
TaskDetailsBubble mostra:
  ├─ Titulo
  ├─ Descrição
  ├─ Status (com swipe para marcar completa)
  ├─ Data
  ├─ Prioridade
  └─ [Editar] [Deletar]
  ↓
User clica [Editar]
  ↓
MessageBubble renderiza: <EditFormBubble task={...} />
```

---

## 📱 Componentes Renderizáveis (Novos)

### TaskListBubble
```jsx
// Mobile-optimized lista de tarefas
<TaskListBubble 
  tasks={[...]} 
  onComplete={handleComplete}
  onDetails={handleDetails}
  onCreate={handleCreate}
/>
```

Features:
- ✅ Checkbox (marcar completa)
- 👁️ Ver detalhes (drawer/bottom sheet)
- ➕ Botão criar rápido
- 🏷️ Prioridade colorida
- 📅 Data próxima

### FormBubble (Step-by-Step)
```jsx
// Formulários conversacionais
<FormBubble 
  steps={['title', 'date', 'priority']}
  onComplete={handleFormComplete}
/>
```

Features:
- One field per step
- Text input / Date picker / Select
- [Back] [Next] / [Cancel] [Done]

### CalendarBubble
```jsx
// Mini calendar inline
<CalendarBubble 
  selectedDate={date}
  onSelectDate={handleDate}
  events={[...]}
/>
```

Features:
- Navegação mês/semana
- Tarefas do dia destacadas
- Click para ver detalhes

### ActionButtonsBubble
```jsx
// Botões contextuais
<ActionButtonsBubble 
  actions={[
    { label: 'Criar', onClick: handleCreate },
    { label: 'Ver Tudo', onClick: handleViewAll },
  ]}
/>
```

---

## 🔗 Integration Points

### Modificação 1: SideChat.jsx

```jsx
// Processar tool call responses
const handleToolResponse = (response) => {
  // Ash retorna estrutura padronizada
  if (response.type === 'task_list') {
    return {
      content: "Aqui estão suas tarefas:",
      bubble: <TaskListBubble tasks={response.data} />,
      interactive: true
    }
  }
  
  // Renderizar no chat
  addMessage({
    role: 'assistant',
    content: response.content,
    bubble: response.bubble,
    toolCall: response.toolCall
  })
}
```

### Modificação 2: ChatService.jsx

```jsx
// Tool calls retornam UI-ready responses
const listTasks = async (projectId) => {
  const tasks = await Task.filter({ project_id: projectId });
  
  return {
    type: 'task_list',
    data: tasks,
    // ← Bubble sabe como renderizar
    content: `Encontrei ${tasks.length} tarefas`
  }
}
```

### Modificação 3: MessageBubble.jsx

```jsx
// Renderizar componentes complexos
const renderToolResponse = (message) => {
  const { toolResult } = message;
  
  switch(toolResult?.type) {
    case 'task_list':
      return <TaskListBubble tasks={toolResult.data} />
    case 'project':
      return <ProjectCardBubble project={toolResult.data} />
    case 'form':
      return <FormBubble config={toolResult.config} />
    default:
      return <p>{toolResult?.content}</p>
  }
}
```

---

## 🎨 UI/UX Mobile Chat-Centered

### Layout
```
┌─────────────────────────────┐
│  Ash ⚡ | Settings ⚙️       │  ← 48px Header
├─────────────────────────────┤
│                             │
│    Chat Messages Container  │ ← Flex-grow
│    (messages + bubbles)      │
│                             │
├─────────────────────────────┤
│  [________text input____] ⬆ │  ← 56px Input
└─────────────────────────────┘
```

### Espaçamento
- Header: 48px
- Input: 56px (com padding)
- Mensagens: 12px gap (mobile-compact)
- Bubble Padding: 12px (não 16px)

### Cores & Theming
```jsx
// User message bubble
.user-bubble {
  background: rgb(var(--accent-rgb));
  color: white;
  border-radius: 18px;
}

// Ash message bubble
.ash-bubble {
  background: rgba(var(--accent-rgb), 0.1);
  border: 1px solid rgba(var(--accent-rgb), 0.3);
  border-radius: 18px;
}

// Action bubble (task list, form, etc)
.action-bubble {
  background: rgba(var(--accent-rgb), 0.05);
  border-left: 3px solid rgb(var(--accent-rgb));
}
```

---

## ⚙️ Fluxo Técnico (Detalhe)

### 1. User digita "Criar tarefa"
```
SideChat.jsx
  ↓ sendMessage("Criar tarefa")
ChatStore.js
  ↓ sendMessage() → chatService.sendMessage()
ChatService.js
  ↓ chama Ash API com prompt
Ash (OpenAI)
  ↓ tool_calls: [{ name: 'create_task_form' }]
ToolService.js
  ↓ processa tool: createTaskForm()
  ↓ retorna: { type: 'form', fields: [...] }
ChatService.js
  ↓ estrutura response com bubble
  ↓ { content: "...", bubble: <FormBubble /> }
SideChat.jsx
  ↓ addMessage() com bubble
MessageBubble.jsx
  ↓ renderiza <FormBubble />
User vê formulário step-by-step no chat
```

### 2. User preenche form step 1
```
FormBubble.jsx
  ↓ onChange → onStepComplete(value)
SideChat.jsx
  ↓ sendMessage("Título: Escrever relatório")
Ash (OpenAI)
  ↓ reconhece input de step 1
  ↓ pede próximo: "Quando?"
  ↓ tool_calls: [{ name: 'show_date_picker' }]
  ↓ retorna: { type: 'date_picker', ... }
MessageBubble.jsx
  ↓ renderiza <DatePickerBubble />
```

---

## ✅ Checklist Implementação

### Phase 1: Preparação (0h - 2h)
- [ ] Analisar arquivo `RELATORIO_CHAT_ARCHITECTURE.md` completo
- [ ] Entender fluxo tool_calls existente
- [ ] Mapear quais bubbles já podem ser renderizadas
- [ ] Arquitetura mental clara

### Phase 2: Componentes Bubble (2h - 6h)
- [ ] TaskListBubble.jsx
- [ ] ProjectCardBubble.jsx
- [ ] FormBubble.jsx (step-by-step)
- [ ] CalendarBubble.jsx (mini)
- [ ] ActionButtonsBubble.jsx
- [ ] ConfirmBubble.jsx

### Phase 3: Integração (6h - 10h)
- [ ] Modificar ChatService para retornar bubble configs
- [ ] Modificar SideChat para renderizar bubbles
- [ ] Modificar ToolService para padronizar responses
- [ ] Testar fluxos completos

### Phase 4: Mobile Optimization (10h - 14h)
- [ ] MobileChatLayout.jsx (full-screen chat)
- [ ] Touch-friendly sizes (48x48px botões)
- [ ] Swipe gestures (completar tarefa)
- [ ] Performance (lazy load bubbles)

### Phase 5: Polish (14h - 18h)
- [ ] Animações fluidas (<300ms)
- [ ] Transitions entre steps
- [ ] Error handling
- [ ] Offline support (cache)

---

## 🚀 Vantagens Chat-Centered Mobile

| Aspecto | Benefício |
|---------|-----------|
| **UX** | Natural, conversacional, zero learning curve |
| **Navigation** | Zero navigation confusion (tudo em 1 lugar) |
| **Interactions** | Touch-friendly inline actions |
| **Performance** | Menos routing, menos estado |
| **Engagement** | Chat = habit forming (push notifications) |
| **Accessibility** | Voice commands (built-in via chat) |
| **Offline** | Chat pode funcionar offline |

---

## ⚠️ Desafios & Soluções

| Desafio | Solução |
|---------|---------|
| **Bubbles muito longas** | Pagination: "[Ver mais] [1-10 de 45]" |
| **Formulários complexos** | Step-by-step (já é conversacional) |
| **Edição de tarefas** | Drawer/bottom sheet (não quebra chat) |
| **Múltiplas ações** | Action buttons inline (não menu) |
| **Performance** | Virtual scrolling (200+ messages) |
| **State management** | Manter mesmo useChatStore (não duplicar) |

---

## 📌 Exemplo Prático: "Criar tarefa" Completo

### Sequência Visual

```
[Chat Screen]
┌──────────────────────────┐
│ Ash: Como posso ajudar?  │
└──────────────────────────┘

User: "Criar tarefa"

┌──────────────────────────┐
│ Ash: Qual é o nome?      │
│ [_____title_input____]   │ ← FormBubble Step 1
└──────────────────────────┘

User digita: "Escrever relatório"

┌──────────────────────────┐
│ Ash: Qual a data?        │
│ [< Jan 15 >]             │ ← CalendarBubble
│ Próximas: [15][16][17]   │
└──────────────────────────┘

User clica: 15

┌──────────────────────────┐
│ Ash: Qual a prioridade?  │
│ [Alta][Média][Baixa]     │ ← ActionButtonsBubble
└──────────────────────────┘

User clica: Alta

┌──────────────────────────┐
│ Ash: Pronto! ✓           │
│ [Tarefa criada]          │
│ Escrever relatório       │ ← ConfirmBubble
│ 📅 15 de Jan | 🔴 Alta   │
│ [Ver] [Editar]           │
└──────────────────────────┘
```

### Código

```jsx
// FormBubble.jsx - Step-by-step
export function FormBubble({ onComplete }) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState({});
  
  const steps = [
    { field: 'title', label: 'Nome da tarefa', input: 'text' },
    { field: 'date', label: 'Data', input: 'date' },
    { field: 'priority', label: 'Prioridade', input: 'select', options: ['Alta', 'Média', 'Baixa'] }
  ];
  
  const currentStep = steps[step];
  
  return (
    <div className="p-3 bg-white/5 rounded-lg space-y-3">
      <p className="text-sm">{currentStep.label}</p>
      
      {currentStep.input === 'text' && (
        <input 
          type="text"
          placeholder={currentStep.label}
          onChange={(e) => {
            setValues({...values, [currentStep.field]: e.target.value});
            if (step < steps.length - 1) {
              setTimeout(() => setStep(step + 1), 300);
            } else {
              onComplete(values);
            }
          }}
          autoFocus
          className="w-full h-9 px-3 bg-black/20 rounded text-sm"
        />
      )}
      
      {currentStep.input === 'select' && (
        <div className="flex gap-2">
          {currentStep.options.map(opt => (
            <button
              key={opt}
              onClick={() => {
                setValues({...values, [currentStep.field]: opt});
                onComplete(values);
              }}
              className="flex-1 h-9 bg-white/10 hover:bg-white/20 rounded text-xs"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      
      {step > 0 && (
        <button 
          onClick={() => setStep(step - 1)}
          className="text-xs opacity-60 hover:opacity-100"
        >
          ← Voltar
        </button>
      )}
    </div>
  );
}
```

---

## 🎯 Resumo Final

### ✨ Chat-Centered Mobile = Perfeito porque:

1. **Ash já comanda via tool calls** (sistema existe)
2. **Message bubbles podem renderizar UI** (existe base)
3. **Step-by-step é natural em chat** (UX conversacional)
4. **Mobile natural = chat é native-app pattern** (iOS/Android)
5. **Menos navegação = melhor UX** (tudo em 1 lugar)

### 🚀 Próximas Ações

**Você quer que eu:**

1. ✏️ Implemente os componentes bubble (TaskList, Form, Calendar)?
2. 📋 Crie a integração ChatService → Bubbles?
3. 🧪 Crie exemplos de fluxos completos?
4. 📱 Adapte SideChat para mobile (full-screen)?
5. 🎨 Crie o design system para bubbles?

---

**Status:** 🟢 Conceito validado + Arquitetura clara + Sistema já existe

Este é o **futuro do Prana mobile**: Ash no centro, tudo acontece no chat. 🚀
