/* src/components/packages/oracle/DiagramView.jsx */
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { 
  IconCode, 
  IconAlertTriangle, 
  IconLoader2 
} from '@/components/icons/PranaLandscapeIcons';

mermaid.initialize({ 
  startOnLoad: true, 
  theme: 'dark', 
  themeVariables: { primaryColor: 'rgb(217, 119, 6)' } // Sintonizado com a cor "ativo"
});

export const DiagramView = ({ code, error }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && code) {
      try {
        mermaid.contentLoaded();
        mermaid.render('mermaid-svg', code).then((res) => {
          containerRef.current.innerHTML = res.svg;
        });
      } catch (e) {
        console.error("Mermaid Render Error", e);
      }
    }
  }, [code]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-900/10 border border-red-500/20 rounded-xl">
        <IconAlertTriangle className="w-6 h-6 text-red-400 mb-2" />
        <span className="text-[10px] font-mono text-red-400 uppercase font-black">Erro de Blueprint</span>
        <p className="text-xs text-red-400/60 mt-2 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative group bg-black/20 border border-white/5 rounded-2xl p-6 overflow-hidden shadow-2xl">
      <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-100 transition-opacity">
        <IconCode className="w-4 h-4 text-[rgb(var(--accent-dark-earthy))]" />
      </div>
      
      <div 
        ref={containerRef} 
        className="mermaid-render flex justify-center animate-fade-in"
      >
        {/* SVG renderizado */}
      </div>
      
      {!code && (
        <div className="flex items-center gap-3 text-slate-500">
          <IconLoader2 className="w-4 h-4 text-[rgb(var(--accent-dark-earthy))]" spin={true} ativo={true} />
          <span className="text-xs font-mono uppercase">Renderizando Planta Baixa...</span>
        </div>
      )}
    </div>
  );
};