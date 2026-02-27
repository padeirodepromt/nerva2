/* src/views/CalendarView.jsx
   desc: Cosmos V10 (Temporal Master).
   feat: Drag & Drop entre dias, Sidebar de Backlog, Filtros e Fusão Task/Event.
   arch: V8 Engine (useProjectEntities) + V10 Multiverso.
   status: INTEGRAL - SEM OMISSÕES.
*/
import React, { useState, useMemo, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, 
    isSameMonth, isToday, parseISO, addDays, subMonths, addMonths, isSameDay
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTranslations } from '@/components/LanguageProvider';

// [V10 ENGINE]
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Event as EventAPI, Task as TaskAPI } from '@/api/entities'; 

// UI COMPONENTS
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import PranaLoader from '@/components/PranaLoader';
import PageHeader from '@/components/ui/PageHeader';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// ÍCONES EXISTENTES (PranaLandscapeIcons)
import { 
    IconCosmos, IconChevronLeft, IconChevronRight, IconPlus, 
    IconList, IconCronos, IconZap, IconWind 
} from '@/components/icons/PranaLandscapeIcons';

// ============================================================================
// SUB-COMPONENTES DE INTERFACE
// ============================================================================

/**
 * Renderiza um Evento (Âncora Rígida) no calendário.
 * Eventos ocupam espaço e não são arrastáveis para manter a rigidez temporal.
 */
const CalendarEventAnchor = ({ event, onClick }) => {
    const isProfessional = event.realmId === 'professional';
    
    return (
        <div 
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={cn(
                "group relative flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-all border border-transparent mb-1 shadow-sm",
                isProfessional 
                    ? "bg-indigo-500/20 text-indigo-200 border-l-2 border-l-indigo-500 hover:bg-indigo-500/30" 
                    : "bg-emerald-500/20 text-emerald-200 border-l-2 border-l-emerald-500 hover:bg-emerald-500/30"
            )}
        >
            <IconCronos className="w-2.5 h-2.5 opacity-70" />
            <span className="truncate flex-1 font-sans tracking-tight">{event.title}</span>
            <span className="text-[8px] opacity-40 font-mono">
                {format(new Date(event.startTime), 'HH:mm')}
            </span>
        </div>
    );
};

/**
 * Renderiza uma Tarefa (Ação Flexível) arrastável.
 */
const DraggableCalendarTask = ({ task, color, onClick }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { ...task, type: 'CALENDAR_TASK' }
    });

    const isProfessional = task.realmId === 'professional' || task.project?.realmId === 'professional';

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    if (isDragging) {
        return (
            <div ref={setNodeRef} style={style} className="opacity-10 h-7 bg-white/10 rounded border border-dashed border-white/20 mb-1" />
        );
    }

    return (
        <div 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={cn(
                "group relative flex items-center gap-2 px-2 py-1.5 rounded text-[10px] cursor-grab active:cursor-grabbing hover:bg-white/10 transition-all border border-transparent hover:border-white/5 mb-1",
                isProfessional ? "bg-white/[0.03] text-indigo-100/80" : "bg-white/[0.03] text-emerald-100/80",
                task.status === 'done' && "opacity-40"
            )}
            style={{ borderLeft: `2px solid ${task.status === 'done' ? '#4ade80' : (color || (isProfessional ? '#818cf8' : '#34d399'))}` }}
        >
            <IconZap className={cn("w-2 h-2 shrink-0", task.status === 'done' ? "text-emerald-400" : "text-primary")} />
            <span className={cn("truncate font-medium flex-1", task.status === 'done' && "line-through")}>
                {task.title}
            </span>
        </div>
    );
};

/**
 * Célula do Grid (Droppable)
 */
const DroppableDay = ({ day, children, isCurrentMonth, isTodayCell, onClick }) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const { setNodeRef, isOver } = useDroppable({ 
        id: dateKey,
        data: { date: dateKey }
    });

    return (
        <motion.div
            ref={setNodeRef}
            layout
            onClick={onClick}
            className={cn(
                "relative border-r border-b border-white/5 p-2 flex flex-col gap-0.5 min-h-[130px] transition-all duration-300 group overflow-hidden",
                !isCurrentMonth ? "opacity-20 bg-black/20" : "hover:bg-white/[0.02] bg-transparent",
                isTodayCell && "bg-primary/[0.03]",
                isOver && "bg-primary/10 ring-1 ring-inset ring-primary/40"
            )}
        >
            <div className="flex justify-between items-start mb-1">
                <span className={cn(
                    "text-[11px] font-mono font-bold transition-all",
                    isTodayCell ? "text-primary scale-125 ml-1" : "text-zinc-600 group-hover:text-zinc-400"
                )}>
                    {format(day, 'd')}
                </span>
                {isTodayCell && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.8)]" />}
            </div>
            
            <div className="flex-1 overflow-hidden">
                {children}
            </div>

            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-all">
                <div className="p-1 rounded-md bg-white/5 hover:bg-primary/20 text-zinc-500 hover:text-white">
                    <IconPlus className="w-3 h-3" />
                </div>
            </div>
        </motion.div>
    );
};

// ============================================================================
// VIEW PRINCIPAL: COSMOS
// ============================================================================

export default function CalendarView({ projectId, isMobile: isMobileProp }) {
    const isMobile = typeof isMobileProp === 'boolean' ? isMobileProp : useIsMobile();
    const { t } = useTranslations();
    
    // CONSCIÊNCIA DE WORKSPACE V10
    const { 
        openTaskOverlay, 
        openSmartModal, 
        activeRealmId, 
        isUnifiedView, 
        toggleUnifiedView 
    } = useWorkspaceStore(); 
    
    // GESTÃO DE ESTADOS
    const [currentDate, setCurrentDate] = useState(new Date());
    const [filterText, setFilterText] = useState('');
    const [showBacklog, setShowBacklog] = useState(true);
    const [selectedDate, setSelectedDate] = useState(null);
    const [isDayOpen, setIsDayOpen] = useState(false); 
    const [activeDragItem, setActiveDragItem] = useState(null);

    // ENGINE V8 (Tasks)
    const { items: tasks, loading: tasksLoading, actions } = useProjectEntities(projectId, 'tasks');
    
    // ENGINE V10 (Events/Anchors)
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    // CARREGAMENTO DE ÂNCORAS TEMPORAIS
    const loadEvents = async () => {
        setEventsLoading(true);
        try {
            const data = await EventAPI.list({ realmId: activeRealmId });
            setEvents(data);
        } catch (err) {
            console.error("Cosmos Error: Falha ao sincronizar âncoras.", err);
            toast.error("Erro ao carregar eventos do calendário.");
        } finally {
            setEventsLoading(false);
        }
    };

    useEffect(() => {
        loadEvents();
    }, [activeRealmId, currentDate]);

    // LÓGICA DE CALENDÁRIO (Cálculo de Dias)
    const calendarDays = useMemo(() => {
        const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
        return eachDayOfInterval({ start, end });
    }, [currentDate]);

    // FUSÃO NEURAL: Agrupamento de Ações e Âncoras com Poda Radical
    const { dataByDate, backlogTasks } = useMemo(() => {
        const map = {};
        const backlog = [];
        
        if (!tasks) return { dataByDate: {}, backlogTasks: [] };

        // 1. Processamento de Tasks (Ações)
        tasks.forEach(task => {
            if (filterText && !task.title.toLowerCase().includes(filterText.toLowerCase())) return;
            
            const itemRealm = task.realmId || task.project?.realmId;
            const matchesRealm = isUnifiedView || activeRealmId === 'all' || itemRealm === activeRealmId;
            if (!matchesRealm) return;

            const dateStr = task.dueDate || task.due_date;
            if (dateStr) {
                const dateKey = dateStr.split('T')[0];
                if (!map[dateKey]) map[dateKey] = { tasks: [], events: [] };
                map[dateKey].tasks.push(task);
            } else {
                backlog.push(task);
            }
        });

        // 2. Processamento de Events (Âncoras)
        events.forEach(event => {
            if (filterText && !event.title.toLowerCase().includes(filterText.toLowerCase())) return;
            
            const matchesRealm = isUnifiedView || activeRealmId === 'all' || event.realmId === activeRealmId;
            if (!matchesRealm) return;

            const dateKey = format(new Date(event.startTime), 'yyyy-MM-dd');
            if (!map[dateKey]) map[dateKey] = { tasks: [], events: [] };
            map[dateKey].events.push(event);
        });

        return { dataByDate: map, backlogTasks: backlog };
    }, [tasks, events, filterText, activeRealmId, isUnifiedView]);

    // HANDLERS DE ARRASTO (DND)
    const handleDragStart = (e) => setActiveDragItem(e.active.data.current);

    const handleDragEnd = async (e) => {
        const { active, over } = e;
        setActiveDragItem(null);
        if (!over) return;

        const taskId = active.id;
        
        // Zona de Backlog (Remover data)
        if (over.id === 'backlog-zone') {
            await actions.update(taskId, { dueDate: null });
            toast.success("Mergulhado no Backlog.");
            return;
        }

        // Zona de Dia (Reagendar)
        const newDate = over.data.current?.date; 
        if (newDate) {
            try {
                await actions.update(taskId, { dueDate: newDate });
                toast.success(`Sincronizado para ${format(parseISO(newDate), 'dd/MM', { locale: ptBR })}`);
            } catch (err) {
                toast.error("Erro na manifestação temporal.");
            }
        }
    };

    // INTERAÇÕES DE CLIQUE
    const handleDayClick = (day) => {
        setSelectedDate(day);
        setIsDayOpen(true);
    };

    const handleCreateOnDate = (type) => {
        openSmartModal(type, { 
            initialDate: selectedDate,
            realmId: activeRealmId !== 'all' ? activeRealmId : 'personal'
        });
        setIsDayOpen(false);
    };

    const handleEditTask = (task) => openTaskOverlay(task);
    const handleEditEvent = (event) => openSmartModal('event', event);

    const getTaskColor = (task) => task.projectColor || task.color || '#6366f1';

    // LOADING STATE
    if ((tasksLoading || eventsLoading) && tasks.length === 0) {
        return <PranaLoader text="Sincronizando o Cosmos..." />;
    }

    const selectedDateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    const selectedDayData = selectedDateKey ? (dataByDate[selectedDateKey] || { tasks: [], events: [] }) : { tasks: [], events: [] };

    // ============================================================================
    // RENDER: MOBILE
    // ============================================================================
    if (isMobile) {
        return (
            <div className="h-full w-full flex flex-col bg-background relative overflow-hidden font-sans">
                <div className="flex items-center justify-between px-6 py-6 border-b border-white/5 bg-background/80 backdrop-blur-md z-10">
                    <div>
                        <h1 className="font-serif text-2xl font-bold italic text-white/90 leading-none">Cosmos</h1>
                        <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-1">{activeRealmId}</p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="icon" variant="ghost" className="h-10 w-10 bg-white/5 rounded-xl" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                            <IconChevronLeft className="w-5 h-5"/>
                        </Button>
                        <Button size="icon" variant="ghost" className="h-10 w-10 bg-white/5 rounded-xl" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                            <IconChevronRight className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 prana-scrollbar">
                    {calendarDays.filter(d => isSameMonth(d, currentDate) || isToday(d)).map(day => {
                        const dateKey = format(day, 'yyyy-MM-dd');
                        const dayData = dataByDate[dateKey] || { tasks: [], events: [] };
                        if (dayData.tasks.length === 0 && dayData.events.length === 0 && !isToday(day)) return null;
                        
                        return (
                            <div key={dateKey} onClick={() => handleDayClick(day)} className={cn(
                                "p-4 rounded-2xl border transition-all duration-500",
                                isToday(day) ? "bg-primary/5 border-primary/20 shadow-glow-sm" : "bg-white/[0.02] border-white/5"
                            )}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className={cn("text-[10px] font-black uppercase tracking-[0.2em]", isToday(day) ? "text-primary" : "opacity-40")}>
                                        {format(day, 'EEEE, dd', { locale: ptBR })}
                                    </span>
                                    {isToday(day) && <Badge className="bg-primary text-[8px] h-4">HOJE</Badge>}
                                </div>
                                
                                {dayData.events.map(e => (
                                    <CalendarEventAnchor key={e.id} event={e} onClick={() => handleEditEvent(e)} />
                                ))}
                                {dayData.tasks.map(t => (
                                    <DraggableCalendarTask key={t.id} task={t} color={getTaskColor(t)} onClick={() => handleEditTask(t)} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ============================================================================
    // RENDER: DESKTOP
    // ============================================================================
    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
            <div className="h-full w-full flex flex-col relative overflow-hidden bg-background font-sans">
                
                {/* CABEÇALHO DE CONTROLE */}
                <PageHeader 
                    title={projectId ? "Cronograma" : "Cosmos V10"}
                    subtitle={format(currentDate, 'MMMM yyyy', { locale: ptBR })}
                    icon={IconCosmos}
                    actions={
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/10">
                                <button 
                                    onClick={() => isUnifiedView && toggleUnifiedView()} 
                                    className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all", !isUnifiedView ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
                                >Focado</button>
                                <button 
                                    onClick={() => !isUnifiedView && toggleUnifiedView()} 
                                    className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-full transition-all", isUnifiedView ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300")}
                                >Unificado</button>
                            </div>

                            <div className="flex items-center gap-1 bg-white/5 rounded-xl p-1 border border-white/10">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
                                    <IconChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 text-[10px] px-4 font-black text-zinc-500 hover:text-white" onClick={() => setCurrentDate(new Date())}>
                                    HOJE
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-white" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
                                    <IconChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    }
                />

                <div className="flex-1 flex overflow-hidden border-t border-white/5">
                    
                    {/* GRID DO CALENDÁRIO */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* Dias da Semana */}
                        <div className="grid grid-cols-7 bg-white/[0.01] py-3 shrink-0 border-b border-white/5">
                            {['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'].map(d => (
                                <div key={d} className="text-center text-[9px] font-black tracking-[0.4em] opacity-20">{d}</div>
                            ))}
                        </div>
                        
                        {/* Corpo do Calendário */}
                        <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto no-scrollbar bg-black/5"> 
                            {calendarDays.map((day) => {
                                const dateKey = format(day, 'yyyy-MM-dd');
                                const dayData = dataByDate[dateKey] || { tasks: [], events: [] };
                                
                                return (
                                    <DroppableDay 
                                        key={dateKey} 
                                        day={day} 
                                        isCurrentMonth={isSameMonth(day, currentDate)} 
                                        isTodayCell={isToday(day)} 
                                        onClick={() => handleDayClick(day)}
                                    >
                                        <div className="space-y-0.5">
                                            {dayData.events.map(e => (
                                                <CalendarEventAnchor key={e.id} event={e} onClick={() => handleEditEvent(e)} />
                                            ))}
                                            {dayData.tasks.map(t => (
                                                <DraggableCalendarTask key={t.id} task={t} color={getTaskColor(t)} onClick={() => handleEditTask(t)} />
                                            ))}
                                        </div>
                                    </DroppableDay>
                                );
                            })}
                        </div>
                    </div>

                    {/* BARRA LATERAL DE BACKLOG (DROPPABLE) */}
                    <AnimatePresence>
                        {showBacklog && (
                            <motion.div 
                                initial={{ width: 0, opacity: 0 }} 
                                animate={{ width: 320, opacity: 1 }} 
                                exit={{ width: 0, opacity: 0 }} 
                                className="border-l border-white/5 bg-black/10 backdrop-blur-md flex flex-col"
                            >
                                <BacklogSidebar 
                                    tasks={backlogTasks} 
                                    getTaskColor={getTaskColor} 
                                    onEdit={handleEditTask} 
                                    t={t} 
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* OVERLAY DE ARRASTO */}
                <DragOverlay dropAnimation={null}>
                    {activeDragItem ? (
                        <div className="bg-zinc-900 border border-primary/40 p-3 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] rotate-3 w-[220px] border-l-4 border-l-primary scale-110 backdrop-blur-xl z-[1000]">
                            <p className="text-[11px] font-bold text-white tracking-tight">{activeDragItem.title}</p>
                            <p className="text-[8px] uppercase font-black text-primary mt-1 opacity-50">Movendo Ação...</p>
                        </div>
                    ) : null}
                </DragOverlay>

                {/* DIÁLOGO DE DETALHES DO DIA */}
                <Dialog open={isDayOpen} onOpenChange={setIsDayOpen}>
                    <DialogContent className="sm:max-w-[480px] bg-zinc-950 border-white/10 p-0 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
                        <div className="p-8 border-b border-white/5 bg-white/[0.01] flex justify-between items-center">
                            <div>
                                <DialogTitle className="font-serif text-3xl italic text-white/90 leading-none">
                                    {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
                                </DialogTitle>
                                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">Gestão de Fluxo Temporal</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleCreateOnDate('event')} className="h-9 text-[9px] font-black uppercase tracking-widest border-white/10 hover:bg-indigo-500/20 hover:text-indigo-200 transition-all"> 
                                    <IconCronos className="w-3 h-3 mr-2"/> + ÂNCORA 
                                </Button>
                                <Button size="sm" onClick={() => handleCreateOnDate('task')} className="h-9 text-[9px] font-black uppercase tracking-widest bg-primary hover:bg-primary/80 shadow-glow-sm transition-all"> 
                                    <IconZap className="w-3 h-3 mr-2"/> + AÇÃO 
                                </Button>
                            </div>
                        </div>
                        
                        <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto prana-scrollbar bg-black/20">
                            {selectedDayData.events.length === 0 && selectedDayData.tasks.length === 0 ? (
                                <div className="text-center py-16 opacity-20 flex flex-col items-center gap-4">
                                    <IconWind className="w-12 h-12 stroke-[1px]"/>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">{t('calendar_empty') || 'Vácuo Temporal'}</p>
                                </div>
                            ) : (
                                <>
                                    {/* Lista de Âncoras */}
                                    {selectedDayData.events.map(e => (
                                        <div key={e.id} onClick={() => handleEditEvent(e)} className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-4 cursor-pointer hover:bg-indigo-500/10 transition-all group">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                                <IconCronos className="w-5 h-5"/>
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-sm font-bold text-indigo-100">{e.title}</h4>
                                                <p className="text-[10px] opacity-40 uppercase font-black mt-0.5">{format(new Date(e.startTime), 'HH:mm')} • Âncora Rígida</p>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Lista de Ações */}
                                    {selectedDayData.tasks.map(t => (
                                        <div key={t.id} onClick={() => handleEditTask(t)} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4 cursor-pointer hover:bg-white/[0.04] transition-all group">
                                            <div className={cn("w-2 h-2 rounded-full", t.realmId === 'professional' ? "bg-indigo-500" : "bg-emerald-500")} />
                                            <div className="flex-1">
                                                <h4 className={cn("text-sm font-medium", t.status === 'done' ? "line-through opacity-30" : "text-white")}>{t.title}</h4>
                                                <p className="text-[9px] opacity-30 uppercase font-bold mt-0.5">{t.projectTitle || 'Fluxo Geral'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                        
                        <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
                             <p className="text-[8px] uppercase font-black tracking-[0.5em] opacity-10">Prana Cosmos Protocol • V10.2</p>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </DndContext>
    );
}

/**
 * Sidebar de Backlog (Tarefas sem prazo)
 */
const BacklogSidebar = ({ tasks, getTaskColor, onEdit, t }) => {
    const { setNodeRef, isOver } = useDroppable({ id: 'backlog-zone' });
    
    return (
        <div ref={setNodeRef} className={cn("h-full flex flex-col p-6 transition-colors duration-500", isOver && "bg-primary/5")}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <IconList className="w-4 h-4 text-primary opacity-50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">{t('calendar_no_deadline') || 'Backlog Mental'}</span>
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-white/10 px-2 py-0">{tasks.length}</Badge>
            </div>
            
            <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar pr-2">
                {tasks.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center px-4">
                        <IconWind className="w-8 h-8 opacity-10 mb-2" />
                        <span className="text-[10px] uppercase font-black opacity-10 tracking-widest leading-relaxed">
                            {t('calendar_all_scheduled') || 'Todas as ações manifestadas no tempo'}
                        </span>
                    </div>
                ) : (
                    tasks.map(t => (
                        <DraggableCalendarTask 
                            key={t.id} 
                            task={t} 
                            color={getTaskColor(t)} 
                            onClick={() => onEdit(t)} 
                        />
                    ))
                )}
            </div>
            
            {isOver && (
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className="mt-6 p-6 border-2 border-dashed border-primary/30 rounded-3xl text-center bg-primary/5 shadow-glow-sm"
                >
                    <IconZap className="w-6 h-6 text-primary mx-auto mb-2 animate-pulse" />
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">Mergulhar no Limbo</p>
                </motion.div>
            )}
        </div>
    );
};