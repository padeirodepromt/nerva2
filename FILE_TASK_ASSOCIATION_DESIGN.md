# Design: File-Task Association System (Artefatos ↔ Tarefas)

## 1. Visão Geral

**Objetivo**: Criar uma associação bidirecional entre Arquivos (Files/Artefatos) e Tarefas, permitindo:
- Vincular um arquivo a uma ou mais tarefas
- Vincular uma tarefa a um ou mais arquivos
- Visualizar e gerenciar essas conexões em ambos os lados
- Criar tarefas diretamente de dentro de um arquivo

**Nomenclatura**:
- **File/Artefato**: Qualquer conteúdo criado no Prana (documento, código, manifesto, acordo, guia, etc)
- **Task**: Tarefa de execução/modificação de um arquivo

## 2. Arquitetura de Dados

### 2.1 Nova Tabela: `file_task_associations`

```javascript
export const fileTaskAssociations = pgTable('file_task_associations', {
  id: text('id').primaryKey().$defaultFn(() => createId('fta')),
  
  // Referências Bidirecionais
  fileId: text('file_id').notNull()
    .references(() => papyrusDocuments.id, { onDelete: 'cascade' }),
  taskId: text('task_id').notNull()
    .references(() => tasks.id, { onDelete: 'cascade' }),
  
  // Contexto da Associação
  associationType: text('association_type', {
    enum: ['document', 'code', 'agreement', 'manifest', 'guide', 'other']
  }).default('document'), // Tipo de arquivo (herança de papyrusDocuments.documentType)
  
  relationship: text('relationship', {
    enum: ['modify', 'review', 'create', 'reference', 'depends_on']
  }).default('modify'), // Como a tarefa se relaciona com o arquivo
  
  // Auditoria
  createdAt: timestamp('created_at').defaultNow(),
  createdBy: text('created_by').references(() => users.id),
  
  // Flags
  isActive: boolean('is_active').default(true),
}, (table) => ({
  // Impede duplicatas
  uniqueAssociation: unique().on(table.fileId, table.taskId),
  // Índices para queries rápidas
  fileIdx: index().on(table.fileId),
  taskIdx: index().on(table.taskId),
}));
```

### 2.2 Alterações em `papyrusDocuments`

Adicionar coluna para rastreamento rápido:

```javascript
// Em papyrusDocuments:
relatedTasksCount: integer('related_tasks_count').default(0), // Cache para UI
isLinkedToTask: boolean('is_linked_to_task').default(false), // Flag rápido
```

### 2.3 Alterações em `tasks`

Adicionar coluna para rastreamento rápido:

```javascript
// Em tasks:
relatedFilesCount: integer('related_files_count').default(0), // Cache para UI
primaryFileId: text('primary_file_id') // Arquivo principal (se houver)
  .references(() => papyrusDocuments.id, { onDelete: 'set null' }),
```

## 3. Fluxos de Uso

### 3.1 Criar Tarefa a partir de um Arquivo

**Fluxo**:
1. Usuário está editando um arquivo (DocEditorView)
2. Clica em "Criar Tarefa" ou "Nova Tarefa para Este Arquivo"
3. Modal abre com contexto pré-preenchido:
   - Título sugerido baseado no arquivo
   - Tipo de tarefa (modify, review, create, etc)
   - Descrição vem de um trecho do arquivo
4. Ao salvar a tarefa, cria automaticamente o `fileTaskAssociation`

**API**:
```javascript
POST /api/tasks
{
  title: "Revisar acordo de parceria",
  projectId: "proj_...",
  fileId: "doc_...", // NOVO
  relationship: "review", // NOVO
  description: "Revisar cláusulas de não-concorrência"
}
```

### 3.2 Vincular Arquivo Existente a Tarefa Existente

**Fluxo**:
1. Usuário na tela de Tarefa (TaskDetailsView ou Modal)
2. Clica em "Vincular Arquivo" ou "Adicionar Arquivo"
3. Search/Select de arquivos do projeto
4. Seleciona tipo de relacionamento (modify, review, reference, etc)
5. Associação é criada

**API**:
```javascript
POST /api/files/:fileId/associate-task
{
  taskId: "task_...",
  relationship: "modify"
}

// OU

POST /api/tasks/:taskId/associate-file
{
  fileId: "doc_...",
  relationship: "review"
}
```

### 3.3 Visualizar Arquivos Vinculados em uma Tarefa

**Fluxo**:
1. Na tela de Task Details ou no TaskWorkspaceOverlay
2. Seção "Arquivos Relacionados" mostra:
   - Miniatura/preview do arquivo
   - Título do arquivo
   - Tipo de relacionamento (Modificar, Revisar, Referenciar, etc)
   - Status do arquivo (ativo, arquivado)
   - Ação de abrir arquivo

**API**:
```javascript
GET /api/tasks/:taskId/files
// Response:
[
  {
    id: "doc_...",
    title: "Acordo de Parceria",
    fileUrl: "...",
    relationship: "review",
    status: "active",
    updatedAt: "2025-12-18..."
  }
]
```

### 3.4 Visualizar Tarefas Vinculadas em um Arquivo

**Fluxo**:
1. Na tela de DocEditorView (editor)
2. Lado esquerdo ou aba "Tarefas Relacionadas" mostra:
   - Título da tarefa
   - Status (todo, doing, done)
   - Assignee
   - Tipo de relacionamento
   - Ação de abrir tarefa

**API**:
```javascript
GET /api/papyrus/:fileId/tasks
// Response:
[
  {
    id: "task_...",
    title: "Revisar cláusulas",
    status: "doing",
    assignee: { name: "Maria", avatar: "..." },
    relationship: "review",
    priority: "high"
  }
]
```

## 4. Tipos de Relacionamento

| Tipo | Significado | Exemplo |
|------|-------------|---------|
| `modify` | Tarefa é para modificar o arquivo | "Atualizar código", "Editar manifesto" |
| `review` | Tarefa é para revisar/validar o arquivo | "Revisar acordo", "Code review" |
| `create` | Tarefa é para criar este arquivo | "Escrever documento", "Implementar feature" |
| `reference` | Arquivo é referência para a tarefa | "Ver guia de implementação" |
| `depends_on` | Tarefa depende do arquivo estar pronto | "Deploy depende do release notes" |

## 5. Componentes a Criar/Modificar

### 5.1 Novos Componentes

1. **FileTaskAssociationPanel** - Painel bidirecional de visualização
   - Mostra arquivos vinculados a uma tarefa
   - Mostra tarefas vinculadas a um arquivo
   - Permite adicionar/remover associações

2. **FileTaskSelector** - Modal de seleção
   - Search de arquivos
   - Search de tarefas
   - Seleção de tipo de relacionamento

3. **CreateTaskFromFileModal** - Modal contextuado
   - Pré-preenche dados do arquivo
   - Seleciona tipo de relacionamento
   - Cria tarefa e associação

### 5.2 Componentes a Modificar

1. **DocEditorView** - Adicionar painel de tarefas relacionadas
2. **TaskDetailsView** / **TaskWorkspaceOverlay** - Adicionar painel de arquivos
3. **TaskModal** / **PranaFormModal** - Adicionar opção de vincular arquivo
4. **ProjectHierarchy** - Mostrar contador de tarefas em arquivos

## 6. API Endpoints

### Arquivos
```
GET    /api/files/:fileId/tasks        - Listar tarefas vinculadas
POST   /api/files/:fileId/associate-task
PUT    /api/files/:fileId/dissociate-task
```

### Tarefas
```
GET    /api/tasks/:taskId/files        - Listar arquivos vinculados
POST   /api/tasks/:taskId/associate-file
PUT    /api/tasks/:taskId/dissociate-file
POST   /api/tasks/create-from-file     - Criar tarefa de um arquivo
```

### Associações
```
POST   /api/file-task-associations     - Criar associação
DELETE /api/file-task-associations/:id - Remover associação
PUT    /api/file-task-associations/:id - Atualizar tipo
GET    /api/file-task-associations     - Listar com filtros
```

## 7. Estados e Cache

### Atualização de Contadores

Quando uma associação é criada/removida:
1. Incrementar/decrementar `papyrusDocuments.relatedTasksCount`
2. Incrementar/decrementar `tasks.relatedFilesCount`
3. Atualizar flag `papyrusDocuments.isLinkedToTask`

### Invalidação de Cache

Quando arquivo ou tarefa muda:
1. Invalidar cache de associações
2. Atualizar UI de ambos os lados (bidirecional)

## 8. Segurança e Permissões

- Usuário só pode associar se tem acesso ao arquivo **E** à tarefa
- Associações herdam visibilidade do arquivo e da tarefa
- Se arquivo é deletado, associações são cascade-deletadas
- Se tarefa é deletada, associações são cascade-deletadas

## 9. Implementação Sequencial

### Fase 1: Backend
1. Criar migration para `fileTaskAssociations`
2. Criar controller `fileTaskAssociationController`
3. Implementar endpoints básicos (CRUD)
4. Adicionar queries de relacionamento

### Fase 2: Frontend - Visualização
1. Criar componentes de visualização
2. Integrar em DocEditorView
3. Integrar em TaskDetailsView
4. Adicionar indicadores visuais

### Fase 3: Frontend - Criação
1. Criar modal de criação de tarefa
2. Modal de vinculação de arquivo
3. Fluxo bidirecional completo

### Fase 4: UX Refinements
1. Sincronização em tempo real (se socket)
2. Notificações de mudanças
3. Histório de associações

## 10. Exemplo de Fluxo Completo

```
1. Usuário abre DocEditorView ("Manifesto 2025")
2. Clica "Criar Tarefa" no painel lateral
3. Modal CreateTaskFromFileModal abre com:
   - Título: "Revisar Manifesto 2025"
   - Tipo: "review"
   - Descrição: "Revisar pontos principais..."
4. Usuário salva a tarefa
5. Sistema cria:
   - Nova Task
   - FileTaskAssociation com relationship="review"
   - Atualiza counters
6. Na TaskDetailsView, aparece:
   - "Arquivos Relacionados" > "Manifesto 2025" [Revisar]
7. Usuário abre o arquivo do task (clica em "Manifesto")
8. DocEditorView mostra:
   - "Tarefas Relacionadas" > "Revisar Manifesto 2025" [doing]
9. Ao completar a tarefa:
   - Status muda para "done"
   - UI de ambos lados atualiza
```

---

**Status**: Design Document
**Próximo Passo**: Criar migration + backend
