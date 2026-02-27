import React, { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { 
  IconSankalpa, IconDashboard, IconChat, IconFlux, IconNeural, 
  IconCronos, IconCosmos, IconNexus, IconPapyrus, IconColetivo, 
  IconMatrix, IconSettings, IconLua, IconFogo, IconZap, IconClock, 
  IconVision, IconAlert, IconCraft, IconGrowth, IconVoid, IconLayers, 
  IconKeep, IconDone, IconBlock, IconSoul, IconKanban, IconMap, 
  IconCloud, IconFilter, IconFeather, IconArrowRight, IconPlus,
  IconMenu, IconX, IconCheckCircle, IconCalendar, IconFolder, 
  IconSearch, IconList, IconPaperclip, IconSend,
  IconLogOut, IconTrash, IconChevronDown, IconGlass, IconAlertTriangle, IconSun,
  IconVolume2, IconVolumeX, IconBriefcase, IconCheckSquare, IconUser, IconLock
} from "../../components/icons/PranaLandscapeIcons";
import RiverNacenteCinematic from "../../components/biome/RiverNacenteCinematic";
import FruitForestCinematic from "../../components/biome/FruitForestCinematic";
import OceanCinematic from "../../components/biome/OceanCinematic";
import KanbanView from "../../views/KanbanView";
import SheetView from "../../views/SheetView";
import CalendarView from "../../views/CalendarView";
import PlannerView from "../../views/PlannerView";
import SmartCreationModal from "../../components/smart/SmartCreationModal";
import ListView from "../../views/ListView";
import MindMapBoardView from "../../views/MindMapBoardView";
import BiomaSection from "../demos/BiomaSection";
import LiveDemoDashboard from "../demos/LiveDemoDashboard";
import LiveDemoAsh from "../demos/LiveDemoAsh";
import LiveDemoEnergy from "../demos/LiveDemoEnergy";
import LiveDemoViews from "../demos/LiveDemoViews";
import LiveDemoSmartCreation from "../demos/LiveDemoSmartCreation";
import LiveDemoPlanner from "../demos/LiveDemoPlanner";
import ManifestoModal from "../demos/ManifestoModal";
import AshArchitectureDiagram from "../demos/AshArchitectureDiagram";
import PranaLogo from "../../components/PranaLogo";
//SECTIONIMPORTS
import ParadigmShiftSection from "../demos/ParadigmShiftSection";
import { PranaStoryTabs } from "../PranaStoryTabs";
import SectionAshIntro from "../sections/SectionAshIntro";
import SectionShow from "../sections/SectionShow";
import SectionOrganize from "../sections/SectionOrganize";

// ==========================================
// 1. VISUAL ASSETS
// ==========================================

// --- 1. O DIAGRAMA DO MIDDLEWARE (ASH) ---
const AshMiddlewareDiagram = () => {
    return (
        <div className="relative w-full max-w-4xl mx-auto h-[400px] flex items-center justify-center my-20">
            {/* Linhas de Conexão (Fundo) */}
            <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="currentColor" strokeDasharray="4 4" />
                <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="currentColor" strokeWidth="2" />
                
                {/* Conexões de Contexto (Vertical) */}
                <line x1="50%" y1="10%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
                <line x1="50%" y1="90%" x2="50%" y2="50%" stroke="var(--accent)" strokeOpacity="0.5" />
            </svg>

            {/* NÓ ESQUERDA: USUÁRIO (Input) */}
            <motion.div 
                initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
                className="absolute left-[5%] md:left-[10%] text-center"
            >
                <div className="glass-card px-4 py-2 rounded-lg border border-[var(--glass-border)] text-xs mono-font mb-2">
                    "Criar projeto de lançamento"
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50">Seu Input</p>
            </motion.div>

            {/* NÓ CENTRAL: ASH (Middleware) */}
            <motion.div 
                className="relative z-10 w-32 h-32 flex items-center justify-center"
            >
                {/* Aura */}
                <div className="absolute inset-0 bg-[var(--accent)] blur-[60px] opacity-20 animate-pulse" />
                
                {/* O Núcleo */}
                <div className="w-20 h-20 rounded-full glass-card border border-[var(--accent)] flex items-center justify-center shadow-[0_0_30px_rgba(217,119,6,0.2)]">
                    <IconChat className="w-10 h-10 text-[var(--accent)] animate-pulse" />
                </div>

                {/* Satélites de Contexto (A Vantagem) */}
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-16 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">
                    + Memória de Projetos
                </motion.div>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute -bottom-16 bg-[#0c0a09] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[9px] mono-font text-[var(--accent)]">
                    + Nível de Energia
                </motion.div>
            </motion.div>

            {/* NÓ DIREITA: AÇÃO (Output) */}
            <motion.div 
                initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                className="absolute right-[5%] md:right-[10%] text-center w-48"
            >
                <div className="glass-card p-4 rounded-lg border border-[var(--accent)]/30 text-left">
                    <div className="text-[9px] text-[var(--accent)] mb-1">PROJETO CRIADO</div>
                    <div className="text-xs font-serif text-[var(--text-primary)]">Lançamento Site</div>
                    <div className="flex gap-1 mt-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"/>
                        <span className="text-[8px] opacity-60">Tarefas geradas</span>
                    </div>
                </div>
                <p className="text-[10px] uppercase tracking-widest opacity-50 mt-2">Ação Executada</p>
            </motion.div>
        </div>
    );
}


// --- NEW COMPONENT: VERTICAL VIDEO CARD ---
const VerticalVideoCard = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);

    const toggleMute = () => {
        if(videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full max-w-[320px] mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[var(--glass-border)] group">
             {/* Video Direct - Autoplay Clean */}
             <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                autoPlay 
                loop 
                muted={isMuted} // Controlled by React state
                playsInline
             >
                <source src="https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/20251220_144925.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS8yMDI1MTIyMF8xNDQ5MjUubXA0IiwiaWF0IjoxNzY3OTAwMzE4LCJleHAiOjE3OTk0MzYzMTh9.F8qwe73UvbScnZtaw2I8weofI64L3fz6eJPkxEw601g" type="video/mp4" />
             </video>
             
             {/* Subtle Overlay for Integration */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>

             {/* UI Controls */}
             <div className="absolute top-4 right-4 z-20">
                 <button 
                    onClick={toggleMute}
                    className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black transition-all"
                 >
                     {isMuted ? <IconVolumeX className="w-4 h-4" /> : <IconVolume2 className="w-4 h-4" />}
                 </button>
             </div>

             <div className="absolute bottom-6 left-6 z-20">
                 <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                     <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Live Nature</span>
                 </div>
                 <h3 className="text-white text-lg font-serif italic">Cachoeira do Fluxo</h3>
             </div>
        </div>
    );
};

// ==========================================
// 3. MAIN LANDING PAGE
// ==========================================

export default function LandingPageHolistic({ onTogglePersona }) {
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState("prana-dark-textured");

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isAshArchModalOpen, setIsAshArchModalOpen] = useState(false);

  // --- Theme Toggle ---
  const toggleTheme = () => {
    setTheme(prev => prev === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured");
  };

  // --- Animation Variants for Organic Reveal ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.5 
      }
    }
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { 
        duration: 0.8, 
        ease: [0.2, 0.65, 0.3, 0.9] 
      }
    }
  };

  return (
    <div
      className={`prana-body min-h-screen w-full font-sans selection:bg-[var(--accent)]/30 ${theme}`}
      data-theme={theme}
      style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-primary)'
      }}
    >
      <ManifestoModal isOpen={isManifestoOpen} onClose={() => setIsManifestoOpen(false)} />
      
      <style>{`
                :root, [data-theme='prana-dark-textured'] {
          /* Cobre Wabi-Sabi -> Ajustado para Prana Orange (Index.css) */
          --accent-rgb: 217, 119, 6; --accent: rgb(var(--accent-rgb)); /* #D97706 Prana Orange */
          --accent-dark-earthy: #78350F; /* Prana Earth */
          --bg-color: #1a1816; /* Base escura quase pedra */
          --text-primary: #e6e1db; /* Papel arroz */
          --text-secondary: #a8a29e; /* Cinza pedra */
          --card-bg-solid: #262422; 
          --texture-image: url('https://www.transparenttextures.com/patterns/concrete-wall.png');
          --texture-filter: invert(0.1) brightness(0.8);
          --texture-opacity: 0.15;
          --glass-border: rgba(255, 255, 255, 0.05); 
          --glass-bg: rgba(26, 24, 22, 0.6);
                    /* Rain backdrop (suave) */
                    --rain-image-url: url('https://images.unsplash.com/photo-1501594907352-04cda38ebc29?q=80&w=1920&auto=format&fit=crop');
                    --rain-opacity: 0.08;
                    --rain-blur: 1.5px;
        }
        [data-theme='prana-light-textured'] {
          --bg-color: #F0EFEA; /* Papel antigo */
          --text-primary: #3d3a36; 
          --text-secondary: #6b6661; 
          --accent-rgb: 217, 119, 6; --accent: rgb(var(--accent-rgb)); /* Prana Orange */
          --card-bg-solid: #FFFFFF;
          --texture-image: url('https://www.transparenttextures.com/patterns/paper.png');
          --texture-filter: contrast(1.1);
          --texture-opacity: 0.5; 
          --glass-border: rgba(0, 0, 0, 0.05);
                    --glass-bg: rgba(240, 239, 234, 0.85);
                    /* Rain backdrop no tema claro */
                    --rain-opacity: 0.06;
                    --rain-blur: 1px;
        }
        .serif-font { font-family: 'Vollkorn', serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .glass-panel { background: var(--glass-bg); backdrop-filter: blur(12px); }
        
        html { scroll-behavior: smooth; }
      `}</style>
      
      {/* 
        ==========================================
        FASE 1: HERO & FILOSOFIA (O CHOQUE)
        "Redesenhar produtividade com energia"
        ==========================================
      */}

      {/* --- MENU DE NAVEGAÇÃO --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <PranaLogo className="w-8 h-8 opacity-90" /> 
                <span className="serif-font text-xl tracking-tight hidden sm:block font-bold">Prana</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--text-secondary)] items-center">
                    {/* DROPDOWN FEATURES - ORGANIZADO POR CATEGORIA */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors outline-none">
                            Produto & Energia <IconChevronDown className="w-3 h-3 op-60" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 w-64 bg-[#1a1816] border border-white/10 text-[#a8a29e] backdrop-blur-xl shadow-2xl rounded-lg mt-2 font-sans">
                             <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest opacity-80">O Sistema (Fase 2)</div>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#ash" className="w-full flex items-center gap-2 text-sm"><IconNeural className="w-3 h-3"/> Ash AI & Contexto</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#creation" className="w-full flex items-center gap-2 text-sm"><IconPlus className="w-3 h-3"/> Criação & Views</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#biomes" className="w-full flex items-center gap-2 text-sm"><IconMap className="w-3 h-3"/> Biomas & Projetos</a>
                             </DropdownMenuItem>
                             
                             <div className="h-px bg-white/10 my-2"></div>
                             
                             <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest opacity-80">Energia (Fase 2)</div>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#dashboard" className="w-full flex items-center gap-2 text-sm"><IconFogo className="w-3 h-3"/> Gestão de Vitalidade</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#rituals" className="w-full flex items-center gap-2 text-sm"><IconLua className="w-3 h-3"/> Rituais & Astrologia</a>
                             </DropdownMenuItem>

                             <div className="h-px bg-white/10 my-2"></div>

                             <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest opacity-80">Colaboração (Fase 3)</div>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#collab" className="w-full flex items-center gap-2 text-sm"><IconColetivo className="w-3 h-3"/> Trabalho em Equipe</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#teams" className="w-full flex items-center gap-2 text-sm"><IconBriefcase className="w-3 h-3"/> Prana Teams (Futuro)</a>
                             </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <a href="#teams" className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">Nova Fase</a>

                    <a href="#pricing" className="hover:text-[var(--accent)] transition-colors">Planos</a>
                </div>
                
                <div className="flex items-center gap-3 border-l border-[var(--glass-border)] pl-4 ml-2">
                    <button 
                        onClick={onTogglePersona}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[var(--glass-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)]/30 transition-all flex items-center gap-2`}
                    >
                        <IconSoul className="w-3 h-3" />
                        Zen User
                    </button>
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] transition-colors">
                        {theme.includes('light') ? <IconLua className="w-5 h-5" /> : <IconFogo className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
      </nav>


      {/* --- 1. HERO SECTION (EMOCIONAL) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background - Static Image from Supabase */}
        <div className="absolute inset-0 z-0">
             <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                style={{
                    backgroundImage: `url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/public/Prana/download%20(5).jpg')`,
                    filter: theme.includes('light') ? "brightness(0.9) sepia(0.1)" : "brightness(0.55) sepia(0.2)"
                }}
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-90"></div>
             <div className={`absolute inset-0 ${theme.includes('light') ? 'bg-white/10' : 'bg-black/20'} mix-blend-overlay`}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20 pt-20">
              <motion.div 
                key="holistic"
                initial={{opacity:0, y:30}}  
                animate={{opacity:1, y:0}} 
                transition={{duration:1.5, ease: "easeOut"}}
                className="flex flex-col justify-center"
              >
                        <div className="flex items-center gap-3 mb-6 opacity-60">
                            <div className="w-8 h-px bg-[var(--text-primary)]"></div>
                            <span className="text-xs uppercase tracking-[0.2em] font-light text-[var(--text-primary)]">ESQUEÇA OS • GERENCIADORES DE TAREFAS</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl serif-font font-light leading-tight mb-8 text-[var(--text-primary)]">
                            Gerencie sua Vida.<br/> 
                            <span className="italic opacity-60 text-4xl md:text-6xl">em Alta Performance.</span>
                        </h1>
                        
                        <p className="text-xl text-[var(--text-primary)]/70 mb-10 leading-relaxed max-w-lg font-light">
                            O primeiro sistema <span className="italic text-[var(--accent)]">human-ai</span> que alia produtividade e biologia, para você ter mais tempo, energia e criatividade. Arquitete e manifeste os seus projetos, sempre respeitando o seu ritmo.
                        </p>
                  
                  <div className="flex flex-wrap gap-6 items-center">
                      <button 
                        onClick={() => setIsHeroModalOpen(true)}
                        className="px-8 py-3 bg-[var(--accent)] text-[#1a1816] hover:bg-[var(--accent)]/90 transition-all duration-300 uppercase text-xs tracking-widest font-bold rounded-sm flex items-center gap-2"
                      >
                          Iniciar Jornada
                      </button>
                      <button 
                          onClick={() => setIsManifestoOpen(true)}
                          className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors group"
                      >
                          Ver Manifesto <IconArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
              </motion.div>

              <motion.div 
                initial={{opacity:0, x:20}} 
                animate={{opacity:1, x:0}} 
                transition={{duration:1.5, delay:0.3}}
                className="hidden lg:block relative"
              >
                  <div className="absolute -inset-4 bg-[var(--accent)]/5 rounded-full blur-[80px]"></div>
                  <LiveDemoAsh persona="holistic" />
              </motion.div>
        </div>
      </section>

{/* PRANA STORY TABS - A FILOSOFIA DO PRANA*/}
        <PranaStoryTabs />


{/* SESSÃO SOBRE O ASH*/}
        <SectionAshIntro />


{/* SESSÃO SOBRE O SHOW*/}
        <SectionShow />

{/* SESSÃO SOBRE O ORGANIZE*/}
        <SectionOrganize />

{/* FRASE DE IMPACTO */}
        <section className="max-w-[700px] mx-auto py-32 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h3 className="serif-font text-3xl md:text-5xl text-[var(--text-primary)] leading-tight mb-8">
                    "Você poupa Tempo e Energia. <span className="line-through decoration-red-500/50 decoration-2 opacity-60">fazer mais</span><br/>
                    E se torna <span className="italic text-[var(--accent)]">mais Criativo</span>."
                </h3>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-8 text-xs mono-font uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1">
                    O Prana te oferece efetividade e alinhamento. Escolha seu nível de liberdade.
                </button>
            </motion.div>
        </section>

        <ParadigmShiftSection />


      {/* ==========================================
        FASE 2: DIAGNÓSTICO (SAÚDE MENTAL)
        "O sistema atual está quebrado."
        ==========================================
      */}
      <div id="mental-health"></div>
      <section className="py-32 px-6 bg-[var(--card-bg-solid)] border-y border-[var(--glass-border)] relative overflow-hidden">
          
          {/* Background Texture (Sutil) */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cartograper.png')] mix-blend-overlay pointer-events-none"></div>

          <div className="max-w-6xl mx-auto relative z-10">
              
              {/* O DIAGNÓSTICO (DADOS) */}
              <div className="mb-24 text-center">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 mb-8"
                  >
                      <IconAlertTriangle className="w-4 h-4 text-orange-400" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400">Diagnóstico Global</span>
                  </motion.div>

                  <h2 className="text-4xl md:text-6xl serif-font font-light mb-8 text-[var(--text-primary)] leading-tight">
                      A Produtividade Linear Falhou. <br/>
                      <span className="italic text-orange-400 opacity-60">veio o esgotamento, a ansiedade, o estresse, o burnout.</span>
                  </h2>

                  <p className="text-xl text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed font-light mb-16">
                   É hora de entendermos a nossa <span className="text-[var(--accent)] italic">energia</span> e utilizá-la a nosso favor. Não somos máquinas lineares, somos seres cíclicos.
                  </p>

                  {/* GRID DE ESTATÍSTICAS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                      <div className="p-8 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] hover:border-orange-500/30 transition-colors group">
                          <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">65%</div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Ansiedade Crônica</h4>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                              Da Geração Z relata sentir-se ansiosa ou estressada "o tempo todo" devido a cobranças de produtividade. <br/>
                              <span className="text-[10px] opacity-50 mt-2 block">*Fonte: Deloitte Global Survey</span>
                          </p>
                      </div>

                      <div className="p-8 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] hover:border-orange-500/30 transition-colors group">
                          <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">3x</div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Aumento de Medicação</h4>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                              O uso de medicamentos para TDAH e ansiedade triplicou na última década entre profissionais criativos.
                          </p>
                      </div>

                      <div className="p-8 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] hover:border-orange-500/30 transition-colors group">
                          <div className="text-5xl font-bold text-orange-400 mb-4 serif-font">80%</div>
                          <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">Burnout Digital</h4>
                          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                              Dos trabalhadores intelectuais relatam exaustão mental severa ao final do dia, sem sensação de realização.
                          </p>
                      </div>
                  </div>
              </div>

              {/* A PROMESSA DO PRANA */}
              <div className="relative mt-32 p-8 md:p-16 rounded-3xl border border-[var(--accent)]/20 bg-gradient-to-b from-[var(--accent)]/5 to-[var(--bg-color)] overflow-hidden">
                  {/* Decorativo */}
                  <div className="absolute top-0 right-0 p-12 opacity-10">
                      <IconSoul className="w-64 h-64 text-[var(--accent)]" />
                  </div>

                  <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                      <div>
                          <div className="flex items-center gap-3 mb-6">
                              <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center shadow-lg shadow-orange-500/20">
                                  <PranaLogo className="w-6 h-6 text-[#1a1816] fill-current" />
                              </div>
                              <span className="text-[var(--accent)] font-bold uppercase tracking-widest text-xs">A Promessa Prana</span>
                          </div>
                          
                          <h3 className="text-3xl md:text-5xl serif-font font-bold text-[var(--text-primary)] mb-6 leading-tight">
                              Produtividade aliada à <span className="text-[var(--accent)] italic">Biologia.</span>
                          </h3>
                          
                          <p className="text-lg text-[var(--text-secondary)] mb-8 leading-relaxed">
                              O Prana não quer que você faça mais. Quer que você faça melhor, respeitando seus ciclos. <br/><br/>
                              Nós monitoramos sua energia, seus hormônios e seu humor. Se o tanque estiver vazio, o sistema <strong>bloqueia</strong> tarefas complexas. Se estiver cheio, ele te impulsiona.
                          </p>

                          <ul className="space-y-4">
                              <li className="flex items-center gap-3">
                                  <IconCheckCircle className="w-5 h-5 text-[var(--accent)]" />
                                  <span className="text-[var(--text-primary)]">Respeito ao Ciclo Menstrual e Hormonal</span>
                              </li>
                              <li className="flex items-center gap-3">
                                  <IconCheckCircle className="w-5 h-5 text-[var(--accent)]" />
                                  <span className="text-[var(--text-primary)]">Detecção de Burnout em Tempo Real</span>
                              </li>
                              <li className="flex items-center gap-3">
                                  <IconCheckCircle className="w-5 h-5 text-[var(--accent)]" />
                                  <span className="text-[var(--text-primary)]">Astrologia Integrada ao Fluxo de Trabalho</span>
                              </li>
                          </ul>
                      </div>

                      {/* Visual Representativo da Promessa (Abstrato) */}
                      <div className="h-full min-h-[300px] flex items-center justify-center">
                          <div className="relative w-64 h-64">
                              <div className="absolute inset-0 border-2 border-[var(--accent)]/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
                              <div className="absolute inset-4 border border-[var(--accent)]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                      <div className="text-4xl font-serif text-[var(--text-primary)] mb-1">100%</div>
                                      <div className="text-[10px] uppercase tracking-widest text-[var(--accent)]">Humano</div>
                                  </div>
                              </div>
                              {/* Orbitando */}
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-color)] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[10px] text-[var(--text-secondary)] shadow-lg whitespace-nowrap">
                                  Sem Exaustão
                              </div>
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[var(--bg-color)] border border-[var(--glass-border)] px-3 py-1 rounded-full text-[10px] text-[var(--text-secondary)] shadow-lg whitespace-nowrap">
                                  Sem Culpa
                              </div>
                          </div>
                      </div>
                  </div>
              </div>

          </div>
      </section>

      {/* --- 2.1 O DIFERENCIAL (ENERGIA) "SCROLLYTELLING" --- */}
      <section className="py-32 px-6 bg-[var(--bg-color)] border-b border-[var(--glass-border)]">
           <div className="max-w-4xl mx-auto text-center">
               <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                   <IconFogo className="w-4 h-4 text-[var(--accent)]" />
                   <span className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">a Produtividade Linear Falhou.</span>
               </div>
               
               <h2 className="text-3xl md:text-5xl serif-font font-light leading-tight mb-8 text-[var(--text-primary)]">
                   Por muito tempo olhamos a <span className="text-[var(--accent)] italic">produtividade</span> com olhos de esforço, de fazer mais a qualquer custo.
               </h2>
               
               <p className="text-xl md:text-2xl text-[var(--text-secondary)] font-light leading-relaxed mb-12 max-w-3xl mx-auto">
                   Tentamos rodar software de produtividade linear em um hardware biológico cíclico. O resultado é uma epidemia silenciosa.               </p>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 text-left">
                   <div className="p-8 border-l-2 border-red-500/20 bg-orange-500/5 rounded-r-2xl">
                       <h3 className="text-red-400 font-bold mb-2 uppercase text-xs tracking-widest">Velho Mundo (Força)</h3>
                       <p className="text-[var(--text-secondary)]">Agenda lotada = Sucesso. Ignora o cansaço. Busca a exaustão como medalha de honra. <br className="hidden md:block" />  *65% da GenZ com Ansiedade. 35% Medicados. 80% com Burnout digital</p>
                   </div>
                   <div className="p-8 border-l-2 border-[var(--accent)] bg-[var(--accent)]/5 rounded-r-2xl">
                       <h3 className="text-[var(--accent)] font-bold mb-2 uppercase text-xs tracking-widest">Mundo Prana (Energia)</h3>
                       <p className="text-[var(--text-secondary)]">Agenda inteligente = Resultado. Respeita os ciclos. Busca o fluxo como estado natural. * Saúde Mental como parâmetro para Alta Performance </p>
                   </div>
               </div>
           </div>
      </section>

      {/* --- NOVA SEÇÃO 3: GET THINGS CREATED (GTC) --- */}
      <section id="gtc" className="py-24 px-6 bg-[var(--bg-color)] border-b border-[var(--glass-border)] relative overflow-hidden">
          {/* Arte de Fundo Sutil */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
              
              {/* Esquerda: Texto Filosófico */}
              <div className="w-full lg:w-1/2">
                   <div className="flex items-center gap-2 mb-6 opacity-80">
                       <div className="w-8 h-px bg-[var(--accent)]"></div>
                       <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">Filosofia do Sistema</span>
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl serif-font font-bold text-[var(--text-primary)] mb-6 leading-tight">
                       Esqueça o GTD.<br />
                       <span className="italic font-light opacity-80">Get Things Created.</span>
                   </h2>
                   
                   <p className="text-xl text-[var(--text-primary)] mb-8 font-light leading-relaxed">
                       O alívio de "esvaziar a inbox" é passageiro. <br/>
                       A satisfação de <strong>construir algo que existe</strong> é permanente.
                   </p>

                   <div className="space-y-6">
                       <p className="text-[var(--text-secondary)] leading-relaxed">
                           Ferramentas tradicionais focam em riscar tarefas para fazê-las desaparecer. O Prana foca em transformar tarefas em <strong>Artifacts</strong>.
                       </p>
                       <p className="text-[var(--text-secondary)] leading-relaxed">
                           Quando você conclui um projeto no Prana, ele não vai para um "Arquivo Morto". Ele se torna um ativo na sua <strong>Biblioteca de Criação</strong>. Um documento, um código, uma imagem, uma ideia refinada.
                       </p>
                   </div>

                   <div className="mt-10 p-6 glass-card border border-[var(--glass-border)] rounded-lg">
                       <h4 className="text-[var(--accent)] font-bold text-sm uppercase tracking-widest mb-4">A Lógica da Construção</h4>
                       <div className="grid grid-cols-2 gap-8">
                           <div>
                               <span className="block text-[var(--text-secondary)] text-xs mb-1 uppercase tracking-wider">Antigo (GTD)</span>
                               <span className="block text-[var(--text-primary)] font-serif text-lg italic line-through decoration-[var(--text-secondary)]">Tarefa Concluída</span>
                               <span className="text-[10px] text-[var(--text-secondary)]">O objetivo é o vazio.</span>
                           </div>
                           <div className="border-l border-[var(--glass-border)] pl-8">
                               <span className="block text-[var(--accent)] text-xs mb-1 uppercase tracking-wider font-bold">Prana (GTC)</span>
                               <span className="block text-[var(--text-primary)] font-serif text-lg">Artefato Criado</span>
                               <span className="text-[10px] text-[var(--text-secondary)]">O objetivo é o legado.</span>
                           </div>
                       </div>
                   </div>
              </div>

              {/* Direita: Vídeo da Cachoeira (Fluxo) */}
              <div className="w-full lg:w-1/2 flex justify-center">
                   <div className="relative w-full max-w-sm transform hover:scale-105 transition-transform duration-700">
                       <div className="absolute -inset-4 bg-[var(--accent)]/10 rounded-full blur-[40px] pointer-events-none"></div>
                       {/* Aqui inserimos o vídeo vertical como solicitado */}
                       <VerticalVideoCard />
                       <p className="text-center text-xs text-[var(--text-secondary)] mt-6 italic opacity-60">"O Fluxo Contínuo da Criação"</p>
                   </div>
              </div>
          </div>
      </section>

      {/* --- 2.2 WABI SABI (ESTÉTICA FUNCIONAL) --- */}
      <section id="wabi-sabi" className="py-24 px-6 border-b border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
           <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div>
                   <h2 className="text-3xl serif-font font-light mb-6 text-[var(--text-primary)]">
                       Wabi Sabi: A Estética da Impermanência
                   </h2>
                   <p className="text-[var(--text-secondary)] leading-relaxed mb-6">
                       Não tentamos criar um "sistema perfeito" que gera ansiedade quando você falha. O Prana abraça o Wabi Sabi: nada dura, nada é perfeito, nada é completo.
                   </p>
                   <ul className="space-y-4">
                       <li className="flex gap-4">
                           <div className="w-8 h-8 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-xs font-bold font-serif">1</div>
                           <p className="text-sm text-[var(--text-secondary)]"><strong>Visual Calmante:</strong> Texturas orgânicas e tons terrosos reduzem a fadiga visual.</p>
                       </li>
                       <li className="flex gap-4">
                           <div className="w-8 h-8 rounded-full border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-xs font-bold font-serif">2</div>
                           <p className="text-sm text-[var(--text-secondary)]"><strong>Aceitação do Caos:</strong> Ferramentas para reorganizar a bagunça rapidamente, sem culpa.</p>
                       </li>
                   </ul>
               </div>
               <div className="relative h-[400px] w-full bg-[url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/hanxiao-xu-Cc4ypLTqQbg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtlZXlfMWRhMDcyZjEtN2JmMS00NDdjLThkZWUtZmYyOGVjM2E2ZjE3IiwiYWxnIjoiSFMyNTYifQ.eyJ1cmwiOiJQcmFuYS9oYW54aWFvLXh1LUNjNHlwTFRxUWJnLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc2ODgzNDgwOCwiZXhwIjoxODAwMzcwODA4fQ.QFFX1Nx1GhbfLLZspKqsMkYbh4RR_1Kp8kOm0QzDjXE')] bg-cover bg-center rounded-2xl overflow-hidden grayscale opacity-80 hover:grayscale-0 transition-all duration-700">
                   <div className="absolute inset-0 bg-black/0"></div>
                   <div className="absolute bottom-6 left-6 text-white text-xs font-bold uppercase tracking-widest">
                       Pedra, Papel, Fluxo.
                   </div>
               </div>
           </div>
      </section>

      

      {/* 
        ==========================================
        FASE 2: FEAURES DO SISTEMA (HARD SKILLS)
        "O Poder de Fogo Tecnológico"
        ==========================================
      */}

      {/* --- ASH & INTELLIGENCE --- */}
      <div id="ash"></div>
      <section className="py-32 px-6 overflow-hidden bg-[var(--bg-color)]">
         <div className="max-w-7xl mx-auto">
             
             {/* 1. SECTION A: THE CORE PROMISE (CONTENT FROM BACKUP) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
                 
                 {/* VISUAL: LIVE DEMO ENERGY (MODIFIED FOR ASH) */}
                 <div className="order-2 md:order-1 flex justify-center items-center relative group">
                     {/* Glow de fundo */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--accent)]/10 transition-all duration-700"></div>
                     <div style={{ transform: 'scale(1)', transformOrigin: 'center' }} className="w-full relative z-10">
                         <LiveDemoEnergy />
                     </div>
                 </div>
                 
                 {/* CONTENT: THE LIST */}
                 <div className="order-1 md:order-2">
                        <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                            - Ash Intelligence - a IA do Prana
                        </div>
                        <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                            Ash é seu Parceiro. <br/> 
                            <span className="text-[var(--text-secondary)] italic">de Pensamento e Execução em Alta Performance.</span>
                        </h2>
                        <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed">
                            É inteligência proativa que "mora" no seu sistema operacional. Que entende sua energia, cria e gerencia seus projetos e conecta sua vida pessoal e profissional em um fluxo contínuo.

                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Consciência de Contexto: Ash sabe se você está cansado hoje.",
                                "Memória de Longo Prazo: Conecta todos seus dados históricos.",
                                "Engenheiro de Código: Web IDE completa para criar ferramentas.",
                                "Biorregulação: Sugere pausas quando detecta estresse.",
                                "Criação Estruturada: Transforma ideias soltas em projetos.",
                                "Criação de Projetos: Gera estrutura de pastas e prazos com um comando.",
                                "Modo Foco: Filtra tarefas de baixa energia quando você está cansado."
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-[var(--text-secondary)] group hover:text-[var(--text-primary)] transition-colors">
                                    <IconCheckCircle className="w-5 h-5 mt-1 flex-shrink-0 text-[var(--accent)] opacity-70 group-hover:opacity-100" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                 </div>
             </div>

             {/* 2. SECTION B: THE ARGUMENT (DEEP CONTEXT & PRIVACY) - SUBTITLE STYLE */}
             <div className="border-t border-[var(--glass-border)] pt-16 mb-16">
                 <div className="grid grid-cols-1 lg:grid-cols-1 gap-16 items-center">
                     <div>
                         <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Alívio. Você para de explicar sua vida para a IA. Pois o Ash já sabe tudo sobre você</h3>
                         <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
                             Pare de perder tempo com IA Genérica. A maioria das IAs são "turistas" na sua vida. O Ash é um "residente" do seu sistema. 
                             Ele já sabe quem você é, quais são seus projetos e qual o seu nível de energia no momento.
                         </p>
                         
                         <div className="flex gap-4">
                            <div className="p-4 rounded-xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] flex-1">
                                <div className="text-[var(--accent)] font-bold text-sm mb-1 flex items-center gap-2"><IconLock className="w-4 h-4"/> Privacidade</div>
                                <p className="text-xs text-[var(--text-secondary)]">Seus dados não treinam modelos públicos. Tudo roda no seu ambiente seguro.</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] flex-1">
                                <div className="text-[var(--accent)] font-bold text-sm mb-1 flex items-center gap-2"><IconCheckSquare className="w-4 h-4"/> Permissão</div>
                                <p className="text-xs text-[var(--text-secondary)]">Ash sugere, você aprova. Nenhuma ação é tomada sem seu "Sim".</p>
                            </div>
                         </div>
                     </div>
                    </div>
             </div>



             {/* 3. SECTION C: THE METHOD (SOCD) - REFINED */}
             <div className="border-t border-[var(--glass-border)] pt-16">
                 <div className="text-center mb-12">
                     <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-2 block">A Consciência</span>
                     <h3 className="text-2xl text-[var(--text-primary)] font-serif italic">Como o Ash Trabalha</h3>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[ 
                          { 
                              step: "01",
                              title: "1. SHOW", 
                              concept: "O Espelho",
                              desc: "Revela o que você está criando e o que está deixando de criar. Para manifestar, é preciso ter ver o que está acontecendo, de diferentes perspectivas. Ash faz isso. Te mostra.",
                              icon: IconVision
                          },
                          { 
                              step: "02",
                              title: "2. ORGANIZE", 
                              concept: "A Ordem",
                              desc: "Cria árvores de projetos, realoca prazos e redefine tarefas. Categoriza o caos sempre baseado na sua bateria mental.",
                              icon: IconFlux
                          },
                          { 
                              step: "03",
                              title: "3. CREATE", 
                              concept: "A Forja",
                              desc: "Prepara o ambiente para você entrar em Flow. Ash é o seu sócio de criação pronto para receber os seus imputs vagos e criar sempre com a sua Permissão",
                              icon: IconPapyrus
                          },
                          { 
                              step: "04",
                              title: "4. DEVELOP", 
                              concept: "A Ascensão",
                              desc: "Busca sempre melhorar a sua performance, com base no conhecimento sobre os projetos Aprende com seus erros e sugere melhorias.",
                              icon: IconSoul
                          }
                      ].map((item, i) => (
                          <div 
                            key={i} 
                            className="bg-[var(--card-bg-solid)] border border-[var(--glass-border)] p-5 rounded-xl hover:border-[var(--accent)]/40 transition-all text-left"
                          >
                              <div className="w-10 h-10 rounded-lg bg-[var(--bg-color)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] mb-4">
                                  <item.icon className="w-5 h-5" />
                              </div>
                              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">{item.title}</h3>
                              <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] opacity-80 mb-2 block">{item.concept}</span>
                              <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
                                  {item.desc}
                              </p>
                          </div>
                      ))}
                 </div>
             </div>
         </div>
      </section>

                  {/* 2. ASH MIDDLEWARE (A Diferença Técnica) */}
            <section className="py-32 px-6 border-t border-[var(--glass-border)] relative">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl serif-font mb-4">Inteligência com <span className="italic text-[var(--accent)]">Contexto</span></h2>
                        <p className="text-[#a8a29e] max-w-2xl mx-auto">
                            LLMs (como ChatGPT e Gemini) são gênios sem memória. O Ash é o elo necessário.
                            Ele conecta a inteligência artificial aos dados reais da sua vida antes de responder.
                        </p>
                    </div>

                    <AshMiddlewareDiagram />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
                        <div className="p-6">
                            <h4 className="serif-font text-xl mb-2">Memória Infinita</h4>
                            <p className="text-sm opacity-60"> Ash sabe o que você fez semana passada e o que planejou para o mês que vem. É por isso que ele é seu parceiro</p>
                        </div>
                        <div className="p-6 border-x border-[var(--glass-border)]">
                            <h4 className="serif-font text-xl mb-2">Conhecimento para Criação</h4>
                            <p className="text-sm opacity-60">Ash cria e te ajuda a criar estruturas de projetos, conteúdos e códigos.</p>
                        </div>
                        <div className="p-6">
                            <h4 className="serif-font text-xl mb-2">Empatia de Dados</h4>
                            <p className="text-sm opacity-60">Ele sabe quando você está cansado ou cheio de energia, e a sugestões para o seu estado.</p>
                        </div>
                                        <div className="p-6 border-x border-[var(--glass-border)]">
                            <h4 className="serif-font text-xl mb-2">Proatividade Real</h4>
                            <p className="text-sm opacity-60">Ele não espera você perguntar. Ele avisa quando projetos estão estagnados ou em conflito com a sua intenção.</p>
                        </div>
                    </div>
                </div>
            </section>

      {/* --- 4. FEATURES PRAGMÁTICAS: ONDE O TRABALHO ACONTECE --- */}
      <div id="creation"></div>
      <section className="py-24 px-6 border-y border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
           <div className="max-w-7xl mx-auto">
               <div className="text-center mb-16">
                   <h2 className="text-3xl serif-font font-bold mb-4 text-[var(--text-primary)]">Formas de Criação</h2>
                   <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">O Prana oferece ferramentas profissionais para cada etapa do seu fluxo.</p>
               </div>

               {/* VIEWS SYSTEM */}
               <div className="mb-24">
                   <div className="flex flex-col lg:flex-row gap-12 items-center">
                       <div className="w-full lg:w-1/2">
                            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Views Nativas</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Kanban, Lista, Calendário, MindMap. Seus dados são fluídos: visualize o mesmo projeto de ângulos diferentes.</p>
                            <LiveDemoViews />
                       </div>
                       <div className="w-full lg:w-1/2">
                            <h3 className="text-2xl font-bold mb-4 text-[var(--text-primary)]">Criação Inteligente</h3>
                            <p className="text-[var(--text-secondary)] mb-6">Não perca tempo configurando. Digite o que quer e o sistema estrutura.</p>
                            <LiveDemoSmartCreation />
                       </div>
                   </div>
               </div>

               {/* ANATOMIA DA CRIAÇÃO (Novo Bloco de Força) */}
               <div className="mb-24 pt-12 border-t border-[var(--glass-border)]">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="w-full md:w-1/2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 p-6 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] text-center group hover:border-[var(--accent)]/30 transition-all">
                                    <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                                        <IconPapyrus className="w-7 h-7 text-[var(--accent)] group-hover:text-inherit" />
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] mb-1">Pensamento</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Captura rápida, sem compromisso</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] text-center group hover:border-[var(--accent)]/30 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                                        <IconDone className="w-6 h-6 text-[var(--accent)] group-hover:text-inherit" />
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] mb-1">Tarefa</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Acionável e rastreável</p>
                                </div>
                                <div className="p-6 rounded-2xl bg-[var(--bg-color)] border border-[var(--glass-border)] text-center group hover:border-[var(--accent)]/30 transition-all">
                                    <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-[var(--accent)] group-hover:text-black transition-colors">
                                        <IconSankalpa className="w-6 h-6 text-[var(--accent)] group-hover:text-inherit" />
                                    </div>
                                    <h4 className="font-bold text-[var(--text-primary)] mb-1">Projeto</h4>
                                    <p className="text-xs text-[var(--text-secondary)]">Múltiplas fases</p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-bold mb-6 text-[var(--text-primary)]">Não é tudo a mesma coisa.</h2>
                            <p className="text-[var(--text-secondary)] text-lg mb-6">
                                Apps comuns tratam uma ideia brilhante e "comprar leite" como checkboxes iguais. O Prana respeita a hierarquia da criação.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                    <strong className="text-[var(--text-primary)] min-w-[100px] flex items-center gap-2"><IconPapyrus className="w-3 h-3"/> Pensamento:</strong>
                                    Ideias sem forma, journal, rascunhos. Liberdade total.
                                </li>
                                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                    <strong className="text-[var(--text-primary)] min-w-[100px] flex items-center gap-2"><IconDone className="w-3 h-3"/> Tarefa:</strong>
                                    Compromisso de execução. Tem status e métrica.
                                </li>
                                <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                                    <strong className="text-[var(--text-primary)] min-w-[100px] flex items-center gap-2"><IconSankalpa className="w-3 h-3"/> Projeto:</strong>
                                    Um organismo vivo que contém tarefas, docs e chats.
                                </li>
                            </ul>
                        </div>
                    </div>
               </div>

      {/* --- NEW SECTION: FLEXIBILIDADE RADICAL (HIERARCHY) --- */}
      <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--card-bg-solid)]/50 mix-blend-multiply pointer-events-none"></div>
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-2 block">Estrutura Fractal</span>
                  <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                      Flexibilidade Radical
                  </h2>
                  <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
                      Seu trabalho não é uma lista plana. É uma árvore viva. O Prana permite aninhamento infinito (Projetos Pai, Filho, Neto) e reorganização fluida.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-color)] hover:border-[var(--accent)]/30 transition-all group">
                      <div className="mb-4 text-[var(--accent)] group-hover:scale-110 transition-transform origin-left"><IconLayers className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Project Hierarchy</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          Crie a estrutura que quiser: <br/>
                          <code className="text-xs bg-[var(--accent)]/10 p-1 rounded">Empresa &gt; Marketing &gt; Q1 &gt; Campanhas &gt; Social</code>. <br/>
                          Cada nível tem suas próprias métricas agregadas automáticas.
                      </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-color)] hover:border-[var(--accent)]/30 transition-all group">
                      <div className="mb-4 text-[var(--accent)] group-hover:scale-110 transition-transform origin-left"><IconFlux className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Drag & Drop Total</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          Mudou de ideia? Arraste um projeto inteiro para dentro de outro. Transforme uma tarefa em um projeto. O caos é reorganizável em segundos.
                      </p>
                  </div>
                  <div className="p-6 rounded-xl border border-[var(--glass-border)] bg-[var(--bg-color)] hover:border-[var(--accent)]/30 transition-all group">
                      <div className="mb-4 text-[var(--accent)] group-hover:scale-110 transition-transform origin-left"><IconMap className="w-8 h-8" /></div>
                      <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">Vistas Multi-Nível</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          Veja o quadro geral (Roadmap do Ano) ou o micro (Tarefas de Hoje). O botão de <strong>Zoom In/Out</strong> permite navegar na complexidade sem se perder.
                      </p>
                  </div>
              </div>
          </div>
      </section>

                 {/* --- PLANNER SECTION --- */}
                     <section className="py-24 px-6 bg-[var(--card-bg-solid)] border-y border-[var(--glass-border)]">
                         <div className="max-w-7xl mx-auto">
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                 <div>
                                     <div className="flex items-center gap-3 mb-4">
                                         <IconCronos className="w-10 h-10 text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" ativo={true} />
                                         <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest pl-1">Ritmo & Rotina</span>
                                     </div>
                                     <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                                         Planner: O Guardião do Tempo
                                     </h2>
                                     <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                         O Planner (Cronos) não é apenas um calendário semanal. É uma matriz de blocos de tempo que integra suas tarefas pontuais com suas rotinas recorrentes.
                                     </p>
                                     <ul className="space-y-4">
                                          <li className="flex gap-4">
                                              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                                                  <IconCronos className="w-4 h-4 text-[var(--accent)]" />
                                              </div>
                                              <div>
                                                  <strong className="block text-[var(--text-primary)] text-sm mb-1">Rotinas de Base</strong>
                                                  <p className="text-xs text-[var(--text-secondary)]">Defina "Deep Work" toda manhã ou "Revisão" toda sexta. O Planner protege esses blocos.</p>
                                              </div>
                                          </li>
                                          <li className="flex gap-4">
                                              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                                                  <IconGlass className="w-4 h-4 text-[var(--accent)]" />
                                              </div>
                                              <div>
                                                  <strong className="block text-[var(--text-primary)] text-sm mb-1">Capacidade Real</strong>
                                                  <p className="text-xs text-[var(--text-secondary)]">O sistema alerta se você tentar agendar mais do que suas 24h permitem.</p>
                                              </div>
                                          </li>
                                          <li className="flex gap-4">
                                              <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                                                  <IconFlux className="w-4 h-4 text-[var(--accent)]" />
                                              </div>
                                              <div>
                                                  <strong className="block text-[var(--text-primary)] text-sm mb-1">Drag & Drop Neural</strong>
                                                  <p className="text-xs text-[var(--text-secondary)]">Arraste uma tarefa do backlog direto para um slot de tempo livre na semana.</p>
                                              </div>
                                          </li>
                                     </ul>
                                 </div>
                                 <div className="flex justify-center items-center">
                                     <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="w-full">
                                         <LiveDemoPlanner />
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </section>
               
                     {/* --- SMART CREATION SECTION --- */}
                     <section className="py-24 px-6">
                         <div className="max-w-7xl mx-auto">
                             <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                 <div>
                                     <div className="flex items-center gap-3 mb-4">
                                         <IconPlus className="w-10 h-10 text-[var(--accent)] drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]" ativo={true} />
                                         <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest pl-1">Criação Inteligente</span>
                                     </div>
                                     <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                                         Cmd+K: Transforme Pensamentos
                                     </h2>
                                     <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
                                         Abra SmartCreationModal (Cmd+K) e deixe Ash entender o contexto automaticamente. Digite uma linha, ele cria o que precisa:
                                     </p>
                                     <ul className="space-y-3">
                                         {['"Redesenhar em 2h" → Projeto + Tarefa + Timer', '"Ligar para João #Vendas" → Tarefa profissional', '"Meditar 20min" → Evento pessoal', '"Fazer backup" → Tarefa estruturada'].map((item,i)=>(<li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]"  ><span className="text-[var(--accent)] font-bold">→</span><span>{item}</span></li>))}
                                     </ul>
                                 </div>
                                 <div className="flex justify-center items-center">
                                     <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="w-full">
                                         <LiveDemoSmartCreation />
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </section>
               
               {/* BIOMAS */}
               <div id="biomes" className="pt-8">
                    <h3 className="text-2xl font-bold mb-6 text-center text-[var(--text-primary)]">Biomas: Onde seus Projetos Vivem</h3>
                    <p className="text-[var(--text-secondary)] text-center mb-12 max-w-2xl mx-auto">Em vez de "Pastas", use Biomas. Ambientes visuais que agrupam projetos correlatos e definem o "clima" do trabalho.</p>
                    <BiomaSection />
               </div>
           </div>
      </section>

      {/* 
        ==========================================
        FASE 3: FEATURES ENERGÉTICAS (SOFT SKILLS)
        "Onde a Alma Entra"
        ==========================================
      */}

      <div id="dashboard"></div>
      <section className="py-24 px-6 bg-[var(--bg-color)] relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="order-2 lg:order-1">
                         <LiveDemoDashboard />
                         <p className="text-center text-xs text-[var(--text-secondary)] mt-4 opacity-60">Dashboard Holístico: Energia, Emoção e Tarefas em uma tela.</p>
                    </div>
                    <div className="order-1 lg:order-2 pl-0 lg:pl-12">
                         <div className="flex items-center gap-2 mb-6">
                            <IconFogo className="w-5 h-5 text-orange-500" />
                            <span className="text-orange-500 font-bold text-xs uppercase tracking-widest">Gestão de Vitalidade</span>
                         </div>
                         <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                             Sua Energia é seu Recurso Mais Escasso
                         </h2>
                         <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed">
                             Produtividade linear é um mito industrial. O ser humano é biológico e cíclico. 
                            O Prana monitora seus biorritmos, contexto ambiental e níveis de energia para sugerir <em>quando</em> executar, maximizando seu ROI cognitivo sem burnout. Diário de Humor, Check-in de Energia e Rastreamento de Hábitos não são "extras", são a fundação da sua produtividade sustentável.
                         </p>
                         <div id="rituals"></div>
                         <div className="grid grid-cols-2 gap-6 mt-8">
                             <div className="p-4 border border-[var(--glass-border)] rounded-xl bg-[var(--card-bg-solid)]">
                                 <IconLua className="w-6 h-6 text-indigo-400 mb-3" />
                                 <h4 className="font-bold text-[var(--text-primary)] mb-1">Rituais</h4>
                                 <p className="text-xs text-[var(--text-secondary)]">Rotinas matinais e noturnas que preparam sua mente.</p>
                             </div>
                             <div className="p-4 border border-[var(--glass-border)] rounded-xl bg-[var(--card-bg-solid)]">
                                 <IconCosmos className="w-6 h-6 text-purple-400 mb-3" />
                                 <h4 className="font-bold text-[var(--text-primary)] mb-1">Astrologia</h4>
                                 <p className="text-xs text-[var(--text-secondary)]">Insights sobre como os trânsitos astrais afetam seu foco.</p>
                             </div>
                         </div>
                    </div>
                </div>
            </div>
      </section>

      {/* 
        ==========================================
        FASE 4: COMUNIDADE (O AGORA E O FUTURO)
        "O Dilema do Teams Resolvido"
        ==========================================
      */}




      {/* 


      {/* --- FOOTER / CTA --- */}
      <footer className="py-24 px-6 bg-[var(--card-bg-solid)] border-t border-[var(--glass-border)]">
          <div className="max-w-4xl mx-auto text-center">
               <PranaLogo className="w-16 h-16 text-[var(--accent)] mx-auto mb-8" />
               <h2 className="text-4xl md:text-5xl serif-font font-bold mb-8 text-[var(--text-primary)]">
                   Sua mente merece um lar melhor.
               </h2>
               <p className="text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
                   Junte-se a arquitetos, designers, escritores e visionários que escolheram o Prana para governar suas vidas com intenção.
               </p>
               
               <button className="px-10 py-4 bg-[var(--accent)] text-white text-lg font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)] mb-12">
                   Começar Gratuitamente
               </button>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-[var(--text-secondary)] uppercase tracking-widest border-t border-[var(--glass-border)] pt-12">
                   <a href="#" className="hover:text-[var(--accent)]">Manifesto</a>
                   <a href="#" className="hover:text-[var(--accent)]">Roadmap</a>
                   <a href="#" className="hover:text-[var(--accent)]">Privacidade</a>
                   <a href="#" className="hover:text-[var(--accent)]">Twitter / X</a>
               </div>
               <div className="mt-12 text-[10px] text-[var(--text-secondary)] opacity-50 font-mono">
                   PRANA SYSTEMS V8.0 • WABI SABI EDITION • 2026
               </div>
          </div>
      </footer>

      {/* --- HERO MODAL OVERLAY --- */}
      <AnimatePresence>
        {isHeroModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={(e) => { if(e.target === e.currentTarget) setIsHeroModalOpen(false); }}
          >
             <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-2xl"
             >
                 <div className="flex justify-end mb-2">
                     <button onClick={() => setIsHeroModalOpen(false)} className="text-white/50 hover:text-white"><IconPlus className="w-6 h-6 rotate-45" /></button>
                 </div>
                 <LiveDemoSmartCreation />
                 <div className="text-center mt-4 text-white/50 text-sm">
                     Isso é o Prana. Digite, e o sistema estrutura. <br/> 
                     <span className="text-[var(--accent)] cursor-pointer hover:underline" onClick={() => setIsHeroModalOpen(false)}>Explorar mais &rarr;</span>
                 </div>
             </motion.div>
          </motion.div>
        )}
            </AnimatePresence>
        </div>
    );
}
