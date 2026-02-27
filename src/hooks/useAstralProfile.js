import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/api/apiClient';

/**
 * @hook useAstralProfile
 * @description Busca e gerencia o perfil astrológico do usuário
 * Inclui: Mapa natal, análise de transitos de hoje, interpretações personalizadas
 */
export function useAstralProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [skyAnalysis, setSkyAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch o perfil astrológico do usuário
  const fetchProfile = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await apiClient.get('/astral-profiles', {
        params: { userId }
      });
      setProfile(response.data);
      setError(null);
    } catch (err) {
      console.error('[useAstralProfile] Erro ao buscar perfil:', err);
      setProfile(null);
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Fetch análise do céu de hoje comparado com mapa natal
  const fetchSkyAnalysis = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await apiClient.get('/astral-profiles/sky-analysis', {
        params: { userId }
      });
      setSkyAnalysis(response.data);
    } catch (err) {
      console.error('[useAstralProfile] Erro ao buscar análise:', err);
      setSkyAnalysis(null);
    }
  }, [userId]);

  // Fetch carta completa com todas as posições planetárias
  const fetchFullChart = useCallback(async () => {
    if (!userId) return;
    
    try {
      const response = await apiClient.get('/astral-profiles/chart', {
        params: { userId }
      });
      return response.data;
    } catch (err) {
      console.error('[useAstralProfile] Erro ao buscar carta:', err);
      return null;
    }
  }, [userId]);

  // Gerar/atualizar documento astral (cria arquivo no sistema)
  const generateAstralDocument = useCallback(async () => {
    if (!userId) return null;
    
    try {
      const response = await apiClient.get('/astral-profiles/document', {
        params: { userId }
      });
      return response.data;
    } catch (err) {
      console.error('[useAstralProfile] Erro ao gerar documento:', err);
      return null;
    }
  }, [userId]);

  // Executa no mount
  useEffect(() => {
    fetchProfile();
    fetchSkyAnalysis();
  }, [fetchProfile, fetchSkyAnalysis]);

  return {
    profile,
    skyAnalysis,
    loading,
    error,
    refetch: fetchProfile,
    refetchAnalysis: fetchSkyAnalysis,
    fetchFullChart,
    generateAstralDocument
  };
}
