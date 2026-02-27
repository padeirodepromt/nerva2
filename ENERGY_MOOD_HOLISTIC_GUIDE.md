# 🌟 Prana Energy & Mood Holistic Guide

## 📊 Overview

O Prana utiliza um sistema holístico multimodal para rastrear e analisar os estados energéticos e emocionais do usuário. Este documento explica a arquitetura, tipos de dados e como são integrados no Dashboard.

---

## ⚡ ENERGY (Energia Física)

### **O que é Energia no Prana?**

Energia no Prana refere-se ao **nível físico de vitalidade** do usuário, medido através de check-ins diários e histórico de 7 dias.

### **Escala de Energia**
- **1/5**: Muito Baixa (exaustão, necessidade de descanso)
- **2/5**: Baixa (fadiga, movimento lento)
- **3/5**: Média (equilíbrio, funcionamento normal)
- **4/5**: Alta (vitalidade, disposição para ação)
- **5/5**: Muito Alta (pico de energia, otimismo)

### **3 Tipos de Energia (Energy Types)**

O Prana classifica a qualidade energética em 3 tipos:

#### 1. **Deep Work** 🔵 (Imersão Profunda)
- **Descrição**: Energia focada, concentrada, introspectiva
- **Características**: Ideal para tarefas complexas, análise profunda, programação, escrita
- **Cores**: Indigo/Purple gradients
- **Duração típica**: 4-6 horas de foco contínuo
- **Indicadores**: Energia mental alta, distrações mínimas, fluxo cognitivo

#### 2. **Flow** 🟢 (Fluxo Contínuo)
- **Descrição**: Energia natural, fluida, conectada
- **Características**: Criatividade fluindo, colaboração, movimento, ritmo natural
- **Cores**: Emerald/Teal gradients
- **Duração típica**: 3-5 horas de movimento contínuo
- **Indicadores**: Sintonia com ambiente, feedback imediato, progressão clara

#### 3. **Fire** 🔴 (Alta Intensidade)
- **Descrição**: Energia explosiva, dinâmica, acionável
- **Características**: Picos de motivação, agilidade, intensidade, urgência
- **Cores**: Orange/Red gradients
- **Duração típica**: 2-3 horas de intensidade máxima
- **Indicadores**: Adrenalina, motivação externa, deadlines, competição

### **Dados de Energia Armazenados**

```javascript
// Schema: energyCheckIns (DB)
{
  id: "nrg_xxx",
  userId: "user_xxx",
  energyLevel: 4,           // 1-5 (escala integrada)
  mood: "focused",          // Mood associado
  notes: "Trabalhei bem...",
  tags: ["sono-ruim", "foco-alto"], // Tags contextuais
  createdAt: timestamp
}
```

### **EnergyStatsCard - Dashboard**

O card de Energia no Dashboard exibe:
- **Valor atual**: Média dos últimos check-ins
- **Tendência**: ↑ (crescimento), ↓ (queda), → (estável)
- **Mini Timeline**: Gráfico de barras dos últimos 7 dias
- **Textura**: Papel sutil para composição visual

---

## 😊 MOOD (Estados Emocionais)

### **O que é Mood no Prana?**

Mood refere-se aos **estados emocionais** do usuário, rastreados para correlacionar com produtividade e bem-estar.

### **8 Estados Emocionais (Moods)**

O Prana rastreia 8 estados distintos:

| Mood | Emoji | Descrição | Correlação |
|------|-------|-----------|-----------|
| **Calm** | 😌 | Tranquilidade, paz interior | Meditação, introspecção |
| **Joy** | 😊 | Alegria, otimismo, gratidão | Celebração, social |
| **Focus** | 🎯 | Concentração, determinação | Deep work, metas |
| **Creativity** | ✨ | Inspiração, ideação, fluxo | Brainstorm, criação |
| **Anxiety** | 😰 | Preocupação, tensão, stress | Deadlines, incerteza |
| **Confusion** | 😕 | Dúvida, falta de clareza | Ambiguidade, decisão |
| **Gratitude** | 🙏 | Reconhecimento, apreciação | Reflexão, comunidade |
| **Sadness** | 😢 | Tristeza, luto, introversão | Perda, isolamento |

### **Dados de Mood Armazenados**

```javascript
// No campo `mood` de energyCheckIns
mood: "calm" | "joy" | "focus" | "creativity" | "anxiety" | "confusion" | "gratitude" | "sadness"

// Distribuição agregada (no Dashboard)
moodDistribution: {
  "calm": 15,
  "joy": 8,
  "focus": 22,
  "creativity": 5,
  "anxiety": 2,
  "confusion": 1,
  "gratitude": 18,
  "sadness": 3
}
```

### **Correlações com Ações**

O Prana utiliza padrões de mood para gerar insights:

- **Predominância de "focus"**: Sugerir metas desafiadoras
- **Aumento de "anxiety"**: Recomendar práticas de respiração, meditação
- **Consistência em "gratitude"**: Celebrar padrão saudável
- **Spike de "sadness"**: Oferecer suporte, conexão social

---

## 🧬 MENSTRUAL CYCLE (Opcional - Feminino)

### **O que é?**

Rastreamento opcional do ciclo menstrual para correlacionar com energia e mood.

### **4 Fases do Ciclo**

| Fase | Duração | Características | Recomendação |
|------|---------|-----------------|--------------|
| **Menstrual** | 3-7 dias | Descanso, introspecção | Yin activities, yoga restaurativo |
| **Follicular** | 7-10 dias | Energia crescente, criatividade | Novos projetos, exploração |
| **Ovulatory** | 3-4 dias | Pico de energia, comunicação | Apresentações, colaboração |
| **Luteal** | 10-14 dias | Consolidação, organização | Planejamento, análise |

### **Dados Armazenados**

```javascript
// Schema: menstrualCycles
{
  id: "mcs_xxx",
  userId: "user_xxx",
  startDate: timestamp,  // Início do ciclo
  notes: "Opcionais",
  createdAt: timestamp
}
```

---

## 🌙 ASTROLOGY (Astrologia & Ciclo Cósmico)

### **O que é?**

Integração com dados astrológicos reais para contextualizar energia e mood através do cosmos.

### **Componentes Astrológicos**

#### **Ciclo Solar (Sun Sign)**
- Representa **identidade principal**, elemento (Fogo, Terra, Ar, Água)
- Exemplo: "Aquário | Ar - Comunicação, intelecto"

#### **Ciclo Lunar (Moon Phase)**
- Representa **estado emocional cíclico**, fase da lua
- **8 Fases**:
  - ○ Lua Nova: Novo começo, intenção
  - ◐ Lua Crescente: Crescimento, expansão
  - ◑ Quarto Crescente: Ajustes, desafios construtivos
  - ◔ Lua Gibosa: Refinamento, aperfeiçoamento
  - ● Lua Cheia: Culminação, integração
  - ◕ Lua Disseminadora: Compartilhamento, ensinamento
  - ◓ Quarto Minguante: Reflexão, desapego
  - ◒ Lua Balsâmica: Conclusão, intuição profunda

#### **Conselho Cósmico (Daily Advice)**
- Leitura interpretativa personalizada para o dia
- Sincroniza com energia e moon phase

### **AstrologyCard - Dashboard**

O card de Astrologia é dividido em **3 camadas**:

1. **Ciclo Solar**: Sun sign + element
2. **Ciclo Lunar**: Moon phase + interpretação
3. **Conselho Cósmico**: Advice customizado para o dia

---

## 📈 Integration Flow

### **Como tudo se conecta?**

```
Check-in Diário
    ↓
Usuário seleciona: Energy (1-5) + Mood (8 tipos) + Notes
    ↓
Dados armazenados em energyCheckIns
    ↓
Dashboard queries últimos 7 dias
    ↓
EnergyStatsCard: mostra tendência
    ↓
MoodStatsCard: mostra distribuição
    ↓
AstrologyCard: contextualiza com lua/astrologia
    ↓
Ash (IA): gera insights personalizados
```

### **Exemplos de Insights**

**Contexto 1**: Energia Alta (4/5) + Mood: Focus + Lua Cheia
→ "Sua energia está alta e você está focado. A Lua Cheia amplifica sua clareza. Ideal para apresentações e decisões importantes."

**Contexto 2**: Energia Baixa (2/5) + Mood: Anxiety + Lua Nova
→ "Sua energia está baixa e há ansiedade. A Lua Nova convida à introspecção. Pratique meditação e restauração."

**Contexto 3**: Ciclo Menstrual (Fase Ovulatória) + Mood: Creativity
→ "Fase ovulatória: sua comunicação está aprimorada. Excelente para colaboração, apresentações e brainstorm criativo."

---

## 🎯 Resumo de Dados

| Dimensão | Tipo | Escala | Armazenamento | Dashboard |
|----------|------|--------|---------------|-----------|
| **Energia** | Contínuo | 1-5 | energyCheckIns.energyLevel | EnergyStatsCard |
| **Mood** | Categórico | 8 tipos | energyCheckIns.mood | MoodStatsCard (dist.) |
| **Astrologia** | Temporal | Real-time | astrologyService | AstrologyCard |
| **Menstrual** | Temporal | 4 fases | menstrualCycles (opt.) | MenstrualCard (opt.) |
| **Tags** | Textual | Livre | energyCheckIns.tags | TagsCloudCard |

---

## 🔮 Próximos Passos

1. **Machine Learning**: Correlacionar padrões de energia/mood com produtividade
2. **Previsões**: Sugerir tipos de energia ideais para tarefas futuras
3. **Integração com Tarefas**: Classificar tarefas por tipo de energia necessária
4. **Recomendações Ritualísticas**: Sugerir rituais baseados no estado energético
5. **Exportação**: Relatórios mensais de tendências de energia e mood

---

**Última atualização**: Dec 2024  
**Versão**: Prana 3.0 Holistic
