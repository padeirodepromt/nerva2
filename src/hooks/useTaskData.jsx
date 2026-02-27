/*
 * =================================================================
 * ARQUITETURA FRACTAL: O HOOK ORQUESTRADOR DE DADOS
 *
 * INTENÇÃO:
 * Este hook foi "curado" de sua condição de "Hook Deus".
 *
 * 1. Ele NÃO gerencia mais o estado. Ele o consome
 * diretamente do 'useTaskStore'.
 * 2. Sua única responsabilidade é ORQUESTRAR A LÓGICA
 * de *buscar* e *atualizar* dados (API) e
 * entregá-los ao store.
 * =================================================================
 */

import { useEffect, useCallback } from 'react';
import { useTaskStore } from '@/stores/useTaskStore';
import { apiClient, handleRequest } from '@/api/apiClient';
import { toast } from 'sonner';

// Ações de API separadas para clareza
const api = {
  fetchProjects: () => handleRequest(apiClient.get('/projects')),
  fetchProjectHierarchy: () => handleRequest(apiClient.get('/projects/hierarchy')),
  fetchTasks: () => handleRequest(apiClient.get('/tasks')),
  createTask: (taskData) => handleRequest(apiClient.post('/tasks', taskData)),
  updateTask: (taskId, taskData) => handleRequest(apiClient.put(`/tasks/${taskId}`, taskData)),
  deleteTask: (taskId) => handleRequest(apiClient.delete(`/tasks/${taskId}`)),
  createProject: (projectData) => handleRequest(apiClient.post('/projects', projectData)),
  updateProject: (projectId, projectData) => handleRequest(apiClient.put(`/projects/${projectId}`, projectData)),
};

export const useTaskData = () => {
  // === ESTADO (Consumido do Store) ===
  const {
    // Estado
    projects,
    tasks,
    projectHierarchy,
    loading,
    error,
    selectedProjectId,
    selectedTaskId,
    taskModalOpen,

    // Ações (Mutations)
    setLoading,
    setError,
    setProjects,
    setProjectHierarchy,
    setTasks,
    upsertProject,
    removeProject,
    upsertTask,
    removeTask,
    selectProject,
    selectTask,
    closeTaskModal,

    // Seletores (Getters)
    getSelectedTaskDetails,
  } = useTaskStore((state) => state);

  // === ORQUESTRADOR DE AÇÕES ===

  // --- Funções de Busca (Fetch) ---

  const fetchAllProjects = useCallback(async () => {
    setLoading('projects', true);
    const data = await api.fetchProjects();
    if (data) {
      setProjects(data);
    }
    setLoading('projects', false);
  }, [setLoading, setProjects]);

  const fetchHierarchy = useCallback(async () => {
    setLoading('hierarchy', true);
    const data = await api.fetchProjectHierarchy();
    if (data) {
      setProjectHierarchy(data);
    }
    setLoading('hierarchy', false);
  }, [setLoading, setProjectHierarchy]);

  const fetchAllTasks = useCallback(async () => {
    setLoading('tasks', true);
    const data = await api.fetchTasks();
    if (data) {
      setTasks(data);
    }
    setLoading('tasks', false);
  }, [setLoading, setTasks]);

  // --- Funções de Mutação (CRUD) ---

  const handleCreateTask = useCallback(async (taskData) => {
    const newTask = await api.createTask(taskData);
    if (newTask) {
      upsertTask(newTask); // Atualiza o store
      toast.success('Tarefa criada com sucesso!');
    }
    return newTask;
  }, [upsertTask]);

  const handleUpdateTask = useCallback(async (taskId, taskData) => {
    const updatedTask = await api.updateTask(taskId, taskData);
    if (updatedTask) {
      upsertTask(updatedTask); // Atualiza o store
    }
    return updatedTask;
  }, [upsertTask]);

  const handleDeleteTask = useCallback(async (taskId) => {
    const result = await api.deleteTask(taskId);
    if (result) {
      removeTask(taskId); // Remove do store
    }
    return result;
  }, [removeTask]);

  const handleCreateProject = useCallback(async (projectData) => {
    const newProject = await api.createProject(projectData);
    if (newProject) {
      upsertProject(newProject); // Atualiza o store
    }
    return newProject;
  }, [upsertProject]);

  const handleUpdateProject = useCallback(async (projectId, projectData) => {
    const updatedProject = await api.updateProject(projectId, projectData);
    if (updatedProject) {
      upsertProject(updatedProject); // Atualiza o store
    }
    return updatedProject;
  }, [upsertProject]);

  // Carregamento inicial de dados
  useEffect(() => {
    // Carrega a hierarquia (que contém projetos e tarefas) por padrão
    fetchHierarchy();
  }, [fetchHierarchy]);

  // Retorna o estado e os orquestradores para a UI
  return {
    // Estado
    projects,
    tasks,
    projectHierarchy,
    loading,
    error,
    selectedProjectId,
    selectedTaskId,
    taskModalOpen,

    // Ações de UI
    selectProject,
    selectTask,
    closeTaskModal,

    // Seletores
    getSelectedTaskDetails,

    // Orquestradores de Mutação
    createTask: handleCreateTask,
    updateTask: handleUpdateTask,
    deleteTask: handleDeleteTask,
    createProject: handleCreateProject,
    updateProject: handleUpdateProject,

    // Orquestradores de Busca
    fetchAllProjects,
    fetchAllTasks,
    fetchHierarchy,
  };
};
