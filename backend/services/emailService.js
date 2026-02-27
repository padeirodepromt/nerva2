/**
 * backend/services/emailService.js
 * Serviço de email para Prana
 * Suporta: SendGrid, Nodemailer, templates personalizados
 * 
 * Uso:
 *   await emailService.sendTaskReminder(task);
 *   await emailService.sendDailyBriefing(user, briefing);
 *   await emailService.sendEmail(to, template, data);
 */

const nodemailer = require('nodemailer');
const Handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

// Configuração do SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Cache de templates compilados
const templateCache = {};

/**
 * Carrega e compila template Handlebars
 */
async function loadTemplate(templateName) {
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
  const content = fs.readFileSync(templatePath, 'utf-8');
  const compiled = Handlebars.compile(content);
  
  templateCache[templateName] = compiled;
  return compiled;
}

/**
 * Renderiza template com dados
 */
async function renderTemplate(templateName, data) {
  const template = await loadTemplate(templateName);
  return template(data);
}

/**
 * Envia email genérico
 */
async function sendEmail(to, template, subject, data = {}) {
  try {
    const html = await renderTemplate(template, {
      ...data,
      year: new Date().getFullYear(),
      unsubscribeToken: data.unsubscribeToken || 'token',
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@prana.app',
      to,
      subject,
      html,
      headers: {
        'X-Mailer': 'Prana v3.0',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Email] Enviado para ${to}:`, info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email] Erro ao enviar para ${to}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Envia lembrete de tarefa
 */
async function sendTaskReminder(task, userEmail) {
  return sendEmail(
    userEmail,
    'task-reminder',
    `Lembrete: ${task.name}`,
    {
      taskName: task.name,
      taskDescription: task.description || 'Sem descrição',
      dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('pt-BR') : 'Sem data',
      taskUrl: `${process.env.APP_URL}/task/${task.id}`,
      priority: task.priority || 'normal',
    }
  );
}

/**
 * Envia briefing diário
 */
async function sendDailyBriefing(userEmail, briefing) {
  return sendEmail(
    userEmail,
    'daily-briefing',
    `☀️ Seu briefing de ${new Date().toLocaleDateString('pt-BR')}`,
    {
      userName: briefing.userName || 'Usuário',
      todayDate: new Date().toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      taskCount: briefing.tasks?.length || 0,
      eventCount: briefing.events?.length || 0,
      overdueTasks: briefing.overdue || 0,
      tasks: briefing.tasks || [],
      events: briefing.events || [],
      insights: briefing.insights || [],
      appUrl: process.env.APP_URL || 'https://prana.app',
    }
  );
}

/**
 * Envia insight do Ash (AI)
 */
async function sendAshInsight(userEmail, insight) {
  return sendEmail(
    userEmail,
    'ash-insight',
    `💡 ${insight.title}`,
    {
      userName: insight.userName || 'Usuário',
      title: insight.title,
      content: insight.content,
      category: insight.category || 'general',
      astrology: insight.astrology || '',
      humanDesign: insight.humanDesign || '',
      energy: insight.energy || '',
      appUrl: process.env.APP_URL || 'https://prana.app',
    }
  );
}

/**
 * Envia convite de equipe
 */
async function sendTeamInvite(userEmail, team, inviterName) {
  return sendEmail(
    userEmail,
    'team-invite',
    `Você foi convidado para ${team.name} no Prana`,
    {
      teamName: team.name,
      inviterName,
      teamDescription: team.description || 'Uma equipe colaborativa',
      acceptUrl: `${process.env.APP_URL}/invite/${team.inviteToken}`,
      appUrl: process.env.APP_URL || 'https://prana.app',
    }
  );
}

/**
 * Verifica se SMTP está configurado
 */
function isConfigured() {
  return process.env.SMTP_USER && process.env.SMTP_PASS;
}

/**
 * Testa conexão SMTP
 */
async function testConnection() {
  try {
    await transporter.verify();
    console.log('[Email] Conexão SMTP verificada ✅');
    return true;
  } catch (error) {
    console.error('[Email] Erro na conexão SMTP:', error);
    return false;
  }
}

module.exports = {
  sendEmail,
  sendTaskReminder,
  sendDailyBriefing,
  sendAshInsight,
  sendTeamInvite,
  renderTemplate,
  isConfigured,
  testConnection,
};
