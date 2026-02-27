/* src/views/DashboardView.jsx
   desc: O Santuário Digital V8.7.
   feat: Renderização estrita de dados Bio-Digitais (via useBioSync) + Trabalho (via API).
*/

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBioSync } from '@/hooks/useBioSync'; // [ANTENA]: Fonte da verdade Bio
import { Task, Project } from '@/api/entities';  // [TRABALHO]: Fonte da verdade Work
import { useWorkspaceStore } from "@/stores/useWorkspaceStore";
import { VIEW_TYPES } from "@/config/viewTypes";
import { toast } from "sonner";

// UI Components
import PranaLoader from '@/components/PranaLoader';
import ViewHeader from '@/components/ViewHeader';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Modais
import UserProfileModal from '@/components/forms/UserProfileModal';
import EnergyCheckInModal from '@/components/energy/EnergyCheckInModal';

// Dashboard Components (Cards)
import DashboardFiltersDropdown from '@/components/dashboard/DashboardFiltersDropdown';
import CeuAgora from '@/components/dashboard/CeuAgora';
import UpcomingEventsCard from '@/components/dashboard/UpcomingEventsCard';
import ActiveRoutinesCard from '@/components/dashboard/ActiveRoutinesCard';
import RitualizationStatsCard from '@/components/dashboard/RitualizationStatsCard';

// Holistic Cards (Onde a mágica visual acontece)
import { 
    EnergyStatsCard, 
    AstrologyCard,
    AshSuggestionsCard 
} from '@/components/dashboard/holistic';

// Ícones
import { 
    IconDashboard, IconFlux, IconMatrix, IconVision, IconSoul, 
    IconGrowth, IconMountain, IconLayers, IconDiario
} from '@/components/icons/PranaLandscapeIcons';

export default function DashboardView() {
    const { user } = useAuth();
    const { openTab } = useWorkspaceStore();

    // 1. LEITURA BIO-DIGITAL (Centralizada)
    // O Dashboard apenas "imprime" o que o useBioSync calculou.
    const { 
        metrics,       // { energyLevel, battery }
        astral,        // { moon, phase, advice }
        cycle,         // { phase, day }
        submitCheckIn, // Função para salvar check-in
        isLoading: bioLoading 
    } = useBioSync();

    // 2. ESTADO LOCAL (UI & Filtros)
    const [workLoading, setWorkLoading] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isEnergyCheckInOpen, setIsEnergyCheckInOpen] = useState(false);
    
    // 3. DADOS DE TRABALHO (Separados para performance)
    const [workData, setWorkData] = useState({
        tasks: [],
        velocity: 0
    });

    const [filters, setFilters] = useState({
        tasks: true,
        velocity: true,
        astrology: true,
        energy: true,
        rituals: true,
        ash: true
    });

    // Effect: Carrega dados "duros" (Tasks/Projetos)
    useEffect(() => {
        const loadWorkData = async () => {
            if (!user) return;
            setWorkLoading(true);
            try {
                // Busca apenas tarefas ativas para o "Fluxo Prioritário"
                const tasks = await Task.filter({ status: ['todo', 'doing'], limit: 10 });
                
                // Exemplo simples de cálculo de velocidade (pode vir do backend futuramente)
                const velocity = 5; 

                setWorkData({ tasks: tasks || [], velocity });
            } catch (error) {
                console.error("Erro ao carregar trabalho:", error);
            } finally {
                setWorkLoading(false);
            }
        };

        loadWorkData();
        window.addEventListener('prana:refresh-tasks', loadWorkData);
        return () => window.removeEventListener('prana:refresh-tasks', loadWorkData);
    }, [user]);

    // --- AÇÕES ---

    const handleEnergyCheckIn = async (data) => {
        try {
            // Aqui o Dashboard manda o sinal para o useBioSync -> Banco
            await submitCheckIn(data.level, data.type); 
            setIsEnergyCheckInOpen(false);
            toast.success("Energia registrada.");
        } catch (error) {
            toast.error("Erro ao registrar.");
        }
    };

    const handleOpenProject = (projectId) => {
        if (projectId) openTab({ type: VIEW_TYPES.PROJECT_CANVAS, title: 'Projeto', data: { id: projectId } });
    };

    const handleOpenDiary = () => {
        openTab({ 
            type: VIEW_TYPES.DOC_EDITOR, 
            title: 'Reflexão', 
            data: { docType: 'diary', date: new Date().toISOString().split('T')[0] }
        }, 'main');
    };

    if (bioLoading || workLoading) return <PranaLoader text="Carregando Santuário..." />;

    // Ordenação de prioridade
    const tasksDue = workData.tasks
        .sort((a, b) => (a.priority === 'high' ? -1 : 1))
        .slice(0, 5);

    return (
        <div className="h-full w-full p-4 md:p-6 flex flex-col gap-4 overflow-auto bg-transparent prana-scrollbar">
            
            {/* HEADER */}
            <ViewHeader 
                icon={IconDashboard}
                title="Santuário"
                subtitle={`Olá, ${user?.name?.split(' ')[0]}`}
            />

            {/* ÁREA DE CONTEXTO (Top Bar) */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-end shrink-0">
                
                {/* Esquerda: Céu Agora (Lido do useBioSync) */}
                <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 opacity-60">
                        <IconVision className="w-4 h-4 text-[rgb(var(--accent-rgb))]" /> 
                        <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-sans">
                            Contexto Astral
                        </span>
                    </div>
                    
                    <div className="prana-surface-elevated rounded-2xl p-4 md:p-5 bg-white/5 dark:bg-black/30 border border-white/10 space-y-3">
                        <CeuAgora astralData={astral} />
                        {astral?.advice && (
                            <p className="text-muted-foreground/80 max-w-2xl font-sans text-xs md:text-sm leading-relaxed border-l border-white/10 pl-3">
                                {astral.advice}
                            </p>
                        )}
                    </div>
                </div>

                {/* Direita: Bateria & Controles */}
                <div className="flex flex-col gap-3 items-end w-full md:w-auto">
                    <div className="flex gap-3 items-center">
                        <DashboardFiltersDropdown filters={filters} onFiltersChange={setFilters} />
                        <Button onClick={() => setIsEnergyCheckInOpen(true)} variant="outline" size="sm" className="gap-2 text-xs">
                            <IconSoul className="w-3.5 h-3.5" /> Check-in
                        </Button>
                    </div>
                    
                    {/* Visualização da Bateria (Lido do useBioSync) */}
                    <div className="prana-surface-elevated p-4 rounded-2xl w-full md:min-w-[260px] bg-white/5 dark:bg-black/40 border border-white/10">
                        <div className="flex items-center justify-between mb-2 opacity-70">
                            <span className="text-[9px] font-bold uppercase text-[rgb(var(--accent-rgb))] tracking-widest">Bateria Vital</span>
                            <IconSoul className="w-4 h-4 text-[rgb(var(--accent-rgb))]" />
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-5xl font-serif text-foreground">{metrics?.battery || 0}%</span>
                        </div>
                        <Progress value={metrics?.battery || 0} className="h-1 bg-white/5" />
                    </div>
                </div>
            </div>

            {/* GRID PRINCIPAL */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* COLUNA ESQUERDA (8/12) - Trabalho */}
                <div className="md:col-span-8 flex flex-col gap-4">
                    {filters.tasks && (
                    <div className="card-flux rounded-2xl flex flex-col overflow-hidden border border-white/10 bg-white/3 dark:bg-white/[0.02]">
                        <div className="px-5 py-4 border-b border-white/5 flex justify-between items-center bg-white/2">
                            <h3 className="font-sans font-bold flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
                                <IconFlux className="w-4 h-4 text-foreground" /> Fluxo Prioritário
                            </h3>
                        </div>
                        
                        <ScrollArea className="h-48 prana-scrollbar">
                            <div className="p-3 space-y-2">
                                {tasksDue.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-40 opacity-40 gap-3">
                                        <IconMountain className="w-12 h-12 text-muted-foreground" />
                                        <p className="text-xs uppercase tracking-widest font-medium">O horizonte está limpo</p>
                                    </div>
                                ) : (
                                    tasksDue.map((task) => (
                                        <div 
                                            key={task.id}
                                            onClick={() => handleOpenProject(task.project_id)}
                                            className="group flex items-center gap-3 p-3 rounded-xl hover:bg-white/8 cursor-pointer transition-all border border-transparent hover:border-white/10"
                                        >
                                            <div className={`w-0.5 h-10 rounded-full ${task.priority === 'high' ? 'bg-orange-500' : 'bg-emerald-500/40'}`} />
                                            <div className="flex-1 min-w-0 py-0.5">
                                                <h4 className="font-medium text-sm text-foreground/85 truncate">{task.title}</h4>
                                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold mt-1 opacity-50">
                                                    {task.project_name || 'INBOX'} 
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                    )}
                </div>

                {/* COLUNA DIREITA (4/12) - Velocity & Reflexão */}
                <div className="md:col-span-4 flex flex-col gap-4">
                    {filters.velocity && (
                    <div className="prana-surface-elevated p-5 rounded-2xl bg-white/3 dark:bg-black/40 border border-white/10">
                        <div className="flex items-center gap-2 mb-3 text-muted-foreground opacity-70">
                            <IconMatrix className="w-3.5 h-3.5 text-blue-400" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Velocidade</span>
                        </div>
                        <div className="flex items-end gap-1.5">
                            <div className="text-6xl font-serif text-foreground leading-none">{workData.velocity}</div>
                            <span className="text-xs text-muted-foreground font-medium mb-1">tasks / hoje</span>
                        </div>
                    </div>
                    )}

                    <div className="card-diary p-5 rounded-2xl flex flex-col bg-white/3 dark:bg-white/[0.02] border border-white/10">
                         <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                            <IconDiario className="w-3.5 h-3.5" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Reflexão</span>
                        </div>
                        <Button onClick={handleOpenDiary} variant="outline" size="sm" className="w-full gap-2 text-[10px] h-7">
                            <IconDiario className="w-3 h-3" /> Escrever no Diário
                        </Button>
                    </div>
                </div>
            </div>

            {/* SEÇÃO HOLÍSTICA (Cards Inferiores) */}
            {/* Aqui renderizamos os dados crus que vieram do BioSync */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
                {/* Eventos e Rotinas não dependem do BioSync diretamente, mas compõem o painel */}
                <div><UpcomingEventsCard /></div>
                <div><ActiveRoutinesCard /></div>
                
                {filters.rituals && <div><RitualizationStatsCard /></div>}

                {/* Cards Bio-Digitais alimentados pelo hook */}
                {filters.astrology && <div className="lg:col-span-1"><AstrologyCard data={astral} /></div>}
                {filters.energy && <div className="lg:col-span-1"><EnergyStatsCard stats={metrics} /></div>}
                
                {/* Sugestões do Ash baseadas na combinação (BioSync faz o cálculo, aqui só mostra) */}
                {filters.ash && <div className="lg:col-span-1"><AshSuggestionsCard cycle={cycle} /></div>}
            </div>

            {/* Modais de Suporte */}
            <UserProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
            
            <EnergyCheckInModal 
                isOpen={isEnergyCheckInOpen}
                onClose={() => setIsEnergyCheckInOpen(false)}
                timeOfDay="now"
                onSubmit={handleEnergyCheckIn}
            />
        </div>
    );
}