/**
 * ASH TOOLS - REFERENCE GUIDE
 * 
 * Novos 4 tools disponíveis para Ash usar na conversação
 * Todos implementados em src/ai_services/toolService.js
 */

// ============================================================
// ✅ TOOL 1: send_push_notification
// ============================================================
// Enviar notificação push para o usuário (mobile/web)

const TOOL_1_SEND_PUSH = {
  example: {
    name: "send_push_notification",
    parameters: {
      userId: "user-123",
      title: "📌 Tarefa Vencida",
      body: "Sua tarefa 'Revisar documento' venceu há 2 horas",
      action: "navigate_to DASHBOARD",
      icon: "⏰"
    }
  },
  response: {
    success: true,
    notificationId: "notif-456",
    timestamp: "2025-12-12T10:30:00Z"
  },
  useCases: [
    "Lembrar o usuário sobre tarefas vencidas",
    "Alertas de eventos próximos",
    "Confirmações de ações importantes",
    "Updates em tempo real"
  ]
};

// ============================================================
// ✅ TOOL 2: send_email_reminder
// ============================================================
// Enviar email com template para o usuário

const TOOL_2_SEND_EMAIL = {
  example: {
    name: "send_email_reminder",
    parameters: {
      userId: "user-123",
      taskId: "task-789",
      template: "task_reminder", // "task_reminder" | "daily_briefing" | "ash_insight" | "team_invite"
      customData: {
        taskName: "Revisar documento",
        dueDate: "2025-12-13",
        priority: "high",
        description: "Revisar o documento de contrato"
      },
      scheduleFor: null // null = enviar imediatamente
    }
  },
  response: {
    success: true,
    emailId: "email-123",
    recipient: "user@email.com",
    timestamp: "2025-12-12T10:30:00Z"
  },
  templates: {
    task_reminder: "Lembrete de tarefa individual",
    daily_briefing: "Resumo diário completo",
    ash_insight: "Insight de IA (astrologia, human design, energia)",
    team_invite: "Convite para time"
  },
  useCases: [
    "Agendar lembretes por email",
    "Enviar resumos diários",
    "Compartilhar insights de IA",
    "Convites para times/projetos"
  ]
};

// ============================================================
// ✅ TOOL 3: send_daily_briefing
// ============================================================
// Enviar briefing diário completo ao usuário

const TOOL_3_DAILY_BRIEFING = {
  example: {
    name: "send_daily_briefing",
    parameters: {
      userId: "user-123",
      deliveryMethod: "both", // "push" | "email" | "both"
      includeInsights: true // incluir astrologia, human design, energia
    }
  },
  response: {
    success: true,
    briefingId: "brief-456",
    deliveredVia: ["push", "email"],
    timestamp: "2025-12-12T10:30:00Z",
    summary: {
      tasksCount: 5,
      eventsCount: 2,
      overdueTasks: 1
    }
  },
  useCases: [
    "Briefing matinal automático",
    "Resumo de progresso diário",
    "Motivação + dados + insights",
    "Chamada à ação (próximas prioridades)"
  ]
};

// ============================================================
// ✅ TOOL 4: send_team_invite_email
// ============================================================
// Enviar convite de time para novo usuário

const TOOL_4_TEAM_INVITE = {
  example: {
    name: "send_team_invite_email",
    parameters: {
      inviteToEmail: "novo-usuario@email.com",
      teamId: "team-123",
      teamName: "Product Team",
      inviterName: "João Silva",
      message: "Gostaria que você participasse de nosso time"
    }
  },
  response: {
    success: true,
    inviteId: "invite-789",
    recipient: "novo-usuario@email.com",
    timestamp: "2025-12-12T10:30:00Z"
  },
  useCases: [
    "Convidar novos membros para times",
    "Colaboração com outros usuários",
    "Expansão de equipes",
    "Integração de terceiros"
  ]
};

// ============================================================
// INTEGRAÇÃO NO CHAT
// ============================================================

const CHAT_INTEGRATION = `
Como usar os tools via Ash no chat:

1. Usuário: "Me avise quando minha tarefa vencer"
   → Ash: Usa send_push_notification + send_email_reminder

2. Usuário: "Me manda um briefing diário"
   → Ash: Usa send_daily_briefing (deliveryMethod: "both")

3. Usuário: "Convida João para o time"
   → Ash: Usa send_team_invite_email

4. Usuário: "Preciso lembrar de revisar esse documento"
   → Ash: Usa send_email_reminder + send_push_notification
`;

// ============================================================
// CONFIGURATION
// ============================================================

const CONFIG_SMTP = {
  gmail: {
    SMTP_HOST: "smtp.gmail.com",
    SMTP_PORT: 587,
    SMTP_USER: "seu-email@gmail.com",
    SMTP_PASS: "sua-senha-app",
    SMTP_FROM: "noreply@prana.app"
  },
  sendgrid: {
    SENDGRID_API_KEY: "SG.xxxxx",
    SENDGRID_FROM_EMAIL: "noreply@prana.app"
  }
};

const CONFIG_NOTIFICATIONS = [
  "Uses Capacitor LocalNotifications",
  "Stores in device local storage",
  "FCM/APNs ready (set GOOGLE_APPLICATION_CREDENTIALS para FCM)"
];

// ============================================================
// TROUBLESHOOTING
// ============================================================

const TROUBLESHOOTING = {
  emailNotSending: [
    "Check SMTP config in .env",
    "Run emailService.testConnection()",
    "Check firewall/ports 587, 25, 465",
    "Verify SMTP credentials"
  ],
  pushNotShowing: [
    "Check permissions granted in App.jsx",
    "Verify notificationService.isReady() returns true",
    "Check Capacitor plugins installed",
    "Test with notificationService.sendPushNotification()"
  ],
  toolsNotRecognized: [
    "Verify toolService.js has 4 tools",
    "Check chat service loading tools correctly",
    "Restart server",
    "Check console for errors"
  ]
};

// ============================================================
// IMPLEMENTATION CHECKLIST
// ============================================================

const CHECKLIST = {
  backend: {
    emailService: "✅ DONE",
    notificationService: "✅ DONE",
    ashTools: "✅ DONE",
    backendRoutes: "⏳ PENDING",
    emailQueue: "⏳ PENDING",
    testing: "⏳ PENDING"
  },
  frontend: {
    notificationService: "✅ DONE",
    papyrusEditor: "✅ DONE",
    useNotificationsHook: "✅ DONE",
    listeners: "⏳ PENDING"
  },
  configuration: {
    envSmtp: "⏳ PENDING",
    firebaseApns: "⏳ PENDING",
    capacitor: "⏳ PENDING",
    deviceTokens: "⏳ PENDING"
  },
  testing: {
    emailTest: "⏳ PENDING",
    pushTest: "⏳ PENDING",
    ashToolTest: "⏳ PENDING",
    mobileTest: "⏳ PENDING"
  }
};

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  tools: {
    sendPushNotification: TOOL_1_SEND_PUSH,
    sendEmailReminder: TOOL_2_SEND_EMAIL,
    sendDailyBriefing: TOOL_3_DAILY_BRIEFING,
    sendTeamInvite: TOOL_4_TEAM_INVITE
  },
  chatIntegration: CHAT_INTEGRATION,
  configuration: {
    smtp: CONFIG_SMTP,
    notifications: CONFIG_NOTIFICATIONS
  },
  troubleshooting: TROUBLESHOOTING,
  checklist: CHECKLIST,
  metadata: {
    version: "1.0",
    date: "2025-12-12",
    status: "READY FOR TESTING",
    author: "Prana AI"
  }
};
