/* desc: Barra de Sintonia Contextual (Fase 2).
  feat: Permite ao Arquiteto mudar o "Modo" da Flor sem sair do Canvas.
*/
import React from 'react';
import { Sparkles, Target, MapPin, Briefcase } from 'lucide-react';

export default function ContextTuningBar({ config, onChange }) {
  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 p-3 bg-white/40 backdrop-blur-2xl border border-black/5 rounded-3xl shadow-2xl z-50 animate-in slide-in-from-right-10">
      
      {/* Expertise Selector */}
      <TuningItem 
        icon={<Briefcase />} 
        label="Expertise" 
        active={config.expertise} 
        options={['medica', 'fotografa', 'designer', 'advogada']}
        onSelect={(val) => onChange('expertise', val)}
      />

      {/* Objective Selector */}
      <TuningItem 
        icon={<Target />} 
        label="Objetivo" 
        active={config.objective} 
        options={['venda', 'inspiracao', 'engajamento']}
        onSelect={(val) => onChange('objective', val)}
      />

      {/* Geo Selector */}
      <TuningItem 
        icon={<MapPin />} 
        label="Lugar" 
        active={config.geo} 
        options={['brasil_sudeste', 'portugal', 'global_digital']}
        onSelect={(val) => onChange('geo', val)}
      />

      <div className="h-[1px] bg-black/5 w-full" />
      
      <div className="flex flex-col items-center gap-1">
        <Sparkles className="w-4 h-4 text-pink-500 animate-pulse" />
        <span className="text-[8px] font-black uppercase text-black/20">Flor Active</span>
      </div>
    </div>
  );
}

function TuningItem({ icon, label, active, options, onSelect }) {
  return (
    <div className="group relative flex flex-col items-center gap-2">
      <div className="p-3 rounded-2xl bg-white shadow-sm border border-black/5 text-black/40 group-hover:text-pink-500 transition-all">
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      
      {/* Popover de Opções (Subtil) */}
      <div className="absolute right-14 top-0 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all translate-x-4 group-hover:translate-x-0">
        <div className="bg-black/90 text-white p-2 rounded-2xl flex flex-col gap-1 min-w-[120px] shadow-2xl">
          <p className="text-[8px] font-black uppercase tracking-widest text-white/40 px-2 py-1">{label}</p>
          {options.map(opt => (
            <button 
              key={opt}
              onClick={() => onSelect(opt)}
              className={`text-[10px] text-left px-3 py-1.5 rounded-xl hover:bg-white/10 transition-colors ${active === opt ? 'text-pink-400 font-bold' : 'text-white/60'}`}
            >
              {opt.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}