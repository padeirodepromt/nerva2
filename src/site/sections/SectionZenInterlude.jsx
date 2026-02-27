import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconLua, IconFlux, IconVoid } from "../../components/icons/PranaLandscapeIcons";

const SectionZenInterlude = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-stone-900">
      
      {/* 1. FOTOGRAFIA IMERSIVA (Background) */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?q=80&w=2070&auto=format&fit=crop" 
          alt="Floresta Minimalista" 
          className={`w-full h-full object-cover transition-all duration-1000 ${isOpen ? 'scale-105 blur-sm opacity-60' : 'scale-100 opacity-80'}`}
        />
        {/* Overlay gradiente sutil para garantir leitura se necessário */}
        <div className="absolute inset-0 bg-stone-950/20" />
      </div>

      {/* 2. O CONVITE (Trigger) - Só aparece se o modal estiver fechado */}
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 flex flex-col items-center cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          {/* Círculo Pulsante (O Convite Wabi-Sabi) */}
          <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/10 transition-all duration-500">
             <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          
          <span className="mt-4 text-xs font-serif text-white/70 tracking-[0.2em] uppercase group-hover:text-white transition-colors">
            Descubra o Silêncio
          </span>
        </motion.div>
      )}

      {/* 3. O MODAL DE FUNCIONALIDADE (A Explicação) */}
      <AnimatePresence>
        {isOpen && (
          <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
            
            {/* Backdrop Click para fechar */}
            <div className="absolute inset-0 bg-stone-950/40" onClick={() => setIsOpen(false)} />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-[#1c1917] text-stone-200 p-8 md:p-12 rounded-sm shadow-2xl border border-white/10"
            >
              {/* Botão Fechar Minimalista */}
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-stone-500 hover:text-white transition-colors"
              >
                <IconVoid className="w-5 h-5" />
              </button>

              {/* Conteúdo: Unindo o Sentimento à Funcionalidade */}
              <div className="flex flex-col gap-6">
                <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-[var(--accent)]">
                  <IconLua className="w-5 h-5" />
                </div>
                
                <div>
                  <h3 className="text-3xl serif-font mb-2">Deep Focus Mode</h3>
                  <p className="text-xs font-mono text-[var(--accent)] uppercase tracking-widest mb-6">
                    Funcionalidade de Proteção Cognitiva
                  </p>
                  
                  <p className="text-stone-400 leading-relaxed font-light text-lg">
                    "O ruído é o inimigo da criação."
                  </p>
                  <p className="text-stone-500 leading-relaxed mt-4 text-sm">
                    No Prana, você pode ativar o <strong>Modo Monge</strong> com um atalho. 
                    Toda a interface desaparece. Notificações são silenciadas. 
                    Resta apenas você e o cursor piscando no papel digital.
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                   <div className="px-3 py-1 border border-white/10 rounded text-xs text-stone-500">
                      Bloqueio de Apps
                   </div>
                   <div className="px-3 py-1 border border-white/10 rounded text-xs text-stone-500">
                      Sons Binaurais
                   </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default SectionZenInterlude;