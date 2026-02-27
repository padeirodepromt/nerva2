import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconCheckCircle } from "../../components/icons/PranaLandscapeIcons";
import RiverNacenteCinematic from "../../components/biome/RiverNacenteCinematic";
import FruitForestCinematic from "../../components/biome/FruitForestCinematic";
import OceanCinematic from "../../components/biome/OceanCinematic";

const BiomaSection = () => {
  const [activeBiome, setActiveBiome] = useState(0);
  
  // Mascots & Data
  const biomes = [
    { 
      id: 'nascente',
      name: 'Nascente', 
      mascot: '🐦', // Beija-flor
      component: RiverNacenteCinematic, 
      desc: 'Modo Criativo', 
      detail: 'Fluxo leve e desbloqueio mental. Ideal para brainstorming.',
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      border: 'border-blue-400/30'
    },
    { 
      id: 'floresta', 
      name: 'Floresta', 
      mascot: '🐘', // Elefante
      component: FruitForestCinematic, 
      desc: 'Modo Deep Work', 
      detail: 'Foco profundo e grounding. Remove distrações visuais.',
      color: 'text-green-500', 
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    },
    { 
      id: 'sertao', 
      name: 'Sertão', 
      mascot: '🐆', // Onça
      // Fallback or specific visual
      component: ({className}) => (
        <div className={`w-full h-full bg-[#3f2e18] relative overflow-hidden ${className}`}>
             <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,#d97706,transparent)] animate-pulse"></div>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-10 blur-sm">🐆</div>
        </div>
      ), 
      desc: 'Modo Execução', 
      detail: 'Alta energia e contraste. Para limpar a pauta com coragem.',
      color: 'text-orange-500', 
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30'
    },
    { 
      id: 'oceano', 
      name: 'Oceano', 
      mascot: '🐋', // Baleia
      component: OceanCinematic, 
      desc: 'Modo Regenerativo', 
      detail: 'Introspecção e calma. Reduz a frequência cardíaca visual.',
      color: 'text-cyan-300', 
      bg: 'bg-cyan-300/10',
      border: 'border-cyan-300/30'
    }
  ];

  const CurrentComponent = biomes[activeBiome].component;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8 lg:gap-12">
        {/* Top: Header & Tabs */}
        <div className="text-center w-full flex flex-col items-center">
            <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 block">Biomodulação Ambiental</span>
            <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                O Ambiente se Molda a Você
            </h2>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed max-w-2xl text-center">
                Por que lutar contra a interface? Escolha o <strong className="text-[var(--accent)]">Bioma</strong> que ressoa com seu estado atual e veja o Prana se transformar instantaneamente.
            </p>

            <div className="flex flex-wrap justify-center gap-2 w-full max-w-4xl mx-auto mb-8">
                {biomes.map((b, i) => (
                    <button 
                        key={i}
                        onClick={() => setActiveBiome(i)}
                        className={`group flex items-center gap-3 px-4 py-2 rounded-full border transition-all duration-300 relative overflow-hidden ${
                            activeBiome === i 
                            ? `bg-[var(--card-bg-solid)] ${b.border} shadow-lg scale-105`
                            : 'bg-transparent border-transparent hover:bg-[var(--text-primary)]/5 opacity-60 hover:opacity-100'
                        }`}
                    >
                        {/* Selected Indicator */}
                        {activeBiome === i && (
                            <motion.div layoutId="biome-active" className={`absolute inset-0 ${b.bg} opacity-20`} />
                        )}

                        <div className={`relative z-10 text-xl transition-transform duration-300 ${activeBiome === i ? 'scale-110' : 'grayscale group-hover:grayscale-0'}`}>
                            {b.mascot}
                        </div>
                        <div className="relative z-10 text-left">
                            <h4 className={`font-bold text-xs ${activeBiome === i ? b.color : 'text-[var(--text-primary)]'}`}>{b.name}</h4>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Bottom: Visual Experience */}
        <div className="w-full h-[500px] bg-[var(--card-bg-solid)] rounded-2xl border border-[var(--glass-border)] relative overflow-hidden group shadow-2xl scale-[0.85] origin-top">
            {/* Cinematic View */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeBiome}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <CurrentComponent className="w-full h-full object-cover" />
                </motion.div>
            </AnimatePresence>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-80 pointer-events-none"></div>
            
            {/* Context Info */}
            <div className="absolute bottom-8 left-8 right-8 z-10">
                 <motion.div 
                    key={activeBiome}
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.3}}
                 >
                     <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3 border ${biomes[activeBiome].border} ${biomes[activeBiome].bg} ${biomes[activeBiome].color} backdrop-blur-md`}>
                        Bioma Ativo
                     </div>
                     <h3 className="text-3xl text-[var(--text-primary)] font-serif font-bold mb-2">
                        {biomes[activeBiome].name}
                     </h3>
                     <p className="text-[var(--text-secondary)] max-w-md text-sm leading-relaxed backdrop-blur-sm">
                        {biomes[activeBiome].detail}
                     </p>
                 </motion.div>
            </div>
        </div>
        
        {/* Alignment spacer due to scale */}
        <div className="-mt-16"></div>
    </div>
  );
};

export default BiomaSection;