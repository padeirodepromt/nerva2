# 🏷️ IMPLEMENTAÇÃO DE TAGS E PESSOAL/PROFISSIONAL

**Data:** Dezembro 19, 2025 | **Status:** Análise Técnica

---

## 1️⃣ TAGS - O QUE JÁ EXISTE vs O QUE FALTA

### ✅ O QUE JÁ ESTÁ IMPLEMENTADO

#### 1. TagsInput Component (`src/components/forms/document/TagsInput.jsx`)
```jsx
// Componente completo para adicionar/remover tags
<TagsInput 
  value={tags}
  onChange={setTags}
/>

// Features:
// ✅ Input para adicionar tags (Enter ou + button)
// ✅ Display de tags com badge
// ✅ Remover tags (X button)
// ✅ Animated com Framer Motion
// ✅ Suporte a i18n (placeholder, label)
```

**Usado em:** Diários, notas, documentos

---

#### 2. TagCanvasView (`src/views/TagCanvasView.jsx`)
```jsx
// View para visualizar todos items com uma tag específica
<TagCanvasView tag="marketing" />

// Features:
// ✅ Lista projects, tasks, docs com a tag
// ✅ Lazy loading
// ✅ Timeout de segurança (5s)
// ✅ Integração com router
```

**Usado em:** Navegação, exploração de tags

---

#### 3. TagExplorer Component (`src/components/dashboard/TagExplorer.jsx`)
```jsx
// Sidebar explorer mostrando todas as tags
<TagExplorer 
  onSelectTag={handleSelectTag}
  activeTag={selectedTag}
/>

// Features:
// ✅ Lista tags agregadas (projects + tasks)
// ✅ Contador de items por tag
// ✅ Ordenado por contagem (populares primeiro)
// ✅ Ativo/inativo visual
```

**Usado em:** Dashboard, sidebar

---

#### 4. Schema de Dados
```javascript
// Tabela: tags (já existe)
export const tags = pgTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  color: text('color').default('#94a3b8'),
  icon: text('icon'),
  usageCount: integer('usage_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabela: taskTags (many-to-many - já existe)
export const taskTags = pgTable('task_tags', {
  taskId: text('task_id').references(() => tasks.id),
  tagId: text('tag_id').references(() => tags.id),
  // Chave primária composta
});

// Tasks e Projects têm tagsPreview (cache visual)
tagsPreview: jsonb('tags_preview')
```

---

### ❌ O QUE FALTA IMPLEMENTAR

#### 1. **TagPicker para Modais de Criação**

**Arquivo:** `src/components/forms/TagPicker.jsx` (NOVO)

```jsx
// Componente para modal de criação/edição
export default function TagPicker({ 
  selectedTags, 
  onChange, 
  onCreateTag,
  suggestedTags = [] 
}) {
  return (
    <div className="space-y-3">
      {/* Input busca + criar */}
      <input 
        placeholder="Buscar ou criar tag..."
        onKeyDown={handleCreate}
      />
      
      {/* Tags selecionadas */}
      <TagList tags={selectedTags} onRemove={onChange} />
      
      {/* Sugestões de tags (autocomplete) */}
      <TagSuggestions 
        suggestions={suggestedTags}
        onClick={handleSelectTag}
      />
    </div>
  );
}
```

**Integração em PranaFormModal:**

```jsx
import { TagPicker } from '@/components/forms/TagPicker';

export default function PranaFormModal() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);
  
  useEffect(() => {
    // Carregar tags sugeridas
    fetchSuggestedTags().then(setSuggestedTags);
  }, []);
  
  return (
    <form>
      {/* ... campos existentes ... */}
      
      <TagPicker
        selectedTags={selectedTags}
        onChange={setSelectedTags}
        onCreateTag={handleCreateTag}
        suggestedTags={suggestedTags}
      />
      
      {/* ... */}
    </form>
  );
}
```

---

#### 2. **API Routes para Tags**

**Arquivo:** `src/api/tagsRoutes.js` (NOVO)

```javascript
import { Router } from 'express';
import { db } from '../db/index.js';
import { tags, taskTags } from '../db/schema/core.js';
import { eq, sql } from 'drizzle-orm';

const router = Router();

// GET /api/tags - Listar todas as tags
router.get('/', async (req, res) => {
  try {
    const allTags = await db.query.tags.findMany({
      orderBy: (tags, { desc }) => desc(tags.usageCount)
    });
    res.json(allTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/tags - Criar nova tag
router.post('/', async (req, res) => {
  try {
    const { name, color, icon } = req.body;
    
    // Validação
    if (!name) return res.status(400).json({ error: 'Tag name required' });
    
    // Verificar se já existe
    const existing = await db.query.tags.findFirst({
      where: eq(tags.name, name.toLowerCase())
    });
    
    if (existing) return res.json(existing);
    
    // Criar nova
    const newTag = await db.insert(tags).values({
      name: name.toLowerCase(),
      color: color || '#94a3b8',
      icon: icon
    }).returning();
    
    res.status(201).json(newTag[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tags/suggested - Tags sugeridas baseadas em contexto
router.get('/suggested', async (req, res) => {
  try {
    // Retorna top 10 tags mais usadas
    const topTags = await db.query.tags.findMany({
      orderBy: (tags, { desc }) => desc(tags.usageCount),
      limit: 10
    });
    res.json(topTags);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/tags/:id/items - Items com uma tag específica
router.get('/:tagId/items', async (req, res) => {
  try {
    const { tagId } = req.params;
    
    // Buscar tasks com a tag
    const items = await db.select().from(taskTags)
      .where(eq(taskTags.tagId, tagId));
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
```

**Integrar em server.js:**

```javascript
import tagsRoutes from './src/api/tagsRoutes.js';

// ... outros routes ...
app.use('/api/tags', authenticate, tagsRoutes); // Com autenticação
```

---

#### 3. **Atualizar Tasks/Projects para Usar Tabela taskTags**

**Atualmente:** tags estão em `tagsPreview` (string JSON)  
**Deveria ser:** Relacionado corretamente via tabela `taskTags`

```javascript
// Ao salvar uma task com tags:

const newTask = await db.insert(tasks).values({
  id: createId(),
  title,
  description,
  projectId,
  ownerId,
  // ... outros campos ...
}).returning();

// Depois, criar as associações em taskTags
if (selectedTags && selectedTags.length > 0) {
  for (const tagId of selectedTags) {
    await db.insert(taskTags).values({
      taskId: newTask[0].id,
      tagId: tagId
    });
  }
}

// Retornar task com tags populadas
const taskWithTags = await db.query.tasks.findFirst({
  where: eq(tasks.id, newTask[0].id),
  with: { tags: true } // Relação Drizzle
});
```

---

### 📋 RESUMO: O QUE FALTA EM TAGS

| Item | Status | Tempo |
|------|--------|-------|
| TagPicker component | ❌ | 30 min |
| API routes | ❌ | 30 min |
| Integração modais | ❌ | 45 min |
| Drizzle relations | ⏳ Parcial | 20 min |
| Teste integrado | ❌ | 30 min |
| **TOTAL** | | **2.5h** |

---

---

## 2️⃣ PESSOAL vs PROFISSIONAL - IMPLEMENTAÇÃO

### 📐 Arquitetura

```
┌─────────────────────────────────────┐
│ Project                             │
├─────────────────────────────────────┤
│ id                                  │
│ title                               │
│ description                         │
│ ownerId                             │
│ teamId (null = pessoal)             │
│ ├─→ type: "personal" | "prof"       │ ← NOVO
│ ├─→ isShared: false | true          │ ← NOVO
│ └─→ visibility: "private" | "shared"│ ← NOVO
│ ... outros campos ...               │
└─────────────────────────────────────┘
```

---

### 1️⃣ **SCHEMA - Adicionar Campos**

**Arquivo:** `src/db/schema/core.js`

```javascript
export const projects = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),
  parentId: text('parent_id'),
  
  ownerId: text('owner_id').references(() => users.id),
  teamId: text('team_id').references(() => teams.id),
  
  // [NOVO] Tipo de projeto
  type: text('type', { enum: ['personal', 'professional'] })
    .default('personal')
    .notNull(),
  
  // [NOVO] Se profissional, pode ser compartilhado
  isShared: boolean('is_shared').default(false).notNull(),
  
  // [NOVO] Controle de visibilidade (simplificado)
  visibility: text('visibility', { enum: ['private', 'shared', 'public'] })
    .default('private')
    .notNull(),
  
  // Campos existentes
  status: text('status').default('active').notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  color: text('color').default('#3B82F6'),
  icon: text('icon'),
  settings: jsonb('settings').default({}),
  templateId: text('template_id').references(() => templates.id),
  customData: jsonb('custom_data'),
  plannerSlot: jsonb('planner_slot'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
```

**Executar migration:**
```bash
npm run db:generate   # Gera arquivos
npm run db:push       # Aplica ao banco
```

---

### 2️⃣ **UI - Seletor ao Criar Projeto**

**Arquivo:** `src/components/modals/PranaFormModal.jsx` (MODIFICAR)

```jsx
import { useTranslations } from '@/components/LanguageProvider';

export default function PranaFormModal({ onClose, onSubmit }) {
  const t = useTranslations();
  const [projectType, setProjectType] = useState('personal');
  const [isShared, setIsShared] = useState(false);
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Campos existentes */}
      <div>
        <label>{t('form_title')}</label>
        <input type="text" name="title" required />
      </div>
      
      <div>
        <label>{t('form_description')}</label>
        <textarea name="description" />
      </div>
      
      {/* [NOVO] Tipo de Projeto */}
      <div className="space-y-3">
        <label className="text-sm font-medium">
          {t('project_type_label') || 'Tipo de Projeto'}
        </label>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Pessoal */}
          <button
            type="button"
            onClick={() => {
              setProjectType('personal');
              setIsShared(false); // Pessoal não pode ser compartilhado
            }}
            className={cn(
              "p-3 border-2 rounded-lg transition-all",
              projectType === 'personal'
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="text-sm font-semibold">
              🔒 {t('project_personal') || 'Pessoal'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {t('project_personal_desc') || 'Apenas você vê'}
            </div>
          </button>
          
          {/* Profissional */}
          <button
            type="button"
            onClick={() => setProjectType('professional')}
            className={cn(
              "p-3 border-2 rounded-lg transition-all",
              projectType === 'professional'
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="text-sm font-semibold">
              👥 {t('project_professional') || 'Profissional'}
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {t('project_professional_desc') || 'Pode compartilhar com time'}
            </div>
          </button>
        </div>
      </div>
      
      {/* [NOVO] Compartilhamento (só se profissional) */}
      {projectType === 'professional' && (
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isShared}
              onChange={(e) => setIsShared(e.target.checked)}
            />
            <span className="text-sm">
              {t('project_share_team') || 'Compartilhar com time'}
            </span>
          </label>
          
          {isShared && (
            <select className="w-full px-3 py-2 border rounded-lg">
              <option value="">Selecione um time...</option>
              {teams.map(team => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      
      {/* Botões */}
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded border"
        >
          {t('button_cancel')}
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded bg-indigo-500 text-white"
        >
          {t('button_create')}
        </button>
      </div>
    </form>
  );
}
```

**Adicionar ao LanguageProvider.jsx:**

```javascript
const translations = {
  pt: {
    project_type_label: "Tipo de Projeto",
    project_personal: "Pessoal",
    project_personal_desc: "Apenas você vê",
    project_professional: "Profissional",
    project_professional_desc: "Pode compartilhar com time",
    project_share_team: "Compartilhar com time",
  },
  en: {
    project_type_label: "Project Type",
    project_personal: "Personal",
    project_personal_desc: "Only you can see it",
    project_professional: "Professional",
    project_professional_desc: "Share with your team",
    project_share_team: "Share with team",
  },
  es: {
    project_type_label: "Tipo de Proyecto",
    project_personal: "Personal",
    project_personal_desc: "Solo tú lo ves",
    project_professional: "Profesional",
    project_professional_desc: "Compartir con equipo",
    project_share_team: "Compartir con equipo",
  }
};
```

---

### 3️⃣ **Filtros no Dashboard**

**Arquivo:** `src/hooks/useProjects.js` (NOVO ou MODIFICAR)

```javascript
export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchProjects = async () => {
      let query = '/api/projects';
      const params = new URLSearchParams();
      
      // Filtro por tipo
      if (filters.type === 'personal') {
        params.append('type', 'personal');
      } else if (filters.type === 'professional') {
        params.append('type', 'professional');
      }
      
      // Filtro por compartilhamento
      if (filters.shared === true) {
        params.append('shared', 'true');
      }
      
      if (params.toString()) {
        query += `?${params.toString()}`;
      }
      
      const response = await fetch(query);
      const data = await response.json();
      setProjects(data);
    };
    
    fetchProjects();
  }, [filters]);
  
  return { projects };
}
```

**Usar em Dashboard:**

```jsx
export default function DashboardView() {
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'personal', 'professional'
  const { projects } = useProjects({ 
    type: typeFilter === 'all' ? undefined : typeFilter 
  });
  
  return (
    <div>
      {/* Filtro */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTypeFilter('all')}
          className={typeFilter === 'all' ? 'bg-indigo-500' : 'bg-gray-200'}
        >
          Tudo
        </button>
        <button
          onClick={() => setTypeFilter('personal')}
          className={typeFilter === 'personal' ? 'bg-indigo-500' : 'bg-gray-200'}
        >
          Pessoal
        </button>
        <button
          onClick={() => setTypeFilter('professional')}
          className={typeFilter === 'professional' ? 'bg-indigo-500' : 'bg-gray-200'}
        >
          Profissional
        </button>
      </div>
      
      {/* Lista de projetos */}
      <div>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
```

---

### 4️⃣ **API Backend**

**Arquivo:** `src/api/projectRoutes.js` (MODIFICAR)

```javascript
// GET /api/projects - Com filtros
router.get('/', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { type, shared } = req.query;
    
    let whereConditions = [
      eq(projects.ownerId, userId)
    ];
    
    // Filtro por tipo
    if (type) {
      whereConditions.push(eq(projects.type, type));
    }
    
    // Filtro por compartilhamento
    if (shared === 'true') {
      whereConditions.push(eq(projects.isShared, true));
    }
    
    const userProjects = await db.query.projects.findMany({
      where: and(...whereConditions),
      orderBy: (projects, { desc }) => desc(projects.createdAt)
    });
    
    res.json(userProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/projects - Criar com tipo
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, type = 'personal', isShared = false, teamId } = req.body;
    
    // Validação
    if (type === 'personal' && isShared) {
      return res.status(400).json({ 
        error: 'Personal projects cannot be shared' 
      });
    }
    
    const newProject = await db.insert(projects).values({
      id: createId(),
      title,
      description,
      type,
      isShared,
      visibility: isShared ? 'shared' : 'private',
      teamId: isShared ? teamId : null,
      ownerId: req.user.id,
    }).returning();
    
    res.status(201).json(newProject[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### 📋 RESUMO: O QUE FALTA EM PESSOAL/PROFISSIONAL

| Item | Status | Tempo |
|------|--------|-------|
| Schema (3 campos) | ❌ | 10 min |
| Migration | ❌ | 5 min |
| UI Seletor | ❌ | 45 min |
| API Filtros | ❌ | 30 min |
| Traduções | ❌ | 15 min |
| Dashboard Filtros | ❌ | 30 min |
| **TOTAL** | | **2.5h** |

---

## 🎯 PRÓXIMOS PASSOS

### Recomendação de Ordem:

**Dia 1:**
1. ✅ Schema + Migration (15 min) - Base de tudo
2. ✅ UI Seletor + Traduções (60 min)
3. ✅ API + Filtros (60 min)

**Dia 2:**
4. ✅ Dashboard Filtros (30 min)
5. ✅ TagPicker + API Tags (90 min)
6. ✅ Integração nos Modais (45 min)

**Dia 3:**
7. ✅ Testes integrados
8. ✅ Build + Deploy

---

**👉 Qual implementar primeiro: TAGS ou PESSOAL/PROFISSIONAL?**

Recomendo: **PESSOAL/PROFISSIONAL PRIMEIRO** (é a base arquitetural)

Depois: **TAGS** (dependerá de modais funcionando bem)