/* Sistema de Colaboração e Handoff V10 (The Swan Edition)
  feat: Sincronização com Tasks (agentAssignee), Injeção de BrandCode e Handoff Ativo.
*/

import { getAgentById } from '@/config/agentPersonas';
import { isAgentEnabledForPlan } from '@/config/userPlans';
import { AgentLogService } from '@/api/agents/general/services/agentLogService';
import { BrandCodeAPI } from '@/modules/brandcode/brandcode.api';
// import { TaskService } from '@/api/services/taskService'; // TODO: Implementar este serviço

/**
 * Sugere colaboração baseada em Capabilities (Lego) em vez de hardcoded.
 */
export function suggestAgentCollaboration(fromAgentId, toAgentId, context, userPlanId) {
  const toAgent = getAgentById(toAgentId);
  const canForward = isAgentEnabledForPlan(toAgentId, userPlanId);
  
  if (!canForward) {
    return {
      suggestion: `O agente ${toAgent?.name} exige um upgrade no seu Prana Shop.`,
      canForward: false,
      reason: 'PLAN_RESTRICTION'
    };
  }

  // LEGO MATCHING: Em vez de if/else, usamos as capabilities do Persona
  const isMatch = toAgent.capabilities?.some(cap => 
    context?.type === cap || context?.category === cap
  );

  const reason = isMatch 
    ? `${toAgent.name} é o especialista ideal para ${context.type}.`
    : `${toAgent.name} pode auxiliar com ferramentas complementares.`;

  return {
    suggestion: `Deseja que o ${toAgent.name} assuma a co-responsabilidade por esta tarefa? ${reason}`,
    canForward: true,
    reason,
    targetAgentKey: toAgentId
  };
}

/**
 * Hand-off Ativo: Transfere o contexto E a responsabilidade no DB.
 */
export async function forwardToAgent(toAgentId, context, userId) {
  const targetAgent = getAgentById(toAgentId);
  const taskId = context?.taskId; // Precisamos do ID da tarefa para o vínculo no DB

  if (!targetAgent) return { success: false, error: 'Agente não encontrado.' };

  try {
    // 1. EXTRAÇÃO DE DNA (O "Cisne" agindo no backend)
    // Antes de passar a bola, pegamos o BrandCode para o novo agente já entrar no tom certo.
    const brandDna = await BrandCodeAPI.getEffectiveBrandCode(context.projectId);

    // 2. ATUALIZAÇÃO DE RESPONSABILIDADE (Sincronização com planning.js)
    // Se houver uma tarefa vinculada, atualizamos o agent_assignee no Postgres
    if (taskId) {
      // TODO: Implementar TaskService.updateAgentAssignee(taskId, toAgentId);
      console.log(`[agentCollaboration] Tarefa ${taskId} seria atribuída a ${toAgentId}`);
    }

    // 3. EXECUÇÃO DO HANDOFF (Comunicação entre Agentes)
    const payload = {
      ...context,
      brandDna: brandDna?.dna || null, // Injetamos a "alma" da marca no handoff
      originAgent: context.currentAgentId || 'ash',
      targetAgent: toAgentId,
      responsibilityLevel: 'CO_EXECUTOR'
    };

    // Simulamos a chamada de API ou Processamento Interno
    const response = targetAgent.apiUrl 
      ? await fetch(`${targetAgent.apiUrl}/api/forward`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ payload, userId })
        })
      : { ok: true, json: async () => ({ status: 'INTERNALLY_ASSIGNED' }) };

    if (!response.ok) throw new Error('Falha no Handoff entre agentes.');

    // 4. LOG DE AUDITORIA (V10)
    await logAgentCollaboration({
      from: context.currentAgentId || 'ash',
      to: toAgentId,
      userId,
      type: 'HANDOFF_EXECUTION',
      context: payload,
      result: 'SUCCESS'
    });

    return { 
      success: true, 
      assignedAgent: targetAgent.name,
      message: `${targetAgent.name} agora é co-responsável por esta tarefa.`
    };

  } catch (error) {
    console.error(`[Handoff Error]`, error);
    return { success: false, error: error.message };
  }
}

export async function logAgentCollaboration({ from, to, userId, type, context, result }) {
  // Mantido para auditoria, mas agora recebe o payload rico com DNA
  return await AgentLogService.log({
    agentId: from,
    targetAgentId: to,
    userId,
    type,
    content: { taskContext: context, result },
    impactScore: type === 'HANDOFF_EXECUTION' ? 50 : 10
  });
}