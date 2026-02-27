import express from 'express';
import { db } from '../../db/index.js';
import * as schemaCore from '../../db/schema/core.js';
import * as schemaFinance from '../../db/schema/finance.js';
const router = express.Router();

const ensureAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') return res.status(403).send({ error: 'forbidden' });
  next();
};

router.use(ensureAdmin);

router.get('/plans', async (req, res) => {
  const plans = await db.select().from(schemaCore.plans).orderBy(schemaCore.plans.createdAt.desc());
  res.json(plans);
});

router.get('/plans/:key', async (req, res) => {
  const [p] = await db.select().from(schemaCore.plans).where(schemaCore.plans.key.equals(req.params.key)).limit(1);
  if (!p) return res.status(404).json({ error: 'not_found' });
  res.json(p);
});

router.put('/plans/:key', async (req, res) => {
  const payload = req.body;
  const key = req.params.key;
  await db.update(schemaCore.plans).set({
    name: payload.name,
    subtitle: payload.subtitle,
    description: payload.description,
    monthlyPrice: payload.monthlyPrice,
    yearlyPrice: payload.yearlyPrice,
    isOneTime: !!payload.isOneTime,
    limits: payload.limits,
    features: payload.features,
    identity: payload.identity,
    cta: payload.cta,
    updatedAt: new Date()
  }).where(schemaCore.plans.key.equals(key));
  const [updated] = await db.select().from(schemaCore.plans).where(schemaCore.plans.key.equals(key)).limit(1);
  res.json(updated);
});

router.post('/plans', async (req, res) => {
  const payload = req.body;
  await db.insert(schemaCore.plans).values({
    key: payload.key,
    name: payload.name,
    subtitle: payload.subtitle,
    description: payload.description,
    monthlyPrice: payload.monthlyPrice || 0,
    yearlyPrice: payload.yearlyPrice || 0,
    isOneTime: !!payload.isOneTime,
    limits: payload.limits || {},
    features: payload.features || [],
    identity: payload.identity || {},
    cta: payload.cta || 'Selecionar'
  });
  const [created] = await db.select().from(schemaCore.plans).where(schemaCore.plans.key.equals(payload.key)).limit(1);
  res.json(created);
});

// AI models management
router.get('/ai-models', async (req, res) => {
  const models = await db.select().from(schemaFinance.aiModels).orderBy(schemaFinance.aiModels.priority.asc());
  res.json(models);
});

router.post('/ai-models', async (req, res) => {
  const p = req.body;
  await db.insert(schemaFinance.aiModels).values({
    provider: p.provider,
    model_identifier: p.model_identifier,
    tier: p.tier,
    alias: p.alias,
    active: !!p.active,
    priority: p.priority || 10,
    meta: p.meta || {}
  });
  const [m] = await db.select().from(schemaFinance.aiModels).where(schemaFinance.aiModels.model_identifier.equals(p.model_identifier)).limit(1);
  res.json(m);
});

router.put('/ai-models/:id', async (req, res) => {
  const id = req.params.id;
  const payload = req.body;
  await db.update(schemaFinance.aiModels).set({
    provider: payload.provider,
    model_identifier: payload.model_identifier,
    tier: payload.tier,
    alias: payload.alias,
    active: !!payload.active,
    priority: payload.priority || 10,
    meta: payload.meta || {}
  }).where(schemaFinance.aiModels.id.equals(id));
  const [m] = await db.select().from(schemaFinance.aiModels).where(schemaFinance.aiModels.id.equals(id)).limit(1);
  res.json(m);
});

// Plan model overrides
router.get('/plan-overrides', async (req, res) => {
  const rows = await db.select().from(schemaFinance.planModelOverrides);
  res.json(rows);
});

router.post('/plan-overrides', async (req, res) => {
  const p = req.body;
  await db.insert(schemaFinance.planModelOverrides).values({ plan_key: p.planKey, ai_model_id: p.aiModelId });
  const rows = await db.select().from(schemaFinance.planModelOverrides).where(schemaFinance.planModelOverrides.plan_key.equals(p.planKey));
  res.json(rows);
});

export default router;
