/* src/api/controllers/agentController.js
   desc: Controlador Mestre do Swarm Intelligence V12 (O General).
   feat: 
    - Desacoplamento Total: Não importa bibliotecas de IA externas nem serviços de RAG.
    - Governança de Planos e Billing (Porteiro e Tesoureiro).
    - Orquestração de Contexto Genérica via agentOrchestrator (que agora gere o RAG).
    - Delegação de execução técnica para o chatService.
    - Telemetria de Impacto (CollaborationView).
*/

// --- IMPORTS ESTRITOS (Apenas Serviços de Burocracia, Execução e Registo) ---
import { agentOrchestrator } from '../agents/general/services/agentOrchestrator.js'; // O Estrategista
import { chatService } from '../../ai_services/chatService.js';                    // O Executor Mestre
import { billingService } from '../../services/billing/billingService.js';         // O Tesoureiro
import { modelsService } from '../../services/modelsService.js';                   // O Engenheiro de Rotas
import { AgentLogService } from '../agents/general/services/agentLogService.js';   // O Historiador

export const agentController = {

  /**
   * INTERAÇÃO GERAL (SWARM CHAT)
   * POST /api/agents/interaction
   */
  async runInteraction(req, res) {
    try {
      const { agentId, message, projectId, taskId, sintoniaLayers, history = [], activeRealmId } = req.body;
      const userId = req.user?.id;

      if (!message) return res.status(400).json({ error: "O silêncio não constrói projetos." });

      // 1. 🛡️ CHECK FINANCEIRO (O utilizador pode falar?)
      const canAccess = await billingService.validateAiAccess(userId);
      if (!canAccess.allowed) {
        return res.status(403).json({ error: "Limite do plano atingido.", message: canAccess.reason });
      }

      // 2. ⚖️ RESOLUÇÃO DE MOTOR (Qual cérebro o plano permite?)
      const allowedModel = await modelsService.getModelForAgent(userId, agentId);
      
      // 3. 🧪 ALQUIMIA DE CONTEXTO E EXECUÇÃO (Delegação Total ao Maestro)
      // O agentOrchestrator V12.1 agora resolve o RAG, a Astrologia, o BrandCode e chama o chatService.
      // Nós (o Controller) apenas passamos as regras do negócio e o input.
      const options = {
        projectId,
        taskId,
        sintoniaLayers,
        history,
        model: allowedModel.name,
        provider: allowedModel.provider
      };

      const orchestrationResult = await agentOrchestrator.run(userId, agentId, message, activeRealmId, options);

      // 4. 💰 REGISTRO DE CONSUMO
      await billingService.recordAiUsage(userId, {
        agentId, 
        model: allowedModel.name, 
        type: 'chat_interaction' 
      });

      // 5. 📊 TELEMETRIA (Para o CollaborationView)
      await AgentLogService.log({
        agentId, userId, projectId, taskId,
        type: 'AGENT_CHAT',
        content: { modelUsed: allowedModel.name, prompt: message, response: orchestrationResult.content },
        impactScore: 10
      });

      res.json({ response: orchestrationResult.content, telemetry: orchestrationResult.telemetry });

    } catch (error) {
      console.error('[Agent Swarm Error]', error);
      res.status(500).json({ error: "Interferência na rede neural do Prana. A comunicação falhou." });
    }
  },

  /**
   * ALQUIMIA DE BLOCO (MACRO-VARIANTES) - Para o Papyrus Canvas
   * POST /api/agents/flor/refine-block-variants
   */
  async refineBlockVariants(req, res) {
    try {
      const { content, projectId, taskId, sintoniaLayers } = req.body;
      const userId = req.user?.id;
      const agentId = 'flor'; // A Flor é a dona do Canvas

      const check = await billingService.validateFeatureUsage(userId, 'ai_refinement');
      if (!check.allowed) return res.status(403).json({ error: check.reason });

      // Ferramentas de edição forçam o modelo rápido/económico (ex: Flash)
      const allowedModel = await modelsService.getFastModel(userId);
      
      // Monta o prompt (que agora inclui RAG internamente se houver)
      const systemPrompt = await agentOrchestrator.buildSuperPrompt(agentId, projectId, taskId, sintoniaLayers, userId, content);

      const finalPrompt = `
        ${systemPrompt}
        MISSÃO: Gere 3 variantes criativas para o bloco de texto abaixo.
        TEXTO ORIGINAL: "${content}"
        RETORNO: Responda obrigatoriamente APENAS com um array JSON de strings: ["V1", "V2", "V3"]
      `;

      // Delegação de completion simples
      const resultText = await chatService.generateCompletion({
        model: allowedModel.name,
        provider: allowedModel.provider,
        prompt: finalPrompt
      });

      const variants = JSON.parse(resultText.replace(/```json|```/g, "").trim());
      
      await billingService.recordAiUsage(userId, { agentId, model: allowedModel.name, type: 'variant_gen' });

      res.json({ variants });

    } catch (error) {
      console.error('[Flor Variants Error]', error);
      res.status(500).json({ error: "A Flor não conseguiu manifestar as variantes. Tente de novo." });
    }
  },

  /**
   * MICRO-ALQUIMIA (REFINAMENTO DE FRAGMENTO) - Para o BubbleMenu
   * POST /api/agents/flor/refine-fragment
   */
  async refineFragment(req, res) {
    try {
      const { fragment, dna, projectId, taskId, sintoniaLayers } = req.body;
      const userId = req.user?.id;
      const agentId = 'flor';

      const allowedModel = await modelsService.getFastModel(userId);
      const systemPrompt = await agentOrchestrator.buildSuperPrompt(agentId, projectId, taskId, sintoniaLayers, userId, fragment);

      const prompt = `
        ${systemPrompt}
        MISSÃO: Refine o fragmento selecionado para que ele soe como o Arquiteto deste BrandCode.
        TRECHO SELECIONADO: "${fragment}"
        REGRA: Devolva APENAS o texto refinado. Sem aspas, sem introduções.
      `;

      const refinedFragment = await chatService.generateCompletion({
        model: allowedModel.name,
        provider: allowedModel.provider,
        prompt: prompt
      });

      await billingService.recordAiUsage(userId, { agentId, model: allowedModel.name, type: 'fragment_refine' });

      res.json({ refinedFragment: refinedFragment.trim() });

    } catch (error) {
      console.error('[Flor Fragment Error]', error);
      res.status(500).json({ error: "A sintonia falhou na micro-alquimia." });
    }
  },

  /**
   * LISTAGEM DE LOGS (CollaborationView)
   * GET /api/agents/logs/:projectId
   */
  async listLogs(req, res) {
    const { projectId } = req.params;
    try {
      const logs = await AgentLogService.getLogsByProject(projectId);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Não foi possível recuperar o rastro do Swarm." });
    }
  }
};