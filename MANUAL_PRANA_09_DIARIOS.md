# 📔 MANUAL PRANA 09 - DIÁRIOS & PAPYRUS

**Versão:** 3.0.1 | **Capítulo:** 09 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo descreve **Papyrus**, o sistema de memória viva de Prana: como journaling funciona, como a IA extrai insights, e como o arquivo vivo evolui continuamente.

**Público:** Product Managers, Designers, Desenvolvedores  
**Tempo de leitura:** 35 minutos  
**Pré-requisitos:** [Capítulo 08 - Sistema de Tarefas](MANUAL_PRANA_08_TAREFAS.md)

---

## 🏛️ O QUE É PAPYRUS?

**Papyrus** é a **memória viva** de Prana: não apenas um diário tradicional, mas um **arquivo inteligente** que:

1. **Registra** reflexões, aprendizados, momentos
2. **Organiza** automaticamente por temas, moods, contextos
3. **Conecta** com tarefas completadas, eventos, dados de energia
4. **Analisa** padrões: triggers de mood, relacionamentos entre eventos
5. **Evolui** com o usuário: memória ativa que melhora com o tempo

```
┌─────────────────────────────────────────────────┐
│         PAPYRUS - MEMORY SYSTEM                 │
├─────────────────────────────────────────────────┤
│                                                 │
│  INPUT LAYER                                    │
│  ├─ Journal Entries (texto, sketches)           │
│  ├─ Voice Notes (áudio → transcrição)          │
│  ├─ Quick Thoughts (captura rápida)            │
│  └─ Reflections from Tasks (prompt após done)  │
│                                                 │
│  PROCESSING LAYER                               │
│  ├─ Text Analysis (sentimento, temas)          │
│  ├─ Connection Detection (links com history)   │
│  ├─ Pattern Recognition (triggers, cycles)     │
│  └─ AI Insights (by Ash)                       │
│                                                 │
│  STORAGE LAYER                                  │
│  ├─ Full text indexed (search)                 │
│  ├─ Embeddings (semantic search)               │
│  ├─ Tags & Categories (navigation)             │
│  └─ Archive (historical)                       │
│                                                 │
│  RETRIEVAL & USAGE LAYER                        │
│  ├─ Papyrus View (full journal)                │
│  ├─ Memory Cards (highlighted moments)         │
│  ├─ Insights Dashboard (patterns)              │
│  └─ Related Entries (same topic/mood)          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ✍️ TIPOS DE ENTRADAS

### 1. **Journal Entry** (Reflexão Escrita)

A entrada principal: reflexões estruturadas ou livres.

```javascript
{
  id: "diary_uuid",
  user_id: "user_uuid",
  
  // Conteúdo
  title: "Uma semana produtiva",
  content: "Lorem ipsum dolor sit amet... [longform text]",
  
  // Metadata
  date: "2025-01-18",
  timestamp: "2025-01-18T21:30:00",
  
  // Categorização
  category: "reflection", // reflection, gratitude, learning, challenge, celebration
  mood_tags: ["grateful", "accomplished", "peaceful"],
  
  // Relacionamentos
  related_task_ids: [1, 5, 12],      // Tarefas completadas
  related_project_ids: [2, 3],       // Projetos trabalhados
  related_event_ids: ["event_123"],  // Eventos que aconteceram
  
  // Tags customizadas
  user_tags: ["productivity", "milestone", "personal"],
  
  // System Analysis
  sentiment_score: 0.85,             // 0-1: Positivo/Negativo
  key_themes: ["success", "growth", "support"],
  
  // Privacy
  is_private: true,
  is_archived: false,
  
  // Papyrus Memory
  memory_score: 0.8,  // 0-1: Importância estimada
  last_referenced_at: "2025-01-20T10:00:00" // Último acesso
}
```

### 2. **Quick Thought** (Captura Rápida)

Pensamentos rápidos, micro-reflexões:

```javascript
{
  type: "quick_thought",
  content: "Notei que sou mais produtivo de manhã",
  timestamp: "2025-01-18T10:45:00",
  mood_tag: "focused",
  related_context: { energy: 8, task_active: "Design" }
}
```

### 3. **Voice Note** (Nota de Áudio)

Reflexão em voz, transcrita via AI:

```javascript
{
  type: "voice_note",
  audio_url: "s3://prana/voice_notes/...",
  duration_seconds: 120,
  transcribed_text: "[Auto-transcribed by Ash]",
  timestamp: "2025-01-18T18:00:00"
}
```

### 4. **Sketch/Visual Note**

Notas visuais, diagramas, desenhos:

```javascript
{
  type: "sketch",
  sketch_url: "s3://prana/sketches/...",
  title: "Mind map do projeto",
  timestamp: "2025-01-18T14:30:00",
  description: "Estruturei as ideias do novo projeto visualmente"
}
```

### 5. **Task Completion Reflection**

Auto-gerado quando usuário completa tarefa:

```javascript
{
  type: "task_reflection",
  task_id: "task_uuid",
  task_title: "Design nova interface",
  prompt: "How did you feel completing this task?",
  user_response: "Muito satisfeito com o resultado!",
  auto_metrics: {
    energy_before: 6,
    energy_after: 7,
    mood_change: "calm → energized",
    time_spent: 185 // minutes
  }
}
```

---

## 🎨 PAPYRUS VIEW (Full Journal)

```
┌─────────────────────────────────────────────────┐
│ Papyrus - Your Memory Archive                   │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Search] [Filter by date] [Filter by mood]      │
│ [Filter by tag] [Show analytics]                │
│                                                 │
│ ═════════════════════════════════════════════  │
│ JANEIRO 2025                                    │
│ ═════════════════════════════════════════════  │
│                                                 │
│ 📅 18 JAN - Sexta-feira                         │
│ ═══════════════════════════════════════════    │
│                                                 │
│ ✨ Uma semana produtiva (Gratitude)             │
│ 📝 Written entry • 21:30                        │
│ 😊 grateful, accomplished, peaceful             │
│ ────────────────────────────────────            │
│ Lorem ipsum dolor sit amet... [preview]         │
│ ────────────────────────────────────            │
│ 🔗 Related: Design dashboard, Deploy API...     │
│ 💭 Ash says: "Pattern detected: You're most     │
│    productive on Fridays after completing      │
│    visual projects"                            │
│                                                 │
│ 🎤 Quick thought (Focus)                        │
│ ├─ Audio • 10:45 • ⚡8/10 energy                │
│ └─ "Notei que sou mais produtivo de manhã"    │
│                                                 │
│ 🎨 Sketch: Mind map do projeto                  │
│ ├─ Visual • 14:30                               │
│ └─ [Image preview]                              │
│                                                 │
│ 📅 17 JAN - Quinta-feira                        │
│ ═══════════════════════════════════════════    │
│ [More entries...]                               │
│                                                 │
│ [Load more entries]                             │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Component:** `DiaryView.jsx`

```javascript
const DiaryView = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    mood: null,
    tag: null,
    searchTerm: ''
  });
  
  useEffect(() => {
    loadDiaryEntries();
  }, []);
  
  useEffect(() => {
    const filtered = applyFilters(entries, filters);
    setFilteredEntries(filtered);
  }, [filters, entries]);
  
  const loadDiaryEntries = async () => {
    const response = await apiClient.get('/api/diary/entries');
    setEntries(response.data);
  };
  
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };
  
  return (
    <div className="diary-view">
      <Header 
        title="Papyrus - Seu Arquivo Vivo"
        subtitle="Reflexões, aprendizados e memórias"
      />
      
      <SearchBar 
        value={filters.searchTerm}
        onChange={(term) => handleFilterChange({ searchTerm: term })}
        placeholder="Buscar em suas entradas..."
      />
      
      <FilterPanel 
        onFilterChange={handleFilterChange}
        availableTags={getAllTags(entries)}
        availableMoods={getAllMoods(entries)}
      />
      
      <EntriesTimeline 
        entries={filteredEntries}
        onEntryClick={handleEntryClick}
        onEntryDelete={handleEntryDelete}
      />
    </div>
  );
};
```

---

## 🤖 ANÁLISE INTELIGENTE (by Ash)

### Pattern Detection

Ash analisa padrões automaticamente:

```javascript
const analyzePatterns = async (entries) => {
  const insights = [];
  
  // 1. Mood Cycles
  const moodCycle = detectMoodCycle(entries);
  if (moodCycle) {
    insights.push({
      type: 'mood_cycle',
      text: `Você tende a ficar ${moodCycle.mood} todo ${moodCycle.day}`,
      confidence: moodCycle.confidence
    });
  }
  
  // 2. Trigger Detection
  const triggers = detectTriggers(entries);
  triggers.forEach(trigger => {
    insights.push({
      type: 'trigger',
      text: `${trigger.mood} correlacionado com ${trigger.event}`,
      confidence: trigger.confidence
    });
  });
  
  // 3. Growth Patterns
  const growth = detectGrowth(entries);
  if (growth) {
    insights.push({
      type: 'growth',
      text: `Você tem evoluído em ${growth.area}`,
      evidence: growth.examples
    });
  }
  
  return insights;
};
```

### Memory Scoring

Cada entrada recebe um score de importância:

```javascript
const calculateMemoryScore = (entry) => {
  let score = 0.5; // Base score
  
  // Fatores positivos
  if (entry.sentiment_score > 0.8) score += 0.2;      // Very positive
  if (entry.mood_tags.length > 2) score += 0.1;       // Rich emotional data
  if (entry.related_task_ids.length > 0) score += 0.15; // Action-linked
  if (entry.content.length > 500) score += 0.1;       // Detailed reflection
  
  // Temporal relevance
  const daysSince = getDaysSince(entry.date);
  if (daysSince < 7) score += 0.1;                    // Recent
  if (entry.last_referenced_at) score += 0.05;        // Recently used
  
  // Community relevance (if shared)
  if (entry.is_public && entry.upvotes > 0) score += 0.05;
  
  return Math.min(1, score); // Cap at 1.0
};
```

---

## 🔍 BUSCA & RECUPERAÇÃO

### Full-Text Search

```javascript
const searchDiary = async (query) => {
  const results = await apiClient.get('/api/diary/search', {
    params: { q: query }
  });
  
  return results.data.map(result => ({
    ...result,
    excerpt: highlightQuery(result.content, query),
    relevanceScore: result._score
  }));
};
```

### Semantic Search (Vector-based)

```javascript
// Usando embeddings
const semanticSearch = async (query) => {
  // 1. Embed the query
  const queryEmbedding = await ashService.embedText(query);
  
  // 2. Find similar entries
  const similar = await apiClient.post('/api/diary/semantic-search', {
    embedding: queryEmbedding
  });
  
  // 3. Return ranked by similarity
  return similar.data.sort((a, b) => b.similarity - a.similarity);
};

// Example: "How was I feeling last time I had a deadline?"
// → Searches semantically for entries with deadline context + mood info
```

---

## 🔗 INTEGRAÇÃO COM SISTEMA

### Quando Tarefa é Completada

```javascript
const handleTaskComplete = async (task) => {
  // 1. Mark task as done
  await apiClient.put(`/api/tasks/${task.id}`, { status: 'done' });
  
  // 2. Trigger reflection prompt
  const prompt = generateReflectionPrompt(task);
  showModal({
    title: 'Reflexão Rápida',
    content: prompt,
    action: 'Escrever reflexão',
    onConfirm: async (reflection) => {
      // 3. Create diary entry auto-linked
      const entry = await apiClient.post('/api/diary/entries', {
        title: `Completei: ${task.title}`,
        content: reflection,
        type: 'task_reflection',
        related_task_ids: [task.id],
        auto_metrics: {
          energy_before: lastEnergyLevel,
          energy_after: currentEnergyLevel,
          time_spent: calculateTimeSpent(task)
        }
      });
      
      // 4. Show celebration
      showNotification(`Parabéns! Entrada adicionada ao Papyrus 📔`);
    }
  });
};
```

### Insights no Dashboard

```javascript
const PapyrusWidgetOnDashboard = () => {
  const [lastEntry, setLastEntry] = useState(null);
  const [relatedEntries, setRelatedEntries] = useState([]);
  
  useEffect(() => {
    loadPapyrusData();
  }, []);
  
  const loadPapyrusData = async () => {
    const data = await apiClient.get('/api/diary/dashboard-widget');
    setLastEntry(data.lastEntry);
    setRelatedEntries(data.relatedEntries);
  };
  
  return (
    <div className="papyrus-widget card-elevated">
      <h3>📔 Papyrus - Memory Viva</h3>
      
      {lastEntry && (
        <div className="last-entry">
          <p className="date">{formatDate(lastEntry.date)}</p>
          <p className="preview">"{lastEntry.preview}..."</p>
          <button onClick={openDiaryFullEntry}>Ler entrada completa</button>
        </div>
      )}
      
      <div className="today-prompt">
        <h4>Reflexão de Hoje:</h4>
        <p>{generateDailyPrompt()}</p>
        <button onClick={openDiaryEditor}>✍️ Escrever</button>
      </div>
      
      {relatedEntries.length > 0 && (
        <div className="related-memories">
          <h4>Você já refletiu sobre isso:</h4>
          <ul>
            {relatedEntries.map(entry => (
              <li key={entry.id}>
                <a href="#" onClick={() => openDiaryEntry(entry.id)}>
                  {entry.preview} ({formatDate(entry.date)})
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

## 📊 PAPYRUS ANALYTICS

View separada mostrando insights sobre a jornada do usuário:

```
┌─────────────────────────────────────────────────┐
│ Papyrus Analytics - Your Growth                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ 📈 Sentiment Trend (Last 30 days)               │
│ [Graph showing sentiment over time]             │
│ Average: 0.72 (Positive) ↗ +0.05 from last week
│                                                 │
│ 😊 Mood Distribution                            │
│ Happy: 35% | Calm: 28% | Anxious: 18% | ...    │
│                                                 │
│ 🔥 Most Mentioned Topics                        │
│ • productivity (12x)                            │
│ • relationships (8x)                            │
│ • health (6x)                                   │
│                                                 │
│ 🎯 Key Achievements This Month                  │
│ • Completed 8 major projects                    │
│ • Maintained 7-day productivity streak          │
│ • Significant growth in creative output        │
│                                                 │
│ ⚡ Energy vs Mood Correlation                   │
│ When energy > 7: 78% chance of positive mood   │
│ When energy < 4: 65% chance of anxious mood    │
│                                                 │
│ 📅 Writing Consistency                          │
│ [Heatmap: days with entries]                    │
│ 14 entries this month (↑ from 8 last month)    │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔐 PRIVACIDADE & SEGURANÇA

### Encryption

```javascript
// Todos os diary entries são encriptados em repouso
const saveDiaryEntry = async (entry) => {
  // 1. Serialize
  const plaintext = JSON.stringify(entry);
  
  // 2. Encrypt com user's private key (client-side)
  const encrypted = await cryptoService.encrypt(
    plaintext,
    userPrivateKey
  );
  
  // 3. Send encrypted to server
  await apiClient.post('/api/diary/entries', {
    encrypted_content: encrypted,
    encryption_algorithm: 'AES-256-GCM'
  });
};

// Quando recuperar:
const loadDiaryEntry = async (entryId) => {
  const response = await apiClient.get(`/api/diary/entries/${entryId}`);
  
  // Decrypt client-side
  const decrypted = await cryptoService.decrypt(
    response.data.encrypted_content,
    userPrivateKey
  );
  
  return JSON.parse(decrypted);
};
```

### Access Control

```javascript
// Usuário pode marcar entries como private (default)
// Jamais sincroniza para cloud sem permissão explícita
```

---

## 🚀 EVOLUÇÃO FUTURA

### AI-Powered Journaling Coach

```javascript
// Ash pode sugerir prompts baseado em padrões
const suggestJournalPrompt = async (userData) => {
  const patterns = await analyzeUserPatterns(userData);
  
  if (patterns.avoiding_topic === 'health') {
    return "Você não tem falado sobre saúde últimamente. Como você está se sentindo?";
  } else if (patterns.repeating_anxiety_trigger) {
    return "Você mencionou ${trigger} várias vezes. Quer explorar mais sobre isso?";
  }
  
  // Default
  return generateRandomPrompt();
};
```

### Collaborative Journaling

```javascript
// Futura feature: shared reflections com permissão
// Usuários podem compartilhar entries com grupo privado
```

### Memory Export

```javascript
// Papyrus pode ser exportado em diferentes formatos
// - PDF yearbook
// - Email digest
// - Print-on-demand book
```

---

## 🔗 LEITURA RELACIONADA

- [📊 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - Dashboard com widget Papyrus
- [✅ 08 - Sistema de Tarefas](MANUAL_PRANA_08_TAREFAS.md) - Tarefas vinculadas a reflexões
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Análise inteligente de entries

---

**Próximo capítulo:** [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
