/* src/site/pages/PlansPage.jsx
   desc: Página de Vendas v27.0 (Operacional + Visual Wabi-Sabi)
*/
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PlansFAQ from '../../components/PlansFAQ';

// === OPERACIONAL (Integração Backend) ===
import { useAuth } from '@/hooks/useAuth'; 
import LoginModal from '@/components/auth/LoginModal';

// === CONFIGURAÇÃO & LÓGICA ===
import { getAllPlansList, canUserAccess } from '../../config/plansConfig'; 
import PranaLogo from '../../components/ui/PranaLogo'; 

// === ÍCONES UI ===
import { IconFogo, IconLua, IconChat } from '../../components/icons/PranaLandscapeIcons';

// =============================================================================
// ENGINE PRANA LANDSCAPE (VISUAL - Mantido Original)
// =============================================================================

const IconBase = ({ children, className = '', ativo = false, spin = false, viewBox = "0 0 100 100", ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox={viewBox}
    style={{ color: 'var(--accent)', overflow: 'visible' }}
    className={`transition-all duration-700 ${ativo ? 'scale-110 drop-shadow-[0_0_10px_rgba(217,119,6,0.3)]' : 'opacity-70 grayscale-[50%]'} ${spin ? 'animate-spin-slow' : ''} ${className}`}
    {...props}
  >
    {children}
  </svg>
);

// === ARCANOS (Ícones dos Planos) ===
const IconPlanSeed = (props) => (
  <IconBase {...props}>
    <circle className={!props.ativo ? "animate-dash-slow" : ""} cx="50" cy="50" r="25" style={{ fill: "none", stroke: "currentColor", strokeWidth: 2, strokeDasharray: "4 4" }} />
    <circle cx="50" cy="50" r="6" style={{fill: "currentColor"}}/>
    <path d="M 50 75 V 85" style={{stroke: "currentColor", strokeWidth: 2}}/>
  </IconBase>
);

const IconPlanSpring = (props) => (
  <IconBase {...props}>
    <path className="animate-pulse-slow" d="M 30 70 Q 50 90, 70 70 T 110 70" style={{fill: "none", stroke: "currentColor", strokeWidth: 3}}/>
    <path d="M 20 50 Q 50 30, 80 50" style={{fill: "none", stroke: "currentColor", strokeWidth: 2, opacity: 0.6}}/>
    <circle cx="50" cy="30" r="4" style={{fill: "currentColor"}}/>
  </IconBase>
);

const IconPlanForest = (props) => (
  <IconBase {...props}>
    <path d="M 50 90 V 40" style={{stroke: "currentColor", strokeWidth: 3}}/>
    <path d="M 50 60 L 30 40" style={{stroke: "currentColor", strokeWidth: 2}}/>
    <path d="M 50 50 L 70 30" style={{stroke: "currentColor", strokeWidth: 2}}/>
    <circle cx="30" cy="40" r="3" style={{fill: "currentColor"}}/>
    <circle cx="70" cy="30" r="3" style={{fill: "currentColor"}}/>
    <circle className={props.ativo ? "animate-spin-slow" : ""} cx="50" cy="30" r="15" style={{fill: "none", stroke: "currentColor", strokeWidth: 1, strokeDasharray: "2 3"}}/>
  </IconBase>
);

const IconPlanEcosystem = (props) => (
  <IconBase {...props}>
    <path d="M 10 90 L 40 40 L 70 90" style={{fill: "none", stroke: "currentColor", strokeWidth: 2}}/>
    <path d="M 60 90 L 80 60 L 100 90" style={{fill: "none", stroke: "currentColor", strokeWidth: 2, opacity: 0.8}}/>
    <circle cx="75" cy="25" r="8" style={{fill: props.ativo ? "currentColor" : "none", stroke: "currentColor", strokeWidth: 2}}/>
    <path className="animate-dash" d="M 10 20 Q 50 10, 90 25" style={{fill: "none", stroke: "currentColor", strokeWidth: 1, strokeDasharray: "4 4", opacity: 0.5}}/>
    <path d="M 30 90 C 40 80, 60 80, 70 90" style={{stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round"}}/>
  </IconBase>
);

// === CONSTANTES VISUAIS ===
const BG_IMAGE_URL = "https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/sign/Prana/hanxiao-xu-Cc4ypLTqQbg-unsplash.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8xZGEwNzJmMS03YmYxLTQ0N2MtOGRlZS1mZjI4ZWMzYTZmMTciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQcmFuYS9oYW54aWFvLXh1LUNjNHlwTFRxUWJnLXVuc3BsYXNoLmpwZyIsImlhdCI6MTc2ODI1MjAyMiwiZXhwIjoxNzk5Nzg4MDIyfQ.ndwBILIAMJR5HH4rACWnGKMZ0EdCoBaemZhjdXXEGAA";

const ZenIcon = ({ path, className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {path}
  </svg>
);

const Icons = {
  Check: <path d="M20 6L9 17L4 12" />,
  ArrowRight: <path d="M5 12h14M12 5l7 7-7 7" />,
  Star: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />,
  ChevronRight: <path d="M9 18l6-6-6-6" />
};

const getArcanaIcon = (arcanaKey, active, className) => {
  const props = { className, ativo: active };
  switch (arcanaKey) {
    case 'THE_SEED': return <IconPlanSeed {...props} />;
    case 'THE_RIVER': return <IconPlanSpring {...props} />;
    case 'THE_FOREST': return <IconPlanForest {...props} />;
    case 'THE_ECOSSISTEM': return <IconPlanEcosystem {...props} />; 
    default: return <IconPlanEcosystem {...props} />;
  }
};

// === DIAGRAMA DE EVOLUÇÃO ===
const EvolutionTimeline = ({ activeStage, setActiveStage }) => {
    const stages = [
        { id: "SEED", label: "Semente", sub: "Dados Isolados", icon: <IconPlanSeed viewBox="0 0 100 100" className="w-full h-full"/> },
        { id: "FLUX", label: "Nascente", sub: "+ Tempo", icon: <IconPlanSpring viewBox="0 0 100 100" className="w-full h-full"/> },
        { id: "FOREST", label: "Floresta", sub: "+ Fluxo", icon: <IconPlanForest viewBox="0 0 100 100" className="w-full h-full"/> },
        { id: "ECOSSISTEM", label: "Ecossistema", sub: "+ Energia", icon: <IconPlanEcosystem viewBox="0 0 100 100" className="w-full h-full"/> }
    ];

    return (
        <div className="w-full py-16 px-4 relative">
            <div className="absolute top-[60px] left-[5%] right-[5%] h-1 bg-[var(--glass-border)] z-0 rounded-full overflow-hidden">
                 <div className="absolute top-0 left-0 h-full bg-[var(--accent)] opacity-20 w-full" />
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 text-[var(--glass-border)]">
                    <ZenIcon path={Icons.ChevronRight} className="w-6 h-6 opacity-50" />
                 </div>
            </div>

            <div className="grid grid-cols-4 gap-4 relative z-10">
                {stages.map((stage, i) => {
                    const isActive = activeStage === stage.id;
                    return (
                        <div 
                            key={stage.id} 
                            className="flex flex-col items-center cursor-pointer group"
                            onMouseEnter={() => setActiveStage(stage.id)}
                            onClick={() => setActiveStage(stage.id)}
                        >
                            <div className={`w-20 h-20 rounded-full border-2 mb-6 flex items-center justify-center transition-all duration-500 bg-[var(--bg-color)] relative ${isActive ? 'border-[var(--accent)] scale-110 shadow-[0_0_30px_-5px_rgba(217,119,6,0.4)]' : 'border-[var(--glass-border)] group-hover:border-[var(--text-secondary)] grayscale'}`}>
                                <div className="w-12 h-12 text-[var(--accent)]">
                                    {stage.icon}
                                </div>
                                <div className={`absolute -bottom-3 w-2 h-2 rounded-full ${isActive ? 'bg-[var(--accent)]' : 'bg-[var(--glass-border)]'}`} />
                            </div>

                            <h4 className={`serif-font text-lg transition-colors ${isActive ? 'text-[var(--text-primary)] scale-105' : 'text-[var(--text-secondary)]'}`}>{stage.label}</h4>
                            <p className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)] opacity-80 mt-2">{stage.sub}</p>
                        </div>
                    );
                })}
            </div>
            <div className="flex justify-between w-full px-8 mt-4 text-[10px] mono-font text-[var(--text-secondary)] opacity-40 uppercase tracking-widest">
                <span>Menos Agência</span>Menos Ferramentas
                <span>Mais Agência </span>Mais Ferramentas
            </div>
        </div>
    );
};

// === SHOWCASE INTERATIVO ===
const AshInteractionShowcase = ({ activeStage }) => {
    const messages = {
        SEED: { 
            title: "Modo Passivo", 
            body: null, 
            caption: "O Ash aguarda você. Se esquecer algo, o sistema permanece em silêncio.",
            tag: "Sem Notificações"
        },
        FLUX: { 
            title: "Guardião do Tempo", 
            body: "Percebo que 3 ciclos de ontem ficaram abertos. Isso cria ruído mental. Quer trazer tudo para hoje?", 
            caption: "O Ash monitora prazos. Ele impede que o passado se acumule.",
            tag: "Notificação de Atraso"
        },
        FOREST: { 
            title: "Gerente de Fluxo", 
            body: "O projeto 'Livro' não tem movimento há 7 dias. O silêncio significa que a prioridade mudou ou precisamos destravar algo?", 
            caption: "O Ash monitora a estagnação. Ele recomenda decisões para a energia fluir.",
            tag: "Notificação de Estagnação"
        },
        ECOSSISTEM: { 
            title: "Guia Vital", 
            body: "Sua energia está introspectiva (Lua Minguante), mas a lista tem tarefas de densas. Sugiro mover 'Relatório' para amanhã de manhã.", 
            caption: "O Ash cruza dados biológicos com tarefas para proteger sua saúde.",
            tag: "Proteção Energética"
        }
    };
    const current = messages[activeStage];

    return (
        <div className="max-w-3xl mx-auto mt-8 mb-20">
             <div className="glass-card rounded-2xl border border-[var(--glass-border)] p-1 overflow-hidden relative">
                <div className="h-10 border-b border-[var(--glass-border)] bg-[var(--glass-bg)]/50 flex items-center px-4 gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/20"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/20"></div>
                    <div className="mx-auto text-[10px] mono-font opacity-40 uppercase tracking-widest">Prana OS • Ash Link</div>
                </div>
                <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center">
                    <div className="shrink-0 relative">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-[var(--bg-color)] border border-[var(--glass-border)] transition-all duration-500 ${current.body ? 'shadow-[0_0_30px_-5px_rgba(217,119,6,0.3)] border-[var(--accent)]' : 'grayscale opacity-50'}`}>
                             <IconChat className={`w-8 h-8 text-[var(--accent)] ${current.body ? 'animate-pulse' : ''}`} />
                        </div>
                    </div>
                    <div className="flex-1 text-left">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] mono-font uppercase tracking-widest text-[var(--accent)]">{current.title}</span>
                            <span className="text-[9px] px-2 py-0.5 rounded bg-[var(--text-secondary)]/10 text-[var(--text-secondary)]">{current.tag}</span>
                        </div>
                        <AnimatePresence mode="wait">
                            <motion.div key={activeStage} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                                {current.body ? (
                                    <div className="bg-[var(--glass-border)]/10 p-4 rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm border border-[var(--glass-border)]">
                                        <p className="serif-font text-lg text-[var(--text-primary)] leading-relaxed">"{current.body}"</p>
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed border-[var(--glass-border)] rounded-xl opacity-50">
                                        <p className="mono-font text-xs text-[var(--text-secondary)] text-center">[ Nenhuma mensagem gerada neste nível ]</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                        <p className="mt-4 text-xs text-[var(--text-secondary)] opacity-70 border-l-2 border-[var(--glass-border)] pl-3 italic">{current.caption}</p>
                    </div>
                </div>
             </div>
        </div>
    );
};

// === MATRIZ DE PRESENÇA ===
const AshPresenceMatrix = () => {
  const levels = [
    { label: "Semente", ash: "Observa", action: "—", care: "—", self: "100%" },
    { label: "Nascente", ash: "Observa", action: "Organiza", care: "—", self: "60%" },
    { label: "Floresta", ash: "Sugere", action: "Age", care: "—", self: "30%" },
    { label: "Ecossistema", ash: "Antecipa", action: "Age", care: "Cuida", self: "10%" },
  ];

  return (
    <div className="w-full mb-20 overflow-hidden rounded-2xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-sm">
       <div className="grid grid-cols-5 text-center py-6 border-b border-[var(--glass-border)] bg-[var(--accent)]/5">
          <div className="text-[10px] mono-font uppercase tracking-widest opacity-50 self-center">Nível de Consciência</div>
          {levels.map((l, i) => (
             <div key={i} className="text-xs serif-font font-bold text-[var(--text-primary)] tracking-wide">{l.label}</div>
          ))}
       </div>
       
       <div className="grid grid-cols-5 text-center py-5 border-b border-[var(--glass-border)] hover:bg-[var(--glass-card)] transition-colors">
          <div className="text-xs text-[var(--text-secondary)] self-center pl-4 text-left">Percepção do Ash</div>
          {levels.map((l, i) => (
             <div key={i} className={`text-sm ${l.ash === 'Antecipa' ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-primary)]'}`}>{l.ash}</div>
          ))}
       </div>

       <div className="grid grid-cols-5 text-center py-5 border-b border-[var(--glass-border)] hover:bg-[var(--glass-card)] transition-colors">
          <div className="text-xs text-[var(--text-secondary)] self-center pl-4 text-left">Intervenção</div>
          {levels.map((l, i) => (
             <div key={i} className={`text-sm ${l.action === 'Age' ? 'text-[var(--accent)] font-bold' : (l.action === '—' ? 'opacity-20' : 'text-[var(--text-primary)]')}`}>{l.action}</div>
          ))}
       </div>

       <div className="grid grid-cols-5 text-center py-5 bg-[var(--bg-color)]/30">
          <div className="text-xs text-[var(--text-secondary)] self-center pl-4 text-left">Carga sobre você</div>
          {levels.map((l, i) => (
             <div key={i} className="text-xs mono-font opacity-60">{l.self}</div>
          ))}
       </div>
    </div>
  );
};

// === COMPONENTE PRINCIPAL (Page) ===
const PlansPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Hook de Autenticação
  const plans = getAllPlansList();
  
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [theme, setTheme] = useState("prana-dark-textured");
  const [activeStage, setActiveStage] = useState('FLUX');

  // Estados para o Modal de Login
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [intendedPlan, setIntendedPlan] = useState('SEED');

  const toggleTheme = () => {
    setTheme(prev => prev === "prana-dark-textured" ? "prana-light-textured" : "prana-dark-textured");
  };

  // === LÓGICA OPERACIONAL DE VENDAS ===
  const handleSelectPlan = (plan) => {
    // 1. Se for o plano GRATUITO
    if (plan.key === 'SEED') {
        if (user) {
            navigate('/dashboard'); // Já tem conta, vai pro app
        } else {
            setIntendedPlan('SEED'); // Marca intenção
            setAuthModalOpen(true);  // Abre registro
        }
        return;
    }

    // 2. Se for PLANO PAGO e usuário LOGADO -> Checkout direto
    if (user) {
        navigate(`/checkout?plan=${plan.key}`);
    } 
    // 3. Se for PLANO PAGO e usuário DESLOGADO -> Registro -> Checkout
    else {
        setIntendedPlan(plan.key); // Salva o plano que ele queria
        setAuthModalOpen(true);    // Abre registro (o modal vai redirecionar pro checkout depois)
    }
  };

  const handleFreeTrial = () => {
    // Atalho para testar: cria conta free (que pode ter trial ativado no backend futuramente)
    if (user) navigate('/dashboard');
    else {
        setIntendedPlan('SEED');
        setAuthModalOpen(true);
    }
  };

  return (
    <div
      className={`min-h-screen w-full font-sans selection:bg-[var(--accent)]/30 ${theme}`}
      data-theme={theme}
      style={{
          backgroundColor: 'var(--bg-color)',
          color: 'var(--text-primary)'
      }}
    >
      {/* ... ESTILOS GLOBAIS ... */}
      <style>{`
        :root, [data-theme='prana-dark-textured'] {
          --accent-rgb: 217, 119, 6; 
          --accent: rgb(var(--accent-rgb)); 
          --bg-color: #0c0a09; 
          --text-primary: #ffffff; 
          --text-secondary: #a8a29e;
          --glass-border: rgba(255, 255, 255, 0.08); 
          --glass-bg: rgba(10, 10, 10, 0.7);
          --glass-card: rgba(0, 0, 0, 0.6); 
        }
        [data-theme='prana-light-textured'] {
          --bg-color: #f5f5f0; 
          --text-primary: #1c1917; 
          --text-secondary: #57534e; 
          --accent-rgb: 217, 119, 6; 
          --accent: rgb(var(--accent-rgb));
          --glass-border: rgba(0, 0, 0, 0.06);
          --glass-bg: rgba(255, 255, 255, 0.85);
          --glass-card: rgba(255, 255, 255, 0.7);
        }
        .serif-font { font-family: 'Vollkorn', 'Merriweather', serif; }
        .mono-font { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        
        .glass-card {
            background-color: var(--glass-card);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid var(--glass-border);
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        }
        
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 30s linear infinite; }

        @keyframes dash { to { stroke-dashoffset: -20; } }
        .animate-dash { stroke-dasharray: 4 4; animation: dash 10s linear infinite; }
        .animate-dash-slow { stroke-dasharray: 6 4; animation: dash 20s linear infinite; }
        
        @keyframes pulse-slow { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: var(--text-secondary); opacity: 0.3; border-radius: 4px; }
      `}</style>

      {/* BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{ 
              backgroundImage: `url(${BG_IMAGE_URL})`,
              opacity: theme.includes('dark') ? 0.25 : 0.4, 
              filter: theme.includes('dark') ? 'grayscale(100%) contrast(1.2) brightness(0.6)' : 'grayscale(100%) opacity(0.5)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-color)] via-transparent to-[var(--bg-color)]" />
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-[var(--glass-border)] bg-[var(--bg-color)]/80 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
                <div className="text-[var(--accent)] flex items-center justify-center">
                    <PranaLogo className="w-8 h-8 fill-current text-[var(--accent)]" /> 
                </div>
                <span className="serif-font text-xl tracking-tight hidden sm:block font-bold text-[var(--text-primary)]">Prana</span>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex gap-8 text-xs font-medium uppercase tracking-widest text-[var(--text-secondary)] items-center">
                    <a href="#plans" className="hover:text-[var(--text-primary)] transition-colors">Biomas</a>
                    <a href="#evolution" className="hover:text-[var(--text-primary)] transition-colors">Evolução</a>
                </div>
                <div className="flex items-center gap-4 border-l border-[var(--glass-border)] pl-4 ml-2">
                    <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-[var(--glass-border)] text-[var(--text-secondary)] transition-colors">
                        {theme.includes('light') ? <IconLua className="w-4 h-4" /> : <IconFogo className="w-4 h-4" />}
                    </button>
                    {/* Botão de Trial */}
                    <button onClick={() => handleSelectPlan({key: 'TRUNK'})} className="px-5 py-2 rounded-lg bg-[var(--accent)] text-white text-[10px] font-bold uppercase tracking-widest hover:opacity-90 hover:scale-105 transition-all shadow-lg">
                        Começar Agora
                    </button>
                </div>
            </div>
        </div>
      </nav>

      <main className="relative z-10 pt-48 pb-32 px-6 md:px-12 max-w-[1400px] mx-auto">
        
        {/* HERO SECTION (Wabi-Sabi) */}
        <div className="text-center mb-48 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}>
            
            <span className="mono-font text-[10px] uppercase tracking-[0.4em] text-[var(--accent)] mb-8 block opacity-80">
                Arquitetura de Consciência
            </span>
            
            <h1 className="text-5xl md:text-8xl serif-font mb-12 leading-[1.1] tracking-tighter text-[var(--text-primary)] font-light">
              Escolha sua <br/>
              <span className="italic opacity-60">Assinatura</span>
            </h1>
            
            <div className="max-w-xl mx-auto mb-16 relative">
                 <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--accent)] opacity-30"></div>
                 <p className="serif-font italic text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed pl-6 text-left">
                    "Os planos do Prana não definem apenas funções.<br/>
                    Eles definem <span className="text-[var(--accent)] font-normal">até onde o sistema carrega o peso por você</span>."
                </p>
            </div>

            {/* Toggle Mensal/Anual */}
            <div className="inline-flex items-center p-1 rounded-full border border-[var(--glass-border)] bg-[var(--glass-card)] backdrop-blur-md">
              <button onClick={() => setBillingCycle('monthly')} className={`px-8 py-2 rounded-full text-[10px] mono-font uppercase tracking-widest transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}>Mensal</button>
              <button onClick={() => setBillingCycle('yearly')} className={`px-8 py-2 rounded-full text-[10px] mono-font uppercase tracking-widest transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-[var(--accent)] text-white shadow-md' : 'text-[var(--text-secondary)] hover:text-white'}`}>Anual <span className="ml-1 opacity-80">-20%</span></button>
            </div>
          </motion.div>
        </div>

        {/* 4. CARDS GRID (BIOMAS) */}
        <div id="plans" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-48 items-start">
          {plans.map((plan, idx) => (
            <PlanCard key={plan.key} plan={plan} index={idx} billingCycle={billingCycle} onSelect={handleSelectPlan}/>
          ))}
        </div>

        {/* 5. EVOLUÇÃO & INTERAÇÃO (DIAGRAMA + CHAT + MATRIX) */}
        <motion.section id="evolution" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="max-w-[1200px] mx-auto relative mb-48">
          
          <div className="mb-20 text-center">
            <h2 className="text-4xl serif-font mb-4 text-[var(--text-primary)]">Mapa de Evolução</h2>
            <p className="text-xs mono-font text-[var(--accent)] uppercase tracking-widest opacity-80">Do caos à autonomia. Passe o mouse para ver.</p>
          </div>

          {/* DIAGRAMA LINEAR (CONTROLADOR) */}
          <EvolutionTimeline activeStage={activeStage} setActiveStage={setActiveStage} />

          {/* SHOWCASE INTERATIVO (O RESULTADO VISUAL) */}
          <AshInteractionShowcase activeStage={activeStage} />
          
          {/* MATRIZ DE PRESENÇA (A TABELA COMPARATIVA LÓGICA) */}
          <AshPresenceMatrix />

          {/* CTAs de Reforço */}
          <div className="flex justify-center gap-6 mt-24">
              <button onClick={() => handleSelectPlan(plans[1])} className="px-8 py-4 rounded-lg bg-[var(--glass-card)] border border-[var(--glass-border)] hover:border-[var(--accent)] text-xs uppercase tracking-widest transition-all text-[var(--text-primary)]">
                  Começar com Tempo
              </button>
              <button onClick={() => handleSelectPlan(plans[3])} className="px-8 py-4 rounded-lg bg-[var(--accent)] text-white shadow-[0_10px_40px_-10px_rgba(217,119,6,0.3)] hover:scale-105 text-xs uppercase tracking-widest transition-all">
                  Restaurar Energia
              </button>
          </div>

        </motion.section>

        {/* 6. TABELA TÉCNICA */}
        <motion.section id="comparison" className="max-w-[1200px] mx-auto relative mb-32 opacity-80 hover:opacity-100 transition-opacity duration-700">
          <div className="mb-12 text-center">
             <h3 className="text-lg serif-font text-[var(--text-secondary)]">Especificações Técnicas</h3>
             <div className="w-12 h-px bg-[var(--accent)] mx-auto mt-4 opacity-30"></div>
          </div>

          <div className="overflow-x-auto custom-scrollbar pb-8">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr>
                  <th className="p-6 pl-0 text-xs mono-font text-[var(--text-secondary)] uppercase w-1/3 font-normal opacity-50 border-b border-[var(--glass-border)]">Recurso</th>
                  {plans.map(p => (
                    <th key={p.key} className="p-6 text-center min-w-[140px] border-b border-[var(--glass-border)]">
                      <span className={`serif-font text-lg block ${p.recommended ? 'text-[var(--accent)]' : 'text-[var(--text-secondary)]'}`}>{p.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-sans text-sm text-[var(--text-primary)]">
                <TableGroupHeader title="Proatividade & Consciência (Ash)" />
                <TableRow label="Interação Reativa (Chat)" plans={plans} render={(p) => <ZenIcon path={Icons.Check} className="w-4 h-4 mx-auto text-[var(--accent)]"/>} />
                <TableRow label="Alertas de Tempo (Prazos)" plans={plans} render={(p) => checkAccess(p.key, 'proactive_time')} />
                <TableRow label="Gestão de Fluxo (Estagnação)" plans={plans} render={(p) => checkAccess(p.key, 'proactive_flow')} />
                <TableRow label="Proteção de Energia Vital" plans={plans} render={(p) => checkAccess(p.key, 'proactive_energy')} />
                
                <TableGroupHeader title="Estrutura & Ferramentas" />
                <TableRow label="Listas & Inbox" plans={plans} render={() => <ZenIcon path={Icons.Check} className="w-4 h-4 mx-auto text-[var(--accent)]"/>} />
                <TableRow label="Timeline (Planner)" plans={plans} render={(p) => checkAccess(p.key, 'view_planner')} />
                <TableRow label="Visão Dependências (Nexus)" plans={plans} render={(p) => checkAccess(p.key, 'view_nexus')} />
                <TableRow label="Ambiente Dev (TaskCode)" plans={plans} render={(p) => checkAccess(p.key, 'task_code')} />
                
                <TableGroupHeader title="Vitalidade" />
                <TableRow label="Match Energético" plans={plans} render={(p) => checkAccess(p.key, 'energy_match')} />
                <TableRow label="Astrologia" plans={plans} render={(p) => checkAccess(p.key, 'astrology')} />
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* 7. CONFRONTO FINAL */}
        <section className="max-w-[700px] mx-auto py-32 text-center relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--accent)] opacity-5 blur-[120px] rounded-full pointer-events-none" />
            
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h3 className="serif-font text-3xl md:text-5xl text-[var(--text-primary)] leading-tight mb-8">
                    "Se o Ash não pode agir,<br/>
                    o peso continua sendo <span className="italic text-[var(--accent)]">seu</span>."
                </h3>
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mt-8 text-xs mono-font uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors border-b border-transparent hover:border-[var(--accent)] pb-1">
                    Escolha seu nível de liberdade
                </button>
            </motion.div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-[900px] mx-auto mt-20 pt-20 border-t border-[var(--glass-border)] mb-32">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl serif-font mb-12 text-center">Perguntas Frequentes</h2>
            <PlansFAQ />
          </motion.div>
        </section>

        {/* FOOTER */}
        <footer className="border-t border-[var(--glass-border)] pt-16 pb-16 text-center bg-[var(--bg-color)]">
            <div className="mb-8 flex justify-center opacity-50 grayscale hover:grayscale-0 transition-all">
                <PranaLogo className="w-8 h-8 text-[var(--accent)]" />
            </div>
            <div className="flex justify-center gap-8 mb-8 text-[10px] mono-font uppercase tracking-widest text-[var(--text-secondary)]">
                <a href="#" className="hover:text-[var(--text-primary)]">Manifesto</a>
                <a href="#" className="hover:text-[var(--text-primary)]">Privacidade</a>
                <a href="/auth" className="hover:text-[var(--text-primary)]">Login</a>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] opacity-40">
                © 2025 Prana OS. Arquitetura de Consciência.
            </p>
        </footer>

      </main>

      {/* === MODAL DE LOGIN INJETADO AQUI === */}
      <LoginModal 
         isOpen={authModalOpen} 
         onClose={() => setAuthModalOpen(false)}
         intendedPlan={intendedPlan} // O "segredo" operacional
      />

    </div>
  );
};

// === COMPONENTES VISUAIS AUXILIARES (Tabela e Cards) ===

const TableGroupHeader = ({ title }) => (
  <tr><td colSpan={5} className="pt-12 pb-4 pl-0 text-[10px] mono-font uppercase tracking-[0.2em] opacity-60" style={{ color: 'var(--accent)' }}>{title}</td></tr>
);

const TableRow = ({ label, plans, render }) => (
  <tr className="transition-colors duration-300 hover:bg-[var(--glass-border)]">
    <td className="p-4 pl-0 text-[var(--text-secondary)] font-light border-b border-[var(--glass-border)] hover:text-[var(--text-primary)] transition-colors">{label}</td>
    {plans.map(p => <td key={p.key} className="p-4 text-center border-b border-[var(--glass-border)]">{render(p)}</td>)}
  </tr>
);

const checkAccess = (planKey, featureKey) => {
    return canUserAccess(planKey, featureKey) ? 
        <div className="flex justify-center"><ZenIcon path={Icons.Check} className="w-4 h-4 text-[var(--accent)] opacity-90" /></div> : 
        <span className="text-[var(--text-secondary)] text-xs mx-auto block opacity-20">—</span>;
};

const PlanCard = ({ plan, index, billingCycle, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isRecommended = plan.recommended;
  const isOneTime = plan.isOneTime;
  
  let displayPrice = isOneTime ? plan.price.yearly : (billingCycle === 'yearly' ? Math.floor(plan.price.yearly / 12) : plan.price.monthly);
  let period = isOneTime ? 'único' : (billingCycle === 'yearly' ? '/mês' : '/mês');
  const priceLabel = displayPrice === 0 ? "0" : displayPrice;
  const isActive = isHovered || isRecommended;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.8 }}
      className={`glass-card relative flex flex-col h-full p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 group hover:border-[var(--text-secondary)]/30 ${isRecommended ? 'ring-1 ring-[var(--accent)]/40 bg-[var(--accent)]/5' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isRecommended && <div className="absolute top-4 right-4"><ZenIcon path={Icons.Star} className="w-4 h-4 text-[var(--accent)]" /></div>}

      <div className="mb-8 relative z-10 flex justify-center">
        <div className={`relative w-16 h-16 flex items-center justify-center transition-all duration-700 ${isActive ? 'scale-110' : ''}`}>
           <div className={`absolute inset-0 bg-[var(--accent)]/10 blur-xl rounded-full transition-opacity duration-700 ${isActive ? 'opacity-60' : 'opacity-0'}`} />
           {getArcanaIcon(plan.identity.arcana, isActive, "w-full h-full")}
        </div>
      </div>

      <h3 className="text-xl serif-font mb-2 tracking-tight text-center text-[var(--text-primary)] uppercase tracking-[0.1em]">{plan.name}</h3>
      <p className="text-[9px] mono-font text-[var(--accent)] uppercase tracking-[0.2em] mb-6 opacity-90 text-center">{plan.motivation}</p>
      <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed h-12 line-clamp-2 text-center mb-6">{plan.description}</p>

      <div className="mb-8 pt-6 border-t border-[var(--glass-border)] flex flex-col items-center">
        <div className="flex items-baseline gap-1">
            {displayPrice !== 0 && <span className="text-xs serif-font text-[var(--text-secondary)] opacity-70">R$</span>}
            <span className="text-5xl font-light tracking-tighter serif-font text-[var(--text-primary)]">{priceLabel}</span>
        </div>
        <div className="text-[10px] mono-font text-[var(--text-secondary)] mt-2 uppercase tracking-wide opacity-60">{period}</div>
      </div>

      <ul className="space-y-3 mb-10 flex-grow">
        {plan.features.map((feat, i) => (
          <li key={i} className={`flex items-start gap-3 text-sm font-light tracking-wide ${feat.included ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-40 line-through'}`}>
            <div className="mt-1.5 shrink-0">
               {feat.included ? <div className="w-1 h-1 rounded-full bg-[var(--accent)]" /> : <div className="w-1 h-1 rounded-full border border-[var(--text-secondary)] opacity-50" />}
            </div>
            <span className={feat.text.includes('Dev') ? 'text-[var(--accent)] font-normal' : ''}>{feat.text}</span>
          </li>
        ))}
      </ul>

      <button onClick={() => onSelect(plan)} className="w-full py-4 text-xs mono-font uppercase tracking-[0.2em] flex items-center justify-center gap-3 rounded-lg transition-all duration-300 group" style={isRecommended ? { backgroundColor: 'var(--accent)', color: '#fff', boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.2)' } : { border: '1px solid var(--glass-border)', color: 'var(--text-primary)', backgroundColor: 'transparent' }}>
        <span className={!isRecommended ? "opacity-70 group-hover:opacity-100" : ""}>{plan.cta}</span>
        <ZenIcon path={Icons.ArrowRight} className={`w-3 h-3 transition-transform duration-300 group-hover:translate-x-1 ${isRecommended ? 'opacity-90' : 'opacity-50'}`} />
      </button>
    </motion.div>
  );
};

export default PlansPage;