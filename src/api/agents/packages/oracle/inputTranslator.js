/* src/api/agents/packages/oracle/inputTranslator.js
   desc: Oracle Pack - Tradutor de input bruto para uma blueprint operacional.
   goal: Transformar input humano em instrução acionável e contextualizada.
*/

function safeString(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function buildContextSummary(context = {}) {
  const parts = [];

  if (context?.currentAgentId) parts.push(`Agente atual: ${context.currentAgentId}`);
  if (context?.realmId) parts.push(`Realm: ${context.realmId}`);
  if (context?.intent) parts.push(`Intenção: ${context.intent}`);
  if (context?.type) parts.push(`Tipo: ${context.type}`);
  if (context?.category) parts.push(`Categoria: ${context.category}`);

  // Pequenos indícios úteis
  if (context?.projectId) parts.push(`Projeto: ${context.projectId}`);
  if (context?.taskId) parts.push(`Tarefa: ${context.taskId}`);

  return parts.length ? parts.join(' | ') : 'Sem contexto adicional.';
}

function buildBlueprintPrompt(rawInput, context = {}) {
  const contextSummary = buildContextSummary(context);

  // Isso aqui é um "prompt blueprint" para o seu dispatcher (LLM) refinar depois.
  // No passo 4 a gente pluga o dispatcher real. Por ora, retornamos um texto estruturado.
  return [
    `Você é o ORACLE do Prana. Sua função é traduzir um pedido humano em uma instrução operacional clara.`,
    ``,
    `REGRAS:`,
    `- Seja direto.`,
    `- Não invente dados.`,
    `- Se faltar informação, formule 1-3 perguntas curtas.`,
    `- Sempre proponha um próximo passo executável.`,
    ``,
    `CONTEXTO: ${contextSummary}`,
    ``,
    `INPUT DO USUÁRIO:`,
    safeString(rawInput),
    ``,
    `SAÍDA (formato):`,
    `1) Interpretação (1-2 linhas)`,
    `2) Objetivo`,
    `3) Próximo passo executável`,
    `4) Perguntas (se necessário)`,
  ].join('\n');
}

export const InputTranslator = {
  /**
   * API canônica do pack: gera uma blueprint (texto estruturado).
   * Retorna um objeto para permitir evoluir sem quebrar quem chama.
   */
  async generateBlueprint(rawInput, context = {}) {
    const blueprint = buildBlueprintPrompt(rawInput, context);

    return {
      refinedPrompt: blueprint,
      meta: {
        pack: 'oracle',
        kind: 'blueprint',
      },
    };
  },

  /**
   * Alias de compatibilidade: o Orchestrator estava chamando expand().
   * Mantemos expand() para não quebrar versões antigas.
   */
  async expand(rawInput, context = {}) {
    return this.generateBlueprint(rawInput, context);
  },
};

export default InputTranslator;
