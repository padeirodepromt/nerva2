# 📊 ANÁLISE ARQUITETURA - CONTROLLERS, BANCO DE DADOS E FRONTEND

**Data:** 16 de Fevereiro de 2026  
**Status:** Relatório de Análise Completa  
**Versão do Sistema:** Prana 3.0

---

## 🎯 RESUMO EXECUTIVO

O sistema Prana 3.0 é uma aplicação full-stack baseada em:
- **Backend:** Express.js + Drizzle ORM (PostgreSQL/Supabase)
- **Frontend:** Vite + React (Single Page Application)
- **Arquitetura:** MVC com separação clara entre Controllers, Routes e Database Schema
- **Autenticação:** JWT + Passport.js (login social)
- **Padrão de Isolamento:** Multi-realm (personal/professional)

---

## 🏗️ ARQUITETURA DE CAMADAS

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (React + Vite)                                 │
│ └─ src/api/papyrus.js (API Client)                     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼────────────────────────────────────┐
│ EXPRESS SERVER (server.js)                              │
│ ├─ Middlewares (CORS, JWT Auth, Body Parser)            │
│ ├─ Routes (entityRoutes, aiRoutes, energyRoutes...)     │
│ └─ Error Handler                                        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ CONTROLLERS (src/api/controllers/)                       │
│ └─ Lógica de negócio para cada entidade                │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ DATABASE LAYER (Drizzle ORM)                            │
│ └─ Query Builder & Type Safety                          │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────┐
│ POSTGRESQL (Supabase)                                   │
│ └─ Tables: users, projects, tasks, documents...         │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 CONTROLLERS DISPONÍVEIS (34 Total)

### **CORE CONTROLLERS**

| Controller | Funções Principais | Responsabilidades |
|------------|-------------------|-------------------|
| **userController.js** | `register()`, `login()`, `getMe()`, `update()` | Autenticação, perfil de usuário |
| **projectController.js** | `list()`, `get()`, `create()`, `update()`, `delete()` | Gestão de projetos (hierárquicos) |
| **taskController.js** | `list()`, `create()`, `update()`, `delete()`, `setCustomFieldValue()` | Tarefas, integração Google Calendar |
| **teamController.js** | `list()`, `create()`, `get()`, `addMember()` | Equipes e colaboração |
| **papyrusController.js** | `getDocumentsByProject()`, `createDocument()`, `updateDocument()`, `getDocumentVersions()` | Documentos com versionamento |

### **ESPECIALIZADOS (Energy & Health)**

| Controller | Funções Principais | Responsabilidades |
|------------|-------------------|-------------------|
| **menstrualCycleController.js** | Rastreamento de ciclos | Saúde menstrual |
| **astralProfileController.js** | Perfil astrológico | Astrologia & Human Design |
| **checkInController.js** | Check-ins de energia | Registros de estado |
| **routineController.js** | `list()`, `create()`, `update()` | Rotinas diárias |
| **sankalpaController.js** | `list()`, `create()` | Propósitos & intenções |

### **FLUXO & INTEGRAÇÃO**

| Controller | Funções Principais | Responsabilidades |
|------------|-------------------|-------------------|
| **kanbanController.js** | `listStatuses()`, `reorder()` | Visualização Kanban |
| **nexusController.js** | `getHistory()`, `getConnections()` | Conexões entre entidades |
| **mindMapController.js** | Mind maps visuais | Visualização de ideias |
| **fileTaskAssociationController.js** | Associar files/tarefas | Linking dinâmico |
| **customFieldController.js** | Campos dinâmicos | Extensibilidade de entidades |

### **INTEGRAÇÕES & SISTEMA**

| Controller | Funções Principais | Responsabilidades |
|------------|-------------------|-------------------|
| **authController.js** | `getMe()` | Dados autenticado |
| **importController.js** | Importação de dados | Data migration |
| **integrationController.js** | OAuth, calendários | Integrações externas |
| **githubIntegrationController.js** | GitHub sync | Sincronização GitHub |
| **googleIntegrationController.js** | Google Calendar | Calendário Google |
| **paymentController.js** | Stripe, faturas | Payments & subscriptions |
| **recordController.js** | Project records | Registros dinâmicos |
| **tagsController.js** | Gestão de tags | Categorização |

### **OTHERS (Admin & Utilities)**

| Controller | Funções Principais | Responsabilidades |
|------------|-------------------|-------------------|
| **eventController.js** | Eventos & datas | Calendário de eventos |
| **goalController.js** | Objetivos | Gestão de metas |
| **templateController.js** | Modelos de projetos | Templates reutilizáveis |
| **projectTemplatesController.js** | Templates avançados | Modelos especializados |
| **projectViewController.js** | `getSheetView()`, `getKanbanView()` | Diferentes visualizações |
| **week lyTaskController.js** | Tarefas semanais | Planejamento semanal |
| **projectFieldsController.js** | Campos de projeto | Customização de projetos |
| **projectWorkflowsController.js** | Workflows | Automações |
| **plannerController.js** | Planejador visual | Visualização semanal |
| **thoughtController.js** | Notas rápidas | Capture de ideias |
| **associationController.js** | Relações entre entidades | Mapeamento relacional |

---

## 🗄️ BANCO DE DADOS - SCHEMA ESTRUTURADO

### **Estrutura de Arquivos de Schema**

```
src/db/schema/
├── core.js           # Users, Projects, Templates, Plans, Tags
├── planning.js       # Tasks, Routines, Sankalpas, WeeklyTasks, ProjectRecords
├── docs.js          # PapyrusDocuments, Versions, MindMaps, MindMapNodes
├── energy.js        # EnergyCheckins, AstralProfiles, MenstrualCycles
├── chat.js          # Messages, Nexus, Conversations
├── collab.js        # TeamMessages, Permissions
├── agents.js        # AI Agents, Prompts, History
├── calendar.js      # Calendar Events
├── associations.js  # Relationships between entities
├── inventory.js     # Inventory management
├── finance.js       # Financial records
└── logs.js          # Audit logs
```

### **TABELAS PRINCIPAIS**

#### **CORE (users, projects, teams)**

```javascript
// users
├─ id (PK)
├─ name, email, password_hash
├─ avatarUrl, credits
├─ realmId (personal|professional)
├─ planType (SEED|FLUX|FOREST|MOUNTAIN)
├─ subscriptionId, planExpiresAt
├─ role, aiSettings, dashboardPreferences
└─ timestamps

// projects
├─ id (PK)
├─ name, description, status
├─ ownerId (FK: users)
├─ parentId (hierarquia de subprojetos)
├─ type (personal|professional)
├─ isShared, realmId
├─ customFields (JSONB)
└─ timestamps

// teams
├─ id (PK)
├─ name, description
├─ ownerId (FK: users)
├─ members (JSON array)
└─ timestamps
```

#### **PLANNING (tasks, routines, sankalpas)**

```javascript
// tasks
├─ id, realmId
├─ title, description
├─ status (todo|in_progress|done|waiting|archived|inbox)
├─ priority (low|medium|high|urgent)
├─ projectId (FK: projects)
├─ ownerId (FK: users)
├─ dueDate, completedAt
├─ energyLevel, estimatedHours
├─ checklist, tags, energyTags (JSONB)
├─ recurrence, customData (JSONB)
├─ fileId (FK: papyrusDocuments, linking)
└─ timestamps

// routines
├─ id, name, description
├─ recurrence pattern (JSONB)
├─ createdBy (FK: users)
├─ realmId
└─ timestamps

// sankalpas (propósitos)
├─ id, title, description
├─ userId (FK: users)
├─ energyCharge (valor numérico)
├─ createdAt
└─ completedAt

// projectRecords
├─ id, projectId (FK: projects)
├─ title
├─ properties (JSONB - colunas dinâmicas)
├─ realmId
└─ timestamps
```

#### **DOCS (documentos com versioning)**

```javascript
// papyrusDocuments
├─ id, projectId (FK: projects)
├─ title, content/fileUrl
├─ documentType (note|diary|agreement|manifest|guide|code)
├─ authorId (FK: users)
├─ realmId
├─ energyLevel, mood, tags, insights
├─ currentVersion
└─ timestamps

// papyrusVersions
├─ id, documentId (FK: papyrusDocuments)
├─ content, versionNumber
├─ changeLog, modifiedBy (FK: users)
├─ realmId
└─ createdAt

// mindMaps
├─ id, title
├─ projectId (FK: projects)
├─ createdBy (FK: users)
└─ timestamps

// mindMapNodes & mindMapEdges
├─ Para estruturas visuais do Nexus
```

#### **ENERGY (dados holisticos)**

```javascript
// energyCheckins
├─ id, userId (FK: users)
├─ energyLevel (1-5)
├─ mood, intensity
├─ realmId
└─ timestamp

// astralProfiles
├─ id, userId (FK: users)
├─ birthDate, birthTime, birthLocation
├─ zodiacSign, chart data (JSONB)
└─ createdAt

// menstrualCycles
├─ id, userId (FK: users)
├─ phase, startDate, endDate
├─ symptoms, notes
└─ timestamps
```

---

## 🔄 FLUXO DE REQUISIÇÕES - EXEMPLO

### **CASO 1: Criar uma Tarefa**

```
FRONTEND (React)
    ↓
    POST /api/tasks
    {
      title: "Meditação matinal",
      projectId: "proj_123",
      dueDate: "2026-02-20",
      energyLevel: "high",
      ownerId: "user_123"
    }
    ↓
SERVER.JS
    ├─ Verifica rota: /api/tasks (match em entityRoutes)
    ├─ Aplica middleware: authenticate (JWT)
    └─ Enrota para taskController.create()
    ↓
TASKCONTROLLER.JS (create)
    ├─ Valida dados: ownerId obrigatório
    ├─ Cria objeto newTaskData (com realmId)
    ├─ Insere em DB: await db.insert(tasks).values(newTaskData)
    ├─ [INTEGRAÇÃO] Se houver Google Calendar conectado:
    │   └─ Sincroniza evento via GoogleCalendarService
    └─ Retorna: { savedTask }
    ↓
DATABASE (Drizzle → PostgreSQL)
    └─ INSERT INTO tasks (id, title, projectId, ...) VALUES (...)
    ↓
RESPONSE → FRONTEND
    ├─ Status 201
    └─ Body: { id, title, projectId, ... }
```

### **CASO 2: Buscar Documentos de um Projeto**

```
FRONTEND (papyrus.js)
    ↓
    GET /api/papyrus/project/proj_123
    ↓
SERVER.JS
    ├─ Rota: /documents (match em entityRoutes)
    ├─ Middleware: authenticate
    └─ Enrota para papyrusController.getDocumentsByProject()
    ↓
PAPYRUSCONTROLLER.JS
    ├─ Extrai: projectId, realmId dos params
    ├─ Query: SELECT * FROM papyrus_documents
    │         WHERE projectId = ? AND (realmId = ? OR realmId = 'all')
    └─ Retorna array de documentos
    ↓
RESPONSE → FRONTEND
    └─ [{ id, title, content, energyLevel, mood, ... }, ...]
```

---

## 🛣️ MAPA DE ROTAS PRINCIPAIS

### **ROTAS ABERTAS (Sem Autenticação)**

```
POST   /api/auth/register          → userController.register()
POST   /api/auth/login             → userController.login()
GET    /api/health                 → Health check
```

### **ROTAS AUTENTICADAS (Requerem JWT)**

#### **Usuários**
```
GET    /api/users                  → userController.list()
POST   /api/users                  → userController.create()
GET    /api/me                     → authController.getMe()
```

#### **Projetos**
```
GET    /api/projects               → projectController.list()
GET    /api/projects/:id           → projectController.get()
POST   /api/projects               → projectController.create()
PUT    /api/projects/:id           → projectController.update()
DELETE /api/projects/:id           → projectController.delete()

GET    /api/projects/:id/views/sheet     → projectViewController.getSheetView()
GET    /api/projects/:id/views/kanban    → projectViewController.getKanbanView()
GET    /api/projects/:id/sheet-columns   → projectViewController.getSheetColumns()
PUT    /api/projects/:id/sheet-columns   → projectViewController.updateSheetColumns()
```

#### **Tarefas**
```
GET    /api/tasks                  → taskController.list()
GET    /api/tasks/:id              → taskController.getById()
POST   /api/tasks                  → taskController.create()
PUT    /api/tasks/:id              → taskController.update()
DELETE /api/tasks/:id              → taskController.delete()

POST   /api/tasks/:id/custom-fields       → taskController.setCustomFieldValue()
GET    /api/tasks/:id/custom-fields       → taskController.getCustomFieldValue()
```

#### **Documentos (Papyrus)**
```
GET    /api/documents              → papyrusController.getDocumentsByProject()
GET    /api/documents/:id          → papyrusController.getDocumentById()
POST   /api/documents              → papyrusController.createDocument()
PUT    /api/documents/:id          → papyrusController.updateDocument()
DELETE /api/documents/:id          → papyrusController.deleteDocument()
GET    /api/documents/:id/versions → papyrusController.getDocumentVersions()
```

#### **Kanban & Nexus**
```
GET    /api/kanban/statuses        → kanbanController.listStatuses()
PUT    /api/kanban/reorder         → kanbanController.reorder()

GET    /api/nexus/history          → nexusController.getHistory()
GET    /api/nexus/connections      → nexusController.getConnections()
```

#### **Planejamento**
```
GET    /api/routines               → routineController.list()
POST   /api/routines               → routineController.create()
PUT    /api/routines/:id           → routineController.update()
DELETE /api/routines/:id           → routineController.delete()

GET    /api/sankalpas              → sankalpaController.list()
POST   /api/sankalpas              → sankalpaController.create()

GET    /api/weekly-tasks           → weeklyTaskController.list()
POST   /api/weekly-tasks           → weeklyTaskController.create()
```

#### **Energia & Health**
```
GET    /api/energy/checkins        → energy routes
POST   /api/energy/checkins        → energy routes

GET    /api/menstrual-cycle        → menstrual cycle routes
```

#### **Teams & Colaboração**
```
GET    /api/teams                  → teamController.list()
POST   /api/teams                  → teamController.create()
```

#### **Integrações**
```
GET    /api/integrations           → integrationController.*
POST   /api/integrations/github    → githubIntegrationController.*
POST   /api/integrations/google    → googleIntegrationController.*
```

#### **AI & Agents**
```
GET    /api/agents                 → agentRoutes
POST   /api/ai/chat                → AI chat
```

#### **Dashboard & Analytics**
```
GET    /api/holisticStats          → papyrusController.getHolisticStats()
GET    /api/topTags                → papyrusController.getTopTags()
GET    /api/recentDiaries          → papyrusController.getRecentDiaries()
GET    /api/ashInsights            → papyrusController.getAshInsights()
```

---

## 🔗 CONEXÕES FRONTEND ↔ BACKEND

### **API Client Pattern (src/api/papyrus.js)**

```javascript
export const Papyrus = {
  // GET /api/papyrus/:id
  get: async (id) => apiClient.get(`/papyrus/${id}`),
  
  // GET /api/papyrus/project/:projectId
  listByProject: async (projectId) => apiClient.get(`/papyrus/project/${projectId}`),
  
  // POST /api/papyrus (com payload: title, content, projectId, authorId)
  create: async (payload) => apiClient.post('/papyrus', payload),
  
  // PUT /api/papyrus/:id (com payload: content, title, changeLog, userId)
  update: async (id, payload) => apiClient.put(`/papyrus/${id}`, payload),
  
  // DELETE /api/papyrus/:id
  delete: async (id) => apiClient.delete(`/papyrus/${id}`)
};
```

### **Modelo de Resposta da API**

```javascript
// Sucesso (201, 200)
{
  "id": "doc_xxx",
  "title": "Meu Documento",
  "content": "...",
  "projectId": "proj_123",
  "authorId": "user_456",
  "documentType": "diary",
  "energyLevel": 4,
  "mood": "joy",
  "createdAt": "2026-02-16T10:30:00Z",
  ...
}

// Erro (4xx, 5xx)
{
  "error": "Mensagem de erro descritiva"
}
```

---

## ⚠️ PROBLEMAS IDENTIFICADOS & ANÁLISE CRÍTICA

### **🔴 CRÍTICO: Bug em papyrusController.js**

**Localização:** [papyrusController.js](papyrusController.js#L72)

**Problema:** Variável `realmId` usada sem estar definida

```javascript
// ERRO - Linha 72 em getDocumentById()
const [doc] = await db.select()
  .from(schema.papyrusDocuments)
  .where(and(
    eq(schema.papyrusDocuments.id, req.params.id),
    // realmId não foi extraído de req.params!
    realmId && realmId !== 'all' 
      ? eq(schema.papyrusDocuments.realmId, realmId) 
      : undefined
  ));
```

**Mesma Falha em:**
- `getDocumentVersions()` (linha ~88)
- `updateDocument()` (linha ~119)
- `deleteDocument()` (linha ~131)

**Impacto:** ReferenceError em tempo de execução quando essas funções forem chamadas

**Solução Recomendada:**
```javascript
// CORRETO
const { id, realmId } = req.params;  // Extrair realmId
const [doc] = await db.select()
  .from(schema.papyrusDocuments)
  .where(and(
    eq(schema.papyrusDocuments.id, id),
    realmId && realmId !== 'all' 
      ? eq(schema.papyrusDocuments.realmId, realmId) 
      : undefined
  ));
```

---

### **🟡 INCONSISTÊNCIAS: Padrão de realmId**

**Situação:** A implementação de `realmId` não é uniforme:

| Controller | realmId Handling | Status |
|------------|-----------------|--------|
| userController | ✅ Consistente | Bem implementado |
| projectController | ✅ Consistente | Bem implementado |
| taskController | ✅ Consistente | Bem implementado |
| papyrusController | ❌ Bugado | Falha em 3+ métodos |
| routineController | ⚠️ Verificar | Precisa auditoria |
| eventController | ⚠️ Verificar | Precisa auditoria |

**Explicação:** `realmId` é o campo de isolamento multi-tenant. Deve estar em:
- req.body (ao criar)
- req.params (ao atualizar/deletar)
- req.query (ao listar)

---

### **🟡 ANÁLISE: Autenticação Incompleta**

**Observação:** Alguns controllers não validam `req.user`:

```javascript
// BAD - taskController.create() não valida req.user.id
const ownerId = req.body.ownerId || req.body.userId; // Pode vir de cliente

// GOOD - userController.register() valida via middleware JWT
async getMe(req, res) {
  const userId = req.user.id; // Vem do token decodificado
}
```

**Recomendação:** Controllers CRUD devem usar `req.user.id` como source-of-truth

---

### **🟡 DESIGN: Papyrus - Nomenclatura Confusa**

**Problema:** Inconsistência nas rotas de documentos:

```javascript
// entityRoutes.js usa /documents
GET    /api/documents              → getDocumentsByProject()
POST   /api/documents              → createDocument()

// Mas papyrus.js (frontend) usa /papyrus
GET    /papyrus/:id                → get()
POST   /papyrus                    → create()
```

**Impacto:** Confusão entre `/documents` e `/papyrus` endpoints

**Solução:** Unificar para apenas um prefixo (recomendo `/papyrus`)

---

### **🟡 ANÁLISE: Integração Google Calendar**

**Localização:** taskController.js (linhas 60-80)

**Funcionalidade:** Tasks com dueDate disparam sincronização automática com Google Calendar

**Potencial Problema:** 
- Sem validação se usuário tem Google conectado
- Sem tratamento de erro se falhar sincronização
- googleEventId não é sempre populado de volta

**Status:** Funcional mas poderia ser robusto

---

### **🟢 BOAS PRÁTICAS IMPLEMENTADAS**

✅ **Separação de Responsabilidades:** Controllers isolados por domínio  
✅ **Type Safety:** Drizzle ORM com tipos Postgres  
✅ **Versionamento de Documentos:** Snapshots automáticos em papyrusVersions  
✅ **Multi-realm:** Isolamento de dados por espaço (personal|professional)  
✅ **Middleware JWT:** Autenticação centralizada  
✅ **Error Handling:** Try-catch em controllers  
✅ **Relacionamentos:** Foreign keys e cascades definidos  

---

## 📊 ESTATÍSTICAS DO SISTEMA

| Métrica | Quantidade |
|---------|-----------|
| Controllers | 34 |
| Tabelas de Schema | ~50+ |
| Endpoints REST | ~80+ |
| Relacionamentos DB | ~30+ |
| Integrações Externas | 3 (Google, GitHub) |
| Padrões de Auth | 2 (JWT + Social) |

---

## 🔐 SEGURANÇA & PERFORMANCE

### **Segurança:**
- ✅ JWT tokens (validação em authenticate middleware)
- ✅ Password hashing (bcryptjs)
- ✅ CORS configurado
- ✅ Foreign key constraints no DB
- ⚠️ Falta: Rate limiting
- ⚠️ Falta: Input validation/sanitization

### **Performance:**
- ✅ Índices em Fields principais (id, foreignKeys)
- ✅ JSONB para dados semi-estruturados
- ⚠️ Falta: Caching (Redis)
- ⚠️ Falta: Paginação em listagens grandes
- ⚠️ Falta: Database query optimization logging

---

## 📋 CHECKLIST DE VERIFICAÇÃO

| Item | Status |
|------|--------|
| Controllers existem | ✅ |
| Rotas mapeadas | ✅ |
| Schema definido | ✅ |
| Middleware auth | ✅ |
| Frontend client | ✅ |
| Error handling | ⚠️ Parcial |
| Validação input | ⚠️ Parcial |
| Logging | ❌ |
| Testing | ❌ |
| Docstring/Comentários | ⚠️ Parcial |

---

## 🎯 RECOMENDAÇÕES ESTRUTURAIS

### **Curto Prazo (1-2 semanas)**
1. **Corrigir bugs de realmId** em papyrusController.js (CRÍTICO)
2. **Padronizar nomenclatura** de rotas (/documents vs /papyrus)
3. **Adicionar validação de input** em todos os controllers

### **Médio Prazo (1 mês)**
1. Implementar **paginação** em listagens
2. Adicionar **logging estruturado** (Winston/Pino)
3. Criar **testes unitários** para controllers
4. Documentar **fluxos de dados** visualmente

### **Longo Prazo (2+ meses)**
1. Implementar **caching com Redis**
2. Adicionar **rate limiting**
3. Criar **dashboard de monitoring**
4. Implementar **GraphQL** como alternativa a REST

---

## 📚 REFERÊNCIAS DE ARQUIVOS CHAVE

```
📦 Backend
├── server.js                          # Entry point, route registration
├── src/db/
│   ├── index.js                       # Drizzle connection
│   └── schema/                        # Database tables
├── src/api/
│   ├── controllers/                   # Business logic (34 files)
│   ├── entityRoutes.js                # Route definitions
│   ├── authRoutes.js                  # Auth endpoints
│   ├── authMiddleware.js              # JWT validation
│   └── papyrus.js                     # Frontend API client
└── .env                               # Configuration

📁 Frontend
├── src/components/                    # React components
├── src/pages/                         # Page components
├── src/api/                           # API clients
└── src/hooks/                         # Custom hooks
```

---

## 🔄 FLUXO DE DESENVOLVIMENTO

### Para Adicionar Nova Entidade (ex: "BlogPost"):

1. **Schema** → Criar tabela em `src/db/schema/docs.js`
2. **Controller** → Criar `blogPostController.js`
3. **Routes** → Adicionar rotas em `entityRoutes.js`
4. **Frontend** → Criar client em `src/api/blogPost.js`
5. **Tests** → Criar testes em `tests/blogPost.test.js`

---

**Fim do Relatório**  
*Relatório gerado para análise arquitetural do Prana 3.0*
