/* canvas: src/components/biome/OceanCinematic.jsx
   desc: Bioma Água · Oceano — Cena cinematográfica com Leviatã e Barco de Pesca.
   source: Código Prana 4.0 - Oceano Infinito, adaptado para integração.
*/
import React from 'react';
import { motion } from 'framer-motion';

// --- FILTROS DE TEXTURA CINEMATOGRÁFICA ---
const CinematicFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="waterRefraction">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" result="noise">
          <animate attributeName="baseFrequency" values="0.01 0.03; 0.015 0.05; 0.01 0.03" dur="15s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" />
      </filter>

      <filter id="filmGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.1" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>

      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

// --- COMPONENTE: LEVIATÃ ANCESTRAL ---
const SmallLeviata = ({ color = "#0ea5e9" }) => (
  <motion.div
    className="absolute z-[7] left-[-150px] bottom-[15%]"
    animate={{ 
      x: ['-10vw', '110vw'],
      y: [0, 10, -10, 0]
    }}
    transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
  >
    <svg width="125" height="60" viewBox="0 0 600 300" className="opacity-30">
      <defs>
        <linearGradient id="whaleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>
      </defs>
      <path 
        d="M50,180 Q100,20 400,50 Q550,80 550,200 Q550,280 300,280 Q50,280 50,180" 
        fill="url(#whaleGrad)" 
      />
      <circle cx="480" cy="150" r="2" fill="#4ade80" filter="url(#glow)" />
      <motion.path 
        d="M300,180 Q350,250 250,280" 
        fill="url(#whaleGrad)"
        animate={{ d: ["M300,180 Q350,250 250,280", "M300,180 Q380,230 250,260"] }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
      />
    </svg>
  </motion.div>
);

// --- COMPONENTE: BARCO DE PESCA COM REDES ---
const FishingBoat = ({ duration, delay }) => (
  <motion.div
    className="absolute z-[28] left-[25%] bottom-[28%]"
    animate={{ 
      y: [0, -10, 0],
      rotate: [-4, 4, -4]
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="160" height="120" viewBox="0 0 160 120" fill="none">
      {/* Redes de Pesca */}
      <g opacity="0.4">
        <path d="M30,55 Q50,90 70,55" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M40,55 Q50,85 60,55" stroke="white" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M30,70 L70,70" stroke="white" strokeWidth="0.2" opacity="0.5" />
      </g>
      
      {/* Casco */}
      <path d="M10,50 L130,50 L115,75 L25,75 Z" fill="#121212" filter="url(#filmGrain)" />
      
      {/* Cabine e Mastro */}
      <rect x="55" y="35" width="30" height="15" fill="#1a1a1a" />
      <line x1="70" y1="10" x2="70" y2="35" stroke="#333" strokeWidth="2" />
      
      {/* Vara de Pesca e Linha */}
      <line x1="120" y1="50" x2="155" y2="15" stroke="#444" strokeWidth="1.5" strokeLinecap="round" />
      <motion.line 
        x1="155" y1="15" x2="160" y2="90" 
        stroke="white" strokeWidth="0.3" opacity="0.2"
        animate={{ x2: [160, 168, 160] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cestos */}
      <rect x="30" y="46" width="10" height="5" fill="#3f2b1d" />
      <rect x="42" y="47" width="8" height="4" fill="#3f2b1d" opacity="0.7" />

      {/* Lanterna */}
      <motion.circle 
        cx="85" cy="40" r="2" fill="#fbbf24" 
        filter="url(#glow)"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  </motion.div>
);

// --- COMPONENTE DE CAMADA DE ONDA ---
const WaveLayer = ({ d, color, duration, delay, opacity, zIndex, texture = false, yOffset = [0, 15, 0] }) => (
  <motion.div
    className="absolute bottom-0 w-[140%] h-full"
    style={{ left: '-20%', zIndex }}
    animate={{ 
      x: ['-2%', '2%', '-2%'],
      y: yOffset
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg 
      viewBox="0 0 1440 800" 
      preserveAspectRatio="none" 
      className="w-full h-full"
      style={{ filter: texture ? 'url(#filmGrain)' : 'none' }}
    >
      <path d={d} fill={color} fillOpacity={opacity} />
    </svg>
  </motion.div>
);

// --- MOTOR DE AMBIENTE OCEANO ---
export function OceanCinematic() {
  return (
    <div className="absolute inset-0 bg-[#010409] overflow-hidden">
      <CinematicFilters />

      {/* 1. FUNDO GRADIENTE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0c4a6e] via-[#020617] to-black" />

      {/* 2. RAIOS DE LUZ SUBAQUÁTICOS */}
      <div className="absolute inset-0 opacity-10" style={{ filter: 'url(#waterRefraction)' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-32 h-[150%] bg-gradient-to-b from-white/10 via-transparent to-transparent -rotate-12"
            style={{ left: `${20 * i}%` }}
            animate={{ opacity: [0.1, 0.2, 0.1], x: [0, 30, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 2 }}
          />
        ))}
      </div>

      {/* 3. CAMADAS DE ONDAS E ENTIDADES */}
      
      {/* Camada 1: Horizonte Distante */}
      <WaveLayer zIndex={5} color="#075985" opacity={0.2} duration={20} delay={0} yOffset={[0, 5, 0]} d="M0,350 Q360,320 720,350 T1440,350 V800 H0 Z" />

      {/* ENTIDADE: LEVIATÃ (Minúsculo e profundo) */}
      <SmallLeviata color="#0ea5e9" />

      {/* Camada 2: Névoa Profunda */}
      <WaveLayer zIndex={10} color="#0ea5e9" opacity={0.1} duration={18} delay={4} d="M0,420 Q360,450 720,420 T1440,420 V800 H0 Z" />

      {/* Camada 3: Profundidade Média */}
      <WaveLayer zIndex={15} color="#0369a1" opacity={0.3} duration={16} delay={2} texture={true} d="M0,480 Q360,400 720,480 T1440,480 V800 H0 Z" />

      {/* Camada 4: Contraste Azul Escuro */}
      <WaveLayer zIndex={20} color="#1e3a8a" opacity={0.25} duration={14} delay={6} d="M0,550 Q360,620 720,550 T1440,550 V800 H0 Z" />

      {/* Camada 5: Zona de Penumbra */}
      <WaveLayer zIndex={25} color="#0c4a6e" opacity={0.6} duration={12} delay={1} texture={true} d="M0,620 Q360,550 720,620 T1440,620 V800 H0 Z" />

      {/* ENTIDADE: BARCO DE PESCA (Superfície) */}
      <FishingBoat duration={8} delay={3} />

      {/* Camada 6: Abismo Frontal */}
      <WaveLayer zIndex={30} color="#082f49" opacity={0.9} duration={10} delay={3} texture={true} yOffset={[0, 20, 0]} d="M0,700 Q360,780 720,700 T1440,700 V800 H0 Z" />

      {/* 4. PARTÍCULAS EM SUSPENSÃO (PLÂNCTON) */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-sky-200/10 rounded-full blur-[1px]"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
          animate={{ y: [0, -100], opacity: [0, 0.4, 0] }}
          transition={{ duration: 10 + Math.random()*10, repeat: Infinity }}
        />
      ))}

      {/* Camada Final de Grão de Filme */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[100] mix-blend-overlay" />
    </div>
  );
}

export default OceanCinematic;
