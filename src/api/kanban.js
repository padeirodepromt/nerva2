// src/api/kanban.js
// Serviço dedicado às operações da vista Kanban.

import apiClient from './apiClient';

export const getKanbanView = async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/kanban-view`);
    return response.data;
};

export const addCustomColumnKanban = async (projectId, columnName) => {
    const response = await apiClient.post(`/projects/${projectId}/kanban-columns`, {
        column_name: columnName,
    });
    return response.data;
};

export default {
    getKanbanView,
    addCustomColumnKanban,
};
