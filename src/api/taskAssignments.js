import apiClient from './apiClient';

export async function assignTask(taskId, { teamId = null, member = null } = {}) {
  if (!taskId) throw new Error('taskId é obrigatório.');
  const { data } = await apiClient.post(`/tasks/${taskId}/assign`, {
    team_id: teamId,
    member,
  });
  if (!data?.success) {
    throw new Error(data?.error || data?.message || 'Falha ao atribuir a tarefa.');
  }
  return data;
}

export async function unassignTask(taskId) {
  if (!taskId) throw new Error('taskId é obrigatório.');
  const { data } = await apiClient.delete(`/tasks/${taskId}/assign`);
  if (!data?.success) {
    throw new Error(data?.error || data?.message || 'Falha ao remover a atribuição.');
  }
  return data;
}

export default { assignTask, unassignTask };
