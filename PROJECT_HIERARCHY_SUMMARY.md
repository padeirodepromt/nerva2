# 🎯 PROJECT HIERARCHY - RESUMO EXECUTIVO

**O que você precisa saber em 2 minutos**

---

## O QUE É?

Uma **árvore de projetos** onde cada projeto pode ter filhos, que têm filhos, infinitamente.

```
Projeto Raiz ← (parentId = NULL)
├─ Subprojeto 1 ← (parentId = Raiz)
│  ├─ Sub-sub-projeto ← (parentId = Sub 1)
│  └─ Tasks, Documents
├─ Subprojeto 2
└─ Subprojeto 3
```

---

## TABELA CHAVE

```
projects table
├─ id: unique ID
├─ title: nome
├─ parentId: 🔑 ID do pai (ou NULL se raiz)
├─ description: descrição
├─ status: active/archived/completed
├─ type: personal/professional
├─ isShared: boolean
├─ visibility: private/shared/public
└─ ... (color, icon, dates, etc)
```

---

## 5 FATOS

1. ✅ **Múltiplos níveis?** SIM, ilimitados (mas UI ~5 níveis)
2. ✅ **Tasks podem estar em qualquer nível?** SIM, via `projectId`
3. ✅ **Docs vinculados onde?** Em qualquer projeto
4. ✅ **Subtasks?** Via `parentId` em tasks (também recursivo)
5. ✅ **Deletar projeto?** Soft delete marca como deletado (não remove)

---

## OPERAÇÕES

| O quê | Como | Código |
|------|------|--------|
| Criar subprojeto | POST /projects | `{ title, parentId: "proj_123" }` |
| Buscar filhos | Drizzle findMany | `eq(projects.parentId, id)` |
| Mover projeto | PUT drag&drop | `{ parentId: newId }` |
| Deletar | Soft delete | `{ deletedAt: now }` |
| Buscar recursivo | Função helper | Ver QUERIES.md |

---

## EXEMPLO REAL

```
SaaS MVP (parentId: NULL)
├─ Planning (parentId: MVP)
│  ├─ Task: Requirements ✅
│  ├─ Task: Scope ✅
│  └─ Doc: Charter 📄
├─ Design (parentId: MVP)
│  ├─ Task: Wireframes ⏳
│  ├─ Event: Review 📅
│  └─ Doc: Design System 📄
├─ Development (parentId: MVP)
│  ├─ Frontend Module (parentId: Dev)
│  ├─ Backend Module (parentId: Dev)
│  └─ Task: Setup ✅
└─ Launch (parentId: MVP)
   ├─ Task: Deploy
   └─ Event: Go Live! 🎉
```

---

## RELACIONAMENTOS

```
PROJECT → PROJECT (parentId) ← SELF-REFERENCE
PROJECT → TASK (projectId)
TASK → TASK (parentId) ← SUBTASK
PROJECT → USER (ownerId)
PROJECT → TEAM (teamId)
TASK → TAGS (many-to-many)
```

---

## REGRAS

- ⛔ Projeto não pode ser pai de si mesmo
- ⛔ Não criar ciclos (A→B→C→A)
- ⛔ Projetos pessoais não podem ser compartilhados
- ✅ Soft delete (sempre prefira marcar como deletado)
- ✅ Validar profundidade antes de mover

---

## UI

| Componente | O que faz |
|-----------|----------|
| **ProjectHierarchy** | Renderiza árvore inteira (expandível) |
| **ProjectNode** | Node recursivo (projeto + filhos) |
| **Selector** | Dropdown com indentação (criar/mover) |
| **Breadcrumb** | Mostra caminho (Projects > Phase > Task) |

---

## LEITURA RECOMENDADA

### ⚡ 5 minutos
→ [PROJECT_HIERARCHY_QUICK_REF.md](PROJECT_HIERARCHY_QUICK_REF.md)

### 📖 30 minutos (COMPLETO)
→ [PROJECT_HIERARCHY_COMPLETE_GUIDE.md](PROJECT_HIERARCHY_COMPLETE_GUIDE.md) ⭐

### 📊 Exemplos reais
→ [PROJECT_HIERARCHY_VISUAL_EXAMPLES.md](PROJECT_HIERARCHY_VISUAL_EXAMPLES.md)

### 🛠️ Código pronto
→ [PROJECT_HIERARCHY_QUERIES.md](PROJECT_HIERARCHY_QUERIES.md)

### 📚 Índice completo
→ [PROJECT_HIERARCHY_INDEX.md](PROJECT_HIERARCHY_INDEX.md)

---

**Você agora tem uma visão 360° de Project Hierarchy em Prana! 🚀**
