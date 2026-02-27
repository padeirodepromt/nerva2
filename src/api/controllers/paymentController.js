/* src/api/controllers/paymentController.js */
import { db } from '../../db/index.js';
import { users, plans } from '../../db/schema/core.js';
import { eq, and } from 'drizzle-orm';

/**
 * MOCK DE PROCESSAMENTO DE PAGAMENTO
 * Em produção, aqui você validaria o Webhook do Stripe/MercadoPago.
 * Por enquanto, vamos confiar que o front só chama isso se o cartão passar.
 */
export const upgradePlan = async (req, res) => {
  const { userId } = req.user; // Vem do middleware de autenticação
  const { planKey , realmId } = req.body; // Ex: 'FLOR', 'RAIZ'

  try {
    if (!planKey) return res.status(400).json({ error: 'Plano não especificado.' });

    // 1. Validar se o plano existe
    const [targetPlan] = await db.select().from(plans).where(and(eq(plans.key, planKey), realmId && realmId !== 'all' ? eq(plans.realmId, realmId) : undefined)).limit(1);
    
    if (!targetPlan) {
      return res.status(404).json({ error: 'Plano inválido.' });
    }

    // 2. Atualizar o usuário
    await db.update(users)
      .set({ 
        planType: planKey,
        updatedAt: new Date()
        // Aqui você adicionaria: subscriptionId, nextBillingDate, etc.
      })
      .where(and(eq(users.id, userId), realmId && realmId !== 'all' ? eq(users.realmId, realmId) : undefined));

    res.json({ 
      success: true, 
      message: `Bem-vindo ao plano ${targetPlan.name}!`,
      newPlan: planKey 
    });

  } catch (error) {
    console.error('[Payment Upgrade] Erro:', error);
    res.status(500).json({ error: 'Erro ao processar upgrade.' });
  }
};