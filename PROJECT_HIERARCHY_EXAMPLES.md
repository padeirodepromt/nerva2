# PROJECT HIERARCHY - EXEMPLOS PRÁTICOS E SNIPPETS

## EXEMPLO 1: Criando um Subprojeto

### Na Interface:
```
1. Clique em um projeto (ex: "Marketing")
2. Clique direito → "Nova Pasta"
3. Ou clique no botão "+" no toolbar
4. Modal abre: "Criar Pasta - Dentro de: Marketing"
5. Digite: "Campanha Q4 2025"
6. Clique "Criar"
```

### O que acontece no Backend:
```javascript
// Frontend envia (src/components/dashboard/ProjectHierarchy.jsx):
POST /api/projects
{
  "title": "Campanha Q4 2025",
  "parentId": "proj_marketing_123",  // ID do projeto "Marketing"
  "ownerId": "user_abc",
  "status": "active",
  "type": "personal"
}

// Backend responde:
201 Created
{
  "id": "proj_campanha_q4",
  "title": "Campanha Q4 2025",
  "parentId": "proj_marketing_123",
  "ownerId": "user_abc",
  "status": "active",
  "type": "personal",
  "createdAt": "2025-12-22T10:00:00Z"
}
```

### Resultado no Explorer:
```
Marketing
├── Campanha Q4 2025     ← Novo subprojeto
```

---

## EXEMPLO 2: Criando uma Tarefa em um Subprojeto

### Na Interface:
```
1. Clique no subprojeto "Campanha Q4 2025"
2. Clique direito → "Nova Tarefa"
3. Modal: "Criar Tarefa - Dentro de: Campanha Q4 2025"
4. Digite: "Preparar materiais de design"
5. Clique "Criar"
```

### O que acontece:
```javascript
// Frontend envia:
POST /api/tasks
{
  "title": "Preparar materiais de design",
  "project_id": "proj_campanha_q4",  // ID do projeto
  "status": "todo",
  "priority": "medium"
}

// Backend responde:
201 Created
{
  "id": "task_design_001",
  "title": "Preparar materiais de design",
  "project_id": "proj_campanha_q4",
  "status": "todo",
  "priority": "medium",
  "createdAt": "2025-12-22T10:05:00Z"
}
```

### Resultado no Explorer:
```
Marketing
├── Campanha Q4 2025
│   ├── Preparar materiais de design   ← Nova tarefa
│   └── [ícone de tarefa]
```

---

## EXEMPLO 3: Criando uma Tarefa com Checklist

### Na Interface:
```
1. Cria tarefa normalmente (vide Exemplo 2)
2. Abre a tarefa (double-click ou clique)
3. No formulário, expande seção "Checklist"
4. Adiciona itens:
   - [ ] Item 1: "Revisar cores"
   - [ ] Item 2: "Aprovar com cliente"
5. Salva
```

### O que é enviado:
```javascript
// Frontend (ao atualizar tarefa):
PUT /api/tasks/task_design_001
{
  "title": "Preparar materiais de design",
  "checklist": [
    { "item": "Revisar cores", "done": false },
    { "item": "Aprovar com cliente", "done": false }
  ]
}

// Schema correspondente:
tasks.checklist = jsonb([
  { item: "Revisar cores", done: false },
  { item: "Aprovar com cliente", done: false }
])
```

---

## EXEMPLO 4: Movendo um Projeto via Drag-and-Drop

### Cenário:
```
Projeto A (pessoal)
├── Subprojeto B1
├── Subprojeto B2

Projeto C (profissional)
├── Subprojeto C1

AÇÃO: Arrastar "Subprojeto B1" para dentro de "Projeto C"
```

### Na Interface:
```
1. Clique e segure em "Subprojeto B1"
2. Arrasta até "Projeto C"
3. Solta (drop)
4. Confirmação: "Movido para Projeto C"
```

### O que acontece no Backend:
```javascript
// Frontend executa (handleDrop):
PUT /api/projects/subproj_b1
{
  "parentId": "proj_c"  // Novo pai
}

// Backend atualiza:
await db.update(schema.projects)
  .set({ parentId: "proj_c", updatedAt: new Date() })
  .where(eq(schema.projects.id, "subproj_b1"))

// Resultado no Database:
projects WHERE id = 'subproj_b1'
{
  parentId: "proj_c"    ← Alterado
}
```

### Resultado no Explorer:
```
Projeto A (pessoal)
├── Subprojeto B2           ← B1 foi movido!

Projeto C (profissional)
├── Subprojeto C1
├── Subprojeto B1           ← Agora está aqui
```

---

## EXEMPLO 5: Movendo uma Tarefa Entre Projetos

### Cenário:
```
Projeto A
├── Tarefa T1

Projeto B
└── (vazio)

AÇÃO: Arrastar "Tarefa T1" de A para B
```

### Na Interface:
```
1. Clique e segure em "Tarefa T1"
2. Arrasta até "Projeto B"
3. Solta (drop)
4. Confirmação: "Movido para Projeto B"
```

### O que acontece:
```javascript
// Frontend executa (handleDrop):
PUT /api/tasks/task_t1
{
  "project_id": "proj_b"  // Novo projeto
}

// Backend atualiza:
await db.update(schema.tasks)
  .set({ project_id: "proj_b", updatedAt: new Date() })
  .where(eq(schema.tasks.id, "task_t1"))

// Nota: Apenas a tarefa se move, não há cascata
```

### Resultado:
```
Projeto A
└── (vazio) ← Tarefa foi removida

Projeto B
└── Tarefa T1 ← Agora está aqui com project_id = "proj_b"
```

---

## EXEMPLO 6: Renomeando (SEM Alterar Hierarquia)

### Cenário:
```
Marketing
├── Campanha Q4 2025  ← Quer renomear para "Campanha Q4 - FINAL"
```

### Na Interface:
```
1. Clique direito em "Campanha Q4 2025"
2. Clique "Renomear"
3. Modal: Campo com valor atual: "Campanha Q4 2025"
4. Altera para: "Campanha Q4 - FINAL"
5. Pressiona Enter ou clica "Salvar"
```

### O que é enviado:
```javascript
// Frontend:
PUT /api/projects/proj_campanha_q4
{
  "title": "Campanha Q4 - FINAL"  // ← Só título muda
  // parentId NÃO é enviado!
}

// Backend:
await db.update(schema.projects)
  .set({ title: "Campanha Q4 - FINAL", updatedAt: new Date() })
  .where(eq(schema.projects.id, "proj_campanha_q4"))

// Resultado:
{
  id: "proj_campanha_q4",
  title: "Campanha Q4 - FINAL",  ← Alterado
  parentId: "proj_marketing_123"  ← Mantido (não alterou)
}
```

### Limitação:
```javascript
// ❌ NÃO FUNCIONA na interface:
// Você não pode fazer isso durante a renomeação:
PUT /api/projects/proj_campanha_q4
{
  "title": "Campanha Q4 - FINAL",
  "parentId": "proj_novo_pai"  // Seria ignorado
}

// ✅ Para mover, use drag-drop em vez disso
```

---

## EXEMPLO 7: Deletando um Projeto (Não testa Cascata)

### Cenário:
```
Marketing
├── Campanha Q4 2025  ← Quer deletar
│   └── Tarefa T1
└── Subprojeto B2
```

### Na Interface:
```
1. Clique direito em "Campanha Q4 2025"
2. Clique "Excluir"
3. Confirmação: "Excluir Campanha Q4 2025?"
4. Clique OK
```

### O que acontece:
```javascript
// Frontend:
DELETE /api/projects/proj_campanha_q4

// Backend:
await db.delete(schema.projects)
  .where(eq(schema.projects.id, "proj_campanha_q4"))

// Cascata definida no schema:
// projectId: text('project_id').references(() => projects.id, { onDelete: 'cascade' })
```

### Resultado:
```
❌ Projeto deletado
❌ Todas as tarefas com project_id = "proj_campanha_q4" são DELETADAS também
❌ Subprojetos com parentId = "proj_campanha_q4" tornam-se ÓRFÃOS (aparecem no Inbox)

Obs: Sem teste confirmado no código
```

---

## EXEMPLO 8: Hierarquia Profunda (Sem Limite)

### Na Interface - Criar Cadeia:
```
1. Cria: Raiz
2. Cria dentro: Raiz → Nível 1
3. Cria dentro: Nível 1 → Nível 2
4. Cria dentro: Nível 2 → Nível 3
... (infinito!)
```

### Código correspondente:
```javascript
// Nível 0 (Raiz)
POST /api/projects
{
  "title": "Raiz",
  "parentId": null  // Sem pai
}
→ Cria: "proj_raiz"

// Nível 1
POST /api/projects
{
  "title": "Nível 1",
  "parentId": "proj_raiz"  // Pai: Raiz
}
→ Cria: "proj_n1"

// Nível 2
POST /api/projects
{
  "title": "Nível 2",
  "parentId": "proj_n1"  // Pai: Nível 1
}
→ Cria: "proj_n2"

// Nível 3, 4, 5... SEM LIMITE
```

### Resultado no Explorer:
```
Raiz
└── Nível 1
    └── Nível 2
        └── Nível 3
            └── Nível 4
                └── Nível 5
                    └── ...
```

### ⚠️ Problema Potencial:
```javascript
// Sem validação, pode criar ciclo!
// A pode apontar para B que aponta para A

// Projeto A
PUT /api/projects/proj_a
{ "parentId": "proj_b" }  // A → B

// Projeto B
PUT /api/projects/proj_b
{ "parentId": "proj_a" }  // B → A

// Resultado: Loop infinito! (A ↔ B)
// ❌ Sem validação no código atual
```

---

## EXEMPLO 9: Criando Evento (Não no ProjectHierarchy)

### Status:
```
❌ NÃO está integrado no ProjectHierarchy (Project Explorer)
✅ Existe no banco de dados
✅ Acessado via Calendar API
```

### Como criar via API:
```javascript
// Frontend (diretamente, não via UI):
POST /api/calendar/events
{
  "title": "Reunião com Cliente",
  "description": "Discutir escopo do projeto",
  "startTime": "2025-12-23T14:00:00Z",
  "endTime": "2025-12-23T15:00:00Z",
  "userEmail": "user@email.com",
  "projectId": null  // Nota: Não tem project_id no schema
}

// Classe disponível:
export class Event extends BaseEntity { 
    static resource = 'events'; 
}

// Uso:
await Event.create({
  title: "Reunião",
  startTime: new Date(),
  userEmail: "user@email.com"
});
```

### Limitação:
```javascript
// Tabela events (em calendar.js):
// Não tem coluna "project_id"
// Eventos são independentes de projetos
// ❌ Não aparecem no ProjectHierarchy
// ✅ Aparecem no Calendar/Planner
```

---

## EXEMPLO 10: Tentando Criar Spark (NÃO EXISTE)

### Status: ❌ NÃO ENCONTRADO

```javascript
// Procura em todo codebase:
grep -r "spark" src/
→ 0 resultados

// Possível alternativa:
// "Sparks" pode estar referenciando Insights do Ash (IA)
await Ash.getDailyInsight({ hours: 4, tasks: 12 });
// Retorna: { message: "Leitura energética...", tone: "wabi-sabi" }

// Mas não há classe "Spark" ou tabela "sparks"
// ❌ Conclusão: Não existem Sparks na estrutura atual
```

---

## CÓDIGO-REFERÊNCIA: Mapeamento de Tipos

```javascript
// src/components/dashboard/ProjectHierarchy.jsx
const renderNode = (node, level = 0) => {
    const isExpanded = expanded[node.id];
    const isSelected = selectedId === node.id;
    
    let Icon = IconFileText;
    let colorClass = 'text-muted-foreground';

    // Mapeamento de tipos:
    if (node.type === 'project') { 
        Icon = isExpanded ? IconFolderOpen : IconFolder; 
        colorClass = 'text-blue-400'; 
    }
    else if (node.type === 'inbox') { 
        Icon = IconBox; 
        colorClass = 'text-purple-400'; 
    }
    else if (node.type === 'task') { 
        Icon = IconLayout; 
        colorClass = 'text-emerald-400'; 
    }
    else if (node.type === 'document') { 
        Icon = IconFileText; 
        colorClass = 'text-amber-400'; 
    }
    else if (node.type === 'mindmap') { 
        Icon = IconMap; 
        colorClass = 'text-pink-400'; 
    }
    // ❌ Nota: Sem tipos "spark", "event", "checklist"
    
    return (/* Renderiza node */);
};
```

---

## TABELA COMPARATIVA: O que funciona vs Não funciona

| Operação | Funciona? | Como | Limitações |
|----------|-----------|------|-----------|
| **Criar Subprojeto** | ✅ Sim | Menu contexto / Drag | Sem limite de profundidade |
| **Criar Tarefa** | ✅ Sim | Menu contexto | Sem subtarefas via UI |
| **Criar Documento** | ✅ Sim | Menu contexto | Nenhuma |
| **Criar Mind Map** | ✅ Sim | Menu contexto | Nenhuma |
| **Criar Evento** | ❌ Não no UI | Apenas API | Não integrado |
| **Criar Checklist** | ⚠️ Parcial | Campo em tarefa | Não é independente |
| **Criar Spark** | ❌ Não existe | — | Não encontrado |
| **Mover Projeto** | ✅ Drag-drop | Arrastar entre pastas | Sem validação de ciclos |
| **Mover Tarefa** | ✅ Drag-drop | Arrastar | Sem cascata |
| **Renomear** | ✅ Sim | Menu contexto | Sem alterar parentId |
| **Deletar** | ✅ Sim | Menu contexto | Com cascata |
| **Profundidade Ilimitada** | ✅ Sim | Criar subprojetos infinitamente | ⚠️ Sem validação |

---

## PRÓXIMOS PASSOS RECOMENDADOS

### Se quiser adicionar validações:
```javascript
// 1. Validar ciclos (em projectController.js):
const hasCycle = async (projectId, parentId) => {
    let current = parentId;
    while (current) {
        if (current === projectId) return true;
        const parent = await db.query.projects.findFirst({ 
            where: eq(schema.projects.id, current) 
        });
        current = parent?.parentId;
    }
    return false;
};

// 2. Validar profundidade:
const getDepth = async (projectId, maxDepth = 10) => {
    let depth = 0, current = projectId;
    while (current) {
        if (depth >= maxDepth) return false;
        const parent = await db.query.projects.findFirst({ 
            where: eq(schema.projects.id, current) 
        });
        current = parent?.parentId;
        depth++;
    }
    return true;
};

// 3. Usar antes de atualizar parentId:
if (await hasCycle(projectId, parentId)) {
    return res.status(400).json({ error: "Ciclo detectado!" });
}
```

### Se quiser integrar Eventos:
```javascript
// 1. Adicionar "project_id" ao schema events (em db/schema/calendar.js)
// 2. Adicionar ao ProjectHierarchy:
//    - Tipo 'event' ao renderNode
//    - Menu contexto para criar evento
// 3. Filtrar eventos na distribuição de itens
```

### Se quiser implementar Subtarefas:
```javascript
// 1. Usar parentId existente em tarefas
// 2. Mostrar visual de subtarefas no ProjectHierarchy
// 3. Permitir drag-drop entre tarefas (criando parentId)
```

