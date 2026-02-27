/**
 * usePlanValidation.js
 * 
 * Hook para validar acesso a features baseado no plano do usuário
 */

import { useAuth } from '@/hooks/useAuth';
import { hasFeatureInPlan, getPlan } from '@/config/plansConfig';

/**
 * Hook principal para validação
 * 
 * @returns {Object} Métodos e estado de validação
 */
export function usePlanValidation() {
  const { user } = useAuth();

  // Obter plano do usuário (pode vir do Supabase depois)
  const userPlan = user?.subscription_plan || 'free';

  /**
   * Checar se usuário tem acesso a uma feature
   */
  const hasAccess = (feature) => {
    if (!user) return false;
    return hasFeatureInPlan(userPlan, feature);
  };

  /**
   * Checar acesso a múltiplas features (AND logic)
   */
  const hasAllFeatures = (features) => {
    return features.every(f => hasAccess(f));
  };

  /**
   * Checar acesso a múltiplas features (OR logic)
   */
  const hasAnyFeature = (features) => {
    return features.some(f => hasAccess(f));
  };

  /**
   * Obter informações do plano atual
   */
  const getPlanInfo = () => {
    return getPlan(userPlan);
  };

  /**
   * Checar limite de projetos
   */
  const canCreateProject = (currentProjectCount = 0) => {
    const plan = getPlanInfo();
    if (plan.limits.maxProjects === null) return true; // Ilimitado
    return currentProjectCount < plan.limits.maxProjects;
  };

  /**
   * Checar limite de tarefas
   */
  const canCreateTask = (currentTaskCount = 0) => {
    const plan = getPlanInfo();
    if (plan.limits.maxTasks === null) return true; // Ilimitado
    return currentTaskCount < plan.limits.maxTasks;
  };

  /**
   * Obter número máximo de projetos
   */
  const getMaxProjects = () => {
    const plan = getPlanInfo();
    return plan.limits.maxProjects;
  };

  /**
   * Obter número máximo de tarefas
   */
  const getMaxTasks = () => {
    const plan = getPlanInfo();
    return plan.limits.maxTasks;
  };

  /**
   * Obter agentes disponíveis
   */
  const getAvailableAgents = () => {
    const plan = getPlanInfo();
    return plan.agents;
  };

  /**
   * Checar se agente está disponível
   */
  const hasAgent = (agentId) => {
    const agents = getAvailableAgents();
    return agents.includes(agentId);
  };

  return {
    userPlan,
    isAuthenticated: !!user,
    hasAccess,
    hasAllFeatures,
    hasAnyFeature,
    getPlanInfo,
    canCreateProject,
    canCreateTask,
    getMaxProjects,
    getMaxTasks,
    getAvailableAgents,
    hasAgent,
  };
}

export default usePlanValidation;
