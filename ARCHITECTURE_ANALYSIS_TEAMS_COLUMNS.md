# 🔍 Architecture Analysis: Teams/Coletivo + Dynamic Columns
## Critical Review of Current Limitations and Recommended Solutions

**Date:** December 18, 2025  
**Status:** Analysis & Recommendations  
**Focus:** Two Critical Architectural Decisions

---

## PART 1: TEAMS/COLETIVO + TEAM CHAT ANALYSIS

### **Current Status**

#### **TeamsView.jsx Overview**
Located: `src/views/TeamsView.jsx` (244 lines)

**What Exists:**
- ✅ TeamsView component with member management
- ✅ Team invitations (email-based)
- ✅ Member roles (admin, member, bot)
- ✅ Energy/Load visualization per member (mock data)
- ✅ PageHeader with team information

**What's Mock/Placeholder:**
```jsx
// Lines 30-80: Member data is MOCKED
setMembers([
    { 
        id: currentUser?.id || '1', 
        name: currentUser?.name || 'Eu (Arquiteto)', 
        role: 'admin', 
        energy: 85,      // MOCK: Would come from daily_checkin
        load: 42,        // MOCK: Would come from task counts
        status: 'online' // MOCK: Would come from real-time tracker
    },
    // ... more hardcoded mock members
]);
```

**API Integration Status:**
```javascript
// TeamsView attempts:
const teams = await Team.list();              // ✅ Works
const currentUser = await User.me();          // ✅ Works

// But then reverts to mock data for:
- Team members list
- Member energy levels
- Member load/workload
- Member status (online/offline)
```

---

### **Problem 1: Team Chat System Missing**

**Current Situation:**
- 🔴 **NO team chat functionality exists**
- 🔴 **NO chat UI component**
- 🔴 **NO message storage/schema**
- 🔴 **NO real-time messaging**
- 🔴 **NO chat routes/controllers**

**What Would Be Needed:**

#### **A. Database Schema**
```sql
-- Team Chat Messages Table
CREATE TABLE IF NOT EXISTS team_messages (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, task_mention, energy_update, milestone
    mentions TEXT,  -- JSON array of user IDs
    attachments TEXT, -- JSON array of file objects
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    FOREIGN KEY (team_id) REFERENCES teams(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Team Channels (for organization)
CREATE TABLE IF NOT EXISTS team_channels (
    id TEXT PRIMARY KEY,
    team_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'general', -- general, project, energy, updates
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    created_by TEXT,
    
    FOREIGN KEY (team_id) REFERENCES teams(id)
);

-- Message Reactions (Emoji reactions)
CREATE TABLE IF NOT EXISTS message_reactions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    emoji VARCHAR(10),
    created_at TIMESTAMP,
    
    FOREIGN KEY (message_id) REFERENCES team_messages(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(message_id, user_id, emoji)
);
```

#### **B. API Routes**
```javascript
// controllers/teamChatController.js
- POST /api/teams/:teamId/messages        // Send message
- GET /api/teams/:teamId/messages         // List messages (paginated)
- GET /api/teams/:teamId/channels         // List channels
- POST /api/messages/:messageId/reactions // Add reaction
- DELETE /api/messages/:messageId          // Delete message
- PUT /api/messages/:messageId             // Edit message

// Real-time via WebSocket
- ws://api/teams/:teamId/chat             // WebSocket connection
  - Event: 'message.new' → broadcast all
  - Event: 'user.typing' → broadcast all
  - Event: 'user.online' → broadcast all
```

#### **C. Frontend Components Needed**
```jsx
// Components to create:
1. TeamChatPanel.jsx
   - Message list
   - Message input
   - Typing indicators
   - Online status badges

2. TeamChatMessage.jsx
   - Message rendering
   - Mentions highlighting
   - Emoji reactions
   - Edit/delete actions

3. TeamChatInput.jsx
   - Text input with mentions
   - File upload
   - Emoji picker
   - Command palette (/task, /note, etc.)

4. TeamChannelList.jsx
   - Channel sidebar
   - Add channel dialog
   - Archive/unarchive

// Hooks:
- useTeamChat.js      // Message fetch, WebSocket
- useMentions.js      // @ mention autocomplete
- useTypingStatus.js  // Show "X is typing"
```

---

### **Problem 2: Team Member Data is Mocked**

**Current Issues:**

| Data | Current | Ideal |
|------|---------|-------|
| Member List | Mock hardcoded | Real: from team_members table |
| Energy Level | Random 0-100 | Real: from daily_checkin table |
| Work Load | Random 0-100 | Real: count of assigned tasks |
| Status | Mock online/offline | Real: last_activity timestamp |
| Roles | Mock (admin/member/bot) | Real: from team_members.role |

**Root Cause:**
```javascript
// Current approach (line 40):
// Comment says: "Em produção, isso viria de uma tabela 'user_status' ou 'daily_checkin'"
// But it never gets those data!
```

---

### **Recommended Solution for Teams/Coletivo**

#### **Phase A: Infrastructure (1-2 days)**

**1. Database Schema**
```sql
-- Extend existing schema
ALTER TABLE teams ADD COLUMN:
  - created_by TEXT
  - archived_at TIMESTAMP
  - settings JSON (notifications, default_channel, etc.)

CREATE TABLE team_members (
  id TEXT PRIMARY KEY,
  team_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role VARCHAR(20), -- admin, member, viewer
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  UNIQUE(team_id, user_id)
);

-- Real-time status tracking
CREATE TABLE user_presence (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  team_id TEXT NOT NULL,
  status VARCHAR(20), -- online, away, offline, in_focus
  last_activity TIMESTAMP,
  current_view VARCHAR(50), -- kanban, sheet, chat, etc.
);

-- Team Messages + Channels (as above)
```

**2. API Controllers**
```javascript
// controllers/teamController.js (enhance)
- GET /api/teams/:teamId/members    → Real data from team_members
- GET /api/users/:userId/presence   → Real status from user_presence
- POST /api/teams/:teamId/invite    → Queue invite email
- PUT /api/teams/:teamId/members/:memberId → Update role

// controllers/teamChatController.js (new)
- POST /api/teams/:teamId/messages
- GET /api/teams/:teamId/messages?limit=50&offset=0
- WebSocket endpoints for real-time
```

**3. Real-time Infrastructure**
```javascript
// Use existing WebSocket or add Socket.IO
// services/teamPresenceService.js
class TeamPresenceService {
  - trackUserOnline(userId, teamId, view)
  - trackUserOffline(userId, teamId)
  - broadcastUserActivity(userId, action)
  - subscribeToTeamChanges(teamId, callback)
}

// services/teamChatService.js
class TeamChatService {
  - sendMessage(teamId, userId, content, mentions)
  - editMessage(messageId, newContent)
  - deleteMessage(messageId)
  - subscribeToMessages(teamId, callback)
}
```

#### **Phase B: UI Components (2-3 days)**

```jsx
// New Views/Components:
1. TeamChatView.jsx
   - Full-screen chat interface
   - Channel sidebar
   - Member list sidebar
   - Message history

2. TeamPresenceIndicator.jsx
   - Green dot for online
   - Yellow for away
   - Tooltip with status
   - Last activity time

3. TeamNotificationBadge.jsx
   - Unread message count
   - @mentions highlighting
   - Activity summary

// Integration Points:
- sidebar.jsx → Add "Coletivo" with chat badge
- ProjectCanvasView.jsx → Add team chat sidebar
- DashboardView.jsx → Show team activity feed
```

#### **Phase C: Features (3-4 days)**

**MVP Features:**
1. ✅ Send/receive messages in real-time
2. ✅ Member presence (online/offline/away)
3. ✅ @mentions with notifications
4. ✅ Message search
5. ✅ Edit/delete messages (with history)
6. ✅ Emoji reactions
7. ✅ File attachments
8. ✅ User energy level display

**Future Features:**
- [ ] Channel threads
- [ ] Message pins
- [ ] Voice/video calls
- [ ] Task mentions (#task-123)
- [ ] Energy-based auto-mute
- [ ] Team activity digest
- [ ] Chat integration with tasks
- [ ] Notification settings per channel

---

## PART 2: DYNAMIC COLUMNS ANALYSIS

### **Current State: TWO DIFFERENT APPROACHES**

#### **KanbanView: Hardcoded Columns**

```javascript
// Line 37-43: COLUMNS_CONFIG (HARDCODED)
const COLUMNS_CONFIG = {
  todo: { id: 'todo', color: "#a8a29e", icon: IconCircle }, 
  in_progress: { id: 'in_progress', color: "#3b82f6", icon: IconClock }, 
  blocked: { id: 'blocked', color: "#ef4444", icon: IconAlertTriangle }, 
  done: { id: 'done', color: "#10b981", icon: IconCheckCircle } 
};
```

**Issue:** 
- ❌ ONLY 4 statuses possible (todo, in_progress, blocked, done)
- ❌ Cannot add custom columns per project
- ❌ Cannot rename columns
- ❌ Cannot reorder columns
- ❌ No workflow templates

---

#### **SheetView: Partially Dynamic Columns**

```javascript
// Line 303-328: Hybrid Approach
const allColumns = useMemo(() => {
    // 1. HARDCODED base columns
    const baseCols = [
        { key: 'check', label: '', type: 'checkbox', width: '48px', sticky: true, locked: true },
        { key: 'title', label: t('sheet_task_name'), type: 'title', width: '360px', sticky: true, locked: true },
        { key: 'assignee', label: t('sheet_responsible'), type: 'member', width: '130px' },
        { key: 'status', label: t('sheet_status'), type: 'status', width: '130px' },
        { key: 'priority', label: t('sheet_priority'), type: 'priority', width: '130px' },
        { key: 'dueDate', label: t('sheet_due_date'), type: 'date', width: '130px' }
    ];

    // 2. DYNAMIC custom columns from task.customData
    const customKeys = new Set();
    tasks.forEach(t => {
        if (t.customData) Object.keys(t.customData).forEach(k => customKeys.add(k));
    });

    const dynamicCols = Array.from(customKeys).map(key => ({
        key: `custom:${key}`, 
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '), 
        type: 'text',
        width: '200px'
    }));

    return [...baseCols, ...dynamicCols];
}, [tasks]);
```

**Good:** 
- ✅ Shows custom fields from task.customData
- ✅ Dynamic column discovery

**Bad:**
- ❌ Columns inferred from data, not schema
- ❌ Cannot hide/show columns per user preference
- ❌ No column configuration UI
- ❌ Column order not controllable
- ❌ Column types mostly guessed as 'text'
- ❌ No field validation
- ❌ Can't have per-project custom fields

---

### **The Core Problem**

**Current Architecture:**
```
Task Entity
├── Fixed Properties: id, title, status, priority, assignee, dueDate
├── Flexible Extension: task.customData { key: value, ... }
└── No Project-Level Schema Definition
```

**This Creates:**
1. 🔴 **No validation** - Any string can be any value
2. 🔴 **No type system** - "quantity" could be text or number
3. 🔴 **No UI contracts** - How to render unknown fields?
4. 🔴 **No enforcement** - Inconsistent data across tasks
5. 🔴 **No access control** - No way to limit who sees which fields

---

### **Solution: Project Custom Fields Schema**

#### **New Database Table**
```sql
CREATE TABLE project_custom_fields (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    name VARCHAR(100) NOT NULL,           -- "Epic", "Story Points", "Estimated Hours"
    slug VARCHAR(100) NOT NULL,            -- "epic", "story_points", "estimated_hours"
    type VARCHAR(20) NOT NULL,             -- text, number, dropdown, date, member, checkbox, currency
    description TEXT,
    
    -- Display Settings
    display_order INT,
    is_visible BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT FALSE,
    
    -- Type Configuration
    validation_rules JSON,                 -- min, max, pattern, allowed_values
    default_value TEXT,
    help_text TEXT,
    
    -- Access Control
    visible_to_roles TEXT,                 -- "admin,member,viewer"
    editable_by_roles TEXT,                -- "admin,owner"
    
    -- Metadata
    created_by TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    
    FOREIGN KEY (project_id) REFERENCES projects(id),
    UNIQUE(project_id, slug)
);

-- Example Data:
INSERT INTO project_custom_fields VALUES:
| Project | Name | Type | Rules | Display Order |
|---------|------|------|-------|---|
| P1 | Epic | dropdown | {values: ['Feature', 'Bug', 'Spike']} | 1 |
| P1 | Story Points | number | {min: 0, max: 100} | 2 |
| P1 | Estimated Hours | number | {min: 0, step: 0.5} | 3 |
| P1 | Sprint | member | {type: 'single'} | 4 |
```

#### **New API Routes**
```javascript
// controllers/projectFieldsController.js
GET    /api/projects/:projectId/fields          // List all fields
POST   /api/projects/:projectId/fields          // Create field
PUT    /api/projects/:projectId/fields/:fieldId // Update field
DELETE /api/projects/:projectId/fields/:fieldId // Delete field
PATCH  /api/projects/:projectId/fields/reorder  // Reorder fields

// Example: Add "Story Points" field to Project
POST /api/projects/proj123/fields
{
  "name": "Story Points",
  "slug": "story_points",
  "type": "number",
  "validation_rules": {
    "min": 0,
    "max": 100,
    "step": 5
  },
  "default_value": "5",
  "is_required": false,
  "help_text": "Estimate complexity on Fibonacci scale"
}
```

#### **SheetView Integration**
```jsx
// Updated SheetView.jsx
const allColumns = useMemo(() => {
    // 1. Fetch project custom fields schema
    const customFields = await ProjectCustomFields.get(projectId);
    
    // 2. Base columns (always present)
    const baseCols = [
        { key: 'check', label: '', type: 'checkbox', ... },
        { key: 'title', label: 'Task', type: 'title', ... },
        ...
    ];
    
    // 3. Custom fields (from schema, not inferred!)
    const customCols = customFields.map(field => ({
        key: `custom:${field.slug}`,
        label: field.name,
        type: field.type,                    // Now we know the type!
        validation: field.validation_rules,  // Now we can validate!
        required: field.is_required,         // Now we enforce!
        help_text: field.help_text,
        width: getWidthForType(field.type),
        display_order: field.display_order,
        editable: canEditField(field)        // Permission check
    }));
    
    return [...baseCols, ...customCols].sort((a, b) => a.display_order - b.display_order);
}, [projectId, customFields]);
```

#### **KanbanView Enhancement**
```jsx
// KanbanView now supports custom status workflows

// Example: Different project types have different workflows:
// Code Project:     todo → in_progress → review → done
// Design Project:   backlog → ideation → draft → review → done
// Sales Project:    lead → contact → proposal → closed

const [workflow, setWorkflow] = useState(null);

useEffect(() => {
    // Fetch project-level workflow configuration
    const workflowConfig = await ProjectWorkflow.get(projectId);
    const columns = workflowConfig.statuses.map(status => ({
        id: status.id,
        title: status.name,
        color: status.color,
        icon: getIconForStatus(status.id)
    }));
    setWorkflow({ columns, transitions: workflowConfig.transitions });
}, [projectId]);

// Render columns based on project workflow
{workflow && Object.values(workflow.columns).map(col => (
    <KanbanColumn key={col.id} column={col} />
))}
```

---

## COMPARISON: Current vs Proposed

### **KanbanView**

| Aspect | Current | Proposed |
|--------|---------|----------|
| **Statuses** | Hardcoded (4) | Per-project (unlimited) |
| **Workflow** | Fixed | Template-based |
| **Customization** | None | Full UI |
| **Transitions** | Any → Any | Enforced rules |
| **Columns/Project** | Same for all | Different per project |

### **SheetView**

| Aspect | Current | Proposed |
|--------|---------|----------|
| **Base Fields** | Hardcoded 6 | Flexible, but fixed set |
| **Custom Fields** | From task.customData (inferred) | From project schema |
| **Field Types** | Mostly text (guessed) | Typed (number, dropdown, date, etc.) |
| **Validation** | None | Rule-based |
| **Display Order** | Fixed | User/project configurable |
| **Permissions** | None | Role-based access |
| **Required Fields** | None | Can enforce |
| **Visible Per User** | No | Yes |

---

## IMPLEMENTATION ROADMAP

### **Phase 1: Database & API (Week 1)**
- [x] Create project_custom_fields table
- [x] Create team_messages + team_channels tables
- [x] Create user_presence table
- [x] Write ProjectFieldsController
- [x] Write TeamChatController
- [x] Write migration scripts

### **Phase 2: SheetView Enhancement (Week 2)**
- [ ] Update SheetView to use project schema
- [ ] Add field configuration modal
- [ ] Add field visibility/reordering
- [ ] Add field validation
- [ ] Add column type rendering

### **Phase 3: KanbanView Enhancement (Week 2-3)**
- [ ] Create project workflow schema
- [ ] Update KanbanView for dynamic columns
- [ ] Add workflow template selector
- [ ] Add column reordering
- [ ] Add transition rules enforcement

### **Phase 4: Teams/Chat (Week 3-4)**
- [ ] Build TeamChatView component
- [ ] Implement WebSocket connection
- [ ] Add message history
- [ ] Add presence indicators
- [ ] Add @mentions & reactions

### **Phase 5: Project Setup UI (Week 4)**
- [ ] Create ProjectSetupWizard
- [ ] Let users choose workflow template
- [ ] Let users add custom fields
- [ ] Field type tutorial
- [ ] Permission configuration

---

## Questions for Decision

### **1. Backward Compatibility**
**Q:** Should we migrate existing projects?  
**A:** 
- Keep current generic project as "Basic"
- Let existing projects continue working
- Offer migration UI for users who want custom fields

### **2. Field Types to Support**
**Q:** Which field types in MVP?  
**A:**
- Text (short, long)
- Number (int, float, currency)
- Dropdown (single select)
- Multi-select
- Date/DateTime
- Member/User reference
- Checkbox
- Link

### **3. Workflow Templates**
**Q:** Should we provide pre-built templates?  
**A:**
- Code/Development (todo → in_progress → review → done)
- Design (backlog → ideation → draft → feedback → done)
- Sales (lead → contact → proposal → closed)
- Support (open → assigned → in_progress → resolved)
- Custom (allow users to define)

### **4. Team Channels**
**Q:** Should we have project-specific channels?  
**A:**
- Yes: #general (team-wide)
- Yes: #project-{name} (per project)
- Yes: #announcements (important updates)
- Users can create/leave channels

---

## Timeline Estimate

| Phase | Duration | Effort |
|-------|----------|--------|
| Phase 1: Infrastructure | 3-4 days | 40 hours |
| Phase 2: SheetView | 2-3 days | 30 hours |
| Phase 3: KanbanView | 3-4 days | 35 hours |
| Phase 4: Teams/Chat | 4-5 days | 45 hours |
| Phase 5: Project Setup UI | 2-3 days | 25 hours |
| **TOTAL** | **2-3 weeks** | **175 hours (~4.4 weeks full-time)** |

---

## Risk Assessment

### **High Priority**
🔴 Chat data might grow very large (message indexing needed)  
🔴 Custom fields could create inconsistent data if not validated  
🔴 Workflow transitions need to be enforced to prevent bad states  

### **Medium Priority**
🟡 Backward compatibility for existing projects  
🟡 Migration from mock to real team data  
🟡 Performance impact of additional API calls  

### **Low Priority**
🟢 UI complexity (manageable with good design)  
🟢 Internationalization (already supported)  
🟢 Access control (can use existing permission system)  

---

## Recommendation

**For Teams/Coletivo:**
1. **Start with MVP:** Messages + presence
2. **Skip initially:** Channels, threads, advanced features
3. **Build foundations:** Real-time infrastructure
4. **Timeline:** 2 weeks for MVP

**For Dynamic Columns:**
1. **Start with SheetView:** More impact per effort
2. **Build field schema:** Foundation for all future customization
3. **KanbanView after:** Builds on same schema
4. **Timeline:** 2-3 weeks for both views

**Priority Order:**
1. Phase 1: Database + API (essential for both)
2. Phase 2: SheetView (highest ROI)
3. Phase 3: KanbanView (builds on Phase 2)
4. Phase 4: Teams/Chat (parallel or after Phase 3)

---

**Document Status:** Analysis Complete | Ready for Implementation Planning  
**Next Step:** Prioritize and create implementation tickets
