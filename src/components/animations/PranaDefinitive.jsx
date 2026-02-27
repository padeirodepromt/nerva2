/* src/components/animations/PranaDefinitive.jsx
   desc: Animação Definitiva do Logo Prana - Nascimento & Aura
   feat: Ciclo completo: Desenho → Despertar → Vida com aura e fluxo de energia
*/

import React, { useState, useEffect } from 'react';

// --- KEYFRAME STYLES ---
const KEYFRAMES = `
  @keyframes draw-path {
    from { stroke-dashoffset: 400; opacity: 1; }
    to { stroke-dashoffset: 0; opacity: 1; }
  }

  @keyframes awaken-fill {
    from { fill-opacity: 0; filter: drop-shadow(0 0 0 rgba(217,119,6,0)); }
    to { fill-opacity: 1; filter: drop-shadow(0 0 15px rgba(217,119,6,0.6)); }
  }

  @keyframes ripple-out {
    0% { transform: scale(1); opacity: 0.6; stroke-width: 0; }
    100% { transform: scale(1.8); opacity: 0; stroke-width: 0.5; }
  }

  @keyframes energy-flow {
    to { stroke-dashoffset: -200; }
  }

  @keyframes prana-breathe {
    0%, 100% { transform: scale(1); filter: drop-shadow(0 0 10px rgba(217, 119, 6, 0.5)); }
    50% { transform: scale(1.05); filter: drop-shadow(0 0 25px rgba(217, 119, 6, 0.8)); }
  }

  @keyframes slow-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

// Helper: Estilos dinâmicos do path principal
function getMainPathStyle(phase, color, delayMs) {
  const base = { stroke: color, strokeWidth: 2, fill: "url(#depthGradient)" };
  
  if (phase === 'drawing') {
    return {
      ...base,
      fillOpacity: 0,
      strokeDasharray: 400,
      animation: `draw-path 1.5s ease-out forwards ${delayMs}ms`
    };
  }
  
  if (phase === 'awakening') {
    return {
      ...base,
      fillOpacity: 0,
      strokeDasharray: 0,
      animation: `awaken-fill 1s ease-in-out forwards`
    };
  }

  // phase === 'alive'
  return {
    ...base,
    fillOpacity: 1,
    stroke: 'none',
    transition: 'all 0.5s ease'
  };
}

export const PranaDefinitive = ({ 
  className = "", 
  replayTrigger = 0,
  color = "#D97706" 
}) => {
  const [phase, setPhase] = useState('drawing');

  useEffect(() => {
    setPhase('drawing');
    const timer1 = setTimeout(() => setPhase('awakening'), 1500);
    const timer2 = setTimeout(() => setPhase('alive'), 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [replayTrigger]);

  const pathTop = "M 20 45 Q 10 40, 15 30 C 20 10, 80 10, 85 30 Q 90 40, 80 45 C 70 55, 30 55, 20 45 Z";
  const pathBottom = "M 20 55 Q 10 60, 15 70 C 20 90, 80 90, 85 70 Q 90 60, 80 55 C 70 45, 30 45, 20 55 Z";

  const isAlive = phase === 'alive';

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="depthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="1" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="1" />
            </linearGradient>
            <radialGradient id="echoGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* AURA (Só quando vivo) */}
          <g className="origin-center" style={{ opacity: isAlive ? 1 : 0, transition: 'opacity 1s ease' }}>
            {[0, 1, 2].map((i) => (
              <g key={i} style={{ 
                animation: isAlive ? `ripple-out 3s infinite ease-out` : 'none',
                animationDelay: `${i * 1}s`,
                transformOrigin: '50% 50%'
              }}>
                <path d={pathTop} fill="url(#echoGradient)" />
                <path d={pathBottom} fill="url(#echoGradient)" />
              </g>
            ))}
          </g>

          {/* CORPO PRINCIPAL */}
          <g 
            className="origin-center" 
            style={{ 
              animation: isAlive ? 'prana-breathe 4s ease-in-out infinite' : 'none' 
            }}
          >
            <path d={pathTop} style={getMainPathStyle(phase, color, 0)} />
            <path d={pathBottom} style={getMainPathStyle(phase, color, 200)} />
          </g>

          {/* FLUXO DE ENERGIA (Só quando vivo) */}
          <g 
            className="origin-center" 
            style={{ 
              opacity: isAlive ? 1 : 0, 
              transition: 'opacity 1s ease 0.5s',
              animation: isAlive ? 'energy-flow 6s linear infinite' : 'none',
              strokeDasharray: '4 40',
              fill: 'none',
              stroke: 'rgba(255, 255, 255, 0.65)',
              strokeWidth: 0.5,
              strokeLinecap: 'round',
              filter: 'drop-shadow(0 0 1px rgba(255,255,255,0.6))'
            }}
          >
            <path d={pathTop} />
            <path d={pathBottom} />
          </g>
        </svg>
      </div>
    </>
  );
};

export default PranaDefinitive;
