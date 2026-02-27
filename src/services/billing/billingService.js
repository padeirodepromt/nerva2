import { db } from '../../db/index.js';
import * as core from '../../db/schema/core.js';
import * as finance from '../../db/schema/finance.js';
import * as system from '../../db/schema/system.js';
import { eq, desc, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { estimateTokens, estimateMessagesTokens } from '../tokenizerService.js';

import { ensureAsaasCustomer, createSubscription } from '../payments/asaasBillingBridge.js';

/**
 * calculateCostCredits: converts tokens + per-call micro-cost into integer credits.
 * costPerTokenMicro and costPerCallMicro are integers representing cost * 1_000_000.
 */
export const calculateCostCredits = (tokens, costPerTokenMicro = 0, costPerCallMicro = 0) => {
  const micro = (tokens * (costPerTokenMicro || 0)) + (costPerCallMicro || 0);
  const credits = Math.ceil(micro / 1_000_000);
  return { credits, micro };
};

/**
 * recordAiUsage: registra uma chamada IA e debita créditos do usuário.
 * - If tokensUsed is null/undefined, attempts to estimate based on details.prompt/details.responseText
 */
export const recordAiUsage = async ({
  userId,
  modelIdentifier = null,
  modelId = null,
  provider = null,
  tokensUsed = null,
  details = {},
}) => {
  try {
    if (!userId) throw new Error('userId é obrigatório');

    // Resolve model meta/cost if available
    let modelRow = null;

    if (modelId) {
      const [m] = await db
        .select()
        .from(finance.aiModels)
        .where(eq(finance.aiModels.id, modelId))
        .limit(1);
      modelRow = m || null;
    } else if (modelIdentifier) {
      const [m] = await db
        .select()
        .from(finance.aiModels)
        .where(eq(finance.aiModels.modelIdentifier, modelIdentifier))
        .limit(1);
      modelRow = m || null;
    }

    const meta = modelRow?.meta || {};
    const costPerTokenMicro = meta.costPerTokenMicro || 0;
    const costPerCallMicro = meta.costPerCallMicro || 0;

    // If tokensUsed not provided, try to estimate using tokenizerService
    let tokens = tokensUsed;

    if (tokens == null) {
      if (details.tokens != null) {
        tokens = details.tokens;
      } else {
        const prompt = details.prompt || details.messages || '';
        const responseText = details.responseText || '';

        if (Array.isArray(prompt)) {
          tokens = await estimateMessagesTokens(prompt, modelRow?.modelIdentifier);
        } else {
          const t1 = await estimateTokens(String(prompt || ''), modelRow?.modelIdentifier);
          const t2 = await estimateTokens(String(responseText || ''), modelRow?.modelIdentifier);
          tokens = t1 + t2;
        }
      }
    }

    tokens = Number.isFinite(tokens) ? tokens : 0;

    const { credits, micro } = calculateCostCredits(tokens, costPerTokenMicro, costPerCallMicro);

    // Use transaction para evitar race condition no saldo
    return await db.transaction(async (tx) => {
      // Insert ai_usage
      const usageInsert = {
        userId,
        aiModelId: modelRow?.id || null,
        provider,
        modelIdentifier: modelRow?.modelIdentifier || modelIdentifier,
        tokensUsed: tokens,
        cost: credits,
        details: { ...details, micro },
      };

      await tx.insert(finance.aiUsage).values(usageInsert);

      if (credits > 0) {
        // Fetch current balance
        const [user] = await tx
          .select()
          .from(core.users)
          .where(eq(core.users.id, userId))
          .limit(1);

        const current = (user && user.credits) || 0;
        const newBalance = current - credits;

        await tx.insert(finance.creditsTransactions).values({
          userId,
          type: 'debit',
          amount: credits,
          balanceAfter: newBalance,
          reference: 'ai_usage',
          meta: { model: modelRow?.modelIdentifier || modelIdentifier, tokensUsed: tokens },
        });

        await tx.update(core.users).set({ credits: newBalance }).where(eq(core.users.id, userId));
      }

      return { ok: true, costCredits: credits, tokens };
    });
  } catch (err) {
    console.error('[billingService] recordAiUsage error', err);
    return { ok: false, error: err.message };
  }
};

export const getUserTransactions = async (userId, limit = 50) => {
  const rows = await db
    .select()
    .from(finance.creditsTransactions)
    .where(eq(finance.creditsTransactions.userId, userId))
    .orderBy(desc(finance.creditsTransactions.createdAt))
    .limit(limit);

  return rows;
};

/* =============================================================================
   SHOP / SYSTEM BILLING (ASAAS) — LEGO MODE
   - Não existe asaasCustomerId local: sempre resolve customer via email.
   - Persiste subscriptionId/customerId no JSON:
     - user_systems.config (pack contratado)
     - project_systems.flags (por projeto habilitado)
============================================================================= */

export const createUserSystemSubscription = async ({
  userId,
  systemKey,
  valueCents,
  billingType = 'PIX',
  cycle = 'MONTHLY',
  description = null,
  externalReference = null,
}) => {
  if (!userId) throw new Error('userId obrigatório');
  if (!systemKey) throw new Error('systemKey obrigatório');
  if (!Number.isFinite(valueCents) || valueCents < 0) throw new Error('valueCents inválido');

  // 1) user + userSystem
  const [user] = await db.select().from(core.users).where(eq(core.users.id, userId)).limit(1);
  if (!user) throw new Error('User not found');

  const [us] = await db
    .select()
    .from(system.userSystems)
    .where(and(eq(system.userSystems.userId, userId), eq(system.userSystems.systemKey, systemKey)))
    .limit(1);

  if (!us) throw new Error(`user_systems não encontrado para ${systemKey} (contrate/instale antes)`);

  // 2) resolve customer no Asaas (stateless)
  const customerId = await ensureAsaasCustomer({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  // 3) cria subscription
  const sub = await createSubscription({
    customerId,
    valueCents,
    cycle,
    billingType,
    description: description || `Assinatura Prana - Pack ${systemKey}`,
    externalReference: externalReference || `user:${userId}:system:${systemKey}`,
  });

  // 4) salva ids no config jsonb
  await db.execute(sql`
    UPDATE user_systems
    SET config =
      jsonb_set(
        jsonb_set(
          COALESCE(config, '{}'::jsonb),
          '{asaasCustomerId}',
          to_jsonb(${customerId}::text),
          true
        ),
        '{subscriptionId}',
        to_jsonb(${sub.id}::text),
        true
      )
      || jsonb_build_object(
        'paymentStatus', 'pending',
        'billingType', ${billingType},
        'cycle', ${cycle},
        'valueCents', ${valueCents}
      ),
      updated_at = NOW()
    WHERE id = ${us.id}
  `);

  return { ok: true, customerId, subscriptionId: sub.id, subscription: sub };
};

export const createProjectSystemSubscription = async ({
  userId,
  projectId,
  systemKey,
  valueCents,
  billingType = 'PIX',
  cycle = 'MONTHLY',
  description = null,
  externalReference = null,
}) => {
  if (!userId) throw new Error('userId obrigatório');
  if (!projectId) throw new Error('projectId obrigatório');
  if (!systemKey) throw new Error('systemKey obrigatório');
  if (!Number.isFinite(valueCents) || valueCents < 0) throw new Error('valueCents inválido');

  // 1) user + projectSystem
  const [user] = await db.select().from(core.users).where(eq(core.users.id, userId)).limit(1);
  if (!user) throw new Error('User not found');

  const [ps] = await db
    .select()
    .from(system.projectSystems)
    .where(and(eq(system.projectSystems.projectId, projectId), eq(system.projectSystems.systemKey, systemKey)))
    .limit(1);

  if (!ps) throw new Error(`project_systems não encontrado para ${systemKey} em ${projectId} (habilite antes)`);

  // 2) resolve customer no Asaas (stateless)
  const customerId = await ensureAsaasCustomer({
    id: user.id,
    name: user.name,
    email: user.email,
  });

  // 3) cria subscription
  const sub = await createSubscription({
    customerId,
    valueCents,
    cycle,
    billingType,
    description: description || `Assinatura Prana - ${systemKey} (Projeto ${projectId})`,
    externalReference: externalReference || `user:${userId}:project:${projectId}:system:${systemKey}`,
  });

  // 4) salva no flags jsonb (project_systems)
  await db.execute(sql`
    UPDATE project_systems
    SET flags =
      jsonb_set(
        jsonb_set(
          COALESCE(flags, '{}'::jsonb),
          '{asaasCustomerId}',
          to_jsonb(${customerId}::text),
          true
        ),
        '{subscriptionId}',
        to_jsonb(${sub.id}::text),
        true
      )
      || jsonb_build_object(
        'paymentStatus', 'pending',
        'billingType', ${billingType},
        'cycle', ${cycle},
        'valueCents', ${valueCents}
      ),
      updated_at = NOW()
    WHERE id = ${ps.id}
  `);

  return { ok: true, customerId, subscriptionId: sub.id, subscription: sub };
};

// =============================================================================
// Exports for compatibility with modules that import billingService object
// =============================================================================
export const billingService = {
  calculateCostCredits,
  recordAiUsage,
  getUserTransactions,
  createUserSystemSubscription,
  createProjectSystemSubscription,
};