/* src/services/googleCalendarService.js */
import { google } from 'googleapis';
import { db } from '../db/index.js';
import { integrations } from '../db/schema/core.js';
import { eq, and, or } from 'drizzle-orm';

/**
 * Serviço responsável por ESCREVER no Google Calendar do usuário.
 * [Atualizado] Suporta provider 'google' unificado e tratamento de datas inteligente.
 */
export const GoogleCalendarService = {
  
  /**
   * Cria um evento no Google Calendar do usuário
   * @param {string} userId - ID do usuário no Prana
   * @param {object} eventData - { title, description, startTime, endTime, isAllDay }
   */
  async createEvent(userId, eventData) {
    // 1. Busca credenciais (Suporta tanto o novo padrão 'google' quanto o legado 'google_calendar')
    const [integration] = await db.select().from(integrations)
      .where(and(
        eq(integrations.userId, userId), 
        or(
            eq(integrations.provider, 'google'),          // Novo (Gmail + Calendar)
            eq(integrations.provider, 'google_calendar')  // Antigo (Só Calendar)
        )
      ))
      .limit(1);

    if (!integration) {
      console.warn(`[GoogleCalendar] Usuário ${userId} não conectou a conta Google.`);
      return null;
    }

    // 2. Configura o Cliente OAuth2
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );

    oauth2Client.setCredentials({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken // Vital para renovar o acesso se o token expirou
    });

    // 3. Prepara os dados do evento
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    // Tratamento de Datas: Google exige formatos diferentes para "Dia Inteiro" vs "Com Hora"
    const start = new Date(eventData.startTime);
    // Se não tiver fim, assume 1 hora de duração
    const end = eventData.endTime ? new Date(eventData.endTime) : new Date(start.getTime() + 60*60*1000);

    const isAllDay = eventData.isAllDay || false;

    const eventResource = {
      summary: `[Prana] ${eventData.title}`,
      description: eventData.description || 'Criado via Prana OS',
      start: isAllDay 
        ? { date: start.toISOString().split('T')[0] } // Formato YYYY-MM-DD
        : { dateTime: start.toISOString() },          // Formato ISO8601 Completo
      end: isAllDay
        ? { date: end.toISOString().split('T')[0] }
        : { dateTime: end.toISOString() },
      colorId: '5', // 5 = Amarelo (Bold), 11 = Vermelho (Tomato)
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10 },
        ],
      },
    };

    try {
      // 4. Envia para o Google
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: eventResource, 
      });

      console.log('✅ Evento criado no Google:', response.data.htmlLink);
      
      return {
        googleId: response.data.id,
        link: response.data.htmlLink
      };

    } catch (error) {
      console.error('❌ Erro ao criar evento no Google:', error.message);
      
      // Dica: Se o erro for "invalid_grant", significa que o refresh token foi revogado pelo usuário
      if (error.response?.status === 401 || error.response?.data?.error === 'invalid_grant') {
         console.error('Token inválido ou revogado. Necessário reconectar.');
         // Aqui você poderia marcar a integração como isActive = false no banco
      }
      return null;
    }
  }
};