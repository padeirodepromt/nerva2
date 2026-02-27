/* src/components/chat/NeuralThoughtProcess.jsx */
import React, { useState } from 'react';
import { 
  IconNeural, 
  IconTerminal, 
  IconShield, 
  IconFlux, 
  IconChevronDown, 
  IconX,
  IconSankalpa,
  IconCheckCircle
} from '@/components/icons/PranaLandscapeIcons';

const STEP_CONFIG = {
  plan: { 
    Icon: IconSankalpa, 
    title: "Expansão de Intenção", 
    textClass: "text-[rgb(var(--accent-dark-earthy))]/80",
    containerClass: "border-l border-white/5" 
  },
  thought: { 
    Icon: IconTerminal, 
    title: "Chain of Thought", 
    textClass: "text-slate-400",
    containerClass: "border-l border-white/5" 
  },
  critique: { 
    Icon: IconShield, 
    title: "Crítica Socrática", 
    textClass: "text-red-300",
    containerClass: "bg-red-900/10 border border-red-500/20 rounded-r" 
  },
  audit: { 
    Icon: IconCheckCircle, 
    title: "Auditoria de Integridade", 
    textClass: "text-emerald-400",
    containerClass: "bg-emerald-900/10 border border-emerald-500/20 rounded-r" 
  }
};

export const NeuralThoughtProcess = ({ stream = [], status, onRetract }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (stream.length === 0 && status === 'idle') return null;

  return (
    <div className="group my-4 border-l-2 border-[rgb(var(--accent-dark-earthy))]/50 bg-black/20 rounded-r-lg overflow-hidden transition-all duration-300">
      
      <div className="flex items-center justify-between p-2 bg-white/5">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          {status === 'processing' ? (
            <IconFlux className="w-4 h-4 text-[rgb(var(--accent-dark-earthy))]" ativo={true} spin={true} />
          ) : (
            <IconNeural className="w-4 h-4 text-slate-400" />
          )}
          <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-400">
            Pipeline: {status === 'processing' ? 'Processando...' : 'Consciência Ativa'}
          </span>
          <IconChevronDown 
            className={`w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''} text-slate-500`} 
          />
        </button>

        <button 
          onClick={onRetract}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-red-400"
          title="Ocultar pipeline"
        >
          <IconX className="w-3 h-3" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4 text-xs font-mono animate-in fade-in slide-in-from-top-1">
          {stream.map((step, index) => {
            const config = STEP_CONFIG[step.type] || STEP_CONFIG.thought;
            const StepIcon = config.Icon;

            return (
              <div key={index} className={`p-2 pl-4 ${config.containerClass} animate-fade-in`}>
                <div className="flex items-center gap-2 mb-2">
                  <StepIcon className={`w-3 h-3 ${config.textClass}`} />
                  <span className={`text-[8px] uppercase font-bold ${config.textClass}`}>
                    {config.title}
                  </span>
                </div>
                <p className={`leading-relaxed italic ${config.textClass}`}>
                  {step.content}
                </p>
              </div>
            );
          })}

          {status === 'processing' && (
            <div className="flex items-center gap-1.5 opacity-40 pl-4 mt-2">
              <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-dark-earthy))] rounded-full animate-bounce [animation-delay:-.3s]" />
              <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-dark-earthy))] rounded-full animate-bounce [animation-delay:-.15s]" />
              <div className="w-1.5 h-1.5 bg-[rgb(var(--accent-dark-earthy))] rounded-full animate-bounce" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};