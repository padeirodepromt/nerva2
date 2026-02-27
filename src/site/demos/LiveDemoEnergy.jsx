import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChat, IconZap, IconClock, IconLua, IconColetivo, IconFogo, IconCheckCircle, IconFlux } from "../../components/icons/PranaLandscapeIcons";

const LiveDemoEnergy = () => {
  const [step, setStep] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const scenarios = [
    {
      messages: [
        { role: 'user', text: 'Ash, preciso criar um dashboard de vendas novo.' },
        { role: 'ash', text: '[Contexto] Detectado stack padrão (React/Tailwind). Deseja scaffold?' },
        { role: 'user', text: 'Sim, pode criar a estrutura.' },
        { role: 'ash', text: '[Execução] Feito. Criei /src/sales-dash. Já instalei ShadCN e seus gráficos preferidos.' }
      ],
      bioreg: {
        title: 'Criação Contextual',
        items: [
           { icon: IconFlux, text: 'Scaffold: React + Vite + Tailwind' },
           { icon: IconCheckCircle, text: 'Componentes: ShadCN instalados' },
           { icon: IconZap, text: 'Tempo economizado: ~45 min' }
        ]
      }
    },
    {
      messages: [
        { role: 'user', text: 'Tô travado nesse bug há 2 horas. Não consigo resolver.' },
        { role: 'ash', text: '[Bio-Feedback] Frequência cardíaca alta. Padrão de "Tunnel Vision" detectado.' },
        { role: 'user', text: 'Mas preciso terminar isso hoje!' },
        { role: 'ash', text: '[Intervenção] Negativo. Bloqueei sua tela por 15min. Vá caminhar.' }
      ],
      bioreg: {
        title: 'Proteção Cognitiva',
        items: [
           { icon: IconLua, text: 'Estado: Estresse Agudo Bloqueado' },
           { icon: IconClock, text: 'Lockdaw: 15 minutos' },
           { icon: IconZap, text: 'Sugestão: Caminhada sem celular' }
        ]
      }
    }
  ];

  const current = scenarios[activeScenario];

  useEffect(() => {
    let active = true;
    const run = async () => {
      while (active) {
        setStep(0);
        setShowModal(false);
        
        // 1. Chat sequence
        for(let i=0; i < current.messages.length; i++) {
           await new Promise(r => setTimeout(r, i===0 ? 1000 : 2500));
           if (!active) return;
           setStep(i + 1);
        }
        
        // 2. Pause before modal
        await new Promise(r => setTimeout(r, 1500));
        
        // 3. Show Modal
        if (active) setShowModal(true);
        
        // 4. Hold Modal
        await new Promise(r => setTimeout(r, 5000));
        
        // 5. Hide & next scenario
        if (active) {
            setShowModal(false);
            await new Promise(r => setTimeout(r, 1000));
            setStep(0);
            await new Promise(r => setTimeout(r, 500));
            setActiveScenario(prev => (prev + 1) % scenarios.length);
        }
      }
    };
    run();
    return () => { active = false; };
  }, [activeScenario]);

  return (
    <div className="relative">
      {/* 1. CHAT WINDOW - SAME LAYOUT AS HERO */}
      <div className="w-full h-[450px] flex flex-col bg-[var(--card-bg-solid)] rounded-2xl border border-[var(--glass-border)] request-card-shadow relative z-20">
         {/* Header */}
         <div className="h-12 border-b border-[var(--glass-border)] flex items-center px-4 bg-[var(--bg-color)]/50 justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <IconChat className="w-4 h-4 text-[var(--accent)]" />
               </div>
               <span className="text-xs mono-font tracking-widest uppercase opacity-70 text-[var(--text-secondary)]">Ash • Biorregulação</span>
            </div>
         </div>
         
         {/* Chat Area */}
         <div className="flex-1 p-6 space-y-6 overflow-hidden relative">
            <div className="absolute inset-0 opacity-5" style={{backgroundImage: "var(--texture-image)"}}></div>
            
            <AnimatePresence mode="wait">
              {current.messages.map((msg, i) => (
                step >= i + 1 && (
                  <motion.div 
                    key={`${activeScenario}-${i}`}
                    initial={{opacity:0, y:10}} 
                    animate={{opacity:1, y:0}}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-end gap-3'}`}
                  >
                    {/* Ash Avatar */}
                    {msg.role === 'ash' && (
                        <div className="w-6 h-6 rounded-full bg-[var(--card-bg-solid)] border border-[var(--glass-border)] flex items-center justify-center shrink-0 mb-1">
                             <IconChat className="w-3 h-3 text-[var(--accent)]" />
                        </div>
                    )}

                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed border ${
                       msg.role === 'user' 
                         ? 'bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--text-primary)] rounded-tr-sm' 
                         : 'bg-[var(--bg-color)] border-[var(--glass-border)] text-[var(--text-secondary)] rounded-tl-sm shadow-md'
                     }`}>
                      {msg.role === 'ash' && (
                          <div className="flex items-center gap-2 mb-1">
                              <span className="text-[var(--accent)] font-bold text-[10px] uppercase">Ash AI</span>
                              {msg.text.includes('Analisando') || msg.text.includes('sintonizando') && (
                                  <motion.span 
                                    animate={{ opacity: [0.4, 1, 0.4] }} 
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]"
                                  />
                              )}
                          </div>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
         </div>

         {/* Input Area */}
         <div className="h-14 border-t border-[var(--glass-border)] bg-[var(--bg-color)]/30 flex items-center px-4 gap-3">
            <div className="flex-1 bg-transparent border-b border-[var(--glass-border)]/50 pb-2">
               <div className="text-xs text-[var(--text-secondary)] opacity-50 italic">Converse com Ash sobre sua energia...</div>
            </div>
         </div>
      </div>

      {/* 2. BIORREGULATION MODAL - SAME STYLE AS HERO */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
             key="modal"
             initial={{ opacity: 0, y: -40, scale: 0.95 }}
             animate={{ opacity: 1, y: -20, scale: 1 }}
             exit={{ opacity: 0, y: -40, scale: 0.95 }}
             transition={{ type: "spring", stiffness: 100, damping: 20 }}
             className="relative z-30 mx-auto w-[90%] -mt-10 bg-[var(--bg-color)] rounded-xl border border-[var(--glass-border)] shadow-2xl p-4 flex flex-col gap-3 backdrop-blur-xl"
          >
             <div className="flex items-center gap-3 border-b border-[var(--glass-border)] pb-3">
                 <div className="w-10 h-10 rounded bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                     <IconFlux className="w-6 h-6" ativo={true} />
                 </div>
                 <div>
                     <div className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Estratégia Inteligente</div>
                     <div className="text-sm font-bold text-[var(--text-primary)]">{current.bioreg.title}</div>
                 </div>
             </div>
             <div className="space-y-2">
                 {current.bioreg.items.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                         <item.icon className="w-3 h-3 opacity-70" ativo={true} /> <span>{item.text}</span>
                     </div>
                 ))}
             </div>
             <div className="mt-2 pt-2 border-t border-[var(--glass-border)] flex justify-between items-center">
                 <span className="text-[10px] text-[var(--text-secondary)]">Ash Biorregulation</span>
                 <button className="text-[10px] bg-[var(--accent)] text-white px-3 py-1 rounded">Aplicar Plano</button>
             </div>
             
             {/* Visual Connector Line */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-transparent to-[var(--accent)]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveDemoEnergy;