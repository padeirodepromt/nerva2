import express from 'express';
import { authenticate } from '../authMiddleware.js';
import { attachAccessContext } from '../middleware/attachAccessContext.js';

import { AgentRegistryService } from '../services/agentRegistryService.js';
import { NeoRefactorService } from '../agents/neo/neoRefactorService.js';
import { AgentLogService } from '../agents/general/services/agentLogService.js';
import { ProvisioningService } from '../agents/general/services/provisioningService.js';
import { AgentEventService } from '../services/agentEventService.js'; // INJETADO O SSE

import { db } from '../../db/index.js';
import { and, eq } from 'drizzle-orm';
import { userFeatures } from '../../db/schema/inventory.js';
import { agents, userAgents } from '../../db/schema/agents.js';

const router = express.Router();

/**
 * Ordem correta:
 * 1) autentica
 * 2) resolve permissões/capacidades
 */
router.use(authenticate);
router.use(attachAccessContext());
// 🎧 [NOVO] Rota SSE - Frontend chama isso ao montar o chat
router.get('/events', AgentEventService.subscribe);

/**
 * 👤 ME / INVENTORY
 * Retorna o inventário ativo do usuário:
 * - Packs (user_features)
 * - Agentes contratados/ativos (user_agents + agents)
 */
router.get('/me/inventory', async (req, res) => {
  try {
    const userId = req.user.id;

    // Packs ativos
    const features = await db
      .select()
      .from(userFeatures)
      .where(and(eq(userFeatures.userId, userId), eq(userFeatures.isActive, true)));

    // Agentes ativos (join catálogo)
    const hiredAgents = await db
      .select({
        agentId: userAgents.agentId,
        isActive: userAgents.isActive,
        activatedAt: userAgents.activatedAt,
        config: userAgents.config,
        key: agents.key,
        name: agents.name,
        description: agents.description,
        category: agents.category,
        source: agents.source,
        uiMetadata: agents.uiMetadata,
        capabilities: agents.capabilities,
        isPublic: agents.isPublic,
      })
      .from(userAgents)
      .innerJoin(agents, eq(userAgents.agentId, agents.id))
      .where(and(eq(userAgents.userId, userId), eq(userAgents.isActive, true)));

    res.json({
      success: true,
      inventory: {
        packs: features.map((f) => ({
          featureKey: f.featureKey,
          isActive: f.isActive,
          updatedAt: f.updatedAt,
        })),
        agents: hiredAgents.map((a) => ({
          agentId: a.agentId,
          key: a.key,
          name: a.name,
          description: a.description,
          category: a.category,
          source: a.source,
          isPublic: a.isPublic,
          isActive: a.isActive,
          activatedAt: a.activatedAt,
          config: a.config,
          uiMetadata: a.uiMetadata,
          capabilities: a.capabilities,
        })),
      },
    });
  } catch (error) {
    console.error('me/inventory error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🔍 RESOLVE VIEW
 */
router.post('/resolve-view', async (req, res) => {
  try {
    const { dataType, metadata } = req.body;
    const userId = req.user.id;

    const match = await AgentRegistryService.resolveAgentForData(userId, dataType, metadata);
    res.json({ success: true, match });
  } catch (error) {
    console.error('resolve-view error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🤝 HIRE
 */
router.post('/hire', async (req, res) => {
  try {
    const { agentKey } = req.body;
    const userId = req.user.id;

    const agent = await AgentRegistryService.hireAgent(userId, agentKey);
    res.json({ success: true, agent });
  } catch (error) {
    console.error('hire agent error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🚀 PROVISIONING: ativa produto (packs/agentes)
 */
router.post('/provision/activate', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, options = {} } = req.body || {};

    if (!productId) {
      return res.status(400).json({ success: false, error: 'productId é obrigatório' });
    }

    const result = await ProvisioningService.activate(userId, productId, options);
    res.json({ success: true, result });
  } catch (error) {
    console.error('provision activate error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🧯 PROVISIONING: desativa pack
 */
router.post('/provision/deactivate', async (req, res) => {
  try {
    const userId = req.user.id;
    const { featureKey } = req.body || {};

    if (!featureKey) {
      return res.status(400).json({ success: false, error: 'featureKey é obrigatório' });
    }

    const ok = await ProvisioningService.deactivateFeature(userId, featureKey);
    res.json({ success: true, ok });
  } catch (error) {
    console.error('provision deactivate error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 🦾 NEO APPLY
 */
router.post('/neo/apply-refactor', async (req, res) => {
  try {
    const { logId, filePath, proposedCode } = req.body;
    const userId = req.user.id;

    const result = await NeoRefactorService.apply(userId, logId, filePath, proposedCode);
    res.json(result);
  } catch (error) {
    console.error('neo apply error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * 📡 LOGS
 */
router.get('/logs', async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 30;

    const logs = await AgentLogService.getRecentLogs(userId, limit);
    res.json({ success: true, logs });
  } catch (error) {
    console.error('agent logs error', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
