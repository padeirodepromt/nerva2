/* src/views/PlannerView.jsx
   desc: Cronos V10 (Time Matrix - Planner).
   feat: Drag & Drop, Integração de Universos (Realms), Visão Unificada/Focada.
   V10 INTEGRATION: Fusão de Ações (Tasks) e Âncoras (Events) no tecido temporal.
*/
import React, { useState, useMemo, useEffect } from 'react';
import { startOfWeek, addDays, format, isToday, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DndContext, useDraggable, useDroppable, DragOverlay, closestCenter } from '@dnd-kit/core';
import { toast } from 'sonner';

// [V10 ENGINE]
import { useProjectEntities } from '@/hooks/useProjectEntities';
import { useRoutines } from '@/hooks/useRoutines';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useTranslations } from '@/components/LanguageProvider';
import { useAuth } from '@/hooks/useAuth';
import { Event as EventAPI } from '@/api/entities'; // Importação do novo braço de eventos

// API & UI
import PranaLoader from '@/components/PranaLoader';
import PageHeader from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Ícones
import { 
    IconCronos, IconChevronLeft, IconChevronRight, IconPlus, 
    IconRiver, IconMountain, IconWind, IconVoid, IconZap, IconLayers, IconClock
} from '@/components/icons/PranaLandscapeIcons';
import { Anchor } from 'lucide-react';

const CELL_HEIGHT = 96; 
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 às 21:00
const WEEK_DAY_KEYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// --- SUB-COMPONENTES DND ---

// [V10] ÂNCORA (Evento Rígido - Não Draggable por padrão para manter a "Ridez")
const StaticEvent = ({ event }) => {
    const isProfessional = event.realmId === 'professional';
    return (
        <div className={cn(
            "relative h-full bg-primary/10 border-l-4 rounded-md p-2 shadow-lg flex flex-col justify-between overflow-hidden",
            isProfessional ? "border-l-indigo-500 bg-indigo-500/10" : "border-l-emerald-500 bg-emerald-500/10"
        )}>
            <div className="flex justify-between items-start">
                <span className="text-[7px] font-black uppercase tracking-widest opacity-60 flex items-center gap-1">
                    <Anchor className="w-2 h-2" /> ÂNCORA
                </span>
                <span className="text-[8px] font-mono font-bold opacity-50">
                    {format(new Date(event.startTime), 'HH:mm')}
                </span>
            </div>
            <p className="text-[10px] font-bold leading-tight text-white truncate">
                {event.title}
            </p>
        </div>
    );
};

// [V10] AÇÃO (Tarefa Flexível - Draggable)
const DraggableTask = ({ task, projectColor }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { ...task, projectColor }
    });
    
    const isProfessional = task.realmId === 'professional' || task.project?.realmId === 'professional';
    
    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    if (isDragging) {
        return <div ref={setNodeRef} style={style} className="opacity-10 h-full bg-white/5 rounded-md border border-dashed border-white/20" />;
    }

    return (
        <div 
            ref={setNodeRef} 
            {...listeners} 
            {...attributes} 
            className={cn(
                "relative group h-full bg-zinc-900/60 backdrop-blur-md border border-white/5 rounded-md p-2 cursor-grab active:cursor-grabbing transition-all hover:bg-zinc-800 shadow-xl flex flex-col justify-center overflow-hidden",
                "border-l-2",
                isProfessional ? "border-l-indigo-500/50" : "border-l-emerald-500/50"
            )}
        >
            <p className="text-[11px] font-medium leading-tight text-zinc-200 line-clamp-2">
                {task.title}
            </p>
            
            <div className="flex items-center gap-2 mt-1 opacity-40 group-hover:opacity-100 transition-opacity">
                <span className={cn(
                    "text-[7px] font-black uppercase tracking-[0.2em]",
                    isProfessional ? "text-indigo-400" : "text-emerald-400"
                )}>
                    {isProfessional ? 'PRO' : 'LIFE'}
                </span>
            </div>
        </div>
    );
};

const TimeSlot = ({ id, day, hour, children, routine, onAddTask }) => {
    const { setNodeRef, isOver } = useDroppable({ id, data: { day, hour } });

    const isBlock = routine?.behavior === 'block'; 
    const isHabit = routine?.behavior === 'habit'; 

    return (
        <div 
            ref={setNodeRef} 
            style={{ height: CELL_HEIGHT }}
            className={cn(
                "relative border-b border-r border-white/5 transition-colors duration-500 group",
                isOver ? "bg-primary/5" : "hover:bg-white/[0.01]",
                isBlock && "bg-indigo-500/[0.03]",
                isHabit && "bg-emerald-500/[0.03]"
            )}
        >
            {routine && (
                <div className="absolute inset-x-1 top-1 bottom-1 flex items-start justify-center pt-2 opacity-10 pointer-events-none">
                    <div className="flex flex-col items-center">
                        <span className="text-[6px] font-black uppercase tracking-[0.3em] vertical-text">
                            {routine.title}
                        </span>
                    </div>
                </div>
            )}
            
            <div className="relative z-10 h-full p-1 flex flex-col gap-1">
                {children}
            </div>

            <button 
                onClick={() => onAddTask && onAddTask(day, hour)}
                className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-40 hover:opacity-100 transition-all z-20 text-zinc-500"
            >
                <IconPlus className="w-3 h-3" />
            </button>
        </div>
    );
};

// --- VIEW PRINCIPAL ---

export default function PlannerView({ isMobile = false }) {
    const { user } = useAuth();
    const { t } = useTranslations();
    const { 
        activeRealmId, 
        isUnifiedView, 
        toggleUnifiedView, 
        openSmartModal, 
        openRoutineManager 
    } = useWorkspaceStore();
    
    // [V10] Hooks de Dados
    const { items: tasks, loading: tasksLoading, actions } = useProjectEntities(null, 'tasks');
    const { routines, loading: routinesLoading } = useRoutines();
    
    // [V10] Estado local para Eventos (Âncoras)
    const [events, setEvents] = useState([]);
    const [eventsLoading, setEventsLoading] = useState(true);

    const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [activeDragItem, setActiveDragItem] = useState(null);
    const [selectedDayMobile, setSelectedDayMobile] = useState(new Date());

    // Carregamento de Eventos (Âncoras)
    useEffect(() => {
        const fetchEvents = async () => {
            setEventsLoading(true);
            try {
                const data = await EventAPI.list({ realmId: activeRealmId });
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            } finally {
                setEventsLoading(false);
            }
        };
        fetchEvents();
    }, [activeRealmId, weekStart]);

    // --- FILTRAGEM DE UNIVERSO V10 ---
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (isUnifiedView || activeRealmId === 'all') return true;
            return (task.realmId || task.project?.realmId) === activeRealmId;
        });
    }, [tasks, activeRealmId, isUnifiedView]);

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            if (isUnifiedView || activeRealmId === 'all') return true;
            return event.realmId === activeRealmId;
        });
    }, [events, activeRealmId, isUnifiedView]);

    const handleDragStart = (e) => setActiveDragItem(e.active.data.current);

    const handleDragEnd = async (e) => {
        const { active, over } = e;
        setActiveDragItem(null);
        if (!over) return;

        const taskId = active.id;
        const { day, hour } = over.data.current || {};
        
        try {
            await actions.update(taskId, { 
                plannerSlot: { day, time: `${String(hour).padStart(2,'0')}:00` } 
            });
            toast.success("Ação manifestada no tempo.");
        } catch (err) { toast.error("Falha na sincronização temporal."); }
    };

    const getRoutineForSlot = (dayIndex, hour) => {
        return routines.find(r => hour >= r.startHour && hour < r.endHour && (r.days || []).includes(dayIndex));
    };

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    if (tasksLoading || routinesLoading || eventsLoading) return <PranaLoader text="Mapeando geometria do tempo..." />;

    // --- RENDERIZADOR DE SLOT (FUSÃO TASK + EVENT) ---
    const renderSlotContent = (dayKey, hour, date) => {
        return (
            <>
                {/* 1. Renderizar Âncoras (Events) - Prioridade Visual */}
                {filteredEvents
                    .filter(e => {
                        const eventDate = new Date(e.startTime);
                        const eventHour = eventDate.getHours();
                        return isSameDay(eventDate, date) && eventHour === hour;
                    })
                    .map(e => <StaticEvent key={e.id} event={e} />)
                }
                
                {/* 2. Renderizar Ações (Tasks) - Flexibilidade Draggable */}
                {filteredTasks
                    .filter(t => t.plannerSlot?.day === dayKey && parseInt(t.plannerSlot?.time) === hour)
                    .map(t => <DraggableTask key={t.id} task={t} />)
                }
            </>
        );
    };

    // --- RENDER MOBILE ---
    if (isMobile) {
        const dayKey = WEEK_DAY_KEYS[selectedDayMobile.getDay()];
        return (
            <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <div className="h-full w-full flex flex-col bg-background font-sans">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Planner Mobile</span>
                        <div className="flex gap-1">
                            <Button size="icon" variant="ghost" onClick={() => setWeekStart(addDays(weekStart, -7))}><IconChevronLeft className="w-4 h-4"/></Button>
                            <Button size="icon" variant="ghost" onClick={() => setWeekStart(addDays(weekStart, 7))}><IconChevronRight className="w-4 h-4"/></Button>
                        </div>
                    </div>
                    
                    <div className="flex overflow-x-auto no-scrollbar gap-4 p-4 border-b border-white/5">
                        {weekDays.map((day, i) => (
                            <button key={i} onClick={() => setSelectedDayMobile(day)} className={cn(
                                "flex-shrink-0 flex flex-col items-center p-4 rounded-[24px] min-w-[80px] transition-all",
                                isSameDay(day, selectedDayMobile) ? "bg-white/10 border border-white/10" : "opacity-20"
                            )}>
                                <span className="text-[10px] uppercase font-bold tracking-widest mb-1">{format(day, 'EEE', { locale: ptBR })}</span>
                                <span className="text-2xl font-serif italic">{format(day, 'd')}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-auto prana-scrollbar px-2">
                        {HOURS.map(hour => (
                            <div key={hour} className="flex gap-4 py-1">
                                <div className="w-12 pt-4 text-[9px] font-black text-center opacity-20">{hour}:00</div>
                                <div className="flex-1">
                                    <TimeSlot 
                                        id={`${dayKey}-${hour}`} 
                                        day={dayKey} 
                                        hour={hour} 
                                        routine={getRoutineForSlot(selectedDayMobile.getDay(), hour)} 
                                        onAddTask={() => openSmartModal('task')}
                                    >
                                        {renderSlotContent(dayKey, hour, selectedDayMobile)}
                                    </TimeSlot>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DndContext>
        );
    }

    // --- RENDER DESKTOP ---
    return (
        <div className="h-full w-full flex flex-col bg-transparent font-sans">
             <PageHeader 
                title="Matriz Temporal"
                subtitle={`${format(weekStart, "dd 'de' MMMM", { locale: ptBR })} — Ciclo V10`}
                icon={IconCronos}
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 bg-white/[0.03] rounded-full p-1 border border-white/5">
                            <button onClick={() => isUnifiedView && toggleUnifiedView()} className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full transition-all", !isUnifiedView ? "bg-white text-black" : "text-zinc-500")}>Focado</button>
                            <button onClick={() => !isUnifiedView && toggleUnifiedView()} className={cn("px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full transition-all", isUnifiedView ? "bg-white text-black" : "text-zinc-500")}>Unificado</button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-9 rounded-full text-[9px] font-black uppercase tracking-widest opacity-50 hover:opacity-100" onClick={() => openRoutineManager()}>
                            <IconRiver className="w-3 h-3 mr-2" /> Rituais
                        </Button>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex items-center gap-1 bg-white/[0.03] rounded-2xl p-1 border border-white/5">
                            <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}><IconChevronLeft className="w-4 h-4"/></Button>
                            <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase" onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>Hoje</Button>
                            <Button variant="ghost" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}><IconChevronRight className="w-4 h-4"/></Button>
                        </div>
                    </div>
                }
             />

             <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                 <div className="flex-1 overflow-auto prana-scrollbar bg-black/5">
                     <div className="min-w-[1400px] h-full relative">
                         {/* CABEÇALHO */}
                         <div className="sticky top-0 z-30 grid grid-cols-[80px_repeat(7,1fr)] bg-background/90 backdrop-blur-xl border-b border-white/5">
                             <div className="p-4 flex items-center justify-center border-r border-white/5 opacity-20 text-[9px] font-black">GMT-3</div>
                             {weekDays.map((day, i) => (
                                <div key={i} className={cn("p-4 text-center border-r border-white/5", isToday(day) && "bg-primary/5")}>
                                    <span className="text-[9px] uppercase font-black tracking-[0.3em] opacity-30">{format(day, 'EEEE', { locale: ptBR })}</span>
                                    <div className={cn("text-3xl font-serif italic mt-1", isToday(day) ? "text-white" : "text-zinc-600")}>{format(day, 'd')}</div>
                                </div>
                             ))}
                         </div>

                         {/* MATRIX */}
                         <div className="grid grid-cols-[80px_repeat(7,1fr)]">
                             <div className="border-r border-white/5 bg-white/[0.01]">
                                 {HOURS.map(h => (
                                     <div key={h} className="border-b border-white/5 text-[10px] font-black text-center pt-4 opacity-20" style={{ height: CELL_HEIGHT }}>{h}:00</div>
                                 ))}
                             </div>
                             
                             {weekDays.map((day, dayIdx) => {
                                 const dayKey = WEEK_DAY_KEYS[day.getDay()]; 
                                 return (
                                     <div key={dayIdx} className={cn("border-r border-white/5", isToday(day) && "bg-white/[0.01]")}>
                                         {HOURS.map(hour => (
                                             <TimeSlot 
                                                key={`${dayKey}-${hour}`} 
                                                id={`${dayKey}-${hour}`} 
                                                day={dayKey} 
                                                hour={hour} 
                                                routine={getRoutineForSlot(day.getDay(), hour)} 
                                                onAddTask={() => openSmartModal('event')}
                                             >
                                                {renderSlotContent(dayKey, hour, day)}
                                             </TimeSlot>
                                         ))}
                                     </div>
                                 );
                             })}
                         </div>
                     </div>
                 </div>
                 
                 <DragOverlay dropAnimation={null}>
                    {activeDragItem && (
                        <div className="w-[200px] p-3 rounded-2xl bg-zinc-900 border border-white/20 shadow-2xl rotate-2 scale-105 border-l-4 border-l-primary">
                            <span className="text-xs font-serif italic text-white">{activeDragItem.title}</span>
                        </div>
                    )}
                 </DragOverlay>
             </DndContext>
        </div>
    );
}