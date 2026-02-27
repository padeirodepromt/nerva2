/**
 * src/contexts/OllyContext.jsx
 * 
 * Context e Provider para integração do Olly com Prana
 * Gerencia sessões, análises e otimizações de campanhas
 */

import React, { createContext, useContext, useState, useCallback } from 'react';

const OllyContext = createContext();

export const OllyProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [messages, setMessages] = useState([]);

  const ollyApiUrl = import.meta.env.VITE_OLLY_API_URL || 'https://gracious-hope-production.up.railway.app';

  /**
   * Inicia uma nova sessão com Olly
   */
  const startSession = useCallback(async (metadata = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ollyApiUrl}/api/sessions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        },
        body: JSON.stringify({ metadata })
      });

      if (!response.ok) throw new Error('Falha ao iniciar sessão');

      const session = await response.json();
      setCurrentSession(session);
      setMessages([]);

      return session;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Envia mensagem para Olly e obtém resposta
   */
  const chat = useCallback(async (message) => {
    if (!currentSession) {
      throw new Error('Nenhuma sessão ativa');
    }

    try {
      setIsLoading(true);
      setError(null);

      // Adicionar mensagem do usuário localmente
      const userMessage = {
        id: `msg_${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);

      // Enviar para Olly
      const response = await fetch(`${ollyApiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        },
        body: JSON.stringify({
          sessionId: currentSession.id,
          message,
          context: {
            campaigns: campaigns.slice(0, 5) // Últimas 5 campanhas
          }
        })
      });

      if (!response.ok) throw new Error('Falha na comunicação com Olly');

      const data = await response.json();

      // Adicionar resposta de Olly
      const assistantMessage = {
        id: data.id,
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        metadata: data.metadata
      };

      setMessages(prev => [...prev, assistantMessage]);

      return assistantMessage;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, campaigns, ollyApiUrl]);

  /**
   * Analisa um arquivo de campanha
   */
  const analyzeFile = useCallback(async (file, platform) => {
    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('platform', platform);

      const response = await fetch(`${ollyApiUrl}/api/analyze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        },
        body: formData
      });

      if (!response.ok) throw new Error('Falha na análise');

      const analysis = await response.json();
      return analysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Obtém campanhas do usuário
   */
  const getCampaigns = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ollyApiUrl}/api/campaigns`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        }
      });

      if (!response.ok) throw new Error('Falha ao obter campanhas');

      const data = await response.json();
      setCampaigns(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Cria análise para uma campanha
   */
  const createAnalysis = useCallback(async (campaignId, analysisType) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ollyApiUrl}/api/analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        },
        body: JSON.stringify({
          campaignId,
          analysisType
        })
      });

      if (!response.ok) throw new Error('Falha na análise');

      const analysis = await response.json();
      return analysis;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Obtém otimizações sugeridas para uma campanha
   */
  const getOptimizations = useCallback(async (campaignId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ollyApiUrl}/api/optimizations/${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        }
      });

      if (!response.ok) throw new Error('Falha ao obter otimizações');

      const optimizations = await response.json();
      return optimizations;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Aplica uma otimização sugerida
   */
  const applyOptimization = useCallback(async (optimizationId) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ollyApiUrl}/api/optimizations/${optimizationId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        }
      });

      if (!response.ok) throw new Error('Falha ao aplicar otimização');

      const result = await response.json();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [ollyApiUrl]);

  /**
   * Finaliza a sessão atual
   */
  const endSession = useCallback(async () => {
    if (!currentSession) return;

    try {
      setIsLoading(true);

      await fetch(`${ollyApiUrl}/api/sessions/${currentSession.id}/end`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        }
      });

      setCurrentSession(null);
      setMessages([]);
    } catch (err) {
      console.error('Erro ao finalizar sessão:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentSession, ollyApiUrl]);

  const value = {
    // State
    isLoading,
    error,
    currentSession,
    campaigns,
    messages,

    // Methods
    startSession,
    chat,
    analyzeFile,
    getCampaigns,
    createAnalysis,
    getOptimizations,
    applyOptimization,
    endSession
  };

  return (
    <OllyContext.Provider value={value}>
      {children}
    </OllyContext.Provider>
  );
};

/**
 * Hook para usar Olly em qualquer componente
 */
export const useOlly = () => {
  const context = useContext(OllyContext);
  if (!context) {
    throw new Error('useOlly deve ser usado dentro de <OllyProvider>');
  }
  return context;
};
