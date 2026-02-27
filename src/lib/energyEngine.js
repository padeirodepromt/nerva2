/* src/lib/energyEngine.js
   desc: Motor de Sincronização Bio-Digital V9.0 (Prana Energy System).
   feat: Moeda EP (Energy Points), Orçamento Energético e Paleta Neutra.
*/

// ============================================================================
// 1. CONSTANTES & TABELAS DE CONVERSÃO (EP)
// ============================================================================

// Custo de Demanda por Nível (V9.0 Spec)
export const ENERGY_COSTS_EP = {
    1: 5,  // Automático (2-5 EP) -> Padronizado 5
    2: 10, // Leve
    3: 20, // Moderado
    4: 35, // Intenso
    5: 50  // Drenante
};

// Fallback: Se a tarefa não tiver Nível (1-5), estimamos pela Prioridade
const PRIORITY_TO_LEVEL_FALLBACK = {
    urgent: 5, // Drenante
    high: 4,   // Intenso
    medium: 2, // Leve/Moderado (Conservador)
    low: 1,    // Automático
    none: 1
};

// Modificadores de Eficiência por Tipo de Energia (Supply Modifiers)
const ENERGY_TYPE_MODIFIERS = {
    foco_profundo:   { supply: 1.2, focus: 1.3, social: 0.7 },
    criativo:        { supply: 1.1, focus: 0.9, social: 1.1 },
    administrativo:  { supply: 0.9, focus: 1.0, social: 0.8 },
    estrategico:     { supply: 1.1, focus: 1.2, social: 1.0 },
    colaborativo:    { supply: 1.0, focus: 0.8, social: 1.3 },
    social:          { supply: 1.0, focus: 0.6, social: 1.5 },
    restaurador:     { supply: 0.7, focus: 0.8, social: 0.7 }, 
    introspectivo:   { supply: 0.8, focus: 1.1, social: 0.5 },
    fisico:          { supply: 1.3, focus: 0.7, social: 1.0 }
};

// Modificadores Emocionais Sincronizados (V9.0 Spec)
const EMOTIONAL_MODIFIERS = {
    // Positivos (Boost)
    joy: 1.15,
    gratitude: 1.1,
    confidence: 1.1,
    focus: 1.2,
    calm: 1.05,
    
    // Neutro
    neutral: 1.0,

    // Drenantes (Taxa de ineficiência)
    anxiety: 0.7, 
    confusion: 0.8,
    sadness: 0.6,
    stress: 0.5
};

// ============================================================================
// 2. CÁLCULO DE OFERTA (SUPPLY) - O USUÁRIO
// ============================================================================

/**
 * Calcula os Energy Points (EP) disponíveis para o dia.
 * Fórmula: (Checkin_Intensity * 20) * Modificadores
 */
export const calculateSupply = (checkin, diaryDeltas = [], cosmicModifiers = {}, cycleData = null) => {
    if (!checkin) return 50; // Estado médio padrão (50 EP)

    // 1. Base: Conversão 1-5 para 20-100 EP
    const intensityScore = checkin.energyIntensity || 3;
    const baseEP = intensityScore * 20;
    
    // 2. Modificador do Tipo de Energia Ativa
    const typeMod = ENERGY_TYPE_MODIFIERS[checkin.energyType]?.supply || 1.0;
    
    // 3. Modificador Emocional
    const emotionalStates = checkin.emotionalStates || [];
    let emotionalMod = 1.0;
    
    if (emotionalStates.length > 0) {
        // Média dos modificadores emocionais
        const totalMod = emotionalStates.reduce((acc, state) => {
            // Normaliza string (ex: 'Alegre' -> 'joy' se necessário, ou usa direto se o banco já estiver em EN)
            const key = state.toLowerCase();
            return acc + (EMOTIONAL_MODIFIERS[key] || EMOTIONAL_MODIFIERS[state] || 1.0);
        }, 0);
        emotionalMod = totalMod / emotionalStates.length;
    }

    // 4. Modificador Ciclo (Bio-Ritmo)
    let cycleMod = 1.0;
    if (cycleData) {
        // Lógica simplificada: Fase Folicular/Ovulatória (Boost) vs Lútea/Menstrual (Recolhimento)
        // Isso deve ser refinado conforme o módulo de ciclo
        const day = cycleData.dayOfCycle;
        if (day >= 6 && day <= 16) cycleMod = 1.1; // Estrogênio alto
        if (day >= 25 || day <= 5) cycleMod = 0.9; // Progesterona/Baixa
    }

    // 5. Modificador Astral (Cosmic Weather)
    const astralMod = (cosmicModifiers.physical || 1.0);

    // Cálculo Final
    let finalEP = (baseEP * typeMod * emotionalMod * cycleMod * astralMod);
    
    // Adiciona bônus/ônus manuais do diário (Deltas)
    const totalDeltas = diaryDeltas.reduce((acc, curr) => acc + curr, 0);
    finalEP += totalDeltas;

    // Cap em 100 EP (Reserva Máxima) e Min 0
    return Math.min(Math.max(Math.round(finalEP), 0), 100);
};

// ============================================================================
// 3. CÁLCULO DE DEMANDA (DEMAND) - AS TAREFAS
// ============================================================================

/**
 * Calcula a Carga Total (Demand) do dia em EP.
 * Soma o custo de todas as tarefas ativas para a data.
 */
export const calculateDailyDemand = (tasks, date) => {
    if (!tasks || !Array.isArray(tasks) || !date) return 0;
  
    const targetDateStr = new Date(date).toISOString().split('T')[0];
  
    const totalDemand = tasks.reduce((acc, task) => {
        // Ignorar tarefas sem data, arquivadas, deletadas ou concluídas (opcional: somar concluídas para histórico)
        if (!task.dueDate || task.status === 'archived' || task.deletedAt) return acc;

        // Verifica data
        const taskDateStr = new Date(task.dueDate).toISOString().split('T')[0];
        if (taskDateStr !== targetDateStr) return acc;

        let cost = 0;

        // 1. Prioridade Absoluta: Nível de Energia Definido (1-5 ⚡)
        if (task.energyLevel) {
            // Se energyLevel vier como "high", "medium" (legacy), converte. Se for número, usa direto.
            if (typeof task.energyLevel === 'number') {
                cost = ENERGY_COSTS_EP[task.energyLevel] || 10;
            } else {
                 // Fallback para legacy string levels
                 const levelMap = { 'low': 1, 'medium': 2, 'high': 4, 'urgent': 5 };
                 const lvl = levelMap[task.energyLevel.toLowerCase()] || 2;
                 cost = ENERGY_COSTS_EP[lvl];
            }
        } 
        // 2. Fallback A: Horas Estimadas (Se não tiver nível, 1h = ~10 EP)
        else if (task.estimatedHours && !isNaN(task.estimatedHours)) {
            cost = Math.min(Math.ceil(parseFloat(task.estimatedHours) * 10), 50);
        }
        // 3. Fallback B: Prioridade
        else {
            const p = (task.priority || 'medium').toLowerCase();
            const fallbackLevel = PRIORITY_TO_LEVEL_FALLBACK[p] || 2;
            cost = ENERGY_COSTS_EP[fallbackLevel];
        }

        return acc + cost;
    }, 0);

    return Math.round(totalDemand);
};

// ============================================================================
// 4. UTILITÁRIOS DE ESTADO & UI (NEUTRO)
// ============================================================================

/**
 * Analisa a relação Oferta vs Demanda (Orçamento)
 */
export const getEnergyStatus = (supply, demand) => {
    const safeSupply = supply || 1; 
    const balance = safeSupply - demand;
    
    // Lógica de Saldo V9.0
    if (balance < -10) return { status: 'deficit', label: 'Défice Bio-Digital', color: 'text-zinc-500' }; // Era red
    if (balance < 10)  return { status: 'tight', label: 'Limite Operacional', color: 'text-zinc-400' };
    if (balance > 40)  return { status: 'surplus', label: 'Excesso Disponível', color: 'text-zinc-600' }; // Era blue
    
    return { status: 'balanced', label: 'Sincronizado', color: 'text-zinc-800 dark:text-zinc-200' }; // Era emerald
};

/**
 * Retorna classes CSS neutras para o Dashboard
 * Minimiza cores, usa escala de cinza/zinc.
 */
export const getEnergyColorClass = (level) => {
    // Normaliza para escala 1-5 se vier 0-100
    const normalized = level > 5 ? level / 20 : level;
    
    // Prana V9 Neutral System
    if (normalized >= 4) return 'bg-zinc-800 dark:bg-zinc-100'; // Pico (Forte contraste)
    if (normalized >= 3) return 'bg-zinc-500 dark:bg-zinc-400'; // Médio
    if (normalized >= 2) return 'bg-zinc-300 dark:bg-zinc-600'; // Baixo
    return 'bg-zinc-200 dark:bg-zinc-700';                      // Crítico (quase invisível/desabilitado)
};

export const getEnergyLabel = (level) => {
    const normalized = level > 5 ? level / 20 : level;
    if (normalized >= 4.5) return 'Pico';
    if (normalized >= 3.5) return 'Alto';
    if (normalized >= 2.5) return 'Nominal';
    if (normalized >= 1.5) return 'Baixo';
    return 'Reserva';
};

/**
 * Recomendações de Arquétipo
 */
export const getRecommendedArchetype = (energyType, cosmicTransit) => {
    if (cosmicTransit?.moonSign === 'Virgo' || cosmicTransit?.moonSign === 'Capricorn') {
        return 'foco_profundo';
    }
    if (cosmicTransit?.mercuryRetrograde) {
        return 'administrativo'; // Revisão sugerida
    }
    return energyType;
};