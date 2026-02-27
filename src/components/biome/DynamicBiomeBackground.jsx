/**
 * DynamicBiomeBackground.jsx
 * 
 * Renderiza o bioma apropriado como background baseado no estado de energia.
 * Integra com BiomeContext para mudanças em tempo real.
 */

import React, { Suspense } from 'react';
import { useBiomeContext } from '@/contexts/BiomeContext';
import { motion } from 'framer-motion';

// Importa os biomas cinematográficos
const FruitForestCinematic = React.lazy(() =>
  import('@/components/biome/FruitForestCinematic')
);
const RiverNacenteCinematic = React.lazy(() =>
  import('@/components/biome/RiverNacenteCinematic')
);
const OceanCinematic = React.lazy(() =>
  import('@/components/biome/OceanCinematic')
);

/**
 * Fallback de carregamento
 */
const BiomeLoader = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
    <div className="text-white/40 text-sm font-mono">Conectando com o bioma...</div>
  </div>
);

/**
 * Wrapper que gerencia transições entre biomas
 */
const BiomeTransitionWrapper = ({ children, biomeKey }) => {
  return (
    <motion.div
      key={biomeKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0"
    >
      {children}
    </motion.div>
  );
};

/**
 * Renderiza o bioma apropriado baseado no contexto
 */
const BiomeRenderer = ({ biome, subBiome, mood }) => {
  const biomeKey = subBiome ? `${biome}_${subBiome}` : biome;

  switch (biome) {
    case 'agua':
      if (subBiome === 'nascente') {
        return (
          <BiomeTransitionWrapper biomeKey={biomeKey}>
            <Suspense fallback={<BiomeLoader />}>
              <RiverNacenteCinematic mood={mood} />
            </Suspense>
          </BiomeTransitionWrapper>
        );
      } else if (subBiome === 'oceano') {
        return (
          <BiomeTransitionWrapper biomeKey={biomeKey}>
            <Suspense fallback={<BiomeLoader />}>
              <OceanCinematic mood={mood} />
            </Suspense>
          </BiomeTransitionWrapper>
        );
      }
      // Default to nascente
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <Suspense fallback={<BiomeLoader />}>
            <RiverNacenteCinematic mood={mood} />
          </Suspense>
        </BiomeTransitionWrapper>
      );

    case 'floresta':
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <Suspense fallback={<BiomeLoader />}>
            <FruitForestCinematic mood={mood} />
          </Suspense>
        </BiomeTransitionWrapper>
      );

    case 'sertao':
      // TODO: Implementar CerradoCinematic com Onça-Pintada
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-800 via-orange-700 to-rose-800 opacity-80" />
        </BiomeTransitionWrapper>
      );

    case 'ventos':
      // TODO: Implementar VentosCinematic com Sabiá-Laranjeira
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-cyan-100 to-blue-200 opacity-50" />
        </BiomeTransitionWrapper>
      );

    case 'cosmos':
      // TODO: Implementar CosmosCinematic com Coruja-Buraqueira
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black opacity-80" />
        </BiomeTransitionWrapper>
      );

    default:
      // Default to água/nascente
      return (
        <BiomeTransitionWrapper biomeKey={biomeKey}>
          <Suspense fallback={<BiomeLoader />}>
            <RiverNacenteCinematic mood={mood} />
          </Suspense>
        </BiomeTransitionWrapper>
      );
  }
};

/**
 * Componente principal: DynamicBiomeBackground
 * 
 * Props:
 * - className: Classes Tailwind adicionais
 * - asOverlay: Se true, renderiza como overlay fixo (não interfere com conteúdo)
 */
export const DynamicBiomeBackground = ({ className = '', asOverlay = true }) => {
  const { currentBiome, mood, showBiomeBackground } = useBiomeContext();

  // Renderizar apenas quando recomendado
  if (!showBiomeBackground) {
    return null;
  }

  const wrapperClasses = asOverlay
    ? 'fixed inset-0 -z-50 pointer-events-none'
    : 'absolute inset-0 -z-50';

  return (
    <div className={`${wrapperClasses} ${className} overflow-hidden`}>
      <BiomeRenderer
        biome={currentBiome.biome}
        subBiome={currentBiome.subBiome}
        mood={mood}
      />
    </div>
  );
};

export default DynamicBiomeBackground;
