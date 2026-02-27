/* src/components/share/PranaShareCard.jsx
   desc: Card Social V3.0 (AI Integrated).
   feat: Design Vertical para Stories, Loading State para IA e Aura Energética.
*/
import React from 'react';
import { IconBrainCircuit, IconCheckCircle, IconClock, IconZap, IconLeaf, IconLoader2 } from '@/components/icons/PranaLandscapeIcons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

// Configuração de Energias (Temas Visuais)
const ENERGY_THEMES = {
    deep_work: {
        gradient: "from-indigo-900/60 via-black to-purple-900/40",
        accent: "text-indigo-300",
        blur: "bg-indigo-500/20",
        icon: IconZap,
        label: "Imersão Profunda"
    },
    flow: {
        gradient: "from-emerald-900/60 via-black to-teal-900/40",
        accent: "text-emerald-300",
        blur: "bg-emerald-500/20",
        icon: IconLeaf,
        label: "Fluxo Contínuo"
    },
    fire: { 
        gradient: "from-orange-900/60 via-black to-red-900/40",
        accent: "text-orange-300",
        blur: "bg-orange-500/20",
        icon: IconZap,
        label: "Alta Intensidade"
    }
};

export const PranaShareCard = ({ 
    stats = { hours: 0, tasks: 0, focusScore: 0 }, 
    ashInsight, 
    energyType = "deep_work", // Definido pelo Ash
    isLoadingAI = false,      // Estado de carregamento da IA
    userName = "Arquiteto" 
}) => {
    const theme = ENERGY_THEMES[energyType] || ENERGY_THEMES.deep_work;
    const ThemeIcon = theme.icon;

    return (
        <div id="prana-share-card" className="w-[360px] h-[640px] bg-background relative overflow-hidden flex flex-col justify-between text-white select-none shadow-2xl">
            
            {/* 1. AMBIENTE (Aura Energética) */}
            <div className={cn("absolute top-0 left-0 w-full h-full bg-gradient-to-br transition-colors duration-700", theme.gradient)} />
            
            {/* Orbes de Luz */}
            <div className={cn("absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[90px] opacity-60", theme.blur)} />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />

            {/* Padrão de Ruído (Granulação Wabi-Sabi) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

            {/* 2. CONTEÚDO */}
            <div className="relative z-10 flex flex-col h-full p-8">
                
                {/* Header */}
                <div className="flex justify-between items-start pt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Prana OS</span>
                        <span className="text-sm font-serif italic text-white/80">{format(new Date(), "dd 'de' MMMM", { locale: ptBR })}</span>
                    </div>
                    <div className="p-2 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
                        <IconBrainCircuit className="w-5 h-5 text-white/90" />
                    </div>
                </div>

                {/* Core Stat (O Foco Principal) */}
                <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/10 blur-2xl rounded-full scale-75 group-hover:scale-100 transition-transform duration-1000" />
                        <ThemeIcon className={cn("w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]", theme.accent)} />
                    </div>
                    
                    <h1 className="text-8xl font-serif font-bold mt-6 leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60">
                        {stats.hours}<span className="text-4xl text-white/30 font-light">h</span>
                    </h1>
                    
                    <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mt-3 border-b border-white/10 pb-1", theme.accent)}>
                        {theme.label}
                    </p>
                </div>

                {/* Grid de Métricas Secundárias */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <div className="bg-black/20 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex flex-col items-center">
                        <span className="text-2xl font-bold">{stats.tasks}</span>
                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-400/80 mt-1">
                            <IconCheckCircle className="w-3 h-3" /> Missões
                        </div>
                    </div>
                    <div className="bg-black/20 border border-white/10 rounded-xl p-3 backdrop-blur-sm flex flex-col items-center">
                        <span className="text-2xl font-bold">{stats.focusScore || 95}%</span>
                        <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-blue-400/80 mt-1">
                            <IconClock className="w-3 h-3" /> Eficiência
                        </div>
                    </div>
                </div>

                {/* 3. A MENSAGEM DO ASH (Autoconhecimento) */}
                <div className="relative">
                    <div className="absolute -left-4 -top-4 text-6xl font-serif text-white/5 pointer-events-none">“</div>
                    <div className="bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-2xl">
                        <div className="bg-background/80 backdrop-blur-xl rounded-2xl p-5 border border-white/5 relative overflow-hidden min-h-[130px] flex flex-col justify-center">
                            
                            {/* Brilho interno do card */}
                            <div className={cn("absolute top-0 left-0 w-full h-1 opacity-50", theme.blur)} />
                            
                            {/* Estado de Carregamento vs Mensagem */}
                            {isLoadingAI ? (
                                <div className="flex flex-col items-center gap-3 text-white/30 animate-pulse">
                                    <IconLoader2 className="w-5 h-5 animate-spin" />
                                    <span className="text-[10px] uppercase tracking-widest font-medium">Sintonizando Energia...</span>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm font-serif leading-relaxed text-white/90 italic text-center animate-in fade-in zoom-in-95 duration-700">
                                        {ashInsight || "A energia flui para onde a atenção vai."}
                                    </p>
                                    
                                    <div className="mt-4 flex justify-center items-center gap-2 opacity-40">
                                        <div className="h-px w-8 bg-white/20" />
                                        <IconBrainCircuit className="w-3 h-3" />
                                        <div className="h-px w-8 bg-white/20" />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};