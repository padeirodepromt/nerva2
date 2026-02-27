/* src/ai_services/runChatWithBilling.js
   desc: Wrapper canônico do chatService.runChat que registra billing (ai_usage + credits).
   feat: Tool Router (Flor) + Loop seguro de tool-calls.
   regra: Billing nunca pode impedir o chat de responder.
*/

import * as chatService from './chatService.js';
import { recordAiUsage } from '../services/billing/billingService.js';

// ✅ Tool executors
import { FlorTools } from '../api/agents/flor/florTools.js';

const MAX_TOOL_LOOPS = 3;

/** ---------------------------
 * Extractors (compat)
 * --------------------------*/

const extractText = (result) =>
  result?.response ??
  result?.message ??
  result?.content ??
  result?.text ??
  (typeof result === 'string' ? result : '');

const extractModelHints = (result) => {
  const usage = result?.usage || result?.meta?.usage || result?.providerUsage || null;

  const tokensUsed =
    usage?.total_tokens ??
    usage?.totalTokens ??
    usage?.tokens_used ??
    usage?.tokens ??
    result?.tokensUsed ??
    null;

  const modelIdentifier =
    result?.modelIdentifier ??
    result?.model ??
    result?.meta?.model ??
    usage?.model ??
    null;

  const provider =
    result?.provider ??
    result?.meta?.provider ??
    usage?.provider ??
    null;

  return { tokensUsed, modelIdentifier, provider, usage };
};

const extractToolCalls = (result) => {
  // compat com provedores: OpenAI style / outros
  const direct =
    result?.toolCalls ||
    result?.tool_calls ||
    result?.meta?.toolCalls ||
    result?.meta?.tool_calls ||
    result?.response?.toolCalls ||
    result?.response?.tool_calls ||
    null;

  if (Array.isArray(direct)) return direct;

  // alguns retornam dentro de choices/message
  const msg =
    result?.choices?.[0]?.message ||
    result?.meta?.choices?.[0]?.message ||
    null;

  const nested = msg?.tool_calls || msg?.toolCalls || null;
  if (Array.isArray(nested)) return nested;

  return [];
};

function normalizeToolCall(tc) {
  // OpenAI: { id, type:'function', function:{ name, arguments } }
  // Outros: { name, arguments } ou { toolName, args }
  const fn = tc?.function || tc?.fn || null;

  const name =
    fn?.name ||
    tc?.name ||
    tc?.toolName ||
    tc?.tool ||
    null;

  const rawArgs =
    fn?.arguments ??
    tc?.arguments ??
    tc?.args ??
    tc?.input ??
    {};

  let args = rawArgs;
  if (typeof rawArgs === 'string') {
    try { args = JSON.parse(rawArgs); } catch { args = { raw: rawArgs }; }
  }

  return {
    id: tc?.id || tc?.call_id || tc?.toolCallId || null,
    name,
    args
  };
}

function makeToolResultMessage({ toolCallId, name, result }) {
  // formato “tool message” compatível com várias implementações
  return {
    role: 'tool',
    tool_call_id: toolCallId || undefined,
    name: name || undefined,
    content: typeof result === 'string' ? result : JSON.stringify(result)
  };
}

/** ---------------------------
 * Tool Router (Flor-first)
 * --------------------------*/

async function dispatchToolCall(toolName, toolArgs, toolCtx) {
  // ✅ Flor tool namespace
  if (typeof toolName === 'string' && toolName.startsWith('flor_')) {
    return await FlorTools.execute(toolName, toolArgs, toolCtx);
  }

  // fallback: se no futuro você registrar mais tools aqui
  throw new Error(`Tool não suportada pelo router: ${toolName}`);
}

/** ---------------------------
 * Billing helper
 * --------------------------*/

async function safeRecordBilling({ userId, message, history, context, result }) {
  try {
    const responseText = extractText(result);
    const hints = extractModelHints(result);

    await recordAiUsage({
      userId,
      provider: hints.provider,
      modelIdentifier: hints.modelIdentifier,
      tokensUsed: hints.tokensUsed,
      details: {
        prompt: message,
        responseText,
        messages: Array.isArray(history) ? history : [],
        context: {
          mode: context?.mode,
          agentId: context?.agentId,
          realmId: context?.realmId,
          projectId: context?.projectId,
          viewMode: context?.viewMode,
        },
        usage: hints.usage || null,
      },
    });
  } catch (e) {
    console.warn('[runChatWithBilling] billing falhou (não bloqueante):', e?.message || e);
  }
}

/** ---------------------------
 * Main
 * --------------------------*/

export async function runChatWithBilling(userId, nexusId, message, history = [], context = {}) {
  // 0) rodada inicial
  let result = await chatService.runChat(userId, nexusId, message, history, context);

  // billing da rodada inicial (não bloqueia)
  await safeRecordBilling({ userId, message, history, context, result });

  // 1) Se o próprio chatService já resolve tools e retorna texto final, não mexe
  let toolCalls = extractToolCalls(result);
  if (!toolCalls || toolCalls.length === 0) return result;

  // 2) Loop de tool-calls (seguro)
  let loop = 0;
  let workingHistory = Array.isArray(history) ? [...history] : [];

  // Em geral, o "message" do usuário precisa estar no histórico também para próximas rodadas.
  // Se seu chatService já faz isso, não tem problema duplicar? Evitamos duplicar:
  const last = workingHistory[workingHistory.length - 1];
  if (!last || last?.role !== 'user' || last?.content !== message) {
    workingHistory.push({ role: 'user', content: message });
  }

  // Guardamos tool responses para UI (opcional)
  const toolTraces = [];

  while (toolCalls.length > 0 && loop < MAX_TOOL_LOOPS) {
    loop += 1;

    const normalized = toolCalls.map(normalizeToolCall).filter((x) => x?.name);

    // Executa tools em série (mais previsível para estado)
    for (const tc of normalized) {
      try {
        const toolCtx = {
          userId,
          nexusId,
          projectId: context?.projectId,
          agentKey: context?.agentId,
          mode: context?.mode,
          realmId: context?.realmId
        };

        const toolResult = await dispatchToolCall(tc.name, tc.args, toolCtx);

        toolTraces.push({ tool: tc.name, ok: true, result: toolResult });

        workingHistory.push(
          makeToolResultMessage({
            toolCallId: tc.id,
            name: tc.name,
            result: toolResult
          })
        );
      } catch (err) {
        const errorPayload = {
          type: 'tool_error',
          tool: tc.name,
          message: err?.message || String(err)
        };

        toolTraces.push({ tool: tc.name, ok: false, error: errorPayload });

        workingHistory.push(
          makeToolResultMessage({
            toolCallId: tc.id,
            name: tc.name,
            result: errorPayload
          })
        );
      }
    }

    // Re-chama o modelo com tool outputs no histórico
    const followupMessage = '[tool_results_applied]';

    result = await chatService.runChat(userId, nexusId, followupMessage, workingHistory, context);

    // billing da rodada de follow-up (não bloqueia)
    await safeRecordBilling({
      userId,
      message: followupMessage,
      history: workingHistory,
      context,
      result
    });

    toolCalls = extractToolCalls(result);
    const textNow = extractText(result);

    // se já tem texto e não tem mais tools, encerra
    if ((!toolCalls || toolCalls.length === 0) && textNow) break;
  }

  // Anexa tool traces (se seu UI quiser renderizar "Action Executed")
  // Mantém compat: não depende disso.
  try {
    result.meta = result.meta || {};
    result.meta.toolTraces = toolTraces;
  } catch (_) {}

  return result;
}

export default { runChatWithBilling };
