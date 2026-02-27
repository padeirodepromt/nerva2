import { db } from '../db/index.js';
import * as schema from '../db/schema/finance.js';
import * as core from '../db/schema/core.js';
import { selectBestModel } from '../ai_services/models.js'; // fallback
let cache = { ts: 0, data: null };
const CACHE_TTL = 30 * 1000; // 30s

const mapComplexity = (complexity) => {
  if (!complexity) return 'STANDARD';
  return complexity === 'HIGH' ? 'COMPLEX' : 'STANDARD';
};

export const getModelForPlan = async (planKey, taskComplexity = 'LOW') => {
  const now = Date.now();
  if (cache.data && (now - cache.ts) < CACHE_TTL) return cache.dataResolver(planKey, taskComplexity);

  const [modelsRows, overridesRows] = await Promise.all([
    db.select().from(schema.aiModels).where(schema.aiModels.active.eq(true)).orderBy(schema.aiModels.priority),
    db.select().from(schema.planModelOverrides)
  ]);

  const models = modelsRows;
  const overrides = overridesRows.reduce((acc, o) => { acc[o.plan_key] = o; return acc; }, {});

  const dataResolver = async (pk, complexity) => {
    // plan-specific override
    const ov = overrides[pk];
    if (ov) {
      const m = models.find(md => md.id === ov.ai_model_id && md.active);
      if (m) return { provider: m.provider, model: m.model_identifier, modelId: m.id, meta: m.meta, source: 'override' };
    }

    // Look up plan row to get aiTier if present
    let planRow = null;
    try {
      const [p] = await db.select().from(core.plans).where(core.plans.key.equals(pk)).limit(1);
      planRow = p;
    } catch (e) {
      // ignore
    }

    const wantedTier = (planRow && planRow.limits && planRow.limits.aiTier) ? planRow.limits.aiTier : (complexity === 'HIGH' ? 'SMART' : 'FAST');

    let candidate = models.find(m => m.tier === wantedTier);
    if (!candidate) candidate = models[0];
    if (candidate) return { provider: candidate.provider, model: candidate.model_identifier, modelId: candidate.id, meta: candidate.meta, source: 'catalog' };

    // Fallback to code-based router
    const fallback = selectBestModel(wantedTier, mapComplexity(taskComplexity), { google: true, openai: true });
    return { provider: fallback.provider === 'google' ? 'google' : 'openai', model: fallback.id, modelId: null, meta: {}, source: 'fallback-code' };
  };

  cache = { ts: now, data: { models, overrides, dataResolver }, dataResolver };
  return cache.dataResolver(planKey, taskComplexity);
};

export const invalidateCache = () => { cache = { ts: 0, data: null }; };
