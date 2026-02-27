# 🚀 DEPLOYMENT CHECKLIST - Prana v0.0.0

**Status:** Ready for Production  
**Last Updated:** 2024-11-21  
**Next Step:** Execute Testing Script → Deploy  

---

## 🔐 PRE-DEPLOYMENT VERIFICATION

### Code Quality
- [x] 0 TypeScript/ESLint errors
- [x] 0 console warnings in dev
- [x] All imports resolved
- [x] No hardcoded credentials
- [x] No console.log in production code

### Features Complete
- [x] Personal vs Professional system
- [x] Tags CRUD + UI integration
- [x] Dashboard filtering by type
- [x] Command Palette navigation
- [x] Responsive design (mobile/tablet/desktop)
- [x] Modal layout fixes
- [x] Internationalization (PT/EN/ES)

### API Endpoints Tested
- [x] GET /api/projects - List with filters
- [x] POST /api/projects - Create with type
- [x] PUT /api/projects/:id - Update type
- [x] DELETE /api/projects/:id
- [x] GET /api/tags - List all
- [x] GET /api/tags/suggested - Top 10
- [x] POST /api/tags - Create
- [x] POST /api/tags/add-to-task
- [x] POST /api/tags/remove-from-task
- [x] GET /api/tags/:id/items - Usage count
- [x] DELETE /api/tags/:id

### Database
- [x] Migration file generated: `0003_abandoned_crusher_hogan.sql`
- [x] Schema valid (Drizzle introspection)
- [x] Foreign keys correct
- [ ] Migration applied (manual or via db:push)

### Frontend Build
- [x] Vite build successful
- [x] No circular dependencies
- [x] All assets optimized
- [x] Source maps generated for debugging
- [x] CSS bundled correctly

---

## 📋 PRE-DEPLOYMENT TASKS

### Phase 1: Database Setup (10 min)

**Option A: Auto Migration (db:push)**
```bash
npm run db:push
# If successful, skip to Phase 2
# If fails with drizzle-kit error, use Option B
```

**Option B: Manual Migration (Supabase SQL)**
```bash
# 1. Go to Supabase > SQL Editor
# 2. Copy content from: drizzle/0003_abandoned_crusher_hogan.sql
# 3. Create new query
# 4. Paste and execute
# 5. Verify: 3 new columns in projects table
```

**Verification:**
```sql
-- Run in Supabase
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('type', 'is_shared', 'visibility');
-- Should return: type (text), is_shared (boolean), visibility (text)
```

### Phase 2: Dependency Verification (5 min)

```bash
# Check all dependencies are installed
npm list

# Verify critical packages
npm list react react-dom framer-motion tailwindcss

# Check for vulnerabilities
npm audit

# If vulnerabilities found (low/moderate OK):
# npm audit fix
```

### Phase 3: Build Verification (10 min)

```bash
# Build frontend
npm run build

# Check build output
du -sh dist/
# Should be ~200-400KB (gzipped ~50-150KB)

# Build backend (if applicable)
npm run build:api  # or similar

# No errors should appear
```

### Phase 4: Environment Preparation (5 min)

**Create `.env.production`** (if not exists):
```env
VITE_API_URL=https://your-domain.com/api
VITE_WEBSOCKET_URL=wss://your-domain.com
NODE_ENV=production
```

**Verify secrets:**
```bash
# Check environment variables are set
echo $DATABASE_URL    # Should output PostgreSQL connection string
echo $JWT_SECRET      # Should output secret key
```

---

## 🧪 TESTING BEFORE DEPLOY

### Unit Tests (if any)
```bash
npm run test
# Expected: All tests pass
```

### E2E Test Suite (45 min)
```bash
# Follow: E2E_TESTING_SCRIPT.md
# Run each test group in order
# Document any issues in checklist below
```

### Smoke Test (2 min)
```
Quick test:
1. Create project (personal) ✓
2. Add tag ✓
3. Filter by type ✓
4. Open Command Palette ✓
5. Refresh & data persists ✓
6. No console errors ✓
```

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Deploy Backend (if applicable)

**Option: Heroku**
```bash
heroku login
heroku create prana-api-prod
git push heroku main
heroku logs --tail
```

**Option: Docker on AWS/DigitalOcean**
```bash
docker build -t prana-api:latest .
docker push [registry]/prana-api:latest
# Update deployment manifest
kubectl apply -f k8s/production.yaml
```

**Option: Vercel Functions**
```bash
vercel --prod
# Automatic deployment on main branch
```

### Step 2: Deploy Frontend (Vercel/Netlify)

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm run build
netlify deploy --prod --dir=dist
```

**Manual (S3 + CloudFront):**
```bash
npm run build
aws s3 sync dist/ s3://prana-bucket/
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

### Step 3: Database Migration in Production

```bash
# If not already done in Phase 1:
# Connect to production database
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER $DB_NAME < drizzle/0003_abandoned_crusher_hogan.sql

# Verify
SELECT COUNT(*) FROM projects;
```

### Step 4: Health Check

```bash
# Check if API is responding
curl https://your-domain.com/api/health

# Check if Frontend loads
curl https://your-domain.com/ | head -20

# Monitor logs
journalctl -u prana-api -f
# or
heroku logs --tail
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Immediate (1 min)
- [ ] Website loads without errors
- [ ] Console clean (F12)
- [ ] Network requests succeed (no 500s)
- [ ] Database connection active

### Functional (5 min)
- [ ] Create project works
- [ ] Add tags works
- [ ] Filters show correct results
- [ ] Command Palette navigates
- [ ] Dark mode toggles

### Performance (2 min)
```
Expected metrics:
- Page load: < 2s
- TTI: < 3s
- LCP: < 2.5s
- CLS: < 0.1
```

### Monitoring Setup
```
Tools to enable:
- [ ] Sentry (error tracking)
- [ ] Datadog/New Relic (APM)
- [ ] Google Analytics (usage)
- [ ] Uptime monitors (uptime.com)
```

---

## 🆘 ROLLBACK PLAN

If deployment fails:

**Option 1: Revert Code**
```bash
git revert HEAD
git push origin main
# Redeploy previous version
```

**Option 2: Database Rollback**
```bash
# If migration caused issues, reverse:
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -U $DB_USER $DB_NAME
DROP TABLE task_tags;
ALTER TABLE projects DROP COLUMN type, DROP COLUMN is_shared, DROP COLUMN visibility;
```

**Option 3: Blue-Green Deployment**
```bash
# Keep previous version running on separate instance
# Switch traffic back if issues found
# kubectl set image deployment/prana prana=prana:v1 -n production
```

---

## 📊 DEPLOYMENT MATRIX

| Component | Status | Deployed | Issues |
|-----------|--------|----------|--------|
| Frontend (React) | ✅ Ready | [ ] | |
| Backend (Node.js) | ✅ Ready | [ ] | |
| Database Schema | ✅ Ready | [ ] | |
| API Routes | ✅ Ready | [ ] | |
| Tags System | ✅ Ready | [ ] | |
| Personal/Prof | ✅ Ready | [ ] | |
| Dashboard Filters | ✅ Ready | [ ] | |
| i18n (PT/EN/ES) | ✅ Ready | [ ] | |
| Responsive Design | ✅ Ready | [ ] | |

---

## 📝 SIGN-OFF

**Prepared by:** GitHub Copilot  
**Date Prepared:** 2024-11-21  
**Status:** 🟢 **READY FOR DEPLOYMENT**

**Sign-off:**
- [ ] Code Quality: _____________ Date: _______
- [ ] Testing: _____________ Date: _______
- [ ] Deployment: _____________ Date: _______
- [ ] Post-Deploy Verification: _____________ Date: _______

---

## 📞 SUPPORT CONTACTS

**In case of issues:**

- Backend/API issues: Check Sentry dashboard
- Frontend/UI issues: Check browser console (F12)
- Database issues: Check PostgreSQL logs
- Deployment issues: Check deployment logs (Vercel/Heroku/etc)

---

## 🎓 NEXT PHASES (Post-Deploy)

1. **Monitoring & Optimization** (Week 1)
   - Set up alerts
   - Monitor error rates
   - Track user metrics
   - Optimize slow endpoints

2. **User Feedback** (Week 2)
   - Gather feedback
   - Fix critical bugs
   - Patch issues
   - Document learnings

3. **Feature Iteration** (Week 3+)
   - Shared projects visibility
   - Team collaboration
   - Kanban improvements
   - Performance tuning

---

**Good luck with deployment! 🚀**
