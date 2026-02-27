# 🌊 BIOMA NASCENTE (MATA CILIAR) — Visual Reference

## Estrutura Visual Renderizada

```
╔══════════════════════════════════════════════════════════════════════════════╗
║              NASCENTE DA MATA CILIAR · RIO SERENO ANCESTRAL                  ║
║         Atmosfera: Contemplativa · Ancestral · Profundidade Emocional       ║
╚══════════════════════════════════════════════════════════════════════════════╝

    ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️ ☁️
    CÉU AZUL CLARO (#7dd3fc)
    
    ═════════════════════════════════════════════════════════════════

    💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫 💫
    BRILHOS NA ÁGUA (4 raios em movimento, opacity: 0.1)
    Duração: 15s por raio, delay variável (0s, 2s, 4s, 6s)

    ═════════════════════════════════════════════════════════════════

    [Camada 1 - Background] zIndex: 5
    
        ÁGUA VERDE CLARA (#10b981, opacity: 0.3)
        Ondulação: 25s, movimento Y: 0→4→0px
        d="M0,350 Q400,200 800,350 T1440,350 V800 H0 Z"
    
    ═════════════════════════════════════════════════════════════════

    [Criatura Subaquática] zIndex: 7
    
    🐋 LEVIATÃ ANCESTRAL (Cor: #34d399)
       Movimento: Esquerda para direita em 85s
       Y oscilação: 0→10→-10→0px (breathing)
       Criatura verde translúcida (opacity: 0.2)
       Tamanho: 110x55 (grande)

    ═════════════════════════════════════════════════════════════════

    [Camada 2 - Midground] zIndex: 10
    
        ÁGUA VERDE MÉDIO (#065f46, opacity: 0.4)
        Ondulação: 20s, delay: 4s
        Movimento X: ±1.5% oscilação horizontal
    
    ═════════════════════════════════════════════════════════════════

    [Flora - Mata Ciliar] zIndex: 11
    
    🌳 (10%, scale=0.7)              🌳 (75%, scale=0.6, flip)
    Cor: #064e3b                      Cor: #064e3b
    Rotação: ±0.4° (balanço leve)     Espelhado
    Duração: 12s                      Duração: 12s

    ═════════════════════════════════════════════════════════════════

    [Cardume de Peixinhos] zIndex: 12
    
    🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 🐟 (10 peixinhos)
    Movimento: Direita para esquerda em 40s
    Cada peixe: opacity 0.3, movement Y: 0→6→0px
    Tamanho individual: 22x12px
    Ondulação vertical: variável por índice

    ═════════════════════════════════════════════════════════════════

    [Camada 3 - Refração] zIndex: 15
    
        ÁGUA VERDE CLARA (#10b981, opacity: 0.25)
        Ondulação: 18s, delay: 2s, com textura (filmGrain)
    
    ═════════════════════════════════════════════════════════════════

    [Rochas Superfície] zIndex: 16
    
    🪨 Posição: 55% horizontal, 45% vertical
       Animação: Y flutuante ±4px em 10s
       Cores: #d4a373 + #b08d79 (bege/marrom natural)
       Tamanho: 220x120px
       Efeito: drop-shadow-lg (sombra profunda)

    ═════════════════════════════════════════════════════════════════

    [Camada 4 - Profundidade] zIndex: 20
    
        ÁGUA VERDE ESCURO (#064e3b, opacity: 0.6)
        Ondulação: 16s, delay: 6s, com textura (filmGrain)
        Movimento Y: 0→18→0px (respiração)

    ═════════════════════════════════════════════════════════════════

    [Camada 5 - Muito Profunda] zIndex: 30
    
        ÁGUA MUITO ESCURA (#022c22, opacity: 0.9)
        Ondulação: 14s, delay: 1s, com textura (filmGrain)
        Movimento Y: 0→18→0px
        Padrão de onda: d="M0,750 Q400,850 800,750 T1440,780 V800 H0 Z"
    
    ═════════════════════════════════════════════════════════════════

    [CANOA COM PESSOA] zIndex: 35
    
    🚣 Posição: 32% horizontal, 28% vertical
       Madeira (#4d342c) - sólida e realista
       Figura Humana: Cabeça + Tronco + Braços
       Movimento: 
         - Y flutuante: 0→-6→0px (12s)
         - Rotação: ±2° (balanço)
         - X oscilação: ±5px (movimento lateral)
       
       SVG Internal:
       ├─ Figura (#3d2b1f):
       │  ├─ Cabeça: círculo r=4.5
       │  ├─ Tronco: path curvo (postura sentada)
       │  ├─ Braço esquerdo: path curvo
       │  └─ Braço direito: path curvo
       └─ Casco: path (#4d342c) - fundo arredondado

    ═════════════════════════════════════════════════════════════════

    [Rochas Base/Encosta] zIndex: 31
    
    🏔️ Encosta da cor #011a13 (muito escura)
       Path: M-100,800 L50,700 Q150,650 300,680 Q450,720 500,800 Z
       Opacity: 0.95 (quase opaca)
       Largura: 100% da tela

    ═════════════════════════════════════════════════════════════════

    [Flora - Frente] zIndex: 32
    
    🌳 (-5%, scale=1.1, grande)      🌳 (85%, scale=1, flip)
    Cor: #010f0b (silhueta negra)    Cor: #010f0b (silhueta negra)
    Árvores do primeiro plano         Árvores encobrindo canoa
    Altura: 100% da viewport         Altura: 100% da viewport

    ═════════════════════════════════════════════════════════════════

    [Partículas - Sedimento] Sem zIndex fixo
    
    ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ ✨ (25 partículas)
    Cor: #4ade80 (verde claro, opacity: 0.1)
    Tamanho: 1x1px, blur: 1.5px
    Movimento: 
      - Y: Sobe 100px (0 → -100)
      - Oscilação: Efeito de flutuação orgânica
      - Duração: 12-24s (variável por partícula)
      - Opacidade: 0 → 0.3 → 0
    Distribuição: Random em 100% x 100%

    ═════════════════════════════════════════════════════════════════

    OVERLAY FINAL:
    Film Grain: opacity 0.04, mix-blend-overlay
    z-index: 100

    ═════════════════════════════════════════════════════════════════

    CORES PRINCIPAIS:
    
    🎨 Gradiente de Fundo:
       ├─ #7dd3fc (Céu azul claro - top)
       ├─ #0ea5e9 (Céu azul médio)
       └─ #011a13 (Muito escuro - bottom)
    
    🌊 Água (6 camadas):
       ├─ #10b981 (Verde claro - camadas 1, 3)
       ├─ #065f46 (Verde médio - camada 2)
       ├─ #064e3b (Verde escuro - camada 4)
       └─ #022c22 (Verde muito escuro - camada 5)
    
    🌳 Flora:
       ├─ #064e3b (Árvores médias)
       └─ #010f0b (Árvores frente/silhueta)
    
    🪨 Rochas:
       ├─ #d4a373 (Bege natural)
       ├─ #b08d79 (Marrom natural)
       └─ #011a13 (Base muito escura)
    
    🚣 Canoa & Pessoa:
       ├─ #4d342c (Madeira sólida)
       └─ #3d2b1f (Pele/roupa figura)
    
    🐋 Leviatã:
       ├─ #34d399 (Verde brilho)
       ├─ #022c22 (Sombra)
       └─ #4ade80 (Glow do olho)
```

---

## Animações Principais

### 1. **Brilhos na Água**
- **Tipo**: Pulsação de opacidade + movimento horizontal
- **Quantidade**: 4 raios
- **Duração**: 15 segundos
- **Padrão**: opacity [0.1, 0.2, 0.1], x [0, 40, 0]
- **Easing**: easeInOut
- **Delay**: 0s, 2s, 4s, 6s (escalonado)

### 2. **Camadas de Água**
- **Tipo**: Ondulação em padrão SVG path
- **Quantidade**: 6 camadas
- **Duração**: 25s → 20s → 18s → 16s → 14s (variável)
- **Movimento X**: ±1.5% (oscilação horizontal sutil)
- **Movimento Y**: 0 → ±15/18px → 0 (respiração)
- **Easing**: easeInOut
- **Delay**: Escalonado para efeito de fluxo contínuo

### 3. **Leviatã Ancestral**
- **Tipo**: Travessia horizontal + oscilação vertical
- **Duração**: 85 segundos (lento, majestoso)
- **Movimento X**: -10vw → 110vw (traversa de uma ponta à outra)
- **Movimento Y**: 0 → 10 → -10 → 0px (respiração)
- **Easing**: linear para X, easeInOut para Y
- **Cauda**: Animação espelhada interna

### 4. **Cardume de Peixinhos**
- **Tipo**: Travessia horizontal + oscilação individual
- **Quantidade**: 10 peixinhos
- **Movimento Geral**: 120vw → -20vw em 40s (grupo)
- **Movimento Individual Y**: 0 → 6 → 0px (até 2.5s, com delay i*0.15)
- **Ondulação**: Math.sin(i * 0.8) * 15px (altura variável)
- **Easing**: linear para movimento, easeInOut para oscilação

### 5. **Árvores da Mata Ciliar**
- **Tipo**: Balanço rotacional
- **Quantidade**: 2 pares (4 no total, incluindo frente)
- **Rotação**: ±0.4° (muito sutil)
- **Duração**: 12 segundos
- **Easing**: easeInOut (movimento natural de árvore ao vento)

### 6. **Rochas Superfície**
- **Tipo**: Flutuação vertical sutil
- **Duração**: 10 segundos
- **Movimento Y**: 0 → 4 → 0px
- **Easing**: easeInOut

### 7. **Canoa com Pessoa**
- **Tipo**: Movimento combinado (Y flutuante, rotação, X oscilação)
- **Duração**: 12 segundos (sincronizado com água)
- **Movimentos**:
  - Y: 0 → -6 → 0px (balança com ondas)
  - Rotação: ±2° (balanço lateral)
  - X: ±5px (movimento lateral sutil)
- **Easing**: easeInOut

### 8. **Partículas de Sedimento**
- **Tipo**: Ascensão lenta + fade in/out
- **Quantidade**: 25 partículas
- **Duração**: 12-24s (variável)
- **Movimento Y**: 0 → -100px (sobe)
- **Movimento X**: Efeito de oscilação (seno)
- **Opacidade**: 0 → 0.3 → 0
- **Distribuição**: Aleatória em (x, y)
- **Easing**: easeInOut

---

## Performance & Otimização

| Aspecto | Valor | Justificativa |
|--------|-------|---------------|
| Peixinhos | 10 | Grupo visível sem excesso |
| Partículas | 25 | Atmosfera sem sobrecarga |
| Árvores | 4 (2 pares) | Profundidade sem redundância |
| Brilhos Água | 4 raios | Efeito visual sem repetição |
| Filtros SVG | 3 | Reutilizáveis |
| Camadas Água | 6 | Estratificação clara |
| Rochas | 2 grupos | Detalhamento sem excesso |
| Canoa | 1 | Entidade principal singular |

---

## Integração com Sistema Prana

### **Trigger do Bioma**
```javascript
if (biomeKey === 'agua' && subBiomeKey === 'nascente') {
  return <RiverNacenteCinematic />;
}
```

### **Mascote Associado**
- **Animal**: Beija-flor (pode aparecer aqui também)
- **Cognitive Cue**: 'ancestralidade'
- **Subcategoria**: Água · Nascente (mata ciliar)

### **Contexto Energético**
Quando o sistema Ash detectar:
- Necessidade de "enraizamento ancestral" → Nascente
- Busca por raízes/tradição → Nascente
- Estado contemplativo + emocional → Nascente
- Conexão com população/comunidade → Nascente
- Profundidade emocional (como Oceano, mas com presença humana)

---

## Diferenças Visuais com Oceano

```
OCEANO:
├─ Cores: Azul escuro → Índigo escuro → Preto
├─ Fauna: Leviatã solitário
├─ Presença Humana: Nenhuma
├─ Flora: Nenhuma visível
├─ Movimento: Lento, hipnotizante
├─ Atmosfera: Mistério, imensidão
└─ Significado: Profundidade pura

NASCENTE:
├─ Cores: Azul claro → Verde claro → Verde escuro
├─ Fauna: Leviatã + cardume + peixes
├─ Presença Humana: Figura ancestral em canoa
├─ Flora: Mata ciliar ao fundo
├─ Movimento: Orgânico, vivo, comunitário
├─ Atmosfera: Ancestralidade, comunidade
└─ Significado: Raízes, tradição, enraizamento
```

---

**Arquivo de Configuração**: `/workspaces/prana3.0/src/components/biome/RiverNacenteCinematic.jsx` (340 linhas)

**Exports**: Named (`RiverNacenteCinematic`) + Default  

**Dependências**: React, Framer Motion, Tailwind CSS  

**Sem Props**: Componente autossuficiente (renderiza cena completa)

---

## Como Usar

### **1. Renderizar em Isolation (Teste)**
```jsx
import { RiverNacenteCinematic } from '@/components/biome/RiverNacenteCinematic';

export default function TestPage() {
  return <RiverNacenteCinematic />;
}
```

### **2. No Sistema Prana (Integrado)**
```jsx
function BiomeScene({ biome }) {
  if (biome?.biome === 'agua' && biome?.subBiome === 'nascente') {
    return <RiverNacenteCinematic />;
  }
  // ... outros biomas
}
```

---

**Próximo Passo**: Acessar `/biome-debug` no navegador e testar!
