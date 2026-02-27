import React, { useMemo } from 'react';
import { ChevronRight, Home, Folder, ExternalLink } from '@/components/icons/PranaLandscapeIcons';
import { Droppable } from '@hello-pangea/dnd';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

/**
 * BreadcrumbDropper
 * Componente que exibe a hierarquia de projetos e atua como uma zona
 * Droppable para mover itens para o projeto raiz ou projetos pais.
 *
 * @param {object | null} currentProject - O projeto atual que está sendo visualizado (pode ser nulo no Dashboard).
 * @param {Array<object>} hierarchy - Lista de objetos de projeto que representam o caminho pai.
 * @param {function} onSelectProject - Função chamada ao clicar em um item da hierarquia (para navegação).
 */
export default function BreadcrumbDropper({
    currentProject,
    hierarchy,
    onSelectProject, // Função que navega ou carrega os dados do projeto
}) {

    // 1. Constrói o caminho completo da hierarquia
    const fullPath = useMemo(() => {
        // Item raiz/Dashboard
        const rootItem = { id: 'root', name: 'Central', icon: Home, link: '/dashboard', isRoot: true };
        
        const path = [
            rootItem,
            ...hierarchy,
        ];

        // Adiciona o projeto atual (se existir e não for a raiz)
        if (currentProject && currentProject.id !== 'root') {
            path.push({
                id: currentProject.id,
                name: currentProject.name,
                icon: Folder,
                link: `/project/${currentProject.id}`,
                isCurrent: true
            });
        }

        return path;
    }, [currentProject, hierarchy]);

    // 2. Função utilitária para renderizar o item Droppable
    const renderDroppableItem = (item, index) => {
        // O droppableId é usado no handleDragEnd (ex: 'root' ou 'project-ID')
        const droppableId = item.isRoot ? 'root' : `project-subprojects-${item.id}`;
        
        // O último item não é um alvo para drop
        const isLast = index === fullPath.length - 1;
        // Permite o drop no item atual se a página for o Dashboard, mas desabilita no ProjectView
        const isDropDisabled = isLast && !item.isRoot; 

        return (
            <Droppable 
                droppableId={droppableId} 
                type="PROJECT" 
                key={item.id} 
                isDropDisabled={isDropDisabled} // Desabilita o drop no item mais à direita (o atual)
            >
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                            flex items-center min-h-[30px] rounded-lg transition-colors 
                            ${!isDropDisabled && 'hover:bg-indigo-600/20'}
                            ${snapshot.isDraggingOver ? 'bg-indigo-600/40 ring-2 ring-indigo-500' : ''}
                        `}
                    >
                        <DropdownMenuTrigger asChild>
                            <BreadcrumbLink 
                                asChild 
                                onClick={(e) => { 
                                    e.preventDefault(); 
                                    // Ação de navegação ao clicar
                                    onSelectProject(item); 
                                }}
                                className={`
                                    flex items-center gap-1 font-semibold text-sm cursor-pointer p-1.5 
                                    ${isLast ? 'text-white' : 'text-white/60 hover:text-white/90'}
                                `}
                            >
                                <Link 
                                    to={item.link} 
                                    onClick={(e) => e.preventDefault()}
                                    title={item.name}
                                >
                                    {item.icon && <item.icon className="w-4 h-4" />}
                                    {item.name}
                                </Link>
                            </BreadcrumbLink>
                        </DropdownMenuTrigger>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        );
    };

    return (
        <DropdownMenu>
            <Breadcrumb className="glass-effect rounded-xl p-2 sm:p-3 border border-white/10 shadow-lg">
                <ol className="flex items-center space-x-1 sm:space-x-2">
                    {fullPath.map((item, index) => (
                        <React.Fragment key={item.id}>
                            <BreadcrumbItem>
                                <DropdownMenu>
                                    {/* O ITEM BREADCRUMB É O ALVO DROPÁVEL */}
                                    {renderDroppableItem(item, index)}
                                    
                                    {/* CONTEÚDO DO MENU (APARÊNCIA CORRIGIDA) */}
                                    <DropdownMenuContent className="glass-effect bg-slate-900/95 p-1 border-white/20 text-white/80 w-48 shadow-2xl">
                                        <DropdownMenuItem asChild className="hover:bg-indigo-600/50 hover:text-white cursor-pointer rounded-md">
                                            <Link to={item.link}>
                                                <ExternalLink className="w-4 h-4 mr-2" /> Ver {item.name}
                                            </Link>
                                        </DropdownMenuItem>
                                        <Separator className="my-1 bg-white/20" />
                                        <DropdownMenuItem className="opacity-70 text-xs px-2 py-1.5" disabled>
                                            {item.isCurrent ? 'Projeto Atual' : 'Arraste um Projeto/Tarefa aqui'}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </BreadcrumbItem>
                            {index < fullPath.length - 1 && (
                                <BreadcrumbSeparator><ChevronRight className="w-4 h-4 text-white/50" /></BreadcrumbSeparator>
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </Breadcrumb>
        </DropdownMenu>
    );
}
