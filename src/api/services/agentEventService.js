/* src/api/services/agentEventService.js
   desc: Sistema Nervoso Central (SSE) para a Pipeline de Soberania.
   feat: Gerencia conexões abertas e empurra eventos em tempo real para o frontend.
*/
import { EventEmitter } from 'events';

const agentBus = new EventEmitter();
// Aumenta o limite caso muitos usuários estejam conectados simultaneamente
agentBus.setMaxListeners(100); 

export const AgentEventService = {
  /**
   * Método raiz para disparar dados para um usuário específico.
   */
  emit(userId, eventName, payload) {
    agentBus.emit(`stream:${userId}`, { event: eventName, payload });
  },

  // --- MÉTODOS AUXILIARES DA PIPELINE LEGO --- //
  emitStatus(userId, status) {
    this.emit(userId, 'pipeline_status', { status });
  },
  emitPlan(userId, content) {
    this.emit(userId, 'thought_stream', { type: 'plan', content });
  },
  emitThought(userId, content) {
    this.emit(userId, 'thought_stream', { type: 'thought', content });
  },
  emitCritique(userId, content) {
    this.emit(userId, 'thought_stream', { type: 'critique', content });
  },
  emitAudit(userId, content) {
    this.emit(userId, 'thought_stream', { type: 'audit', content });
  },
  emitError(userId, errorDetails) {
    this.emit(userId, 'pipeline_error', errorDetails);
  },

  // --- CONEXÃO SSE (CHAMADA PELA ROTA) --- //
  subscribe(req, res) {
    const userId = req.user.id;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Confirmação inicial
    res.write(`data: ${JSON.stringify({ event: 'connected', payload: { message: 'Neural Link Estabelecido' } })}\n\n`);

    const listener = (data) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    agentBus.on(`stream:${userId}`, listener);

    req.on('close', () => {
      agentBus.removeListener(`stream:${userId}`, listener);
    });
  }
};