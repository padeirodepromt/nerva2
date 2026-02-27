# 📊 DIAGRAMAS VISUAIS - Chat Ash V8.0

## 1. Fluxo Completo: Chat → Tool → Response

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                               │
│                              🎭 CHAT ASH V8.0                               │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          FRONTEND (React)                             │   │
│  │                                                                        │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │  USER INPUT                                                    │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ "Cria uma tarefa urgente"                               │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                              ↓                                 │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ usePranaChat.sendMessage(message)                       │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                              ↓                                 │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ useChatStore.sendMessage() [Zustand]                   │ │ │   │
│  │  │  │ - Adiciona msg do user ao estado                        │ │ │   │
│  │  │  │ - setLoading(true)                                      │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                              ↓                                 │ │   │
│  │  │  ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │  │ apiClient.post('/ai/chat', { message, context, ... })  │ │ │   │
│  │  │  │ [HTTP POST REQUEST]                                    │ │ │   │
│  │  │  └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │                              ↓                                 │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                              │                                                 │
│                              │ HTTP                                            │
│                              ↓                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        BACKEND (Express/Node)                        │   │
│  │                                                                        │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ aiRoutes.post('/chat')  [src/api/aiRoutes.js]                │ │   │
│  │  │ - Busca histórico em DB (nexusMessages)                      │ │   │
│  │  │ - Chama chatService.runChat(userId, nexusId, message, ...)  │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ chatService.runChat()  [src/ai_services/chatService.js]       │ │   │
│  │  │                                                                │ │   │
│  │  │  1. selectClientAndModel() → OpenAI ou Gemini               │ │   │
│  │  │  2. getSystemPrompt(context, userSettings)                 │ │   │
│  │  │     ├─ role: "Parceiro Estratégico"                        │ │   │
│  │  │     ├─ tone: "Direto e eficiente"                          │ │   │
│  │  │     └─ S.O.C.D. rules para usar tools                      │ │   │
│  │  │  3. Monta histórico: [system, ...history, user message]   │ │   │
│  │  │  4. Chama IA com tools:                                   │ │   │
│  │  │     client.chat.completions.create({                       │ │   │
│  │  │       model: "gpt-4o",                                      │ │   │
│  │  │       messages: history,                                    │ │   │
│  │  │       tools: [functionDeclarations],                        │ │   │
│  │  │       tool_choice: "auto"                                   │ │   │
│  │  │     })                                                      │ │   │
│  │  │  5. IA responde com ou sem tool_calls                     │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ SEM TOOL CALLS: Resposta Texto                               │ │   │
│  │  │ ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │ │ response.choices[0].message.content                     │ │ │   │
│  │  │ │ "Vou criar uma tarefa urgente para você..."            │ │ │   │
│  │  │ └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ Salva em DB: db.insert(nexusMessages)                       │ │   │
│  │  │ Retorna: { response: "texto" }                              │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              OU                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ COM TOOL CALLS: Executa Tool                                 │ │   │
│  │  │ ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │ │ response.choices[0].message.tool_calls[0]               │ │ │   │
│  │  │ │ {                                                        │ │ │   │
│  │  │ │   function: {                                           │ │ │   │
│  │  │ │     name: "manage_hierarchy",                           │ │ │   │
│  │  │ │     arguments: '{"userId":...,"itemType":"task",}'      │ │ │   │
│  │  │ │   }                                                     │ │ │   │
│  │  │ │ }                                                        │ │ │   │
│  │  │ └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │ │ availableHandlers["manage_hierarchy"](fnArgs)           │ │ │   │
│  │  │ │ toolService.manage_hierarchy.handler({                 │ │ │   │
│  │  │ │   userId: "user-123",                                  │ │ │   │
│  │  │ │   itemType: "task",                                    │ │ │   │
│  │  │ │   title: "Tarefa urgente",                             │ │ │   │
│  │  │ │   path: "Prana/Dev",                                   │ │ │   │
│  │  │ │   properties: { priority: "high" }                     │ │ │   │
│  │  │ │ })                                                     │ │ │   │
│  │  │ └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │              ↓ LÓGICA HANDLER                                 │ │   │
│  │  │ ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │ │ 1. Resolve caminho: "Prana/Dev" → projectId            │ │ │   │
│  │  │ │ 2. Valida usuário tem acesso                           │ │ │   │
│  │  │ │ 3. Insere tarefa em DB:                                │ │ │   │
│  │  │ │    db.insert(schema.tasks).values({                    │ │ │   │
│  │  │ │      id: "task-new-123",                               │ │ │   │
│  │  │ │      title: "Tarefa urgente",                          │ │ │   │
│  │  │ │      projectId: "proj-dev",                            │ │ │   │
│  │  │ │      priority: "high",                                 │ │ │   │
│  │  │ │      ownerId: "user-123",                              │ │ │   │
│  │  │ │      status: "a_fazer",                                │ │ │   │
│  │  │ │      createdAt: new Date()                             │ │ │   │
│  │  │ │    })                                                  │ │ │   │
│  │  │ │ 4. Retorna resultado com client_action                │ │ │   │
│  │  │ └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ ┌──────────────────────────────────────────────────────────┐ │ │   │
│  │  │ │ toolResult = {                                          │ │ │   │
│  │  │ │   success: true,                                        │ │ │   │
│  │  │ │   message: "Tarefa criada",                             │ │ │   │
│  │  │ │   item: { id: "task-new-123", title: "...", ... },    │ │ │   │
│  │  │ │   client_action: {                                      │ │ │   │
│  │  │ │     type: 'CHANGE_VIEW',                                │ │ │   │
│  │  │ │     view: 'DASHBOARD',                                  │ │ │   │
│  │  │ │     data: { highlightIds: ["task-new-123"] }           │ │ │   │
│  │  │ │   }                                                     │ │ │   │
│  │  │ │ }                                                        │ │ │   │
│  │  │ └──────────────────────────────────────────────────────────┘ │ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ Loop: history.push({ role: 'tool', content: JSON.stringify })│ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ Próxima iteração: IA recebe resultado e gera texto final     │ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ response_final = "Tarefa 'Tarefa urgente' criada com sucesso!"│ │   │
│  │  │              ↓                                                 │ │   │
│  │  │ Salva em DB com tool_calls e client_action                  │ │   │
│  │  │ Retorna: {                                                   │ │   │
│  │  │   response: "Tarefa...",                                     │ │   │
│  │  │   tool_calls: [...],                                         │ │   │
│  │  │   client_action: { type: 'CHANGE_VIEW', ... }               │ │   │
│  │  │ }                                                             │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                              ↓ HTTP                                            │
│                         Response JSON                                          │
│                              ↓                                                 │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      FRONTEND RENDERING                              │   │
│  │                                                                        │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ useChatStore recebe resposta                                  │ │   │
│  │  │ - Adiciona mensagem do Ash ao estado                          │ │   │
│  │  │ - setLoading(false)                                           │ │   │
│  │  │ - Salva tool_calls e client_action                            │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ Chat.jsx renderiza messages                                   │ │   │
│  │  │ for each message:                                             │ │   │
│  │  │   - Detecta message.tool_calls                                │ │   │
│  │  │   - Se SIM:                                                   │ │   │
│  │  │      return <ToolCallResultCard toolName={...} />             │ │   │
│  │  │   - Se NÃO:                                                   │ │   │
│  │  │      return <MessageBubble message={...} />                   │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ ToolCallResultCard                                            │ │   │
│  │  │ - Detecta nome da tool                                        │ │   │
│  │  │ - Switch case:                                                │ │   │
│  │  │    case 'create_task': return <SingleItemCard />             │ │   │
│  │  │    case 'get_project_view_kanban': return <ChatKanbanView /> │ │   │
│  │  │    case 'get_project_view_sheet': return <ChatSheetView />   │ │   │
│  │  │    case 'get_project_view_general': return <ChatGeneralView/>│ │   │
│  │  │    ...                                                        │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ SingleItemCard renderiza:                                     │ │   │
│  │  │                                                                │ │   │
│  │  │  ✓ TAREFA CRIADA                                              │ │   │
│  │  │  Tarefa urgente                                               │ │   │
│  │  │  [Abrir Detalhes]                                             │ │   │
│  │  │                                                                │ │   │
│  │  │  (Card com bordas verdes, ícone, animação)                   │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              +                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ MessageBubble renderiza:                                      │ │   │
│  │  │                                                                │ │   │
│  │  │  Ash: Tarefa "Tarefa urgente" criada com sucesso!            │ │   │
│  │  │                                                                │ │   │
│  │  │  (Bubble com markdown, timestamp)                            │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                              ↓                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │ Se houver client_action: CHANGE_VIEW                         │ │   │
│  │  │ → dispatchEvent('prana:client-action')                       │ │   │
│  │  │ → Listeners navegam para DASHBOARD                          │ │   │
│  │  │ → Tarefa aparece em destaque (dança: glow animation)         │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │                                                                        │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│                     ✅ FLUXO COMPLETO FINALIZADO                             │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Arquitetura de Tools

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOOLSERVICE.JS STRUCTURE                     │
└─────────────────────────────────────────────────────────────────┘

                         CADA TOOL = 2 PARTES
                         
                ┌──────────────────────────────────┐
                │  DECLARATION (Para IA)           │
                │                                  │
                │  name: "string"                  │
                │  description: "string"           │
                │  parameters: {                   │
                │    type: "OBJECT",               │
                │    properties: {...},            │
                │    required: [...]               │
                │  }                               │
                └──────────────────────────────────┘
                              │
                    (IA vê essas tools)
                              │
                ┌──────────────────────────────────┐
                │  HANDLER (Executa no Backend)    │
                │                                  │
                │  async (args) => {               │
                │    // Valida                     │
                │    // Executa lógica             │
                │    // Acessa DB                  │
                │    // Retorna resultado          │
                │  }                               │
                └──────────────────────────────────┘
                              │
                    (Frontend processa resultado)


┌─────────────────────────────────────────────────────────────────┐
│                    TOOLS DISPONÍVEIS (V8.0)                      │
└─────────────────────────────────────────────────────────────────┘

1️⃣  PROPOSE_EXECUTION [Draft Mode]
    ├─ Não executa imediatamente
    ├─ Retorna proposta para user confirmar
    ├─ client_action: type: 'PROPOSE_ACTION'
    └─ Uso: Ações destrutivas/complexas

2️⃣  MANAGE_HIERARCHY [Criar Itens]
    ├─ Cria Task, Project ou Document
    ├─ Aceita path com hierarquia: "Prana/Dev"
    ├─ client_action: type: 'CHANGE_VIEW'
    └─ Uso: "Cria uma tarefa"

3️⃣  CHANGE_VIEW [Navegação]
    ├─ Navega para view específica
    ├─ Tipos: DASHBOARD, PLANNER, CALENDAR, MINDMAP, etc
    ├─ client_action: type: 'CHANGE_VIEW'
    └─ Uso: "Abre o planner"

4️⃣  MANAGE_INBOX [Sparks]
    ├─ Lista/Promove/Deleta Sparks (inbox)
    ├─ Ações: list, promote_task, promote_project, delete
    ├─ client_action: type: 'CHANGE_VIEW' (view: INBOX)
    └─ Uso: "Mostra minha inbox"

5️⃣  RENDER_DYNAMIC_UI [HoloCanvas]
    ├─ Gera UI customizada
    ├─ Layouts: grid, focus, list, split
    ├─ client_action: type: 'CHANGE_VIEW' (view: HOLO_CANVAS)
    └─ Uso: "Cria um dashboard"

6️⃣  GET_AVAILABLE_TAGS [Getter]
    ├─ Lista todas as tags
    ├─ Sem client_action
    └─ Uso: Context para IA

7️⃣  SEARCH_KNOWLEDGE [RAG]
    ├─ Busca em knowledge base
    ├─ Sem client_action
    └─ Uso: "Procura por..."

8️⃣  PERFORM_SYSTEM_AUDIT [Auditoria]
    ├─ Gera relatório de sistema
    ├─ Sem client_action
    └─ Uso: "Faz uma auditoria"

┌──────────────────────────────────────────────────────────────┐
│           HOW IA CHOOSES WHICH TOOL TO USE                   │
│                                                              │
│  1. IA recebe: functionDeclarations (todas tools)           │
│  2. IA lê system prompt (S.O.C.D. rules)                    │
│  3. System prompt diz:                                       │
│     - "Ações simples: use manage_hierarchy"                 │
│     - "Ações complexas: SEMPRE use propose_execution"       │
│     - "Visualização: use render_dynamic_ui"                 │
│  4. IA seleciona melhor tool para o context                │
│  5. IA informa arguments para a tool                        │
│  6. Backend executa handler                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Message Bubble Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│                     MESSAGE BUBBLE (ASH)                          │
└──────────────────────────────────────────────────────────────────┘

                  ┌─────────────────────────────────┐
                  │         ESTRUTURA VISUAL         │
                  └─────────────────────────────────┘

     🟠                (Avatar - Prana Logo)
       \
        \_______________________________________________
        │                                               │
        │ "Vou criar uma tarefa para você..."          │ 
        │                                               │  ← Texto Markdown
        │ Você pode:                                    │
        │ 1. **Destacar** importante                   │
        │ 2. `código inline` com syntax               │
        │ 3. Link [Tarefa](task:id123) com hover      │
        │                                               │
        │ ```python                                     │
        │ def hello():                                  │
        │   print("mundo")                              │  ← Código Bloco
        │ ```                                           │
        │ [Copy] ← Botão                                │
        │                                               │
        │_______________________________________________|
        │
        │ 🔗 [Tarefa Relacionada](task:abc)  ← Links      ← Anexos
        │                                                     (se houver)
        │
        │ 14:30 ← Timestamp
        │
        └─────────────────────────────────────────────────────────────


                  ┌─────────────────────────────────┐
                  │    ESTADOS ESPECIAIS POSSÍVEIS   │
                  └─────────────────────────────────┘


        ┌──────────────────────────────────────────┐
        │  STATE 1: PROPOSTA (Draft Mode)          │
        │                                          │
        │ Texto normal...                          │
        │                                          │
        │ ┌────────────────────────────────────┐  │
        │ │ ⚠️  AÇÃO PROPOSTA                  │  │
        │ │ Deletar 50 tarefas antigas         │  │
        │ │ Remover itens completados...       │  │
        │ │                                    │  │
        │ │ function delete_tasks_batch(...)   │  │
        │ │                                    │  │
        │ │        [Cancelar] [Confirmar]      │  │
        │ └────────────────────────────────────┘  │
        └──────────────────────────────────────────┘


        ┌──────────────────────────────────────────┐
        │  STATE 2: PENSANDO                       │
        │                                          │
        │ 🌀 Tecendo a realidade...                │
        │ (Com spinner animado)                    │
        └──────────────────────────────────────────┘


        ┌──────────────────────────────────────────┐
        │  STATE 3: COM ARQUIVOS                   │
        │                                          │
        │ Aqui está seu documento:                 │
        │                                          │
        │ 📎 documento.pdf ← Link clicável         │
        │ 📎 análise.csv                           │
        └──────────────────────────────────────────┘


                  ┌─────────────────────────────────┐
                  │      INTERATIVIDADE: DANÇA       │
                  └─────────────────────────────────┘

    User passa mouse sobre [Tarefa](task:id123)
                            │
                            ↓
    dispatchEvent('prana:highlight-item', { id, active: true })
                            │
                            ↓
    Canvas escuta evento
                            │
                            ↓
    #item-id123.classList.add('highlight-pulse')
                            │
                            ↓
    Tarefa brilha no canvas (glow animation)
                            │
                            ↓
    User tira mouse
                            │
                            ↓
    dispatchEvent('prana:highlight-item', { id, active: false })
                            │
                            ↓
    #item-id123.classList.remove('highlight-pulse')
```

---

## 4. Renderização de Tool Results

```
┌─────────────────────────────────────────────────────────────────┐
│                 TOOLCALLRESULTCARD ROUTING                       │
└─────────────────────────────────────────────────────────────────┘


                    message.tool_calls[0]
                            │
                    (Qual é o toolName?)
                            │
            ┌───────────────┼───────────────┐
            │               │               │
    ┌──────▼──────┐  ┌─────▼────┐  ┌──────▼────────┐
    │ get_project │  │ create_  │  │ render_       │
    │ _view_*     │  │ task     │  │ dynamic_ui    │
    └──────┬──────┘  └─────┬────┘  └──────┬────────┘
           │               │              │
           ↓               ↓              ↓
    ┌──────────────┐  ┌──────────┐  ┌──────────────┐
    │ Suspense +   │  │ Single   │  │ HoloCanvas   │
    │ Lazy Load    │  │ Item     │  │              │
    │              │  │ Card     │  │              │
    └──────┬───────┘  └─────┬────┘  └──────┬───────┘
           │               │              │
           │               │              │
    ┌──────▼──────────────────────────────▼──────┐
    │                                            │
    │  ┌────────────────────────────────────┐   │
    │  │ switch(toolName) {                 │   │
    │  │   case 'get_project_view_general': │   │
    │  │     return <ChatGeneralView />;    │   │
    │  │   case 'get_project_view_sheet':   │   │
    │  │     return <ChatSheetView />;      │   │
    │  │   case 'get_project_view_kanban':  │   │
    │  │     return <ChatKanbanView />;     │   │
    │  │   case 'get_project_view_map':     │   │
    │  │     return <ChatMapView />;        │   │
    │  │   case 'get_project_view_chain':   │   │
    │  │     return <ChatChainView />;      │   │
    │  │   case 'create_task':              │   │
    │  │     return <SingleItemCard />;     │   │
    │  │   case 'create_project':           │   │
    │  │     return <SingleItemCard />;     │   │
    │  │   default:                         │   │
    │  │     return <generic success />;    │   │
    │  │ }                                  │   │
    │  └────────────────────────────────────┘   │
    │                                            │
    └────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                  VIEWS RENDERIZÁVEIS EM CHAT                     │
└─────────────────────────────────────────────────────────────────┘


╔════════════════════════════════════════════════════════════╗
║  ChatGeneralView                                           ║
║  ──────────────────                                        ║
║  📊 Project Stats Dashboard                               ║
║                                                            ║
║  ┌────────────────────────────────┐                       ║
║  │ Projeto: Prana                 │                       ║
║  │ Progresso: 75%                 │                       ║
║  └────────────────────────────────┘                       ║
║                                                            ║
║  ████████████████████░░░░░░░ 75%                          ║
║                                                            ║
║  ┌──────────┬──────────┬──────────┐                       ║
║  │ Tarefas  │ Feitas   │ Progresso│                       ║
║  │   20     │    15    │   75%    │                       ║
║  └──────────┴──────────┴──────────┘                       ║
║                                                            ║
║  🎯 Foco Imediato        ⚠️  Bloqueios                     ║
║  ○ Task 1                ○ Task blocked 1                 ║
║  ○ Task 2                                                 ║
║  ○ Task 3                                                 ║
╚════════════════════════════════════════════════════════════╝


╔════════════════════════════════════════════════════════════╗
║  ChatSheetView                                             ║
║  ──────────────                                            ║
║  📋 Tabela de Tarefas com Filtro                          ║
║                                                            ║
║  [🔍 Buscar] [▼ Filtro] [⚙️ Colunas]                      ║
║                                                            ║
║  ┌────────────┬────────────┬────────┬──────────────┐      ║
║  │ Título     │ Status     │ Prio   │ Devido       │      ║
║  ├────────────┼────────────┼────────┼──────────────┤      ║
║  │ Task 1     │ A Fazer    │ Alto   │ 15/12/2025   │ ◄─── Click abre modal
║  │ Task 2     │ Em Prog.   │ Médio  │ 16/12/2025   │      
║  │ Task 3     │ Revisão    │ Baixo  │ 20/12/2025   │      
║  │ Task 4     │ Concluído  │ -      │ 10/12/2025   │      
║  └────────────┴────────────┴────────┴──────────────┘      
║                                                            ║
║  [Modo Fullscreen Toggle]                                 ║
╚════════════════════════════════════════════════════════════╝


╔════════════════════════════════════════════════════════════╗
║  ChatKanbanView                                            ║
║  ───────────────                                           ║
║  🃏 Quadro Kanban com Drag & Drop                          ║
║                                                            ║
║  [⛶ Fullscreen]                                            ║
║                                                            ║
║  ┌──────────────┬──────────────┬──────────────┐           ║
║  │ A FAZER      │ EM PROGRESSO │ CONCLUÍDO    │           ║
║  ├──────────────┼──────────────┼──────────────┤           ║
║  │ ┌──────────┐ │ ┌──────────┐ │ ┌──────────┐│           ║
║  │ │ Task 1   │ │ │ Task 3   │ │ │ Task 5   ││           ║
║  │ │ High Prio│ │ │ Med Prio │ │ │ Done     ││           ║
║  │ └──────────┘ │ └──────────┘ │ └──────────┘│           ║
║  │              │              │              │           ║
║  │ ┌──────────┐ │ ┌──────────┐ │              │           ║
║  │ │ Task 2   │ │ │ Task 4   │ │              │           ║
║  │ │ Med Prio │ │ │ Low Prio │ │              │           ║
║  │ └──────────┘ │ └──────────┘ │              │           ║
║  │              │              │              │           ║
║  └──────────────┴──────────────┴──────────────┘           ║
║                                                            ║
║  [Drag cards entre colunas para mudar status]            ║
╚════════════════════════════════════════════════════════════╝


╔════════════════════════════════════════════════════════════╗
║  ChatMapView                                               ║
║  ────────────                                              ║
║  🗺️  Mapa Mental com ReactFlow                            ║
║                                                            ║
║       ┌────────┐                                           ║
║       │ Task 1 │                                           ║
║       └────┬───┘                                           ║
║            │                                               ║
║      ┌─────▼─────┐                                         ║
║      │   Task 2  │ ◄─ Predecessora                        ║
║      └─────┬─────┘                                         ║
║            │                                               ║
║       ┌────▼────┐                                          ║
║       │ Task 3  │                                          ║
║       └─────────┘                                          ║
║                                                            ║
║  [Zoom, Pan, Selecionar nós]                             ║
╚════════════════════════════════════════════════════════════╝


╔════════════════════════════════════════════════════════════╗
║  ChatChainView                                             ║
║  ───────────────                                           ║
║  ⛓️  Grafo de Dependências                                ║
║                                                            ║
║  Similar ao MapView mas focado em                         ║
║  relações predecessor/successor                           ║
╚════════════════════════════════════════════════════════════╝


╔════════════════════════════════════════════════════════════╗
║  SingleItemCard                                            ║
║  ────────────────                                          ║
║  ✓ Notificação de Criação Simples                         ║
║                                                            ║
║  ┌──────────────────────────────────┐                     ║
║  │ ✓ TAREFA CRIADA                  │                     ║
║  │ Refatorar ChatKanban             │                     ║
║  │                        [Abrir]  │                     ║
║  └──────────────────────────────────┘                     ║
║  (Borda verde, ícone animado)                             ║
╚════════════════════════════════════════════════════════════╝
```

---

## 5. State Flow (Zustand)

```
┌──────────────────────────────────────────────────────────────┐
│           useChatStore (Zustand) - State Management           │
└──────────────────────────────────────────────────────────────┘


ESTADO GLOBAL:

┌─────────────────────────────────────────────────────┐
│ useChatStore = {                                     │
│                                                      │
│   messages: [                                        │
│     {                                                │
│       id: 'msg-1',                                   │
│       role: 'user' | 'assistant',                    │
│       content: 'string',                             │
│       timestamp: 'ISO string',                       │
│       tool_calls?: [{                                │
│         function: {                                  │
│           name: 'string',                            │
│           arguments: 'JSON string'                   │
│         }                                            │
│       }],                                            │
│       toolResponse?: { ... }                         │
│     },                                               │
│     ...                                              │
│   ],                                                 │
│                                                      │
│   isLoading: boolean,                                │
│   error: string | null,                              │
│                                                      │
│   activeContext: {                                   │
│     type: 'task' | 'project',                        │
│     id: 'string',                                    │
│     title: 'string',                                 │
│     data: { ... }                                    │
│   } | null,                                          │
│                                                      │
│   // ACTIONS:                                        │
│   addMessage: (msg) => void,                         │
│   sendMessage: (content) => Promise,                 │
│   setContext: (context) => void,                     │
│   clearContext: () => void,                          │
│   setLoading: (bool) => void,                        │
│   setError: (error) => void,                         │
│   clearMessages: () => void                          │
│ }                                                    │
└─────────────────────────────────────────────────────┘


FLUXO DE STATE:

user input "Cria uma tarefa"
         │
         ↓
sendMessage("Cria uma tarefa")
         │
         ├─ messages.push({ role: 'user', content: '...' })
         ├─ isLoading = true
         └─ error = null
         │
         ↓
POST /api/ai/chat
         │
         ↓
Resposta Backend
         │
         ├─ messages.push({ role: 'assistant', content: '...', tool_calls: [...] })
         ├─ isLoading = false
         └─ Se client_action → dispatchEvent('prana:client-action')
         │
         ↓
Chat.jsx renderiza
         │
         ├─ Detecta tool_calls
         ├─ Renderiza ToolCallResultCard OU MessageBubble
         └─ UI Atualizada
```

---

**Esses diagramas são referências visuais para entender a arquitetura do Chat Ash V8.0!**
