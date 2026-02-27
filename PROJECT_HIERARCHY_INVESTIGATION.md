# INVESTIGAÇÃO: PROJECT HIERARCHY - O QUE É POSSÍVEL FAZER

**Data:** 22 de Dezembro de 2025  
**Status:** ✅ INVESTIGAÇÃO COMPLETA

---

## 1. O QUE PODE SER CRIADO A PARTIR DE UM PROJETO?

### Confirmação: SIM, múltiplos itens podem ser criados

#### **A. Subprojetos (Sim, confirmado)**
- **Como:** Clicando em um projeto → Menu de contexto → "Nova Pasta" ou clique direito → "Novo Subprojeto"
- **Método:** Via `handleCreateOpen('project', projectId)` no ProjectHierarchy
- **Backend:** `POST /api/projects` com `parentId` setado
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L140)
- **Estrutura:**
  ```javascript
  const handleCreateConfirm = async () => {
      if (type === 'project') {
          await Project.create({ 
              title: name, 
              parentId: safeParentId,  // ← Subprojeto fica ligado ao pai
              status: 'active' 
          });
      }
  };
  ```

#### **B. Tarefas (Sim, confirmado)**
- **Como:** Clicando em um projeto → Menu contexto → "Nova Tarefa" ou botão "+" hover
- **Método:** Via `handleCreateOpen('task', projectId)`
- **Backend:** `POST /api/tasks` com `project_id` ou `projectId`
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L171)
- **Estrutura:**
  ```javascript
  if (type === 'task') {
      await Task.create({ 
          title: name, 
          project_id: safeParentId,  // ← Tarefa fica vinculada ao projeto
          status: 'todo' 
      });
  }
  ```

#### **C. Documentos (Sim, confirmado)**
- **Como:** Clicando em um projeto → Menu contexto → "Novo Doc" ou botão de arquivo
- **Método:** Via `handleCreateOpen('document', projectId)`
- **Backend:** `POST /api/documents` com `project_id`
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L176)
- **Estrutura:**
  ```javascript
  if (type === 'document') {
      await Document.create({ 
          title: name, 
          project_id: safeParentId  // ← Documento fica no projeto
      });
  }
  ```

#### **D. Mind Maps (Sim, confirmado)**
- **Como:** Clicando em um projeto → Modal de criação → Selecionar "Mapa" no dropdown
- **Método:** Via `handleCreateOpen('mindmap', projectId)`
- **Backend:** `POST /api/mind-maps` com `project_id`
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L181)
- **Estrutura:**
  ```javascript
  if (type === 'mindmap') {
      await MindMap.create({ 
          title: name, 
          project_id: safeParentId  // ← Mapa fica no projeto
      });
  }
  ```

#### **E. Eventos (SIM, disponível mas não integrado no ProjectHierarchy)**
- **Status:** ✅ Existe em `events` table (schema/calendar.js)
- **Como acessar:** Via Calendar (não pelo Project Explorer)
- **Classe:** `export class Event extends BaseEntity { static resource = 'events'; }`
- **Código:** [entities.js](src/api/entities.js#L165)
- **Rota:** `GET/POST /api/calendar/events`
- **Nota:** Não está integrado no menu contextual do ProjectHierarchy

#### **F. Checklists (SIM, mas como CAMPO em Tarefas)**
- **Status:** ✅ Existe mas é apenas um CAMPO dentro de tarefas
- **Estrutura:** `checklist: jsonb('checklist')` no schema `tasks`
- **Como usar:** 
  ```javascript
  // Ao criar/atualizar tarefa:
  await Task.create({ 
      title: "Tarefa com checklist",
      project_id: projectId,
      checklist: [
          { item: "Ação 1", done: false },
          { item: "Ação 2", done: true }
      ]
  });
  ```
- **Código:** [taskController.js](src/api/controllers/taskController.js#L25)

#### **G. Sparks (NÃO encontrado)**
- **Status:** ❌ Não existe no schema
- **Investigação:** Procurei por "spark" em todo o codebase e não encontrei
- **Alternativa:** Pode estar referenciando "Insights" gerados pelo Ash (IA)
- **Ash Insights:** `Ash.getDailyInsight()` disponível em [entities.js](src/api/entities.js#L121)

#### **H. Menu Contextual (Sim, confirmado)**
- **O que contém:**
  1. **Para Pastas/Projetos:**
     - "Nova Tarefa"
     - "Novo Doc"
     - "Nova Pasta" (subprojeto)
     - "Renomear"
     - "Excluir"
  
  2. **Para Arquivos (Tarefas/Docs/Maps):**
     - "Renomear"
     - "Excluir"

- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L318-L346)
  ```jsx
  {contextMenu.item?.isFolder && (
      <>
          <button onClick={() => handleCreateOpen('task', contextMenu.item.id)}>Nova Tarefa</button>
          <button onClick={() => handleCreateOpen('document', contextMenu.item.id)}>Novo Doc</button>
          <button onClick={() => handleCreateOpen('project', contextMenu.item.id)}>Nova Pasta</button>
      </>
  )}
  <button onClick={() => setRenameModal({...})}>Renomear</button>
  <button onClick={handleDelete}>Excluir</button>
  ```

---

## 2. RENOMEAÇÃO E HIERARQUIA

### Renomeação tem campo `parentId`? **NÃO**
- **Status:** ❌ Não é possível alterar parentId durante renomeação
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L223)
  ```javascript
  const handleRename = async () => {
      const { item, value } = renameModal;
      if (!value.trim()) return;
      try {
          const updateFn = {
              'project': Project.update,  // ← Chama Project.update com apenas 'title'
              'task': Task.update,
              'document': Document.update,
              'mindmap': MindMap.update
          }[item.type];
          await updateFn(item.id, { title: value });  // ← SÓ title é enviado
          // ...
      }
  };
  ```

### É possível ALTERAR parentId? **SIM, mas não na renomeação**
- **Status:** ✅ Sim, mas apenas via **Drag & Drop** ou **atualização separada**
- **Método:** Via `PUT /api/projects/:id` com `{ parentId: newParentId }`
- **Exemplo:**
  ```javascript
  await Project.update(projectId, { parentId: newParentId });
  ```

### Há operação separada para "mover entre projetos"? **NÃO (usa update genérico)**
- **Status:** ⚠️ Não há endpoint dedicado, usa o update genérico
- **Como funciona:**
  ```javascript
  // No ProjectHierarchy.jsx - Drag & Drop:
  const payload = dragNode.type === 'project' 
      ? { parentId: newParentId }           // Para Projetos
      : { project_id: newParentId };        // Para Tarefas/Docs/Maps
  await updateFn(dragNode.id, payload);
  ```

### Se mover, o que acontece com filhos? **SEM CASCATA OBRIGATÓRIA**
- **Status:** ⚠️ Os filhos NÃO são movidos automaticamente
- **Comportamento:** Apenas o projeto pai muda de `parentId`
- **Validação no Backend:**
  ```javascript
  // projectController.js - update():
  const updates = req.body;  // Apenas atualiza o que vier
  updates.updatedAt = new Date();
  await db.update(schema.projects)
      .set(updates)
      .where(eq(schema.projects.id, id));
  ```
- **Nota:** Não há validação de cascata ou ciclos circulares no código atual

---

## 3. OPERAÇÕES DE MOVIMENTO

### Drag-and-Drop funciona? **SIM, confirmado e funcional**
- **Status:** ✅ Totalmente implementado
- **Onde:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L196-L216)
- **Código:**
  ```javascript
  const handleDrop = async (e, targetItem) => {
      e.preventDefault(); e.stopPropagation();
      setDragOverNode(null);
      if (!dragNode || !targetItem || dragNode.id === targetItem.id) return;

      const newParentId = targetItem.type === 'inbox' ? null : targetItem.id;
      if (dragNode.type === 'project' && targetItem.id === dragNode.id) return;

      try {
          const updateFn = {
              'task': Task.update, 
              'document': Document.update,
              'mindmap': MindMap.update, 
              'project': Project.update
          }[dragNode.type];

          const payload = dragNode.type === 'project' 
              ? { parentId: newParentId } 
              : { project_id: newParentId };
          
          if (updateFn) {
              await updateFn(dragNode.id, payload);
              toast.success(`Movido para ${targetItem.title}`);
              if (onRefresh) onRefresh();
          }
      } catch (e) { 
          toast.error("Erro ao mover."); 
      }
      setDragNode(null);
  };
  ```

### Quais entidades podem ser movidas? **Todas**
- **Sim:** ✅ Projetos, Tarefas, Documentos, Mind Maps
- **Não:** ❌ Inbox (é apenas um container virtual)
- **Código:** Linha 313-319 em ProjectHierarchy.jsx
  ```jsx
  draggable={node.type !== 'inbox'}  // ← Inbox não é arrastável
  ```

### Há limite de profundidade ao mover? **NÃO há validação**
- **Status:** ⚠️ Sem limite implementado no código
- **Teoricamente:** Você pode criar uma cadeia infinita:
  - Projeto A → Subprojeto B → Subprojeto C → Subprojeto D → ...
- **Validação ausente:** Não há verificação de profundidade máxima
- **Performance:** Potencial problema em hierarquias muito profundas

### O que impede mover? **Pouco!**
- **Validações:**
  1. ✅ Não pode soltar em si mesmo:
     ```javascript
     if (!dragNode || !targetItem || dragNode.id === targetItem.id) return;
     ```
  2. ✅ Projetos não podem ser soltos em projetos (apenas em pastas):
     ```javascript
     if (dragNode.type === 'project' && targetItem.id === dragNode.id) return;
     ```
  3. ❌ **SEM:** Validação de ciclos (projeto A → B → A)
  4. ❌ **SEM:** Limite de profundidade
  5. ❌ **SEM:** Validação de permissões de compartilhamento

---

## 4. CRIAÇÃO CONTEXTUAL

### Quando crio tarefa "dentro" de um projeto, como funciona? **Automático**
- **Status:** ✅ Totalmente automático
- **Fluxo:**
  1. Clica em projeto → `handleCreateOpen('task', projectId)`
  2. Modal abre com `parentId = projectId`
  3. Digita nome → `handleCreateConfirm()`
  4. Backend recebe `project_id = parentId`
  5. Tarefa fica vinculada

### projectId é automaticamente setado? **SIM**
- **Status:** ✅ Sim, sempre
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L167-L173)
  ```javascript
  if (type === 'task') {
      await Task.create({ 
          title: name, 
          project_id: safeParentId,  // ← SEMPRE setado
          status: 'todo' 
      });
  }
  ```

### Posso criar tarefa em nível profundo (sub-sub-subprojeto)? **SIM**
- **Status:** ✅ Sim, sem limitações
- **Como:** 
  1. Clique em qualquer nó (Projeto A → B → C)
  2. Clique direito → "Nova Tarefa"
  3. Modal usa `parentId = C.id`
  4. Tarefa fica em `project_id = C.id`
- **Limitação:** Tarefas não têm seu próprio parentId (não há subtarefas via hierarchy)
- **Nota:** Existe `parentId` em tarefas para **subtarefas**, mas não é usado no ProjectHierarchy

### Documentos criados ficam com projectId? **SIM**
- **Status:** ✅ Sim, sempre
- **Código:** [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx#L174-L178)
  ```javascript
  if (type === 'document') {
      await Document.create({ 
          title: name, 
          project_id: safeParentId  // ← projectId é setado
      });
  }
  ```

---

## 5. API/BACKEND

### Endpoint para criar subprojeto
- **Endpoint:** `POST /api/projects`
- **Payload:**
  ```json
  {
    "title": "Nome do Subprojeto",
    "parentId": "proj_abc123",
    "ownerId": "user_xyz",
    "status": "active",
    "type": "personal",
    "isShared": false
  }
  ```
- **Resposta:** Status 201 + dados do projeto criado
- **Código:** [projectController.js](src/api/controllers/projectController.js#L70-L117)

### Endpoint para mover projeto
- **Endpoint:** `PUT /api/projects/:id`
- **Payload:**
  ```json
  {
    "parentId": "proj_novo_pai"
  }
  ```
- **Resposta:** `{ success: true }`
- **Código:** [projectController.js](src/api/controllers/projectController.js#L119-L141)

### Endpoint para atualizar parentId
- **Endpoint:** `PUT /api/projects/:id` (mesmo que mover)
- **Payload:**
  ```json
  {
    "parentId": "new_parent_id"
  }
  ```
- **Validação:** Apenas tipo + compartilhamento, sem ciclos

### Validações no Backend
1. **✅ Tipo (personal) não pode ser compartilhado:**
   ```javascript
   if (type === 'personal' && isShared) {
       return res.status(400).json({ 
           error: "Projetos pessoais não podem ser compartilhados" 
       });
   }
   ```

2. **❌ Sem validação de:**
   - Ciclos circulares (A → B → A)
   - Profundidade máxima
   - Permissões hierárquicas
   - Validação de parentId existente

### Schema de Projetos
```javascript
export const projects = pgTable('projects', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  parentId: text('parent_id'),  // ← Campo chave para hierarquia
  
  ownerId: text('owner_id').references(() => users.id),
  teamId: text('team_id').references(() => teams.id),
  
  type: text('type', { enum: ['personal', 'professional'] }).default('personal'),
  isShared: boolean('is_shared').default(false),
  visibility: text('visibility', { enum: ['private', 'shared', 'public'] }).default('private'),
  
  status: text('status').default('active'),
  // ... outros campos
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
```

### Schema de Tarefas
```javascript
export const tasks = pgTable('tasks', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  
  projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' }),
  parentId: text('parent_id'),  // Para subtarefas (não usado no UI)
  
  status: text('status').default('todo'),
  priority: text('priority').default('medium'),
  
  checklist: jsonb('checklist'),  // ← Checklists como campo
  // ... outros campos
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

---

## 6. RESUMO VISUAL

```
PROJETO (Pasta)
├── Pode ser criado em qualquer projeto (cria subprojeto)
├── Pode ser movido via drag-drop para outro projeto
├── Suporta profundidade infinita
├── Campo: parentId (vincula ao projeto pai)
└── Campos editáveis: title, description, type, isShared, etc

TAREFA (Arquivo)
├── Criada com project_id vinculado ao projeto pai
├── Pode ser movida entre projetos via drag-drop
├── Não pode ser subprojeto (mas tem parentId para subtarefas - não usada)
├── Campo: project_id (vincula ao projeto)
├── Tem checklist como campo (array de objetos)
└── Campos editáveis: title, status, priority, etc

DOCUMENTO
├── Criado com project_id vinculado ao projeto
├── Pode ser movido entre projetos via drag-drop
├── Campo: project_id
└── Campos editáveis: title, content, etc

MIND MAP
├── Criado com project_id vinculado ao projeto
├── Pode ser movido entre projetos via drag-drop
├── Campo: project_id
└── Campos editáveis: title, nodes, etc

EVENTO (Não integrado)
├── Existe em db.events mas não no Project Explorer
├── Acessado via Calendar (/api/calendar/events)
└── Não tem project_id (independente)

INBOX (Virtual)
├── Agrupa itens órfãos (sem project_id)
├── Não é arrastável
└── Itens nele têm project_id = null
```

---

## 7. LIMITAÇÕES E LACUNAS

### O que NÃO funciona:
1. ❌ **Criação de Sparks** - Não existem (ou estão com outro nome)
2. ❌ **Criação de Eventos** - Não integrados no ProjectHierarchy
3. ❌ **Validação de ciclos** - Pode criar A→B→C→A (loop infinito)
4. ❌ **Limite de profundidade** - Sem limite implementado
5. ❌ **Subtarefas via Hierarchy** - Tem `parentId` em tarefas mas não é usado no UI
6. ❌ **Renomear com movimento** - Renomeação não permite alterar parentId
7. ❌ **Cascata ao mover** - Filhos não se movem com pai
8. ❌ **Validação de permissões** - Sem verificação de acesso antes de mover

### Possíveis melhorias:
1. ✨ Adicionar validação de ciclos antes de salvar
2. ✨ Implementar limite de profundidade máxima (ex: 10 níveis)
3. ✨ Integrar Eventos ao ProjectHierarchy
4. ✨ Implementar subtarefas via `parentId` visual
5. ✨ Adicionar confirmação de movimento de cascata (mover com filhos)
6. ✨ Validar permissões antes de mover entre projetos compartilhados

---

## 8. REFERÊNCIAS DE CÓDIGO

| Item | Arquivo | Linhas | Função |
|------|---------|--------|---------|
| Componente Principal | [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx) | 1-417 | Renderizador da árvore |
| Controller de Projetos | [projectController.js](src/api/controllers/projectController.js) | 1-177 | CRUD de projetos |
| Rotas de Projetos | [entityRoutes.js](src/api/entityRoutes.js) | 44-47 | Endpoints |
| Entidades (Classes) | [entities.js](src/api/entities.js) | 88-166 | Interfaces de API |
| Schema de Projetos | [core.js](src/db/schema/core.js) | 156-193 | Definição de tabelas |
| Criação de Tarefas | [taskController.js](src/api/controllers/taskController.js) | 17-60 | POST /tasks |
| Menu Contextual | [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx) | 318-346 | Context menu |
| Drag & Drop | [ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx) | 196-216 | handleDrop |

---

## CONCLUSÃO

✅ **CONFIRMADO:** Project Hierarchy é funcional e suporta:
- Criação de subprojetos (com profundidade ilimitada)
- Criação de tarefas, documentos e mind maps
- Movimento via drag-and-drop
- Menu contextual com operações rápidas
- Renomeação e exclusão

⚠️ **LACUNAS:**
- Sem validação de ciclos
- Sem limite de profundidade
- Eventos e Sparks não integrados
- Sem cascata ao mover
- Sem validação de permissões

