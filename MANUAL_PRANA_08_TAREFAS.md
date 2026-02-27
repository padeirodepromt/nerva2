# ✅ MANUAL PRANA 08 - SISTEMA DE TAREFAS

**Versão:** 3.0.1 | **Capítulo:** 08 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo descreve o **Sistema de Tarefas** de Prana: como criar, organizar, visualizar de múltiplas formas, e como a inteligência do sistema ajuda na priorização.

**Público:** Product Managers, Designers, Desenvolvedores  
**Tempo de leitura:** 35 minutos  
**Pré-requisitos:** [Capítulo 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md)

---

## 🎯 VISÃO GERAL

**O Sistema de Artefatos de Prana:**

Prana não é um sistema de "check & clean" (marcar e limpar). É um sistema de **"check, clean & CREATE"** - onde cada ação resulta em um artefato duradouro que fica permanentemente no sistema (em Project Hierarchy).

```
┌─ SPARK (Ideia rápida, temporária)
│
├─ CRIAÇÃO (Articulação formal)
│  ├─ TASK (Ação com entrega)
│  ├─ EVENTO (Momento agendado)
│  ├─ CHECKLIST (Processo repetível)
│  ├─ DOCUMENTO (Conhecimento capturado)
│  └─ ANOTAÇÃO (Quick reference)
│
├─ ORGANIZAÇÃO (Project Hierarchy)
│  ├─ Cada artefato pertence a um Project
│  ├─ Relacionamentos entre artefatos
│  └─ Rastreabilidade completa
│
├─ EXECUÇÃO (Realização)
│  ├─ Tracking de progresso
│  ├─ Energy matching
│  └─ Inteligência de priorização
│
└─ REFLEXÃO & ARQUIVO (Memória Duradoura)
   ├─ Completion reflection via Diary
   ├─ Artefato permanece no histórico
   ├─ Insights extraídos via Ash
   └─ Knowledge reutilizável futuramente
```

**Diferenciador:** Ao contrário de TO-DO apps que deletam tarefas após conclusão, Prana mantém toda a história como conhecimento vivo e reutilizável.

---

## 📐 ANATOMIA DE UMA TAREFA

```javascript
{
  id: "task_uuid",
  type: "task",  // artifact type
  
  // IDENTIDADE
  title: "Design nova interface de dashboard",
  description: "Redesenhar cards com novos temas glassmorphic",
  
  // ORGANIZAÇÃO NA HIERARQUIA
  project_id: "project_uuid",      // Sempre pertence a um projeto
  parent_task_id: null,             // null = root task, or reference para subtask
  related_artifact_ids: {           // Ligações com outros artefatos
    documents: ["doc_uuid_1"],      // Documentação relevante
    checklists: ["check_uuid_2"],   // Checklists associadas
    events: ["event_uuid_3"]        // Events relacionados
  },
  
  // PRIORIZAÇÃO
  priority: "high",      // low, medium, high
  status: "in_progress", // todo, in_progress, done
  
  // INTELIGÊNCIA PRANA
  energy_required: "high",     // low, medium, high
  estimated_time_minutes: 180,
  related_emotion_tags: ["creative", "focused"],
  
  // TEMPORALIDADE
  due_date: "2025-01-20",
  due_time: "18:00",
  start_date: "2025-01-18",
  reminder_at: "2025-01-20T10:00:00",
  
  // RELACIONAMENTOS
  assigned_to_user_id: "user_id",
  depends_on_tasks: ["task_id_1", "task_id_2"],
  task_dependencies: ["task_id_3"], // Outras tarefas que dependem desta
  documents: [
    { id, name, type, url },
    { id, name, type, url }
  ],
  
  // LIGAÇÃO COM VIDA DO USUÁRIO
  related_diary_entry_id: "diary_uuid",  // Reflexão sobre completação
  related_mood: "focused",               // Humor quando criada
  
  // ORGANIZAÇÃO VISUAL
  kanban_stage: "in_progress",
  kanban_position: 3,  // Order within stage
  mindmap_parent: "parent_task_id",
  
  // PERM ANÊNCIA (Task fica no sistema mesmo após conclusão)
  is_archived: false,  // Hidden from active view but still in system
  created_at: "2025-01-15T10:00:00",
  updated_at: "2025-01-18T14:30:00",
  completed_at: "2025-01-20T18:30:00",
  // Task completa → Permanece no histórico para referência
  
  // TRACKING
  completion_percentage: 60,  // Quando há subtasks
  subtasks_count: 3,
  subtasks_completed: 1
}
```

---

## �️ TIPOS DE ARTEFATOS

O sistema de Prana suporta múltiplos tipos de artefatos, todos organizáveis na Project Hierarchy:

### **1. TASK** (Ação com Entrega)
- Unidade de trabalho com resultado específico
- Tem: deadline, energy requirement, completion criteria
- Exemplo: "Design Dashboard Interface"

### **2. EVENTO** (Momento Agendado)
- Ponto no tempo (meeting, exercise, break)
- Tem: date, time, duration
- Integração com calendário
- Exemplo: "Team Sync Meeting"

### **3. CHECKLIST** (Processo Repetível)
- Sequência de passos reutilizável
- Pode ser:
  - Um-vez (single completion)
  - Repetível (daily, weekly, etc.)
  - Template (reutilizado em projetos)
- Exemplo: "Daily Standup Checklist"
- Estrutura:
  ```javascript
  {
    id: "check_uuid",
    type: "checklist",
    title: "Q1 Planning Checklist",
    items: [
      { id, text, is_completed, assigned_to },
      { id, text, is_completed, assigned_to }
    ],
    recurrence: "one_time", // one_time, daily, weekly, monthly
    progress: "6/10"
  }
  ```

### **4. DOCUMENTO** (Conhecimento Capturado)
- Documentação, referência, conhecimento
- Pode ser:
  - API Docs
  - Design Systems
  - Process Documentation
  - Knowledge Base articles
- Permanece como referência duradoura
- Exemplo: "API Documentation v2.0"
- Estrutura:
  ```javascript
  {
    id: "doc_uuid",
    type: "document",
    title: "API Reference Documentation",
    content: "[Markdown content]",
    categories: ["api", "backend"],
    pages: 45,
    last_updated: "2025-01-18T14:00:00",
    version: "2.0"
  }
  ```

### **5. TIPOS DE DOCUMENTOS** (Subtypes)

Documentos podem ser especializados:

```
Document
├─ API Documentation
├─ Design System
├─ Process/Workflow
├─ Knowledge Article
├─ Meeting Notes
├─ Research
├─ Specification
└─ Decision Record (ADR)
```

---

## 🏢 PROJECT HIERARCHY (Organização em Árvore)

**Conceito:** Todos os artefatos (tasks, eventos, checklists, docs) são organizados hierarquicamente dentro de Projetos.

```
PROJECT (Umbrella)
├─ PHASE 1: Planning
│  ├─ TASK: Create Requirements
│  ├─ TASK: Design Wireframes
│  ├─ DOCUMENT: Project Charter
│  └─ CHECKLIST: Planning Process
│
├─ PHASE 2: Design
│  ├─ TASK: Design Dashboard
│  │  ├─ SUBTASK: Design Energy Card
│  │  └─ SUBTASK: Design Mood Graphs
│  ├─ DOCUMENT: Design System
│  ├─ EVENT: Design Review Meeting
│  └─ CHECKLIST: Design QA
│
└─ PHASE 3: Implementation
   ├─ TASK: Implement Backend
   ├─ TASK: Implement Frontend
   ├─ DOCUMENT: API Reference
   ├─ EVENT: Daily Standup (recurring)
   └─ CHECKLIST: Code Review Process
```

**Structure en Database:**

```javascript
{
  id: "project_uuid",
  title: "Dashboard Redesign",
  
  // Hierarquia
  artifacts: [
    { id, type, title, phase, status },
    { id, type, title, phase, status }
  ],
  
  // Organização
  phases: [
    { name: "Planning", artifacts: [...] },
    { name: "Design", artifacts: [...] },
    { name: "Implementation", artifacts: [...] }
  ],
  
  // Metadata
  created_at: "2025-01-15",
  status: "in_progress",
  team_members: [...],
  
  // Rastreamento completo
  total_artifacts: 24,
  completed_artifacts: 8,
  progress_percentage: 33
}
```

**Benefícios da Hierarquia:**
- ✅ Contexto claro (qual projeto, qual fase)
- ✅ Rastreabilidade completa
- ✅ Reutilização (templates de checklists entre projetos)
- ✅ Histórico preservado (nada é deletado)
- ✅ Insights por projeto (productivity metrics)

---

## 🎨 VIEWS DISPONÍVEIS

Prana oferece **4 visualizações** da mesma estrutura de artefatos:

### **VIEW 0: LISTVIEW** (Unificada, Flat)
Visualizar todos os artefatos em uma lista única, filtrada e ordenada.
- Ver seção de Navigation no [Capítulo 07 - Dashboard](MANUAL_PRANA_07_DASHBOARD.md#0-navigation--views)

### **VIEW 1: SHEET VIEW** (Tabular)

Excelente para: Análise, bulk editing, relatórios

```
┌─────────────────────────────────────────────────────────────┐
│ Sheet View - Todos os Projetos                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Filter] [Sort] [Search] [+ Add Task] [Column Config]      │
│                                                             │
│  Title │ Status │ Priority │ Energy │ Time │ Due Date │ Assign
│  ─────────────────────────────────────────────────────────────
│  ✓ Design dashboard │ Done │ High │ High │ 3h │ Jan 20 │ Me
│  ⚪ Write API docs    │ Todo │ Med  │ Low  │ 1h │ Jan 22 │ Dev2
│  ▶ Review PR          │ IP   │ High │ Med  │ 30m│ Jan 18 │ Me
│  ⚪ Research tools    │ Todo │ Low  │ Low  │ 2h │ Jan 25 │ Team
│  ⚪ Deploy to prod    │ Todo │ High │ Med  │ 1h │ Jan 19 │ DevOps
│
│  [Group by Project] [Group by Priority] [Export as CSV]
│
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Columnas customizáveis
- Sorting multi-level
- Filtering avançado
- Bulk actions (select multiple)
- Inline editing
- Drag to reorder
- Export (CSV, PDF)

**Component:** `SheetView.jsx`

```javascript
const SheetView = ({ tasks, project }) => {
  const [columnConfig, setColumnConfig] = useState(DEFAULT_COLUMNS);
  const [sortBy, setSortBy] = useState('due_date');
  const [filterBy, setFilterBy] = useState({});
  
  const filtered = applyFilters(tasks, filterBy);
  const sorted = applySorting(filtered, sortBy);
  
  return (
    <div className="sheet-view">
      <div className="controls">
        <SearchBar placeholder="Find tasks..." />
        <FilterButton onClick={handleFilterClick} />
        <SortButton onClick={handleSortClick} />
        <ColumnConfigButton onClick={handleConfigClick} />
      </div>
      
      <table className="tasks-table">
        <thead>
          <tr>
            {columnConfig.map(col => (
              <th key={col.id} onClick={() => setSortBy(col.id)}>
                {col.name}
                {sortBy === col.id && <SortIndicator />}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(task => (
            <TaskRow 
              key={task.id}
              task={task}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

---

### **VIEW 2: KANBAN VIEW** (Status Workflow)

Excelente para: Visualizar fluxo, gestão de pipeline

```
┌─────────────────────────────────────────────────────────────┐
│ Kanban View                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [TODO]              [IN PROGRESS]        [DONE]             │
│ ────────────────────────────────────────────────────        │
│                                                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │ Research tools   │ Design dash  │ │ ✓ Deploy to  │      │
│ │ LOW energy   │ │ HIGH energy  │ │   prod       │      │
│ │ 2h / Jan 25  │ │ 3h / Jan 20  │ │ DONE / Jan19  │      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
│      │                  │                   │              │
│ ┌──────────────┐  │              │  │              │      │
│ │ Write API    │  │              │  │              │      │
│ │ LOW energy   │  │              │  │              │      │
│ │ 1h / Jan 22  │  │              │  │              │      │
│ └──────────────┘  │              │  │              │      │
│                   │              │  │              │      │
│                   └──────────────┘  └──────────────┘      │
│                                                             │
│                   [+ Add Card]                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Drag & drop entre colunas
- Customizar stages
- Card preview on hover
- WIP limits (Work in Progress)
- Grouped by status por padrão

**Component:** `KanbanView.jsx`

```javascript
const KanbanView = ({ tasks, project, onTaskMove }) => {
  const stages = ['todo', 'in_progress', 'done'];
  const tasksByStage = groupBy(tasks, 'status');
  
  return (
    <div className="kanban-view">
      <div className="board">
        {stages.map(stage => (
          <KanbanColumn 
            key={stage}
            stage={stage}
            tasks={tasksByStage[stage] || []}
            onDrop={(task) => onTaskMove(task.id, stage)}
          />
        ))}
      </div>
    </div>
  );
};

const KanbanColumn = ({ stage, tasks, onDrop }) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };
  
  return (
    <div 
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(e) => {
        const taskId = e.dataTransfer.getData('taskId');
        onDrop(taskId);
      }}
    >
      <h3>{STAGE_LABELS[stage]}</h3>
      <div className="cards">
        {tasks.map(task => (
          <KanbanCard 
            key={task.id}
            task={task}
            draggable
            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
          />
        ))}
      </div>
      <div className="add-card">+ Add Card</div>
    </div>
  );
};
```

---

### **VIEW 3: MINDMAP VIEW** (Hierarchical/Relational)

Excelente para: Explorar relacionamentos, planejar estrutura

```
                     ┌─── Research
                     │
                     ├─── Design
         PROJECT ────┤
                     ├─── Development
                     │    ├─── Frontend
                     │    └─── Backend
                     │
                     └─── Testing

Ou com dependências:

    Task A ──blocks──> Task B ──relates──> Task C
      │                  │
      └──subtask 1      └──subtask 2.1
      └──subtask 2         └──subtask 2.2

```

**Component:** `MindmapView.jsx`

```javascript
import ReactFlow, { 
  useNodesState, 
  useEdgesState, 
  MiniMap,
  Controls,
  Background,
  useReactFlow
} from 'reactflow';

const MindmapView = ({ tasks, project }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    buildNodesFromTasks(tasks)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildEdgesFromDependencies(tasks)
  );
  
  return (
    <div className="mindmap-view">
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

function buildNodesFromTasks(tasks) {
  return tasks.map(task => ({
    id: task.id,
    data: { 
      label: task.title,
      priority: task.priority,
      energy: task.energy_required,
      status: task.status
    },
    position: calculatePosition(task),
    style: getNodeStyle(task)
  }));
}

function buildEdgesFromDependencies(tasks) {
  const edges = [];
  
  tasks.forEach(task => {
    task.depends_on_tasks?.forEach(depId => {
      edges.push({
        id: `${depId}-${task.id}`,
        source: depId,
        target: task.id,
        label: 'blocks',
        animated: true
      });
    });
  });
  
  return edges;
}
```

---

## 🔄 FLUXO DE CRIAÇÃO

### Step 1: Spark Capture

Usuário tem ideia rápida:

```javascript
// User clicks "Quick Capture" → voice, text, or sketch
const handleSparkCapture = async (sparkData) => {
  const spark = {
    id: generateUUID(),
    content: sparkData.content,
    type: sparkData.type, // "text", "voice", "sketch"
    capturedAt: new Date(),
    status: "inbox"
  };
  
  // Save to database
  await apiClient.post('/api/tasks/spark', spark);
  
  // Show: "Spark captured! ✨"
  showNotification('Spark captured!');
};
```

### Step 2: Task Creation from Spark

Usuário converte spark → task:

```javascript
const handleConvertSparkToTask = async (spark) => {
  const task = {
    id: generateUUID(),
    title: spark.content.slice(0, 50), // Auto title
    description: spark.content,
    project_id: suggestProjectByContent(spark.content),
    is_spark: true,
    spark_original_id: spark.id,
    status: "todo",
    created_at: new Date()
  };
  
  // Let user refine before saving
  openTaskCreationModal(task);
};
```

### Step 3: Full Task Creation Form

```javascript
const TaskCreationForm = ({ initialData }) => {
  const [task, setTask] = useState(initialData || DEFAULT_TASK);
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        value={task.title}
        onChange={(e) => setTask({...task, title: e.target.value})}
        placeholder="Task title"
      />
      
      <textarea 
        value={task.description}
        onChange={(e) => setTask({...task, description: e.target.value})}
        placeholder="Description"
      />
      
      <select 
        value={task.project_id}
        onChange={(e) => setTask({...task, project_id: e.target.value})}
      >
        <option>Select project</option>
        {projects.map(p => <option value={p.id}>{p.name}</option>)}
      </select>
      
      <div className="metadata">
        <select value={task.priority} onChange={...}>
          <option value="low">Priority: Low</option>
          <option value="medium">Priority: Medium</option>
          <option value="high">Priority: High</option>
        </select>
        
        <select value={task.energy_required} onChange={...}>
          <option value="low">Energy: Low</option>
          <option value="medium">Energy: Medium</option>
          <option value="high">Energy: High</option>
        </select>
        
        <input 
          type="number"
          value={task.estimated_time_minutes}
          placeholder="Est. time (minutes)"
          onChange={(e) => setTask({...task, estimated_time_minutes: parseInt(e.target.value)})}
        />
      </div>
      
      <input 
        type="date"
        value={task.due_date}
        onChange={(e) => setTask({...task, due_date: e.target.value})}
      />
      
      <button type="submit">Create Task</button>
    </form>
  );
};
```

---

## 🧠 INTELIGÊNCIA DO SISTEMA

### Smart Task Recommendations

```javascript
// Based on current energy level
const recommendTasks = (tasks, currentEnergyLevel) => {
  return tasks
    .filter(t => t.status !== 'done' && t.energy_required <= currentEnergyLevel)
    .sort((a, b) => {
      // Prioritize by: deadline > priority > energy match
      const deadlineScore = calculateDeadlineUrgency(a.due_date);
      const priorityScore = PRIORITY_SCORES[a.priority];
      const energyMatch = Math.max(0, currentEnergyLevel - a.energy_required);
      
      return (deadlineScore * 0.5 + priorityScore * 0.3 + energyMatch * 0.2) -
             (calculateDeadlineUrgency(b.due_date) * 0.5 + 
              PRIORITY_SCORES[b.priority] * 0.3 + 
              (currentEnergyLevel - b.energy_required) * 0.2);
    });
};
```

### Auto-Detection of Task Duration

```javascript
// ML could learn from user completion patterns
const suggestDuration = (taskTitle, description, userHistory) => {
  const similar = userHistory.filter(t => 
    isSimilarTask(t, { title: taskTitle, description })
  );
  
  if (similar.length > 0) {
    const avgDuration = average(similar.map(t => t.estimated_time_minutes));
    return Math.round(avgDuration);
  }
  
  // Fallback heuristics
  if (hasKeywords(taskTitle, ['research', 'learning'])) return 120;
  if (hasKeywords(taskTitle, ['write', 'documentation'])) return 90;
  if (hasKeywords(taskTitle, ['code', 'debug'])) return 180;
  if (hasKeywords(taskTitle, ['design'])) return 120;
  
  return 60; // Default
};
```

### Dependency Chain Visualization

```javascript
const calculateTaskChain = (task) => {
  const chain = [task];
  let current = task;
  
  while (current.depends_on_tasks && current.depends_on_tasks.length > 0) {
    const blocking = tasks.find(t => t.id === current.depends_on_tasks[0]);
    if (!blocking) break;
    chain.unshift(blocking);
    current = blocking;
  }
  
  return chain; // [Root, ..., Parent, Current]
};

// Show: "This task is blocked by X task that's due in 3 days"
// Or: "Completing this unblocks Y and Z tasks"
```

---

## 📊 TASK LIFECYCLE

```
CREATED (quando)
    │
    ├─→ [Due date] 
    │   ├─ UPCOMING (< 7 days)
    │   └─ OVERDUE (past due date)
    │
    ├─→ [User starts]
    │   └─ IN PROGRESS
    │
    ├─→ [User completes]
    │   └─ COMPLETED
    │       ├─ Auto-create diary prompt
    │       ├─ Ask for reflection
    │       └─ Mark as "Mas um dia produtivo! 🎉"
    │
    └─→ [User archived]
        └─ ARCHIVED
```

---

## 🔌 INTEGRAÇÃO COM ENERGY/MOOD

### Quando usuário faz Energy Check-in

```javascript
const handleEnergyCheckIn = async (energyLevel) => {
  // 1. Save energy
  await apiClient.post('/api/energy', { level: energyLevel });
  
  // 2. Re-recommend tasks based on new energy
  const upcomingTasks = await fetchUpcomingTasks();
  const recommended = recommendTasks(upcomingTasks, energyLevel);
  
  // 3. Update Flux Card with new recommendations
  updateFluxCard(recommended);
  
  // 4. Show notification
  if (energyLevel >= 7) {
    showNotification("You're energized! Consider tackling high-priority tasks.");
  } else if (energyLevel <= 3) {
    showNotification("Low energy detected. Let's focus on small wins.");
  }
};
```

### Quando usuário loga mood ansioso

```javascript
const handleMoodEntry = async (mood) => {
  // 1. Save mood
  await apiClient.post('/api/mood', { mood, timestamp: new Date() });
  
  // 2. Check if anxiety trigger is task-related
  const recentTasks = await fetchRecentTasks(24); // Last 24 hours
  const analysis = await ashService.analyzeMoodTrigger(mood, recentTasks);
  
  // 3. Suggest support
  if (analysis.likely_cause === 'task_overload') {
    showSuggestion("Try breaking high-priority tasks into smaller chunks.");
  } else if (analysis.likely_cause === 'waiting') {
    showSuggestion("You're waiting on dependencies. Consider other tasks meanwhile.");
  }
};
```

---

## 🔗 LEITURA RELACIONADA

- [📊 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - ListView (visualização unificada), Flux Card que mostra tarefas
- [📔 09 - Diários & Papyrus](MANUAL_PRANA_09_DIARIOS.md) - Reflexão após completação
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Inteligência nas recomendações

---

**Próximo capítulo:** [📔 09 - Diários & Papyrus](MANUAL_PRANA_09_DIARIOS.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
