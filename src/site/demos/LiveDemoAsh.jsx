import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconChat, IconCheckCircle, IconCronos, IconColetivo, IconSankalpa, IconGitBranch, IconCloud, IconCode } from "../../components/icons/PranaLandscapeIcons";

const LiveDemoAsh = ({ persona = "holistic" }) => {
  const [step, setStep] = useState(0); 
  const [activeScenario, setActiveScenario] = useState(0);
  const [showModal, setShowModal] = useState(false);

  // Cénarios Holísticos (Padrão)
  const holisticScenarios = [
    {
      messages: [
        { role: 'user', text: 'Tive uma ideia: Lançar o Podcast "Design & Alma".' },
        { role: 'ash', text: 'Excelente. Qual o objetivo principal e a frequência?' },
        { role: 'user', text: 'Conectar criativos conscientes. Episódios semanais.' },
        { role: 'ash', text: 'Perfeito. Contexto captado. Manifestando o plano...' }
      ],
      project: {
        title: 'Podcast "Design & Alma"',
        items: [
           { icon: IconCheckCircle, text: 'Estrutura: Criada' },
           { icon: IconCronos, text: 'Cronograma: Abr/2026' }
        ]
      }
    },
    {
       messages: [
         { role: 'user', text: 'Crie um projeto de marketing' },
         { role: 'ash', text: 'Para qual produto ou serviço estamos criando?' },
         { role: 'user', text: 'Lançamento do curso de Cerâmica' },
         { role: 'ash', text: 'Gerando estrutura de pastas, tarefas e prazos...' }
       ],
       project: {
         title: 'Mkt: Curso Cerâmica',
         items: [
            { icon: IconCheckCircle, text: 'Pastas: 4 Criadas' }, 
            { icon: IconSankalpa, text: 'Prazos: Sugeridos' }
         ]
       }
    }
  ];

  // Cenários Developer / Vibe Coding
  const devScenarios = [
    {
      messages: [
        { role: 'user', text: 'Crie uma Landing Page para meu SaaS de IA.' },
        { role: 'ash', text: 'Stack sugerida: React + Tailwind + Motion. Ok?' },
        { role: 'user', text: 'Sim. Quero um Hero section com um globo 3D.' },
        { role: 'ash', text: 'Gerando componente <HeroGlobe /> e rotas...' }
      ],
      project: {
        title: 'SaaS AI Landing Page',
        items: [
           { icon: IconCode, text: 'src/HeroGlobe.jsx: Created' },
           { icon: IconCloud, text: 'Deploy Preview: Ready' }
        ]
      }
    },
    {
       messages: [
         { role: 'user', text: 'Refatore o <Pricing /> pra suportar 3 tiers.' },
         { role: 'ash', text: 'Analisando src/Pricing.jsx. Adicionar Toggle?' },
         { role: 'user', text: 'Isso. Mensal e Anual com desconto.' },
         { role: 'ash', text: 'Aplicando diff. Rodando testes...' }
       ],
       project: {
         title: 'Refactor: Pricing Component',
         items: [
            { icon: IconGitBranch, text: 'Commit: feat/pricing-tiers' }, 
            { icon: IconCheckCircle, text: 'Tests: Passed (4/4)' }
         ]
       }
    }
  ];

  const scenarios = persona === 'developer' ? devScenarios : holisticScenarios;
  const current = scenarios[activeScenario];

  // Reset scenarios when persona changes
  useEffect(() => {
    setActiveScenario(0);
    setStep(0);
    setShowModal(false);
  }, [persona]);

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
        
        // 2. Pause on "Manifestando..." before modal
        await new Promise(r => setTimeout(r, 1500));
        
        // 3. Show Project Modal
        if (active) setShowModal(true);
        
        // 4. Hold Modal
        await new Promise(r => setTimeout(r, 5000));
        
        // 5. Hide Modal & Reset for next cycle
        if (active) {
            setShowModal(false);
            await new Promise(r => setTimeout(r, 1000)); // Wait for exit animation
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
      {/* 1. CHAT WINDOW */}
      <div className="w-full h-[450px] flex flex-col bg-[var(--card-bg-solid)] rounded-2xl border border-[var(--glass-border)] request-card-shadow relative z-20">
         {/* Header */}
         <div className="h-12 border-b border-[var(--glass-border)] flex items-center px-4 bg-[var(--bg-color)]/50 justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                  <IconChat className="w-4 h-4 text-[var(--accent)]" />
               </div>
               <span className="text-xs mono-font tracking-widest uppercase opacity-70 text-[var(--text-secondary)]">Ash • Context Aware</span>
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
                              {msg.text.includes('Manifestando') && (
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
               <div className="text-xs text-[var(--text-secondary)] opacity-50 italic">Converse com Ash sobre seu estado...</div>
            </div>
         </div>
      </div>

      {/* 2. CONNECTED MODAL */}
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
                     <IconSankalpa className="w-6 h-6" ativo={true} />
                 </div>
                 <div>
                     <div className="text-xs text-[var(--accent)] font-bold uppercase tracking-wider">Projeto Criado</div>
                     <div className="text-sm font-bold text-[var(--text-primary)]">{current.project.title}</div>
                 </div>
             </div>
             <div className="space-y-2">
                 {current.project.items.map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                         <item.icon className="w-3 h-3 opacty-50" /> <span>{item.text}</span>
                     </div>
                 ))}
             </div>
             <div className="mt-2 pt-2 border-t border-[var(--glass-border)] flex justify-between items-center">
                 <span className="text-[10px] text-[var(--text-secondary)]">Ash Intelligence System</span>
                 <button className="text-[10px] bg-[var(--accent)] text-white px-3 py-1 rounded">Abrir Projeto</button>
             </div>
             
             {/* Visual Connector Line */}
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-transparent to-[var(--accent)]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveDemoAsh;