/* src/config/userPlans.js
   desc: Configurações de planos de usuário para controle de acesso a agentes.
*/

/**
 * Verifica se um agente está habilitado para o plano do usuário.
 * @param {string} agentId - ID do agente
 * @param {string} userPlanId - ID do plano do usuário
 * @returns {boolean} true se o agente está habilitado
 */
export function isAgentEnabledForPlan(agentId, userPlanId) {
  // Por enquanto, todos os agentes estão habilitados para todos os planos
  // Isso pode ser expandido para implementar lógica real de planos
  return true;
}

export const USER_PLANS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
};

export const PLAN_AGENT_ACCESS = {
  [USER_PLANS.FREE]: ['general', 'assistant'],
  [USER_PLANS.PRO]: ['general', 'assistant', 'specialist'],
  [USER_PLANS.PREMIUM]: ['general', 'assistant', 'specialist', 'advanced'],
  [USER_PLANS.ENTERPRISE]: ['general', 'assistant', 'specialist', 'advanced', 'custom'],
};
