# 🎨 CAPÍTULO 2: IDENTIDADE VISUAL & DESIGN SYSTEM

**Versão:** 1.0 | **Data:** Dezembro 2025

---

## 🎭 FILOSOFIA DE DESIGN

Prana é desenhado com base em **4 pilares**:

### 1. **Neuralidade**
A interface é um reflexo de como o cérebro funciona:
- Tudo conectado (não silos)
- Fluxo natural de informação
- Sem fricção entre ideias e ação

### 2. **Humanidade**
Tecnologia a serviço do humano:
- Respeita ritmos naturais (não afronta)
- Bonita, não apenas funcional
- Inclusiva (accessibility first)

### 3. **Minimalismo Inteligente**
Simples na superfície, poderosa por baixo:
- Sem clutter visual
- Cada elemento tem propósito
- Usuários novos em 2 minutos

### 4. **Sabedoria Ancestral**
Combina ciência moderna com ancestral:
- Ciclos cósmicos (astrologia)
- Ritmos naturais (circadianos)
- Tecnologia a serviço da intuição

---

## 🎨 PALETA DE CORES

### Cores Primárias

```
INDIGO (Prana):     #6366F1
  └─ Foco Profundo, inteligência, introspecção

VIOLET (Spark):     #8B5CF6  
  └─ Criatividade, energia mágica, fluxo

EMERALD (Growth):   #10B981
  └─ Crescimento, vida, renovação

SLATE (Neutral):    #64748B
  └─ Estrutura, administrativo, background
```

### Cores Secundárias (Energy Tags)

```
Pink (Criativo):           #EC4899
Blue (Social):             #3B82F6
Teal (Restaurador):        #34D399
Purple (Reflexivo):        #8B5CF6
Amber (Físico):            #F59E0B
Red (Estratégico):         #EF4444
```

### Mood Colors (Emoções)

```
Calm:                      #8B5CF6 (Violet)
Happy:                     #FBBF24 (Amber)
Focused:                   #3B82F6 (Blue)
Creative:                  #EC4899 (Pink)
Anxious:                   #EF4444 (Red)
Confused:                  #64748B (Slate)
Grateful:                  #10B981 (Emerald)
Sad:                       #6366F1 (Indigo)
```

### Neutros

```
White:      #FFFFFF
Black:      #1F2937
Gray-50:    #F9FAFB
Gray-100:   #F3F4F6
Gray-200:   #E5E7EB
Gray-400:   #9CA3AF
Gray-600:   #4B5563
Gray-900:   #111827
```

---

## 🔤 TIPOGRAFIA

### Font Stack

```css
/* Headlines & Branding */
font-family: 'Inter', 'Helvetica Neue', sans-serif;
font-weight: 700, 600;

/* Body Text */
font-family: 'Inter', 'Helvetica Neue', sans-serif;
font-weight: 400, 500;

/* Mono (Code) */
font-family: 'Fira Code', 'JetBrains Mono', monospace;
font-weight: 400, 500;
```

### Escala de Tamanhos

```
H1 (Page Title):      32px / 40px, Bold
H2 (Section Title):   24px / 32px, Bold
H3 (Subsection):      20px / 28px, SemiBold
H4 (Card Title):      16px / 24px, SemiBold
Body Large:           16px / 24px, Regular
Body:                 14px / 21px, Regular
Body Small:           12px / 18px, Regular
Label:                12px / 16px, Medium
```

### Line Height

```
Titles:        1.2 (tight)
Body:          1.5 (comfortable)
Label:         1.3 (medium)
```

---

## 🎯 COMPONENTES VISUAIS

### Buttons

**Primary (Action Padrão)**
```
Color: Indigo (#6366F1)
Padding: 10px 16px
Border-radius: 8px
Hover: bg-indigo-600 (darker)
Active: bg-indigo-700
```

**Secondary (Alternativa)**
```
Color: Gray-200 background, Gray-700 text
Hover: Gray-100
```

**Destructive (Perigo)**
```
Color: Red (#EF4444)
```

### Cards

```
Background: White (#FFF) ou Gray-50
Border: 1px solid Gray-200
Border-radius: 12px
Padding: 16px ou 20px
Shadow: 0 1px 3px rgba(0,0,0,0.1)
Hover: slight lift + shadow-md
```

### Inputs

```
Border: 1px solid Gray-300
Border-radius: 8px
Padding: 8px 12px
Focus: border-indigo-500 + ring
Font: 14px, Gray-900
Placeholder: Gray-400
```

### Tags/Badges

```
Criativo (Pink):       bg-pink-100, text-pink-700
Admin (Slate):         bg-slate-100, text-slate-700
Restaurador (Teal):    bg-teal-100, text-teal-700
Border-radius: 6px
Padding: 4px 8px
```

---

## 🔆 ÍCONES

### Sistema de Ícones: Lucide React

Prana usa **Lucide** para ícones consistentes:

```javascript
import { 
  Home, 
  Zap, 
  Heart, 
  Brain, 
  Calendar,
  ... 
} from 'lucide-react';
```

### Ícones Customizados (PranaIcons)

Alguns ícones são **custom** para refletir filosofia Prana:

```
IconPrana:          Logo do Prana (neural)
IconSpark:          Ideia rápida (inbox)
IconPapyrus:        Memória/arquivo
IconSankalpa:       Intenção (reflexão)
IconAsh:            Assistente Ash
IconOlly:           Assistente Olly
IconMindMap:        Pensamento visual
IconEnergy:         Energia pessoal
```

### Tamanhos

```
16px   (inline, labels)
20px   (default, menu items)
24px   (section icons)
32px   (hero, emphasis)
48px   (large buttons)
```

---

## 🌙 TEMAS

### Light Mode (Padrão)

```
Background: #FFFFFF
Text: #1F2937 (Gray-900)
Borders: #E5E7EB (Gray-200)
Hover: #F3F4F6 (Gray-100)
Accent: #6366F1 (Indigo)
```

### Dark Mode (Futuro)

```
Background: #1F2937
Text: #F3F4F6
Borders: #374151
Hover: #111827
Accent: #818CF8
```

---

## 📐 SPACING & LAYOUT

### Escala de Spacing

```
0:    0px
1:    4px
2:    8px
3:    12px
4:    16px
6:    24px
8:    32px
12:   48px
16:   64px
```

### Grid System

Prana usa **CSS Grid** com 12 colunas:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1rem;
}

.col-4 { grid-column: span 4; }  /* 1/3 width */
.col-6 { grid-column: span 6; }  /* 1/2 width */
.col-8 { grid-column: span 8; }  /* 2/3 width */
```

### Breakpoints (Responsive)

```
Mobile:    < 640px
Tablet:    640px - 1024px
Desktop:   > 1024px
```

---

## ✨ ANIMAÇÕES

### Transições Padrão

```javascript
// Framer Motion patterns
transition: { duration: 0.3, ease: "easeInOut" }

// Hover efeito
whileHover={{ scale: 1.05 }}

// Tap feedback
whileTap={{ scale: 0.95 }}
```

### Microinterações

```
Button Click:  Scale + ripple
Card Hover:    Lift + shadow
Modal Open:    Fade-in + slide
Loading:       Spinner smooth
Success:       Checkmark pop
Error:         Shake
```

---

## 📱 RESPONSIVE DESIGN

### Mobile (< 640px)

```
1 column layout
Touch-friendly buttons (48px min)
Full-width sheets
Bottom navigation
```

### Tablet (640px - 1024px)

```
2 column layout
Sidebar collapsible
Touch + mouse support
```

### Desktop (> 1024px)

```
3 column layout
Fixed sidebar
Full functionality
Keyboard shortcuts
```

---

## ♿ ACESSIBILIDADE

### WCAG 2.1 AA Compliant

```
Color Contrast:        4.5:1 (text), 3:1 (UI)
Focus Visible:         2px outline, contraste alto
Keyboard Navigation:   Tab, Enter, Esc, Arrow keys
Screen Reader:         Semantic HTML, ARIA labels
Motion:                Respect prefers-reduced-motion
```

### Checklist

- [ ] Todas inputs têm labels
- [ ] Cores não são único identificador
- [ ] Focus visible em todos botões
- [ ] Texto alt em imagens
- [ ] ARIA roles onde apropriado
- [ ] Keyboard accessible

---

## 📏 ESPECIFICAÇÕES

### Shadow Elevation

```
sm:     0 1px 2px 0 rgba(0,0,0,0.05)
md:     0 4px 6px -1px rgba(0,0,0,0.1)
lg:     0 10px 15px -3px rgba(0,0,0,0.1)
xl:     0 20px 25px -5px rgba(0,0,0,0.1)
2xl:    0 25px 50px -12px rgba(0,0,0,0.25)
```

### Border Radius

```
Buttons:     8px
Cards:       12px
Inputs:      8px
Images:      16px
Avatars:     50% (circle)
```

---

## 📚 DESIGN SYSTEM FILE

Arquivo base: `src/styles/theme.js`

```javascript
export const theme = {
  colors: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
  typography: {
    h1: '32px 700',
    h2: '24px 600',
    body: '14px 400',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
  breakpoints: {
    mobile: '640px',
    tablet: '1024px',
  },
};
```

---

## 🎬 BRAND VOICE

### Tom de Comunicação

**Características:**
- Empático, não robótico
- Claro, não corporativo
- Otimista, não naive
- Educativo, não condescendente

### Exemplos

❌ **Ruim (Corporativo):**
> "Please proceed with the task creation workflow"

✅ **Bom (Prana):**
> "What would you like to create?"

❌ **Ruim (Confuso):**
> "Optimize your organizational paradigm"

✅ **Bom (Claro):**
> "Organize your tasks better"

---

## 🎯 PADRÕES DE INTERFACE

### Empty State

Quando não há dados:

```
[Ícone grande relevante]
"Você ainda não tem tarefas"
"Crie sua primeira tarefa para começar →"
[CTA Button]
```

### Error State

Quando algo falha:

```
[Ícone de erro]
"Algo deu errado"
"Detalhes: [mensagem técnica suavizada]"
[Retry Button] [Help Link]
```

### Loading State

Durante carregamento:

```
[Spinner animado]
"Carregando..."
(ou apenas spinner se < 1s)
```

### Success State

Após ação bem-sucedida:

```
[Checkmark pop animation]
"Tarefa criada!" (toast notification)
(desaparece em 3s)
```

---

**Próximo capítulo:** [🏗️ 06 - Arquitetura do Sistema](MANUAL_PRANA_06_ARQUITETURA_SISTEMA.md)

