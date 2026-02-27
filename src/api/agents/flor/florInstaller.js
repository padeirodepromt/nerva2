/* src/api/agents/flor/florInstaller.js
   desc: Flor Installer V1
   role: Garante que o agente Flor existe no catálogo e está contratado no workspace do usuário.
   rule: Installer não habilita Brand Code por projeto. Isso é responsabilidade do System (enable/start).
*/

import { db } from '../../../db/index.js';
import { and, eq } from 'drizzle-orm';

import { agents, userAgents } from '../../../db/schema/agents.js';

const FLOR_KEY = 'flor';

/**
 * Config canônico da Flor.
 * - domains: onde ela atua
 * - guardrails: o que ela faz no chat (propor ações, pedir consent para update)
 * - protocols: brandcode_foundation v1 (as perguntas fixas estão no System routes start payload)
 */
const FLOR_DEFAULT_CONFIG = {
  version: 'v1',
  role: 'Brand & Copy Operator',
  domains: ['brandcode', 'copy', 'content', 'narrative', 'sales', 'positioning', 'voice', 'storybrand'],
  guardrails: {
    consentRequiredForWrites: true,
    proposalFirst: true,
    avoidOverQuestioning: true,
    keepProtocolConsistent: true
  },
  persona: {
    // “tom Prana” (leve, humano, confiante, sensorial)
    vibe: ['leve', 'divertida', 'muito competente', 'sensível', 'direta', 'cool sem esforço'],
    language: {
      informal: true,
      cadence: 'frases mais longas, humanas, com perguntas no fim às vezes',
      punctuation: 'natural',
      signatures: ['saca?', 'entende?', 'faz sentido?']
    }
  },
  systemLinks: {
    brandCodeSystemKey: 'brand_code',
    toolsNamespace: 'flor_'
  }
};

async function ensureFlorAgentExists() {
  const [existing] = await db.select().from(agents).where(eq(agents.key, FLOR_KEY)).limit(1);

  if (existing) {
    // Atualiza config se estiver vazio ou antigo (sem ser agressivo)
    const currentConfig = existing.config || {};
    const mergedConfig = {
      ...FLOR_DEFAULT_CONFIG,
      ...currentConfig,
      // preserva customizações do operador
      persona: { ...(FLOR_DEFAULT_CONFIG.persona || {}), ...(currentConfig.persona || {}) },
      guardrails: { ...(FLOR_DEFAULT_CONFIG.guardrails || {}), ...(currentConfig.guardrails || {}) }
    };

    // Se a tabela agents tiver updatedAt, ok. Se não tiver, remova.
    try {
      await db
        .update(agents)
        .set({
          // name/description podem não existir no schema. Remova se necessário.
          name: existing.name || 'Flor',
          description:
            existing.description ||
            'Operadora de Brand Code: posicionamento, narrativa, voz, vendas e sistemas de conteúdo.',
          config: mergedConfig,
          updatedAt: new Date()
        })
        .where(eq(agents.id, existing.id));
    } catch (e) {
      // fallback: atualiza só config (caso schema não tenha name/description/updatedAt)
      await db
        .update(agents)
        .set({ config: mergedConfig })
        .where(eq(agents.id, existing.id));
    }

    return existing;
  }

  // Cria agente no catálogo
  // Se seu schema não tiver name/description/config/createdAt, remova as chaves extras.
  const insertValues = {
    key: FLOR_KEY,
    name: 'Flor',
    description: 'Operadora de Brand Code: posicionamento, narrativa, voz, vendas e sistemas de conteúdo.',
    config: FLOR_DEFAULT_CONFIG,
    isActive: true,
    createdAt: new Date()
  };

  // Drizzle não tem “insert returning” em todos os setups,
  // então fazemos insert e reselect.
  try {
    await db.insert(agents).values(insertValues);
  } catch (e) {
    // fallback: schema mínimo (key + config)
    await db.insert(agents).values({
      key: FLOR_KEY,
      config: FLOR_DEFAULT_CONFIG
    });
  }

  const [row] = await db.select().from(agents).where(eq(agents.key, FLOR_KEY)).limit(1);
  return row || null;
}

async function ensureUserHasFlor(userId, florAgentId) {
  const [existing] = await db
    .select()
    .from(userAgents)
    .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, florAgentId)))
    .limit(1);

  if (existing) {
    // reativa
    await db
      .update(userAgents)
      .set({ isActive: true, activatedAt: new Date() })
      .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, florAgentId)));
    return true;
  }

  await db.insert(userAgents).values({
    userId,
    agentId: florAgentId,
    isActive: true,
    config: {}
  });

  return true;
}

export async function runFlorInstaller(userId) {
  if (!userId) throw new Error('userId is required');

  const flor = await ensureFlorAgentExists();
  if (!flor?.id) throw new Error('Falha ao garantir Flor no catálogo (agents)');

  await ensureUserHasFlor(userId, flor.id);

  return {
    success: true,
    agentKey: FLOR_KEY,
    agentId: flor.id
  };
}

export default { runFlorInstaller };
