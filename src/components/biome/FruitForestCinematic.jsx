/* canvas: src/components/biome/FruitForestCinematic.jsx
   desc: Bioma Terra · Floresta Frutífera — Cena cinematográfica com chuva serena, fauna integrada.
   source: Código Prana 5.9.1 - Floresta Frutífera, adaptado para integração.
*/
import React from 'react';
import { motion } from 'framer-motion';

// --- FILTROS DE TEXTURA CINEMATOGRÁFICA ---
const CinematicFilters = () => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }}>
    <defs>
      <filter id="forestLight">
        <feGaussianBlur stdDeviation="12" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>

      <filter id="barkTexture">
        <feTurbulence type="fractalNoise" baseFrequency="0.6 0.9" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.15" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>
      
      <filter id="filmGrain">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.08" />
        </feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic" />
      </filter>

      <filter id="fireflyGlow">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
  </svg>
);

// --- COMPONENTE: SISTEMA DE CHUVA (CALMA E TRANSLÚCIDA) ---
const Rainfall = () => {
  const drops = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 z-[80] pointer-events-none overflow-hidden">
      {drops.map((_, i) => (
        <motion.div
          key={i}
          className="absolute bg-white opacity-[0.07]"
          style={{
            width: '0.5px',
            height: `${15 + Math.random() * 25}px`,
            left: `${Math.random() * 100}%`,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '120vh'],
          }}
          transition={{
            duration: 2.5 + Math.random() * 1.5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 3,
          }}
        />
      ))}
    </div>
  );
};

// --- COMPONENTE: BORBOLETA ---
const Butterfly = ({ x, y, color }) => (
  <motion.div
    className="absolute z-[35]"
    style={{ left: x, top: y }}
    animate={{ 
      x: [0, 40, -20, 0],
      y: [0, -30, 20, 0]
    }}
    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
  >
    <svg width="30" height="30" viewBox="0 0 40 40">
      <motion.g
        animate={{ rotateY: [0, 80, 0] }}
        transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
        style={{ transformOrigin: '20px 20px' }}
      >
        <path d="M20,20 Q10,0 5,15 T20,25" fill={color} opacity="0.8" stroke="white" strokeWidth="0.5" />
        <path d="M20,20 Q30,0 35,15 T20,25" fill={color} opacity="0.8" stroke="white" strokeWidth="0.5" />
      </motion.g>
    </svg>
  </motion.div>
);

// --- COMPONENTE: VAGALUME ---
const Firefly = ({ x, y }) => (
  <motion.div
    className="absolute z-[45]"
    style={{ left: x, top: y }}
    animate={{ x: [0, 20, -20, 0], y: [0, -20, 20, 0] }}
    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
  >
    <motion.div 
      className="w-1.5 h-1.5 bg-yellow-300 rounded-full"
      style={{ filter: 'url(#fireflyGlow)' }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}
    />
  </motion.div>
);

// --- COMPONENTE: CASAL DE PÁSSAROS ---
const BirdPair = ({ x, y }) => {
  const bird = (delay, bodyColor, wingColor) => (
    <motion.div
      className="absolute"
      animate={{ y: [0, -12, 0], x: [0, 5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width="70" height="50" viewBox="0 0 70 50">
        <motion.path 
          d="M30,25 Q15,0 5,15 Q20,10 30,25" fill={wingColor} 
          style={{ transformOrigin: '30px 25px' }}
          animate={{ rotate: [-30, 40, -30] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <path d="M22,25 Q32,15 48,25 L54,23 L51,29 Q32,38 22,25" fill={bodyColor} />
        <motion.path 
          d="M30,25 Q45,0 55,18 Q40,12 30,25" fill={wingColor} 
          style={{ transformOrigin: '30px 25px' }}
          animate={{ rotate: [30, -40, 30] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <path d="M54,23 L60,24 L54,26 Z" fill="#a8a29e" />
        <path d="M22,25 L10,30 L12,18 Z" fill={bodyColor} opacity="0.6" />
      </svg>
    </motion.div>
  );

  return (
    <div className="absolute z-[60]" style={{ left: x, top: y }}>
      <div className="relative">
        {bird(0, "#334155", "#475569")}
        <div className="absolute top-8 left-16 scale-90">
          {bird(0.6, "#3f3f46", "#52525b")}
        </div>
      </div>
    </div>
  );
};

// --- COMPONENTE: MACACO AGARRADO AO TRONCO ---
const ForestMonkey = ({ y }) => (
  <motion.g
    transform={`translate(15, ${y})`}
    animate={{ y: [y, y - 6, y] }}
    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
  >
    <motion.path 
      d="M10,45 Q-20,60 0,90" stroke="#2b1a10" strokeWidth="3" fill="none" strokeLinecap="round"
      animate={{ d: ["M10,45 Q-20,60 0,90", "M10,45 Q20,70 -10,100"] }}
      transition={{ duration: 6, repeat: Infinity, repeatType: "mirror" }}
    />
    <path d="M10,20 L35,15 M10,45 L35,50" stroke="#3d2b1f" strokeWidth="4" strokeLinecap="round" />
    <path d="M10,20 L-5,10 M10,45 L-5,55" stroke="#3d2b1f" strokeWidth="4" strokeLinecap="round" />
    <path d="M0,15 Q15,10 20,15 L20,50 Q15,55 0,50 Z" fill="#3d2b1f" filter="url(#filmGrain)" />
    <circle cx="10" cy="8" r="9" fill="#3d2b1f" />
    <ellipse cx="10" cy="10" rx="5" ry="6" fill="#5d4037" opacity="0.6" />
    <circle cx="6" cy="7" r="1.2" fill="#fbbf24" />
    <circle cx="14" cy="7" r="1.2" fill="#fbbf24" />
    <circle cx="0" cy="5" r="3" fill="#3d2b1f" />
    <circle cx="20" cy="5" r="3" fill="#3d2b1f" />
  </motion.g>
);

// --- COMPONENTE: LAGARTO DE TRONCO ---
const TrunkLizard = ({ y }) => (
  <motion.g
    animate={{ y: [y, y - 30, y] }}
    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
  >
    <path d="M45,10 Q50,0 55,10 L55,30 Q50,40 45,30 Z" fill="#14532d" />
    <path d="M50,30 Q55,45 40,60" stroke="#14532d" strokeWidth="1.5" fill="none" />
    <circle cx="48" cy="8" r="0.8" fill="#fbbf24" />
    <circle cx="52" cy="8" r="0.8" fill="#fbbf24" />
  </motion.g>
);

// --- COMPONENTE: PILAR DE TRONCO ---
const TreeTrunk = ({ x, height, zIndex, color, scale = 1, hasLizard = false, hasMonkey = false }) => (
  <motion.div
    className="absolute bottom-0 h-full pointer-events-none"
    style={{ left: x, zIndex, width: 60 * scale }}
    animate={{ x: [0, 1, -1, 0] }}
    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 100 800" className="h-full w-full" preserveAspectRatio="none">
      <path 
        d={`M20,800 L30,${800-height} Q50,${750-height} 70,${800-height} L80,800 Z`} 
        fill={color} 
        filter="url(#barkTexture)"
      />
      {hasLizard && <TrunkLizard y={800 - height + 150} />}
      {hasMonkey && <ForestMonkey y={800 - height + 250} />}
      <ellipse cx="50" cy="720" rx="5" ry="10" fill="black" fillOpacity="0.15" />
    </svg>
  </motion.div>
);

// --- COMPONENTE: COPA E FRUTOS (COM VARIANTES) ---
const FruitCanopy = ({ x, y, zIndex, color, fruitColor, scale = 1, flip = false, variant = 'round' }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ 
      left: x, top: y, zIndex, width: 320 * scale, height: 240 * scale,
      transform: flip ? 'scaleX(-1)' : 'none'
    }}
    animate={{ y: [y, y - 8, y], rotate: [-0.5, 0.5, -0.5] }}
    transition={{ duration: 8 + Math.random() * 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 320 240" className="w-full h-full">
      <g filter="url(#filmGrain)">
        {variant === 'round' ? (
          <>
            <circle cx="120" cy="140" r="70" fill={color} fillOpacity="0.9" />
            <circle cx="200" cy="110" r="80" fill={color} fillOpacity="0.8" />
            <circle cx="160" cy="70" r="65" fill={color} fillOpacity="0.9" />
          </>
        ) : (
          <path d="M160,20 L280,200 Q160,230 40,200 Z" fill={color} fillOpacity="0.9" />
        )}
      </g>
      {[...Array(6)].map((_, i) => (
        <motion.circle 
          key={i}
          cx={variant === 'round' ? 100 + (i * 22) : 120 + (i * 12)} 
          cy={variant === 'round' ? 80 + (Math.sin(i) * 25) : 120 + (Math.sin(i) * 15)} 
          r="7" fill={fruitColor}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 3 + i, repeat: Infinity }}
          filter="url(#filmGrain)"
        />
      ))}
    </svg>
  </motion.div>
);

// --- COMPONENTE: SAMAMBAIA TROPICAL ---
const TropicalFern = ({ x, zIndex, color, scale = 1 }) => (
  <motion.div
    className="absolute bottom-0 pointer-events-none"
    style={{ left: x, zIndex, width: 180 * scale, height: 120 * scale, marginBottom: -15 * scale }}
    animate={{ rotate: [-2, 2, -2], skewX: [-1, 1, -1] }}
    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
  >
    <svg viewBox="0 0 200 150" className="w-full h-full">
      <g filter="url(#filmGrain)" fill={color}>
        {[...Array(5)].map((_, i) => (
          <path 
            key={i} d={`M100,150 Q${20 + i * 40},100 ${10 + i * 45},20 Q${100,80} 100,150`}
            fillOpacity={0.6 + (i * 0.1)}
          />
        ))}
      </g>
    </svg>
  </motion.div>
);

// --- COMPONENTE: CHÃO DE FLORESTA ---
const ForestFloor = ({ color, zIndex, height }) => (
  <div className="absolute bottom-0 w-[120%] left-[-10%] pointer-events-none" style={{ zIndex, height }}>
    <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-full">
      <path d="M0,200 L0,150 Q200,100 400,160 Q600,120 800,150 Q1000,100 1200,160 Q1440,120 1440,150 L1440,200 Z" fill={color} filter="url(#filmGrain)" />
    </svg>
  </div>
);

// --- COMPONENTE AUXILIAR PARA VEGETAÇÃO RASTEIRA EXTRA ---
const UndergrowthSmall = ({ x }) => (
  <div className="absolute bottom-[90px] z-[42]" style={{ left: x }}>
    <svg width="60" height="40" viewBox="0 0 100 60">
      <path d="M50,60 Q30,20 10,50 Q50,40 50,60" fill="#000" />
      <path d="M50,60 Q70,20 90,50 Q50,40 50,60" fill="#000" />
    </svg>
  </div>
);

// --- MOTOR DE AMBIENTE PRINCIPAL ---
export const FruitForestCinematic = () => {
  return (
    <div className="min-h-screen bg-[#011a13] flex flex-col overflow-hidden relative text-white">
      <CinematicFilters />

      {/* 1. FUNDO GRADIENTE */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#022c22] via-[#011a13] to-black" />

      {/* 2. RAIOS DE SOL (KOMOREBI) - Opacidade reduzida para tempo nublado */}
      <div className="absolute inset-0 z-[15] opacity-[0.1] pointer-events-none" style={{ filter: 'url(#forestLight)' }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i} className="absolute top-0 w-40 h-full bg-gradient-to-b from-yellow-100/10 via-transparent to-transparent -rotate-6"
            style={{ left: `${20 * i}%` }} animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 15, repeat: Infinity, delay: i }}
          />
        ))}
      </div>

      {/* 3. SISTEMA DE CHUVA (CALMA E TRANSLÚCIDA) */}
      <Rainfall />

      {/* 4. CAMADAS DE PROFUNDIDADE */}
      
      <TreeTrunk x="22%" height={580} zIndex={5} color="#064e3b" scale={0.6} />
      <FruitCanopy x="12%" y="15%" zIndex={6} color="#064e3b" fruitColor="#f59e0b" scale={0.6} variant="round" />
      <TreeTrunk x="72%" height={540} zIndex={5} color="#064e3b" scale={0.5} />
      <FruitCanopy x="62%" y="20%" zIndex={6} color="#064e3b" fruitColor="#f59e0b" scale={0.55} flip variant="round" />
      <TropicalFern x="25%" zIndex={5} color="#064e3b" scale={0.6} />
      <ForestFloor color="#012e22" zIndex={7} height="180px" />

      <TreeTrunk x="45%" height={680} zIndex={10} color="#022c22" scale={0.8} hasLizard={true} />
      <FruitCanopy x="30%" y="8%" zIndex={11} color="#065f46" fruitColor="#facc15" scale={0.85} variant="round" />
      <TreeTrunk x="35%" height={400} zIndex={10} color="#022c22" scale={0.4} />
      <FruitCanopy x="30%" y="45%" zIndex={11} color="#065f46" fruitColor="#facc15" scale={0.4} variant="pointy" />
      <TreeTrunk x="55%" height={350} zIndex={10} color="#022c22" scale={0.35} />
      <FruitCanopy x="50%" y="50%" zIndex={11} color="#065f46" fruitColor="#facc15" scale={0.35} variant="pointy" flip />
      <TropicalFern x="42%" zIndex={12} color="#065f46" scale={0.9} />
      <ForestFloor color="#011a13" zIndex={13} height="140px" />

      <TreeTrunk x="5%" height={880} zIndex={30} color="#000000" scale={1.2} hasMonkey={true} />
      <FruitCanopy x="-5%" y="-5%" zIndex={31} color="#012e22" fruitColor="#ef4444" scale={1.1} variant="round" />
      <Butterfly x="60%" y="40%" color="#6366f1" />
      <Firefly x="20%" y="60%" />
      <Firefly x="80%" y="50%" />
      <TreeTrunk x="78%" height={860} zIndex={30} color="#000000" scale={1.1} hasLizard={true} />
      <FruitCanopy x="62%" y="0%" zIndex={31} color="#012e22" fruitColor="#ef4444" scale={1.2} flip variant="round" />
      <ForestFloor color="#000000" zIndex={40} height="90px" />
      <UndergrowthSmall x="15%" />
      <UndergrowthSmall x="70%" />
      <TropicalFern x="25%" zIndex={41} color="#000000" scale={1.2} />
      <TropicalFern x="65%" zIndex={41} color="#000000" scale={1} />

      <BirdPair x="48%" y="22%" />

      {/* 5. PARTÍCULAS (POLEN) */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i} className="absolute w-1 h-1 bg-yellow-300/10 rounded-full"
          style={{ left: `${Math.random()*100}%`, top: `${Math.random()*100}%` }}
          animate={{ y: [0, -60, 0], x: [0, 15, 0], opacity: [0, 0.3, 0] }}
          transition={{ duration: 12 + Math.random()*8, repeat: Infinity }}
        />
      ))}

      <div className="fixed inset-0 pointer-events-none opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[100] mix-blend-overlay" />
    </div>
  );
};

export default FruitForestCinematic;
