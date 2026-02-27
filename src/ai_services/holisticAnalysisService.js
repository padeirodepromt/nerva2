/* src/ai_services/holisticAnalysisService.js
   desc: Service de Análise Holística - Insights, Sugestões e Correlações
*/

import { db } from '../db/index.js';
import * as schema from '../db/schema.js';
import { differenceInDays, startOfDay, endOfDay, subDays } from 'date-fns';
import * as chatServiceModule from './chatService.js';

/**
 * Análise de Insights: padrões semanais e recomendações
 */
export async function generateInsights(userId) {
  try {
    const sevenDaysAgo = subDays(new Date(), 7);
    
    // Buscar dados dos últimos 7 dias
    const energyData = await db.select()
      .from(schema.energyCheckins)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    const diaryData = await db.select()
      .from(schema.papyrusDocuments)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    // Calcular médias
    const avgPhysical = energyData.length > 0 
      ? energyData.reduce((sum, e) => sum + (e.physical || 0), 0) / energyData.length 
      : 0;
    
    const avgMental = energyData.length > 0 
      ? energyData.reduce((sum, e) => sum + (e.mental || 0), 0) / energyData.length 
      : 0;

    const avgEmotional = energyData.length > 0 
      ? energyData.reduce((sum, e) => sum + (e.emotional || 0), 0) / energyData.length 
      : 0;

    const avgSpiritual = energyData.length > 0 
      ? energyData.reduce((sum, e) => sum + (e.spiritual || 0), 0) / energyData.length 
      : 0;

    // Detectar padrões
    const patterns = detectPatterns(energyData, diaryData);

    // Trend (comparar com semana anterior)
    const fourteenDaysAgo = subDays(new Date(), 14);
    const previousWeekData = await db.select()
      .from(schema.energyCheckins)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(fourteenDaysAgo) && t.createdAt.lt(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    const previousAvg = previousWeekData.length > 0
      ? previousWeekData.reduce((sum, e) => sum + (e.physical + e.mental + e.emotional + e.spiritual) / 4, 0) / previousWeekData.length
      : 0;

    const currentAvg = (avgPhysical + avgMental + avgEmotional + avgSpiritual) / 4;
    const trend = currentAvg > previousAvg ? '+' : '-';
    const trendPercent = ((currentAvg - previousAvg) / previousAvg * 100).toFixed(1);

    return {
      period: 'weekly',
      summary: {
        physicalEnergy: Math.round(avgPhysical),
        mentalEnergy: Math.round(avgMental),
        emotionalEnergy: Math.round(avgEmotional),
        spiritualEnergy: Math.round(avgSpiritual),
        overallScore: Math.round(currentAvg),
        trend: `${trend}${Math.abs(trendPercent)}%`,
        checkinsCount: energyData.length,
        diariesCount: diaryData.length
      },
      patterns,
      insights: generateInsightMessages(patterns, currentAvg),
      recommendedFocus: getRecommendedFocus(patterns, avgMental, avgEmotional)
    };
  } catch (error) {
    console.error('Erro ao gerar insights:', error);
    return {
      period: 'weekly',
      summary: null,
      patterns: [],
      insights: ['Dados insuficientes para análise'],
      recommendedFocus: []
    };
  }
}

/**
 * Sugestões personalizadas do Ash baseado no contexto
 */
export async function generateAshSuggestions(userId) {
  try {
    // Buscar contexto holístico
    const holisticContext = await chatServiceModule.getHolisticContext(userId);
    
    // Buscar insights
    const insights = await generateInsights(userId);

    // Usar o Ash para gerar sugestões
    const systemPrompt = buildSuggestionPrompt(holisticContext, insights);
    
    // Simular chamada ao Claude (em produção, seria uma chamada real)
    const baseEnergyLevel = typeof holisticContext.energyLevel === 'number' ? holisticContext.energyLevel : 3;

    const suggestions = [
      {
        priority: 'high',
        category: baseEnergyLevel < 3 ? 'rest' : 'action',
        title: getSuggestionTitle(holisticContext, insights),
        description: getSuggestionDescription(holisticContext, insights),
        action: getSuggestedAction(holisticContext, insights),
        emoji: getSuggestionEmoji(holisticContext)
      },
      {
        priority: 'medium',
        category: 'health',
        title: getHealthSuggestionTitle(holisticContext),
        description: getHealthSuggestionDescription(holisticContext),
        action: 'Agenda um check-in de bem-estar',
        emoji: '💪'
      },
      {
        priority: 'low',
        category: 'growth',
        title: getGrowthSuggestionTitle(insights),
        description: getGrowthSuggestionDescription(insights),
        action: 'Explore uma nova prática',
        emoji: '🌱'
      }
    ];

    return {
      timestamp: new Date().toISOString(),
      suggestions,
      context: {
        currentMood: holisticContext.topMood || null,
        energyLevel: baseEnergyLevel,
        menstrualPhase: holisticContext.menstrualCycle?.phase || null,
        astralInfluence: holisticContext.astrology?.moonPhase || null
      }
    };
  } catch (error) {
    console.error('Erro ao gerar sugestões:', error);
    return {
      timestamp: new Date().toISOString(),
      suggestions: [],
      context: {}
    };
  }
}

/**
 * Correlações entre dados holísticos
 */
export async function analyzeCorrelations(userId) {
  try {
    const sevenDaysAgo = subDays(new Date(), 7);
    
    const energyData = await db.select()
      .from(schema.energyCheckins)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    const diaryData = await db.select()
      .from(schema.papyrusDocuments)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    // Correlação: Energia vs Produtividade
    const energyProductivityCorr = calculateCorrelation(
      energyData.map(e => (e.physical + e.mental) / 2),
      energyData.map(e => e.tags?.includes('produtividade') ? 1 : 0)
    );

    // Correlação: Ciclo menstrual vs Energia (se dados disponíveis)
    const moodEnergyCorr = calculateCorrelation(
      energyData.map(e => e.emotional),
      energyData.map(e => e.mental)
    );

    // Padrões de energia
    const energyPattern = analyzeEnergyPattern(energyData);

    return {
      correlations: {
        energyVsProductivity: {
          coefficient: energyProductivityCorr.toFixed(2),
          interpretation: interpretCorrelation(energyProductivityCorr)
        },
        emotionalVsMental: {
          coefficient: moodEnergyCorr.toFixed(2),
          interpretation: interpretCorrelation(moodEnergyCorr)
        }
      },
      patterns: energyPattern,
      dataPoints: energyData.length,
      periodDays: 7
    };
  } catch (error) {
    console.error('Erro ao analisar correlações:', error);
    return {
      correlations: {},
      patterns: [],
      dataPoints: 0,
      periodDays: 7
    };
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function detectPatterns(energyData, diaryData) {
  const patterns = [];

  if (energyData.length === 0) return patterns;

  const avgEnergy = energyData.reduce((sum, e) => sum + (e.physical + e.mental + e.emotional + e.spiritual) / 4, 0) / energyData.length;

  if (avgEnergy < 2) {
    patterns.push({
      type: 'low_energy',
      severity: 'high',
      message: 'Energia geral está baixa esta semana'
    });
  }

  if (avgEnergy > 3.5) {
    patterns.push({
      type: 'high_energy',
      severity: 'low',
      message: 'Excelente semana de energia!'
    });
  }

  const emotionalAvg = energyData.reduce((sum, e) => sum + e.emotional, 0) / energyData.length;
  if (emotionalAvg > 3) {
    patterns.push({
      type: 'positive_mood',
      severity: 'low',
      message: 'Humor positivo detectado'
    });
  }

  return patterns;
}

function generateInsightMessages(patterns, currentAvg) {
  const messages = [];

  patterns.forEach(p => {
    if (p.type === 'low_energy') {
      messages.push('Sua energia ficou abaixo do seu padrão. Traga mais gentileza para o corpo, diminua o ritmo e proteja seus limites nesta semana.');
    }
    if (p.type === 'high_energy') {
      messages.push('Sua semana veio com boa vitalidade. É um bom momento para avançar em um projeto que realmente importa para você.');
    }
    if (p.type === 'positive_mood') {
      messages.push('Seu campo emocional está mais estável e positivo. Apoie isso com pequenos rituais diários que mantenham essa base cuidada.');
    }
  });

  if (messages.length === 0) {
    messages.push('Sua semana está relativamente equilibrada. Mantenha a consistência em pequenos hábitos ao invés de buscar grandes viradas.');
  }

  return messages;
}

function getRecommendedFocus(patterns, avgMental, avgEmotional) {
  const focuses = [];

  if (avgMental < 2.5) focuses.push('focus');
  if (avgEmotional < 2.5) focuses.push('wellbeing');
  if (patterns.some(p => p.type === 'low_energy')) focuses.push('rest');

  return focuses.length > 0 ? focuses : ['balance'];
}

function getSuggestionTitle(holisticContext, insights) {
  if (holisticContext.energyLevel < 2) return 'Priorize Recuperação';
  if (holisticContext.topMood === 'anxiety') return 'Organize o Campo Interno';
  return 'Canalize sua Energia';
}

function getSuggestionDescription(holisticContext, insights) {
  if (holisticContext.energyLevel < 2) {
    return 'Seu sistema está em modo de economia. Reduza demandas, simplifique sua agenda e permita pausas verdadeiras ao longo do dia.';
  }
  if (holisticContext.topMood === 'anxiety') {
    return 'Seu campo mental está mais agitado. Estruture seu dia, escreva o que é prioridade e inclua ao menos um momento de respiração consciente.';
  }
  const trend = insights.summary?.trend || 'bom momento';
  return `Você atravessa um ${trend} na sua energia. Use isso para dar um passo concreto em direção ao que é mais essencial agora.`;
}

function getSuggestedAction(holisticContext, insights) {
  if (holisticContext.energyLevel < 2) {
    return 'Escolha um compromisso para cancelar ou simplificar hoje e troque esse espaço por descanso consciente.';
  }
  return 'Defina uma única tarefa prioritária para hoje e leve sua energia para concluí-la com presença.';
}

function getSuggestionEmoji(holisticContext) {
  if (holisticContext.energyLevel > 3.5) return '';
  if (holisticContext.energyLevel < 2) return '';
  return '';
}

function getHealthSuggestionTitle(holisticContext) {
  return 'Cuidar do Corpo';
}

function getHealthSuggestionDescription(holisticContext) {
  return 'Pequenos movimentos mudam o estado interno. Escolha um gesto simples hoje: caminhar alguns minutos, alongar-se ou respirar fundo antes de trocar de tarefa.';
}

function getGrowthSuggestionTitle(insights) {
  return 'Crescimento em Ritmo Sustentável';
}

function getGrowthSuggestionDescription(insights) {
  return 'Em vez de sobrecarregar sua agenda, escolha uma prática ou estudo que faça sentido para o seu momento e aprofunde um pouco por dia.';
}

function buildSuggestionPrompt(holisticContext, insights) {
  return `Baseado no contexto do usuário, gere sugestões personalizadas...`;
}

function calculateCorrelation(arr1, arr2) {
  if (arr1.length !== arr2.length || arr1.length < 2) return 0;

  const mean1 = arr1.reduce((a, b) => a + b, 0) / arr1.length;
  const mean2 = arr2.reduce((a, b) => a + b, 0) / arr2.length;

  const numerator = arr1.reduce((sum, val, i) => sum + (val - mean1) * (arr2[i] - mean2), 0);
  const denominator = Math.sqrt(
    arr1.reduce((sum, val) => sum + Math.pow(val - mean1, 2), 0) *
    arr2.reduce((sum, val) => sum + Math.pow(val - mean2, 2), 0)
  );

  return denominator === 0 ? 0 : numerator / denominator;
}

function interpretCorrelation(coefficient) {
  const abs = Math.abs(coefficient);
  if (abs > 0.7) return 'Correlação forte';
  if (abs > 0.4) return 'Correlação moderada';
  if (abs > 0.2) return 'Correlação fraca';
  return 'Sem correlação significativa';
}

function analyzeEnergyPattern(energyData) {
  if (energyData.length < 3) return [];

  const patterns = [];

  // Detectar picos e vales
  for (let i = 1; i < energyData.length - 1; i++) {
    const prev = (energyData[i - 1].physical + energyData[i - 1].mental) / 2;
    const curr = (energyData[i].physical + energyData[i].mental) / 2;
    const next = (energyData[i + 1].physical + energyData[i + 1].mental) / 2;

    if (curr > prev && curr > next) {
      patterns.push({
        type: 'peak',
        day: energyData[i].createdAt,
        value: Math.round(curr)
      });
    }
  }

  return patterns;
}

/**
 * Gera um Sankalpa diário (intenção/reflexão motivadora)
 * Baseado em: energia de hoje + moods de hoje + padrões da semana
 */
export async function generateDailySankalpa(userId) {
  try {
    // 1. Pegar energia de hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckins = await db.select()
      .from(schema.energyCheckins)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(today) && t.createdAt.lt(tomorrow))
      .orderBy((t) => t.createdAt);

    const energyLevel = todayCheckins.length > 0 
      ? Math.round((todayCheckins[0].physical + todayCheckins[0].mental + todayCheckins[0].emotional + todayCheckins[0].spiritual) / 4)
      : null;

    // 2. Pegar diários de hoje para mood
    const todayDiaries = await db.select()
      .from(schema.papyrusDocuments)
      .where((t) => t.authorId.eq(userId) && t.documentType.eq('diary') && t.createdAt.gte(today) && t.createdAt.lt(tomorrow))
      .orderBy((t) => t.createdAt);

    const moods = todayDiaries.map(d => d.mood).filter(Boolean);
    const dominantMood = moods.length > 0 ? moods[0] : null;

    // 3. Pegar padrões dos últimos 7 dias
    const sevenDaysAgo = subDays(new Date(), 7);
    const weekData = await db.select()
      .from(schema.energyCheckins)
      .where((t) => t.userId.eq(userId) && t.createdAt.gte(sevenDaysAgo))
      .orderBy((t) => t.createdAt);

    // 4. Analisar tendência
    const avgEnergy = weekData.length > 0
      ? Math.round(weekData.reduce((sum, e) => sum + (e.physical + e.mental + e.emotional + e.spiritual) / 4, 0) / weekData.length)
      : 3;

    // 5. Gerar Sankalpa baseado em contexto
    const sankalpa = generateSankalpByContext({
      todayEnergy: energyLevel,
      dominantMood,
      weekAverageEnergy: avgEnergy,
      checkinsCount: weekData.length,
      diariesCount: todayDiaries.length
    });

    return {
      sankalpa,
      confidence: calculateSankalpConfidence(todayCheckins.length > 0, moods.length > 0),
      context: {
        todayEnergy: energyLevel,
        mood: dominantMood,
        weekTrend: avgEnergy < 3 ? 'declining' : avgEnergy > 3 ? 'rising' : 'stable'
      }
    };
  } catch (error) {
    console.error('Erro ao gerar Sankalpa diário:', error);
    return {
      sankalpa: 'Permita-se estar presente neste momento.',
      confidence: 0.5,
      context: {}
    };
  }
}

/**
 * Gera o texto do Sankalpa baseado no contexto do usuário
 */
function generateSankalpByContext({ todayEnergy, dominantMood, weekAverageEnergy, checkinsCount, diariesCount }) {
  // Contexto: energia de hoje vs média da semana
  const isEnergyLow = todayEnergy && todayEnergy < 2;
  const isEnergyHigh = todayEnergy && todayEnergy > 4;
  const isDeclineWeek = weekAverageEnergy < 3;
  const isGrowthWeek = weekAverageEnergy > 3;

  // Mapear moods para intenções
  const moodToSankalpa = {
    calm: 'Mantenha essa paz consigo mesmo.',
    focus: 'Canalize essa energia em criação.',
    creativity: 'Deixe seu potencial criativo se desdobrar.',
    gratitude: 'Cultive a gratidão neste dia.',
    anxiety: 'Respire fundo. Você é mais forte que isso.',
    sad: 'Permita-se sentir. Isso é parte da jornada.',
    energetic: 'Canaliza essa vitalidade em ação.',
    tired: 'Honre seu corpo. Descanse sem culpa.',
    neutral: 'Um novo dia, novas possibilidades.'
  };

  // Lógica de geração
  if (isEnergyLow && isDeclineWeek) {
    return 'Seu sistema vem pedindo pausa há alguns dias. Hoje, sua intenção é honrar o corpo, reduzir exigências e deixar o descanso ser suficiente.';
  } else if (isEnergyHigh && isGrowthWeek) {
    return 'Sua energia está em expansão. Que sua intenção hoje seja direcionar esse impulso para algo realmente significativo, e não apenas para mais tarefas.';
  } else if (dominantMood) {
    return moodToSankalpa[dominantMood] || 'Sua intenção hoje é reconhecer com honestidade como você está e responder a isso com gentileza, sem se forçar além do necessário.';
  } else if (isDeclineWeek) {
    return 'Os últimos dias pediram bastante de você. Que hoje sua intenção seja recentrar, ajustar expectativas e cuidar do básico com presença.';
  } else if (isGrowthWeek) {
    return 'Você atravessa um ciclo de crescimento. Sua intenção hoje é sustentar esse movimento com ritmo, e não com pressa.';
  } else {
    return 'Sua intenção hoje é simples: estar um pouco mais presente em cada coisa que fizer, respeitando seus limites atuais.';
  }
}

/**
 * Calcula confiança do Sankalpa (0-1)
 * Maior confiança = mais dados disponíveis
 */
function calculateSankalpConfidence(hasCheckIn, hasMoods) {
  let confidence = 0.5; // base
  if (hasCheckIn) confidence += 0.3;
  if (hasMoods) confidence += 0.2;
  return Math.min(confidence, 1);
}

export default {
  generateInsights,
  generateAshSuggestions,
  analyzeCorrelations,
  generateDailySankalpa
};
