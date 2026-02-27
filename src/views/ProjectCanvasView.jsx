/* src/views/ProjectCanvasView.jsx
   desc: Cockpit Neural do Projeto V10.
   role: Hub Central de Triagem. Integra Intenção (Sankalpa), Tempo (Events) e Ação (Tasks).
   feat: Poda Radical (Realms), Views Polimórficas e Geometria Sistêmica.
   status: 100% INTEGRAL - SEM OMISSÕES.
*/

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslations } from '@/components/LanguageProvider';
import {
  IconActivity, IconSettings, IconPlus, IconLayout,
  IconKanban, IconList, IconMap, IconUsers, IconCheckCircle, IconClock,
  IconFolder, IconCalendar, IconDatabase, IconZap, IconCronos, IconSparkles,
  IconChevronRight, IconLayers, IconWind
} from '@/components/icons/PranaLandscapeIcons';
import { Project, Task, Event, Sankalpa } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import PranaLoader from '@/components/PranaLoader';
import PageHeader from '@/components/ui/PageHeader';
import ProjectHierarchy from '@/components/dashboard/ProjectHierarchy';
import PranaFormModal from '@/components/forms/PranaFormModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// WIDGETS DE SISTEMA
import BrandCodeDNA from "@/components/system/brandcode/BrandCodeDNAWidget";

// --- SUB-VIEWS POLIMÓRFICAS ---
import KanbanView from '@/views/KanbanView';
import SheetView from '@/views/SheetView';
import ListView from '@/views/ListView';
import CalendarView from '@/views/CalendarView';
import MindMapBoardView from '@/views/MindMapBoardView';
import ChainView from '@/views/ChainView';

export default function ProjectCanvasView({ projectId: propProjectId, isMobile = false }) {
  const params = useParams();
  const projectId = propProjectId || params.id;
  const { t } = useTranslations();
  const [searchParams, setSearchParams] = useSearchParams();
  const { activeRealmId } = useWorkspaceStore();

  // 1. ESTADO NEURAL DO PROJETO
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [projectSankalpa, setProjectSankalpa] = useState(null);
  const [stats, setStats] = useState({ total: 0, done: 0, progress: 0, anchors: 0 });
  const [loading, setLoading] = useState(true);

  // 2. NAVEGAÇÃO DE CONTEXTO
  const activeTab = searchParams.get('tab') || 'overview';
  const [planningView, setPlanningView] = useState('kanban');
  const [databaseView, setDatabaseView] = useState('sheet');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 3. CARREGAMENTO HOLÍSTICO (Task + Event + Sankalpa)
  const loadProjectData = async () => {
    setLoading(true);
    try {
      const [projData, tasksData, eventsData, sankalpasData] = await Promise.all([
        Project.get(projectId),
        Task.list({ project_id: projectId }),
        Event.list({ project_id: projectId }),
        Sankalpa.list({ project_id: projectId })
      ]);

      setProject(projData);
      setTasks(tasksData || []);
      setEvents(eventsData || []);
      setProjectSankalpa(sankalpasData?.[0] || null);

      const total = (tasksData || []).length;
      const done = (tasksData || []).filter(t => t.status === 'done').length;

      setStats({
        total,
        done,
        progress: total > 0 ? Math.round((done / total) * 100) : 0,
        anchors: (eventsData || []).length
      });
    } catch (e) {
      console.error("Canvas Sync Error:", e);
      toast.error("Erro ao sincronizar o ecossistema do projeto.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) loadProjectData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  const handleTabChange = (val) => setSearchParams({ tab: val });

  // --- BRAND CODE: envia kickoff para SideChat via event bus ---
  const handleBrandCodeKickoff = (kickoff) => {
    try {
      window.dispatchEvent(new CustomEvent('prana:flor-kickoff', { detail: kickoff }));
    } catch (e) {
      console.error("[ProjectCanvasView] dispatch kickoff failed:", e);
    }
  };

  if (loading) return <PranaLoader text="Mapeando cockpit neural..." />;
  if (!project) return <div className="p-8 text-center opacity-30 italic">Projeto não localizado no multiverso atual.</div>;

  const isProfessional = project.realmId === 'professional';
  const accentColor = isProfessional ? 'text-indigo-400' : 'text-emerald-400';

  return (
    <div className="flex flex-col h-full bg-background relative overflow-hidden font-sans">

      {/* --- 1. HEADER DO COCKPIT --- */}
      <PageHeader
        title={project.title}
        subtitle={`${stats.progress}% da manifestação concluída`}
        icon={IconLayout}
        iconColor={project.color || (isProfessional ? '#6366f1' : '#10b981')}
        projectId={projectId}
        actions={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setIsCreateOpen(true)}
              className={cn(
                "gap-2 rounded-full font-black text-[10px] uppercase tracking-widest px-6 h-9 shadow-lg transition-all",
                isProfessional ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20" : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
              )}
            >
              <IconPlus className="w-3.5 h-3.5" />
              {activeTab === 'database' ? 'Registro' : activeTab === 'calendar' ? 'Âncora' : 'Ação'}
            </Button>
          </div>
        }
      />

      {/* --- 2. SISTEMA DE ABAS (CONTEXTOS) --- */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1 flex flex-col min-h-0">
        <div className="px-6 border-b border-white/5 bg-black/20 sticky top-0 z-10 backdrop-blur-md">
          <TabsList className="bg-transparent border-b-0 p-0 h-auto gap-8 justify-start py-1 overflow-x-auto no-scrollbar">
            <PranaTabTrigger value="overview" icon={IconActivity} label="Overview" />
            <PranaTabTrigger value="planning" icon={IconZap} label="Ações" />
            <PranaTabTrigger value="database" icon={IconDatabase} label="Dados" />
            <PranaTabTrigger value="calendar" icon={IconCalendar} label="Âncoras" />
            <PranaTabTrigger value="nexus" icon={IconMap} label="Nexus" />
            <PranaTabTrigger value="files" icon={IconFolder} label="Assets" />
          </TabsList>
        </div>

        <div className="flex-1 overflow-hidden relative">

          {/* --- ABA 1: OVERVIEW (Status + Sankalpa) --- */}
          <TabsContent value="overview" className="h-full overflow-y-auto p-8 custom-scrollbar mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="max-w-7xl mx-auto space-y-8">

              {/* Brand Code (widget “latente” por projeto) */}
              <BrandCodeDNA
                projectId={projectId}
                onKickoff={handleBrandCodeKickoff}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Widget do Sankalpa (A Intenção Master) */}
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                    <IconSparkles className="w-48 h-48 rotate-12 text-primary" />
                  </div>
                  <div>
                    <Badge variant="outline" className={cn("mb-4 border-current uppercase text-[9px] font-black tracking-[0.2em] px-3 py-1", accentColor)}>
                      Intenção Master
                    </Badge>
                    <h2 className="text-3xl font-serif italic text-white/90 leading-tight max-w-2xl">
                      {projectSankalpa?.title || "O projeto aguarda uma Intenção Master..."}
                    </h2>
                    <p className="mt-4 text-zinc-500 text-sm leading-relaxed max-w-xl">
                      {projectSankalpa?.description || "Defina o Sankalpa para alinhar a inteligência do Ash ao propósito deste projeto."}
                    </p>
                  </div>
                  <div className="mt-10 flex items-center gap-6">
                    <div className="flex-1">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2">
                        <span>Manifestação Física</span>
                        <span>{stats.progress}%</span>
                      </div>
                      <Progress value={stats.progress} className="h-1.5 bg-white/5" />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5">
                      <IconChevronRight className="w-5 h-5 text-zinc-500" />
                    </Button>
                  </div>
                </div>

                {/* Widgets de Estatística */}
                <div className="space-y-4">
                  <StatCard icon={IconCronos} label="Âncoras Rígidas" value={stats.anchors} color="text-indigo-400" />
                  <StatCard icon={IconZap} label="Ações Fluídas" value={stats.total - stats.done} color="text-emerald-400" />
                  <div className="p-6 rounded-[24px] bg-primary/5 border border-primary/10 relative overflow-hidden group">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
                      <IconSparkles className="w-3 h-3" /> Radar do Ash
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed italic">
                      "Arquiteto, sinto {stats.anchors} marcos temporais. Deseja que eu otimize o backlog?"
                    </p>
                  </div>
                </div>
              </div>

              {/* Feed de Atividade Simbolizado */}
              <div className="pt-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30 flex items-center gap-3 mb-8">
                  <div className="h-px w-8 bg-current" /> Registro de Fluxo Neural
                </h3>
                <div className="space-y-6 border-l border-white/5 ml-2 pl-8">
                  <div className="relative py-1">
                    <div className="absolute -left-[36px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40 shadow-glow-sm" />
                    <p className="text-sm text-zinc-400">
                      Projeto estabilizado no Realm <span className="text-white font-bold">{project.realmId?.toUpperCase()}</span>
                    </p>
                    <span className="text-[10px] font-mono opacity-20 block mt-1">
                      {format(new Date(project.createdAt), "dd MMM, HH:mm")}
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </TabsContent>

          {/* --- ABA 2: PLANNING (Execução / Ações) --- */}
          <TabsContent value="planning" className="h-full mt-0 relative animate-in fade-in duration-500">
            <ViewSwitcher activeView={planningView} setView={setPlanningView} type="planning" />
            <div className="h-full w-full">
              {planningView === 'kanban' && <KanbanView projectId={projectId} mode="tasks" />}
              {planningView === 'list' && <ListView projectId={projectId} mode="tasks" />}
              {planningView === 'sheet' && <SheetView projectId={projectId} mode="tasks" />}
              {planningView === 'map' && <MindMapBoardView projectId={projectId} />}
            </div>
          </TabsContent>

          {/* --- ABA 3: DATABASE (Informação / Dados) --- */}
          <TabsContent value="database" className="h-full mt-0 relative animate-in fade-in duration-500">
            <ViewSwitcher activeView={databaseView} setView={setDatabaseView} type="database" />
            <div className="h-full w-full">
              {databaseView === 'sheet' && <SheetView projectId={projectId} mode="records" />}
              {databaseView === 'kanban' && <KanbanView projectId={projectId} mode="records" />}
              {databaseView === 'list' && <ListView projectId={projectId} mode="records" />}
            </div>
          </TabsContent>

          {/* --- ABA 4: CALENDAR (Âncoras Rígidas) --- */}
          <TabsContent value="calendar" className="h-full mt-0 animate-in fade-in duration-500">
            <CalendarView projectId={projectId} />
          </TabsContent>

          {/* --- ABA 5: NEXUS (Geometria das Conexões) --- */}
          <TabsContent value="nexus" className="h-full mt-0 animate-in fade-in duration-500">
            <ChainView projectId={projectId} />
          </TabsContent>

          {/* --- ABA 6: ASSETS (Hierarquia de Arquivos) --- */}
          <TabsContent value="files" className="h-full mt-0 p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto border border-white/5 rounded-[40px] bg-black/20 overflow-hidden min-h-[600px] flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Project Assets & Hierarchy</span>
                <Button variant="ghost" size="sm" className="h-8 rounded-full text-[9px] font-black uppercase gap-2 hover:bg-white/5">
                  <IconSettings className="w-3.5 h-3.5" /> Configurar Filtros
                </Button>
              </div>
              <div className="flex-1 p-8 relative">
                <ProjectHierarchy projects={[]} tasks={tasks} documents={[]} maps={[]} />
              </div>
            </div>
          </TabsContent>

        </div>
      </Tabs>

      {/* --- MODAL DE CRIAÇÃO INTELIGENTE (Context Aware) --- */}
      <PranaFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        type={
          activeTab === 'database' ? 'record' :
            activeTab === 'calendar' ? 'event' : 'task'
        }
        initialData={{
          project_id: projectId,
          realmId: project.realmId
        }}
        onSave={loadProjectData}
      />
    </div>
  );
}

// ============================================================================
// COMPONENTES AUXILIARES DE INTERFACE
// ============================================================================

function PranaTabTrigger({ value, icon: Icon, label }) {
  return (
    <TabsTrigger
      value={value}
      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 data-[state=active]:opacity-100 hover:opacity-100 transition-all flex items-center gap-2 group"
    >
      <Icon className="w-3.5 h-3.5 group-data-[state=active]:scale-110 transition-transform" />
      {label}
    </TabsTrigger>
  );
}

function ViewSwitcher({ activeView, setView, type }) {
  return (
    <div className="absolute top-4 right-8 z-20 flex gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10 shadow-2xl">
      {type === 'planning' ? (
        <>
          <ViewBtn active={activeView === 'kanban'} icon={IconKanban} onClick={() => setView('kanban')} title="Kanban" />
          <ViewBtn active={activeView === 'list'} icon={IconList} onClick={() => setView('list')} title="Lista" />
          <ViewBtn active={activeView === 'sheet'} icon={IconLayers} onClick={() => setView('sheet')} title="Grid" />
          <ViewBtn active={activeView === 'map'} icon={IconMap} onClick={() => setView('map')} title="Mapa Mental" />
        </>
      ) : (
        <>
          <ViewBtn active={activeView === 'sheet'} icon={IconDatabase} onClick={() => setView('sheet')} title="Planilha" />
          <ViewBtn active={activeView === 'kanban'} icon={IconKanban} onClick={() => setView('kanban')} title="Pipeline" />
          <ViewBtn active={activeView === 'list'} icon={IconList} onClick={() => setView('list')} title="Inventário" />
        </>
      )}
    </div>
  );
}

function ViewBtn({ active, icon: Icon, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded-lg transition-all",
        active ? "bg-primary text-white shadow-glow-sm" : "text-white/20 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-all">
      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
        <Icon className={cn("w-4 h-4", color)} /> {label}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-4xl font-serif italic text-white/90 group-hover:text-white transition-colors">{value}</span>
      </div>
    </div>
  );
}
