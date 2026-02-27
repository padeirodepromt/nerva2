# 🎨 Secondary Icon System V1.0
## Design Guidelines for Non-Arcano Icons

**Version:** 1.0  
**Status:** Design Specification (Ready for Implementation)  
**Phase:** 7 - Secondary Icon System Design  
**Date:** December 2025

---

## 📋 Overview

This document establishes comprehensive design guidelines for **secondary icons** — icons that are NOT Prana Arcanos (the 17 primary icons). Secondary icons support UI functionality, status indicators, navigation, and feedback without claiming Arcano identity.

**Scope:** All icons sized 16x16, 20x20, 24x24, and 32x32 that are not Arcano icons.

---

## 🎯 Core Principles

### 1. **Visual Hierarchy**
- **Arcano Icons (100x100):** Primary identity, ceremonial, spiritual
- **Page/View Headers (40x40):** Secondary identity, contextual
- **UI Icons (24x24):** Functional, action-oriented, contextual
- **Status Icons (16x16):** Indicators, badges, micro-feedback

### 2. **Color System**
```
Action Icons (Buttons, Controls):
  - Default: text-muted-foreground (opacity-60)
  - Hover: text-foreground (opacity-100)
  - Active: text-[rgb(var(--accent-rgb))] (opacity-100)
  - Disabled: text-muted-foreground (opacity-30)

Status Icons:
  - Success: text-emerald-500
  - Warning: text-amber-500
  - Error: text-red-500
  - Info: text-blue-500
  - Neutral: text-muted-foreground

Emphasis Icons:
  - Primary: text-[rgb(var(--accent-rgb))]
  - Secondary: text-primary
  - Tertiary: text-muted-foreground
```

### 3. **Sizing Standards**

| Size | Use Case | Examples |
|------|----------|----------|
| 16x16 | Badges, status dots, inline text | Status indicators, tags |
| 20x20 | Header actions, breadcrumbs | Back button, menu trigger |
| 24x24 | Primary buttons, form controls | Create button, delete, edit |
| 32x32 | Large cards, hero sections | Empty states, featured items |
| 40x40 | View headers (secondary) | Page context icons |

### 4. **Spacing Rules**

```css
/* Icon Button Spacing (with padding) */
.icon-button-sm {
  padding: 0.375rem; /* 6px = 24x24 icon + 6px each side */
  border-radius: 0.375rem; /* 6px - sharp corners */
}

.icon-button-md {
  padding: 0.5rem; /* 8px = 24x24 icon + 8px each side */
  border-radius: 0.5rem; /* 8px - rounded */
}

.icon-button-lg {
  padding: 0.75rem; /* 12px = 32x32 icon + 12px each side */
  border-radius: 0.75rem; /* 12px */
}

/* Icon Grid Spacing */
.icon-grid {
  gap: 1rem; /* 16px between icons */
  padding: 1rem; /* 16px edges */
}

/* Inline Icons with Text */
.icon-text {
  gap: 0.5rem; /* 8px between icon and text */
}
```

---

## 🗂️ Icon Categories

### **A. Navigation Icons**
Used for navigation, routing, and view switching.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| ChevronLeft | 20x20 | Back navigation | muted-foreground | Keyboard: ← or Alt+← |
| ChevronRight | 20x20 | Forward/expand | muted-foreground | Keyboard: → or Alt+→ |
| ChevronUp | 20x20 | Collapse section | muted-foreground | - |
| ChevronDown | 20x20 | Expand section | muted-foreground | - |
| ArrowRight | 24x24 | Go to item | accent | Links, deep dives |
| Menu | 24x24 | Mobile menu | foreground | Mobile-only |
| X | 20x20 | Close modal/dialog | foreground | Always available |
| Home | 20x20 | Return home | muted-foreground | Breadcrumb context |

**Implementation:**
```jsx
// Navigation Icon Pattern
<button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
  <IconChevronLeft className="w-5 h-5" />
</button>
```

### **B. Action Icons**
Used for buttons, form controls, and interactive elements.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| Plus | 24x24 | Create new | accent | Primary action |
| Trash | 24x24 | Delete | red-500 | Destructive action |
| Edit | 24x24 | Edit item | accent | Secondary action |
| Search | 24x24 | Search/filter | muted-foreground | Inside input fields |
| Filter | 24x24 | Show filters | muted-foreground | Toggle state |
| Download | 24x24 | Export/download | accent | File operations |
| Upload | 24x24 | Import/upload | accent | File operations |
| Copy | 20x20 | Copy to clipboard | foreground | Quick action |
| Link | 20x20 | Open link | accent | External links |
| Settings | 24x24 | Configuration | muted-foreground | App settings |

**Implementation:**
```jsx
// Action Button Pattern
<Button variant="ghost" size="sm">
  <IconPlus className="w-5 h-5" />
  Novo
</Button>

// Icon-only Button
<Button size="sm" variant="outline" className="w-10 h-10">
  <IconTrash className="w-4 h-4" />
</Button>
```

### **C. Status Icons**
Used for status indicators, badges, and feedback.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| CheckCircle | 16x16, 24x24 | Success/done | emerald-500 | Filled circle |
| AlertCircle | 16x16, 24x24 | Warning | amber-500 | Filled circle |
| AlertTriangle | 16x16, 24x24 | Error/blocked | red-500 | Triangle |
| Info | 16x16, 24x24 | Information | blue-500 | Filled circle |
| Clock | 16x16, 24x24 | In progress | foreground | Time/pending |
| Circle | 16x16 | Neutral/todo | muted-foreground | Empty circle |
| Loader | 16x16, 24x24 | Loading | accent | Animated |

**Implementation:**
```jsx
// Status Badge Pattern
<div className="flex items-center gap-2">
  {status === 'done' && <IconCheckCircle className="w-4 h-4 text-emerald-500" />}
  {status === 'doing' && <IconClock className="w-4 h-4 text-blue-500 animate-pulse" />}
  {status === 'blocked' && <IconAlertTriangle className="w-4 h-4 text-red-500" />}
  <span className="text-xs">{t(`status_${status}`)}</span>
</div>
```

### **D. Form & Input Icons**
Used in form controls and input validation.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| Eye | 20x20 | Show/hide password | muted-foreground | Toggle state |
| EyeOff | 20x20 | Hidden password | muted-foreground | Toggle state |
| CheckCircle | 16x16 | Valid input | emerald-500 | Right of input |
| AlertCircle | 16x16 | Error input | red-500 | Right of input |
| Calendar | 20x20 | Date picker | muted-foreground | Inside input |
| Clock | 20x20 | Time picker | muted-foreground | Inside input |
| User | 20x20 | User selection | muted-foreground | Inside input |
| Lock | 20x20 | Password/secure | muted-foreground | Inside input |

**Implementation:**
```jsx
// Input with Icon Pattern
<div className="relative">
  <Input type={showPassword ? 'text' : 'password'} placeholder="Senha" />
  <button 
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
  >
    {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
  </button>
</div>
```

### **E. Media & Content Icons**
Used for file types, content categories, and media.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| FileText | 24x24 | Document/file | muted-foreground | Generic file |
| Image | 24x24 | Image/photo | muted-foreground | Image file |
| Music | 24x24 | Audio file | muted-foreground | Audio content |
| Video | 24x24 | Video file | muted-foreground | Video content |
| Folder | 24x24 | Directory/collection | muted-foreground | Container |
| Camera | 24x24 | Photo capture | accent | Media action |
| Paperclip | 20x20 | Attachment | muted-foreground | File attachment |
| Link | 20x20 | URL/hyperlink | accent | External link |

**Implementation:**
```jsx
// File Type Icon Pattern
const FILE_ICONS = {
  'text/plain': IconFileText,
  'application/pdf': IconFileText,
  'image/jpeg': IconImage,
  'image/png': IconImage,
  'audio/mpeg': IconMusic,
  'video/mp4': IconVideo,
  'default': IconFile
};

const FileIcon = ({ mimeType }) => {
  const Icon = FILE_ICONS[mimeType] || FILE_ICONS.default;
  return <Icon className="w-6 h-6 text-muted-foreground" />;
};
```

### **F. Data & Chart Icons**
Used for analytics, metrics, and visualizations.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| BarChart3 | 24x24 | Bar chart | accent | Analytics |
| TrendingUp | 24x24 | Increasing metric | emerald-500 | Positive trend |
| TrendingDown | 24x24 | Decreasing metric | red-500 | Negative trend |
| PieChart | 24x24 | Pie chart | accent | Composition |
| LineChart | 24x24 | Line graph | accent | Trend analysis |
| Zap | 20x20 | Energy/power | amber-500 | Energy level |
| Smile | 20x20 | Mood/emoji | amber-500 | User emotion |
| Sun | 20x20 | Daytime | amber-500 | Time indicator |
| Moon | 20x20 | Nighttime | blue-500 | Time indicator |

**Implementation:**
```jsx
// Analytics Card Pattern
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <h3>Análise de Energia</h3>
      <IconTrendingUp className="w-5 h-5 text-emerald-500" />
    </div>
  </CardHeader>
  <CardContent>
    {/* Chart content */}
  </CardContent>
</Card>
```

### **G. Relationship & Connection Icons**
Used for linking, dependencies, and relationships.

| Icon | Size | Usage | Color | Notes |
|------|------|-------|-------|-------|
| Link | 20x20 | Create connection | accent | Link creation |
| Unlink | 20x20 | Remove connection | red-500 | Link deletion |
| Share | 20x20 | Share/distribute | accent | Sharing |
| User | 20x20 | Person/member | foreground | User reference |
| Users | 24x24 | Team/group | foreground | Multiple people |
| MessageSquare | 20x20 | Comment/chat | muted-foreground | Communication |
| Bell | 20x20 | Notification | accent | Alerts |
| Heart | 20x20 | Favorite/like | red-500 | Favorites |
| Star | 20x20 | Rating/important | amber-500 | Importance |

**Implementation:**
```jsx
// Relationship Indicator Pattern
<div className="flex items-center gap-3 p-3 rounded-lg bg-card/50">
  <IconUser className="w-5 h-5 text-foreground" />
  <div className="flex-1">
    <p className="text-sm font-medium">{userName}</p>
    <p className="text-xs text-muted-foreground">{role}</p>
  </div>
  <IconLink className="w-5 h-5 text-accent cursor-pointer" />
</div>
```

---

## 🎨 Color & Opacity System

### **Standard Icon Colors**

```css
/* Default State */
.icon-default {
  color: var(--muted-foreground);
  opacity: 0.6;
}

/* Hover State */
.icon-hover {
  color: var(--foreground);
  opacity: 1;
  transition: all 200ms ease-out;
}

/* Active/Accent State */
.icon-active {
  color: rgb(var(--accent-rgb));
  opacity: 1;
  transition: all 200ms ease-out;
}

/* Disabled State */
.icon-disabled {
  color: var(--muted-foreground);
  opacity: 0.3;
  cursor: not-allowed;
}

/* Status Colors */
.icon-success { color: #10b981; }  /* emerald-500 */
.icon-warning { color: #f59e0b; }  /* amber-500 */
.icon-error { color: #ef4444; }    /* red-500 */
.icon-info { color: #3b82f6; }     /* blue-500 */
.icon-pending { color: #6366f1; }  /* indigo-500 */
```

### **Opacity Levels**

| Level | Opacity | Use Case |
|-------|---------|----------|
| Subtle | 0.3 | Disabled, background elements |
| Normal | 0.6 | Default state, secondary icons |
| Prominent | 0.8 | Hover, interactive elements |
| Full | 1.0 | Active, accented, important |

---

## ✨ Animation & Interaction Guidelines

### **Hover Effects**

```jsx
// Standard Icon Hover
<Button variant="ghost" className="hover:bg-white/5 transition-all duration-200">
  <IconPlus className="w-5 h-5 group-hover:text-accent" />
</Button>

// Elevated Hover
<div className="p-2 rounded-lg hover:bg-white/10 hover:shadow-md transition-all duration-300">
  <IconStar className="w-6 h-6 text-muted-foreground hover:text-amber-500 hover:scale-110" />
</div>
```

### **State Transitions**

```jsx
// Animated Status Change
<motion.div>
  {status === 'loading' && (
    <IconLoader2 className="w-5 h-5 text-accent animate-spin" />
  )}
  {status === 'success' && (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
      <IconCheckCircle className="w-5 h-5 text-emerald-500" />
    </motion.div>
  )}
</motion.div>

// Fade Between Icons
<AnimatePresence mode="wait">
  {isVisible ? (
    <motion.div key="visible" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <IconEye className="w-5 h-5" />
    </motion.div>
  ) : (
    <motion.div key="hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <IconEyeOff className="w-5 h-5" />
    </motion.div>
  )}
</AnimatePresence>
```

### **Loading States**

```jsx
// Spinner Icon
<IconLoader2 className="w-5 h-5 animate-spin text-accent" />

// Pulse Effect
<IconBell className="w-5 h-5 text-amber-500 animate-pulse" />

// Bounce Animation
<motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
  <IconArrowDown className="w-5 h-5" />
</motion.div>
```

---

## 📐 Responsive Icon Sizing

```css
/* Mobile First */
.icon-responsive {
  /* Mobile: 20x20 */
  width: 1.25rem;
  height: 1.25rem;
}

@media (min-width: 768px) {
  .icon-responsive {
    /* Desktop: 24x24 */
    width: 1.5rem;
    height: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .icon-responsive {
    /* Large: 28x28 */
    width: 1.75rem;
    height: 1.75rem;
  }
}
```

---

## 🏗️ Implementation Patterns

### **Icon Button Pattern**

```jsx
// Minimal Icon Button
<Button variant="ghost" size="sm" className="w-8 h-8 p-0">
  <IconPlus className="w-4 h-4" />
</Button>

// Icon Button with Label
<Button variant="outline" size="sm" className="gap-2">
  <IconDownload className="w-4 h-4" />
  Exportar
</Button>

// Icon Button Group
<div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">
  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
    <IconMinus className="w-4 h-4" />
  </Button>
  <div className="w-px h-4 bg-white/10" />
  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
    <IconPlus className="w-4 h-4" />
  </Button>
</div>
```

### **Status Indicator Pattern**

```jsx
// Status Badge
<div className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium" 
     style={{
       backgroundColor: statusColors[status].bg,
       color: statusColors[status].text,
       borderColor: statusColors[status].border
     }}>
  <Icon className="w-3 h-3" />
  {label}
</div>

// Status with Pulse
<div className="relative">
  <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
  <div className="relative p-2 rounded-full bg-card">
    <IconStatus className="w-4 h-4" />
  </div>
</div>
```

### **Dropdown with Icons Pattern**

```jsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="sm" className="gap-2">
      <IconChevronDown className="w-4 h-4" />
      Menu
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>
      <IconEdit className="w-4 h-4 mr-2" />
      Editar
    </DropdownMenuItem>
    <DropdownMenuItem>
      <IconTrash className="w-4 h-4 mr-2" />
      Deletar
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

---

## 📦 Icon Library Usage

### **Importing Secondary Icons**

```jsx
import {
  IconPlus, IconTrash, IconEdit, IconSearch, IconFilter,
  IconChevronLeft, IconChevronRight, IconChevronUp, IconChevronDown,
  IconCheckCircle, IconAlertTriangle, IconClock, IconLoader2,
  IconFileText, IconFolder, IconImage,
  IconBarChart3, IconTrendingUp, IconZap,
  IconUser, IconUsers, IconLink, IconShare,
  IconEye, IconEyeOff, IconLock,
  IconDownload, IconUpload, IconCopy,
  IconHome, IconSettings, IconMenu, IconX,
  IconBell, IconMessageSquare, IconHeart, IconStar
} from '@/components/icons/PranaLandscapeIcons';
```

### **Available from PranaLandscapeIcons**

All secondary icons are exported from the main icon library. The naming convention is:
- `Icon` + `CamelCaseIconName`
- e.g., `IconPlus`, `IconCheckCircle`, `IconBarChart3`

---

## 🎯 Usage Checklist

### **Before Using a Secondary Icon**

- [ ] Icon represents an **action**, **status**, or **navigation**?
- [ ] Not a substitute for an **Arcano icon**? (if yes, use Arcano)
- [ ] Size is **24x24** or smaller?
- [ ] Color matches the **system** (accent, status colors, etc.)?
- [ ] Tested in both **light** and **dark** modes?
- [ ] Accessible with **title** or **aria-label** attribute?
- [ ] Consistent with **semantic meaning** (e.g., red for delete)?

---

## 🔮 Future Expansions

### **Phase 8 (Planned)**
- Animation library for icon state transitions
- Micro-interactions for user feedback
- Icon composition patterns (stacked icons, badges)
- Custom icon system for user-generated content

### **Phase 9 (Planned)**
- Dark mode optimizations for secondary icons
- Accessibility audit for color contrast
- Icon animation library (SVG) for complex states
- Brand icon variations and theming

---

## 📚 References

- **Primary Icon System:** ICON_ARCANO_SYSTEM_V1.md
- **Color System:** CSS custom properties (--accent-rgb, --foreground, --muted-foreground, etc.)
- **Component Library:** src/components/ui/ (Button, Badge, Dialog, etc.)
- **Icon Library:** src/components/icons/PranaLandscapeIcons.jsx

---

**Document Status:** Design Specification - Ready for Implementation  
**Maintained By:** Architecture Team  
**Last Updated:** December 2025
