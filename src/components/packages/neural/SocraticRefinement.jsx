/* src/components/packages/neural/SocraticRefinement.jsx */
import React from 'react';
import { BrainCircuit, MessageSquareQuote, ShieldAlert } from 'lucide-react';

export const SocraticRefinement = ({ status }) => {
  // status: 'thinking' | 'critiquing' | 'finalizing'
  
  const steps = {
    thinking: { icon: <BrainCircuit className="animate-pulse" />, text: "Sintetizando Resposta Base..." },
    critiquing: { icon: <ShieldAlert className="text-amber-500 animate-bounce" />, text: "O Crítico Socrático está revisando..." },
    finalizing: { icon: <MessageSquareQuote className="text-cyan-400" />, text: "Refinando versão final com soberania." }
  };

  const current = steps[status] || steps.thinking;

  return (
    <div className="flex items-center gap-3 p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-2">
      <div className="text-cyan-400">
        {current.icon}
      </div>
      <span className="text-xs font-mono text-cyan-200 uppercase tracking-tighter">
        {current.text}
      </span>
    </div>
  );
};