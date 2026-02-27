/* src/site/personas/LandingPageHolisticV2.jsx
   desc: A evolução da Landing Page. Foco em Saúde Mental, Biologia e o Diagrama Orgânico.
   version: 2.0 (Complete)
*/

import React, { useState, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { useNavigate } from 'react-router-dom';

// Ícones
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

// Demos Existentes (Importados para manter o que funciona)
import LiveDemoAsh from "../demos/LiveDemoAsh";
import LiveDemoViews from "../demos/LiveDemoViews";
import LiveDemoSmartCreation from "../demos/LiveDemoSmartCreation";
import ManifestoModal from "../demos/ManifestoModal";
import PranaLogo from "../../components/ui/PranaLogo";

// ==========================================
// 1. COMPONENTES LOCAIS (VISUAL V2)
// ==========================================

// --- NOVO DIAGRAMA ORGÂNICO (WABI-SABI) ---
// Substitui o diagrama técnico por algo fluido e biológico.
const OrganicArchitectureDiagram = () => {
    return (
        <div className="relative w-full max-w-5xl mx-auto h-[450px] flex items-center justify-center my-24 select-none">
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-[#d97706]/5 blur-[120px] rounded-full pointer-events-none" />

            {/* SVG Lines - As "Hifas" conectando o caos ao centro */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a8a29e" stopOpacity="0.05" />
                        <stop offset="50%" stopColor="#d97706" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#d97706" stopOpacity="0.1" />
                    </linearGradient>
                </defs>
                
                {/* Linhas Curvas (Caos -> Ordem) */}
                <path d="M 10 20 C 30 20, 35 50, 50 50" stroke="url(#flowGradient)" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M 15 40 C 30 40, 35 50, 50 50" stroke="url(#flowGradient)" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M 12 60 C 30 60, 35 50, 50 50" stroke="url(#flowGradient)" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
                <path d="M 18 80 C 30 80, 35 50, 50 50" stroke="url(#flowGradient)" strokeWidth="0.3" fill="none" vectorEffect="non-scaling-stroke" />
                
                {/* Linha de Saída (Flow) */}
                <path d="M 50 50 L 90 50" stroke="#d97706" strokeWidth="0.5" fill="none" strokeDasharray="3 3" className="animate-dash" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="relative z-10 w-full flex justify-between items-center px-4 md:px-12">
                
                {/* 1. O CAOS BIOLÓGICO (Inputs Dispersos) */}
                <div className="flex flex-col gap-8 items-start w-40">
                    <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity }} className="flex items-center gap-3 text-xs text-[var(--text-secondary)] opacity-60">
                        <IconAlert className="w-4 h-4 text-red-400/80"/> <span>Ansiedade</span>
                    </motion.div>
                    <motion.div animate={{ x: [0, 3, 0] }} transition={{ duration: 5, repeat: Infinity }} className="flex items-center gap-3 text-xs text-[var(--text-secondary)] opacity-60 pl-4">
                        <IconZap className="w-4 h-4 text-yellow-400/80"/> <span>Burnout</span>
                    </motion.div>
                    <motion.div animate={{ x: [0, 6, 0] }} transition={{ duration: 6, repeat: Infinity }} className="flex items-center gap-3 text-xs text-[var(--text-secondary)] opacity-60">
                        <IconLua className="w-4 h-4 text-purple-400/80"/> <span>Hormônios</span>
                    </motion.div>
                     <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 7, repeat: Infinity }} className="flex items-center gap-3 text-xs text-[var(--text-secondary)] opacity-60 pl-2">
                        <IconClock className="w-4 h-4 text-blue-400/80"/> <span>Prazos</span>
                    </motion.div>
                </div>

                {/* 2. O PRISMA (ASH - O Núcleo Estável) */}
                <div className="relative flex flex-col items-center justify-center">
                    {/* Anéis de Respiração */}
                    <div className="absolute inset-0 border border-[#d97706]/20 rounded-full animate-ping-slow scale-150"></div>
                    <div className="absolute inset-0 border border-[#d97706]/10 rounded-full animate-ping-slower scale-125"></div>

                    <div className="w-28 h-28 rounded-full border border-[#d97706] bg-[#0c0a09] shadow-[0_0_60px_rgba(217,119,6,0.3)] flex items-center justify-center relative z-20">
                        <div className="absolute inset-0 bg-[#d97706]/5 animate-pulse rounded-full" />
                        <PranaLogo className="w-12 h-12 text-[#d97706] fill-current" />
                    </div>
                    <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#d97706] font-bold text-center">Ash<br/>Transmutação</p>
                </div>

                {/* 3. A ORDEM FLUIDA (Output Único) */}
                <div className="flex flex-col items-center w-40">
                     <div className="glass-card px-6 py-4 rounded-xl border border-[#d97706]/30 bg-[#d97706]/5 text-center shadow-lg transform hover:scale-105 transition-transform">
                         <div className="text-[#d97706] mb-2"><IconFlux className="w-6 h-6 mx-auto"/></div>
                         <span className="text-sm text-[var(--text-primary)] font-serif italic">Ritmo Sustentável</span>
                     </div>
                </div>

            </div>
        </div>
    );
};

// --- VIDEO VERTICAL (MANTIDO) ---
const VerticalVideoCard = () => {
    const videoRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if(videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <div className="relative w-full max-w-[300px] mx-auto aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-[var(--glass-border)] group">
             <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover opacity-90"
                autoPlay loop muted playsInline
             >
                <source src="https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/20251220_144925.mp4?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS8yMDI1MTIyMF8xNDQ5MjUubXA0IiwiaWF0IjoxNzY3OTAwMzE4LCJleHAiOjE3OTk0MzYzMTh9.F8qwe73UvbScnZtaw2I8weofI64L3fz6eJPkxEw601g" type="video/mp4" />
             </video>
             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
             <div className="absolute top-4 right-4 z-20">
                 <button onClick={toggleMute} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:bg-[var(--accent)] hover:text-black transition-all">
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
// 2. PÁGINA PRINCIPAL
// ==========================================

export default function LandingPageHolisticV2({ onTogglePersona }) {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState("prana-dark-textured");
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured");
  };

  return (
    <div
      className={`prana-body min-h-screen w-full font-sans selection:bg-[var(--accent)]/30 ${theme}`}
      data-theme={theme}
      style={{ backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}
    >
      <ManifestoModal isOpen={isManifestoOpen} onClose={() => setIsManifestoOpen(false)} />
      
      {/* GLOBAL STYLES & ANIMATIONS */}
      <style>{`
        :root, [data-theme='prana-dark-textured'] {
          --accent-rgb: 217, 119, 6; --accent: #d97706;
          --bg-color: #1a1816;
          --text-primary: #e6e1db;
          --text-secondary: #a8a29e;
          --card-bg-solid: #262422; 
          --glass-border: rgba(255, 255, 255, 0.05); 
          --glass-bg: rgba(26, 24, 22, 0.6);
          --texture-image: url('https://www.transparenttextures.com/patterns/cartography.png');
        }
        [data-theme='prana-light-textured'] {
          --bg-color: #F0EFEA;
          --text-primary: #3d3a36; 
          --text-secondary: #6b6661; 
          --accent-rgb: 217, 119, 6; --accent: #d97706;
          --card-bg-solid: #FFFFFF;
          --glass-border: rgba(0, 0, 0, 0.05);
          --glass-bg: rgba(240, 239, 234, 0.85);
          --texture-image: url('https://www.transparenttextures.com/patterns/paper.png');
        }
        .serif-font { font-family: 'Vollkorn', serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes dash { to { stroke-dashoffset: -20; } }
        .animate-dash { animation: dash 1s linear infinite; }
        
        @keyframes ping-slow { 75%, 100% { transform: scale(1.5); opacity: 0; } }
        .animate-ping-slow { animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite; }

        @keyframes ping-slower { 75%, 100% { transform: scale(1.25); opacity: 0; } }
        .animate-ping-slower { animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
        
        html { scroll-behavior: smooth; }
      `}</style>
      
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                <PranaLogo className="w-8 h-8 text-[var(--accent)] opacity-100 fill-current" /> 
                <span className="serif-font text-xl tracking-tight hidden sm:block font-bold text-[var(--text-primary)]">Prana</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--text-secondary)] items-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center gap-1 hover:text-[var(--accent)] transition-colors outline-none">
                            Ecossistema <IconChevronDown className="w-3 h-3 op-60" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="p-2 w-64 bg-[#1a1816] border border-white/10 text-[#a8a29e] backdrop-blur-xl shadow-2xl rounded-lg mt-2 font-sans">
                             <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-[var(--accent)] tracking-widest opacity-80">Funcionalidades</div>
                             <DropdownMenuItem onClick={() => navigate('/ash')} className="cursor-pointer"><IconNeural className="w-3 h-3 mr-2"/> Ash & IA</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => document.getElementById('biology')?.scrollIntoView()} className="cursor-pointer"><IconZap className="w-3 h-3 mr-2"/> Biologia & Energia</DropdownMenuItem>
                             <div className="h-px bg-white/10 my-2"></div>
                             <DropdownMenuItem onClick={() => navigate('/plans')} className="cursor-pointer"><IconCheckCircle className="w-3 h-3 mr-2"/> Planos & Preços</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <button onClick={() => navigate('/plans')} className="hover:text-[var(--accent)] transition-colors">Planos</button>
                    <button onClick={() => navigate('/auth')} className="text-xs font-bold uppercase tracking-widest border border-[var(--accent)]/40 text-[var(--accent)] px-4 py-1.5 rounded hover:bg-[var(--accent)]/10">Login</button>
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] transition-colors">
                    {theme.includes('light') ? <IconLua className="w-5 h-5" /> : <IconFogo className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </nav>

      {/* ==========================================
        FASE 1: HERO (EMOÇÃO + VIDEO)
        ==========================================
      */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 z-0 bg-[url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/maxim-boldyrev-cDLLSVxTpmg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS9tYXhpbS1ib2xkeXJldi1jRExMU1Z4VHBtZy11bnNwbGFzaC5qcGciLCJpYXQiOjE3Njc4OTgxMDAsImV4cCI6MTc5OTQzNDEwMH0.bpM_qNjCs2MrCWSc8zk72KtHAhVDATuw9Nuz7s9biLI')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-color)] via-transparent to-[var(--bg-color)] opacity-90 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-20">
            {/* Texto */}
            <motion.div initial={{opacity:0, y:30}} animate={{opacity:1, y:0}} transition={{duration:1.2}}>
                 <div className="flex items-center gap-3 mb-6 opacity-60">
                    <div className="w-8 h-px bg-[var(--text-primary)]"></div>
                    <span className="text-xs uppercase tracking-[0.2em] font-light text-[var(--text-primary)]">Prana 3.0</span>
                 </div>
                 
                 <h1 className="text-5xl md:text-7xl serif-font font-light leading-tight mb-8 text-[var(--text-primary)]">
                    Ordem no Caos.<br/> 
                    <span className="italic opacity-60 text-4xl md:text-6xl">Sem rigidez.</span>
                 </h1>
                 
                 <p className="text-xl text-[var(--text-primary)]/70 mb-10 leading-relaxed max-w-lg font-light">
                    O primeiro sistema operacional que respeita sua biologia. 
                    Organize sua vida aceitando o fluxo, não lutando contra ele.
                 </p>
                 
                 <div className="flex gap-6">
                     <button onClick={() => navigate('/plans')} className="px-8 py-3 bg-[var(--accent)] text-[#1a1816] hover:bg-[var(--accent)]/90 transition-all uppercase text-xs tracking-widest font-bold rounded-sm shadow-[0_0_20px_rgba(217,119,6,0.3)]">
                         Começar Agora
                     </button>
                     <button onClick={() => setIsManifestoOpen(true)} className="flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
                         Ler Manifesto <IconArrowRight className="w-4 h-4" />
                     </button>
                 </div>
            </motion.div>

            {/* Vídeo Vertical */}
            <motion.div initial={{opacity:0, x:30}} animate={{opacity:1, x:0}} transition={{duration:1.5, delay:0.2}} className="hidden lg:block">
                 <VerticalVideoCard />
            </motion.div>
        </div>
      </section>

      {/* ==========================================
        FASE 2: A CRISE BIOLÓGICA (NOVA SUPER SESSÃO)
        ==========================================
      */}
      <div id="biology"></div>
      <section className="py-32 px-6 bg-[var(--card-bg-solid)] border-y border-[var(--glass-border)] relative">
          <div className="max-w-6xl mx-auto">
              
              {/* O GANCHO */}
              <div className="text-center mb-24">
                  <span className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 block animate-pulse">Diagnóstico do Século</span>
                  <h2 className="text-4xl md:text-6xl serif-font font-light mb-8 text-[var(--text-primary)]">
                      Tentamos rodar software de máquina <br/> 
                      <span className="italic text-[var(--text-secondary)]">em hardware biológico.</span>
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
                      65% da Geração Z relata ansiedade crônica ligada ao trabalho. O uso de estimulantes triplicou.
                      A culpa não é sua. É das ferramentas lineares que ignoram que você é um organismo cíclico.
                  </p>
              </div>

              {/* OS SENSORES DO PRANA */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
                   {[
                       { icon: IconZap, title: "Energia Dual", desc: "Monitora Bateria Física vs Mental separadamente." },
                       { icon: IconLua, title: "Hormonal", desc: "Adapta a interface ao seu ciclo (Lútea, Folicular)." },
                       { icon: IconCosmos, title: "Astrologia", desc: "Alerta sobre Mercúrio Retrógrado e Luas Minguantes." },
                       { icon: IconSoul, title: "Mood", desc: "Diário emocional que detecta padrões de ansiedade." }
                   ].map((item, i) => (
                       <div key={i} className="p-6 border border-[var(--glass-border)] rounded-xl bg-[var(--bg-color)] hover:border-[var(--accent)]/30 transition-colors group">
                           <item.icon className="w-8 h-8 text-[var(--text-secondary)] group-hover:text-[var(--accent)] mb-4 transition-colors" />
                           <h3 className="font-bold text-[var(--text-primary)] mb-2">{item.title}</h3>
                           <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
                       </div>
                   ))}
              </div>

              {/* DIAGRAMA ORGÂNICO */}
              <div className="text-center mb-12">
                  <h3 className="text-2xl serif-font mb-4 text-[var(--text-primary)]">O Antídoto: Biorregulação</h3>
                  <p className="text-[var(--text-secondary)]">O Ash traduz o ruído biológico em ritmo sustentável.</p>
              </div>
              <OrganicArchitectureDiagram />

          </div>
      </section>

      {/* ==========================================
        FASE 3: ASH E AÇÃO (CONECTADO)
        ==========================================
      */}
      <section className="py-32 px-6 bg-[var(--bg-color)]">
          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
                  <div className="order-2 lg:order-1">
                      <div className="p-1 glass-card rounded-xl border border-[var(--glass-border)] shadow-2xl">
                          <LiveDemoAsh />
                      </div>
                  </div>
                  <div className="order-1 lg:order-2">
                      <span className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4 block">Inteligência Guardiã</span>
                      <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">Ash não é só um Chat. <br/><span className="italic font-light">É um Guardião.</span></h2>
                      <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-6">
                          Quando sua fase menstrual pede recolhimento e a Lua está Minguante, o Ash bloqueia automaticamente projetos de alta demanda. Ele não deixa você se forçar.
                      </p>
                      <button onClick={() => navigate('/ash')} className="text-sm underline decoration-[var(--accent)] underline-offset-4 hover:text-[var(--accent)] transition-colors">
                          Entender a Tecnologia (Middleware) &rarr;
                      </button>
                  </div>
              </div>

              {/* DEMOS DE CRIAÇÃO */}
              <div className="text-center mb-16">
                  <h2 className="text-4xl serif-font font-bold mb-4 text-[var(--text-primary)]">Ação sem Atrito</h2>
                  <p className="text-[var(--text-secondary)]">Capture pensamentos antes que eles virem ansiedade.</p>
              </div>
              
              <div className="w-full max-w-4xl mx-auto mb-12">
                  <LiveDemoSmartCreation />
              </div>

              <div className="text-center mt-24">
                  <p className="text-xs text-[var(--text-secondary)] opacity-60 mb-6 uppercase tracking-widest">Visualização Líquida de Dados</p>
                  <LiveDemoViews />
              </div>
          </div>
      </section>

      {/* --- FOOTER / CTA FINAL --- */}
      <footer className="py-24 px-6 bg-[var(--card-bg-solid)] border-t border-[var(--glass-border)] text-center">
          <div className="max-w-4xl mx-auto">
               <PranaLogo className="w-16 h-16 text-[var(--accent)] mx-auto mb-8 fill-current" />
               <h2 className="text-4xl md:text-5xl serif-font font-bold mb-8 text-[var(--text-primary)]">
                   Pare de lutar contra sua natureza.
               </h2>
               <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
                   <button onClick={() => navigate('/plans')} className="px-10 py-4 bg-[var(--accent)] text-[#1a1816] text-lg font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]">
                       Sincronizar meu Ritmo
                   </button>
                   <button onClick={() => document.getElementById('biology')?.scrollIntoView()} className="px-10 py-4 border border-[var(--glass-border)] text-[var(--text-primary)] text-lg font-bold rounded-xl hover:bg-[var(--glass-border)] transition-transform">
                       Entender a Ciência
                   </button>
               </div>
               
               <div className="mt-12 text-[10px] text-[var(--text-secondary)] opacity-50 font-mono">
                   PRANA SYSTEMS V8.0 • WABI SABI EDITION • 2026
               </div>
          </div>
      </footer>

      {/* MODAL DE SMART CREATION (Trigger Manual) */}
      <AnimatePresence>
        {isHeroModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={(e) => { if(e.target === e.currentTarget) setIsHeroModalOpen(false); }}
          >
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="w-full max-w-2xl"
             >
                 <LiveDemoSmartCreation />
                 <button onClick={() => setIsHeroModalOpen(false)} className="mt-4 text-white/50 text-xs hover:text-white mx-auto block">Fechar Demo</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}