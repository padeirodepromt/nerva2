/* src/views/ListView.jsx
   desc: Visualização em Lista V8.0 (Unified Engine).
   feat: Tabela densa com Drag & Drop e suporte a Records/Tasks.
*/

import React, { useState, useMemo } from 'react';
import { useDraggable } from '@dnd-kit/core'; 
import { CSS } from '@dnd-kit/utilities';     

import { 
    IconSearch, IconChevronUp, IconChevronDown, 
    IconAlertCircle, IconCircle, IconCalendar, IconUser, IconDollarSign,
    IconGripVertical, IconCheck, IconDatabase, IconList
} from '@/components/icons/PranaLandscapeIcons';
import { useTranslations } from '@/components/LanguageProvider';

// [V8 ENGINE]
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

import { cn } from '@/lib/utils';
import PranaFormModal from '@/components/forms/PranaFormModal';
import { useSwipeGestures } from '@/hooks/useSwipeGestures';
import { toast } from 'sonner';
import FilterBar from '@/components/views/FilterBar';
import MobileFilterBar from '@/components/mobile/MobileFilterBar';
import PageHeader from '@/components/ui/PageHeader';
import { format } from 'date-fns';

// --- COMPONENTES AUXILIARES ---

const StatusBadge = ({ status, t }) => {
    const styles = {
        'todo': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
        'doing': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'in_progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        'review': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        'done': 'bg-green-500/10 text-green-400 border-green-500/20',
    };
    // Fallback para status desconhecido
    const style = styles[status] || styles['todo'];
    
    return (
        <span className={cn("px-2 py-0.5 rounded text-[10px] uppercase font-bold border tracking-wider", style)}>
            {t(`list_view_status_${status}`) || status}
        </span>
    );
};

const PriorityIndicator = ({ priority }) => {
    if (!priority) return <span className="opacity-20">-</span>;
    
    const colors = {
        'low': 'text-gray-500',
        'medium': 'text-blue-400',
        'high': 'text-orange-400',
        'critical': 'text-red-500'
    };
    const Icon = priority === 'high' || priority === 'critical' ? IconAlertCircle : IconCircle;

    return (
        <div className="flex items-center gap-1" title={`Prioridade: ${priority}`}>
            <Icon className={cn("w-3 h-3", colors[priority] || colors['medium'])} />
            <span className="text-xs capitalize text-muted-foreground">{priority}</span>
        </div>
    );
};

// --- COMPONENTE MOBILE COM SWIPE GESTURES ---
const MobileTaskRow = ({ task, onEdit, onComplete }) => {
    const [swiped, setSwiped] = useState(false);
    const { t } = useTranslations();

    const swipeGestures = useSwipeGestures({
        onSwipeLeft: () => setSwiped(true),
        onSwipeRight: () => setSwiped(false),
        onLongPress: onEdit,
        threshold: 30
    });

    return (
        <li
            className="relative overflow-hidden group border-b border-white/5 last:border-0"
            {...swipeGestures}
        >
            {/* Fundo de ações */}
            <div className={`absolute inset-y-0 right-0 flex items-center gap-2 px-3 bg-gradient-to-l from-emerald-600/90 to-emerald-600/40 transition-all duration-300 ${swiped ? 'w-24' : 'w-0'}`}>
                <button
                    onClick={() => { onComplete(); setSwiped(false); }}
                    className="flex items-center justify-center h-8 w-8 rounded hover:bg-emerald-700/50 transition-colors"
                    title="Completar"
                >
                    <IconCheck className="w-4 h-4 text-white" />
                </button>
            </div>

            {/* Card deslizável */}
            <div
                className={`flex flex-col gap-1 px-4 py-3 bg-background transition-transform duration-300 ${swiped ? 'translate-x-[-96px]' : 'translate-x-0'}`}
                style={{ transform: swiped ? 'translateX(-96px)' : 'translateX(0)' }}
                onClick={() => {
                    if (!swiped) onEdit();
                    else setSwiped(false);
                }}
            >
                <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-bold flex-1 truncate", task.status === 'done' && 'line-through opacity-60')}>
                        {task.title}
                    </span>
                    {task.status && <StatusBadge status={task.status} t={t} />}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1">
                    {task.priority && <PriorityIndicator priority={task.priority} />}
                    {task.dueDate && <span><IconCalendar className="inline w-3 h-3 mr-1 opacity-50" />{format(new Date(task.dueDate), 'dd/MM/yyyy')}</span>}
                    {task.assignee && <span className="flex items-center gap-1"><IconUser className="w-3 h-3" />{task.assignee}</span>}
                </div>
            </div>
        </li>
    );
};

// --- LINHA ARRASTÁVEL (DESKTOP) ---
const TaskRow = ({ task, index, onClick, showProject, mode, t }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { ...task } 
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.3 : 1,
        zIndex: isDragging ? 999 : 'auto',
    };

    return (
        <div 
            ref={setNodeRef}
            style={style}
            onClick={onClick}
            className="group flex items-center px-6 py-3 border-b border-white/10 hover:bg-card/50 cursor-pointer transition-colors text-sm relative"
        >
            {/* Grip de Arraste */}
            <div 
                {...listeners} 
                {...attributes}
                className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-50 hover:!opacity-100 cursor-grab active:cursor-grabbing text-gray-500 hover:text-white transition-opacity"
            >
                <IconGripVertical className="w-4 h-4" />
            </div>

            {/* Índice */}
            <div className="w-10 text-center opacity-30 text-xs font-mono group-hover:opacity-0 transition-opacity">
                {index + 1}
            </div>

            {/* Título */}
            <div className="flex-1 min-w-0 pr-4 pl-2">
                <span className={cn("font-medium truncate block font-serif", task.status === 'done' && "line-through opacity-50")}>
                    {task.title}
                </span>
                {showProject && task.projectTitle && (
                    <span className="text-[10px] text-blue-500 block truncate uppercase tracking-wider underline opacity-70">
                        {task.projectTitle}
                    </span>
                )}
            </div>

            {/* Colunas Condicionais baseadas no Modo */}
            {mode === 'tasks' ? (
                <>
                    <div className="w-32 shrink-0">
                        <StatusBadge status={task.status} t={t} />
                    </div>
                    <div className="w-32 shrink-0">
                        <PriorityIndicator priority={task.priority} />
                    </div>
                    <div className="w-32 shrink-0 text-xs text-gray-400 flex items-center gap-2">
                        {task.dueDate ? (
                            <>
                                <IconCalendar className="w-3 h-3 opacity-50" />
                                {format(new Date(task.dueDate), 'dd/MM/yyyy')}
                            </>
                        ) : <span className="opacity-20">-</span>}
                    </div>
                    <div className="w-32 shrink-0 flex items-center gap-2 text-xs text-gray-400">
                        {task.assignee ? (
                            <>
                                <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[9px]">{task.assignee[0]}</div>
                                <span className="truncate">{task.assignee}</span>
                            </>
                        ) : <span className="opacity-20">-</span>}
                    </div>
                </>
            ) : (
                // Modo Records: Colunas Genéricas (simplificado para ListView)
                <div className="w-full max-w-[400px] flex gap-4 text-xs text-muted-foreground opacity-70 truncate">
                    {/* Exibe algumas propriedades chave se existirem */}
                    {Object.entries(task.properties || {}).slice(0, 3).map(([key, val]) => (
                        <span key={key} className="truncate" title={`${key}: ${val}`}>
                            <span className="opacity-50 mr-1">{key}:</span>{val}
                        </span>
                    ))}
                </div>
            )}

            {/* ROI (Se existir) */}
            <div className="w-24 shrink-0 text-right pr-4 text-xs font-mono text-emerald-400 opacity-80">
                {task.customData?.roi ? (
                    <span className="flex items-center justify-end gap-1">
                        <IconDollarSign className="w-3 h-3" /> {task.customData.roi}
                    </span>
                ) : null}
            </div>
        </div>
    );
};

// --- COMPONENTE PRINCIPAL ---

export default function ListView({ projectId, filter: propFilter, isMobile = false, mode = 'tasks' }) {
    const { t } = useTranslations();
    const { openTaskOverlay } = useWorkspaceStore();
    
    // [V8 ENGINE] Hook Unificado
    const { items, loading, actions } = useProjectEntities(projectId, mode);

    const [searchText, setSearchText] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
    
    // Config do Modal de Criação Rápida (para Mobile ou botão flutuante)
    const [createModalOpen, setCreateModalOpen] = useState(false);

    // 2. FILTRAGEM E ORDENAÇÃO
    const processedTasks = useMemo(() => {
        if (!items) return [];
        let result = [...items];

        if (searchText) {
            const lower = searchText.toLowerCase();
            result = result.filter(t => t.title.toLowerCase().includes(lower));
        }
        if (filterStatus !== 'all') {
            result = result.filter(t => t.status === filterStatus);
        }
        if (filterPriority !== 'all') {
            result = result.filter(t => t.priority === filterPriority);
        }

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];

                if (sortConfig.key === 'dueDate' || sortConfig.key === 'createdAt') {
                    aVal = aVal ? new Date(aVal).getTime() : 0; 
                    bVal = bVal ? new Date(bVal).getTime() : 0;
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [items, searchText, filterStatus, filterPriority, sortConfig]);

    const handleSort = (key) => {
        setSortConfig(current => ({
            key,
            direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleEditTask = (task) => {
        openTaskOverlay(task);
    };

    const handleCreate = async (data) => {
        await actions.create({ ...data, project_id: projectId });
        setCreateModalOpen(false);
    };

    if (isMobile) {
        if (loading && items.length === 0) return <div className="flex h-full items-center justify-center opacity-50"><IconSearch className="animate-pulse w-6 h-6"/></div>;
        return (
            <div className="h-full w-full flex flex-col bg-transparent relative overflow-hidden">
                <MobileFilterBar
                    searchText={searchText}
                    onSearchChange={setSearchText}
                    statusFilter={filterStatus}
                    onStatusChange={setFilterStatus}
                    priorityFilter={filterPriority}
                    onPriorityChange={setFilterPriority}
                    onClearAll={() => {
                        setSearchText('');
                        setFilterStatus('all');
                        setFilterPriority('all');
                    }}
                />
                <div className="flex-1 overflow-auto prana-scrollbar relative bg-background">
                    <ul className="flex flex-col">
                        {processedTasks.map((task, idx) => (
                            <MobileTaskRow 
                                key={task.id} 
                                task={task} 
                                onEdit={() => handleEditTask(task)} 
                                onComplete={() => actions.update(task.id, { status: 'done' })}
                            />
                        ))}
                    </ul>
                </div>
                {/* Botão Flutuante de Criação */}
                <button 
                    onClick={() => setCreateModalOpen(true)}
                    className="absolute bottom-6 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
                >
                    <IconSearch className="w-5 h-5 rotate-45" /> {/* Usando IconSearch como Plus rotacionado se não tiver IconPlus importado, ou adicione IconPlus */}
                </button>

                <PranaFormModal 
                    isOpen={createModalOpen} 
                    onClose={() => setCreateModalOpen(false)}
                    type={mode === 'records' ? 'record' : 'task'}
                    onSave={handleCreate}
                />
            </div>
        );
    }

    if (loading && items.length === 0) return <div className="flex h-full items-center justify-center opacity-50"><IconSearch className="animate-pulse w-6 h-6"/></div>;

    return (
        <div className="flex flex-col h-full bg-background text-foreground overflow-hidden">
            
            <PageHeader 
                title={mode === 'records' ? "Inventário" : t('list_view_title')} 
                subtitle={`${items.length} itens`}
                icon={mode === 'records' ? IconDatabase : IconList}
            />

            <FilterBar
                searchText={searchText}
                onSearchChange={setSearchText}
                statusFilter={filterStatus}
                onStatusChange={setFilterStatus}
                priorityFilter={filterPriority}
                onPriorityChange={setFilterPriority}
                onClearAll={() => {
                    setSearchText('');
                    setFilterStatus('all');
                    setFilterPriority('all');
                }}
            />

            {/* HEADER DA TABELA */}
            <div className="flex items-center px-6 py-2 bg-card/50 border-b border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground select-none">
                <div className="w-10 text-center">#</div>
                <div className="flex-1 cursor-pointer hover:text-white flex items-center gap-1 pl-2" onClick={() => handleSort('title')}>
                    {mode === 'records' ? "Registro" : "Tarefa"} 
                    {sortConfig.key === 'title' && (sortConfig.direction === 'asc' ? <IconChevronUp className="w-3 h-3"/> : <IconChevronDown className="w-3 h-3"/>)}
                </div>
                
                {mode === 'tasks' ? (
                    <>
                        <div className="w-32 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('status')}>
                            Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <IconChevronUp className="w-3 h-3"/> : <IconChevronDown className="w-3 h-3"/>)}
                        </div>
                        <div className="w-32 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('priority')}>
                            Prioridade {sortConfig.key === 'priority' && (sortConfig.direction === 'asc' ? <IconChevronUp className="w-3 h-3"/> : <IconChevronDown className="w-3 h-3"/>)}
                        </div>
                        <div className="w-32 cursor-pointer hover:text-white flex items-center gap-1" onClick={() => handleSort('dueDate')}>
                            Prazo {sortConfig.key === 'dueDate' && (sortConfig.direction === 'asc' ? <IconChevronUp className="w-3 h-3"/> : <IconChevronDown className="w-3 h-3"/>)}
                        </div>
                        <div className="w-32">Responsável</div>
                    </>
                ) : (
                    <div className="w-full max-w-[400px]">Dados</div>
                )}
                
                <div className="w-24 text-right pr-4">ROI</div>
            </div>

            {/* CORPO DA TABELA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar bg-background">
                {processedTasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 gap-2">
                        <IconCheck className="w-12 h-12" />
                        <span className="text-sm">Nenhum item encontrado.</span>
                    </div>
                ) : (
                    processedTasks.map((task, index) => (
                        <TaskRow 
                            key={task.id}
                            task={task}
                            index={index}
                            onClick={() => handleEditTask(task)}
                            showProject={!projectId}
                            mode={mode}
                            t={t}
                        />
                    ))
                )}
            </div>
        </div>
    );
}