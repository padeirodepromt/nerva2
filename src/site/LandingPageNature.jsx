import React, { useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import { 
  IconSankalpa, IconDashboard, IconChat, IconFlux, IconNeural, 
  IconCronos, IconCosmos, IconNexus, IconPapyrus, IconColetivo, 
  IconMatrix, IconSettings, IconLua, IconFogo, IconZap, IconClock, 
  IconVision, IconAlert, IconCraft, IconGrowth, IconVoid, IconLayers, 
  IconKeep, IconDone, IconBlock, IconSoul, IconKanban, IconMap, 
  IconCloud, IconFilter, IconFeather, IconArrowRight, IconPlus,
  IconMenu, IconX, IconCheckCircle, IconCalendar, IconFolder, 
  IconHash, IconSearch, IconList, IconPaperclip, IconSend, IconGitBranch,
  IconLogOut, IconTrash, IconChevronDown, IconGlass
} from "../components/icons/PranaLandscapeIcons";
import RiverNacenteCinematic from "../components/biome/RiverNacenteCinematic";
import FruitForestCinematic from "../components/biome/FruitForestCinematic";
import OceanCinematic from "../components/biome/OceanCinematic";
import KanbanView from "../views/KanbanView";
import SheetView from "../views/SheetView";
import CalendarView from "../views/CalendarView";
import PlannerView from "../views/PlannerView";
import SmartCreationModal from "../components/smart/SmartCreationModal";
import ListView from "../views/ListView";
import MindMapBoardView from "../views/MindMapBoardView";
import BiomaSection from "./demos/BiomaSection";
import LiveDemoDashboard from "./demos/LiveDemoDashboard";
import LiveDemoAsh from "./demos/LiveDemoAsh";
import LiveDemoEnergy from "./demos/LiveDemoEnergy";
import LiveDemoViews from "./demos/LiveDemoViews";
import LiveDemoSmartCreation from "./demos/LiveDemoSmartCreation";
import LiveDemoPlanner from "./demos/LiveDemoPlanner";
import ManifestoModal from "./demos/ManifestoModal";

// ==========================================
// 1. VISUAL ASSETS
// ==========================================

const PranaLogo = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={`logo-mark ${className}`}>
    <path d="M 20 45 Q 10 40, 15 30 C 20 10, 80 10, 85 30 Q 90 40, 80 45 C 70 55, 30 55, 20 45 Z" className="fill-[var(--accent)]" />
    <path d="M 20 55 Q 10 60, 15 70 C 20 90, 80 90, 85 70 Q 90 60, 80 55 C 70 45, 30 45, 20 55 Z" className="fill-[var(--accent)]" />
  </svg>
);



export default function LandingPageNature() {
  const { scrollYProgress } = useScroll();
  const [theme, setTheme] = useState("prana-dark-textured");
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(prev => prev === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured");
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
          /* Cobre Wabi-Sabi */
          --accent-rgb: 184, 115, 51; --accent: rgb(var(--accent-rgb)); /* #B87333 Copper */
          --accent-dark-earthy: #8B4513; /* SaddleBrown */
          --bg-color: #1a1816; /* Base escura quase pedra */
          --text-primary: #e6e1db; /* Papel arroz */
          --text-secondary: #a8a29e; /* Cinza pedra */
          --card-bg-solid: #262422; 
          --texture-image: url('https://www.transparenttextures.com/patterns/concrete-wall.png');
          --texture-filter: invert(0.1) brightness(0.8);
          --texture-opacity: 0.15;
          --glass-border: rgba(255, 255, 255, 0.05); 
          --glass-bg: rgba(26, 24, 22, 0.6);
        }
        [data-theme='prana-light-textured'] {
          --bg-color: #F0EFEA; /* Papel antigo */
          --text-primary: #3d3a36; 
          --text-secondary: #6b6661; 
          --accent-rgb: 160, 82, 45; --accent: rgb(var(--accent-rgb)); /* Sienna */
          --card-bg-solid: #FFFFFF;
          --texture-image: url('https://www.transparenttextures.com/patterns/paper.png');
          --texture-filter: contrast(1.1);
          --texture-opacity: 0.5; 
          --glass-border: rgba(0, 0, 0, 0.05);
          --glass-bg: rgba(240, 239, 234, 0.85);
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
                <div className="hidden md:flex gap-6 text-sm font-medium text-[var(--text-secondary)]">
                    <a href="#ash" className="hover:text-[var(--accent)] transition-colors">Ash AI</a>
                    <a href="#holistic" className="hover:text-[var(--accent)] transition-colors">Holístico</a>
                    <a href="#views" className="hover:text-[var(--accent)] transition-colors">Views</a>
                    <a href="#pricing" className="hover:text-[var(--accent)] transition-colors">Planos</a>
                </div>
                <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--accent)]/10 text-[var(--text-secondary)] transition-colors">
                    {theme.includes('light') ? <IconLua className="w-5 h-5" /> : <IconFogo className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </nav>

      {/* --- HERO SECTION (WABI-SABI ATMOSPHERE) --- */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
          {/* CAMADA 1: VÍDEO/IMAGEM DE FUNDO (CHUVA/NÉVOA) */}
          <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[#0c0a09]/70 z-10 mix-blend-multiply"></div> {/* Filtro escuro para leitura */}
              
              {/* Opção Visual Wabi-Sabi: Chuva em vidro ou Floresta na Névoa */}
              <img 
                 src="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=2560&auto=format&fit=crop"
                 className="w-full h-full object-cover opacity-60 grayscale contrast-125 saturate-50"
                 alt="Rain on glass / Misted Forest"
              />
          </div>
          
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20 pt-20">
              <motion.div 
                initial={{opacity:0, y:20}} 
                animate={{opacity:1, y:0}} 
                transition={{duration:1.5, ease: "easeOut"}}
                className="lg:col-span-7 flex flex-col justify-center"
              >
                  <div className="flex items-center gap-3 mb-8 opacity-60">
                      <div className="w-px h-8 bg-[var(--text-primary)]"></div>
                      <span className="text-xs uppercase tracking-[0.3em] font-light text-[var(--text-primary)]">Sistema Operacional Contemplativo</span>
                  </div>
                  
                  <h1 className="text-5xl md:text-7xl serif-font font-normal leading-[1.1] mb-8 text-[#e6e1db] drop-shadow-xl">
                      A Tecnologia encontra<br/> 
                      <span className="italic opacity-70">a Natureza.</span>
                  </h1>
                  
                  <p className="text-xl text-[var(--text-primary)]/70 mb-12 leading-relaxed max-w-lg font-light border-l border-white/10 pl-6">
                      Não é sobre fazer mais rápido. É sobre fazer com presença.<br/>
                      Prana organiza o seu caos digital com a serenidade de um jardim de pedras.
                  </p>
                  
                  <div className="flex flex-wrap gap-6 items-center">
                      <button 
                        onClick={() => setIsHeroModalOpen(true)}
                        className="px-8 py-3 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[#1c1917] transition-all duration-500 uppercase text-xs tracking-widest font-bold backdrop-blur-sm"
                      >
                          Entrar no Fluxo
                      </button>
                      <button 
                          onClick={() => setIsManifestoOpen(true)}
                          className="hover:text-[var(--accent)] transition-colors text-sm text-[var(--text-secondary)] border-b border-transparent hover:border-[var(--accent)] pb-0.5"
                      >
                          Ler o Manifesto
                      </button>
                  </div>
              </motion.div>

              {/* Interface emergindo da névoa */}
              <motion.div 
                initial={{opacity:0}} 
                animate={{opacity:1}} 
                transition={{duration:2, delay:0.5}}
                className="lg:col-span-5 relative hidden lg:block"
              >
                  {/* Máscara de gradiente para a interface desaparecer nas bordas (efeito onírico) */}
                  <div className="relative" style={{maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'}}>
                      <div className="absolute -inset-10 bg-[var(--accent)]/10 rounded-full blur-[100px] opacity-30 mix-blend-screen"></div>
                      <LiveDemoAsh />
                  </div>
              </motion.div>
          </div>
          
           <motion.div 
             initial={{opacity:0}} animate={{opacity:0.5}} transition={{delay:2, duration:1}}
             className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center"
           >
               <p className="text-[10px] uppercase tracking-[0.4em] mb-2 text-white/50">Impermanência • Incompletude</p>
               <IconChevronDown className="w-4 h-4 mx-auto text-white/30 animate-pulse" />
           </motion.div>
      </section>



      {/* --- WABI-SABI PHILOSOPHY SECTION --- */}
      <section className="py-32 px-6 relative bg-[#141210] border-t border-white/5">
          <div className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none grayscale mix-blend-screen"
               style={{backgroundImage: "url('https://images.unsplash.com/photo-1518298020580-0a2a4b87aecc?q=80&w=2000&auto=format&fit=crop')"}}> 
               {/* Textura de galho seco/árvore no fundo */}
          </div>

          <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div>
                  <img 
                    src="https://images.unsplash.com/photo-1598965873722-1d5d44a2b224?q=80&w=1974&auto=format&fit=crop" 
                    alt="Pedra zen e textura organic" 
                    className="rounded-sm shadow-2xl grayscale contrast-125 opacity-80 rotate-2 hover:rotate-0 transition-transform duration-700"
                  />
                  <p className="text-[10px] text-right mt-2 text-[var(--accent)] uppercase tracking-widest opacity-60">Foto: A Estética do Essencial</p>
              </div>
              <div>
                  <h2 className="text-4xl serif-font font-light text-[var(--text-primary)] mb-8 leading-tight">
                      Aceite a Imperfeição.<br/>
                      <span className="text-[var(--text-secondary)] italic">Organize o Essencial.</span>
                  </h2>
                  <p className="text-lg text-[var(--text-secondary)] font-light leading-relaxed mb-8">
                      A maioria dos softwares tenta forçar uma ordem rígida e artificial. O Prana abraça a fluidez da vida real.
                      <br/><br/>
                      Seu design é inspirado no <strong>Wabi-Sabi</strong>: nada dura, nada é completo, e nada é perfeito. 
                      Nossas interfaces são janelas silenciosas, não painéis de controle barulhentos.
                  </p>
                  <div className="grid grid-cols-2 gap-8 mt-12 border-t border-white/5 pt-8">
                      <div>
                          <h4 className="text-[var(--text-primary)] text-sm uppercase tracking-widest mb-2 font-bold">Kanso (Simplicidade)</h4>
                          <p className="text-[var(--text-secondary)] text-xs leading-relaxed">Removemos o desnecessário para revelar a verdade dos seus projetos.</p>
                      </div>
                      <div>
                          <h4 className="text-[var(--text-primary)] text-sm uppercase tracking-widest mb-2 font-bold">Seijaku (Tranquilidade)</h4>
                          <p className="text-[var(--text-secondary)] text-xs leading-relaxed">Uma UI que promove calma ativa no meio da tempestade corporativa.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- ASH & INTELLIGENCE --- */}
      <div id="ash"></div>
      <section className="py-24 px-6 overflow-hidden">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <div className="order-2 md:order-1">
                 <LiveDemoEnergy />
             </div>
             <div className="order-1 md:order-2">
                 <div className="text-[var(--accent)] font-bold text-xs uppercase tracking-widest mb-4">Ash Intelligence</div>
                 <h2 className="text-4xl serif-font font-bold mb-6 text-[var(--text-primary)]">Mais que um Chatbot. <br/> Um parceiro de pensamento e execução em Alta Performance.</h2>
                 <p className="text-[var(--text-secondary)] mb-6 text-lg">
                    Ash é a inteligência proativa que "mora" no seu sistema.
                 </p>
                 <ul className="space-y-4 mb-8">
                    {[
                        "Consciência de Contexto: Ash sabe se você está cansado hoje.",
                        "Memória de Longo Prazo (Knowledge Base): Conecta todos seus dados históricos.",
                        "Engenheiro de Código Integrado: Web IDE completa para criar ferramentas.",
                        "Biorregulação: Sugere pausas quando detecta estresse.",
                        "Criação Estruturada: Transforma ideias soltas em projetos completos."
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

      {/* --- ASH EVOLUTION PROTOCOL (Former S.O.C.D.) --- */}
      <section className="pb-24 px-6 bg-[var(--bg-color)] relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                  
                  {/* Left Column: Context Logic */}
                  <div className="lg:col-span-1 pt-4 lg:sticky lg:top-24">
                      <div className="flex items-center gap-2 mb-6 opacity-80">
                         <div className="w-8 h-px bg-[var(--accent)]"></div>
                         <span className="text-[var(--accent)] text-xs font-bold uppercase tracking-widest">Core Function</span>
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
                              title: "SHOW", 
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
                              title: "CREATE", 
                              concept: "A Forja",
                              desc: "Ash prepara docs e templates para você entrar em Flow.",
                              quote: '"O rascunho do projeto já está na sua mesa."',
                              icon: IconPapyrus
                          },
                          { 
                              step: "04",
                              title: "DEVELOP", 
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
                                  <p className="text-[11px] italic text-[var(--text-primary)] opacity-80 font-serif leading-tight">
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

      {/* --- DASHBOARD SECTION (O SANTUÁRIO) --- */}
      <section className="py-32 px-6 relative overflow-hidden bg-[#0c0a09]">
          {/* Fundo decorativo simulando "ambiente" */}
          <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1506543730-379a8342217c?q=80&w=2682&auto=format&fit=crop')] bg-cover bg-center grayscale mix-blend-overlay"></div>
          
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
               <div className="order-2 lg:order-1 pt-2 relative">
                   {/* Efeito gráfico atrás do dashboard para parecer um "portal" */}
                   <div className="absolute -inset-2 bg-gradient-to-b from-[var(--accent)]/5 to-transparent rounded-2xl blur-xl -z-10"></div>
                   <LiveDemoDashboard />
                   <div className="mt-6 flex justify-center gap-4 text-[10px] uppercase tracking-widest text-[#57534e]">
                        <span>• Prana Level 85%</span>
                        <span>• Moon Phase: Waning</span>
                   </div>
               </div>
               
               <div className="order-1 lg:order-2 sticky top-24">
                   <div className="w-12 h-1 bg-[var(--accent)] mb-8 opacity-50"></div>
                   <h2 className="text-4xl serif-font font-normal mb-8 text-[var(--text-primary)]">
                        O Altar Digital.
                   </h2>
                   <p className="text-[#a8a29e] mb-10 text-lg leading-relaxed font-light">
                       Quando você abre o Prana, não está "logando". Está entrando em um espaço sagrado de foco.
                       <br/>
                       Painéis de madeira escura, texturas de papel, e silêncio visual. Seus dados de vida e trabalho unificados não por tabelas rígidas, mas por harmonia.
                   </p>
                   
                   <div className="space-y-8 border-l border-white/5 pl-8">
                       <div className="group cursor-default">
                           <h4 className="font-serif text-[var(--text-primary)] text-xl mb-2 flex items-center gap-3">
                               <IconCosmos className="w-4 h-4 text-[var(--accent)] opacity-70" /> Sincronicidade
                           </h4>
                           <p className="text-sm text-[#78716c] leading-relaxed">
                               O sistema pulsa com seus ritmos, não contra eles. Astrologia e Biometria informam a interface.
                           </p>
                       </div>
                       <div className="group cursor-default">
                           <h4 className="font-serif text-[var(--text-primary)] text-xl mb-2 flex items-center gap-3">
                               <IconGlass className="w-4 h-4 text-[var(--accent)] opacity-70" /> Transparência
                           </h4>
                           <p className="text-sm text-[#78716c] leading-relaxed">
                               Veja apenas o que importa agora. O resto desaparece na névoa até ser necessário.
                           </p>
                       </div>
                   </div>
               </div>
          </div>
      </section>

      {/* --- VIEWS SECTION (PERSPECTIVAS) --- */}
      <section className="py-24 px-6 relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-[#1a1816] to-transparent pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto">
              <div className="mb-16 flex flex-col md:flex-row gap-12 text-[#a8a29e]">
                  <div className="md:w-1/3">
                      <span className="text-[var(--accent)] font-serif italic text-xl mb-4 block">Perspectivas</span>
                      <h2 className="text-3xl font-light mb-6 text-[var(--text-primary)]">
                          Formas de Ver
                      </h2>
                  </div>
                  <div className="md:w-2/3 md:pt-14">
                      <p className="text-lg font-light leading-relaxed">
                          A água assume a forma do recipiente. Seus dados assumem a forma da sua necessidade.
                          Do fluxo visual do Kanban à estrutura rígida da Tabela, o Prana adapta a realidade à sua mente.
                      </p>
                  </div>
              </div>

              <LiveDemoViews />

              {/* Views Reference Grid - Wabi Sabi Style */}
              <div className="mt-16 border-t border-[#44403c]/20 pt-16">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {[
                          { name: 'Kanban Board', desc: 'Fluxo visual como pedras no rio. Mova tarefas entre estados.', icon: IconFlux },
                          { name: 'Data Grid', desc: 'Estrutura cristalina. Tabela densa para organizar o caos.', icon: IconMatrix },
                          { name: 'Smart Calendar', desc: 'O tempo como ele é. Arraste para reagendar. Sincronia natural.', icon: IconCosmos },
                          { name: 'Mind Map', desc: 'Ramificações orgânicas. Quebre grandes ideias como galhos.', icon: IconNeural },
                          { name: 'Dependency Graph', desc: 'Teia de conexões. Veja o invisível entre as tarefas.', icon: IconNexus },
                          { name: 'Focus List', desc: 'Simplicidade monástica. Uma lista, uma tarefa de cada vez.', icon: IconDashboard }
                      ].map((view, i) => (
                          <div key={i} className="group cursor-default">
                              <div className="flex items-start gap-4 mb-3">
                                  <view.icon className="w-5 h-5 text-[#78716c] group-hover:text-[var(--accent)] transition-colors mt-1" />
                                  <h4 className="font-serif text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">{view.name}</h4>
                              </div>
                              <p className="text-sm text-[#57534e] leading-relaxed pl-9 border-l border-[#292524] group-hover:border-[var(--accent)]/30 transition-colors">
                                  {view.desc}
                              </p>
                          </div>
                      ))}
                   </div>
              </div>
          </div>
      </section>

      {/* --- PLANNER SECTION (CICLOS & RITMOS) --- */}
      <section className="py-24 px-6 border-y border-[#292524] bg-[#1c1917]/30">
          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                      <span className="text-[var(--accent)] font-serif italic text-lg mb-2 block">Tempo</span>
                      <h2 className="text-3xl font-light mb-8 text-[var(--text-primary)]">
                          Ritmos Naturais
                      </h2>
                      <p className="text-[#a8a29e] mb-10 leading-relaxed font-light">
                          O tempo não é linear, é cíclico. O Planner do Prana respeita seus níveis de energia ao longo do dia e da semana.
                          <br/><br/>
                          Não preencha caixas. Crie espaço para o que importa.
                      </p>
                      
                      <div className="space-y-8">
                           <div className="flex gap-4 group">
                               <div className="w-px h-12 bg-[#44403c] group-hover:bg-[var(--accent)] transition-colors"></div>
                               <div>
                                   <strong className="block text-[var(--text-primary)] text-lg serif-font mb-1">Rotinas de Base</strong>
                                   <p className="text-sm text-[#78716c]">Rituais matinais e blocos de foco. O alicerce do seu dia.</p>
                               </div>
                           </div>
                           <div className="flex gap-4 group">
                               <div className="w-px h-12 bg-[#44403c] group-hover:bg-[var(--accent)] transition-colors"></div>
                               <div>
                                   <strong className="block text-[var(--text-primary)] text-lg serif-font mb-1">Capacidade Real</strong>
                                   <p className="text-sm text-[#78716c]">O sistema entende seus limites. Respeite sua humanidade.</p>
                               </div>
                           </div>
                           <div className="flex gap-4 group">
                               <div className="w-px h-12 bg-[#44403c] group-hover:bg-[var(--accent)] transition-colors"></div>
                               <div>
                                   <strong className="block text-[var(--text-primary)] text-lg serif-font mb-1">Fluxo Temporal</strong>
                                   <p className="text-sm text-[#78716c]">Arraste o futuro para o presente com um gesto simples.</p>
                               </div>
                           </div>
                      </div>
                  </div>
                  <div className="relative">
                      {/* Decorative elements behind planner */}
                      <div className="absolute -inset-4 border border-[#44403c]/20 rounded-xl -z-10 rotate-1"></div>
                      <div className="absolute -inset-4 border border-[#44403c]/20 rounded-xl -z-10 -rotate-1"></div>
                      <LiveDemoPlanner />
                  </div>
              </div>
          </div>
      </section>

      {/* --- SMART CREATION SECTION (A ARTE DA ESCRITA) --- */}
      <section className="py-24 px-6 relative overflow-hidden">
          {/* Fundo sutil de papel antigo */}
          <div className="absolute inset-0 bg-[#e7e5e4] opacity-[0.02] mix-blend-overlay pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")'}}></div>

          <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div className="order-2 lg:order-1">
                      <LiveDemoSmartCreation />
                      <p className="text-center text-[10px] uppercase tracking-widest text-[#57534e] mt-4">
                          * Ash Intelligence v3.0 Processing
                      </p>
                  </div>
                  
                  <div className="order-1 lg:order-2">
                       <span className="text-[var(--accent)] font-serif italic text-lg mb-2 block">Criação</span>
                       <h2 className="text-3xl font-light mb-8 text-[var(--text-primary)]">
                           Manifestação Intuitiva
                       </h2>
                       <p className="text-[#a8a29e] mb-10 leading-relaxed font-light">
                           Apenas escreva. O sistema entende. 
                           <br/>
                           Sem formulários complexos. Transforme um pensamento difuso em um plano concreto apenas digitando.
                       </p>
                       
                       <div className="pl-6 border-l border-[var(--accent)]/30 italic text-[#78716c] space-y-4">
                           <p>"Projeto: Jardim Zen #pessoal"</p>
                           <p>"Meditação diária às 7h amanhã"</p>
                           <p>"Reunião com os Arquitetos na sexta"</p>
                       </div>
                       
                       <p className="mt-8 text-sm text-[#57534e]">
                           Ash (nossa IA) categoriza, agenda e estrutura para você.
                       </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- FORMAS DE CRIAÇÃO (ELEMENTAIS) --- */}
      <section className="py-32 px-6 border-b border-[#292524] bg-[#0c0a09]">
          <div className="max-w-7xl mx-auto">
              <div className="max-w-3xl mx-auto text-center mb-24">
                   <div className="w-16 h-1 bg-[var(--accent)]mx-auto mb-8 mx-auto opacity-50"></div>
                   <h2 className="text-4xl font-serif text-[var(--text-primary)] mb-6">A Alquimia dos Dados</h2>
                   <p className="text-[#a8a29e] text-lg font-light leading-relaxed">
                       Para organizar o caos, primeiro precisamos dar nome às coisas. 
                       No Prana, cada input é tratado como um elemento químico diferente.
                   </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="group cursor-default text-center">
                       <div className="w-20 h-20 mx-auto rounded-full border border-[#44403c] flex items-center justify-center mb-6 group-hover:border-[var(--accent)] transition-colors">
                           <IconPapyrus className="w-8 h-8 text-[#78716c] group-hover:text-[var(--accent)] transition-colors" />
                       </div>
                       <h3 className="text-xl serif-font text-[var(--text-primary)] mb-3">Pensamento (Ar)</h3>
                       <p className="text-sm text-[#78716c] leading-relaxed px-4">
                           Volátil, rápido, sem forma definida. Ideias, rascunhos, journal. O vento que sopra antes da chuva.
                       </p>
                  </div>

                  <div className="group cursor-default text-center relative">
                       {/* Linha conectora desktop */}
                       <div className="hidden md:block absolute top-10 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#44403c] to-transparent -z-10"></div>
                       
                       <div className="w-20 h-20 mx-auto rounded-full bg-[#1c1917] border border-[#44403c] flex items-center justify-center mb-6 group-hover:border-[var(--accent)] transition-colors relative z-10">
                           <IconDone className="w-8 h-8 text-[#78716c] group-hover:text-[var(--accent)] transition-colors" />
                       </div>
                       <h3 className="text-xl serif-font text-[var(--text-primary)] mb-3">Tarefa (Terra)</h3>
                       <p className="text-sm text-[#78716c] leading-relaxed px-4">
                           Sólido, pesado, concreto. Algo que precisa ser feito no mundo físico. Exige energia densa.
                       </p>
                  </div>

                  <div className="group cursor-default text-center">
                       <div className="w-20 h-20 mx-auto rounded-full border border-[#44403c] flex items-center justify-center mb-6 group-hover:border-[var(--accent)] transition-colors">
                           <IconSankalpa className="w-8 h-8 text-[#78716c] group-hover:text-[var(--accent)] transition-colors" />
                       </div>
                       <h3 className="text-xl serif-font text-[var(--text-primary)] mb-3">Projeto (Fogo)</h3>
                       <p className="text-sm text-[var(--text-primary)] leading-relaxed px-4">
                           A vontade em movimento. Transforma matéria. Um conjunto de tarefas com um propósito ardente.
                       </p>
                  </div>
              </div>
          </div>
      </section>

      {/* --- MANIFESTO BLOCK --- */}
      <section className="py-32 px-6 border-y border-[#292524] relative overflow-hidden">
           <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487622750296-6360190669a1?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-fixed opacity-[0.03] grayscale"></div>
           <div className="max-w-2xl mx-auto text-center relative z-10">
               <IconSoul className="w-12 h-12 mx-auto text-[#57534e] mb-8" />
               <p className="text-xl md:text-2xl font-serif text-[var(--text-primary)] leading-relaxed italic">
                   "A ordem não vem do controle rígido, mas do entendimento profundo da natureza de cada coisa."
               </p>
               <div className="w-16 h-[2px] bg-[var(--accent)] mx-auto mt-8 mb-8"></div>
               <p className="text-[#78716c] text-sm tracking-widest uppercase">
                   Prana Systems • Filosofia de Design
               </p>
           </div>
      </section>

      {/* --- ENERGY EXCHANGE (PRICING) --- */}
      <section id="pricing" className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-serif mb-4 text-[var(--text-primary)]">Energia de Troca</h2>
                  <p className="text-[#a8a29e]">Escolha o nível de compromisso com a sua organização.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {/* Iniciado */}
                  <div className="p-8 rounded border border-[#292524] bg-[#1c1917]/50 hover:border-[#44403c] transition-colors text-center group">
                      <h3 className="text-lg font-serif text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent)] transition-colors">Iniciado</h3>
                      <div className="text-3xl font-light text-[var(--text-primary)] mb-8">Gratuito</div>
                      <ul className="text-left space-y-4 mb-8 text-sm text-[#78716c] font-light">
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> 3 Projetos Ativos (Elementais Básicos)</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Ash Intelligence (Diário)</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Visualização de Calendário</li>
                      </ul>
                      <button className="w-full py-3 border border-[#44403c] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs uppercase tracking-widest transition-colors">
                          Iniciar Jornada
                      </button>
                  </div>

                  {/* Adepto */}
                  <div className="p-8 rounded border border-[var(--accent)]/30 bg-[#1c1917] relative transform md:-translate-y-4 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--bg-color)] px-4 text-[var(--accent)] text-[10px] uppercase tracking-widest border border-[var(--accent)]/30 py-1">
                          Recomendado
                      </div>
                      <div className="text-center">
                          <h3 className="text-lg font-serif text-[var(--accent)] mb-4">Adepto</h3>
                          <div className="text-3xl font-light text-[var(--text-primary)] mb-8">R$ 49 <span className="text-base text-[#57534e]">/mês</span></div>
                      </div>
                      <ul className="text-left space-y-4 mb-8 text-sm text-[#a8a29e] font-light">
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Projetos Ilimitados</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Ash Ilimitada (O Oráculo)</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Astrologia & Biorritmos</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Dashboards Sagrados</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Modo offline</li>
                      </ul>
                      <button className="w-full py-3 bg-[var(--accent)] hover:bg-[#a66326] text-[#1c1917] font-bold text-xs uppercase tracking-widest transition-colors">
                          Consagrar Acesso
                      </button>
                  </div>

                  {/* Mestre */}
                  <div className="p-8 rounded border border-[#292524] bg-[#1c1917]/50 hover:border-[#44403c] transition-colors text-center group">
                      <h3 className="text-lg font-serif text-[var(--text-primary)] mb-4 group-hover:text-[var(--accent)] transition-colors">Mestre</h3>
                      <div className="text-3xl font-light text-[var(--text-primary)] mb-8">R$ 99 <span className="text-base text-[#57534e]">/mês</span></div>
                      <ul className="text-left space-y-4 mb-8 text-sm text-[#78716c] font-light">
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Tudo do plano Adepto</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Workspaces Compartilhados (Tribo)</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> API de Acesso Global</li>
                          <li className="flex gap-3"><span className="text-[var(--accent)]">•</span> Suporte Prioritário</li>
                      </ul>
                      <button className="w-full py-3 border border-[#44403c] hover:border-[var(--accent)] text-[var(--text-primary)] text-xs uppercase tracking-widest transition-colors">
                          Contatar Oráculo
                      </button>
                  </div>
              </div>
          </div>
      </section>

      {/* --- FOOTER (O FIM DO CICLO) --- */}
      <footer className="py-24 px-6 border-t border-[#292524] bg-[#0c0a09] relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-[var(--accent)]/5 blur-3xl rounded-full pointer-events-none"></div>
          
          <div className="max-w-4xl mx-auto text-center">
               <PranaLogo className="w-12 h-12 text-[#57534e] mx-auto mb-8 hover:text-[var(--accent)] transition-colors" />
               <h2 className="text-3xl font-serif font-light mb-8 text-[var(--text-primary)]">
                   Sua mente, um jardim.
               </h2>
               <p className="text-[#78716c] mb-12 max-w-lg mx-auto font-light leading-relaxed">
                   Junte-se àqueles que escolheram cultivar a calma ao invés de colher a pressa.
               </p>
               
               <button className="px-8 py-3 bg-[var(--accent)] hover:bg-[#a66326] text-[#1c1917] font-bold uppercase tracking-widest text-xs rounded transition-colors mb-12">
                   Entrar no Santuário
               </button>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-[10px] text-[#57534e] uppercase tracking-widest border-t border-[#292524] pt-12">
                   <a href="#" className="hover:text-[var(--accent)] transition-colors">Manifesto</a>
                   <a href="#" className="hover:text-[var(--accent)] transition-colors">Roadmap</a>
                   <a href="#" className="hover:text-[var(--accent)] transition-colors">Privacidade</a>
                   <a href="#" className="hover:text-[var(--accent)] transition-colors">Twitter</a>
               </div>
               <div className="mt-12 text-[10px] text-[#44403c] font-mono">
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
