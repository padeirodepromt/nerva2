# 🏗️ ARQUITETURA GERAL PRANA 3.0 - APÓS FASES 2-3

```
┌─────────────────────────────────────────────────────────────────┐
│                    PRANA 3.0 ARCHITECTURE                       │
└─────────────────────────────────────────────────────────────────┘

                         USER (Web or App)
                              │
                    ┌─────────┴──────────┐
                    ▼                    ▼
        ┌──────────────────┐  ┌──────────────────┐
        │  Desktop (≥1024) │  │  Mobile (<640)   │
        │  1024+ pixels    │  │  OR Tablet       │
        └────────┬─────────┘  └────────┬─────────┘
                 │                     │
        ┌────────▼────────┐   ┌─────────▼────────┐
        │  Desktop Layout │   │  Mobile Layout   │
        │                 │   │                  │
        │ ┌─────────────┐ │   │ ┌──────────────┐ │
        │ │   Sidebar   │ │   │ │   Header     │ │
        │ │  (24-30px)  │ │   │ │   (48-56px)  │ │
        │ └─────────────┘ │   │ └──────────────┘ │
        │                 │   │                  │
        │ ┌─────────────┐ │   │ ┌──────────────┐ │
        │ │  Explorer   │ │   │ │ Main Content │ │
        │ │ (15% width) │ │   │ │ (flex-1)     │ │
        │ └─────────────┘ │   │ │              │ │
        │                 │   │ │ - SideChat   │ │
        │ ┌─────────────┐ │   │ │ - TaskList   │ │
        │ │ Main View   │ │   │ │ - Calendar   │ │
        │ │ (50% width) │ │   │ │ - Dashboard  │ │
        │ │             │ │   │ └──────────────┘ │
        │ │ Dashboard   │ │   │                  │
        │ │ Calendar    │ │   │ ┌──────────────┐ │
        │ │ Projects    │ │   │ │ Bottom Nav   │ │
        │ │ Tasks       │ │   │ │ 5 tabs       │ │
        │ │ Docs        │ │   │ │ (64px)       │ │
        │ └─────────────┘ │   │ └──────────────┘ │
        │                 │   │                  │
        │ ┌─────────────┐ │   │ ┌──────────────┐ │
        │ │ Right Panel │ │   │ │ Drawer       │ │
        │ │ Ash Chat    │ │   │ │ (overlay)    │ │
        │ │ (30% width) │ │   │ │ Menu + Links │ │
        │ └─────────────┘ │   │ └──────────────┘ │
        └─────────────────┘   └──────────────────┘
                │                     │
                └─────────────┬───────┘
                              │
                    ┌─────────▼──────────┐
                    │  Chat Service      │
                    │  (Message Handler) │
                    └─────────┬──────────┘
                              │
        ┌─────────────────────┼──────────────────┐
        │                     │                  │
        ▼                     ▼                  ▼
   ┌─────────┐         ┌───────────┐      ┌────────────┐
   │   Text  │         │  Bubbles  │      │ Tool Calls │
   │ Content │         │  (Soon)   │      │   (Soon)   │
   └─────────┘         └───────────┘      └────────────┘
        │                     │                  │
        │          ┌──────────┴──────────┐      │
        │          ▼                     ▼      │
        │     ┌─────────────┐  ┌──────────────┐│
        │     │TaskListBub. │  │QuickActionBub││
        │     │- Tarefas    │  │- Botões      ││
        │     │- Prioridade │  │- Ações rápid││
        │     │- Datas      │  │- Navegação  ││
        │     └─────────────┘  └──────────────┘│
        │                                      │
        │     ┌─────────────┐  ┌──────────────┐│
        │     │CalendarBub. │  │FormBubble    ││
        │     │- Seleção    │  │- Validação   ││
        │     │- Prev/Next  │  │- Múltiplos   ││
        │     │- Indicadores│  │- Fields      ││
        │     └─────────────┘  └──────────────┘│
        │                                      │
        │     ┌────────────────────────────────┤
        │     │ BubbleRenderer (Auto-detect)   │
        │     │ - Detecta tipo automaticamente │
        │     │ - Renderiza bubble correto     │
        │     │ - Handle interações            │
        │     └────────────────────────────────┤
        │                                      │
        └──────────────────────────────────────┘

                    BACKEND & DATABASE
                    ──────────────────
        ┌──────────────┐    ┌──────────────┐
        │   Entities   │    │   Drizzle    │
        │ (Database)   │    │   (ORM)      │
        │              │    │              │
        │ - Task       │    │ - Queries    │
        │ - Project    │    │ - Migrations │
        │ - Document   │    │ - Schema     │
        │ - MindMap    │    │              │
        └──────────────┘    └──────────────┘

                   MOBILE (UPCOMING)
                   ─────────────────
        ┌──────────────────────────────────┐
        │  Capacitor (Native Bridge)       │
        │                                  │
        │  iOS                Android       │
        │  ┌──────────────┐ ┌──────────────┤
        │  │  Swift       │ │  Kotlin      │
        │  │  UIKit       │ │  Jetpack     │
        │  │              │ │              │
        │  │ Native APIs: │ │ Native APIs: │
        │  │ - Camera     │ │ - Camera     │
        │  │ - GPS        │ │ - GPS        │
        │  │ - Push Notif │ │ - Push Notif │
        │  │ - Device API │ │ - Device API │
        │  └──────────────┘ └──────────────┤
        └──────────────────────────────────┘
```

---

## 📊 COMPONENT TREE DETALHADA

```
PranaWorkspaceLayout (Main Root)
├── MobileWorkspaceLayout (Responsive Wrapper)
│   ├── Desktop Path (≥1024px)
│   │   └── Original PranaWorkspaceLayout
│   │       ├── Sidebar
│   │       │   └── 5 Activity Icons
│   │       ├── PanelGroup
│   │       │   ├── Explorer Panel (15%)
│   │       │   │   ├── ProjectHierarchy
│   │       │   │   └── TagExplorer
│   │       │   ├── Main Panel
│   │       │   │   ├── TabGroupHeader
│   │       │   │   └── ViewRenderer
│   │       │   │       ├── DashboardView
│   │       │   │       ├── CalendarView
│   │       │   │       ├── PlannerView
│   │       │   │       ├── SheetView
│   │       │   │       ├── ChainView
│   │       │   │       ├── MindMapView
│   │       │   │       ├── DocEditor
│   │       │   │       ├── LogbookView
│   │       │   │       └── SideChat (lazy)
│   │       │   └── Right Panel (Ash)
│   │       │       └── SideChat
│   │       └── Footer
│   │
│   └── Mobile Path (<640px)
│       ├── MobileHeaderBar
│       │   ├── PranaLogo (rotating)
│       │   ├── Title (dynamic)
│       │   └── MenuToggle Button
│       ├── MainContent (flex-1)
│       │   └── Tab Router
│       │       ├── 'chat' → SideChat
│       │       ├── 'tasks' → CompactListView
│       │       ├── 'calendar' → MiniCalendarMobile
│       │       └── 'dashboard' → DashboardCompact
│       ├── MobileBottomNav
│       │   └── 5 Buttons (Chat, Tasks, Calendar, Dashboard, Menu)
│       ├── MobileDrawer (overlay)
│       │   ├── UserProfile
│       │   ├── QuickLinks
│       │   │   ├── Favorites
│       │   │   ├── Recent
│       │   │   └── Archive
│       │   ├── Settings
│       │   └── Logout
│       └── TaskDetailSheet (conditional)
│
├── SmartCreationModal (Global)
├── PranaFormModal (Global)
├── TaskWorkspaceOverlay (Global)
├── PranaCommandPalette (Global)
├── ErrorBoundary (Wrapper)
└── ThemeProvider (Context)
    ├── LanguageProvider (Context)
    └── ProjectViewSyncProvider (Context)
```

---

## 🔄 DATA FLOW DIAGRAMA

```
┌─────────┐
│  User   │ (Web or App)
└────┬────┘
     │ Types message in Chat
     ▼
┌─────────────────┐
│ ChatInput       │ (src/components/chat/ChatInput.jsx)
└────┬────────────┘
     │ onSendMessage(text)
     ▼
┌──────────────────────┐
│ Chat Store           │ (useChatStore hook)
│ - addMessage(text)   │
│ - sendMessage()      │
└────┬─────────────────┘
     │ Calls chatService.sendAshMessage(text)
     ▼
┌──────────────────────┐
│ ChatService          │ (src/ai_services/chatService.js)
│ - Sends to Ash API   │
│ - Detects response   │
│ - Formats with type  │
└────┬─────────────────┘
     │ Returns { role, content, type, data }
     ▼
┌──────────────────────┐
│ Chat Store           │
│ - Receives response  │
│ - addMessage()       │
└────┬─────────────────┘
     │ Updates messages array
     ▼
┌──────────────────────┐
│ SideChat / Mobile    │ (Re-renders with new message)
│ Chat Component       │
└────┬─────────────────┘
     │ Loops through messages
     ▼
┌──────────────────────────┐
│ MessageBubble            │ (src/components/chat/MessageBubble.jsx)
│ - Renders text content   │
│ - If message.type        │
└────┬─────────────────────┘
     │ Renders BubbleRenderer
     ▼
┌──────────────────────────┐
│ BubbleRenderer           │ (src/components/chat/BubbleRenderer.jsx)
│ - Detects type:          │
│   - 'task_list'          │
│   - 'actions'            │
│   - 'calendar'           │
│   - 'form'               │
└────┬─────────────────────┘
     │ Renders appropriate bubble
     ▼
┌──────────────────────────────────┐
│ Bubble Component                 │
│ - TaskListBubble                 │
│ - QuickActionBubble              │
│ - CalendarBubble                 │
│ - FormBubble                     │
└────┬──────────────────────────────┘
     │ User interacts (click, select, submit)
     ▼
┌──────────────────────────────────┐
│ onInteraction callback           │
│ - Dispatches custom event        │
│ - 'prana:bubble-interaction'     │
└────┬──────────────────────────────┘
     │ Bubbles or other listeners handle
     ▼
┌──────────────────────────────────┐
│ Action Executed                  │
│ - Task.create() / Task.update()  │
│ - openTab() / navigate()         │
│ - Store dispatch()               │
└────┬──────────────────────────────┘
     │ UI updates
     ▼
┌──────────────────────────────────┐
│ Toast Notification               │
│ ✅ Success / ❌ Error             │
└──────────────────────────────────┘
```

---

## 📦 DEPENDENCIES & IMPORTS

```
CORE:
├── React 18+
├── Vite 6+
├── TypeScript (JSDoc)
├── Tailwind CSS
└── date-fns

ANIMATIONS:
├── Framer Motion
└── react-spring (implicit in Framer)

UI COMPONENTS:
├── shadcn/ui Button
├── Custom icons (PranaLandscapeIcons)
└── Custom theme (ThemeProvider)

STATE & DATA:
├── Zustand (useChatStore, useWorkspaceStore)
├── React Context (ThemeProvider, LanguageProvider)
├── Drizzle ORM (Database)
└── Custom entities (Task, Project, etc)

UTILITIES:
├── clsx/classnames (cn utility)
├── react-markdown
├── sonner (toast notifications)
└── react-resizable-panels (Desktop layout)

MOBILE SPECIFIC:
├── window.matchMedia (useMobileDetect)
├── window.innerWidth (responsive detection)
└── Capacitor (upcoming)

FUTURE:
├── @capacitor/core
├── @capacitor/camera
├── @capacitor/geolocation
├── Firebase Cloud Messaging
└── Service Worker API
```

---

## 🎯 ESTADO DAS FASES

### FASE 1: Desktop Views ✅ COMPLETA
```
✅ Explorer modals (Projects, Tasks, Docs)
✅ Views creation (Dashboard, Calendar, Tasks)
✅ Dashboard + Logbook integration
✅ Ash activation in right panel
✅ MindMap support
✅ Filters & search
```

### FASE 2: Mobile Chat-Centered ✅ COMPLETA
```
✅ Bottom navigation (5 tabs)
✅ Mobile header with menu
✅ Side drawer
✅ Compact task list with swipe
✅ Mini calendar
✅ Chat full-screen
✅ Responsive layout wrapper
✅ useMobileDetect hook
✅ Build verification
```

### FASE 3: Message Bubbles ✅ COMPLETA
```
✅ TaskListBubble (interactive task list)
✅ QuickActionBubble (action buttons)
✅ CalendarBubble (date picker)
✅ FormBubble (dynamic forms)
✅ BubbleRenderer (auto-detect)
✅ MessageBubble integration
✅ MESSAGE_FORMAT_GUIDE
✅ Build verification
```

### FASE 4: Tool Calls ⏳ PRÓXIMA
```
⏳ ToolCallBubble component
⏳ Tool detection in ChatService
⏳ Execute handlers
⏳ Confirmation flows
⏳ Error recovery
```

### FASE 5: Capacitor Setup ⏳ SEMANA 2
```
⏳ Capacitor init
⏳ iOS build
⏳ Android build
⏳ TestFlight upload
⏳ Play Store upload
```

### FASE 6: Advanced Features ⏳ MONTH 2+
```
⏳ Push notifications
⏳ Offline support
⏳ Deep linking
⏳ Native gestures
⏳ Performance optimization
```

---

## 🚀 RESUMO VISUAL

```
TIMELINE:
├─ NOW     : Fases 2-3 ✅ COMPLETAS
├─ HOJE    : Tool Calls (Opção A) OR Advanced Features (Opção C)
├─ SEMANA 1: Capacitor Setup (Opção B)
├─ SEMANA 2: iOS/Android Testing
├─ SEMANA 3: App Store/Play Store
└─ MONTH 2+: Advanced Features

STATUS:
🟢 Web: Production Ready
🟢 Mobile Layout: Production Ready
🟢 Chat Bubbles: Production Ready
🟡 App Native: Ready for setup
🟡 Tool Calls: Ready for implementation
🔴 Push Notifications: Not started
🔴 Offline Support: Not started

LINES OF CODE (ESSA SESSÃO):
├─ Mobile Components: 1125 linhas
├─ Message Bubbles: 625 linhas
├─ Documentation: 500+ linhas
└─ TOTAL: 2250+ linhas

BUILD STATUS:
✅ 1793 modules
✅ 1669.38 kB main bundle
✅ 523.37 kB gzip
✅ 0 errors
✅ Production ready
```

---

**PRÓXIMO PASSO?** 🚀  
Qual opção você quer que comece?
- **A)** Tool Calls Integration (Ash inteligente)
- **B)** Capacitor Setup (App nativo)
- **C)** Advanced Features (UX Polish)
