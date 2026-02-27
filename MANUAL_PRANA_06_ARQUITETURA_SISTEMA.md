# 🏗️ MANUAL PRANA 06 - ARQUITETURA DO SISTEMA

**Versão:** 3.0.1 | **Capítulo:** 06 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo descreve a **arquitetura técnica completa** de Prana: como cliente e servidor se comunicam, camadas de processamento, fluxo de dados, e padrões de design.

**Público:** Arquitetos, Desenvolvedores Sênior  
**Tempo de leitura:** 50 minutos  
**Pré-requisitos:** [Capítulo 04 - Stack](MANUAL_PRANA_04_STACK.md), [Capítulo 05 - Database](MANUAL_PRANA_05_DATABASE.md)

---

## 🏛️ ARQUITETURA DE ALTO NÍVEL

```
┌─────────────────────────────────────────────────────────────┐
│                     PRANA 3.0 ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │          PRESENTATION LAYER (Frontend)               │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Views (React Components)                       │ │ │
│  │  │  ├─ DashboardView                               │ │ │
│  │  │  ├─ ProjectsView                                │ │ │
│  │  │  ├─ TasksView                                   │ │ │
│  │  │  ├─ DiaryView (Papyrus)                         │ │ │
│  │  │  ├─ SettingsView                                │ │ │
│  │  │  └─ AstrologyView                               │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                      ↓                                  │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Business Logic Layer (Zustand + Services)      │ │ │
│  │  │  ├─ Zustand Stores (State Management)           │ │ │
│  │  │  ├─ Custom Hooks (useEnergy, useMood, etc)      │ │ │
│  │  │  └─ Local Services                              │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                      ↓                                  │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  API Client Layer (axios instance)              │ │ │
│  │  │  ├─ apiClient (with auth interceptor)           │ │ │
│  │  │  ├─ Token Management                            │ │ │
│  │  │  └─ Error Handling                              │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│                      ↕ (REST API)                          │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │        APPLICATION LAYER (Backend/API Server)       │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Express Routes & Controllers                   │ │ │
│  │  │  ├─ /api/auth/*                                │ │ │
│  │  │  ├─ /api/projects/*                            │ │ │
│  │  │  ├─ /api/tasks/*                               │ │ │
│  │  │  ├─ /api/energy/*                              │ │ │
│  │  │  ├─ /api/mood/*                                │ │ │
│  │  │  ├─ /api/diary/*                               │ │ │
│  │  │  ├─ /api/astral/*                              │ │ │
│  │  │  └─ /api/ai/*                                  │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                      ↓                                  │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Business Logic Layer (Services)                │ │ │
│  │  │  ├─ energyService.js                            │ │ │
│  │  │  ├─ moodService.js                              │ │ │
│  │  │  ├─ taskService.js                              │ │ │
│  │  │  ├─ projectService.js                           │ │ │
│  │  │  ├─ papyrusService.js (Diary/Memory)            │ │ │
│  │  │  ├─ astrologyService.js                         │ │ │
│  │  │  ├─ holisticAnalysisService.js                  │ │ │
│  │  │  ├─ ashService.js (AI Agent)                    │ │ │
│  │  │  └─ integrationService.js                       │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  │                      ↓                                  │ │
│  │  ┌─────────────────────────────────────────────────┐ │ │
│  │  │  Data Access Layer (Database Queries)           │ │ │
│  │  │  ├─ Drizzle ORM (SQL queries)                  │ │ │
│  │  │  ├─ Connection Pool                             │ │ │
│  │  │  └─ Transaction Management                      │ │ │
│  │  └─────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│                      ↕ (Database Driver)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐ │
│  │     DATA LAYER (Database & External Services)       │ │
│  │  ├─ LibSQL (Turso) Database                          │ │
│  │  ├─ Redis Cache (Optional)                           │ │
│  │  ├─ Claude API (Anthropic)                           │ │
│  │  ├─ Google APIs (Calendar, Gmail)                    │ │
│  │  ├─ Meta APIs (Ad Insights, Conversions)             │ │
│  │  └─ Astrological Data (ephemeris)                    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔌 FLUXO DE REQUISIÇÃO COMPLETO

### Example: User Creates Energy Check-in

```
┌──────────────────────────────────────────────────────────────┐
│ 1. FRONTEND - User Action                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  User: Abre DashboardView.jsx, clica "Set Energy (7/10)"    │
│                                                              │
│  Component triggers:                                        │
│  const handleEnergyCheckIn = async (level) => {             │
│    const response = await apiClient.post('/api/energy',     │
│      { energy_level: level, context: 'morning' }            │
│    );                                                       │
│  }                                                          │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. API CLIENT LAYER - HTTP Request                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  apiClient interceptor:                                     │
│  - Adds Authorization header (Bearer token)                 │
│  - Adds Content-Type: application/json                      │
│  - Request: POST /api/energy                                │
│  - Body: { energy_level: 7, context: 'morning' }            │
│  - Headers: { Authorization: 'Bearer JWT_TOKEN' }           │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. EXPRESS ROUTE - HTTP Handling                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  File: /api/energyRoutes.js                                 │
│                                                              │
│  router.post('/', async (req, res) => {                     │
│    try {                                                   │
│      const { energy_level, context } = req.body;           │
│      const userId = req.user.id; // from JWT               │
│                                                              │
│      const result = await energyService.recordCheckIn({    │
│        userId,                                             │
│        energy_level,                                       │
│        context,                                            │
│        timestamp: new Date()                               │
│      });                                                   │
│                                                              │
│      res.json({ success: true, data: result });            │
│    } catch (error) {                                       │
│      res.status(500).json({ error: error.message });       │
│    }                                                       │
│  });                                                       │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. SERVICE LAYER - Business Logic                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  File: /services/energyService.js                           │
│                                                              │
│  async recordCheckIn(data) {                                │
│    // 1. Create entry                                      │
│    const entry = await db.insert(energy_checkins).values({  │
│      id: generateUUID(),                                   │
│      user_id: data.userId,                                 │
│      energy_level: data.energy_level,                      │
│      context: data.context,                                │
│      date_only: formatDate(data.timestamp),                │
│      timestamp: data.timestamp                             │
│    });                                                     │
│                                                              │
│    // 2. Calculate trends                                  │
│    const last7Days = await db.select()                     │
│      .from(energy_checkins)                                │
│      .where(eq(energy_checkins.user_id, data.userId))      │
│      .orderBy(desc(energy_checkins.timestamp));            │
│                                                              │
│    const trend = calculateTrend(last7Days);                │
│                                                              │
│    // 3. Trigger sinapses (via holistic service)           │
│    const sankalpa = await holisticAnalysis                 │
│      .generateDailySankalpa(data.userId);                  │
│                                                              │
│    // 4. Return result                                     │
│    return { entry, trend, sankalpa };                      │
│  }                                                         │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. DATA ACCESS LAYER - Database Interaction                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Using Drizzle ORM:                                         │
│  - Insert: INSERT INTO energy_checkins VALUES (...)        │
│  - Select: SELECT * FROM energy_checkins WHERE ...          │
│  - Result: Database returns inserted row + trend calc       │
│                                                              │
│  All queries wrapped in transactions where needed:          │
│  await db.transaction(async (tx) => {                       │
│    // Atomic operations                                    │
│  });                                                       │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. BACKEND RESPONSE - Return Data                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  HTTP 200 OK                                                │
│  Content-Type: application/json                             │
│                                                              │
│  Response Body:                                             │
│  {                                                          │
│    "success": true,                                         │
│    "data": {                                                │
│      "entry": { id, user_id, energy_level, timestamp },    │
│      "trend": { lastWeek: [5,6,7,6,7,8,7], direction: "↑" },
│      "sankalpa": { text, confidence, context }             │
│    }                                                        │
│  }                                                          │
│                                                              │
└────────────────────────────┬─────────────────────────────────┘
                             ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. FRONTEND - State Update                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Zustand Store updates:                                     │
│  const useEnergyStore = create((set) => ({                  │
│    setEnergyData: (data) => set({ energy: data })           │
│  }));                                                       │
│                                                              │
│  Component receives response:                               │
│  const { energy, setEnergyData } = useEnergyStore();        │
│  setEnergyData(response.data);                              │
│                                                              │
│  Re-render triggers:                                        │
│  useEffect(() => {                                          │
│    // Update charts                                        │
│    // Show notification                                    │
│    // Display sankalpa                                     │
│  }, [energy]);                                              │
│                                                              │
│  UI reflects new state:                                     │
│  - Energy card shows: "7/10" ✓                              │
│  - Chart updates with new data point                        │
│  - Sankalpa displays on card                                │
│  - Notification: "Energy check-in recorded!"                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔐 AUTENTICAÇÃO E AUTORIZAÇÃO

### JWT Token Flow

```
┌─ User Login ──────────────────────────────────────┐
│                                                   │
│  1. POST /api/auth/login                          │
│     Body: { email, password }                     │
│                                                   │
│  2. Server verifies credentials                   │
│     - Compare password hash                       │
│     - Fetch user profile                          │
│                                                   │
│  3. Generate JWT Token                            │
│     Header: { alg: 'HS256', typ: 'JWT' }          │
│     Payload: { userId, email, iat, exp }          │
│     Signature: HMAC-SHA256(secret)                │
│                                                   │
│  4. Return token to frontend                      │
│     { success: true, token: 'JWT_HERE' }          │
│                                                   │
│  5. Frontend stores token                         │
│     localStorage.setItem('prana_token', token)    │
│                                                   │
│  6. Every request includes token                  │
│     Header: Authorization: 'Bearer TOKEN'         │
│                                                   │
│  7. Middleware validates token                    │
│     - Decode and verify signature                 │
│     - Check expiration                            │
│     - Extract userId                              │
│     - Attach to req.user                          │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Middleware Stack

```javascript
// /middleware/auth.js
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Apply to all API routes
app.use('/api/*', authMiddleware);
```

---

## 🔄 REAL-TIME DATA SYNCHRONIZATION

### Polling Strategy

Since Prana is currently single-user focused, we use simple polling:

```javascript
// DashboardView.jsx
useEffect(() => {
  const loadDashboard = async () => {
    const data = await Promise.all([
      apiClient.get('/api/energy/today'),
      apiClient.get('/api/mood/today'),
      apiClient.get('/api/tasks/upcoming'),
      apiClient.get('/api/astral/today'),
      apiClient.get('/api/ai/sankalpa-daily')
    ]);
    
    setDashboardData(data);
  };

  // Load on mount
  loadDashboard();

  // Poll every 5 minutes
  const interval = setInterval(loadDashboard, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

### Future: WebSocket for Real-time

```javascript
// For multi-user collaboration
const socket = io(API_URL);

socket.on('task:created', (task) => {
  // Update UI in real-time
  useTaskStore.setState(state => ({
    tasks: [...state.tasks, task]
  }));
});

socket.on('energy:updated', (energy) => {
  useEnergyStore.setState({ energy });
});
```

---

## 🛡️ ERROR HANDLING STRATEGY

### Layered Error Handling

```javascript
// Frontend: API Client
const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      window.location.href = '/login';
    } else if (error.response?.status === 500) {
      // Server error, show notification
      showNotification('Server error. Please try again.');
    }
    return Promise.reject(error);
  }
);

// Backend: Try/Catch + Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message
  });
});
```

---

## 📊 CACHING STRATEGY

### Three-Level Cache

```
┌─────────────────────────────────────┐
│  LEVEL 1: Browser Cache             │
│  - localStorage (persistent)         │
│  - sessionStorage (session)          │
│  - Memory (Zustand stores)           │
├─────────────────────────────────────┤
│  LEVEL 2: API Cache (if Redis)      │
│  - Energy trends (cache 1 hour)      │
│  - Mood statistics (cache 24 hours)  │
│  - Task lists (cache 5 minutes)      │
├─────────────────────────────────────┤
│  LEVEL 3: Database Cache            │
│  - Persistent data storage           │
│  - Query optimization indices        │
└─────────────────────────────────────┘
```

### Cache Invalidation

```javascript
// When user creates new energy check-in
const recordCheckIn = async (data) => {
  // 1. Update database
  await db.insert(energy_checkins).values(data);
  
  // 2. Clear caches
  redisClient.del(`energy:${userId}:week`);
  redisClient.del(`energy:${userId}:stats`);
  
  // 3. Return fresh data
  return getEnergyTrend(userId);
};
```

---

## 🎯 DEPENDENCY INJECTION PATTERN

Prana uses a simple DI pattern for loose coupling:

```javascript
// /config/container.js
const createContainer = () => {
  const db = setupDatabase();
  const logger = setupLogger();
  
  return {
    energyService: createEnergyService(db, logger),
    moodService: createMoodService(db, logger),
    taskService: createTaskService(db, logger),
    ashService: createAshService(db, apiClient, logger),
    papyrusService: createPapyrusService(db, ashService, logger)
  };
};

// /routes/energyRoutes.js
const createEnergyRoutes = (container) => {
  const { energyService } = container;
  
  router.post('/', async (req, res) => {
    const result = await energyService.recordCheckIn(req.body);
    res.json(result);
  });
  
  return router;
};
```

---

## 🚀 DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────────┐
│     CLIENT (Browser/Mobile via Capacitor)   │
│     - React 18 + Vite                       │
│     - Hosted on Vercel/Netlify              │
└─────────────┬───────────────────────────────┘
              │ HTTPS REST API
              ↓
┌─────────────────────────────────────────────┐
│    EDGE LAYER (Cloudflare/AWS CloudFront)   │
│    - Caching                                │
│    - Rate limiting                          │
│    - DDoS protection                        │
└─────────────┬───────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────┐
│  APPLICATION SERVER (Node.js + Express)     │
│  - Hosted on Railway/Heroku/AWS EC2         │
│  - Auto-scaling based on traffic            │
│  - Multiple instances with load balancer    │
└─────────────┬───────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────┐
│  DATABASE (LibSQL via Turso)                │
│  - Replicated across regions                │
│  - Point-in-time recovery                   │
│  - Automated backups                        │
└─────────────────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────┐
│  EXTERNAL SERVICES                          │
│  - Claude API (Anthropic)                   │
│  - Google APIs                              │
│  - Meta APIs                                │
│  - Ephemeris Data                           │
└─────────────────────────────────────────────┘
```

---

## 🔍 OBSERVABILITY

### Logging Strategy

```javascript
// /utils/logger.js
const logger = {
  info: (msg, context) => console.log(`[INFO] ${msg}`, context),
  warn: (msg, context) => console.warn(`[WARN] ${msg}`, context),
  error: (msg, err) => console.error(`[ERROR] ${msg}`, err),
  debug: (msg, context) => process.env.DEBUG && console.log(msg, context)
};

// Usage in services
const recordCheckIn = async (data) => {
  logger.info('Recording energy check-in', { userId: data.userId });
  try {
    const result = await db.insert(energy_checkins).values(data);
    logger.info('Check-in recorded successfully', { id: result.id });
    return result;
  } catch (error) {
    logger.error('Failed to record check-in', error);
    throw error;
  }
};
```

### Metrics to Track

```
- Request latency (p50, p95, p99)
- Error rates by endpoint
- Database query times
- Cache hit/miss ratios
- API quota usage (Claude, Google, Meta)
- User engagement (DAU, MAU)
- Data usage trends
```

---

## 🔗 LEITURA RELACIONADA

- [⚙️ 04 - Stack Tecnológico](MANUAL_PRANA_04_STACK.md) - Tecnologias base
- [🗄️ 05 - Schema & Banco de Dados](MANUAL_PRANA_05_DATABASE.md) - Estrutura de dados
- [📊 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md) - Views que usam esta arquitetura
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Como AI se integra

---

**Próximo capítulo:** [📊 07 - Dashboard & Analytics](MANUAL_PRANA_07_DASHBOARD.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
