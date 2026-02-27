# 🏗️ PROJECT HIERARCHY - GUIA COMPLETO

**Status:** ✅ Documentação Completa | **Data:** Dezembro 2025 | **Versão:** 1.0

---

## 📚 ÍNDICE

1. [Estrutura da Tabela](#1-estrutura-da-tabela-projects)
2. [Como o parentId Funciona](#2-como-o-parentid-funciona)
3. [Relacionamentos (Relations)](#3-relacionamentos-relations)
4. [Exemplos Práticos Reais](#4-exemplos-práticos-reais)
5. [Operações Comuns](#5-operações-comuns)
6. [Visualização na UI](#6-visualização-na-ui)
7. [Regras e Restrições](#7-regras-e-restrições)

---

## 1. ESTRUTURA DA TABELA `projects`

### Campos Completos

```javascript
// src/db/schema/core.js - Tabela projects
export const projects = pgTable('projects', {
  // --- IDENTIFICAÇÃO ---
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(), // Padronizado (era "name")
  description: text('description'),
  
  // --- HIERARQUIA (CORE) ---
  parentId: text('parent_id'), // 🔑 CHAVE DA RECURSÃO - Referencia outro projeto
  
  // --- OWNERSHIP ---
  ownerId: text('owner_id').references(() => users.id),
  teamId: text('team_id').references(() => teams.id),
  
  // --- TIPO E COMPARTILHAMENTO ---
  type: text('type', { enum: ['personal', 'professional'] })
    .default('personal')
    .notNull(),
  isShared: boolean('is_shared').default(false).notNull(),
  visibility: text('visibility', { enum: ['private', 'shared', 'public'] })
    .default('private')
    .notNull(),
  
  // --- STATUS E TIMELINE ---
  status: text('status').default('active').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  
  // --- VISUAL ---
  color: text('color').default('#3B82F6'),
  icon: text('icon'), // Ex: "🚀", "📚", "💼"
  
  // --- DADOS CUSTOMIZADOS ---
  settings: jsonb('settings').default({}),
  templateId: text('template_id').references(() => templates.id),
  customData: jsonb('custom_data'),
  plannerSlot: jsonb('planner_slot'),
  relatedFilesCount: integer('related_files_count').default(0),
  
  // --- TIMESTAMPS ---
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'), // Soft delete
});
```

### O que cada campo significa

| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| **id** | TEXT | Identificador único | "proj_1a2b3c" |
| **title** | TEXT | Nome do projeto | "UI Redesign" |
| **description** | TEXT | Descrição longa | "Modernize dashboard interface" |
| **parentId** | TEXT | 🔑 ID do projeto PAI | "proj_xyz" ou NULL (se for raiz) |
| **ownerId** | TEXT | Quem criou/owns | "user_123" |
| **teamId** | TEXT | Time (se compartilhado) | "team_456" |
| **type** | TEXT | Pessoal ou profissional | "personal" \| "professional" |
| **isShared** | BOOLEAN | Se está compartilhado | true \| false |
| **visibility** | TEXT | Nível de acesso | "private" \| "shared" \| "public" |
| **status** | TEXT | Estado do projeto | "active" \| "archived" \| "completed" |
| **startDate** | TIMESTAMP | Quando começou | 2025-01-15 |
| **endDate** | TIMESTAMP | Deadline/prazo | 2025-03-31 |
| **color** | TEXT | Cor visual | "#3B82F6" (azul) |
| **icon** | TEXT | Ícone rápido | "🎨", "🚀", "📚" |
| **settings** | JSONB | Configurações customizadas | { theme: "dark", ... } |
| **templateId** | TEXT | Template usado para criar | "tpl_789" |
| **customData** | JSONB | Dados adicionais | Qualquer JSON |
| **plannerSlot** | JSONB | Slot na agenda | { week: 1, position: 0 } |
| **createdAt** | TIMESTAMP | Data criação | 2025-01-10 14:30:00 |
| **updatedAt** | TIMESTAMP | Última atualização | 2025-01-15 09:15:00 |
| **deletedAt** | TIMESTAMP | Data soft-delete | NULL (ativo) ou timestamp |

---

## 2. COMO O `parentId` FUNCIONA

### Conceito Fundamental: Recursão

**`parentId` é uma REFERÊNCIA AUTOCOMPLEXA** - um campo que aponta para outro registro da MESMA TABELA.

```javascript
// Relação autocomplexa definida no Drizzle:
export const projectsRelations = relations(projects, ({ one, many }) => ({
  // Um projeto tem UM pai (ou nenhum)
  parent: one(projects, { 
    fields: [projects.parentId], 
    references: [projects.id], 
    relationName: 'subProjects' 
  }),
  
  // Um projeto tem MUITOS filhos
  subProjects: many(projects, { relationName: 'subProjects' }),
  
  // ... outros relacionamentos
  tasks: many(tasks),
}));
```

### Múltiplos Níveis de Profundidade

✅ **SIM, pode haver ilimitados níveis:**

```
Projeto Raiz (parentId = NULL)
│
├─ Subprojeto Nível 1 (parentId = Raiz)
│  │
│  └─ Subprojeto Nível 2 (parentId = Nível 1)
│     │
│     └─ Subprojeto Nível 3 (parentId = Nível 2)
│        │
│        └─ ... (infinito!)
│
└─ Outro Subprojeto Nível 1 (parentId = Raiz)
```

### Não há limite de profundidade programado

O banco de dados **não restringe** a profundidade. A UI pode não renderizar bem além de 5-7 níveis, mas o modelo teórico é ilimitado.

### Estrutura Típica em Prana

```
"UI Redesign" (parentId = NULL)          ← Projeto RAIZ
├─ "Phase 1: Planning" (parentId = UI)   ← Subprojeto/Fase
│  ├─ Task: Define requirements
│  ├─ Task: Competitive analysis
│  └─ Document: Planning doc
├─ "Phase 2: Design" (parentId = UI)
│  ├─ Task: Create wireframes
│  └─ Task: Design system
└─ "Phase 3: Dev" (parentId = UI)
   ├─ Task: Implement backend
   └─ Task: Implement frontend
```

**Nota importante:** Cada "Fase" é TAMBÉM um Projeto na tabela `projects`. A hierarquia vem do `parentId`.

---

## 3. RELACIONAMENTOS (RELATIONS)

### Arquitetura de Relações

```javascript
// src/db/schema/core.js

// ===== PROJECT RELATIONS =====
export const projectsRelations = relations(projects, ({ one, many }) => ({
  // Relacionamento com TEMPLATE (template que criou este projeto)
  template: one(templates, { 
    fields: [projects.templateId], 
    references: [templates.id] 
  }),
  
  // 🔑 RELACIONAMENTO HIERÁRQUICO (SELF-REFERENTIAL)
  parent: one(projects, { 
    fields: [projects.parentId], 
    references: [projects.id], 
    relationName: 'subProjects' // Nome da relação reversa
  }),
  subProjects: many(projects, { relationName: 'subProjects' }),
  
  // Ownership (User que criou)
  owner: one(users, { 
    fields: [projects.ownerId], 
    references: [users.id], 
    relationName: 'owner' 
  }),
  
  // Time (se compartilhado)
  team: one(teams, { 
    fields: [projects.teamId], 
    references: [teams.id] 
  }),
  
  // ✅ TASKS: Tarefas diretas do projeto
  tasks: many(tasks),
}));

// ===== TASK RELATIONS =====
export const tasksRelations = relations(tasks, ({ one, many }) => ({
  // Task pertence a um Projeto
  project: one(projects, { 
    fields: [tasks.projectId], 
    references: [projects.id] 
  }),
  
  // Task pode ter um PAI (subtask)
  parent: one(tasks, { 
    fields: [tasks.parentId], 
    references: [tasks.id], 
    relationName: 'childTasks' 
  }),
  childTasks: many(tasks, { relationName: 'childTasks' }),
  
  // Task tem TAGS
  tags: many(taskTags),
  
  // Task tem SUBTASKS (tabela separada)
  simpleSubtasks: many(subtasks),
  
  // Task pode BLOQUEAR outra task
  blocking: many(taskDependencies, { relationName: 'source' }),
  blockedBy: many(taskDependencies, { relationName: 'target' }),
}));
```

### Grafo de Relacionamentos

```
┌─────────────┐
│   USERS     │
└──────┬──────┘
       │
       │ ownerId
       ↓
┌──────────────────────┐
│    PROJECTS          │◄─────┐ parentId (self-ref)
│  (Hierarquia!)       │      │
└──────┬───────────────┘──────┘
       │
       │ projectId
       ↓
┌──────────────────┐
│     TASKS        │◄─────┐ parentId (subtasks)
│  (Também hierrq) │      │
└──────┬───────────┘──────┘
       │
       │ taskId
       ↓
┌──────────────────┐
│   TASK_TAGS      │◄────── tagId
└──────┬───────────┘
       │
       ↓
    TAGS

TASKS também vinculam a:
├─ taskDependencies (bloqueios)
├─ subtasks (simples, não-recursiva)
├─ templates
└─ documents (via fileId)
```

### Como Acessar via Drizzle ORM

```javascript
// Buscar um projeto COM suas relações
const projectWithChildren = await db.query.projects.findFirst({
  where: eq(projects.id, projectId),
  with: {
    parent: true,              // Projeto pai
    subProjects: true,         // Projetos filhos (1 nível)
    tasks: true,               // Tasks diretas
    owner: true,               // Usuário dono
    team: true,                // Time
  }
});

// Buscar todos os SUBPROJETOS de um projeto
const allPhases = await db.query.projects.findMany({
  where: eq(projects.parentId, projectId),
});

// Buscar todas as TASKS de um projeto (SEM subprojetos)
const directTasks = await db.query.tasks.findMany({
  where: eq(tasks.projectId, projectId),
});

// Buscar projeto pai (se houver)
const parent = await db.query.projects.findFirst({
  where: eq(projects.id, projectId),
});
// Depois buscar o pai:
if (parent?.parentId) {
  const grandparent = await db.query.projects.findFirst({
    where: eq(projects.id, parent.parentId)
  });
}
```

---

## 4. EXEMPLOS PRÁTICOS REAIS

### Exemplo 1: Projeto com Fases (Padrão Comum)

```
📦 PROJETO: "Lançar Novo Produto"
ID: proj_launch_2025
├─ parentId: NULL (é raiz)
├─ title: "Lançar Novo Produto"
├─ status: "In Progress"
├─ startDate: 2025-01-01
├─ endDate: 2025-03-31
├─ color: "#10B981" (verde)
├─ icon: "🚀"

  📁 FASE 1: "Discovery"
  ID: proj_discovery
  ├─ parentId: "proj_launch_2025" (referencia o projeto!)
  ├─ title: "Discovery"
  ├─ status: "In Progress"
  │
  ├─ ✅ Task: "Interview 10 customers"
  ├─ ✅ Task: "Competitor research"
  ├─ 📄 Document: "Market analysis"
  └─ 📅 Event: "Discovery review" (2025-01-20)

  📁 FASE 2: "Design"
  ID: proj_design
  ├─ parentId: "proj_launch_2025"
  ├─ title: "Design"
  ├─ status: "Not Started"
  │
  ├─ ✅ Task: "Create wireframes"
  ├─ ✅ Task: "Design system"
  └─ 📅 Event: "Design review" (2025-02-15)

  📁 FASE 3: "Development"
  ID: proj_dev
  ├─ parentId: "proj_launch_2025"
  ├─ title: "Development"
  ├─ status: "Not Started"
  │
  ├─ ✅ Task: "Setup backend"
  ├─ ✅ Task: "Implement API"
  ├─ ✅ Task: "Build frontend"
  └─ ✓ Checklist: "Code review checklist"

  📁 FASE 4: "Launch"
  ID: proj_launch
  ├─ parentId: "proj_launch_2025"
  ├─ title: "Launch"
  ├─ status: "Not Started"
  │
  ├─ ✅ Task: "Deploy to production"
  ├─ ✅ Task: "Monitor metrics"
  └─ 📅 Event: "Go live!" (2025-03-31 10:00)
```

### Exemplo 2: Hierarquia Profunda (3+ Níveis)

```
📦 PROJETO RAIZ: "Write a Book"
ID: proj_book
├─ parentId: NULL
├─ title: "Write a Book"
├─ type: "personal"

  📁 CAPÍTULO 1: "Introduction"
  ID: proj_ch1
  ├─ parentId: "proj_book"
  
    📁 SEÇÃO 1.1: "Background"
    ID: proj_ch1_s1
    ├─ parentId: "proj_ch1"
    
      📁 TÓPICO 1.1.1: "The Problem"
      ID: proj_ch1_s1_t1
      ├─ parentId: "proj_ch1_s1"
      ├─ ✅ Task: "Write intro paragraph"
      ├─ ✅ Task: "Add statistics"
      └─ ✅ Task: "Cite sources"
    
    📁 SEÇÃO 1.2: "Motivation"
    ID: proj_ch1_s2
    ├─ parentId: "proj_ch1"
    ├─ ✅ Task: "Write 500 words"
    └─ ✅ Task: "Add examples"

  📁 CAPÍTULO 2: "Methodology"
  ID: proj_ch2
  ├─ parentId: "proj_book"
  ├─ ✅ Task: "Outline approach"
  └─ ✅ Task: "Write chapter"
```

**Nota:** Não há limite teórico, mas UI pode renderizar melhor até 4-5 níveis.

### Exemplo 3: Projeto Compartilhado (Professional)

```
📦 PROJETO: "Redesign Admin Dashboard"
ID: proj_admin_redesign
├─ parentId: NULL
├─ type: "professional" ✨
├─ isShared: true
├─ visibility: "shared"
├─ teamId: "team_engineering"
├─ ownerId: "user_johndoe"

  📁 FASE: "Frontend"
  ID: proj_admin_fe
  ├─ parentId: "proj_admin_redesign"
  ├─ ✅ Task: "React component setup" (ownerId: user_alice)
  ├─ ✅ Task: "Implement forms" (ownerId: user_bob)
  └─ 📅 Event: "Code review" (2025-02-01)

  📁 FASE: "Backend"
  ID: proj_admin_be
  ├─ parentId: "proj_admin_redesign"
  ├─ ✅ Task: "New API endpoints" (ownerId: user_charlie)
  ├─ ✅ Task: "Database migration" (ownerId: user_david)
  └─ ✓ Checklist: "Testing checklist"
```

### Exemplo 4: Tasks com Subtasks (Hierarquia DENTRO de Task)

```
✅ TASK: "Design dashboard layout"
├─ projectId: "proj_design"
├─ parentId: NULL (é task raiz)

  ✅ SUBTASK 1: "Define grid system"
  ├─ parentId: (task_design_layout) -- SELF-REF
  
  ✅ SUBTASK 2: "Create color palette"
  ├─ parentId: (task_design_layout)
  
  ✅ SUBTASK 3: "Define typography"
  ├─ parentId: (task_design_layout)
```

---

## 5. OPERAÇÕES COMUNS

### 5.1 Criar um Subprojeto/Fase

```javascript
// src/api/controllers/projectController.js
// POST /projects
const createSubproject = async (req, res) => {
  const { title, parentId, ownerId } = req.body;

  // Validação: parentId deve referenciar um projeto existente
  if (parentId) {
    const parent = await db.query.projects.findFirst({
      where: eq(projects.id, parentId)
    });
    if (!parent) {
      return res.status(404).json({ error: "Projeto pai não encontrado" });
    }
  }

  // Criar novo projeto (será uma "fase")
  const newPhase = {
    id: createId('proj'),
    title,
    parentId: parentId || null, // Se null, é projeto raiz
    ownerId,
    status: 'active',
    createdAt: new Date()
  };

  await db.insert(projects).values(newPhase);
  res.status(201).json(newPhase);
};
```

### 5.2 Buscar Toda a Árvore de um Projeto

```javascript
// Função recursiva para buscar todos os nós (projetos + tasks + docs)
const getAllHierarchy = async (projectId) => {
  const result = {
    project: null,
    subProjects: [],
    tasks: [],
    documents: [],
    documents: []
  };

  // 1. Buscar o projeto
  result.project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });

  // 2. Buscar TODOS os subprojetos recursivamente
  const getAllSubprojects = async (parentId) => {
    const subs = await db.query.projects.findMany({
      where: eq(projects.parentId, parentId)
    });
    
    for (const sub of subs) {
      result.subProjects.push(sub);
      await getAllSubprojects(sub.id); // Recursão
    }
  };
  await getAllSubprojects(projectId);

  // 3. Buscar tarefas diretas
  result.tasks = await db.query.tasks.findMany({
    where: eq(tasks.projectId, projectId)
  });

  // 4. Buscar documentos
  result.documents = await db.query.papyrusDocuments.findMany({
    where: eq(papyrusDocuments.projectId, projectId)
  });

  return result;
};

// Uso:
const fullHierarchy = await getAllHierarchy('proj_xyz');
console.log(fullHierarchy);
// {
//   project: { id: 'proj_xyz', ... },
//   subProjects: [
//     { id: 'phase1', parentId: 'proj_xyz', ... },
//     { id: 'phase2', parentId: 'proj_xyz', ... }
//   ],
//   tasks: [...],
//   documents: [...]
// }
```

### 5.3 Mover uma Task Entre Projetos/Subprojetos

```javascript
// src/components/dashboard/ProjectHierarchy.jsx
const handleDrop = async (e, targetItem) => {
  e.preventDefault(); 
  e.stopPropagation();
  
  if (!dragNode || !targetItem) return;

  // Calcular novo parent ID (inbox = null)
  const newParentId = targetItem.type === 'inbox' ? null : targetItem.id;

  try {
    // Atualizar a task com novo projeto
    const payload = dragNode.type === 'project' 
      ? { parentId: newParentId }           // Mover projeto
      : { project_id: newParentId };         // Mover task/doc

    await (dragNode.type === 'project' 
      ? Project.update(dragNode.id, payload)
      : Task.update(dragNode.id, payload));

    toast.success("Movido com sucesso!");
    onRefresh?.();
  } catch (e) {
    console.error(e);
    toast.error("Erro ao mover.");
  }
};
```

### 5.4 Deletar um Projeto (com Cascata?)

```javascript
// src/api/controllers/projectController.js
const deleteProject = async (req, res) => {
  const { id } = req.params;

  // OPÇÃO 1: Soft Delete (marcar como deletado, sem perder dados)
  await db.update(projects)
    .set({ deletedAt: new Date() })
    .where(eq(projects.id, id));
  
  res.json({ success: true, message: "Projeto marcado como deletado" });

  // OPÇÃO 2: Hard Delete com cascata (raro em Prana)
  // await db.delete(projects).where(eq(projects.id, id));
  // Isso DELETARIA também:
  // - Todos os subprojetos (onDelete: 'cascade' no FK)
  // - Todas as tasks (onDelete: 'cascade')
  // - Todos os documents
};
```

### 5.5 Buscar Todas as Tasks de um Projeto (Incluindo Subprojetos)

```javascript
const getAllProjectTasks = async (projectId) => {
  // 1. Buscar o projeto
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });
  
  if (!project) return [];

  // 2. Buscar todos os IDs de projetos (ele + subprojetos recursivamente)
  const allProjectIds = [projectId];
  
  const collectSubprojectIds = async (parentId) => {
    const subs = await db.query.projects.findMany({
      where: eq(projects.parentId, parentId)
    });
    
    for (const sub of subs) {
      allProjectIds.push(sub.id);
      await collectSubprojectIds(sub.id); // Recursão
    }
  };
  
  await collectSubprojectIds(projectId);

  // 3. Buscar todas as tasks em qualquer um desses projetos
  const allTasks = await db.query.tasks.findMany({
    where: inArray(tasks.projectId, allProjectIds),
    orderBy: (tasks, { asc }) => [asc(tasks.createdAt)]
  });

  return allTasks;
};

// Uso:
const tasks = await getAllProjectTasks('proj_xyz');
console.log(`Total de tasks: ${tasks.length}`);
```

### 5.6 Mover um Projeto (Mudar de Pai)

```javascript
// Mover "Phase 2" para ser filho de "Phase 1" (em vez de "Project Root")
const moveProject = async (projectId, newParentId) => {
  // Validações
  if (projectId === newParentId) {
    throw new Error("Projeto não pode ser pai de si mesmo");
  }

  // Verificar se novo pai não é filho dele mesmo (evitar ciclos)
  const isDescendant = async (ancestor, potentialChild) => {
    const child = await db.query.projects.findFirst({
      where: eq(projects.id, potentialChild)
    });
    
    if (!child?.parentId) return false;
    if (child.parentId === ancestor) return true;
    return isDescendant(ancestor, child.parentId);
  };

  const isCyclic = newParentId 
    ? await isDescendant(projectId, newParentId)
    : false;

  if (isCyclic) {
    throw new Error("Movimento criaria ciclo na hierarquia");
  }

  // Atualizar parentId
  await db.update(projects)
    .set({ parentId: newParentId || null })
    .where(eq(projects.id, projectId));

  return { success: true };
};

// Uso:
await moveProject('proj_phase2', 'proj_phase1');
// Resultado: Phase 2 agora é filho de Phase 1
```

---

## 6. VISUALIZAÇÃO NA UI

### 6.1 Componente ProjectHierarchy (vs Code style)

**Arquivo:** [src/components/dashboard/ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx)

```jsx
// Renderiza uma ÁRVORE expansível (como VS Code)
export default function ProjectHierarchy({ 
  projects = [], 
  tasks = [], 
  documents = [], 
  maps = [] 
}) {
  const [expanded, setExpanded] = useState({});
  const [selectedId, setSelectedId] = useState(null);

  // Construir árvore recursiva
  const { rootNodes, nodeLookup } = useMemo(() => {
    const nodeMap = {};
    const rootNodes = [];

    // 1. Adicionar projetos ao mapa
    projects.forEach(p => {
      nodeMap[p.id] = { 
        ...p, 
        type: 'project', 
        isFolder: true, 
        children: [] 
      };
    });

    // 2. Aninhamento (construir árvore via parentId)
    projects.forEach(p => {
      const parentId = p.parentId || p.parent_id;
      if (parentId && nodeMap[parentId]) {
        // Este projeto é filho de outro
        nodeMap[parentId].children.push(nodeMap[p.id]);
      } else {
        // Este projeto é raiz
        rootNodes.push(nodeMap[p.id]);
      }
    });

    // 3. Distribuir tasks, docs, maps
    const distribute = (item, type) => {
      const pid = item.project_id || item.projectId;
      const node = { ...item, type, isFolder: false };
      nodeMap[item.id] = node;
      
      if (pid && nodeMap[pid]) {
        // Adicionar como filho do projeto
        nodeMap[pid].children.push(node);
        return true;
      }
      return false;
    };

    tasks.forEach(t => distribute(t, 'task'));
    documents.forEach(d => distribute(d, 'document'));
    maps.forEach(m => distribute(m, 'mindmap'));

    // 4. Inbox para órfãos
    const orphans = [];
    [...tasks, ...documents, ...maps].forEach(item => {
      if (!nodeMap[item.id]) orphans.push(item);
    });
    
    if (orphans.length > 0) {
      rootNodes.push({ 
        id: 'inbox', 
        title: 'Inbox', 
        type: 'inbox', 
        isFolder: true, 
        children: orphans 
      });
    }

    return { rootNodes, nodeLookup: nodeMap };
  }, [projects, tasks, documents, maps]);

  // Expansão/Collapse
  const handleToggle = (nodeId) => {
    setExpanded(p => ({ ...p, [nodeId]: !p[nodeId] }));
  };

  return (
    <div className="project-hierarchy">
      {rootNodes.map(node => (
        <ProjectNodeRenderer
          key={node.id}
          node={node}
          expanded={expanded}
          selected={selectedId}
          onToggle={handleToggle}
          onSelect={setSelectedId}
        />
      ))}
    </div>
  );
}
```

### 6.2 Renderização Recursiva (ProjectNode)

**Arquivo:** [src/components/dashboard/ProjectNode.jsx](src/components/dashboard/ProjectNode.jsx)

```jsx
// Componente recursivo que renderiza um projeto e seus filhos
export default function ProjectNode({
  project,
  allProjects,
  tasks,
  index,
  onSelectTask,
  onDeleteProject,
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrar subprojetos diretos
  const projectSubprojects = allProjects.filter(
    p => p.parent_project_id === project.id
  );

  // Filtrar tasks diretas
  const projectTasks = tasks.filter(
    t => t.project_id === project.id
  );

  return (
    <Draggable draggableId={`project-${project.id}`} index={index}>
      {(provided, snapshot) => (
        <motion.div ref={provided.innerRef} {...provided.draggableProps}>
          {/* Header do Projeto */}
          <div className="flex items-center justify-between">
            <button onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? '▼' : '▶'} {project.name}
            </button>
          </div>

          {/* Subprojetos (Recursão!) */}
          {isExpanded && projectSubprojects.length > 0 && (
            <div className="ml-4 space-y-2">
              <div className="text-xs opacity-60">Subprojetos</div>
              {projectSubprojects.map((sub, idx) => (
                <ProjectNode
                  key={sub.id}
                  project={sub}
                  allProjects={allProjects}
                  tasks={tasks}
                  index={idx}
                  onSelectTask={onSelectTask}
                  onDeleteProject={onDeleteProject}
                />
              ))}
            </div>
          )}

          {/* Tasks diretas */}
          {isExpanded && projectTasks.length > 0 && (
            <div className="ml-4 space-y-2">
              <div className="text-xs opacity-60">Tasks</div>
              {projectTasks.map(task => (
                <TaskNode
                  key={task.id}
                  task={task}
                  onClick={() => onSelectTask(task.id)}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </Draggable>
  );
}
```

### 6.3 Breadcrumb (Navegação de Hierarquia)

**Arquivo:** [src/components/dashboard/BreadcrumbDropper.jsx](src/components/dashboard/BreadcrumbDropper.jsx)

```jsx
// Mostra o caminho completo de um projeto
// Ex: "Projects > UI Redesign > Design Phase > "

export function BreadcrumbDropper({ currentProject, hierarchy }) {
  return (
    <div className="flex items-center gap-2">
      {hierarchy.map((item, idx) => (
        <React.Fragment key={item.id}>
          <button 
            onClick={() => navigate(`/project/${item.id}`)}
            className="hover:underline"
          >
            {item.name}
          </button>
          {idx < hierarchy.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}
```

### 6.4 Seletor Hierárquico (Para Criar/Mover)

**Arquivo:** [src/components/forms/HierarchicalProjectSelector.jsx](src/components/forms/HierarchicalProjectSelector.jsx)

```jsx
// Renderiza dropdown com INDENTAÇÃO para mostrar profundidade
export function HierarchicalProjectSelector({ 
  value, 
  onChange, 
  projects 
}) {
  const options = useMemo(() => {
    const result = [];

    const buildOptions = (parentId = null, depth = 0) => {
      const children = projects.filter(p => 
        parentId ? p.parentId === parentId : !p.parentId
      );

      children.forEach(proj => {
        // Indentação: "   " * depth
        const indent = '  '.repeat(depth);
        result.push({
          label: `${indent}${proj.title}`,
          value: proj.id,
          depth
        });

        // Recursão para filhos
        buildOptions(proj.id, depth + 1);
      });
    };

    buildOptions();
    return result;
  }, [projects]);

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(opt => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

---

## 7. REGRAS E RESTRIÇÕES

### 7.1 Validações de Negócio

```javascript
// Regra 1: Projetos pessoais NÃO podem ser compartilhados
if (type === 'personal' && isShared) {
  throw new Error("Projetos pessoais não podem ser compartilhados");
}

// Regra 2: Não há limite de profundidade, mas recomenda-se até 5 níveis
if (depth > 7) {
  console.warn("⚠️ Hierarquia muito profunda. UI pode não renderizar bem.");
}

// Regra 3: Um projeto não pode ser pai de si mesmo
if (projectId === newParentId) {
  throw new Error("Ciclo na hierarquia");
}

// Regra 4: Não criar ciclos (A → B → C → A)
const isAncestor = async (potentialAncestor, potentialChild) => {
  let current = potentialChild;
  while (current?.parentId) {
    if (current.parentId === potentialAncestor) return true;
    current = await findProject(current.parentId);
  }
  return false;
};

if (await isAncestor(newParentId, projectId)) {
  throw new Error("Movimento criaria ciclo");
}

// Regra 5: SOFT DELETE (nada é realmente deletado)
// Em vez de:
//   await db.delete(projects).where(eq(projects.id, id));
// Usar:
//   await db.update(projects).set({ deletedAt: now }).where(...);
```

### 7.2 Filtragem de Soft Deletes

```javascript
// Quando buscar projetos, EXCLUIR deletados
const activeProjects = await db.query.projects.findMany({
  where: and(
    eq(projects.ownerId, userId),
    isNull(projects.deletedAt)  // ← Chave!
  )
});
```

### 7.3 Permissões

- **Owner**: Pode TUDO (edit, delete, share)
- **Team Member (editor)**: Pode criar items dentro, mover
- **Team Member (viewer)**: Só lê (read-only)
- **Pessoal private**: Só owner vê
- **Profissional shared**: Team vê conforme role
- **Profissional public**: Qualquer um vê (read-only)

---

## 📊 RESUMO RÁPIDO

| Aspecto | Detalhe |
|---------|---------|
| **Tabela** | `projects` (auto-referencial via `parentId`) |
| **Chave de Hierarquia** | `parentId` (NULL = raiz, texto = ID do pai) |
| **Profundidade** | Ilimitada (mas UI ~5-7 níveis) |
| **Tasks em projetos** | `tasks.projectId` → referencia `projects.id` |
| **Subtasks em tasks** | `tasks.parentId` → referencia `tasks.id` (self-ref) |
| **Exclusão** | Soft delete via `deletedAt` (não hard delete) |
| **UI Principal** | `ProjectHierarchy.jsx` (tree expansível) |
| **Movimentação** | Drag & drop (atualiza `parentId` ou `project_id`) |
| **Ícones** | `🏢` Projeto, `📁` Fase, `✅` Task, `📄` Doc, `🎪` Spark |

---

## 🔗 REFERÊNCIAS

- Schema: [src/db/schema/core.js](src/db/schema/core.js) (linhas ~100-200)
- Relations: [src/db/schema/core.js](src/db/schema/core.js) (linhas ~300+)
- Controller: [src/api/controllers/projectController.js](src/api/controllers/projectController.js)
- UI Tree: [src/components/dashboard/ProjectHierarchy.jsx](src/components/dashboard/ProjectHierarchy.jsx)
- UI Node: [src/components/dashboard/ProjectNode.jsx](src/components/dashboard/ProjectNode.jsx)
- Docs: [MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md](MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md)

---

**✅ Guia Completo - Agora você entende COMPLETAMENTE Project Hierarchy em Prana!**
