/* src/api/fileTaskAssociationAPI.js
   desc: API Hook para gerenciar File-Task Associations no Frontend.
*/

import apiClient from './apiClient';

export const FileTaskAssociationAPI = {
  
  // === CRIAR ASSOCIAÇÃO ===
  async createAssociation(fileId, taskId, relationship = 'modify', documentType = 'note') {
    const { data } = await apiClient.post('/file-task-associations', {
      fileId,
      taskId,
      relationship,
      documentType,
    });
    return data;
  },

  // === OBTER TAREFAS DE UM ARQUIVO ===
  async getTasksByFile(fileId) {
    const { data } = await apiClient.get(`/files/${fileId}/tasks`);
    return data.data || [];
  },

  // === OBTER ARQUIVOS DE UMA TAREFA ===
  async getFilesByTask(taskId) {
    const { data } = await apiClient.get(`/tasks/${taskId}/files`);
    return data.data || [];
  },

  // === ATUALIZAR TIPO DE RELACIONAMENTO ===
  async updateRelationship(fileId, taskId, relationship) {
    const { data } = await apiClient.put(`/file-task-associations/${fileId}/${taskId}`, {
      relationship,
    });
    return data;
  },

  // === REMOVER ASSOCIAÇÃO ===
  async deleteAssociation(fileId, taskId) {
    const { data } = await apiClient.delete(`/file-task-associations/${fileId}/${taskId}`);
    return data;
  },

  // === LISTAR ASSOCIAÇÕES COM FILTROS ===
  async listAssociations(filters = {}) {
    const params = new URLSearchParams();
    if (filters.fileId) params.append('fileId', filters.fileId);
    if (filters.taskId) params.append('taskId', filters.taskId);
    if (filters.relationship) params.append('relationship', filters.relationship);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);

    const { data } = await apiClient.get(`/file-task-associations?${params.toString()}`);
    return data.data || [];
  },

  // === VINCULAR TAREFA A ARQUIVO ===
  async associateTaskToFile(fileId, taskId, relationship = 'modify') {
    const { data } = await apiClient.post(`/files/${fileId}/associate-task`, {
      taskId,
      relationship,
    });
    return data;
  },

  // === VINCULAR ARQUIVO A TAREFA ===
  async associateFileToTask(taskId, fileId, relationship = 'modify') {
    const { data } = await apiClient.post(`/tasks/${taskId}/associate-file`, {
      fileId,
      relationship,
    });
    return data;
  },

  // === DESVINCULAR TAREFA DE ARQUIVO ===
  async dissociateTaskFromFile(fileId, taskId) {
    const { data } = await apiClient.delete(`/files/${fileId}/tasks/${taskId}`);
    return data;
  },

  // === DESVINCULAR ARQUIVO DE TAREFA ===
  async dissociateFileFromTask(taskId, fileId) {
    const { data } = await apiClient.delete(`/tasks/${taskId}/files/${fileId}`);
    return data;
  },
};

export default FileTaskAssociationAPI;
