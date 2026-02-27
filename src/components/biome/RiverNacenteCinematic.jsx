/* canvas: src/components/biome/RiverNacenteCinematic.jsx
   desc: Bioma Água · Nascente — Cena cinematográfica com mata ciliar, canoa e população ancestral.
   source: Código Prana 4.9.7 - Mata Ciliar, adaptado para integração.
*/
import React from 'react';
import { motion } from 'framer-motion';

// --- FILTROS DE TEXTURA CINEMATOGRÁFICA ---
const CinematicFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      {/* Distorção de Refração de Água */}
      <filter id="riverRefraction">
        <feTurbulence type="fractalNoise" baseFrequency="0.01 0.03" numOctaves="2" result="noise">
          <animate attributeName="baseFrequency" values="0.01 0.03; 0.015 0.05; 0.01 0.03" dur="15s" repeatCount="indefinite" />
        </feTurbulence>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="8" />
      </filter>

      {/* Granulado de Cinema */}
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

// --- COMPONENTE: FIGURA HUMANA ANCESTRAL ---
const AncestralPerson = () => (
  <g transform="translate(65, 5)">
    {/* Cabeça */}
    <circle cx="0" cy="0" r="4.5" fill="#3d2b1f" />
    {/* Tronco / Postura sentada */}
    <path 
      d="M-4,4 Q-8,15 0,22 Q8,15 4,4 Z" 
      fill="#3d2b1f" 
    />
    {/* Braços sugeridos */}
    <path 
      d="M-5,8 Q-10,12 -6,18" 
      stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round" fill="none" 
    />
    <path 
      d="M5,8 Q10,12 6,18" 
      stroke="#3d2b1f" strokeWidth="2.5" strokeLinecap="round" fill="none" 
    />
  </g>
);

// --- COMPONENTE: CARDUME DE PEIXINHOS ---
const SmallFishShoal = () => {
  const fishes = Array.from({ length: 10 });
  return (
    <motion.div
      className="absolute z-[12] w-full h-20 bottom-[22%]"
      animate={{ x: ['120vw', '-20vw'] }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
    >
      <div className="relative">
        {fishes.map((_, i) => (
          <motion.svg
            key={i}
            width="22"
            height="12"
            viewBox="0 0 50 25"
            className="absolute opacity-30"
            style={{ 
              left: `${i * 18}px`, 
              top: `${Math.sin(i * 0.8) * 15}px` 
            }}
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15 }}
          >
            <path d="M0,12 Q15,0 35,10 L50,0 L45,12 L50,24 L35,14 Q15,24 0,12" fill="white" />
          </motion.svg>
        ))}
      </div>
    </motion.div>
  );
};

// --- COMPONENTE: ROCHAS NA SUPERFÍCIE ---
const SurfaceRocks = () => (
  <motion.div 
    className="absolute z-[16] left-[55%] bottom-[45%] pointer-events-none"
    animate={{ y: [0, 4, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg width="220" height="120" viewBox="0 0 200 100" className="drop-shadow-lg">
      <path 
        d="M20,80 Q45,25 90,65 Q110,55 130,85 Z" 
        fill="#d4a373" 
        fillOpacity="0.75"
        filter="url(#filmGrain)"
      />
      <path 
        d="M115,90 Q135,55 165,85 Q175,78 185,95 Z" 
        fill="#b08d79" 
        fillOpacity="0.8"
        filter="url(#filmGrain)"
      />
      <path d="M25,82 Q90,85 130,87" stroke="white" strokeWidth="0.5" opacity="0.2" fill="none" />
    </svg>
  </motion.div>
);

// --- COMPONENTE: LEVIATÃ ANCESTRAL ---
const SmallLeviata = ({ color = "#10b981" }) => (
  <motion.div
    className="absolute z-[7] left-[-150px] bottom-[15%]"
    animate={{ 
      x: ['-10vw', '110vw'],
      y: [0, 10, -10, 0]
    }}
    transition={{ duration: 85, repeat: Infinity, ease: "linear" }}
  >
    <svg width="110" height="55" viewBox="0 0 600 300" className="opacity-20">
      <defs>
        <linearGradient id="whaleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#022c22" />
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
        transition={{ duration: 15, repeat: Infinity, repeatType: "mirror" }}
      />
    </svg>
  </motion.div>
);

// --- COMPONENTE: ÁRVORES DA MATA CILIAR ---
const CiliarTree = ({ x, zIndex, color, scale = 1, flip = false }) => (
  <motion.div 
    className="absolute bottom-0 h-full pointer-events-none"
    style={{ left: x, zIndex, transform: `scaleX(${flip ? -1 : 1}) scale(${scale})` }}
    animate={{ rotate: [-0.4, 0.4, -0.4] }}
    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 400 800" className="h-full w-[400px]">
      <path 
        d="M200,800 Q180,700 120,600 Q80,520 100,450" 
        stroke={color} strokeWidth="18" fill="none" strokeLinecap="round"
        filter="url(#filmGrain)"
      />
      <g filter="url(#filmGrain)">
        <circle cx="80" cy="460" r="60" fill={color} fillOpacity="0.8" />
        <circle cx="120" cy="430" r="50" fill={color} fillOpacity="0.6" />
        <circle cx="50" cy="620" r="30" fill={color} fillOpacity="0.5" />
      </g>
    </svg>
  </motion.div>
);

// --- COMPONENTE: ROCHAS DA ENCOSTA (BASE) ---
const RiverRocks = ({ zIndex, color, flip = false }) => (
  <div 
    className="absolute bottom-0 w-full h-full pointer-events-none" 
    style={{ zIndex, transform: `scaleX(${flip ? -1 : 1})` }}
  >
    <svg viewBox="0 0 1440 800" className="w-full h-full">
      <path 
        d="M-100,800 L50,700 Q150,650 300,680 Q450,720 500,800 Z" 
        fill={color} 
        filter="url(#filmGrain)"
        opacity="0.95"
      />
    </svg>
  </div>
);

// --- COMPONENTE: CANOA EM MADEIRA SÓLIDA COM PESSOA ---
const WoodenCanoe = ({ duration, delay }) => (
  <motion.div
    className="absolute z-[35] left-[32%] bottom-[28%]"
    animate={{ 
      y: [0, -6, 0],
      rotate: [-2, 2, -2],
      x: [-5, 5, -5]
    }}
    transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
  >
    <svg width="140" height="80" viewBox="0 0 140 80" fill="none">
      {/* Figura Humana Ancestral */}
      <AncestralPerson />
      {/* Casco da Canoa em Marrom Madeira Sólido */}
      <path 
        d="M10,30 Q70,55 130,30 Q70,40 10,30" 
        fill="#4d342c" 
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
      x: ['-1.5%', '1.5%', '-1.5%'],
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

// --- MOTOR DE AMBIENTE PRINCIPAL ---
export const RiverNacenteCinematic = () => {
  return (
    <div className="min-h-screen bg-[#011a13] flex flex-col overflow-hidden relative">
      <CinematicFilters />

      {/* 1. FUNDO GRADIENTE (CÉU AZUL -> ÁGUA VERDE) */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#7dd3fc] via-[#0ea5e9] to-[#011a13]" />

      {/* 2. BRILHO NA ÁGUA */}
      <div className="absolute inset-0 opacity-10" style={{ filter: 'url(#riverRefraction)' }}>
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 w-64 h-[180%] bg-gradient-to-b from-sky-100/20 via-transparent to-transparent rotate-[20deg]"
            style={{ left: `${30 * i - 20}%` }}
            animate={{ opacity: [0.1, 0.2, 0.1], x: [0, 40, 0] }}
            transition={{ duration: 15, repeat: Infinity, delay: i * 2 }}
          />
        ))}
      </div>

      {/* 3. CAMADAS DE ENCOSTAS E ENTIDADES */}
      
      <WaveLayer zIndex={5} color="#10b981" opacity={0.3} duration={25} delay={0} yOffset={[0, 4, 0]} d="M0,350 Q400,200 800,350 T1440,350 V800 H0 Z" />

      <SmallLeviata color="#34d399" />

      <WaveLayer zIndex={10} color="#065f46" opacity={0.4} duration={20} delay={4} d="M0,480 Q300,380 720,480 T1440,480 V800 H0 Z" />
      
      <CiliarTree x="10%" zIndex={11} color="#064e3b" scale={0.7} />
      <CiliarTree x="75%" zIndex={11} color="#064e3b" scale={0.6} flip={true} />

      <SmallFishShoal />

      <WaveLayer zIndex={15} color="#10b981" opacity={0.25} duration={18} delay={2} texture={true} d="M0,550 Q720,500 1440,550 V800 H0 Z" />

      <SurfaceRocks />

      <WaveLayer zIndex={20} color="#064e3b" opacity={0.6} duration={16} delay={6} texture={true} d="M0,650 Q360,700 720,650 T1440,650 V800 H0 Z" />

      <WaveLayer zIndex={30} color="#022c22" opacity={0.9} duration={14} delay={1} texture={true} yOffset={[0, 18, 0]} d="M0,750 Q400,850 800,750 T1440,780 V800 H0 Z" />
      
      {/* ENTIDADE: CANOA COM PESSOA */}
      <WoodenCanoe duration={12} delay={0} />

      <RiverRocks zIndex={31} color="#011a13" />
      <CiliarTree x="-5%" zIndex={32} color="#010f0b" scale={1.1} />
      <CiliarTree x="85%" zIndex={32} color="#010f0b" scale={1} flip={true} />

      {/* 4. PARTÍCULAS EM SUSPENSÃO */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-100/10 rounded-full blur-[1.5px]"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
          animate={{ y: [0, -100], opacity: [0, 0.3, 0] }}
          transition={{ duration: 12 + Math.random()*12, repeat: Infinity }}
        />
      ))}

      <div className="fixed inset-0 pointer-events-none opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[100] mix-blend-overlay" />
    </div>
  );
};

export default RiverNacenteCinematic;
