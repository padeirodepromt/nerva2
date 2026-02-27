// src/components/PageIconInfo.jsx

import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { motion } from 'framer-motion';

export default function PageIconInfo({ icon: Icon, title, description, color = "var(--accent)" }) {
  // CORREÇÃO: Reduzimos de w-24 (96px) para w-14 (56px) - Grande o suficiente, mas não quebra o layout.
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div 
          role="button"
          tabIndex={0}
          className="cursor-pointer p-0 rounded-full group relative focus:outline-none shrink-0"
        >
          <div className="relative w-14 h-14 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            {/* Aura */}
            <div 
              className="absolute inset-0 rounded-full opacity-20 blur-md scale-90 group-hover:scale-110 transition-all duration-500"
              style={{ backgroundColor: color }}
            />
            {/* Fundo */}
            <div className="absolute inset-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md shadow-inner" />
            
            {/* Ícone (Tamanho controlado: w-7 h-7) */}
            <div style={{ color }} className="w-7 h-7 relative z-10 drop-shadow-lg">
                <Icon className="w-full h-full" />
            </div>
          </div>
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-72 glass-effect border border-white/10 p-4 rounded-xl backdrop-blur-xl shadow-2xl" side="bottom" align="center">
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/10">
                <div className="w-5 h-5" style={{ color }}>
                    <Icon className="w-full h-full" />
                </div>
                <h4 className="font-bold text-sm uppercase tracking-wider opacity-90">{title}</h4>
            </div>
            <p className="text-xs leading-relaxed opacity-80 text-justify font-light">{description}</p>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}