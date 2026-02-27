import React from 'react';
import { motion } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// [CORREÇÃO FINAL] Importação corrigida para usar os nomes dos Arcanos base.
import { 
    IconGripVertical,      
    IconCronos,            // Nome correto para o ícone de Calendário (era IconCalendar)
    IconLayers,            // Nome correto para o ícone de Menu/Explorer (era IconMenu)
    IconCheckCircle 
} from '@/components/icons/PranaLandscapeIcons';

export default function TaskNode({ task, index, onSelectTask, compact = false, viewMode = 'list' }) {
    const priorityConfig = {
        low: { label: 'Baixa', color: 'border-blue-500' },
        medium: { label: 'Média', color: 'border-yellow-500' },
        high: { label: 'Alta', color: 'border-red-500' },
        critical: { label: 'Crítica', color: 'border-purple-500' },
    };
    
    const statusConfig = {
        todo: { label: 'Pendente', bg: 'bg-slate-500/80' },
        in_progress: { label: 'Em Progresso', bg: 'bg-blue-500/80' },
        completed: { label: 'Concluído', bg: 'bg-green-500/80' },
        blocked: { label: 'Bloqueado', bg: 'bg-red-500/80' },
    };

    if (viewMode === 'clean') {
        return (
            <Draggable draggableId={`task-${task.id}`} index={index} type="TASK">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 mb-1 hover:bg-white/10 transition-colors"
                    >
                        {/* Uso de IconLayers no lugar de IconMenu (ícone de lista/camadas) */}
                        <div {...provided.dragHandleProps} className="opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing flex-shrink-0">
                            <IconLayers className="w-4 h-4 text-muted-foreground" /> 
                        </div>
                        <div className="w-3 h-3 flex-shrink-0">
                            <IconCheckCircle className="w-full h-full opacity-60 text-muted-foreground" />
                        </div>
                        <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSelectTask(task.id)}>
                            <p className="font-medium truncate text-sm text-foreground/90" title={task.title}>
                                {task.title}
                            </p>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    }

    return (
        <Draggable draggableId={`task-${task.id}`} index={index} type="TASK">
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`bg-white/5 border-l-4 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-2xl scale-105 z-50' : 'shadow-sm hover:bg-white/[0.07]'
                    } ${priorityConfig[task.priority]?.color || 'border-gray-400'} ${
                        compact ? 'p-1 mb-1' : 'p-3 mb-2'
                    }`}
                >
                    {/* Drag Handle */}
                    <div {...provided.dragHandleProps} className="opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing flex-shrink-0">
                        <IconGripVertical className={`${compact ? "w-3 h-3" : "w-5 h-5"} text-muted-foreground`} />
                    </div>

                    {/* Clickable Content Area */}
                    <div className="flex-grow min-w-0 cursor-pointer" onClick={() => onSelectTask(task.id)}>
                        <p className={`font-medium truncate text-foreground/90 ${compact ? 'text-xs' : 'text-sm'}`} title={task.title}>
                            {task.title}
                        </p>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0 cursor-pointer" onClick={() => onSelectTask(task.id)}>
                        {!compact && task.due_date && (
                            <Badge variant="outline" className="text-xs hidden sm:flex border-white/10 text-muted-foreground gap-1">
                                {/* Uso de IconCronos no lugar de IconCalendar */}
                                <IconCronos className="w-3 h-3" /> 
                                {formatDistanceToNow(new Date(task.due_date), { addSuffix: true, locale: ptBR })}
                            </Badge>
                        )}
                         <Badge className={`capitalize text-white border-0 ${statusConfig[task.status]?.bg || 'bg-gray-500'} ${
                             compact ? 'text-[10px] px-1 py-0 h-4' : 'text-xs'
                         }`}>
                            {compact ? task.status.charAt(0).toUpperCase() : (statusConfig[task.status]?.label || task.status)}
                        </Badge>
                    </div>
                </div>
            )}
        </Draggable>
    );
}