/* canvas: src/components/biome/OncaTotem.jsx
   desc: OncaResiliente — Cinematográfica, Caça Sutil, Realismo Predatório
   style: Sombra e Poder, Movimento Fluido, Texturas de Pelagem
*/
import React from 'react';
import { motion } from 'framer-motion';

const SertaoFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="oncaTexture">
        <feTurbulence type="fractalNoise" baseFrequency="2" numOctaves="5" />
        <feDisplacementMap in="SourceGraphic" scale="1.5" />
      </filter>
      <filter id="oncaGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <linearGradient id="oncaBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="50%" stopColor="#b45309" />
        <stop offset="100%" stopColor="#7c2d12" />
      </linearGradient>
      <radialGradient id="oncaPintas">
        <stop offset="0%" stopColor="#3f2817" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#3f2817" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export function OncaTotem({ className = "w-28 h-24", mood = "idle" }) {
  const isActive = mood === 'active';

  return (
    <>
      <SertaoFilters />
      <motion.div
        className={`relative ${className}`}
        animate={
          isActive
            ? {
                x: [-20, 40, -20],
                y: [-5, 5, -5],
                scaleX: [1, 1.05, 1]
              }
            : {
                x: [-15, 25, -15],
                y: [0, 2, 0]
              }
        }
        transition={{
          duration: isActive ? 4 : 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 280 200" className="w-full h-full filter drop-shadow-[0_12px_25px_rgba(120,45,18,0.5)]">
          {/* Corpo principal felino */}
          <g filter="url(#oncaTexture)">
            {/* Cabeça */}
            <ellipse cx="70" cy="85" rx="28" ry="32" fill="url(#oncaBody)" filter="url(#oncaGlow)" />
            {/* Corpo alongado */}
            <ellipse cx="150" cy="100" rx="55" ry="38" fill="url(#oncaBody)" filter="url(#oncaGlow)" />
            {/* Quadril */}
            <ellipse cx="240" cy="110" rx="28" ry="32" fill="url(#oncaBody)" filter="url(#oncaGlow)" />
          </g>

          {/* Pintas características (rosetas) */}
          {[
            { cx: 100, cy: 80, r: 8 },
            { cx: 130, cy: 70, r: 7 },
            { cx: 160, cy: 85, r: 9 },
            { cx: 180, cy: 100, r: 6 },
            { cx: 150, cy: 130, r: 8 },
            { cx: 210, cy: 120, r: 7 }
          ].map((spot, i) => (
            <circle key={i} cx={spot.cx} cy={spot.cy} r={spot.r} fill="url(#oncaPintas)" />
          ))}

          {/* Cauda em movimento */}
          <motion.path
            d="M 265 110 Q 290 90 310 60 Q 315 40 320 50"
            stroke="url(#oncaBody)"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
            animate={{ rotateZ: [-25, 15, -25] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: '265px 110px' }}
          />

          {/* Patas dianteiras */}
          <ellipse cx="90" cy="145" rx="10" ry="28" fill="#8b4513" filter="url(#oncaGlow)" />
          <ellipse cx="130" cy="155" rx="12" ry="30" fill="#8b4513" filter="url(#oncaGlow)" />

          {/* Patas traseiras */}
          <ellipse cx="220" cy="150" rx="11" ry="32" fill="#7c2d12" filter="url(#oncaGlow)" />
          <ellipse cx="260" cy="145" rx="10" ry="28" fill="#8b4513" filter="url(#oncaGlow)" />

          {/* Orelhas */}
          <ellipse cx="55" cy="55" rx="10" ry="16" fill="#8b4513" />
          <ellipse cx="85" cy="55" rx="10" ry="16" fill="#8b4513" />
          {/* Interior das orelhas */}
          <ellipse cx="55" cy="60" rx="5" ry="9" fill="#d2691e" opacity="0.7" />
          <ellipse cx="85" cy="60" rx="5" ry="9" fill="#d2691e" opacity="0.7" />

          {/* Olhos predatórios */}
          <g>
            <circle cx="60" cy="75" r="5" fill="#f59e0b" filter="url(#oncaGlow)" />
            <circle cx="80" cy="75" r="5" fill="#f59e0b" filter="url(#oncaGlow)" />
            {/* Pupila dilatada */}
            <ellipse cx="60" cy="76" rx="2" ry="3" fill="#1f2937" />
            <ellipse cx="80" cy="76" rx="2" ry="3" fill="#1f2937" />
            {/* Brilho */}
            <circle cx="61" cy="74" r="1.5" fill="#fef3c7" opacity="0.8" />
            <circle cx="81" cy="74" r="1.5" fill="#fef3c7" opacity="0.8" />
          </g>

          {/* Nariz e boca */}
          <ellipse cx="70" cy="95" rx="4" ry="3" fill="#1f2937" />
          <path d="M 70 98 Q 65 105 60 108" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 70 98 Q 75 105 80 108" stroke="#1f2937" strokeWidth="1.5" fill="none" strokeLinecap="round" />

          {/* Aura de força (quando ativo) */}
          {isActive && (
            <motion.circle
              cx="150"
              cy="100"
              r="90"
              fill="none"
              stroke="#b45309"
              strokeWidth="0.8"
              opacity={0}
              animate={{ r: [80, 120], opacity: [0.3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </svg>
      </motion.div>
    </>
  );
}

export default OncaTotem;
