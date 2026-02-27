import apiClient from './apiClient';

export async function setCustomFieldValue(taskId, fieldName, fieldValue) {
    if (!taskId) throw new Error('Task ID é obrigatório.');
    const { data } = await apiClient.post(`/tasks/${taskId}/custom-fields`, {
        field_name: fieldName,
        field_value: fieldValue,
    });
    if (!data?.success) {
        throw new Error(data?.error || data?.message || 'Falha ao salvar campo personalizado.');
    }
    return data;
}
