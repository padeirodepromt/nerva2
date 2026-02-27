// Hook responsável por carregar e cruzar todos os dados (Tarefas, Projetos, Sankalpas)
// para a visualização unificada no Sheet Mode (Matriz de Comando).

import { useState, useEffect, useCallback } from 'react';
import { Task, Project, Sankalpa } from '@/api/entities'; // Importando diretamente as entidades corrigidas
import { useAuth } from './useAuth'; 
import { toast } from 'sonner';

/**
 * Hook para gerenciar e enriquecer dados para o modo Planilha (Sheet Mode).
 * Realiza o 'join' de dados no cliente para otimizar a renderização da tabela.
 */
export const useSheetData = () => {
    const { user } = useAuth(); // Assume que useAuth fornece o usuário
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [sankalpas, setSankalpas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Mapeamentos para acesso rápido (o coração do 'join' de dados)
    const [projectMap, setProjectMap] = useState(new Map());
    const [sankalpaMap, setSankalpaMap] = useState(new Map());

    /**
     * Carrega todos os dados necessários para o Sheet Mode e realiza o join.
     */
    const loadAllData = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        
        try {
            // Filtro para buscar apenas itens ativos (não arquivados)
            const activeFilter = { deleted_at: null };

            // 1. Busca Paralela de Todas as Entidades (usando os métodos .filter corrigidos)
            const [allTasks, allProjects, allSankalpas] = await Promise.all([
                Task.filter({ ...activeFilter, _sort: '-created_at' }), 
                Project.filter(activeFilter),
                Sankalpa.filter(activeFilter),
            ]);

            // 2. Criação dos Mapas de Referência para Join
            const newProjectMap = new Map(allProjects.map(p => [p.id, p]));
            const newSankalpaMap = new Map(allSankalpas.map(s => [s.id, s]));

            setProjectMap(newProjectMap);
            setSankalpaMap(newSankalpaMap);
            
            // 3. Enriquecimento/Transformação dos Dados da Tarefa (O Join)
            const enrichedTasks = allTasks.map(task => {
                const project = newProjectMap.get(task.project_id);
                // O sankalpa_id está no projeto, não na tarefa.
                const sankalpa = newSankalpaMap.get(project?.sankalpa_id); 
                
                return {
                    ...task,
                    // Campos Enriquecidos:
                    project_name: project ? project.name : 'Sem Projeto',
                    project_color: project ? project.color : '#6b7280', // Cor padrão cinza
                    sankalpa_intention: sankalpa ? sankalpa.intention : 'Nenhuma Intenção',
                    planner_slot: task.planner_slot || {}, 
                };
            });

            setTasks(enrichedTasks);
            setProjects(allProjects);
            setSankalpas(allSankalpas);

        } catch (err) {
            console.error("Falha ao carregar dados do Sheet Mode:", err);
            setError("Não foi possível carregar os dados da Matriz. Verifique o console para detalhes.");
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        loadAllData();
    }, [loadAllData]);

    /**
     * Função auxiliar para obter a tarefa enriquecida por ID, caso necessário.
     * @param {string} taskId - ID da Tarefa.
     * @returns {object | null}
     */
    const getEnrichedTaskById = useCallback((taskId) => {
        return tasks.find(t => t.id === taskId) || null;
    }, [tasks]);


    return {
        tasks,
        projects,
        sankalpas,
        isLoading,
        error,
        projectMap,
        sankalpaMap,
        loadAllData, // Função para forçar o refresh após uma edição
        getEnrichedTaskById,
    };
};

