/* src/api/integrations.js
   desc: Serviço dedicado a gerenciar o ciclo de vida OAuth (Google, Slack, Notion).
   role: A ponte entre o Frontend e os endpoints de autenticação externa do Backend.
*/

import { apiClient } from './apiClient';

// Helper local para extrair dados do axios
const unwrap = (response) => response.data;

export class Integration {
    static resource = 'integrations';

    /**
     * Obtém o estado atual de todas as integrações do usuário.
     * @returns {Promise<Array>} Ex: [{ provider: 'google_calendar', connected: true, account: 'eu@gmail.com' }]
     */
    static async getStatus() {
        const response = await apiClient.get(`/${this.resource}/status`);
        return unwrap(response);
    }

    /**
     * Inicia o fluxo de conexão OAuth.
     * @param {string} provider - 'google_calendar', 'google_drive', 'slack', 'notion'
     * @returns {Promise<Object>} Ex: { url: 'https://accounts.google.com/o/oauth2/v2/auth?...' }
     */
    static async connect(provider) {
        // O backend gera a URL segura de redirecionamento para o provedor
        const response = await apiClient.post(`/${this.resource}/connect`, { provider });
        return unwrap(response);
    }

    /**
     * Desconecta uma integração e remove os tokens do banco.
     * @param {string} provider 
     */
    static async disconnect(provider) {
        const response = await apiClient.post(`/${this.resource}/disconnect`, { provider });
        return unwrap(response);
    }

    /**
     * (Opcional) Troca o código recebido na URL pelo token final.
     * Útil se o seu callback for tratado no Frontend (SPA) antes de enviar ao Back.
     * @param {string} provider 
     * @param {string} code - O código vindo da URL (?code=...)
     */
    static async handleCallback(provider, code) {
        const response = await apiClient.post(`/${this.resource}/callback`, { 
            provider, 
            code 
        });
        return unwrap(response);
    }

    /**
     * Sincroniza dados manualmente (Forçar refresh).
     * Ex: Puxar eventos do Google Calendar agora.
     */
    static async sync(provider) {
        const response = await apiClient.post(`/${this.resource}/sync`, { provider });
        return unwrap(response);
    }
}