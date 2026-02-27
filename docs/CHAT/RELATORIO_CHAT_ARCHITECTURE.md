# 📊 RELATÓRIO COMPLETO: Arquitetura do Chat Ash V8.0

## 1. **TOOL CALLS SYSTEM** 

### 1.1 Onde as Tools são Definidas

**Arquivo Principal:** [`src/ai_services/toolService.js`](src/ai_services/toolService.js)

As tools seguem um padrão de **dupla exportação**:
```javascript
export const tool_name = {
  declaration: { ... },    // Schema para IA
  handler: async () => { } // Lógica de execução
}
```

### 1.2 Tools Disponíveis no Sistema

#### **1. Proposta de Ação (Draft Mode)**
```javascript
export const propose_execution = {
    declaration: {
        name: "propose_execution",
        description: "Use para ações complexas/destrutivas. Retorna card de confirmação.",
        parameters: {
            title, description, toolName, toolArguments, impactLevel: ['low','medium','high','critical']
        }
    },
    handler: async (args) => ({
        success: true,
        message: `Gerei uma proposta: ${args.title}`,
        client_action: {
            type: 'PROPOSE_ACTION', 
            data: { title, description, impact, toolToExecute, argsToExecute }
        }
    })
}
```

#### **2. Gestão de Hierarquia (Criação)**
```javascript
export const manage_hierarchy = {
    name: "manage_hierarchy",
    description: "Cria Tarefas, Projetos, Documentos na estrutura.",
    parameters: {
        userId, itemType: ['task','project','document'], title, 
        path: "Prana/Dev", // Vazio = Inbox
        properties: { description, priority, status, tags, dueDate, content }
    },
    handler: async ({ userId, itemType, title, path, properties }) => {
        // Cria item no DB, retorna:
        return {
            success: true,
            message: "Item criado",
            item: createdItem,
            client_action: {
                type: 'CHANGE_VIEW',
                view: itemType === 'project' ? 'PROJECT_CANVAS' : 'DASHBOARD',
                data: { highlightIds: [createdItem.id] } // Para "dança"
            }
        }
    }
}
```

#### **3. Controle de Interface**
```javascript
export const change_view = {
    name: "change_view",
    description: "Navega para uma view específica.",
    parameters: {
        viewType: ['DASHBOARD', 'PLANNER_WEEKLY', 'SHEET_VIEW', 'MINDMAP_BOARD', 
                   'CHAIN_VIEW', 'LOGBOOK', 'INBOX_VIEW', 'HOLO_CANVAS', 'TAG_CANVAS'],
        projectId, displayContext: { focusId, message }
    },
    handler: async (args) => ({
        success: true,
        client_action: { type: 'CHANGE_VIEW', view: args.viewType, ... }
    })
}
```

#### **4. Gestão da Inbox**
```javascript
export const manage_inbox = {
    name: "manage_inbox",
    parameters: {
        userId, 
        action: ['list', 'promote_task', 'promote_project', 'delete'],
        itemId
    }
}
```

#### **5. UI Generativa (HoloCanvas)**
```javascript
export const render_dynamic_ui = {
    name: "render_dynamic_ui",
    parameters: {
        layout: ['grid', 'focus', 'list', 'split'],
        title, widgets: [], highlightIds: []
    }
}
```

#### **6. Getters (Contexto)**
```javascript
export const get_available_tags = { /* Lista tags */ }
export const search_knowledge = { /* RAG Search */ }
export const perform_system_audit = { /* Auditoria */ }
```

### 1.3 Como as Tools são Descobertas

**Em [`src/ai_services/chatService.js`](src/ai_services/chatService.js):**

```javascript
// Mapeamento automático
const functionDeclarations = Object.values(toolService).map(tool => tool.declaration);
const availableHandlers = Object.values(toolService).reduce((acc, tool) => {
  acc[tool.declaration.name] = tool.handler;
  return acc;
}, {});
```

Isso permite que:
1. **OpenAI** receba `tools: [functionDeclarations]` para seleção
2. **Gemini** receba `functionDeclarations` como opção
3. A IA escolha qual tool usar baseado no contexto

### 1.4 Fluxo de Execução da Tool

```javascript
// Em chatService.js - Loop Principal
const toolCall = toolCalls[0]; // IA escolheu uma tool
const fnName = toolCall.function.name;
let fnArgs = JSON.parse(toolCall.function.arguments);

// Busca o handler e executa
const toolResult = await availableHandlers[fnName](fnArgs);

// Envia resultado de volta para a IA
history.push({ role: 'tool', tool_call_id: toolCall.id, content: JSON.stringify(toolResult) });

// Se houver client_action, retorna para o frontend
if (toolResult.client_action) {
    return { response: completionText, client_action: toolResult.client_action };
}
```

### 1.5 Tools Acessíveis via Ash no Chat

**TODAS as tools acima** são automaticamente acessíveis ao Ash via chat.

A IA escolhe quale usar baseado no system prompt em [`getSystemPrompt()`](src/ai_services/chatService.js#L27):

```javascript
=== REGRAS DE OURO (S.O.C.D.) ===
1. Ações Simples: Use 'manage_hierarchy' ou 'manage_inbox' diretamente.
2. Ações Complexas/Destrutivas: Use SEMPRE 'propose_execution'. 
3. Visualização: Use 'render_dynamic_ui' para responder com gráficos/listas.
4. Contexto: Analise o currentView para decidir abordagem (ORGANIZE, CREATE, GERAL).
```

---

## 2. **MESSAGE BUBBLES** 

### 2.1 Renderização de Message Bubbles

**Arquivo:** [`src/components/chat/MessageBubble.jsx`](src/components/chat/MessageBubble.jsx)

Estrutura básica:

```jsx
function MessageBubble({ message, isAiThinking = false }) {
    const isUser = message.role === 'user';
    const toolResponse = message.toolResponse || {};
    const clientAction = toolResponse.client_action;
    
    // Renderiza 4 tipos de conteúdo:
    // 1. Texto com Markdown (com highlight de links)
    // 2. Card de Proposta (Draft Mode)
    // 3. Anexos de arquivo
    // 4. Timestamp
}
```

### 2.2 Componentes React em Message Bubbles

**SIM!** Message bubbles podem renderizar componentes React complexos:

#### **Exemplo 1: Links Inteligentes**
```jsx
// Parser de links internos [Texto](task:id) ou [Texto](project:id)
const linkPattern = /\[([^\]]+)\]\((task|project):([^)]+)\)/g;

// Renderiza como botão com highlight
<span 
    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-accent/20"
    onMouseEnter={() => handleHighlight(itemId, true)}  // "Dança" no canvas
    onMouseLeave={() => handleHighlight(itemId, false)}
>
    {itemType === 'project' ? <Folder /> : <CheckSquare />}
    {linkText}
</span>
```

#### **Exemplo 2: Card de Proposta (ActionConfirmationCard)**
```jsx
{/* 2. CARD DE CONFIRMAÇÃO (DRAFT MODE) */}
{isProposal && (
    <div className="mt-2 w-full max-w-md animate-in slide-in-from-top-2 fade-in">
        <ActionConfirmationCard 
            proposal={clientAction.data} 
            onExecuted={handleProposalExecuted}
        />
    </div>
)}
```

#### **Exemplo 3: Markdown Renderizado**
```jsx
<ReactMarkdown 
    components={{
        p: ({ children }) => <p className="mb-2">{children}</p>,
        code: ({ inline, className, children }) => {
            // Código inline ou bloco com syntax highlight
            if (!inline && className) {
                return (
                    <div className="relative group/code my-3">
                        <pre className="glass-effect rounded-lg p-3">
                            <code className={className}>{children}</code>
                        </pre>
                        {/* Botão Copy */}
                        <Button onClick={() => navigator.clipboard.writeText(children)}>
                            <Copy className="h-3 w-3" />
                        </Button>
                    </div>
                );
            }
        }
    }}
>
    {message.content}
</ReactMarkdown>
```

#### **Exemplo 4: Anexos de Arquivo**
```jsx
{safeMessage.file_urls.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-1">
        {safeMessage.file_urls.map((fileUrl, idx) => (
            <div key={idx} className="p-2 glass-effect rounded-lg flex items-center gap-2">
                <Paperclip className="w-4 h-4 opacity-60 text-accent" />
                <a href={fileUrl} target="_blank" className="text-xs text-accent/80">
                    {fileUrl.split('/').pop()}
                </a>
            </div>
        ))}
    </div>
)}
```

### 2.3 Message Bubble Complexo - Exemplo Prático

**Cenário:** Ash cria uma tarefa + propõe execução

```jsx
<MessageBubble message={{
    id: 'msg-123',
    role: 'assistant',
    content: 'Vou criar uma tarefa de "Refatorar componente ChatKanban"...',
    toolResponse: {
        client_action: {
            type: 'PROPOSE_ACTION',
            data: {
                title: 'Criar Tarefa: Refatorar',
                description: 'Criar nova tarefa no projeto Dev/Frontend',
                impact: 'medium',
                toolToExecute: 'manage_hierarchy',
                argsToExecute: {
                    userId: 'user-123',
                    itemType: 'task',
                    title: 'Refatorar ChatKanban',
                    path: 'Prana/Dev/Frontend',
                    properties: {
                        description: 'Separar estilos em arquivo dedicado',
                        priority: 'high',
                        tags: ['refactor', 'chat']
                    }
                }
            }
        }
    }
}} />
```

Renderiza:
1. **Texto:** "Vou criar uma tarefa..."
2. **ActionConfirmationCard:** Com botões "Confirmar & Executar" e "Cancelar"
3. **Detalhes técnicos:** Função `manage_hierarchy(...)`
4. **Indicador visual:** Borda azul/vermelha (baseado em impact)

---

## 3. **CHAT ARCHITECTURE - Fluxo Completo** 

### 3.1 Diagrama do Fluxo Chat → Tool → Response

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                                 │
│                                                                  │
│  User: "Cria uma tarefa"                                         │
│         ↓                                                         │
│  usePranaChat.sendMessage()                                      │
│         ↓                                                         │
│  useChatStore.sendMessage() [Zustand]                            │
│  - Adiciona mensagem do usuário ao estado                        │
│  - Chama POST /ai/chat                                           │
│         ↓                                                         │
└─────────────────────────────────────────────────────────────────┘
               ↓ HTTP POST /ai/chat
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND (Express)                                                │
│                                                                  │
│  aiRoutes.post('/chat') [src/api/aiRoutes.js]                   │
│  - Busca histórico em DB                                         │
│  - Chama chatService.runChat(userId, nexusId, message, history) │
│         ↓                                                         │
│  chatService.runChat() [src/ai_services/chatService.js]          │
│  - Monta system prompt com S.O.C.D.                              │
│  - Envia para OpenAI/Gemini com tools disponíveis                │
│         ↓                                                         │
│  IA seleciona tool: "manage_hierarchy"                           │
│         ↓                                                         │
│  toolService.manage_hierarchy.handler({ args }) [src/ai_services/toolService.js]
│  - Valida e executa contra DB (Drizzle ORM)                      │
│  - Retorna { success, message, item, client_action }             │
│         ↓                                                         │
│  chatService.runChat() continua loop                             │
│  - IA recebe resultado e formula resposta final                  │
│  - Salva mensagem + resposta em DB (nexusMessages)               │
│  - Retorna { response, client_action }                           │
│         ↓                                                         │
└─────────────────────────────────────────────────────────────────┘
               ↓ HTTP Response JSON
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND (React) - Renderização                                  │
│                                                                  │
│  useChatStore recebe resposta                                    │
│  - Adiciona mensagem do Ash ao estado                            │
│  - Se houver tool_calls: renderiza ToolCallResultCard            │
│  - Se houver client_action: dispara eventos (dança, navegação)   │
│         ↓                                                         │
│  Chat.jsx renderiza:                                             │
│  {messages.map(msg => {                                          │
│      if (msg.tool_calls?.includes('create_' || 'get_project'))  │
│          return <ToolCallResultCard />;                          │
│      return <MessageBubble />;                                   │
│  })}                                                             │
│         ↓                                                         │
│  ToolCallResultCard renderiza a view apropriada                  │
│  - create_task → SingleItemCard                                  │
│  - get_project_view_kanban → ChatKanbanView                      │
│  - render_dynamic_ui → HoloCanvas                                │
│         ↓                                                         │
│  MessageBubble renderiza o texto da IA                           │
│  - Se houver PROPOSE_ACTION → ActionConfirmationCard             │
│  - User clica "Executar" → Chama handler direto no frontend      │
│         ↓                                                         │
│  UI atualizada com resultado                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Código do Fluxo Passo-a-Passo

#### **Passo 1: Frontend Envia Mensagem**
[`src/hooks/usePranaChat.jsx`](src/hooks/usePranaChat.jsx#L62):
```javascript
const sendMessage = async (userMessage) => {
    // 1. Feedback otimista
    const userMsgObject = {
        id: generateId('msg'),
        role: 'user',
        content: userMessage,
        created_date: new Date().toISOString()
    };
    addMessage(userMsgObject);

    // 2. Envia para backend
    const response = await apiClient.post('/ai/chat', {
        nexusId, // Se houver contexto específico
        message: userMessage,
    });

    // 3. Processa resposta
    const aiMsgObject = {
        id: generateId('msg'),
        role: 'assistant',
        content: data.response,
        tool_calls: data.tool_calls, // Importante!
        toolResponse: data.toolResponse
    };
    addMessage(aiMsgObject);

    // 4. Se houver client_action, dispara evento
    if (data.client_action) {
        window.dispatchEvent(new CustomEvent('prana:client-action', {
            detail: data.client_action
        }));
    }
};
```

#### **Passo 2: Backend Processa**
[`src/ai_services/chatService.js`](src/ai_services/chatService.js#L67):
```javascript
export const runChat = async (userId, nexusId, userMessage, nexusHistory, context = {}) => {
  // 1. Seleciona cliente (OpenAI ou Gemini)
  const { client, model, type } = selectClientAndModel();
  
  // 2. Monta system prompt com regras S.O.C.D.
  const systemInstruction = getSystemPrompt(context, userSettings);
  
  // 3. Monta histórico para IA
  const history = nexusHistory.map(msg => ({ 
      role: msg.role === 'user' ? 'user' : 'model', 
      content: msg.content 
  }));
  history.push({ role: 'user', content: userMessage });

  // 4. Envia para IA com tools
  const response = await client.chat.completions.create({
      model,
      messages: history,
      tools: functionDeclarations.map(d => ({ type: 'function', function: d })),
      tool_choice: "auto" // IA decide se usar tool ou não
  });

  // 5. Processa resposta
  const toolCalls = response.choices[0].message.tool_calls;
  
  if (!toolCalls) {
      // Sem tool calls - resposta de texto puro
      const text = response.choices[0].message.content;
      await db.insert(schema.nexusMessages).values({ 
          nexusId, role: 'model', content: text 
      });
      return { response: text };
  }

  // 6. Loop de tools
  for (const toolCall of toolCalls) {
      const fnName = toolCall.function.name;
      const fnArgs = JSON.parse(toolCall.function.arguments);
      
      // Executa handler
      const toolResult = await availableHandlers[fnName](fnArgs);
      
      // Envia resultado de volta para IA
      history.push({ 
          role: 'tool', 
          tool_call_id: toolCall.id, 
          name: fnName, 
          content: JSON.stringify(toolResult) 
      });

      // Se houver client_action, retorna
      if (toolResult.client_action) {
          return { 
              response: toolResult.message, 
              client_action: toolResult.client_action 
          };
      }
  }
};
```

#### **Passo 3: Frontend Renderiza**
[`src/pages/Chat.jsx`](src/pages/Chat.jsx#L134):
```jsx
{messages.map((message) => {
    // Detecta se a mensagem tem tool result visual
    const visualTool = message.tool_calls?.find(tc => 
        tc.function?.name?.includes('create_') || 
        tc.function?.name?.includes('get_project_view')
    );
    
    if (visualTool) {
        // Renderiza card com resultado visual
        return (
            <motion.div key={message.id} className="mb-4 w-full">
                <ToolCallResultCard 
                    toolName={visualTool.function.name}
                    result={toolData} 
                    status="success"
                />
            </motion.div>
        );
    }
    
    // Caso contrário, renderiza bubble de texto
    return <MessageBubble key={message.id} message={message} />;
})}
```

### 3.3 Pode Renderizar UI Complexa?

**SIM!** Existem várias formas:

#### **Forma 1: Via ToolCallResultCard (Recomendado)**

ToolCallResultCard renderiza vistas complexas baseado no nome da tool:

```javascript
// Em ToolCallResultCard.jsx
switch(toolName) {
    case 'get_project_view_general': 
        return <ChatGeneralView data={result} />;
    case 'get_project_view_sheet': 
        return <ChatSheetView data={result} />;
    case 'get_project_view_kanban': 
        return <ChatKanbanView data={result} />;
    case 'get_project_view_map': 
        return <ChatMapView data={result} />;
    case 'get_project_view_chain': 
        return <ChatChainView data={result} />;
    case 'create_task': 
        return <SingleItemCard item={result.task} type="task" />;
}
```

Isso significa que a tool pode retornar dados, e o frontend decide qual componente renderizar!

#### **Forma 2: Via render_dynamic_ui (HoloCanvas)**

```javascript
export const render_dynamic_ui = {
    handler: async (args) => ({
        client_action: { 
            type: 'CHANGE_VIEW', 
            view: 'HOLO_CANVAS', 
            data: args // { layout, widgets, title }
        }
    })
}
```

Abre o HoloCanvas (nova aba/modal) com UI generativa.

#### **Forma 3: Via ActionConfirmationCard (Draft Mode)**

```javascript
export const propose_execution = {
    handler: async (args) => ({
        client_action: {
            type: 'PROPOSE_ACTION', 
            data: { title, description, impact, toolToExecute, argsToExecute }
        }
    })
}
```

Renderiza card de confirmação dentro da bubble.

---

## 4. **COMPONENTES QUE FUNCIONAM EM CHAT**

### 4.1 Componentes de Visualização Inline

#### **1. ChatGeneralView** [`src/components/chat/ChatGeneralView.jsx`](src/components/chat/ChatGeneralView.jsx)
```jsx
// Renderiza: Cabeçalho, Barra de Progresso, Stats (3 colunas)
// Seção de Energia (EnergySummaryBoard)
// Listas de Foco Imediato e Bloqueios

export default function ChatGeneralView({ data }) {
    const { project = {}, tasks = [], metrics = {}, overview = {} } = data;
    
    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Cabeçalho + Progresso */}
            {/* Stats Grid (3 cols) */}
            {/* Energy Summary Board */}
            {/* Listas de Tarefas */}
        </div>
    );
}
```

#### **2. ChatSheetView** [`src/components/chat/ChatSheetView.jsx`](src/components/chat/ChatSheetView.jsx)
```jsx
// Renderiza: Tabela de tarefas com:
// - Colunas: Título, Status, Priority, Due Date, Tags
// - Busca/Filtro integrado
// - Modal de edição ao clicar
// - Drag & drop para status

export default function ChatSheetView({ data, projectId }) {
    const [columns, setColumns] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Status</TableHead>
                    {/* ... mais colunas ... */}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tasks.map(task => (
                    <TableRow key={task.id} onClick={() => setModalOpen(true)}>
                        {/* Renderiza dados da tarefa */}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
```

#### **3. ChatKanbanView** [`src/components/chat/ChatKanbanView.jsx`](src/components/chat/ChatKanbanView.jsx)
```jsx
// Renderiza: Quadro Kanban com:
// - 4 colunas: A Fazer, Em Progresso, Revisão, Concluído
// - Cards draggáveis (hello-pangea/dnd)
// - Fullscreen toggle button
// - Modal de edição

export default function ChatKanbanView({ data, projectId }) {
    const [columns, setColumns] = useState({});
    const [isFullScreen, setIsFullScreen] = useState(false);
    
    return (
        <div style={isFullScreen ? { position: 'fixed', ... } : { height }}>
            <DragDropContext onDragEnd={onDragEnd}>
                {columnOrder.map(colId => (
                    <Droppable key={colId} droppableId={colId}>
                        {/* Renderiza coluna + cards */}
                    </Droppable>
                ))}
            </DragDropContext>
            <Button onClick={() => setIsFullScreen(!isFullScreen)}>
                {isFullScreen ? <Minimize2 /> : <Maximize2 />}
            </Button>
        </div>
    );
}
```

#### **4. ChatMapView** [`src/components/chat/ChatMapView.jsx`](src/components/chat/ChatMapView.jsx)
```jsx
// Renderiza: Mapa Mental com:
// - ReactFlow para visualização de dependências
// - Nodes e edges customizados
// - Interatividade (drag, zoom)

export default function ChatMapView(props) {
    return (
        <ReactFlowProvider>
            <ChatMapViewContent {...props} />
        </ReactFlowProvider>
    );
}
```

#### **5. ChatChainView** [`src/components/chat/ChatChainView.jsx`](src/components/chat/ChatChainView.jsx)
```jsx
// Renderiza: Grafo de dependências entre tarefas
// Similar ao ChatMapView mas focado em predecessores/sucessores
```

### 4.2 SingleItemCard (Criação Simples)

[`src/components/chat/ToolCallResultCard.jsx`](src/components/chat/ToolCallResultCard.jsx#L19):
```jsx
const SingleItemCard = ({ item, type, onOpen }) => (
    <div className="p-4 border border-green-500/20 rounded-xl bg-green-500/5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                {type === 'project' ? <LayoutDashboard /> : <CheckCircle />}
            </div>
            <div>
                <p className="text-xs text-green-400 font-medium uppercase">
                    {type === 'task' ? 'Tarefa Criada' : 'Projeto Iniciado'}
                </p>
                <p className="font-semibold text-sm text-foreground">
                    {item.title}
                </p>
            </div>
        </div>
        <Button variant="outline" size="sm" onClick={onOpen}>
            Abrir Detalhes
        </Button>
    </div>
);
```

Renderiza quando Ash cria uma tarefa ou projeto simples.

### 4.3 ActionConfirmationCard (Draft Mode)

[`src/components/chat/ActionConfirmationCard.jsx`](src/components/chat/ActionConfirmationCard.jsx):
```jsx
export default function ActionConfirmationCard({ proposal, onExecuted }) {
    const { title, description, impact, toolToExecute, argsToExecute } = proposal;
    
    const handleConfirm = async () => {
        // Executa a tool handler diretamente no frontend
        const handler = Object.values(toolService).find(
            t => t.declaration.name === toolToExecute
        )?.handler;
        
        const result = await handler(argsToExecute);
        onExecuted(result);
    };
    
    return (
        <div className={isCritical ? "bg-red-500/5 border-red-500/20" : "bg-blue-500/5 border-blue-500/20"}>
            <div className="flex items-start gap-3">
                {isCritical ? <IconAlertTriangle /> : <IconTerminal />}
                <div>
                    <h3>{title}</h3>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            
            <div className="bg-black/20 rounded p-2 font-mono text-[10px]">
                function {toolToExecute}(...)
            </div>
            
            <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={handleCancel}>Cancelar</Button>
                <Button 
                    className={isCritical ? "bg-red-600" : "bg-blue-600"}
                    onClick={handleConfirm}
                >
                    Confirmar & Executar
                </Button>
            </div>
        </div>
    );
}
```

### 4.4 PranaFormModal (Edição Detalhada)

Quando usuário clica "Abrir Detalhes" em um SingleItemCard ou cell em ChatSheetView:

```jsx
<PranaFormModal
    isOpen={modalOpen}
    onClose={() => setModalOpen(false)}
    itemType={modalItemType} // 'task' ou 'project'
    editingItemId={modalItemId}
/>
```

Abre modal com formulário completo do item.

### 4.5 Resumo de Componentes em Chat

| Componente | Trigger | Renderiza |
|-----------|---------|----------|
| **ChatGeneralView** | `get_project_view_general` | Visão geral + stats + energy |
| **ChatSheetView** | `get_project_view_sheet` | Tabela interativa de tarefas |
| **ChatKanbanView** | `get_project_view_kanban` | Quadro Kanban com drag & drop |
| **ChatMapView** | `get_project_view_map` | Mapa mental com ReactFlow |
| **ChatChainView** | `get_project_view_chain` | Grafo de dependências |
| **SingleItemCard** | `create_task`, `create_project` | Notificação de criação + botão |
| **ActionConfirmationCard** | `propose_execution` (PROPOSE_ACTION) | Card de confirmação de ação |
| **PranaFormModal** | Click em item | Editor completo do item |

---

## 5. **INTEGRATION POINTS**

### 5.1 SideChat.jsx - Processamento de Responses

[`src/components/chat/SideChat.jsx`](src/components/chat/SideChat.jsx):

```jsx
export default function SideChat() {
    const { 
        messages, sendMessage, isLoading, 
        activeContext, clearContext, clearMessages 
    } = useChatStore();

    // 1. ENVIO
    const handleSend = async () => {
        if (!input.trim()) return;
        const msg = input;
        setInput('');
        await sendMessage(msg); // Dispara fluxo completo
    };

    // 2. RENDERIZAÇÃO
    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-14 border-b">
                <IconChat /> ASH | Neural Interface
                <Button onClick={clearMessages}>🗑 Limpar</Button>
            </div>

            {/* Status */}
            <div className="px-4 py-2 space-y-2 bg-muted/5 border-b">
                {/* Indicador de Foco (Timer) */}
                {isRunning && activeTaskTitle && (
                    <div className="p-2 bg-emerald-500/5 border-emerald-500/20 rounded-md">
                        <IconClock /> Em Foco: {activeTaskTitle}
                    </div>
                )}

                {/* Indicador de Contexto */}
                {activeContext && (
                    <div className="p-2 bg-indigo-500/5 border-indigo-500/20 rounded-md">
                        <IconLink /> Contexto: {activeContext.title}
                        <button onClick={clearContext}>✕</button>
                    </div>
                )}
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
                {messages.map((msg, i) => (
                    <div key={msg.id || i} className={msg.role === 'user' ? 'justify-end' : 'justify-start'}>
                        <div className={msg.role === 'user' ? 'bg-primary/10' : 'bg-muted/40'}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="bg-muted/40 px-3 py-2 rounded-2xl flex items-center gap-2">
                        <Loader2 className="animate-spin" />
                        <span className="text-[10px] animate-pulse">Pensando...</span>
                    </div>
                )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t">
                <div className="flex items-center gap-2 rounded-2xl p-2 bg-muted/10 border">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={activeContext ? `Sobre: ${activeContext.title}...` : "Converse com Ash..."}
                        disabled={isLoading}
                    />
                    <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Send />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
```

**Processamento:**
1. `handleSend()` → `useChatStore.sendMessage()`
2. Store chama `apiClient.post('/ai/chat', ...)`
3. Backend retorna `{ response, client_action, tool_calls }`
4. Store dispara `window.dispatchEvent('prana:client-action')` se houver ação
5. Components escutam esse evento global

### 5.2 ChatService.jsx - Gerenciamento de Tool Calls

[`src/ai_services/chatService.js`](src/ai_services/chatService.js):

```javascript
export const runChat = async (userId, nexusId, userMessage, nexusHistory, context = {}) => {
  // 1. Descobre IA disponível
  const { client, model, type } = selectClientAndModel();
  
  // 2. Personaliza prompt com S.O.C.D. + user settings
  const systemInstruction = getSystemPrompt(context, userSettings);
  
  // 3. Histórico conversacional
  const history = nexusHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      content: msg.content
  }));
  history.push({ role: 'user', content: userMessage });

  // 4. Loop de chamadas
  let loopCount = 0;
  const maxLoops = 5; // Máximo de tool calls consecutivas
  
  while (loopCount < maxLoops) {
      loopCount++;
      
      // Chama IA com tools disponíveis
      const response = await client.chat.completions.create({
          model,
          messages: history,
          tools: functionDeclarations.map(d => ({ type: 'function', function: d })),
          tool_choice: "auto"
      });

      let toolCalls = response.choices[0].message.tool_calls;

      // Sem tools: resposta final
      if (!toolCalls || toolCalls.length === 0) {
          const text = response.choices[0].message.content;
          await db.insert(schema.nexusMessages).values({
              nexusId, role: 'model', content: text
          });
          return { response: text };
      }

      // Com tools: executa e volta para IA analisar
      for (const toolCall of toolCalls) {
          const fnName = toolCall.function.name;
          let fnArgs = {};
          try { fnArgs = JSON.parse(toolCall.function.arguments); } catch(e){}
          if (!fnArgs.userId) fnArgs.userId = userId;

          console.log(`[Ash] Tool: ${fnName}`);
          
          // Executa handler
          const toolResult = await availableHandlers[fnName](fnArgs);
          
          // Envia resultado para IA (abre nova iteração do loop)
          history.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              name: fnName,
              content: JSON.stringify(toolResult)
          });

          // Client Action: interrompe loop e retorna para frontend
          if (toolResult.client_action) {
              const completionText = toolResult.message || "Ação processada.";
              await db.insert(schema.nexusMessages).values({
                  nexusId, role: 'model', content: completionText, toolResponse: toolResult
              });
              return {
                  response: completionText,
                  client_action: toolResult.client_action
              };
          }
      }
  }
};
```

**Características principais:**
- **Loop até 5 iterações:** IA pode usar múltiplas tools sequencialmente
- **client_action:** Tool pode sinalizar que deve parar e retornar para frontend
- **Histórico atualizado:** Cada resultado de tool é enviado de volta à IA
- **Salva tudo em DB:** Cada mensagem e tool result é persistido

### 5.3 Message Rendering - Onde Renderiza

[`src/pages/Chat.jsx`](src/pages/Chat.jsx#L130):

```jsx
{messages.map((message) => {
    // 1. Detecta se é resultado visual de tool
    const visualTool = message.tool_calls?.find(tc => 
        tc.function?.name?.includes('create_') || 
        tc.function?.name?.includes('get_project_view')
    );
    
    if (visualTool) {
        // 2. Renderiza a view apropriada
        let toolData = {};
        try { toolData = JSON.parse(visualTool.function.arguments); } catch(e) {}
        
        return (
            <motion.div key={message.id} className="mb-4 w-full">
                <ToolCallResultCard 
                    toolName={visualTool.function.name}
                    result={toolData}
                    status="success"
                />
            </motion.div>
        );
    }
    
    // 3. Caso contrário, renderiza como bubble de texto
    return <MessageBubble key={message.id} message={message} />;
})}
```

**ToolCallResultCard** [`src/components/chat/ToolCallResultCard.jsx`](src/components/chat/ToolCallResultCard.jsx):

```jsx
export default function ToolCallResultCard({ toolName, result, status }) {
    const renderContent = () => {
        const renderView = (Component, label) => (
            <Suspense fallback={<Loader2 />}>
                <div className="w-full overflow-hidden rounded-xl border border-white/10 bg-black/20">
                    <Component data={result} />
                </div>
            </Suspense>
        );

        switch(toolName) {
            case 'get_project_view_general': 
                return renderView(ChatGeneralView, 'Visão Geral');
            case 'get_project_view_sheet': 
                return renderView(ChatSheetView, 'Planilha');
            case 'get_project_view_kanban': 
                return renderView(ChatKanbanView, 'Kanban');
            case 'get_project_view_map': 
                return renderView(ChatMapView, 'Mapa Mental');
            case 'get_project_view_chain': 
                return renderView(ChatChainView, 'Dependências');
            case 'create_task':
                return <SingleItemCard item={result.task} type="task" onOpen={...} />;
            case 'create_project':
                return <SingleItemCard item={result.project} type="project" onOpen={...} />;
            default:
                return <div className="text-green-400">✓ {result.message}</div>;
        }
    };

    return (
        <div className="w-full my-2">
            {toolName.startsWith('get_project_view') ? (
                renderContent()
            ) : (
                <div className="max-w-md">
                    {renderContent()}
                </div>
            )}
        </div>
    );
}
```

---

## 6. **EXEMPLOS PRÁTICOS**

### Exemplo 1: Usuário Pede "Cria uma tarefa"

**Input:** "Cria uma tarefa de refatorar o ChatKanban no projeto Prana/Dev"

**Fluxo:**

1. **Frontend:** `usePranaChat.sendMessage("Cria uma tarefa...")`

2. **Backend - chatService.runChat:**
   - System prompt inclui: "Use 'manage_hierarchy' para criar tarefas"
   - Envia para IA: `[sistema, histórico, nova mensagem, tools]`
   - IA responde: "Vou criar essa tarefa para você"
   - IA seleciona tool: `manage_hierarchy`
   - Arguments: `{ userId: "...", itemType: "task", title: "Refatorar ChatKanban", path: "Prana/Dev", properties: {...} }`

3. **Backend - toolService.manage_hierarchy.handler:**
   - Valida path "Prana/Dev" (já existe)
   - Cria nova tarefa no DB
   - Retorna: `{ success: true, message: "...", item: {...}, client_action: { type: 'CHANGE_VIEW', ... } }`

4. **Backend - chatService continua:**
   - IA recebe resultado
   - Gera resposta final: "Tarefa 'Refatorar ChatKanban' criada com sucesso!"
   - Salva tudo em DB e retorna ao frontend

5. **Frontend - useChatStore:**
   - Recebe `{ response: "Tarefa...", tool_calls: [...], client_action: {...} }`
   - Adiciona mensagem do Ash ao estado
   - Dispara evento `prana:client-action`

6. **Frontend - Chat.jsx renderiza:**
   ```jsx
   {messages.map(msg => {
       const visualTool = msg.tool_calls?.find(tc => tc.function?.name === 'manage_hierarchy');
       if (visualTool) {
           return <ToolCallResultCard toolName="manage_hierarchy" result={...} />;
       }
       return <MessageBubble message={msg} />;
   })}
   ```

7. **ToolCallResultCard renderiza:**
   - Detecta `create_task`
   - Renderiza `<SingleItemCard item={result.task} />`
   - Mostra: "✓ Tarefa Criada - Refatorar ChatKanban [Abrir Detalhes]"

8. **MessageBubble renderiza:**
   - Texto: "Tarefa 'Refatorar ChatKanban' criada com sucesso!"

**Resultado Visual:**
```
┌────────────────────────────────────────┐
│ Ash: Tarefa 'Refatorar ChatKanban'...  │
│                                        │
│ ✓ TAREFA CRIADA                        │
│ Refatorar ChatKanban                   │
│ [Abrir Detalhes]                       │
└────────────────────────────────────────┘
```

---

### Exemplo 2: Usuário Pede "Mostra as tarefas do projeto Prana/Dev em Kanban"

**Input:** "Mostra as tarefas em Kanban"

**Fluxo:**

1. **Frontend:** `sendMessage("Mostra as tarefas em Kanban")`

2. **Backend - chatService:**
   - IA entende que precisa visualizar
   - Seleciona tool: `get_project_view_kanban` (ou equivalente)
   - Busca dados: tarefas agrupadas por status

3. **Backend - retorna:**
   ```json
   {
     "response": "Aqui está o quadro Kanban do projeto",
     "tool_calls": [{
       "function": {
         "name": "get_project_view_kanban",
         "arguments": "{...dados das tarefas por coluna...}"
       }
     }]
   }
   ```

4. **Frontend - Chat.jsx renderiza:**
   ```jsx
   const visualTool = message.tool_calls?.find(tc => 
       tc.function?.name.includes('get_project_view_kanban')
   );
   // true!
   
   return <ToolCallResultCard toolName="get_project_view_kanban" result={toolData} />;
   ```

5. **ToolCallResultCard renderiza:**
   ```jsx
   case 'get_project_view_kanban': 
       return renderView(ChatKanbanView, 'Kanban');
   ```

6. **ChatKanbanView renderiza:**
   - 4 colunas: A Fazer, Em Progresso, Revisão, Concluído
   - Tarefas como cards arrastaveis
   - Botão de fullscreen
   - Modal de edição ao clicar

**Resultado Visual:**
```
┌──────────────────────────────────────────────────────┐
│ Ash: Aqui está o quadro Kanban do projeto           │
│                                                      │
│ ╔════════════════════════════════════╗ [⛶ Fullscreen]│
│ ║ A FAZER │ EM PROGRESSO │ REVISÃO│CONCLUÍDO       ║
│ ║                                                    ║
│ ║ ┌──────────────┐  ┌──────────┐                    ║
│ ║ │ Refatorar    │  │ Integrar │                    ║
│ ║ │ ChatKanban   │  │ API      │                    ║
│ ║ │              │  │          │                    ║
│ ║ │ [priority: H]│  │ priority:│                    ║
│ ║ └──────────────┘  │    M]    │                    ║
│ ║                    └──────────┘                    ║
│ ╚════════════════════════════════════╝              │
└──────────────────────────────────────────────────────┘
```

---

### Exemplo 3: Ash Propõe Ação Complexa (Draft Mode)

**Contexto:** Usuário pede "Reorganiza meu projeto apagando tarefas antigas"

**Fluxo:**

1. **Backend - chatService:**
   - IA detecta ação potencialmente destrutiva
   - Seleciona tool: `propose_execution` (Draft Mode)
   - Arguments:
   ```json
   {
     "title": "Limpeza de Tarefas Antigas",
     "description": "Deletar 23 tarefas concluídas há mais de 90 dias",
     "impactLevel": "high",
     "toolToExecute": "manage_hierarchy",
     "argsToExecute": {
       "userId": "...",
       "action": "delete_old_completed",
       "days": 90
     }
   }
   ```

2. **Backend - toolService.propose_execution.handler:**
   - Não executa, apenas valida a proposta
   - Retorna `client_action: { type: 'PROPOSE_ACTION', data: {...} }`

3. **Frontend - MessageBubble renderiza:**
   - Texto: "Vou fazer uma limpeza de tarefas antigas..."
   - ActionConfirmationCard com:
     - ⚠️ Ícone vermelho (high impact)
     - Título: "Limpeza de Tarefas Antigas"
     - Descrição: "Deletar 23 tarefas..."
     - Code display: `function manage_hierarchy(...)`
     - Botões: [Cancelar] [Confirmar & Executar]

4. **User Action:**
   - Clica "Confirmar & Executar"
   - ActionConfirmationCard executa handler diretamente no frontend
   - `toolService.manage_hierarchy.handler(argsToExecute)`
   - Atualiza UI: "✓ Executado: Limpeza de Tarefas Antigas"

**Resultado Visual:**
```
┌──────────────────────────────────────────────────────┐
│ Ash: Vou fazer uma limpeza de tarefas antigas...     │
│                                                      │
│ ⚠️  LIMPEZA DE TAREFAS ANTIGAS                       │
│ Deletar 23 tarefas concluídas há mais de 90 dias     │
│                                                      │
│ function manage_hierarchy(...) delete_old_completed  │
│                                                      │
│                    [Cancelar] [Confirmar & Executar] │
└──────────────────────────────────────────────────────┘

// Após click:
┌──────────────────────────────────────────────────────┐
│ Ash: Vou fazer uma limpeza de tarefas antigas...     │
│                                                      │
│ ✓ EXECUTADO: Limpeza de Tarefas Antigas              │
└──────────────────────────────────────────────────────┘
```

---

## 7. **CHECKLIST DE FEATURES**

- ✅ Tool Calls automaticamente descobertos do `toolService.js`
- ✅ Message Bubbles renderizam Markdown + componentes React
- ✅ Fluxo Chat → Tool → Response funciona end-to-end
- ✅ UI Complexa renderizável inline (Kanban, Mapa, Sheet)
- ✅ Draft Mode para ações destrutivas (Proposta + Confirmação)
- ✅ ActionConfirmationCard com handlers no frontend
- ✅ "Dança" (highlight) ao passar mouse em links de tarefas
- ✅ Modal de edição ao clicar em itens criados
- ✅ SideChat integrado com contexto (task em foco, projeto)
- ✅ Sistema de personalidade (Personas + System Prompt)
- ✅ Loop de tools (máx. 5 iterações)
- ✅ Persistência em DB (nexusMessages com tool_calls)

---

## 8. **PRÓXIMOS PASSOS / EXTENSÕES**

1. **Novos Componentes em Chat:**
   - Gráficos de progresso (Chart.js)
   - Timeline de eventos
   - Visualizador de arquivos (PDF, código)
   - Integração com câmera/áudio

2. **Novas Tools:**
   - `export_project` (exportar como JSON/CSV)
   - `generate_report` (relatório em PDF)
   - `schedule_recurring_task` (tarefas recorrentes)
   - `integrate_calendar` (Google Calendar, etc.)

3. **Melhorias UI:**
   - Animações de carga mais sofisticadas
   - Themes customizáveis por usuário
   - Modo escuro/claro inteligente
   - Responsividade mobile completa

4. **Segurança:**
   - Rate limiting em tools
   - Validação mais rigorosa de argumentos
   - Auditoria de ações do Ash
   - Permissões granulares por tool

---

**Documento criado:** 12/12/2025  
**Versão:** Chat Ash V8.0  
**Linguagem:** pt-BR
