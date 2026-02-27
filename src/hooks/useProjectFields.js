import { useState, useEffect, useCallback } from 'react';
import apiClient from '@/api/apiClient';

/**
 * Hook customizado para carregar campos customizados de um projeto
 * 
 * @param {string} projectId - ID do projeto
 * @returns {Object} { fields, workflows, loading, error, refetch }
 */
export function useProjectFields(projectId) {
  const [fields, setFields] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async () => {
    if (!projectId) {
      setFields([]);
      setWorkflows([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Busca campos do projeto
      const fieldsResponse = await apiClient.get(`/projects/${projectId}/fields`);
      const fieldsData = fieldsResponse.data?.data || [];

      // Busca workflows do projeto
      const workflowsResponse = await apiClient.get(`/projects/${projectId}/workflows`);
      const workflowsData = workflowsResponse.data?.data || [];

      // Se o projeto não tem workflows, inicializa com os 4 padrão
      if (workflowsData.length === 0) {
        try {
          const initResponse = await apiClient.post(`/projects/${projectId}/workflows/initialize`);
          setWorkflows(initResponse.data?.data || []);
        } catch (err) {
          console.warn('Erro ao inicializar workflows padrão:', err);
          setWorkflows([]);
        }
      } else {
        setWorkflows(workflowsData);
      }

      setFields(fieldsData);
    } catch (err) {
      console.error('Erro ao buscar campos do projeto:', err);
      setError(err.message);
      setFields([]);
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const refetch = useCallback(() => {
    fetchFields();
  }, [fetchFields]);

  return {
    fields,
    workflows,
    loading,
    error,
    refetch
  };
}

/**
 * Hook para criar um novo campo customizado
 */
export function useCreateField(projectId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createField = useCallback(
    async (fieldData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post(`/projects/${projectId}/fields`, fieldData);
        
        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Erro ao criar campo');
        }

        return response.data?.data;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao criar campo';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  return { createField, loading, error };
}

/**
 * Hook para atualizar um campo customizado
 */
export function useUpdateField(projectId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateField = useCallback(
    async (fieldId, updateData) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.put(`/projects/${projectId}/fields/${fieldId}`, updateData);
        
        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Erro ao atualizar campo');
        }

        return response.data?.data;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao atualizar campo';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  return { updateField, loading, error };
}

/**
 * Hook para deletar um campo customizado
 */
export function useDeleteField(projectId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteField = useCallback(
    async (fieldId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.delete(`/projects/${projectId}/fields/${fieldId}`);
        
        if (!response.data?.success) {
          throw new Error(response.data?.error || 'Erro ao deletar campo');
        }

        return response.data;
      } catch (err) {
        const errorMessage = err.response?.data?.error || err.message || 'Erro ao deletar campo';
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [projectId]
  );

  return { deleteField, loading, error };
}
