# 🎯 Sistema Final: 10 Estados + Dual Energy + Captura Dupla (Dashboard + Diário)

## 📊 Os 10 Emotional States Finais

Adicionando **Ansioso** e **Estressado**:

```
VALÊNCIA | TIPO | DESCRIÇÃO | SENSAÇÃO
──────────────────────────────────────────────────────
Positiva | Alegre | Leveza, positividade | Sorrir sem motivo
Muito Alta | Confiante | Segurança, poder | "Consigo fazer"
         | Entusiasmado | Energia, motivação | "Quero começar!"
         | Esperançoso | Otimismo, antecipação | "Futuro é bom"
──────────────────────────────────────────────────────
Positiva | Grato | Apreciação, acolhimento | Coração quente
Moderada |
──────────────────────────────────────────────────────
Neutra | Calmo | Serenidade, presença | Respiração tranquila
──────────────────────────────────────────────────────
Negativa | Vulnerável | Exposição, fragilidade | "Posso quebrar"
Leve     |
──────────────────────────────────────────────────────
Negativa | Ansioso | Apreensão, inquietação | Inquietude mental
Moderada | Estressado | Tensão, pressão | Corpo tenso
──────────────────────────────────────────────────────
Negativa | Triste | Contração, repouso | Necessidade descansar
Muito Alta |
```

### Diferença: Ansioso vs Estressado

```
ANSIOSO:
├─ Causa: Incerteza, antecipação de algo ruim
├─ Sensação: Mente acelerada, preocupação
├─ Localização: Cabeça (mental)
└─ Solução: Clareza, planejamento, calma

ESTRESSADO:
├─ Causa: Sobrecarga atual, muita pressão
├─ Sensação: Corpo tenso, peso nos ombros
├─ Localização: Corpo inteiro (físico)
└─ Solução: Pausa, descanso, restaurador
```

### Matriz dos 10 Estados

```
┌─────────────────────────────────────────────────────────┐
│                   ENERGIA (Y)                           │
│                       ↑                                 │
│                  MUITO ALTA                             │
│        Entusiasmado ⚡    Estressado 🔥 (ruim!)        │
│                                                         │
│         ALTA                                            │
│  Alegre✨ Confiante💪 Esperançoso🌅 | Ansioso⚠️       │
│                                                         │
│        MODERADA                                         │
│  Grato🙏      Calmo🧘      | Vulnerável💙              │
│                                                         │
│         BAIXA                                           │
│           Triste 💙                                     │
│                                                         │
│        Negativa    Neutra     Positiva    Extrema      │
│        ←─────────── VALÊNCIA ───────────→              │
└─────────────────────────────────────────────────────────┘
```

---

## ⚡ Sistema de Dual Energy (até 2 por dia)

### Como Funciona

```
DIA = Primária + Secundária (Opcional)

Exemplo Prático:
┌─────────────────────────────────────────────────┐
│ SEGUNDA-FEIRA                                   │
├─────────────────────────────────────────────────┤
│ 09:00-13:00: PRIMARY = Criativo (4/5)           │
│              Estado: Entusiasmado                │
│                                                 │
│ 14:00-17:00: SECONDARY = Foco Profundo (5/5)   │
│              Estado: Confiante                  │
│                                                 │
│ 18:00+:      Restaurador (descanso espontâneo) │
│              Estado: Calmo                      │
└─────────────────────────────────────────────────┘

Ash Análise:
"Você teve dia perfeito! Padrão CRIAÇÃO PURA detectado.
 Criativo → Foco Profundo é seu melhor ritmo.
 Recomendação: Mantenha este ciclo 3x/semana."
```

### Implementação: Dual Energy Selector

```jsx
┌──────────────────────────────────────────┐
│  📊 Check-in de Energia (Dashboard)      │
├──────────────────────────────────────────┤
│                                          │
│  PRIMARY ENERGY (Obrigatório)            │
│  ┌────────────────────────────────────┐  │
│  │ ○ Foco Profundo                    │  │
│  │ ○ Criativo                         │  │
│  │ ○ Administrativo                   │  │
│  │ ○ Estratégico                      │  │
│  │ ○ Colaborativo                     │  │
│  │ ○ Social                           │  │
│  │ ○ Restaurador                      │  │
│  │ ○ Introspectivo                    │  │
│  │ ○ Físico                           │  │
│  └────────────────────────────────────┘  │
│                                          │
│  Intensidade: ★★★★☆ (4/5)               │
│                                          │
│  ┌─ Mudou durante o dia? [SIM]        │  │
│  │  ┌────────────────────────────────┐│  │
│  │  │ SECONDARY ENERGY               ││  │
│  │  │ Quando? [14:00]                ││  │
│  │  │ Tipo?   [Foco Profundo]        ││  │
│  │  │ Intensidade: ★★★★★ (5/5)      ││  │
│  │  └────────────────────────────────┘│  │
│  └─ Não                                │  │
│                                          │
│              [SALVAR]                   │
└──────────────────────────────────────────┘
```

---

## 📝 Captura de Estados Emocionais no DIÁRIO (Novo Flow)

### Problema Anterior
```
❌ Estado emocional era check-in rápido = superficial
❌ Perdia contexto do por quê
❌ Ash não conseguia conectar com rituais
```

### Solução: Estados Capturados no Diário

```jsx
┌──────────────────────────────────────────────┐
│  📔 Meu Diário de Hoje                       │
├──────────────────────────────────────────────┤
│                                              │
│  [Editor de Texto Rich]                      │
│  ┌──────────────────────────────────────────┐│
│  │ Hoje foi um dia intenso. Comecei          ││
│  │ criativo, com muitas ideias. Depois       ││
│  │ quando mudei para código, tive que        ││
│  │ forçar a concentração. Até consegui       ││
│  │ mas senti a tensão. À noite, meditei.     ││
│  │                                          ││
│  │ Reflito que preciso de mais pausa        ││
│  │ entre as mudanças de energia.             ││
│  └──────────────────────────────────────────┘│
│                                              │
│  Como você se sentia durante o dia?         │
│  (Múltipla escolha - até 3)                 │
│                                              │
│  ☑ Entusiasmado (manhã, durante brainstorm) │
│  ☑ Estressado (tarde, deadline pressionava) │
│  ☐ Ansioso                                  │
│  ☑ Confiante (ao final, saiu bem)           │
│  ☐ Alegre                                   │
│  ☐ Esperançoso                              │
│  ☐ Calmo                                    │
│  ☐ Grato                                    │
│  ☐ Vulnerável                               │
│  ☐ Triste                                   │
│                                              │
│  [SALVAR DIÁRIO]                            │
└──────────────────────────────────────────────┘
```

---

## 🤖 Proatividade do Ash

### Cenário 1: User Não Faz Check-in

```
Tarde (17:00)
└─ Ash percebe: Nenhum check-in de energia hoje
└─ Ash inicia conversa:

"Oi! 👋 Vi que você não registrou como está sua energia hoje.

 Tipo rápido (30s):
 ┌─────────────────────────────────────┐
 │ Como está sua energia agora?        │
 │ ○ Foco Profundo                     │
 │ ○ Criativo                          │
 │ ○ Administrativo                    │
 │ ○ Estratégico                       │
 │ ○ Colaborativo                      │
 │ ○ Social                            │
 │ ○ Restaurador                       │
 │ ○ Introspectivo                     │
 │ ○ Físico                            │
 │ ○ Não quero registrar agora        │
 └─────────────────────────────────────┘"
```

### Cenário 2: User Registrou Energias, Faltam Estados

```
Noite (20:00) - Diário vazio
└─ Ash vê: Energias registradas, mas sem contexto emocional
└─ Ash pergunta:

"Vi que você teve dia com Criativo + Foco Profundo! 🎉

 Como você se sentiu durante isso?
 (Múltipla escolha)
 
 ☐ Entusiasmado
 ☐ Confiante
 ☐ Estressado
 ☐ Ansioso
 ☐ Outro (escrever diário)"
```

### Cenário 3: Padrão Detectado

```
3ª vez na semana: Criativo (5/5) + depois Estressado
└─ Ash aviso/insight:

"⚠️ PADRÃO DETECTADO

 Você entrou Criativo + Entusiasmado (ótimo!)
 Mas depois ficou Estressado quando mudou para Foco.
 
 Isso aconteceu 3x esta semana.
 
 💡 Sugestão: Coloque um intervalo de 15min de Restaurador
    entre a criatividade e o deep work.
    
 Quer tentar amanhã?"
```

---

## 🌟 Rituais Emergem dos Padrões

### O Que é um "Ritual"?

```
RITUAL = Sequência Previsível e Saudável de
         (Energia Types + Emotional States)

NÃO é:
❌ "Meditação da manhã" (atividade específica)

SIM é:
✅ "Manhã Criativa Alegre"
   └─ Padrão: Físico (5min) → Criativo (1h) → Estado Alegre/Entusiasmado
   
✅ "Tarde de Foco Confiante"
   └─ Padrão: Foco Profundo (2h) + Estado Confiante/Calmo
   
✅ "Noite Introspectiva Grata"
   └─ Padrão: Introspectivo (30min) + Estado Grato/Calmo
```

### Como Rituais Emergem

```
PROCESSO AUTOMÁTICO:

1. User registra energias + estados durante 2-3 semanas

2. Ash analisa padrões:
   ├─ Segunda sempre: Criativo (9h) + Foco (14h) + Restaurador (18h)
   ├─ Estados: Entusiasmado → Confiante → Calmo
   ├─ Efetividade: 95% de tarefas completadas
   └─ Sentimento: "Dia perfeito" (feedback implícito)

3. Ash propõe:
   "Descobri seu Ritual de SEGUNDA PRODUTIVA!
    ├─ 09:00 Criativo (Entusiasmado)
    ├─ 14:00 Foco Profundo (Confiante)
    └─ 18:00 Restaurador (Calmo)
    
    Quer que eu sugira isto automaticamente
    toda segunda-feira?"

4. User confirma:
   ✅ "Sim, é meu padrão ideal"

5. Ritual ativado:
   └─ Aparece no Dashboard como sugestão
   └─ Ash envia lembretes "Hora de começar seu Ritual"
   └─ User pode aceitar/pular/customizar
```

### Exemplos de Rituais que Emergem

```
RITUAL 1: MANHÃ MOBILIZADORA
├─ Energia: Físico (6:00-6:30)
├─ Estado: Entusiasmado
├─ Transição para: Criativo
├─ Efetiva: Quando quer ideias frescas
└─ Frequência: 3-4x/semana

RITUAL 2: TARDE FOCADA
├─ Energia: Foco Profundo (14:00-17:00)
├─ Estado: Confiante + Calmo
├─ Sem transições (concentração pura)
├─ Efetiva: Quando tem deadline
└─ Frequência: 2-3x/semana

RITUAL 3: NOITE REFLEXIVA
├─ Energia: Introspectivo (20:00-21:00)
├─ Estado: Grato (final) + Vulnerável (processo)
├─ Editor Diário: Reflexão textual
├─ Efetiva: Integrar o dia
└─ Frequência: 5-6x/semana

RITUAL 4: SÁBADO COLABORATIVO
├─ Energia: Colaborativo (10:00-12:00) + Social (15:00-17:00)
├─ Estado: Alegre + Grato
├─ Tipo: Comunidade, amigos, equipe
├─ Efetiva: Conexão e restauração social
└─ Frequência: 1-2x/semana

RITUAL 5: DOMINGO RESTAURADOR (Completo)
├─ Energia: Restaurador (toda manhã) + Físico (tarde)
├─ Estado: Calmo + Esperançoso + Grato
├─ Sem cognição pesada
├─ Efetiva: Recuperação semanal
└─ Frequência: 1x/semana (obrigatório)
```

---

## 🔄 Flow Completo: Dashboard → Diário → Rituais

### Dia Típico (Segunda-feira)

```
06:00 - MORNING RITUAL (automático)
├─ Ash: "Hora de seu Ritual de SEGUNDA PRODUTIVA? ✅ Sim ○ Depois ○ Não"
├─ User clica "Sim"
└─ Dashboard mostra:
   ├─ 06:00-06:30: Físico (prepare body)
   ├─ 09:00-13:00: Criativo (the main event)
   └─ 14:00-17:00: Foco Profundo (execute ideas)

09:00 - CHECK-IN ENERGIA (Dashboard - rápido)
├─ User clica em "Criativo" (primary)
├─ Intensidade: ★★★★★ (5/5)
└─ Dashboard atualiza em tempo real

14:00 - TRANSIÇÃO (Ash smart detection)
├─ Ash: "Vi que você mudou de foco! ✅ Registrar como Secundária?"
├─ User aprova
└─ Agora Dashboard mostra: Criativo → Foco Profundo (dual)

20:00 - DIÁRIO (User reflexão)
├─ User abre editor
└─ Escreve:
   "Dia muito produtivo! Comecei criativo, as ideias fluíram bem.
    Consegui concentrar à tarde e codifiquei a feature.
    Me senti entusiasmado de manhã, depois confiante. 
    No final, quando restaurei, fiquei grato."

├─ Ash prompt: "Como você se sentiu?"
└─ User marca:
   ☑ Entusiasmado (manhã)
   ☑ Confiante (tarde)
   ☑ Grato (noite)

21:00 - ASH ANALYSIS
├─ Ash processa:
   ├─ Energias: Criativo (5/5) + Foco (5/5) + Restaurador (3/5)
   ├─ Estados: Entusiasmado → Confiante → Grato
   ├─ Padrão: Matches "SEGUNDA PRODUTIVA"
   ├─ Efetividade: Alta (tasks completed: 5/5)
   └─ Recomendação: "Repita amanhã? OU descanse?"

└─ Dashboard RITUAL UPDATE:
   "Seu Ritual de SEGUNDA PRODUTIVA foi perfeito hoje!
    ✅ Frequência: 3x esta semana
    💡 Sugiro manter este padrão.
    🎯 Score: 9.5/10"
```

---

## 📐 Schema do Banco (Novo)

```javascript
// src/db/schema/energy.js (ATUALIZADO)

export const energyCheckIns = pgTable('energy_checkins', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  
  // PRIMARY ENERGY
  energyType: text('energy_type').notNull(), // 9 tipos
  energyIntensity: integer('energy_intensity').notNull(), // 1-5
  
  // SECONDARY ENERGY (Novo - até 2)
  secondaryType: text('secondary_type').nullable(),
  secondaryTime: timestamp('secondary_time').nullable(),
  secondaryIntensity: integer('secondary_intensity').nullable(),
  
  // TIMESTAMPS
  recordedAt: timestamp('recorded_at').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const diaryEntries = pgTable('diary_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  
  // CONTEÚDO
  content: text('content').notNull(), // Editor rich text
  mood: text('mood'), // UI display
  
  // EMOTIONAL STATES (Novo - múltipla escolha)
  emotionalStates: jsonb('emotional_states'), // Array de 10 tipos
  // Ex: ['entusiasmado', 'confiante', 'grato']
  
  // CONEXÃO COM ENERGIA
  linkedEnergyCheckIn: text('linked_energy_checkin').nullable(),
  
  // TIMESTAMPS
  entryDate: timestamp('entry_date').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const rituals = pgTable('rituals', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  
  // PADRÃO DETECTADO
  name: text('name').notNull(), // "SEGUNDA PRODUTIVA"
  description: text('description'),
  
  // SEQUÊNCIA
  sequence: jsonb('sequence').notNull(), // Array de energies + states
  // Ex: [
  //   { type: 'fisico', duration: '30min', state: 'entusiasmado' },
  //   { type: 'criativo', duration: '2h', state: 'entusiasmado' },
  //   { type: 'foco_profundo', duration: '2h', state: 'confiante' }
  // ]
  
  // EFETIVIDADE
  efficiencyScore: integer('efficiency_score'), // 0-100
  tasksCompleted: integer('tasks_completed'),
  dayOfWeek: text('day_of_week'), // 'monday', 'tuesday'...
  frequency: text('frequency'), // 'weekly', '3x_per_week'
  
  // ATIVAÇÃO
  isActive: boolean('is_active').default(true),
  autoReminder: boolean('auto_reminder').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 10 EMOTIONAL STATES (Constante)
export const EMOTIONAL_STATES = [
  'alegre',
  'confiante',
  'entusiasmado',
  'esperançoso',
  'grato',
  'calmo',
  'vulneravel',
  'ansioso',
  'estressado',
  'triste'
];

// 9 ENERGY TYPES (Constante)
export const ENERGY_TYPES = [
  'foco_profundo',
  'criativo',
  'administrativo',
  'estrategico',
  'colaborativo',
  'social',
  'restaurador',
  'introspectivo',
  'fisico'
];
```

---

## 🎯 Resumo do Sistema Completo

### Captura em 2 Camadas

```
CAMADA 1: ENERGIA (Dashboard - Rápida)
├─ Quando: Check-in ao longo do dia (proativa ou Ash)
├─ O quê: Primary + Secondary energy type + intensidade
├─ Tempo: 30 segundos
├─ Propósito: Rastrear como deposita energia
└─ Obrigatório: SIM

CAMADA 2: ESTADOS (Diário - Reflexiva)
├─ Quando: Noite ao escrever diário
├─ O quê: Múltipla escolha de 10 emoções + contexto textual
├─ Tempo: 5-10 minutos (pensado)
├─ Propósito: Entender como se sente + por quê
└─ Obrigatório: NÃO (mas recomendado)
```

### Rituais Emergem Automaticamente

```
3-4 semanas de dados
        ↓
    Padrões detectados
        ↓
Ash propõe ritual
        ↓
User aprova/customiza
        ↓
Ritual ativo no Dashboard
        ↓
Lembretes automáticos
        ↓
Feedback de efetividade
```

### Os 10 Emotional States Finais

```
✅ Alegre ✨
✅ Confiante 💪
✅ Entusiasmado ⚡
✅ Esperançoso 🌅
✅ Grato 🙏
✅ Calmo 🧘
✅ Vulnerável 💙
✅ Ansioso ⚠️ (NOVO)
✅ Estressado 🔥 (NOVO)
✅ Triste 💙
```

---

## 🚀 Implementação: Phases

### Fase 1: Backend (3 dias)
- ✅ Schema: energyCheckIns + diaryEntries + rituals
- ✅ Migrations
- ✅ Seed data

### Fase 2: Energy Check-in (3 dias)
- ✅ Dashboard button → Modal dual energy selector
- ✅ API: POST /api/energy/check-in
- ✅ Ash proactive prompts

### Fase 3: Diary Integration (4 dias)
- ✅ Rich text editor
- ✅ Emotional states multiple choice
- ✅ Link to energy checkins

### Fase 4: Ritual Detection (4 dias)
- ✅ Pattern detection algorithm
- ✅ Ritual suggestion
- ✅ Dashboard ritual cards

### Fase 5: Polish (2 dias)
- ✅ Animations
- ✅ Mobile responsive
- ✅ Testing

**TOTAL: 16 dias**

---

## ❓ Próximas Perguntas

1. **Os 10 estados emocionais estão bons?** (Adicionou Ansioso + Estressado)

2. **O flow de captura dupla faz sentido?**
   - Energia: Dashboard (rápido)
   - Estados: Diário (reflexivo)

3. **Rituais emergentes: como você gostaria de vê-los?**
   - Cards no Dashboard sugerindo ativar?
   - Lembretes automáticos toda segunda?
   - Badge de "Ritual Perfeito" quando segue?

4. **Ash proatividade: quando deve perguntar?**
   - 17:00 se não registrou energia?
   - 20:00 se registrou mas diário vazio?
   - Ambas?

5. **Pronto para começar a implementação?**
   - Ou quer ajustes no conceito?

