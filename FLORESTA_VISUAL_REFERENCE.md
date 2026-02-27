# 🌳 BIOMA FLORESTA FRUTÍFERA — Visual Reference

## Estrutura Visual Renderizada

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                    FLORESTA FRUTÍFERA · CHUVA SERENA                         ║
║                   Atmosfera: Calma · Profundidade · Orgânica                 ║
╚══════════════════════════════════════════════════════════════════════════════╝

    ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️ ☂️
    CHUVA SERENA (40 gotas animadas, translúcidas)
    duração: 2.5-4s, altura: 15-40px, opacity: 0.07

    ═════════════════════════════════════════════════════════════════

    ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️  ☀️
    RAIOS SOLARES (Komorebi - pulsam sutilmente, opacidade: 0.1)

    ═════════════════════════════════════════════════════════════════

    [Camada 1 - Background] zIndex: 5-7
    
        🌳 (22%, h=580px, scale=0.6)    🌳 (72%, h=540px, scale=0.5)
        Frutas: 🟠🟠🟠 Dourado              Frutas: 🟠🟠🟠 Dourado
        
        🌿 (25%, scale=0.6) Samambaia
        
        ══════════════════════════════════════════════════════════
        SOLO 1: Cor #012e22, altura: 180px
        ══════════════════════════════════════════════════════════

    ═════════════════════════════════════════════════════════════════

    [Camada 2 - Midground] zIndex: 10-13
    
        🌳 (45%, h=680px, scale=0.8) ← MACACO 🐒 (animado)
        Frutas: 🟡🟡🟡 Amarelo
        
        🌳 (35%, h=400px, scale=0.4)    🌳 (55%, h=350px, scale=0.35)
        Frutas: 🟡 Amarelo              Frutas: 🟡 Amarelo
        
        🌿 (42%, scale=0.9) Samambaia (maior)
        
        ══════════════════════════════════════════════════════════
        SOLO 2: Cor #011a13, altura: 140px
        ══════════════════════════════════════════════════════════

    ═════════════════════════════════════════════════════════════════

    [Camada 3 - Foreground] zIndex: 30-41
    
        🌳 (5%, h=880px, scale=1.2) ← MACACO 🐒 GRANDE    🌳 (78%, h=860px, scale=1.1) ← LAGARTO 🦎
        Frutas: 🔴 Vermelho                                Frutas: 🔴 Vermelho
        
        🌿 (25%, scale=1.2) Samambaia                     🌿 (65%, scale=1) Samambaia
        
        ✨ Vegetação rasteira (x=15%, x=70%)
        
        ══════════════════════════════════════════════════════════
        SOLO 3: Cor #000000, altura: 90px (definitivo)
        ══════════════════════════════════════════════════════════

    ═════════════════════════════════════════════════════════════════

    [Fauna Integrada]
    
    🦋 Borboleta (x=60%, y=40%, cor: Roxo-Índigo #6366f1)
       Movimento: Sinuoso com 8 ciclos, rotação orgânica
    
    ✨ Vagalume 1 (x=20%, y=60%) ← Luz Amarela pulsante
    ✨ Vagalume 2 (x=80%, y=50%) ← Luz Amarela pulsante
       Movimento: Errático em padrão quadrado, opacidade: 0→1→0
    
    🐦 Casal de Pássaros (x=48%, y=22%)
       2 pássaros em padrão de voo harmonioso
       Cores: Cinza escuro com asas mais claras
    
    ═════════════════════════════════════════════════════════════════

    [Atmosfera]
    
    💨 Polen: 20 partículas amarelas flutuando
       Movimento: Subida suave + oscilação lateral
       Duração: 12-20s por ciclo
       Opacidade: 0 → 0.3 → 0
    
    🎬 Film Grain: Textura cinematográfica sutil (opacity: 0.05)

    ═════════════════════════════════════════════════════════════════

    CORES PRINCIPAIS:
    
    🎨 Gradiente de Fundo: #011a13 → #022c22 → #000000
    🟩 Troncos: #064e3b, #022c22, #000000
    🟨 Frutos Dourados: #f59e0b, #facc15
    🔴 Frutos Vermelhos: #ef4444
    🟢 Samambaias: #064e3b, #065f46, #000000
    🌍 Chão: #012e22 → #011a13 → #000000
```

---

## Estrutura de Profundidade (zIndex Strategy)

```
┌─ zIndex 100: Film Grain overlay (final)
├─ zIndex 80:  Chuva (mais visível)
├─ zIndex 60:  Pássaros (fauna médio-alto)
├─ zIndex 45:  Vagalumes (brilhos)
├─ zIndex 41:  Samambaias frente (flora frente)
├─ zIndex 40:  Chão 3 (definitivo)
├─ zIndex 35:  Borboleta (fauna baixa)
├─ zIndex 31:  Frutos grande (destaque)
├─ zIndex 30:  Troncos grandes (primeiro plano)
├─ zIndex 13:  Chão 2 (midground)
├─ zIndex 12:  Samambaias médias
├─ zIndex 11:  Frutos médias
├─ zIndex 10:  Troncos médios (macaco/lagarto)
├─ zIndex 7:   Chão 1 (background)
├─ zIndex 6:   Frutos pequenas
├─ zIndex 5:   Troncos pequenos
└─ zIndex 15:  Raios solares (komorebi)
```

---

## Animações Principais

### 1. **Chuva**
- **Tipo**: Movimento vertical contínuo
- **Quantidade**: 40 gotas
- **Duração**: 2.5 - 4 segundos por gota
- **Easing**: Linear (para efeito de queda natural)
- **Delay**: Aleatório (0-3s) para efeito irregular

### 2. **Troncos**
- **Tipo**: Micro-vibração horizontal (shimmer leve)
- **Amplitude**: ±1px
- **Duração**: 12 segundos
- **Easing**: easeInOut (para movimento natural)

### 3. **Copas/Frutos**
- **Tipo**: Respiração + rotação suave
- **Movimento Y**: ±8px (flutuação)
- **Rotação**: ±0.5° (balanço)
- **Duração**: 8-12 segundos (variável)
- **Animação de Frutos**: Scale 1 → 1.15 → 1 (pulsação)

### 4. **Macaco**
- **Tipo**: Movimento de escalada + balanço de cauda
- **Cauda**: Animação de corda balançando
- **Corpo**: Respiração vertical
- **Duração**: 5-6 segundos

### 5. **Lagarto**
- **Tipo**: Rastejamento vertical
- **Amplitude**: ±30px em Y
- **Duração**: 8 segundos
- **Easing**: easeInOut

### 6. **Vagalumes**
- **Tipo**: Movimento errático + pulsação de luz
- **Padrão**: Quadrado em movimentação
- **Luz**: Opacity 0 → 1 → 0 em 2 segundos
- **Duração Global**: 10 segundos para movimento

### 7. **Borboleta**
- **Tipo**: Voo sinuoso
- **Padrão**: Movimento em 4 pontos (quadrado suavizado)
- **Duração**: 8 segundos
- **Rotação**: Alternância espelhada (asas)

### 8. **Pássaros**
- **Tipo**: Voo em dupla
- **Padrão**: Sobe e desce, deslocamento horizontal
- **Duração**: 5 segundos por ciclo
- **Sincronização**: Segundo pássaro com delay 0.6s

### 9. **Polen**
- **Tipo**: Flutuação vertical + oscilação
- **Movimento**: Sobe 60px, oscila ±15px lateralmente
- **Duração**: 12-20 segundos (variável)
- **Opacidade**: Fade in/out (0 → 0.3 → 0)

### 10. **Raios Solares**
- **Tipo**: Pulsação de opacidade
- **Intervalo**: 0.1 → 0.3 → 0.1
- **Duração**: 15 segundos
- **Efeito**: Movimento de luz ao longo do dia

### 11. **Samambaias**
- **Tipo**: Balanço + skew suave
- **Rotação**: ±2°
- **Skew X**: ±1°
- **Duração**: 7 segundos

---

## Performance & Otimização

| Aspecto | Valor | Justificativa |
|--------|-------|---------------|
| Gotas de Chuva | 40 | Reduzido de padrão (mantém seriedade, não visual poluído) |
| Partículas de Polen | 20 | Atmosfera sem excesso |
| Filtros SVG | 5 | Reutilizáveis (forestLight, barkTexture, filmGrain, fireflyGlow) |
| Componentes de Fauna | 7 | Bem distribuídos (macaco, lagarto, borboleta, vagalume x2, pássaro x2) |
| Troncos Renderizados | 8 | Estratificados em 3 camadas |
| Copas Renderizadas | 8 | Variantes (round/pointy, normal/flip) |
| Samambaias | 3 | Distribuídas em profundidade |
| Camadas de Solo | 3 | Separação visual clara |

---

## Integração com Sistema Prana

### **Trigger do Bioma**
```javascript
if (biomeKey === 'floresta') {
  return <FruitForestCinematic />;
}
```

### **Mascote Associado**
- **Animal**: Elefante (força, grounding, lentidão)
- **Cognitiveu Cue**: 'grounding'
- **Subcategoria**: Floresta (terra, raízes, natureza)

### **Contexto Energético**
Quando o sistema Ash detectar:
- Energia física ALTA + Mental ALTO → Floresta (foco profundo, estabilidade)
- Necessidade de "enraizamento" → Floresta
- Estado contemplativo → Floresta Frutífera (chuva serena)

---

## Paleta de Cores Detalhada

```
GRADIENTE PRINCIPAL
├─ #011a13 (Deep Forest - superior)
├─ #022c22 (Mid Forest - meio)
└─ #000000 (Black - inferior)

TRONCOS
├─ #064e3b (Bright Green - troncos pequenos)
├─ #022c22 (Dark Green - troncos médios)
└─ #000000 (Black - troncos grandes/frente)

FRUTOS
├─ #f59e0b (Amber-500 - dourado quente)
├─ #facc15 (Yellow-300 - amarelo brilho)
└─ #ef4444 (Red-500 - vermelho maduro)

FLORA
├─ #064e3b (Verde floresta padrão)
├─ #065f46 (Verde mais saturado)
└─ #000000 (Silhueta negra frente)

SOLO
├─ #012e22 (Camada 1 - fundo)
├─ #011a13 (Camada 2 - médio)
└─ #000000 (Camada 3 - definitiva)

FAUNA
├─ #6366f1 (Indigo - borboleta)
├─ #fbbf24 (Amber-300 - vagalumes)
├─ #334155 (Slate-700 - pássaro 1)
└─ #3f3f46 (Zinc-800 - pássaro 2)
```

---

## Arquivo de Configuração

**Localização**: `/workspaces/prana3.0/src/components/biome/FruitForestCinematic.jsx`

**Exports**:
- Named: `export const FruitForestCinematic = () => { ... }`
- Default: `export default FruitForestCinematic;`

**Dependências**:
- `React`
- `framer-motion` (para animações)
- Tailwind CSS (para classes)

**Sem Props**: Componente autossuficiente (renderiza cena completa)

---

## Como Usar

### **1. Renderizar em Isolation (Teste)**
```jsx
import { FruitForestCinematic } from '@/components/biome/FruitForestCinematic';

export default function TestPage() {
  return <FruitForestCinematic />;
}
```

### **2. No Sistema Prana (Integrado)**
```jsx
function BiomeScene({ biome }) {
  if (biome?.biome === 'floresta') {
    return <FruitForestCinematic />;
  }
  // ... outros biomas
}
```

### **3. Com Mascote Elefante**
```jsx
<div className="relative">
  <FruitForestCinematic />
  <ElefanteTotem className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
</div>
```

---

## Checklist de Verificação

- ✅ Arquivo criado: `/workspaces/prana3.0/src/components/biome/FruitForestCinematic.jsx` (15KB)
- ✅ Import adicionado em `BiomeDebugPage.jsx`
- ✅ Lógica de renderização implementada (`isFloresta` check)
- ✅ Botão de teste rápido criado ("Floresta Frutífera")
- ✅ Header atualizado com descrição
- ✅ Build executado com sucesso (sem erros)
- ✅ Sem erros TypeScript
- ✅ Estrutura de código segue padrão (como OceanCinematic)
- ✅ Documentação criada

---

**Próximo Passo**: Acessar `/biome-debug` no navegador e testar!
