/**
 * OrganicStageRenderer.jsx
 * 
 * Renderiza as 5 fases de maturação orgânica como SVG animados.
 * Solo → Semente → Broto → Crescimento → Colheita
 */

import React from 'react';
import { motion } from 'framer-motion';

// Fase 1: SOLO (0-5%) - Torrão de terra com raízes
const SoloStage = ({ progress, biome }) => {
  const biomeColors = {
    nascente: { soil: '#4d342c', root: '#ffffff', glow: '#0ea5e9' },
    floresta: { soil: '#4d342c', root: '#e8f5e9', glow: '#2e7d32' },
    sertao: { soil: '#78350f', root: '#f5deb3', glow: '#f97316' },
    ventos: { soil: '#5a4a42', root: '#e0f2fe', glow: '#0284c7' },
    cosmos: { soil: '#3f3553', root: '#f3e8ff', glow: '#a855f7' }
  };
  
  const colors = biomeColors[biome] || biomeColors.floresta;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
    >
      {/* Torrão principal */}
      <motion.ellipse
        cx="50"
        cy="60"
        rx="35"
        ry="25"
        fill={colors.soil}
        animate={{ 
          y: [0, -2, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 0.8,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      {/* Textura de solo */}
      <motion.g opacity={0.6}>
        <circle cx="30" cy="55" r="3" fill={colors.root} />
        <circle cx="45" cy="70" r="2" fill={colors.root} />
        <circle cx="65" cy="60" r="2.5" fill={colors.root} />
        <circle cx="50" cy="75" r="2" fill={colors.root} />
      </motion.g>
      
      {/* Raízes brancas */}
      <motion.line
        x1="50" y1="85"
        x2="35" y2="95"
        stroke={colors.root}
        strokeWidth="2"
        animate={{ 
          pathLength: [0, 1],
          opacity: [0.5, 1]
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      />
      <motion.line
        x1="50" y1="85"
        x2="50" y2="100"
        stroke={colors.root}
        strokeWidth="2"
        animate={{ 
          pathLength: [0, 1],
          opacity: [0.5, 1]
        }}
        transition={{ duration: 1.2, delay: 0.2, repeat: Infinity }}
      />
      <motion.line
        x1="50" y1="85"
        x2="65" y2="95"
        stroke={colors.root}
        strokeWidth="2"
        animate={{ 
          pathLength: [0, 1],
          opacity: [0.5, 1]
        }}
        transition={{ duration: 1.2, delay: 0.4, repeat: Infinity }}
      />
      
      {/* Glow ao redor */}
      <motion.circle
        cx="50"
        cy="60"
        r="38"
        fill="none"
        stroke={colors.glow}
        strokeWidth="1"
        opacity="0.3"
        animate={{ r: [38, 42, 38] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.svg>
  );
};

// Fase 2: SEMENTE (6-20%) - Núcleo de luz com casca
const SementeStage = ({ progress, biome }) => {
  const biomeColors = {
    nascente: { core: '#0ea5e9', shell: '#0369a1', glow: '#0ea5e9' },
    floresta: { core: '#22c55e', shell: '#15803d', glow: '#16a34a' },
    sertao: { core: '#ef4444', shell: '#991b1b', glow: '#f87171' },
    ventos: { core: '#3b82f6', shell: '#1e40af', glow: '#60a5fa' },
    cosmos: { core: '#d946ef', shell: '#7c3aed', glow: '#c084fc' }
  };
  
  const colors = biomeColors[biome] || biomeColors.floresta;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial={{ scale: 0.7 }}
      animate={{ scale: 1 }}
    >
      {/* Glow externo */}
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill={colors.glow}
        opacity="0.2"
        animate={{ r: [40, 45, 40] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Casca geométrica */}
      <motion.circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke={colors.shell}
        strokeWidth="3"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />
      
      {/* Núcleo de luz */}
      <motion.circle
        cx="50"
        cy="50"
        r="20"
        fill={colors.core}
        animate={{ 
          r: [20, 22, 20],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 1,
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />
      
      {/* Pontos de luz dentro */}
      <motion.circle
        cx="50"
        cy="30"
        r="3"
        fill="#ffffff"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.circle
        cx="60"
        cy="50"
        r="2.5"
        fill="#ffffff"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
      />
    </motion.svg>
  );
};

// Fase 3: BROTO (21-50%) - Hastes que crescem
const BrotoStage = ({ progress, biome, focusTime = 0 }) => {
  const biomeColors = {
    nascente: { stem: '#0ea5e9', leaf: '#06b6d4', particle: '#0ea5e9' },
    floresta: { stem: '#22c55e', leaf: '#16a34a', particle: '#86efac' },
    sertao: { stem: '#dc2626', leaf: '#b91c1c', particle: '#fca5a5' },
    ventos: { stem: '#3b82f6', leaf: '#1e40af', particle: '#93c5fd' },
    cosmos: { stem: '#d946ef', leaf: '#a855f7', particle: '#f0e7fe' }
  };
  
  const colors = biomeColors[biome] || biomeColors.floresta;
  const stemHeight = Math.min(60, 20 + focusTime * 0.5); // Cresce com foco

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial={{ scale: 0.6 }}
      animate={{ scale: 1 }}
    >
      {/* Hastes principais */}
      <motion.line
        x1="35"
        y1="80"
        x2="35"
        y2={80 - stemHeight * 0.8}
        stroke={colors.stem}
        strokeWidth="3"
        animate={{ 
          y2: [80 - stemHeight * 0.8, 80 - stemHeight * 0.8 - 2, 80 - stemHeight * 0.8],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      <motion.line
        x1="65"
        y1="80"
        x2="65"
        y2={80 - stemHeight}
        stroke={colors.stem}
        strokeWidth="3"
        animate={{ 
          y2: [80 - stemHeight, 80 - stemHeight - 3, 80 - stemHeight],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 0.6, delay: 0.1, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      {/* Folhas/Pétalas no topo */}
      {stemHeight > 25 && (
        <>
          {/* Folha esquerda */}
          <motion.path
            d={`M 35 ${80 - stemHeight * 0.8 - 10} Q 25 ${80 - stemHeight * 0.8 - 20} 20 ${80 - stemHeight * 0.8 - 15}`}
            stroke={colors.leaf}
            strokeWidth="2"
            fill="none"
            animate={{ 
              rotate: [0, 5, 0],
              originX: '35px',
              originY: `${80 - stemHeight * 0.8 - 10}px`
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
          
          {/* Folha direita */}
          <motion.path
            d={`M 65 ${80 - stemHeight - 10} Q 75 ${80 - stemHeight - 20} 80 ${80 - stemHeight - 15}`}
            stroke={colors.leaf}
            strokeWidth="2"
            fill="none"
            animate={{ 
              rotate: [0, -5, 0],
              originX: '65px',
              originY: `${80 - stemHeight - 10}px`
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          />
        </>
      )}
      
      {/* Partículas de crescimento */}
      {[...Array(3)].map((_, i) => (
        <motion.circle
          key={i}
          cx={30 + i * 20}
          cy={70}
          r="2"
          fill={colors.particle}
          animate={{
            y: [-20, -40],
            opacity: [1, 0]
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.3,
            repeat: Infinity
          }}
        />
      ))}
    </motion.svg>
  );
};

// Fase 4: CRESCIMENTO (51-90%) - Árvore/Coral com galhos
const CrescimentoStage = ({ progress, biome, subtaskCount = 2 }) => {
  const biomeColors = {
    nascente: { trunk: '#0ea5e9', branch: '#06b6d4', leaf: '#0369a1' },
    floresta: { trunk: '#16a34a', branch: '#22c55e', leaf: '#15803d' },
    sertao: { trunk: '#dc2626', branch: '#ef4444', leaf: '#991b1b' },
    ventos: { trunk: '#1e40af', branch: '#3b82f6', leaf: '#0284c7' },
    cosmos: { trunk: '#7c3aed', branch: '#d946ef', leaf: '#a855f7' }
  };
  
  const colors = biomeColors[biome] || biomeColors.floresta;
  const branchCount = Math.min(subtaskCount, 4);

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
    >
      {/* Tronco principal */}
      <motion.rect
        x="45"
        y="40"
        width="10"
        height="40"
        fill={colors.trunk}
        animate={{ 
          scaleY: [0.9, 1, 0.9],
          opacity: [0.9, 1, 0.9]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      {/* Galhos que crescem com subtarefas */}
      {[...Array(branchCount)].map((_, i) => (
        <motion.g key={i}>
          {/* Galho */}
          <motion.line
            x1="50"
            y1={65 - i * 15}
            x2={50 + (i % 2 === 0 ? 15 : -15)}
            y2={55 - i * 15}
            stroke={colors.branch}
            strokeWidth="3"
            animate={{ 
              pathLength: [0, 1],
              opacity: [0.6, 1]
            }}
            transition={{ 
              duration: 0.8,
              delay: i * 0.2
            }}
          />
          
          {/* Folhas no galho */}
          {[...Array(2)].map((_, j) => (
            <motion.circle
              key={`leaf-${i}-${j}`}
              cx={50 + (i % 2 === 0 ? 15 : -15) + (j === 0 ? -3 : 3)}
              cy={55 - i * 15 + (j === 0 ? -2 : 2)}
              r="3"
              fill={colors.leaf}
              animate={{ 
                r: [3, 4, 3],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 1.2,
                delay: i * 0.2 + j * 0.1,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            />
          ))}
        </motion.g>
      ))}
      
      {/* Coroa da árvore (folhas ao topo) */}
      <motion.circle
        cx="50"
        cy="35"
        r="18"
        fill={colors.leaf}
        opacity="0.6"
        animate={{ 
          r: [18, 20, 18],
          opacity: [0.5, 0.7, 0.5]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
    </motion.svg>
  );
};

// Fase 5: COLHEITA (91-100%) - Árvore adulta com frutos dourados
const ColheitaStage = ({ progress, biome, completedSubtasks = 0 }) => {
  const biomeColors = {
    nascente: { coral: '#0ea5e9', fruit: '#facc15', aura: '#0ea5e9' },
    floresta: { coral: '#16a34a', fruit: '#facc15', aura: '#16a34a' },
    sertao: { coral: '#dc2626', fruit: '#facc15', aura: '#f97316' },
    ventos: { coral: '#1e40af', fruit: '#facc15', aura: '#3b82f6' },
    cosmos: { coral: '#7c3aed', fruit: '#fbbf24', aura: '#d946ef' }
  };
  
  const colors = biomeColors[biome] || biomeColors.floresta;

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-full h-full"
      initial={{ scale: 0.4 }}
      animate={{ scale: 1 }}
    >
      {/* Aura externa */}
      <motion.circle
        cx="50"
        cy="50"
        r="45"
        fill={colors.aura}
        opacity="0.15"
        animate={{ 
          r: [45, 50, 45],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Tronco */}
      <rect x="45" y="50" width="10" height="35" fill={colors.coral} />
      
      {/* Galhos principais */}
      <line x1="50" y1="55" x2="30" y2="45" stroke={colors.coral} strokeWidth="3" />
      <line x1="50" y1="60" x2="70" y2="50" stroke={colors.coral} strokeWidth="3" />
      <line x1="50" y1="65" x2="25" y2="65" stroke={colors.coral} strokeWidth="2.5" />
      <line x1="50" y1="70" x2="75" y2="70" stroke={colors.coral} strokeWidth="2.5" />
      
      {/* Coroa de folhas */}
      <motion.circle
        cx="50"
        cy="35"
        r="22"
        fill={colors.coral}
        opacity="0.7"
        animate={{ 
          r: [22, 25, 22]
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
      />
      
      {/* Frutos dourados */}
      {[...Array(Math.min(completedSubtasks, 8))].map((_, i) => (
        <motion.circle
          key={i}
          cx={50 + Math.cos((i / 8) * Math.PI * 2) * 20}
          cy={40 + Math.sin((i / 8) * Math.PI * 2) * 20}
          r="4"
          fill={colors.fruit}
          animate={{ 
            scale: [0.9, 1.1, 0.9],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 1.2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
    </motion.svg>
  );
};

// Componente principal
export const OrganicStageRenderer = ({ 
  organic_stage = 'solo', 
  progress = 0, 
  biome = 'floresta',
  focusTime = 0,
  subtaskCount = 0,
  completedSubtasks = 0
}) => {
  const stages = {
    solo: SoloStage,
    semente: SementeStage,
    broto: BrotoStage,
    crescimento: CrescimentoStage,
    colheita: ColheitaStage
  };

  const StageComponent = stages[organic_stage] || stages.solo;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <StageComponent 
        progress={progress}
        biome={biome}
        focusTime={focusTime}
        subtaskCount={subtaskCount}
        completedSubtasks={completedSubtasks}
      />
    </div>
  );
};

export default OrganicStageRenderer;
