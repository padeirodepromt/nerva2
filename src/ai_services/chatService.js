/* src/ai_services/chatService.js
   desc: Executor Agnóstico de Inteligência (Swarm V12).
   feat: 
    - Execução Híbrida (OpenAI / Google Gemini).
    - Loop de Tool Calls (Dança das Ferramentas).
    - Motores Cognitivos Injetados: Oracle (Pré-Prompt) e Neural (Pós-Resposta).
    - Auditoria de Tokens em Tempo Real (Loop-by-Loop).
*/

import { openai, gemini } from './aiClients.js';
import * as toolService from './toolService.js';
import { estimateTokensFallback } from '../services/tokenizerService.js'; 
import { billingService } from '../services/billing/billingService.js';

// Importação dos Motores Cognitivos (Middlewares de Execução)
import { InputTranslator } from '../api/agents/packages/oracle/inputTranslator.js';
import { SocraticLoop } from '../api/agents/packages/neural/socraticLoop.js';

// === CONFIGURAÇÃO DE FERRAMENTAS ===
const getToolDeclarationsForContext = (agentId, activePacks) => {
  const { declarations } = toolService.resolveToolsetForAgent(agentId, { activePacks });
  return declarations || [];
};

export const chatService = {

  /**
   * WRAPPER - Aceita argumentos posicionais (userId, nexusId, message, history, context)
   */
  async runChat(userId, nexusId, message, history = [], context = {}) {
    return this._runChatInternal({
      model: context?.model || 'gpt-4-turbo',
      provider: context?.provider || 'openai',
      systemPrompt: context?.systemPrompt || 'Você é um assistente inteligente.',
      history,
      message,
      projectId: context?.projectId || null,
      taskId: context?.taskId || null,
      userId,
      agentId: context?.agentId || 'system',
      activePacks: context?.activePacks || new Set() // <-- Agora passamos os packs do utilizador
    });
  },

  /**
   * LOOP PRINCIPAL DE EXECUÇÃO (CHAT & TOOLS & MIDDLEWARES)
   */
  async _runChatInternal({ model, provider, systemPrompt, history, message, projectId, taskId, userId, agentId, activePacks }) {
    try {
      
      // =========================================================
      // 🔮 MIDDLEWARE 1: ORACLE (Tradução de Input)
      // Se o utilizador tem o PACK_ORACLE, refinamos a mensagem dele antes de enviar
      // =========================================================
      let finalPrompt = message;
      if (activePacks.has('PACK_ORACLE')) {
          console.log(`[ChatService] Oracle ativado para traduzir o input.`);
          const oracleContext = { currentAgentId: agentId, projectId, taskId, intent: 'executar' };
          const { refinedPrompt } = await InputTranslator.generateBlueprint(message, oracleContext);
          finalPrompt = refinedPrompt;
      }

      // --- SETUP DE MENSAGENS E HISTÓRICO ---
      let messages = [];
      let geminiHistory = [];

      if (provider === 'openai') {
        messages = [...history.map(msg => ({ role: msg.role === 'user' ? 'user' : 'assistant', content: msg.content }))];
        messages.unshift({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: finalPrompt }); // Usa o finalPrompt (Blueprint) se aplicável
      } else { // Google Gemini
        geminiHistory = history.map(msg => ({ 
          role: msg.role === 'user' ? 'user' : 'model', 
          parts: [{ text: msg.content }] 
        }));
      }

      // Busca as ferramentas, agora respeitando os packs pagos
      const allowedTools = getToolDeclarationsForContext(agentId, activePacks);
      
      let loopCount = 0;
      const maxLoops = 5;
      let finalResponseText = '';

      // --- LOOP DE FERRAMENTAS ---
      while (loopCount < maxLoops) {
        loopCount++;
        let responseText = '';
        let toolCalls = [];
        
        let inputTokens = 0;
        let outputTokens = 0;

        // --- 🤖 CHAMADA À IA ---
        if (provider === 'openai' && openai) {
          const response = await openai.chat.completions.create({
            model,
            messages,
            tools: allowedTools.length > 0 ? allowedTools.map(d => ({ type: 'function', function: d })) : undefined,
            tool_choice: allowedTools.length > 0 ? "auto" : undefined
          });

          const msg = response.choices[0].message;
          responseText = msg.content || '';
          toolCalls = msg.tool_calls || [];
          messages.push(msg);

          inputTokens = response.usage?.prompt_tokens || estimateTokensFallback(JSON.stringify(messages));
          outputTokens = response.usage?.completion_tokens || estimateTokensFallback(responseText);

        } else if (provider === 'google' && gemini) {
          const geminiModel = gemini.getGenerativeModel({ 
            model,
            tools: allowedTools.length > 0 ? [{ functionDeclarations: allowedTools }] : undefined
          });
          
          const geminiChat = geminiModel.startChat({
            history: geminiHistory,
            systemInstruction: { role: 'system', parts: [{ text: systemPrompt }] }
          });

          const result = await geminiChat.sendMessage(finalPrompt); // Usa o finalPrompt
          const response = result.response;
          
          responseText = response.text ? response.text() : '';
          
          const calls = response.functionCalls ? response.functionCalls() : [];
          if (calls && calls.length > 0) {
             toolCalls = calls.map(call => ({
               id: 'call_' + Math.random().toString(36).substr(2, 9),
               function: { name: call.name, arguments: JSON.stringify(call.args) }
             }));
          }

          inputTokens = response.usageMetadata?.promptTokenCount || estimateTokensFallback(JSON.stringify(geminiHistory) + systemPrompt + finalPrompt);
          outputTokens = response.usageMetadata?.candidatesTokenCount || estimateTokensFallback(responseText);

        } else {
          throw new Error(`Provedor de IA inválido: ${provider}`);
        }

        // --- 💰 AUDITORIA FINANCEIRA (POR LOOP) ---
        const totalTokensUsed = inputTokens + outputTokens;
        if (totalTokensUsed > 0 && userId) {
            await billingService.recordAiUsage(userId, {
              agentId,
              model,
              tokens: totalTokensUsed,
              type: toolCalls.length > 0 ? `tool_loop_${loopCount}` : 'chat_response'
            });
        }

        // --- 🛠️ RESOLUÇÃO DE TOOL CALLS ---
        if (toolCalls && toolCalls.length > 0) {
          console.log(`[ChatService][${agentId}] IA acionou ${toolCalls.length} ferramenta(s). Loop ${loopCount}.`);
          let toolResultsForGemini = [];

          for (const toolCall of toolCalls) {
            const fnName = toolCall.function.name;
            let fnArgs = {};
            try { fnArgs = JSON.parse(toolCall.function.arguments); } catch(e){}

            // Injeção de Contexto
            if (!fnArgs.userId) fnArgs.userId = userId;
            if ((!fnArgs.projectId && !fnArgs.project_id) && projectId) {
                fnArgs.projectId = projectId;
                fnArgs.project_id = projectId;
            }
            if (!fnArgs.taskId && taskId) fnArgs.taskId = taskId;

            // Envia os activePacks para o toolService garantir segurança
            const execOptions = { userId, projectId, activePacks };
            const toolResult = await toolService.executeToolCall(fnName, fnArgs, agentId, execOptions);

            // Ação de Cliente (Frontend)
            if (toolResult?.client_action) {
               return JSON.stringify({ 
                 response: toolResult.message || `Ação ${fnName} engatilhada.`, 
                 client_action: toolResult.client_action 
               });
            }

            if (provider === 'openai') {
               messages.push({ role: 'tool', tool_call_id: toolCall.id, name: fnName, content: JSON.stringify(toolResult) });
            } else { 
               toolResultsForGemini.push({ functionResponse: { name: fnName, response: toolResult } });
            }
          }

          // Retorno pós-ferramenta para o Gemini
          if (provider === 'google' && toolResultsForGemini.length > 0) {
             const geminiModel = gemini.getGenerativeModel({ model });
             const geminiChat = geminiModel.startChat({ history: geminiHistory });
             const followupResult = await geminiChat.sendMessage(toolResultsForGemini);
             
             finalResponseText = followupResult.response.text();
             
             const finalTokens = followupResult.response.usageMetadata?.candidatesTokenCount || estimateTokensFallback(finalResponseText);
             if (finalTokens > 0 && userId) {
                 await billingService.recordAiUsage(userId, { agentId, model, tokens: finalTokens, type: 'post_tool_response' });
             }
             break; 
          }
          
        } else {
          // --- FIM DA MANIFESTAÇÃO ---
          finalResponseText = responseText;
          break; 
        }
      }

      let generatedOutput = finalResponseText || "O meu raciocínio esgotou-se antes de concluir a tarefa.";

      // =========================================================
      // 🧠 MIDDLEWARE 2: NEURAL / SOCRATIC LOOP
      // Se o utilizador ativou o PACK_NTP e não houve Ações de Cliente que interromperam o fluxo
      // =========================================================
      if (activePacks.has('PACK_NTP')) {
          console.log(`[ChatService] Neural Thought Process acionado para refino.`);
          const criticPersona = agentId === 'neo_dev' ? 'Arquiteto Sênior Implacável' : 'Mestre Holístico';
          
          // O seu socraticLoop original exige (initialSynthesis, criticPersona, originalPrompt)
          // *Nota: O seu código original de socraticLoop usa um `contextEngine.fastInvoke`.
          generatedOutput = await SocraticLoop.process(generatedOutput, criticPersona, finalPrompt);
      }

      return generatedOutput;

    } catch (error) {
      console.error('[ChatService] Critical Engine Failure:', error);
      throw error;
    }
  },

  /**
   * MANIFESTAÇÃO SIMPLES (Macro e Micro Alquimia)
   */
  async generateCompletion({ model, provider, prompt, userId, agentId = 'system' }) {
    try {
      let responseText = '';
      let totalTokens = 0;

      if (provider === 'google') {
        const genModel = gemini.getGenerativeModel({ model });
        const result = await genModel.generateContent(prompt);
        responseText = result.response.text();
        
        // Tokenizer
        totalTokens = result.response.usageMetadata?.totalTokenCount || (estimateTokensFallback(prompt) + estimateTokensFallback(responseText));
      } else {
        const response = await openai.chat.completions.create({
          model,
          messages: [{ role: 'user', content: prompt }]
        });
        responseText = response.choices[0].message.content;
        
        // Tokenizer
        totalTokens = response.usage?.total_tokens || (estimateTokensFallback(prompt) + estimateTokensFallback(responseText));
      }

      // Auditoria Rápida
      if (userId && totalTokens > 0) {
         await billingService.recordAiUsage(userId, { agentId, model, type: 'completion_task', tokens: totalTokens });
      }

      return responseText;
    } catch (error) {
      console.error('[ChatService] Completion Failed:', error);
      throw error;
    }
  }
};