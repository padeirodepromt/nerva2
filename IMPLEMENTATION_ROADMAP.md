# 🛠️ Prana System Architecture: Implementation Roadmap

## Resumo Executivo

Após análise profunda, **recomendo a OPÇÃO B**: Expandir o sistema para usar os **9 ENERGY_TAGS originais** + **8 MOODS** + **Ciclos Biológicos** + **Astrologia**.

**Por quê?**
- ✅ Tags já existem em `src/utils/energy.js`
- ✅ Muito mais preciso para recomendações
- ✅ Base sólida para machine learning
- ✅ Alinha com visão original do Prana
- ✅ Pequeno esforço incremental

---

## 📊 Estado Atual vs. Desejado

### **Modelo Atual (3 tipos de energia)**

```javascript
// Problema: Muito genérico
const ENERGY_TYPES = [
  'deep_work',    // Imersão Profunda
  'flow',         // Fluxo Contínuo (✗ não é um tipo de energia!)
  'fire'          // Alta Intensidade
];

// Falta:
// - Atividades administrativas
// - Atividades sociais
// - Atividades restauradoras
// - Atividades introspectivas
// - Atividades físicas
```

### **Modelo Desejado (9 tipos + 8 moods)**

```javascript
// ✅ 9 Tipos de Energia (ENERGY_TAGS)
const ENERGY_TAGS = [
  'foco_profundo',   // Indigo
  'criativo',        // Pink
  'admin',           // Slate
  'conexao',         // Emerald
  'restaurador',     // Teal
  'social',          // Blue
  'reflexivo',       // Purple
  'fisico',          // Amber
  'estrategico'      // Red
];

// ✅ 8 Estados Emocionais (MOODS)
const MOOD_STATES = [
  'calmo',      // 😌
  'alegre',     // 😊
  'focado',     // 🎯
  'criativo',   // ✨
  'ansioso',    // 😰
  'confuso',    // 😕
  'grato',      // 🙏
  'triste'      // 😢
];

// ✅ 4 Fases Menstruais (OPCIONAL)
const MENSTRUAL_PHASES = [
  'menstrual',  // Descanso
  'follicular', // Energia crescente
  'ovulatory',  // Pico de energia
  'luteal'      // Consolidação
];

// ✅ 8 Fases Lunares (ASTROLOGIA)
const MOON_PHASES = [
  'lua_nova', 'crescente', 'cheia', 'minguante', etc
];
```

---

## 🔧 Plano de Implementação: Fase por Fase

### **FASE 1: Backend Structure (1-2 dias)**

#### Task 1.1: Atualizar Schema de energyCheckIns

**Arquivo**: `src/db/schema/energy.js`

```javascript
// Antes:
export const energyCheckIns = pgTable('energy_checkins', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  energyLevel: integer('energy_level'),  // 1-10
  mood: text('mood'),                    // Um texto genérico
  notes: text('notes'),
  tags: jsonb('tags'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Depois:
export const energyCheckIns = pgTable('energy_checkins', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  
  // === ENERGIA ===
  energyLevel: integer('energy_level'),           // 1-5 escala geral
  energyType: text('energy_type'),                // ← NOVO: um dos 9 tipos
  
  // === EMOÇÃO ===
  mood: text('mood'),                            // Um dos 8 MOOD_STATES
  moodIntensity: integer('mood_intensity'),      // ← NOVO: 1-5 intensidade
  
  // === CONTEXTO BIOLÓGICO (OPCIONAL) ===
  menstrualPhase: text('menstrual_phase'),       // ← NOVO: follicular, etc
  
  // === COSMOS ===
  sunSign: text('sun_sign'),                     // ← NOVO: aquario, etc
  moonPhase: text('moon_phase'),                 // ← NOVO: cheia, nova, etc
  
  // === METADATA ===
  notes: text('notes'),
  tags: jsonb('tags'),                           // Tags livres do usuário
  createdAt: timestamp('created_at').defaultNow(),
});
```

**Migração Drizzle**:
```bash
# Gerar migration
npm run drizzle-kit generate

# Ver o SQL gerado
cat drizzle/xxxx_add_energy_fields.sql

# Aplicar
npm run drizzle-kit push
```

#### Task 1.2: Criar `src/utils/moods.js`

```javascript
// src/utils/moods.js
export const MOOD_STATES = [
  { id: 'calmo',      label: 'Calmo',      emoji: '😌', color: '#8B5CF6' },
  { id: 'alegre',     label: 'Alegre',     emoji: '😊', color: '#FBBF24' },
  { id: 'focado',     label: 'Focado',     emoji: '🎯', color: '#3B82F6' },
  { id: 'criativo',   label: 'Criativo',   emoji: '✨', color: '#EC4899' },
  { id: 'ansioso',    label: 'Ansioso',    emoji: '😰', color: '#EF4444' },
  { id: 'confuso',    label: 'Confuso',    emoji: '😕', color: '#64748B' },
  { id: 'grato',      label: 'Grato',      emoji: '🙏', color: '#10B981' },
  { id: 'triste',     label: 'Triste',     emoji: '😢', color: '#6366F1' },
];

export const MOOD_MAP = Object.fromEntries(
  MOOD_STATES.map(m => [m.id, m])
);
```

#### Task 1.3: Atualizar `src/utils/energy.js`

```javascript
// Apenas adicionar descrições detalhadas
export const ENERGY_TAGS = [
  { 
    id: 'foco_profundo',
    label: 'Foco Profundo',
    description: 'Imersão total, deep work, sem distrações',
    color: '#6366F1',
    icon: 'IconZap',
    idealFor: 'Programação, análise, escrita, design',
    duration: '4-6h'
  },
  // ... (similar para os 8 outros)
];
```

---

### **FASE 2: UI/API Updates (2-3 dias)**

#### Task 2.1: Criar novo Check-in Form Component

**Arquivo**: `src/components/energy/EnergyCheckInForm.jsx` (NOVO)

```jsx
import { useState } from 'react';
import { ENERGY_TAGS } from '@/utils/energy';
import { MOOD_STATES } from '@/utils/moods';

export default function EnergyCheckInForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    energyLevel: 3,
    energyType: 'foco_profundo',
    mood: 'calmo',
    moodIntensity: 3,
    notes: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Chamado API para registrar check-in
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Energy Level (1-5) */}
      <div>
        <label className="text-sm font-semibold">
          Como está sua energia geral? ({formData.energyLevel}/5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.energyLevel}
          onChange={(e) =>
            setFormData({ ...formData, energyLevel: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {/* 2. Energy Type (9 opciones) */}
      <div>
        <label className="text-sm font-semibold">Qual é seu tipo de energia?</label>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {ENERGY_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setFormData({ ...formData, energyType: tag.id })}
              className={`p-2 rounded-lg text-center transition ${
                formData.energyType === tag.id
                  ? 'bg-white/20 border-2 border-white/40'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="text-sm font-semibold">{tag.label}</div>
              <div className="text-[10px] opacity-50">{tag.duration}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Mood (8 opciones) */}
      <div>
        <label className="text-sm font-semibold">Como se sente emocionalmente?</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {MOOD_STATES.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => setFormData({ ...formData, mood: mood.id })}
              className={`p-2 rounded-lg text-center transition ${
                formData.mood === mood.id
                  ? 'bg-white/20 border-2 border-white/40'
                  : 'bg-white/5 border border-white/10'
              }`}
            >
              <div className="text-2xl">{mood.emoji}</div>
              <div className="text-[10px] font-semibold">{mood.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Mood Intensity (1-5) */}
      <div>
        <label className="text-sm font-semibold">
          Intensidade do mood ({formData.moodIntensity}/5)
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={formData.moodIntensity}
          onChange={(e) =>
            setFormData({ ...formData, moodIntensity: parseInt(e.target.value) })
          }
          className="w-full"
        />
      </div>

      {/* 5. Notes */}
      <div>
        <label className="text-sm font-semibold">Notas (opcional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="O que influenciou seu estado?"
          className="w-full p-2 rounded-lg bg-white/5 border border-white/10"
          rows="3"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
      >
        Registrar Check-in
      </button>
    </form>
  );
}
```

#### Task 2.2: API Endpoint para Registrar Check-in

**Arquivo**: `src/api/routes/energyRoutes.js` (ou update em `aiRoutes.js`)

```javascript
router.post('/energy/check-in', async (req, res) => {
  try {
    const { userId } = req.user;
    const {
      energyLevel,
      energyType,
      mood,
      moodIntensity,
      notes,
    } = req.body;

    // Auto-preencher cosmos
    const astro = new astrologyService.AstrologyService();
    const sunSign = astro.getSunSign();
    const moonPhase = astro.getMoonPhase();

    // Criar check-in
    const checkIn = await db.insert(schema.energyCheckIns).values({
      userId,
      energyLevel,
      energyType,
      mood,
      moodIntensity,
      sunSign,
      moonPhase,
      notes,
      createdAt: new Date(),
    });

    // Trigger: Ash analyze
    const ashInsight = await Ash.analyzeEnergyCheckIn(checkIn);

    res.json({
      success: true,
      checkIn,
      insight: ashInsight,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### **FASE 3: Dashboard Cards Refactor (2-3 dias)**

#### Task 3.1: Refatorar EnergyStatsCard

```jsx
// Mostrar DISTRIBUIÇÃO de ENERGY_TYPES
// Gráfico: % tempo em cada tipo
export default function EnergyTypeBreakdownCard({ stats = {} }) {
  const distribution = {
    foco_profundo: 35,
    criativo: 20,
    admin: 20,
    conexao: 10,
    restaurador: 5,
    social: 5,
    reflexivo: 3,
    fisico: 2,
    estrategico: 0,
  };

  return (
    <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
      <h3 className="text-sm font-bold uppercase">Distribuição de Energia</h3>
      {/* Pie chart ou bar chart */}
    </div>
  );
}
```

#### Task 3.2: Refatorar MoodStatsCard

```jsx
// Mostrar DISTRIBUIÇÃO de MOODS
export default function MoodStatsCard({ stats = {} }) {
  const distribution = {
    calmo: 25,
    alegre: 30,
    focado: 25,
    criativo: 10,
    ansioso: 5,
    confuso: 2,
    grato: 20,
    triste: 3,
  };

  return (
    <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
      <h3 className="text-sm font-bold uppercase">Estados Emocionais</h3>
      {/* Bar chart de emojis */}
    </div>
  );
}
```

#### Task 3.3: Novo Card - EnergyMoodCorrelationCard

```jsx
// Mostrar PADRÕES de correlação entre Energy + Mood
export default function EnergyMoodCorrelationCard({ stats = {} }) {
  const topCombos = [
    { energy: 'criativo', mood: 'criativo', frequency: 45, performance: '95%' },
    { energy: 'social', mood: 'alegre', frequency: 38, performance: '88%' },
    { energy: 'foco_profundo', mood: 'focado', frequency: 52, performance: '98%' },
  ];

  return (
    <div className="glass-effect p-8 rounded-3xl border border-white/5 bg-white/[0.02]">
      <h3 className="text-sm font-bold uppercase">Melhores Combinações</h3>
      {topCombos.map(combo => (
        <div key={combo.id} className="py-3 border-b border-white/5">
          <p className="text-sm">
            {combo.energy} + {combo.mood}
          </p>
          <p className="text-xs opacity-50">
            {combo.frequency}x | Performance: {combo.performance}
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

### **FASE 4: Ash Intelligence (3-5 dias)**

#### Task 4.1: Criar Padrões no Ash

**Arquivo**: `src/ai_services/ashPatterns.js` (NOVO)

```javascript
export const energyPatterns = {
  // Padrão 1: Correlação positiva
  highPerformanceStates: [
    { energy: 'foco_profundo', mood: 'focado', expectedProductivity: 0.95 },
    { energy: 'criativo', mood: 'criativo', expectedProductivity: 0.90 },
    { energy: 'estrategico', mood: 'focado', expectedProductivity: 0.85 },
  ],
  
  // Padrão 2: Estados de stress
  stressStates: [
    { energy: 'estrategico', mood: 'ansioso', alert: 'Decision fatigue' },
    { energy: 'social', mood: 'ansioso', alert: 'Over-commitment' },
  ],
  
  // Padrão 3: Necessidade de autocuidado
  restorativeNeeded: [
    { mood: 'triste', moodIntensity: 4, suggestion: 'Conexão social' },
    { energyLevel: 1, energyType: 'qualquer', suggestion: 'Repouso' },
  ],
};
```

#### Task 4.2: Implementar Recomendações em Ash

```javascript
export async function generateEnergyInsight(checkInData) {
  const { energyType, mood, moodIntensity, energyLevel } = checkInData;
  
  let insight = '';
  let recommendations = [];
  
  // Análise 1: Sinergia
  if (energyType === 'criativo' && mood === 'criativo') {
    insight = "Seu momentum criativo está máximo!";
    recommendations.push("Trabalhe em seu projeto mais desafiador agora");
  }
  
  // Análise 2: Desbalanceamento
  if (mood === 'ansioso' && energyType === 'estrategico') {
    insight = "Você está ansioso sobre decisões importantes.";
    recommendations.push("Use 10 min de respiração antes de decidir");
  }
  
  // Análise 3: Padrão temporal
  if (energyLevel <= 2) {
    insight = "Sua energia está baixa.";
    recommendations.push("Considere uma pausa restaurativa");
  }
  
  return { insight, recommendations };
}
```

---

### **FASE 5: Mobile & Polish (1-2 dias)**

#### Task 5.1: Responsividade do Check-in Form

Garantir que o formulário funcione bem em mobile.

#### Task 5.2: Animações

Adicionar transições suaves entre estados.

#### Task 5.3: Validação

Garantir dados válidos antes de enviar.

---

## 📅 Timeline Estimado

| Fase | Duração | Descrição |
|------|---------|-----------|
| **1: Backend** | 1-2 dias | Schema, migrations, utils |
| **2: UI/API** | 2-3 dias | Componentes, endpoints |
| **3: Dashboard** | 2-3 dias | Cards refatorados |
| **4: Ash** | 3-5 dias | Padrões, recomendações |
| **5: Polish** | 1-2 dias | Mobile, animações, validação |
| **Total** | ~10-15 dias | 2-3 semanas de desenvolvimento |

---

## 🎯 Benefícios Esperados

### **Curto Prazo (Imediato)**
- ✅ Melhor UX com form detalhado
- ✅ Dados mais ricos para análise
- ✅ Insights mais personalizados

### **Médio Prazo (2-4 semanas)**
- ✅ Detecção de padrões automática
- ✅ Recomendações por tipo de energia
- ✅ Agendamento inteligente de tarefas

### **Longo Prazo (1-3 meses)**
- ✅ Machine learning em arquétipos
- ✅ Previsão de produtividade
- ✅ Integração menstrual + astrologia
- ✅ Assistente de vida verdadeiro

---

## ⚠️ Riscos & Mitigações

| Risco | Impacto | Mitigação |
|-------|---------|-----------|
| Migração de dados quebra | Alto | Backup antes, rollback plan |
| Complexidade do form | Médio | A/B test, iteração rápida |
| Dados incompletos | Médio | Defaults sensatos, fallbacks |
| Performance queries | Médio | Índices, caching, agregação |

---

## ✅ Critério de Sucesso

- [ ] Todos os 9 energy types funcionando
- [ ] Todos os 8 moods sendo registrados
- [ ] Dashboard mostrando padrões corretos
- [ ] Ash gerando 3+ tipos de insights
- [ ] Sem performance degradation
- [ ] Mobile-responsive
- [ ] 95%+ check-in completion (usuários gostam)

---

## 📚 Dependências Externas

- Drizzle ORM (migrations) - ✅ Já temos
- Framer Motion (animações) - ✅ Já temos
- AstrologyService - ✅ Já temos
- OpenAI/Gemini (para Ash) - ✅ Já temos

**Nenhuma dependência nova necessária!**

---

## 🚀 Próximo Passo

Qual fase você quer começar?

1. **Começar pelo backend** (Task 1.1 - 1.3) - Mais rápido, menos visual
2. **Começar pela UI** (Task 2.1 - 2.2) - Mais visível, mais engajador
3. **Começar tudo em paralelo** - Mais rápido, mais risco

**Minha recomendação**: Começar pelo **Backend (Fase 1)** → depois **UI (Fase 2)** em paralelo → depois **Dashboard (Fase 3)**.

---

Pronto? Qual é o próximo passo? 🚀
