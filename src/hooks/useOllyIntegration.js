/**
 * src/hooks/useOllyIntegration.js
 * 
 * Hook customizado para facilitar integração do Olly em componentes
 */

import { useOlly } from '@/contexts/OllyContext';
import { useCallback, useState } from 'react';

/**
 * Hook que fornece funções helper para integração do Olly
 */
export const useOllyIntegration = () => {
  const olly = useOlly();
  const [cache, setCache] = useState({});

  /**
   * Analisa uma campanha completamente
   */
  const analyzeCampaign = useCallback(async (campaignId) => {
    if (cache[campaignId]) {
      return cache[campaignId];
    }

    try {
      const analysis = await olly.createAnalysis(campaignId, 'comprehensive');
      const optimizations = await olly.getOptimizations(campaignId);

      const result = {
        analysis,
        optimizations,
        timestamp: Date.now()
      };

      setCache(prev => ({
        ...prev,
        [campaignId]: result
      }));

      return result;
    } catch (error) {
      console.error('Erro na análise da campanha:', error);
      throw error;
    }
  }, [olly, cache]);

  /**
   * Chat com contexto de campanha
   */
  const chatWithContext = useCallback(async (message, campaignId) => {
    try {
      // Se não houver sessão ativa, iniciar uma
      if (!olly.currentSession) {
        await olly.startSession({ campaignId });
      }

      const response = await olly.chat(message);
      return response;
    } catch (error) {
      console.error('Erro no chat:', error);
      throw error;
    }
  }, [olly]);

  /**
   * Aplica todas as otimizações de uma campanha
   */
  const applyAllOptimizations = useCallback(async (optimizations) => {
    const results = [];

    for (const opt of optimizations) {
      try {
        const result = await olly.applyOptimization(opt.id);
        results.push({ id: opt.id, success: true, result });
      } catch (error) {
        results.push({ id: opt.id, success: false, error });
      }
    }

    return results;
  }, [olly]);

  /**
   * Limpa o cache
   */
  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  return {
    ...olly,
    analyzeCampaign,
    chatWithContext,
    applyAllOptimizations,
    clearCache
  };
};

export default useOllyIntegration;
