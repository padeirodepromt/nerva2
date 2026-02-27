/* src/api/agents/general/services/provisioningService.js
   desc: Provisionamento modular (Agentes + Packs) via inventário/contratos.
   rule: Packs -> user_features. Agents -> user_agents. Nada de userSettings/userPacks.

   policy (hard rules):
   - PACK_NEO_PRO exige contratação do agente NEO (neo_dev).
   - Ao ativar PACK_NEO_PRO: faz (1) hire NEO, depois (2) ativa pack.
   - AGENT_G não existe mais (removido).
*/

import { db } from '../../../../db/index.js';
import { and, eq } from 'drizzle-orm';

import { userFeatures } from '../../../../db/schema/inventory.js';
import { agents, userAgents } from '../../../../db/schema/agents.js';

// SSE bus
import { AgentEventService } from '../../../services/agentEventService.js';

// ✅ Installer da Flor
import { runFlorInstaller } from '../../flor/florInstaller.js';

const safeNotify = (userId, message, payload = {}) => {
  try {
    if (AgentEventService && typeof AgentEventService.emitNotification === 'function') {
      AgentEventService.emitNotification(userId, message, payload);
    }
  } catch (e) {
    console.warn('[Provisioning] emitNotification falhou:', e?.message || e);
  }
};

const normalizeAgentKey = (k) => {
  const key = String(k || '').trim().toLowerCase();
  if (key === 'neo') return 'neo_dev';
  return key;
};

export const ProvisioningService = {
  /**
   * 🚀 ATIVAÇÃO: ponto único de entrada para liberar recursos comprados/ativados.
   * productId pode ser:
   * - Packs: 'PACK_ORACLE' | 'PACK_SOCRATIC' | 'PACK_NEO_PRO' | ...
   * - Agents: 'AGENT_NEO' | 'AGENT_FLOR' | 'AGENT_ASH' | ...
   */
  async activate(userId, productId, options = {}) {
    if (!userId) throw new Error('userId é obrigatório');
    if (!productId) throw new Error('productId é obrigatório');

    console.log(`[Provisioning] Ativando ${productId} para user=${userId}`);

        // ---------------------------
    // (A) PACKS (features Lego)
    // ---------------------------
    if (productId.startsWith('PACK_')) {
      // 🔒 Hard rule (shop/contrato): PACK_NEO_PRO só pode ser ativado
      // se o usuário JÁ contratou o agente NEO (neo_dev).
      if (productId === 'PACK_NEO_PRO') {
        const neoKey = 'neo_dev';

        // verifica se o usuário já tem contrato ativo com NEO
        const [neoAgent] = await db.select().from(agents).where(eq(agents.key, neoKey)).limit(1);
        if (!neoAgent) {
          throw new Error('Catálogo inconsistente: agente NEO (neo_dev) não encontrado.');
        }

        const [neoContract] = await db
          .select()
          .from(userAgents)
          .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, neoAgent.id), eq(userAgents.isActive, true)))
          .limit(1);

        if (!neoContract) {
          // Não força contratação. Isso é regra do shop.
          throw new Error('PACK_NEO_PRO exige contratação prévia do agente NEO (AGENT_NEO).');
        }

        await this.activateFeature(userId, productId);

        safeNotify(userId, `${productId} ativado com sucesso!`, {
          productId,
          kind: 'pack',
          prerequisite: 'AGENT_NEO',
        });

        return { success: true, kind: 'pack', productId, prerequisite: 'AGENT_NEO' };
      }

      // outros packs não têm pré-requisito hard aqui
      await this.activateFeature(userId, productId);
      safeNotify(userId, `${productId} ativado com sucesso!`, { productId, kind: 'pack' });
      return { success: true, kind: 'pack', productId };
    }

    // ---------------------------
    // (B) AGENTES (contratos)
    // ---------------------------
    if (productId.startsWith('AGENT_')) {
      const agentKey = this._mapProductToAgentKey(productId);
      const agent = await this.hireAgentByKey(userId, agentKey);

      // Hooks de Instalação (setup inicial do workspace do agente)
      if (agentKey === 'neo_dev' && options.runInstaller) {
        await this.installNeoAgent(userId);
      }

      if (agentKey === 'flor' && options.runInstaller) {
        await this.installFlorAgent(userId);
      }

      safeNotify(userId, `${productId} ativado com sucesso!`, { productId, kind: 'agent', agentKey });
      return { success: true, kind: 'agent', productId, agentKey, agent };
    }

    throw new Error(`Produto não reconhecido: ${productId}`);
  },

  /**
   * ✅ Ativa/reativa uma feature em user_features
   */
  async activateFeature(userId, featureKey) {
    const [existing] = await db
      .select()
      .from(userFeatures)
      .where(and(eq(userFeatures.userId, userId), eq(userFeatures.featureKey, featureKey)))
      .limit(1);

    if (existing) {
      await db
        .update(userFeatures)
        .set({ isActive: true, updatedAt: new Date() })
        .where(and(eq(userFeatures.userId, userId), eq(userFeatures.featureKey, featureKey)));
    } else {
      const id = `${userId}:${featureKey}`;
      await db.insert(userFeatures).values({
        id,
        userId,
        featureKey,
        isActive: true,
      });
    }

    return true;
  },

  /**
   * ❌ Desativa uma feature
   */
  async deactivateFeature(userId, featureKey) {
    await db
      .update(userFeatures)
      .set({ isActive: false, updatedAt: new Date() })
      .where(and(eq(userFeatures.userId, userId), eq(userFeatures.featureKey, featureKey)));

    safeNotify(userId, `${featureKey} desativado.`, { featureKey, kind: 'pack' });
    return true;
  },

  /**
   * 🤝 Contrata/ativa um agente por key usando as tabelas agents + user_agents
   */
  async hireAgentByKey(userId, agentKey) {
    const key = normalizeAgentKey(agentKey);

    const [agent] = await db.select().from(agents).where(eq(agents.key, key)).limit(1);
    if (!agent) throw new Error(`Agente não encontrado no catálogo: ${key}`);

    const [existing] = await db
      .select()
      .from(userAgents)
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agent.id)))
      .limit(1);

    if (existing) {
      await db
        .update(userAgents)
        .set({ isActive: true, activatedAt: new Date() })
        .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agent.id)));
    } else {
      await db.insert(userAgents).values({
        userId,
        agentId: agent.id,
        isActive: true,
        config: {},
      });
    }

    return agent;
  },

  /**
   * 🧭 Mapeia productId comercial -> agent.key interno
   * Mantém aliases legados (exceto AGENT_G removido).
   */
  _mapProductToAgentKey(productId) {
    const pid = String(productId || '').trim().toUpperCase();

    // Neo (dedupe total)
    if (pid === 'AGENT_NEO' || pid === 'AGENT_NEO_DEV' || pid === 'AGENT_NEODEV') return 'neo_dev';

    // Flor (sem aliases legados)
    if (pid === 'AGENT_FLOR') return 'flor';

    // Outros
    if (pid === 'AGENT_ASH') return 'ash';
    if (pid === 'AGENT_OLLY') return 'olly';

    // fallback
    return pid.replace('AGENT_', '').toLowerCase();
  },

  /**
   * 🛠️ Instalação do Neo
   * (Deixe o conteúdo real depois, aqui só placeholder seguro)
   */
  async installNeoAgent(userId) {
    console.log(`[Provisioning] 🛠️ Rodando script de instalação do Neo para user=${userId}...`);
    return true;
  },

  /**
   * 🌸 Instalação da Flor (Brand/Copy System bootstrap)
   */
  async installFlorAgent(userId) {
    console.log(`[Provisioning] 🌸 Inicializando Flor para user=${userId}...`);
    await runFlorInstaller(userId);
    return true;
  },
};

export default ProvisioningService;
