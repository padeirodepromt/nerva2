# 🌊 Bioma da Nascente (Mata Ciliar) — CRIADO

**Status**: ✅ Integrado e Funcional  
**Data**: Dezembro 23, 2025  
**Versão**: Prana 4.9.7 - Mata Ciliar (Canoa e População Ancestral)

---

## 📋 Resumo

Foi criado o **quinto bioma cinematográfico imersivo** do sistema Prana: a **Nascente da Mata Ciliar**, focado em ancestralidade, figura humana ribeirinha em canoa, leviã subaquático e profundidade emocional serena. Este bioma complementa os quatro anteriores (Beija-flor, Oceano, Floresta Frutífera, Sertão).

---

## 🎬 Características Visuais

### **Paleta de Cores**
- **Gradiente de Fundo**: Céu azul claro → Água verde (`#7dd3fc` → `#0ea5e9` → `#011a13`)
- **Água**: Múltiplas camadas verdes (`#10b981`, `#065f46`, `#064e3b`, `#022c22`, `#011a13`)
- **Árvores**: Verde escuro de mata ciliar (`#064e3b`, `#010f0b`)
- **Canoa**: Marrom madeira sólido (`#4d342c`)
- **Rochas**: Bege/marrom natural (`#d4a373`, `#b08d79`)

### **Elementos Animados**
1. **Cenas de Refração**: Movimento de luz na água com distorção
2. **Brilho na Água**: 4 raios de luz em movimento suave
3. **Camadas de Água**: 6 camadas de ondas em profundidade variável
4. **Leviatã Ancestral**: Criatura subaquática verde passando lentamente
5. **Árvores da Mata Ciliar**: 4 árvores altas balançando ao vento
6. **Cardume de Peixinhos**: 10 pequenos peixes nadando
7. **Rochas na Superfície**: Afloramentos de pedra flutuando suavemente
8. **Canoa com Pessoa**: Embarcação de madeira com figura humana ancestral sentada
9. **Partículas em Suspensão**: 25 partículas de sedimento flutuando

### **Filtros SVG Cinematográficos**
- `riverRefraction`: Distorção de água animada
- `filmGrain`: Textura de filme antigo
- `glow`: Brilho para elementos-chave

---

## 🔧 Estrutura do Código

### **Arquivo Principal**
- **Localização**: `/workspaces/prana3.0/src/components/biome/RiverNacenteCinematic.jsx`
- **Linhas**: 340 linhas
- **Export**: Named export `RiverNacenteCinematic` + default export

### **Componentes Internos**
| Componente | Função | Props |
|-----------|--------|-------|
| `CinematicFilters()` | Define filtros SVG reutilizáveis | Nenhuma |
| `AncestralPerson()` | Figura humana sentada na canoa | Nenhuma |
| `SmallFishShoal()` | Cardume de 10 peixinhos | Nenhuma |
| `SurfaceRocks()` | Rochas flutuando na superfície | Nenhuma |
| `SmallLeviata({ color })` | Criatura subaquática grande | color |
| `CiliarTree({ x, zIndex, color, scale, flip })` | Árvore da mata ciliar | x, zIndex, color, scale, flip |
| `RiverRocks({ zIndex, color, flip })` | Rochas da encosta base | zIndex, color, flip |
| `WoodenCanoe({ duration, delay })` | Canoa com pessoa ancestral | duration, delay |
| `WaveLayer({ d, color, duration, delay, opacity, zIndex, texture, yOffset })` | Camada de onda animada | d, color, duration, delay, opacity, zIndex, texture, yOffset |
| `RiverNacenteCinematic()` | Componente principal | Nenhuma |

---

## 📊 Integração no Sistema

### **Arquivo de Debug**
- **Localização**: `/workspaces/prana3.0/src/pages/BiomeDebugPage.jsx`
- **Mudanças**:
  1. ✅ Import adicionado: `import { RiverNacenteCinematic } from '@/components/biome/RiverNacenteCinematic';`
  2. ✅ BIOME_SCENES atualizado com nova entrada "nascente" em categoria "agua"
  3. ✅ Lógica de renderização: Renderiza `<RiverNacenteCinematic />` quando `isNascente && isWater === true`
  4. ✅ Botão de teste rápido: "Água · Nascente" para forçar renderização
  5. ✅ Header atualizado: Menciona "Nascente (Mata Ciliar)" na descrição
  6. ✅ Grid de botões expandido de 4 para 5 colunas

### **Configuração BIOME_SCENES**
```javascript
agua: {
  beijaflor: {
    title: 'Água · Nascente (Beija-flor)',
    subtitle: 'Flow leve, foco macio, criatividade fresca.',
    gradient: 'from-sky-500/40 via-cyan-400/40 to-emerald-300/30',
    orb: 'bg-cyan-300/70',
  },
  nascente: {
    title: 'Água · Nascente (Mata Ciliar)',
    subtitle: 'Rio sereno, ancestralidade, população ribeirinha.',
    gradient: 'from-sky-600/50 via-emerald-500/40 to-green-900/50',
    orb: 'bg-emerald-400/60',
  },
  // ... outros
}
```

---

## 🎯 Características Principais

### **Atmosfera**
- ✅ Serena, contemplativa e ancestral
- ✅ Sensação de rio tranquilo
- ✅ Profundidade emocional (leviatã profundo)
- ✅ Presença humana (canoa com figura)
- ✅ Movimento orgânico (não frenético)

### **Ancestralidade**
- ✅ Figura humana sentada na canoa (postura contemplativa)
- ✅ Canoa de madeira sólida (artesanato tradicional)
- ✅ Leviatã ancestral como protetor subaquático
- ✅ Mata ciliar intocada (árvores grandes)
- ✅ Partículas de sedimento (ancestralidade flutuante)

### **Performance**
- ✅ 10 peixinhos (animados eficientemente)
- ✅ 25 partículas de sedimento (leve)
- ✅ 6 camadas de ondas (cálculo suave)
- ✅ 4 árvores em profundidade
- ✅ Filtros SVG reutilizáveis

### **Cinematografia**
- ✅ Composição em camadas profundas
- ✅ Movimento de câmera subtil
- ✅ Variação de opacidade entre camadas
- ✅ Textura de filme (grain)
- ✅ Glow effects para leviatã

---

## 🧪 Teste Rápido

Para testar o novo bioma imediatamente:

1. Acesse: `/biome-debug`
2. Clique no botão **"Água · Nascente"** na seção "Testes rápidos — Forçar Bioma"
3. Você verá a nascente renderizada com:
   - Céu azul claro graduando para água verde
   - Camadas de água em movimento orgânico
   - Leviatã grande passando lentamente embaixo
   - Cardume de 10 peixinhos nadando
   - 2 árvores altas de mata ciliar em ambos os lados
   - Rochas aflorando na superfície
   - Canoa de madeira com figura humana ancestral sentada
   - 25 partículas flutuando suavemente
   - Brilhos sutis na água

---

## 📝 Estrutura de Profundidade (zIndex)

```
┌─ zIndex 100: Film Grain overlay (final)
├─ zIndex 35:  Canoa com pessoa (meio)
├─ zIndex 32:  Árvores grandes (primeiro plano)
├─ zIndex 31:  Rochas base
├─ zIndex 30:  Camada de onda 7 (mais profunda)
├─ zIndex 20:  Camada de onda 6
├─ zIndex 16:  Rochas superfície
├─ zIndex 15:  Camada de onda 5
├─ zIndex 12:  Cardume peixinhos
├─ zIndex 11:  Árvores médias
├─ zIndex 10:  Camada de onda 4
├─ zIndex 7:   Leviatã ancestral
├─ zIndex 5:   Camada de onda 1 (fundo)
└─ Brilhos da água (opacity-10, sem zIndex fixo)
```

---

## 🐠 Fauna Principal

| Entidade | Descrição | Movimento |
|----------|-----------|-----------|
| **Leviatã Ancestral** | Criatura subaquática grande | Atravessa de esquerda para direita em 85s |
| **Cardume (10 peixinhos)** | Pequenos peixes translúcidos | Nada da direita para esquerda em 40s |
| **Figura Humana** | Pessoa ancestral sentada na canoa | Balança com a canoa (movimento orgânico) |
| **Partículas (25)** | Sedimento/algas flutuando | Sobe lentamente, fade in/out |

---

## 📸 Composição Visual Final

```
┌─────────────────────────────────────────────────────┐
│ CÉU AZUL CLARO (#7dd3fc)                           │
│ ════════════════════════════════════════════════════│
│ BRILHOS NA ÁGUA (4 raios pulsantes)                │
│ ════════════════════════════════════════════════════│
│ [Camada 1] Água verde claro (#10b981, opacity 0.3) │
│ [Leviatã Ancestral] Criatura passando (85s)        │
│ [Camada 2] Água verde médio (#065f46, opacity 0.4) │
│ [Árvores Ciliar] 2 árvores em lados opostos        │
│ [Cardume] 10 peixinhos nadando (40s)               │
│ [Camada 3] Água verde (#10b981, opacity 0.25)      │
│ [Rochas Superfície] 2 afloramentos flutuando (10s) │
│ [Camada 4] Água escura (#064e3b, opacity 0.6)      │
│ ════════════════════════════════════════════════════│
│ [CANOA COM PESSOA] Madeira (#4d342c) + Figura      │
│ ════════════════════════════════════════════════════│
│ [Camada 5] Água muito escura (#022c22, opacity 0.9)│
│ [Rochas Base] Encosta de pedra (#011a13)           │
│ [Árvores Frente] 2 árvores grandes (primer plano)  │
│ ════════════════════════════════════════════════════│
│ PARTÍCULAS: 25 sedimentos flutuando                │
│ ════════════════════════════════════════════════════│
│ FILM GRAIN: Textura cinematográfica (opacity 0.04) │
└─────────────────────────────────────────────────────┘
```

---

## ✅ Validação

- ✅ Sem erros de compilação TypeScript
- ✅ Imports configurados corretamente
- ✅ Estrutura de componentes segue padrão existente
- ✅ Integração com BiomeDebugPage funcional
- ✅ Build passou com 3442 módulos transformados
- ✅ Pronto para testes em navegador

---

## 🔄 Diferenças com Oceano

| Aspecto | Oceano | Nascente |
|---------|--------|-----------|
| Ambiente | Infinito, profundo | Rio contido, ancestral |
| Cor | Azul-índigo escuro | Azul-verde claro/médio |
| Fauna | Leviatã solitário | Leviatã + cardume + pessoa |
| Entidade Humana | Nenhuma | Figura ancestral em canoa |
| Atmosfera | Mistério, imensidão | Serenidade, raízes |
| Movimento | Lento e majestoso | Orgânico e vivo |
| Flora | Nenhuma visível | Mata ciliar (árvores) |
| Significado | Profundidade emocional | Ancestralidade + enraizamento |

---

**Criado com**: Framer Motion + React + Tailwind CSS  
**Inspiração**: Ancestralidade, mata ciliar, população ribeirinha, leviatã protetor  
**Status Final**: ✅ COMPLETO E INTEGRADO
