# 📊 Dashboard Cards - Análise de Origem dos Dados

## 🎯 Visão Geral

Documento que mapeia **de onde vem a informação de cada card** no Dashboard.

---

## 📋 Tabela de Cards

| Card | Status | Origem | Endpoint | Real? | 
|------|--------|--------|----------|-------|
| **Céu Agora** | ✅ Real | Astrology Service | `/api/astral/today` | ✅ Sim |
| **Intenção do Dia (Sankalpa)** | ⚠️ Híbrido | `astral.advice` (Astrologia) | `/api/astral/today` | ❌ De Astrologia, não de Sankalpa real |
| **Energia Física** | ✅ Real | Diários do Usuário | `data.holisticData.energy` | ✅ Sim |
| **Distribuição de Humor** | ✅ Real | Diários do Usuário | `data.holisticData.diaries` | ✅ Sim |
| **Próximos Eventos** | ✅ Real | Calendário | `/api/calendar/events` | ✅ Sim |
| **Rotinas Ativas** | ✅ Real | Banco de Dados | `ActiveRoutinesCard` (interno) | ✅ Sim |
| **Stats de Ritualização** | ✅ Real | Banco de Dados | `RitualizationStatsCard` (interno) | ✅ Sim |
| **Recomendações Ash** | ✅ Real | IA + Analytics | `/api/ai/holistic-analysis/suggestions` | ✅ Sim |
| **Astrologia (Card Completo)** | ✅ Real | Astrology Service | `/api/astral/today` → `useAstralProfile` | ✅ Sim |
| **Nuvem de Tags** | ✅ Real | Diários | `data.holisticData.diaries` | ✅ Sim |
| **Ciclo Menstrual (Ash)** | ✅ Real | Analytics | `data.holisticData.menstrualCycle` | ✅ Sim |

---

## 🔍 Detalhamento por Card

### 1. **Céu Agora (CeuAgora Component)**

**Localização:** [src/components/dashboard/CeuAgora.jsx](src/components/dashboard/CeuAgora.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
DashboardView 
  → fetch('/api/astral/today') 
    → astrologyService.getFullAstrologicalChart()
      → ephemeris (posições planetárias reais)
      → astrology calculations
```

**Dados Retornados:**
- Posição do Sol
- Posição da Lua  
- Signos e Casas
- Aspetos principais

**Props recebidas:**
```jsx
<CeuAgora astralData={data.astral} />
// astralData contém:
{
  sun: { sign: 'Sagitário', degree: 15.2, ... },
  moon: { sign: 'Leão', degree: 22.5, ... },
  // ... mais dados
}
```

---

### 2. **Intenção do Dia (Sankalpa Card)**

**Localização:** [src/views/DashboardView.jsx](src/views/DashboardView.jsx#L276-L292)

**Status:** ⚠️ **PROBLEMA: Não é Sankalpa Real!**

**O que mostra atualmente:**
```jsx
<p className="text-2xl md:text-3xl font-serif italic text-foreground/90">
  "{data.astral.advice}"
</p>
```

**Origem Real:**
```
data.astral.advice
  ← Gerado por astrologyService.generateAstrologicalReading()
    ← Não tem nada a ver com Sankalpa (intenção do usuário)
```

**O Problema:**
- ❌ Card chamado "Intenção do Dia" mostra conselho astrológico
- ❌ Não vem do banco de dados de Sankalpas
- ❌ Sankalpa deveria ser uma **intenção criada pelo usuário**
- ❌ SankalpaView existe mas não carrega dados reais

**O que deveria ser:**
```javascript
// ✅ Correto - Buscar Sankalpa real do usuário
Sankalpa.filter({ user_id: userId, active: true })
  .then(sankalpas => {
    // Escolher um Sankalpa do dia
    const todaysSankalpa = sankalpas[dayOfWeek % sankalpas.length];
    return todaysSankalpa.statement; // "Viver com Presença"
  })
```

**Referência:** Análise completa em [SANKALPA_ANALYSIS.md](SANKALPA_ANALYSIS.md)

---

### 3. **Energia Física (EnergyStatsCard)**

**Localização:** [src/components/dashboard/holistic/EnergyStatsCard.jsx](src/components/dashboard/holistic/EnergyStatsCard.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
DashboardView
  → getTodayEnergy() [useEnergy hook]
    → Busca todos os diários do dia
      → Extrai energia média = (5 + 4 + 3) / 3 = 4
      → Calcula tendência
```

**Dados Recebidos:**
```jsx
<EnergyStatsCard stats={data.holisticData?.energy || {}} />
// stats contém:
{
  physical: 4.2,           // Média de energia (0-5)
  trend: 0.3,              // Diferença vs semana anterior
  lastWeekData: [3,2,4,3,5,4,3]  // Últimos 7 dias
}
```

**Fonte:** Tabela `diaries` (coluna `energy_level`)

---

### 4. **Distribuição de Humor (MoodStatsCard)**

**Localização:** [src/components/dashboard/holistic/MoodStatsCard.jsx](src/components/dashboard/holistic/MoodStatsCard.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
DashboardView
  → getTodayDiary() [useEnergy hook]
    → Busca diários do usuário
      → Agrupa por estado emocional
        → Conta ocorrências
```

**Estados Capturados:**
- Calmo (calm)
- Focado (focus)
- Criativo (creativity)
- Grato (gratitude)
- Ansioso (anxiety)

**Dados Recebidos:**
```jsx
<MoodStatsCard stats={data.holisticData?.diaries || {}} />
// stats contém:
{
  moodDistribution: {
    calm: 12,
    focus: 15,
    creativity: 8,
    gratitude: 20,
    anxiety: 3
  }
}
```

**Fonte:** Tabela `diaries` (coluna `mood`)

---

### 5. **Próximos Eventos (UpcomingEventsCard)**

**Localização:** [src/components/dashboard/UpcomingEventsCard.jsx](src/components/dashboard/UpcomingEventsCard.jsx)

**Status:** ✅ **Completamente Real**

**Endpoint:** `GET /api/calendar/events?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`

**Origem dos Dados:**
```
UpcomingEventsCard
  → fetch('/api/calendar/events')
    → calendarRoutes.js GET handler
      → Query: WHERE date BETWEEN startDate AND endDate
        → Tabela: calendar_events
```

**Dados Retornados:**
```javascript
{
  events: [
    {
      id: "1",
      title: "Meditação",
      date: "2025-12-22",
      startTime: "06:00",
      endTime: "06:30"
    },
    // ... mais eventos
  ]
}
```

**Fonte:** Tabela `calendar_events` (relacionada ao usuário)

---

### 6. **Rotinas Ativas (ActiveRoutinesCard)**

**Localização:** [src/components/dashboard/ActiveRoutinesCard.jsx](src/components/dashboard/ActiveRoutinesCard.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
ActiveRoutinesCard component
  → Internal load (não vem de props do Dashboard)
    → useEnergy.getRituals()
      → Busca rotinas ativas do usuário
        → Tabela: rituals (WHERE active = true)
```

**Dados Carregados:**
- Rotinas marcadas como `active: true`
- Frequência (diária, semanal, etc)
- Horários

**Independência:** Este card carrega seus próprios dados, não depende de `data` do Dashboard

---

### 7. **Stats de Ritualização (RitualizationStatsCard)**

**Localização:** [src/components/dashboard/RitualizationStatsCard.jsx](src/components/dashboard/RitualizationStatsCard.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
RitualizationStatsCard component
  → Carrega internamente
    → getRituals() [useEnergy]
      → Analisa rotinas completadas vs planejadas
        → Calcula taxa de conclusão
```

**Métricas Mostradas:**
- % de rotinas completadas
- Número de rotinas planejadas
- Continuidade (streak)

---

### 8. **Recomendações Ash (AshSuggestionsCard)**

**Localização:** [src/components/dashboard/holistic/AshSuggestionsCard.jsx](src/components/dashboard/holistic/AshSuggestionsCard.jsx)

**Status:** ✅ **Completamente Real (IA)**

**Endpoint:** `POST /api/ai/holistic-analysis/suggestions`

**Origem dos Dados:**
```
AshSuggestionsCard
  → apiClient.post('/ai/holistic-analysis/suggestions', { userId })
    → aiController.getHolisticSuggestions()
      → Análise de:
        1. Energia histórica do usuário
        2. Estados emocionais (moods)
        3. Padrões de tags
        4. Ciclo menstrual (se disponível)
      → IA gera 3-5 sugestões personalizadas
```

**Processo de Geração:**
1. Coleta dados de diários (últimos 7 dias)
2. Analisa padrões
3. Usa IA (OpenAI/IA local) para gerar sugestões
4. Retorna com `title` + `description`

**Exemplo de Resposta:**
```javascript
{
  data: {
    suggestions: [
      {
        title: "Meditação de 10 minutos",
        description: "Seu nível de energia está baixo. Uma meditação rápida pode recarregar."
      },
      {
        title: "Beba água",
        description: "Você registrou 'desidratado' nos últimos diários."
      }
    ]
  }
}
```

---

### 9. **Astrologia Card Completo**

**Localização:** [src/components/dashboard/holistic/AstrologyCard.jsx](src/components/dashboard/holistic/AstrologyCard.jsx)

**Status:** ✅ **Completamente Real (com Personalization)**

**Fluxo de Dados:**
```
AstrologyCard
  → useAstralProfile() hook
    1️⃣ Busca perfil do usuário:
       GET /api/astral-profiles?userId={id}
         → Tabela: astral_profiles (mapa natal do usuário)
    
    2️⃣ Busca análise de hoje:
       GET /api/astral/today
         → astrologyService.getFullAstrologicalChart()
         → Posições de hoje
    
    3️⃣ Compara natal vs hoje:
       → Se tem perfil: mostra leitura personalizada
       → Se não: mostra leitura genérica dos transits
```

**Dois Modos de Exibição:**

**A) PERSONALIZADO (Com Mapa Natal):**
```
✨ Seu Sol
├─ Posição Natal: Sagitário 15°
├─ Sol Hoje: Sagitário 20°
└─ Leitura: "Seu Sol está energizado com influência..."

✨ Sua Lua
├─ Posição Natal: Leão 22°
└─ Leitura personalizada...

✨ Seu Ascendente
├─ Posição: Gêmeos 8°
└─ Leitura personalizada...

📄 Transitos de Hoje
└─ "Saturno faz aspecto com seu Sol natal..."
```

**B) GENÉRICO (Sem Perfil):**
```
Leitura sobre os transitos de hoje e sua energia geral
```

**Documento Gerado:**
- Endpoint: `GET /api/astral-profiles/document?userId={id}`
- Tipo: `astral-reading` no Papyrus
- Salvo automaticamente quando perfil é criado
- Acessível via "Ver Relatório" button

---

### 10. **Nuvem de Tags (TagsCloudCard)**

**Localização:** [src/components/dashboard/holistic/TagsCloudCard.jsx](src/components/dashboard/holistic/TagsCloudCard.jsx)

**Status:** ✅ **Completamente Real**

**Origem dos Dados:**
```
TagsCloudCard
  → Recebe: stats={data.holisticData?.diaries || {}}
    → Extrai tags mais usadas dos diários
      → Tabela: diaries.tags (JSON array)
        → Agrupa por frequência
          → Renderiza proporcionalmente
```

**Processo:**
1. Coleta todas as tags de diários do usuário
2. Conta frequência de cada tag
3. Calcula tamanho da fonte proporcional
4. Renderiza nuvem visual

---

### 11. **Ciclo Menstrual (MenstrualCycleCard via Ash)**

**Localização:** [src/components/dashboard/holistic/MenstrualCycleCard.jsx](src/components/dashboard/holistic/MenstrualCycleCard.jsx)

**Status:** ✅ **Completamente Real** (se rastreado)

**Origem dos Dados:**
```
AshSuggestionsCard
  → Recebe prop: cycle={data.holisticData?.menstrualCycle}
    → Vem de: /api/ai/holistic-analysis
      → Tabela: user_profiles (menstrual_cycle_data)
        → Ou: Inferido de diários (tags como "menstruação")
```

**O que Mostra:**
- Fase atual do ciclo
- Dias até próximo período
- Energia esperada por fase
- Recomendações específicas

---

## 🔄 Fluxo Geral de Carregamento

```
DashboardView.loadDashboard()
│
├─ 1️⃣ Task.filter() 
│  └─ Dados: Tasks não deletadas
│
├─ 2️⃣ Project.filter()
│  └─ Dados: Projects não deletados
│
├─ 3️⃣ fetch('/api/ai/holistic-analysis')
│  ├─ Dados: holisticData (energia, mood, ciclo)
│  └─ Inclui: energy, diaries, menstrualCycle
│
├─ 4️⃣ getTodayEnergy()
│  └─ Dados: Nível de energia do dia
│
├─ 5️⃣ getRituals()
│  └─ Dados: Rotinas ativas
│
├─ 6️⃣ getTodayDiary()
│  └─ Dados: Diário de hoje (moods, tags, etc)
│
└─ ⚠️ SEM FETCH: data.astral.advice vem do astrology service
   (Adicionado manualmente na renderização)
```

---

## ⚠️ Problemas Identificados

### 1. **Sankalpa Card não é Real**
- **Problema:** Mostra `astral.advice` (conselho astrológico)
- **Deveria:** Mostrar `Sankalpa` real do usuário
- **Causa:** Sankalpa no frontend é apenas visual (canvas em branco)
- **Solução:** Implementar carregamento real de Sankalpas do BD

### 2. **Intenção do Dia vs Sankalpa**
- **Conflito:** Card chamado "Intenção do Dia" mas dados são de Astrologia
- **Melhor:** Renomear ou conectar a Sankalpa real

### 3. **Astrology Card foi recentemente melhorado**
- **Nova:** Personalization com mapa natal do usuário ✅
- **Nova:** Documento astrológico auto-gerado ✅
- **Nova:** Comparação natal vs transits ✅

---

## 📊 Tabela de Dependências

| Card | Depende de | Tipo de Dado | Real? | BD? |
|------|-----------|-----------|-------|-----|
| Céu Agora | astrologyService | Cálculo | ✅ | ❌ |
| Sankalpa | ⚠️ astral.advice | Texto | ❌ | ❌ |
| Energia | diários | Agregação | ✅ | ✅ |
| Humor | diários | Agregação | ✅ | ✅ |
| Eventos | calendar_events | BD | ✅ | ✅ |
| Rotinas | rituals | BD | ✅ | ✅ |
| Ritualização | rituals | Cálculo | ✅ | ✅ |
| Recomendações Ash | IA + diários | IA | ✅ | ✅ |
| Astrologia Full | astral_profiles + astro service | Híbrido | ✅ | ✅ |
| Tags | diários | Agregação | ✅ | ✅ |
| Ciclo Menstrual | user_profiles / diários | BD/Inferência | ✅ | ✅ |

---

## 🎯 Próximos Passos

1. **Sankalpa Real:** Implementar carregamento de Sankalpas do BD
2. **Integração Sankalpa-Tarefas:** Conectar tarefas a Sankalpas
3. **Rotina Semanal de Sankalpas:** Selecionar qual Sankalpa trabalhar cada dia
4. **Dashboard Personalizado:** Cards baseados em Sankalpas ativos

