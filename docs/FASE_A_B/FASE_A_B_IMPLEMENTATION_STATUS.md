# 📋 IMPLEMENTAÇÃO: FASE A & B - PRÓXIMOS PASSOS

**Status:** 🔄 EM IMPLEMENTAÇÃO  
**Data Início:** 2025-12-12  
**Prioridade:** ALTA

---

## ✅ O QUE FOI CRIADO

### FASE A: EMAIL + PUSH NOTIFICATIONS

#### ✅ Arquivos Criados:
1. **backend/services/emailService.js** (200 linhas)
   - `sendEmail()` - Genérico
   - `sendTaskReminder()` - Lembretes
   - `sendDailyBriefing()` - Briefing diário
   - `sendAshInsight()` - Insights IA
   - `sendTeamInvite()` - Convites
   
2. **backend/templates/task-reminder.html** (130 linhas)
   - Template HTML com Handlebars
   - Design responsivo dark-mode

3. **backend/templates/daily-briefing.html** (160 linhas)
   - Template completo com stats
   - Seções de tarefas, eventos, insights

4. **src/services/notificationService.js** (200 linhas)
   - `initPushNotifications()` - Setup
   - `sendPushNotification()` - Enviar push
   - `scheduleNotification()` - Agendar
   - `requestPermissions()` - Permissões
   - Capacitor LocalNotifications

5. **src/ai_services/toolService.js** (MODIFICADO)
   - ✅ `send_push_notification` - Tool novo
   - ✅ `send_email_reminder` - Tool novo
   - ✅ `send_daily_briefing` - Tool novo
   - ✅ `send_team_invite_email` - Tool novo

### FASE B: EDITOR IMPROVEMENTS

#### ✅ Arquivos Criados:
1. **src/components/editor/extensions/CodeBlockExtension.js** (100 linhas)
   - Line numbers support
   - Syntax highlighting (Prism)
   - Language detection
   - Keyboard shortcuts

2. **src/components/editor/extensions/ColorExtension.js** (50 linhas)
   - Text color marks
   - 8 cores padrão

3. **src/components/editor/extensions/HighlightExtension.js** (60 linhas)
   - Background highlights
   - 5 cores de destaque

4. **src/components/editor/extensions/SlashCommandExtension.js** (120 linhas)
   - / commands menu
   - Fuzzy search
   - 8 comandos básicos

---

## 🔧 PRÓXIMOS PASSOS DE INTEGRAÇÃO

### PASSO 1: Instalar Dependencies

```bash
# Para Email (escolha um):
npm install nodemailer handlebars
# OU
npm install @sendgrid/mail

# Para Editor (syntax highlighting):
npm install prismjs@^1.29.0
npm install @tiptap/extension-code-block-lowlight@^3.13.0
npm install lowlight@^3.1.0

# Para Slash Commands (opcional):
npm install @tiptap/suggestion tippy.js
```

---

### PASSO 2: Configurar Variáveis de Ambiente

Adicionar em `.env`:
```env
# SMTP (Email)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-app
SMTP_FROM=noreply@prana.app

# URLs
APP_URL=https://prana.app
```

---

### PASSO 3: Testar Email Service

```javascript
// No seu backend (test.js):
const emailService = require('./backend/services/emailService.js');

async function test() {
  await emailService.testConnection();
  
  const result = await emailService.sendTaskReminder({
    name: 'Tarefa de Teste',
    description: 'Descrição da tarefa',
    dueDate: new Date(),
    priority: 'high',
    id: 'task-123'
  }, 'usuario@email.com');
  
  console.log('Resultado:', result);
}

test();
```

---

### PASSO 4: Integrar Notification Service no App.jsx

```jsx
// src/App.jsx
import notificationService from '@/services/notificationService';

function App() {
  useEffect(() => {
    // Inicializar notificações
    notificationService.initPushNotifications();
  }, []);

  return (
    // ... resto do app
  );
}
```

---

### PASSO 5: Integrar Extensions no PapyrusEditor

```jsx
// src/components/editor/PapyrusEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockExtension from './extensions/CodeBlockExtension';
import ColorExtension from './extensions/ColorExtension';
import HighlightExtension from './extensions/HighlightExtension';
import SlashCommandExtension from './extensions/SlashCommandExtension';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import FloatingMenu from '@tiptap/extension-floating-menu';

const editor = useEditor({
  extensions: [
    StarterKit,
    CodeBlockExtension, // NEW
    ColorExtension,      // NEW
    HighlightExtension,  // NEW
    SlashCommandExtension, // NEW
    BubbleMenu.configure({
      // adicionar botões de cor e highlight aqui
    }),
    FloatingMenu,
    // ... resto
  ],
  // ...
});
```

---

### PASSO 6: Criar Componentes para Menus

Criar:
- `src/components/editor/menus/ColorMenu.jsx` - Seletor de cores
- `src/components/editor/menus/HighlightMenu.jsx` - Seletor de highlights
- `src/components/editor/components/CodeBlockComponent.vue` - Com line numbers

---

### PASSO 7: Testar com Ash

```javascript
// Testar novo tool no Chat
const toolCall = {
  name: 'send_push_notification',
  parameters: {
    userId: 'user-123',
    title: '📌 Lembrete',
    body: 'Sua tarefa venceu!',
    action: 'navigate_to DASHBOARD'
  }
};

const result = await chatService.executeTool(toolCall);
```

---

## 📊 CHECKLIST DE IMPLEMENTAÇÃO

### FASE A: Email + Push

- [ ] Dependencies instaladas (nodemailer + Prism)
- [ ] `.env` configurado com SMTP
- [ ] emailService.js testado
- [ ] notificationService.js inicializado em App.jsx
- [ ] Ash tools adicionados a toolService.js ✅
- [ ] Email templates renderizando corretamente
- [ ] Push notifications testadas em device
- [ ] Capacitor LocalNotifications sincronizado

### FASE B: Editor

- [ ] CodeBlockExtension criado ✅
- [ ] ColorExtension criado ✅
- [ ] HighlightExtension criado ✅
- [ ] SlashCommandExtension criado ✅
- [ ] Dependencies instaladas (Prism, lowlight)
- [ ] Extensions integradas em PapyrusEditor.jsx
- [ ] ColorMenu.jsx criado
- [ ] HighlightMenu.jsx criado
- [ ] CodeBlockComponent.vue criado com line numbers
- [ ] Testes em código real
- [ ] Mobile responsivo testado

---

## 🔗 REFERÊNCIAS CRIADAS

- [INTEGRACOES_NOTIFICACOES_EDITOR_PLAN.md](INTEGRACOES_NOTIFICACOES_EDITOR_PLAN.md)
- [ARCHITECTURE_INTEGRATIONS_DETAILED.md](ARCHITECTURE_INTEGRATIONS_DETAILED.md)
- [EDITOR_ANALYSIS_QUICK.md](EDITOR_ANALYSIS_QUICK.md)

---

## ⏱️ TIMELINE

```
Hoje (Dia 1):
├─ Dependencies instaladas
├─ Email service testado
└─ Extensions integradas (em progresso)

Dia 2-3:
├─ UI Components (menus)
├─ Ash tools testados
└─ Editor funcional

Dia 4-5:
├─ Mobile testing
├─ Polish + refinements
└─ Documentation

Timeline: 5-7 dias
```

---

## 🎯 STATUS ATUAL

```
FASE A: Email + Push
├─ Backend Service: ✅ CRIADO
├─ Templates: ✅ CRIADOS (2)
├─ Frontend Service: ✅ CRIADO
├─ Ash Tools: ✅ CRIADOS (4)
└─ Integração: 🔄 EM ANDAMENTO

FASE B: Editor
├─ CodeBlockExtension: ✅ CRIADO
├─ ColorExtension: ✅ CRIADO
├─ HighlightExtension: ✅ CRIADO
├─ SlashCommandExtension: ✅ CRIADO
└─ Integração: 🔄 EM ANDAMENTO
```

---

**Próximo passo:** Instalar dependencies e testar email service

Quer que eu continue com a integração ou prefere revisar primeiro? 🚀
