/**
 * aiRoutes.js
 * O Portal para o Cérebro (IA).
 *
 * *** ATUALIZAÇÃO V8 (Context Aware) ***
 * - Rota /chat atualizada para aceitar 'context' (Project ID, View Mode).
 * - Mantida integridade total das rotas legadas e lógica holística detalhada.
 * - CORREÇÃO: Rotas legadas 'ashService' redirecionadas para 'chatService' e 'holisticAnalysis'.
 */

import express from 'express';
import { runChatWithBilling } from '../ai_services/runChatWithBilling.js';
import * as energyService from '../ai_services/energyService.js';
import * as astrologyService from '../ai_services/astrologyService.js';
import * as holisticAnalysis from '../ai_services/holisticAnalysisService.js';

import { attachAccessContext } from './middleware/attachAccessContext.js';

import { db } from '../db/index.js';
import * as schema from '../../db/schema.js';

import { eq, and, gte, desc, asc } from 'drizzle-orm';
import { differenceInDays } from 'date-fns';

import { eventController } from './controllers/eventController.js';
import { thoughtController } from './controllers/thoughtController.js';

const router = express.Router();

// ============================================================================
// 1. ROTA DO CHAT (SINTONIZADA V8)
// ============================================================================
router.use(attachAccessContext());

router.post('/chat', async (req, res) => {
  try {
    // [V8] Receber 'context' do frontend (SideChat) além de mode/files
    const { nexusId, message, userId, content, mode = 'chat', files = [], context: rawContext } = req.body;
    const userMessage = message || content; // Suportar tanto 'message' quanto 'content'

    // 1. Buscar histórico (async)
    // Nota: Verifique se 'nexusMessages' existe no seu schema. Se for 'messages', ajuste aqui.
    let nexusHistory = [];
    try {
      if (nexusId) {
        nexusHistory = await db.query.nexusMessages.findMany({
          where: eq(schema.nexusMessages.nexusId, nexusId),
          orderBy: (messages, { asc }) => [asc(messages.createdAt)],
        });
      }
    } catch (err) {
      console.warn('[AI Route] Histórico não disponível ou tabela inexistente, prosseguindo sem histórico.');
    }

    // 2. Validar mode (whitelist)
    const validModes = ['chat', 'plan', 'create', 'reflect', 'ask'];
    const normalizedMode = validModes.includes(mode) ? mode : 'chat';

    // 3. Preparar contexto (Fusion V7 + V8)
    const context = {
      // Legado (V7)
      mode: normalizedMode,
      files: files || [],
      fileContext:
        files.length > 0
          ? files
              .map((f) => `[${f.type.toUpperCase()}] ${f.name}: ${f.preview || f.content?.substring(0, 100)}`)
              .join('\n')
          : '',

      // [NOVO V8] Contexto de Navegação
      projectId: rawContext?.projectId,
      viewMode: rawContext?.viewMode, // 'database' | 'planning'
      uiContext: rawContext?.uiContext,
    };

    // 4. Chamar o Cérebro (async) com contexto unificado
    const result = await runChatWithBilling(userId, nexusId, userMessage, nexusHistory, context);


    if (result?.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(`[AI Route Error] Falha em /ai/chat: ${error.message}`);
    res.status(500).json({ error: 'Falha ao processar a requisição de chat.' });
  }
});

// --- Rotas de Eventos (Âncoras) ---
router.get('/events', (req, res) => eventController.list(req, res));
router.post('/events', (req, res) => eventController.create(req, res));
router.put('/events/:id', (req, res) => eventController.update(req, res));
router.delete('/events/:id', (req, res) => eventController.delete(req, res));

// --- Rotas de Thoughts (Sementes) ---
router.get('/thoughts', (req, res) => thoughtController.list(req, res));
router.post('/thoughts', (req, res) => thoughtController.create(req, res));
router.post('/thoughts/:id/transmute', (req, res) => thoughtController.transmute(req, res));
router.delete('/thoughts/:id', (req, res) => thoughtController.delete(req, res));

// ============================================================================
// 2. ROTAS DE ANÁLISE (ORÁCULOS)
// ============================================================================

// Rota de Análise de Energia (Sintonizada)
router.post('/energy-analysis', async (req, res) => {
  try {
    const checkInData = req.body;
    const result = await energyService.getEnergyAnalysis(checkInData);

    if (result?.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(`[AI Route Error] Falha em /ai/energy-analysis: ${error.message}`);
    res.status(500).json({ error: 'Falha ao processar a análise de energia.' });
  }
});

// Rota de Análise Astral (Sintonizada)
router.post('/astral-analysis', async (req, res) => {
  try {
    const astralData = req.body;
    const result = await astrologyService.getAstralAnalysis(astralData);

    if (result?.error) {
      res.status(500).json({ error: result.error });
    } else {
      res.json(result);
    }
  } catch (error) {
    console.error(`[AI Route Error] Falha em /ai/astral-analysis: ${error.message}`);
    res.status(500).json({ error: 'Falha ao processar a análise astral.' });
  }
});

// ============================================================================
// 3. RAG ENDPOINT (MEMÓRIA EXPANDIDA V10)  ✅ (mantemos apenas 1 /rag)
// ============================================================================
router.post('/rag', async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { query, realmId = 'all' } = req.body;

    if (!userId || !query) {
      return res.status(400).json({ error: 'userId e query são obrigatórios' });
    }

    // 1. Documentos relevantes (Papyrus)
    const relevantDocs = await db
      .select()
      .from(schema.papyrusDocuments)
      .where(eq(schema.papyrusDocuments.authorId, userId))
      .limit(5);

    // 2. [V10] Sankalpas
    const activeSankalpas = await db
      .select()
      .from(schema.sankalpas)
      .where(
        and(
          eq(schema.sankalpas.ownerId, userId),
          realmId !== 'all' ? eq(schema.sankalpas.realmId, realmId) : undefined
        )
      )
      .limit(2);

    // 3. [V10] Eventos próximos
    const upcomingEvents = await db
      .select()
      .from(schema.events)
      .where(
        and(
          eq(schema.events.ownerId, userId),
          gte(schema.events.startTime, new Date())
        )
      )
      .orderBy(asc(schema.events.startTime))
      .limit(3);

    // 4. [V10] Thoughts seeds
    const seeds = await db
      .select()
      .from(schema.thoughts)
      .where(
        and(
          eq(schema.thoughts.ownerId, userId),
          eq(schema.thoughts.status, 'seed')
        )
      )
      .limit(3);

    // 5. Rituais (tabela pode não existir)
    let relevantRituals = [];
    try {
      relevantRituals = await db
        .select()
        .from(schema.rituals)
        .where(eq(schema.rituals.userId, userId))
        .limit(3);
    } catch (e) {
      console.log('Tabela rituals ainda não criada');
    }

    // 6. Check-ins recentes
    const recentCheckIns = await db
      .select()
      .from(schema.energyCheckins)
      .where(eq(schema.energyCheckins.userId, userId))
      .orderBy(desc(schema.energyCheckins.createdAt))
      .limit(5);

    res.json({
      context: {
        documents: relevantDocs,
        sankalpas: activeSankalpas,
        events: upcomingEvents,
        thoughts: seeds,
        rituals: relevantRituals,
        recentCheckIns: recentCheckIns,
        systemTime: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[RAG Error]:', error.message);
    res.status(500).json({ error: 'Erro ao processar RAG query' });
  }
});

/**
 * ============================================================================
 * ROTA ASH - Inteligência Holística (LEGADO & ATUAL)
 * ============================================================================
 */

// GET /ai/ash/context - Análise holística (energia, mood, padrões)
router.get('/ash/context', async (req, res) => {
  try {
    const userId = req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const context = await holisticAnalysis.generateInsights(userId);
    res.json({ success: true, data: context });
  } catch (error) {
    console.error('[Ash] Erro ao analisar contexto:', error.message);
    res.status(500).json({ error: 'Falha ao analisar contexto do usuário' });
  }
});

// POST /ai/ash/message - Chat com Ash
router.post('/ash/message', async (req, res) => {
  try {
    const { userId, message, history } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ error: 'userId e message são obrigatórios' });
    }

    const result = await runChatWithBilling(userId, null, message, history || [], { mode: 'holistic_chat' });


    res.json({
      success: true,
      response: result.response || result.message,
      actions: result.actions || [],
      contextUsed: true,
    });
  } catch (error) {
    console.error('[Ash] Erro no chat:', error.message);
    res.status(500).json({ error: 'Falha ao processar mensagem do Ash' });
  }
});

// GET /ai/holistic-analysis - Análise holística (energia + mood + diários + astrologia)
router.get('/holistic-analysis', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    const language = req.query.language || 'pt';

    if (!userId) {
      return res.status(400).json({ error: 'userId é obrigatório' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const energyCheckins = await db
      .select()
      .from(schema.energyCheckins)
      .where(and(eq(schema.energyCheckins.userId, userId), gte(schema.energyCheckins.createdAt, today)))
      .orderBy(desc(schema.energyCheckins.createdAt));

    const energyData =
      energyCheckins.length > 0
        ? {
            physical: energyCheckins[0].physical || 3,
            mental: energyCheckins[0].mental || 3,
            emotional: energyCheckins[0].emotional || 3,
            spiritual: energyCheckins[0].spiritual || 3,
          }
        : null;

    const astro = new astrologyService.AstrologyService();
    const sunSign = astro.getSunSign();
    const moonPhase = astro.getMoonPhase();

    // 📔 Diários
    const recentDiaries = [];
    const moods = {};
    const tags = {};

    try {
      const diaries = await Promise.race([
        db
          .select()
          .from(schema.papyrusDocuments)
          .where(and(eq(schema.papyrusDocuments.authorId, userId), eq(schema.papyrusDocuments.documentType, 'diary')))
          .orderBy(desc(schema.papyrusDocuments.createdAt))
          .limit(3),
        new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 2000)),
      ]);

      diaries.forEach((diary) => {
        if (diary.mood) moods[diary.mood] = (moods[diary.mood] || 0) + 1;
        if (diary.tags) {
          try {
            const t = Array.isArray(diary.tags) ? diary.tags : JSON.parse(diary.tags || '[]');
            t.forEach((tag) => (tags[tag] = (tags[tag] || 0) + 1));
          } catch (e) {}
        }
      });

      recentDiaries.push(...diaries);
    } catch (e) {
      console.warn('[Holistic Analysis] Diários indisponíveis:', e.message);
    }

    // 🔴 CICLO MENSTRUAL
    let menstrualData = null;
    try {
      if (schema.menstrualCycles) {
        const [latestCycle] = await db
          .select()
          .from(schema.menstrualCycles)
          .where(eq(schema.menstrualCycles.userId, userId))
          .orderBy(desc(schema.menstrualCycles.startDate))
          .limit(1);

        if (latestCycle) {
          const dayOfCycle = differenceInDays(new Date(), new Date(latestCycle.startDate)) + 1;
          let phase = 'unknown';

          if (dayOfCycle <= 5) phase = 'menstrual';
          else if (dayOfCycle <= 13) phase = 'folicular';
          else if (dayOfCycle <= 16) phase = 'ovulatory';
          else phase = 'luteal';

          menstrualData = { dayOfCycle, phase, startDate: latestCycle.startDate };
        }
      }
    } catch (e) {
      console.warn('[Holistic Analysis] Ciclo menstrual indisponível:', e.message);
    }

    res.json({
      success: true,
      energy: energyData,
      astrology: {
        sunSign: sunSign.sign,
        element: sunSign.element,
        moonPhase: moonPhase.phase,
      },
      diaries: {
        total: recentDiaries.length,
        moodDistribution: moods,
        topTags: Object.entries(tags)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([tag, count]) => ({ tag, count })),
      },
      menstrualCycle: menstrualData,
      language,
    });
  } catch (error) {
    console.error('[Holistic Analysis] Error:', error.message);
    res.status(500).json({ error: 'Falha ao analisar contexto holístico' });
  }
});

// ============================================================================
// FASE 1: ENDPOINTS HOLISTIC ANALYSIS (SUB-SERVIÇOS)
// ============================================================================

// GET /api/ai/holistic-analysis/insights - Análise semanal
router.get('/holistic-analysis/insights', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    const insights = await holisticAnalysis.generateInsights(userId);
    res.json({ success: true, data: insights });
  } catch (error) {
    console.error('[Insights] Error:', error.message);
    res.status(500).json({ error: 'Falha ao gerar insights' });
  }
});

// POST /api/ai/holistic-analysis/suggestions - Sugestões personalizadas do Ash
router.post('/holistic-analysis/suggestions', async (req, res) => {
  try {
    const userId = req.user?.id || req.body?.userId;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    const suggestions = await holisticAnalysis.generateAshSuggestions(userId);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    console.error('[Suggestions] Error:', error.message);
    res.status(500).json({ error: 'Falha ao gerar sugestões' });
  }
});

// GET /api/ai/holistic-analysis/correlations - Correlações entre dados
router.get('/holistic-analysis/correlations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    const correlations = await holisticAnalysis.analyzeCorrelations(userId);
    res.json({ success: true, data: correlations });
  } catch (error) {
    console.error('[Correlations] Error:', error.message);
    res.status(500).json({ error: 'Falha ao analisar correlações' });
  }
});

// GET /api/ai/sankalpa-daily - Gera Sankalpa motivacional diário
router.get('/sankalpa-daily', async (req, res) => {
  try {
    const userId = req.user?.id || req.query.userId;
    if (!userId) return res.status(400).json({ error: 'userId é obrigatório' });

    const sankalpaData = await holisticAnalysis.generateDailySankalpa(userId);
    res.json({ success: true, data: sankalpaData });
  } catch (error) {
    console.error('[Sankalpa] Error:', error.message);
    res.status(500).json({
      error: 'Falha ao gerar Sankalpa',
      fallback: 'Permita-se estar presente neste momento.',
    });
  }
});

export default router;
