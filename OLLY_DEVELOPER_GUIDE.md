# 📘 Guia do Desenvolvedor - Integração Olly com Prana

Este documento descreve a estrutura de dados, APIs e fluxos do Prana que o Olly Agent precisa conhecer para integração perfeita.

---

## 1️⃣ Entidades Principais do Prana

### **Users** (Usuários)
```javascript
{
  id: string,
  name: string,
  email: string,
  avatarUrl?: string,
  credits: number,
  role: 'admin' | 'user',
  aiSettings: {
    tone?: string,              // ex: "formal", "casual"
    role?: string,              // ex: "senior dev", "product manager"
    tech_stack?: string,        // ex: "React, Node, PostgreSQL"
    language: 'pt-BR' | 'en-US'
  },
  dashboardPreferences: {
    sankalpa: boolean,
    projects: boolean,
    tasks: boolean,
    velocity: boolean,
    astral: boolean,
    rituals: boolean,
    energy: boolean,
    mood: boolean,
    tags: boolean
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Projects** (Projetos)
Estrutura hierárquica com suporte a subprojetos.
```javascript
{
  id: string,
  name: string,
  description?: string,
  status: 'active' | 'archived' | 'completed',
  ownerId: string,              // FK Users
  parentId?: string,            // Para subprojetos
  color?: string,
  icon?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Tasks** (Tarefas)
```javascript
{
  id: string,
  title: string,
  description?: string,
  status: 'todo' | 'in_progress' | 'done' | 'blocked',
  priority: 'low' | 'medium' | 'high' | 'urgent',
  projectId?: string,           // FK Projects (opcional = tarefa solta)
  assigneeId?: string,          // FK Users
  dueDate?: timestamp,
  estimatedHours?: number,
  actualHours?: number,
  energy?: 'low' | 'medium' | 'high',
  tags?: string[],              // Array de tag IDs ou nomes
  customData?: {                // Campo livre para extensões
    ritual?: boolean,
    nexus?: boolean,
    astral?: any
  },
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### **Tags** (Etiquetas)
```javascript
{
  id: string,
  name: string,                 // ex: "urgente", "revisão", "deploy"
  color: string,                // hex color
  icon?: string,
  usageCount: number,           // cache para ordenação
  createdAt: timestamp
}
```

### **Teams** (Times)
```javascript
{
  id: string,
  name: string,
  description?: string,
  color?: string,
  ownerId: string,              // FK Users
  createdAt: timestamp
}
```

### **TimeSession** (Sessões de Deep Work)
```javascript
{
  id: string,
  userId: string,               // FK Users
  taskId?: string,              // FK Tasks (opcional)
  startTime: timestamp,
  endTime?: timestamp,
  duration: number,             // em minutos
  focusLevel: 'low' | 'medium' | 'high',
  interrupted: boolean,
  notes?: string,
  createdAt: timestamp
}
```

### **Template** (Modelos Reutilizáveis)
```javascript
{
  id: string,
  name: string,
  description?: string,
  type: string,                 // ex: "project", "task", "ritual"
  structure: object,            // Conteúdo do template
  createdBy: string,            // FK Users
  createdAt: timestamp
}
```

---

## 2️⃣ Módulos Especializados

### **Energy Module** (`src/db/schema/energy.js`)
```javascript
EnergyCheckin {
  id: string,
  userId: string,
  value: number,                // 1-10 scale
  type: 'physical' | 'mental' | 'emotional' | 'spiritual',
  timestamp: timestamp,
  notes?: string
}

AstralProfile {
  id: string,
  userId: string,
  birthDate: date,
  zodiacSign: string,
  humanDesign: string,
  numerologyNumber: number,
  personalData: object
}
```

### **Planning Module** (`src/db/schema/planning.js`)
```javascript
Sankalpa {
  id: string,
  userId: string,
  title: string,                // Intenção/propósito
  description?: string,
  type: 'daily' | 'weekly' | 'yearly',
  status: 'active' | 'completed' | 'abandoned',
  createdAt: timestamp
}

Ritual {
  id: string,
  userId: string,
  name: string,
  description?: string,
  frequency: 'daily' | 'weekly' | 'monthly',
  time?: string,                // HH:MM
  duration?: number,            // em minutos
  tags?: string[],
  completions?: timestamp[]     // últimas execuções
}
```

### **Chat Module** (`src/db/schema/chat.js`)
```javascript
Message {
  id: string,
  roomId: string,               // FK NexusRoom
  senderId: string,             // FK Users
  content: string,
  attachments?: object[],
  metadata?: object,
  createdAt: timestamp
}

NexusRoom {
  id: string,
  name: string,
  participants: string[],       // User IDs
  description?: string,
  createdAt: timestamp
}
```

### **Docs Module** (`src/db/schema/docs.js`)
```javascript
PapyrusDocument {
  id: string,
  title: string,
  content: string,              // Markdown
  ownerId: string,              // FK Users
  tags?: string[],
  visibility: 'private' | 'shared' | 'public',
  createdAt: timestamp
}

MindMapNode {
  id: string,
  mapId: string,
  label: string,
  parentId?: string,            // Para hierarquia
  position?: { x, y },
  color?: string,
  data?: object,
  createdAt: timestamp
}
```

---

## 3️⃣ API Endpoints Essenciais

### **CRUD Base** (Todas as entidades)
```
GET    /api/{resource}                      # List com params
GET    /api/{resource}/:id                  # Get by ID
POST   /api/{resource}                      # Create
PUT    /api/{resource}/:id                  # Update
DELETE /api/{resource}/:id                  # Delete
```

Exemplo:
```bash
GET    /api/tasks?status=todo&projectId=proj_123
POST   /api/tasks                           # { title, description, priority, ... }
PUT    /api/tasks/task_456                  # { status: 'done', ... }
```

### **Auth**
```
POST   /login                               # { email, password }
POST   /register                            # { name, email, password }
GET    /api/users/me                        # Usuário autenticado
POST   /logout                              # Logout
```

### **Projects**
```
GET    /api/projects                        # Todos os projetos do usuário
GET    /api/projects/:id/tasks              # Tarefas de um projeto
GET    /api/projects/:id/tree               # Estrutura hierárquica
```

### **Tasks** (Especial)
```
GET    /api/tasks?status=todo               # Filter por status
GET    /api/tasks?priority=high             # Filter por prioridade
GET    /api/tasks?assigneeId=user_123       # Tasks atribuídas a alguém
PUT    /api/tasks/:id                       # Update status/prioridade
# Dispara evento 'prana:task-completed' quando marcado done
```

### **Energy**
```
GET    /api/energy/checkins                 # Energy checkins do usuário
POST   /api/energy/checkins                 # Registrar nova checkin
GET    /api/energy/profile                  # Perfil astrológico do usuário
```

### **AI Routes** (Ash Integration)
```
POST   /api/ash/insight                     # Gerar insight diário
POST   /api/ash/analyze                     # Análise customizada
POST   /api/rag                             # RAG com contexto do usuário
```

### **Diary**
```
GET    /api/diary/entries                   # Entradas do diário
POST   /api/diary/entries                   # Criar nova entrada
GET    /api/diary/mood                      # Histórico de humor
```

### **Calendar**
```
GET    /api/calendar/events                 # Eventos do calendário
POST   /api/calendar/events                 # Criar evento
GET    /api/calendar/routines               # Rotinas do usuário
```

---

## 4️⃣ Padrões de Integração

### **Autenticação**
```javascript
// Header em todas as requisições
Authorization: Bearer {prana_auth_token}

// Token obtido em /login ou /register
// Armazenado no localStorage (frontend) ou sessão (backend)
```

### **Resposta Padrão**
```javascript
// Sucesso
{
  status: 200,
  data: { /* entidade */ }
}

// Erro
{
  status: 400|401|403|404|500,
  error: "Mensagem de erro",
  details?: object
}
```

### **Criar Tarefa (Exemplo)**
```javascript
POST /api/tasks
{
  title: "Implementar integração Olly",
  description: "Conectar Olly Agent ao Prana",
  projectId: "proj_123",
  priority: "high",
  dueDate: "2025-12-25T23:59:59Z",
  estimatedHours: 8,
  energy: "high",
  tags: ["development", "olly"]
}
```

### **Buscar Tarefas (Exemplo)**
```javascript
GET /api/tasks?status=todo&priority=high&projectId=proj_123&sort=dueDate

Retorna:
[
  { id: "task_1", title: "...", status: "todo", ... },
  { id: "task_2", title: "...", status: "todo", ... }
]
```

### **Atualizar Status (Exemplo)**
```javascript
PUT /api/tasks/task_123
{
  status: "done",
  actualHours: 7.5
}

// Dispara: window.dispatchEvent('prana:task-completed')
```

---

## 5️⃣ Eventos do Sistema (Frontend)

O Prana dispara eventos globais que Olly pode escutar:

```javascript
// Tarefa completada
window.addEventListener('prana:task-completed', (e) => {
  console.log('Task completed:', e.detail); // { color: '#34d399' }
});

// Checkin de energia
window.addEventListener('prana:energy-checkin', (e) => {
  console.log('Energy:', e.detail); // { value: 8, type: 'mental' }
});

// Novo diário
window.addEventListener('prana:diary-entry', (e) => {
  console.log('Diary:', e.detail);
});
```

---

## 6️⃣ Fluxos Importantes para Olly

### **Fluxo 1: Analisar Produtividade**
```
1. GET /api/tasks?userId={id}&status=done&dateRange=lastWeek
2. GET /api/time_sessions?userId={id}&dateRange=lastWeek
3. GET /api/energy/checkins?userId={id}&dateRange=lastWeek
4. Gerar insights com esses dados
```

### **Fluxo 2: Sugerir Tarefas**
```
1. GET /api/tasks?status=todo (para entender padrão)
2. GET /api/user/aiSettings (preferências)
3. Analisar completude histórica
4. POST /api/tasks (criar sugestão)
```

### **Fluxo 3: Detectar Rituais**
```
1. GET /api/tasks?tags=ritual (buscar tarefas marcadas como ritual)
2. Analisar frequência e horários
3. POST /api/planning/rituals (sugerir novos)
```

### **Fluxo 4: Contexto Holístico**
```
1. GET /api/users/me (dados do usuário)
2. GET /api/energy/profile (astrologia, design humano)
3. GET /api/tasks?status=todo&priority=high (tarefas urgentes)
4. GET /api/diary/mood (histórico de humor)
5. GET /api/calendar/events (próximos eventos)
→ Usar tudo isso para dar contexto às respostas
```

---

## 7️⃣ Configuração no Prana

Quando Olly estiver pronto, será configurado assim:

```javascript
// .env
OLLY_API_URL=http://olly-agent:3001
OLLY_SECRET_KEY=sua_chave_secreta

// src/config/ollyConfig.js
export const ollyConfig = {
  apiUrl: process.env.OLLY_API_URL,
  secretKey: process.env.OLLY_SECRET_KEY,
  capabilities: ['chat', 'tasks', 'energy', 'rituals', 'recommendations'],
  // ... mais config
}
```

---

## 8️⃣ Tecnologias do Prana (Contexto)

- **Frontend**: React 18, Vite, TailwindCSS, Zustand, Framer Motion
- **Backend**: Express.js, Drizzle ORM, PostgreSQL
- **IA**: OpenAI API, Google Generative AI, Anthropic Claude
- **Realtime**: WebSockets (Nexus Chat)
- **Deploy**: Vercel (frontend), Cloud Run / AWS (backend)

---

## 9️⃣ Checklist para Desenvolvedor Olly

- [ ] Entender estrutura de Projects/Tasks (hierarquia)
- [ ] Mapping de Users + aiSettings (preferências)
- [ ] Integração com Energy Module (contexto emocional)
- [ ] Suporte a Tags (para categorização)
- [ ] Leitura de Templates (para padrões)
- [ ] Autenticação JWT com Prana
- [ ] Endpoints CRUD para criar/atualizar tarefas
- [ ] WebSocket support para real-time (opcional mas recomendado)
- [ ] Lidar com customData em Tasks (extensibilidade)
- [ ] Respeitar dashboardPreferences do usuário

---

## 🔟 Contato & Support

**Repositório Prana**: `github.com/padeirodepromt/prana3.0`  
**Branch**: `main`  
**Tech Stack**: Node.js 18+, PostgreSQL 15+

Qualquer dúvida durante o desenvolvimento, consulte:
- `src/api/entities.js` - Entidades disponíveis
- `src/db/schema/` - Estrutura das tabelas
- `src/api/*Routes.js` - Exemplos de endpoints
