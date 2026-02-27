/* src/services/googleGmailService.js
   desc: Serviço de Integração Real com a API do Gmail do Herói.
   feat: Ler e-mails, responder e criar rascunhos.
*/

import { google } from 'googleapis';
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';

/**
 * Utilitário para inicializar o cliente do Gmail com o token do utilizador
 */
async function getGmailClient(userId) {
  // 1. Busca o token do banco de dados
  const integration = await db.query.integrations.findFirst({
    where: and(
      eq(schema.integrations.userId, userId),
      eq(schema.integrations.provider, 'google')
    ),
  });

  if (!integration || !integration.accessToken) {
    throw new Error('Integração com Google não encontrada ou expirada. Reconecte nas configurações.');
  }

  // 2. Configura o cliente OAuth2
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );

  oAuth2Client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken,
    // Caso precise de gerir a validade: expiry_date: integration.tokenExpiry
  });

  // 3. Retorna a instância do Gmail
  return google.gmail({ version: 'v1', auth: oAuth2Client });
}

/**
 * Decodifica o corpo de um email (base64)
 */
function decodeBase64(data) {
  if (!data) return '';
  return Buffer.from(data, 'base64').toString('utf-8');
}

/**
 * Cria uma mensagem crua no formato RFC 2822 para enviar via API do Gmail
 */
function createRawEmail({ to, subject, body, threadId = null }) {
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  let messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    body,
  ];

  if (threadId) {
     // Para garantir que agrupa na mesma conversa, poderíamos adicionar
     // os headers In-Reply-To e References, mas o Gmail API geralmente
     // agrupa apenas passando o threadId na chamada da API.
  }

  const message = messageParts.join('\n');
  return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}


export const googleGmailService = {
  
  /**
   * 📥 Lê e-mails não lidos (ou usa uma query específica)
   */
  async getUnreadEmails(userId, query = 'is:unread') {
    const gmail = await getGmailClient(userId);
    
    // Busca a lista de IDs de e-mails
    const response = await gmail.users.messages.list({
      userId: 'me',
      q: query,
      maxResults: 10, // Limite seguro para o contexto do LLM
    });

    const messages = response.data.messages;
    if (!messages || messages.length === 0) {
      return [];
    }

    // Busca o conteúdo de cada e-mail
    const emailDetails = [];
    for (const msg of messages) {
      const emailInfo = await gmail.users.messages.get({
        userId: 'me',
        id: msg.id,
        format: 'metadata', // Puxa apenas headers básicos + snippet
        metadataHeaders: ['From', 'Subject', 'Date']
      });

      const headers = emailInfo.data.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || 'Sem Assunto';
      const from = headers.find(h => h.name === 'From')?.value || 'Desconhecido';

      emailDetails.push({
        id: emailInfo.data.id,
        threadId: emailInfo.data.threadId,
        from,
        subject,
        snippet: emailInfo.data.snippet, // Um resumo útil do texto
      });
    }

    return emailDetails;
  },

  /**
   * 📤 Envia um e-mail diretamente
   */
  async sendEmail(userId, { to, subject, body, threadId }) {
    const gmail = await getGmailClient(userId);
    const raw = createRawEmail({ to, subject, body, threadId });

    const requestBody = { raw };
    if (threadId) requestBody.threadId = threadId;

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody,
    });

    return res.data;
  },

  /**
   * 📝 Cria um rascunho (Draft) - Ação recomendada para a Flor
   */
  async createDraft(userId, { to, subject, body, threadId }) {
    const gmail = await getGmailClient(userId);
    const raw = createRawEmail({ to, subject, body, threadId });

    const message = { raw };
    if (threadId) message.threadId = threadId;

    const res = await gmail.users.drafts.create({
      userId: 'me',
      requestBody: {
        message
      },
    });

    return res.data;
  }
};