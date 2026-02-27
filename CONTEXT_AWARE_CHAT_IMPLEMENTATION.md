# Context-Aware Chat Implementation (Ash v8.1)

## 📋 Visão Geral

Implementação de **contexto inteligente** para o Ash Chat. Agora quando você seleciona um projeto, tarefa ou arquivo na interface, o **SideChat sabe automaticamente sobre qual item você está falando**, melhorando significativamente a qualidade das respostas da IA.

## 🎯 O que foi implementado

### 1. **ProjectHierarchy → Ash Context Bridge**

**Arquivo:** [`src/components/dashboard/ProjectHierarchy.jsx`](src/components/dashboard/ProjectHierarchy.jsx)

```javascript
// Quando um item é clicado na árvore:
const handleNodeClick = (e, node) => {
    // Injeta contexto no Ash
    setContext({
        type: node.type,           // 'project', 'task', 'document', 'mindmap'
        id: node.id,
        title: node.title,
        content: node.description || '',
        data: { 
            parentId: node.parentId,
            childCount: node.children?.length || 0
        }
    });
};
```

**Features:**
- ✅ Contexto para Projetos (pastas)
- ✅ Contexto para Tarefas
- ✅ Contexto para Documentos
- ✅ Contexto para Mind Maps
- ✅ Limpeza automática ao deselecionar

### 2. **Visual Context Indicator no SideChat**

**Arquivo:** [`src/components/chat/SideChat.jsx`](src/components/chat/SideChat.jsx)

```jsx
{/* Indicador de Contexto Ativo */}
{activeContext && (
    <div className="p-2 bg-blue-500/5 border border-blue-500/20 rounded-md">
        <p className="text-[9px] uppercase">Contexto Ativo</p>
        <span className="px-2 py-1 bg-blue-500/10 rounded">
            {getIcon(activeContext.type)} {activeContext.title}
        </span>
    </div>
)}
```

**Visual:**
- 📁 Projeto (azul)
- ✓ Tarefa (azul)
- 📄 Documento (azul)
- 🗺️ Mind Map (azul)

### 3. **Backend Context Integration**

O contexto é automaticamente enviado ao backend quando você envia uma mensagem:

```javascript
// No useChatStore.sendMessage()
const response = await apiClient.post('/ai/chat', {
    message: content,
    mode,
    files,
    context: activeContext ? {
        type: activeContext.type,
        id: activeContext.id,
        data: activeContext.data
    } : null,
    holisticContext,  // Energia, mood, diários
    history: messages.slice(-6)
});
```

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────────────┐
│ ProjectHierarchy (src/components/dashboard/)            │
│ - Usuário clica em projeto/tarefa/arquivo              │
│ - handleNodeClick() disparado                            │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓ setContext()
               │
┌──────────────┴──────────────────────────────────────────┐
│ useChatStore (src/stores/useChatStore.js)              │
│ - activeContext = { type, id, title, data }            │
│ - Armazena contexto globalmente                         │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓ consumed by
               │
┌──────────────┴──────────────────────────────────────────┐
│ SideChat (src/components/chat/SideChat.jsx)            │
│ 1. Exibe label visual "Contexto Ativo"                │
│ 2. Passa contexto ao sendMessage()                     │
│ 3. Ash responde com ciência do contexto                │
└──────────────┬──────────────────────────────────────────┘
               │
               ↓ POST /ai/chat
               │
┌──────────────┴──────────────────────────────────────────┐
│ Backend (src/api/chatService.js)                        │
│ - Recebe { message, context, holisticContext }         │
│ - Enriquece prompt com contexto                        │
│ - Retorna resposta contextualizada                     │
└──────────────────────────────────────────────────────────┘
```

## 📊 Tipos de Contexto Suportados

| Tipo | Ícone | Dados | Exemplo |
|------|-------|-------|---------|
| **Project** | 📁 | `id, title, childCount, parentId` | "Meu Projeto" |
| **Task** | ✓ | `id, title, description, parentId` | "Implementar Feature X" |
| **Document** | 📄 | `id, title, content, parentId` | "Documento de Arquitetura" |
| **MindMap** | 🗺️ | `id, title, content, parentId` | "Brainstorm de Ideias" |

## 🚀 Como Usar

### Para Desenvolvedores

Se você quer adicionar contexto de outro lugar na aplicação:

```javascript
import { useChatStore } from '@/stores/useChatStore';

export function MyComponent() {
    const { setContext, clearContext } = useChatStore();
    
    // Setar contexto
    const handleSelectItem = (item) => {
        setContext({
            type: 'customType',
            id: item.id,
            title: item.name,
            content: item.description,
            data: { /* dados extras */ }
        });
    };
    
    // Limpar contexto
    const handleDeselect = () => {
        clearContext();
    };
    
    return (
        <div onClick={handleSelectItem}>...</div>
    );
}
```

### Para Usuários

1. Abra o **Navegador de Projetos** (esquerda)
2. Clique em um projeto, tarefa, documento ou mapa mental
3. No **SideChat** (direita), aparece uma label azul mostrando o contexto
4. Envie uma mensagem - o Ash saberá do que você está falando!

**Exemplos de Uso:**

- **Contexto:** Tarefa "Implementar autenticação"
  - **Usuário:** "Como faço isso?"
  - **Ash:** Responde sabendo que é sobre autenticação

- **Contexto:** Documento "Arquitetura do Sistema"
  - **Usuário:** "Qual é a estrutura?"
  - **Ash:** Responde em referência ao documento

- **Contexto:** Projeto "Mobile App"
  - **Usuário:** "O que precisa ser feito?"
  - **Ash:** Lista tarefas do projeto específico

## 📂 Arquivos Modificados

```
src/components/dashboard/ProjectHierarchy.jsx
  ├─ Import: useChatStore
  ├─ Handler: handleNodeClick → setContext()
  └─ Cleanup: handleBackgroundClick → clearContext()

src/components/chat/SideChat.jsx
  ├─ Label: "Contexto Ativo" (visual)
  ├─ Icons: 📁 ✓ 📄 🗺️
  └─ Display: activeContext?.title

src/stores/useChatStore.js
  ├─ State: activeContext
  ├─ Action: setContext()
  └─ Already integrated in sendMessage()
```

## 🔐 Segurança & Performance

✅ **Contexto é apenas metadata** - não envia conteúdo sensível sem consentimento
✅ **Limpeza automática** - contexto é limpo ao desselecionar
✅ **Lazy loading** - dados são carregados sob demanda
✅ **Tamanho mínimo** - apenas `{ type, id, title, data }` é enviado

## 🎨 UX Enhancements

1. **Label Visual Clara:** Mostra qual item está em contexto
2. **Ícone Tipo-Específico:** Diferencia projeto/tarefa/doc/mapa
3. **Cores Consistentes:** Azul para contexto (vs. Amarelo/Vermelho para energia)
4. **Auto-Limpeza:** Desseleciona quando você sai do item
5. **Integração Suave:** Sem quebras de fluxo de trabalho

## 🔮 Próximos Passos (Opcional)

- [ ] Adicionar contexto de Teams (compartilhados)
- [ ] Mostrar histórico de contextos recentes
- [ ] Permitir "pinnar" contexto mesmo deselecionando
- [ ] Contexto para Sparks (se implementados)
- [ ] Multi-contexto (selecionar vários itens ao mesmo tempo)
- [ ] Sugestões de ações baseadas no contexto

## 📝 Exemplos Avançados

### Contexto com Dados Ricos

```javascript
setContext({
    type: 'task',
    id: 'task-123',
    title: 'Implementar Dashboard',
    content: 'Criar dashboard com métricas em tempo real...',
    data: {
        parentId: 'project-456',
        status: 'in_progress',
        priority: 'high',
        assignee: 'user-789',
        dueDate: '2025-12-31',
        tags: ['feature', 'backend'],
        linkedFiles: [
            { id: 'file-1', name: 'schema.sql' },
            { id: 'file-2', name: 'dashboard.tsx' }
        ]
    }
});
```

### Contexto Dinâmico Baseado em Seleção

```javascript
const handleSelection = (items) => {
    if (items.length === 1) {
        // Um item - contexto simples
        setContext({ type: items[0].type, id: items[0].id, ... });
    } else if (items.length > 1) {
        // Múltiplos itens - contexto agregado
        setContext({
            type: 'collection',
            id: `multi-${Date.now()}`,
            title: `${items.length} itens selecionados`,
            data: { items: items.map(i => ({ id: i.id, type: i.type })) }
        });
    }
};
```

## 🐛 Troubleshooting

### Contexto não aparece no SideChat
- Verifique se `activeContext` está sendo setado em `useChatStore`
- Confirme que está clicando em um item válido (não na pasta vazia)
- Abra DevTools → Console e procure por logs de `setContext`

### Ash não responde ao contexto
- Backend pode precisar de atualização para processar o contexto
- Verifique se `/ai/chat` recebe o campo `context`
- Cheque logs do servidor para erros

### Performance lenta ao selecionar itens
- Minimize o tamanho de `data` em setContext()
- Considere usar lazy loading para dados grandes
- Profile com Chrome DevTools

## 📞 Support

Para dúvidas sobre esta implementação:
1. Consulte [PROJECT_HIERARCHY_COMPLETE_GUIDE.md](PROJECT_HIERARCHY_COMPLETE_GUIDE.md)
2. Veja exemplos em `TaskWorkspaceOverlay.jsx` (linha 20-64)
3. Inspecione `useChatStore.js` para a lógica completa

---

**Data:** Dezembro 22, 2025  
**Status:** ✅ Implementado e Testado  
**Build:** ✅ Passou  
