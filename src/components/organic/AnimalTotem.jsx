/**
 * AnimalTotem.jsx
 * 
 * Renderiza os 5 animais guia com 5 estados:
 * IDLE (padrão), ACTIVE (tarefa em curso), SUCCESS (conclusão),
 * LOW_ENERGY (cansado), ALERT (urgência)
 */

import React from 'react';
import { motion } from 'framer-motion';

// BEIJA-FLOR (Nascente)
const BeijaFlorTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: {
      y: [0, -3, 0],
      rotate: [0, 2, -2, 0],
      duration: 2
    },
    ACTIVE: {
      y: [0, -8, 0],
      rotate: [0, 5, -5, 0],
      duration: 0.8
    },
    SUCCESS: {
      y: [0, -15, -10, 0],
      rotate: 360,
      duration: 1.2
    },
    LOW_ENERGY: {
      y: [0, -1, 0],
      rotate: [0, 1, -1, 0],
      opacity: [0.6, 0.8, 0.6],
      duration: 3
    },
    ALERT: {
      y: [0, -10, 0],
      rotate: [0, 8, -8, 0],
      scale: [1, 1.1, 1],
      duration: 0.6
    }
  };

  const anim = stateAnimations[state];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-12 h-12"
      animate={anim}
      transition={{ repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Corpo */}
      <ellipse cx="50" cy="50" rx="8" ry="12" fill="#22c55e" />
      
      {/* Cabeça */}
      <circle cx="50" cy="35" r="6" fill="#16a34a" />
      
      {/* Olho */}
      <circle cx="52" cy="34" r="1.5" fill="#000" />
      
      {/* Asas */}
      <motion.g
        animate={state === 'IDLE' ? { rotate: [0, 20, -20, 0] } : { rotate: [0, 40, -40, 0] }}
        transition={{ repeat: Infinity, duration: state === 'IDLE' ? 0.4 : 0.2 }}
      >
        {/* Asa esquerda */}
        <path
          d="M 45 42 Q 30 35 35 50"
          stroke="#86efac"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
        {/* Asa direita */}
        <path
          d="M 55 42 Q 70 35 65 50"
          stroke="#86efac"
          strokeWidth="1.5"
          fill="none"
          opacity="0.7"
        />
      </motion.g>
      
      {/* Cauda */}
      <line x1="50" y1="62" x2="50" y2="75" stroke="#22c55e" strokeWidth="1.5" />
      
      {/* Brilho ao redor */}
      {state === 'SUCCESS' && (
        <motion.circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#facc15"
          strokeWidth="1"
          animate={{ r: [35, 45, 35] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
        />
      )}
    </motion.svg>
  );
};

// ELEFANTE (Floresta)
const ElefanteTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: {
      x: [0, 2, -2, 0],
      duration: 3
    },
    ACTIVE: {
      x: [0, 4, -4, 0],
      scale: [1, 1.05, 1],
      duration: 1
    },
    SUCCESS: {
      y: [0, -5, 0],
      rotate: [0, 5, -5, 0],
      duration: 0.8
    },
    LOW_ENERGY: {
      x: [0, 1, -1, 0],
      opacity: [0.5, 0.7, 0.5],
      duration: 4
    },
    ALERT: {
      x: [0, 5, -5, 0],
      scale: [1, 1.15, 1],
      duration: 0.5
    }
  };

  const anim = stateAnimations[state];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-12 h-12"
      animate={anim}
      transition={{ repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Corpo */}
      <ellipse cx="50" cy="60" rx="15" ry="18" fill="#16a34a" />
      
      {/* Cabeça */}
      <circle cx="50" cy="35" r="10" fill="#22c55e" />
      
      {/* Tromba */}
      <motion.path
        d="M 50 45 Q 45 55 42 70"
        stroke="#16a34a"
        strokeWidth="3"
        fill="none"
        animate={state === 'ACTIVE' ? { d: "M 50 45 Q 40 58 35 75" } : {}}
        transition={{ duration: 0.3 }}
      />
      
      {/* Olhos */}
      <circle cx="46" cy="32" r="1" fill="#000" />
      <circle cx="54" cy="32" r="1" fill="#000" />
      
      {/* Orelhas grandes */}
      <ellipse cx="35" cy="30" rx="8" ry="12" fill="#16a34a" opacity="0.7" />
      <ellipse cx="65" cy="30" rx="8" ry="12" fill="#16a34a" opacity="0.7" />
      
      {/* Pernas */}
      <rect x="38" y="75" width="4" height="15" fill="#16a34a" rx="2" />
      <rect x="58" y="75" width="4" height="15" fill="#16a34a" rx="2" />
      
      {/* Aura quando sucesso */}
      {state === 'SUCCESS' && (
        <motion.circle
          cx="50"
          cy="60"
          r="30"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="1.5"
          animate={{ r: [30, 40, 30] }}
          transition={{ repeat: Infinity, duration: 1 }}
        />
      )}
    </motion.svg>
  );
};

// ONÇA-PINTADA (Sertão)
const OncaPintadaTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: {
      x: [0, 2, -2, 0],
      y: [0, 1, -1, 0],
      duration: 2.5
    },
    ACTIVE: {
      x: [0, 6, -6, 0],
      scale: [1, 1.1, 1],
      duration: 0.7
    },
    SUCCESS: {
      rotate: 360,
      scale: [1, 1.2, 1],
      duration: 1
    },
    LOW_ENERGY: {
      x: [0, 1, -1, 0],
      opacity: [0.4, 0.6, 0.4],
      duration: 5
    },
    ALERT: {
      x: [0, 8, -8, 0],
      scale: [1, 1.25, 1],
      duration: 0.4
    }
  };

  const anim = stateAnimations[state];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-12 h-12"
      animate={anim}
      transition={{ repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Corpo */}
      <ellipse cx="50" cy="55" rx="16" ry="15" fill="#dc2626" />
      
      {/* Cabeça */}
      <circle cx="50" cy="32" r="10" fill="#ef4444" />
      
      {/* Orelhas pontudas */}
      <polygon points="40,18 35,8 38,20" fill="#dc2626" />
      <polygon points="60,18 65,8 62,20" fill="#dc2626" />
      
      {/* Olhos alertas */}
      <circle cx="46" cy="30" r="1.5" fill="#fbbf24" />
      <circle cx="54" cy="30" r="1.5" fill="#fbbf24" />
      
      {/* Focinho */}
      <circle cx="50" cy="38" r="3" fill="#fca5a5" />
      
      {/* Manchas (pintas) */}
      <circle cx="42" cy="50" r="2" fill="#991b1b" />
      <circle cx="58" cy="50" r="2" fill="#991b1b" />
      <circle cx="48" cy="62" r="1.5" fill="#991b1b" />
      <circle cx="52" cy="62" r="1.5" fill="#991b1b" />
      
      {/* Cauda curvada */}
      <motion.path
        d="M 65 60 Q 75 55 78 42"
        stroke="#dc2626"
        strokeWidth="3"
        fill="none"
        animate={state === 'ACTIVE' ? { d: "M 65 60 Q 80 50 85 35" } : {}}
      />
      
      {/* Aura vermelha quando alerta */}
      {state === 'ALERT' && (
        <motion.circle
          cx="50"
          cy="55"
          r="28"
          fill="none"
          stroke="#f97316"
          strokeWidth="1"
          animate={{ r: [28, 35, 28] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
        />
      )}
    </motion.svg>
  );
};

// SABIÁ-LARANJEIRA (Ventos)
const SabiaTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: {
      y: [0, -2, 0],
      rotate: [0, 3, -3, 0],
      duration: 2.2
    },
    ACTIVE: {
      y: [0, -10, 0],
      rotate: [0, 8, -8, 0],
      duration: 0.6
    },
    SUCCESS: {
      y: [0, -15, 0],
      rotate: [0, 360, 0],
      duration: 1.3
    },
    LOW_ENERGY: {
      y: [0, -1, 0],
      opacity: [0.5, 0.7, 0.5],
      duration: 4
    },
    ALERT: {
      y: [0, -12, 0],
      rotate: [0, 12, -12, 0],
      scale: [1, 1.15, 1],
      duration: 0.5
    }
  };

  const anim = stateAnimations[state];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-12 h-12"
      animate={anim}
      transition={{ repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Corpo */}
      <ellipse cx="50" cy="55" rx="10" ry="12" fill="#f97316" />
      
      {/* Cabeça */}
      <circle cx="50" cy="38" r="7" fill="#ea580c" />
      
      {/* Crista/Cabeça pontuda */}
      <polygon points="50,30 46,28 54,28" fill="#f97316" />
      
      {/* Olhos */}
      <circle cx="48" cy="36" r="1" fill="#000" />
      <circle cx="52" cy="36" r="1" fill="#000" />
      
      {/* Bico */}
      <polygon points="53,38 60,37 53,40" fill="#fbbf24" />
      
      {/* Asas */}
      <motion.g
        animate={state === 'IDLE' ? { rotate: [0, 15, -15, 0] } : { rotate: [0, 30, -30, 0] }}
        transition={{ repeat: Infinity, duration: state === 'IDLE' ? 0.5 : 0.25 }}
      >
        <path d="M 42 52 Q 30 50 32 65" stroke="#f97316" strokeWidth="2" fill="none" />
        <path d="M 58 52 Q 70 50 68 65" stroke="#f97316" strokeWidth="2" fill="none" />
      </motion.g>
      
      {/* Cauda em leque */}
      <line x1="50" y1="67" x2="50" y2="80" stroke="#f97316" strokeWidth="2" />
      <line x1="48" y1="70" x2="40" y2="82" stroke="#f97316" strokeWidth="1.5" />
      <line x1="52" y1="70" x2="60" y2="82" stroke="#f97316" strokeWidth="1.5" />
      
      {/* Brilho ao voo */}
      {state === 'ACTIVE' && (
        <motion.circle
          cx="50"
          cy="40"
          r="20"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="0.5"
          animate={{ r: [20, 28, 20] }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
      )}
    </motion.svg>
  );
};

// CORUJA-BURAQUEIRA (Cosmos)
const CorujaTotem = ({ state = 'IDLE' }) => {
  const stateAnimations = {
    IDLE: {
      rotate: [0, 2, -2, 0],
      y: [0, 1, -1, 0],
      duration: 2.5
    },
    ACTIVE: {
      rotate: [0, 8, -8, 0],
      scale: [1, 1.1, 1],
      duration: 0.8
    },
    SUCCESS: {
      scale: [1, 1.3, 1],
      rotate: [0, 360, 0],
      duration: 1.5
    },
    LOW_ENERGY: {
      rotate: [0, 1, -1, 0],
      opacity: [0.4, 0.6, 0.4],
      duration: 5
    },
    ALERT: {
      rotate: [0, 10, -10, 0],
      scale: [1, 1.2, 1],
      duration: 0.5
    }
  };

  const anim = stateAnimations[state];

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className="w-12 h-12"
      animate={anim}
      transition={{ repeat: Infinity, repeatType: 'loop' }}
    >
      {/* Corpo */}
      <ellipse cx="50" cy="60" rx="12" ry="14" fill="#7c3aed" />
      
      {/* Cabeça */}
      <circle cx="50" cy="38" r="11" fill="#a855f7" />
      
      {/* Olhos grandes */}
      <circle cx="43" cy="35" r="4" fill="#fbbf24" />
      <circle cx="57" cy="35" r="4" fill="#fbbf24" />
      
      {/* Pupilas que seguem */}
      <motion.circle
        cx="43"
        cy="35"
        r="2"
        fill="#000"
        animate={state === 'ALERT' ? { cy: 33 } : { cy: 35 }}
      />
      <motion.circle
        cx="57"
        cy="35"
        r="2"
        fill="#000"
        animate={state === 'ALERT' ? { cy: 33 } : { cy: 35 }}
      />
      
      {/* Sobrancelhas */}
      <path d="M 40 28 Q 43 26 46 28" stroke="#7c3aed" strokeWidth="1.5" fill="none" />
      <path d="M 54 28 Q 57 26 60 28" stroke="#7c3aed" strokeWidth="1.5" fill="none" />
      
      {/* Bico */}
      <polygon points="50,42 48,46 52,46" fill="#f97316" />
      
      {/* Pernas de coruja */}
      <rect x="46" y="72" width="2" height="8" fill="#7c3aed" />
      <rect x="52" y="72" width="2" height="8" fill="#7c3aed" />
      
      {/* Asas */}
      <ellipse cx="35" cy="58" rx="6" ry="10" fill="#7c3aed" opacity="0.6" />
      <ellipse cx="65" cy="58" rx="6" ry="10" fill="#7c3aed" opacity="0.6" />
      
      {/* Aura cósmica quando ativa */}
      {state === 'ACTIVE' && (
        <motion.circle
          cx="50"
          cy="50"
          r="32"
          fill="none"
          stroke="#a855f7"
          strokeWidth="1"
          animate={{ r: [32, 42, 32] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
        />
      )}
    </motion.svg>
  );
};

// Componente principal
export const AnimalTotem = ({ biome = 'floresta', state = 'IDLE' }) => {
  const animals = {
    nascente: BeijaFlorTotem,
    floresta: ElefanteTotem,
    sertao: OncaPintadaTotem,
    ventos: SabiaTotem,
    cosmos: CorujaTotem
  };

  const AnimalComponent = animals[biome] || animals.floresta;

  return (
    <div className="flex items-center justify-center">
      <AnimalComponent state={state} />
    </div>
  );
};

export default AnimalTotem;
