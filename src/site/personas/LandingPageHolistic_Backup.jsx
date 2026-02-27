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
  IconVolume2, IconVolumeX, IconBriefcase, IconCheckSquare, IconUser
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
import PranaLogo from "../../components/PranaLogo";
import ProjectChat from "../../components/chat/ProjectChat";

// ==========================================
// 1. VISUAL ASSETS
// ==========================================

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
// 2. LIVE DEMO COMPONENTS
// ==========================================

// --- DEMO 1: ASH INTELLIGENCE (Context & Memory) ---
// Moved to ./demos/LiveDemoAsh.jsx

// --- DEMO 2: BIOME INTERACTIVE SECTION ---
// Moved to ./demos/BiomaSection.jsx

// --- DEMO 2B: ENERGY MONITORING WITH TASK RECOMMENDATION ---
// Moved to ./demos/LiveDemoEnergy.jsx
// Moved to ./demos/LiveDemoDashboard.jsx

// --- DEMO 3: REAL APP REPLICA (FIDELITY V4 - 100% MATCH) ---
// Moved to ./demos/LiveDemoViews.jsx
  


// --- DEMO 4: SMART CREATION MODAL REAL ---
// Moved to ./demos/LiveDemoSmartCreation.jsx

// --- DEMO 5: REAL PLANNER VIEW (FIDELITY V2) ---
// Moved to ./demos/LiveDemoPlanner.jsx

// ==========================================
// 2.4 RAIN VIDEO MODAL
// ==========================================
// Moved to ./demos/RainVideoModal.jsx

// ==========================================
// 2.5 MANIFESTO MODAL
// ==========================================
// Moved to ./demos/ManifestoModal.jsx

// ==========================================
// 3. MAIN LANDING PAGE
// ==========================================

export default function LandingPageHolistic({ onTogglePersona }) {
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState("prana-dark-textured");

  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

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
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <PranaLogo className="w-8 h-8 opacity-90" /> 
                <span className="serif-font text-xl tracking-tight hidden sm:block font-bold">Prana</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--text-secondary)] items-center">
                    {/* DROPDOWN FEATURES */}
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors outline-none">
                            Features <IconChevronDown className="w-3 h-3 op-60" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 w-56 bg-[#1a1816] border border-white/10 text-[#a8a29e] backdrop-blur-xl shadow-2xl rounded-lg mt-2">
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#wabi-sabi" className="w-full block text-sm">Filosofia Wabi-Sabi</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#harmony" className="w-full block text-sm">Fluid Harmony</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#gtc" className="w-full block text-sm">Get Things Created</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#ash" className="w-full block text-sm">Ash Intelligence</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#teams" className="w-full block text-sm">Prana Teams</a>
                             </DropdownMenuItem>
                             <DropdownMenuItem className="focus:bg-[#D97706]/10 focus:text-[#D97706] p-2 rounded cursor-pointer">
                                <a href="#method" className="w-full block text-sm">The Method</a>
                             </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Link destacado para Teams */}
                    <a href="#teams" className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors">Teams</a>

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

      {/* 0. NEW INTRO SECTION (LIVING BIOME - NATUREZA) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[var(--bg-color)] transition-colors duration-700">
        
        {/* Background - Static Image from Supabase */}
        <div className="absolute inset-0 z-0">
             <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] hover:scale-105"
                style={{
                    backgroundImage: `url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/maxim-boldyrev-cDLLSVxTpmg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS9tYXhpbS1ib2xkeXJldi1jRExMU1Z4VHBtZy11bnNwbGFzaC5qcGciLCJpYXQiOjE3Njc4OTgxMDAsImV4cCI6MTc5OTQzNDEwMH0.bpM_qNjCs2MrCWSc8zk72KtHAhVDATuw9Nuz7s9biLI')`,
                    filter: theme.includes('light') ? "brightness(0.9) sepia(0.1)" : "brightness(0.55) sepia(0.2)"
                }}
             />
             {/* Gradient Overlays for Depth & Text Readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-transparent opacity-90"></div>
             <div className={`absolute inset-0 ${theme.includes('light') ? 'bg-white/10' : 'bg-black/20'} mix-blend-overlay`}></div>
        </div>

        {/* Content - Fixed Logo + Flowing Text */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 mt-[-5vh]">
            <div className="grid grid-cols-[auto_1fr] gap-8 items-start">
                
                {/* Fixed Logo Column */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="pt-3"
                >
                     <PranaLogo className="w-12 h-12 text-[var(--text-primary)] drop-shadow-2xl opacity-90" />
                </motion.div>

                {/* Text Flow Column - Animated & Organic */}
                <div className="min-h-[200px]"> 
                     <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                     >
                        <h1 className="text-4xl md:text-6xl font-light text-[var(--text-primary)] leading-tight serif-font tracking-wide drop-shadow-2xl mb-6">
                            {"Sincronize com sua Natureza.".split(" ").map((word, index) => (
                            <motion.span key={index} className="inline-block mr-3" variants={wordVariants}>
                                {word}
                            </motion.span>
                            ))}
                        </h1>

                        <p className="block mt-8 text-xl md:text-2xl text-[var(--text-secondary)] font-sans font-light max-w-2xl leading-relaxed">
                            {"O Prana elimina o ruído e organiza sua vida digital com a fluidez de um ecossistema vivo.".split(" ").map((word, index) => (
                                <motion.span key={index} className="inline-block mr-2" variants={wordVariants}>
                                    {word}
                                </motion.span>
                            ))}
                        </p>
                     </motion.div>
                </div>

            </div>
        </div>
        
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-[var(--text-secondary)]"
        >
            <IconChevronDown className="w-8 h-8" />
        </motion.div>
      </section>

      {/* --- PRANA TEAMS • NOVA FASE --- */}
      <section id="teams" className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-[var(--accent)]/8 rounded-full blur-[120px]"></div>
              <div className="absolute -bottom-40 left-0 w-[500px] h-[500px] bg-[var(--card-bg-solid)]/50 rounded-full blur-[100px]"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
              <div className="text-center mb-16">
                  <span className="text-[var(--accent)] font-bold text-[10px] uppercase tracking-widest">PRANA TEAMS • NOVA FASE</span>
                  <h2 className="text-4xl md:text-5xl serif-font font-light text-[var(--text-primary)] mt-3">Colaboração orgânica, no próprio ecossistema.</h2>
                  <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">Times no Prana não são listas de permissão; são biomas. Conversas humanas, artefatos e energia convivem naturalmente.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                  {/* Identidade & Conceito */}
                  <div>
                      <div className="p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                          <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4">Identidade Prana</div>
                          <ul className="space-y-4 text-sm text-[var(--text-secondary)]">
                              <li><strong className="text-[var(--text-primary)]">Canais Contextuais:</strong> Chat humano integrado aos projetos; mencione <span className="mono-font">#hashtags</span> para vincular artefatos.</li>
                              <li><strong className="text-[var(--text-primary)]">Sinergia de Equipe:</strong> Foque em qualidade do fluxo, não só horas logadas.</li>
                              <li><strong className="text-[var(--text-primary)]">Coexistência:</strong> Conversas podem referenciar itens <span className="mono-font">[PRO]</span> e <span className="mono-font">[LIFE]</span> sem trocar de “modo”.</li>
                              <li><strong className="text-[var(--text-primary)]">Arquivamento Vivo:</strong> Chats ficam ligados aos artefatos, formando um acervo de criação.</li>
                          </ul>
                      </div>
                      <div className="mt-6 p-6 rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-color)]/50">
                          <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-2">Como testar</div>
                          <p className="text-sm text-[var(--text-secondary)]">Faça login e entre no canal do time para ver mensagens reais e enviar novas. Sem login, você verá um estado vazio fiel.</p>
                      </div>
                  </div>

                  {/* Live Demo Fidedigna */}
                  <div className="relative">
                      <div className="absolute -inset-4 bg-[var(--accent)]/5 rounded-2xl blur-[80px]"></div>
                      <div className="relative rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-color)] p-4">
                          <ProjectChat contextId="core" contextTitle="Prana Core Team" />
                      </div>
                  </div>
              </div>
          </div>
      </section>

         {/* --- HERO SECTION --- */}
         <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">

          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20 pt-20">
              <motion.div 
                key="holistic" // Force re-render on persona change
                initial={{opacity:0, y:30}}  
                animate={{opacity:1, y:0}} 
                transition={{duration:1.5, ease: "easeOut"}}
                className="flex flex-col justify-center"
              >
                        <div className="flex items-center gap-3 mb-6 opacity-60">
                            <div className="w-8 h-px bg-[var(--text-primary)]"></div>
                            <span className="text-xs uppercase tracking-[0.2em] font-light text-[var(--text-primary)]">Prana • Wabi Sabi Edition</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl serif-font font-light leading-tight mb-8 text-[var(--text-primary)]">
                            Ordem no Caos.<br/> 
                            <span className="italic opacity-60 text-4xl md:text-6xl">Sem rigidez.</span>
                        </h1>
                        
                        <p className="text-xl text-[var(--text-primary)]/70 mb-10 leading-relaxed max-w-lg font-light">
                            Um sistema que respira com você. <br/>
                            Organize sua vida digital aceitando a imperfeição natural do fluxo de atividade.
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

              {/* Interface Flutuante */}
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

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 animate-pulse">
              <span className="text-[9px] uppercase tracking-widest text-[var(--text-secondary)]">Role para respirar</span>
              <div className="w-px h-8 bg-[var(--text-secondary)]/50"></div>
          </div>
      </section>



      


      {/* --- WABI-SABI CONCEPT (INTEGRADO) --- */}
              <section id="wabi-sabi" className="py-24 px-6 border-b border-[var(--glass-border)] bg-[var(--bg-color)]">
                  <div className="max-w-5xl mx-auto text-center">
              <IconSoul className="w-10 h-10 mx-auto text-[var(--accent)] mb-6 opacity-80" />
              <h2 className="text-2xl md:text-3xl serif-font font-light mb-6 text-[var(--text-primary)] max-w-3xl mx-auto leading-relaxed">
                  Simplicidade que respeita seus ciclos
              </h2>
              <p className="text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed mb-12">
                  O mundo pede velocidade. Seu corpo tem ritmos. O Prana organiza seu trabalho em torno da sua energia —
                  em ciclos claros de foco e descanso — para que a clareza surja sem ansiedade.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
                   <div>
                       <h3 className="text-[var(--accent)] text-sm uppercase tracking-widest mb-3 border-b border-[var(--accent)]/20 pb-2 inline-block">Kanso</h3>
                       <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                           <strong>Simplicidade Essencial.</strong> Menos ruído, mais sentido. Apenas o necessário para você avançar com leveza.
                       </p>
                   </div>
                   <div>
                       <h3 className="text-[var(--accent)] text-sm uppercase tracking-widest mb-3 border-b border-[var(--accent)]/20 pb-2 inline-block">Mujo (Ciclos)</h3>
                       <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                           <strong>Impermanência Prática.</strong> Tudo muda. O Prana adapta prazos e prioridades conforme seu momento e sua energia.
                       </p>
                   </div>
                   <div>
                       <h3 className="text-[var(--accent)] text-sm uppercase tracking-widest mb-3 border-b border-[var(--accent)]/20 pb-2 inline-block">Seijaku</h3>
                       <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
                           <strong>Calma Presente.</strong> Uma interface que não compete pela sua atenção. Espaço para respirar e criar.
                       </p>
                   </div>
              </div>
          </div>
      </section>

      
      {/* --- NEW SECTION 3: GET THINGS CREATED (GTC) --- */}
      <section id="gtc" className="py-24 px-6 bg-[var(--bg-color)] border-b border-[var(--glass-border)] relative overflow-hidden">
          {/* Subtle Background Art */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 items-center relative z-10">
              
              {/* Left: Philosophy Text */}
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

                   <div className="mt-10 p-6 glass-panel border border-[var(--glass-border)] rounded-lg">
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

              {/* Right: Visual Demonstration (VERTICAL VIDEO CARD) */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                    <VerticalVideoCard />

                    {/* Meta Info (Floating beside or below on mobile) */}
                    <div className="absolute -right-4 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-4">
                         <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur flex items-center justify-center text-[var(--accent)] shadow-lg" title="Audio Spatial">
                             <IconVolume2 className="w-5 h-5" />
                         </div>
                         <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur flex items-center justify-center text-[var(--text-secondary)] shadow-lg" title="Vertical Format">
                             <div className="w-3 h-5 border border-current rounded-sm"></div>
                         </div>
                    </div>
              </div>
          </div>
      </section>

      {/* --- ASH & INTELLIGENCE --- */}
      <div id="ash"></div>
      <section className="py-24 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1 flex justify-center items-center">
                 <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="w-full">
                     <LiveDemoEnergy />
                 </div>
             </div>
             <div className="order-1 md:order-2">
                        <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4">Ash Intelligence - a IA do Prana</div>
                        <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">Mais que um Chatbot. <br/> Um Parceiro de Pensamento e Execução em Alta Performance.</h2>
                        <p className="text-[var(--text-secondary)] mb-6 text-lg">
                            Ash é a inteligência proativa que "mora" no seu sistema. Que entende sua energia, cria e gerencia seus projetos e conecta sua vida pessoal e profissional em um fluxo contínuo.

                        </p>
                        <ul className="space-y-4 mb-8">
                            {[
                                "Consciência de Contexto: Ash sabe se você está cansado hoje.",
                                "Memória de Longo Prazo (Knowledge Base): Conecta todos seus dados históricos.",
                                "Engenheiro de Código Integrado: Web IDE completa para criar ferramentas.",
                                "Biorregulação: Sugere pausas quando detecta estresse.",
                                "Criação Estruturada: Transforma ideias soltas em projetos completos.",
                                "Criação de Projetos: Ash gera estrutura de pastas, tarefas iniciais e prazos sugeridos com um comando.",
                                "Modo Foco: Quando cansado, Ash filtra apenas tarefas de baixa energia e alta recompensa."
                                
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-4 text-[var(--text-secondary)]">
                                    <IconDone className="w-5 h-5 mt-1 flex-shrink-0" ativo={true} />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
             </div>
         </div>
      </section>

      {/* --- NEW SECTION: PRANA TEAMS (COLLABORATIVE) --- */}
      <section id="teams" className="py-24 px-6 border-b border-[var(--glass-border)] relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)] to-[var(--card-bg-solid)] opacity-50 pointer-events-none"></div>
           
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
               <div className="order-2 lg:order-1">
                   {/* Mock Visual do Teams Pulse */}
                   <div className="rounded-2xl border border-[var(--glass-border)] bg-[var(--bg-color)] p-6 shadow-2xl">
                       <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--glass-border)]">
                           <div className="w-12 h-12 rounded-full border border-[var(--glass-border)] bg-[var(--card-bg-solid)] flex items-center justify-center text-[var(--accent)] font-serif italic text-xl">
                               P
                           </div>
                           <div>
                               <h4 className="text-[var(--text-primary)] font-bold">Prana Core Team</h4>
                               <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[var(--text-secondary)]">
                                   <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
                                   <span>•</span>
                                   <span>92% Sinergia</span>
                               </div>
                           </div>
                       </div>
                       
                       <div className="space-y-4">
                           {/* Chat Message 1 */}
                           <div className="flex gap-4">
                               <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold font-serif">A</div>
                               <div className="bg-[var(--card-bg-solid)] p-3 rounded-2xl rounded-tl-sm border border-[var(--glass-border)] text-xs text-[var(--text-secondary)] leading-relaxed max-w-[80%]">
                                   Pessoal, atualizei o briefing em <span className="text-indigo-400 font-bold cursor-pointer">#LançamentoSite</span>. A estrutura "GTC" ficou incrível.
                               </div>
                           </div>
                           {/* Chat Message 2 */}
                           <div className="flex gap-4 flex-row-reverse">
                               <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-xs font-bold font-serif">M</div>
                               <div className="bg-[var(--accent)]/10 p-3 rounded-2xl rounded-tr-sm border border-[var(--accent)]/20 text-xs text-[var(--text-primary)] leading-relaxed max-w-[80%]">
                                   Perfeito! vou delegar as tarefas de copy para o Ash. <span className="text-[var(--accent)] font-bold">@Ash</span> prepare o rascunho do manifesto.
                               </div>
                           </div>
                       </div>
                   </div>
               </div>
               
               <div className="order-1 lg:order-2">
                   <div className="flex items-center gap-2 mb-6 opacity-80">
                        <div className="w-8 h-px bg-[var(--accent)]"></div>
                        <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">Colaboração Orgânica</span>
                   </div>
                   
                   <h2 className="text-4xl md:text-5xl serif-font font-light text-[var(--text-primary)] mb-6 leading-tight">
                       Sincronia de Equipe.<br />
                       <span className="italic opacity-60">Além do "Bate-Ponto".</span>
                   </h2>
                   
                   <p className="text-xl text-[var(--text-secondary)] mb-8 font-light leading-relaxed">
                       Times no Prana não são apenas listas de permissão. São ecossistemas. Monitore a "Sinergia" e a energia coletiva, não apenas as horas trabalhadas.
                   </p>

                   <ul className="space-y-6">
                       <li className="flex gap-4">
                           <div className="mt-1 w-8 h-8 rounded-full bg-[var(--card-bg-solid)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-sm font-bold">01</div>
                           <div>
                               <h4 className="text-[var(--text-primary)] font-bold mb-1">Canais Contextuais</h4>
                               <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Chat real (humano-para-humano) integrado aos projetos. Mencione tarefas e artefatos naturalmente.</p>
                           </div>
                       </li>
                       <li className="flex gap-4">
                           <div className="mt-1 w-8 h-8 rounded-full bg-[var(--card-bg-solid)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] text-sm font-bold">02</div>
                           <div>
                               <h4 className="text-[var(--text-primary)] font-bold mb-1">Delegação Consciente</h4>
                               <p className="text-[var(--text-secondary)] text-sm leading-relaxed">Ao delegar tarefa, você vê a "Carga Atual" de energia do colega. Evite burnout silêncioso.</p>
                           </div>
                       </li>
                   </ul>
               </div>
           </div>
      </section>

      {/* --- ASH EVOLUTION PROTOCOL (Former S.O.C.D.) --- */}
      <section id="method" className="pb-24 px-6 bg-[var(--bg-color)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  
                  {/* Left Column: Context Logic */}
                  <div className="lg:col-span-1 pt-4 lg:sticky lg:top-24">
                            <div className="flex items-center gap-2 mb-6 opacity-80">
                                <div className="w-8 h-px bg-[var(--accent)]"></div>
                                <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">Como Ash Funciona</span>
                            </div>
                            <h3 className="text-3xl serif-font font-bold text-[var(--text-primary)] mb-6">
                                O Ciclo da Consciência
                            </h3>
                            <p className="text-[var(--text-secondary)] leading-relaxed mb-6 font-light">
                                O Ash não é linear. Ele opera em um loop contínuo de observação e agência, elevando sua operação de "Fazer" para "Fluir".
                            </p>
                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-8 border-l-2 border-[var(--accent)]/30 pl-4 py-1">
                                "Foque na sua arte. Eu cuido da entropia, organizo o caos e preparo o palco para sua melhor performance."
                                <span className="block mt-2 text-[var(--accent)] font-bold text-[10px] uppercase tracking-wider">— Ash Protocol</span>
                            </p>
                  </div>

                  {/* Right Column: 2x2 Grid Cards */}
                  <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                          { 
                              step: "01",
                              title: "1. SHOW", 
                              concept: "O Espelho",
                              desc: "Ash mostra não apenas o que falta fazer, mas como você está.",
                              quote: '"Você está correndo muito, mas avançando pouco."',
                              icon: IconVision
                          },
                          { 
                              step: "02",
                              title: "ORGANIZE", 
                              concept: "A Ordem",
                              desc: "Ash categoriza e agenda baseado em sua ENERGIA.",
                              quote: '"Movi tarefas pesadas para terça, seu dia de foco."',
                              icon: IconFlux
                          },
                          { 
                              step: "03",
                              title: "3. CREATE", 
                              concept: "A Forja",
                              desc: "Ash prepara docs e templates para você entrar em Flow.",
                              quote: '"O rascunho do projeto já está na sua mesa."',
                              icon: IconPapyrus
                          },
                          { 
                              step: "04",
                              title: "4. DEVELOP", 
                              concept: "A Ascensão",
                              desc: "Ash aprende com seus padrões e expande sua performance.",
                              quote: '"Sua ansiedade aumenta aos domingos. Vamos ajustar?"',
                              icon: IconSoul
                          }
                      ].map((item, i) => (
                          <motion.div 
                            initial={{opacity:0, y:20}} 
                            whileInView={{opacity:1, y:0}} 
                            viewport={{once:true}}
                            transition={{delay: i * 0.1}}
                            key={i} 
                            className="relative z-10 flex flex-col h-full bg-[var(--card-bg-solid)] border border-[var(--glass-border)] p-5 rounded-xl group hover:border-[var(--accent)]/40 transition-all duration-300 hover:shadow-lg"
                          >
                              <div className="flex items-center gap-3 mb-3">
                                  <div className="w-8 h-8 rounded-lg bg-[var(--bg-color)] border border-[var(--glass-border)] flex items-center justify-center text-[var(--accent)] shadow-sm group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                                      <item.icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                      <h3 className="text-sm font-bold tracking-wider text-[var(--text-primary)]">{item.title}</h3>
                                      <span className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold opacity-80">{item.concept}</span>
                                  </div>
                              </div>

                              <p className="text-[var(--text-secondary)] text-xs leading-relaxed mb-3">
                                  {item.desc}
                              </p>

                              <div className="mt-auto bg-[var(--bg-color)]/50 p-3 rounded-lg border border-[var(--glass-border)] relative flex gap-3 items-start">
                                  <IconChat className="w-3 h-3 text-[var(--accent)] opacity-50 mt-0.5 flex-shrink-0" />
                                  <p className="text-[11px] italic text-[var(--text-primary)] opacity-80 font-mono leading-tight">
                                      {item.quote}
                                  </p>
                              </div>
                          </motion.div>
                      ))}
                  </div>
              </div>
          </div>
      </section>

      {/* --- HOLISTIC & BIOMES --- */}
      <div id="holistic"></div>
      {/* --- BIOMA ENERGY MAPPING (Interactive) --- */}
      <section className="py-24 px-6 bg-[var(--card-bg-solid)] border-y border-[var(--glass-border)]">
          <BiomaSection />
      </section>

      {/* --- DASHBOARD SECTION (RENOVADO: PORTAL FLUTUANTE) --- */}
      <section className="py-24 px-6 relative overflow-hidden">
          {/* Background de floresta/textura sutil */}
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed opacity-5 grayscale" style={{maskImage: 'linear-gradient(to bottom, black, transparent)'}}></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
               {/* LADO VISUAL: O PORTAL */}
               <div className="order-2 lg:order-1 relative">
                   {/* Efeito de "Portal" flutuando sobre a realidade */}
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 blur-[60px] rounded-full pointer-events-none"></div>
                   
                   <motion.div 
                     initial={{ rotateX: 5, y: 20, opacity: 0}}
                     whileInView={{ rotateX: 0, y: 0, opacity: 1}}
                     transition={{ duration: 1, type: "spring" }}
                     className="relative shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 rounded-xl overflow-hidden backdrop-blur-sm bg-[var(--bg-color)]/80 scale-[0.65] origin-center -my-12"
                   >
                       <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50"></div>
                       <LiveDemoDashboard />
                   </motion.div>
               </div>

               {/* LADO CONCEITO: A EXPLICAÇÃO CIENTIFICA/BIO */}
               <div className="order-1 lg:order-2 sticky top-24 pl-0 lg:pl-12">
                           <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-[var(--accent)]"></span> O Diferencial Prana
                           </div>
                           <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                                Gerencie Energia,<br/> 
                                <span className="text-[var(--accent)] italic">Não Apenas Tempo.</span>
                           </h2>
                           <p className="text-[var(--text-secondary)] mb-8 text-lg leading-relaxed font-light">
                               Produtividade linear é um mito industrial. O ser humano é biológico e cíclico. 
                               O Prana monitora seus biorritmos, contexto ambiental e níveis de energia para sugerir <em>quando</em> executar, maximizando seu ROI cognitivo sem burnout.
                           </p>
                           
                           <ul className="space-y-4 mb-8">
                               {[
                                   "Monitoramento de Biorritmo & Energia",
                                   "Análise de padrões temporais e influências",
                                   "Sugestão de pausas e recalibragem de foco",
                                   "Métricas de Sustentabilidade Pessoal"
                               ].map((item, i) => (
                                   <li key={i} className="flex items-center gap-3 text-[var(--text-primary)]">
                                       <IconCheckCircle className="w-5 h-5 text-[var(--accent)]" /> 
                                       <span>{item}</span>
                                   </li>
                               ))}
                           </ul>

                           <button className="mt-8 text-[var(--accent)] font-bold uppercase text-xs tracking-widest hover:text-[var(--text-primary)] transition-colors flex items-center gap-2 group">
                               Explorar a Metodologia <IconArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                           </button>
               </div>
          </div>
      </section>



      {/* --- VIEWS SECTION (How to See Your Projects) --- */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="mb-16">
                  <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 block">Visualização & Engenharia</span>
                  <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                      Views Nativas & IDE Integrado
                  </h2>
                  <p className="text-[var(--text-secondary)] max-w-2xl">
                      Do Board Kanban ao Código Fonte. O Prana não separa o gerenciamento da construção. Abra qualquer view como um arquivo no nosso VS Code integrado.
                  </p>
              </div>

              <div className="flex justify-center items-center">
                  <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }} className="w-full">
                      <LiveDemoViews />
                  </div>
              </div>

              {/* Views Reference Grid */}
              <div className="mt-12">
                   <div className="flex items-center gap-4 mb-6">
                       <span className="h-px bg-[var(--glass-border)] flex-1"></span>
                       <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--accent)] text-center">Arsenal de Ferramentas</h3>
                       <span className="h-px bg-[var(--glass-border)] flex-1"></span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                          { name: 'Kanban Board', desc: 'Fluxo visual clássico. Mova tarefas entre fases. Ideal para execução tática.', icon: IconFlux, color: 'text-orange-400' },
                          { name: 'Data Grid', desc: 'Poder de planilha. Filtre, ordene e edite atributos em massa.', icon: IconMatrix, color: 'text-blue-400' },
                          { name: 'Smart Calendar', desc: 'Visão temporal. Arraste para reagendar. Sincronia com prazos reais.', icon: IconCosmos, color: 'text-purple-400' },
                          { name: 'Mind Map', desc: 'Ideação estruturada. Quebre grandes épicos em tarefas menores visualmente.', icon: IconNeural, color: 'text-pink-400' },
                          { name: 'Dependency Graph', desc: 'Nexus View. Entenda bloqueios e conexões sistêmicas entre tarefas.', icon: IconNexus, color: 'text-green-400' },
                          { name: 'Focus List', desc: 'Simplicidade radical. Uma lista linear para execução livre de distrações.', icon: IconDashboard, color: 'text-yellow-400' }
                      ].map((view, i) => (
                          <div key={i} className="flex gap-4 p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--card-bg-solid)] hover:bg-[var(--text-primary)]/5 transition-colors group">
                              <div className={`mt-1 w-10 h-10 rounded-lg bg-[var(--bg-color)] border border-[var(--glass-border)] flex items-center justify-center shadow-sm shrink-0 group-hover:scale-105 transition-transform`}>
                                  <view.icon className={`w-5 h-5 ${view.color}`} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-sm text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent)] transition-colors">{view.name}</h4>
                                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{view.desc}</p>
                              </div>
                          </div>
                      ))}
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

      {/* --- FORMAS DE CRIAÇÃO (ENTIDADES) --- */}
      <section className="py-24 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row gap-16 items-center">
                  <div className="w-full md:w-1/2">
                      <div className="grid grid-cols-2 gap-4">
                          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className="col-span-2 p-6 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-center">
                              <div className="w-14 h-14 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3">
                                  <IconPapyrus className="w-7 h-7 text-[var(--accent)]" ativo={true} />
                              </div>
                              <h4 className="font-bold text-[var(--text-primary)] mb-1">Pensamento</h4>
                              <p className="text-xs text-[var(--text-secondary)]">(Papyrus) Captura rápida, sem compromisso</p>
                          </motion.div>
                          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.1}} className="p-6 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-center">
                              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3">
                                  <IconDone className="w-6 h-6 text-[var(--accent)]" ativo={true} />
                              </div>
                              <h4 className="font-bold text-[var(--text-primary)] mb-1">Tarefa</h4>
                              <p className="text-xs text-[var(--text-secondary)]">(Done) Acionável e rastreável</p>
                          </motion.div>
                          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:0.2}} className="p-6 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all text-center">
                              <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mx-auto mb-3">
                                  <IconSankalpa className="w-6 h-6 text-[var(--accent)]" ativo={true} />
                              </div>
                              <h4 className="font-bold text-[var(--text-primary)] mb-1">Projeto</h4>
                              <p className="text-xs text-[var(--text-secondary)]">(Sankalpa) Múltiplas fases</p>
                          </motion.div>
                      </div>
                  </div>
                  <div className="w-full md:w-1/2">
                      <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">Anatomia da Criação</h2>
                      <p className="text-[var(--text-secondary)] text-lg mb-6">
                          No Prana, nem tudo é uma tarefa. Temos 5 entidades fundamentais para capturar a realidade:
                      </p>
                      <ul className="space-y-4">
                          <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] min-w-[100px]">Pensamento:</strong>
                              Lixo mental, ideias rápidas, journal. Ash processa depois.
                          </li>
                          <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] min-w-[100px]">Tarefa:</strong>
                              Algo acionável com data e necessidade de energia.
                          </li>
                          <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] min-w-[100px]">Projeto:</strong>
                              Um conjunto de tarefas com fases (Planejamento, Design, Execução).
                          </li>
                          <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] min-w-[100px]">Checklist:</strong>
                              Processos recorrentes e SOPs.
                          </li>
                          <li className="flex gap-3 text-sm text-[var(--text-secondary)]">
                              <strong className="text-[var(--text-primary)] min-w-[100px]">Evento:</strong>
                              Algo que acontece no tempo (reuniões, rituais).
                          </li>
                      </ul>
                  </div>
              </div>
          </div>
      </section>

      
      {/* --- PROFESSIONAL VS PERSONAL separation --- */}
      <section id="harmony" className="py-24 px-6 border-y border-[var(--glass-border)]">
          <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl serif-font font-bold mb-4 text-[var(--text-primary)]">Convivência: Profissional [PRO] e Pessoal [LIFE]</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-8">
                  No Prana, cada entidade (projeto, tarefa, evento) tem um atributo <strong>tipo</strong>: <span className="mono-font">[PRO]</span> ou <span className="mono-font">[LIFE]</span>. Não há “modos”. Há <em>universos</em> que coexistem na mesma linha do tempo.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                      <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Princípios</div>
                      <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                          <li><span className="mono-font text-[var(--text-primary)]">[PRO]</span> e <span className="mono-font text-[var(--text-primary)]">[LIFE]</span> são etiquetas textuais.</li>
                          <li>Tudo aparece na mesma timeline do Planner.</li>
                          <li>Filtros simples: mostrar <span className="mono-font">[PRO]</span>, <span className="mono-font">[LIFE]</span> ou ambos.</li>
                          <li>Sem cores ou ícones exclusivos; foco em clareza.</li>
                      </ul>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                      <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Integrações</div>
                      <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
                          <li>Dashboard agrega ambos naturalmente.</li>
                          <li>Chat usa <span className="mono-font">#hashtags</span> para vincular conversas a projetos.</li>
                          <li>Recomendações do Ash respeitam o atributo <span className="mono-font">tipo</span>.</li>
                          <li>Relatórios mostram convivência, não separação.</li>
                      </ul>
                  </div>
              </div>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  <div className="p-4 rounded-lg border border-[var(--glass-border)]">
                      <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Exemplo</div>
                      <p className="text-sm text-[var(--text-secondary)]">[PRO] Entregar proposta às 15h • [LIFE] Meditar 20min às 18h. Ambos aparecem na semana com etiquetas simples.</p>
                  </div>
                  <div className="p-4 rounded-lg border border-[var(--glass-border)]">
                      <div className="text-xs uppercase tracking-widest text-[var(--text-secondary)] mb-2">Filtro Rápido</div>
                      <p className="text-sm text-[var(--text-secondary)]">No Planner: Mostrar = [PRO] | [LIFE] | Todos. Sem mudanças de “modo”.</p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- NEW SECTION: PREVENÇÃO DE BURNOUT --- */}
      <section className="py-24 px-6 bg-[var(--bg-color)] border-b border-[var(--glass-border)]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1">
                   {/* Visual representativo de energia/mood */}
                   <div className="p-8 rounded-2xl bg-[var(--card-bg-solid)] border border-[var(--glass-border)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full pointer-events-none"></div>
                        
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-4">
                                <span className="font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)]">Energy Check-in</span>
                                <span className="text-[var(--accent)] font-bold text-lg">Nível 2/5 (Baixa)</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs text-[var(--text-secondary)]">
                                    <span>Vitalidade Física</span>
                                    <span>20%</span>
                                </div>
                                <div className="h-2 w-full bg-[var(--bg-color)] rounded-full overflow-hidden">
                                    <div className="h-full w-[20%] bg-red-400 rounded-full"></div>
                                </div>
                            </div>
                            <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg flex gap-3 text-sm">
                                <IconAlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                <p className="text-[var(--text-primary)]">
                                    <strong>Alerta de Ash:</strong> Detectei padrões de exaustão. Sugiro mover "Reunião de Vendas" para amanhã e focar em tarefas de baixa carga cognitiva hoje.
                                </p>
                            </div>
                        </div>
                   </div>
               </div>
               
               <div className="order-1 lg:order-2">
                    <div className="flex items-center gap-3 mb-4">
                        <IconSoul className="w-10 h-10 text-[var(--accent)]" ativo={true} />
                        <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest pl-1">Saúde Mental</span>
                    </div>
                    <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                        Prevenção de Burnout
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-6 text-lg">
                        O Prana não quer que você faça mais. Quer que você dure mais. O sistema monitora sua "Bateria Interna" e intervém antes que você quebre.
                    </p>
                    <ul className="space-y-4 mb-8">
                        <li className="flex gap-4">
                            <div className="mt-1"><IconFogo className="w-5 h-5 text-[var(--accent)]" /></div>
                            <div>
                                <h4 className="font-bold text-[var(--text-primary)]">Escala de Energia (1-5)</h4>
                                <p className="text-sm text-[var(--text-secondary)]">Check-ins diários de vitalidade. O sistema aprende seus ciclos: "Você rende 30% mais nas terças-feiras de Lua Nova".</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="mt-1"><IconCloud className="w-5 h-5 text-blue-400" /></div>
                            <div>
                                <h4 className="font-bold text-[var(--text-primary)]">Rastreamento de Mood (8 Estados)</h4>
                                <p className="text-sm text-[var(--text-secondary)]">De 😌 Calm a 😰 Anxiety. O dashboard correlaciona: "Sua ansiedade aumenta quando você tem mais de 3 reuniões seguidas".</p>
                            </div>
                        </li>
                    </ul>
               </div>
          </div>
      </section>

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

      {/* --- NEW SECTION: HOLISMO (SABEDORIA) --- */}
      <section className="py-24 px-6 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-fixed" style={{backgroundColor: 'var(--bg-color)'}}>
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                   <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                        <IconCosmos className="w-4 h-4" /> Sabedoria Ancestral + IA
                   </div>
                   <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">
                       Holismo Tecnológico
                   </h2>
                   <p className="text-[var(--text-secondary)] mb-6 text-lg leading-relaxed">
                       "Prana" significa energia vital em sânscrito. Não escolhemos esse nome à toa. O sistema foi construído para ser o elo perdido entre a eficiência mecânica e a fluidez humana.
                   </p>
                   <blockquote className="border-l-4 border-[var(--accent)] pl-6 italic text-[var(--text-primary)]/80 my-8 font-serif text-xl">
                       "Um sistema que ignora a intuição humana é apenas uma burocracia digital eficiente. O Prana valida o que você sente, não apenas o que você faz."
                   </blockquote>
                   
                   <div className="grid grid-cols-2 gap-4">
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                           <IconSun className="w-5 h-5 text-yellow-500" />
                           <span className="text-sm font-bold text-[var(--text-primary)]">Ciclos Solares</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                           <IconLua className="w-5 h-5 text-indigo-400" />
                           <span className="text-sm font-bold text-[var(--text-primary)]">Fases Lunares</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                           <IconSoul className="w-5 h-5 text-pink-400" />
                           <span className="text-sm font-bold text-[var(--text-primary)]">Human Design</span>
                       </div>
                       <div className="flex items-center gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--card-bg-solid)]">
                           <IconNeural className="w-5 h-5 text-green-400" />
                           <span className="text-sm font-bold text-[var(--text-primary)]">Ritmos Neurais</span>
                       </div>
                   </div>
              </div>

              <div className="w-full md:w-1/2 flex justify-center">
                   <motion.div 
                     whileHover={{ scale: 1.05, rotate: 1 }}
                     className="relative w-80 h-80 rounded-full border border-[var(--accent)]/20 flex items-center justify-center p-8 bg-[var(--card-bg-solid)] shadow-2xl"
                   >
                       <div className="absolute inset-0 rounded-full border border-dashed border-[var(--text-secondary)]/20 animate-spin-slow" style={{animationDuration: '60s'}}></div>
                       <div className="absolute inset-4 rounded-full border border-[var(--accent)]/10"></div>
                       
                       <div className="text-center z-10">
                           <PranaLogo className="w-16 h-16 text-[var(--accent)] mx-auto mb-4" />
                           <h4 className="font-bold text-[var(--text-primary)] tracking-widest text-sm">SYSTEM OPS</h4>
                           <div className="w-8 h-px bg-[var(--accent)] mx-auto my-3"></div>
                           <p className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">
                               Energy • Mood • Task • Doc
                           </p>
                       </div>
                   </motion.div>
              </div>
          </div>
      </section>

      {/* --- COMPARISON TABLE --- */}
      <div id="views"></div>
      <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl serif-font font-bold mb-12 text-center text-[var(--text-primary)]">Por que mudar para o Prana?</h2>
              
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr className="border-b border-[var(--glass-border)]">
                              <th className="py-4 pl-4 text-[var(--text-secondary)] font-normal uppercase text-xs tracking-widest">Funcionalidade</th>
                              <th className="py-4 text-[var(--accent)] font-bold text-center w-1/4 bg-[var(--accent)]/5 rounded-t-lg">PRANA</th>
                              <th className="py-4 text-[var(--text-secondary)] font-normal text-center w-1/4">Notion</th>
                              <th className="py-4 text-[var(--text-secondary)] font-normal text-center w-1/4">Todoist</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          {[
                              ["IA Contextual Integrada", true, false, false],
                              ["Rastreamento de Energia e Humor", true, false, false],
                              ["Gestão de Projetos Completa", true, true, false],
                              ["Design Wabi-Sabi Calmante", true, false, false],
                              ["Hierarquia Interconectada", true, true, false],
                              ["Biorregulação (Modos de Foco)", true, false, false],
                              ["Astrologia & Human Design", true, false, false],
                          ].map(([feat, prana, comp1, comp2], i) => (
                              <tr key={i} className="border-b border-[var(--glass-border)] hover:bg-[var(--card-bg-solid)] transition-colors">
                                  <td className="py-4 pl-4 text-[var(--text-primary)] font-medium">{feat}</td>
                                  <td className="py-4 text-center bg-[var(--accent)]/5">
                                      {prana ? <IconDone className="w-6 h-6 mx-auto" ativo={true} /> : <div className="w-2 h-2 bg-gray-500 rounded-full mx-auto" />}
                                  </td>
                                  <td className="py-4 text-center">
                                      {comp1 ? <IconCheckCircle className="w-5 h-5 text-gray-400 mx-auto" /> : "-"}
                                  </td>
                                  <td className="py-4 text-center">
                                      {comp2 ? <IconCheckCircle className="w-5 h-5 text-gray-400 mx-auto" /> : "-"}
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 px-6 border-t border-[var(--glass-border)]">
          <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-4xl serif-font mb-6 text-[var(--text-primary)]">Investimento na sua Clareza.</h2>
              <p className="text-[var(--text-secondary)] mb-16 max-w-2xl mx-auto">Escolha o plano que combina com sua jornada de transformação.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {/* Iniciado */}
                  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} className="p-8 rounded-2xl border border-[var(--glass-border)] opacity-70 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-4 mx-auto">
                          <IconVoid className="w-6 h-6 text-[var(--accent)]" ativo={true} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Iniciado</h3>
                      <div className="text-4xl serif-font mb-2 text-[var(--accent)]">R$ 0</div>
                      <p className="text-xs text-[var(--text-secondary)] mb-6">/mês</p>
                      <ul className="text-left space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
                          <li>• 3 Projetos Ativos</li>
                          <li>• IA Ash Básica (10 cmds/dia)</li>
                          <li>• Rastreamento de Humor Simples</li>
                          <li>• Temas Básicos</li>
                      </ul>
                      <button className="w-full py-2 border border-current rounded hover:bg-white/10 transition text-[var(--text-secondary)]">Começar Grátis</button>
                  </motion.div>

                  {/* Adepto - Destaque */}
                  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.1}} className="p-8 rounded-2xl border-2 border-[var(--accent)] bg-[var(--accent)]/5 relative transform md:scale-105 shadow-2xl">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-black text-[10px] font-bold px-3 py-1 rounded-full">
                          MAIS POPULAR
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/20 border border-[var(--accent)]/40 flex items-center justify-center mb-4 mx-auto">
                          <IconSoul className="w-6 h-6 text-[var(--accent)]" ativo={true} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-[var(--accent)]">Adepto</h3>
                      <div className="text-4xl serif-font mb-2"><span className="text-[var(--accent)]">R$ 49</span></div>
                      <p className="text-xs text-[var(--text-secondary)] mb-6">/mês</p>
                      <ul className="text-left space-y-3 mb-8 text-sm">
                          <li className="flex items-center gap-2 text-[var(--text-secondary)]"><IconCheckCircle className="w-4 h-4 text-[var(--accent)]" /> Projetos Ilimitados</li>
                          <li className="flex items-center gap-2 text-[var(--text-secondary)]"><IconCheckCircle className="w-4 h-4 text-[var(--accent)]" /> IA Ash Ilimitada</li>
                          <li className="flex items-center gap-2 text-[var(--text-secondary)]"><IconCheckCircle className="w-4 h-4 text-[var(--accent)]" /> Astrologia Completa</li>
                          <li className="flex items-center gap-2 text-[var(--text-secondary)]"><IconCheckCircle className="w-4 h-4 text-[var(--accent)]" /> Dashboards Personalizados</li>
                          <li className="flex items-center gap-2 text-[var(--text-secondary)]"><IconCheckCircle className="w-4 h-4 text-[var(--accent)]" /> Biomas com Cinematics</li>
                      </ul>
                      <button className="w-full py-3 bg-[var(--accent)] text-black font-bold rounded hover:bg-[var(--accent)]/90 transition">
                          Assinar Agora
                      </button>
                  </motion.div>

                  {/* Tribo */}
                  <motion.div initial={{opacity:0, y:20}} whileInView={{opacity:1, y:0}} viewport={{once:true}} transition={{delay:0.2}} className="p-8 rounded-2xl border border-[var(--glass-border)] opacity-70 hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center mb-4 mx-auto">
                          <IconColetivo className="w-6 h-6 text-[var(--accent)]" ativo={true} />
                      </div>
                      <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)]">Tribo</h3>
                      <div className="text-4xl serif-font mb-2 text-[var(--text-primary)]">R$ 99<span className="text-sm font-normal text-[var(--text-secondary)]">/usuário</span></div>
                      <p className="text-xs text-[var(--text-secondary)] mb-6">Workspaces Compartilhados</p>
                      <ul className="text-left space-y-3 mb-8 text-sm text-[var(--text-secondary)]">
                          <li>• Tudo do Adepto</li>
                          <li>• Workspaces Ilimitados</li>
                          <li>• Permissões Avançadas</li>
                          <li>• Suporte Prioritário</li>
                          <li>• Recursos Customizados</li>
                      </ul>
                      <button className="w-full py-2 border border-current rounded hover:bg-white/10 transition text-[var(--text-secondary)]">Falar com Vendas</button>
                  </motion.div>
              </div>

              <p className="text-[var(--text-secondary)] text-sm mt-12">Todos os planos incluem Biomas, Ash e Integração com Astrologia. Teste gratuitamente por 14 dias.</p>
          </div>
      </section>

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

            {/* Manifesto Modal */}
            <ManifestoModal isOpen={isManifestoOpen} onClose={() => setIsManifestoOpen(false)} />
        </div>
    );
}
