# 📚 DOCUMENTAÇÃO - Chat Ash V8.0

**Data:** 12/12/2025  
**Versão:** V8.0  
**Linguagem:** pt-BR  
**Status:** ✅ Completo

---

## 📖 Documentos Principais

### 1. **[RELATORIO_CHAT_ARCHITECTURE.md](RELATORIO_CHAT_ARCHITECTURE.md)** ⭐ COMECE AQUI
Relatório detalhado cobrindo:
- ✅ **Tool Calls System** - Como tools são definidas, descobertas e executadas
- ✅ **Message Bubbles** - Renderização de componentes React em chat
- ✅ **Chat Architecture** - Fluxo completo Chat → Tool → Response
- ✅ **Componentes em Chat** - Todas as views (Kanban, Sheet, Map, Chain, etc)
- ✅ **Integration Points** - SideChat, ChatService, Message Rendering
- ✅ **Exemplos Práticos** - 3 cenários reais com código

**Tempo de leitura:** ~30 min  
**Para quem:** Product Managers, Designers, Engenheiros

---

### 2. **[QUICK_REFERENCE_CHAT.md](QUICK_REFERENCE_CHAT.md)** ⚡ REFERÊNCIA RÁPIDA
Cheatsheet visual com:
- 📍 **Locais-Chave** - Onde cada coisa está no codebase
- 🛠️ **Tools Disponíveis** - Tabela com todas as tools
- 🔄 **Fluxo Simplificado** - ASCII art do fluxo
- 📋 **Views Renderizáveis** - O que cada view mostra
- 💡 **Padrões** - Como adicionar tools e views
- 🎯 **Quick Copy-Paste** - Código pronto para usar

**Tempo de leitura:** ~5 min  
**Para quem:** Desenvolvedores em sprint, troubleshooting rápido

---

### 3. **[EXEMPLOS_CODIGO_CHAT.md](EXEMPLOS_CODIGO_CHAT.md)** 💻 CÓDIGO PRÁTICO
Exemplos completos e funcionais:
- ✍️ **Criar Nova Tool** - Step-by-step com exemplo `freeze_project`
- 🎨 **Criar Nova View** - Timeline view completa
- ✅ **ActionConfirmationCard** - Draft mode em ação
- 🎯 **Contexto Ativo** - Como usar task em foco
- 🔗 **Link Inteligente** - Dança com parser de links
- 🔍 **Detect Visual Results** - Como frontend detecta tools
- 🧪 **Teste Local** - Curl para testar /ai/chat

**Tempo de leitura:** ~20 min  
**Para quem:** Engenheiros implementando features novas

---

## 🎯 Mapa Mental

```
Chat Ash V8.0
├── 🛠️ TOOLS (toolService.js)
│   ├── propose_execution        [Draft Mode]
│   ├── manage_hierarchy         [Criar itens]
│   ├── change_view              [Navegar]
│   ├── manage_inbox             [Sparks]
│   ├── render_dynamic_ui        [UI Generativa]
│   └── get_* (getters)          [Dados]
│
├── 💬 CHAT (chatService.js)
│   ├── selectClientAndModel     [OpenAI/Gemini]
│   ├── getSystemPrompt          [S.O.C.D. rules]
│   ├── runChat                  [Orquestração]
│   └── Loop de Ferramentas      [Até 5x]
│
├── 🎨 UI RENDERING
│   ├── MessageBubble            [Texto + MD]
│   ├── ToolCallResultCard       [Views visuais]
│   ├── ActionConfirmationCard   [Confirmação]
│   └── ChatGeneralView, etc     [5 views]
│
├── 🔗 STATE & HOOKS
│   ├── useChatStore             [Zustand]
│   ├── usePranaChat             [Lógica]
│   └── useTimeStore             [Timer]
│
└── 🌐 ENDPOINTS
    ├── POST /api/ai/chat        [Chat principal]
    ├── GET /projects/{id}/views/{type}
    └── PUT /tasks/{id}          [Editar]
```

---

## 🎓 Learning Path

### **Iniciante (1-2 horas)**
1. Leia: [RELATORIO_CHAT_ARCHITECTURE.md](RELATORIO_CHAT_ARCHITECTURE.md) - Seções 1-3
2. Consulte: [QUICK_REFERENCE_CHAT.md](QUICK_REFERENCE_CHAT.md)
3. Explore: `src/components/chat/MessageBubble.jsx`
4. Teste: Abra chat e converse com Ash

### **Intermediário (4-6 horas)**
1. Leia: [RELATORIO_CHAT_ARCHITECTURE.md](RELATORIO_CHAT_ARCHITECTURE.md) - Seções 4-5
2. Código: [EXEMPLOS_CODIGO_CHAT.md](EXEMPLOS_CODIGO_CHAT.md) - Tool e View
3. Explore: `src/ai_services/toolService.js` (todas as tools)
4. Implemente: Adicione uma nova tool simples

### **Avançado (8+ horas)**
1. Leia: [RELATORIO_CHAT_ARCHITECTURE.md](RELATORIO_CHAT_ARCHITECTURE.md) - Seção 6
2. Código: [EXEMPLOS_CODIGO_CHAT.md](EXEMPLOS_CODIGO_CHAT.md) - Todos os exemplos
3. Explore: `src/ai_services/chatService.js` (loop completo)
4. Implemente: Nova tool com render_dynamic_ui
5. Teste: Draft mode com confirmação complexa

---

## 📂 Estrutura de Arquivos

```
src/
├── ai_services/
│   ├── toolService.js           [8 tools principais]
│   ├── chatService.js           [Orquestração IA]
│   ├── aiClients.js             [OpenAI/Gemini setup]
│   ├── energyService.js         [Análise energética]
│   ├── astrologyService.js      [Astrologia]
│   └── ragService.js            [RAG search]
│
├── api/
│   ├── aiRoutes.js              [POST /chat]
│   ├── projectViews.js          [GET /projects/{id}/views]
│   ├── taskAssignments.js       [PUT /tasks]
│   └── entities.js              [Models]
│
├── components/chat/
│   ├── MessageBubble.jsx        [Renderização texto]
│   ├── ToolCallResultCard.jsx   [Renderização tools]
│   ├── ActionConfirmationCard.jsx [Confirmação]
│   ├── ChatGeneralView.jsx      [View geral]
│   ├── ChatSheetView.jsx        [Tabela]
│   ├── ChatKanbanView.jsx       [Kanban]
│   ├── ChatMapView.jsx          [Mapa mental]
│   ├── ChatChainView.jsx        [Grafo]
│   ├── SideChat.jsx             [Chat lateral]
│   └── ProjectChat.jsx          [Chat projeto]
│
├── stores/
│   ├── useChatStore.js          [State principal]
│   ├── useTimeStore.js          [Timer]
│   └── useChatStore.js          [Zustand]
│
├── hooks/
│   ├── usePranaChat.jsx         [Lógica envio]
│   └── useAuth.jsx              [Autenticação]
│
└── pages/
    ├── Chat.jsx                 [Página principal]
    └── SheetMode.jsx            [Modo sheet]

db/
└── schema/
    └── chat.js                  [DB schema]
```

---

## 🔍 Como Encontrar Coisas

### "Onde adicionar uma nova tool?"
→ [src/ai_services/toolService.js](src/ai_services/toolService.js) linha ~300

### "Como renderizar um componente em chat?"
→ [src/components/chat/ToolCallResultCard.jsx](src/components/chat/ToolCallResultCard.jsx) - switch case

### "Como o Ash escolhe qual tool usar?"
→ [src/ai_services/chatService.js](src/ai_services/chatService.js) - `getSystemPrompt()` + `runChat()`

### "Como o frontend sabe quando renderizar visual?"
→ [src/pages/Chat.jsx](src/pages/Chat.jsx) - detecta `message.tool_calls`

### "Onde o chat salva histórico?"
→ [src/db/schema/chat.js](src/db/schema/chat.js) - `nexusMessages` table

### "Como a dança (highlight) funciona?"
→ [src/components/chat/MessageBubble.jsx](src/components/chat/MessageBubble.jsx) - `handleHighlight()` + custom event

---

## ⚙️ Configuração Rápida

### Setup Local

```bash
# 1. Backend rodando em http://localhost:3000
npm run dev

# 2. Variáveis de ambiente necessárias
OPENAI_API_KEY=sk-...    # ou GEMINI_API_KEY
DATABASE_URL=...         # PostgreSQL

# 3. Teste o endpoint
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Olá Ash"}'
```

### Selecionar IA

Em [src/ai_services/chatService.js](src/ai_services/chatService.js):

```javascript
const selectClientAndModel = () => {
  if (openai) return { client: openai, model: "gpt-4o", type: 'openai' };
  if (gemini) return { client: gemini, model: "gemini-1.5-pro", type: 'gemini' };
  throw new Error("Ash offline.");
};
```

---

## 🧪 Testes

### Manual Testing Checklist

- [ ] Chat envia mensagem → Ash responde
- [ ] Ash cria tarefa → SingleItemCard renderiza
- [ ] Ash mostra kanban → ChatKanbanView renderiza
- [ ] Ash faz proposta → ActionConfirmationCard renderiza
- [ ] User clica link → Item brilha (dança)
- [ ] User clica "Abrir Detalhes" → Modal abre
- [ ] Timer funciona → Contexto atualiza em SideChat
- [ ] Histórico persiste → Mensagens salvas em DB

### Teste com Curl

```bash
# Criar tarefa
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Cria uma tarefa urgente"}'

# Ver kanban
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Mostra o kanban"}'

# Proposta
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Deleta todas as tarefas antigas"}'
```

---

## 🐛 Troubleshooting

### "Ash não responde"
1. Check: `OPENAI_API_KEY` ou `GEMINI_API_KEY` setada
2. Check: Backend em `/api/ai/chat` rodando
3. Check: DB conectada
4. Logs: `console.log` em [chatService.js](src/ai_services/chatService.js)

### "Tool não é encontrada"
1. Check: Tool exportada em [toolService.js](src/ai_services/toolService.js)
2. Check: Tool tem `declaration` e `handler`
3. Check: Nome correto sem typos
4. Rebuild: `npm run build`

### "View não renderiza"
1. Check: Importada em [ToolCallResultCard.jsx](src/components/chat/ToolCallResultCard.jsx)
2. Check: Case statement correto no switch
3. Check: Componente recebe `data` prop
4. Logs: Suspense fallback aparece?

### "Dança não funciona"
1. Check: Listeners em `window.addEventListener('prana:highlight-item')`
2. Check: Links formatados como `[Texto](task:id)` ou `[Texto](project:id)`
3. Check: IDs válidos no canvas
4. CSS: `.highlight-pulse` definido?

---

## 📈 Métricas & Performance

### Tamanho dos Componentes

| Componente | Linhas | Complexidade |
|-----------|--------|-------------|
| MessageBubble | ~220 | Alta (Markdown + Links) |
| ToolCallResultCard | ~143 | Média (Routing) |
| ChatKanbanView | ~184 | Alta (Drag & Drop) |
| ChatMapView | ~273 | Alta (ReactFlow) |
| ActionConfirmationCard | ~105 | Média |
| SideChat | ~177 | Média |

### Otimizações

✅ Lazy loading de views em `ToolCallResultCard` (Suspense)  
✅ Debounce em busca (ChatSheetView)  
✅ Memoização em `parseContentWithLinks()`  
✅ Virtual scrolling em `ChatKanbanView` (se muitos cards)  

---

## 🚀 Próximos Passos

### Curto Prazo (2 semanas)
- [ ] Adicionar `export_to_pdf` tool
- [ ] Criar `ChartView` (gráficos)
- [ ] Suportar upload de arquivos em chat
- [ ] Integrar busca de knowledge base (RAG)

### Médio Prazo (1-2 meses)
- [ ] Multimodal (imagem + texto)
- [ ] Voice input/output
- [ ] Colaboração real-time (WebSocket)
- [ ] Histórico de conversa com tagging

### Longo Prazo (3-6 meses)
- [ ] Fine-tuning do modelo para Prana
- [ ] Graph database para relações complexas
- [ ] Mobile app com Expo
- [ ] API pública para integração

---

## 📞 Suporte

### Dúvidas Frequentes

**P: Posso usar múltiplas IA?**  
R: Sim! [selectClientAndModel()](src/ai_services/chatService.js#L19) escolhe entre OpenAI e Gemini.

**P: Quanto tempo leva para Ash responder?**  
R: Normalmente 1-3s. Depende da IA e complexidade da tool.

**P: Posso customizar a personalidade do Ash?**  
R: Sim! Em [getSystemPrompt()](src/ai_services/chatService.js#L27) mude role, tone, etc.

**P: Como adicionar mais linguagens?**  
R: Em user `aiSettings`, mude `language: "pt-BR"` para qualquer idioma.

---

## 📝 Changelog

### V8.0 (Atual)
- ✅ System prompt com S.O.C.D. rules
- ✅ Draft Mode (propose_execution)
- ✅ 5 views inline (Kanban, Sheet, Map, Chain, General)
- ✅ Dança (highlight on hover)
- ✅ Histórico persistido
- ✅ SideChat com contexto
- ✅ ActionConfirmationCard

### V7.0
- Sistema de tools básico
- MessageBubble simples
- Sem draft mode

### V6.0
- Primeiros protótipos de chat
- Integração Gemini

---

## 📄 Licença & Attribution

Este sistema foi desenvolvido como parte do **Prana OS**.  
Código sob MIT License (check LICENSE.md).

---

## 🙏 Contribuidores

- **Ash** - Sistema Neural
- **Caelum** - Inteligência Visual
- **Sophia** - Sabedoria Organizacional

---

**Última atualização:** 12/12/2025 23:45  
**Próxima revisão:** 19/12/2025

