/**
 * src/contexts/OllySystemContext.jsx
 * 
 * Context para Olly integrado ao Sistema Prana
 * Olly agora pode acessar e modificar projetos, tarefas, etc
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  OllyProjectAPI,
  OllyTaskAPI,
  OllyViewAPI,
  OllyDashboardAPI,
  OllyChatAPI,
  OllyAnalysisAPI,
  executeOllyFunction,
  OllyAvailableFunctions
} from '@/services/olly/OllySystemIntegration';

const OllySystemContext = createContext();

export const OllySystemProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [systemMessages, setSystemMessages] = useState([]);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  const ollyApiUrl = import.meta.env.VITE_OLLY_API_URL || 'https://gracious-hope-production.up.railway.app';
  const userId = localStorage.getItem('user_id') || 'anonymous';

  // ========================================================================
  // PROJETOS
  // ========================================================================

  const listProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyProjectAPI.listProjects(userId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const getProject = useCallback(async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await OllyProjectAPI.getProject(projectId, userId);
      if (result.success) {
        setSelectedProject(result.data);
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const createProject = useCallback(async (projectData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await OllyProjectAPI.createProject(userId, projectData);
      if (result.success) {
        await addSystemMessage({
          type: 'success',
          title: 'Projeto Criado',
          message: result.message,
          data: result.data
        });
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const updateProject = useCallback(async (projectId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyProjectAPI.updateProject(projectId, userId, updateData);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const deleteProject = useCallback(async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyProjectAPI.deleteProject(projectId, userId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ========================================================================
  // TAREFAS
  // ========================================================================

  const listTasks = useCallback(async (projectId, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyTaskAPI.listTasks(projectId, filters);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (projectId, taskData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await OllyTaskAPI.createTask(projectId, taskData);
      if (result.success) {
        await addSystemMessage({
          type: 'success',
          title: 'Tarefa Criada',
          message: result.message,
          data: result.data
        });
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (taskId, updateData) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyTaskAPI.updateTask(taskId, updateData);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeTask = useCallback(async (taskId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await OllyTaskAPI.completeTask(taskId);
      if (result.success) {
        await addSystemMessage({
          type: 'success',
          title: 'Tarefa Concluída',
          message: 'Parabéns pela conclusão!',
          data: result.data
        });
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyTaskAPI.deleteTask(taskId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================
  // VIEWS
  // ========================================================================

  const listViews = useCallback(async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyViewAPI.listViews(projectId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createView = useCallback(async (projectId, viewData) => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyViewAPI.createView(projectId, viewData);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================
  // DASHBOARD
  // ========================================================================

  const getDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyDashboardAPI.getDashboardData(userId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const getInsights = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      return await OllyDashboardAPI.getInsights(userId);
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ========================================================================
  // ANÁLISE
  // ========================================================================

  const analyzeProject = useCallback(async (projectId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await OllyAnalysisAPI.analyzeProject(projectId, userId);
      if (result.success) {
        setCurrentAnalysis(result.data);
        await addSystemMessage({
          type: 'analysis',
          title: 'Análise do Projeto',
          message: `Projeto "${result.data.projectName}" analisado com sucesso!`,
          data: result.data
        });
      }
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // ========================================================================
  // MENSAGENS DO SISTEMA
  // ========================================================================

  const addSystemMessage = useCallback(async (message) => {
    const newMessage = {
      id: Date.now(),
      timestamp: new Date(),
      ...message
    };
    setSystemMessages(prev => [...prev, newMessage]);
  }, []);

  const clearSystemMessages = useCallback(() => {
    setSystemMessages([]);
  }, []);

  // ========================================================================
  // OLLY EXECUTAR AÇÕES (Function Calling)
  // ========================================================================

  const executeAction = useCallback(async (functionName, params) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await executeOllyFunction(functionName, params);
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ========================================================================
  // CHAT COM OLLY (Enviar para API e processar respostas)
  // ========================================================================

  const chatWithOlly = useCallback(async (userMessage) => {
    try {
      setIsLoading(true);
      setError(null);

      // Enviar para Olly API
      const response = await fetch(`${ollyApiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('prana_token')}`
        },
        body: JSON.stringify({
          message: userMessage,
          context: {
            user_id: userId,
            available_functions: OllyAvailableFunctions
          }
        })
      });

      if (!response.ok) throw new Error('Erro ao conectar com Olly');

      const data = await response.json();

      // Se Olly quer executar uma ação
      if (data.function_call) {
        const actionResult = await executeAction(
          data.function_call.name,
          data.function_call.parameters
        );
        return {
          success: true,
          message: data.message,
          action_executed: data.function_call.name,
          action_result: actionResult
        };
      }

      return { success: true, message: data.message };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  }, [userId, executeAction]);

  const value = {
    // Estado
    isLoading,
    error,
    systemMessages,
    currentAnalysis,
    selectedProject,

    // Projetos
    listProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,

    // Tarefas
    listTasks,
    createTask,
    updateTask,
    completeTask,
    deleteTask,

    // Views
    listViews,
    createView,

    // Dashboard
    getDashboardData,
    getInsights,

    // Análise
    analyzeProject,

    // Mensagens
    addSystemMessage,
    clearSystemMessages,

    // Ações
    executeAction,
    chatWithOlly
  };

  return (
    <OllySystemContext.Provider value={value}>
      {children}
    </OllySystemContext.Provider>
  );
};

export const useOllySystem = () => {
  const context = useContext(OllySystemContext);
  if (!context) {
    throw new Error('useOllySystem deve ser usado dentro de OllySystemProvider');
  }
  return context;
};

export default OllySystemContext;
