# 🎨 MAPA DE ÍCONES ARCANOS - SISTEMA VISUAL UNIFICADO V1.0

**Status:** ✅ Planejamento Completo | 🚀 Implementação em Andamento

**Objetivo:** Cada Arcano tem ÚNICO uso exclusivo + padronização visual de headers

---

## 📋 OS 17 ARCANOS + MAPEAMENTO EXCLUSIVO

### Grupo 1: Vistas Principais (8 Arcanos)

| # | Ícone | Nome | Função | Localização | Tamanho | Status |
|---|-------|------|--------|------------|--------|--------|
| 1 | 🎯 | **IconDashboard** | Portal Central / Santuário | Header + Sidebar | 100x100 | ✅ Mapeado |
| 2 | 💬 | **IconChat** | Ash Terminal / IA | Header (Right) + Modal | 24x24 | ✅ Mapeado |
| 3 | 🙏 | **IconSankalpa** | Manifestação / Intenção | Smart Modal Trigger | 40x40 | ⚠️ Precisa toggle state |
| 4 | ⏰ | **IconCronos** | Cronograma / Planner Semanal | Sidebar + Header | 100x100 | ✅ Mapeado |
| 5 | 🌌 | **IconCosmos** | Calendário / Cosmos | Sidebar + Header | 100x100 | ✅ Mapeado |
| 6 | 🔗 | **IconNexus** | Cadeia / Connections | Sidebar + Header | 100x100 | ✅ Mapeado (ChainView) |
| 7 | 📖 | **IconDiario** | Diário / Logbook | Sidebar + Header | 100x100 | ⚠️ Não em Sidebar ainda |
| 8 | 📚 | **IconPapyrus** | Projetos / Documentos | Sidebar + Header | 100x100 | ✅ Mapeado |

### Grupo 2: Recursos & Fluxos (4 Arcanos)

| # | Ícone | Nome | Função | Localização | Tamanho | Status |
|---|-------|------|--------|------------|--------|--------|
| 9 | 🧠 | **IconNeural** | Mind Map / Neural Network | Sidebar + Header | 100x100 | ✅ Mapeado |
| 10 | 👥 | **IconColetivo** | Teams / Coletivo | *Exclusivo para Teams* | 100x100 | ✅ Mapeado |
| 11 | 📊 | **IconMatrix** | Sheet / Data Matrix | Sidebar + Header | 100x100 | ✅ Mapeado |
| 12 | 🌊 | **IconFlux** | Workflow / Fluxo | *Componentes de fluxo apenas* | 24x24 | ✅ Mapeado |

### Grupo 3: Elementais (4 Arcanos) - **NOVOS USOS**

| # | Ícone | Nome | Uso Proposto | Localização | Tamanho | Status |
|---|-------|------|--------|------------|--------|--------|
| 13 | 🌙 | **IconLua** | Luna / Menstrual Cycle Tracking | Feature futura (Modo de Ciclo) | 100x100 | ⏳ Futuro |
| 14 | 🌊 | **IconRio** | Rio / Streams (Dados, Energia) | *Apenas em contextos de fluxo* | 24x24 | ⏳ Futuro |
| 15 | 🔥 | **IconFogo** | Fogo / Spark Ideas | SmartCreationModal (ícone inicial) | 40x40 | ⚠️ Remover QuickButton |
| 16 | ⚡ | **IconZap** | Zap / Energy Burst | *Status indicator de energia* | 24x24 | ⏳ Futuro |

### Especial: Settings & Utilidades

| # | Ícone | Nome | Função | Localização | Tamanho | Status |
|---|-------|------|--------|------------|--------|--------|
| 17 | ⚙️ | **IconSettings** | Configurações | Sidebar + Header | 100x100 | ✅ Mapeado |

---

## 🚨 PROBLEMAS IDENTIFICADOS & SOLUÇÕES

### ❌ Problema 1: IconTree alias duplicado
```javascript
// ATUAL (ERRADO):
export const IconTree = IconColetivo;
```
**Impacto:** Confunde usuários, sugere MindMap usa IconTree mas usa IconNeural
**Solução:** **REMOVER** alias IconTree completamente
**Arquivo:** `/src/components/icons/PranaLandscapeIcons.jsx` (linha 444)

### ❌ Problema 2: Sidebar com QuickCreate duplicados
**Localização:** `/src/components/ui/sidebar.jsx` (linhas 81-86)
```jsx
// ATUAL (4 buttons separados):
<QuickButton icon={IconFogo} ... />
<QuickButton icon={IconList} ... />
<QuickButton icon={IconLayers} ... />
<QuickButton icon={IconFileText} ... />
```
**Impacto:** Sidebar espremida, Fogo não é Arcano (rouba espaço)
**Solução:** **Remover todos**, substituir por **1 botão '+' estilo VS Code** que abre SmartCreationModal

### ❌ Problema 3: DashboardView header quebrado
**Localização:** `/src/views/DashboardView.jsx` (linhas 261-269)
```jsx
// ATUAL (quebrado):
<IconSankalpa className="w-80 h-80" />  // Gigante no background
<h3>... <IconSankalpa className="w-4 h-4" /> Intenção do Dia</h3>
```
**Impacto:** Layout desalinhado, icon muito grande, sem padrão
**Solução:** Padrão claro (icon 100x100 + title centralizado no footer)

### ❌ Problema 4: Sankalpa sempre "ativo"
**Localização:** `/src/components/ui/sidebar.jsx` (linha 71)
```jsx
// ATUAL:
<IconSankalpa className="w-6 h-6" ativo={false} />  // Sempre outline
```
**Impacto:** Usuário não sabe quando Sankalpa está "ativo"
**Solução:** Toggle `ativo={isManifestModalOpen}` quando modal de manifestação está aberto

### ❌ Problema 5: Views sem Arcano no Sidebar
- SankalpaView (falta)
- KanbanView (falta)
- LogbookView (tem como DiarioView mas IconDiario não no Sidebar)
- TeamsView (falta)

**Solução:** Adicionar ao Sidebar com Arcanos apropriados

---

## ✅ PLANO DE AÇÃO (7 PASSOS)

### FASE 1: Limpeza Imediata

**[1.1]** Remover alias IconTree
- Arquivo: `PranaLandscapeIcons.jsx` linha 444
- Remover: `export const IconTree = IconColetivo;`
- Verificar: Nenhum arquivo usa `IconTree` (grep confirma unused)

**[1.2]** Remover QuickCreate buttons da Sidebar
- Arquivo: `sidebar.jsx` linhas 81-86
- Ação: Deletar todo o `<div>` com QuickButton calls
- Adicionar: 1 botão '+' que chama `openSmartModal()`

**[1.3]** Mover QuickCreate buttons para SmartCreationModal
- Arquivo: `SmartCreationModal.jsx`
- Ação: Adicionar ícones IconFogo, IconList, IconLayers, IconFileText como opções visuais no modal
- Tipo: Dropdown visual (estilo grid de opções)

---

### FASE 2: Standardização de Headers (All Views)

**[2.1]** Criar componente `ViewHeader`
```jsx
// /src/components/ViewHeader.jsx
export function ViewHeader({ icon: Icon, title, subtitle = null }) {
  return (
    <div className="flex flex-col items-center gap-4 mb-8">
      <Icon className="w-[100px] h-[100px]" ativo={true} />
      <h1 className="text-3xl font-serif font-bold">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
```

**[2.2]** Aplicar em cada View
- DashboardView → IconDashboard + "Santuário"
- PlannerView → IconCronos + "Cronograma"
- CalendarView → IconCosmos + "Calendário"
- ProjectHub → IconPapyrus + "Projetos"
- MindMapBoardView → IconNeural + "Mapa Mental"
- SheetView → IconMatrix + "Matriz"
- ChainView → IconNexus + "Cadeia"
- DocEditorView → IconPapyrus + "Documentos"
- LogbookView → IconDiario + "Diário"
- SettingsView → IconSettings + "Configurações"

---

### FASE 3: Sidebar Reorganization

**[3.1]** Remover duplication
- Remover: 4 QuickButtons (Fogo, List, Layers, FileText)
- Adicionar: 1 botão '+' central

**[3.2]** Adicionar Views Essenciais
```jsx
// Ordem atual (Sidebar lines 141-165):
Dashboard → Planner → Calendar → Papyrus (Projetos) → List (Inbox) → Neural (MindMap)

// Ordem NOVA (com essential views):
Dashboard → Planner → Calendar → Papyrus (Projetos)
[SEPARATOR]
List (Inbox) → Kanban → Matrix → Coletivo (Teams)
Diario (Logbook) → Neural (MindMap)
```

**[3.3]** Implementar Visual Hierarchy
- Primary: Dashboard, Planner, Calendar (Top 3)
- Secondary: Projetos, Inbox, Kanban
- Tertiary: Matrix, Teams, MindMap, Logbook
- Utilities: Settings (footer)

---

### FASE 4: Sankalpa State Management

**[4.1]** Adicionar state ao Layout
```jsx
// PranaWorkspaceLayout.jsx
const [isManifestModalOpen, setIsManifestModalOpen] = useState(false);

// Pass to Sidebar:
<Sidebar isManifestModalOpen={isManifestModalOpen} ... />
```

**[4.2]** Update Sidebar Sankalpa icon
```jsx
<IconSankalpa 
  className="w-6 h-6" 
  ativo={isManifestModalOpen}  // ← Toggle based on state
/>
```

---

### FASE 5: Remove Non-Prana Icons

**[5.1]** Grep for non-Prana icons
- Search: Emoji patterns (🎯, 📚, etc.)
- Search: Lucide icon imports (if any)
- Search: External icon libraries (if any)

**[5.2]** Replace with Prana equivalents
- Emojis in UI → Remove or replace with Arcanos
- Lucide imports → Replace with PranaLandscapeIcons

---

### FASE 6: DashboardView Header Fix

**[6.1]** Reposition background icon
```jsx
// CURRENT (line 261):
<IconSankalpa className="w-80 h-80" />

// NEW:
<IconSankalpa className="w-64 h-64 opacity-5 absolute -top-20 -right-20" />
```

**[6.2]** Standardize card layout
```jsx
// Use ViewHeader component:
<ViewHeader icon={IconDashboard} title="Santuário" />
```

---

### FASE 7: QA & Validation

**[7.1]** Build verification
```bash
npm run build
# Verify: Zero errors, warnings clean
```

**[7.2]** Icon consistency check
```bash
# For each View:
# - Header icon present
# - Sidebar icon correct
# - No duplicates
# - All Arcanos accounted for
```

**[7.3]** Sankalpa state verification
- Click on Sankalpa button → Icon becomes `ativo`
- Close SmartModal → Icon becomes outline
- Repeat 3x to verify consistency

---

## 🎯 ARCANO USAGE MATRIX (Visual Reference)

```
SIDEBAR VIEWS:
┌─────────────────────────────────────┐
│ 1. Dashboard (IconDashboard)        │
│ 2. Planner (IconCronos)             │
│ 3. Calendar (IconCosmos)            │
│ 4. Projects (IconPapyrus)           │
├─────────────────────────────────────┤
│ 5. Inbox (IconList)                 │
│ 6. Kanban (?) → Maybe new icon?     │
│ 7. Matrix (IconMatrix)              │
│ 8. Teams (IconColetivo)             │
├─────────────────────────────────────┤
│ 9. Logbook (IconDiario)             │
│ 10. MindMap (IconNeural)            │
├─────────────────────────────────────┤
│ 11. Settings (IconSettings)         │
└─────────────────────────────────────┘

MODAL TRIGGERS:
┌──────────────────────────────┐
│ Sankalpa (Manifestar)        │
│ SmartCreationModal icon      │
└──────────────────────────────┘

SPECIAL USES:
┌────────────────────────────┐
│ IconChat: Header right (Ash) │
│ IconFlux: Component icons    │
│ IconRio: Streams/Energy      │
│ IconZap: Energy indicators   │
└────────────────────────────┘
```

---

## 📝 NOTES FOR IMPLEMENTATION

1. **Backward Compatibility:** No breaking changes - all existing Arcano uses remain valid
2. **TypeScript/JS:** No type changes needed, just reorganization
3. **Styling:** Use consistent w-[100px] h-[100px] for view headers
4. **Accessibility:** Ensure `title` attributes on all sidebar buttons
5. **i18n:** Make sure all labels use `t('...')` translations
6. **Git:** Commit each phase separately for clear history

---

## 🔗 RELATED FILES

- `/src/components/icons/PranaLandscapeIcons.jsx` (Main icon library)
- `/src/components/ui/sidebar.jsx` (Sidebar component)
- `/src/views/DashboardView.jsx` (Main view needing header fix)
- `/src/pages/PranaWorkspaceLayout.jsx` (State management parent)
- `/src/components/smart/SmartCreationModal.jsx` (Modal for new items)

---

**Next Step:** Begin Phase 1 (Cleanup) - Remove IconTree alias and QuickCreate buttons
