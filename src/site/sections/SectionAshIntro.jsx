import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IconNeural, IconKeep, IconChat, IconMatrix, IconCheck, IconLock, IconCheckCircle, IconCheckSquare,
  IconVision, IconFlux, IconPapyrus, IconSoul, IconFogo, IconAlertTriangle, IconArrowRight, IconX,
  IconCalendar, IconLayout, IconMenu, IconDashboard
} from "../../components/icons/PranaLandscapeIcons";

// Import Visual
import LiveDemoAsh from "../demos/LiveDemoAsh"; 

// --- 1. O DIAGRAMA DE MIDDLEWARE (Mantido igual, pois já funciona) ---
const AshMiddlewareDiagram = () => {
    return (
        <div className="relative w-full h-[350px] flex items-center justify-center py-8">
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="currentColor" strokeWidth="2" />
                <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
                <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
            </svg>
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} className="absolute left-0 md:left-[0%] text-center z-10">
                <div className="glass-card px-4 py-2 rounded-lg border border-[var(--glass-border)] text-xs mono-font mb-2 bg-[var(--card-bg-solid)]">"Criar Lançamento"</div>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Sua Intenção</p>
            </motion.div>
            <motion.div className="relative z-10 w-32 h-32 flex items-center justify-center">
                <div className="absolute inset-0 bg-[var(--accent)] blur-[60px] opacity-20 animate-pulse" />
                <div className="w-24 h-24 rounded-full glass-card border border-[var(--accent)] flex items-center justify-center bg-[var(--card-bg-solid)] shadow-[0_0_30px_rgba(217,119,6,0.3)]">
                    <IconChat className="w-10 h-10 text-[var(--accent)] animate-pulse" />
                </div>
                <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-12 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">+ Memória</motion.div>
                <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-12 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">+ Energia</motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="absolute right-0 md:right-[0%] text-center w-48 z-10">
                <div className="glass-card p-4 rounded-lg border border-[var(--accent)]/30 text-left bg-[var(--card-bg-solid)]">
                    <div className="text-[9px] text-[var(--accent)] mb-1 uppercase font-bold">Prompt Enriquecido</div>
                    <div className="text-xs text-[var(--text-secondary)]">Contexto + Intenção - <br/> <span className="text-[var(--text-primary)]">Execução Perfeita</span></div>
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Resposta LLM</p>
            </motion.div>
        </div>
    );
};

// --- VISUAIS SCHEMATIC (BLUEPRINTS DELICADOS) ---
// Estes componentes simulam a interface do Prana de forma limpa e elegante.

const SchematicSanctuary = () => (
    <div className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden">
        {/* Header Simulado */}
        <div className="flex justify-between items-center opacity-50 mb-2">
            <div className="w-16 h-2 bg-current rounded-full opacity-30"></div>
            <div className="w-4 h-4 rounded-full border border-current opacity-30"></div>
        </div>
        
        {/* Gráfico de Energia Suave */}
        <div className="relative h-20 w-full flex items-end gap-1">
            <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                <path d="M0,40 Q10,30 20,35 T40,20 T60,30 T80,10 T100,25" fill="none" stroke="var(--accent)" strokeWidth="1.5" className="opacity-80" />
                <path d="M0,40 Q10,30 20,35 T40,20 T60,30 T80,10 T100,25 V40 H0Z" fill="var(--accent)" className="opacity-10" />
            </svg>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="h-8 border border-[var(--glass-border)] rounded bg-[var(--bg-color)]/30 flex items-center px-2 gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 opacity-70"></div>
                <div className="h-1 w-10 bg-current opacity-20 rounded-full"></div>
            </div>
            <div className="h-8 border border-[var(--glass-border)] rounded bg-[var(--bg-color)]/30 flex items-center px-2 gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400 opacity-70"></div>
                <div className="h-1 w-8 bg-current opacity-20 rounded-full"></div>
            </div>
        </div>
    </div>
);

const SchematicOrganizer = () => (
    <div className="w-full h-full p-4 flex flex-col relative">
        {/* Árvore Hierárquica */}
        <div className="flex items-center gap-2 mb-3">
            <IconFlux className="w-3 h-3 text-[var(--accent)]" />
            <span className="text-[8px] uppercase tracking-widest opacity-50">Master Plan</span>
        </div>
        
        <div className="space-y-3 relative pl-1">
            {/* Linha vertical da árvore */}
            <div className="absolute left-[3px] top-2 bottom-2 w-px bg-[var(--glass-border)]"></div>
            
            <div className="flex items-center gap-3 relative">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] relative z-10"></div>
                <div className="h-4 w-full border border-[var(--glass-border)] rounded bg-[var(--bg-color)]/50 flex items-center px-2">
                    <div className="h-1 w-20 bg-current opacity-30 rounded-full"></div>
                </div>
            </div>
            
            <div className="flex items-center gap-3 pl-4 relative">
                <div className="absolute left-[3px] top-1/2 w-4 h-px bg-[var(--glass-border)]"></div>
                <div className="w-1 h-1 rounded-full border border-[var(--text-secondary)] bg-[var(--bg-color)] relative z-10"></div>
                <div className="h-4 w-full border border-[var(--glass-border)] rounded bg-[var(--bg-color)]/30 flex items-center px-2">
                    <div className="h-1 w-16 bg-current opacity-20 rounded-full"></div>
                </div>
            </div>

            <div className="flex items-center gap-3 pl-4 relative">
                <div className="absolute left-[3px] top-1/2 w-4 h-px bg-[var(--glass-border)]"></div>
                <div className="w-1 h-1 rounded-full border border-[var(--text-secondary)] bg-[var(--bg-color)] relative z-10"></div>
                <div className="h-4 w-full border border-[var(--glass-border)] rounded bg-[var(--bg-color)]/30 flex items-center px-2">
                    <div className="h-1 w-12 bg-current opacity-20 rounded-full"></div>
                </div>
            </div>
        </div>
    </div>
);

const SchematicEditor = () => (
    <div className="w-full h-full p-5 flex flex-col font-serif relative">
        <div className="text-[10px] text-[var(--text-primary)] opacity-90 italic mb-3 border-b border-[var(--glass-border)] pb-2">
            Projeto Manifesto.md
        </div>
        <div className="space-y-2 opacity-70">
            <div className="h-2 w-3/4 bg-current opacity-20 rounded-sm"></div>
            <div className="h-1.5 w-full bg-current opacity-10 rounded-sm"></div>
            <div className="h-1.5 w-full bg-current opacity-10 rounded-sm"></div>
            <div className="h-1.5 w-5/6 bg-current opacity-10 rounded-sm"></div>
        </div>
        
        {/* Sugestão do Ash */}
        <div className="mt-4 pl-2 border-l-2 border-[var(--accent)]">
            <div className="text-[6px] uppercase tracking-widest text-[var(--accent)] mb-1">Ash Sugere</div>
            <div className="h-1.5 w-full bg-[var(--accent)]/20 rounded-sm"></div>
            <div className="h-1.5 w-2/3 bg-[var(--accent)]/20 rounded-sm mt-1"></div>
        </div>
    </div>
);

const SchematicInsights = () => (
    <div className="w-full h-full p-4 flex flex-col justify-center items-center relative">
        <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-[var(--glass-border)]" />
                <circle cx="48" cy="48" r="40" stroke="var(--accent)" strokeWidth="4" fill="none" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" className="opacity-90" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-bold text-[var(--text-primary)]">85%</span>
                <span className="text-[6px] uppercase tracking-widest text-[var(--text-secondary)]">Eficiência</span>
            </div>
        </div>
        <div className="mt-4 flex gap-4 text-[8px] text-[var(--text-secondary)] uppercase tracking-widest">
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"></div> Manhã</div>
            <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[var(--glass-border)]"></div> Tarde</div>
        </div>
    </div>
);


// --- COMPONENTE INTERATIVO: SOCD TIMELINE ---
const SOCDTimeline = () => {
    const [activeStep, setActiveStep] = useState(0);

    const steps = [
        {
            id: 'show',
            title: '1. SHOW',
            subtitle: 'O Espelho',
            icon: IconDashboard,
            desc: "Peça ao Ash para ver o Projeto X da forma que quiser, ou para te mostrar qual a tarefa recomendada para o dia, com base na astrologia e no seu mood.",
            toolsText: "Santuário (Energia) e Views (Perspectiva)",
            VisualComponent: SchematicSanctuary
        },
        {
            id: 'organize',
            title: '2. ORGANIZE',
            subtitle: 'A Ordem',
            icon: IconDashboard,
            desc: "Peça ao Ash para criar árvores inteiras de projetos, realocar prazos e redefinir tarefas baseadas na sua bateria mental.",
            toolsText: "Hierarquia de Projetos e Planner",
            VisualComponent: SchematicOrganizer
        },
        {
            id: 'create',
            title: '3. CREATE',
            subtitle: 'O Fluxo Criativo',
            icon: IconDashboard,
            desc: "Ash é seu sócio de criação. Recebe inputs vagos e devolve projetos estruturados, sempre aguardando sua permissão.",
            toolsText: "Smart Modal (Cmd+K) e Doc Editor",
            VisualComponent: SchematicEditor
        },
        {
            id: 'develop',
            title: '4. DEVELOP',
            subtitle: 'A Sustentabilidade',
            icon: IconDashboard,
            desc: "O Ash busca sempre melhorar sua performance. A partir do entendimento do seu momento, sugere rotas melhores ou ainda dá força para seguir executando.",
            toolsText: "Rituais, Insights de Performance e Recomendações",
            VisualComponent: SchematicInsights
        }
    ];

    const ActiveVisual = steps[activeStep].VisualComponent;

    return (
        <div className="w-full mt-12 mb-24">
            
            {/* LINHA DO TEMPO (DELICADA) */}
            <div className="relative w-full py-10 px-4 md:px-12 mb-8">
                {/* Linha de Fundo */}
                <div className="absolute top-[40px] left-[10%] right-[10%] h-px bg-[var(--glass-border)] z-0"></div>
                {/* Linha Ativa */}
                <motion.div 
                    className="absolute top-[40px] left-[10%] h-px bg-[var(--accent)] z-0 origin-left transition-all duration-500"
                    style={{ width: `${(activeStep / (steps.length - 1)) * 80}%` }}
                />

                <div className="grid grid-cols-4 gap-4 relative z-10">
                    {steps.map((step, index) => {
                        const isActive = index === activeStep;
                        const Icon = step.icon;
                        
                        return (
                            <div key={step.id} className="relative group cursor-pointer flex flex-col items-center" onMouseEnter={() => setActiveStep(index)} onClick={() => setActiveStep(index)}>
                                {/* ÍCONE (MOEDA/TOKEN) */}
                                <motion.div 
                                    animate={{ 
                                        scale: isActive ? 1.1 : 1,
                                        borderColor: isActive ? 'var(--accent)' : 'var(--glass-border)',
                                        backgroundColor: isActive ? 'var(--bg-color)' : 'var(--card-bg-solid)',
                                        boxShadow: isActive ? '0 0 15px rgba(217,119,6,0.15)' : 'none'
                                    }}
                                    className={`w-14 h-14 md:w-16 md:h-16 rounded-full border flex items-center justify-center relative z-10 transition-colors duration-500`}
                                >
                                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)] opacity-60'} transition-all duration-300`} />
                                </motion.div>

                                <div className={`mt-4 text-center transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'}`}>
                                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] block ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                                        {step.title}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* O ARTEFATO (CARD DE CONTEÚDO) */}
            <div className="max-w-4xl mx-auto min-h-[260px] relative perspective-1000">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStep}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="w-full"
                    >
                        <div className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-sm overflow-hidden shadow-2xl relative group">
                            
                            {/* TEXTURA DE PAPEL/RUÍDO (A Alma do Prana) */}
                            <div className="absolute inset-0 opacity-[0.2] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]"></div>
                            
                            <div className="flex flex-col md:flex-row h-full">
                                
                                {/* ESQUERDA: CONTEÚDO TEÓRICO + FERRAMENTAS */}
                                <div className="flex-1 p-8 md:p-10 relative z-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[var(--glass-border)]">
                                    
                                    <div className="mb-4 flex items-center gap-3 opacity-50">
                                        <IconNeural className="w-3 h-3 text-[var(--text-secondary)]" />
                                        <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--text-secondary)]">Protocolo Ash</span>
                                    </div>
                                    
                                    <h3 className="serif-font text-3xl md:text-4xl text-[var(--text-primary)] mb-6 italic leading-tight">
                                        {steps[activeStep].subtitle}
                                    </h3>
                                    
                                    <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed font-light mb-8 max-w-md">
                                        {steps[activeStep].desc}
                                    </p>

                                    {/* Subseção de Ferramentas (Destaque Laranja) */}
                                    <div className="mt-auto pt-6 border-t border-[var(--glass-border)]">
                                        <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] block mb-2">
                                            Ferramentas do Sistema
                                        </span>
                                        <div className="text-sm font-medium text-[var(--text-primary)] font-mono">
                                            {steps[activeStep].toolsText}
                                        </div>
                                    </div>
                                </div>

                                {/* DIREITA: BLUEPRINT DA INTERFACE */}
                                <div className="w-full md:w-[40%] bg-[var(--bg-color)]/30 p-6 flex items-center justify-center relative">
                                    <div className="w-full aspect-square md:aspect-auto md:h-64 border border-[var(--glass-border)]/50 rounded-lg bg-[var(--bg-color)] shadow-sm overflow-hidden relative">
                                        {/* Grid de Fundo Técnico */}
                                        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
                                        
                                        <ActiveVisual />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

// --- COMPONENTES AUXILIARES (FeatureRow, PainPoint) MANTIDOS IGUAIS ---
const FeatureRow = ({ icon: Icon, title, text }) => (
    <div className="flex gap-4 p-3 hover:bg-[var(--card-bg-solid)] rounded-xl transition-all border border-transparent hover:border-[var(--glass-border)] group">
        <div className="shrink-0 mt-1 p-1.5 rounded-lg bg-[var(--bg-color)] group-hover:bg-[var(--accent)]/10 transition-colors border border-[var(--glass-border)] group-hover:border-[var(--accent)]/20">
            <Icon className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--accent)] transition-colors" />
        </div>
        <div>
            <strong className="block text-[var(--text-primary)] text-sm mb-0.5 font-bold">{title}</strong>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{text}</p>
        </div>
    </div>
);

const PainPointCard = ({ pain, solution }) => (
    <div className="p-5 rounded-xl border border-[var(--glass-border)] bg-[var(--card-bg-solid)] hover:border-orange-500/30 transition-colors group relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.5] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/paper.png')] mix-blend-overlay"></div>
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-start gap-3 mb-3 opacity-60 group-hover:opacity-100 transition-opacity relative z-10">
            <IconX className="w-4 h-4 text-red-500 mt-0.5" />
            <p className="text-xs text-[var(--text-secondary)] italic line-through decoration-orange-500/50">"{pain}"</p>
        </div>
        <div className="flex items-start gap-3 pl-1 border-l border-[var(--accent)]/30 relative z-10">
            <p className="text-sm text-[var(--text-primary)] font-medium">{solution}</p>
        </div>
    </div>
);

const SectionAshIntro = () => {
  return (
    <section id="ash-intro" className="relative py-32 bg-[var(--bg-color)] border-y border-[var(--glass-border)] snap-start w-full flex flex-col items-center">
      
      {/* CONTAINER MESTRE */}
      <div className="max-w-7xl px-6 w-full">
        
        {/* 1. HEADER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-24 pb-12 border-b border-[var(--glass-border)]">
            <div>
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/5">
                    <IconChat className="w-3 h-3 text-[var(--accent)]" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">Ash Intelligence System</span>
                </div>
                <h2 className="text-5xl md:text-7xl serif-font text-[var(--text-primary)] leading-[0.9]">
                    ASH - Seu Sócio de <br/>
                    <span className="italic text-[var(--accent)]">Pensamento e Execução.</span>
                </h2>
            </div>
            
            <div className="text-left lg:pl-8">
                <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed max-w-lg border-l border-[var(--glass-border)] pl-6">
                   Ash é um <strong>Agente Residente</strong>. 
                   Ele é a inteligência proativa que "mora" no seu sistema operacional. Que entende sua energia, cria e gerencia seus projetos e conecta sua vida pessoal e profissional em um fluxo contínuo.
                </p>
            </div>
        </div>

        {/* 2. DEMO + FEATURES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-40">
            <motion.div 
                initial={{opacity:0, x:-20}} whileInView={{opacity:1, x:0}} transition={{duration:1}}
                className="relative w-full"
            >
                <div className="absolute inset-0 bg-[var(--accent)]/5 blur-[80px] pointer-events-none rounded-full transform scale-75"></div>
                <div className="relative z-10 w-full">
                    <LiveDemoAsh />
                    <div className="text-center mt-8">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--accent)] opacity-80 flex items-center justify-center gap-2">
                            <IconFogo className="w-3 h-3" /> Monitoramento de Biorritmo
                        </span>
                    </div>
                </div>
            </motion.div>

            <div className="pl-0 lg:pl-6 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    <FeatureRow icon={IconFogo} title="Guardião de Energia" text="Detecta cansaço e bloqueia tarefas pesadas. Maximiza seus picos de flow." />
                    <FeatureRow icon={IconKeep} title="Memória Infinita" text="Conecta dados históricos. Ash lembra o que você decidiu há 3 meses." />
                    <FeatureRow icon={IconMatrix} title="Engenheiro de Código" text="Gera, testa e implementa micro-ferramentas dentro do próprio Prana." />
                    <FeatureRow icon={IconVision} title="Visão Holística" text="Conecta sua saúde mental com seus KPIs de projeto. Tudo está ligado." />
                    <FeatureRow icon={IconPapyrus} title="Criação Estruturada" text="Transforma um pensamento solto em um projeto com fases e prazos." />
                    <FeatureRow icon={IconCheckCircle} title="Gestão de Prazos" text="Define datas realistas baseadas na sua velocidade histórica real." />
                    <FeatureRow icon={IconFlux} title="Modo Foco Automático" text="Filtra ruído visual. Mostra apenas o que sua bateria mental aguenta agora." />
                    <FeatureRow icon={IconCheck} title="Permissão Expressa" text="Soberania total. Ash sugere a arquitetura, você dá o 'Sim' final." />
                </div>
            </div>
        </div>

        {/* 3. SESSÃO ALÍVIO (Impacto + Dores + Middleware) */}
        <div className="py-20 text-center relative mb-24 border-t border-[var(--glass-border)] w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }} className="relative z-10">
                <h3 className="serif-font text-3xl md:text-4xl serif-font text-[var(--text-primary)] mb-6">
                    <span className="text-[var(--accent)] font-bold">Alívio!</span> Você para de explicar<br/> 
                    sua vida para a IA.
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-32 max-w-4xl mx-auto">
                    <PainPointCard pain="Tenho que colar o contexto toda vez..." solution="Ash já sabe. Ele lê seus projetos e calendário antes de responder." />
                    <PainPointCard pain="A IA me dá dicas genéricas..." solution="Ash personaliza. Ele sabe se você prefere texto curto ou detalhado." />
                    <PainPointCard pain="Fico exausto gerenciando o chat..." solution="Ash gerencia. Ele organiza a conversa em tarefas automaticamente." />
                    <PainPointCard pain="Tenho medo da alucinação..." solution="Ash é ancorado. Ele usa seus dados reais para evitar invenções." />
                </div>

                <div className="max-w-3xl mx-auto mb-12">
                    <span className="text-[var(--text-secondary)] font-bold text-xs uppercase tracking-[0.2em] mb-4 block border-b border-[var(--accent)]/30 inline-block pb-1">
                        ASH MELHORA AS RESPOSTAS DAS LLMS
                    </span>
                    <p className="text-xl md:text-2xl text-[var(--text-primary)] leading-relaxed serif-font">
                        "Grandes modelos de linguagem são gênios com <span className="text-[var(--accent)] italic">amnésia</span>. Eles não sabem quem você é. E não sabem o que você está fazendo nesse exato momento"
                    </p>
                     <p className="text-sm text-[var(--text-secondary)] mt-4 max-w-xl mx-auto">
                        O Ash e o Prana não substituem as grandes IAs, eles atuam como um <strong>Middleware</strong>. Interceptam sua intenção, injetam seus dados privados e seu contexto de vida, e só então geram a resposta. Ou seja, o Ash melhora a ação das grandes IAs ao saber sobre você. Ash tem o que chamamos de "Momentum"
                    </p>
                </div>

                <div className="bg-[var(--card-bg-solid)]/30 border border-[var(--glass-border)] rounded-2xl p-8 backdrop-blur-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                        <div className="col-span-2"><AshMiddlewareDiagram /></div>
                        <div className="col-span-1 border-l border-[var(--glass-border)] pl-8 text-left">
                           <h4 className="text-xl font-bold text-[var(--text-primary)] mb-4">O Tradutor</h4>
                           <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">"O Prana atua como um tradutor. Ele pega sua intenção, mistura com o contexto da sua vida real, e só então processa a resposta."</p>
                           <div className="p-3 bg-[var(--bg-color)] rounded-lg border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] font-mono">Eficiência: +300% <br/> Alucinação: -90%</div>
                        </div>
                     </div>
                </div>

                <div className="text-center mt-16">
                    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs mono-font uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1">
                        O Prana te oferece efetividade e alinhamento. Escolha seu nível de liberdade.
                    </button>
                </div>
            </motion.div>
        </div>

        {/* 4. A CONSCIÊNCIA (SOCD - TIMELINE INTERATIVA) */}
        <div className="border-t border-[var(--glass-border)] pt-20 w-full">
            <div className="max-w-4xl mx-auto text-center mb-16">
                <h3 className="text-3xl md:text-4xl serif-font text-[var(--text-primary)] mb-6">
                    Como Ash <span className="italic text-[var(--accent)]">Trabalha?</span>
                </h3>
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed font-light max-w-2xl mx-auto">
                    O Ash não age de forma aleatória. Ele segue um protocolo natural de 4 estágios (S.O.C.D.) para transformar o ruído mental em matéria concreta.
                </p>
            </div>

            {/* AQUI ESTÁ A IMPLEMENTAÇÃO PEDIDA: ARTEFATO VISUAL */}
            <SOCDTimeline />
        </div>

      </div>
    </section>
  );
};

export default SectionAshIntro;