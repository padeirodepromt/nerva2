import React from "react";
import { motion } from "framer-motion";
import { IconUser, IconChat, IconCloud } from "../../components/icons/PranaLandscapeIcons";

// Estilos auxiliares para garantir a cor Cobre sem erro
const copperStyle = { color: 'var(--accent)' };
const borderCopper = { borderColor: 'var(--accent)' };

// Conector de Ida (Seta Reta)
const CopperConnector = ({ label }) => (
  <div className="flex flex-col items-center justify-center w-12 md:w-24 relative shrink-0 z-20">
    {/* Linha Horizontal (Desktop) */}
    <div className="hidden md:flex w-full items-center relative">
        <div className="h-px w-full border-t border-dashed opacity-60" style={borderCopper}></div>
        <div className="absolute -right-1 text-[10px] -mt-[1px]" style={copperStyle}>►</div>
    </div>
    {/* Linha Vertical (Mobile) */}
    <div className="md:hidden h-12 w-px border-l border-dashed opacity-60 relative flex flex-col items-center justify-end" style={borderCopper}>
        <div className="absolute -bottom-2 text-[10px] rotate-90" style={copperStyle}>►</div>
    </div>
    {/* Label */}
    <span className="absolute -top-3 md:-top-5 text-[9px] font-mono uppercase tracking-widest text-white/70 bg-[var(--bg-color)] px-1">
      {label}
    </span>
  </div>
);

const AshArchitectureDiagram = () => {
  return (
    <div className="w-full max-w-5xl mx-auto py-20 px-4 relative group">
      
      {/* 1. Background Glow (Atmosfera) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-1000 group-hover:opacity-100 opacity-60"></div>

      {/* 2. HEADER */}
      <div className="flex flex-col mb-16 text-center relative z-30">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2 opacity-80" style={copperStyle}>Fluxo de Dados</h3>
        <h2 className="text-3xl md:text-4xl text-white serif-font font-light">Arquitetura de Inteligência</h2>
      </div>

      {/* 3. CONTAINER DO DIAGRAMA */}
      <div className="relative p-0 md:p-8 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-0 z-30">
          
          {/* --- NÓ 1: VOCÊ --- */}
          <div className="flex flex-col items-center gap-3 w-32 shrink-0 relative group/node">
            {/* Efeito Aura */}
            <div className="absolute inset-0 bg-[var(--accent)]/10 rounded-full blur-xl opacity-0 group-hover/node:opacity-100 transition-opacity duration-700"></div>
            
            <div className="w-20 h-20 rounded-full bg-[var(--bg-color)] border border-dashed flex items-center justify-center relative z-10" style={borderCopper}>
               <IconUser className="w-8 h-8" style={{ ...copperStyle, stroke: 'currentColor', fill: 'none' }} />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-white uppercase tracking-widest">VOCÊ</div>
              <p className="text-[9px] text-white/50 font-mono mt-1">"Intenção"</p>
            </div>
          </div>

          {/* Seta 1 */}
          <CopperConnector label="Prompt" />

          {/* --- NÓ 2: ASH ENGINE (Centro) --- */}
          <div className="flex flex-col items-center w-48 shrink-0 mx-2 relative group/ash">
               {/* Container Central */}
               <div className="relative p-6 flex flex-col items-center justify-center text-center">
                   
                   {/* Badge Flutuante */}
                   <div className="absolute -top-4 px-2 py-0.5 border text-[8px] font-bold rounded-full uppercase tracking-wider bg-[var(--bg-color)] z-20 shadow-lg" style={{ ...copperStyle, ...borderCopper }}>
                      ASH ENGINE
                   </div>
                   
                   {/* Ícone Pulsante */}
                   <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                       {/* Pulso Interno */}
                       <motion.div 
                          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-[var(--accent)] blur-2xl opacity-30"
                       ></motion.div>
                       
                       <IconChat className="w-12 h-12 relative z-10 drop-shadow-xl" style={{ ...copperStyle, stroke: 'currentColor', fill: 'none' }} />
                   </div>

                   {/* Contexto List */}
                   <div className="flex flex-col gap-1 w-max relative z-20">
                      {['Contexto', 'Memória', 'Preferências'].map((item) => (
                          <span key={item} className="text-[9px] text-white/90 font-mono tracking-tight flex items-center gap-2">
                              <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--accent)' }}></span> {item}
                          </span>
                      ))}
                   </div>
               </div>
          </div>

          {/* Seta 2 */}
          <CopperConnector label="Contexto" />

          {/* --- NÓ 3: LLM --- */}
          <div className="flex flex-col items-center gap-3 w-32 shrink-0 relative group/llm">
            {/* Aura Suave */}
            <div className="absolute inset-0 bg-[var(--accent)]/5 rounded-xl blur-lg opacity-0 group-hover/llm:opacity-100 transition-opacity"></div>

            <div className="w-20 h-20 rounded-xl bg-[var(--bg-color)] border border-dashed flex items-center justify-center relative z-10 rotate-3" style={borderCopper}>
               <IconCloud className="w-8 h-8 -rotate-3" style={{ ...copperStyle, stroke: 'currentColor', fill: 'none' }} />
            </div>
            <div className="text-center mt-2">
              <div className="text-xs font-bold text-white uppercase tracking-widest">LLM</div>
              <p className="text-[9px] text-white/50 font-mono mt-1">Processamento</p>
            </div>
          </div>

      </div>

      {/* --- 4. CAMINHO DE VOLTA (FEEDBACK LOOP) --- */}
      {/* Posicionado absolutamente por baixo de tudo */}
      <div className="absolute top-[60%] left-0 w-full h-40 pointer-events-none hidden md:block z-20">
          <svg className="w-full h-full" viewBox="0 0 800 150" preserveAspectRatio="none">
              <defs>
                <marker id="arrowhead-copper" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--accent)" />
                </marker>
              </defs>

              {/* Caminho Curvo */}
              <motion.path 
                d="M 650,40 Q 400,140 150,40" 
                fill="none" 
                stroke="var(--accent)" 
                strokeWidth="1" 
                strokeDasharray="6 6"
                markerEnd="url(#arrowhead-copper)"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              />
              
              {/* Rótulo "EFICIÊNCIA" no meio da curva */}
              <foreignObject x="350" y="80" width="100" height="30">
                  <div className="flex justify-center">
                    <span className="bg-[var(--bg-color)] px-2 py-1 text-[9px] font-mono uppercase tracking-widest border rounded text-[var(--accent)]" style={borderCopper}>
                        Eficiência
                    </span>
                  </div>
              </foreignObject>
          </svg>
      </div>

      {/* 5. FOOTER */}
      <div className="mt-20 text-center opacity-70 relative z-30">
          <p className="text-sm text-white/90 italic font-serif max-w-lg mx-auto leading-relaxed">
              "O Prana atua como um tradutor. Ele pega sua intenção, mistura com o contexto da sua vida real, e só então processa a resposta."
          </p>
      </div>

    </div>
  );
};

export default AshArchitectureDiagram;