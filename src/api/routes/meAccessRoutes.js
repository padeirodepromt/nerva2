/* src/api/routes/meAccessRoutes.js
   desc: Endpoint canônico para a UI saber o que o usuário PODE fazer (sem vazar feature).
   feat: Inclui inventário real (packs + agentes contratados) vindo do DB.
*/

import express from 'express';
import { attachAccessContext } from '../middleware/attachAccessContext.js';

import { db } from '../../db/index.js';
import { and, eq } from 'drizzle-orm';
import { userFeatures } from '../../db/schema/inventory.js';
import { agents, userAgents } from '../../db/schema/agents.js';

const router = express.Router();

/**
 * GET /api/me/access
 * Retorna capacidades do usuário logado + inventário ativo (packs + agentes).
 * Importante: se não existir acesso, retorna tudo unificado e sem features.
 */
router.get('/access', attachAccessContext(), async (req, res) => {
  const access = req.access;

  if (!access?.exists) {
    return res.status(200).json({
      ok: true,
      exists: false,
      planType: null,

      // capabilities do plano (não vazar nada)
      features: [],
      agents: [],

      // inventário (contratos) vazio
      inventory: { packs: [], agents: [] },

      realms: { enabled: false, mode: 'unified' },
      models: { smart: false },
    });
  }

  const features = Array.from(access.features || []);
  const agentsFromAccess = Array.from(access.agents || []);

  const realmsEnabled = features.includes('CONTEXT_SEPARATION');

  // ✅ Inventário REAL (DB-driven)
  // packs = user_features.isActive
  // agentes contratados = user_agents.isActive + join agents.key
  let packs = [];
  let hiredAgents = [];

  try {
    packs = await db
      .select({
        featureKey: userFeatures.featureKey,
        isActive: userFeatures.isActive,
        updatedAt: userFeatures.updatedAt,
      })
      .from(userFeatures)
      .where(and(eq(userFeatures.userId, access.userId), eq(userFeatures.isActive, true)));

    hiredAgents = await db
      .select({
        key: agents.key,
        name: agents.name,
        category: agents.category,
        source: agents.source,
        activatedAt: userAgents.activatedAt,
        config: userAgents.config,
      })
      .from(userAgents)
      .innerJoin(agents, eq(userAgents.agentId, agents.id))
      .where(and(eq(userAgents.userId, access.userId), eq(userAgents.isActive, true)));
  } catch (e) {
    // não derruba /me/access se DB ainda estiver em transição/migration
    console.warn('[meAccessRoutes] Falha ao carregar inventory:', e?.message || e);
  }

  return res.status(200).json({
    ok: true,
    exists: true,
    userId: access.userId,
    email: access.email,
    planType: access.planType,

    // capabilities do plano (como já estava)
    features,
    agents: agentsFromAccess,

    // ✅ novo: inventário contratual (packs + agentes)
    inventory: {
      packs: packs.map((p) => ({
        featureKey: p.featureKey,
        updatedAt: p.updatedAt,
      })),
      agents: hiredAgents.map((a) => ({
        key: a.key,
        name: a.name,
        category: a.category,
        source: a.source,
        activatedAt: a.activatedAt,
        config: a.config,
      })),
    },

    // conveniência pra UI (evita espalhar strings)
    realms: { enabled: realmsEnabled, mode: realmsEnabled ? 'split' : 'unified' },
    models: { smart: features.includes('SMART_MODELS') },

    // se quiser usar limites na UI (opcional)
    limits: access.limits || {},
  });
});

export default router;
