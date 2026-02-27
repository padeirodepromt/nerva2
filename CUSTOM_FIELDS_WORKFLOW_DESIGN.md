# CUSTOM FIELDS & WORKFLOW DESIGN SPECIFICATION

**Status:** Design Approved ✅  
**Date:** December 18, 2025  
**Version:** 1.0

---

## EXECUTIVE SUMMARY

Every project is **personalizable but never blank**:
- Projects always start with a **default foundation** (4 statuses, base fields)
- Users can **add/edit/remove fields and statuses** at any time
- Templates are **optional shortcuts** that pre-populate common configurations
- Users can **selectively choose** which template fields to inherit

---

## 1. CORE PRINCIPLES

### 1.1 Always Has a Foundation

Every project **always starts** with:

**Default Statuses (KanbanView):**
```
[todo] → [in_progress] → [blocked] → [done]
```

**Base Fields (SheetView & TaskModal):**
```
[Check] [Title*] [Assignee] [Status*]
```

### 1.2 Everything is Customizable

- ✅ Add custom fields
- ✅ Add custom statuses  
- ✅ Edit field properties (name, type, options)
- ✅ Reorder fields and statuses
- ✅ Remove custom fields and statuses
- ❌ Cannot remove **base fields** (always present)
- ❌ Cannot remove **fields inherited from template** (if created from template)

### 1.3 Templates are Optional Paths

Templates are **convenience shortcuts**, not enforcement:
- User can choose "No Template" → starts with defaults only
- User can choose "Template: Dev" → gets prompted to select which fields to inherit
- User can ignore templates entirely and build from scratch
- Projects created from templates can still be heavily customized

---

## 2. USER JOURNEYS

### Journey A: New Blank Project

```
1. Dashboard → "+ New Project"
2. Modal: "Create Project"
   ├─ Name: [______]
   ├─ Description: [______]
   ├─ Template: [No Template ▼]  ← Default selected
   └─ [Create]

3. Project created:
   project {
     id: "proj_abc123",
     name: "My New Project",
     template_id: NULL,
     type: "blank"
   }

4. SheetView shows:
   [Check] [Title] [Assignee] [Status]
   └─ Status has 4 options: todo, in_progress, blocked, done

5. KanbanView shows:
   [Todo | In Progress | Blocked | Done]

6. TaskModal shows:
   - Title (required)
   - Assignee (optional)
   - Status (required) → dropdown with 4 options
   - No extra fields

7. User can immediately:
   ✅ Add new field: "Epic" (dropdown)
   ✅ Add new field: "Points" (number)
   ✅ Add new status: "Review"
   ✅ Rename "Blocked" to "On Hold"
   ✅ Remove any custom status (except the defaults if no alternatives)

8. After customization example:
   SheetView: [Check] [Title] [Assignee] [Status] [Epic] [Points]
   KanbanView: [Todo | In Progress | On Hold | Review | Done]
   TaskModal: Shows all 6 fields
```

### Journey B: Project from Template (with Selection)

```
1. Dashboard → "+ New Project"
2. Modal: "Create Project"
   ├─ Name: [______]
   ├─ Description: [______]
   ├─ Template: [Desenvolvimento ▼]
   └─ [Next]

3. Template Selection Modal appears:

   ╔═════════════════════════════════════════╗
   ║ Template: Desenvolvimento de Software  ║
   ╠═════════════════════════════════════════╣
   ║                                         ║
   ║ CAMPOS DISPONÍVEIS:                    ║
   ║ ☑ Epic                                  ║
   ║ ☑ Story Points                          ║
   ║ ☑ Sprint                                ║
   ║ ☑ Component                             ║
   ║ ☑ Reviewer                              ║
   ║ ☑ Labels                                ║
   ║                                         ║
   ║ WORKFLOW:                              ║
   ║ ☑ Backlog                               ║
   ║ ☑ Ready                                 ║
   ║ ☑ In Dev                                ║
   ║ ☑ Review                                ║
   ║ ☑ Done                                  ║
   ║                                         ║
   ║ [Desselect All] [Select All] [Create] ║
   ╚═════════════════════════════════════════╝

4. User can:
   - Uncheck "Labels" (doesn't want that field)
   - Uncheck "Reviewer" (doesn't want that field)
   - Keep: Epic, Story Points, Sprint, Component
   - Keep all 5 statuses

5. Project created:
   project {
     id: "proj_dev789",
     name: "My Dev Project",
     template_id: "dev_template",
     type: "from_template"
   }

6. SheetView shows:
   [Check] [Title] [Assignee] [Status] [Epic] [Story Points] [Sprint] [Component]
   └─ 4 template fields inherited

7. KanbanView shows:
   [Backlog | Ready | In Dev | Review | Done]
   └─ 5 template statuses inherited

8. User can:
   ✅ Add new field: "Priority"
   ✅ Add new status: "Testing"
   ✅ Edit "Component" dropdown options
   ✅ Reorder fields and statuses
   ❌ Cannot delete "Epic" (from template)
   ❌ Cannot delete "Story Points" (from template)
   ❌ Cannot delete "Backlog" status (from template)
```

### Journey C: Template + Add Custom Field Later

```
1. Project created from "Dev" template
2. Has: [Epic, Story Points, Sprint, Component, Reviewer, Labels]
3. User is in project and clicks "⚙️ Manage Fields"

4. Fields Manager Modal:

   ╔═════════════════════════════════════════╗
   ║ Fields & Workflows                     ║
   ╠═════════════════════════════════════════╣
   ║                                         ║
   ║ FROM TEMPLATE (read-only):             ║
   ║  📌 Epic                                 ║
   ║  📌 Story Points                        ║
   ║  📌 Sprint                               ║
   ║  📌 Component                            ║
   ║  📌 Reviewer                             ║
   ║  📌 Labels                               ║
   ║                                         ║
   ║ CUSTOM (removable):                    ║
   ║  🗑️  Environment (Dropdown)             ║
   ║  🗑️  Custom Notes (Text)                ║
   ║                                         ║
   ║ [+ Add New Field]                      ║
   ║                                         ║
   ║ STATUSES:                              ║
   ║  📌 Backlog                             ║
   ║  📌 Ready                               ║
   ║  📌 In Dev                              ║
   ║  📌 Review                              ║
   ║  📌 Done                                 ║
   ║                                         ║
   ║ [+ Add New Status]                     ║
   ║                                         ║
   ║ [Save Changes]                         ║
   ╚═════════════════════════════════════════╝

5. User clicks "+ Add New Field"
6. Form appears:
   Name: [Affected Area]
   Type: [Dropdown ▼]
   Options: [Dev] [QA] [DevOps] [Infra]
   Required: [☑]

7. Field added to project (not to template)
   → Only this project has "Affected Area"

8. Now project has 8 fields:
   [Epic, Story Points, Sprint, Component, Reviewer, Labels, Environment, Affected Area]
   └─ 6 from template (locked)
   └─ 2 custom (removable)

9. SheetView updates immediately:
   [Check] [Title] [Assignee] [Status] [Epic] [Story Points] [Sprint] [Component]
   [Reviewer] [Labels] [Environment] [Affected Area]

10. User can:
    ✅ Remove "Environment"
    ✅ Remove "Affected Area"
    ✅ Add more custom fields
    ❌ Remove template fields
```

---

## 3. DATABASE SCHEMA

### 3.1 Projects Table

```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  template_id TEXT,                -- NULL = blank, or "dev_template", "design_template", etc
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES project_templates(id)
);
```

### 3.2 Project Templates Table

```sql
CREATE TABLE project_templates (
  id TEXT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,       -- "Desenvolvimento", "Design", "Sales"
  description TEXT,
  category VARCHAR(50),              -- "development", "design", "business"
  created_at TIMESTAMP
);
```

### 3.3 Template Fields (Reference, Read-Only)

```sql
CREATE TABLE template_fields (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,       -- "Epic", "Story Points"
  slug VARCHAR(100) NOT NULL,       -- "epic", "story_points"
  type VARCHAR(20) NOT NULL,        -- text, number, dropdown, date, member, checkbox
  options JSON,                     -- for dropdowns: ["Option A", "Option B"]
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT,
  created_at TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES project_templates(id)
);
```

### 3.4 Project Custom Fields

```sql
CREATE TABLE project_custom_fields (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  template_field_id TEXT,           -- NULL = custom field, or ref to template_fields
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,        -- text, number, dropdown, date, member, checkbox
  options JSON,                     -- for dropdowns
  is_required BOOLEAN DEFAULT FALSE,
  display_order INT,
  is_from_template BOOLEAN DEFAULT FALSE,  -- TRUE = cannot delete
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (template_field_id) REFERENCES template_fields(id)
);
```

### 3.5 Template Workflows (Reference, Read-Only)

```sql
CREATE TABLE template_workflows (
  id TEXT PRIMARY KEY,
  template_id TEXT NOT NULL,
  status_id VARCHAR(50) NOT NULL,   -- "backlog", "ready", "in_dev"
  status_name VARCHAR(100) NOT NULL,
  color VARCHAR(10),                -- "#3b82f6"
  icon VARCHAR(50),                 -- "IconCircle", "IconClock"
  display_order INT,
  created_at TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES project_templates(id)
);
```

### 3.6 Project Workflows

```sql
CREATE TABLE project_workflows (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  template_workflow_id TEXT,        -- NULL = custom, or ref to template_workflows
  status_id VARCHAR(50) NOT NULL,
  status_name VARCHAR(100) NOT NULL,
  color VARCHAR(10),
  icon VARCHAR(50),
  display_order INT,
  is_from_template BOOLEAN DEFAULT FALSE,  -- TRUE = cannot delete
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (template_workflow_id) REFERENCES template_workflows(id)
);
```

### 3.7 Tasks (Inherits Project Fields)

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title VARCHAR(200) NOT NULL,
  assignee_id TEXT,
  status VARCHAR(50) NOT NULL,     -- must match project_workflows.status_id
  
  -- All custom fields stored here
  custom_data JSON,                -- {"epic": "Epic A", "story_points": 8, "environment": "Dev"}
  
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

---

## 4. KEY UI COMPONENTS

### 4.1 Project Creation Modal

```
Modal: "Create Project"

┌─────────────────────────────────┐
│ Create New Project              │
├─────────────────────────────────┤
│                                 │
│ Project Name *                  │
│ [________________________]       │
│                                 │
│ Description                     │
│ [________________________]       │
│ [________________________]       │
│                                 │
│ Template                        │
│ [No Template        ▼]          │
│  - No Template                  │
│  - Desenvolvimento              │
│  - Design                       │
│  - Sales                        │
│  - Support                      │
│                                 │
│ [Cancel]  [Next] →              │
└─────────────────────────────────┘

If user selects template → Shows template selection modal
If user keeps "No Template" → Creates blank project with defaults
```

### 4.2 Template Selection Modal

```
Modal: "Choose Template Fields"

┌──────────────────────────────────┐
│ Desenvolvimento de Software      │
├──────────────────────────────────┤
│                                  │
│ Select which fields to include:  │
│                                  │
│ CAMPOS:                          │
│ ☑ Epic                           │
│ ☑ Story Points                   │
│ ☑ Sprint                         │
│ ☑ Component                      │
│ ☑ Reviewer                       │
│ ☑ Labels                         │
│                                  │
│ WORKFLOW:                        │
│ ☑ Backlog                        │
│ ☑ Ready                          │
│ ☑ In Dev                         │
│ ☑ Review                         │
│ ☑ Done                           │
│                                  │
│ [Deselect All] [Select All]      │
│                                  │
│ [Cancel]  [Create Project]       │
└──────────────────────────────────┘
```

### 4.3 Fields Manager Modal

```
Modal: "Manage Fields & Workflows"  (accessed via ⚙️ in project header)

┌──────────────────────────────────┐
│ Manage Fields & Workflows        │
├──────────────────────────────────┤
│                                  │
│ FIELDS:                          │
│                                  │
│ FROM TEMPLATE (locked):          │
│ 📌 Epic              [edit] [•••] │
│ 📌 Story Points      [edit] [•••] │
│ 📌 Sprint            [edit] [•••] │
│ 📌 Component         [edit] [•••] │
│                                  │
│ CUSTOM (removable):              │
│ 🗑️  Priority          [edit] [✕]  │
│ 🗑️  Ambiente          [edit] [✕]  │
│                                  │
│ [+ Add New Field]                │
│                                  │
│ ───────────────────────────────  │
│                                  │
│ STATUSES:                        │
│                                  │
│ FROM TEMPLATE (locked):          │
│ 📌 Backlog           [edit] [•••] │
│ 📌 Ready             [edit] [•••] │
│ 📌 In Dev            [edit] [•••] │
│ 📌 Review            [edit] [•••] │
│ 📌 Done              [edit] [•••] │
│                                  │
│ [+ Add New Status]               │
│                                  │
│ [Cancel]  [Save Changes]         │
└──────────────────────────────────┘
```

### 4.4 Add Field Modal

```
Modal: "Add New Field"

┌──────────────────────────────────┐
│ Add New Field                    │
├──────────────────────────────────┤
│                                  │
│ Field Name *                     │
│ [________________]               │
│                                  │
│ Type *                           │
│ [Text            ▼]              │
│  - Text                          │
│  - Number                        │
│  - Dropdown                      │
│  - Date                          │
│  - Member                        │
│  - Checkbox                      │
│                                  │
│ Required                         │
│ [☑] Require users to fill this   │
│                                  │
│ Options (for Dropdown):          │
│ [Option 1]                       │
│ [Option 2]                       │
│ [+ Add Option]                   │
│                                  │
│ [Cancel]  [Create Field]         │
└──────────────────────────────────┘
```

---

## 5. API ENDPOINTS

### 5.1 Project Management

```
POST /api/projects
  { name, description, template_id?, selected_fields?: [], selected_workflows?: [] }
  → Creates project with selected template fields

GET /api/projects/:projectId
  → Returns project with all custom fields and workflows

PUT /api/projects/:projectId
  { name?, description? }
  → Updates project metadata
```

### 5.2 Custom Fields

```
POST /api/projects/:projectId/fields
  { name, slug, type, options?, is_required?, display_order? }
  → Creates custom field

PUT /api/projects/:projectId/fields/:fieldId
  { name?, options?, is_required?, display_order? }
  → Updates custom field (cannot change type)

DELETE /api/projects/:projectId/fields/:fieldId
  → Deletes custom field (only if not from template)

GET /api/projects/:projectId/fields
  → Returns all fields (with is_from_template flag)
```

### 5.3 Workflows

```
POST /api/projects/:projectId/workflows
  { status_id, status_name, color, icon, display_order }
  → Creates custom status

PUT /api/projects/:projectId/workflows/:workflowId
  { status_name?, color?, icon?, display_order? }
  → Updates status

DELETE /api/projects/:projectId/workflows/:workflowId
  → Deletes status (only if not from template)

GET /api/projects/:projectId/workflows
  → Returns all statuses (with is_from_template flag)
```

### 5.4 Templates

```
GET /api/templates
  → Returns all available templates

GET /api/templates/:templateId
  → Returns template details with fields and workflows
```

---

## 6. IMPLEMENTATION PHASES

### Phase 0: Database Migrations
- Create tables: project_templates, template_fields, template_workflows
- Create tables: project_custom_fields, project_workflows
- Modify tasks table to add custom_data JSON column
- Data migration: Convert existing projects to "blank" type

### Phase 1: Project Creation Flow
- New/Edit Project Modal
- Template Selection Modal
- Project creation API with template field selection
- Default projects start with 4 base statuses

### Phase 2: SheetView Enhancement
- Load custom fields from project_custom_fields
- Dynamic column rendering (text, number, dropdown, date, member, checkbox)
- Inline editing for custom fields
- Field visibility/reordering UI

### Phase 3: KanbanView Enhancement
- Load statuses from project_workflows
- Dynamic column rendering
- Status color/icon from database
- Drag & drop task movement

### Phase 4: TaskModal Enhancement
- Render base fields (title, assignee, status)
- Render custom fields (in order)
- Dynamic input types based on field.type
- Validation based on field.is_required

### Phase 5: Fields Manager
- Fields/Workflows management modal
- Add field form with type selection
- Add status form
- Edit/delete functionality (with template checks)
- Field reordering (drag & drop)

---

## 7. FIELD TYPES SPECIFICATION

### 7.1 Text
- Input: text field
- Storage: string
- Validation: max length 500
- Example: "Epic A", "Custom Notes"

### 7.2 Number
- Input: number field with min/max
- Storage: number
- Validation: min/max range
- Example: Story Points (1-13), Hours (0-100)

### 7.3 Dropdown
- Input: select with predefined options
- Storage: string (selected option)
- Validation: must be in options list
- Example: Epic A/B/C, Environment Dev/Staging/Prod

### 7.4 Date
- Input: date picker
- Storage: DATE
- Validation: valid date format
- Example: Due date, Sprint end date

### 7.5 Member
- Input: member picker with autocomplete
- Storage: user_id
- Validation: must be valid user
- Example: Reviewer, Tester, Designer

### 7.6 Checkbox
- Input: checkbox toggle
- Storage: boolean (true/false)
- Validation: none
- Example: "Is Urgent", "Ready for Review"

---

## 8. VALIDATION & CONSTRAINTS

### Field Rules
- ✅ Can add unlimited custom fields
- ✅ Can edit field name/options (not type)
- ✅ Can reorder fields
- ✅ Can delete custom fields
- ❌ Cannot delete base fields [title, assignee, status]
- ❌ Cannot delete template fields (in projects from template)
- ✅ Required field can be enforced
- ✅ Dropdown options can be edited

### Workflow Rules
- ✅ Can add unlimited custom statuses
- ✅ Can edit status name/color/icon
- ✅ Can reorder statuses
- ✅ Can delete custom statuses
- ❌ Cannot delete template statuses (in projects from template)
- ✅ At least 1 status must exist (prevent deletion of last)
- ✅ Every task must have a valid status

### Task Rules
- ✅ Task automatically inherits project's current fields
- ✅ If field is removed, old data is archived (not deleted)
- ✅ If field is added, existing tasks get NULL value
- ✅ Required fields must be filled before saving

---

## 9. MIGRATION & BACKWARD COMPATIBILITY

### Existing Projects
- All existing projects → type: "blank", template_id: NULL
- All existing projects get the 4 default statuses: [todo, in_progress, blocked, done]
- Custom data in tasks is preserved in custom_data JSON

### New Projects
- "Create Project" flow now includes template selection
- Users can choose to start from template or blank
- Both paths start with a foundation (never truly empty)

---

## 10. GLOSSARY

| Term | Definition |
|------|-----------|
| **Field** | A custom column in SheetView / attribute of a task |
| **Status/Workflow** | A column in KanbanView / state of a task |
| **Template** | Pre-made configuration (fields + workflows) |
| **Custom Field** | Field created by user (not from template) |
| **Template Field** | Field inherited from template (read-only, locked) |
| **Display Order** | Sequence in which fields/statuses are shown |
| **is_from_template** | Flag that indicates if can be deleted |

---

## APPROVAL CHECKLIST

- [x] Core principles defined
- [x] Three user journeys mapped
- [x] Database schema complete
- [x] API endpoints specified
- [x] UI components specified
- [x] Field types detailed
- [x] Validation rules clear
- [x] Migration strategy defined
- [x] Ready for implementation

**Approved By:** User (December 18, 2025)  
**Implementation Start:** Ready to begin Phase 0

