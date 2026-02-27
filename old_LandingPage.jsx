import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Zap, Sun, Moon, CheckCircle2, Plus, Layout, Sparkles, Wind, Sprout, Mountain } from "lucide-react";

// ==========================================
// 1. COMPONENTES VISUAIS (Miniaturas para a LP)
// ==========================================

const PranaLogo = ({ className = "w-10 h-10" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={`logo-mark ${className}`}>
    <path d="M 20 45 Q 10 40, 15 30 C 20 10, 80 10, 85 30 Q 90 40, 80 45 C 70 55, 30 55, 20 45 Z" className="logo-glyph-shape-fill" />
    <path d="M 20 55 Q 10 60, 15 70 C 20 90, 80 90, 85 70 Q 90 60, 80 55 C 70 45, 30 45, 20 55 Z" className="logo-glyph-shape-fill" />
  </svg>
);

const IconBase = ({ children, className = "", ativo = false, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    className={`icon-hero ${ativo ? "icon-ativo" : ""} ${className}`}
    {...props}
  >
    {children}
  </svg>
);

const IconChat = (props) => (
  <IconBase {...props}>
    <path
      className="icon-loader-wave"
      d="M 20 60 Q 10 50, 20 40 T 40 40 T 60 40 T 80 40 Q 90 50, 80 60 T 60 60 T 40 60 T 20 60 Z"
    />
  </IconBase>
);

const IconSankalpa = (props) => (
  <IconBase {...props}>
    <path
      className="icon-nature-energia"
      d="M 50 10 Q 90 25, 90 50 Q 90 75, 50 90 Q 10 75, 10 50 Q 10 25, 50 10 Z"
      style={{ strokeDasharray: "4 4" }}
    />
    <path className="icon-nature-base" d="M 50 20 L 70 40 L 50 80 L 30 40 Z" />
    <path
      className="icon-hero-detalhe"
      d="M 50 20 L 50 80 M 30 40 L 70 40"
      style={{ fill: "none", stroke: props.ativo ? "var(--accent-dark-earthy)" : "none" }}
    />
  </IconBase>
);

const IconNeural = (props) => (
  <IconBase {...props}>
    <circle
      className="icon-nature-energia"
      cx="50"
      cy="35"
      r="25"
      style={{ strokeDasharray: "4 4", animationDelay: "-0.8s" }}
    />
    <path className="icon-nature-base" d="M 50 85 V 40" />
    <path className="icon-nature-base" d="M 50 60 L 30 40" />
    <path className="icon-nature-base" d="M 50 60 L 70 40" />
  </IconBase>
);

const IconCronos = (props) => (
  <IconBase {...props}>
    <path
      className="icon-nature-energia"
      d="M 30 10 Q 60 50, 30 90 Q 40 50, 30 10 Z"
      style={{ strokeDasharray: "4 4", opacity: "0.5" }}
    />
    <path className="icon-nature-base" d="M 40 10 Q 70 50, 40 90 Q 50 50, 40 10 Z" />
  </IconBase>
);

// ==========================================
// 2. COMPONENTE "LIVE DEMO" (A Mágica)
// ==========================================

const LiveDemo = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: Typing, 2: Processing, 3: Done
  const [text, setText] = useState("");
  const targetText = "Criar projeto 'Jardim Zen' com 3 tarefas de foco.";

  useEffect(() => {
    let isCancelled = false;

    const runSequence = async () => {
      while (!isCancelled) {
        // Reset
        setStep(0);
        setText("");
        await new Promise((r) => setTimeout(r, 1500));

        // Step 1: Typing
        setStep(1);
        for (let i = 0; i <= targetText.length; i++) {
          if (isCancelled) return;
          setText(targetText.slice(0, i));
          await new Promise((r) => setTimeout(r, 50));
        }

        // Step 2: Processing (Sent)
        await new Promise((r) => setTimeout(r, 500));
        if (isCancelled) return;
        setStep(2);

        // Step 3: Manifestation (Done)
        await new Promise((r) => setTimeout(r, 1500));
        if (isCancelled) return;
        setStep(3);

        // Wait before restart
        await new Promise((r) => setTimeout(r, 6000));
      }
    };

    runSequence();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col md:flex-row overflow-hidden bg-[#0c0a09] rounded-lg border border-white/10 relative shadow-2xl">
      {/* --- LADO ESQUERDO: CHAT (ETÉREO/INTENÇÃO) --- */}
      <div className="w-full md:w-1/3 border-r border-white/10 p-4 flex flex-col relative bg-black/40 backdrop-blur-md">
        {/* Header Chat */}
        <div className="flex items-center gap-2 mb-6 opacity-50 border-b border-white/5 pb-2">
          <IconChat className="w-4 h-4" />
          <span className="text-[10px] mono-font uppercase tracking-widest">Prana Interface</span>
        </div>

        {/* Área de Mensagens */}
        <div className="flex-1 space-y-6">
          {/* Mensagem do Usuário */}
          <AnimatePresence>
            {step >= 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="self-end bg-white/5 p-3 rounded-xl rounded-tl-none border border-white/5 text-sm"
              >
                <p className="text-white/90 leading-relaxed">
                  {text}
                  {step === 1 && (
                    <span className="inline-block w-1.5 h-4 ml-1 bg-[var(--accent)] animate-pulse align-middle"></span>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Resposta da IA (Onda Pulsante) */}
          <AnimatePresence>
            {step >= 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full border border-[var(--accent)]/30 flex items-center justify-center ${
                      step === 2 ? "animate-pulse" : ""
                    }`}
                  >
                    <IconChat className="w-5 h-5" ativo={step === 2} />
                  </div>
                  <span className="text-xs mono-font text-[var(--accent)]">
                    {step === 2 ? "Manifestando..." : "Concluído"}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- LADO DIREITO: DASHBOARD (RUDIMENTAR/REALIDADE) --- */}
      <div className="w-full md:w-2/3 p-6 bg-[#11100F] relative flex items-center justify-center">
        {/* Textura de fundo */}
        <div
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cartographer.png')" }}
        ></div>

        <AnimatePresence mode="wait">
          {step < 3 ? (
            // Estado Vazio (Aguardando)
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center"
            >
              <div className="w-20 h-20 border-2 border-dashed border-white/10 rounded-full flex items-center justify-center mb-4">
                <IconSankalpa className="w-10 h-10 opacity-50" />
              </div>
              <p className="mono-font text-xs tracking-widest opacity-50">AGUARDANDO INTENÇÃO</p>
            </motion.div>
          ) : (
            // Estado Manifesto (Projeto Criado)
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="w-full max-w-md"
            >
              {/* Card do Projeto */}
              <div className="glass-panel p-6 rounded-xl border border-[var(--accent)]/30 shadow-[0_0_30px_rgba(217,119,6,0.1)] relative overflow-hidden">
                {/* Brilho de "Recém Criado" */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)] animate-[pulse_2s_ease-in-out]"></div>

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-[#0c0a09] bg-[var(--accent)] px-2 py-0.5 rounded uppercase tracking-wider">
                        Novo Projeto
                      </span>
                    </div>
                    <h2 className="text-3xl serif-font text-white">Jardim Zen</h2>
                    <p className="text-white/60 text-sm mt-1">Espaço para reconexão e meditação diária.</p>
                  </div>
                  <div className="p-2 bg-white/5 rounded-lg border border-white/10">
                    <IconSankalpa className="w-8 h-8" ativo={true} />
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    "Pesquisar pedras naturais e areia",
                    "Comprar fonte de água pequena",
                    "Definir horário de meditação (Manhã)",
                  ].map((task, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="flex items-center gap-3 p-3 bg-black/20 rounded border border-white/5 hover:border-[var(--accent)]/30 transition-colors cursor-pointer group"
                    >
                      <div className="w-5 h-5 rounded-full border border-[var(--accent)]/50 flex items-center justify-center group-hover:bg-[var(--accent)]/10">
                        <div className="w-2 h-2 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <span className="text-sm text-white/80">{task}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[var(--accent)] flex items-center justify-center text-[10px] font-bold text-black">
                      EU
                    </div>
                    <span className="text-xs text-white/40">Criado agora</span>
                  </div>
                  <div className="text-xs mono-font text-[var(--accent)]">Energia Necessária: Média</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// ==========================================
// 3. PÁGINA PRINCIPAL (LANDING PAGE)
// ==========================================

export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const [theme, setTheme] = useState("prana-dark-textured");

  return (
    <div
      className={`prana-body min-h-screen h-screen overflow-y-auto font-sans selection:bg-orange-500/30 ${theme}`}
      data-theme={theme}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Vollkorn:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        :root, [data-theme='prana-dark-textured'] {
          --accent-rgb: 217, 119, 6; --accent: rgb(var(--accent-rgb)); --accent-dark-earthy: #78350F;
          --bg-color: #050407; --text-primary: 250, 250, 245; --text-secondary: 203, 213, 225;
          --card-bg-solid: #11100F; --texture-image: url('https://www.transparenttextures.com/patterns/cartographer.png');
          --glass-border: rgba(217, 119, 6, 0.25); --glass-bg: rgba(15, 10, 5, 0.92);
        }
        [data-theme='prana-light-textured'] {
          /* Papel gelo, alto contraste e glassmorphism suave */
          --bg-color: #FDFBF6; /* branco papel, sem cinza sujo */
          --text-primary: 24, 20, 16; /* marrom escuro quente para contraste forte */
          --text-secondary: 102, 92, 80; /* cinza quente ainda bem legível */
          --card-bg-solid: #FFFFFF;
          --texture-image: url('https://www.transparenttextures.com/patterns/paper.png');
          --glass-border: rgba(217, 119, 6, 0.18);
          --glass-bg: rgba(255, 255, 255, 0.88);
        }

        body { background-color: var(--bg-color); color: rgb(var(--text-primary)); font-family: 'Space Grotesk', sans-serif; margin: 0; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        .serif-font { font-family: 'Vollkorn', serif; }

        .glass-panel {
          background-color: var(--glass-bg);
          background-image: var(--texture-image);
          background-blend-mode: overlay;
          border: 1px solid var(--glass-border);
          box-shadow: 0 18px 45px -20px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        [data-theme='prana-light-textured'] .glass-panel {
          background-blend-mode: normal;
          box-shadow: 0 18px 45px -24px rgba(15, 23, 42, 0.25);
        }

        .text-glow { text-shadow: 0 0 18px rgba(var(--accent-rgb), 0.55); }
        [data-theme='prana-light-textured'] .text-glow { text-shadow: none; }

        /* Ajuste fino de contraste para textos "muted" na landing */
        [data-theme='prana-light-textured'] .opacity-60 { opacity: 0.8; }
        [data-theme='prana-light-textured'] .opacity-70 { opacity: 0.85; }
        [data-theme='prana-dark-textured'] .opacity-60 { opacity: 0.7; }

        .glow-button {
          background-color: var(--accent); color: #0c0a09; font-weight: 600;
          box-shadow: 0 0 20px rgba(var(--accent-rgb), 0.4); transition: all 0.3s ease;
        }
        .glow-button:hover {
          box-shadow: 0 0 30px rgba(var(--accent-rgb), 0.7); transform: translateY(-2px) scale(1.05);
        }

        @keyframes pulse-fill { 0%, 100% { fill-opacity: 0.8; } 50% { fill-opacity: 1; } }
        @keyframes pulse-stroke { 0%, 100% { stroke-opacity: 0.7; } 50% { stroke-opacity: 1; } }
        @keyframes pulse-aura { 0%, 100% { stroke-opacity: 0.6; transform: scale(1); } 50% { transform: scale(1.03); } }
        .logo-glyph-shape-fill { fill: var(--accent); stroke: none; animation: pulse-fill 3s ease-in-out infinite; }
        .icon-hero { width: 3rem; height: 3rem; stroke-linecap: round; stroke-linejoin: round; transition: all 0.3s ease-in-out; opacity: 0.7; fill: none; }
        .icon-nature-base { stroke: var(--accent); stroke-width: 1.5; fill: none; transition: all 0.3s; }
        .icon-nature-energia { fill: none; stroke: var(--accent); stroke-width: 1.5; opacity: 0.5; transform-origin: center; animation: pulse-stroke 3s infinite; transition: all 0.3s; }

        .icon-ativo .icon-nature-base { fill: var(--accent); stroke-width: 1; animation: pulse-fill 3.5s infinite; }
        .icon-ativo .icon-nature-energia { opacity: 1; stroke-width: 2; animation: pulse-aura 2s infinite; }
        .icon-ativo .icon-hero-detalhe { fill: var(--accent-dark-earthy) !important; stroke: none !important; }
      `}</style>

      {/* --- NAV --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5 transition-all duration-300 bg-black/10">
        <div className="flex items-center gap-3 cursor-pointer group">
          <PranaLogo className="w-8 h-8 group-hover:scale-110 transition-transform duration-300" />
          <span className="font-bold text-xl tracking-tight group-hover:text-[var(--accent)] transition-colors">Prana</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
          <a href="#manifesto" className="hover:text-[var(--accent)] transition-colors hover:scale-105 transform">
            Manifesto
          </a>
          <a href="#demo" className="hover:text-[var(--accent)] transition-colors hover:scale-105 transform">
            O Sistema
          </a>
          <a href="#planos" className="hover:text-[var(--accent)] transition-colors hover:scale-105 transform">
            Planos
          </a>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme((t) => (t === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured"))}
            className="opacity-50 hover:opacity-100 transition-opacity hover:rotate-180 transform duration-500"
          >
            {theme === "prana-dark-textured" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button className="border border-[var(--accent)] text-[var(--accent)] px-4 py-2 rounded-lg hover:bg-[var(--accent)] hover:text-black transition-all text-sm font-bold active:scale-95 transform">
            Login
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse"></div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-5xl"
        >
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold tracking-wider uppercase mb-4 cursor-default">
              <Zap className="w-3 h-3" /> Sistema Operacional Neural
            </div>
          </div>

          <h1 className="text-5xl md:text-8xl font-bold mb-6 serif-font leading-tight">
            O Fim da Ansiedade <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-orange-200 text-glow">
              Organizacional
            </span>
          </h1>

          <p className="text-lg md:text-xl opacity-70 max-w-2xl mx-auto mb-6 leading-relaxed">
            Não gerencie apenas seu tempo. Gerencie sua <span className="text-[var(--accent)]">energia vital</span>. O Prana é um
            Santuário Digital que converte check-ins de energia, humores e tarefas em um ecossistema vivo de foco, rituais e clareza.
          </p>

          <p className="text-sm md:text-base opacity-60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Enquanto outros apps empilham listas, o Prana lê seu estado interno, ativa Biomas de produtividade (Água, Terra, Fogo,
            Ar, Éter) e te acompanha do caos etéreo à manifestação concreta — sem violentar seus ritmos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <button className="glow-button px-8 py-4 rounded-xl text-lg flex items-center gap-2 group">
              Começar pelo Bioma certo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* --- LIVE DEMO (SIMULAÇÃO VIVA) --- */}
          <motion.div
            id="demo"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-full aspect-video max-h-[600px] glass-panel rounded-xl border border-[var(--accent)]/20 shadow-2xl overflow-hidden relative mx-auto"
          >
            <LiveDemo />
          </motion.div>
        </motion.div>
      </section>

      {/* --- FEATURES (O QUE O PRANA É E FAZ) --- */}
      <section id="manifesto" className="py-32 px-6 bg-black/10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center md:text-left max-w-3xl">
            <p className="text-xs mono-font tracking-[0.3em] uppercase text-[var(--accent)]/80 mb-4">
              O que é o Prana 3.0
            </p>
            <h2 className="text-3xl md:text-5xl serif-font mb-6">Motor Bio‑Digital Regenerativo</h2>
            <p className="opacity-60 text-lg leading-relaxed">
              O Prana é um Sistema Operacional de Consciência para makers, criadores e times sensíveis. Ele conecta check-ins de
              energia, humores, rituais, tarefas e ciclos em um único Santuário Neural, guiando você por Biomas de produtividade
              que respeitam corpo, mente e propósito.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card glass-panel p-8 rounded-2xl cursor-pointer group transition-all duration-500 hover:-translate-y-2">
               <div className="mb-6 p-4 bg-black/20 rounded-xl inline-block group-hover:bg-[var(--accent)]/10 transition-colors">
                 <IconSankalpa className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">Sankalpa (Intenção Viva)</h3>
              <p className="opacity-60 leading-relaxed">
                Você declara um Sankalpa — a intenção raiz do ciclo atual. O Prana organiza projetos, tarefas e rituais ao redor
                disso, para que cada ação diária esteja alinhada com o que sua alma realmente quer manifestar.
              </p>
            </div>
            <div className="feature-card glass-panel p-8 rounded-2xl cursor-pointer group transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6 p-4 bg-black/20 rounded-xl inline-block group-hover:bg-[var(--accent)]/10 transition-colors">
                <IconCronos className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">Cronos (Ciclos & Ritmos)</h3>
              <p className="opacity-60 leading-relaxed">
                Check-ins de energia, ciclos lunares, menstrual e calendário são cruzados para saber quando empurrar, quando
                acolher e quando descansar. A produtividade deixa de ser reta e passa a ser orgânica.
              </p>
            </div>
            <div className="feature-card glass-panel p-8 rounded-2xl cursor-pointer group transition-all duration-500 hover:-translate-y-2">
              <div className="mb-6 p-4 bg-black/20 rounded-xl inline-block group-hover:bg-[var(--accent)]/10 transition-colors">
                <IconNeural className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold mb-3 group-hover:text-[var(--accent)] transition-colors">Neural (Ash & Biomas)</h3>
              <p className="opacity-60 leading-relaxed">
                A camada neural (Ash) lê seus registros e ativa Biomas como Nascente, Floresta, Sertão, Ventos e Cosmos. Cada
                ambiente tem um Animal‑Guia, um clima emocional e microanimações que te colocam no estado certo para cada tipo de
                trabalho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PLANOS (A JORNADA) --- */}
      <section id="planos" className="py-32 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-5xl serif-font mb-6">Escolha sua Jornada</h2>
          <p className="opacity-60 text-lg">Do plantio da semente à floresta completa.</p>
        </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Plano Semente */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-gray-500 hover:border-[var(--accent)] transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <Sprout className="w-6 h-6 opacity-50" />
              <h3 className="text-xl font-bold mono-font">Semente</h3>
            </div>
            <div className="text-3xl font-bold serif-font mb-6">Gratuito</div>
            <ul className="space-y-3 mb-8 flex-1 opacity-70 text-sm text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> 3 Projetos Ativos
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Dashboard Diário
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Histórico de 7 dias
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 font-bold transition-colors">
              Começar
            </button>
          </div>

          {/* Plano Jardim (Destaque) */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-[var(--accent)] shadow-[0_0_30px_rgba(217,119,6,0.15)] transform md:-translate-y-4 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[var(--accent)] text-black text-xs font-bold px-3 py-1 rounded-bl-lg">
              MAIS POPULAR
            </div>
            <div className="flex items-center gap-3 mb-4">
              <Sun className="w-6 h-6 text-[var(--accent)]" />
              <h3 className="text-xl font-bold mono-font text-[var(--accent)]">Jardim</h3>
            </div>
            <div className="text-3xl font-bold serif-font mb-6">
              R$ 29<span className="text-sm opacity-50 font-sans">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1 text-sm text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Projetos Ilimitados
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Prana AI (Geração de Tarefas)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Ciclos Lunares (Cronos)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Integração Calendar
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg bg-[var(--accent)] text-black font-bold hover:brightness-110 transition-all shadow-lg">
              Cultivar Agora
            </button>
          </div>

          {/* Plano Floresta */}
          <div className="glass-panel p-8 rounded-2xl border-t-4 border-emerald-700 hover:border-[var(--accent)] transition-all duration-300 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <Mountain className="w-6 h-6 opacity-50" />
              <h3 className="text-xl font-bold mono-font">Floresta</h3>
            </div>
            <div className="text-3xl font-bold serif-font mb-6">
              R$ 89<span className="text-sm opacity-50 font-sans">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 flex-1 opacity-70 text-sm text-left">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Tudo do Jardim
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Colaboração (Teams)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> Coletivo (Wiki)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" /> API de Acesso
              </li>
            </ul>
            <button className="w-full py-3 rounded-lg border border-white/20 hover:bg-white/5 font-bold transition-colors">
              Expandir
            </button>
          </div>
        </div>
      </section>

      {/* --- MANIFESTO / FOOTER --- */}
      <section className="py-20 px-6 border-t border-white/10 text-center bg-black/20 backdrop-blur-lg">
        <PranaLogo className="w-16 h-16 mx-auto mb-8 opacity-50 hover:opacity-100 hover:scale-110 transition-all duration-500 cursor-pointer" />
        <h2 className="text-2xl serif-font mb-8 italic">"A organização é a anatomia da manifestação."</h2>
        <div className="flex justify-center gap-8 text-sm mono-font opacity-50">
          <a href="#" className="hover:text-[var(--accent)] hover:underline transition-all">
            Twitter
          </a>
          <a href="#" className="hover:text-[var(--accent)] hover:underline transition-all">
            Instagram
          </a>
          <a href="#" className="hover:text-[var(--accent)] hover:underline transition-all">
            Discord
          </a>
        </div>
        <p className="mt-12 text-xs opacity-30">© 2025 Prana Inc. Todos os direitos reservados.</p>
      </section>
    </div>
  );
}
