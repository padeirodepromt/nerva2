# 🏗️ Clarificação Arquitetural - TaskWorkspaceOverlay vs Modais

## 🎯 A Sua Pergunta

> "Não sei se TaskWorkspaceOverlay ou PranaModal. O sistema está ficando tão complexo que às vezes esqueço"

**Resposta Simples**: Para o novo sistema de File-Task, você quer **TaskWorkspaceOverlay**.

---

## 📍 A Diferença (Diagram)

```
GLOBAL MODALS (PranaWorkspaceLayout.jsx)
├─ SmartCreationModal      → Criar novo item (doc/task/projeto)
├─ PranaFormModal          → Formulário genérico
├─ RoutineManagerModal     → Gerenciar rotinas
├─ TaskWorkspaceOverlay    ← VER/EDITAR TAREFA EXISTENTE
└─ SideChat               → Chat lateral

vs

INLINE/LOCAL COMPONENTS
├─ FileTaskPanel          → Painel de tasks no arquivo
└─ FileTaskLinkModal      → Modal para vincular
```

---

## 🔍 TaskWorkspaceOverlay

**O que é**: O painel FULL de edição/visualização de uma tarefa

**Path**: `/src/components/tasks/TaskWorkspaceOverlay.jsx`

**Quando abre**: User clica numa tarefa para editar

**Como funciona**:
```jsx
// Em PranaWorkspaceLayout.jsx (linha 294)
<TaskWorkspaceOverlay 
  isOpen={activeOverlay?.type === 'TASK_DETAIL'}
  onClose={closeOverlay}
  taskData={activeOverlay?.data}
/>
```

**Props**:
```typescript
{
  isOpen: boolean;           // Se está visível
  onClose: () => void;      // Fecha o overlay
  taskData: Task;           // A tarefa sendo editada
}
```

**Visual**:
```
┌─────────────────────────────────────────────────┐
│ Workspace / Task Title | Template | [×]         │
├──────────┬──────────────┬────────────────────────┤
│          │              │ 📄 Arquivos Ligados    │
│ Detalhes │  Módulo      │ (novo sidebar)         │
│ da       │  Específico  │                        │
│ Tarefa   │ (Chat, etc)  │ + Vincular Arquivo     │
│          │              │                        │
└──────────┴──────────────┴────────────────────────┘
```

**Já está integrado com**:
- ✅ Form de detalhes
- ✅ Módulos dinâmicos (Chat, Canvas, etc)
- ✅ Layout split/single

---

## 🔌 Onde Está Registrado

**PranaWorkspaceLayout.jsx** (Master Layout):
```jsx
import TaskWorkspaceOverlay from '@/components/tasks/TaskWorkspaceOverlay';

export default function PranaWorkspaceLayout() {
  return (
    <>
      <SmartCreationModal />
      <PranaFormModal />
      <RoutineManagerModal />
      <TaskWorkspaceOverlay     ← AQUI
        isOpen={...}
        onClose={...}
        taskData={...}
      />
    </>
  );
}
```

---

## 🎨 Seu Novo Sistema - Onde Entra

### No TaskWorkspaceOverlay (EDITAR TAREFA)
```
┌──────────────────────────────────────────┐
│ Workspace / Atualizar Design System       │
├──────────┬──────────────┬────────────────┤
│          │              │ 📄 Arquivo:    │
│ • Status │  [Módulo]    │ Design.pdf     │
│ • Prio   │              │                │
│ • Tags   │              │ Ações:         │
│          │              │ ✓ Ir para doc  │
│ [SAVE]   │              │ ✓ Desvincular  │
└──────────┴──────────────┴────────────────┘

Mudança necessária:
- Adicionar campo "📎 Arquivo Vinculado"
- Se uma tarefa tem fileId, mostrar qual arquivo
- Link para abrir o arquivo
```

### No DocEditorView (CRIAR TAREFA)
```
┌────────────────────────────────────────┐
│ 📄 Design System v2.1                  │
├────────────────────────────────────────┤
│                                        │
│ [➕ Criar Tarefa para este Arquivo]    │
│                                        │
│ Tarefas Ativas:                        │
│ ─────────────────────────────────────  │
│ ✓ [Update colors] - Em andamento       │
│ ✓ [Add icons] - Bloqueada              │
│                                        │
│ Histórico:                             │
│ ─────────────────────────────────────  │
│ ✗ [Review v1] - Completa (15/12)      │
│ ✗ [Design layout] - Completa (10/12)  │
│                                        │
└────────────────────────────────────────┘

Novo componente:
- FileTaskStatusPanel (ativo vs histórico)
- Button "Criar Tarefa" → abre TaskWorkspaceOverlay
  com fileId pré-filled
```

---

## 📊 Comparação das Arquiteturas

### ❌ O QUE NÃO FAZER (Link Permanente)
```
FileTaskAssociation Table
├─ fileId
├─ taskId
├─ relationship  (modify, review, etc)
└─ isActive     (t/f)

❌ Problema: Mesmo após tarefa completa, 
  link fica para sempre no banco
```

### ✅ O QUE FAZER AGORA (Task-based)
```
Task Table
├─ id
├─ title
├─ status        (active, completed, archived)
├─ fileId        (NOVO - qual arquivo tá vinculado)
├─ createdAt
├─ completedAt   (NOVO - quando foi completa)
└─ ...

Lógica:
1. Task tem status "active"
   → Aparece em "Tarefas Ativas" no arquivo
2. User marca como "completed"
   → Sai da lista ativa
   → Aparece em "Histórico" (read-only)
3. User deleta a tarefa
   → Sai de tudo
```

---

## 🔧 Mudanças Necessárias

### 1. Banco de Dados (Schema)
```javascript
// tasks table adicionar:
- fileId: NULLABLE UUID (referência para papyrusDocuments)
- completedAt: NULLABLE TIMESTAMP
- status: ENUM('active', 'completed', 'archived', 'pending')
```

### 2. TaskWorkspaceOverlay.jsx
```jsx
// Adicionar seção mostrando arquivo vinculado
<div className="p-4 border-t border-white/10">
  <h3>Arquivo Vinculado</h3>
  {taskData?.fileId ? (
    <>
      <p>{getFileName(taskData.fileId)}</p>
      <button>Abrir Arquivo</button>
      <button>Desvincular</button>
    </>
  ) : (
    <p>Nenhum arquivo vinculado</p>
  )}
</div>
```

### 3. DocEditorView.jsx
```jsx
// Substituir FileTaskPanel por novo componente
<FileTaskStatusPanel
  docId={docId}
  activeTasks={tasks.filter(t => t.status === 'active' && t.fileId === docId)}
  completedTasks={tasks.filter(t => t.status === 'completed' && t.fileId === docId)}
  onCreateTask={() => openTaskWorkspace({fileId: docId})}
/>
```

### 4. StandardTaskForm.jsx
```jsx
// Adicionar campo de arquivo
<Select label="Vincular Arquivo" value={fileId}>
  <Option value="">Nenhum</Option>
  {documents.map(doc => <Option value={doc.id}>{doc.title}</Option>)}
</Select>
```

---

## 🔄 Fluxo Completo (Novo Sistema)

```
CENÁRIO: User tá editando Design.pdf

1. Clica [➕ Criar Tarefa para este Arquivo]
   ↓
2. TaskWorkspaceOverlay abre com:
   - fileId pré-preenchido = Design.pdf
   - status = 'active' (default)
   ↓
3. User preenche:
   - Título: "Review colors"
   - Descrição: "Check if colors match brand guidelines"
   ↓
4. Clica SAVE
   ↓
5. Task criada com fileId = Design.pdf
   ↓
6. DocEditorView carrega novamente
   ↓
7. "Tarefas Ativas" agora mostra:
   ✓ Review colors (task-uuid) - recém criada
   ✓ Other task (task-uuid) - existente
   ↓
8. User volta para TaskWorkspaceOverlay (editar task)
   ↓
9. Vê na sidebar:
   "📄 Arquivo: Design.pdf"
   ↓
10. Clica botão "Ir para Arquivo"
    ↓
11. Volta para DocEditorView (Design.pdf)
    ↓
12. Tarefa continua na lista
    ↓
13. User marca tarefa como "Completa"
    ↓
14. Status muda para "completed"
    completedAt = now()
    ↓
15. DocEditorView:
    - Remove de "Tarefas Ativas"
    - Adiciona em "Histórico"
    - Exibe: "✗ Review colors - Completada 18/12 às 15:30"
    ↓
16. Link fica apenas como histórico
    (não aparece mais em "ativas")
```

---

## 💡 Resumo Executivo

| Aspecto | TaskWorkspaceOverlay | FileTaskPanel |
|---------|----------------------|---------------|
| **O que é** | Modal de editar tarefa | Painel em arquivo |
| **Quando abre** | User clica tarefa | Sempre visível |
| **Função** | Editar/visualizar | Listar relacionadas |
| **Integração** | PranaWorkspaceLayout | DocEditorView |
| **Novo campo** | fileId (qual arquivo) | taskStatus (ativo/completo) |
| **Ação principal** | SAVE task → atualiza | CREATE task → abre overlay |

---

## ✅ Decisão

Para o **novo sistema de file-task dinâmico**:

- ✅ Usar **TaskWorkspaceOverlay** para editar/criar tarefas com arquivo
- ✅ Usar **FileTaskStatusPanel** (novo) em DocEditorView para listar
- ✅ Guardar `fileId` e `completedAt` na task table
- ✅ Status da task controla visibilidade (ativo vs histórico)

**NÃO usar** FileTaskPanel/FileTaskLinkModal que criamos antes (era pra links permanentes).

---

**Confirma?** Dessa forma fica claro:
- TaskWorkspaceOverlay = lugar de **editar/criar tarefas**
- DocEditorView = lugar de **ver tarefas ativas e histórico**
- O link é dinâmico através do `status`, não permanente

