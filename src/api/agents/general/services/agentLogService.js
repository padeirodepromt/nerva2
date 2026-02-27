/* src/api/agents/general/services/agentLogService.js
   desc: Telemetria e auditoria de agentes (DB + SSE).
*/

import { db } from '../../../../db/index.js';
import { agentLogs } from '../../../../db/schema/logs.js';
import { desc, eq } from 'drizzle-orm';

// SSE bus (opcional): se não existir/estiver incompleto, não quebra o log
import { AgentEventService } from '../../../services/agentEventService.js';

const safeEmitLog = (userId, log) => {
  try {
    if (AgentEventService && typeof AgentEventService.emitLog === 'function') {
      AgentEventService.emitLog(userId, log);
    }
  } catch (e) {
    // SSE não pode derrubar o sistema de logs
    console.warn('⚠️ [AgentLogService] SSE emitLog falhou:', e?.message || e);
  }
};

export const AgentLogService = {
  /**
   * 📝 REGISTRAR: Grava uma ação de agente no banco e notifica a UI em tempo real.
   */
  async log(data) {
    try {
      const [newLog] = await db
        .insert(agentLogs)
        .values({
          agentId: data.agentId || null,
          targetAgentId: data.targetAgentId || null,
          userId: data.userId,
          type: data.type,
          content: data.content,
          impactScore: data.impactScore || 0,
          // createdAt é defaultNow no schema, então não precisa setar
        })
        .returning();

      if (newLog) safeEmitLog(data.userId, newLog);

      return newLog || null;
    } catch (error) {
      console.error('❌ [AgentLogService] Falha ao gravar log:', error?.message || error);
      return null;
    }
  },

  /**
   * 📖 HISTÓRICO: Busca os últimos logs de um usuário.
   */
  async getRecentLogs(userId, limit = 20) {
    try {
      const safeLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(200, Number(limit))) : 20;

      return await db
        .select()
        .from(agentLogs)
        .where(eq(agentLogs.userId, userId))
        .orderBy(desc(agentLogs.createdAt))
        .limit(safeLimit);
    } catch (error) {
      console.error('❌ [AgentLogService] Falha ao buscar histórico:', error?.message || error);
      return [];
    }
  },
};
