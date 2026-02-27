/* src/api/controllers/googleIntegrationController.js */
import { google } from 'googleapis';
import { db } from '../../db/index.js';
// Importando do schema CORE, onde a tabela 'integrations' vive
import { integrations } from '../../db/schema/core.js'; 
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js'; // Ajuste o caminho do createId se necessário

// Cria o cliente OAuth2 com as credenciais do ambiente
const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    // A URL de callback deve ser exatamente a mesma registrada no Console do Google
    // e a mesma que seu Frontend usa para redirecionar.
    // DICA: Verifique se no .env o FRONTEND_URL não tem barra no final, ou ajuste aqui
    `${process.env.FRONTEND_URL}/settings/integrations/callback`
  );
};

// --- FUNÇÕES DE CONTROLE (AGRUPADAS NO FINAL) ---

const getAuthUrl = async (req, res) => {
  // A rota GET /google/auth pode receber query params, não body. Ajustado para query.
  const { provider , realmId } = req.query; 
  
  // Padronizamos para 'google' para conter Agenda + Gmail juntos.
  const targetProvider = (provider === 'google_calendar') ? 'google' : (provider || 'google');

  try {
    const oauth2Client = createOAuthClient();

    // --- ESCOPOS AMPLIADOS (SUPERPODERES DO ASH) ---
    const scopes = [
        // 1. Identidade
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        
        // 2. Agenda (Full Access para criar/editar eventos)
        'https://www.googleapis.com/auth/calendar', 
        'https://www.googleapis.com/auth/calendar.events',
        
        // 3. Gmail (Leitura para contexto e Envio para ação)
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.compose', 
        'https://www.googleapis.com/auth/gmail.send'
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // CRUCIAL: Pede um Refresh Token para acessar offline
        scope: scopes,
        prompt: 'consent',      // Força a tela de permissão para garantir que o Refresh Token venha
        // Passamos 'google' no estado para padronizar no callback
        state: JSON.stringify({ userId: req.user.id, provider: 'google' }) 
    });

    res.json({ url });

  } catch (error) {
    console.error('Erro ao gerar URL Google:', error);
    res.status(500).json({ error: 'Falha interna ao preparar conexão.' });
  }
};

const oauth2callback = async (req, res) => {
  // A rota de callback geralmente recebe 'code' via QUERY string na URL de redirecionamento
  const { code , realmId } = req.query; 
  const userId = req.user.id;

  if (!code) {
      return res.status(400).json({ error: "Código de autorização não recebido." });
  }

  try {
    const oauth2Client = createOAuthClient();
    
    // 1. Troca o código temporário pelos tokens reais (Access + Refresh)
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // 2. Pega informações do perfil para identificar a conta
    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data: userInfo } = await oauth2.userinfo.get();

    // 3. Verifica se já existe integração
    const [existing] = await db.select().from(integrations)
        .where(and(
            eq(integrations.userId, userId), 
            eq(integrations.provider, 'google') 
        ))
        .limit(1);

    // 4. Prepara os dados para salvar
    const integrationData = {
        accessToken: tokens.access_token,
        // O refresh token é vital. Se o Google mandar um novo, salvamos.
        // Se não mandar, mantemos o antigo (se houver).
        ...(tokens.refresh_token ? { refreshToken: tokens.refresh_token } : {}),
        expiresAt: new Date(tokens.expiry_date),
        profileData: { 
            email: userInfo.email, 
            name: userInfo.name, 
            picture: userInfo.picture,
            googleId: userInfo.id
        },
        isActive: true,
        updatedAt: new Date(),
        settings: { 
            syncCalendar: true, 
            syncGmail: true,
            permissions: ['read', 'write', 'send'] 
        }
    };

    // 5. Salva no Banco (Update ou Insert)
    if (existing) {
        await db.update(integrations)
            .set(integrationData)
            .where(and(eq(integrations.id, existing.id), realmId && realmId !== 'all' ? eq(integrations.realmId, realmId) : undefined));
    } else {
        await db.insert(integrations).values({
            id: createId(),
        realmId: realmId || 'personal',
            userId,
            provider: 'google',
            refreshToken: tokens.refresh_token, // Obrigatório na primeira vez
            ...integrationData
        });
    }

    // Sucesso: Redireciona para o front (ou retorna JSON se for chamada AJAX)
    // Se o front esperar JSON direto, use res.json. Se for redirecionamento de navegador:
    res.redirect(`${process.env.FRONTEND_URL}/settings/integrations?status=success`);

  } catch (error) {
    console.error('Erro no Callback Google:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/settings/integrations?status=error`);
  }
};

const listEvents = async (req, res) => {
    try {
      const userId = req.user.id;
      
      const [integration] = await db.select().from(integrations)
        .where(and(eq(integrations.userId, userId), eq(integrations.provider, 'google')))
        .limit(1);

      if (!integration || !integration.accessToken) {
        return res.status(401).json({ error: 'Google não conectado.' });
      }

      const oauth2Client = createOAuthClient();
      oauth2Client.setCredentials({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
      
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });

      res.json(response.data.items);
    } catch (error) {
      console.error('[GoogleList] Erro:', error);
      res.status(500).json({ error: 'Erro ao listar eventos.' });
    }
};

// --- EXPORTAÇÃO CORRETA DO OBJETO ---
export const googleIntegrationController = {
  getAuthUrl,
  oauth2callback,
  listEvents
};