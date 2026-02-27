/* src/views/KanbanView.jsx
   desc: Quadro Kanban V8.1 (Schema Aware).
   feat: Passa o Schema (definição de colunas) para os cartões renderizarem badges.
*/

import React, { useState, useMemo } from "react";
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCorners } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Link } from "react-router-dom";
import { toast } from "sonner";

// [V8] Engine Unificada
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useTranslations } from '@/components/LanguageProvider';
import { useAuth } from "@/hooks/useAuth";

// Componentes Visuais
import { 
    IconFlux, IconPlus, IconBrainCircuit, IconCircle, IconClock, IconAlertTriangle, IconCheckCircle
} from "@/components/icons/PranaLandscapeIcons";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import PostitCard from "@/components/postit/PostitCard"; 
import PranaFormModal from "@/components/forms/PranaFormModal"; 
import PranaLoader from "@/components/PranaLoader";
import PageHeader from "@/components/ui/PageHeader";
import FilterBar from "@/components/views/FilterBar";
import { createPageUrl } from '@/utils';

// --- DRAGGABLE WRAPPER ---
// [V8] Agora aceita 'schema' para passar ao cartão
const DraggablePostit = ({ task, onClick, isOverlay, schema }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = !isOverlay ? useDraggable({
        id: task.id,
        data: { ...task, type: 'KANBAN_CARD' } 
    }) : { attributes: {}, listeners: {}, setNodeRef: null, transform: null, isDragging: false };

    const style = transform ? {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.0 : 1,
        zIndex: isDragging ? 999 : 'auto',
    } : {};

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} onClick={onClick}>
            <PostitCard 
                task={task} 
                schema={schema} // [V8] Injeção de Schema
                projects={[]} 
                onUpdate={() => {}} 
            />
        </div>
    );
};

// --- COLUNA DROPPABLE ---
const KanbanColumn = ({ id, column, tasks, onEdit, onAdd, t, schema }) => {
    const { setNodeRef, isOver } = useDroppable({ id: `kanban-col-${id}`, data: { status: id } });

    return (
        <div className="w-80 flex flex-col h-full rounded-2xl bg-black/20 border border-white/5 overflow-hidden flex-shrink-0">
            {/* Header */}
            <div className="p-3 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white/5" style={{ color: column.color }}>
                        <column.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{column.title}</span>
                    <Badge variant="secondary" className="text-[10px] h-5 bg-white/5 text-muted-foreground hover:bg-white/10">{tasks.length}</Badge>
                </div>
                <Button variant="ghost" size="icon" onClick={onAdd} className="h-6 w-6 text-muted-foreground hover:text-white rounded-full">
                    <IconPlus className="w-3.5 h-3.5" />
                </Button>
            </div>

            {/* Drop Zone */}
            <div 
                ref={setNodeRef} 
                className={`flex-1 p-2 space-y-3 overflow-y-auto prana-scrollbar transition-colors ${isOver ? 'bg-white/[0.03] ring-1 ring-inset ring-white/10' : ''}`}
            >
                {tasks.map(task => (
                    <DraggablePostit 
                        key={task.id} 
                        task={task} 
                        schema={schema} // [V8] Passando Schema adiante
                        onClick={() => onEdit(task.id)} 
                    />
                ))}
                
                <button 
                    onClick={onAdd}
                    className="w-full py-3 rounded-sm border border-dashed border-white/10 text-[10px] uppercase tracking-widest text-muted-foreground/50 hover:text-muted-foreground hover:border-white/20 transition-all hover:bg-white/[0.02] flex items-center justify-center gap-2"
                >
                    <IconPlus className="w-3 h-3" /> {t('kanban_add_note')}
                </button>
            </div>
        </div>
    );
};

// --- VIEW PRINCIPAL ---

export default function KanbanView({ projectId, isMobile = false, mode = 'tasks' }) { 
    const { t } = useTranslations();
    const { openTaskOverlay } = useWorkspaceStore();

    // [V8 ENGINE] Agora pegamos também 'columns' (o Schema)
    const { items, columns, loading, actions } = useProjectEntities(projectId, mode);

    // Configuração de Colunas
    const COLUMNS = useMemo(() => ({
        todo: { id: 'todo', title: t('kanban_todo'), color: "#a8a29e", icon: IconCircle }, 
        in_progress: { id: 'in_progress', title: t('kanban_in_progress'), color: "#3b82f6", icon: IconClock }, 
        blocked: { id: 'blocked', title: t('kanban_blocked'), color: "#ef4444", icon: IconAlertTriangle }, 
        done: { id: 'done', title: t('kanban_done'), color: "#10b981", icon: IconCheckCircle } 
    }), [t]);

    const [activeDragItem, setActiveDragItem] = useState(null);

    // Filtros
    const [filterText, setFilterText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');

    // Modal State
    const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
    const [defaultStatus, setDefaultStatus] = useState('todo');

    // Filtragem Local
    const filteredTasks = useMemo(() => {
        return items.filter(t => {
            const matchText = (t.title || '').toLowerCase().includes(filterText.toLowerCase());
            const matchStatus = filterStatus === 'all' || !t.status || t.status === filterStatus;
            const matchPriority = filterPriority === 'all' || !t.priority || t.priority === filterPriority;
            return matchText && matchStatus && matchPriority;
        });
    }, [items, filterText, filterStatus, filterPriority]);

    const getTasksForColumn = (colId) => {
        return filteredTasks.filter(t => {
            let status = t.status || 'todo';
            if (status === 'concluido') status = 'done';
            if (status === 'a_fazer') status = 'todo';
            if (status === 'em_progresso') status = 'in_progress';
            return status === colId;
        });
    };

    // Handlers DND
    const handleDragStart = (e) => setActiveDragItem(e.active.data.current);

    const handleDragEnd = (e) => {
        const { active, over } = e;
        setActiveDragItem(null);

        if (!over) return;

        if (over.id.toString().startsWith('kanban-col-')) {
            const newStatus = over.data.current.status;
            const taskId = active.id;

            if (newStatus && taskId && active.data.current.status !== newStatus) {
                actions.update(taskId, { status: newStatus });
                toast.success("Movido.");
            }
        }
    };

    const openCreateModal = (status) => {
        setDefaultStatus(status);
        setIsCreationModalOpen(true);
    };

    const handleEditTask = (taskId) => {
        const task = items.find(t => t.id === taskId);
        if (task) {
            openTaskOverlay(task);
        }
    };

    if (loading && items.length === 0) return <PranaLoader text="Organizando o fluxo..." />;

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
            <div className="flex flex-col h-full bg-transparent relative overflow-hidden">
            
            <PageHeader 
                title={mode === 'records' ? "Dados" : "Flux"} // Ajuste de título dinâmico
                subtitle={projectId ? "Quadro do Projeto" : "Quadro Geral"}
                icon={IconFlux}
                actions={
                    !projectId && ( 
                        <Link to={createPageUrl("Chat")}>
                            <Button variant="outline" size="sm" className="gap-2 border-white/10 hover:bg-white/5">
                                <IconBrainCircuit className="w-4 h-4" /> Ash
                            </Button>
                        </Link>
                    )
                }
            />

            <FilterBar
                searchText={filterText}
                onSearchChange={setFilterText}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
                priorityFilter={filterPriority}
                onPriorityChange={setFilterPriority}
                onClearAll={() => {
                    setFilterText('');
                    setFilterStatus('all');
                    setFilterPriority('all');
                }}
            />
            
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 custom-scrollbar">
                <div className="flex h-full gap-6 min-w-max">
                    {Object.entries(COLUMNS).map(([columnId, column]) => (
                        <KanbanColumn
                            key={columnId}
                            id={columnId}
                            column={column}
                            tasks={getTasksForColumn(columnId)}
                            schema={columns} // [V8] Passa o schema da API
                            onEdit={handleEditTask}
                            onAdd={() => openCreateModal(columnId)}
                            t={t}
                        />
                    ))}
                </div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeDragItem ? (
                    <div style={{ width: 280, transform: 'rotate(3deg)' }}>
                        <PostitCard 
                            task={activeDragItem} 
                            schema={columns} // [V8] Passa schema
                            projects={[]} 
                        />
                    </div>
                ) : null}
            </DragOverlay>

            <PranaFormModal 
                isOpen={isCreationModalOpen} 
                onClose={() => setIsCreationModalOpen(false)} 
                onSave={() => actions.refresh()} // Refresh manual após criar (hook sincroniza auto, mas garante)
                itemType={mode === 'records' ? 'record' : 'task'}
                defaultProjectId={projectId} // Garante contexto
                initialData={{ status: defaultStatus }} 
            />
            </div>
        </DndContext>
    );
}