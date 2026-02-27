/* src/api/webhooks/asaasWebhookRoutes.js
   desc: Webhooks V2 (Asaas) — Plans + Project Systems (Lego)
   handles:
   - Atualiza plano do user via users.subscriptionId (legado)
   - Atualiza billing state por PROJETO via project_systems.flags.subscriptionId
   - (opcional) Atualiza billing state de pack via user_systems.config.subscriptionId
*/

import express from 'express';
import { db } from '../../db/index.js';
import { eq, sql } from 'drizzle-orm';

import { users } from '../../db/schema/core.js';
import { projectSystems, userSystems } from '../../db/schema/system.js';

const router = express.Router();

function mapPaymentStatus(eventName) {
  const e = String(eventName || '').toUpperCase();

  // eventos mais comuns do Asaas (pagamentos)
  if (e === 'PAYMENT_CONFIRMED' || e === 'PAYMENT_RECEIVED') return 'paid';
  if (e === 'PAYMENT_OVERDUE') return 'overdue';
  if (e === 'PAYMENT_REFUNDED') return 'refunded';
  if (e === 'PAYMENT_DELETED' || e === 'PAYMENT_CANCELED') return 'canceled';

  // fallback
  return 'unknown';
}

function pickSubscriptionId(payload) {
  // formatos possíveis:
  // payload.payment.subscription
  // payload.subscription.id
  // payload.payment?.subscriptionId (alguns)
  const p = payload || {};
  return (
    p?.payment?.subscription ||
    p?.payment?.subscriptionId ||
    p?.subscription?.id ||
    null
  );
}

function pickPaidValue(payload) {
  return Number(payload?.payment?.value ?? payload?.subscription?.value ?? 0);
}

function inferPlanFromValue(value) {
  // seu legado: >=40 ROOT, >=120 TRUNK, >=390 CROWN
  // mantém o comportamento antigo
  let newPlan = 'SEED';
  if (value >= 40) newPlan = 'ROOT';
  if (value >= 120) newPlan = 'TRUNK';
  if (value >= 390) newPlan = 'CROWN';
  return newPlan;
}

// PATCH jsonb helper (flags/config)
async function updateProjectSystemFlagsBySubscription(subscriptionId, patch) {
  // flags->>'subscriptionId' = subscriptionId
  // merge patch: flags = flags || patch
  await db.execute(sql`
    UPDATE project_systems
    SET flags = COALESCE(flags, '{}'::jsonb) || ${JSON.stringify(patch)}::jsonb,
        updated_at = NOW()
    WHERE COALESCE(flags->>'subscriptionId','') = ${subscriptionId}
  `);
}

async function updateUserSystemConfigBySubscription(subscriptionId, patch) {
  await db.execute(sql`
    UPDATE user_systems
    SET config = COALESCE(config, '{}'::jsonb) || ${JSON.stringify(patch)}::jsonb,
        updated_at = NOW()
    WHERE COALESCE(config->>'subscriptionId','') = ${subscriptionId}
  `);
}

router.post('/asaas', async (req, res) => {
  const event = req.body;

  // Log leve para debug
  console.log('[Webhook Asaas]', event?.event, event?.payment?.id || event?.subscription?.id);

  try {
    const eventName = event?.event;
    const subscriptionId = pickSubscriptionId(event);

    // 1) Se tiver subscriptionId: atualiza status do billing do PROJECT SYSTEM (e pack, opcional)
    if (subscriptionId) {
      const paymentStatus = mapPaymentStatus(eventName);

      // Atualiza project_systems.flags
      await updateProjectSystemFlagsBySubscription(subscriptionId, {
        paymentStatus,
        lastPaymentEvent: eventName,
        lastWebhookAt: new Date().toISOString(),
      });

      // Opcional: se você também usar assinatura por pack (user_systems.config)
      await updateUserSystemConfigBySubscription(subscriptionId, {
        paymentStatus,
        lastPaymentEvent: eventName,
        lastWebhookAt: new Date().toISOString(),
      });

      // 2) Legado: se existir users.subscriptionId == subscriptionId, atualiza planType
      if (paymentStatus === 'paid') {
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.subscriptionId, subscriptionId))
          .limit(1);

        if (user?.id) {
          const value = pickPaidValue(event);
          const newPlan = inferPlanFromValue(value);

          await db
            .update(users)
            .set({ planType: newPlan, updatedAt: new Date() })
            .where(eq(users.id, user.id));

          console.log(`[Webhook] user ${user.email} planType -> ${newPlan}`);
        }
      }
    }

    return res.json({ received: true });
  } catch (error) {
    console.error('[Webhook Asaas] erro:', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
});

export default router;