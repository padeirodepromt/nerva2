import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCheckCircle, IconZap, IconSankalpa, IconCronos, IconPapyrus,
  IconPlus, IconColetivo
} from "../../components/icons/PranaLandscapeIcons";

const LiveDemoSmartCreation = () => {
  // Simulation of the "SmartCreationModal" with real fidelity
  const [typedText, setTypedText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const fullText = "Redesenhar Landing Page #ProjetoPrana @DesignTeam";
  const [selectedType, setSelectedType] = useState('task');
  const [showResults, setShowResults] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionPosition, setSuggestionPosition] = useState(0);

  // Animation Sequence
  useEffect(() => {
    let isActive = true;
    const runAnimation = async () => {
      while (isActive) {
        // Reset
        setTypedText("");
        setShowResults(false);
        setShowSuggestions(false);
        setSelectedType('task');
        setSuggestionPosition(0);
        await new Promise(r => setTimeout(r, 1000)); // Pause at start
        
        // Typing Phase 1: "Redesenhar Landing Page "
        const part1 = "Redesenhar Landing Page ";
        for (let i = 0; i <= part1.length; i++) {
          if (!isActive) return;
          setTypedText(part1.slice(0, i));
          await new Promise(r => setTimeout(r, 40));
        }

        // Typing Phase 2: "#" -> Trigger Suggestions
        if (!isActive) return;
        setTypedText(prev => prev + "#");
        await new Promise(r => setTimeout(r, 200));
        setShowSuggestions(true); // Show dropdown
        // Position approx: 24 chars * ~11px + padding
        setSuggestionPosition(part1.length * 11 + 10); 

        await new Promise(r => setTimeout(r, 800)); // User "thinks" looking at dropdown

        // Typing Phase 3: "ProjetoPrana" (AutoComplete simulation)
        setShowSuggestions(false);
        setTypedText(prev => prev + "ProjetoPrana ");
        
        // Typing Phase 4: "@"
        await new Promise(r => setTimeout(r, 300));
        setTypedText(prev => prev + "@");
        await new Promise(r => setTimeout(r, 500));
        setTypedText(prev => prev + "DesignTeam");

        // Analysis
        await new Promise(r => setTimeout(r, 600));
        if (!isActive) return;
        setShowResults(true); // Ash processed it
        
        // Change Type Logic
        await new Promise(r => setTimeout(r, 800));
        if (!isActive) return;
        setSelectedType('project'); // Auto-switch context

        // Finish state
        await new Promise(r => setTimeout(r, 4000));
      }
    };
    runAnimation();
    return () => { isActive = false; };
  }, []);

  const types = [
    { value: 'task', label: 'Tarefa', icon: IconCheckCircle },
    { value: 'thought', label: 'Pensamento', icon: IconZap },
    { value: 'project', label: 'Projeto', icon: IconSankalpa },
    { value: 'event', label: 'Evento', icon: IconCronos },
    { value: 'document', label: 'Documento', icon: IconPapyrus },
  ];

  return (
    <div className="w-full h-80 bg-[var(--card-bg-solid)] rounded-xl border border-[var(--glass-border)] overflow-hidden flex flex-col shadow-2xl relative">
       {/* Modal Header */}
       <div className="h-12 border-b border-[var(--glass-border)] flex items-center px-4 justify-between bg-[var(--bg-color)]/30 backdrop-blur-sm">
         <span className="text-[10px] font-bold tracking-widest text-[var(--text-secondary)] uppercase flex items-center gap-2">
            <IconPlus className="w-3 h-3 text-[var(--accent)]" />
            Nova Criação
         </span>
         <div className="flex gap-1.5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30 hover:bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30 hover:bg-green-500"></div>
         </div>
       </div>

       {/* Modal Body */}
       <div className="flex-1 p-6 flex flex-col relative">
         {/* Type Selector Pills */}
         <div className="flex items-center gap-2 mb-8 overflow-x-auto no-scrollbar mask-gradient-right">
           {types.map((t) => (
             <button 
               key={t.value}
               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-300 ${
                 selectedType === t.value 
                   ? 'bg-[var(--accent)]/10 border-[var(--accent)] text-[var(--accent)] shadow-[0_0_10px_rgba(var(--accent-rgb),0.1)]' 
                   : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5'
               }`}
             >
                <t.icon className="w-3.5 h-3.5" ativo={selectedType === t.value} />
                <span>{t.label}</span>
             </button>
           ))}
         </div>

         {/* Main Input Area */}
         <div className="relative flex-1">
             {/* Rich Text Renderer */}
             <div className="absolute inset-0 pointer-events-none text-2xl font-serif leading-relaxed whitespace-pre-wrap break-words">
               {typedText.split(/(\s+)/).map((segment, i) => {
                 if (segment.startsWith('#')) {
                   return <span key={i} className="text-[var(--accent)] bg-[var(--accent)]/10 rounded px-1 -ml-1 border border-[var(--accent)]/20">{segment}</span>;
                 }
                 if (segment.startsWith('@')) {
                   return <span key={i} className="text-blue-400 bg-blue-500/10 rounded px-1 -ml-1 border border-blue-500/20">{segment}</span>;
                 }
                 return <span key={i} className="text-[var(--text-primary)]">{segment}</span>;
               })}
               <motion.span 
                 animate={{ opacity: [1, 0, 1] }}
                 transition={{ duration: 0.8, repeat: Infinity }}
                 className="inline-block w-[2px] h-6 bg-[var(--accent)] align-middle ml-0.5"
               />
             </div>
             
             {/* Suggestions Dropdown (Simulated Popup) */}
             <AnimatePresence>
                 {showSuggestions && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ left: Math.min(suggestionPosition, 250), top: 40 }}
                        className="absolute bg-[var(--card-bg-solid)] border border-[var(--glass-border)] rounded-lg shadow-xl w-64 z-50 overflow-hidden text-sm"
                     >
                         <div className="px-3 py-2 text-[10px] text-[var(--text-secondary)] uppercase tracking-wider font-bold border-b border-[var(--glass-border)] bg-[var(--bg-color)]/50">Sugestões de Projeto</div>
                         <div className="p-1">
                             <div className="flex items-center gap-2 px-3 py-2 bg-[var(--accent)]/10 text-[var(--accent)] rounded cursor-pointer">
                                 <IconSankalpa className="w-4 h-4" />
                                 <span className="font-bold">Prana V8.0</span>
                                 <span className="ml-auto text-xs opacity-50">Active</span>
                             </div>
                             <div className="flex items-center gap-2 px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--text-primary)]/5 rounded cursor-pointer">
                                 <IconSankalpa className="w-4 h-4" />
                                 <span>Marketing Q1</span>
                             </div>
                         </div>
                     </motion.div>
                 )}
             </AnimatePresence>
         </div>

         {/* Ash Intelligence Footer Status */}
         <AnimatePresence>
            {showResults && (
              <motion.div 
                initial={{opacity:0, y:10}} 
                animate={{opacity:1, y:0}} 
                className="mt-auto border-t border-[var(--glass-border)] pt-4 flex items-center justify-between"
              >
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-primary)]">
                          <div className="w-4 h-4 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
                              <IconZap className="w-2.5 h-2.5 text-[var(--accent)]" />
                          </div>
                          <span>Contexto detectado</span>
                      </div>
                      <div className="h-4 w-px bg-[var(--glass-border)]"></div>
                      <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--glass-border)] text-[var(--text-secondary)] border border-[var(--glass-border)] flex items-center gap-1"><IconSankalpa className="w-2.5 h-2.5"/> Projeto Prana</span>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-[var(--glass-border)] text-[var(--text-secondary)] border border-[var(--glass-border)] flex items-center gap-1"><IconColetivo className="w-2.5 h-2.5"/> Design Team</span>
                      </div>
                  </div>
              </motion.div>
            )}
         </AnimatePresence>
       </div>

       {/* Footer Shortcuts */}
       <div className="bg-[var(--bg-color)]/30 backdrop-blur-md h-9 flex items-center justify-between px-4 text-[9px] text-[var(--text-secondary)] font-mono border-t border-[var(--glass-border)]">
          <div className="flex gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-[var(--text-primary)]/10 px-1 rounded">↵</kbd> create</span>
            <span className="flex items-center gap-1"><kbd className="bg-[var(--text-primary)]/10 px-1 rounded">⌘ ↵</kbd> open</span>
            <span className="flex items-center gap-1"><kbd className="bg-[var(--text-primary)]/10 px-1 rounded">tab</kbd> change type</span>
          </div>
          <div className="flex items-center gap-2 opacity-50">
             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
             ASH NEURAL ENGINE
          </div>
       </div>
    </div>
  );
};

export default LiveDemoSmartCreation;