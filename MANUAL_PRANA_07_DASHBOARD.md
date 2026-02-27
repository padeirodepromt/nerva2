# 📊 MANUAL PRANA 07 - DASHBOARD & ANALYTICS

**Versão:** 3.0.1 | **Capítulo:** 07 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo detalha o **Dashboard de Prana**: as principais views, cada componente, como dados fluem, e como insights são gerados.

**Público:** Product Managers, Designers, Desenvolvedores  
**Tempo de leitura:** 40 minutos  
**Pré-requisitos:** [Capítulo 03 - Arquitetura Mental](MANUAL_PRANA_03_ARQUITETURA_MENTAL.md)

---

## 🎯 O QUE É O DASHBOARD?

O Dashboard é o **"córtex cerebral"** de Prana. É onde:
- Usuários veem **overview** de sua vida
- Sistemas inteligentes mostram **insights contextuais**
- A IA (Ash) oferece **recomendações personalizadas**
- Dados se transformam em **ações**

```
    Raw Data (Tasks, Mood, Energy)
             ↓
      Processing (Services)
             ↓
       Visualization (Charts)
             ↓
      User Insights (Sankalpa, Tips)
             ↓
       Actionable Items (Next Steps)
```

---

## 🏠 ESTRUTURA GERAL DO DASHBOARD

```
┌─────────────────────────────────────────────────────┐
│             PRANA DASHBOARD VIEW                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [Header: Welcome + Date + Energy Check-in Quick]  │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  SECTION 1: HERO CARDS (Row 1)                     │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  SANKALPA CARD   │  │  INTENTION CARD  │        │
│  │  "Intenção       │  │  Personalized    │        │
│  │   do Dia"        │  │  daily affirmation        │
│  │                  │  │  based on energy/mood     │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  SECTION 2: VITAL STATS (Row 2)                    │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │ ENERGY STATS     │  │  MOOD STATS      │        │
│  │ ├─ Today: 7/10   │  │  ├─ Today: Calm  │        │
│  │ ├─ Week trend: ↑ │  │  ├─ Week distr:  │        │
│  │ ├─ Chart: 7-day  │  │  ├─ Pie chart    │        │
│  │ └─ Insight       │  │  └─ Correlation  │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │  ASTROLOGICAL CARD                   │          │
│  │  ├─ Today's transits                 │          │
│  │  ├─ Natal chart comparison           │          │
│  │  ├─ Aspect interpretation            │          │
│  │  └─ Recommendation (based on transit)│          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  SECTION 3: PRODUCTION (Row 3)                     │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  FLUX CARD       │  │ UPCOMING EVENTS  │        │
│  │  (Task Overview) │  │  ├─ Next 7 days  │        │
│  │  ├─ Due today    │  │  ├─ Deadlines    │        │
│  │  ├─ Due soon     │  │  ├─ Milestones   │        │
│  │  ├─ By energy    │  │  └─ Suggestions  │        │
│  │  └─ Quick add    │  │                  │        │
│  └──────────────────┘  └──────────────────┘        │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │  DIARY REFLECTION CARD               │          │
│  │  ├─ Last entry date                  │          │
│  │  ├─ Quick journal prompt             │          │
│  │  ├─ Related entries from past        │          │
│  │  └─ "Write now" quick action         │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ═══════════════════════════════════════════════   │
│  SECTION 4: HOLISTIC INSIGHTS (Row 4)             │
│  ═══════════════════════════════════════════════   │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │  AI INSIGHTS (by Ash)                │          │
│  │  ├─ Pattern detected:                │          │
│  │  │  "You're anxious when you have    │          │
│  │  │   many high-priority tasks"       │          │
│  │  │                                   │          │
│  │  └─ Recommendation:                  │          │
│  │     "Try breaking tasks into smaller│          │
│  │      chunks when energy is low"      │          │
│  └──────────────────────────────────────┘          │
│                                                     │
│  ┌──────────────────────────────────────┐          │
│  │  CONNECTED INSIGHTS                  │          │
│  │  ├─ You've been productive for 4 days│          │
│  │  ├─ Energy trend: ↗ +1.2 points/day │          │
│  │  ├─ Related to: Completing projects  │          │
│  │  └─ Keep momentum! 🚀                │          │
│  └──────────────────────────────────────┘          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🎨 COMPONENTES DETALHADOS

### **0. NAVIGATION & VIEWS**

**Estrutura de Navegação Principal:**

```
┌─────────────────────────────────────────────────────────────┐
│ MAIN NAVIGATION (Sidebar)                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  HOME                                                       │
│  ├─ Dashboard (Current overview)                            │
│  ├─ ListView (All tasks/projects flat)                      │
│  └─ Timeline (Temporal view)                                │
│                                                             │
│  PROJECTS (Project Hierarchy)                               │
│  ├─ Active Projects                                         │
│  │  ├─ Project A                                            │
│  │  │  ├─ Tasks                                             │
│  │  │  ├─ Documents                                         │
│  │  │  ├─ Checklists                                        │
│  │  │  └─ Events                                            │
│  │  └─ Project B                                            │
│  ├─ Archived Projects                                       │
│  └─ Create New                                              │
│                                                             │
│  DIARY (Papyrus)                                            │
│  ├─ Today's Reflection                                      │
│  ├─ Archive                                                 │
│  └─ Analytics                                               │
│                                                             │
│  SETTINGS                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**ListView (Lista Unificada):**

A ListView é a visualização **flat, unificada** de todos os artefatos do sistema: tarefas, eventos, checklists, documentos.

```
┌─────────────────────────────────────────────────────────────┐
│ ListView - All Items                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ [Search] [Filter by type] [Sort]                            │
│ [Type: All] [Status: All] [Energy: All]                     │
│                                                             │
│ ✓ Design Dashboard          TASK      HIGH                  │
│   Due 20 Jan • Energy: High • @Project A                    │
│                                                             │
│ ☐ Q1 Planning Checklist    CHECKLIST  MEDIUM               │
│   Due 25 Jan • 6/10 items complete                         │
│                                                             │
│ 📅 Team Sync Meeting        EVENT     -                     │
│   22 Jan 14:00 • @Project A                                │
│                                                             │
│ 📄 API Documentation        DOCUMENT  -                     │
│   Created 18 Jan • 45 pages • @Project B                   │
│                                                             │
│ 📅 Daily Standup            EVENT     -                     │
│   Every weekday 09:00                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Component:** `ListView.jsx`

```javascript
const ListView = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',      // all, task, event, checklist, document
    status: 'all',    // all, todo, in_progress, done
    energy: 'all',    // all, low, medium, high
    project: 'all'
  });
  const [sortBy, setSortBy] = useState('due_date');
  
  useEffect(() => {
    loadAllItems();
  }, [filters, sortBy]);
  
  const loadAllItems = async () => {
    const response = await apiClient.get('/api/items', {
      params: { ...filters, sort: sortBy }
    });
    setItems(response.data);
  };
  
  return (
    <div className="list-view">
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <SortSelector value={sortBy} onChange={setSortBy} />
      
      <ItemsList 
        items={items}
        onItemClick={handleItemClick}
        onItemEdit={handleItemEdit}
      />
    </div>
  );
};
```

---

### **1. SANKALPA CARD** (Intenção do Dia)

**O que é:** Intenção personalizada diária baseada em:
- Nível de energia de hoje
- Humor do usuário
- Trend de 7 dias
- Dados astrológicos
- Histórico pessoal

**Component:** `SankalpCard.jsx`

```javascript
// /components/DashboardCards/SankalpCard.jsx
const SankalpCard = ({ sankalpa, confidence }) => {
  return (
    <div className="card-hero card-glass-pure">
      <div className="header">
        <h2>✨ Intenção do Dia</h2>
        <span className="confidence">{Math.round(confidence * 100)}%</span>
      </div>
      
      <div className="sankalpa-text">
        {sankalpa}
      </div>
      
      <div className="actions">
        <button onClick={handleSetAsGoal}>📌 Set as Daily Goal</button>
        <button onClick={handleRegenerate}>🔄 Regenerate</button>
      </div>
    </div>
  );
};
```

**Data Flow:**
```
User opens Dashboard
    ↓
DashboardView calls: GET /api/ai/sankalpa-daily
    ↓
Backend: holisticAnalysisService.generateDailySankalpa()
    ↓
Fetches: Energy + Mood + 7-day trends + Astral data
    ↓
Calls: ashService.generateSankalpByContext(context)
    ↓
Returns: { sankalpa: text, confidence: 0-1 }
    ↓
Component renders Sankalpa with confidence
    ↓
User sees personalized intention
```

---

### **2. ENERGY STATS CARD**

**O que é:** Rastreamento e análise de energia.

**Component:** `EnergyStatsCard.jsx`

```javascript
// /components/DashboardCards/EnergyStatsCard.jsx
const EnergyStatsCard = ({ energyData, trend }) => {
  return (
    <div className="card-textured">
      <div className="header">
        <h3>⚡ Energy Level</h3>
      </div>
      
      <div className="energy-value">
        <div className="big-number">{energyData.today}/10</div>
        <div className="trend-indicator">
          {trend.direction === 'up' ? '↑' : '↓'} {trend.magnitude} point
        </div>
      </div>
      
      <div className="chart-container">
        <LineChart data={trend.last7Days} />
      </div>
      
      <div className="quick-action">
        <button onClick={handleQuickCheckIn}>
          ⚡ Update Energy Check-in
        </button>
      </div>
      
      <div className="insights">
        <p>💡 You're usually at 7 points at this time.</p>
      </div>
    </div>
  );
};
```

**Data Structure:**
```javascript
{
  today: 7,
  average_this_week: 6.5,
  average_last_week: 6.0,
  trend: {
    direction: 'up',
    magnitude: 1.5,
    last7Days: [5, 6, 6, 7, 6, 7, 7],
    lastWeekComparison: '+0.5'
  },
  insights: [
    'You have more energy in the afternoon',
    'High energy days correlate with completed projects'
  ]
}
```

---

### **3. MOOD STATS CARD**

**O que é:** Distribuição de moods e padrões emocionais.

**Component:** `MoodStatsCard.jsx`

```javascript
// /components/DashboardCards/MoodStatsCard.jsx
const MoodStatsCard = ({ moodData }) => {
  const moodColors = {
    'happy': '#FFD700',
    'calm': '#87CEEB',
    'anxious': '#FF6B6B',
    'energized': '#FF69B4',
    'neutral': '#A9A9A9'
  };
  
  return (
    <div className="card-glass-pure">
      <div className="header">
        <h3>😊 Mood Distribution</h3>
      </div>
      
      <div className="pie-chart">
        <PieChart 
          data={moodData.thisWeek}
          colors={moodColors}
        />
      </div>
      
      <div className="mood-list">
        {moodData.thisWeek.map(mood => (
          <div key={mood.name} className="mood-item">
            <span className="dot" style={{ background: moodColors[mood.name] }}></span>
            <span className="name">{mood.name}</span>
            <span className="count">{mood.percentage}%</span>
          </div>
        ))}
      </div>
      
      <div className="correlations">
        <h4>🔗 Correlations</h4>
        <p>You're usually anxious when you have deadline tasks.</p>
      </div>
    </div>
  );
};
```

**Insights Generated:**
- Mood distribution (last 7 days, 30 days)
- Dominant mood
- Mood triggers (correlated with tasks/events)
- Mood-energy correlations

---

### **4. ASTROLOGICAL CARD** (Multiple Variants)

**O que é:** Insights astrológicos personalizados.

**Component:** `AstrologyCard.jsx` (with variants)

```javascript
// /components/DashboardCards/AstrologyCard.jsx

// Variant 1: Daily Transits
const DailyTransitsCard = ({ astrologyData }) => (
  <div className="card-elevated">
    <h3>🌙 Today's Cosmic Weather</h3>
    <div className="transits">
      {astrologyData.todayTransits.map(transit => (
        <div key={transit.id} className="transit-item">
          <span className="planet">{transit.planet}</span>
          <span className="aspect">{transit.aspect}</span>
          <p className="interpretation">{transit.interpretation}</p>
        </div>
      ))}
    </div>
  </div>
);

// Variant 2: Natal vs Transit Comparison
const NatalComparisonCard = ({ natalData, transitData }) => (
  <div className="card-elevated">
    <h3>🌟 Natal Chart Alignment</h3>
    <div className="comparison">
      <div className="natal">
        <h4>Your Birth Chart</h4>
        <p>Sun in {natalData.sunSign}</p>
        <p>Moon in {natalData.moonSign}</p>
        <p>Rising in {natalData.risingSign}</p>
      </div>
      <div className="transits">
        <h4>Today's Transits</h4>
        <p>{transitData.interpretation}</p>
      </div>
    </div>
  </div>
);

// Variant 3: Week Overview
const WeekAstroCard = ({ weekData }) => (
  <div className="card-glass-pure">
    <h3>📅 Week Ahead Astrologically</h3>
    <div className="week-timeline">
      {weekData.days.map(day => (
        <div key={day.date} className="day-item">
          <span className="date">{day.date}</span>
          <span className="energy">{day.energyRating}★</span>
          <p className="brief">{day.briefForecast}</p>
        </div>
      ))}
    </div>
  </div>
);
```

---

### **5. FLUX CARD** (Task Overview)

**O que é:** Visão rápida de tarefas com inteligência.

**Component:** `FluxCard.jsx`

```javascript
// /components/DashboardCards/FluxCard.jsx
const FluxCard = ({ tasks, energyLevel }) => {
  const dueTodayCount = tasks.filter(t => t.dueDate === today).length;
  const dueThisWeekCount = tasks.filter(t => isThisWeek(t.dueDate)).length;
  
  // Smart sorting by energy match
  const recommendedTasks = tasks
    .filter(t => t.energyRequired <= energyLevel)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);
  
  return (
    <div className="card-textured">
      <div className="header">
        <h3>🔥 Task Flux</h3>
      </div>
      
      <div className="quick-stats">
        <div className="stat">
          <span className="number">{dueTodayCount}</span>
          <span className="label">Due Today</span>
        </div>
        <div className="stat">
          <span className="number">{dueThisWeekCount}</span>
          <span className="label">Due This Week</span>
        </div>
      </div>
      
      <div className="recommended">
        <h4>💡 Recommended for you now</h4>
        {recommendedTasks.map(task => (
          <div key={task.id} className="task-item">
            <input type="checkbox" onChange={() => handleComplete(task.id)} />
            <span className="title">{task.title}</span>
            <span className="energy">⚡ {task.energyRequired}</span>
            <span className="time">⏱️ {task.estimatedTime}min</span>
          </div>
        ))}
      </div>
      
      <div className="action">
        <button onClick={handleQuickAdd}>+ Quick Add Task</button>
      </div>
    </div>
  );
};
```

---

### **6. UPCOMING EVENTS CARD**

**O que é:** Próximos eventos/deadlines importantes.

**Component:** `UpcomingEventsCard.jsx`

```javascript
const UpcomingEventsCard = ({ events }) => {
  return (
    <div className="card-glass-pure">
      <h3>📅 Coming Up</h3>
      <div className="events-list">
        {events.slice(0, 5).map(event => (
          <div key={event.id} className="event-item">
            <div className="date">
              <span className="day">{event.daysUntil}d</span>
              <span className="name">{event.date}</span>
            </div>
            <div className="content">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
            </div>
            {event.priority === 'high' && <span className="priority">🔴 High</span>}
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### **7. DIARY REFLECTION CARD** (Papyrus Integration)

**O que é:** Prompts para journaling e memória viva.

**Component:** `DiaryReflectionCard.jsx`

```javascript
const DiaryReflectionCard = ({ lastEntry, relatedEntries }) => {
  return (
    <div className="card-elevated">
      <h3>📔 Papyrus - Memory Viva</h3>
      
      {lastEntry && (
        <div className="last-entry">
          <p className="date">{formatDate(lastEntry.date)}</p>
          <p className="preview">"{lastEntry.preview}..."</p>
          <button onClick={() => openDiary(lastEntry.id)}>Read Full Entry</button>
        </div>
      )}
      
      <div className="prompt">
        <h4>Today's Reflection Prompt:</h4>
        <p className="prompt-text">{getDailyPrompt()}</p>
        <button onClick={handleStartWriting}>✍️ Write Now</button>
      </div>
      
      {relatedEntries.length > 0 && (
        <div className="related">
          <h4>📚 You mentioned this before:</h4>
          <ul>
            {relatedEntries.map(entry => (
              <li key={entry.id}>
                <a href="#" onClick={() => openDiary(entry.id)}>
                  {entry.title || entry.preview} ({entry.date})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

---

### **8. AI INSIGHTS CARD** (by Ash)

**O que é:** Insights inteligentes gerados pela IA.

**Component:** `AshInsightsCard.jsx`

```javascript
const AshInsightsCard = ({ insights }) => {
  return (
    <div className="card-glass-pure">
      <div className="header">
        <h3>🤖 Ash Insights</h3>
        <span className="refresh" onClick={handleRegenerateInsights}>🔄</span>
      </div>
      
      {insights.map(insight => (
        <div key={insight.id} className="insight-item">
          <div className="icon">{insight.icon}</div>
          <div className="content">
            <h4 className="title">{insight.title}</h4>
            <p className="text">{insight.text}</p>
            <div className="actions">
              <button onClick={() => handleLike(insight.id)}>👍 Helpful</button>
              <button onClick={() => handleDislike(insight.id)}>👎 Not helpful</button>
            </div>
          </div>
        </div>
      ))}
      
      <div className="ask-ash">
        <input 
          placeholder="Ask Ash anything..." 
          onKeyPress={handleAskAsh}
        />
      </div>
    </div>
  );
};
```

---

## 📊 VISUAL COMPOSITION SYSTEM

Dashboard cards usam um **sistema de composição visual** para harmonia:

```
Row 1 (Hero): Glass + Textured (alternating)
Row 2 (Stats): Textured + Glass + Elevated (accent)
Row 3 (Production): Glass + Textured
Row 4 (Holistic): Elevated + Glass (for prominence)
```

**CSS Classes Usadas:**
```css
.card-glass-pure    /* Backdrop blur + subtle border */
.card-textured      /* SVG noise + texture overlay */
.card-elevated      /* Strong elevation + dense blur */
.card-minimal       /* Clean minimal style */
```

---

## 🔄 DATA LOADING FLOW

```javascript
// DashboardView.jsx - Main orchestration
const DashboardView = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDashboard();
  }, []);
  
  const loadDashboard = async () => {
    try {
      setLoading(true);
      
      // Parallel requests
      const [
        energyData,
        moodData,
        taskData,
        astrologyData,
        sankalpData,
        eventsData,
        diaryData,
        insightsData
      ] = await Promise.all([
        apiClient.get('/api/energy/today'),
        apiClient.get('/api/mood/today'),
        apiClient.get('/api/tasks/upcoming'),
        apiClient.get('/api/astral/today'),
        apiClient.get('/api/ai/sankalpa-daily'),
        apiClient.get('/api/events/upcoming'),
        apiClient.get('/api/diary/last-entry'),
        apiClient.get('/api/ai/insights')
      ]);
      
      // Update store
      setDashboardData({
        energy: energyData,
        mood: moodData,
        tasks: taskData,
        astrology: astrologyData,
        sankalpa: sankalpData,
        events: eventsData,
        diary: diaryData,
        insights: insightsData
      });
      
    } catch (error) {
      logger.error('Failed to load dashboard', error);
      showNotification('Could not load dashboard');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <LoadingScreen />;
  
  return (
    <div className="dashboard">
      <Header />
      <SankalpCard {...data.sankalpa} />
      <Section2 {...data} />
      <Section3 {...data} />
      <Section4 {...data} />
    </div>
  );
};
```

---

## 🎯 PERSONALIZATION LOGIC

Dashboard se adapta baseado em:

1. **Energy Level**
   - Baixa: Mostra tarefas pequenas, mood support
   - Alta: Mostra projetos grandes, desafios

2. **Time of Day**
   - Manhã: Foco em planejamento
   - Tarde: Produção
   - Noite: Reflexão

3. **Mood State**
   - Ansioso: Calm prompts, breathing exercises
   - Energized: Big goals, challenges
   - Reflective: Journal prompts

4. **Recent Activity**
   - Productive streak: Keep momentum messages
   - Procrastinating: Motivation boost
   - Overwhelmed: Simplification suggestions

---

## 📱 MOBILE RESPONSIVE

Dashboard é fully responsive:

```css
/* Desktop: 4 columns */
@media (min-width: 1200px) {
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Tablet: 2 columns */
@media (min-width: 768px) {
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile: 1 column */
@media (max-width: 767px) {
  .dashboard-grid { grid-template-columns: 1fr; }
}
```

---

## 🔗 LEITURA RELACIONADA

- [🧠 03 - Arquitetura Mental](MANUAL_PRANA_03_ARQUITETURA_MENTAL.md) - Como dados são processados
- [✅ 08 - Sistema de Tarefas](MANUAL_PRANA_08_TAREFAS.md) - Task details
- [📔 09 - Diários & Papyrus](MANUAL_PRANA_09_DIARIOS.md) - Diary integration
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - AI insights

---

**Próximo capítulo:** [✅ 08 - Sistema de Tarefas](MANUAL_PRANA_08_TAREFAS.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
