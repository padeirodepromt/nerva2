/**
 * MODELS CONFIGURATION & ROUTING (2026)
 * O "Cérebro" que decide qual modelo usar baseado em Custo x Benefício x Contexto.
 */

export const AI_MODELS = {
    // --- TIER 1: VELOCIDADE & EFICIÊNCIA (Low Cost, Low Latency) ---
    // Uso: Resumos rápidos, classificação, chat simples, extração de dados.
    FAST: {
        GEMINI: "gemini-3.0-flash", // Padrão de velocidade e contexto
        OPENAI: "gpt-4.1-mini",     // Série 4.1 (2026 Standard)
    },

    // --- TIER 2: RACIOCÍNIO & PROFUNDIDADE (High IQ, Complex Reasoning) ---
    // Uso: Planejamento estratégico, coding complexo, análise astrológica profunda.
    SMART: {
        GEMINI: "gemini-3.0-pro",   // Raciocínio avançado do Google
        OPENAI: "gpt-5",            // Fronteira da inteligência (OpenAI)
    }
};

/**
 * SUSTAINABLE ROUTER:
 * Analisa o contexto e decide o modelo mais eficiente.
 * @param {string} allowedTier - O tier máximo que o plano do usuário permite ('FAST' ou 'SMART')
 * @param {string} taskComplexity - 'SIMPLE' | 'STANDARD' | 'COMPLEX' | 'CREATIVE'
 * @param {object} providerPreference - { google: boolean, openai: boolean }
 */
export const selectBestModel = (allowedTier, taskComplexity = 'STANDARD', providerPreference = { google: true, openai: true }) => {
    // 1. Definição do Tier Alvo (Sustentabilidade)
    // Se a tarefa é simples, forçamos FAST mesmo que o usuário seja SMART.
    // Isso economiza recursos e latência.
    let targetTier = 'FAST';
    
    // Apenas subimos para SMART se o usuário puder E a tarefa exigir
    if (allowedTier === 'SMART') {
        if (['COMPLEX', 'CREATIVE', 'DEEP_REASONING'].includes(taskComplexity)) {
            targetTier = 'SMART';
        }
    }

    // 2. Seleção do Modelo Específico dentro do Tier
    // Lógica de fallback: Tenta atender a preferência, mas garante um modelo válido.
    
    let selectedModel = null;
    let selectedProvider = null;

    // Se estamos no tier SMART
    if (targetTier === 'SMART') {
        if (providerPreference.openai) {
            selectedModel = AI_MODELS.SMART.OPENAI; // GPT-5
            selectedProvider = 'openai';
        } else {
            selectedModel = AI_MODELS.SMART.GEMINI; // Gemini 3 Pro
            selectedProvider = 'google';
        }
    } 
    // Se estamos no tier FAST (Padrão ou forçado por simplicidade)
    else {
        if (providerPreference.openai && !providerPreference.google) {
             selectedModel = AI_MODELS.FAST.OPENAI; // GPT-4.1-mini
             selectedProvider = 'openai';
        } else {
             // Gemini 3 Flash é o nosso "Cavalo de Batalha" padrão
             selectedModel = AI_MODELS.FAST.GEMINI; 
             selectedProvider = 'google';
        }
    }

    return {
        id: selectedModel,
        tier: targetTier,
        provider: selectedProvider,
        reasoning: `Selected ${targetTier} tier for ${taskComplexity} task.`
    };
};