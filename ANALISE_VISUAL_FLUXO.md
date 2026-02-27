# 📊 SUMÁRIO VISUAL - CONEXÕES SISTEMA

## 🎯 VISÃO RÁPIDA

### STACK DE TECNOLOGIAS

```
┌─────────────────────────────────────────────────────────────────┐
│ CLIENTS                                                         │
├─────────────────────────────────────────────────────────────────┤
│ • React + Vite (Frontend)                                       │
│ • Mobile: Capacitor (iOS/Android)                               │
│ • Axios: HTTP client                                            │
└─────────────────────┬───────────────────────────────────────────┘
                      │ API REST (JSON)
┌─────────────────────▼───────────────────────────────────────────┐
│ EXPRESS SERVER (Node.js)                                        │
├─────────────────────────────────────────────────────────────────┤
│ • Passport.js (Social Auth)                                     │
│ • JWT (Token-based)                                             │
│ • CORS enabled                                                  │
│ • Error handling                                                │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Controllers
┌─────────────────────▼───────────────────────────────────────────┐
│ BUSINESS LOGIC LAYER (34 Controllers)                           │
├─────────────────────────────────────────────────────────────────┤
│ • User/Auth     • Projects  • Tasks      • Documents            │
│ • Teams         • Energy    • Routines   • Integrations        │
│ • Calendar      • Chat      • Files      • Payments             │
└─────────────────────┬───────────────────────────────────────────┘
                      │ Drizzle ORM
┌─────────────────────▼───────────────────────────────────────────┐
│ DATABASE LAYER (Postgres - Supabase)                            │
├─────────────────────────────────────────────────────────────────┤
│ • 50+ Tables    • Foreign keys  • JSONB support                │
│ • Cascades      • Indexes       • Transactions                 │
│ • Schemas por domínio (core, planning, docs, energy...)        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🗺️ MAPA MENTAL - DOMÍNIOS DO SISTEMA

```
PRANA 3.0
├── IDENTITY
│   ├── Users
│   ├── Auth (JWT + Social)
│   └── Profiles (Astral, Menstrual)
│
├── ORGANIZATION
│   ├── Projects (Hierarchical)
│   ├── Teams
│   ├── Plans/Subscriptions
│   └── Custom Fields
│
├── EXECUTION
│   ├── Tasks
│   ├── Routines
│   ├── Sankalpas (Goals)
│   ├── Weekly Tasks
│   └── Check-ins
│
├── KNOWLEDGE
│   ├── Documents (Papyrus)
│   ├── Versions (Snapshots)
│   ├── Mind Maps (Nexus)
│   └── Tags
│
├── INSIGHTS
│   ├── Energy Tracking
│   ├── Mood Distribution
│   ├── AI Analytics (Ash)
│   └── Holistic Dashboard
│
├── COLLABORATION
│   ├── Teams/Members
│   ├── Shared Projects
│   ├── Chat/Messages
│   └── Comments
│
└── INTEGRATIONS
    ├── Google Calendar
    ├── GitHub
    ├── Stripe Payments
    └── OAuth Providers
```

---

## 📡 FLUXO DE DADOS - EXEMPLOS

### Exemplo 1: Criar Tarefa com Sincronização de Calendário

```
User clicks "New Task" in Frontend
        │
        ├─ Frontend validates input
        │
        └─ POST /api/tasks
           {
             title: "Meditação",
             projectId: "proj_123",
             dueDate: "2026-02-20",
             energyLevel: "high",
             ownerId: "user_456"
           }
           │
           ├─ Server.JS routes to taskController.create()
           │
           ├─ taskController
           │  ├─ Creates task record in DB
           │  ├─ Checks if user has Google Calendar connected
           │  └─ Syncs event via GoogleCalendarService
           │      └─ Stores googleEventId back in task
           │
           └─ returns: { id, title, googleEventId, ... }

User sees task in both Frontend AND Google Calendar
```

### Exemplo 2: Dashboard de Energia - Ler Dados

```
User opens Energy Dashboard
        │
        ├─ Frontend calls Papyrus.getHolisticStats()
        │  └─ GET /api/holisticStats
        │
        ├─ papyrusController fetches:
        │  ├─ all diaries by authorId
        │  ├─ calculates energyAverage
        │  ├─ groups moods by week
        │  └─ extracts top tags
        │
        └─ returns: { energyAverage, moods, topTags, ... }

Dashboard renders charts with real-time insights
```

### Exemplo 3: Multi-Realm Filtering

```
User with PERSONAL realm tries to access document
        │
        ├─ Request: GET /api/documents/:id?realmId=personal
        │
        ├─ papyrusController.getDocumentById():
        │  ├─ Extracts realmId from params
        │  ├─ Queries with WHERE
        │  │   documentId = :id AND
        │  │   (realmId = :realmId OR realmId = 'all')
        │  │
        │  └─ Returns only PERSONAL or ALL documents
        │
        └─ Isolation successful - no cross-realm leaks
```

---

## 🔄 SEQUENCE DIAGRAM - Fluxo de Login

```
┌─────────┐                 ┌────────────┐                 ┌──────────┐
│ Frontend│                 │   Server   │                 │Database  │
└────┬────┘                 └─────┬──────┘                 └────┬─────┘
     │ POST /api/auth/login       │                             │
     │ {email, password}          │                             │
     │─────────────────────────>  │                             │
     │                            │                             │
     │                            │ SELECT * FROM users         │
     │                            │ WHERE email = ?             │
     │                            │────────────────────────────>│
     │                            │                             │
     │                            │ [user record]               │
     │                            │<────────────────────────────│
     │                            │                             │
     │                            │ bcrypt.compare(pwd, hash)   │
     │                            │ (validates in memory)       │
     │                            │                             │
     │                            │ jwt.sign({id, email})       │
     │                            │ (generates token)           │
     │                            │                             │
     │ {user, token}              │                             │
     │<────────────────────────────                             │
     │                                                          │
     │ Store token in localStorage                              │
     │ Add "Authorization: Bearer <token>" to next requests     │
```

---

## 🛡️ SEGURANÇA - Fluxo de Autenticação

```
Request with Token
        │
        ├─ Server receives request
        │
        ├─ authMiddleware.authenticate()
        │  ├─ Extracts token from "Authorization" header
        │  ├─ Calls jwt.verify(token, JWT_SECRET)
        │  ├─ If valid: extracts { id, email } from payload
        │  ├─ Sets req.user = { id, email }
        │  └─ Calls next() to proceed
        │
        ├─ If invalid:
        │  └─ Returns 401 Unauthorized
        │
        └─ Controller can trust req.user.id as source-of-truth
```

---

## 📊 TABELAS - Principais Relacionamentos

### Hierarquia de Projetos

```
projects (projects.id = "proj_1")
├─ parentId = null (ROOT)
│
└─ children (parentId = "proj_1")
   ├─ proj_2
   ├─ proj_3
   └─ proj_3
      └─ children (parentId = "proj_3")
         └─ proj_4
```

### Versionamento de Documentos

```
papyrusDocuments (id = "doc_1")
├─ currentVersion = 3
│
└─ papyrusVersions
   ├─ version 1 (Genesis - initial creation)
   ├─ version 2 (First update)
   └─ version 3 (Latest - current content)
```

### Linking Dinâmico (File-Task Association)

```
tasks (id = "task_1")
├─ fileId = "doc_5" (FK → papyrusDocuments)
│
└─ fileTaskAssociation
   ├─ taskId: "task_1"
   ├─ fileId: "doc_5"
   └─ metadata: { position, notes, ... }
```

### Multi-Realm Filtering

```
Any Entity (users, projects, tasks, documents...)
├─ realmId = "personal"   (isolated space)
├─ realmId = "professional" (another isolated space)
└─ realmId = "all"        (shared/global)

Query pattern:
WHERE (realmId = "personal" OR realmId = "all")
```

---

## 🎭 PADRÕES DE DESIGN UTILIZADOS

| Padrão | Localização | Uso |
|--------|------------|-----|
| **Controller** | src/api/controllers/ | Lógica de negócio |
| **Router** | src/api/*Routes.js | Mapeamento de endpoints |
| **Middleware** | authMiddleware.js | Cross-cutting concerns |
| **Service** | src/services/ | Integrações externas |
| **Repository** | Drizzle ORM | Data access abstraction |
| **Factory** | createId() | ID generation |
| **Strategy** | documentType (note\|diary) | Comportamento condicional |

---

## 📈 DISTRIBUIÇÃO DE RESPONSABILIDADES

```javascript
// FRONTEND
// Responsabilidades:
// - Renderização UI
// - Form validation
// - User interaction handling
// - State management (Redux/Zustand)
// - API calls via clients (Papyrus, Tasks, etc)

// BACKEND SERVER
// Responsabilidades:
// - Route matching
// - Request/Response handling
// - CORS, compression, security headers
// - Authentication (JWT validation)
// - Error handling

// CONTROLLERS
// Responsabilidades:
// - Business logic
// - Data validation
// - Database queries
// - External service integration
// - Response formatting

// DATABASE
// Responsabilidades:
// - Data persistence
// - Transaction management
// - Constraint enforcement
// - Indexing for performance
// - Backup & recovery
```

---

## 🚀 INICIALIZAÇÃO DO SISTEMA

### Startup Sequence

```
1. npm start
   └─ Loads .env variables

2. server.js initializes
   ├─ Creates Express app
   ├─ Sets middlewares (CORS, JSON parser, Passport)
   └─ Registers route handlers

3. Database connection
   ├─ Drizzle connects to Postgres
   └─ Loads all schemas from schema/

4. Routes mounted
   ├─ authRoutes (open)
   ├─ [authenticate middleware]
   ├─ entityRoutes (protected)
   ├─ aiRoutes (protected)
   ├─ energyRoutes (protected)
   └─ ... more protected routes

5. Vite server bound
   └─ Frontend dev server running on :5173

6. Server listening on :3000
```

---

## 🔍 DEBUGGING GUIDE

### To find which controller handles a route:

```javascript
// 1. Find route in entityRoutes.js
GET /api/tasks/:id → taskController.getById(req, res)

// 2. Open taskController.js
export const taskController = {
  async getById(req, res) { ... }
}

// 3. Trace execution
// ├─ Extract id from req.params.id
// ├─ Query database
// └─ Return response
```

### Common Error Patterns:

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Missing JWT token | Check Authorization header |
| 404 Not Found | Route doesn't exist | Check server.js route order |
| ReferenceError: realmId | Variable not extracted | Extract from req.params/body |
| Foreign key violation | Referencing deleted record | Check cascade delete rules |
| CORS error | Wrong origin | Check CORS config in server.js |

---

## 📋 CONTROLLER CHECKLIST

Quando criar novo controller, seguir:

```javascript
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { createId } from '../../utils/id.js';

export const myController = {
  
  // LIST - com filtros realmId
  async list(req, res) {
    try {
      const { realmId } = req.query;
      // Query com filtro realmId
      res.json(results);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // GET - por ID com validação realmId
  async get(req, res) {
    try {
      const { id, realmId } = req.params;
      // Query onde id + realmId
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // CREATE - com autenticação do usuário
  async create(req, res) {
    try {
      const { realmId, ... } = req.body;
      const userId = req.user.id; // Source of truth
      // Insert com userId validado
      res.status(201).json(created);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // UPDATE - idempotente
  async update(req, res) {
    try {
      const { id, realmId } = req.params;
      // Update com validação owner/realmId
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  
  // DELETE - com cascata
  async delete(req, res) {
    try {
      const { id, realmId } = req.params;
      // Delete com FK constraints
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
```

---

## 📚 DOCUMENTAÇÃO REFERENCIADA

| Arquivo | Propósito |
|---------|-----------|
| server.js | Entry point + route registration |
| src/db/index.js | Database connection |
| src/db/schema/* | Table definitions |
| src/api/entityRoutes.js | Auth routes + protected routes |
| src/api/authMiddleware.js | JWT validation |
| src/api/controllers/*.js | Business logic |
| src/api/papyrus.js | Frontend API client |

---

**Diagrama Visual Completo**  
*Use este documento como mapa de referência rápida para entender fluxos*
