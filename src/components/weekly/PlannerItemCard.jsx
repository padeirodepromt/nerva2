/* src/components/weekly/PlannerItemCard.jsx
   desc: O Card Atômico do Planner (Versão Orgânica).
   feat: Textura sutil, borda de "marcador" e interações suaves.
*/
import React from "react";
import { motion } from "framer-motion";
import { IconX } from "@/components/icons/PranaLandscapeIcons"; // Removido IconCheck não usado

export default function PlannerItemCard({ item, onDelete }) {
    // Se item vier com cor definida no objeto, usa. Senão, fallback para um tom de grafite suave.
    const accentColor = item.projectColor || item.color || '#64748b';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            className="relative group flex items-center justify-between p-2 rounded-md transition-all cursor-pointer shadow-sm border border-white/5 overflow-hidden"
            style={{ 
                // Fundo com leve tint da cor do projeto para parecer um papel colorido suave
                backgroundColor: `${accentColor}15`, // 15% de opacidade
                borderLeft: `3px solid ${accentColor}` // A marca do "marcador"
            }}
        >
            {/* Textura de Ruído Sutil (Opcional, se quiser mais orgânico ainda) */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise mix-blend-overlay" />

            <div className="flex-1 min-w-0 pr-2 relative z-10">
                <p className="text-[11px] font-medium leading-snug truncate text-foreground/90 font-sans">
                    {item.title}
                </p>
                {item.project_name && (
                    <p 
                        className="text-[9px] uppercase tracking-wide truncate mt-0.5 opacity-70 font-mono"
                        style={{ color: accentColor }}
                    >
                        {item.project_name}
                    </p>
                )}
            </div>

            <button 
                onClick={(e) => { e.stopPropagation(); onDelete && onDelete(item.id); }}
                className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-opacity p-1 rounded-full hover:bg-white/10 relative z-10"
                title="Remover do Planner"
            >
                <IconX className="w-3 h-3" />
            </button>
        </motion.div>
    );
}