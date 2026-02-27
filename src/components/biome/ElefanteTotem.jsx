/* canvas: src/components/biome/ElefanteTotem.jsx
   desc: ElefanteSábio — Cinematográfico com Força Terreal
   style: Serenidade, Sabedoria Ancestral, Movimento Meditativo
*/
import React from 'react';
import { motion } from 'framer-motion';

const FlorestaFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="elefTexture">
        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" />
        <feDisplacementMap in="SourceGraphic" scale="1.8" />
      </filter>
      <filter id="elefGlow" x="-35%" y="-35%" width="170%" height="170%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="elefBody" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#9ca3af" />
        <stop offset="50%" stopColor="#6b7280" />
        <stop offset="100%" stopColor="#4b5563" />
      </linearGradient>
    </defs>
  </svg>
);

export function ElefanteTotem({ className = "w-32 h-32", mood = "idle" }) {
  const isActive = mood === 'active';

  return (
    <>
      <FlorestaFilters />
      <motion.div
        className={`relative ${className}`}
        animate={{
          y: isActive ? [0, -20, 0] : [0, -8, 0],
          x: [0, 3, 0]
        }}
        transition={{
          duration: isActive ? 5 : 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 300 320" className="w-full h-full filter drop-shadow-[0_15px_35px_rgba(75,85,99,0.5)]">
          {/* Corpo robusto principal */}
          <g filter="url(#elefTexture)">
            {/* Corpo */}
            <ellipse cx="150" cy="160" rx="65" ry="80" fill="url(#elefBody)" filter="url(#elefGlow)" />
            {/* Cabeça */}
            <ellipse cx="150" cy="80" rx="45" ry="50" fill="url(#elefBody)" filter="url(#elefGlow)" />
          </g>

          {/* Tromba com movimento ondulante */}
          <motion.path
            d="M 160 130 Q 165 180 160 230 Q 158 250 155 260"
            stroke="url(#elefBody)"
            strokeWidth="18"
            fill="none"
            strokeLinecap="round"
            animate={{
              d: isActive
                ? [
                    "M 160 130 Q 165 180 160 230 Q 158 250 155 260",
                    "M 160 130 Q 170 185 165 235 Q 163 255 160 265",
                    "M 160 130 Q 165 180 160 230 Q 158 250 155 260"
                  ]
                : [
                    "M 160 130 Q 165 180 160 230 Q 158 250 155 260",
                    "M 160 130 Q 160 185 155 230 Q 153 250 150 260",
                    "M 160 130 Q 165 180 160 230 Q 158 250 155 260"
                  ]
            }}
            transition={{
              duration: isActive ? 3 : 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            filter="url(#elefGlow)"
          />

          {/* Orelhas grandes */}
          <motion.ellipse
            cx="90"
            cy="80"
            rx="35"
            ry="55"
            fill="url(#elefBody)"
            opacity="0.85"
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.ellipse
            cx="210"
            cy="80"
            rx="35"
            ry="55"
            fill="url(#elefBody)"
            opacity="0.85"
            animate={isActive ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Presas (tusks) longas */}
          <path
            d="M 135 150 Q 120 200 115 240"
            stroke="#f5f5f4"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 165 150 Q 180 200 185 240"
            stroke="#f5f5f4"
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Olhos sábios */}
          <g>
            <circle cx="130" cy="70" r="6" fill="#1f2937" filter="url(#elefGlow)" />
            <circle cx="170" cy="70" r="6" fill="#1f2937" filter="url(#elefGlow)" />
            {/* Brilho de sabedoria */}
            <circle cx="131" cy="68" r="2" fill="#fbbf24" opacity="0.8" />
            <circle cx="171" cy="68" r="2" fill="#fbbf24" opacity="0.8" />
          </g>

          {/* Patas robustas */}
          <ellipse cx="110" cy="250" rx="14" ry="45" fill="#6b7280" filter="url(#elefGlow)" />
          <ellipse cx="150" cy="260" rx="14" ry="45" fill="#6b7280" filter="url(#elefGlow)" />
          <ellipse cx="190" cy="250" rx="14" ry="45" fill="#6b7280" filter="url(#elefGlow)" />
          <ellipse cx="230" cy="250" rx="14" ry="45" fill="#6b7280" filter="url(#elefGlow)" />

          {/* Aura de sabedoria (quando ativo) */}
          {isActive && (
            <motion.circle
              cx="150"
              cy="160"
              r="100"
              fill="none"
              stroke="#8b7355"
              strokeWidth="1"
              opacity={0}
              animate={{ r: [90, 130], opacity: [0.3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </svg>
      </motion.div>
    </>
  );
}

export default ElefanteTotem;
