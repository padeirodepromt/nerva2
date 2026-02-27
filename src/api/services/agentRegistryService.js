/* src/api/services/agentRegistryService.js
   desc: Registry do Catálogo de Agentes (configs -> DB) + resolver + hiring + forging
   note:
     - Node ESM safe import (file://)
     - Boot-safe: pasta pode não existir
     - Conflict-safe: requer UNIQUE em agents.key
   fixes:
     - source enum compatível: SYSTEM_BUNDLE | ASH_FORGED
     - category enum compatível: productivity | specialist | business | custom
     - unhireAgent: remove updatedAt (não existe em user_agents)
*/

import fs from 'fs/promises';
import path from 'path';
import { pathToFileURL } from 'url';

import { db } from '../../db/index.js';
import { agents, userAgents } from '../../db/schema/agents.js';
import { eq, and } from 'drizzle-orm';

const CONFIG_DIR = path.join(process.cwd(), 'src/api/agents/configs');

async function safeReadDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
    return await fs.readdir(dir);
  } catch (e) {
    console.error('[AgentRegistry] Falha ao ler configDir:', e?.message || e);
    return [];
  }
}

async function safeImportConfig(absFilePath) {
  try {
    // ESM-safe dynamic import
    const url = pathToFileURL(absFilePath).href;
    const mod = await import(url);
    return mod?.default || null;
  } catch (e) {
    console.error(`[AgentRegistry] Falha importando config: ${absFilePath}`, e?.message || e);
    return null;
  }
}

function normalizeSource(source) {
  const s = String(source || '').trim().toUpperCase();

  // compat aliases
  if (s === 'SYSTEM') return 'SYSTEM_BUNDLE';
  if (s === 'SYSTEM_BUNDLE') return 'SYSTEM_BUNDLE';
  if (s === 'ASH_FORGED') return 'ASH_FORGED';

  // default seguro para configs do bundle
  return 'SYSTEM_BUNDLE';
}

function normalizeCategory(category) {
  const c = String(category || '').trim().toLowerCase();
  const allowed = new Set(['productivity', 'specialist', 'business', 'custom']);

  // compat aliases
  if (c === 'brand') return 'specialist';
  if (c === 'lifestyle') return 'specialist';

  return allowed.has(c) ? c : 'specialist';
}

function normalizeConfig(agentConfig) {
  if (!agentConfig || typeof agentConfig !== 'object') return null;

  const normalized = {
    // Campos mínimos esperados pelo schema
    id: agentConfig.id, // opcional (schema tem default createId('agt'))
    key: String(agentConfig.key || '').trim().toLowerCase(),
    name: agentConfig.name,
    systemPrompt: agentConfig.systemPrompt,
    description: agentConfig.description ?? null,

    // No seu schema, capabilities é jsonb default []
    // Você usa array no Flor: perfeito.
    capabilities: agentConfig.capabilities ?? [],

    category: normalizeCategory(agentConfig.category),
    source: normalizeSource(agentConfig.source),
    uiMetadata: agentConfig.uiMetadata ?? {},

    // no schema agents.isPublic default false
    isPublic: typeof agentConfig.isPublic === 'boolean' ? agentConfig.isPublic : false,

    // timestamps (ok setar, mas não é necessário; schema tem defaultNow)
    createdAt: agentConfig.createdAt ?? new Date(),
    updatedAt: new Date(),
  };

  if (!normalized.key || !normalized.name) return null;

  // systemPrompt é notNull no schema
  if (!normalized.systemPrompt) normalized.systemPrompt = '';

  if (!Array.isArray(normalized.capabilities)) normalized.capabilities = [];
  if (typeof normalized.uiMetadata !== 'object' || normalized.uiMetadata === null) normalized.uiMetadata = {};

  return normalized;
}

export const AgentRegistryService = {
  /**
   * 🧱 BOOTSTRAP: Sincroniza configs (src/api/agents/configs/*.js) com o DB.
   * Chamado no boot do servidor.
   *
   * Requisito: agents.key deve ser UNIQUE/INDEX UNIQUE para onConflictDoUpdate funcionar.
   */
  async syncConfigs() {
    console.log('🧱 [AgentRegistry] Sincronizando Catálogo de Agentes...');

    const files = await safeReadDir(CONFIG_DIR);
    const jsFiles = files.filter((f) => f.endsWith('.js') || f.endsWith('.mjs'));

    if (jsFiles.length === 0) {
      console.log('ℹ️ [AgentRegistry] Nenhum config encontrado em', CONFIG_DIR);
      return { success: true, count: 0 };
    }

    let upserted = 0;

    for (const file of jsFiles) {
      const abs = path.join(CONFIG_DIR, file);
      const rawConfig = await safeImportConfig(abs);
      const agentConfig = normalizeConfig(rawConfig);

      if (!agentConfig) {
        console.warn(`⚠️ [AgentRegistry] Config inválido ignorado: ${file}`);
        continue;
      }

      try {
        await db
          .insert(agents)
          .values(agentConfig)
          .onConflictDoUpdate({
            target: agents.key,
            set: {
              name: agentConfig.name,
              systemPrompt: agentConfig.systemPrompt,
              capabilities: agentConfig.capabilities,
              uiMetadata: agentConfig.uiMetadata,
              description: agentConfig.description,
              category: agentConfig.category,
              source: agentConfig.source,
              isPublic: agentConfig.isPublic,
              updatedAt: new Date(),
            },
          });

        upserted += 1;
        console.log(`✅ [AgentRegistry] Agente configurado: ${agentConfig.name} (${agentConfig.key})`);
      } catch (e) {
        console.error(
          `❌ [AgentRegistry] Falha upsert do agente ${agentConfig.key} (verifique UNIQUE em agents.key):`,
          e?.message || e
        );
      }
    }

    return { success: true, count: upserted };
  },

  /**
   * 🔍 RESOLVER: Encontra o agente ideal para um tipo de dado (heurística para UI).
   * Retorna um objeto { agent, userConfig } ou null.
   */
  async resolveAgentForData(userId, dataType, metadata = {}) {
    const activeAgents = await db
      .select({
        agent: agents,
        userConfig: userAgents.config,
      })
      .from(userAgents)
      .innerJoin(agents, eq(userAgents.agentId, agents.id))
      .where(and(eq(userAgents.userId, userId), eq(userAgents.isActive, true)));

    const matchingAgent = activeAgents.find(({ agent }) => {
      // Regra 1: Código -> Neo
      if (dataType === 'task' && metadata.type === 'code' && agent.key === 'neo_dev') return true;

      // Regra 2: Receita / lifestyle (mantida, mas sem depender de category inválida)
      // (Se você quiser, podemos trocar isso por capability tag no futuro)
      if (metadata.isRecipe && agent.key === 'monja') return true;

      // Regra 3: Forjados pelo Ash
      if (agent.source === 'ASH_FORGED' && agent.uiMetadata?.trigger === dataType) return true;

      // ✅ Regra 4: BrandCode/System -> Flor (se estiver ativa)
      const isBrandCodeContext =
        dataType === 'brandcode' ||
        dataType === 'system' ||
        metadata?.kind === 'system' ||
        metadata?.kind === 'brandcode' ||
        metadata?.context === 'brandcode';

      const systemKey =
        metadata?.systemKey || metadata?.system || metadata?.system_key || metadata?.moduleKey || null;

      if (isBrandCodeContext && (systemKey === 'brand_code' || dataType === 'brandcode') && agent.key === 'flor') {
        return true;
      }

      return false;
    });

    return matchingAgent || null;
  },

  /**
   * 🛠️ CAPABILITIES: Verifica permissões.
   */
  async canAgentExecute(agentId, capability) {
    const [agent] = await db.select().from(agents).where(eq(agents.id, agentId)).limit(1);
    if (!agent) return false;

    const caps = agent.capabilities || [];
    return Array.isArray(caps) ? caps.includes(capability) : false;
  },

  /**
   * 🤝 HIRE: Ativa um especialista para o usuário.
   * Nota: user_agents não tem id. PK é (userId, agentId).
   */
  async hireAgent(userId, agentKey) {
    const key = String(agentKey || '').trim().toLowerCase();
    const [agent] = await db.select().from(agents).where(eq(agents.key, key)).limit(1);
    if (!agent) throw new Error('Especialista não encontrado no catálogo.');

    const [existing] = await db
      .select()
      .from(userAgents)
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agent.id)))
      .limit(1);

    if (existing) {
      await db
        .update(userAgents)
        .set({
          isActive: true,
          activatedAt: new Date(),
        })
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
   * 🧊 UNHIRE: Desativa um agente do usuário (mantém registro).
   * FIX: user_agents não tem updatedAt
   */
  async unhireAgent(userId, agentKey) {
    const key = String(agentKey || '').trim().toLowerCase();
    const [agent] = await db.select().from(agents).where(eq(agents.key, key)).limit(1);
    if (!agent) return { success: false, error: 'Agente não encontrado.' };

    await db
      .update(userAgents)
      .set({ isActive: false })
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, agent.id)));

    return { success: true };
  },

  /**
   * 🏗️ FORGE: O Ash cria um agente customizado.
   */
  async forgeAgent(userId, agentData) {
    if (!agentData?.name) throw new Error('agentData.name é obrigatório');

    const inserted = await db
      .insert(agents)
      .values({
        key: `custom_${Date.now()}`,
        source: 'ASH_FORGED',
        name: agentData.name,
        systemPrompt: agentData.prompt || '',
        capabilities: Array.isArray(agentData.capabilities) ? agentData.capabilities : [],
        category: normalizeCategory(agentData.category || 'custom'),
        isPublic: false,
        uiMetadata: agentData.uiMetadata || {},
        description: agentData.description || null,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({ id: agents.id });

    const agentId = inserted?.[0]?.id;
    if (!agentId) throw new Error('Falha ao criar agente.');

    await db.insert(userAgents).values({
      userId,
      agentId,
      isActive: true,
      config: {},
    });

    return agentId;
  },
};

export default AgentRegistryService;
