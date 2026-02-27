# 🏗️ Arquitetura Olly no Prana

## Diagrama da Integração

```
┌─────────────────────────────────────────────────────────────────┐
│                        CAMADA DE APRESENTAÇÃO                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐      ┌──────────────────────┐         │
│  │  OllyChatPanel       │      │OllyCampaignAnalyzer  │         │
│  │  ─────────────────   │      │ ──────────────────   │         │
│  │  • Messages          │      │  • Metrics           │         │
│  │  • File Upload       │      │  • Optimizations     │         │
│  │  • Optimizations     │      │  • Issues            │         │
│  │  • Auto-scroll       │      │  • Apply Actions     │         │
│  └──────────────────────┘      └──────────────────────┘         │
│           │                              │                      │
│           └──────────────┬───────────────┘                      │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CAMADA DE STATE MANAGEMENT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │               OllyProvider (Context)                      │  │
│  │ ────────────────────────────────────────────────────────  │  │
│  │                                                            │  │
│  │  State:                                                    │  │
│  │  • isLoading: boolean                                      │  │
│  │  • error: string | null                                    │  │
│  │  • currentSession: object                                  │  │
│  │  • campaigns: array                                        │  │
│  │  • messages: array                                         │  │
│  │                                                            │  │
│  │  Methods (useOlly):                                        │  │
│  │  • startSession(metadata)                                  │  │
│  │  • chat(message)                                           │  │
│  │  • analyzeFile(file, platform)                             │  │
│  │  • getCampaigns()                                          │  │
│  │  • createAnalysis(campaignId, type)                        │  │
│  │  • getOptimizations(campaignId)                            │  │
│  │  • applyOptimization(id)                                   │  │
│  │  • endSession()                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│           │                                │                     │
└───────────┼────────────────────────────────┼─────────────────────┘
            │                                │
            ▼                                ▼
┌──────────────────────────┐     ┌──────────────────────────┐
│  useOllyIntegration      │     │                          │
│ ──────────────────────── │     │   REST API Client        │
│                          │     │                          │
│ Helper Methods:          │     │ Fetch Wrapper:           │
│ • analyzeCampaign()      │     │ • Headers config         │
│ • chatWithContext()      │     │ • Auth token             │
│ • applyAllOptimizations()│     │ • Error handling         │
│ • clearCache()           │     │ • Response parsing       │
│ • hasCachedAnalysis()    │────▶│ • Timeout handling       │
│ • getCachedAnalysis()    │     │                          │
│                          │     │                          │
│ Cache System:            │     │                          │
│ • Map<key, result>       │     │                          │
│ • Evita duplicatas       │     │                          │
└──────────────────────────┘     └──────────────────────────┘
            │                                │
            └────────────┬───────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE INTEGRAÇÃO                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │        OLLY API (Railway)                                │   │
│  │ https://gracious-hope-production.up.railway.app          │   │
│  │                                                           │   │
│  │  Endpoints:                                               │   │
│  │  • POST   /api/sessions      → Criar sessão             │   │
│  │  • POST   /api/messages      → Enviar mensagem          │   │
│  │  • POST   /api/files         → Upload de arquivo        │   │
│  │  • GET    /api/campaigns     → Listar campanhas         │   │
│  │  • POST   /api/analyses      → Criar análise            │   │
│  │  • GET    /api/optimizations → Obter sugestões          │   │
│  │  • POST   /api/optimizations → Aplicar sugestão         │   │
│  │  • POST   /api/sessions/:id  → Finalizar sessão         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                         │                                        │
└─────────────────────────┼────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS (DATABASE)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  PostgreSQL (Supabase)                                            │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ olly_sessions    │  │ olly_messages    │                     │
│  │ ────────────────  │  │ ────────────────  │                     │
│  │ • session_id (PK)│  │ • message_id (PK)│                     │
│  │ • user_id (FK)   │  │ • session_id (FK)│                     │
│  │ • started_at     │  │ • role           │                     │
│  │ • ended_at       │  │ • content        │                     │
│  │ • metadata       │  │ • timestamp      │                     │
│  └──────────────────┘  └──────────────────┘                     │
│           │                     │                                │
│           └─────────────────────┘                                │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ olly_campaigns   │  │ olly_analyses    │                     │
│  │ ────────────────  │  │ ────────────────  │                     │
│  │ • campaign_id(PK)│  │ • analysis_id(PK)│                     │
│  │ • user_id (FK)   │  │ • campaign_id(FK)│                     │
│  │ • platform       │  │ • analysis_type  │                     │
│  │ • campaign_data  │  │ • results        │                     │
│  │ • status         │  │ • confidence     │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ olly_optimizations│ olly_user_settings│                     │
│  │ ────────────────  │  │ ────────────────  │                     │
│  │ • optim_id (PK)  │  │ • setting_id(PK) │                     │
│  │ • campaign_id(FK)│  │ • user_id (FK)   │                     │
│  │ • suggestions    │  │ • preferences    │                     │
│  │ • priority       │  │ • api_keys       │                     │
│  │ • applied        │  │ • settings       │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐                     │
│  │ olly_files       │  │ olly_audit_log   │                     │
│  │ ────────────────  │  │ ────────────────  │                     │
│  │ • file_id (PK)   │  │ • log_id (PK)    │                     │
│  │ • user_id (FK)   │  │ • user_id (FK)   │                     │
│  │ • filename       │  │ • action         │                     │
│  │ • storage_path   │  │ • entity_type    │                     │
│  │ • file_type      │  │ • changes        │                     │
│  └──────────────────┘  └──────────────────┘                     │
│                                                                   │
│  ┌──────────────────────────────┐                                │
│  │ olly_task_queue              │                                │
│  │ ────────────────────────────  │                                │
│  │ • task_id (PK)               │                                │
│  │ • user_id (FK)               │                                │
│  │ • task_type                  │                                │
│  │ • payload                    │                                │
│  │ • status                     │                                │
│  │ • result                     │                                │
│  └──────────────────────────────┘                                │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fluxo de Dados

### 1️⃣ Chat com Olly
```
User Input
    ↓
OllyChatPanel captures message
    ↓
calls useOlly().chat(message)
    ↓
OllyProvider makes API call
    ↓
OLLY API processes and responds
    ↓
Stores in olly_messages table
    ↓
Updates messages state
    ↓
OllyChatPanel re-renders
    ↓
Message appears in UI
```

### 2️⃣ Análise de Campanha
```
User selects campaign
    ↓
OllyCampaignAnalyzer mounts
    ↓
calls useOlly().createAnalysis()
    ↓
OLLY API analyzes campaign data
    ↓
Stores in olly_analyses table
    ↓
calls useOlly().getOptimizations()
    ↓
Returns suggestions from olly_optimizations
    ↓
Displays metrics and cards
    ↓
User can apply optimizations
```

### 3️⃣ Upload de Arquivo
```
User selects file in OllyChatPanel
    ↓
calls useOlly().analyzeFile()
    ↓
OLLY API receives file
    ↓
Stores file metadata in olly_files
    ↓
Processes file data
    ↓
Returns analysis results
    ↓
Displays optimizations inline
    ↓
User can apply suggestions
```

---

## Componentes Hierarquia

```
App
├── OllyProvider (Context)
│   │
│   ├── Page 1
│   │   ├── OllyChatPanel
│   │   │   └── useOlly()
│   │   │
│   │   └── OllyToggleButton
│   │       └── useOlly()
│   │
│   ├── Page 2
│   │   └── OllyCampaignAnalyzer
│   │       ├── useOlly()
│   │       └── useOllyIntegration()
│   │
│   └── Page 3
│       ├── OllyChatPanel
│       ├── useOllyIntegration()
│       └── Custom components
│           └── useOlly()
```

---

## Fluxo de Estados

### OllyProvider State Machine

```
INITIAL
  ├─ isLoading: false
  ├─ error: null
  ├─ currentSession: null
  ├─ campaigns: []
  └─ messages: []

LOADING_SESSION
  └─ isLoading: true
      └─ startSession()
          ├─ SUCCESS → ACTIVE_SESSION
          └─ ERROR → ERROR_STATE

ACTIVE_SESSION
  ├─ currentSession: object
  ├─ isLoading: false
  ├─ error: null
  └─ Methods available:
      ├─ chat() → UPDATE_MESSAGES
      ├─ analyzeFile() → UPDATE_MESSAGES + OPTIMIZATIONS
      ├─ createAnalysis() → UPDATE_CAMPAIGNS + ANALYSES
      ├─ getOptimizations() → UPDATE_OPTIMIZATIONS
      ├─ applyOptimization() → UPDATE_STATUS
      └─ endSession() → CLOSED_SESSION

ERROR_STATE
  ├─ error: string
  ├─ isLoading: false
  └─ Can retry or start new session

CLOSED_SESSION
  ├─ currentSession: null
  ├─ messages: []
  └─ Can start new session
```

---

## Fluxo de Autenticação

```
┌──────────────────┐
│  User Login      │
│  (Prana Auth)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│  Store Token in          │
│  localStorage            │
│  (prana_token)           │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  OllyProvider mounts     │
│  or startSession()       │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Read token from         │
│  localStorage            │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  Add to API headers:     │
│  Authorization: Bearer   │
│  ${token}                │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  OLLY API validates      │
│  token on each request   │
└────────┬─────────────────┘
         │
    ┌────┴─────┐
    ▼          ▼
┌─────────┐ ┌─────────┐
│ VALID   │ │ INVALID │
│ → OK    │ │ → Error │
└─────────┘ └─────────┘
```

---

## Integração com Prana

### Contexto Global
```
App.jsx
  ├── OllyProvider (wraps entire app)
  ├── BiomeProvider
  ├── AuthProvider
  ├── ThemeProvider
  └── Routes
      ├── Dashboard
      │   ├── OllyChatPanel (right sidebar)
      │   └── useOlly()
      │
      ├── Projects
      │   ├── OllyCampaignAnalyzer
      │   └── useOllyIntegration()
      │
      └── Analytics
          ├── Custom Olly widgets
          └── useOlly()
```

### Compartilhamento de Contextos
```
┌─────────────────────────────┐
│  Prana Auth Context         │
│  • user_id                  │
│  • token                    │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│  OllyProvider               │
│  • Reads user_id for API    │
│  • Uses token for headers   │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Components use useOlly()   │
│  • Have access to state     │
│  • Can trigger methods      │
└─────────────────────────────┘
```

---

## Performance & Cache

### Cache Strategy
```
Client (React)
  │
  ├─ useOllyIntegration()
  │  │
  │  ├─ analysisCache (Map)
  │  │  └─ Key: "analysis_${campaignId}"
  │  │     Value: { analysis, optimizations }
  │  │
  │  └─ hasCachedAnalysis()
  │     clearCache()
  │     getCachedAnalysis()
  │
  ▼
OLLY API
  │
  ├─ Processes request
  ├─ Database lookup
  └─ Returns data
```

### Timing Optimization
```
Time: 0ms    → User clicks "Analyze"
Time: 100ms  → isLoading = true
Time: 500ms  → API processes
Time: 1000ms → Response received
Time: 1050ms → Cache stored
Time: 1100ms → UI updates
Time: 2000ms → Next request uses cache (50ms)
```

---

## Error Handling Flow

```
API Request
    │
    ├─ Network Error
    │  └─ error: "Failed to fetch"
    │     Retry available
    │
    ├─ Auth Error (401)
    │  └─ error: "Unauthorized"
    │     Redirect to login
    │
    ├─ Server Error (5xx)
    │  └─ error: "Server error"
    │     Retry available
    │
    ├─ Validation Error (400)
    │  └─ error: "Invalid input"
    │     Fix and retry
    │
    └─ Success (200)
       └─ Update state
          Display data
```

---

## Deployment Architecture

```
├── Frontend (Vite + React)
│   ├── Components (OllyChatPanel, OllyCampaignAnalyzer)
│   ├── Hooks (useOlly, useOllyIntegration)
│   └── Context (OllyProvider)
│       │
│       └─→ OLLY API
│           (Railway: gracious-hope-production)
│               │
│               └─→ PostgreSQL Database
│                   (Supabase)
│
└── Backend (Node.js)
    ├── setup-olly-db.js (initialization)
    ├── init-olly.sh (automation)
    └── Database migrations
        └─→ PostgreSQL
```

---

## Summary

**Architecture Type**: React Context + REST API  
**State Management**: Context API + Custom Hooks  
**Database**: PostgreSQL (9 tables)  
**Authentication**: Bearer token (localStorage)  
**Caching**: In-memory Map (useOllyIntegration)  
**Performance**: Optimized with cache + lazy loading  
**Error Handling**: Comprehensive with retry logic  

✅ Production-ready integration!
