// src/ai_services/ritualDetectionService.js
// Detecta rituais automáticos baseado em padrões de energia + estados emocionais

import { db } from '../db/index.js';
import { energyCheckIns, diaryEntries, rituals } from '../db/schema/energy.js';
import { tasks } from '../db/schema/core.js';
import { eq, and, gte } from 'drizzle-orm';

/**
 * Detecta rituais automaticamente após padrão consistente (14+ dias)
 * 
 * Ritual = Sequência de energias + emoções que se repetem
 * Ex: Todas as manhãs = foco_profundo → à tarde = administrativo → à noite = calmo + grato
 */

class RitualDetectionService {
  constructor() {
    this.MIN_DAYS_FOR_DETECTION = 14; // 2 semanas de padrão
    this.DETECTION_THRESHOLD = 0.70; // 70% de confiança
    this.MIN_FREQUENCY = 0.50; // Aparecer em 50%+ dos dias
  }

  /**
   * Executa detecção completa para um usuário
   * Roda em background após cada nova entrada
   */
  async detectRitualsForUser(userId) {
    try {
      // 1. Buscar últimos 30 dias de check-ins
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const checkIns = await db
        .select()
        .from(energyCheckIns)
        .where(
          and(
            eq(energyCheckIns.userId, userId),
            gte(energyCheckIns.createdAt, thirtyDaysAgo)
          )
        )
        .orderBy(energyCheckIns.createdAt);

      if (checkIns.length < this.MIN_DAYS_FOR_DETECTION * 2) {
        console.log(`[RitualDetection] Usuário ${userId}: Dados insuficientes (${checkIns.length} check-ins)`);
        return { detected: false, reason: 'insufficient_data' };
      }

      // 2. Buscar diário entries correspondentes
      const diaryData = await db
        .select()
        .from(diaryEntries)
        .where(
          and(
            eq(diaryEntries.userId, userId),
            gte(diaryEntries.createdAt, thirtyDaysAgo)
          )
        )
        .orderBy(diaryEntries.createdAt);

      // 3. Agrupar por dia
      const dailyPatterns = this._groupByDay(checkIns, diaryData);

      // 4. Detectar padrões recorrentes
      const patterns = this._findRecurringPatterns(dailyPatterns);

      // 5. Criar rituais detectados
      const newRituals = [];
      for (const pattern of patterns) {
        if (pattern.detectionScore >= this.DETECTION_THRESHOLD) {
          const ritual = await this._createOrUpdateRitual(userId, pattern);
          if (ritual) {
            newRituals.push(ritual);
          }
        }
      }

      return {
        detected: newRituals.length > 0,
        ritualsCreated: newRituals.length,
        rituals: newRituals,
        patterns: patterns
      };
    } catch (error) {
      console.error('[RitualDetection] Erro:', error);
      return { detected: false, error: error.message };
    }
  }

  /**
   * Agrupa check-ins e diários por dia
   */
  _groupByDay(checkIns, diaryEntries) {
    const dayMap = new Map();

    // Agrupar check-ins por dia
    checkIns.forEach((checkIn) => {
      const dayKey = new Date(checkIn.createdAt).toISOString().split('T')[0];
      if (!dayMap.has(dayKey)) {
        dayMap.set(dayKey, {
          date: dayKey,
          morning: null,
          afternoon: null,
          evening: null,
          diaryEntry: null
        });
      }

      const day = dayMap.get(dayKey);
      if (checkIn.timeOfDay === 'morning') {
        day.morning = checkIn;
      } else if (checkIn.timeOfDay === 'afternoon') {
        day.afternoon = checkIn;
      }
    });

    // Adicionar diários
    diaryEntries.forEach((diary) => {
      const dayKey = new Date(diary.createdAt).toISOString().split('T')[0];
      if (dayMap.has(dayKey)) {
        dayMap.get(dayKey).evening = diary;
      }
    });

    return Array.from(dayMap.values());
  }

  /**
   * Detecta padrões recorrentes
   */
  _findRecurringPatterns(dailyPatterns) {
    const patterns = {};

    dailyPatterns.forEach((day) => {
      if (day.morning || day.afternoon) {
        const patternKey = this._createPatternKey(day);
        if (patternKey) {
          if (!patterns[patternKey]) {
            patterns[patternKey] = {
              morning: day.morning?.energyType,
              morningIntensity: day.morning?.energyIntensity,
              afternoon: day.afternoon?.energyType,
              afternoonIntensity: day.afternoon?.energyIntensity,
              evening: day.evening?.emotionalStates || [],
              occurrences: 0,
              days: []
            };
          }
          patterns[patternKey].occurrences += 1;
          patterns[patternKey].days.push(day.date);
        }
      }
    });

    // Calcular scores
    const totalDays = dailyPatterns.length;
    return Object.entries(patterns)
      .map(([key, pattern]) => {
        const frequency = pattern.occurrences / totalDays;
        const consistency = this._calculateConsistency(pattern.days);
        
        return {
          patternKey: key,
          morningEnergy: pattern.morning,
          morningIntensity: pattern.morningIntensity,
          afternoonEnergy: pattern.afternoon,
          afternoonIntensity: pattern.afternoonIntensity,
          eveningStates: pattern.evening,
          frequency: frequency,
          consistency: consistency,
          occurrences: pattern.occurrences,
          detectionScore: (frequency * 0.6) + (consistency * 0.4),
          lastOccurrence: pattern.days[pattern.days.length - 1],
          days: pattern.days
        };
      })
      .filter((p) => p.frequency >= this.MIN_FREQUENCY)
      .sort((a, b) => b.detectionScore - a.detectionScore);
  }

  /**
   * Calcula consistência do padrão (sem gaps muito grandes)
   */
  _calculateConsistency(days) {
    if (days.length < 2) return 1.0;

    let totalGap = 0;
    let gapCount = 0;

    for (let i = 1; i < days.length; i++) {
      const date1 = new Date(days[i - 1]);
      const date2 = new Date(days[i]);
      const gapDays = (date2 - date1) / (1000 * 60 * 60 * 24);

      if (gapDays <= 7) {
        // Gaps até 1 semana são esperados
        totalGap += gapDays;
        gapCount += 1;
      }
    }

    if (gapCount === 0) return 1.0;

    const avgGap = totalGap / gapCount;
    // Se gap médio é 1 dia = perfeito (1.0)
    // Se gap médio é 7 dias = baixo (0.5)
    return Math.max(0.3, 1 - (avgGap - 1) * 0.1);
  }

  /**
   * Cria chave única para padrão
   */
  _createPatternKey(day) {
    const morning = day.morning?.energyType || 'none';
    const afternoon = day.afternoon?.energyType || 'none';
    const states = (day.evening?.emotionalStates || []).sort().join(',') || 'none';

    return `${morning}|${afternoon}|${states}`;
  }

  /**
   * Cria ou atualiza ritual detectado
   */
  async _createOrUpdateRitual(userId, pattern) {
    try {
      // Verificar se ritual similar já existe
      const existing = await db
        .select()
        .from(rituals)
        .where(
          and(
            eq(rituals.userId, userId),
            eq(rituals.morningEnergy, pattern.morningEnergy || null),
            eq(rituals.afternoonEnergy, pattern.afternoonEnergy || null)
          )
        )
        .limit(1);

      const ritualName = this._generateRitualName(pattern);
      const ritualDescription = this._generateRitualDescription(pattern);

      if (existing.length > 0) {
        // Atualizar existente
        const updated = await db
          .update(rituals)
          .set({
            frequency: `${pattern.occurrences}x em ${pattern.days.length} dias`,
            detectionScore: pattern.detectionScore,
            efficiencyScore: pattern.consistency,
            updatedAt: new Date()
          })
          .where(eq(rituals.id, existing[0].id))
          .returning();

        return updated[0];
      } else {
        // Criar novo
        const newRitual = await db
          .insert(rituals)
          .values({
            userId,
            name: ritualName,
            description: ritualDescription,
            morningEnergy: pattern.morningEnergy,
            afternoonEnergy: pattern.afternoonEnergy,
            eveningStates: pattern.eveningStates,
            frequency: `${pattern.occurrences}x em ${pattern.days.length} dias`,
            detectionScore: pattern.detectionScore,
            efficiencyScore: pattern.consistency,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          })
          .returning();

        return newRitual[0];
      }
    } catch (error) {
      console.error('[RitualDetection] Erro ao criar ritual:', error);
      return null;
    }
  }

  /**
   * Gera nome legível para ritual
   */
  _generateRitualName(pattern) {
    const energyNames = {
      foco_profundo: 'Foco Profundo',
      criativo: 'Criativo',
      administrativo: 'Administrativo',
      estrategico: 'Estratégico',
      colaborativo: 'Colaborativo',
      social: 'Social',
      restaurador: 'Restaurador',
      introspectivo: 'Introspectivo',
      fisico: 'Físico'
    };

    const morning = energyNames[pattern.morningEnergy] || 'Manhã';
    const afternoon = pattern.afternoonEnergy 
      ? ` → ${energyNames[pattern.afternoonEnergy]}`
      : '';

    return `Ritual de ${morning}${afternoon}`;
  }

  /**
   * Gera descrição para ritual
   */
  _generateRitualDescription(pattern) {
    const parts = [];

    if (pattern.morningEnergy) {
      parts.push(`Começa com energia ${pattern.morningEnergy}`);
    }

    if (pattern.afternoonEnergy) {
      parts.push(`transita para ${pattern.afternoonEnergy}`);
    }

    if (pattern.eveningStates && pattern.eveningStates.length > 0) {
      parts.push(`e termina sentindo-se ${pattern.eveningStates.join(', ')}`);
    }

    parts.push(`(${Math.round(pattern.detectionScore * 100)}% confiança)`);

    return parts.join(' ') || 'Padrão detectado';
  }

  /**
   * Calcula eficiência do ritual
   * (baseado em task completion quando ritual está ativo)
   */
  async calculateEfficiency(ritualId) {
    try {
      const ritual = await db
        .select()
        .from(rituals)
        .where(eq(rituals.id, ritualId))
        .limit(1);

      if (ritual.length === 0) return 0;

      const userId = ritual[0].userId;
      const ritualStartDate = new Date(ritual[0].createdAt);
      
      // Buscar tasks completadas durante período do ritual
      const completedTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.ownerId, userId),
            eq(tasks.status, 'completed'),
            gte(tasks.updatedAt, ritualStartDate)
          )
        );

      // Buscar total de tasks do usuário no mesmo período
      const totalTasks = await db
        .select()
        .from(tasks)
        .where(
          and(
            eq(tasks.ownerId, userId),
            gte(tasks.createdAt, ritualStartDate)
          )
        );

      if (totalTasks.length === 0) return ritual[0].efficiencyScore || 0.5;
      
      // Calcular eficiência real baseada em conclusão
      const efficiencyScore = (completedTasks.length / totalTasks.length);
      return Math.min(1, Math.max(0, efficiencyScore));
    } catch (error) {
      console.error('[RitualDetection] Erro ao calcular eficiência:', error);
      return 0;
    }
  }
}

export const ritualDetectionService = new RitualDetectionService();
