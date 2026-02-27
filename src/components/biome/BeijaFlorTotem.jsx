/* canvas: src/components/biome/BeijaFlorTotem.jsx
   desc: BeijaFlorJoia — Cinematográfico com Filtros Realistas
   style: Luz Sagrada, Movimento Orgânico, Texturas Naturais
*/
import React from 'react';
import { motion } from 'framer-motion';

const RealisticFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="bfOrganicNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" seed="2" />
        <feDisplacementMap in="SourceGraphic" scale="2" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="bfGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="bfJoiaGrad" cx="40%" cy="40%">
        <stop offset="0%" stopColor="#86efac" />
        <stop offset="50%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#065f46" />
      </radialGradient>
      <radialGradient id="bfAsa" cx="50%" cy="20%">
        <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#047857" stopOpacity="0.4" />
      </radialGradient>
    </defs>
  </svg>
);

export function BeijaFlorTotem({ className = "w-24 h-24", mood = "idle" }) {
  const isActive = mood === 'active';

  return (
    <>
      <RealisticFilters />
      <motion.div
        className={`relative ${className}`}
        animate={{
          y: isActive ? [0, -60, 0] : [0, -30, 0],
          x: [-10, 20, -10],
          rotate: isActive ? [0, 15, -15, 0] : [0, 5, -5, 0]
        }}
        transition={{
          duration: isActive ? 3 : 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full filter drop-shadow-[0_15px_30px_rgba(16,185,129,0.4)]">
          {/* Asas com movimento realista */}
          <motion.g
            animate={{ rotateZ: [-45, 45, -45] }}
            transition={{ duration: 0.08, repeat: Infinity }}
            style={{ transformOrigin: '120px 120px' }}
          >
            {/* Asa direita */}
            <ellipse
              cx="150"
              cy="110"
              rx="45"
              ry="25"
              fill="url(#bfAsa)"
              filter="url(#bfGlow)"
              opacity="0.85"
            />
            {/* Asa esquerda */}
            <ellipse
              cx="90"
              cy="110"
              rx="45"
              ry="25"
              fill="url(#bfAsa)"
              opacity="0.75"
              transform="scale(-1 1) translate(-240 0)"
            />
          </motion.g>

          {/* Corpo principal */}
          <g filter="url(#bfOrganicNoise)">
            {/* Cabeça */}
            <circle cx="120" cy="95" r="14" fill="url(#bfJoiaGrad)" />
            {/* Pescoço */}
            <ellipse cx="120" cy="110" rx="10" ry="12" fill="url(#bfJoiaGrad)" />
            {/* Corpo */}
            <ellipse cx="120" cy="135" rx="16" ry="22" fill="url(#bfJoiaGrad)" />
            {/* Cauda longa elegante */}
            <path
              d="M 120 157 Q 125 180 115 200 Q 110 210 105 200 Q 115 185 120 157"
              fill="#047857"
              opacity="0.8"
            />
          </g>

          {/* Bico */}
          <path
            d="M 130 95 L 165 93 L 165 97 L 130 99 Z"
            fill="#b45309"
            filter="url(#bfGlow)"
          />

          {/* Olho com luz */}
          <g>
            <circle cx="128" cy="92" r="3" fill="#1f2937" />
            <circle cx="129" cy="91" r="1.2" fill="#fbbf24" />
          </g>

          {/* Aura energética */}
          {isActive && (
            <motion.circle
              cx="120"
              cy="120"
              r="80"
              fill="none"
              stroke="#10b981"
              strokeWidth="1"
              opacity={0}
              animate={{ r: [70, 110], opacity: [0.4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </svg>
      </motion.div>
    </>
  );
}

export default BeijaFlorTotem;
