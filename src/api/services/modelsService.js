/* src/api/services/modelsService.js
   desc: Serviço de seleção de modelos de IA baseado no plano do usuário.
*/

export const modelsService = {
  /**
   * Obtém o modelo apropriado para um agente específico
   */
  async getModelForAgent(userId, agentId) {
    try {
      if (!userId || !agentId) return this.getDefaultModel();
      
      // TODO: Implementar lógica real baseada em plano do usuário
      console.log(`[ModelsService] Selecionando modelo para agente '${agentId}' do usuário '${userId}'`);
      
      return {
        name: 'gpt-4-turbo',
        provider: 'openai',
        maxTokens: 4096,
        costPerThousandTokens: 0.01
      };
    } catch (error) {
      console.error('[ModelsService] Erro ao selecionar modelo:', error);
      return this.getDefaultModel();
    }
  },

  /**
   * Obtém um modelo "rápido" (mais barato) para processamento
   */
  async getFastModel(userId) {
    try {
      if (!userId) return this.getDefaultFastModel();
      
      // TODO: Implementar lógica real baseada em plano
      console.log(`[ModelsService] Selecionando modelo rápido para usuário '${userId}'`);
      
      return {
        name: 'gpt-3.5-turbo',
        provider: 'openai',
        maxTokens: 2048,
        costPerThousandTokens: 0.0005
      };
    } catch (error) {
      console.error('[ModelsService] Erro ao selecionar modelo rápido:', error);
      return this.getDefaultFastModel();
    }
  },

  /**
   * Obtém o modelo padrão
   */
  getDefaultModel() {
    return {
      name: 'gpt-4-turbo',
      provider: 'openai',
      maxTokens: 4096,
      costPerThousandTokens: 0.01
    };
  },

  /**
   * Obtém o modelo rápido padrão
   */
  getDefaultFastModel() {
    return {
      name: 'gpt-3.5-turbo',
      provider: 'openai',
      maxTokens: 2048,
      costPerThousandTokens: 0.0005
    };
  },

  /**
   * Lista os modelos disponíveis
   */
  async getAvailableModels(userId) {
    return [
      { name: 'gpt-4-turbo', provider: 'openai' },
      { name: 'gpt-3.5-turbo', provider: 'openai' },
      { name: 'gemini-2.5-flash', provider: 'google' },
    ];
  }
};
