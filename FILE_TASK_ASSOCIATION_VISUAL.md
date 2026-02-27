# File-Task Association System - Visual Summary

## 🎯 O Que É

Sistema que permite **vincular arquivos (Files/Artefatos) a tarefas**, criando uma relação bidirecional:

```
┌──────────────┐                    ┌──────────────┐
│   ARQUIVO    │ ←── Associação ──→ │    TAREFA    │
│ (Documento)  │    (Bidirecional)  │ (Execução)   │
└──────────────┘                    └──────────────┘
   - Manifesto                          - Revisar
   - Código                             - Modificar
   - Acordo                             - Criar
   - Guia                               - Review
```

---

## 🔄 Fluxos Principais

### Fluxo 1: Criar Tarefa a Partir de um Arquivo

```
┌─────────────────────────────────────────────────┐
│ DocEditorView (Editando "Manifesto 2025")       │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ Usuário clica "Criar Tarefa"                    │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ Modal abre com:                                 │
│ - Título: "Revisar Manifesto 2025"              │
│ - Tipo de relação: [Revisar ▼]                  │
│ - Descrição: "Revisar pontos principais..."     │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ Salvar → Cria:                                  │
│ 1. Nova Task                                    │
│ 2. FileTaskAssociation {                        │
│    fileId, taskId, relationship: "review"       │
│ }                                               │
│ 3. Atualiza contadores de cache                 │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ DocEditorView atualiza:                         │
│ ✓ "Tarefas Relacionadas" mostra nova tarefa     │
│ ✓ Badge "1" no ícone de tarefas                 │
└─────────────────────────────────────────────────┘
```

### Fluxo 2: Vincular Arquivo Existente a Tarefa Existente

```
┌─────────────────────────────────────────────────┐
│ TaskDetailsView (Vendo "Revisar Manifesto")     │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ Usuário clica "Adicionar Arquivo" no painel     │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ FileTaskLinkModal abre:                         │
│ ┌───────────────────────────────────────────┐   │
│ │ Buscar arquivos...              [Search] │   │
│ ├───────────────────────────────────────────┤   │
│ │ ☐ Manifesto 2025       [Manifesto]        │   │
│ │ ☑ Acordo de Parceria   [Agreement] ✓      │   │
│ │ ☐ Guia de Impl         [Guide]            │   │
│ └───────────────────────────────────────────┘   │
│                                                  │
│ Tipo: [Modificar ▼]                            │
│                                                  │
│ [Cancelar] [Vincular]                          │
└─────────────────────────────────────────────────┘
                      │
                      ↓
┌─────────────────────────────────────────────────┐
│ Cria associação:                                │
│ {                                               │
│   fileId: "doc_agreement",                      │
│   taskId: "task_123",                           │
│   relationship: "modify"                        │
│ }                                               │
└─────────────────────────────────────────────────┘
```

---

## 📊 Estrutura de Dados

### Tabela: `file_task_associations`

```sql
CREATE TABLE file_task_associations (
  id              text PRIMARY KEY,
  file_id         text NOT NULL FK → papyrus_documents,
  task_id         text NOT NULL FK → tasks,
  
  document_type   text DEFAULT 'note' 
                  -- note, diary, agreement, manifest, guide, code, other
  
  relationship    text DEFAULT 'modify'
                  -- modify, review, create, reference, depends_on
  
  created_at      timestamp DEFAULT now(),
  created_by      text FK → users,
  is_active       boolean DEFAULT true,
  
  UNIQUE(file_id, task_id) -- Impede duplicatas
);
```

### Colunas de Cache

**Em `papyrus_documents`**:
```javascript
relatedTasksCount: integer DEFAULT 0
isLinkedToTask: boolean DEFAULT false
```

**Em `tasks`**:
```javascript
relatedFilesCount: integer DEFAULT 0
```

---

## 🔗 Tipos de Relacionamento

```
┌─────────┬────────────────────────────────────────────┐
│ modify  │ Tarefa é para MODIFICAR o arquivo         │
│         │ Ex: "Atualizar código", "Editar manifesto"│
├─────────┼────────────────────────────────────────────┤
│ review  │ Tarefa é para REVISAR o arquivo           │
│         │ Ex: "Revisar acordo", "Code review"       │
├─────────┼────────────────────────────────────────────┤
│ create  │ Tarefa é para CRIAR o arquivo             │
│         │ Ex: "Escrever documento", "Implementar"   │
├─────────┼────────────────────────────────────────────┤
│ reference│ Arquivo é REFERÊNCIA para a tarefa       │
│         │ Ex: "Ver guia", "Consultar acordo"        │
├─────────┼────────────────────────────────────────────┤
│ depends_on│ Tarefa DEPENDE do arquivo pronto        │
│         │ Ex: "Deploy precisa de release notes"     │
└─────────┴────────────────────────────────────────────┘
```

---

## 🛣️ Rotas da API

### Criar Associação
```
POST /api/file-task-associations
{
  fileId: "doc_123",
  taskId: "task_456",
  relationship: "modify",
  documentType: "manifest"
}
```

### Obter Tarefas de um Arquivo
```
GET /api/files/:fileId/tasks
↓
[
  {
    id: "task_456",
    title: "Revisar manifesto",
    status: "doing",
    relationship: "review",
    ...
  }
]
```

### Obter Arquivos de uma Tarefa
```
GET /api/tasks/:taskId/files
↓
[
  {
    id: "doc_123",
    title: "Manifesto 2025",
    type: "text",
    documentType: "manifest",
    relationship: "review",
    ...
  }
]
```

### Remover Associação
```
DELETE /api/file-task-associations/:fileId/:taskId
```

---

## 🎨 Componentes React

### 1. FileTaskPanel
**Descrição**: Painel de visualização de associações

**Localização**: `/src/components/fileTask/FileTaskPanel.jsx`

**Props**:
```javascript
{
  type: 'task' | 'file',      // O que está sendo visualizado
  id: string,                  // ID da tarefa ou arquivo
  onAssociate?: () => void    // Callback para abrir modal
}
```

**Renders**:
```
[Arquivos Relacionados]  [+ Adicionar]
├─ 📄 Manifesto 2025
│  [Revisar] [x]
├─ 📄 Acordo de Parceria
│  [Modificar] [x]
└─ "Nenhum arquivo"
```

### 2. FileTaskLinkModal
**Descrição**: Modal para vincular arquivo a tarefa

**Localização**: `/src/components/fileTask/FileTaskLinkModal.jsx`

**Props**:
```javascript
{
  open: boolean,
  onOpenChange: (boolean) => void,
  type: 'task' | 'file',
  id: string,
  onLink?: (association) => void
}
```

**Features**:
- Search dinâmica
- Seletor de tipo de relacionamento
- Loading states
- Error handling

---

## 🔄 Ciclo Completo de Vida da Associação

```
1. CRIAR
   ├─ POST /api/file-task-associations
   ├─ Cria registro na DB
   ├─ Atualiza contadores (cache)
   └─ ✓ Retorna associação criada

2. VISUALIZAR
   ├─ GET /api/files/:id/tasks (via arquivo)
   ├─ GET /api/tasks/:id/files (via tarefa)
   └─ Componentes renderizam com dados

3. ATUALIZAR
   ├─ PUT /api/file-task-associations/:f/:t
   ├─ Muda tipo de relacionamento
   └─ UI atualiza

4. REMOVER
   ├─ DELETE /api/file-task-associations/:f/:t
   ├─ Deleta registro
   ├─ Atualiza contadores
   └─ UI remove item

5. DELETE CASCADE
   ├─ Se arquivo é deletado
   ├─ Ou se tarefa é deletada
   └─ Associação é removida automaticamente
```

---

## 📈 Cache & Performance

### Por que Cache?

```
SEM Cache:
GET /files/doc_123/tasks → Query toda vez
└─ Lento com muitas associações

COM Cache (relatedTasksCount):
GET /files/doc_123 → Mostra "3 tarefas" no badge
└─ Rápido, sem query extra
```

### Atualização do Cache

```javascript
// Toda vez que criar/remover associação:
await updateCounters(fileId, taskId)
  ├─ Conta tarefas ativas do arquivo
  ├─ Conta arquivos ativos da tarefa
  └─ Atualiza colunas de cache
```

---

## 🧪 Teste Rápido

### 1. Criar Arquivo + Tarefa
```bash
# Criar doc (seu endpoint)
curl -X POST http://localhost:3000/api/papyrus \
  -H "Content-Type: application/json" \
  -d '{"title":"Manifesto", "content":"..."}'
# Resposta: { id: "doc_123", ... }

# Criar task (seu endpoint)
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Revisar", "projectId":"proj_..."}'
# Resposta: { id: "task_456", ... }
```

### 2. Vincular
```bash
curl -X POST http://localhost:3000/api/file-task-associations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "fileId": "doc_123",
    "taskId": "task_456",
    "relationship": "review"
  }'
```

### 3. Verificar
```bash
# Ver tarefas do arquivo
curl http://localhost:3000/api/files/doc_123/tasks \
  -H "Authorization: Bearer TOKEN"

# Ver arquivos da tarefa
curl http://localhost:3000/api/tasks/task_456/files \
  -H "Authorization: Bearer TOKEN"
```

---

## 📋 Checklist de Integração

- [ ] Integrar `FileTaskPanel` em `DocEditorView`
- [ ] Integrar `FileTaskPanel` em `TaskDetailsView`
- [ ] Integrar `FileTaskLinkModal` em ambas
- [ ] Implementar busca dinâmica no modal
- [ ] Adicionar badges de contadores nas listas
- [ ] Testar criação de tarefa a partir de arquivo
- [ ] Testar remoção de associação
- [ ] Testar mudança de tipo de relacionamento
- [ ] Adicionar notificações de sucesso/erro
- [ ] Testar cascade delete (deletar arquivo/tarefa)

---

**Status**: ✅ Backend Completo | ⏳ Frontend (Base + Integração Pendente)
**Build**: ✅ Compila sem erros
**Database**: ✅ Migration criada
**Routes**: ✅ Todas as rotas implementadas
