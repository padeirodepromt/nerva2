/* src/hooks/useProjects.js
   desc: Hook de Projetos V10. 
   feat: Sincronia com WorkspaceStore e Poda Radical via API.
*/

import { useState, useEffect, useCallback } from 'react';
import { Project } from '@/api/entities';
import { useWorkspaceStore } from '@/stores/useWorkspaceStore';

export function useProjects(filters = {}) {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Consciência V10: Captura o Realm ativo do estado global
  const { activeRealmId } = useWorkspaceStore();

  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Mesclamos os filtros passados com o filtro de Realm obrigatório da V10
      const params = { ...filters };
      
      if (activeRealmId && activeRealmId !== 'all') {
        params.realmId = activeRealmId;
      }

      const data = await Project.list(params);
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erro ao carregar projetos:', err);
      setError(err.message || 'Falha na conexão neural.');
    } finally {
      setIsLoading(false);
    }
  }, [activeRealmId, filters.type, filters.status, filters.parentId]);

  useEffect(() => {
    fetchProjects();

    // Listener para eventos globais do Prana (ex: criação de nova pasta pelo Ash)
    const handleProjectUpdate = (e) => {
      if (e.detail?.itemType === 'project') {
        fetchProjects();
      }
    };

    window.addEventListener('prana:refresh-explorer', handleProjectUpdate);
    return () => window.removeEventListener('prana:refresh-explorer', handleProjectUpdate);
  }, [fetchProjects]);

  return {
    projects,
    isLoading,
    error,
    refetch: fetchProjects,
    // Auxiliares de UI
    stats: {
      total: projects.length,
      pro: projects.filter(p => p.realmId === 'professional').length,
      life: projects.filter(p => p.realmId === 'personal').length
    }
  };
}

export function useProjectsGrouped(filters = {}) {
  const { projects, isLoading, error, ...rest } = useProjects(filters);

  // Agrupamento estático para dashboards de visão geral
  const grouped = {
    personal: projects.filter(p => p.realmId === 'personal' || p.type === 'personal'),
    professional: projects.filter(p => p.realmId === 'professional' || p.type === 'professional'),
  };

  return { projects, grouped, isLoading, error, ...rest };
}