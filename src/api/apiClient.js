import axios from 'axios';

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de Requisição: Anexa o Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prana_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Resposta: Trata Erros
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log de erro opcional
    return Promise.reject(error);
  }
);

// --- EXPORTAÇÕES ---
// Essencial: Exporta tanto como default quanto como nomeado
export default apiClient;
export { apiClient };

export const handleRequest = async (requestFn) => {
    try {
        const response = await requestFn();
        return { data: response.data, error: null };
    } catch (error) {
        return { data: null, error: error.response?.data || error.message };
    }
};