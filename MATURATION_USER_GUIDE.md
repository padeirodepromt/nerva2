# 🌱 Como Usar: Maturação Orgânica

## Quick Start

### 1. **Criar um Projeto**
```javascript
// O projeto começa automaticamente em "Solo" (0-5%)
const project = {
  id: 'proj-123',
  name: 'Meu Primeiro Projeto',
  biome: 'floresta', // nascente, floresta, sertao, ventos, cosmos
  color: '#22c55e',
  description: 'Um projeto que vai crescer'
}
```

### 2. **Ver o Crescimento**
Ao adicionar tarefas ao projeto, ele progride automaticamente:

```
Tarefa 1 criada  → 10% (Semente)
Tarefa 1 feita   → 20% (Broto começa)
Tarefa 2 feita   → 40% (Broto pleno)
...
Todas as tarefas feitas → 100% (Colheita! 🎉)
```

### 3. **Analisar o Estado**

**OrganicStageRenderer** mostra visualmente:
```
🌱 Solo       - Raízes tremendo (primeiras semanas)
💧 Semente    - Core pulsante (fundação sendo criada)
🌿 Broto      - Hastes crescendo (desenvolvimento ativo)
🌳 Crescimento - Árvore forte (força ganhando)
🍂 Colheita   - Frutas douradas (completo!)
```

### 4. **Observar o Animal Guia**

Cada projeto tem um animal que reflete seu estado:

```
IDLE       → Repouso tranquilo
ACTIVE     → Movendo, energia crescente
SUCCESS    → Celebrando (ao 100%)
LOW_ENERGY → Cansado (muitos erros?)
ALERT      → Urgência (deadline próximo)
```

**Biomas & Animais**:
- 🐦 **Nascente** (Azul) → Beija-flor (voa rápido)
- 🐘 **Floresta** (Verde) → Elefante (marcha calma)
- 🐆 **Sertão** (Vermelho) → Onça-pintada (ágil)
- 🦜 **Ventos** (Azul-céu) → Sabiá (asas dinâmicas)
- 🦉 **Cosmos** (Roxo) → Coruja (observadora)

### 5. **Entender as Reações do Bioma**

Conforme o projeto cresce, o **ambiente responde**:

**Nascente** (Água):
```
Solo       → Água turva (poucas conexões)
Semente    → Água clareia (estrutura se forma)
Broto      → Peixes aparecem (vitalidade)
Crescimento → Corais brilham (força)
Colheita   → Bioluminescência máxima (plenitude)
```

**Floresta** (Mata):
```
Solo       → Musgo mínimo, copa aberta
Semente    → Musgo cresce, copa fecha
Broto      → Pássaros começam a cantar
Crescimento → Luz filtrada, muita vida
Colheita   → Ecossistema maduro e abundante
```

**Sertão** (Calor):
```
Solo       → Areia fria, sol moderado
Semente    → Calor aumenta (ondulação)
Broto      → Cactos começam a florescer
Crescimento → Sol intenso, frutos aparecem
Colheita   → Ouro no horizonte (plenitude)
```

**Ventos** (Ar):
```
Solo       → Brisa leve, nuvens estáticas
Semente    → Vento começa, MindMap flutua
Broto      → Nuvens movem mais rápido
Crescimento → Sementes dispersadas ao vento
Colheita   → Tempestade de sementes voadoras
```

**Cosmos** (Espaço):
```
Solo       → Ponto cósmico escuro
Semente    → Vórtice se forma
Broto      → Espiral cresce, nebula brilha
Crescimento → Mandala começa
Colheita   → Consciência cósmica completa
```

---

## 🎖️ Prana Credits

### Como Ganhar?

```javascript
Credits = (Num_Tarefas × 5) + (Num_Subprojetos × 10) + (Speed Bonus)
```

**Exemplo**:
```
Projeto com:
- 15 tarefas      → 15 × 5 = 75 créditos
- 3 subprojetos  → 3 × 10 = 30 créditos
- 95% conclusão  → 95 × 2 = 190 créditos (speed bonus)
───────────────────────────────
Total: 295 Prana Credits 🎖️
```

**Speed Bonus Tiers**:
- 0-50%:   Progress × 1.0
- 51-89%:  Progress × 1.5 (momentum)
- 90-100%: Progress × 2.0 (sprinting)

### O que fazer com Credits?

*Fase 2*: Converter em doações reais para ONGs parceiras! 🌍

---

## 🎯 Fluxo de Trabalho Recomendado

### Dia 1: Criar Projeto
```
1. Escolher bioma que representa o projeto
2. Criar 3-5 tarefas iniciais
3. Observar a transição: Solo → Semente
```

### Semana 1-2: Desenvolvimento
```
1. Trabalhar em tarefas (marca como concluída)
2. Observar progresso: Semente → Broto
3. Animal começa mais ativo
4. Bioma começa a reagir
```

### Semana 3-4: Crescimento
```
1. Mais tarefas sendo concluídas
2. Árvore começando a aparecer (Broto → Crescimento)
3. Ambiente mais vivo
4. Prana Credits acumulando
```

### Semana Final: Colheita
```
1. 90%+ completo (Crescimento → Colheita)
2. Animal em pré-celebração (ACTIVE)
3. Ambiente em plenitude total
4. Última tarefa → HARVEST RITUAL! 🎉
```

---

## 🎉 O Que Acontece ao 100%?

### Harvest Ritual (Ritual de Colheita)

```
Timeline:
t=0.0s   Modal com backdrop blur aparece
t=0.1s   ✨ Explosão de 24 partículas (cores do bioma)
t=0.2s   💫 Segunda explosão no canto
t=0.4s   📜 Texto "Colheita Completa!" com emoji bounce
t=0.5s   📊 Card com informações:
         - Nome do projeto
         - Duração (X tarefas concluídas)
         - Prana Credits ganhos
t=1.5s   🎯 3 botões aparecem:
         - 📜 Gerar Certificado
         - 📤 Compartilhar no social media
         - 🌱 Criar novo projeto
t=8.0s   Auto-fecha (ou clica para fechar)
```

### Após Colheita

O projeto fica marcado como **"Colheita Completa"** com:
- ✅ Badge visual
- 🎖️ Prana Credits congelados
- 🌟 Posição especial no dashboard
- 📜 Certificado digital disponível

---

## 🔧 Customização

### Trocar Bioma (para existentes)
```javascript
// No ProjectNode props
project.biome = 'sertao' // A cor e reações mudam automaticamente
```

### Ajustar Progresso Manual (dev mode)
```javascript
// No componente ProjectNode
const forceProgress = 75; // 75% → mostra Crescimento
const organicStage = getOrganicStage(forceProgress);
```

### Testar Harvest Ritual
```javascript
// No componente ProjectNode
useEffect(() => {
  // Força abertura do ritual para teste
  if (projectProgress === 100) {
    setIsHarvestOpen(true);
  }
}, [projectProgress]);
```

---

## 📊 Estatísticas do Dashboard

**Novos Campos Visíveis**:
```
Projeto: "Meu App"
├─ Progresso:     [████████░░] 80%
├─ Estágio:       🌳 Crescimento
├─ Animal:        🐘 Elefante (ACTIVE)
├─ Tarefas:       12/15 completas
├─ Subprojetos:   3
├─ Prana Credits: 245 🎖️
└─ Bioma:         Floresta (musgo 75%, copa 75%, pássaros alto)
```

---

## ⚡ Dicas & Truques

### 1. **Speed Run (Ganhar Mais Credits)**
```
Estratégia: Completar projeto em < 2 semanas
Bonus: 2.0x speed multiplier ao 90%+
Resultado: +40% credits extra
```

### 2. **Balancear Tarefas vs Subtarefas**
```
Muitas tarefas pequeninhas:
  ✅ Progresso visual mais rápido
  ✅ Prana credits escalonados
  ⚠️ Pode ficar cansativo

Poucas tarefas grandes:
  ✅ Foco melhor
  ✅ Menos clicks
  ⚠️ Menos reward visual intermédio
```

### 3. **Usar Animal como Indicador Emocional**
```
Animal IDLE → Tá tudo tranquilo, sem urgência
Animal ACTIVE → Tá no fluxo, trabalha bem agora!
Animal ALERT → ⚠️ Deadline se aproximando!
```

### 4. **Bioma Match com Projeto**
```
Projeto criativo?        → Escolhe Cosmos (criatividade)
Projeto de infraestrutura? → Escolhe Floresta (estrutura)
Projeto rápido/ágil?     → Escolhe Ventos (velocidade)
Projeto transformador?   → Escolhe Sertão (transformação)
Projeto harmonioso?      → Escolhe Nascente (fluxo)
```

---

## 🐛 Troubleshooting

### Animal não está mudando de estado?
```
Verifique:
1. projectProgress está sendo calculado?
2. Estado animalState está sendo atualizado?
3. useEffect com dependencies está correto?

Debug:
console.log(`Progress: ${projectProgress}, Stage: ${organicStage}, Animal: ${animalState}`)
```

### Harvest Ritual não aparece ao 100%?
```
Verifique:
1. Todas as tarefas marcadas como completed?
2. projectProgress === 100?
3. setIsHarvestOpen foi chamado?

Debug:
if (projectProgress === 100) console.warn('Should trigger harvest!', isHarvestOpen)
```

### Bioma não está reagindo?
```
Verifique:
1. BiomeReactionSystem foi importado?
2. getInterpolatedReactions retorna valores?
3. Reações estão sendo aplicadas ao canvas/background?

Debug:
console.log(BiomeReactionSystem.getReactions(projectBiome, organicStage))
```

---

## 🌍 Roadmap (Fase 2)

- [ ] Auto-doação de 10% credits a ONGs
- [ ] Certificado digital em PDF
- [ ] Animal sounds (opcional)
- [ ] Partículas bioma-específicas no background
- [ ] Leaderboard de projetos
- [ ] Badges adicionais (speed run, marathon, etc)

---

**Versão**: 1.0  
**Status**: ✅ Completo e Testado  
**Próxima Fase**: Q2 2025

---

*Aproveite o crescimento! 🌱 Cada projeto é um ritual de aprendizado.*
