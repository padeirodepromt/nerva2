// src/site/pages/PranaSanctuary.jsx

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, CheckCircle, X, ArrowRight, 
  Menu, Play, Pause, Terminal, Zap, Battery, LayoutGrid, Search
} from "lucide-react"; 

// Importação dos ícones do sistema para identidade visual
import { 
  IconSankalpa, IconNeural, IconCronos, IconFlux, 
  IconZap, IconVoid, IconDiario, IconFogo, IconChat, IconLayers,
  IconFolder, IconFeather
} from "../../components/icons/PranaLandscapeIcons";

// --- CORREÇÃO DE CAMINHO AQUI (Apontando para src/data) ---
import { MENU_DATA, ASH_SCRIPTS, COMPARISON_DATA, PLANS_DATA } from "../../data/landing-content";
import PranaLogo from "../../components/PranaLogo";

// Mapeamento de Ícones para Dados Dinâmicos
const ICON_MAP = {
  IconSankalpa, IconNeural, IconCronos, IconFlux, 
  IconZap, IconVoid, IconDiario, IconFogo, IconChat, IconLayers
};

// ==========================================
// COMPONENTES DE UI DA LANDING PAGE
// ==========================================

const SanctuaryHeader = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#0c0a09]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer opacity-90 hover:opacity-100 transition-opacity" onClick={() => window.scrollTo(0,0)}>
          <PranaLogo className="w-8 h-8 text-[var(--accent)]" />
          <span className="font-serif text-xl tracking-tight text-[#e6e1db] font-bold">Prana</span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Menu Funcionalidades */}
          <div className="relative group" onMouseEnter={() => setActiveMenu('features')} onMouseLeave={() => setActiveMenu(null)}>
            <button className="flex items-center gap-1 text-sm font-medium text-[#a8a29e] hover:text-[var(--accent)] transition-colors py-6 outline-none">
              Funcionalidades <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
            <AnimatePresence>
              {activeMenu === 'features' && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-14 left-0 w-[600px] bg-[#1a1816] border border-white/10 rounded-xl shadow-2xl p-6 grid grid-cols-2 gap-4 z-50"
                >
                  {MENU_DATA.features.items.map((item, i) => {
                    const Icon = ICON_MAP[item.iconName] || IconFlux;
                    return (
                      <div key={i} className="flex gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/item">
                        <div className={`mt-1 ${item.color}`}><Icon className="w-6 h-6" /></div>
                        <div>
                          <h4 className="text-[#e6e1db] font-bold text-sm group-hover/item:text-[var(--accent)] mb-1">{item.title}</h4>
                          <p className="text-[#a8a29e] text-xs leading-relaxed opacity-80">{item.desc}</p>
                        </div>
                      </div>
                    )
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a href="#pricing" className="text-sm font-medium text-[#a8a29e] hover:text-[var(--accent)] transition-colors">Planos</a>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="text-sm font-medium text-[#e6e1db] hover:text-white hidden sm:block">Login</button>
          <button className="px-5 py-2 bg-[#e6e1db] text-[#1a1816] text-sm font-bold rounded-full hover:bg-white transition-all shadow-lg">
            Entrar no Santuário
          </button>
        </div>
      </div>
    </header>
  );
};

// ==========================================
// O "MINI PRANA" (Ash Live Terminal)
// Réplica Visual Fiel do PranaWorkspaceLayout.jsx + Sidebar.jsx + SideChat.jsx
// ==========================================
const AshLiveTerminal = () => {
  // State da Simulação
  const [activeScript, setActiveScript] = useState(null);
  const [messages, setMessages] = useState([{ type: 'ash', text: "Olá. Aqui é o Ash. O que vamos organizar hoje?" }]);
  const [isTyping, setIsTyping] = useState(false);
  
  // State Visual do Workspace (Replica o Estado Real)
  const [projectTree, setProjectTree] = useState([
    { id: 'inbox', label: 'Inbox', icon: IconFlux },
    { id: 'planner', label: 'Planner', icon: IconCronos },
    { id: 'rituals', label: 'Rituais', icon: IconSankalpa }
  ]);
  const [energyLevel, setEnergyLevel] = useState(80);
  const [focusMode, setFocusMode] = useState(false);
  const [kanbanTasks, setKanbanTasks] = useState([
    { id: 1, title: "Lançamento Site", col: "doing" },
    { id: 2, title: "Reunião Financeira", col: "doing", heavy: true },
    { id: 3, title: "Escrever Manifesto", col: "todo" }
  ]);

  const messagesEndRef = useRef(null);

  // Auto-scroll do chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ENGINE DE ROTEIRO (O Cérebro da Demo)
  const runScript = async (scriptId) => {
    if (activeScript || isTyping) return;
    const script = ASH_SCRIPTS.find(s => s.id === scriptId);
    if (!script) return;

    setActiveScript(scriptId);
    
    // Reset de Estado para Cenário
    if (scriptId === 'energy_checkin') {
      setEnergyLevel(80);
      setKanbanTasks([
        { id: 1, title: "Lançamento Site", col: "doing" },
        { id: 2, title: "Reunião Financeira", col: "doing", heavy: true },
        { id: 3, title: "Escrever Manifesto", col: "todo" }
      ]);
    }
    if (scriptId === 'create_project') {
      setProjectTree([
        { id: 'inbox', label: 'Inbox', icon: IconFlux },
        { id: 'planner', label: 'Planner', icon: IconCronos }
      ]);
    }

    // Execução Passo a Passo
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 800));
    setIsTyping(false);

    for (let step of script.steps) {
      if (step.type === 'msg') {
        setIsTyping(true);
        await new Promise(r => setTimeout(r, step.delay || 1500));
        setMessages(prev => [...prev, { type: 'ash', text: step.text }]);
        setIsTyping(false);
      } 
      else if (step.type === 'action') {
        // Simulação das Funções do Sistema Real
        if (step.func === 'updateEnergyWidget') {
          setEnergyLevel(step.params.level);
        }
        if (step.func === 'moveKanbanCards') {
          // Animação de cards sumindo/movendo
          setKanbanTasks(prev => prev.filter(t => !step.params.ids.some(id => t.title.toLowerCase().includes(id))));
        }
        if (step.func === 'createProjectTree') {
          setProjectTree(prev => [
            ...prev,
            { id: 'root', label: step.params.root, icon: IconFolder, isProject: true },
            ...step.params.children.map(c => ({ id: c, label: c, icon: IconFeather, isChild: true }))
          ]);
        }
        if (step.func === 'dimInterface') {
          setFocusMode(true);
        }
      }
      else if (step.type === 'input') {
        // Simula digitação do usuário
        await new Promise(r => setTimeout(r, 500));
        setMessages(prev => [...prev, { type: 'user', text: "..." }]);
        const fullText = step.placeholder.replace('Ex: ', '');
        await new Promise(r => setTimeout(r, 1200));
        setMessages(prev => {
            const newHistory = [...prev];
            newHistory.pop();
            newHistory.push({ type: 'user', text: fullText });
            return newHistory;
        });
      }
    }
    setActiveScript(null);
  };

  return (
    <div className={`w-full max-w-6xl mx-auto h-[700px] bg-[#0c0a09] border border-white/10 rounded-xl overflow-hidden flex shadow-2xl relative transition-all duration-1000 ${focusMode ? 'scale-105 border-[var(--accent)]/50' : ''}`}>
      
      {/* Overlay de Foco (Zen Mode) */}
      {focusMode && <div className="absolute inset-0 bg-black/90 z-40 pointer-events-none transition-opacity duration-1000" />}

      {/* --- COLUNA 1: SIDEBAR (Clone visual de Sidebar.jsx) --- */}
      <div className={`w-[60px] border-r border-white/5 bg-[#151413] flex flex-col items-center py-4 gap-4 z-30 transition-opacity ${focusMode ? 'opacity-20' : 'opacity-100'}`}>
        <PranaLogo className="w-6 h-6 text-[var(--accent)] mb-4" />
        {/* Navigation Icons */}
        <div className="flex flex-col gap-2 w-full px-2">
           <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center text-[#a8a29e]"><IconFlux className="w-5 h-5" /></div>
           <div className="w-10 h-10 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a8a29e] opacity-50"><IconChat className="w-5 h-5" /></div>
           <div className="w-10 h-10 rounded-md hover:bg-white/5 flex items-center justify-center text-[#a8a29e] opacity-50"><IconCronos className="w-5 h-5" /></div>
        </div>
        <div className="mt-auto mb-4">
           {/* Energy Widget Minimal */}
           <div className="w-2 h-16 bg-black rounded-full relative overflow-hidden">
              <motion.div 
                className={`absolute bottom-0 w-full ${energyLevel < 30 ? 'bg-red-500' : 'bg-green-500'}`}
                animate={{ height: `${energyLevel}%` }}
                transition={{ duration: 1 }}
              />
           </div>
        </div>
      </div>

      {/* --- COLUNA 2: MAIN STAGE (Workspace Area) --- */}
      <div className={`flex-1 bg-[#0c0a09] flex flex-col relative z-20 transition-all ${focusMode ? 'blur-sm opacity-30' : ''}`}>
        {/* Header da View */}
        <div className="h-12 border-b border-white/5 flex items-center px-6 text-sm text-[#a8a29e] gap-2">
           <LayoutGrid className="w-4 h-4" />
           <span>Workspace</span>
           <span className="text-white/20">/</span>
           <span className="text-[#e6e1db]">Visão Geral</span>
        </div>

        {/* Content Area (Onde a mágica visual acontece) */}
        <div className="flex-1 p-6 overflow-hidden flex gap-6">
           {/* Project Tree (Esquerda do Stage) */}
           <div className="w-64 hidden md:block">
              <div className="text-xs font-bold uppercase tracking-widest text-[#a8a29e] mb-4">Projetos</div>
              <div className="space-y-1">
                 {projectTree.map((item, i) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${item.isProject ? 'text-[#e6e1db] bg-white/5' : 'text-[#a8a29e] ml-4'}`}
                    >
                       <item.icon className="w-4 h-4 opacity-70" />
                       {item.label}
                    </motion.div>
                 ))}
              </div>
           </div>

           {/* Kanban Board (Centro do Stage) */}
           <div className="flex-1 bg-[#151413]/50 rounded-xl p-4 border border-white/5">
              <div className="flex gap-4 h-full">
                 <div className="flex-1 bg-[#1a1816] rounded-lg p-3">
                    <div className="text-xs font-bold text-[#a8a29e] mb-3 uppercase">A Fazer</div>
                    {kanbanTasks.filter(t => t.col === 'todo').map(t => (
                       <div key={t.id} className="bg-[#262422] p-3 rounded mb-2 text-sm border border-white/5">{t.title}</div>
                    ))}
                 </div>
                 <div className="flex-1 bg-[#1a1816] rounded-lg p-3">
                    <div className="text-xs font-bold text-[var(--accent)] mb-3 uppercase">Em Fluxo</div>
                    <AnimatePresence>
                      {kanbanTasks.filter(t => t.col === 'doing').map(t => (
                        <motion.div 
                          key={t.id}
                          layout
                          exit={{ opacity: 0, scale: 0.9 }}
                          className={`bg-[#262422] p-3 rounded mb-2 text-sm border ${t.heavy ? 'border-red-500/50' : 'border-white/5'}`}
                        >
                           {t.title}
                           {t.heavy && <span className="block text-[10px] text-red-400 mt-1">Alta Energia</span>}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* --- COLUNA 3: SIDE CHAT (Clone visual de SideChat.jsx) --- */}
      <div className="w-[350px] border-l border-white/5 bg-[#151413] flex flex-col z-30 shadow-xl">
        {/* Chat Header */}
        <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-[#e6e1db] uppercase tracking-widest">ASH AI</span>
           </div>
           <Terminal className="w-4 h-4 text-[#a8a29e]" />
        </div>

        {/* Message Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-hide bg-[#0c0a09]/50">
           {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
              >
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white/10 ${msg.type === 'ash' ? 'bg-[#1a1816]' : 'bg-transparent'}`}>
                    {msg.type === 'ash' ? <IconNeural className="w-4 h-4 text-[var(--accent)]" /> : <div className="w-2 h-2 bg-white rounded-full" />}
                 </div>
                 <div className={`p-3 rounded-xl text-xs leading-relaxed max-w-[85%] ${msg.type === 'ash' ? 'bg-[#262422] text-[#e6e1db] border border-white/5' : 'bg-[#e6e1db] text-[#1a1816]'}`}>
                    {msg.text}
                 </div>
              </motion.div>
           ))}
           {isTyping && <div className="text-xs text-[#a8a29e] animate-pulse ml-12">Ash pensando...</div>}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area (Gatilhos da Demo) */}
        <div className="p-4 border-t border-white/5 bg-[#1a1816]">
           <div className="text-[10px] text-[#a8a29e] mb-3 uppercase tracking-widest opacity-60">Escolha uma Situação:</div>
           <div className="space-y-2">
              {ASH_SCRIPTS.map((script) => {
                 const Icon = ICON_MAP[script.iconName] || Zap;
                 return (
                   <button
                     key={script.id}
                     onClick={() => runScript(script.id)}
                     disabled={activeScript !== null}
                     className="w-full p-2 rounded border border-white/10 hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all flex items-center gap-3 text-left group disabled:opacity-50 disabled:cursor-not-allowed bg-[#262422]"
                   >
                      <div className="w-6 h-6 rounded bg-black/50 flex items-center justify-center text-[var(--accent)]">
                         <Icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1">
                         <div className="text-xs font-bold text-[#e6e1db] group-hover:text-[var(--accent)]">{script.shortLabel}</div>
                      </div>
                   </button>
                 )
              })}
           </div>
        </div>
      </div>

    </div>
  );
};

// ==========================================
// PÁGINA PRINCIPAL
// ==========================================

export default function PranaSanctuary() {
  return (
    <div 
      className={`min-h-screen w-full font-sans selection:bg-[var(--accent)]/30 bg-[#1a1816] text-[#e6e1db]`}
      style={{
          '--bg-color': '#1a1816',
          '--text-primary': '#e6e1db',
          '--accent': '#D97706' // Prana Orange
      }}
    >
      <style>{`
        .serif-font { font-family: 'Vollkorn', serif; }
        .mono-font { font-family: 'JetBrains Mono', monospace; }
        html { scroll-behavior: smooth; }
      `}</style>
      
      <SanctuaryHeader />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-100 grayscale contrast-125 hover:scale-105"
            style={{ 
              backgroundImage: `url('https://myyavzcjwaspnoswzvcq.supabase.co/storage/v1/object/public/Prana/download%20(1).jpg')`,
              transition: 'transform 30s ease-out' // CORREÇÃO DO AVISO TAILWIND
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1816] via-[#1a1816]/60 to-transparent" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 mt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <span className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur text-[10px] uppercase tracking-[0.2em] text-[#a8a29e] shadow-lg">
              Sistema Operacional Holístico
            </span>
            <h1 className="text-5xl md:text-8xl font-serif font-light leading-tight mb-8 text-[#e6e1db] drop-shadow-2xl">
              Sua mente merece<br /> um <span className="italic text-[var(--accent)]">santuário</span>.
            </h1>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <button className="px-10 py-4 bg-[var(--accent)] text-[#1a1816] font-bold uppercase tracking-widest text-xs rounded hover:bg-[#b45309] transition-all shadow-[0_0_40px_rgba(217,119,6,0.2)] hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] hover:-translate-y-1">
                Entrar no Santuário
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Section */}
      <section className="py-32 px-6 bg-[#0c0a09] relative border-t border-white/5 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[var(--accent)]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif mb-4 text-[#e6e1db]">Não trabalhamos sozinhos.</h2>
            <p className="text-[#a8a29e] text-lg">Converse com o Ash e veja o sistema se auto-organizar.</p>
          </div>
          <AshLiveTerminal />
        </div>
      </section>

      {/* Planos */}
      <section id="pricing" className="py-32 px-6 bg-[#1a1816] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-[#e6e1db]">Investimento na sua Paz.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {PLANS_DATA.map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative p-8 rounded-2xl border flex flex-col ${plan.highlight ? 'bg-[#262422] border-[var(--accent)] shadow-2xl scale-105 z-10' : 'bg-[#151413] border-white/10 opacity-80 hover:opacity-100 transition-all'}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--accent)] text-[#1a1816] text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Recomendado
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-[var(--accent)]' : 'text-[#e6e1db]'}`}>{plan.name}</h3>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-serif text-[#e6e1db]">R$ {plan.price}</span>
                  <span className="text-sm text-[#a8a29e]">/{plan.period}</span>
                </div>
                <ul className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-[#a8a29e]">
                      <div className={`w-1.5 h-1.5 rounded-full ${plan.highlight ? 'bg-[var(--accent)]' : 'bg-white/30'}`} /> {feat}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-4 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${plan.highlight ? 'bg-[var(--accent)] text-[#1a1816] hover:bg-[#b45309] shadow-lg' : 'border border-white/20 hover:bg-white/10 text-[#e6e1db]'}`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-white/5 text-center bg-[#151413]">
        <PranaLogo className="w-12 h-12 text-[var(--accent)] mx-auto mb-8 opacity-50 hover:opacity-100 transition-opacity" />
        <p className="text-[10px] text-[#a8a29e]/30 font-mono">
            PRANA SYSTEMS V3.0 • WABI SABI EDITION • 2026
        </p>
      </footer>
    </div>
  );
}