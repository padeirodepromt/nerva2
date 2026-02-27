# 🛠️ PROJECT HIERARCHY - CONSULTAS & OPERAÇÕES ÚTEIS

**Guia de Código** | **Drizzle ORM + SQL** | **Pronto para usar**

---

## 📋 ÍNDICE

1. [Consultas Básicas](#1-consultas-básicas)
2. [Operações Recursivas](#2-operações-recursivas)
3. [Filtros e Buscas](#3-filtros-e-buscas)
4. [Movimentação e Reorganização](#4-movimentação-e-reorganização)
5. [Deleção e Limpeza](#5-deleção-e-limpeza)
6. [Análise e Métricas](#6-análise-e-métricas)
7. [Validações](#7-validações)

---

## 1. CONSULTAS BÁSICAS

### 1.1 Buscar um Projeto com todas as Relações

```javascript
const getProjectFull = async (projectId) => {
  return await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      parent: true,
      subProjects: true,
      tasks: {
        with: {
          tags: true,
          childTasks: true,
          simpleSubtasks: true
        }
      },
      owner: true,
      team: {
        with: {
          members: true
        }
      },
      template: true
    }
  });
};

// Uso:
const project = await getProjectFull('proj_123');
console.log(project);
// {
//   id: 'proj_123',
//   title: 'UI Redesign',
//   parentId: null,
//   subProjects: [
//     { id: 'phase1', title: 'Planning', parentId: 'proj_123', ... },
//     { id: 'phase2', title: 'Design', parentId: 'proj_123', ... }
//   ],
//   tasks: [
//     { id: 'task1', title: 'Setup', projectId: 'proj_123', ... },
//     { id: 'task2', title: 'Review', projectId: 'proj_123', ... }
//   ],
//   owner: { id: 'user_123', name: 'John', ... },
//   ...
// }
```

### 1.2 Buscar Todos os Projetos Raiz (sem Pai)

```javascript
const getRootProjects = async (userId) => {
  return await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      isNull(projects.parentId),  // ← Chave!
      isNull(projects.deletedAt)  // Apenas ativos
    ),
    orderBy: (projects, { desc }) => [desc(projects.createdAt)]
  });
};

// Uso:
const roots = await getRootProjects('user_123');
// Retorna apenas projetos raiz (sem pai)
```

### 1.3 Buscar Todos os Subprojetos de um Projeto (1 nível)

```javascript
const getDirectSubprojects = async (parentProjectId) => {
  return await db.query.projects.findMany({
    where: and(
      eq(projects.parentId, parentProjectId),
      isNull(projects.deletedAt)
    ),
    orderBy: (projects, { asc }) => [asc(projects.createdAt)]
  });
};

// Uso:
const phases = await getDirectSubprojects('proj_123');
// Retorna só os filhos diretos (1 nível)
```

### 1.4 Buscar Projeto + Saber o Caminho Completo

```javascript
const getProjectBreadcrumb = async (projectId) => {
  const breadcrumb = [];
  let current = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });

  while (current) {
    breadcrumb.unshift({
      id: current.id,
      title: current.title
    });

    if (current.parentId) {
      current = await db.query.projects.findFirst({
        where: eq(projects.id, current.parentId)
      });
    } else {
      break;
    }
  }

  return breadcrumb;
};

// Uso:
const breadcrumb = await getProjectBreadcrumb('task_deep');
// Retorna: [
//   { id: 'proj_root', title: 'SaaS MVP' },
//   { id: 'phase1', title: 'Design' },
//   { id: 'topic1', title: 'UI Components' }
// ]
```

---

## 2. OPERAÇÕES RECURSIVAS

### 2.1 Buscar TODOS os Subprojetos (Profundo/Recursivo)

```javascript
const getAllSubprojects = async (parentProjectId, depth = 0) => {
  const result = [];

  const children = await db.query.projects.findMany({
    where: and(
      eq(projects.parentId, parentProjectId),
      isNull(projects.deletedAt)
    )
  });

  for (const child of children) {
    result.push({
      ...child,
      depth,
      children: await getAllSubprojects(child.id, depth + 1)
    });
  }

  return result;
};

// Uso:
const tree = await getAllSubprojects('proj_123');
// Retorna árvore COMPLETA com todas as profundidades
// {
//   id: 'phase1',
//   depth: 0,
//   children: [
//     { id: 'topic1', depth: 1, children: [...] },
//     { id: 'topic2', depth: 1, children: [...] }
//   ]
// }
```

### 2.2 Coletar TODOS os IDs (para bulk operations)

```javascript
const getAllProjectIds = async (rootProjectId) => {
  const ids = [rootProjectId];

  const collectRecursive = async (parentId) => {
    const children = await db.query.projects.findMany({
      where: eq(projects.parentId, parentId)
    });

    for (const child of children) {
      ids.push(child.id);
      await collectRecursive(child.id);
    }
  };

  await collectRecursive(rootProjectId);
  return ids;
};

// Uso:
const allIds = await getAllProjectIds('proj_123');
// Retorna: ['proj_123', 'phase1', 'phase2', 'topic1', 'topic2', ...]
```

### 2.3 Buscar Todas as Tasks (incluindo Subprojetos)

```javascript
const getAllProjectTasks = async (rootProjectId) => {
  // 1. Coletar todos os IDs de projetos
  const projectIds = await getAllProjectIds(rootProjectId);

  // 2. Buscar todas as tasks em qualquer um desses projetos
  const allTasks = await db.query.tasks.findMany({
    where: and(
      inArray(tasks.projectId, projectIds),
      isNull(tasks.deletedAt)
    ),
    orderBy: (tasks, { asc }) => [asc(tasks.createdAt)],
    with: {
      tags: true,
      childTasks: true
    }
  });

  return allTasks;
};

// Uso:
const allTasks = await getAllProjectTasks('proj_123');
// Retorna todas as tasks, mesmo em subprojetos profundos
console.log(`Total: ${allTasks.length} tasks`);
```

### 2.4 Buscar Profundidade de um Projeto

```javascript
const getProjectDepth = async (projectId) => {
  let depth = 0;
  let current = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });

  while (current?.parentId) {
    depth++;
    current = await db.query.projects.findFirst({
      where: eq(projects.id, current.parentId)
    });
  }

  return depth;
};

// Uso:
const depth = await getProjectDepth('topic1');
// Se: SaaS MVP → Design → UI → topic1
// Retorna: 3
```

### 2.5 Buscar Projeto Raiz (Ancestral Mais Antigo)

```javascript
const getRootProject = async (projectId) => {
  let current = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });

  while (current?.parentId) {
    current = await db.query.projects.findFirst({
      where: eq(projects.id, current.parentId)
    });
  }

  return current;
};

// Uso:
const root = await getRootProject('topic1');
// Retorna o projeto raiz mesmo que esteja 10 níveis fundo
```

---

## 3. FILTROS E BUSCAS

### 3.1 Buscar Projetos por Tipo e Compartilhamento

```javascript
const filterProjects = async (userId, options = {}) => {
  const filters = [
    eq(projects.ownerId, userId),
    isNull(projects.deletedAt)
  ];

  // Filtro de tipo
  if (options.type) {
    filters.push(eq(projects.type, options.type));
  }

  // Filtro de compartilhamento
  if (options.shared !== undefined) {
    filters.push(eq(projects.isShared, options.shared));
  }

  // Filtro de status
  if (options.status) {
    filters.push(eq(projects.status, options.status));
  }

  // Filtro de hierarquia
  if (options.parentId !== undefined) {
    if (options.parentId === 'root') {
      filters.push(isNull(projects.parentId));
    } else {
      filters.push(eq(projects.parentId, options.parentId));
    }
  }

  return await db.query.projects.findMany({
    where: and(...filters),
    orderBy: (projects, { desc }) => [desc(projects.createdAt)]
  });
};

// Uso:
const myPersonalRoots = await filterProjects('user_123', {
  type: 'personal',
  shared: false,
  parentId: 'root'
});

const professionalShared = await filterProjects('user_123', {
  type: 'professional',
  shared: true
});
```

### 3.2 Buscar Projetos por Nome (Search)

```javascript
const searchProjects = async (userId, query) => {
  return await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      isNull(projects.deletedAt),
      like(projects.title, `%${query}%`)  // Case-insensitive search
    ),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)]
  });
};

// Uso:
const results = await searchProjects('user_123', 'design');
// Retorna todos os projetos com "design" no nome
```

### 3.3 Buscar Projetos Recentes (por modificação)

```javascript
const getRecentProjects = async (userId, limit = 10) => {
  return await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      isNull(projects.deletedAt)
    ),
    orderBy: (projects, { desc }) => [desc(projects.updatedAt)],
    limit
  });
};

// Uso:
const recent = await getRecentProjects('user_123', 5);
// Retorna os 5 projetos modificados mais recentemente
```

### 3.4 Buscar Projetos Ados (próximas deadlines)

```javascript
const getUpcomingProjects = async (userId, daysAhead = 7) => {
  const now = new Date();
  const future = new Date(now.getTime() + daysAhead * 24 * 60 * 60 * 1000);

  return await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      isNull(projects.deletedAt),
      gte(projects.endDate, now),
      lte(projects.endDate, future)
    ),
    orderBy: (projects, { asc }) => [asc(projects.endDate)]
  });
};

// Uso:
const upcoming = await getUpcomingProjects('user_123', 14);
// Retorna projetos com deadline nos próximos 14 dias
```

---

## 4. MOVIMENTAÇÃO E REORGANIZAÇÃO

### 4.1 Mover Projeto (Mudar de Pai)

```javascript
const moveProject = async (projectId, newParentId) => {
  // Validação 1: Projeto não pode ser pai de si mesmo
  if (projectId === newParentId) {
    throw new Error("Projeto não pode ser pai de si mesmo");
  }

  // Validação 2: Não criar ciclos (A → B → C → A)
  const isAncestor = async (potentialAncestor, potentialChild) => {
    let current = await db.query.projects.findFirst({
      where: eq(projects.id, potentialChild)
    });

    while (current?.parentId) {
      if (current.parentId === potentialAncestor) return true;
      current = await db.query.projects.findFirst({
        where: eq(projects.id, current.parentId)
      });
    }
    return false;
  };

  if (newParentId && await isAncestor(projectId, newParentId)) {
    throw new Error("Movimento criaria ciclo na hierarquia");
  }

  // Atualizar parentId
  await db.update(projects)
    .set({
      parentId: newParentId || null,
      updatedAt: new Date()
    })
    .where(eq(projects.id, projectId));

  return { success: true, projectId, newParentId };
};

// Uso:
await moveProject('proj_phase2', 'proj_phase1');
// Phase 2 agora é filho de Phase 1

await moveProject('proj_phase2', null);
// Phase 2 volta a ser raiz
```

### 4.2 Reordenar Subprojetos (Order Field)

```javascript
// NOTA: Para manter ordem, você pode adicionar um campo "order" na tabela

const reorderSubprojects = async (parentProjectId, projectIds) => {
  // projectIds = ['phase1', 'phase3', 'phase2'] = nova ordem

  for (let i = 0; i < projectIds.length; i++) {
    await db.update(projects)
      .set({ order: i })  // Novo campo order
      .where(eq(projects.id, projectIds[i]));
  }

  return { success: true };
};

// Uso:
await reorderSubprojects('proj_123', ['phase3', 'phase1', 'phase2']);
// Reordena as fases
```

### 4.3 Mover Tasks Entre Projetos

```javascript
const moveTask = async (taskId, newProjectId) => {
  // Validação: novo projeto deve existir
  const newProject = await db.query.projects.findFirst({
    where: eq(projects.id, newProjectId)
  });

  if (!newProject) {
    throw new Error("Projeto destino não existe");
  }

  // Atualizar project_id da task
  await db.update(tasks)
    .set({
      projectId: newProjectId,
      updatedAt: new Date()
    })
    .where(eq(tasks.id, taskId));

  return { success: true, taskId, newProjectId };
};

// Uso:
await moveTask('task_123', 'proj_design');
// Task 123 agora pertence ao projeto Design
```

---

## 5. DELEÇÃO E LIMPEZA

### 5.1 Soft Delete um Projeto (Marca como deletado)

```javascript
const softDeleteProject = async (projectId) => {
  await db.update(projects)
    .set({ deletedAt: new Date() })
    .where(eq(projects.id, projectId));

  return { success: true, deleted: projectId };
};

// Uso:
await softDeleteProject('proj_123');
// Marca projeto como deletado, mas NÃO remove do banco
// (Pode ser restaurado)
```

### 5.2 Hard Delete um Projeto (Remover completamente) ⚠️

```javascript
const hardDeleteProject = async (projectId) => {
  // ⚠️ IRREVERSÍVEL!
  // Isso TAMBÉM deleta:
  // - Todos os subprojetos (cascata)
  // - Todas as tasks (cascata)
  // - Todos os documents

  await db.delete(projects).where(eq(projects.id, projectId));

  return { success: true, hardDeleted: projectId };
};

// NÃO RECOMENDADO EM PRODUÇÃO
// Use soft delete na maioria dos casos
```

### 5.3 Restaurar Projeto (Desfazer Soft Delete)

```javascript
const restoreProject = async (projectId) => {
  await db.update(projects)
    .set({ deletedAt: null })
    .where(eq(projects.id, projectId));

  return { success: true, restored: projectId };
};

// Uso:
await restoreProject('proj_123');
// Remove a marcação de deletado
```

### 5.4 Limpar Deletes Antigos (Arquivamento)

```javascript
const cleanupOldDeletes = async (daysAgo = 90) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

  const oldDeleted = await db.query.projects.findMany({
    where: and(
      not(isNull(projects.deletedAt)),
      lt(projects.deletedAt, cutoffDate)
    )
  });

  for (const project of oldDeleted) {
    await db.delete(projects).where(eq(projects.id, project.id));
  }

  return {
    success: true,
    deletedCount: oldDeleted.length,
    beforeDate: cutoffDate
  };
};

// Usa:
const result = await cleanupOldDeletes(180);
// Hard deleta projetos soft-deletados há mais de 180 dias
```

---

## 6. ANÁLISE E MÉTRICAS

### 6.1 Contar Projetos por Tipo

```javascript
const countProjectsByType = async (userId) => {
  const personal = await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      eq(projects.type, 'personal'),
      isNull(projects.deletedAt)
    )
  });

  const professional = await db.query.projects.findMany({
    where: and(
      eq(projects.ownerId, userId),
      eq(projects.type, 'professional'),
      isNull(projects.deletedAt)
    )
  });

  return {
    personal: personal.length,
    professional: professional.length,
    total: personal.length + professional.length
  };
};

// Uso:
const counts = await countProjectsByType('user_123');
// { personal: 5, professional: 3, total: 8 }
```

### 6.2 Calcular Proporção de Tasks Completas

```javascript
const getProjectCompletion = async (projectId) => {
  const allTasks = await getAllProjectTasks(projectId);

  const completed = allTasks.filter(t => t.isDone).length;
  const total = allTasks.length;
  const percentage = total > 0 ? (completed / total * 100).toFixed(1) : 0;

  return {
    projectId,
    completed,
    total,
    percentage: `${percentage}%`
  };
};

// Uso:
const progress = await getProjectCompletion('proj_123');
// { projectId: 'proj_123', completed: 15, total: 30, percentage: '50.0%' }
```

### 6.3 Listar Projetos por Profundidade

```javascript
const analyzeHierarchy = async (userId) => {
  const roots = await filterProjects(userId, { parentId: 'root' });

  const analysis = [];
  for (const root of roots) {
    const depth = await getMaxDepth(root.id);
    const taskCount = (await getAllProjectTasks(root.id)).length;
    const subprojectCount = (await getAllSubprojects(root.id)).length;

    analysis.push({
      id: root.id,
      title: root.title,
      maxDepth: depth,
      subprojects: subprojectCount,
      tasks: taskCount,
      complexity: depth > 5 ? '⚠️ HIGH' : 'OK'
    });
  }

  return analysis;
};

// Uso:
const analysis = await analyzeHierarchy('user_123');
// [
//   { id: 'proj1', title: 'SaaS MVP', maxDepth: 2, subprojects: 5, tasks: 30, complexity: 'OK' },
//   { id: 'proj2', title: 'Book', maxDepth: 4, subprojects: 12, tasks: 150, complexity: '⚠️ HIGH' }
// ]
```

---

## 7. VALIDAÇÕES

### 7.1 Validar Ciclo na Hierarquia

```javascript
const hasCycle = async (projectId, newParentId) => {
  if (projectId === newParentId) return true;

  let current = await db.query.projects.findFirst({
    where: eq(projects.id, newParentId)
  });

  while (current?.parentId) {
    if (current.parentId === projectId) return true;
    current = await db.query.projects.findFirst({
      where: eq(projects.id, current.parentId)
    });
  }

  return false;
};

// Uso:
if (await hasCycle('proj_a', 'proj_b')) {
  throw new Error("Movimento criaria ciclo!");
}
```

### 7.2 Validar Profundidade Máxima

```javascript
const isWithinMaxDepth = async (projectId, maxDepth = 7) => {
  const depth = await getProjectDepth(projectId);
  return depth < maxDepth;
};

// Uso:
if (!await isWithinMaxDepth('proj_deep')) {
  console.warn("⚠️ Hierarquia muito profunda para boa UX");
}
```

### 7.3 Validar Permissões

```javascript
const canEditProject = async (userId, projectId) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId)
  });

  if (!project) return false;

  // Owner sempre pode editar
  if (project.ownerId === userId) return true;

  // Se compartilhado, verificar se é editor ou admin
  if (project.teamId) {
    const member = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.teamId, project.teamId),
        eq(teamMembers.userId, userId)
      )
    });

    return member?.role === 'editor' || member?.role === 'admin';
  }

  return false;
};

// Uso:
if (await canEditProject('user_123', 'proj_xyz')) {
  // Permitir edição
}
```

---

## 🔧 HELPER FUNCTIONS

```javascript
// Usar em qualquer lugar do código:
export const projectHierarchy = {
  // Leitura
  getRootProjects: async (userId) => { /* ... */ },
  getDirectSubprojects: async (parentId) => { /* ... */ },
  getAllSubprojects: async (rootId) => { /* ... */ },
  getAllProjectTasks: async (rootId) => { /* ... */ },
  getProjectBreadcrumb: async (projectId) => { /* ... */ },
  getProjectDepth: async (projectId) => { /* ... */ },
  getRootProject: async (projectId) => { /* ... */ },

  // Escrita
  moveProject: async (projectId, newParentId) => { /* ... */ },
  moveTask: async (taskId, newProjectId) => { /* ... */ },

  // Deleção
  softDelete: async (projectId) => { /* ... */ },
  restore: async (projectId) => { /* ... */ },

  // Análise
  getCompletion: async (projectId) => { /* ... */ },
  analyzeHierarchy: async (userId) => { /* ... */ },

  // Validação
  hasCycle: async (projectId, newParentId) => { /* ... */ },
  isWithinMaxDepth: async (projectId, max) => { /* ... */ },
  canEdit: async (userId, projectId) => { /* ... */ }
};
```

---

**✅ Você tem TODAS as operações que precisa para trabalhar com Project Hierarchy!**
