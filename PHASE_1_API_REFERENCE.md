# PHASE 1: CUSTOM FIELDS & WORKFLOWS - API QUICK REFERENCE

**Status:** Phase 1 Implementation Complete ✅

---

## DATABASE TABLES

### `project_custom_fields`
Stores custom fields for projects (used by SheetView)

**Columns:**
- `id` (TEXT, PK)
- `project_id` (TEXT, FK → projects)
- `name` (VARCHAR 100) - "Epic", "Story Points"
- `slug` (VARCHAR 100) - "epic", "story_points"
- `type` (VARCHAR 20) - text, number, dropdown, date, member, checkbox
- `options` (JSON) - for dropdowns: ["Option A", "Option B"]
- `is_required` (BOOLEAN)
- `display_order` (INTEGER)
- `is_from_template` (BOOLEAN) - TRUE = cannot delete
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Unique Constraint:** (project_id, slug)

### `project_workflows`
Stores workflow statuses for projects (used by KanbanView)

**Columns:**
- `id` (TEXT, PK)
- `project_id` (TEXT, FK → projects)
- `status_id` (VARCHAR 50) - "todo", "in_progress", "blocked", "done"
- `status_name` (VARCHAR 100) - "To Do", "In Progress"
- `color` (VARCHAR 10) - "#3b82f6"
- `icon` (VARCHAR 50) - "IconCircle", "IconClock"
- `display_order` (INTEGER)
- `is_from_template` (BOOLEAN) - TRUE = cannot delete
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Unique Constraint:** (project_id, status_id)

---

## API ENDPOINTS

### CUSTOM FIELDS ENDPOINTS

#### Get All Fields for Project
```
GET /api/projects/:projectId/fields

Response:
{
  "success": true,
  "data": [
    {
      "id": "field_001",
      "project_id": "proj_abc",
      "name": "Epic",
      "slug": "epic",
      "type": "dropdown",
      "options": ["Epic A", "Epic B"],
      "is_required": false,
      "display_order": 0,
      "is_from_template": false
    },
    ...
  ],
  "count": 2
}
```

#### Get Specific Field
```
GET /api/projects/:projectId/fields/:fieldId

Response:
{
  "success": true,
  "data": {
    "id": "field_001",
    "project_id": "proj_abc",
    "name": "Epic",
    ...
  }
}
```

#### Create Field
```
POST /api/projects/:projectId/fields

Request Body:
{
  "name": "Epic",
  "slug": "epic",
  "type": "dropdown",
  "options": ["Epic A", "Epic B", "Epic C"],
  "is_required": false,
  "display_order": 0
}

Response:
{
  "success": true,
  "data": {
    "id": "field_new_001",
    "project_id": "proj_abc",
    "name": "Epic",
    "slug": "epic",
    "type": "dropdown",
    "options": ["Epic A", "Epic B", "Epic C"],
    "is_required": false,
    "display_order": 0,
    "is_from_template": false
  }
}
```

#### Update Field
```
PUT /api/projects/:projectId/fields/:fieldId

Request Body (all optional):
{
  "name": "Project Epic",
  "options": ["Epic A", "Epic B"],
  "is_required": true,
  "display_order": 1
}

Response:
{
  "success": true,
  "data": {
    "id": "field_001",
    "project_id": "proj_abc",
    "name": "Project Epic",
    "slug": "epic",
    "type": "dropdown",
    "options": ["Epic A", "Epic B"],
    "is_required": true,
    "display_order": 1,
    "is_from_template": false,
    "updated_at": "2025-12-18T..."
  }
}
```

#### Delete Field
```
DELETE /api/projects/:projectId/fields/:fieldId

Response:
{
  "success": true,
  "message": "Field deleted successfully"
}
```

#### Reorder Fields
```
POST /api/projects/:projectId/fields/reorder

Request Body:
{
  "fieldOrder": [
    { "id": "field_001", "display_order": 0 },
    { "id": "field_002", "display_order": 1 },
    { "id": "field_003", "display_order": 2 }
  ]
}

Response:
{
  "success": true,
  "message": "Fields reordered successfully"
}
```

---

### WORKFLOWS ENDPOINTS

#### Get All Workflows for Project
```
GET /api/projects/:projectId/workflows

Response:
{
  "success": true,
  "data": [
    {
      "id": "wf_001",
      "project_id": "proj_abc",
      "status_id": "todo",
      "status_name": "To Do",
      "color": "#a8a29e",
      "icon": "IconCircle",
      "display_order": 0,
      "is_from_template": false
    },
    ...
  ],
  "count": 4
}
```

#### Get Specific Workflow
```
GET /api/projects/:projectId/workflows/:workflowId

Response:
{
  "success": true,
  "data": {
    "id": "wf_001",
    "project_id": "proj_abc",
    "status_id": "todo",
    "status_name": "To Do",
    "color": "#a8a29e",
    "icon": "IconCircle",
    "display_order": 0,
    "is_from_template": false
  }
}
```

#### Initialize Default Workflows
```
POST /api/projects/:projectId/workflows/initialize

Response:
{
  "success": true,
  "data": [
    {
      "id": "wf_001",
      "project_id": "proj_abc",
      "status_id": "todo",
      "status_name": "To Do",
      "color": "#a8a29e",
      "icon": "IconCircle",
      "display_order": 0,
      "is_from_template": false
    },
    {
      "id": "wf_002",
      "project_id": "proj_abc",
      "status_id": "in_progress",
      "status_name": "In Progress",
      "color": "#3b82f6",
      "icon": "IconClock",
      "display_order": 1,
      "is_from_template": false
    },
    {
      "id": "wf_003",
      "project_id": "proj_abc",
      "status_id": "blocked",
      "status_name": "Blocked",
      "color": "#ef4444",
      "icon": "IconAlertTriangle",
      "display_order": 2,
      "is_from_template": false
    },
    {
      "id": "wf_004",
      "project_id": "proj_abc",
      "status_id": "done",
      "status_name": "Done",
      "color": "#10b981",
      "icon": "IconCheckCircle",
      "display_order": 3,
      "is_from_template": false
    }
  ]
}
```

#### Create Workflow
```
POST /api/projects/:projectId/workflows

Request Body:
{
  "status_id": "review",
  "status_name": "Review",
  "color": "#f59e0b",
  "icon": "IconEye",
  "display_order": 2
}

Response:
{
  "success": true,
  "data": {
    "id": "wf_new_001",
    "project_id": "proj_abc",
    "status_id": "review",
    "status_name": "Review",
    "color": "#f59e0b",
    "icon": "IconEye",
    "display_order": 2,
    "is_from_template": false
  }
}
```

#### Update Workflow
```
PUT /api/projects/:projectId/workflows/:workflowId

Request Body (all optional):
{
  "status_name": "In Review",
  "color": "#f59e0b",
  "icon": "IconEye",
  "display_order": 3
}

Response:
{
  "success": true,
  "data": {
    "id": "wf_001",
    "project_id": "proj_abc",
    "status_id": "review",
    "status_name": "In Review",
    "color": "#f59e0b",
    "icon": "IconEye",
    "display_order": 3,
    "is_from_template": false,
    "updated_at": "2025-12-18T..."
  }
}
```

#### Delete Workflow
```
DELETE /api/projects/:projectId/workflows/:workflowId

Response:
{
  "success": true,
  "message": "Workflow deleted successfully"
}
```

#### Reorder Workflows
```
POST /api/projects/:projectId/workflows/reorder

Request Body:
{
  "workflowOrder": [
    { "id": "wf_001", "display_order": 0 },
    { "id": "wf_002", "display_order": 1 },
    { "id": "wf_003", "display_order": 2 },
    { "id": "wf_004", "display_order": 3 }
  ]
}

Response:
{
  "success": true,
  "message": "Workflows reordered successfully"
}
```

---

## ERROR RESPONSES

All endpoints return error responses in this format:

```json
{
  "success": false,
  "error": "Description of what went wrong"
}
```

Common errors:
- `"Field not found"` - ID doesn't exist
- `"Field with this slug already exists"` - Slug collision
- `"Cannot modify fields inherited from templates"` - Template field edit attempt
- `"Cannot delete the last workflow"` - Attempt to delete only status
- `"Name, slug, and type are required"` - Missing required fields

---

## FIELD TYPES

| Type | Input | Storage | Example |
|------|-------|---------|---------|
| `text` | Text field | string | "Epic A", "Custom Notes" |
| `number` | Number input | number | 8, 13, 100 |
| `dropdown` | Select list | string | "Dev", "Staging", "Prod" |
| `date` | Date picker | DATE | 2025-12-25 |
| `member` | User picker | user_id | "user_abc123" |
| `checkbox` | Toggle | boolean | true/false |

---

## IMPLEMENTATION CHECKLIST

Phase 1 Implementation Status:

- [x] Database migration created (`0003_add_custom_fields_workflows.sql`)
- [x] `ProjectFieldsController` created with full CRUD
- [x] `ProjectWorkflowsController` created with full CRUD
- [x] API routes implemented (`customFieldsRoutes.js`)
- [x] Routes registered in `server.js`
- [x] Default workflows initialization endpoint
- [x] Reordering endpoints for fields and workflows
- [x] Error handling and validation
- [x] API Quick Reference documentation

**Ready for:** Phase 2 (SheetView Enhancement) or testing

---

## TESTING QUICK START

```bash
# Test: Create a field
curl -X POST http://localhost:3000/api/projects/proj_123/fields \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Epic",
    "slug": "epic",
    "type": "dropdown",
    "options": ["Epic A", "Epic B"],
    "is_required": false
  }'

# Test: Initialize default workflows
curl -X POST http://localhost:3000/api/projects/proj_123/workflows/initialize

# Test: Get all fields
curl http://localhost:3000/api/projects/proj_123/fields

# Test: Get all workflows
curl http://localhost:3000/api/projects/proj_123/workflows
```

---

## NEXT STEPS

Phase 1 is complete! Ready to:

1. **Phase 2:** Update SheetView to use `project_custom_fields`
2. **Phase 3:** Update KanbanView to use `project_workflows`
3. **Phase 4:** Update TaskModal to render dynamic fields
4. **Migration:** Convert existing projects to use new schema

