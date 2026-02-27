/**
 * src/api/authService.js
 * * O Serviço de Autenticação (Frontend).
 * * Faz a ponte entre o React e a API de Autenticação.
 * *
 * * ATUALIZAÇÃO (Sintonização V6):
 * * - Rotas alinhadas com o backend (/login, /register).
 * * - Token unificado para 'prana_auth_token'.
 * * - Adicionada função 'me()' para validar sessão.
 */

import apiClient from './apiClient.js';

const TOKEN_KEY = 'prana_auth_token';

export const Auth = {
  login: async (email, password) => {
    try {
      // O apiClient já tem baseURL='/api', então aqui chamamos apenas '/login'
      const response = await apiClient.post('/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        return { 
            success: true, 
            user: response.data.user,
            token: response.data.token 
        };
      }
      return { success: false, error: 'Token não recebido.' };
    } catch (error) {
      console.error("[Auth Service] Falha no login:", error);
      throw error; // Lança para o hook tratar
    }
  },

  register: async (full_name, email, password) => {
    try {
      const response = await apiClient.post('/register', { full_name, email, password });
      
      if (response.data.token) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        return { 
            success: true, 
            user: response.data.user,
            token: response.data.token 
        };
      }
      return { success: false, error: 'Token não recebido.' };
    } catch (error) {
      console.error("[Auth Service] Falha no registro:", error);
      throw error;
    }
  },

  // Busca o usuário atual usando o token salvo
  me: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response.data.data; // O controller retorna { success: true, data: user }
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  }
};