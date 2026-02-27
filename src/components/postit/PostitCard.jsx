/* src/components/postit/PostitCard.jsx
   desc: Card Kanban V8.1 (Energy Aware).
   feat: Exibe badges dinâmicos e o Nível de Energia (Bio-Digital).
*/
import React from "react";
import { motion } from "framer-motion";
import { 
    IconClock, IconCalendar, IconMoreVertical, IconTrash, IconAlertTriangle,
    IconStar, IconCheckSquare, IconLink, IconZap, 
    IconBrainCircuit, IconColetivo, IconSettings, IconVision
} from "@/components/icons/PranaLandscapeIcons";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import { Task } from "@/api/entities";
import { cn } from "@/lib/utils";

const PRIORITY_CONFIG = {
  low: { color: "bg-blue-400/80", label: "Baixa" },
  medium: { color: "bg-yellow-400/80", label: "Média" },
  high: { color: "bg-orange-500/80", label: "Alta" },
  critical: { color: "bg-red-500/80", label: "Crítica" }
};

// Cores de Bateria (Task Context = Custo)
const ENERGY_COST_COLORS = {
    1: 'text-emerald-400',
    2: 'text-teal-400',
    3: 'text-yellow-400',
    4: 'text-orange-400',
    5: 'text-red-400'
};

// Mapeamento de Ícones de Tipo
const TYPE_ICONS = {
    cognitive: IconBrainCircuit,
    social: IconColetivo,
    routine: IconSettings,
    creative: IconVision
};

const DynamicBadge = ({ type, value }) => {
    if (value === null || value === undefined || value === '') return null;

    if (type === 'rating') {
        return (
            <div className="flex items-center gap-0.5" title={`Avaliação: ${value}/5`}>
                {[...Array(Number(value))].map((_, i) => (
                    <IconStar key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                ))}
            </div>
        );
    }
    if (type === 'select' || type === 'multi_select') {
        return <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-black/5 dark:bg-white/10 border-transparent text-foreground/80">{value}</Badge>;
    }
    if (type === 'checkbox' && value === true) {
        return <IconCheckSquare className="w-3.5 h-3.5 text-emerald-500" />;
    }
    if (type === 'url') {
        return <a href={value} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} className="text-blue-400 hover:text-blue-300"><IconLink className="w-3.5 h-3.5" /></a>;
    }
    return null;
};

export default function PostitCard({ task, projects = [], onUpdate, schema = [] }) {
  const project = projects.find(p => p.id === task.project_id);
  const priorityMeta = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium;
  
  // [V8] Extrair propriedades dinâmicas
  const dynamicProps = task.properties || {};
  const energyLevel = dynamicProps.energy_level;
  const taskType = dynamicProps.task_type;

  const handleDelete = async (e) => {
      e.stopPropagation();
      if(confirm("Arquivar tarefa?")) {
          await Task.update(task.id, { status: 'archived', deleted_at: new Date() });
          if (onUpdate) onUpdate();
      }
  };

  const rotation = task.id ? (task.id.charCodeAt(0) % 3) - 1.5 : 0; 

  return (
    <motion.div 
        className="relative group"
        whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
        initial={{ rotate: rotation }}
    >
        <div className="p-4 rounded-sm bg-[#F9F7F1] dark:bg-card border border-black/5 dark:border-white/10 shadow-sm hover:shadow-lg transition-all duration-300 relative overflow-hidden flex flex-col gap-2">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-noise mix-blend-multiply dark:mix-blend-overlay" />

            {/* Header */}
            <div className="flex justify-between items-start relative z-10">
                {project ? (
                    <Badge variant="outline" className="text-[9px] h-5 px-1.5 border-black/10 dark:border-white/10 text-muted-foreground bg-black/5 dark:bg-white/5 font-mono uppercase tracking-wider">
                        {project.name}
                    </Badge>
                ) : <div />}
                
                {task.priority !== 'medium' && (
                    <div className={`w-2 h-2 rounded-full ${priorityMeta.color} opacity-80`} title={`Prioridade ${priorityMeta.label}`} />
                )}
            </div>

            {/* Título */}
            <h4 className={cn("text-sm font-medium leading-snug text-foreground/90 font-sans", task.status === 'done' && 'line-through opacity-60 decoration-wavy decoration-black/20')}>
                {task.title}
            </h4>

            {/* [V8] BIO-BADGES (Energia e Tipo) */}
            <div className="flex flex-wrap gap-2 relative z-10 items-center mb-1">
                
                {/* 1. Badge de Custo Energético */}
                {energyLevel && (
                    <div className={cn(
                        "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5", 
                        ENERGY_COST_COLORS[energyLevel]
                    )} title={`Custo Energético: ${energyLevel}/5`}>
                        <IconZap className="w-3 h-3 fill-current" />
                        <span className="text-[9px] font-bold">{energyLevel}</span>
                    </div>
                )}

                {/* 2. Badge de Tipo de Atividade */}
                {taskType && TYPE_ICONS[taskType] && (
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/5 border border-black/5 dark:border-white/5 text-muted-foreground">
                        {React.createElement(TYPE_ICONS[taskType], { className: "w-3 h-3" })}
                    </div>
                )}

                {/* Outros Badges do Schema */}
                {schema && schema.length > 0 && schema.map(field => {
                    if(['title', 'status', 'check', 'priority', 'dueDate'].includes(field.key)) return null;
                    return <DynamicBadge key={field.key} type={field.type} value={dynamicProps[field.key]} />;
                })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/5 relative z-10 mt-1">
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 font-mono">
                    {task.due_date && (
                        <span className={`flex items-center gap-1 ${new Date(task.due_date) < new Date() && task.status !== 'done' ? 'text-red-400' : ''}`}>
                            <IconCalendar className="w-3 h-3" />
                            {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                        </span>
                    )}
                    {task.estimated_hours && (
                        <span className="flex items-center gap-1">
                            <IconClock className="w-3 h-3" /> {task.estimated_hours}h
                        </span>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity -mr-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full">
                            <IconMoreVertical className="w-3 h-3" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-effect prana-form-modal">
                        <DropdownMenuItem onClick={handleDelete} className="text-red-400 hover:bg-red-500/10 cursor-pointer text-xs">
                            <IconTrash className="w-3 h-3 mr-2" /> Arquivar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    </motion.div>
  );
}