/**
 * useBiomeMonitor.js
 * 
 * Hook que monitora mudanças de energia em tempo real e aciona
 * atualizações automáticas de bioma com recomendações do Ash.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useBiomeContext } from '@/contexts/BiomeContext';
import { decideBiomeFromCheckIn } from '@/ai_services/biomeEngine';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

/**
 * Mapeia animal para emoji/nome legível
 */
const ANIMAL_NAMES = {
  beija_flor: '🐦 Beija-flor',
  baleia: '🐋 Baleia',
  elefante: '🐘 Elefante',
  onca: '🐆 Onça-Pintada',
  sabia: '🐦 Sabiá-Laranjeira',
  coruja: '🦉 Coruja-Buraqueira',
};

/**
 * Mapeia bioma para mensagens personalizadas do Ash
 */
const BIOME_MESSAGES = {
  agua: {
    nascente: [
      'Detectei que você está em criatividade baixa. Recomendo a Nascente para fluir com tranquilidade e reconectar com a fonte.',
      'Seu mental está pedindo uma pausa. Vá para a Nascente - as águas ancestrais vão restaurar seu fluxo criativo.',
      'Sinto que você precisa de flow. A Nascente é perfeita para elevar sua criatividade com leveza.',
    ],
    oceano: [
      'Você está em uma jornada emocional profunda. O Oceano convidará sua baleia interior a explorar as profundezas.',
      'Detectei que você precisa de compreensão emocional. Vá para o Oceano e deixe a sabedoria da Baleia guiar você.',
      'Seu espírito está buscando integração. O Oceano é onde você encontrará paz na profundidade.',
    ],
  },
  floresta: [
    'Você está pronto para foco profundo! A Floresta com o Elefante vai ancorar sua mente e potencializar seu trabalho.',
    'Detectei alta capacidade mental. Recomendo a Floresta para grounding e deep work focado.',
    'Seu potencial está elevado. A Floresta te oferecerá a força e estabilidade do Elefante para criar com fundação sólida.',
  ],
  sertao: [
    'Urgência e ação! A Sertão é onde você vai canalizar toda sua energia com a força da Onça-Pintada.',
    'Detectei que você está em execução alta. Recomendo o Sertão para transformar essa urgência em ação criativa.',
    'Seu fogo está aceso! Vá para o Sertão e deixe a Onça canalizar sua potência em movimento.',
  ],
  ventos: [
    'Sua estratégia está clara. Os Ventos amplificarão sua visão com a perspectiva da Sabiá-Laranjeira.',
    'Detectei planejamento inteligente. Recomendo os Ventos para elevar sua perspectiva estratégica.',
    'Você está em altitude de visão. Os Ventos com a Sabiá vão clarear seu caminho adiante.',
  ],
  cosmos: [
    'Seu espírito está em busca de integração. O Cosmos convida você a um encontro com a Coruja-Buraqueira para autoconhecimento.',
    'Detectei que você precisa voltar. O Cosmos é o espaço de contemplação e volta a si mesmo.',
    'É hora de repouso sagrado. O Cosmos e a Coruja oferecem a integração que você busca.',
  ],
};

/**
 * Hook principal
 */
export const useBiomeMonitor = () => {
  const { updateBiome, setRecommendation, updateMood } = useBiomeContext();
  const lastEnergyRef = useRef(null);
  const biomeChangeTimeoutRef = useRef(null);

  /**
   * Processa uma mudança de energia e atualiza bioma se necessário
   */
  const processEnergyChange = useCallback(
    (energyState) => {
      if (!energyState) return;

      // Calcula novo bioma baseado em estado de energia
      const newBiome = decideBiomeFromCheckIn(energyState);

      // Atualiza bioma
      updateBiome(newBiome);

      // Gera mensagem do Ash baseada no bioma
      const biomeName = newBiome.subBiome || newBiome.biome;
      const messages =
        BIOME_MESSAGES[newBiome.biome]?.[newBiome.subBiome] ||
        BIOME_MESSAGES[newBiome.biome] ||
        BIOME_MESSAGES.agua.nascente;

      const randomMessage =
        messages[Math.floor(Math.random() * messages.length)];
      const animalName = ANIMAL_NAMES[newBiome.animal] || newBiome.animal;

      const fullMessage = `${randomMessage}\n\n✨ Seu guia: ${animalName}`;

      // Exibe recomendação do Ash
      setRecommendation(fullMessage, true);

      // Log para debug
      console.log('[Biome Monitor] Bioma atualizado:', {
        biome: newBiome.biome,
        subBiome: newBiome.subBiome,
        animal: newBiome.animal,
        energyState,
      });

      lastEnergyRef.current = energyState;
    },
    [updateBiome, setRecommendation]
  );

  /**
   * Monitora mudanças de energia a partir do check-in
   */
  useEffect(() => {
    // Aqui você integraria com seu sistema de check-in
    // Por enquanto, criamos um listener global para eventos de check-in
    
    const handleCheckInUpdate = (event) => {
      if (event.detail?.energyState) {
        // Debounce: evita múltiplas atualizações em sequência rápida
        if (biomeChangeTimeoutRef.current) {
          clearTimeout(biomeChangeTimeoutRef.current);
        }

        biomeChangeTimeoutRef.current = setTimeout(() => {
          processEnergyChange(event.detail.energyState);
        }, 500);
      }
    };

    window.addEventListener('prana:energy-update', handleCheckInUpdate);

    return () => {
      window.removeEventListener('prana:energy-update', handleCheckInUpdate);
      if (biomeChangeTimeoutRef.current) {
        clearTimeout(biomeChangeTimeoutRef.current);
      }
    };
  }, [processEnergyChange]);

  /**
   * Monitora atividades do usuário para ajustar mood
   */
  useEffect(() => {
    const handleTaskCompletion = (event) => {
      if (event.detail?.completed) {
        updateMood('success');
        setTimeout(() => updateMood('idle'), 3000);
      }
    };

    const handleTaskStart = (event) => {
      if (event.detail?.started) {
        updateMood('active');
      }
    };

    window.addEventListener('prana:task-completed', handleTaskCompletion);
    window.addEventListener('prana:task-started', handleTaskStart);

    return () => {
      window.removeEventListener('prana:task-completed', handleTaskCompletion);
      window.removeEventListener('prana:task-started', handleTaskStart);
    };
  }, [updateMood]);

  return {
    processEnergyChange,
  };
};

export default useBiomeMonitor;
