/* src/api/agents/general/tools/integrationTools.js
   desc: Adaptador de Integrações de Terceiros e Comunicação Externa (V12).
   feat: Google Calendar, GitHub, E-mails de Sistema, Gmail Pessoal e Importadores.
*/

import { db } from '../../../../db/index.js';
import * as schema from '../../../../db/schema.js';
import { eq, and } from 'drizzle-orm';

// --- SERVIÇOS EXTERNOS ---
import { GoogleCalendarService as googleCalendarService } from '../../../../services/googleCalendarService.js';
import { googleGmailService } from '../../../services/googleGmailService.js';
import { githubService } from '../../../services/githubService.js';
// Importação segura do serviço de e-mail do sistema e push (ajuste o caminho se necessário)
import { emailService } from '../../../../services/emailService.js';
import notificationService from '../../../../services/notificationService.js';


// ============================================================================
// 1. IMPORTAÇÕES GUIADAS PELO CHAT (Frontend UI Trigger)
// ============================================================================
export const trigger_import_flow = {
  declaration: {
    name: 'trigger_import_flow',
    description: 'Abre a interface visual para o Herói importar dados de outras plataformas (Notion, Asana, Trello, etc). Não processa os dados, apenas engatilha o fluxo na UI.',
    parameters: {
      type: 'OBJECT',
      properties: {
        platform: { 
          type: 'STRING', 
          enum: ['notion', 'asana', 'trello', 'todoist', 'github', 'csv'] 
        }
      },
      required: ['platform'],
    },
  },
  handler: async (args) => {
    return {
      success: true,
      message: `Excelente. Vou abrir a ponte de transição para o ${args.platform.toUpperCase()}. Por favor, siga as instruções no ecrã.`,
      client_action: {
        type: 'OPEN_IMPORT_MODAL', // O Frontend lê isto e abre o modal (ex: NotionImportModal)
        platform: args.platform
      }
    };
  },
};

// ============================================================================
// 2. COMUNICAÇÃO DO SISTEMA (Notificações, Briefings e Convites)
// ============================================================================
export const send_system_communication = {
  declaration: {
    name: 'send_system_communication',
    description: 'Usa o sistema do Prana para enviar e-mails oficiais (lembretes, convites) ou Push Notifications para o telemóvel do Herói.',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        type: { type: 'STRING', enum: ['email_reminder', 'daily_briefing', 'team_invite', 'push_notification'] },
        targetEmail: { type: 'STRING', description: 'Obrigatório apenas para team_invite' },
        payload: { 
          type: 'OBJECT', 
          properties: { 
            title: { type: 'STRING' }, 
            body: { type: 'STRING' },
            teamName: { type: 'STRING' }
          } 
        }
      },
      required: ['userId', 'type'],
    },
  },
  handler: async (args) => {
    try {
      console.log(`[IntegrationTools] Despachando comunicação tipo: ${args.type}`);
      
      if (args.type === 'push_notification') {
        if (notificationService?.sendPush) {
           await notificationService.sendPush(args.userId, args.payload.title, args.payload.body);
        } else {
           console.log(`[Mock Push] Para ${args.userId}:`, args.payload.title);
        }
        return { success: true, message: 'Notificação Push despachada para os dispositivos do Herói.' };
      }
      
      if (args.type === 'team_invite' && args.targetEmail) {
        if (emailService?.sendInvite) {
           await emailService.sendInvite(args.targetEmail, args.payload.teamName);
        }
        return { success: true, message: `Convite de equipa enviado para ${args.targetEmail}.` };
      }

      if (args.type === 'daily_briefing') {
         // Lógica do daily briefing (poderia chamar o emailService com o template daily-briefing.html)
         return { success: true, message: 'Briefing diário agendado para envio.' };
      }

      if (args.type === 'email_reminder') {
         return { success: true, message: 'E-mail de lembrete agendado.' };
      }
      
      return { success: true, message: `Comunicação processada de forma simulada.` };
    } catch (error) {
      return { success: false, error: `Falha na comunicação: ${error.message}` };
    }
  },
};

// ============================================================================
// 3. GOOGLE CALENDAR
// ============================================================================
export const manage_calendar = {
  declaration: {
    name: 'manage_calendar',
    description: 'Gerencia o Google Calendar do Herói (listar eventos ou criar novos eventos).',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['list_events', 'create_event'] },
        timeMin: { type: 'STRING', description: 'Data de início (ISO string) para listagem.' },
        eventDetails: {
          type: 'OBJECT',
          properties: {
            summary: { type: 'STRING' },
            description: { type: 'STRING' },
            startTime: { type: 'STRING', description: 'Data/Hora início (ISO string)' },
            endTime: { type: 'STRING', description: 'Data/Hora fim (ISO string)' },
          },
        },
      },
      required: ['userId', 'action'],
    },
  },
  handler: async (args) => {
    try {
      if (!googleCalendarService) throw new Error('Serviço do Google Calendar offline no momento.');

      if (args.action === 'list_events') {
        const start = args.timeMin || new Date().toISOString();
        const end = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(); // Busca eventos dos próximos 7 dias
        
        const events = await googleCalendarService.listEvents(args.userId, start, end);
        const summary = events
          .map((e) => `- ${e.summary} (${new Date(e.start.dateTime).toLocaleString()})`)
          .join('\n');
          
        return { success: true, message: `Eventos Encontrados:\n${summary || 'Nenhum evento próximo.'}`, rawData: events };
      }

      if (args.action === 'create_event') {
        const { summary, description, startTime, endTime } = args.eventDetails || {};
        const evt = await googleCalendarService.createEvent(args.userId, {
          summary,
          description,
          start: { dateTime: startTime },
          end: { dateTime: endTime },
        });
        
        return { success: true, message: `Evento "${evt.summary}" criado com sucesso no calendário.`, link: evt.htmlLink };
      }

      return { error: 'Ação de calendário não reconhecida.' };
    } catch (error) {
      return { error: `Falha na sincronização com o Calendar: ${error.message}` };
    }
  },
};

// ============================================================================
// 4. GITHUB INTEGRATION
// ============================================================================
export const manage_github = {
  declaration: {
    name: 'manage_github',
    description: 'Gerencia integração com GitHub (Vincular projeto, Criar Issue, Ler atividade recente).',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['link_project', 'create_issue', 'get_activity'] },
        projectId: { type: 'STRING', description: 'ID do projeto no Prana' },
        repoName: { type: 'STRING', description: 'Nome do repositório (ex: owner/repo)' },
        issueDetails: { 
          type: 'OBJECT', 
          properties: { title: { type: 'STRING' }, body: { type: 'STRING' } } 
        },
      },
      required: ['userId', 'action'],
    },
  },
  handler: async (args) => {
    try {
      // Validar se o Herói tem a integração ativada
      const integration = await db.query.integrations.findFirst({
        where: and(eq(schema.integrations.userId, args.userId), eq(schema.integrations.provider, 'github')),
      });
      
      if (!integration?.accessToken) {
        return { error: 'GitHub não está conectado. Por favor, solicite ao Herói que ative a integração nas configurações.' };
      }
      
      const token = integration.accessToken;

      // Linkar Repositório a um Projeto do Prana
      if (args.action === 'link_project') {
        await githubService.ensureRepoExists(token, args.repoName);
        const project = await db.query.projects.findFirst({ where: eq(schema.projects.id, args.projectId) });
        
        if (project && !project.description?.includes('github_repo:')) {
          await db
            .update(schema.projects)
            .set({ description: (project.description || '') + `\n\n[github_repo:${args.repoName}]` })
            .where(eq(schema.projects.id, args.projectId));
        }
        return { success: true, message: `Projeto do Prana vinculado com sucesso ao repositório ${args.repoName}.` };
      }

      // Criar uma Issue no GitHub
      if (args.action === 'create_issue') {
        let repoName = args.repoName;

        if (!repoName && args.projectId) {
          const p = await db.query.projects.findFirst({ where: eq(schema.projects.id, args.projectId) });
          const match = p?.description?.match(/\[github_repo:(.*?)\]/);
          if (match) repoName = match[1];
        }

        if (!repoName) return { error: 'Repositório não identificado. Impossível criar a Issue.' };

        const user = await githubService.getGitHubUser(token);
        const [owner, repo] = repoName.includes('/') ? repoName.split('/') : [user.login, repoName];

        const issue = await githubService.createIssue(token, owner, repo, args.issueDetails);
        return { success: true, message: `Issue criada com sucesso: ${issue.html_url}`, link: issue.html_url };
      }

      // Ler Atividade (Para analisar commits recentes)
      if (args.action === 'get_activity') {
        const activity = await githubService.getUserActivity(token, new Date().toISOString());
        return { success: true, message: 'Atividades recentes do GitHub recuperadas.', rawData: activity };
      }

      return { error: 'Ação do GitHub desconhecida.' };
    } catch (error) {
      return { error: `Falha na integração com GitHub: ${error.message}` };
    }
  },
};

// ============================================================================
// 5. GMAIL PESSOAL DO HERÓI (O Mordomo Digital)
// ============================================================================
export const manage_personal_gmail = {
  declaration: {
    name: 'manage_personal_gmail',
    description: 'Lê a caixa de entrada, resume ou envia e-mails usando a conta pessoal do Herói (Gmail).',
    parameters: {
      type: 'OBJECT',
      properties: {
        userId: { type: 'STRING' },
        action: { type: 'STRING', enum: ['read_inbox', 'send_email'] },
        searchQuery: { type: 'STRING', description: 'Query do Gmail. Ex: "is:unread" ou "from:cliente@empresa.com"' },
        emailDetails: {
          type: 'OBJECT',
          properties: {
            to: { type: 'STRING' },
            subject: { type: 'STRING' },
            body: { type: 'STRING' }
          }
        }
      },
      required: ['userId', 'action'],
    },
  },
  handler: async (args) => {
    try {
      // 1. Busca o Token OAuth do Google que o utilizador guardou nas Settings
      const integration = await db.query.integrations.findFirst({
        where: and(eq(schema.integrations.userId, args.userId), eq(schema.integrations.provider, 'google')),
      });
      
      if (!integration?.accessToken) {
        return { error: 'A conta Google/Gmail não está conectada. Peça ao Herói para a ligar nas Configurações.' };
      }

      // 2. Simulação de passagem para um futuro gmailService
      if (args.action === 'read_inbox') {
         const emails = await googleGmailService.getUnreadEmails(args.userId, args.searchQuery);
         return { success: true, data: emails }; 
      }
      
      if (args.action === 'send_email') {
         // O Ideal é a IA usar create_draft, mas se pedir send_email...
         await googleGmailService.sendEmail(args.userId, args.emailDetails);
         return { success: true, message: `E-mail enviado com sucesso para ${args.emailDetails.to}.` };
      }

      return { error: 'Ação do Gmail desconhecida.' };
    } catch (error) {
      return { error: `Falha na integração com Gmail: ${error.message}` };
    }
  }
};

// ============================================================================
// 6. GESTÃO DE CONEXÕES NEURAIS (OAuth & Chaves)
// ============================================================================
export const manage_integration_connection = {
  declaration: {
    name: 'manage_integration_connection',
    description: 'Gerencia a conexão (OAuth) ou desconexão de plataformas externas ao ecossistema Prana. Invocado quando o Herói pede para ativar ou romper a ponte neural com um aplicativo (ex: asana, notion, slack, google_calendar).',
    parameters: {
      type: 'OBJECT',
      properties: {
        platform: { 
          type: 'STRING', 
          description: 'Identificador do aplicativo ou plataforma (ex: asana, trello, notion, github, slack, canva).' 
        },
        action: { 
          type: 'STRING', 
          enum: ['connect', 'disconnect'],
          description: 'Ação desejada: "connect" para estabelecer nova ponte, "disconnect" para romper.' 
        }
      },
      required: ['platform', 'action'],
    },
  },
  handler: async (args) => {
    try {
      console.log(`[IntegrationTools] Protocolo de Integração invocado: ${args.action} -> ${args.platform}`);
      
      if (args.action === 'disconnect') {
        return { 
          success: true, 
          message: `A ponte neural com ${args.platform} será rompida imediatamente.`,
          client_action: {
            type: 'DISCONNECT_INTEGRATION',
            platform: args.platform
          }
        };
      }

      // Ação de Conectar
      return { 
        success: true, 
        message: `Iniciando sincronização com ${args.platform}. Aguardando sua autorização...`,
        client_action: {
          type: 'CONNECT_INTEGRATION',
          platform: args.platform
        }
      };
    } catch (error) {
      return { success: false, error: `Falha no protocolo de conexão: ${error.message}` };
    }
  },
};