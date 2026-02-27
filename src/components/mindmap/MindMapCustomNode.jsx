/* src/components/mindmap/MindMapCustomNode.jsx
   desc: Nó Orgânico V8.2 (Wabi-Sabi Glass).
   fix: Usa cores do tema (bg-card) em vez de preto fixo.
*/
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { 
    IconNeural, IconCheck, IconDatabase, IconTrash
} from '@/components/icons/PranaLandscapeIcons';
import { cn } from '@/lib/utils';

const MindMapCustomNode = ({ data, selected }) => {
    const isEntity = data.isEntity;
    const isRoot = data.node_type === 'root';
    
    // Mapeamento de Ícones
    let Icon = IconNeural; 
    if (data.node_type === 'task') Icon = IconCheck;
    if (data.node_type === 'record') Icon = IconDatabase;

    return (
        <div className="relative group">
            {/* O Corpo do Nó (Glass Orgânico) */}
            <div 
                className={cn(
                    "relative flex items-center gap-3 px-4 py-3 transition-all duration-500 backdrop-blur-xl shadow-lg",
                    // Formato e Cor (Wabi-Sabi)
                    isRoot 
                        ? "rounded-full px-6 py-4 border-2 border-white/20 bg-card/20" 
                        : "rounded-2xl border border-white/10 bg-card/40", // <--- MUDANÇA AQUI: bg-card
                    // Seleção (Glow orgânico)
                    selected 
                        ? "shadow-[0_0_30px_-5px_rgba(var(--accent-rgb),0.25)] border-white/30 scale-105 bg-card/60" 
                        : "hover:border-white/20 hover:bg-card/50",
                    // Status Concluído (Musgo seco)
                    data.status === 'done' && "opacity-60 grayscale brightness-90"
                )}
            >
                {/* Ícone */}
                <div className={cn(
                    "flex items-center justify-center rounded-full transition-colors",
                    isRoot ? "w-8 h-8 bg-white/10 text-foreground" : "w-6 h-6 bg-white/5 text-muted-foreground",
                    selected && "text-[rgb(var(--accent-rgb))] bg-[rgba(var(--accent-rgb),0.1)]"
                )}>
                    <Icon className={isRoot ? "w-5 h-5" : "w-3.5 h-3.5"} />
                </div>

                {/* Texto */}
                <div className="flex flex-col min-w-[80px] max-w-[200px]">
                    <span className={cn(
                        "text-sm font-medium leading-tight text-foreground/90 font-serif",
                        data.status === 'done' && "line-through opacity-80"
                    )}>
                        {data.label}
                    </span>
                    {/* Badge Sutil */}
                    {isEntity && (
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground/60 mt-0.5">
                            {data.node_type === 'task' ? 'Tarefa' : 'Dado'}
                        </span>
                    )}
                </div>

                {/* Handles Invisíveis (Necessários para conectar!) */}
                <Handle type="target" position={Position.Top} className="!w-full !h-full !top-0 !bg-transparent !border-none !cursor-pointer opacity-0" />
                <Handle type="source" position={Position.Bottom} className="!w-full !h-full !bottom-0 !bg-transparent !border-none !cursor-pointer opacity-0" />
            </div>

            {/* Toolbar Flutuante */}
            <div className={cn(
                "absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-card/90 backdrop-blur-xl rounded-full p-1 border border-white/10 transition-all duration-300 z-50 shadow-xl",
                selected ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 delay-100"
            )}>
                {data.onTransmute && !isEntity && !isRoot && (
                    <>
                        <button onClick={(e) => { e.stopPropagation(); data.onTransmute(data.id, data.label, 'task'); }} className="p-1.5 hover:text-blue-400 text-muted-foreground rounded-full hover:bg-white/10" title="Virar Tarefa">
                            <IconTask className="w-3 h-3" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); data.onTransmute(data.id, data.label, 'record'); }} className="p-1.5 hover:text-purple-400 text-muted-foreground rounded-full hover:bg-white/10" title="Virar Registro">
                            <IconDatabase className="w-3 h-3" />
                        </button>
                        <div className="w-px bg-white/10 mx-0.5" />
                    </>
                )}
                {data.onDelete && (
                    <button onClick={(e) => { e.stopPropagation(); data.onDelete(data.id); }} className="p-1.5 hover:text-red-400 text-muted-foreground rounded-full hover:bg-white/10">
                        <IconTrash className="w-3 h-3" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default memo(MindMapCustomNode);