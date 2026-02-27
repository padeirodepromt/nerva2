import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconFeather } from "../../components/icons/PranaLandscapeIcons";

const ManifestoModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if(!isOpen) return;
    const handleScroll = () => { if(window.scrollY > 50) onClose(); };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
               initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
               onClick={onClose}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
               initial={{opacity: 0, y: 50, scale: 0.95}}
               animate={{opacity: 1, y: 0, scale: 1}}
               exit={{opacity: 0, y: 20, scale: 0.95}}
               className="relative z-10 w-full max-w-xl bg-[#f2f0e9] text-[#292524] p-12 rounded-sm shadow-2xl overflow-y-auto"
               style={{ 
                   backgroundImage: "url('https://www.transparenttextures.com/patterns/paper.png')",
                   boxShadow: "0 20px 60px rgba(0,0,0,0.5)"
               }} 
            >
               {/* Decorative corner */}
               <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                   <div className="absolute top-0 right-0 w-8 h-8 bg-[#d97706]/20 rotate-45 transform translate-x-4 -translate-y-4"></div>
               </div>

               <div className="serif-font text-center space-y-8">
                  <div className="text-[10px] uppercase tracking-[0.4em] opacity-50 font-sans">Prana V3.0</div>
                  <h2 className="text-4xl md:text-5xl font-medium leading-none tracking-tight text-[#1c1917]">Ritmo Humano</h2>
                  
                  <div className="flex justify-center py-2">
                     <IconFeather className="w-6 h-6 text-[#d97706] opacity-80" />
                  </div>

                  <div className="text-lg leading-relaxed space-y-6 font-serif text-[#44403c]">
                      <p>
                        Acreditamos que a produtividade perdeu sua alma.
                      </p>
                      <p>
                        Vivemos correndo como máquinas, tentando otimizar cada segundo, 
                        esquecendo que somos <span className="italic text-[#d97706]">florestas</span>. 
                        Temos estações, ciclos, secas e colheitas.
                      </p>
                      <p>
                        O <strong>Prana</strong> não é uma ferramenta para fazer mais rápido. 
                        É um santuário. Um lugar onde seus projetos respiram e sua mente descansa.
                      </p>
                      <div className="w-full h-px bg-[#1c1917]/10 my-6"></div>
                      <p className="text-xl font-medium italic text-[#1c1917]">
                        "Do Caos à Clareza. <br/> Da Ansiedade à Presença."
                      </p>
                      <p className="text-sm pt-4 opacity-70 font-sans uppercase tracking-widest">
                        Você não é um robô.
                      </p>
                  </div>
               </div>
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ManifestoModal;