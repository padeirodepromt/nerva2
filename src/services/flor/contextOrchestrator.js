/* Camada 1: RAG & Chat (Memória Curta)
  Camada 2: Base de Conhecimento (Nexus/PDFs)
  Camada 3: BrandCode (A Constituição)
  Camada 4: Flor Identity (A Persona)
  Camada 5: Especialização (O Camaleão - Dimensões 1 a N)
*/

export const ContextOrchestrator = {
  async buildSintonia({ taskId, projectId, customDimensions = [] }) {
    // 1. Busca o BrandCode (Layer 3)
    const brandCode = await BrandCodeAPI.getEffectiveBrandCode(projectId);
    
    // 2. Busca Conhecimento Técnico no Nexus (Layer 2)
    const knowledgeBase = await NexusAPI.getTaskReferences(taskId);

    // 3. Monta as Camadas de Especialização (Layer 5)
    // Aqui aceitamos N dimensões: Expertise, Objetivo, Lugar, Gatilho, etc.
    const specializationPrompt = customDimensions.map(dim => 
      `${dim.key.toUpperCase()}: ${dim.value}`
    ).join('\n');

    return {
      systemPrompt: `
        [IDENTITY: FLOR]
        ${florVoiceSpec()} // Humildade ativa, informalidade elegante.

        [CONSTITUTION: BRANDCODE]
        ${JSON.stringify(brandCode.dna)}

        [TACTICAL LAYERS: SPECIALIZATION]
        ${specializationPrompt}

        [KNOWLEDGE BASE: REFERENTIALS]
        ${knowledgeBase.map(k => k.summary).join('\n')}
        
        [INSTRUCTION]
        Sintonize sua resposta cruzando o DNA com as Camadas Táticas. 
        O TrendCode está em standby (Fase Futura).
      `
    };
  }
};