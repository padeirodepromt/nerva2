# ⚡ PROJECT HIERARCHY - QUICK REFERENCE

**Resumo Executivo** | **1 página** | **5 minutos de leitura**

---

## 🏗️ O QUE É?

**Project Hierarchy** = Árvore de projetos (como pastas em um explorador de arquivos).

Um projeto pode ter **múltiplos subprojetos**, que têm **múltiplos subprojetos**, infinitamente.

```
Projeto Raiz (parentId = NULL)
├─ Fase 1 (parentId = Raiz)
│  ├─ Subfase (parentId = Fase 1)
│  └─ Task, Doc, Event
├─ Fase 2 (parentId = Raiz)
└─ Fase 3 (parentId = Raiz)
```

---

## 📊 BANCO DE DADOS

### Tabela: `projects`

```javascript
id             // TEXT - identificador único
title          // TEXT - nome do projeto
parentId       // TEXT - ID do projeto PAI (self-reference) 🔑
description    // TEXT
ownerId        // TEXT - quem criou
teamId         // TEXT - time (se compartilhado)
type           // TEXT - 'personal' ou 'professional'
isShared       // BOOLEAN - está compartilhado?
visibility     // TEXT - 'private', 'shared', 'public'
status         // TEXT - 'active', 'archived', 'completed'
color          // TEXT - cor visual (#HEX)
icon           // TEXT - ícone (emoji ou icon name)
startDate      // TIMESTAMP - quando começou
endDate        // TIMESTAMP - prazo
createdAt      // TIMESTAMP
updatedAt      // TIMESTAMP
deletedAt      // TIMESTAMP (soft delete)
```

### Relacionamento Chave

```javascript
// projectsRelations
parent: one(projects)        // Projeto PAI (se houver)
subProjects: many(projects)  // Projetos FILHOS (ilimitados)
tasks: many(tasks)           // Tasks diretas
```

---

## 🎯 QUANDO USAR?

### ✅ Crie um Projeto para:
- Trabalho grande (redesign, feature, produto)
- Objetivo de longo prazo (meta, livro, curso)
- Coisa que se estende por semanas/meses
- Contexto que agrupa múltiplas tarefas

### ✅ Crie um Subprojeto para:
- Quebrar projeto em fases (Planning → Design → Dev)
- Organizar trabalho relacionado
- Criar estrutura visual clara

### ❌ NÃO crie projeto para:
- Tarefa única (use Task)
- Coisa pequena que faz hoje (use Task)
- Ideia solta (use Spark)
- Evento pontual (use Evento)

---

## 🔧 OPERAÇÕES COMUNS

### 1. Criar Projeto Raiz

```javascript
await Project.create({
  title: "UI Redesign",
  parentId: null,  // ← Raiz
  description: "Modernize dashboard"
});
```

### 2. Criar Subprojeto/Fase

```javascript
await Project.create({
  title: "Planning Phase",
  parentId: "proj_123",  // ← Referencia o pai
  status: "active"
});
```

### 3. Buscar Projeto + Filhos

```javascript
const project = await db.query.projects.findFirst({
  where: eq(projects.id, "proj_123"),
  with: {
    parent: true,        // Pai
    subProjects: true,   // Filhos (1 nível)
    tasks: true          // Tasks diretas
  }
});
```

### 4. Buscar Todos os Subprojetos (Recursivo)

```javascript
const getAll = async (projectId) => {
  const result = [projectId];
  const subs = await db.query.projects.findMany({
    where: eq(projects.parentId, projectId)
  });
  for (const sub of subs) {
    result.push(...await getAll(sub.id));
  }
  return result;
};
```

### 5. Mover Projeto (Drag & Drop)

```javascript
await Project.update("proj_fase2", {
  parentId: "proj_fase1"  // Mover para novo pai
});
```

### 6. Deletar Projeto

```javascript
// Soft delete (marca como deletado)
await db.update(projects)
  .set({ deletedAt: new Date() })
  .where(eq(projects.id, "proj_123"));
```

---

## 🎨 UI COMPONENTS

| Componente | Arquivo | Função |
|-----------|---------|--------|
| **ProjectHierarchy** | `src/components/dashboard/ProjectHierarchy.jsx` | Tree expansível (como VS Code) |
| **ProjectNode** | `src/components/dashboard/ProjectNode.jsx` | Renderiza um projeto + filhos (recursivo) |
| **HierarchicalProjectSelector** | `src/components/forms/HierarchicalProjectSelector.jsx` | Dropdown com indentação |
| **BreadcrumbDropper** | `src/components/dashboard/BreadcrumbDropper.jsx` | Mostra caminho (Projects > Phase > Task) |

---

## 📐 REGRAS

| Regra | Detalhe |
|------|--------|
| **Profundidade** | Ilimitada, mas UI recomenda ≤5 níveis |
| **Limites** | Sem limite programado |
| **Ciclos** | Proibidos (projeto não pode ser pai de si mesmo) |
| **Soft Delete** | Usa `deletedAt` (nada é realmente deletado) |
| **Pessoal** | Não pode ser `isShared = true` |
| **Cascata** | Tasks e docs têm `onDelete: 'cascade'` |

---

## 📚 EXEMPLOS

### Startup (Software)

```
SaaS Platform MVP
├─ Phase 1: Planning
├─ Phase 2: Design
├─ Phase 3: Frontend Dev
├─ Phase 3: Backend Dev
├─ Phase 5: Testing
└─ Phase 6: Launch
```

### Pessoal (Livro)

```
Write: The AI Revolution
├─ Chapter 1: Introduction
│  ├─ Section 1.1: The Problem
│  │  ├─ Topic 1.1.1: AI Definition
│  │  ├─ Topic 1.1.2: Current Landscape
│  │  └─ Topic 1.1.3: Why It Matters
│  └─ Section 1.2: Motivation
├─ Chapter 2: History
└─ ... (more chapters)
```

### Pessoal (Goals)

```
2025 Growth Goals
├─ Health & Fitness
├─ Learning
│  ├─ Learn ML
│  ├─ Learn Spanish
│  └─ Technical Writing
├─ Community
└─ Creative
```

---

## 🔗 RELACIONAMENTOS

```
PROJECTS (self-ref via parentId)
    ↓
TASKS (projectId)
    ├─ TASK TAGS
    ├─ SUBTASKS (parentId em tasks)
    ├─ TASK DEPENDENCIES
    └─ DOCUMENTS (via fileId)

PROJECTS (ownerId) → USERS
PROJECTS (teamId) → TEAMS
```

---

## 🚀 DICAS DE PERFORMANCE

- **Não** buscar ALL subprojects recursivamente sem limite
- **Use** filtros `parentId = null` para projetos raiz
- **Cache** a hierarquia em estado (Redux/Zustand)
- **Pagine** se tiver >100 tasks
- **Index** em: `parentId`, `ownerId`, `status`

---

## 📖 DOCUMENTAÇÃO COMPLETA

Para detalhes COMPLETOS, ver:
- [PROJECT_HIERARCHY_COMPLETE_GUIDE.md](PROJECT_HIERARCHY_COMPLETE_GUIDE.md) ← LEIA ISSO
- [PROJECT_HIERARCHY_VISUAL_EXAMPLES.md](PROJECT_HIERARCHY_VISUAL_EXAMPLES.md)
- [MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md](MANUAL_PRANA_11C_ENTIDADES_HIERARCHY.md)

---

**✅ Você agora tem um mapa mental rápido de Project Hierarchy!**
