# File-Task Association System - Implementation Guide

## 🎉 Status: Implementação Completa (Backend + Frontend Base)

Sistema de associação bidirecional entre Arquivos (Files/Artefatos) e Tarefas implementado com sucesso.

---

## 📦 O Que Foi Criado

### 1. **Database Layer** ✅
- **Nova Tabela**: `file_task_associations` 
  - Chave primária composta: `(fileId, taskId)`
  - Colunas: relationship, documentType, createdAt, createdBy, isActive
  - Índices para performance em queries
  - Cascade delete automático

- **Colunas de Cache** em `papyrusDocuments`:
  - `relatedTasksCount` - número de tarefas vinculadas
  - `isLinkedToTask` - flag para UI rápida

- **Colunas de Cache** em `tasks`:
  - `relatedFilesCount` - número de arquivos vinculados

### 2. **Backend (Node.js/Express)** ✅

**Controller**: `/src/api/controllers/fileTaskAssociationController.js`
- `createAssociation()` - Criar associação
- `getTasksByFile()` - Listar tarefas de um arquivo
- `getFilesByTask()` - Listar arquivos de uma tarefa
- `updateAssociation()` - Mudar tipo de relacionamento
- `deleteAssociation()` - Remover associação
- `updateCounters()` - Manter cache atualizado
- `listAssociations()` - Listar com filtros

**Rotas**: `/src/api/fileTaskAssociationRoutes.js`
```
POST   /api/file-task-associations          - Criar
GET    /api/file-task-associations          - Listar
GET    /api/files/:fileId/tasks             - Tarefas de arquivo
GET    /api/tasks/:taskId/files             - Arquivos de tarefa
PUT    /api/file-task-associations/:f/:t    - Atualizar
DELETE /api/file-task-associations/:f/:t    - Remover
POST   /api/files/:fileId/associate-task    - Vincular rápido
POST   /api/tasks/:taskId/associate-file    - Vincular rápido
DELETE /api/files/:fileId/tasks/:taskId     - Desvincular
DELETE /api/tasks/:taskId/files/:fileId     - Desvincular
```

**Integração no Server**: `server.js` linha ~85
```javascript
import fileTaskAssociationRoutes from './src/api/fileTaskAssociationRoutes.js';
// ...
app.use('/api', fileTaskAssociationRoutes); // Protegido por authenticate
```

### 3. **Frontend (React)** ✅

**API Hook**: `/src/api/fileTaskAssociationAPI.js`
- Wrapper JavaScript das endpoints REST
- Métodos para criar, ler, atualizar, remover associações
- Tratamento automático de erro/sucesso

**Componentes**:

1. **FileTaskPanel** (`/src/components/fileTask/FileTaskPanel.jsx`)
   - Painel de visualização bidirecional
   - Mostra lista de arquivos/tarefas vinculadas
   - Permite remover associações
   - States: loading, error, items
   - Props: `type` ('task' | 'file'), `id`, `onAssociate`

2. **FileTaskLinkModal** (`/src/components/fileTask/FileTaskLinkModal.jsx`)
   - Modal para vincular arquivos a tarefas
   - Search com query
   - Seletor de tipo de relacionamento
   - States: search, relationship, selectedItem, selecting
   - Props: `open`, `onOpenChange`, `type`, `id`, `onLink`

### 4. **Database Migration** ✅
- Arquivo: `/drizzle/0001_familiar_black_crow.sql`
- Alterações:
  - Cria tabela `file_task_associations`
  - Adiciona colunas de cache em `papyrusDocuments` e `tasks`
  - Cria índices para performance
  - Cria foreign keys com cascade delete

---

## 🚀 Como Usar

### Backend (Para Desenvolvedores)

```javascript
// Controller já está pronto, apenas registrar em EntityRoutes se necessário
// Rotas já estão registradas em server.js
```

### Frontend (Para Integração)

#### 1. Mostrar Arquivos Vinculados em uma Tarefa

```jsx
import { FileTaskPanel } from '@/components/fileTask/FileTaskPanel';

function TaskDetailsView({ taskId }) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  return (
    <div>
      {/* ... outras seções ... */}
      
      <FileTaskPanel 
        type="task" 
        id={taskId}
        onAssociate={() => setLinkModalOpen(true)}
      />

      <FileTaskLinkModal
        open={linkModalOpen}
        onOpenChange={setLinkModalOpen}
        type="task"
        id={taskId}
        onLink={() => {
          // Reload panel
          setLinkModalOpen(false);
        }}
      />
    </div>
  );
}
```

#### 2. Mostrar Tarefas Vinculadas em um Arquivo

```jsx
import { FileTaskPanel } from '@/components/fileTask/FileTaskPanel';

function DocEditorView({ fileId }) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);

  return (
    <div className="flex">
      {/* Editor à esquerda */}
      <div className="flex-1">{/* ... editor ... */}</div>

      {/* Painel lateral direito */}
      <aside className="w-64 border-l border-white/10 p-4 space-y-4">
        <FileTaskPanel 
          type="file" 
          id={fileId}
          onAssociate={() => setLinkModalOpen(true)}
        />

        <FileTaskLinkModal
          open={linkModalOpen}
          onOpenChange={setLinkModalOpen}
          type="file"
          id={fileId}
          onLink={() => setLinkModalOpen(false)}
        />
      </aside>
    </div>
  );
}
```

#### 3. Criar Tarefa a Partir de um Arquivo

```jsx
// Em DocEditorView, adicionar botão "Criar Tarefa"
async function handleCreateTaskFromFile() {
  const taskData = {
    title: `Tarefa: ${fileTitle}`,
    description: `Modificar ${fileTitle}`,
    projectId: currentProjectId,
    fileId: currentFileId,
    relationship: 'modify', // ou review, create, etc
  };

  const createdTask = await TaskAPI.create(taskData);
  
  // Se TaskAPI não criar associação automaticamente, criar manualmente:
  // await FileTaskAssociationAPI.associateFileToTask(fileId, createdTask.id, 'modify');
  
  // Reload panel
  window.location.reload(); // ou usar state management melhor
}
```

---

## 🔧 Tipos de Relacionamento

| Tipo | Meaning | Exemplo |
|------|---------|---------|
| `modify` | Tarefa é para modificar o arquivo | "Atualizar código", "Editar manifesto" |
| `review` | Tarefa é para revisar o arquivo | "Revisar acordo", "Code review" |
| `create` | Tarefa é para criar o arquivo | "Escrever documento", "Implementar" |
| `reference` | Arquivo é referência para tarefa | "Ver guia", "Consultar acordo" |
| `depends_on` | Tarefa depende do arquivo pronto | "Deploy depende de release notes" |

---

## 📋 Checklista de Implementação Frontend Completa

- [ ] 1. Integrar `FileTaskPanel` em `DocEditorView.jsx`
- [ ] 2. Integrar `FileTaskLinkModal` em `DocEditorView.jsx`
- [ ] 3. Integrar `FileTaskPanel` em `TaskDetailsView.jsx` ou `TaskWorkspaceOverlay.jsx`
- [ ] 4. Integrar `FileTaskLinkModal` em `TaskDetailsView.jsx` ou `TaskWorkspaceOverlay.jsx`
- [ ] 5. Adicionar botão "Criar Tarefa" em `DocEditorView` (usa `createTaskFromFile`)
- [ ] 6. Adicionar badge/contador de arquivos em cards de Tarefas (mostra `relatedFilesCount`)
- [ ] 7. Adicionar badge/contador de tarefas em cards de Arquivos (mostra `relatedTasksCount`)
- [ ] 8. Implementar busca dinâmica em `FileTaskLinkModal` (search arquivos/tarefas do projeto)
- [ ] 9. Adicionar notificações ao vincular/desvincular (toast/snackbar)
- [ ] 10. Testar fluxo completo: Criar arquivo → Criar tarefa → Vincular → Visualizar

---

## 🧪 Teste Rápido (API)

```bash
# 1. Criar associação
curl -X POST http://localhost:3000/api/file-task-associations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fileId": "doc_123",
    "taskId": "task_456",
    "relationship": "modify",
    "documentType": "manifest"
  }'

# 2. Obter tarefas de um arquivo
curl http://localhost:3000/api/files/doc_123/tasks \
  -H "Authorization: Bearer TOKEN"

# 3. Obter arquivos de uma tarefa
curl http://localhost:3000/api/tasks/task_456/files \
  -H "Authorization: Bearer TOKEN"

# 4. Remover associação
curl -X DELETE http://localhost:3000/api/file-task-associations/doc_123/task_456 \
  -H "Authorization: Bearer TOKEN"
```

---

## 🎯 Próximos Passos (Nice-to-Have)

1. **Notificações em Tempo Real**
   - WebSocket para updates bidirecionales
   - Se arquivo é atualizado, notificar tarefas relacionadas

2. **Histórico de Modificações**
   - Tabela `file_task_association_history` para audit trail
   - Quem vinculou, quando, tipo de relacionamento anterior

3. **Validações Avançadas**
   - Evitar ciclos (arquivo A depende de B, B depende de A)
   - Limitar número de associações por arquivo/tarefa

4. **Visualização de Dependências**
   - Grafo visual de arquivo ↔ tarefas
   - Timeline de execução baseada em dependências

5. **Automações**
   - Quando arquivo é arquivado, sugerir arquivar tarefas relacionadas
   - Quando tarefa é completada, marcar arquivo como "up-to-date"

---

## 📁 Estrutura de Arquivos Criados

```
/workspaces/prana3.0/
├── src/
│   ├── api/
│   │   ├── controllers/
│   │   │   └── fileTaskAssociationController.js        [NOVO]
│   │   ├── fileTaskAssociationAPI.js                   [NOVO]
│   │   └── fileTaskAssociationRoutes.js                [NOVO]
│   ├── components/
│   │   └── fileTask/
│   │       ├── FileTaskPanel.jsx                       [NOVO]
│   │       └── FileTaskLinkModal.jsx                   [NOVO]
│   ├── db/
│   │   └── schema/
│   │       ├── core.js                                 [MODIFICADO]
│   │       └── docs.js                                 [MODIFICADO]
├── drizzle/
│   └── 0001_familiar_black_crow.sql                    [NOVO]
├── server.js                                           [MODIFICADO]
└── FILE_TASK_ASSOCIATION_DESIGN.md                     [NOVO - Design Doc]
```

---

## 🔑 Chaves de Design

1. **Bidirecional**: Associação funciona em ambas as direções (arquivo → tarefa, tarefa → arquivo)
2. **Cascata**: Se arquivo ou tarefa é deletada, associação é removida automaticamente
3. **Cache**: Contadores atualizados para UI rápida sem queries pesadas
4. **Flexível**: Tipos de relacionamento permitem diferentes semânticas
5. **Seguro**: Validação de acesso (usuário deve ter acesso a ambos os lados)

---

## ❓ FAQs

**P: Posso vincular um arquivo a múltiplas tarefas?**
R: Sim! A chave primária é composta `(fileId, taskId)`, permitindo 1:N e M:N.

**P: Posso mudar o tipo de relacionamento depois?**
R: Sim! Endpoint `PUT /api/file-task-associations/:f/:t` atualiza.

**P: O que acontece se deleto um arquivo?**
R: Todas as associações são deletadas automaticamente (cascade delete).

**P: Como funciona a busca em `FileTaskLinkModal`?**
R: Implementar contra API própria (por enquanto tem mock). Sugerir usar `search_papyrus_notes` + filtro de status de tarefas.

**P: Há limite de associações?**
R: Não hardcoded, mas considerar criar limite para UX (ex: max 10 arquivos por tarefa).

---

**Status**: ✅ Pronto para integração frontend
**Próximo**: Integrar componentes em Views + testar fluxos completos
**Autor**: GitHub Copilot
**Data**: 2025-12-18
