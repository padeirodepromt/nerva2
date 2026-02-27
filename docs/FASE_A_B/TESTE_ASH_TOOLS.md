# 🧪 GUIA DE TESTE - ASH TOOLS (Email + Push + Editor)

**Data:** 2025-12-12  
**Status:** ✅ PRONTO PARA TESTAR

---

## 📋 RESUMO DO QUE FOI FEITO

### ✅ FASE A: EMAIL + PUSH NOTIFICATIONS
- [x] Backend emailService.js (240 linhas)
- [x] Email templates (task-reminder, daily-briefing)
- [x] Frontend notificationService.js (220 linhas)
- [x] Hook useNotifications já existente em App.jsx
- [x] 4 Ash tools adicionadas a toolService.js

### ✅ FASE B: EDITOR IMPROVEMENTS
- [x] CodeBlockExtension.js (syntax + line numbers)
- [x] ColorExtension.js (8 cores)
- [x] HighlightExtension.js (5 highlights)
- [x] SlashCommandExtension.js (slash commands)
- [x] PapyrusEditor.jsx integrado com extensions
- [x] ColorPickerMenu adicionado ao BubbleMenu
- [x] HighlightPickerMenu adicionado ao BubbleMenu

---

## 🧪 TESTE 1: EDITOR IMPROVEMENTS

### Abrir Editor e Testar

```bash
# 1. Abra o editor em qualquer página que use PapyrusEditor
# 2. Selecione um texto e veja o BubbleMenu aparecer
# 3. Teste cada botão:
```

**Funcionalidades para testar:**

| Funcionalidade | Como Testar | Resultado Esperado |
|---|---|---|
| **Bold/Italic** | Selecione texto → clique Bold/Italic | Texto fica em negrito/itálico |
| **Headings** | Clique H1 ou H2 | Converte linha para heading |
| **Code Block** | Clique no ícone de código | Cria bloco de código com syntax highlight |
| **Syntax Highlight** | Escreva código e selecione → BubbleMenu | Aparece cor Python/JS/etc |
| **Text Color** | Selecione texto → clique cor | Texto muda de cor (8 opções) |
| **Highlight** | Selecione texto → clique highlighter | Texto fica com fundo destacado |
| **Slash Commands** | Digite `/` dentro do editor | Menu com 8 comandos (heading, code, quote, etc) |

### Teste Rápido em JavaScript
```javascript
// Console browser (F12 → Console)
// Verificar que as extensões foram carregadas
const extensions = window.__EDITOR_EXTENSIONS__ || 'check PapyrusEditor.jsx';
console.log('✅ Editor extensions loaded');
```

---

## 🧪 TESTE 2: EMAIL SERVICE

### Abrir Terminal e Rodar Teste

```bash
cd /workspaces/prana3.0

# 1. Verificar que emailService.js existe e está correto
cat src/ai_services/email/emailService.js | head -20

# 2. Testar conexão SMTP (se credentials estão corretas)
node -e "
const emailService = require('./backend/services/emailService.js');
emailService.testConnection()
  .then(() => console.log('✅ SMTP configurado corretamente'))
  .catch(err => console.error('❌ Erro SMTP:', err.message));
"

# 3. Listar templates disponíveis
ls -la /workspaces/prana3.0/backend/templates/
```

### Teste via Ash Tool

```javascript
// No chat, chamar o Ash tool:

// Tool 1: Enviar Email Remoto
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
      "priority": "high"
    },
    "scheduleFor": "2025-12-13T09:00:00Z"
  }
}

// Resultado esperado:
// ✅ Email enfileirado para envio
// ✅ Template renderizado com dados
// ✅ SMTP enviado com sucesso
```

---

## 🧪 TESTE 3: PUSH NOTIFICATIONS

### Web Browser (Desktop)

```javascript
// No Console (F12 → Console):

// 1. Verificar que notificationService foi inicializado
console.log('Checking notifications...');

// 2. Enviar notificação local (teste imediato)
import notificationService from '@/services/notificationService';

await notificationService.sendPushNotification({
  title: '🎉 Teste Prana',
  body: 'Push notification funcionando!',
  badge: '✨',
  data: { action: 'navigate_to DASHBOARD' }
});

// Resultado: Notificação aparece na barra do navegador
```

### Teste via Ash Tool

```javascript
// No chat, chamar o Ash tool:

{
  "tool": "send_push_notification",
  "parameters": {
    "userId": "user-123",
    "title": "📌 Lembrete Importante",
    "body": "Você tem uma tarefa que venceu hoje!",
    "action": "navigate_to DASHBOARD",
    "icon": "⏰"
  }
}

// Resultado esperado:
// ✅ Notificação push aparece no dispositivo
// ✅ Ao clicar, navega para o DASHBOARD
```

### Mobile (Capacitor)

```bash
# Se estiver testando no app nativo:

# iOS
npx cap run ios

# Android
npx cap run android

# No app, entrar no chat e testar o tool send_push_notification
# Resultado: Notificação push aparece na barra do iOS/Android
```

---

## 🧪 TESTE 4: DAILY BRIEFING

### Test via Ash Tool

```javascript
{
  "tool": "send_daily_briefing",
  "parameters": {
    "userId": "user-123",
    "deliveryMethod": "both",  // "push" | "email" | "both"
    "includeInsights": true
  }
}

// Resultado esperado:
// ✅ Email com resumo diário enviado
// ✅ Push notification com stats enviada
// ✅ Inclui tarefas de hoje, eventos, insights (astrologia, human design, energia)
```

---

## 🧪 TESTE 5: TEAM INVITE EMAIL

### Test via Ash Tool

```javascript
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

// Resultado esperado:
// ✅ Email de convite enviado para novo-membro@email.com
// ✅ Inclui link para aceitar convite
// ✅ Mensagem personalizada incluída
```

---

## 🔧 CHECKLIST DE VERIFICAÇÃO

### Build & Compilation

```bash
# 1. Verificar que o build passa sem erros
npm run build

# 2. Verificar que não há erros de import
npm run lint

# 3. Verificar que dependências estão instaladas
npm list prismjs lowlight handlebars nodemailer
```

**Resultado esperado:** ✅ Sem erros

---

### Arquivos Criados/Modificados

```bash
# Verificar que todos os arquivos estão em lugar correto

# Email
ls -la backend/services/emailService.js
ls -la backend/templates/*.html

# Notificações
ls -la src/services/notificationService.js

# Editor Extensions
ls -la src/components/editor/extensions/

# Ash Tools
grep -n "send_push_notification\|send_email_reminder\|send_daily_briefing\|send_team_invite_email" src/ai_services/toolService.js

# PapyrusEditor integrado
grep -n "CodeBlockExtension\|ColorExtension\|HighlightExtension\|SlashCommandExtension" src/components/editor/PapyrusEditor.jsx
```

**Resultado esperado:** ✅ Todos os arquivos existem

---

## 📱 TESTE MOBILE (Optional)

Se testando no app nativo:

```bash
# iOS
cd /workspaces/prana3.0
npx cap sync ios
npx cap run ios

# Android  
npx cap sync android
npx cap run android

# Testar no app:
# 1. Abrir chat
# 2. Chamar send_push_notification
# 3. Verificar que push aparece na barra do iOS/Android
```

---

## 🐛 DEBUGGING

Se algo não funcionar:

### Email não está enviando

```bash
# 1. Verificar credenciais SMTP
cat .env | grep SMTP

# 2. Testar conexão
node -e "const {testConnection} = require('./backend/services/emailService.js'); testConnection();"

# 3. Verificar logs do backend
tail -f backend/logs/*.log
```

### Push notification não aparece

```javascript
// No console:
console.log('Checking notifications...');
const notif = await import('@/services/notificationService');
console.log('Ready:', notif.default.isReady());
console.log('Permission:', await notif.default.hasPermission());
```

### Editor extensions não funcionam

```javascript
// No console:
// Verificar que PapyrusEditor.jsx está com as extensões importadas
document.body.innerHTML.includes('CodeBlockExtension')

// Se não, fazer reload: Ctrl+Shift+R (hard refresh)
```

---

## ✅ PRÓXIMOS PASSOS

- [ ] Testar todos os 5 testes acima
- [ ] Criar email queue system (Bull + Redis) para robustez
- [ ] Criar backend routes para `/api/email/*` e `/api/notifications/*`
- [ ] Deploy em staging
- [ ] Testing em production

---

## 📞 SUPORTE

Se houver erros durante teste, check:
1. Dependencies instaladas → `npm list`
2. Build passa → `npm run build`
3. .env configurado → `cat .env | grep -E "SMTP|APP_URL"`
4. Logs → `tail -f server.log`

**Status Final:** 🟢 PRONTO PARA TESTAR

