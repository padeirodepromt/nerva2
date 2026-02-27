# 🚀 PHASE 12 KICKOFF - What To Do Next

## 🎯 Fase 12a: Database Migration (Next Immediate Step)

### Command to Run
```bash
cd /workspaces/prana3.0

# Step 1: Generate migration files
npm run db:generate

# Step 2: Run migration
npm run db:migrate

# Step 3: Verify (open studio)
npm run db:studio
# Navigate to http://localhost:3000
# Check these tables exist:
#   - energyCheckIns ✓
#   - diaryEntries ✓
#   - rituals ✓
```

**Expected Output:**
```
✓ Migration complete
✓ Tables created successfully
✓ Foreign key constraints applied
```

**If Migration Fails:**
1. Check PostgreSQL connection (verify DATABASE_URL)
2. Run: `npm run db:push` (alternative)
3. Check logs: `npm run dev`

---

## 📋 What's Already Done (Phase 11)

```
✅ Schema Definition (src/db/schema/energy.js)
   └─ Ready for migration

✅ API Endpoints (src/api/energy/routes.js)
   └─ 10 endpoints fully implemented

✅ React Components
   └─ EnergyCheckInModal + DiaryEditor

✅ Custom Hook (src/hooks/useEnergy.js)
   └─ 11 functions for API integration

✅ Dashboard Integration
   └─ Button + Modal wired

✅ Complete Documentation
   └─ 6 comprehensive guides
```

---

## 🔄 Phases 12b-12e Overview

### Phase 12b: Ritual Detection Service (3-4 hours)
**File:** `src/ai_services/ritualDetectionService.js`

```javascript
// Pseudo-code structure:
export const ritualDetectionService = {
  // Analyze check-ins from past 14 days
  analyzePatterns: (checkIns, diaryEntries) => {
    // 1. Group by time pattern (morning → afternoon → evening)
    // 2. Calculate frequency (how often)
    // 3. Calculate consistency (deviation)
    // 4. Generate detectionScore (0-1)
    // 5. If score > 0.7, suggest ritual
  },
  
  // Create ritual from detected pattern
  createRitual: (pattern) => {
    // Structure ritual object
    // Save via POST /api/rituals
  }
};
```

### Phase 12c: Ash Proactive Prompts (2-3 hours)
**File:** `src/stores/useAshStore.js` (modification)

```javascript
// Add this method to useAshStore:
const askAboutEnergy = (timeOfDay) => {
  // 6am: "Como está sua energia?"
  // 2pm: "Sua energia mudou?"
  // 8pm: "Como foi seu dia?"
  // Trigger: EnergyCheckInModal or DiaryEditor
};
```

### Phase 12d: Journal Page (3-4 hours)
**File:** `src/views/JournalView.jsx` (new)

```jsx
export default function JournalView() {
  // Display:
  // - 30-day calendar
  // - Energy history
  // - Diary entries
  // - Emotional states stats
  // - Search/filter
  // - Export as PDF
}
```

### Phase 12e: Testing & Polish (2-3 hours)
**Files:** Tests + refinements

```javascript
// Test endpoints with mock data
// Test modal flows end-to-end
// Test ritual detection algorithm
// Polish UX/animations
```

---

## ✅ Success Criteria (Fase 12 Complete)

- [ ] Database migration runs without errors
- [ ] All 4 tables created in PostgreSQL
- [ ] Can create energy check-in via API
- [ ] Can create diary via API
- [ ] Ritual detection works with mock data
- [ ] Ash prompts at 6am, 2pm, 8pm
- [ ] Journal page displays entries
- [ ] Dashboard button works end-to-end
- [ ] No console errors
- [ ] Build passes: `npm run build`

---

## 📚 Files to Reference

| Phase | File | Purpose |
|-------|------|---------|
| 12a | src/db/schema/energy.js | Migration source |
| 12b | src/ai_services/ritualDetectionService.js | Pattern detection |
| 12c | src/stores/useAshStore.js | Ash integration |
| 12d | src/views/JournalView.jsx | Journal UI |
| 12e | tests/energy.test.js | Test suite |

---

## 🎯 Recommended Order

```
1️⃣  Phase 12a: Database Migration (30 min)
    └─ Get data layer working

2️⃣  Phase 12b: Ritual Detection (4 hours)
    └─ Add intelligence layer

3️⃣  Phase 12c: Ash Prompts (3 hours)
    └─ Add user engagement

4️⃣  Phase 12d: Journal Page (3 hours)
    └─ Add visualization

5️⃣  Phase 12e: Testing (2 hours)
    └─ Polish everything
```

**Total:** ~12-14 hours (1.5 development days)

---

## 💡 Tips for Phase 12

### For Phase 12a (Migration)
- Use `npm run db:studio` to inspect tables after migration
- If migration fails, check DATABASE_URL env variable
- Verify foreign key constraints were created

### For Phase 12b (Ritual Detection)
- Start with simple pattern detection (frequency only)
- Add consistency scoring after basic version works
- Use test data to validate algorithm
- Consider using date-fns for date calculations

### For Phase 12c (Ash Prompts)
- Integrate with existing useAshStore structure
- Use timezone-aware scheduling (user's local time)
- Skip prompt if already checked-in today
- Add visual indicator in Ash chat

### For Phase 12d (Journal Page)
- Build on top of existing useEnergy hook
- Consider pagination for 30+ entries
- Add filters: by energy type, emotional state, date range
- Use charts library for visualizations (optional)

### For Phase 12e (Testing)
- Test each endpoint with curl/Postman first
- Then test modal flows in browser
- Test ritual detection with mock 14-day data
- Check error handling (invalid data, auth failures)

---

## 🔗 Connection Points

```
Fase 12a (Migration) 
    ↓
    Creates tables
    ↓
Fase 12b (Ritual Detection)
    ↓
    Reads from energyCheckIns + diaryEntries
    ↓
Fase 12c (Ash Prompts)
    ↓
    Triggers EnergyCheckInModal
    ↓
Fase 12d (Journal Page)
    ↓
    Displays all data
    ↓
Fase 12e (Testing)
    ↓
    Validates everything works
```

---

## 📝 Quick Checklist (Start Now)

- [ ] Read this file (PHASE_12_KICKOFF.md)
- [ ] Read [GET_STARTED.md](GET_STARTED.md)
- [ ] Run: `npm run dev`
- [ ] Test: Click "Check-in de Energia" button
- [ ] Open: `npm run db:studio` (check current state)
- [ ] Next: Run Phase 12a migration commands

---

## 🎓 Resources

- Database Schema: [src/db/schema/energy.js](src/db/schema/energy.js)
- API Endpoints: [src/api/energy/routes.js](src/api/energy/routes.js)
- Tech Specs: [TECHNICAL_REFERENCE.md](TECHNICAL_REFERENCE.md)
- Full Guide: [GET_STARTED.md](GET_STARTED.md)

---

## ⏱️ Timeline Estimate

| Phase | Duration | Difficulty |
|-------|----------|------------|
| 12a (Migration) | 30 min | Easy ✓ |
| 12b (Rituals) | 4 hours | Medium |
| 12c (Ash) | 3 hours | Medium |
| 12d (Journal) | 3 hours | Medium |
| 12e (Testing) | 2 hours | Easy |
| **Total** | **~14 hours** | - |

---

**Status:** Phase 11 Complete ✅  
**Next:** Phase 12a (Database Migration)  
**Estimated Start:** Now!  

🚀 **Let's go!**
