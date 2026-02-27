/* src/components/specialists/dev-neo/NeoDiffBubble.jsx
   desc: Bolha de Chat exclusiva do Neo para explicar cirurgias no código.
   feat: Syntax highlighting básico inline, status red/green.
*/
import React from 'react';
import { IconTerminal } from '@/components/icons/PranaLandscapeIcons';

export const NeoDiffBubble = ({ filePath, oldSnippet, newSnippet, reason }) => {
  return (
    <div className="my-4 w-full bg-[#1e1e1e] border border-white/10 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 font-mono text-xs">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 px-3 py-2 bg-indigo-900/20 border-b border-indigo-500/20">
        <IconTerminal className="w-3.5 h-3.5 text-indigo-400" />
        <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-widest">
          Cirurgia em Análise
        </span>
        <span className="ml-auto text-gray-500 text-[10px]">{filePath}</span>
      </div>

      {/* RAZÃO (O "Porquê") */}
      <div className="p-3 bg-white/5 text-indigo-100 border-b border-white/5 leading-relaxed text-[11px]">
        <strong className="text-indigo-400 mr-2 text-[10px] uppercase tracking-wider">Motivo:</strong>
        {reason}
      </div>

      {/* DIFF VIEWER (SAI ISSO / ENTRA AQUILO) */}
      <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-white/10">
        
        {/* Código Removido */}
        <div className="flex-1 bg-red-950/20 overflow-hidden flex flex-col">
          <div className="px-3 py-1 bg-red-900/30 text-red-400 text-[9px] uppercase font-bold tracking-widest border-b border-red-900/30 flex justify-between shrink-0">
            <span>Removido</span>
            <span>-</span>
          </div>
          <pre className="p-3 m-0 text-red-300/80 overflow-x-auto whitespace-pre-wrap flex-1">
            <code>{oldSnippet || '// Nenhuma linha removida'}</code>
          </pre>
        </div>

        {/* Código Adicionado */}
        <div className="flex-1 bg-emerald-950/20 overflow-hidden flex flex-col">
          <div className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-[9px] uppercase font-bold tracking-widest border-b border-emerald-900/30 flex justify-between shrink-0">
            <span>Adicionado</span>
            <span>+</span>
          </div>
          <pre className="p-3 m-0 text-emerald-300 overflow-x-auto whitespace-pre-wrap shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] flex-1">
            <code>{newSnippet || '// Nenhuma linha adicionada'}</code>
          </pre>
        </div>
        
      </div>
    </div>
  );
};

export default NeoDiffBubble;