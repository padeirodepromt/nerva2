import React from 'react';
import { motion } from 'framer-motion';
import { 
  IconNeural,      // Foco/Cognitivo (BrainCircuit alias)
  IconColetivo,    // Social (Users alias)
  IconSettings,    // Rotina/Mecânico
  IconSankalpa,    // Criação/Inspiração (Target alias)
  IconVision       // Alternativa para Criação
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/components/LanguageProvider';

// Definição dos Arquétipos
const ACTIVITY_TYPES = [
  { 
    id: 'cognitive', 
    label: 'Foco', 
    icon: IconNeural, 
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    desc: 'Lógica, análise, escrita.'
  },
  { 
    id: 'social', 
    label: 'Social', 
    icon: IconColetivo, 
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    desc: 'Reuniões, e-mails, alinhar.'
  },
  { 
    id: 'routine', 
    label: 'Rotina', 
    icon: IconSettings, 
    color: 'text-slate-400',
    bg: 'bg-slate-500/10 border-slate-500/20',
    desc: 'Manutenção, organização.'
  },
  { 
    id: 'creative', 
    label: 'Criação', 
    icon: IconVision, 
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    desc: 'Visão, design, brainstorm.'
  }
];

export const TaskTypeSelector = ({ value, onChange }) => {
  const { t } = useTranslations();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center px-1">
        <label className="text-[10px] uppercase tracking-widest font-bold opacity-70">
          Natureza da Atividade
        </label>
        {value && (
          <span className="text-[10px] text-muted-foreground animate-in fade-in">
             {ACTIVITY_TYPES.find(t => t.id === value)?.desc}
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {ACTIVITY_TYPES.map((type) => {
          const isSelected = value === type.id;
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              type="button"
              className={cn(
                "relative flex flex-col items-center justify-center gap-1.5 p-2 rounded-xl border transition-all duration-300 group h-[70px]",
                isSelected 
                  ? `${type.bg} ring-1 ring-inset ring-white/10 shadow-lg` 
                  : "bg-black/20 border-white/5 hover:bg-white/5 hover:border-white/10"
              )}
            >
              <div className={cn(
                "p-1.5 rounded-full transition-transform duration-300",
                isSelected ? "bg-white/10 scale-110" : "bg-white/5 group-hover:scale-105"
              )}>
                <Icon className={cn("w-4 h-4", isSelected ? type.color : "text-muted-foreground")} />
              </div>
              
              <span className={cn(
                "text-[9px] font-medium transition-colors uppercase tracking-wider",
                isSelected ? "text-white" : "text-muted-foreground"
              )}>
                {type.label}
              </span>

              {/* Indicador de Seleção */}
              {isSelected && (
                <motion.div
                  layoutId="active-task-type"
                  className="absolute inset-0 border-2 border-white/10 rounded-xl pointer-events-none"
                  transition={{ duration: 0.2 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};