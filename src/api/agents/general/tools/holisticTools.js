/* src/api/agents/general/tools/holisticTools.js
   desc: Adaptador de Energia, Intenção e Sistemas Orgânicos (Swarm V12).
   feat: 
    - Criação e Gestão do Sankalpa (Intenção do Ciclo).
    - Leitura Profunda do Contexto Holístico (Energy Check-ins V3, Diários com Estados Emocionais, Ciclo Menstrual).
*/

import { db } from '../../../../db/index.js';
import * as schema from '../../../../db/schema.js';
import { eq, and, desc, gte } from 'drizzle-orm';
import { createId } from '../../../../utils/id.js';
import { differenceInDays } from 'date-fns';

// ============================================================================
// 1. GESTÃO DE SANKALPA (A Intenção / Metas)
// ============================================================================

export const open_sankalpa_form = {
  declaration: {
    name: 'open_sankalpa_form',
    description: 'Abre o formulário visual na tela para o Herói escrever ou gerenciar o seu Sankalpa (Intenção principal/Meta).',
    parameters: {
      type: 'OBJECT',
      properties: {
        action: { type: 'STRING', enum: ['create', 'edit'] }
      },
    },
  },
  handler: async () => {
    return {
      success: true,
      message: 'A abrir o Santuário de Intenções (Sankalpa) na tela.',
      client_action: { 
        type: 'OPEN_SANKALPA_MODAL'
      },
    };
  },
};

export const set_sankalpa = {
  declaration: {
    name: 'set_sankalpa',
    description: 'Define um novo Sankalpa (Intenção ou Meta) diretamente no banco de dados do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        realmId: { type: 'STRING', enum: ['personal', 'professional'] },
        title: { type: 'STRING', description: 'A frase de intenção ou meta principal' },
        description: { type: 'STRING' },
        projectId: { type: 'STRING', description: 'ID do projeto associado (opcional)' },
        metric: { type: 'STRING', description: 'Unidade de medida (ex: %, kg, dias, receita)' },
        targetValue: { type: 'STRING', description: 'Valor alvo a alcançar' },
        deadline: { type: 'STRING', description: 'Data limite (ISO string)' },
        pillars: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Pilares de vida afetados' }
      },
      required: ['userId', 'title', 'realmId'],
    },
  },
  handler: async (args) => {
    try {
      const newSankalpa = {
        id: createId('sank'),
        userId: args.userId,
        realmId: args.realmId || 'personal',
        projectId: args.projectId || null,
        title: args.title,
        description: args.description || null,
        status: 'ativo',
        metric: args.metric || '%',
        targetValue: args.targetValue || null,
        currentValue: '0',
        deadline: args.deadline ? new Date(args.deadline) : null,
        isCompleted: false,
        pillars: args.pillars || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await db.insert(schema.sankalpas).values(newSankalpa);
      return { 
        success: true, 
        message: `Sankalpa "${args.title}" plantado com sucesso no reino ${newSankalpa.realmId}.` 
      };
    } catch (error) {
      return { success: false, error: `Falha ao definir o Sankalpa: ${error.message}` };
    }
  },
};

// ============================================================================
// 2. CONTEXTO HOLÍSTICO (Energia V3, Diários Emocionais, Ciclo Menstrual)
// ============================================================================

export const analyze_holistic_context = {
  declaration: {
    name: 'analyze_holistic_context',
    description: 'Analisa o contexto orgânico do utilizador (energia, diários recentes, estados emocionais e ciclo menstrual) para adaptar a resposta e gerar insights.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING', description: 'ID do utilizador' },
        language: { type: 'STRING', enum: ['pt', 'en', 'es'] },
      },
      required: ['userId'],
    },
  },
  handler: async (args) => {
    try {
      const { userId, language = 'pt' } = args;
      const lang = language || 'pt';

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // 🔋 1. Energia do Dia (V3: Triple Check-in)
      const energyCheckins = await db
        .select()
        .from(schema.energyCheckIns)
        .where(and(eq(schema.energyCheckIns.userId, userId), gte(schema.energyCheckIns.createdAt, today)))
        .orderBy(desc(schema.energyCheckIns.recordedAt));

      let currentEnergy = null;
      if (energyCheckins.length > 0) {
        const latest = energyCheckins[0];
        currentEnergy = {
          timeOfDay: latest.timeOfDay,
          type: latest.energyType,
          intensity: latest.energyIntensity, // 1 a 5
        };
      }

      // 📔 2. Diários Noturnos Recentes (diary_entries)
      const recentDiaries = await db
        .select()
        .from(schema.diaryEntries)
        .where(eq(schema.diaryEntries.userId, userId))
        .orderBy(desc(schema.diaryEntries.entryDate))
        .limit(5);

      const emotionalCounts = {};
      for (const diary of recentDiaries) {
        if (diary.emotionalStates && Array.isArray(diary.emotionalStates)) {
          diary.emotionalStates.forEach((state) => {
            emotionalCounts[state] = (emotionalCounts[state] || 0) + 1;
          });
        }
      }

      const insightTexts = {
        pt: {
          lowEnergy: 'Sua energia detectada hoje está muito baixa. Considere preservar-se ou fazer atividades restauradoras.',
          highEnergy: 'Você registrou alta intensidade de energia hoje! Excelente momento para o Deep Work.',
          anxious: 'Notei um padrão de ansiedade ou stress nos seus diários recentes. Respire fundo e faça pausas.',
          grateful: 'Você tem cultivado muita gratidão recentemente. Isso fortalece o campo mental!',
          menstrual: 'Fase menstrual: descanso, introspecção e cuidado são prioridades.',
          folicular: 'Fase folicular: ótimo para iniciar novos projetos e explorar criatividade.',
          ovulatory: 'Fase ovulatória: energia expansiva, ideal para comunicação e colaboração.',
          luteal: 'Fase lútea: momento de consolidação, organização e desaceleração.',
        }
      };
      const msgs = insightTexts['pt'];
      const insights = [];

      if (currentEnergy) {
        if (currentEnergy.intensity <= 2) insights.push(msgs.lowEnergy);
        else if (currentEnergy.intensity >= 4) insights.push(msgs.highEnergy);
      }

      if (emotionalCounts['ansioso'] >= 2 || emotionalCounts['estressado'] >= 2) insights.push(msgs.anxious);
      if (emotionalCounts['grato'] >= 2 || emotionalCounts['alegre'] >= 2) insights.push(msgs.grateful);

      // 🔴 3. CICLO MENSTRUAL
      let cycleInfo = null;
      try {
        const [latestCycle] = await db
          .select()
          .from(schema.menstrualCycles)
          .where(eq(schema.menstrualCycles.userId, userId))
          .orderBy(desc(schema.menstrualCycles.startDate))
          .limit(1);

        if (latestCycle) {
          const dayOfCycle = differenceInDays(new Date(), new Date(latestCycle.startDate)) + 1;
          let phase = 'unknown';
          let phaseInsight = '';

          if (dayOfCycle <= 5) { phase = 'menstrual'; phaseInsight = msgs.menstrual; }
          else if (dayOfCycle <= 13) { phase = 'folicular'; phaseInsight = msgs.folicular; }
          else if (dayOfCycle <= 16) { phase = 'ovulatory'; phaseInsight = msgs.ovulatory; }
          else { phase = 'luteal'; phaseInsight = msgs.luteal; }

          cycleInfo = { dayOfCycle, phase };
          insights.push(phaseInsight);
        }
      } catch (e) {
        console.warn('[analyze_holistic_context] Falha ou ausência de ciclo menstrual.');
      }

      return {
        success: true,
        analysis: {
          currentEnergy,
          recentEmotionalStates: emotionalCounts,
          recentDiariesCount: recentDiaries.length,
          menstrualCycle: cycleInfo,
          insights,
        },
      };
    } catch (error) {
      return { success: false, error: `Falha ao analisar contexto holístico: ${error.message}` };
    }
  },
};