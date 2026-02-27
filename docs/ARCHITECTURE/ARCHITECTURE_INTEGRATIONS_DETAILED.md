# 🏗️ ARQUITETURA: Integrações 2 & 3 + Notificações + Email

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         PRANA ECOSYSTEM V3                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  USUÁRIO FINAL                                                          │
│     ↓                                                                   │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              PRANA MAIN APP (React 18 + Vite)                    │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │ 📊 DASHBOARD                                               │ │  │
│  │  ├────────────────────────────────────────────────────────────┤ │  │
│  │  │ 📅 CalendarView              🐙 ProjectHub (GitHub)        │ │  │
│  │  │  ├─ Prana events              ├─ Sync GitHub Issues        │ │  │
│  │  │  ├─ Google events             ├─ Create issues from tasks  │ │  │
│  │  │  └─ Reminders (local)         └─ PR reviews               │ │  │
│  │  │                                                            │ │  │
│  │  │ 📝 DocEditorView (✨ NEW FEATURES)                        │ │  │
│  │  │  ├─ Syntax highlighting      (Prism)                     │ │  │
│  │  │  ├─ Line numbers             (CodeBlockExtension)        │ │  │
│  │  │  ├─ Text colors              (ColorExtension)            │ │  │
│  │  │  ├─ Highlights               (HighlightExtension)        │ │  │
│  │  │  ├─ Slash commands           (SlashCommandExtension)     │ │  │
│  │  │  └─ Images                   (ImageExtension)            │ │  │
│  │  │                                                            │ │  │
│  │  │ ⚙️ SettingsView                                           │ │  │
│  │  │  ├─ Google Calendar OAuth                                 │ │  │
│  │  │  ├─ GitHub OAuth                                          │ │  │
│  │  │  ├─ Notifications settings                               │ │  │
│  │  │  └─ Email preferences                                     │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  │                              ↓                                    │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │           🤖 ASH (AI AGENT)                                 │ │  │
│  │  │                                                             │ │  │
│  │  │  Tool Calls (NOVO):                                        │ │  │
│  │  │  ├─ send_push_notification(title, body, action)           │ │  │
│  │  │  ├─ send_email_reminder(task_id, template)               │ │  │
│  │  │  ├─ send_daily_briefing()                                 │ │  │
│  │  │  ├─ sync_calendar_event(title, start, end)               │ │  │
│  │  │  └─ create_github_issue(repo, title, body)               │ │  │
│  │  │                                                             │ │  │
│  │  │  Communication Channels:                                   │ │  │
│  │  │  ├─ 💬 Chat (text)                                        │ │  │
│  │  │  ├─ 🔔 Push notifications                                 │ │  │
│  │  │  ├─ 📧 Email                                              │ │  │
│  │  │  └─ 📱 App (mobile native)                                │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓↓↓                                        │
└──────────────────┬──────────────────────────┬──────────────────────────┘
                   ↓                          ↓
        ┌──────────────────────┐    ┌──────────────────────┐
        │  PRANA BACKEND       │    │   CAPACITOR BRIDGE   │
        │  (Node.js + Express) │    │  (Native iOS/Android)│
        │                      │    │                      │
        │ ┌──────────────────┐ │    │ ┌──────────────────┐ │
        │ │ API Routes       │ │    │ │ LocalNotifications│ │
        │ │ ├─ /auth/*       │ │    │ │ Camera           │ │
        │ │ ├─ /calendar/*   │ │    │ │ Geolocation      │ │
        │ │ ├─ /github/*     │ │    │ │ Device info      │ │
        │ │ ├─ /email/*      │ │    │ │ Keyboard mgmt    │ │
        │ │ └─ /notify/*     │ │    │ │ Status bar       │ │
        │ └──────────────────┘ │    │ └──────────────────┘ │
        │                      │    └──────────────────────┘
        │ ┌──────────────────┐ │
        │ │ Services Layer   │ │
        │ │ ├─ emailService  │ │
        │ │ ├─ googleCal...  │ │
        │ │ ├─ githubService │ │
        │ │ └─ notif...      │ │
        │ └──────────────────┘ │
        │                      │
        │ ┌──────────────────┐ │
        │ │ Database         │ │
        │ │ (LibSQL)         │ │
        │ │ ├─ users         │ │
        │ │ ├─ tasks         │ │
        │ │ ├─ oauth_tokens  │ │
        │ │ └─ integrations  │ │
        │ └──────────────────┘ │
        └──────────────────────┘
                   ↓↓↓
    ┌──────────────────────────────────────────────────────┐
    │          EXTERNAL SERVICES                           │
    │                                                      │
    │  ┌─────────────────┐  ┌──────────────────────────┐  │
    │  │ GOOGLE CLOUD    │  │ GITHUB                   │  │
    │  │ ├─ OAuth        │  │ ├─ OAuth                 │  │
    │  │ ├─ Calendar API │  │ ├─ REST API /repos       │  │
    │  │ ├─ Sync         │  │ ├─ Issues                │  │
    │  │ └─ Webhooks     │  │ └─ Pull requests         │  │
    │  └─────────────────┘  └──────────────────────────┘  │
    │                                                      │
    │  ┌─────────────────┐  ┌──────────────────────────┐  │
    │  │ SENDGRID/       │  │ FCM (Android) +          │  │
    │  │ NODEMAILER      │  │ APNs (iOS)               │  │
    │  │ ├─ OAuth        │  │ ├─ Push tokens           │  │
    │  │ ├─ Send email   │  │ ├─ Send notifications    │  │
    │  │ ├─ Templates    │  │ └─ Analytics             │  │
    │  │ └─ Tracking     │  └──────────────────────────┘  │
    │  └─────────────────┘                                │
    │                                                      │
    └──────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW EXAMPLES

### Exemplo 1: Google Calendar Sync

```
USER: "Criar evento: Reunião dia 15"
  ↓
PRANA UI: CalendarView
  ↓
Ash receives message → Tool call: sync_calendar_event
  ↓
Backend: googleCalendarService.createGoogleEvent()
  ↓
Google OAuth token → Google Calendar API
  ↓
Google: Cria evento na conta do usuário
  ↓
Webhook/Polling: Google Calendar → Prana DB
  ↓
CalendarView atualiza com 🔗 (Google linked)
  ↓
USER: Vê evento em dois lugares (Prana + Google)
```

---

### Exemplo 2: GitHub Issue Sync

```
USER: "Criar task: Implementar login"
  ↓
PRANA UI: ProjectHub
  ↓
Task created in Prana
  ↓
USER: [Conecta com GitHub repo]
  ↓
Ash: "Vou criar issue no GitHub"
  ↓
Backend: githubService.createGitHubIssue()
  ↓
GitHub OAuth → GitHub API: Create Issue
  ↓
GitHub: Issue #42 criado
  ↓
Prana DB: Armazena link task.github_issue_id = "42"
  ↓
TaskCard: Mostra 🐙 GitHub badge com link
  ↓
USER atualiza task: "Completo"
  ↓
Prana automático: githubService.closeGitHubIssue(42)
  ↓
GitHub: Issue #42 fechado automaticamente
```

---

### Exemplo 3: Push Notification + Email

```
ASH: "Notificar usuário sobre reminder"
  ↓
Tool call: send_push_notification({
  title: "Task reminder",
  body: "Projeto XYZ vence hoje",
  action: "navigate_to view=PROJECT_CANVAS&id=xyz"
})
  ↓
OPÇÃO A: Mobile App
  ├─ notificationService.js
  ├─ Capacitor: LocalNotifications.schedule()
  ├─ FCM/APNs (Apple/Google)
  ├─ Device vibrates + badge
  └─ User taps → navigates to project
  
OPÇÃO B: Email Backup
  ├─ Tool call: send_email_reminder()
  ├─ Backend: emailService.sendEmail()
  ├─ Email template rendered
  ├─ SendGrid/Nodemailer
  ├─ SMTP → User's inbox
  └─ User sees email + can unsubscribe
```

---

### Exemplo 4: Daily Briefing (Ash + Email + Push)

```
DAILY: 9 AM Trigger (cron job)
  ↓
Ash: "Generate daily briefing"
  ↓
auditService: Fetch user data
  ├─ Today's tasks
  ├─ Overdue items
  ├─ Google Calendar events
  ├─ GitHub issues assigned
  └─ Energy/Human Design insights
  ↓
Ash generates: "Seu briefing de hoje é..."
  ↓
Tool call 1: send_push_notification()
  ├─ Title: "☀️ Seu briefing chegou"
  ├─ Body: "Você tem 5 tarefas, 2 eventos"
  └─ Action: navigate_to DASHBOARD
  ↓
Tool call 2: send_email_reminder(template='daily_briefing')
  ├─ Email template: beautifully formatted
  ├─ Includes: tasks, events, insights
  ├─ Unsubscribe link
  └─ Sent via SendGrid
  ↓
USER:
  ├─ Vê notificação no app (push)
  ├─ Vê resumo no email
  ├─ Abre app → Dashboard atualizado
  └─ Clica em task → vai para editor
```

---

### Exemplo 5: Editor com Syntax Highlighting

```
USER: Abre Code Template (ex: "API Response")
  ↓
DocEditorView carrega conteúdo
  ↓
PapyrusEditor renderiza com CodeBlockExtension
  ↓
Prism.js detecta linguagem: "javascript"
  ↓
Tokens coloridos:
  ├─ Keywords: azul (#569CD6)
  ├─ Strings: verde (#6A9955)
  ├─ Numbers: laranja (#B5CEA8)
  ├─ Operators: cinza (#CCC)
  └─ Comments: verde escuro (#6B8E23)
  ↓
Line numbers renderizados:
  1  export default function...
  2    const data = { ... };
  3    return (...)
  ↓
USER pode:
  ├─ Copiar código completo
  ├─ Usar em seus projetos
  ├─ Referenciar linha específica ("veja linha 5")
  └─ Editar e salvar como template pessoal
```

---

## 🗄️ DATABASE CHANGES

### New Tables (ou columns em existentes)

```sql
-- OAuth Tokens (nova tabela)
CREATE TABLE oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  provider TEXT, -- 'google', 'github'
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Calendar Events (nova tabela)
CREATE TABLE calendar_events (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prana_event_id TEXT,
  google_event_id TEXT,
  title TEXT,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  synced BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);

-- GitHub Sync (nova tabela)
CREATE TABLE github_sync (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  prana_task_id TEXT,
  github_issue_id TEXT,
  github_repo TEXT,
  synced_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (prana_task_id) REFERENCES tasks(id)
);

-- Push Tokens (nova tabela)
CREATE TABLE push_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  device_id TEXT,
  token TEXT,
  platform TEXT, -- 'ios', 'android', 'web'
  created_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Email Preferences (adicionar a users)
ALTER TABLE users ADD COLUMN (
  email_notifications BOOLEAN DEFAULT TRUE,
  email_daily_briefing BOOLEAN DEFAULT TRUE,
  email_unsubscribe_token TEXT UNIQUE
);

-- Notification Log (auditoria)
CREATE TABLE notifications_log (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT, -- 'push', 'email', 'chat'
  title TEXT,
  body TEXT,
  sent_at TIMESTAMP,
  read_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 🔑 API ENDPOINTS (Backend)

### Authentication & OAuth
```
POST /auth/google/start          → Get Google OAuth URL
POST /auth/google/callback        → Handle Google callback
POST /auth/google/refresh         → Refresh Google token
POST /auth/github/start           → Get GitHub OAuth URL
POST /auth/github/callback        → Handle GitHub callback
```

### Calendar
```
GET  /calendar/google/events      → Fetch Google events
POST /calendar/google/events      → Create event
PUT  /calendar/google/events/:id  → Update event
DELETE /calendar/google/events/:id → Delete event
POST /calendar/sync               → Trigger full sync
```

### GitHub
```
GET  /github/repositories         → Fetch user's repos
GET  /github/issues               → Fetch issues (filtered)
POST /github/issues               → Create issue
PUT  /github/issues/:id           → Update issue
POST /github/issues/:id/close     → Close issue
```

### Email
```
POST /email/send                  → Send email
POST /email/test                  → Test email (dev)
POST /email/unsubscribe/:token    → Unsubscribe
```

### Notifications
```
POST /notifications/send          → Send push notification
POST /notifications/schedule      → Schedule notification
GET  /notifications/history       → Get notification history
PUT  /notifications/preferences   → Update preferences
```

---

## 🛠️ SERVICE METHODS (Frontend)

### googleCalendarService.js
```javascript
async authenticateGoogle()               // OAuth flow
async getCalendarEvents(daysAhead=90)    // Fetch events
async createGoogleEvent(event)           // Create event
async updateGoogleEvent(eventId, event)  // Update
async deleteGoogleEvent(eventId)         // Delete
async syncCalendarEvents()               // Bi-directional sync
```

### githubService.js
```javascript
async authenticateGitHub()               // OAuth flow
async getRepositories()                  // Fetch repos
async getIssues(repo, filters)          // Fetch issues
async createGitHubIssue(repo, issue)    // Create issue
async updateGitHubIssue(repo, id, issue) // Update
async closeGitHubIssue(repo, id)        // Close
```

### notificationService.js
```javascript
async initPushNotifications()            // Setup
async requestPermissions()               // Ask user
async sendPushNotification(params)       // Send push
async scheduleNotification(params)       // Schedule
async getPushToken()                     // Device token
async handleNotificationTap(data)        // Handle click
```

### emailService.js (Backend)
```javascript
async sendEmail(to, template, data)      // Send email
async sendTaskReminder(task)             // Task reminder
async sendDailyBriefing(briefing)       // Daily summary
async sendAshInsight(insight)            // AI insight
async sendTeamInvite(email, team)       // Invite
async renderTemplate(name, data)         // Render HTML
```

---

## 🎯 DESENVOLVIMENTO SEQUENCE

### Week 1:
**Day 1-2:** Email + Push notifications setup
**Day 3-4:** Google Calendar integration
**Day 5:** GitHub integration start

### Week 2:
**Day 1-2:** GitHub completion
**Day 3:** Testing & debugging
**Day 4-5:** Editor improvements

### Week 3:
**Day 1-2:** Line numbers + syntax highlighting
**Day 3-4:** Colors, highlights, images
**Day 5:** Polish + mobile testing

---

**Documentação Completa:** 
- [INTEGRACOES_NOTIFICACOES_EDITOR_PLAN.md](INTEGRACOES_NOTIFICACOES_EDITOR_PLAN.md)
- [PAPYRUS_EDITOR_ANALYSIS.md](PAPYRUS_EDITOR_ANALYSIS.md)
- [CAPACITOR_PENDING_PHASES.md](CAPACITOR_PENDING_PHASES.md)
