/* src/api/services/accessControl.js
   desc: Cérebro único de permissões e capacidades do Prana (Modo B).
   rule: UI/APIs/Agentes consultam aqui. Ninguém inventa regra fora daqui.
*/

import { and, eq } from 'drizzle-orm';
import { db } from '../../db/index.js';

import { users, plans } from '../../db/schema/core.js';
import { userFeatures } from '../../db/schema/inventory.js';
import { agents, userAgents } from '../../db/schema/agents.js';

/**
 * Chaves de feature (padronize aqui, não espalhe strings pelo sistema).
 */
export const FEATURES = {
  CONTEXT_SEPARATION: 'CONTEXT_SEPARATION', // separa personal/professional
  MULTI_AGENT: 'MULTI_AGENT',               // habilita multi-agentes em geral
  SMART_MODELS: 'SMART_MODELS',             // pode usar tier SMART
};

/**
 * Cache simples em memória por request/ciclo.
 * (Se tiver multi-instância em produção, substitua por Redis depois.)
 */
const _cache = new Map();
const cacheKey = (userId) => `access:${userId}`;

/**
 * Lê o usuário e seu plano (fonte: users.planType -> plans.key).
 */
async function getUserWithPlan(userId) {
  const [row] = await db
    .select({
      userId: users.id,
      email: users.email,
      planType: users.planType,
      planKey: plans.key,
      planFeatures: plans.features,
      planLimits: plans.limits,
    })
    .from(users)
    .leftJoin(plans, eq(users.planType, plans.key))
    .where(eq(users.id, userId))
    .limit(1);

  return row || null;
}

/**
 * Lê features explícitas (packs/unlocks) no inventory.
 */
async function getActiveUserFeatures(userId) {
  const rows = await db
    .select({ featureKey: userFeatures.featureKey })
    .from(userFeatures)
    .where(and(eq(userFeatures.userId, userId), eq(userFeatures.isActive, true)));

  return new Set(rows.map(r => r.featureKey));
}

/**
 * Lê agentes contratados/ativos.
 */
async function getActiveUserAgents(userId) {
  const rows = await db
    .select({
      agentKey: agents.key,
      agentId: agents.id,
      isActive: userAgents.isActive,
    })
    .from(userAgents)
    .innerJoin(agents, eq(userAgents.agentId, agents.id))
    .where(and(eq(userAgents.userId, userId), eq(userAgents.isActive, true)));

  return new Set(rows.map(r => r.agentKey));
}

/**
 * Normaliza features vindas do plano (plans.features).
 * Espera um JSON com chaves booleanas ou lista.
 * Exemplos aceitos:
 *  - { CONTEXT_SEPARATION: true, MULTI_AGENT: true }
 *  - { features: ['CONTEXT_SEPARATION'] }
 *  - ['CONTEXT_SEPARATION', 'MULTI_AGENT']
 */
function normalizePlanFeatures(planFeatures) {
  const set = new Set();

  if (!planFeatures) return set;

  if (Array.isArray(planFeatures)) {
    for (const k of planFeatures) set.add(String(k));
    return set;
  }

  if (typeof planFeatures === 'object') {
    // caso { features: [...] }
    if (Array.isArray(planFeatures.features)) {
      for (const k of planFeatures.features) set.add(String(k));
    }
    // caso { KEY: true }
    for (const [k, v] of Object.entries(planFeatures)) {
      if (v === true) set.add(String(k));
    }
  }

  return set;
}

/**
 * Calcula o contexto de acesso do usuário.
 */
export async function computeAccessContext(userId) {
  const key = cacheKey(userId);
  if (_cache.has(key)) return _cache.get(key);

  const user = await getUserWithPlan(userId);
  if (!user) {
    const ctx = { userId, exists: false, features: new Set(), agents: new Set() };
    _cache.set(key, ctx);
    return ctx;
  }

  const [featureSet, agentSet] = await Promise.all([
    getActiveUserFeatures(userId),
    getActiveUserAgents(userId),
  ]);

  const planFeatureSet = normalizePlanFeatures(user.planFeatures);

  // regra: plano dá baseline; inventory adiciona; nada remove (exceto se expirar feature)
  const mergedFeatures = new Set([...planFeatureSet, ...featureSet]);

  const ctx = {
    exists: true,
    userId,
    email: user.email,
    planType: user.planType,
    features: mergedFeatures,
    agents: agentSet,
    limits: user.planLimits || {},
  };

  _cache.set(key, ctx);
  return ctx;
}

/**
 * Helpers públicos (o resto do sistema deve usar só isso)
 */
export async function hasFeature(userId, featureKey) {
  const ctx = await computeAccessContext(userId);
  return ctx.exists && ctx.features.has(featureKey);
}

export async function canUseRealms(userId) {
  return hasFeature(userId, FEATURES.CONTEXT_SEPARATION);
}

export async function canUseMultiAgents(userId) {
  return hasFeature(userId, FEATURES.MULTI_AGENT);
}

export async function canUseSmartModels(userId) {
  return hasFeature(userId, FEATURES.SMART_MODELS);
}

/**
 * Contrato de agente: usuário tem esse agente ativo?
 */
export async function hasAgent(userId, agentKey) {
  const ctx = await computeAccessContext(userId);
  return ctx.exists && ctx.agents.has(agentKey);
}
