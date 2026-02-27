# 🤖 ASH TOOLS QUICK REFERENCE

**4 Novos Tools Disponíveis no Ash**

---

## 1️⃣ send_push_notification

**Uso:** Enviar notificação push para o dispositivo do usuário

```json
{
  "tool": "send_push_notification",
  "parameters": {
    "userId": "user-123",
    "title": "📌 Título da notificação",
    "body": "Corpo da mensagem (máx 200 chars)",
    "action": "navigate_to DASHBOARD",
    "icon": "📌"
  }
}
```

**Parâmetros:**
- `userId` (obrigatório): ID do usuário destinatário
- `title`: Título curto (máx 50 chars)
- `body`: Mensagem (máx 200 chars)
- `action`: Ação ao clicar (ex: `navigate_to DASHBOARD`, `open_task TASK_ID`)
- `icon`: Emoji para visual (ex: 📌, ⏰, 🎉, ✨)

**Resultado:** Notificação aparece no dispositivo em tempo real

**Exemplo Real:**
```json
{
  "tool": "send_push_notification",
  "parameters": {
    "userId": "maria-silva",
    "title": "⏰ Tarefa Vencida",
    "body": "Finalizar relatório foi vencido hoje!",
    "action": "navigate_to TASK_DETAIL",
    "icon": "⏰"
  }
}
```

---

## 2️⃣ send_email_reminder

**Uso:** Enviar email com template renderizado

```json
{
  "tool": "send_email_reminder",
  "parameters": {
    "userId": "user-123",
    "taskId": "task-456",
    "template": "task_reminder",
    "customData": {
      "name": "João Silva",
      "taskName": "Finalizar projeto X",
      "dueDate": "2025-12-15",
      "priority": "high",
      "description": "Entregar documento final"
    },
    "scheduleFor": "2025-12-13T09:00:00Z"
  }
}
```

**Parâmetros:**
- `userId`: ID do usuário
- `taskId`: ID da tarefa (opcional)
- `template`: `task_reminder` | `daily_briefing` | `ash_insight` | `team_invite`
- `customData`: Objeto com variáveis para o template
- `scheduleFor`: ISO datetime para agendar (opcional)

**Templates Disponíveis:**

### task_reminder
```javascript
customData: {
  name: "Nome do usuário",
  taskName: "Nome da tarefa",
  dueDate: "2025-12-15",
  priority: "high|normal|low",
  description: "Descrição da tarefa"
}
```

### daily_briefing
```javascript
customData: {
  name: "Nome do usuário",
  taskCount: 5,
  eventCount: 3,
  overdueCount: 1,
  tasks: [{name, dueDate, priority}],
  events: [{name, time}],
  insights: ["insight 1", "insight 2"]
}
```

### ash_insight
```javascript
customData: {
  name: "Nome do usuário",
  insight: "Texto do insight IA",
  category: "astrologia|human_design|energia"
}
```

### team_invite
```javascript
customData: {
  inviteeName: "Nome da pessoa",
  teamName: "Nome do time",
  inviterName: "Nome de quem convidou",
  message: "Mensagem personalizada"
}
```

**Resultado:** Email enfileirado, renderizado com template e enviado via SMTP

**Exemplo Real:**
```json
{
  "tool": "send_email_reminder",
  "parameters": {
    "userId": "maria-silva",
    "taskId": "task-abc123",
    "template": "task_reminder",
    "customData": {
      "name": "Maria Silva",
      "taskName": "Revisão de código",
      "dueDate": "2025-12-13",
      "priority": "high",
      "description": "Review do PR #456"
    },
    "scheduleFor": "2025-12-13T08:00:00Z"
  }
}
```

---

## 3️⃣ send_daily_briefing

**Uso:** Enviar resumo diário via push ou email (ou ambos)

```json
{
  "tool": "send_daily_briefing",
  "parameters": {
    "userId": "user-123",
    "deliveryMethod": "both",
    "includeInsights": true
  }
}
```

**Parâmetros:**
- `userId`: ID do usuário
- `deliveryMethod`: `push` | `email` | `both`
- `includeInsights`: Incluir insights IA? (true|false)

**O que é incluído:**
- ✅ Contagem de tarefas para hoje
- ✅ Contagem de eventos agendados
- ✅ Tarefas vencidas (se houver)
- ✅ Lista de tarefas de hoje
- ✅ Lista de eventos
- ✅ Insights IA (astrologia, human design, energia) - se enabled
- ✅ Recomendações do Ash

**Resultado:** Briefing enviado via push/email com dados personalizados

**Exemplo Real:**
```json
{
  "tool": "send_daily_briefing",
  "parameters": {
    "userId": "João Silva",
    "deliveryMethod": "both",
    "includeInsights": true
  }
}
```

**Resultado possível:**
```
📧 Email + 🔔 Push enviados

Briefing contendo:
- 5 tarefas para hoje
- 3 eventos agendados
- 0 tarefas vencidas
- Insights IA (astrologia, human design)
- Recomendações do Ash para o dia
```

---

## 4️⃣ send_team_invite_email

**Uso:** Enviar convite para novo membro entrar em um time

```json
{
  "tool": "send_team_invite_email",
  "parameters": {
    "inviteToEmail": "novo-membro@email.com",
    "teamId": "team-789",
    "teamName": "Projeto Inteligência",
    "inviterName": "Maria Silva",
    "message": "Opa! Vem colaborar com a gente!"
  }
}
```

**Parâmetros:**
- `inviteToEmail`: Email do convidado (obrigatório)
- `teamId`: ID do time
- `teamName`: Nome do time
- `inviterName`: Nome de quem convida
- `message`: Mensagem personalizada (opcional)

**O que é incluído:**
- ✅ Nome do time
- ✅ Nome de quem convidou
- ✅ Mensagem personalizada (se fornecida)
- ✅ Link para aceitar convite
- ✅ Detalhes do time
- ✅ Call-to-action button

**Resultado:** Email de convite enviado com todos os detalhes

**Exemplo Real:**
```json
{
  "tool": "send_team_invite_email",
  "parameters": {
    "inviteToEmail": "carlos@email.com",
    "teamId": "team-inteligencia",
    "teamName": "Inteligência Artificial",
    "inviterName": "Maria Silva",
    "message": "Carlos! Estamos desenvolvendo um projeto incrível e queremos você no time!"
  }
}
```

**Resultado possível:**
```
📧 Email enviado para carlos@email.com

Conteúdo:
"Maria Silva te convidou para entrar no time 'Inteligência Artificial'

Mensagem: 'Carlos! Estamos desenvolvendo um projeto incrível e queremos você no time!'

[ACEITAR CONVITE] ← Link clicável
```

---

## 🎯 CASOS DE USO

### Use `send_push_notification` quando:
- ⏰ Tarefa venceu
- 🔔 Evento começando agora
- 💬 Nova mensagem no chat
- ✅ Tarefa completada (confirmação)
- 📌 Alerta importante

### Use `send_email_reminder` quando:
- 📅 Lembrete para depois (não imediato)
- 📝 Detalhes complexos (precisa template)
- 📋 Email customizado com dados
- ⏱️ Agendado para horário específico

### Use `send_daily_briefing` quando:
- 🌅 Resumo diário (manhã)
- 📊 Estatísticas consolidadas
- 🔮 Com insights IA
- 📦 Tudo junto (push + email)

### Use `send_team_invite_email` quando:
- 👥 Novo membro para time
- 🎯 Convite formal
- 📨 Comunicação oficial
- ✨ First impression importante

---

## 🔧 INTEGRAÇÃO NO CHAT

Para usar no chat, você pode pedir ao Ash:

**Exemplo 1:**
```
"Ash, envia uma notificação push para Maria Silva avisando que a 
tarefa 'Finalizar relatório' venceu hoje."
```

Ash vai converter para:
```json
{
  "tool": "send_push_notification",
  "parameters": {
    "userId": "maria-silva",
    "title": "⏰ Tarefa Vencida",
    "body": "Finalizar relatório foi vencido hoje!",
    "action": "navigate_to TASK_DETAIL",
    "icon": "⏰"
  }
}
```

**Exemplo 2:**
```
"Envia um email de briefing diário para João, incluindo insights IA."
```

Ash vai converter para:
```json
{
  "tool": "send_daily_briefing",
  "parameters": {
    "userId": "joao-silva",
    "deliveryMethod": "email",
    "includeInsights": true
  }
}
```

---

## 📊 LIMITES E CONFIGURAÇÃO

| Limite | Valor | Nota |
|--------|-------|------|
| Emails/dia | 100 | Por usuário |
| Push/dia | 50 | Por usuário |
| Tamanho de template | 1MB | HTML max |
| Delay de agendamento | 30 dias | Máximo |
| Tentativas de envio | 3 | Com backoff |
| Timeout | 30s | SMTP connection |

---

## ✅ VERIFICAÇÃO

Para verificar que os tools estão funcionando:

```javascript
// No chat, pergunte ao Ash:
"List available tools"

// Deve aparecer:
✅ send_push_notification
✅ send_email_reminder
✅ send_daily_briefing
✅ send_team_invite_email
```

---

## 🆘 TROUBLESHOOTING

**Email não envia:**
- [ ] SMTP config em .env? (`SMTP_HOST`, `SMTP_USER`, etc)
- [ ] Credenciais corretas?
- [ ] Firewall bloqueando porta 587?

**Push não aparece:**
- [ ] Permissões concedidas? (browser/app)
- [ ] Device conectado?
- [ ] Tab está em foreground?

**Templates não renderizam:**
- [ ] Handlebars syntax correto? (`{{variavel}}`)
- [ ] Dados passados no customData?
- [ ] Template existe em `/backend/templates/`?

---

**Status:** ✅ PRONTO PARA USAR  
**Última Atualização:** 2025-12-12  
**Documentação:** [TESTE_ASH_TOOLS.md](TESTE_ASH_TOOLS.md)

