# 📋 Diagnóstico de Views e Componentes - Prana 3.0

## Status das 6 Requisições

### 1️⃣ Explorer - Modais no Folder

**Status:** ✅ **IMPLEMENTADO**

**Descobertas:**
- Explorer (ProjectHierarchy.jsx) tem seu próprio modal local `createModal.open`
- Não usa SmartModal ou PranaFormModal
- Modal é simples com:
  - Input para nome
  - Select para tipo (task, document, mindmap)
  - Buttons Criar/Cancelar

**Código:**
```jsx
const handleCreateOpen = (forcedType, explicitParentId) => {
    const targetParentId = explicitParentId !== undefined ? explicitParentId : getContextParentId();
    setCreateModal({ 
        open: true, 
        type: forcedType || 'project', 
        parentId: targetParentId, 
        name: '' 
    });
};

// Renderizado em: <Dialog open={createModal.open} ...>
```

**Benefício da Abordagem Atual:**
- Modal integrado direto no contexto da árvore
- Sem dependência de store global
- Simples e funcional

**Potencial Improvement (Futuro):**
- Poderia usar `openPranaForm()` ao invés de modal local
- Manteria consistência visual com outros modais

---

### 2️⃣ Views - Criação de Tarefa/Projeto

**Status:** ⚠️ **PARCIALMENTE IMPLEMENTADO**

#### Calendar ✅
```jsx
// Tem PranaFormModal
const [isModalOpen, setIsModalOpen] = useState(false);
const [modalItemType, setModalItemType] = useState('task');
<PranaFormModal 
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    itemType={modalItemType}
    ...
/>
```

#### Planning ❌
- **Problema:** Nenhum modal para criação rápida
- Tem DragDropContext para drag & drop de PlanningNote
- Não usa SmartModal ou PranaFormModal
- **Recomendação:** Adicionar `openSmartModal()` no botão "+"

#### Dashboard ⚠️
- Tem `SmartCreationModal` renderizado
- Tem estado local `isSmartModalOpen`
- **Problema:** Usa estado local em vez de store `isPranaFormOpen`
- **Encontrado:** `onOpenCreationModal={() => setIsSmartModalOpen(true)}`

#### ChainView ❌
- Não encontrado em busca rápida
- Provavelmente sem modal de criação

#### SheetView ❌
- Não encontrado em busca rápida
- Provavelmente sem modal de criação

#### KanbanView ❌
- Não encontrado em busca rápida
- Provavelmente sem modal de criação

---

### 3️⃣ Drag & Drop

**Status:** ⚠️ **PARCIALMENTE FUNCIONAL**

#### Planning
```jsx
<DragDropContext onDragEnd={handleDragEnd}>
    <Droppable droppableId="notes">
        <Draggable draggableId={`note-${note.id}`} ...>
```
✅ DND está implementado para PlanningNotes

#### Dashboard
```jsx
<DragDropContext onDragEnd={handleDragEnd}>
```
✅ DND interface existe

#### SheetView
- Não verificado completamente

---

### 4️⃣ Dashboard + LogbookView (DiarioDeBordo)

**Status:** ❌ **NÃO IMPLEMENTADO**

**Descobertas:**
- Dashboard.jsx **NÃO importa** DiarioDeBordo ou LogbookView
- Dashboard tem WelcomeScreen (mocked)
- Dashboard usa ChatKanbanView, ChatSheetView, ChatMapView, ChatChainView
- **Arquivo** DiarioDeBordo.jsx **EXISTS** em `/src/pages/` MAS:
  - Não está integrado ao Dashboard
  - Não está no Layout como view opção

**Código Atual do Dashboard:**
```jsx
import WelcomeScreen from './WelcomeScreen'; // ← Mocked
import ChatKanbanView from '@/components/chat/ChatKanbanView'; // ← Real

// No render:
{(!currentProject) ? (
    <WelcomeScreen /> // ← Mostra tela de boas-vindas
) : (
    // Renderiza views (Kanban, Sheet, Map, Chain)
)}
```

**Recomendações:**
1. Importar LogbookView em Dashboard
2. Adicionar como nova view option: "Diário" ou "Logbook"
3. Remover WelcomeScreen ou usá-la apenas na primeira vez
4. Integrar dados reais (não mocks)

---

### 5️⃣ Ash Chat

**Status:** ⚠️ **IMPLEMENTADO MAS PODE ESTAR INATIVO**

**Descobertas:**
```jsx
// SideChat.jsx
const { 
    messages, sendMessage, isLoading, 
    activeContext, clearContext, clearMessages 
} = useChatStore();
```

- SideChat **exists** e está renderizado em PranaWorkspaceLayout
- Importa useChatStore
- Tem `handleSend()` que chama `sendMessage()`

**Possíveis Razões de Inatividade:**
1. `useChatStore` não está inicializado corretamente
2. `sendMessage()` pode estar sem endpoint
3. Chat pode estar esperando por contexto que não foi setado
4. API backend pode não estar respondendo

**Verificação Necessária:**
- [ ] Testar em DevTools: `useChatStore().sendMessage('test')`
- [ ] Verificar se há erros no console
- [ ] Checar se `/api/chat` endpoint existe no server
- [ ] Verificar credentials/auth

---

### 6️⃣ MindMap

**Status:** ⚠️ **IMPLEMENTADO COM LIMITAÇÕES**

**Descobertas:**
```jsx
// MindMap.jsx → renderiza ChatMapView
<ChatMapView 
    height="100%" 
    projectId={null}  // ← Modo Global
/>
```

- Usa ReactFlow (pacote importado)
- Componentes: MindMapCustomNode, MindMapEdge
- Não encontrou logo da ReactFlow (provavelmente não está visível)

**Status das Features:**
- ✅ Renderização de nós
- ❓ Transmutação de nós (não verificado em detalhe)
- ❓ Recolhimento (collapse) - não verificado
- ✅ Suporte a múltiplos projetos (projectId param)

**Próximas Verificações:**
- [ ] Testar criar novo nó
- [ ] Testar drag & drop de nós
- [ ] Testar transformação entre tipos de nó
- [ ] Verificar se logo ReactFlow está oculto em CSS

---

### 7️⃣ ChainView

**Status:** ⚠️ **IMPLEMENTADO MAS NÃO TOTALMENTE VERIFICADO**

**Descobertas:**
- Arquivo existe: `/src/pages/ChainView.jsx`
- É renderizado em PranaWorkspaceLayout
- Provavelmente usa ReactFlow também

**Não Testado:**
- [ ] Visualização de chains
- [ ] Criação de elementos
- [ ] Interatividade

---

### 8️⃣ Filtros nas Views

**Status:** ❌ **NÃO IMPLEMENTADO UNIFORMEMENTE**

#### Implementado ✅
- **Calendar:** Tem `MultiSelectFilter` para Projects/Teams
- **Dashboard:** Tem filtros de projeto

#### NÃO Implementado ❌
- **SheetView:** Sem filtros
- **MindMap:** Sem filtros
- **KanbanView:** Sem filtros (provavelmente)
- **Planning:** Sem filtros

---

## 📊 Matriz de Status Geral

| Feature | Status | Prioridade | Esforço |
|---------|--------|-----------|--------|
| Explorer Modais | ✅ Funcional | - | - |
| Calendar | ✅ Funcional | - | - |
| Planning Modal | ❌ Faltando | ALTA | 1h |
| Dashboard Modal | ⚠️ Local state | MÉDIO | 0.5h |
| LogbookView integração | ❌ Faltando | ALTA | 2h |
| Ash Chat | ⚠️ Pode estar inativo | ALTA | 2h |
| MindMap Features | ⚠️ Parcial | MÉDIO | 2h |
| ChainView | ⚠️ Não testado | MÉDIO | 2h |
| Filtros uniformes | ❌ Faltando | BAIXO | 3h |

---

## 🎯 Próximos Passos (Ordem Recomendada)

### 1. **Imediato (1h)**
- [ ] Verificar se Ash Chat funciona (console check)
- [ ] Adicionar SmartModal ao Planning
- [ ] Atualizar Dashboard para usar store `isPranaFormOpen` em vez de estado local

### 2. **Curto Prazo (2-3h)**
- [ ] Integrar LogbookView ao Dashboard como view option
- [ ] Remover WelcomeScreen ou usar em contexto apropriado
- [ ] Garantir dados reais (não mocks) no Dashboard

### 3. **Médio Prazo (4-6h)**
- [ ] Testar MindMap completamente (criar, editar, transformar nós)
- [ ] Testar ChainView completamente
- [ ] Adicionar filtros ao SheetView, KanbanView, MindMap

### 4. **Longo Prazo (futuro)**
- [ ] Unificar sistema de filtros em todas as views
- [ ] Converter ProjectHierarchy modal para usar openPranaForm() (consistency)
- [ ] Adicionar mais recursos a LogbookView

---

## 🔍 Checklist de Verificação

```
Views:
- [ ] Calendar: SmartModal + Criação OK? (provisoriamente OK)
- [ ] Planning: Precisa de SmartModal
- [ ] Dashboard: Converter para usar store
- [ ] LogbookView: Integrar ao Dashboard
- [ ] SheetView: Adicionar modal + filtros
- [ ] KanbanView: Adicionar modal + filtros
- [ ] MindMap: Testar todas as features
- [ ] ChainView: Testar todas as features

Integrações:
- [ ] Ash Chat: Verificar por que está "inativo"
- [ ] Drag & Drop: Testar em todas as views
- [ ] Real Data: Remover mocks, usar apenas dados reais

Features:
- [ ] Filtros: Implementar uniformemente
- [ ] Criação Rápida: SmartModal/PranaFormModal em todas as views
- [ ] ReactFlow Logo: Verificar se está oculto
```
