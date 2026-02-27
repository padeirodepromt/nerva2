# 📚 TECHNICAL REFERENCE - Sistema de Energia Duplo + Diário

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DashboardView                                               │
│  ├─ Button: "Check-in de Energia"                           │
│  └─ Modals:                                                  │
│     ├─ EnergyCheckInModal (morning/afternoon)               │
│     └─ DiaryEditor (evening)                                │
│                                                               │
│  useEnergy Hook                                              │
│  ├─ recordEnergyCheckIn()                                   │
│  ├─ getTodayEnergy()                                        │
│  ├─ getWeekEnergy()                                         │
│  ├─ saveDiaryEntry()                                        │
│  ├─ getTodayDiary()                                         │
│  ├─ getWeekDiary()                                          │
│  ├─ getRituals()                                            │
│  ├─ createRitual()                                          │
│  ├─ updateRitual()                                          │
│  └─ getConstants()                                          │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                             ↓ (Fetch API)
┌──────────────────────────────────────────────────────────────┐
│                      SERVER (Express.js)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  /api/energy/check-in          [POST]  authenticate         │
│  /api/energy/today             [GET]   authenticate         │
│  /api/energy/week              [GET]   authenticate         │
│  /api/diary/entry              [POST]  authenticate         │
│  /api/diary/today              [GET]   authenticate         │
│  /api/diary/week               [GET]   authenticate         │
│  /api/rituals                  [GET]   authenticate         │
│  /api/rituals                  [POST]  authenticate         │
│  /api/rituals/:id              [PATCH] authenticate         │
│  /api/energy/constants         [GET]   authenticate         │
│                                                               │
│  Route Handler                                              │
│  ├─ Validation (energy types, states, intensity)           │
│  ├─ Database Operations (CRUD)                             │
│  └─ Response Formatting                                     │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                             ↓ (Drizzle ORM)
┌──────────────────────────────────────────────────────────────┐
│                    DATABASE (PostgreSQL)                     │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  energyCheckIns                                              │
│  ├─ id (uuid, pk)                                           │
│  ├─ userId (uuid, fk)                                       │
│  ├─ timeOfDay (enum: morning/afternoon)                     │
│  ├─ energyType (string, 9 valores)                          │
│  ├─ energyIntensity (integer, 1-5)                          │
│  ├─ secondaryType (string, optional)                        │
│  ├─ diaryEntryId (uuid, fk, optional)                       │
│  └─ createdAt (timestamp)                                   │
│                                                               │
│  diaryEntries                                               │
│  ├─ id (uuid, pk)                                           │
│  ├─ userId (uuid, fk)                                       │
│  ├─ content (text, rich)                                    │
│  ├─ emotionalStates (jsonb array, max 3)                    │
│  ├─ linkedEnergyMorning (uuid, fk, optional)                │
│  ├─ linkedEnergyAfternoon (uuid, fk, optional)              │
│  └─ createdAt (timestamp)                                   │
│                                                               │
│  rituals                                                     │
│  ├─ id (uuid, pk)                                           │
│  ├─ userId (uuid, fk)                                       │
│  ├─ name (string)                                           │
│  ├─ description (text)                                      │
│  ├─ morningEnergy (string, optional)                        │
│  ├─ afternoonEnergy (string, optional)                      │
│  ├─ eveningStates (jsonb array, optional)                   │
│  ├─ frequency (string)                                      │
│  ├─ detectionScore (decimal, 0-1)                           │
│  ├─ efficiencyScore (decimal, 0-1)                          │
│  ├─ isActive (boolean)                                      │
│  ├─ reminderTime (time, optional)                           │
│  └─ createdAt (timestamp)                                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### EnergyCheckInModal.jsx

**Props:**
```typescript
{
  isOpen: boolean;                    // Modal visibility
  onClose: () => void;                // Close callback
  timeOfDay: 'morning' | 'afternoon'; // Check-in type
  onSubmit: (data) => Promise<void>;  // Submit callback
}
```

**State:**
```javascript
{
  selectedEnergy: string;          // Selected energy type
  selectedIntensity: number;       // 1-5
  selectedSecondary: string | null; // Optional secondary
  isLoading: boolean;
  error: string | null;
}
```

**Features:**
- 9 energy type buttons (emoji + color gradient)
- Intensity slider with labels
- Optional secondary energy (morning only)
- Framer Motion animations
- Loading state feedback
- Error handling

**Return Value:**
```javascript
{
  timeOfDay: 'morning' | 'afternoon',
  energyType: string,
  energyIntensity: number,
  secondaryType: string | null
}
```

---

### DiaryEditor.jsx

**Props:**
```typescript
{
  initialContent?: string;        // Pre-filled text
  initialStates?: string[];       // Pre-selected emotions
  onSave: (data) => Promise<void>; // Save callback
  todayEnergy?: object;           // Morning/afternoon energy
  isLoading?: boolean;
}
```

**State:**
```javascript
{
  content: string;
  selectedStates: string[];  // Max 3
  isSaving: boolean;
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  charCount: number;
}
```

**Features:**
- Rich text area (textarea → upgradeable)
- 10 emotional state buttons (max 3 selection)
- Context display of today's energies
- Character counter (1000 max)
- Save status feedback
- Auto-save draft (future enhancement)

**Return Value:**
```javascript
{
  content: string,
  emotionalStates: string[],
  linkedEnergyMorning: uuid | null,
  linkedEnergyAfternoon: uuid | null
}
```

---

## API Endpoint Specifications

### POST /api/energy/check-in

**Request:**
```json
{
  "timeOfDay": "morning" | "afternoon",
  "energyType": "string (9 tipos)",
  "energyIntensity": 1-5,
  "secondaryType": "string? (optional, morning only)"
}
```

**Validation:**
- `timeOfDay` required, enum
- `energyType` required, must be in [9 types]
- `energyIntensity` required, range 1-5
- `secondaryType` optional, must be in [9 types] if provided
- `userId` extracted from auth token

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "timeOfDay": "morning",
    "energyType": "foco_profundo",
    "energyIntensity": 4,
    "secondaryType": "criativo",
    "createdAt": "2024-01-15T06:30:00Z"
  }
}
```

**Error Cases:**
- 400: Invalid energy type
- 400: Intensity out of range
- 401: Unauthorized
- 500: Database error

---

### POST /api/diary/entry

**Request:**
```json
{
  "content": "string (up to 1000 chars)",
  "emotionalStates": ["string", "string", "string?"],
  "linkedEnergyMorning": "uuid?",
  "linkedEnergyAfternoon": "uuid?"
}
```

**Validation:**
- `content` required, max 1000 chars
- `emotionalStates` max 3 items, each must be in [10 states]
- `linkedEnergyMorning` optional, must be valid uuid
- `linkedEnergyAfternoon` optional, must be valid uuid
- One entry per day per user (future constraint)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "content": "...",
    "emotionalStates": ["alegre", "confiante"],
    "linkedEnergyMorning": "uuid",
    "linkedEnergyAfternoon": "uuid",
    "createdAt": "2024-01-15T21:00:00Z"
  }
}
```

---

### GET /api/energy/today

**Query Parameters:** None

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "morning": {
      "id": "uuid",
      "energyType": "foco_profundo",
      "energyIntensity": 4,
      "secondaryType": "criativo"
    },
    "afternoon": {
      "id": "uuid",
      "energyType": "administrativo",
      "energyIntensity": 3,
      "secondaryType": null
    },
    "diary": {
      "id": "uuid",
      "content": "...",
      "emotionalStates": ["alegre", "confiante"]
    }
  }
}
```

---

### GET /api/energy/constants

**Response:**
```json
{
  "success": true,
  "data": {
    "energyTypes": [
      "foco_profundo",
      "criativo",
      "administrativo",
      "estrategico",
      "colaborativo",
      "social",
      "restaurador",
      "introspectivo",
      "fisico"
    ],
    "emotionalStates": [
      "alegre",
      "confiante",
      "entusiasmado",
      "esperancoso",
      "grato",
      "calmo",
      "vulneravel",
      "ansioso",
      "estressado",
      "triste"
    ],
    "intensityScale": {
      "1": "Mínima",
      "2": "Baixa",
      "3": "Moderada",
      "4": "Alta",
      "5": "Pico"
    }
  }
}
```

---

## Database Queries

### Get Today's Energy
```sql
SELECT * FROM energyCheckIns 
WHERE userId = $1 
  AND DATE(createdAt) = CURRENT_DATE
ORDER BY createdAt ASC;
```

### Get Week's Energy
```sql
SELECT * FROM energyCheckIns 
WHERE userId = $1 
  AND createdAt >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY createdAt DESC;
```

### Get Energy with Diary
```sql
SELECT e.*, d.content, d.emotionalStates
FROM energyCheckIns e
LEFT JOIN diaryEntries d ON e.diaryEntryId = d.id
WHERE e.userId = $1 
  AND DATE(e.createdAt) = CURRENT_DATE;
```

### Detect Patterns (Ritual Detection)
```sql
SELECT 
  timeOfDay,
  energyType,
  COUNT(*) as frequency,
  AVG(energyIntensity) as avgIntensity
FROM energyCheckIns
WHERE userId = $1 
  AND createdAt >= CURRENT_DATE - INTERVAL '14 days'
GROUP BY timeOfDay, energyType
HAVING COUNT(*) >= 4
ORDER BY frequency DESC;
```

---

## Constants & Enums

### ENERGY_TYPES (9)
```javascript
const ENERGY_TYPES = [
  'foco_profundo',    // Deep focus, concentration
  'criativo',         // Creative, brainstorming
  'administrativo',   // Admin tasks, meetings
  'estrategico',      // Strategic planning
  'colaborativo',     // Teamwork, discussion
  'social',           // Social events, networking
  'restaurador',      // Recovery, rest, meditation
  'introspectivo',    // Reflection, introspection
  'fisico'            // Physical activity
];
```

### EMOTIONAL_STATES (10)
```javascript
const EMOTIONAL_STATES = [
  'alegre',           // Happy, joyful
  'confiante',        // Confident
  'entusiasmado',     // Enthusiastic, excited
  'esperancoso',      // Hopeful
  'grato',            // Grateful, appreciative
  'calmo',            // Calm, peaceful
  'vulneravel',       // Vulnerable, exposed
  'ansioso',          // Anxious, worried
  'estressado',       // Stressed
  'triste'            // Sad, melancholic
];
```

### INTENSITY_SCALE (1-5)
```javascript
const INTENSITY_SCALE = {
  1: 'Mínima',        // Minimal energy
  2: 'Baixa',         // Low energy
  3: 'Moderada',      // Moderate energy
  4: 'Alta',          // High energy
  5: 'Pico'           // Peak energy
};
```

---

## File Structure (Complete)

```
src/
├── api/
│   └── energy/
│       └── routes.js ........................ API endpoints
├── components/
│   └── energy/
│       ├── EnergyCheckInModal.jsx .......... Check-in UI
│       └── DiaryEditor.jsx ................ Diary UI
├── db/
│   └── schema/
│       └── energy.js ....................... Database schema
├── hooks/
│   └── useEnergy.js ........................ Custom hook
├── views/
│   └── DashboardView.jsx .................. Integrated view
└── ai_services/
    └── ritualDetectionService.js ......... (Coming Fase 12b)

Root:
├── server.js ............................... Integration
├── GET_STARTED.md .......................... Quick start
├── QUICK_START_ENERGY_SYSTEM.md ........... Detailed guide
├── PHASE_11_FINAL_SUMMARY.md .............. Summary
└── IMPLEMENTATION_PHASE_11_COMPLETE.md ... Full details
```

---

## Type Definitions

### EnergyCheckIn
```typescript
type EnergyCheckIn = {
  id: UUID;
  userId: UUID;
  timeOfDay: 'morning' | 'afternoon';
  energyType: EnergyType;
  energyIntensity: 1 | 2 | 3 | 4 | 5;
  secondaryType?: EnergyType;
  diaryEntryId?: UUID;
  createdAt: Date;
};

type EnergyType = 
  | 'foco_profundo'
  | 'criativo'
  | 'administrativo'
  | 'estrategico'
  | 'colaborativo'
  | 'social'
  | 'restaurador'
  | 'introspectivo'
  | 'fisico';
```

### DiaryEntry
```typescript
type DiaryEntry = {
  id: UUID;
  userId: UUID;
  content: string; // max 1000 chars
  emotionalStates: EmotionalState[]; // max 3
  linkedEnergyMorning?: UUID;
  linkedEnergyAfternoon?: UUID;
  createdAt: Date;
};

type EmotionalState =
  | 'alegre'
  | 'confiante'
  | 'entusiasmado'
  | 'esperancoso'
  | 'grato'
  | 'calmo'
  | 'vulneravel'
  | 'ansioso'
  | 'estressado'
  | 'triste';
```

### Ritual
```typescript
type Ritual = {
  id: UUID;
  userId: UUID;
  name: string;
  description: string;
  morningEnergy?: EnergyType;
  afternoonEnergy?: EnergyType;
  eveningStates?: EmotionalState[];
  frequency: string; // e.g., "4-5 times/week"
  detectionScore: number; // 0-1
  efficiencyScore: number; // 0-1
  isActive: boolean;
  reminderTime?: Time;
  createdAt: Date;
};
```

---

## Error Handling Strategy

### Client-Side (React)
```javascript
try {
  const data = await recordEnergyCheckIn({...});
  // Success feedback
  toast.success('Energia registrada!');
  modal.close();
} catch (error) {
  // Error feedback
  toast.error('Erro ao registrar energia');
  console.error(error);
}
```

### Server-Side (Express)
```javascript
// Validation errors
if (!isValidEnergyType(energyType)) {
  return res.status(400).json({
    success: false,
    error: `Invalid energy type: ${energyType}`
  });
}

// Database errors
try {
  const result = await db.insert(energyCheckIns).values(...);
} catch (error) {
  console.error('DB Error:', error);
  return res.status(500).json({
    success: false,
    error: 'Failed to save energy check-in'
  });
}
```

---

## Performance Considerations

### Caching Strategy
- `getTodayEnergy()` - Cache for 5 minutes
- `getWeekEnergy()` - Cache for 1 hour
- `getConstants()` - Cache permanently (rarely changes)

### Database Indexes
```sql
CREATE INDEX idx_energy_userId_createdAt 
ON energyCheckIns(userId, createdAt DESC);

CREATE INDEX idx_diary_userId_createdAt 
ON diaryEntries(userId, createdAt DESC);

CREATE INDEX idx_rituals_userId 
ON rituals(userId);
```

### Query Optimization
- Use SELECT specific columns (not *)
- Use pagination for list endpoints (add limit/offset later)
- Pre-join related data in single query

---

## Testing Checklist

- [ ] All 10 endpoints tested
- [ ] Validation works (invalid types rejected)
- [ ] Auth middleware works
- [ ] Database saves data correctly
- [ ] Modal opens/closes properly
- [ ] Form submission works
- [ ] Error handling displays
- [ ] Loading states show
- [ ] Linking between energy/diary works

---

**Last Updated:** Phase 11 Complete  
**Next Phase:** 12a (Database Migration)
