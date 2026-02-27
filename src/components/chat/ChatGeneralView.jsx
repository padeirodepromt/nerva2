// src/components/chat/ChatGeneralView.jsx
// Versão: Widget Compacto para Chat

import React, { useMemo } from 'react';
import { LayoutDashboard, Target, AlertTriangle, CheckCircle2 } from '@/components/icons/PranaLandscapeIcons';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import EnergySummaryBoard from '@/components/energy/EnergySummaryBoard';

const TaskRow = ({ task }) => (
    <div className="flex items-center justify-between p-2 rounded-md bg-white/5 border border-white/5 mb-1">
        <div className="flex items-center gap-2 overflow-hidden">
            <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'concluido' ? 'bg-green-500' : 'bg-accent'}`} />
            <span className="text-xs font-medium truncate max-w-[200px]">{task.title || task.name}</span>
        </div>
        <Badge variant="outline" className="text-[10px] py-0 h-5 opacity-70">
            {task.status}
        </Badge>
    </div>
);

export default function ChatGeneralView({ data }) {
    // Proteção contra dados nulos
    const { 
        project = {}, 
        tasks = [], 
        metrics = {}, 
        overview = {} 
    } = data || {};

    const stats = [
        { label: 'Progresso', value: `${metrics.progress || 0}%` },
        { label: 'Tarefas', value: metrics.totalTasks || 0 },
        { label: 'Feitas', value: metrics.completedTasks || 0 },
    ];

    const highlightTasks = overview.highlightTasks || tasks.slice(0, 3);
    const blockedTasks = overview.blockedTasks || [];

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Cabeçalho do Projeto */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold text-foreground">{project.name || 'Projeto Sem Nome'}</h3>
                    <p className="text-xs text-muted-foreground">{project.description || 'Visão geral do contexto atual.'}</p>
                </div>
                <div className="text-right">
                     <div className="text-2xl font-bold text-accent">{metrics.progress || 0}%</div>
                </div>
            </div>

            {/* Barra de Progresso Visual */}
            <Progress value={metrics.progress || 0} className="h-2 bg-white/10" />

            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-3 gap-2">
                {stats.map((stat, i) => (
                    <div key={i} className="p-2 rounded-lg bg-white/5 border border-white/10 text-center">
                        <p className="text-[10px] uppercase text-muted-foreground">{stat.label}</p>
                        <p className="text-lg font-semibold">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Seção de Energia (Se houver dados) */}
            {tasks.length > 0 && (
                 <div className="mt-2">
                    <EnergySummaryBoard 
                        tasks={tasks} 
                        compact={true} // Propriedade nova sugerida para modo compacto
                        title="Energia do Projeto"
                    />
                 </div>
            )}

            {/* Listas de Foco */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-muted-foreground uppercase">
                        <Target className="w-3 h-3" /> Foco Imediato
                    </div>
                    {highlightTasks.length > 0 ? (
                        highlightTasks.map(t => <TaskRow key={t.id} task={t} />)
                    ) : (
                        <p className="text-xs opacity-50 italic">Nada pendente.</p>
                    )}
                </div>

                {blockedTasks.length > 0 && (
                    <div>
                        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-red-400 uppercase">
                            <AlertTriangle className="w-3 h-3" /> Atenção (Bloqueios)
                        </div>
                        {blockedTasks.map(t => <TaskRow key={t.id} task={t} />)}
                    </div>
                )}
            </div>
        </div>
    );
}