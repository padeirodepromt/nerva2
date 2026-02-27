/* src/pages/ProjectHub.jsx
   desc: Matriz Tática V5.0 (Navegador de Arquivos & Projetos).
   feat: Gestão hierárquica, Drag & Drop, Ingestão de ZIP Contextual e Inbox.
*/

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Project, Task, TimeSession } from '@/api/entities';
import { 
    IconDashboard, IconPlus, IconList, IconMatrix, IconFlux, 
    IconBrainCircuit, IconSearch, IconLayers, IconZap, IconClock,
    IconDownload, IconFolderOpen
} from '@/components/icons/PranaLandscapeIcons'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable } from '@hello-pangea/dnd'; 
import { toast } from 'sonner'; 

// Componentes Visuais
import PageIconInfo from '@/components/PageIconInfo'; 
import PranaLoader from '@/components/PranaLoader';
import ProjectHierarchy from '@/components/dashboard/ProjectHierarchy'; // Nossa Árvore Viva
import TaskNode from '@/components/dashboard/TaskNode';

// O Novo Cérebro de Criação
import SmartCreationModal from '@/components/smart/SmartCreationModal';

// STORES & HOOKS
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { useAuth } from '@/hooks/useAuth';
import { usePermission } from '@/hooks/usePermission';
import { useTranslations } from '@/components/LanguageProvider';
import { VIEW_TYPES } from '@/config/viewTypes';

export default function ProjectHub() {
    const { user } = useAuth();
    const { openTab, openSmartModal } = useWorkspaceStore();
    const { t } = useTranslations();

    // Permissões e Limites
    const { hasPermission, getLimit } = usePermission('work_life_balance_filter');
    const projectLimit = getLimit('activeProjects');
    const canFilterContext = hasPermission('filter_by_context');
    
    // Estados de Dados
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [documents, setDocuments] = useState([]); // Para alimentar a árvore
    const [maps, setMaps] = useState([]); // Para alimentar a árvore
    
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilter, setTypeFilter] = useState('all'); 
    
    // Estado de Tempo
    const [timeStats, setTimeStats] = useState({ hoursToday: 0 });

    const loadData = useCallback(async () => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout carregando ProjectHub')), 5000)
            );

            const loadWithTimeout = async () => {
                // Carregamos todas as entidades necessárias para compor a árvore completa
                const [projData, taskData, docData, mapData, sessionData] = await Promise.race([
                    Promise.all([
                        Project.filter({ _sort: '-created_at', deleted_at: null }).catch(() => []),
                        Task.filter({ deleted_at: null, status_not: 'done' }).catch(() => []),
                        // Document e MindMap são necessários para o Explorer V8 ser "completo"
                        Project.getEntities('document').catch(() => []), 
                        Project.getEntities('mindmap').catch(() => []),
                        TimeSession.filter({ user_id: user.id }).catch(() => []) 
                    ]),
                    timeoutPromise
                ]);

                setProjects(Array.isArray(projData) ? projData : []);
                setTasks(Array.isArray(taskData) ? taskData : []);
                setDocuments(Array.isArray(docData) ? docData : []);
                setMaps(Array.isArray(mapData) ? mapData : []);

                // Stats de tempo simples
                const sessions = Array.isArray(sessionData) ? sessionData : [];
                const today = new Date().toDateString();
                const totalSeconds = sessions.reduce((acc, sess) => {
                    const sessDate = new Date(sess.created_at || sess.start_time).toDateString();
                    return sessDate === today ? acc + (sess.duration_seconds || 0) : acc;
                }, 0);

                setTimeStats({ hoursToday: (totalSeconds / 3600).toFixed(1) });
            };

            await loadWithTimeout();
        } catch (error) { 
            console.warn("Erro no ProjectHub (usando fallback):", error.message);
            setProjects([]);
            setTasks([]);
        } finally { 
            setLoading(false); 
        }
    }, [user]);

    useEffect(() => { 
        loadData();
        window.addEventListener('prana:refresh-explorer', loadData);
        return () => window.removeEventListener('prana:refresh-explorer', loadData);
    }, [loadData]);

    // Drag & Drop Tático (Reorganização de Hierarquia)
    const handleDragEnd = async (result) => {
        const { destination, draggableId, type } = result;
        if (!destination) return;
        
        const itemId = draggableId.split('-')[1]; 
        
        try {
             if (type === 'PROJECT') {
                const targetId = destination.droppableId.startsWith('project-subprojects-')
                     ? destination.droppableId.replace('project-subprojects-', '') : null;
                 
                 if (itemId === targetId) return; 
                 
                 await Project.update(itemId, { parentId: targetId });
                 toast.success("Arquitetura reorganizada.");
                 loadData();
             } 
         } catch (error) { toast.error("Falha ao mover item."); }
    };

    // Filtros de busca e contexto
    const filteredProjects = useMemo(() => {
        let result = projects;
        if (searchQuery) {
            result = result.filter(p => p.title?.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (typeFilter !== 'all') {
            result = result.filter(p => p.type === typeFilter);
        }
        return result;
    }, [projects, searchQuery, typeFilter]);

    const looseTasks = useMemo(() => tasks.filter(t => !t.project_id), [tasks]);

    if (loading) return <PranaLoader text={t('loading')} />;

    return (
        <div className="w-full h-full relative bg-background overflow-hidden flex flex-col">
            
            {/* --- TOP BAR (Stats & Global Actions) --- */}
            <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card/30">
                <PageIconInfo 
                    icon={IconLayers} 
                    title={t('hub_title') || "Arquitetura"} 
                    description={t('hub_subtitle') || "Visualize e gerencie a estrutura do seu império."}
                    color="rgb(var(--accent))"
                />

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filtros de Contexto */}
                    {canFilterContext && (
                        <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                            {['all', 'personal', 'professional'].map(type => (
                                <Button 
                                    key={type}
                                    variant="ghost" size="sm" 
                                    onClick={() => setTypeFilter(type)} 
                                    className={`text-[10px] h-7 px-3 uppercase tracking-tighter ${typeFilter === type ? 'bg-white/10 text-white' : 'text-muted-foreground'}`}
                                >
                                    {type === 'all' ? 'Tudo' : type === 'personal' ? 'Pessoal' : 'Pro'}
                                </Button>
                            ))}
                        </div>
                    )}

                    {/* Stats Rápidas */}
                    <div className="hidden lg:flex items-center gap-4 px-4 border-l border-white/10 ml-2">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Foco Hoje</span>
                            <span className="text-sm font-mono text-emerald-400">{timeStats.hoursToday}h</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Capacidade</span>
                            <span className="text-sm font-mono text-blue-400">{projects.length}/{projectLimit}</span>
                        </div>
                    </div>

                    <Button onClick={() => openSmartModal('project')} className="glow-effect gap-2 ml-2">
                        <IconPlus className="w-4 h-4" /> Novo Projeto
                    </Button>
                </div>
            </div>

            {/* --- MAIN EXPLORER AREA --- */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                
                {/* 1. O CORPO DA ÁRVORE (A Árvore Viva V8) */}
                <div className="flex-1 overflow-hidden border-r border-white/5 flex flex-col">
                    <div className="p-4 bg-white/[0.02] flex items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Filtrar arquitetura..."
                                className="pl-9 bg-white/5 border-none h-9 text-sm focus-visible:ring-accent"
                            />
                        </div>
                    </div>

                    <div className="flex-1 p-2">
                        {/* Aqui injetamos a nossa Árvore Viva. 
                            Ela recebe projetos, tarefas, docs e mapas, e cuida da renderização VS Code Style.
                        */}
                        <ProjectHierarchy 
                            projects={filteredProjects}
                            tasks={tasks}
                            documents={documents}
                            maps={maps}
                            onRefresh={loadData}
                        />
                    </div>
                </div>

                {/* 2. SIDEBAR DE INBOX (Tarefas Órfãs / Captura Rápida) */}
                <div className="w-full lg:w-96 bg-card/20 overflow-y-auto p-6 prana-scrollbar border-l border-white/5">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            <IconBox className="w-4 h-4 text-purple-400" /> Inbox de Captura
                        </h3>
                        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={() => openSmartModal('task')}>
                            <IconPlus className="w-3.5 h-3.5" />
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {looseTasks.length > 0 ? (
                            looseTasks.map((task) => (
                                <TaskNode 
                                    key={task.id} 
                                    task={task} 
                                    isInboxView={true} 
                                    onRefresh={loadData}
                                />
                            ))
                        ) : (
                            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 opacity-30">
                                <IconFlux className="w-10 h-10" />
                                <p className="text-xs">Inbox limpo.<br/>Tudo flui em harmonia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Smart Modal de Criação Global */}
            <SmartCreationModal />
        </div>
    );
}