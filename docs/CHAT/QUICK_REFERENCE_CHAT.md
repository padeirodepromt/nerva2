# 🚀 QUICK REFERENCE - Chat Ash Architecture

## Locais-Chave

```
src/
├── ai_services/
│   ├── toolService.js          ⭐ FERRAMENTAS (Tools)
│   └── chatService.js          ⭐ CÉREBRO (Orquestração)
├── api/
│   └── aiRoutes.js             ⭐ ENDPOINTS (/ai/chat)
├── components/chat/
│   ├── MessageBubble.jsx       ⭐ RENDERIZAÇÃO DE TEXTO
│   ├── ToolCallResultCard.jsx  ⭐ RENDERIZAÇÃO DE TOOLS
│   ├── ActionConfirmationCard.jsx  Draft Mode (Confirmação)
│   ├── ChatGeneralView.jsx     View: Visão Geral
│   ├── ChatSheetView.jsx       View: Tabela
│   ├── ChatKanbanView.jsx      View: Kanban
│   ├── ChatMapView.jsx         View: Mapa Mental
│   ├── ChatChainView.jsx       View: Dependências
│   ├── SideChat.jsx            ⭐ CHAT LATERAL
│   └── ProjectChat.jsx         Chat de projeto (Human-to-Human)
├── stores/
│   └── useChatStore.js         ⭐ STATE (Zustand)
├── hooks/
│   └── usePranaChat.jsx        ⭐ HOOK (Lógica de envio)
└── pages/
    └── Chat.jsx                ⭐ PÁGINA PRINCIPAL
```

## Tools Disponíveis

| Tool | Descrição | Retorna |
|------|-----------|---------|
| `propose_execution` | Draft Mode - Confirmação | `client_action: PROPOSE_ACTION` |
| `manage_hierarchy` | Cria Tarefa/Projeto/Doc | `client_action: CHANGE_VIEW` |
| `change_view` | Navega para view | `client_action: CHANGE_VIEW` |
| `manage_inbox` | Lista/Promove Sparks | `client_action: CHANGE_VIEW` |
| `render_dynamic_ui` | UI Generativa | `client_action: CHANGE_VIEW` (HoloCanvas) |
| `get_available_tags` | Lista tags | `{ tags: [] }` |
| `search_knowledge` | RAG Search | `{ results: [] }` |
| `perform_system_audit` | Auditoria | `{ summary: "" }` |

## Fluxo Simplificado

```
User Input
    ↓
useChatStore.sendMessage()
    ↓
apiClient.post('/ai/chat')
    ↓
Backend: chatService.runChat()
    ├─ Monta system prompt
    ├─ Chama OpenAI/Gemini com tools
    ├─ IA seleciona tool (ou não)
    ├─ Se tool: executa handler → toolResult
    └─ Se client_action: retorna ao frontend
    ↓
Frontend: useChatStore recebe response
    ├─ Adiciona mensagem do Ash
    ├─ Se tool_calls: renderiza ToolCallResultCard
    ├─ Se client_action: dispara evento global
    └─ Se texto: renderiza MessageBubble
    ↓
UI Atualizada
```

## Views Renderizáveis em Chat

```
get_project_view_general  → ChatGeneralView     [Stats + Progress + Energy]
get_project_view_sheet    → ChatSheetView       [Tabela com Filtro]
get_project_view_kanban   → ChatKanbanView      [4 Colunas Drag & Drop]
get_project_view_map      → ChatMapView         [ReactFlow]
get_project_view_chain    → ChatChainView       [Grafo de Deps]

create_task               → SingleItemCard      [Notificação Verde]
create_project            → SingleItemCard      [Notificação Verde]

render_dynamic_ui         → HoloCanvas          [UI Generativa]
```

## Client Actions

```javascript
{
    type: 'PROPOSE_ACTION',    // Draft Mode
    type: 'CHANGE_VIEW',       // Navegar
    type: 'SHOW_CODE_DIFF',    // (Futuro)
}
```

## Exemplo: Ash Cria Tarefa

```javascript
// ===== FRONTEND =====
User: "Cria uma tarefa"
    ↓
sendMessage("Cria uma tarefa")
    ↓
POST /ai/chat { message: "Cria uma tarefa" }

// ===== BACKEND =====
IA responde: "Vou criar"
IA seleciona: manage_hierarchy
IA informa: { itemType: 'task', title: '...', path: 'Prana/Dev', ... }
    ↓
toolService.manage_hierarchy.handler(args)
    ↓
Insere em DB
    ↓
Retorna { success, item, client_action: { type: 'CHANGE_VIEW', ... } }

// ===== FRONTEND =====
Recebe resposta
    ↓
<MessageBubble /> (texto do Ash)
<ToolCallResultCard toolName="manage_hierarchy" />
    ↓
ToolCallResultCard detecta create_task
    ↓
<SingleItemCard type="task" />
    ↓
Renderiza: ✓ Tarefa Criada - "..." [Abrir Detalhes]
```

## Exemplo: Draft Mode (Ação Destrutiva)

```javascript
// Ash quer deletar 50 tarefas antigas

propose_execution({
    title: "Limpeza de Tarefas",
    description: "Deletar 50 tarefas...",
    impact: "high",
    toolToExecute: "manage_hierarchy",
    argsToExecute: { action: 'delete_old', days: 90 }
})
    ↓
Retorna client_action: { type: 'PROPOSE_ACTION', data: {...} }
    ↓
Frontend renderiza ActionConfirmationCard
    ↓
User vê: ⚠️ [Cancelar] [Confirmar & Executar]
    ↓
User clica Confirmar
    ↓
Frontend executa handler direto
    ↓
UI: ✓ Executado: Limpeza de Tarefas
```

## Como Adicionar Nova Tool

```javascript
// Em src/ai_services/toolService.js

export const my_new_tool = {
    declaration: {
        name: "my_new_tool",
        description: "O que faz",
        parameters: {
            type: "OBJECT",
            properties: {
                arg1: { type: "STRING" },
                arg2: { type: "NUMBER" }
            },
            required: ["arg1"]
        }
    },
    handler: async ({ arg1, arg2 }) => {
        // Sua lógica aqui
        return {
            success: true,
            message: "Feito!",
            // Se precisar de UI:
            client_action: { 
                type: 'CHANGE_VIEW', 
                view: 'DASHBOARD',
                data: { ... }
            }
        };
    }
};

// ✓ Pronto! IA automaticamente descobre e usa
```

## Como Adicionar Nova View em Chat

```javascript
// 1. Criar componente em src/components/chat/
// src/components/chat/ChatMyView.jsx

export default function ChatMyView({ data }) {
    return <div>{/* Sua renderização */}</div>;
}

// 2. Importar em ToolCallResultCard.jsx
const ChatMyView = React.lazy(() => import('./ChatMyView'));

// 3. Adicionar case no switch
case 'get_my_custom_view':
    return renderView(ChatMyView, 'Minha View');

// ✓ Pronto! Backend pode chamar quando precisa
```

## Message Bubble - O Que Pode Renderizar

✅ **Texto Markdown** (com syntax highlight)  
✅ **Links Inteligentes** `[Tarefa](task:id123)` (com highlight na dança)  
✅ **Código Colorizado** (com botão Copy)  
✅ **Anexos de Arquivo** (com link)  
✅ **ActionConfirmationCard** (Draft Mode com botões)  
✅ **Timestamp** (hora da mensagem)  

## Draft Mode Pattern

```
Situação: Ação complexa/destrutiva

1. Ash usa propose_execution
2. Frontend renderiza ActionConfirmationCard
3. User revisa e clica "Confirmar"
4. Frontend executa handler direto
5. UI atualiza com resultado

Vantagem: User tem controle total antes de executar
```

## "Dança" (Highlight ao Hover)

```javascript
// Em MessageBubble.jsx

const handleHighlight = (id, active) => {
    window.dispatchEvent(new CustomEvent('prana:highlight-item', {
        detail: { id, active }
    }));
};

// Canvas escuta e faz highlight do item correspondente
// Efeito: Link na bubble → Item brilha no canvas
```

## Contexto Ativo (SideChat)

```javascript
// SideChat mostra:
// 1. Timer em foco (se task está being timed)
// 2. Contexto de conversa (se task/project selecionado)

{isRunning && activeTaskTitle && (
    <div>🟢 Em Foco: {activeTaskTitle}</div>
)}

{activeContext && (
    <div>🔗 Contexto: {activeContext.title} [✕]</div>
)}

// Ash usa esse contexto no system prompt
// Ex: "User está focando em X, considere isso ao responder"
```

## Personalização (System Prompt)

```javascript
// Base em getSystemPrompt() + user aiSettings

const userSettings = {
    role: "Parceiro Estratégico",          // Persona
    tone: "Direto e eficiente",            // Tom
    tech_stack: "React + Node.js",         // Stack
    custom_instructions: "Seja conciso",   // Instruções
    language: "pt-BR"                      // Idioma
};

// Ash adapta resposta baseado nesses settings
```

## Store (Zustand) - useChatStore

```javascript
const useChatStore = create(
    persist(
        (set, get) => ({
            messages: [],              // Array de mensagens
            isLoading: false,          // Aguardando resposta
            error: null,               // Mensagem de erro
            activeContext: null,       // { type, id, title, data }
            
            // Actions
            addMessage(msg),
            sendMessage(content),      // Ação mestra
            setContext(context),
            clearContext(),
            clearMessages(),
        }),
        { name: 'prana-chat-storage' }
    )
);
```

## API Endpoint

```javascript
POST /ai/chat

Request:
{
    message: "string",
    context?: { type, id, data },
    history?: [{ role, content }]
}

Response:
{
    response: "string",
    tool_calls?: [{ function: { name, arguments } }],
    toolResponse?: { success, message, client_action, ... },
    client_action?: { type, view, projectId, data }
}
```

---

**Tip:** Use `Ctrl+Shift+P` → "Go to Symbol" para navegar entre files rapidamente!
