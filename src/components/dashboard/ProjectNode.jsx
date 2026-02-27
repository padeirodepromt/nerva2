import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import TaskNode from './TaskNode';
import { 
    Plus, IconFolderPlus, Trash2, Edit, IconMoreVertical, IconCheckSquare, 
    IconFolder, ExternalLink, IconBriefcase, IconUser // Novos ícones
} from '@/components/icons/PranaLandscapeIcons';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
// Removido import não utilizado 'createPageUrl' se não for mais necessário em outro lugar
// import { createPageUrl } from '@/utils'; // Ou '@/api/entities' dependendo de onde está
import { Separator } from '@/components/ui/separator';
import { OrganicStageRenderer } from '@/components/organic/OrganicStageRenderer';
import { AnimalTotem } from '@/components/organic/AnimalTotem';
import { HarvestRitual, useHarvestRitual } from '@/components/organic/HarvestRitual';
import BiomeReactionSystem from '@/components/organic/BiomeReactionSystem';

export default function ProjectNode({
    project,
    allProjects,
    tasks,
    agreements = [],
    notes = [],
    index,
    onSelectTask,
    onSelectAgreement,
    onSelectNote,
    onEditProject,
    onDeleteProject,
    onOpenCreationModal,
    viewMode = 'grid'
}) {
    const navigate = useNavigate(); // Hook para navegação programática
    const isCompact = viewMode === 'compact';
    const isClean = viewMode === 'clean';
    
    // Estado para ritual de colheita
    const { isOpen: isHarvestOpen, setIsOpen: setIsHarvestOpen } = useHarvestRitual();
    
    // Estado para animal (baseado no bioma do projeto)
    const [animalState, setAnimalState] = useState('IDLE');
    const [previousProgress, setPreviousProgress] = useState(0);

    // Filtra subprojetos e tarefas diretamente
    const projectSubprojects = allProjects.filter(p => p.parent_project_id === project.id);
    const projectTasks = tasks.filter(t => t.project_id === project.id);
    
    // Calcula progresso do projeto
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
    const projectProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // Determina estágio orgânico baseado no progresso
    const getOrganicStage = (progress) => {
      if (progress <= 5) return 'solo';
      if (progress <= 20) return 'semente';
      if (progress <= 50) return 'broto';
      if (progress <= 90) return 'crescimento';
      return 'colheita';
    };
    
    const organicStage = getOrganicStage(projectProgress);
    
    // Obtém bioma do projeto (usa primeira letra ou default)
    const projectBiome = project.biome || 'floresta';
    
    // Reações do bioma baseadas no progresso
    const biomeReactions = BiomeReactionSystem.getInterpolatedReactions(
      projectBiome, 
      organicStage, 
      projectProgress % 20
    );

    // Efeito para gerenciar estado do animal
    useEffect(() => {
      if (projectProgress > previousProgress) {
        // Progredindo
        if (projectProgress === 100) {
          setAnimalState('SUCCESS');
          setIsHarvestOpen(true);
        } else if (projectProgress >= 75) {
          setAnimalState('ACTIVE');
        } else if (projectProgress >= 25) {
          setAnimalState('ACTIVE');
        }
      } else if (projectProgress < previousProgress) {
        // Regressando (tarefa marcada como não concluída)
        setAnimalState('IDLE');
      }
      
      setPreviousProgress(projectProgress);
    }, [projectProgress, previousProgress, setIsHarvestOpen]);
    
    // Calcula Prana Credits (tamanho × complexidade × velocidade)
    const calculatePranaCredits = () => {
      const sizeWeight = projectTasks.length * 5; // 5 créditos por tarefa
      const complexityWeight = projectSubprojects.length * 10; // Subprojetos = +10
      const speedBonus = projectProgress >= 90 ? Math.round(projectProgress * 2) : projectProgress;
      return Math.round(sizeWeight + complexityWeight + speedBonus);
    };

    // Ícone e Badge do Tipo
    const isProfessional = project.type === 'professional';
    const TypeIcon = isProfessional ? IconBriefcase : IconUser;

    // --- CORREÇÃO: Função para navegar ---
    // Usamos useNavigate para garantir que a navegação funcione mesmo dentro do DragDropContext
    const handleNavigateToProject = (e) => {
        e.stopPropagation(); // Evita conflito com DND
        navigate(`/project/${project.id}`); // URL correta com parâmetro de rota
    };
    // --- FIM DA CORREÇÃO ---

    if (isClean) {
        return (
            <Draggable draggableId={`project-${project.id}`} index={index} type="PROJECT">
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <div {...provided.dragHandleProps} className="opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing flex-shrink-0">
                            <IconMoreVertical className="w-4 h-4" />
                        </div>
                        
                        {/* Organic Stage Renderer em modo clean */}
                        <div className="w-6 h-6 flex-shrink-0">
                            <OrganicStageRenderer
                                organic_stage={organicStage}
                                progress={projectProgress}
                                biome={projectBiome}
                                focusTime={0}
                                subtaskCount={projectSubprojects.length}
                                completedSubtasks={projectProgress}
                            />
                        </div>
                        
                        {/* --- CORREÇÃO: Usar Button/div com onClick em vez de Link direto --- */}
                        <button
                            onClick={handleNavigateToProject}
                            className="font-medium truncate hover:underline text-sm flex-1 text-left bg-transparent border-none p-0 cursor-pointer"
                            title={project.name}
                        >
                            {project.name}
                        </button>
                        {/* --- FIM DA CORREÇÃO --- */}
                        
                        {/* Harvest Ritual Modal */}
                        <HarvestRitual
                            isVisible={isHarvestOpen}
                            projectName={project.name}
                            duration="Em progresso"
                            tasksCompleted={completedTasks}
                            pranaCredits={calculatePranaCredits()}
                            biome={projectBiome}
                            onClose={() => setIsHarvestOpen(false)}
                            autoClose={true}
                            autoCloseDelay={6000}
                        />
                    </div>
                )}
            </Draggable>
        );
    }

    return (
        <Draggable draggableId={`project-${project.id}`} index={index} type="PROJECT">
            {(provided, snapshot) => (
                <motion.div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={!snapshot.isDragging ? { scale: 1.02 } : {}}
                    className={`glass-effect rounded-xl transition-all duration-200 group relative ${
                        snapshot.isDragging ? 'shadow-2xl scale-105 z-50' : 'shadow-sm hover:shadow-lg'
                    } ${isCompact ? 'p-2' : 'p-4'}`}
                >
                    {/* Project Header */}
                    <div className={`flex items-center justify-between ${isCompact ? 'mb-1' : 'mb-3'}`}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div {...provided.dragHandleProps} className="opacity-50 hover:opacity-100 cursor-grab active:cursor-grabbing flex-shrink-0">
                                <div className="w-1 h-4 bg-current opacity-30 rounded-full"></div>
                            </div>
                            
                            {/* Organic Stage Renderer */}
                            <div className={`flex-shrink-0 ${isCompact ? 'w-5 h-5' : 'w-8 h-8'}`}>
                                <OrganicStageRenderer
                                    organic_stage={organicStage}
                                    progress={projectProgress}
                                    biome={projectBiome}
                                    focusTime={0}
                                    subtaskCount={projectSubprojects.length}
                                    completedSubtasks={completedTasks}
                                />
                            </div>
                            
                            {/* --- CORREÇÃO: Usar Button/div com onClick --- */}
                            <button
                                onClick={handleNavigateToProject}
                                className={`font-semibold truncate hover:underline ${isCompact ? 'text-xs' : 'text-sm'} text-left bg-transparent border-none p-0 cursor-pointer`}
                                title={project.name}
                            >
                                {project.name}
                                <ExternalLink className="inline-block w-3 h-3 ml-1 opacity-50" />
                            </button>
                                {/* --- FIM DA CORREÇÃO --- */}
                        </div>

                        {/* Dropdown Menu (continua igual) */}
                        {!isCompact && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-6 w-6"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <IconMoreVertical className="w-3 h-3" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="glass-effect prana-form-modal" align="end">
                                    {/* --- CORREÇÃO: Usar botão com onClick --- */}
                                    <DropdownMenuItem onClick={handleNavigateToProject} className="cursor-pointer">
                                        <ExternalLink className="w-4 h-4 mr-2" /> Ver Projeto
                                    </DropdownMenuItem>
                                    {/* --- FIM DA CORREÇÃO --- */}
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenCreationModal('task', project.id); }} className="cursor-pointer">
                                        <Plus className="w-4 h-4 mr-2" /> Nova Tarefa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpenCreationModal('project', project.id); }} className="cursor-pointer">
                                        <IconFolderPlus className="w-4 h-4 mr-2" /> Novo Subprojeto
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEditProject(project); }} className="cursor-pointer">
                                        <Edit className="w-4 h-4 mr-2" /> Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }} className="text-red-500/80 hover:!text-red-500 cursor-pointer">
                                        <Trash2 className="w-4 h-4 mr-2" /> Excluir
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* Descrição, Stats, Separadores e Droppables (sem alterações) */}
                    {!isCompact && project.description && (
                        <p className="text-xs opacity-70 mb-3 line-clamp-2">{project.description}</p>
                    )}
                    <div className={`flex items-center gap-2 text-xs opacity-60 ${isCompact ? 'mb-1' : 'mb-3'} flex-wrap`}>
                        {projectTasks.length > 0 && (
                            <div className="flex items-center gap-1">
                                <IconCheckSquare className={`${isCompact ? 'w-2 h-2' : 'w-3 h-3'}`} />
                                <span className={isCompact ? 'text-xs' : ''}>{projectTasks.filter(t => t.status !== 'completed').length}</span>
                            </div>
                        )}
                        {projectSubprojects.length > 0 && (
                            <div className="flex items-center gap-1">
                                <IconFolder className={`${isCompact ? 'w-2 h-2' : 'w-3 h-3'}`} />
                                <span className={isCompact ? 'text-xs' : ''}>{projectSubprojects.length}</span>
                            </div>
                        )}
                        {!isCompact && project.status && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                                {project.status === 'active' ? 'Ativo' :
                                 project.status === 'completed' ? 'Concluído' :
                                 project.status === 'paused' ? 'Pausado' : 'Arquivado'}
                            </Badge>
                        )}
                        {/* NOVO: Badge Pessoal vs Profissional (mostrado também no corpo se não estiver super compacto) */}
                        {!isCompact && (
                            <Badge variant="outline" className={`text-[9px] px-1 py-0 border-white/5 ${isProfessional ? 'text-indigo-400' : 'text-emerald-400'}`}>
                                <TypeIcon className="w-2.5 h-2.5 mr-1" />
                                {isProfessional ? 'PRO' : 'PESSOAL'}
                            </Badge>
                        )}
                    </div>
                    <Separator className="my-2 bg-white/10" />
                    <Droppable droppableId={`project-subprojects-${project.id}`} type="PROJECT">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(prev => !prev); }}
                                className={`rounded-lg transition-colors cursor-pointer ${
                                    snapshot.isDraggingOver ? 'bg-indigo-700/20 ring-2 ring-indigo-500/50' : 'bg-white/5 hover:bg-white/10'
                                } ${isCompact ? 'p-1 mb-1' : 'p-2 mb-3'}`}
                            >
                                <div className="flex items-center gap-1 mb-2">
                                    <IconFolder className="w-3 h-3 opacity-80" />
                                    <span className={`text-xs font-semibold ${isCompact ? 'opacity-80' : 'opacity-100'}`}>
                                            Subprojetos ({projectSubprojects.length})
                                    </span>
                                </div>
                                <div 
                                    className={`space-y-1 pr-1 ${isCompact || !isExpanded ? 'max-h-16' : 'max-h-56'} ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}
                                >
                                    {projectSubprojects.map((sub, subIndex) => (
                                        <ProjectNode
                                            key={sub.id}
                                            project={sub}
                                            allProjects={allProjects}
                                            tasks={tasks}
                                            agreements={agreements}
                                            notes={notes}
                                            index={subIndex}
                                            onSelectTask={onSelectTask}
                                            onSelectAgreement={onSelectAgreement}
                                            onSelectNote={onSelectNote}
                                            onEditProject={onEditProject}
                                            onDeleteProject={onDeleteProject}
                                            onOpenCreationModal={onOpenCreationModal}
                                            viewMode="compact" // Subprojetos sempre compactos
                                        />
                                    ))}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    <Separator className="my-2 bg-white/10" />
                    <Droppable droppableId={`project-tasks-${project.id}`} type="TASK">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                onClick={(e) => { e.stopPropagation(); setIsExpanded(prev => !prev); }}
                                className={`rounded-lg transition-colors cursor-pointer ${
                                    snapshot.isDraggingOver ? 'bg-teal-700/20 ring-2 ring-teal-500/50' : 'bg-white/5 hover:bg-white/10'
                                } ${isCompact ? 'p-1' : 'p-2'}`}
                            >
                                <div className="flex items-center gap-1 mb-2">
                                    <IconCheckSquare className="w-3 h-3 opacity-80" />
                                    <span className={`text-xs font-semibold ${isCompact ? 'opacity-80' : 'opacity-100'}`}>
                                            Tarefas ({projectTasks.length})
                                    </span>
                                </div>
                                <div className={`space-y-1 pr-1 ${isCompact || !isExpanded ? 'max-h-16' : 'max-h-56'} ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}`}>
                                    {projectTasks.slice(0, isCompact ? 3 : 5).map((task, taskIndex) => (
                                        <TaskNode
                                            key={task.id}
                                            task={task}
                                            index={taskIndex}
                                            onSelectTask={() => onSelectTask(task.id)} 
                                            compact={isCompact} 
                                        />
                                    ))}
                                    {projectTasks.length > (isCompact ? 3 : 5) && (
                                        <div className={`text-xs opacity-50 ${isCompact ? 'px-1' : 'px-2'}`}>
                                            +{projectTasks.length - (isCompact ? 3 : 5)} mais...
                                        </div>
                                    )}
                                </div>
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                    {!isCompact && (
                        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onOpenCreationModal('task', project.id); }} className="text-xs px-2 py-1 h-6">
                                <Plus className="w-3 h-3 mr-1" />Tarefa
                            </Button>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onOpenCreationModal('project', project.id); }} className="text-xs px-2 py-1 h-6">
                                <IconFolder className="w-3 h-3 mr-1" />Sub
                            </Button>
                            {/* --- CORREÇÃO: Usar botão com onClick --- */}
                            <Button variant="ghost" size="sm" onClick={handleNavigateToProject} className="text-xs px-2 py-1 h-6">
                                <ExternalLink className="w-3 h-3 mr-1" />Ver
                            </Button>
                                {/* --- FIM DA CORREÇÃO --- */}
                        </div>
                    )}
                    
                    {/* Harvest Ritual - Celebração ao completar */}
                    <HarvestRitual
                        isVisible={isHarvestOpen}
                        projectName={project.name}
                        duration={`${Math.round(totalTasks)} tarefas`}
                        tasksCompleted={completedTasks}
                        pranaCredits={calculatePranaCredits()}
                        biome={projectBiome}
                        onClose={() => setIsHarvestOpen(false)}
                        autoClose={true}
                        autoCloseDelay={8000}
                    />
                </motion.div>
            )}
        </Draggable>
    );
}