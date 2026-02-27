/* src/api/papyrus.js */
import apiClient from './apiClient';

// === FUNÇÕES LEGADAS (Mantidas para compatibilidade) ===

export async function searchPapyrusNotes(query, { categories = [], limit = 20 } = {}) {
    if (!query || typeof query !== 'string') {
        throw new Error('Termo de busca é obrigatório.');
    }

    const params = new URLSearchParams();
    params.set('query', query);
    if (categories.length > 0) {
        params.set('categories', categories.join(','));
    }
    if (limit) {
        params.set('limit', String(limit));
    }

    const { data } = await apiClient.get(`/papyrus/search?${params.toString()}`);
    if (!data?.success) {
        // Se a API retornar sucesso false mas não lançar erro http
        // Adaptar conforme seu padrão de resposta do backend
        // throw new Error(data?.error || 'Falha ao buscar notas.');
        return data; // Retorna data mesmo assim se for o padrão
    }

    return data;
}

export async function applyPapyrusRetention(options = {}) {
    const { data } = await apiClient.post('/tools/papyrus/retention', options);
    return data;
}

// === NOVA API DO EDITOR (Conectada ao Controller) ===

export const Papyrus = {
    // Busca um documento pelo ID (usado no DocEditorView)
    // GET /api/papyrus/:id
    get: async (id) => {
        const { data } = await apiClient.get(`/papyrus/${id}`);
        return data;
    },

    // Lista documentos de um projeto (usado no ProjectHierarchy ou ProjectHub)
    // GET /api/papyrus/project/:projectId
    listByProject: async (projectId) => {
        const { data } = await apiClient.get(`/papyrus/project/${projectId}`);
        return data;
    },

    // Cria um novo Artefato/Documento
    // POST /api/papyrus
    create: async (payload) => {
        // payload: { title, content, projectId, authorId }
        const { data } = await apiClient.post('/papyrus', payload);
        return data;
    },

    // Atualiza um Artefato (Autosave)
    // PUT /api/papyrus/:id
    update: async (id, payload) => {
        // payload: { content, title, changeLog, userId }
        const { data } = await apiClient.put(`/papyrus/${id}`, payload);
        return data;
    },

    // Remove um Artefato
    // DELETE /api/papyrus/:id
    delete: async (id) => {
        const { data } = await apiClient.delete(`/papyrus/${id}`);
        return data;
    },
    
    // Re-exporta as funções antigas dentro do objeto para conveniência
    search: searchPapyrusNotes,
    retention: applyPapyrusRetention
};

// Export Default para facilitar importação
export default Papyrus;