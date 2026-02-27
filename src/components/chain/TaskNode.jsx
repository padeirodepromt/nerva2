/* canvas: src/components/chain/TaskNode.jsx
   desc: Componente Visual do Nó para ReactFlow. Estilo Wabi-Sabi/Glass.
*/
import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import { PranaIcons } from "@/components/icons/PranaLandscapeIcons";

const PRIORITY_COLORS = {
  low: "#3B82F6",    // Azul
  medium: "#F59E0B", // Laranja
  high: "#EF4444",   // Vermelho
  critical: "#8B5CF6" // Roxo
};

const TaskNode = ({ data }) => {
  // Desestruturação segura dos dados injetados pelo ChainView
  const { title, status, priority, projectName, projectColor, outgoing } = data;

  // Definição de Estilo baseado no Status
  const statusStyle = {
    'a_fazer': 'border-slate-500/30 hover:border-slate-500/50',
    'em_progresso': 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.15)]',
    'concluido': 'border-emerald-500/50 opacity-70 grayscale-[0.5]',
    'bloqueado': 'border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-500/5',
  }[status] || 'border-slate-500/30';

  // Ícone de Status
  const StatusIcon = {
    'a_fazer': PranaIcons.Circle,
    'em_progresso': PranaIcons.Clock,
    'concluido': PranaIcons.Check,
    'bloqueado': PranaIcons.Block
  }[status] || PranaIcons.Circle;

  return (
    <div className="relative group">
      {/* Portas de Conexão (Handles) - Invisíveis mas funcionais */}
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-0" />
      
      {/* O Card Visual */}
      <div className={`
        glass-effect rounded-xl p-3 w-60 transition-all duration-300
        border ${statusStyle} hover:scale-105 hover:shadow-lg
      `}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <StatusIcon 
              className={`w-4 h-4 flex-shrink-0 ${status === 'concluido' ? 'text-emerald-400' : 'text-muted-foreground'}`} 
            />
            <span className="text-[10px] uppercase tracking-widest opacity-60 font-mono truncate">
               {projectName || 'Geral'}
            </span>
          </div>
          
          {/* Indicador de Prioridade */}
          <div 
             className="w-2 h-2 rounded-full shadow-sm"
             style={{ backgroundColor: PRIORITY_COLORS[priority] || PRIORITY_COLORS.low }}
             title={`Prioridade: ${priority}`}
          />
        </div>

        <h3 className={`mt-2 text-sm font-medium leading-snug line-clamp-2 ${status === 'concluido' ? 'line-through opacity-50' : 'text-foreground'}`}>
          {title}
        </h3>
        
        {/* Rodapé com Metadados */}
        <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
             <span className="text-[9px] font-mono opacity-40">ID: {data.id.slice(0,4)}</span>
             {outgoing > 0 && (
                 <span className="text-[9px] flex items-center gap-1 text-blue-400/80">
                     <PranaIcons.Flux className="w-3 h-3" /> {outgoing}
                 </span>
             )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-0" />
    </div>
  );
};

export default memo(TaskNode);