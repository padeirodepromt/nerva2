# 📡 MANUAL PRANA 13 - API REFERENCE

**Versão:** 3.0.1 | **Capítulo:** 13 | **Data:** Dezembro 2025

---

## 📋 O QUE É ESTE CAPÍTULO

Referência completa de todos os **endpoints REST** de Prana, com exemplos de requisição e resposta.

**Público:** Desenvolvedores, Integradores  
**Formato:** API Documentation  

---

## 🔐 AUTENTICAÇÃO

Todos os endpoints requerem **Bearer Token**:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.prana.local/api/tasks
```

---

## 📚 ENDPOINTS POR CATEGORIA

### **AUTH**

#### `POST /api/auth/register`
Registrar novo usuário

```json
// Request
{
  "email": "user@example.com",
  "password": "secure_password",
  "name": "User Name"
}

// Response (201)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user_uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

#### `POST /api/auth/login`
Fazer login

```json
// Request
{
  "email": "user@example.com",
  "password": "secure_password"
}

// Response (200)
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

#### `POST /api/auth/logout`
Fazer logout (invalida token)

#### `GET /api/auth/me`
Obter dados do usuário logado

---

### **PROJECTS**

#### `GET /api/projects`
Listar todos os projetos

```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "proj_uuid",
      "name": "Design Dashboard",
      "description": "Redesign with glassmorphism",
      "color": "#5B21B6",
      "created_at": "2025-01-15T10:00:00Z",
      "tasks_count": 5,
      "completed_tasks": 2
    }
  ]
}
```

#### `POST /api/projects`
Criar novo projeto

```json
// Request
{
  "name": "New Project",
  "description": "Project description",
  "color": "#5B21B6"
}

// Response (201)
{
  "success": true,
  "data": { "id": "proj_uuid", ... }
}
```

#### `GET /api/projects/:id`
Obter projeto específico com tarefas

```json
// Response (200)
{
  "success": true,
  "data": {
    "id": "proj_uuid",
    "name": "Design Dashboard",
    "tasks": [
      { "id": "task_uuid", "title": "...", "status": "todo" },
      { "id": "task_uuid", "title": "...", "status": "in_progress" }
    ]
  }
}
```

#### `PUT /api/projects/:id`
Atualizar projeto

#### `DELETE /api/projects/:id`
Deletar projeto (soft delete)

---

### **TASKS**

#### `GET /api/tasks`
Listar todas as tarefas (com filtros)

```bash
# Query parameters:
GET /api/tasks?project_id=proj_uuid&status=todo&priority=high&sort=due_date
```

```json
// Response (200)
{
  "success": true,
  "data": [
    {
      "id": "task_uuid",
      "title": "Design dashboard",
      "status": "in_progress",
      "priority": "high",
      "energy_required": "high",
      "due_date": "2025-01-20",
      "estimated_time_minutes": 180,
      "project_id": "proj_uuid",
      "created_at": "2025-01-15T10:00:00Z"
    }
  ]
}
```

#### `POST /api/tasks`
Criar nova tarefa

```json
// Request
{
  "title": "Design dashboard",
  "description": "Redesign with glassmorphism",
  "project_id": "proj_uuid",
  "priority": "high",
  "energy_required": "high",
  "estimated_time_minutes": 180,
  "due_date": "2025-01-20",
  "due_time": "18:00"
}

// Response (201)
{ "success": true, "data": { "id": "task_uuid", ... } }
```

#### `PUT /api/tasks/:id`
Atualizar tarefa

```json
// Request
{
  "status": "done",
  "priority": "medium"
}
```

#### `DELETE /api/tasks/:id`
Deletar tarefa

#### `POST /api/tasks/:id/complete`
Marcar tarefa como completa

```json
// Request (optional)
{
  "reflection": "Muito satisfeito com o resultado!"
}

// Response
{
  "success": true,
  "data": {
    "task": { ... },
    "diary_entry_created": true,
    "sankalpa_updated": true
  }
}
```

---

### **ENERGY**

#### `POST /api/energy`
Registrar energy check-in

```json
// Request
{
  "energy_level": 7,
  "context": "afternoon"
}

// Response (201)
{
  "success": true,
  "data": {
    "entry": {
      "id": "checkin_uuid",
      "energy_level": 7,
      "timestamp": "2025-01-18T14:30:00Z"
    },
    "trend": {
      "last_7_days": [5, 6, 7, 6, 7, 8, 7],
      "direction": "up",
      "average": 6.7
    },
    "sankalpa": {
      "text": "Você está em uma boa energia...",
      "confidence": 0.85
    }
  }
}
```

#### `GET /api/energy/today`
Obter energy stats de hoje

#### `GET /api/energy/week`
Obter energy stats da semana

#### `GET /api/energy/trend`
Obter trend de 30 dias

---

### **MOOD**

#### `POST /api/mood`
Registrar mood entry

```json
// Request
{
  "primary_mood": "focused",
  "secondary_moods": ["calm", "productive"],
  "intensity": 8,
  "note": "Tive uma ótima sessão de trabalho"
}

// Response (201)
{
  "success": true,
  "data": {
    "entry": { ... },
    "correlations": {
      "energy_level": 7,
      "recent_tasks": ["completed 2 tasks"],
      "triggers": ["successful work session"]
    }
  }
}
```

#### `GET /api/mood/today`
Obter mood de hoje

#### `GET /api/mood/distribution`
Obter distribuição de moods (7 ou 30 dias)

---

### **DIARY**

#### `GET /api/diary/entries`
Listar entries do diary

```bash
# Com filtros:
GET /api/diary/entries?mood=anxious&category=reflection&from=2025-01-01
```

#### `POST /api/diary/entries`
Criar nova entry

```json
// Request
{
  "title": "Uma semana produtiva",
  "content": "Lorem ipsum...",
  "category": "reflection",
  "mood_tags": ["grateful", "accomplished"],
  "related_task_ids": [1, 5],
  "is_private": true
}

// Response (201)
{
  "success": true,
  "data": {
    "id": "entry_uuid",
    "created_at": "2025-01-18T21:30:00Z",
    "ash_insight": {
      "text": "Pattern detected...",
      "confidence": 0.78
    }
  }
}
```

#### `GET /api/diary/entries/:id`
Obter entry específica (decriptada)

#### `PUT /api/diary/entries/:id`
Atualizar entry

#### `DELETE /api/diary/entries/:id`
Deletar entry

#### `GET /api/diary/search?q=productivity`
Buscar entries (full-text)

#### `POST /api/diary/semantic-search`
Buscar semanticamente

```json
// Request
{
  "query": "How was I feeling about deadlines?",
  "limit": 5
}

// Response
{
  "success": true,
  "data": [
    {
      "id": "entry_uuid",
      "similarity_score": 0.92,
      "excerpt": "..."
    }
  ]
}
```

---

### **ASTROLOGY**

#### `GET /api/astral/today`
Obter dados astrológicos de hoje

```json
// Response
{
  "success": true,
  "data": {
    "transits": [
      {
        "planet": "Moon",
        "sign": "Sagittarius",
        "aspect": "Trine",
        "body": "Venus",
        "interpretation": "Favorable energy for relationships..."
      }
    ],
    "natal_comparison": {
      "sun_sign_alignment": 0.85,
      "moon_sign_alignment": 0.72
    },
    "day_energy_rating": 7.5
  }
}
```

#### `GET /api/astral/profile`
Obter natal chart do usuário

```json
// Response
{
  "success": true,
  "data": {
    "birth_date": "1990-05-15",
    "birth_time": "14:30:00",
    "birth_location": "São Paulo, Brazil",
    "sun_sign": "Taurus",
    "moon_sign": "Pisces",
    "rising_sign": "Libra",
    "natal_chart": { /* ephemeris data */ }
  }
}
```

#### `POST /api/astral/profile`
Atualizar perfil astrológico

---

### **AI / ASH**

#### `POST /api/ai/chat`
Chat com Ash

```json
// Request
{
  "message": "Estou ansioso com meus projetos. O que você acha?",
  "include_context": true
}

// Response
{
  "success": true,
  "data": {
    "response": "Entendo sua preocupação. Baseado em seus dados de mood...",
    "suggestions": [
      "Considere quebrar seus projetos em tarefas menores",
      "Sua energia está em 6/10, talvez descansar ajude"
    ]
  }
}
```

#### `GET /api/ai/sankalpa-daily`
Obter sankalpa de hoje

```json
// Response
{
  "success": true,
  "data": {
    "sankalpa": "Aproveite seu estado de foco para criar algo significativo.",
    "confidence": 0.87,
    "context": {
      "energy_level": 7,
      "mood": "focused",
      "week_trend": "↑ subindo"
    }
  }
}
```

#### `GET /api/ai/insights`
Obter insights gerados

```json
// Response
{
  "success": true,
  "data": [
    {
      "id": "insight_uuid",
      "type": "pattern",
      "title": "Você é produtivo de manhã",
      "text": "Seus melhores momentos de trabalho são entre 8-11am...",
      "confidence": 0.89,
      "source": "energy + task completion data"
    }
  ]
}
```

#### `POST /api/ai/generate-task-description`
Gerar descrição de tarefa automaticamente

```json
// Request
{
  "task_id": "task_uuid",
  "existing_description": "Design algo"
}

// Response
{
  "success": true,
  "data": {
    "generated_description": "Criar interface de dashboard com componentes glassmorphic, suportando temas light/dark, e responsiva para mobile..."
  }
}
```

---

## 🔄 WEBHOOKS

#### `POST /api/webhooks`
Registrar webhook

```json
// Request
{
  "url": "https://example.com/webhook",
  "events": ["task.completed", "mood_entry.created", "diary.created"],
  "is_active": true
}

// Response (201)
{
  "success": true,
  "data": { "id": "webhook_uuid", ... }
}
```

#### `GET /api/webhooks`
Listar webhooks do usuário

#### `DELETE /api/webhooks/:id`
Deletar webhook

---

## ❌ ERROR RESPONSES

Todos os erros seguem este padrão:

```json
{
  "success": false,
  "error": "Human-readable error message",
  "error_code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

## 🔗 LEITURA RELACIONADA

- [🏗️ 06 - Arquitetura Sistema](MANUAL_PRANA_06_ARQUITETURA_SISTEMA.md) - Como API é organizada
- [🔗 11 - Integrações](MANUAL_PRANA_11_INTEGRACIONES.md) - Webhooks em detalhe

---

*Última atualização: Dezembro 2025*  
*Status: ✅ Pronto*
