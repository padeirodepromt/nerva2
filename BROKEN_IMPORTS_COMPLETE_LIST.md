# Complete Broken Imports List - Prana 3.0

## Summary Statistics
- **Total Files Scanned:** 654
- **Total Broken Imports Found:** 21
- **Critical Issues:** 12
- **High Priority Issues:** 8  
- **Informational Issues:** 2

---

## 🔴 CRITICAL IMPORTS - Require Immediate Fixes

### Group 1: Missing Service Files in `/src/api/services/`

#### Issue 1.1: Missing `taskService.js`
- **File:** `/src/agents/agentCollaboration.js`
- **Import:** `import { isAgentEnabledForPlan } from '@/api/services/taskService'`
- **Expected Location:** `/src/api/services/taskService.js`
- **Fix:** Create file or update import

#### Issue 1.2: Missing `billingService.js`
- **File:** `/src/api/controllers/agentController.js`
- **Import:** `import ... from '../services/billing/billingService.js'`
- **Expected Location:** `/src/api/services/billing/billingService.js`
- **Fix:** Create directory `/src/api/services/billing/` and file `billingService.js`

#### Issue 1.3: Missing `modelsService.js`
- **File:** `/src/api/controllers/agentController.js`
- **Import:** `import ... from '../services/modelsService.js'`
- **Expected Location:** `/src/api/services/modelsService.js`
- **Fix:** Create file `/src/api/services/modelsService.js`

#### Issue 1.4: Missing `agentLogService.js`
- **File:** `/src/api/controllers/agentController.js`
- **Import:** `import ... from '../services/agentLogService.js'`
- **Expected Location:** `/src/api/services/agentLogService.js`
- **Fix:** Create file `/src/api/services/agentLogService.js`

#### Issue 1.5: Missing `emailService.js`
- **File:** `/src/api/agents/general/tools/integrationTools.js`
- **Import:** `import ... from '../../../../services/emailService.js'`
- **Expected Location:** `/src/services/emailService.js` OR `/src/api/services/emailService.js`
- **Fix:** Create file in appropriate location

---

### Group 2: Missing Components

#### Issue 2.1: Missing `TabBar.jsx`
- **File:** `/src/components/layout/MainStage.jsx`
- **Import:** `import ... from '@/components/layout/TabBar'`
- **Expected Location:** `/src/components/layout/TabBar.jsx`
- **Fix:** Create component or import existing alternative

#### Issue 2.2: Missing Icon Component
- **File:** `/src/components/specialists/flor-creator/ContextTuningBar.jsx`
- **Import:** `import ... from '@/components/icons/PranaIcons'`
- **Expected Location:** `/src/components/icons/PranaIcons.jsx` (or .js)
- **Note:** May need to consolidate with `PranaLandscapeIcons`
- **Fix:** Create icon component or map import correctly

---

### Group 3: Missing Configuration Files

#### Issue 3.1: Missing Plan Settings Config
- **File:** `/src/components/admin/PlansControlPanel.jsx`
- **Import:** `import ... from '../config/userPlanSettings'`
- **Expected Location:** `/src/components/config/userPlanSettings.js`
- **Fix:** Create configuration file or import from existing config

#### Issue 3.2: Missing Features List Config
- **File:** `/src/components/admin/PlansControlPanel.jsx`
- **Import:** `import ... from '../config/featuresList'`
- **Expected Location:** `/src/components/config/featuresList.js`
- **Fix:** Create configuration file or import from existing config

---

### Group 4: Missing Custom Hooks

#### Issue 4.1: Missing Custom Hook
- **File:** `/src/components/chat/AgentSelector.jsx`
- **Import:** `import ... from '@/hooks/useProjectSystems'`
- **Expected Location:** `/src/hooks/useProjectSystems.js`
- **Fix:** Create hook or use existing similar hook

---

### Group 5: Wrong Import Paths in Olly Service

#### Issue 5.1: Wrong Database Import Path
- **File:** `/src/services/olly/OllySystemIntegration.js`
- **Import:** `import ... from '@/lib/db'`
- **Current Expected:** `/src/lib/db` ❌ (doesn't exist)
- **Correct Location:** `/src/db/index.js`
- **Fix:** Change import to `import { db } from '@/db/index'` or `import { db } from '../../db/index.js'`

#### Issue 5.2: Wrong Schema Import Path
- **File:** `/src/services/olly/OllySystemIntegration.js`
- **Import:** `import ... from '@/lib/schema'`
- **Current Expected:** `/src/lib/schema` ❌ (doesn't exist)
- **Correct Location:** `/src/db/schema.js`
- **Fix:** Change import to `import schema from '@/db/schema'` or `import schema from '../../db/schema.js'`

---

## 🟡 HIGH PRIORITY - Test File Path Issues

All test files in `/tests/` directory have **incorrect relative paths**.

### Pattern: `../../src/...` should be `../src/...`

#### Issue 6.1: `/tests/customFieldController.test.js`
- **Import:** `import ... from '../../src/api/controllers/customFieldController.js'`
- **Should be:** `import ... from '../src/api/controllers/customFieldController.js'`

#### Issue 6.2: `/tests/projectController.test.js`  
- **Import:** `import ... from '../../src/api/controllers/projectController.js'`
- **Should be:** `import ... from '../src/api/controllers/projectController.js'`

#### Issue 6.3: `/tests/taskController.test.js`
- **Import:** `import ... from '../../src/api/controllers/taskController.js'`
- **Should be:** `import ... from '../src/api/controllers/taskController.js'`

#### Issue 6.4: `/tests/userController.test.js`
- **Import:** `import ... from '../../src/api/controllers/userController.js'`
- **Should be:** `import ... from '../src/api/controllers/userController.js'`

#### Issue 6.5: `/tests/apiClient.test.js`
- **Import:** `import ... from '../src/components/ui/use-toast.js'`
- **Status:** Path structure seems correct - verify file exists at `/src/components/ui/use-toast.js`

#### Issue 6.6: `/tests/customFieldUtils.test.js`
- **Import:** `import ... from '../src/ai_services/utils/customFieldUtils.js'`
- **Status:** Path structure correct - verify file exists at `/src/ai_services/utils/customFieldUtils.js`

---

## ℹ️ INFORMATIONAL - Documentation Files

These are documentation/guide files and not active code, but should be updated if they're used as reference:

#### `/OLLY_GUIA_VISUAL_CODIGO.js`
- **Import:** `import ... from './App'`
- **Note:** This is a guide file showing configuration

#### `/OLLY_QUICK_START.js`
- **Import:** `import ... from './App'`
- **Note:** This is a quick start guide file

---

## 🎯 Action Plan

### Priority 1: Create Missing Service Files (Do First)
```
/src/api/services/taskService.js
/src/api/services/billing/billingService.js
/src/api/services/modelsService.js
/src/api/services/agentLogService.js
/src/services/emailService.js (or in /src/api/services/)
```

### Priority 2: Fix Olly Service Imports
Update `/src/services/olly/OllySystemIntegration.js`:
- Change `@/lib/db` → `@/db/index.js`
- Change `@/lib/schema` → `@/db/schema.js`

### Priority 3: Create Missing Components & Hooks
```
/src/components/layout/TabBar.jsx
/src/hooks/useProjectSystems.js
/src/components/config/userPlanSettings.js
/src/components/config/featuresList.js
/src/components/icons/PranaIcons.jsx (or consolidate with existing)
```

### Priority 4: Fix Test File Paths
Update all test files in `/tests/`:
- Change `../../src/` to `../src/`
- Verify that files referenced actually exist

---

## 📊 Files Breakdown by Type

### By Category:
- **API Controllers:** 1 file with 3 broken imports
- **Components:** 3 files with 5 broken imports
- **Services/Modules:** 2 files with 3 broken imports
- **Test Files:** 6 files with 8 broken imports
- **Documentation:** 2 files with 2 broken imports

### By Component Type:
- **Service Files (Missing):** 5
- **Component Files (Missing):** 2
- **Configuration Files (Missing):** 2
- **Custom Hooks (Missing):** 1
- **Path Issues (Incorrect paths):** 2
- **Test File Paths (Wrong directory structure):** 6

---

## 🔧 Quick Reference Commands

Check if specific files exist:
```bash
# Check for existing database files
ls -la /src/db/

# Check for components
find /src/components -name "TabBar*"
find /src/components -name "*Icons*"

# Check for hooks
ls -la /src/hooks/

# Check for services
ls -la /src/api/services/
ls -la /src/services/
```

Rerun analysis after fixes:
```bash
node find-broken-imports.mjs
```

---

## 📝 Notes

1. The `@/` alias resolves to `/src/` based on Vite configuration
2. All paths are relative to workspace root `/workspaces/prana3.0`
3. `.js`, `.jsx`, `.ts`, `.tsx` extensions are automatically resolved
4. This analysis captured 654 files total with 21 broken imports identified

Generated: 2026-02-26
