# SideChat v7.0 - UI Layout Final

## 📐 Estrutura Visual

```
┌─────────────────────────────────────────────┐
│         SIDECHAT V7.0 - Terminal Ash        │
├─────────────────────────────────────────────┤
│                                             │
│  [🔍 History Search] [━━━━━━━━━━━━] [🗑️]   │  ← HEADER
│  Procura: "_______" | Last 10               │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  ✓ FOCO ATIVO                               │
│  Tarefa: Implementar Chat Modes             │
│                                             │
│  🔗 CONTEXTO CARREGADO                      │
│  Página: Dashboard v8.0                     │
│                                             │
│  📎 ARQUIVO ANEXADO (NEW!)                  │
│  📄 documento.pdf | 200KB                   │
│  "Lorem ipsum dolor sit amet..."            │
│  [✕ Limpar]                                │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  User: "Ajuda a planejar minha semana"      │
│                                             │
│  Ash: "Claro! Vou analisar seu arquivo...  │
│        e criar um plano..."                 │
│        [⏳ Processando...]                  │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  MODO: 🎯 Planejar ▼                        │  ← MODE SELECTOR
│  Organiza tarefas com timeline e deadlines  │
│                                             │
│  ✓ 2 arquivos prontos •                     │  ← FILE PREVIEWS
│  [x] documento.pdf                          │
│  [x] tabela.xlsx                            │
│                                             │
│  [📎] [________________] [➤]                │  ← INPUT AREA
│        "Escreva algo..."                    │
│                                             │
│  Shift+Enter para quebra de linha           │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎨 Seções do SideChat

### 1. **HEADER (Background: tertiary)**
```
┌─────────────────────────────┐
│ [🔍 Search] [━━━━━] [🗑️]   │
│ Procura "conversa"...       │
│ • Conversa 1 - 2h atrás    │
│ • Conversa 2 - 1d atrás    │
└─────────────────────────────┘
```
**Componentes:**
- ChatHistorySearch (left side)
- Trash button (right side)

### 2. **STATUS AREA (Background: muted/5)**
```
┌─────────────────────────────┐
│ ✓ FOCO: Tarefa X            │  (Emerald)
│                             │
│ 🔗 CONTEXTO: Dashboard      │  (Indigo)
│   [✕]                      │
│                             │
│ 📎 ARQUIVO: documento.pdf   │  (NEW!)
│   200KB • "Lorem ipsum..."  │
│   [✕ Limpar]               │
└─────────────────────────────┘
```
**Componentes:**
- Active task indicator
- Active context indicator
- FileContextDisplay (NEW!)

### 3. **MESSAGE AREA (ScrollArea)**
```
┌─────────────────────────────┐
│                             │
│ User → "Ajuda no plano"     │ (right)
│                             │
│ ← Ash: "Claro! Analisando..." (left)
│                             │
│ [⏳] Pensando...            │ (loader)
│                             │
└─────────────────────────────┘
```

### 4. **FILE PREVIEWS (NEW!)**
```
┌─────────────────────────────┐
│ ✓ 2 arquivos prontos:      │
│ ─────────────────────────  │
│ [x] documento.pdf           │
│ [x] tabela.xlsx             │
│                             │
└─────────────────────────────┘
```

### 5. **INPUT SECTION (Footer)**
```
┌─────────────────────────────┐
│                             │
│ MODO: 🎯 Planejar ▼        │
│ "Organiza tarefas..."      │
│                             │
│ [📎] [________] [➤]        │  Upload | Input | Send
│       "Escreva..."         │
│                             │
│ Shift+Enter • ✓ 1 arquivo  │
│                             │
└─────────────────────────────┘
```

---

## 🎯 Modos Disponíveis

```
💬 Chat (default)
   Conversa natural com Ash
   
🎯 Planejar
   Organizar tarefas + timeline
   
✨ Criar
   Brainstorm + estrutura
   
📖 Reflexão
   Análise holística + insights
   
❓ Perguntar
   Q&A rápido e direto
```

---

## 🔄 Fluxo de Interação

```
┌─────────────────────────┐
│  User abre SideChat     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Clica [📎] para upload │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Seleciona arquivo      │
│  validação automática   │
│  processamento...       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  FileContextDisplay     │
│  mostra arquivo anexado │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Seleciona MODO         │
│  dropdown com 5 opções  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Digita mensagem        │
│  Com arquivo em ctx     │
│  Clica Send ou Enter    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  POST /ai/chat com:     │
│  - message content      │
│  - mode (planejar...)   │
│  - files (pdf + text)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Backend processa       │
│  Ash responde com       │
│  conteúdo modo-específico
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Resposta no chat       │
│  User vê resultado      │
└─────────────────────────┘
```

---

## 📱 Responsividade

- ✅ Mobile: 320px+ (layout adapta)
- ✅ Tablet: 768px+ (modo normal)
- ✅ Desktop: 1200px+ (máx width)
- ✅ Dark mode: Fully supported
- ✅ Animations: Smooth + performant

---

## 🎨 Color Palette

| Element | Color | Usage |
|---------|-------|-------|
| Headers | `primary` | Active elements |
| Status | `emerald-500/5` | Task focus |
| Context | `indigo-500/5` | Active context |
| Files | `amber-500/5` | File indicators |
| Input | `muted/10` | Input fields |
| Messages | `primary/10` or `muted/40` | Chat bubbles |

---

## 🚀 Performance Optimizations

- ✅ Memoized components
- ✅ Lazy scroll rendering
- ✅ Framer Motion optimized
- ✅ No re-render on scroll
- ✅ Debounced file processing

---

## 📋 Type Support

**Files aceitos:**
- Documents: PDF, DOCX, DOC, TXT, MD, JSON
- Spreadsheets: XLSX, XLS, CSV
- Presentations: PPTX
- Images: JPG, JPEG, PNG, GIF

**Limits:**
- Max file size: 10MB
- Max files per message: Unlimited (in code)
- Preview length: 150 characters

---

## 🔐 Validations

```javascript
// File validation checklist:
✓ File type whitelist
✓ File size check (< 10MB)
✓ Empty content check
✓ Mode selection validation
✓ Input validation (min 1 char or file)
✓ Mode selector required
```

---

## ✅ Testing Checklist

- [ ] Upload PDF → FileContextDisplay mostra
- [ ] Upload DOCX → Text extraído corretamente
- [ ] Upload Imagem → Preview visual renderiza
- [ ] Mode selector → Todas 5 opções funcionam
- [ ] Digita msg + arquivo → Envia com ambos
- [ ] Histórico search → Carrega conversas
- [ ] Limpar contexto → Remove FileContextDisplay
- [ ] Remover arquivo → Sai da lista
- [ ] Dark mode → UI legível
- [ ] Mobile → Layout adapta

---

**Última Atualização:** 2025-12-18 22:35 UTC  
**Status:** ✅ PHASE 2 COMPLETE

