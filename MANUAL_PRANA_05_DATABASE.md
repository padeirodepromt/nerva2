# 🗄️ MANUAL PRANA 05 - SCHEMA & BANCO DE DADOS

**Versão:** 3.0.1 | **Capítulo:** 05 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo documenta a **estrutura completa do banco de dados** de Prana: todas as tabelas, relacionamentos, índices, constraints e decisões de design.

**Público:** Desenvolvedores, DBAs, Arquitetos  
**Tempo de leitura:** 45 minutos  
**Pré-requisitos:** [Capítulo 04 - Stack Tecnológico](MANUAL_PRANA_04_STACK.md)

---

## 🏗️ VISÃO GERAL

```
PRANA DATABASE (LibSQL + Drizzle ORM)

┌──────────────────────────────────────────────────────┐
│              BANCO DE DADOS PRANA                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  CORE TABLES (Base)                                 │
│  ├─ users                                           │
│  ├─ projects                                        │
│  └─ tasks                                           │
│                                                      │
│  ENERGY & MOOD TABLES                               │
│  ├─ energy_checkins                                 │
│  ├─ mood_entries                                    │
│  └─ emotion_tags                                    │
│                                                      │
│  DIARY & MEMORY TABLES (Papyrus)                    │
│  ├─ diary_entries                                   │
│  ├─ diary_insights                                  │
│  └─ diary_attachments                               │
│                                                      │
│  ASTROLOGY TABLES                                   │
│  ├─ user_astrological_profiles                      │
│  ├─ astrological_readings                           │
│  └─ astral_transits                                 │
│                                                      │
│  RELATIONSHIP TABLES                                │
│  ├─ task_dependencies                               │
│  ├─ task_documents                                  │
│  ├─ project_members                                 │
│  └─ custom_fields                                   │
│                                                      │
│  AI & INSIGHTS TABLES                               │
│  ├─ ash_conversations                               │
│  ├─ generated_insights                              │
│  └─ sankalpas                                       │
│                                                      │
│  INTEGRATION TABLES                                 │
│  ├─ oauth_tokens                                    │
│  ├─ webhooks                                        │
│  └─ external_integrations                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## 📑 TABELAS DETALHADAS

### **PART 1: CORE TABLES**

#### **1. `users`**

Armazena informações de usuários.

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  
  -- Profile
  name TEXT,
  avatar_url TEXT,
  bio TEXT,
  
  -- Preferences
  theme TEXT DEFAULT 'prana-dark',
  language TEXT DEFAULT 'pt-br',
  timezone TEXT DEFAULT 'UTC',
  
  -- Astrological Profile
  birth_date DATE,
  birth_time TIME,
  birth_location TEXT,
  birth_latitude FLOAT,
  birth_longitude FLOAT,
  
  -- System
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  -- Verification
  email_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  
  -- Subscriptions
  subscription_plan TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  subscription_started_at TIMESTAMP,
  subscription_ends_at TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);
```

**Relacionamentos:**
- `1 → many` projects
- `1 → many` energy_checkins
- `1 → many` mood_entries
- `1 → many` diary_entries
- `1 → many` astrological_readings

---

#### **2. `projects`**

Agrupa tarefas em contextos maiores.

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Content
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  
  -- Organization
  parent_project_id TEXT REFERENCES projects(id),
  sort_order INTEGER,
  
  -- Status
  status TEXT DEFAULT 'active',
  archived BOOLEAN DEFAULT FALSE,
  archived_at TIMESTAMP,
  
  -- Views Configuration
  default_view TEXT DEFAULT 'sheet', -- sheet, kanban, mindmap
  kanban_config JSON, -- { stages: [...] }
  sheet_config JSON, -- { columns: [...] }
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  started_at TIMESTAMP,
  due_date DATE
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_parent_id ON projects(parent_project_id);
CREATE INDEX idx_projects_status ON projects(status);
```

**Relacionamentos:**
- `many → 1` users (user_id)
- `1 → many` tasks
- `many → many` project_members
- `1 → many` custom_fields

---

#### **3. `tasks`**

Unidade atômica de ação.

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  project_id TEXT NOT NULL REFERENCES projects(id),
  
  -- Content
  title TEXT NOT NULL,
  description TEXT,
  
  -- Task Metadata
  status TEXT DEFAULT 'todo', -- todo, in_progress, done
  priority TEXT DEFAULT 'medium', -- low, medium, high
  energy_required TEXT, -- low, medium, high
  estimated_time_minutes INTEGER,
  
  -- Scheduling
  due_date DATE,
  due_time TIME,
  start_date DATE,
  reminder_at TIMESTAMP,
  
  -- Assignment
  assigned_to_user_id TEXT REFERENCES users(id),
  
  -- Organization
  sort_order INTEGER,
  kanban_position TEXT, -- JSON: { status: 'in_progress', order: 3 }
  
  -- Spark Integration
  is_spark BOOLEAN DEFAULT FALSE,
  spark_original_id TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Relationships
  parent_task_id TEXT REFERENCES tasks(id), -- Para subtasks
  
  -- Holistic
  related_diary_entry_id TEXT REFERENCES diary_entries(id),
  related_emotion_tags TEXT -- JSON: ["happy", "productive"]
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_parent_id ON tasks(parent_task_id);
```

**Relacionamentos:**
- `many → 1` users
- `many → 1` projects
- `1 → many` task_dependencies
- `many → many` task_documents
- `1 → many` tasks (self-join para subtasks)

---

### **PART 2: ENERGY & MOOD TABLES**

#### **4. `energy_checkins`**

Rastreamento diário de energia.

```sql
CREATE TABLE energy_checkins (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Energy Data
  energy_level INTEGER NOT NULL, -- 1-10
  timestamp TIMESTAMP NOT NULL,
  date_only DATE NOT NULL,
  
  -- Context
  context TEXT, -- "morning", "afternoon", "evening"
  note TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_energy_user_date ON energy_checkins(user_id, date_only);
CREATE INDEX idx_energy_timestamp ON energy_checkins(timestamp);
```

---

#### **5. `mood_entries`**

Estados emocionais rastreados.

```sql
CREATE TABLE mood_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Mood Data
  primary_mood TEXT NOT NULL, -- "happy", "anxious", "calm", "energized", etc
  secondary_moods TEXT, -- JSON: ["focused", "peaceful"]
  intensity INTEGER, -- 1-10
  
  -- Context
  note TEXT,
  timestamp TIMESTAMP NOT NULL,
  date_only DATE NOT NULL,
  
  -- Triggers
  trigger_task_id TEXT REFERENCES tasks(id),
  trigger_event TEXT,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mood_user_date ON mood_entries(user_id, date_only);
CREATE INDEX idx_mood_primary ON mood_entries(primary_mood);
```

---

#### **6. `emotion_tags`**

Tags/labels de emoções customizáveis.

```sql
CREATE TABLE emotion_tags (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  name TEXT NOT NULL,
  color TEXT,
  emoji TEXT,
  frequency INTEGER DEFAULT 0, -- Count de uso
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, name)
);
```

---

### **PART 3: DIARY & MEMORY TABLES (Papyrus)**

#### **7. `diary_entries`**

Entradas de journal/diário.

```sql
CREATE TABLE diary_entries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Content
  title TEXT,
  content TEXT NOT NULL,
  
  -- Metadata
  date DATE NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Tags
  mood_tags TEXT, -- JSON: ["happy", "productive"]
  category TEXT, -- "reflection", "gratitude", "learning", "challenge"
  
  -- Relationships
  related_task_ids TEXT, -- JSON: [task_id1, task_id2]
  related_project_ids TEXT, -- JSON: [project_id1]
  
  -- Search/Archive
  full_text_search TEXT, -- Denormalized for search
  is_private BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Papyrus - Memory System
  memory_score FLOAT DEFAULT 0.5, -- 0-1: How important is this?
  last_referenced_at TIMESTAMP, -- Quando foi último link
  similarity_score FLOAT -- Para finding similar entries
);

CREATE INDEX idx_diary_user_date ON diary_entries(user_id, date);
CREATE INDEX idx_diary_category ON diary_entries(category);
CREATE INDEX idx_diary_search ON diary_entries(full_text_search);
```

---

#### **8. `diary_insights`**

Insights gerados por Ash sobre entradas.

```sql
CREATE TABLE diary_insights (
  id TEXT PRIMARY KEY,
  diary_entry_id TEXT NOT NULL REFERENCES diary_entries(id),
  
  -- Insight Data
  insight_text TEXT NOT NULL,
  insight_type TEXT, -- "pattern", "connection", "advice", "reflection"
  confidence FLOAT, -- 0-1
  
  -- Generation
  generated_by TEXT DEFAULT 'ash', -- Future: other AI agents
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- User Interaction
  is_helpful BOOLEAN,
  user_feedback TEXT
);

CREATE INDEX idx_insights_diary ON diary_insights(diary_entry_id);
```

---

#### **9. `diary_attachments`**

Arquivos anexados a entradas.

```sql
CREATE TABLE diary_attachments (
  id TEXT PRIMARY KEY,
  diary_entry_id TEXT NOT NULL REFERENCES diary_entries(id),
  
  -- File Data
  file_name TEXT NOT NULL,
  file_type TEXT, -- "image", "audio", "sketch", "document"
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  
  -- Metadata
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_attachments_diary ON diary_attachments(diary_entry_id);
```

---

### **PART 4: ASTROLOGY TABLES**

#### **10. `user_astrological_profiles`**

Perfis astrológicos dos usuários.

```sql
CREATE TABLE user_astrological_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE REFERENCES users(id),
  
  -- Birth Data
  birth_date DATE NOT NULL,
  birth_time TIME NOT NULL,
  birth_location TEXT NOT NULL,
  birth_latitude FLOAT NOT NULL,
  birth_longitude FLOAT NOT NULL,
  
  -- Natal Chart (Cached)
  sun_sign TEXT,
  moon_sign TEXT,
  rising_sign TEXT,
  
  natal_chart_json JSON, -- Completo ephemeris data
  
  -- Preferences
  selected_systems TEXT DEFAULT 'tropical', -- tropical, sidereal
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Recalculation
  last_calculated_at TIMESTAMP,
  needs_recalculation BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_astro_user ON user_astrological_profiles(user_id);
```

---

#### **11. `astrological_readings`**

Leituras astrológicas diárias/periódicas.

```sql
CREATE TABLE astrological_readings (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Reading Data
  reading_date DATE NOT NULL,
  reading_type TEXT, -- "daily", "weekly", "monthly"
  
  -- Transits
  major_transits TEXT, -- JSON: [{ planet, aspect, duration }]
  current_aspects JSON,
  
  -- Generated Content
  interpretation TEXT,
  advice TEXT,
  
  -- Sankalpa Integration
  sankalpa_generated BOOLEAN DEFAULT FALSE,
  sankalpa_id TEXT REFERENCES sankalpas(id),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_readings_user_date ON astrological_readings(user_id, reading_date);
```

---

#### **12. `astral_transits`**

Cache de trânsitos calculados.

```sql
CREATE TABLE astral_transits (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Transit Info
  date DATE NOT NULL,
  planet TEXT NOT NULL,
  house INTEGER,
  sign TEXT,
  degree FLOAT,
  
  -- Ephemeris Data
  latitude FLOAT,
  longitude FLOAT,
  speed FLOAT,
  
  calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transits_user_date ON astral_transits(user_id, date);
CREATE INDEX idx_transits_planet ON astral_transits(planet);
```

---

### **PART 5: RELATIONSHIP & ORGANIZATION TABLES**

#### **13. `task_dependencies`**

Relacionamentos entre tarefas.

```sql
CREATE TABLE task_dependencies (
  id TEXT PRIMARY KEY,
  
  task_id TEXT NOT NULL REFERENCES tasks(id),
  depends_on_task_id TEXT NOT NULL REFERENCES tasks(id),
  
  -- Relationship Type
  dependency_type TEXT, -- "blocks", "blocked_by", "relates_to", "subtask_of"
  
  -- Status
  is_satisfied BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(task_id, depends_on_task_id)
);

CREATE INDEX idx_deps_task ON task_dependencies(task_id);
CREATE INDEX idx_deps_depends_on ON task_dependencies(depends_on_task_id);
```

---

#### **14. `task_documents`**

Documentos/files relacionados a tarefas.

```sql
CREATE TABLE task_documents (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL REFERENCES tasks(id),
  
  -- Document Info
  document_name TEXT NOT NULL,
  document_type TEXT, -- "pdf", "image", "text", "link"
  document_url TEXT NOT NULL,
  
  -- Metadata
  uploaded_by_user_id TEXT REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  file_size_bytes INTEGER
);

CREATE INDEX idx_docs_task ON task_documents(task_id);
```

---

#### **15. `project_members`**

Membros de projetos (para colaboração futura).

```sql
CREATE TABLE project_members (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Role
  role TEXT DEFAULT 'member', -- 'owner', 'editor', 'viewer'
  
  -- Permissions
  can_edit BOOLEAN DEFAULT TRUE,
  can_invite BOOLEAN DEFAULT FALSE,
  can_delete BOOLEAN DEFAULT FALSE,
  
  -- Status
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  UNIQUE(project_id, user_id)
);

CREATE INDEX idx_members_project ON project_members(project_id);
CREATE INDEX idx_members_user ON project_members(user_id);
```

---

#### **16. `custom_fields`**

Fields customizáveis por projeto.

```sql
CREATE TABLE custom_fields (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  
  -- Field Definition
  field_name TEXT NOT NULL,
  field_type TEXT, -- "text", "number", "date", "select", "multiselect"
  field_config JSON, -- { options: [...], default: ... }
  
  -- Organization
  sort_order INTEGER,
  is_visible_in_sheet BOOLEAN DEFAULT TRUE,
  is_visible_in_kanban BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(project_id, field_name)
);

CREATE INDEX idx_custom_fields_project ON custom_fields(project_id);
```

---

### **PART 6: AI & INSIGHTS TABLES**

#### **17. `ash_conversations`**

Histórico de conversas com Ash.

```sql
CREATE TABLE ash_conversations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Conversation
  session_id TEXT,
  message_role TEXT, -- "user", "assistant"
  message_content TEXT NOT NULL,
  
  -- Context
  conversation_context JSON, -- { energy, mood, tasks, projects }
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  tokens_used INTEGER
);

CREATE INDEX idx_ash_user_session ON ash_conversations(user_id, session_id);
CREATE INDEX idx_ash_created_at ON ash_conversations(created_at);
```

---

#### **18. `generated_insights`**

Insights gerados pelo sistema.

```sql
CREATE TABLE generated_insights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Insight
  insight_text TEXT NOT NULL,
  insight_category TEXT, -- "energy_pattern", "mood_trigger", "productivity_tip"
  confidence FLOAT,
  
  -- Source
  source_data JSON, -- { energy_trend: [...], mood_data: [...] }
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- User Action
  was_viewed BOOLEAN DEFAULT FALSE,
  viewed_at TIMESTAMP,
  user_feedback TEXT
);

CREATE INDEX idx_insights_user ON generated_insights(user_id);
CREATE INDEX idx_insights_category ON generated_insights(insight_category);
```

---

#### **19. `sankalpas`**

Intenções diárias geradas.

```sql
CREATE TABLE sankalpas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Sankalpa Content
  sankalpa_text TEXT NOT NULL,
  sankalpa_date DATE NOT NULL,
  
  -- Generation Context
  context_energy_level INTEGER,
  context_mood TEXT,
  context_week_trend TEXT,
  context_astral_data TEXT,
  
  -- Confidence
  confidence FLOAT,
  
  -- User Interaction
  was_shown BOOLEAN DEFAULT FALSE,
  shown_at TIMESTAMP,
  user_feedback TEXT, -- "resonates", "not_resonating", null
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sankalpas_user_date ON sankalpas(user_id, sankalpa_date);
```

---

### **PART 7: INTEGRATION TABLES**

#### **20. `oauth_tokens`**

Tokens para integrações OAuth.

```sql
CREATE TABLE oauth_tokens (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Provider
  provider TEXT NOT NULL, -- "google", "meta", "github"
  provider_user_id TEXT,
  
  -- Tokens
  access_token TEXT NOT NULL ENCRYPTED,
  refresh_token TEXT ENCRYPTED,
  token_type TEXT,
  expires_at TIMESTAMP,
  
  -- Metadata
  scope TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, provider)
);

CREATE INDEX idx_oauth_user_provider ON oauth_tokens(user_id, provider);
```

---

#### **21. `webhooks`**

Webhooks para integrações.

```sql
CREATE TABLE webhooks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Webhook Config
  url TEXT NOT NULL,
  event_type TEXT NOT NULL, -- "task.created", "diary.updated"
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Delivery Info
  last_delivered_at TIMESTAMP,
  failed_attempts INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_webhooks_user ON webhooks(user_id);
CREATE INDEX idx_webhooks_event ON webhooks(event_type);
```

---

#### **22. `external_integrations`**

Integrações ativas do usuário.

```sql
CREATE TABLE external_integrations (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Integration
  integration_name TEXT NOT NULL, -- "google_calendar", "slack", "meta_ads"
  integration_config JSON,
  
  -- Status
  is_enabled BOOLEAN DEFAULT TRUE,
  last_synced_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, integration_name)
);

CREATE INDEX idx_integrations_user ON external_integrations(user_id);
```

---

## 📊 DIAGRAMAS DE RELACIONAMENTOS

### Core Entity Relationships

```
users
  ├─1:N→ projects
  ├─1:N→ tasks
  ├─1:N→ energy_checkins
  ├─1:N→ mood_entries
  ├─1:N→ diary_entries
  ├─1:1→ user_astrological_profiles
  ├─1:N→ astrological_readings
  ├─1:N→ ash_conversations
  ├─1:N→ generated_insights
  └─1:N→ sankalpas

projects
  ├─N:1→ users (owner)
  ├─1:N→ tasks
  ├─1:N→ custom_fields
  ├─N:N→ project_members
  └─1:N→ kanban_stages

tasks
  ├─N:1→ projects
  ├─N:1→ users (created_by)
  ├─N:1→ users (assigned_to)
  ├─N:1→ tasks (parent_task - self-join para subtasks)
  ├─1:N→ task_dependencies
  ├─1:N→ task_documents
  └─N:1→ diary_entries (related)

diary_entries
  ├─N:1→ users
  ├─N:N→ tasks (related_task_ids)
  ├─N:N→ projects (related_project_ids)
  └─1:N→ diary_attachments
  └─1:N→ diary_insights
```

---

## 🔑 CONSTRAINTS E INDICES

### Performance Indices

```sql
-- Core Queries
CREATE INDEX idx_user_recent_tasks ON tasks(user_id, created_at DESC);
CREATE INDEX idx_project_active_tasks ON tasks(project_id, status) 
  WHERE status != 'done';
CREATE INDEX idx_energy_week_trend ON energy_checkins(user_id, date_only) 
  WHERE date_only >= CURRENT_DATE - INTERVAL '7 days';
CREATE INDEX idx_mood_month_trend ON mood_entries(user_id, date_only) 
  WHERE date_only >= CURRENT_DATE - INTERVAL '30 days';

-- Full-text Search (Papyrus)
CREATE INDEX idx_diary_full_text ON diary_entries 
  USING GIN(to_tsvector('portuguese', full_text_search));

-- Time-series Data
CREATE INDEX idx_task_due_date_upcoming ON tasks(user_id, due_date) 
  WHERE status != 'done' AND due_date >= CURRENT_DATE;
```

---

## 🔐 CONSTRAINTS

```sql
-- Foreign Key Constraints
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_project 
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

ALTER TABLE diary_entries ADD CONSTRAINT fk_diary_user 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Check Constraints
ALTER TABLE energy_checkins ADD CONSTRAINT check_energy_range 
  CHECK (energy_level >= 1 AND energy_level <= 10);

ALTER TABLE mood_entries ADD CONSTRAINT check_intensity_range 
  CHECK (intensity >= 1 AND intensity <= 10);

ALTER TABLE tasks ADD CONSTRAINT check_valid_status 
  CHECK (status IN ('todo', 'in_progress', 'done'));

-- Unique Constraints
ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);
ALTER TABLE emotion_tags ADD CONSTRAINT unique_user_tag UNIQUE (user_id, name);
```

---

## 🔄 MIGRATION STRATEGY

### Using Drizzle Migrations

```bash
# Create migration
drizzle-kit generate:sqlite prana_initial

# Apply migration
drizzle-kit push:sqlite

# Drop all (dev only)
drizzle-kit drop
```

### Migration Files Structure

```
/migrations
  ├─ 0001_initial_schema.sql
  ├─ 0002_add_energy_tables.sql
  ├─ 0003_add_diary_tables.sql
  ├─ 0004_add_astrology_tables.sql
  ├─ 0005_add_indices.sql
  └─ 0006_add_constraints.sql
```

---

## 📈 ESCALABILIDADE

### Estratégia de Scaling

1. **Caching**: Redis para energia/mood trends
2. **Archiving**: Move old diary entries para cold storage
3. **Sharding**: User-based sharding se necessário
4. **Read Replicas**: Para analytics/reporting heavy

### Query Optimization

```javascript
// BAD: N+1 Query
const projects = await db.select().from(projects).where(eq(projects.user_id, userId));
for (const project of projects) {
  const tasks = await db.select().from(tasks).where(eq(tasks.project_id, project.id));
}

// GOOD: Single Query com Join
const projectsWithTasks = await db.select()
  .from(projects)
  .leftJoin(tasks, eq(projects.id, tasks.project_id))
  .where(eq(projects.user_id, userId));
```

---

## 🔗 LEITURA RELACIONADA

- [⚙️ 04 - Stack Tecnológico](MANUAL_PRANA_04_STACK.md) - Tecnologias usadas
- [🏗️ 06 - Arquitetura Sistema](MANUAL_PRANA_06_ARQUITETURA_SISTEMA.md) - Como dados fluem
- [👨‍💻 12 - Guia do Desenvolvedor](MANUAL_PRANA_12_GUIA_DEV.md) - Setup com Drizzle

---

**Próximo capítulo:** [🏗️ 06 - Arquitetura Sistema](MANUAL_PRANA_06_ARQUITETURA_SISTEMA.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
