/* src/components/specialists/flor-creator/SintoniaBoard.jsx
   desc: Interface de sintonia fina para as 5 camadas de contexto da Flor.
   feat: Biomodulação visual, Presets de Máscara, N Dimensões dinâmicas.
*/

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Save, Box, Target, MapPin, 
  Zap, Brain, Briefcase, Plus, X 
} from '@/components/icons/PranaLandscapeIcons';

const cn = (...a) => a.filter(Boolean).join(" ");

export default function SintoniaBoard({ layers, onUpdate, onAddLayer, onRemoveLayer, onSaveMask }) {
  
  // Biomodulação: Define a "aura" do componente baseada no estágio/objetivo
  const getGlowStyle = () => {
    const obj = layers.find(d => d.key.toLowerCase().includes('objetivo'))?.value.toLowerCase();
    if (obj?.includes('venda')) return "shadow-[0_0_50px_rgba(225,29,72,0.1)] border-rose-500/10"; 
    if (obj?.includes('inspira')) return "shadow-[0_0_50px_rgba(168,85,247,0.1)] border-purple-500/10";
    return "shadow-[0_0_50px_rgba(20,184,166,0.1)] border-teal-500/10";
  };

  return (
    <motion.div 
      layout
      className={cn(
        "p-8 rounded-[40px] border bg-white/40 backdrop-blur-3xl transition-all duration-1000",
        getGlowStyle()
      )}
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-pink-500 animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30">Mesa de Sintonia</h3>
          </div>
          <p className="text-xs font-bold text-black/60 mt-1.5 italic">"A Flor assume a forma do que o projeto pede."</p>
        </div>
        
        <button 
          onClick={onSaveMask}
          className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full hover:bg-black/10 transition-all group"
        >
          <Save className="w-3.5 h-3.5 text-black/40 group-hover:text-black" />
          <span className="text-[9px] font-black uppercase text-black/40">Salvar Máscara</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {layers.map((layer, idx) => (
            <motion.div 
              key={layer.id || idx}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group relative flex items-center gap-4 p-4 bg-white/60 rounded-[24px] border border-black/[0.03] hover:border-pink-500/20 transition-all"
            >
              <div className="p-2.5 bg-black/[0.03] rounded-xl text-black/30 group-hover:text-pink-500 transition-colors">
                {layer.key.toLowerCase().includes('objetivo') ? <Target className="w-4 h-4" /> :
                 layer.key.toLowerCase().includes('lugar') ? <MapPin className="w-4 h-4" /> :
                 layer.key.toLowerCase().includes('expertise') ? <Briefcase className="w-4 h-4" /> :
                 <Box className="w-4 h-4" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <input 
                  value={layer.key}
                  onChange={(e) => onUpdate(idx, 'key', e.target.value)}
                  className="text-[8px] font-black uppercase tracking-widest text-black/20 bg-transparent border-none p-0 focus:ring-0 w-full"
                />
                <input 
                  value={layer.value}
                  onChange={(e) => onUpdate(idx, 'value', e.target.value)}
                  className="w-full bg-transparent border-none p-0 text-sm font-bold text-black/80 focus:ring-0 truncate"
                />
              </div>

              <button 
                onClick={() => onRemoveLayer(idx)}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-black/10 hover:text-red-500 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        <button 
          onClick={onAddLayer}
          className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-black/5 rounded-[24px] hover:bg-black/[0.02] text-black/20 hover:text-black/40 transition-all min-h-[74px]"
        >
          <Plus className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Nova Dimensão</span>
        </button>
      </div>
    </motion.div>
  );
}