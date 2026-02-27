/**
 * @file src/api/projectViews.js
 * @description Gerenciador central para as diferentes visualizações de projeto (Kanban, Sheet, Map, Chain).
 * Este arquivo atua como um adaptador especializado do apiClient.
 * * @requires ./apiClient
 */

import { apiClient } from './apiClient';

// ============================================================================
// KANBAN VIEW
// ============================================================================

/**
 * Busca os dados da visualização Kanban de um projeto.
 * @param {string} projectId - ID do projeto.
 */
export const fetchKanbanView = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/views/kanban`);
  return response.data;
};

/**
 * Adiciona uma nova coluna ao Kanban.
 * @param {string} projectId 
 * @param {string} title 
 */
export const addKanbanColumn = async (projectId, title) => {
  const response = await apiClient.post(`/projects/${projectId}/views/kanban/columns`, { title });
  return response.data;
};

/**
 * Move uma tarefa entre colunas ou posições no Kanban.
 * @param {string} taskId 
 * @param {string} sourceColumnId 
 * @param {string} destinationColumnId 
 * @param {number} newIndex 
 */
export const moveKanbanTask = async (taskId, sourceColumnId, destinationColumnId, newIndex) => {
  const response = await apiClient.put(`/tasks/${taskId}/move`, {
    sourceColumnId,
    destinationColumnId,
    newIndex
  });
  return response.data;
};

// ============================================================================
// SHEET VIEW (Planilha)
// ============================================================================

/**
 * Busca os dados para o modo Planilha.
 * @param {string} projectId 
 */
export const fetchSheetView = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/views/sheet`);
  return response.data;
};

/**
 * Adiciona uma coluna personalizada na planilha.
 * @param {string} projectId 
 * @param {object} columnData - { name, type, etc }
 */
export const addCustomSheetColumn = async (projectId, columnData) => {
  const response = await apiClient.post(`/projects/${projectId}/views/sheet/columns`, { ...columnData });
  return response.data;
};

/**
 * Atualiza a ordem ou visibilidade das colunas.
 * @param {string} projectId 
 * @param {Array} columns 
 */
export const updateSheetViewColumns = async (projectId, columns) => {
  const response = await apiClient.put(`/projects/${projectId}/views/sheet/columns`, { columns });
  return response.data;
};

// ============================================================================
// MAP & CHAIN VIEWS
// ============================================================================

/**
 * Busca dados para o Mapa Mental.
 * @param {string} projectId 
 */
export const fetchMapView = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/views/map`);
  return response.data;
};

/**
 * Busca dados para a visualização de Corrente (Chain).
 * @param {string} projectId 
 */
export const fetchChainView = async (projectId) => {
  const response = await apiClient.get(`/projects/${projectId}/views/chain`);
  return response.data;
};