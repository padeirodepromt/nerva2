# 🌐 Prana Holistic System Architecture v3.0

## Executive Summary

Este documento define a **estrutura fundacional das variáveis do sistema Prana**, que embasarão:
1. **Tags do sistema** (categorização de energia)
2. **Análise holística do usuário** (padrões comportamentais)
3. **Recomendações da IA** (Ash insights personalizados)

---

## 🎯 Questão Central: Diferença entre "Estados Emocionais" vs "Tipos de Energia"

### **Estados Emocionais (MOODS) - O QUE VOCÊ SENTE**

**Propósito**: Capturar o **estado emocional instantâneo** em um momento específico.

**Características**:
- ✅ **Momentâneo**: Muda rapidamente (minutos a horas)
- ✅ **Reativo**: Responde a eventos, contexto, interações
- ✅ **Subjetivo**: Como você *se sente* agora
- ✅ **Indicador de bem-estar**: Saúde mental e emocional

**8 Estados Emocionais (Moods)**:

| Estado | Emoji | Significado | Correlação |
|--------|-------|------------|-----------|
| **Calmo** | 😌 | Paz, tranquilidade, equilíbrio | Meditação, introspecção |
| **Alegre** | 😊 | Alegria, otimismo, esperança | Celebração, social |
| **Focado** | 🎯 | Concentração, determinação, consistência | Trabalho importante, metas |
| **Criativo** | ✨ | Inspiração, ideação, fluxo | Brainstorm, criação |
| **Ansioso** | 😰 | Preocupação, tensão, stress | Deadlines, incerteza |
| **Confuso** | 😕 | Dúvida, desorientação, ambiguidade | Decisões, crossroads |
| **Grato** | 🙏 | Reconhecimento, apreciação, comunidade | Reflexão, plenitude |
| **Triste** | 😢 | Luto, introversão, processamento | Perda, isolamento |

**Uso no Prana**:
```
check-in de energia → usuário seleciona mood → armazenado em energyCheckIns.mood
→ agregado em MoodStatsCard (distribuição de 7 dias)
→ usado para insights do Ash: "você está frequentemente ansioso" vs "você está alegre"
```

---

### **Tipos de Energia (ENERGY TYPES) - COMO VOCÊ TRABALHA**

**Propósito**: Categorizar a **qualidade e tipo de energia disponível** para executar tarefas.

**Características**:
- ✅ **Mais estável**: Muda ao longo do dia/ciclo, não instantaneamente
- ✅ **Ativo**: Como você pode/quer contribuir neste momento
- ✅ **Contextual**: Depende do tipo de tarefa, ambiente, ritmo circadiano
- ✅ **Preditor de performance**: Qual trabalho você pode fazer bem

**Problema com a arquitetura atual**:

O Prana 3.0 tem **3 tipos de energia** (deep_work, flow, fire) que são derivados de produtividade, mas o Prana original tinha **9 ENERGY_TAGS** mais granulares:

#### **9 Tipos de Energia Original (ENERGY_TAGS) - O VERDADEIRO SISTEMA:**

```javascript
{
  foco_profundo    → Imersão total, deep work (Indigo)
  criativo         → Ideação, inovação, expressão (Pink)
  admin            → Tarefas rotineiras, operacional (Slate)
  conexao          → Relacionamentos, colaboração, networking (Emerald)
  restaurador      → Autocuidado, descanso, recuperação (Teal)
  social           → Comunidade, eventos, grupo (Blue)
  reflexivo        → Meditação, journaling, introspecção (Purple)
  fisico           → Movimento, exercício, corpo (Amber)
  estrategico      → Planejamento, análise, decisão (Red)
}
```

**Comparação: Original vs. Atual**:

| Original (9 Tags) | Atual (3 Tipos) | Problema |
|------------------|-----------------|----------|
| **foco_profundo** (Indigo) | deep_work | ✅ Equivalente |
| **criativo** (Pink) | flow | ❌ Criatividade não = fluxo |
| **admin** (Slate) | ❌ *Ausente* | Faltam tarefas administrativas |
| **conexao** (Emerald) | ❌ *Ausente* | Faltam atividades de relacionamento |
| **restaurador** (Teal) | ❌ *Ausente* | Faltam energias restaurativas |
| **social** (Blue) | flow | ❌ Social não = fluxo |
| **reflexivo** (Purple) | ❌ *Ausente* | Faltam atividades introspectivas |
| **fisico** (Amber) | ❌ *Ausente* | Faltam atividades físicas |
| **estrategico** (Red) | fire | ❌ Estratégia não = intensidade |

---

## 🏗️ Proposta: Arquitetura Holística Consolidada

### **Camada 1: Dimensões de Energia (ENERGY_TAGS) - 9 Tipos**

Estes são os **tipos de energia** que o usuário pode ter em um determinado momento.

```javascript
// src/utils/energy.js (ATUAL - CORRETO)
export const ENERGY_TAGS = [
  { id: 'foco_profundo',   label: 'Foco Profundo',   color: '#6366F1',  icon: 'IconZap' },
  { id: 'criativo',        label: 'Criativo',        color: '#EC4899',  icon: 'IconFlame' },
  { id: 'admin',           label: 'Administrativo',  color: '#64748B',  icon: 'IconList' },
  { id: 'conexao',         label: 'Conexão',         color: '#10B981',  icon: 'IconHeart' },
  { id: 'restaurador',     label: 'Restaurador',     color: '#34D399',  icon: 'IconRiver' },
  { id: 'social',          label: 'Social',          color: '#3B82F6',  icon: 'IconColetivo' },
  { id: 'reflexivo',       label: 'Reflexivo',       color: '#8B5CF6',  icon: 'IconSankalpa' },
  { id: 'fisico',          label: 'Físico',          color: '#F59E0B',  icon: 'IconMountain' },
  { id: 'estrategico',     label: 'Estratégico',     color: '#EF4444',  icon: 'IconMatrix' },
];
```

### **Camada 2: Estados Emocionais (MOODS) - 8 Emoções**

Estes são os **estados emocionais** que o usuário sente em um determinado momento.

```javascript
// src/utils/moods.js (NOVO)
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
```

### **Camada 3: Ciclos Biológicos - 4 Contextos**

Estes são os **ciclos naturais** que afetam energia e mood.

```javascript
// Menstrual Cycle (opcional)
menstrual | follicular | ovulatory | luteal

// Moon Phases (astrologia)
luna_nova | crescente | cheia | minguante | etc
```

### **Camada 4: Contexto Cósmico - Astrologia**

```javascript
// Sun Sign (identidade)
aries | taurus | gemini | ... | pisces

// Moon Phase (emoção cíclica)
8 phases

// Conselho Cósmico (recomendação do dia)
texto gerado pela IA astrológica
```

---

## 📊 Estrutura do Check-in de Energia (PROPOSTA)

O check-in deve capturar **todos** esses dados:

```javascript
// Check-in Structure
{
  id: "nrg_xxx",
  userId: "user_xxx",
  timestamp: timestamp,
  
  // === ENERGIA (O QUE VOCÊ CONSEGUE FAZER) ===
  energyLevel: 1-5,           // 1-5 escala de energia geral
  energyType: "foco_profundo", // Um dos 9 ENERGY_TAGS
  
  // === EMOÇÃO (O QUE VOCÊ SENTE) ===
  mood: "alegre",             // Um dos 8 MOOD_STATES
  moodIntensity: 1-5,         // Quão forte é a emoção (novo)
  
  // === CONTEXTO BIOLÓGICO (OPCIONAL) ===
  menstrualPhase: "ovulatory", // Se relevante
  
  // === NOTAS & TAGS ===
  notes: "Trabalhei bem, ainda assim ansioso",
  tags: ["sono-bom", "exercício", "café"],  // Tags livres
  
  // === CONTEXTO CÓSMICO (AUTO-PREENCHIDO) ===
  sunSign: "aquario",
  moonPhase: "cheia",
  
  // === TIMESTAMP ===
  createdAt: timestamp
}
```

---

## 🧠 Como Ash Usa Essas Variáveis para Insights

### **Padrão 1: Correlação Energy ↔ Productivity**

```
IF energyType = "foco_profundo" + energyLevel > 3 THEN
  → "Ótimo momento para tarefas complexas"
  
IF energyType = "criativo" + mood = "alegre" THEN
  → "Sua criatividade está em alta. Ideal para brainstorm"
  
IF energyType = "restaurador" THEN
  → "Sua energia pede descanso. Considere meditação"
```

### **Padrão 2: Detecção de Anomalias**

```
IF mood = "ansioso" FOR 3+ dias AND energyType = "estrategico" THEN
  → "Você está ansioso com decisões importantes. Respire."
  
IF energyType = "social" + energyLevel LOW THEN
  → "Você está se sentindo isolado? Que tal se conectar?"
```

### **Padrão 3: Recomendações Contextualizadas**

```
IF menstrualPhase = "menstrual" THEN
  → Sugerir rituais restauradores
  → Reduzir tarefas "estrategico" / "foco_profundo"
  → Aumentar "restaurador" / "reflexivo"
  
IF moonPhase = "cheia" + mood = "criativo" THEN
  → "A Lua Cheia amplifica sua criatividade. Canaliz-a!"
```

### **Padrão 4: Descoberta de Arquétipos**

```
IF frequência de energyType:
  - 40% foco_profundo
  - 25% criativo
  - 15% admin
  - 20% outros

THEN Arquétipo = "Produtor de Conteúdo com Foco Técnico"
```

---

## 📱 UI/UX: Como Apresentar Isso no Dashboard

### **1. Energy Check-in Form (Novo/Melhorado)**

```
┌─────────────────────────────────────────┐
│ ✋ Check-in Energético                  │
├─────────────────────────────────────────┤
│ Como está sua energia? (1-5)  [████░]   │
│ Qual é seu tipo de energia?             │
│  ☐ Foco Profundo  ☐ Criativo ☐ Admin  │
│  ☐ Conexão ☐ Restaurador ☐ Social    │
│  ☐ Reflexivo ☐ Físico ☐ Estratégico  │
├─────────────────────────────────────────┤
│ Como se sente emocionalmente?           │
│  ☐ Calmo ☐ Alegre ☐ Focado ☐ Criativo│
│  ☐ Ansioso ☐ Confuso ☐ Grato ☐ Triste│
├─────────────────────────────────────────┤
│ Notas (opcional)  [________________]   │
│ Tags (opcional)   [tag1] [tag2] [+]   │
├─────────────────────────────────────────┤
│        [ Registrar Check-in ]           │
└─────────────────────────────────────────┘
```

### **2. Dashboard Cards (Refatorados)**

#### **EnergyStatsCard (NOVO)**
- Gráfico de últimos 7 dias de **energyLevel**
- Distribuição de **energyType** (pizza chart)
- Trend de energia

#### **MoodStatsCard (NOVO)**
- Distribuição de 8 moods
- Padrão semanal
- Correlação com tarefas completadas

#### **EnergyTypeBreakdownCard (NOVO)**
- Quanto % do tempo em cada tipo de energia
- Alerta se muito "estrategico" (pode ser stress)
- Sugestão de rebalanceamento

#### **HolisticInsightsCard**
- Padrões detectados (Ash analysis)
- Recomendações personalizadas
- Correlações interessantes

### **3. Task Assignment (Melhorado)**

Quando criar uma tarefa:
```
Tarefa: "Refatorar API"
Tipo de Energia Recomendada: ☐ foco_profundo
Estimado: 4h
```

Ash então recomenda:
```
"Você melhor executa 'foco_profundo' às 9am-1pm.
Sua próxima janela será amanhã. Agendado!"
```

---

## 🔄 Fluxo Completo de Dados

```
1. CHECK-IN DIÁRIO
   ├─ User seleciona: energyLevel (1-5)
   ├─ User seleciona: energyType (1 de 9)
   ├─ User seleciona: mood (1 de 8)
   ├─ User escreve: notas + tags
   └─ Sistema auto-preenche: sunSign, moonPhase
   
2. ARMAZENAMENTO
   └─ energyCheckIns table com todos os campos
   
3. AGREGAÇÃO
   ├─ EnergyStatsCard: trend energyLevel
   ├─ MoodStatsCard: distribuição moods
   └─ EnergyTypeBreakdownCard: % tempo por tipo
   
4. ANÁLISE (ASH)
   ├─ Detectar padrões (3+ dias)
   ├─ Correlacionar com produtividade
   ├─ Gerar insights pessoalizados
   └─ Fazer recomendações
   
5. AÇÃO
   ├─ Sugerir tarefas por tipo de energia
   ├─ Agendar trabalho em horários ideais
   └─ Oferecer rituais de balanceamento
```

---

## 🎯 Decisão Arquitetural: Qual Sistema Usar?

### **OPÇÃO A: Manter 3 Tipos (Atual)**
**Prós**: Simples, atual no código
**Contras**: ❌ Perdem-se nuances (9 → 3), difícil categorizar admin/social

### **OPÇÃO B: Expandir para 9 Tipos (RECOMENDADO)** ✅
**Prós**: 
- ✅ Alinha com sistema original que você criou
- ✅ Muito mais granular para recomendações
- ✅ Tags já existem em `src/utils/energy.js`
- ✅ Permite distinção real (social ≠ foco_profundo)
- ✅ Base para machine learning (arquétipos)

**Contras**: Pouco mais complexo

### **OPÇÃO C: Híbrida (Best of Both)**
- Manter ENERGY_TAGS com 9 tipos
- Agrupar em "macrocategorias" quando necessário:
  - **Focused**: foco_profundo + estrategico
  - **Creative**: criativo + reflexivo
  - **Connective**: conexao + social
  - **Restorative**: restaurador + fisico
  - **Administrative**: admin

---

## 📋 Próximas Implementações

### **Curto Prazo (Esta Semana)**
1. ✅ Documentar arquitetura (este arquivo)
2. ⬜ Atualizar energyCheckIns schema para incluir `energyType`
3. ⬜ Criar MOOD_STATES em `src/utils/moods.js`
4. ⬜ Refatorar EnergyStatsCard para usar ENERGY_TAGS

### **Médio Prazo (Próximas 2 Semanas)**
5. ⬜ Criar EnergyTypeBreakdownCard
6. ⬜ Implementar energy type picker no check-in
7. ⬜ Adicionar correlação mood ↔ energy no Ash
8. ⬜ Refatorar Task assignment para sugerir energyType

### **Longo Prazo (Próximo Mês)**
9. ⬜ Machine learning para detectar arquétipos
10. ⬜ Previsões de energia (quando você trabalha melhor)
11. ⬜ Integração com menstrual cycle
12. ⬜ Recomendações cósmicas (Moon phase + tarefas)

---

## 🎓 Conclusão

O Prana **precisa de 9 dimensões de energia** + **8 estados emocionais** para funcionar como um sistema verdadeiramente holístico.

- **Energia** = "O que posso fazer"
- **Mood** = "Como me sinto"
- **Ciclos** = "Em que contexto biológico estou"
- **Cosmos** = "Como o universo me influencia"

Isso é o que transforma o Prana de um **gestor de tarefas** para um **assistente de vida**.

---

**Próximo Passo**: Qual opção você escolhe? A ou B ou C?
