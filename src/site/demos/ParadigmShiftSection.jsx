import React from "react";
import { motion } from "framer-motion";
import { 
    IconTrash, IconNeural, IconVision, IconFlux, IconPapyrus, IconGrowth,
} from "../../components/icons/PranaLandscapeIcons";

// --- DIAGRAMA 1: O VELHO (LINEAR) ---
const LinearDiagram = () => {
    return (
        <div className="h-full relative flex flex-col items-center justify-center overflow-hidden">
            {/* Status */}
            <div className="absolute top-4 right-4 font-mono text-[8px] tracking-widest z-30 opacity-60 text-red-500">
                STATUS: DRAINING
            </div>

            {/* A "Esteira" da Morte */}
            <div className="relative w-full max-w-[200px] flex flex-col items-center h-full pt-8">
                {/* Linha Vertical */}
                <div className="absolute top-0 bottom-0 w-px border-l border-dashed border-[var(--text-secondary)]/20"></div>

                {/* Tarefas Caindo */}
                {[0, 1, 2, 3].map((i) => (
                    <motion.div
                        key={i}
                        initial={{ y: -40, opacity: 0 }}
                        animate={{ y: 220, opacity: [0, 1, 1, 0] }} 
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            delay: i * 1.5, 
                            ease: "linear" 
                        }}
                        className="absolute w-32 h-8 bg-[var(--bg-color)] border border-[var(--text-secondary)]/20 rounded flex items-center px-3 z-10 shadow-sm"
                    >
                        <div className="w-2 h-2 border border-red-400/50 rounded-sm mr-2"></div>
                        <div className="h-1 w-16 bg-[var(--text-secondary)]/20 rounded"></div>
                    </motion.div>
                ))}
            </div>

            {/* O Lixo / Vazio */}
            <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[var(--card-bg-solid)] to-transparent z-20 flex items-end justify-center pb-6">
                <div className="flex flex-col items-center opacity-40 group-hover:opacity-70 transition-opacity">
                    <IconTrash className="w-5 h-5 text-red-500 mb-1" />
                    <span className="text-[8px] uppercase tracking-widest text-red-500 font-mono">Vazio</span>
                </div>
            </div>
        </div>
    );
};

// --- DIAGRAMA 2: O NOVO (SOCD) ---
const SocdDiagram = () => {
    return (
        <div className="h-full relative flex items-center justify-center overflow-hidden">
             
             {/* Status */}
             <div className="absolute top-4 right-4 font-mono text-[8px] text-[var(--accent)] opacity-60 tracking-widest animate-pulse">
                SYSTEM: LEARNING
            </div>

            {/* O CICLO SOCD */}
            <div className="relative w-56 h-56 flex items-center justify-center">
                
                {/* 1. Orbitas de Fundo */}
                <div className="absolute inset-0 rounded-full border border-[var(--accent)]/10"></div>
                <div className="absolute inset-4 rounded-full border border-dashed border-[var(--accent)]/5 opacity-50"></div>

                {/* 2. A Partícula de Energia (Cometa) */}
                <motion.div 
                    className="absolute inset-0 z-10"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-[var(--accent)] rounded-full shadow-[0_0_15px_var(--accent)]"></div>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-t border-[var(--accent)]/50 rounded-full -rotate-45 opacity-50 blur-[1px]"></div>
                </motion.div>

                {/* 3. O Núcleo (Ash) */}
                <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="relative flex items-center justify-center">
                        <motion.div 
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl"
                        ></motion.div>
                        <IconNeural className="w-10 h-10 text-[var(--accent)] relative z-10 drop-shadow-xl" />
                    </div>
                </div>

                {/* 4. Feedback Loop Indicador */}
                <div className="absolute bottom-12 flex flex-col items-center justify-center opacity-60">
                    <span className="text-[6px] text-[var(--accent)] font-mono uppercase tracking-widest mt-1">Feedback Loop</span>
                </div>

                {/* 5. Os 4 Nós (S-O-C-D) */}
                
                {/* SHOW */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                    <div className="w-8 h-8 bg-[var(--bg-color)] border border-[var(--accent)]/20 rounded-full flex items-center justify-center shadow-lg mb-1 group-hover:border-[var(--accent)] transition-colors">
                        <IconVision className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--bg-color)]/90 border border-[var(--glass-border)] px-2 py-0.5 rounded backdrop-blur shadow-sm">Show</span>
                </div>

                {/* ORGANIZE */}
                <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                    <div className="w-8 h-8 bg-[var(--bg-color)] border border-[var(--accent)]/20 rounded-full flex items-center justify-center shadow-lg mb-1 group-hover:border-[var(--accent)] transition-colors">
                        <IconFlux className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--bg-color)]/90 border border-[var(--glass-border)] px-2 py-0.5 rounded backdrop-blur shadow-sm">Organize</span>
                </div>

                {/* CREATE */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center z-30">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--bg-color)]/90 border border-[var(--glass-border)] px-2 py-0.5 rounded backdrop-blur mb-1 shadow-sm">Create</span>
                    <div className="w-8 h-8 bg-[var(--bg-color)] border border-[var(--accent)]/20 rounded-full flex items-center justify-center shadow-lg group-hover:border-[var(--accent)] transition-colors">
                        <IconPapyrus className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    </div>
                </div>

                {/* DEVELOP */}
                <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                    <div className="w-8 h-8 bg-[var(--bg-color)] border border-[var(--accent)]/20 rounded-full flex items-center justify-center shadow-lg mb-1 group-hover:border-[var(--accent)] transition-colors">
                        <IconGrowth className="w-3 h-3 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] bg-[var(--bg-color)]/90 border border-[var(--glass-border)] px-2 py-0.5 rounded backdrop-blur shadow-sm">Develop</span>
                </div>

            </div>
        </div>
    );
};

const ParadigmShiftSection = () => {
    return (
        <section className="py-24 px-6 bg-[var(--bg-color)] border-b border-[var(--glass-border)] transition-colors duration-500">
            
            {/* AQUI ESTÁ A CORREÇÃO DA TEXTURA: 
               Usamos 'invert(1)' no modo escuro para que as linhas pretas da textura
               se tornem brancas e fiquem visíveis sobre o fundo escuro.
            */}
            <style>{`
                .texture-layer {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    background-repeat: repeat;
                    z-index: 0;
                }

                /* TEMA ESCURO: Inverte cores da textura (linhas pretas viram brancas) */
                [data-theme='prana-dark-textured'] .texture-layer {
                    background-image: url('https://www.transparenttextures.com/patterns/cartography.png');
                    filter: invert(1) opacity(0.12); 
                    mix-blend-mode: screen; 
                }
                
                /* TEMA CLARO: Normal (linhas pretas no fundo claro) */
                [data-theme='prana-light-textured'] .texture-layer {
                    background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
                    opacity: 0.6;
                    mix-blend-mode: multiply;
                }

                /* Fallback se data-theme não carregar */
                @media (prefers-color-scheme: dark) {
                     .texture-layer { 
                        background-image: url('https://www.transparenttextures.com/patterns/cartography.png');
                        filter: invert(1) opacity(0.12);
                        mix-blend-mode: screen;
                     }
                }
            `}</style>

            <div className="max-w-6xl mx-auto">
                
                {/* HEADER */}
                <div className="text-center mb-20">
                    <span className="text-[var(--text-secondary)] font-mono text-xs uppercase tracking-widest mb-4 block opacity-60">
                        Evolução de Software
                    </span>
                    <h2 className="text-3xl md:text-5xl serif-font text-[var(--text-primary)] mb-6 leading-tight">
                        Deixamos de ser <span className="line-through decoration-red-500/50 decoration-2 opacity-60">Lista</span>. <br />
                        Nos tornamos <span className="text-[var(--accent)] italic">Sistema</span>.
                    </h2>
                    <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg font-light leading-relaxed">
                        A diferença entre gerenciar tarefas e gerenciar a própria vida está na arquitetura do fluxo.
                    </p>
                </div>

                {/* GRID DE COMPARAÇÃO */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch h-[450px]">
                    
                    {/* ESQUERDA: GERENCIADOR DE TAREFAS */}
                    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[var(--card-bg-solid)] group hover:border-red-500/20 transition-all duration-500 relative shadow-md">
                        {/* Camada de Textura */}
                        <div className="texture-layer"></div>
                        
                        <div className="absolute top-6 left-6 z-20">
                            <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-red-400 transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/50"></span>
                                Gerenciador de Tarefas
                            </span>
                        </div>

                        <div className="flex-1 relative w-full border-b border-[var(--glass-border)] z-10">
                            <LinearDiagram />
                        </div>
                        
                        <div className="p-6 h-[140px] flex flex-col justify-center relative z-10 bg-[var(--card-bg-solid)]/80 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                                O Descarte
                            </h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                Você completa a tarefa e ela desaparece no vazio. O sistema não aprende nada. 
                                Amanhã, você começa do zero.
                            </p>
                        </div>
                    </div>

                    {/* DIREITA: GERENCIADOR DE VIDA (PRANA) */}
                    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-transparent bg-[var(--card-bg-solid)] group hover:border-[var(--accent)]/40 transition-all duration-700 relative hover:shadow-[0_0_50px_-20px_rgba(217,119,6,0.15)] shadow-md">
                        {/* Camada de Textura */}
                        <div className="texture-layer"></div>
                        
                        <div className="absolute top-6 left-6 z-20">
                            <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></span>
                                Gerenciador de Vida
                            </span>
                        </div>

                        <div className="flex-1 relative w-full border-b border-[var(--glass-border)] group-hover:border-[var(--accent)]/10 transition-colors z-10">
                            <SocdDiagram />
                        </div>

                        <div className="p-6 h-[140px] flex flex-col justify-center relative z-10 bg-[var(--card-bg-solid)]/80 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                                O Ciclo Evolutivo
                            </h3>
                            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                                <strong>Show → Organize → Create → Develop.</strong><br/>
                                O output de hoje vira o input de amanhã. O sistema aprende com sua energia e fica mais inteligente a cada uso.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ParadigmShiftSection;