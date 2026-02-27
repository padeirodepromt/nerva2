/* src/api/agents/packages/neural/socraticLoop.js */
export const SocraticLoop = {
  /**
   * 🧠 REFINAR: Ciclo de Síntese -> Crítica -> Síntese Final.
   */
  async process(initialSynthesis, criticPersona, originalPrompt) {
    console.log('🔄 [Socratic] Iniciando Ciclo de Dúvida...');

    // 1. O Crítico avalia a primeira versão
    const critiquePrompt = `
      Você é um Crítico Impiedoso (${criticPersona}). 
      Analise a resposta abaixo em relação ao prompt original. 
      Aponte falhas, omissões, clichês e falta de profundidade.
      
      PROMPT ORIGINAL: "${originalPrompt}"
      RESPOSTA ATUAL: "${initialSynthesis}"
    `;
    
    const doubts = await contextEngine.fastInvoke(critiquePrompt);

    // 2. O Agente reconstrói com base na dúvida
    const finalSynthesisPrompt = `
      Reescreva sua resposta original considerando as seguintes críticas:
      "${doubts}"
      
      Sua meta é a perfeição técnica e absoluta completude.
      RESPOSTA ORIGINAL: "${initialSynthesis}"
    `;

    return await contextEngine.fastInvoke(finalSynthesisPrompt);
  }
};