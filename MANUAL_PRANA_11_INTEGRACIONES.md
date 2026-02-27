# 🔗 MANUAL PRANA 11 - INTEGRAÇÕES & CONECTORES

**Versão:** 3.0.1 | **Capítulo:** 11 | **Data:** Dezembro 2025

---

## 📋 O QUE VOCÊ VAI APRENDER

Este capítulo documenta todas as **integrações externas** de Prana: APIs suportadas, webhooks, autenticação OAuth, e padrões de integração.

**Público:** Desenvolvedores, Integradores, Arquitetos  
**Tempo de leitura:** 25 minutos

---

## 🔌 INTEGRAÇÕES ATUAIS

### 1. **Claude API** (Anthropic)

**Propósito:** Alimentar Ash com inteligência

```javascript
// Configuration
const CLAUDE_CONFIG = {
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20241022',
  baseURL: 'https://api.anthropic.com/v1'
};

// Usage
const response = await anthropic.messages.create({
  model: CLAUDE_CONFIG.model,
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: 'user', content: userMessage }]
});
```

**Endpoints:**
- `POST /messages` - Gerar texto
- Rate limit: 50 requests/min
- Pricing: $3/$15 per 1M tokens (input/output)

---

### 2. **Google APIs**

#### **Google Calendar Integration**

```javascript
// OAuth
const googleAuth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Sync events
const syncGoogleCalendar = async (userId) => {
  const calendar = google.calendar({ version: 'v3', auth: googleAuth });
  
  const events = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime'
  });
  
  // Save to Prana DB
  events.items.forEach(event => {
    saveExternalEvent(userId, {
      external_id: event.id,
      provider: 'google_calendar',
      title: event.summary,
      start: event.start.dateTime,
      end: event.end.dateTime,
      description: event.description
    });
  });
};
```

#### **Gmail Integration**

```javascript
// Fetch unread emails
const getUnreadEmails = async (userId) => {
  const gmail = google.gmail({ version: 'v1', auth: googleAuth });
  
  const messages = await gmail.users.messages.list({
    userId: 'me',
    q: 'is:unread'
  });
  
  return messages.data.messages || [];
};

// Use case: Show unread count on dashboard
```

---

### 3. **Meta APIs**

#### **Meta Conversion API** (Pixel Alternative)

```javascript
// Track events (when user takes action in Prana)
const trackMetaEvent = async (eventData) => {
  const payload = {
    data: [{
      event_name: eventData.event, // 'Purchase', 'Lead', 'ViewContent'
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        em: hashEmail(user.email),
        ph: hashPhone(user.phone),
        client_ip_address: getUserIP(),
        client_user_agent: getUserAgent()
      },
      custom_data: {
        currency: 'BRL',
        value: eventData.value
      }
    }],
    test_event_code: process.env.META_TEST_EVENT_CODE
  };
  
  await fetch('https://graph.facebook.com/v18.0/...', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
};

// Usage: Track when user creates project, completes task, etc
```

#### **Meta Analytics API** (Read-only)

```javascript
// Analyze user behavior if using Meta for ads
const getMetaAnalytics = async (userId) => {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${AD_ACCOUNT_ID}/insights`,
    {
      headers: { Authorization: `Bearer ${metaToken}` }
    }
  );
  
  return response.json();
};
```

---

### 4. **Astrological Data** (External Ephemeris)

```javascript
// Using PyMeeus (Python library via REST API)
// Or local ephemeris data

const calculateEphemeris = async (birthData, date) => {
  // Option 1: Local calculation
  const ephemeris = require('astronomia');
  
  const position = {
    sun: ephemeris.sun.apparentGeometricLongitude(date),
    moon: ephemeris.moon.apparentGeometricLongitude(date),
    planets: [/* ... */]
  };
  
  return position;
};
```

---

## 🔐 OAUTH FLOW

### Google OAuth

```javascript
// /routes/authRoutes.js

// 1. Initiate login
router.get('/google', (req, res) => {
  const url = googleAuth.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/calendar',
      'https://www.googleapis.com/auth/gmail.readonly'
    ]
  });
  res.redirect(url);
});

// 2. Handle callback
router.get('/google/callback', async (req, res) => {
  const { tokens } = await googleAuth.getToken(req.query.code);
  
  // Save encrypted token
  await saveOAuthToken({
    user_id: req.user.id,
    provider: 'google',
    access_token: encrypt(tokens.access_token),
    refresh_token: encrypt(tokens.refresh_token),
    expires_at: tokens.expiry_date
  });
  
  res.redirect('/dashboard?sync=success');
});
```

---

## 🪝 WEBHOOKS

### Outgoing Webhooks

Prana pode enviar eventos para serviços externos:

```javascript
// /config/webhooks.js
const webhookEvents = [
  'task.created',
  'task.completed',
  'task.deleted',
  'diary.created',
  'project.created',
  'energy_checkin.recorded',
  'mood_entry.created'
];

// Register webhook
const registerWebhook = async (userId, config) => {
  await db.insert(webhooks).values({
    id: generateId(),
    user_id: userId,
    url: config.url,
    event_types: config.events,
    is_active: true
  });
};

// Dispatch event
const dispatchWebhook = async (event, data) => {
  const webhooks = await findWebhooksForEvent(event);
  
  for (const webhook of webhooks) {
    await fetch(webhook.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date()
      })
    }).catch(err => logWebhookError(err));
  }
};
```

### Incoming Webhooks

Receber dados de serviços externos:

```javascript
// /routes/webhookRoutes.js

// Zapier, Make, IFTTT podem enviar dados
router.post('/webhook/external', authenticateWebhook, async (req, res) => {
  const { provider, action, data } = req.body;
  
  switch (provider) {
    case 'zapier':
      // Create task from Zapier data
      await taskService.createTask(data);
      break;
    case 'ifttt':
      // Log mood or create entry
      await moodService.logMood(data);
      break;
  }
  
  res.json({ success: true });
});
```

---

## 🔄 SYNC STRATEGIES

### Real-time Sync

```javascript
// For critical integrations (Calendar)
const setupRealtimeSync = () => {
  // Watch for changes
  const subscription = calendar.events.watch({
    calendarId: 'primary',
    requestBody: {
      id: `prana-${userId}`,
      type: 'web_hook',
      address: `${API_URL}/webhooks/google-calendar`
    }
  });
};
```

### Periodic Sync

```javascript
// For non-critical data (Analytics)
cron.schedule('0 * * * *', async () => {
  // Sync every hour
  const users = await getAllUsersWithIntegration('google_analytics');
  
  for (const user of users) {
    await syncAnalyticsData(user);
  }
});
```

---

## 📊 DATA MAPPING

### Exemplo: Google Calendar → Prana Events

```javascript
const mapGoogleCalendarEvent = (googleEvent) => {
  return {
    external_id: googleEvent.id,
    provider: 'google_calendar',
    title: googleEvent.summary,
    description: googleEvent.description,
    start_date: new Date(googleEvent.start.dateTime),
    end_date: new Date(googleEvent.end.dateTime),
    location: googleEvent.location,
    is_all_day: !googleEvent.start.dateTime,
    attendees: googleEvent.attendees?.length || 0,
    calendar_color: googleEvent.colorId,
    is_busy: googleEvent.transparency === 'opaque'
  };
};
```

---

## 🛡️ RATE LIMITING & ERROR HANDLING

```javascript
// /services/integrationService.js

class IntegrationService {
  constructor() {
    this.rateLimiter = new RateLimiter({
      claude: { max: 50, window: 60000 },
      google: { max: 100, window: 60000 },
      meta: { max: 200, window: 60000 }
    });
  }
  
  async callExternalAPI(provider, request) {
    // Check rate limit
    if (!this.rateLimiter.allow(provider)) {
      throw new RateLimitError(`${provider} rate limit exceeded`);
    }
    
    // Execute with retry
    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fetch(request);
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        // Exponential backoff
        await sleep(Math.pow(2, i) * 1000);
      }
    }
  }
}
```

---

## 🚀 FUTURAS INTEGRAÇÕES

```
Roadmap:

✅ Done:
   - Claude API (Ash)
   - Google Calendar
   - Google Gmail
   - Meta APIs
   - Astrological data

⏳ Planned:
   - Slack integration (notifications)
   - Discord webhooks
   - Telegram bot
   - Notion sync (export diary)
   - Obsidian vault sync
   - Apple Health / Google Fit (activity)
   - Spotify API (music mood tracking)
   - Stripe integration (premium)
   - GitHub API (for devs - track work)
   - Linear / Jira sync (project management)
```

---

## 🔗 LEITURA RELACIONADA

- [🏗️ 06 - Arquitetura Sistema](MANUAL_PRANA_06_ARQUITETURA_SISTEMA.md) - Como integrações se conectam
- [🤖 10 - Ash & Agentes IA](MANUAL_PRANA_10_AGENTES_IA.md) - Claude API details
- [📡 13 - API Reference](MANUAL_PRANA_13_API_REFERENCE.md) - Endpoints que disparam webhooks

---

**Próximo capítulo:** [📡 13 - API Reference](MANUAL_PRANA_13_API_REFERENCE.md)

---

*Última atualização: Dezembro 2025*  
*Mantido por: Equipe Prana*  
*Status: ✅ Pronto*
