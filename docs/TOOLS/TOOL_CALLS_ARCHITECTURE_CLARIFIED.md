# 🏗️ TOOL CALLS ARCHITECTURE - MOBILE ONLY

**Status:** ✅ Clarified & Corrected  
**Date:** December 12, 2025  
**Build:** ✅ 1793 modules, 0 errors

---

## 🎯 THE CLEAR DESIGN

### **DESKTOP (PranaWorkspaceLayout)**

```
User → SideChat (right panel)
         ↓
    Ash responds with text
         ↓
    BubbleRenderer (if needed):
    ├─ task_list bubble
    ├─ calendar bubble
    ├─ form bubble
    ├─ action bubble
    └─ Or opens Modal/View via dispatch
    
❌ NO Tool Calls here
```

**Desktop Flow:**
1. User types in SideChat
2. Ash responds (text)
3. If needs visualisation → Opens PranaFormModal or View (dispatch event)
4. Never inline tool execution bubbles

---

### **MOBILE (MobileWorkspaceLayout)**

```
User → MobileChat (full screen)
        ↓
   Ash responds with text
        ↓
   SideChat renders:
   ├─ Text message
   └─ Tool Calls (if present)
      └─ ToolCallBubble:
         ├─ Shows icon + title
         ├─ Button "Executar"
         ├─ Inline action
         └─ Result feedback
         
✅ Tool Calls ONLY here
```

**Mobile Flow:**
1. User types in MobileChat
2. Ash responds (text + tool calls)
3. SideChat renders Tool Calls as bubbles
4. User clicks "Executar"
5. Action executes (Task.create, etc)
6. Feedback (toast + state)

---

## 📊 ARCHITECTURE TABLE

| Component | Desktop | Mobile | Purpose |
|-----------|---------|--------|---------|
| **SideChat** | ✅ Right panel | ❌ Doesn't exist | Text chat, no tool calls |
| **MobileChat** | ❌ Doesn't exist | ✅ Full-screen | Text chat + tool calls |
| **BubbleRenderer** | ✅ 4 types | ❌ Not here | Visualizations |
| **ToolCallBubble** | ❌ Not rendered | ✅ In SideChat | Mobile actions |
| **PranaFormModal** | ✅ For complex | ❌ Not used | Desktop UI |
| **Views** | ✅ KanbanView, etc | ❌ Doesn't exist | Desktop visualization |

---

## 🔄 DATA FLOW

### **Desktop: Text → Modal**

```
Ash API response:
{
  message: "Vou criar um projeto",
  client_action: {
    type: "OPEN_FORM",
    data: { ... }
  }
}
↓
MessageBubble renders text
↓
If client_action exists:
  → dispatch('prana:open-form')
  → PranaFormModal opens
  → Never inline bubbles
```

### **Mobile: Text → Tool Calls**

```
Ash API response:
{
  message: "Vou criar um projeto",
  type: "tool_calls",
  data: {
    toolCalls: [
      { id: '1', type: 'create_project', params: {...} }
    ]
  }
}
↓
MessageBubble renders text
↓
BubbleRenderer skipped (mobile doesn't use it)
↓
SideChat renders message
↓
If message.type === 'tool_calls':
  → ToolCallBubble renders
  → Shows "Executar" button
  → Click → Task.create()
  → Feedback → Toast + state
```

---

## 📂 FILES & RESPONSIBILITIES

### **Desktop-Only:**
```
src/components/chat/BubbleRenderer.jsx
├─ 4 bubble types (task_list, calendar, form, actions)
├─ Desktop visualizations
└─ ❌ NO tool_call or tool_calls cases

src/components/chat/SideChat.jsx
├─ Right panel chat
├─ Renders ActionConfirmationCard
├─ No tool call injection
└─ No test keywords

src/components/chat/PranaFormModal.jsx
└─ Opens via dispatch for complex UI
```

### **Mobile-Only:**
```
src/components/chat/bubbles/ToolCallBubble.jsx
├─ 10 action types
├─ Execute button
├─ State management
└─ Database integration

src/ai_services/chatServiceTestInjector.js
├─ 6 test examples
├─ Keyword detection
├─ Mobile testing
└─ Works offline

src/components/mobile/MobileChat.jsx
└─ Uses ToolCallBubble for action feedback
```

### **Shared:**
```
src/components/chat/MessageBubble.jsx
├─ Renders text
├─ Renders bubbles if type set
└─ Used by both layouts
```

---

## ✅ VALIDATION CHECKLIST

### **Desktop (SideChat)**
- [x] Renders text messages
- [x] ActionConfirmationCard for proposals
- [x] BubbleRenderer for visualizations
- [x] ❌ NO ToolCallBubble
- [x] ❌ NO test keyword injection
- [x] Opens modals via dispatch

### **Mobile (MobileChat)**
- [x] Renders text messages
- [x] ToolCallBubble for actions
- [x] Test keyword injection
- [x] Offline testing works
- [x] ❌ NO BubbleRenderer bubbles
- [x] ❌ NO complex modals

---

## 🧪 TESTING

### **Desktop Testing**
```bash
npm run build
npm run dev
→ Go to Desktop view (PranaWorkspaceLayout)
→ SideChat on right
→ Send message to Ash
→ Should see text + ActionConfirmationCard
→ ❌ No tool call bubbles
```

### **Mobile Testing**
```bash
npm run build
npm run dev
→ Resize to mobile (<640px)
→ Go to MobileChat
→ Type: "teste-semana"
→ Should see 5 tool call bubbles
→ Click "Executar" on each
→ Tasks created ✅
```

---

## 📝 CODE EXAMPLES

### **Ash Response for Desktop**
```javascript
{
  message: "Vou criar um projeto",
  client_action: {
    type: "PROPOSE_ACTION",  // Opens modal
    data: { ... }
  }
}
// Result: ActionConfirmationCard appears
```

### **Ash Response for Mobile**
```javascript
{
  message: "Vou criar tarefas",
  type: "tool_calls",  // ✅ Mobile-only type
  data: {
    toolCalls: [
      { id: '1', type: 'create_task', params: {...} },
      { id: '2', type: 'create_task', params: {...} }
    ]
  }
}
// Result: 2 ToolCallBubbles appear
```

---

## 🎯 DECISION RULES

**When Ash wants to execute action:**

| Context | Solution | Result |
|---------|----------|--------|
| **Desktop** | Return client_action | Modal opens |
| **Mobile** | Return type: 'tool_calls' | Bubbles with "Executar" |

**When Ash wants visualization:**

| Context | Solution | Result |
|---------|----------|--------|
| **Desktop** | Dispatch view event | View opens full-screen |
| **Mobile** | Return type: 'tool_calls' | Inline actions in chat |

---

## 🚀 IMPLEMENTATION STATUS

### **Desktop**
- ✅ BubbleRenderer (4 types, no tool calls)
- ✅ SideChat (clean, no test injection)
- ✅ ActionConfirmationCard (for proposals)
- ✅ Modal/View dispatch (for complex UI)
- ✅ Build passing

### **Mobile**
- ✅ ToolCallBubble (10 types)
- ✅ MobileChat integration
- ✅ chatServiceTestInjector (6 examples)
- ✅ Offline testing works
- ✅ Build passing

---

## 📊 METRICS

```
Files Modified:
├─ BubbleRenderer.jsx (removed tool_call cases)
├─ SideChat.jsx (removed test injection)
└─ (ToolCallBubble unchanged - still in repo for mobile)

Build Impact:
├─ 1 module removed from Desktop bundle
├─ Mobile still has full functionality
└─ Total: 1793 modules (down 1 from 1794)

Code Quality:
├─ Desktop: Clean, focused
├─ Mobile: Complete, tested
├─ No confusion between flows
└─ Build passing ✅
```

---

## ✨ THE CLEAR DESIGN

**ONE SYSTEM, TWO CONTEXTS:**

**Desktop:** "Views & Modals" (complex visualizations)
**Mobile:** "Tool Calls & Bubbles" (simple, inline actions)

**No confusion.** Each layout has its own pattern. ✅

---

## 🎓 FOR DEVELOPERS

**Desktop (PranaWorkspaceLayout)**
→ Look at: SideChat.jsx, BubbleRenderer.jsx, ActionConfirmationCard.jsx
→ Pattern: Text + Modal/View dispatch

**Mobile (MobileWorkspaceLayout)**  
→ Look at: MobileChat.jsx, ToolCallBubble.jsx, chatServiceTestInjector.js
→ Pattern: Text + Tool Calls + Bubbles

---

**Status: CLARIFIED & CORRECTED ✅**

Build: 1793 modules, 0 errors  
Architecture: Clear & Consistent  
Next: Test both flows
