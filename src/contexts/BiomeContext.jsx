/**
 * BiomeContext.jsx
 * 
 * Context global para gerenciar estado dos biomas em tempo real.
 * Fornece estado de bioma ativo, recomendação do Ash, e histórico.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const BiomeContext = createContext(null);

export const BiomeProvider = ({ children }) => {
  const [currentBiome, setCurrentBiome] = useState({
    biome: 'agua',
    subBiome: 'nascente',
    animal: 'beija_flor',
    cognitiveCue: 'flow',
  });

  const [ashRecommendation, setAshRecommendation] = useState({
    message: '',
    showNotification: false,
    timestamp: null,
  });

  const [showBiomeBackground, setShowBiomeBackground] = useState(false);

  const [biomeHistory, setBiomeHistory] = useState([]);

  const [mood, setMood] = useState('idle'); // idle | active | success | low_energy

  /**
   * Atualiza o bioma ativo e adiciona ao histórico
   */
  const updateBiome = useCallback((newBiome) => {
    setCurrentBiome((prev) => {
      // Evita atualizar se for o mesmo bioma
      if (
        prev.biome === newBiome.biome &&
        prev.subBiome === newBiome.subBiome &&
        prev.animal === newBiome.animal
      ) {
        return prev;
      }

      // Adiciona ao histórico
      setBiomeHistory((hist) => [
        ...hist.slice(-9), // Mantém últimos 10 itens
        {
          ...prev,
          timestamp: new Date(),
          transitionedFrom: prev.biome,
          transitionedTo: newBiome.biome,
        },
      ]);

      return newBiome;
    });
  }, []);

  /**
   * Define a recomendação do Ash
   */
  const setRecommendation = useCallback((message, autoDismiss = true) => {
    setAshRecommendation({
      message,
      showNotification: true,
      timestamp: new Date(),
    });
    // Mostrar bioma quando houver recomendação
    setShowBiomeBackground(true);

    // Auto-dismiss após 8 segundos se autoDismiss for true
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setAshRecommendation((prev) => ({
          ...prev,
          showNotification: false,
        }));
        // Ocultar bioma quando notificação desaparecer
        setShowBiomeBackground(false);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, []);

  /**
   * Limpa a recomendação do Ash
   */
  const dismissRecommendation = useCallback(() => {
    setAshRecommendation((prev) => ({
      ...prev,
      showNotification: false,
    }));
    // Ocultar bioma quando recomendação for dispensada
    setShowBiomeBackground(false);
  }, []);

  /**
   * Atualiza o mood do mascote
   */
  const updateMood = useCallback((newMood) => {
    setMood(newMood);
  }, []);

  const value = {
    // Estado
    currentBiome,
    ashRecommendation,
    showBiomeBackground,
    biomeHistory,
    mood,

    // Ações
    updateBiome,
    setRecommendation,
    dismissRecommendation,
    updateMood,
  };

  return (
    <BiomeContext.Provider value={value}>{children}</BiomeContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de biomas
 */
export const useBiomeContext = () => {
  const context = useContext(BiomeContext);

  if (!context) {
    throw new Error('useBiomeContext deve ser usado dentro de BiomeProvider');
  }

  return context;
};

export default BiomeContext;
