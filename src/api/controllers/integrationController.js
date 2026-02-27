import { google } from 'googleapis';
import { db } from '../../db/index.js';
import { integrations } from '../../db/schema/core.js';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

const createOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.FRONTEND_URL || 'http://localhost:5173'}/settings/integrations/callback`
  );
};

export const connect = async (req, res) => {
  const { provider , realmId } = req.body;

  if (provider === 'google_calendar') {
    const oauth2Client = createOAuthClient();

    const scopes = [
        'https://www.googleapis.com/auth/userinfo.email',
        // ATENÇÃO: Mudamos de .readonly para acesso total
        'https://www.googleapis.com/auth/calendar' 
    ];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        scope: scopes,
        prompt: 'consent', 
        include_granted_scopes: true
    });

    return res.json({ url });
  }

  // ... (Resto do código para GitHub, etc) ...
  if (provider === 'github') {
      return res.json({ url: 'https://github.com/login/oauth/authorize?client_id=' + process.env.GITHUB_CLIENT_ID + '&scope=repo' });
  }

  res.status(400).json({ error: 'Provedor não suportado.' });
};

export const handleCallback = async (req, res) => {
  const { provider, code , realmId } = req.body;
  const userId = req.user.id;

  if (provider !== 'google_calendar') return res.status(400).json({ error: 'Provider inválido' });

  try {
    const oauth2Client = createOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
    const { data: userInfo } = await oauth2.userinfo.get();

    const dataToSave = {
        accessToken: tokens.access_token,
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        expiresAt: new Date(tokens.expiry_date),
        profileData: { email: userInfo.email, name: userInfo.name, picture: userInfo.picture },
        isActive: true,
        updatedAt: new Date()
    };

    const existing = await db.select().from(integrations)
        .where(and(eq(integrations.userId, userId), eq(integrations.provider, 'google_calendar')))
        .limit(1);

    if (existing.length > 0) {
        await db.update(integrations).set(dataToSave).where(and(eq(integrations.id, existing[0].id), realmId && realmId !== 'all' ? eq(integrations.realmId, realmId) : undefined));
    } else {
        await db.insert(integrations).values({
            id: createId(),
        realmId: realmId || 'personal',
            userId,
            provider: 'google_calendar',
            refreshToken: tokens.refresh_token,
            ...dataToSave
        });
    }

    res.json({ success: true, account: userInfo.email });

  } catch (error) {
    console.error('Integration Error:', error);
    res.status(500).json({ error: 'Falha ao conectar com Google.' });
  }
};

export const getStatus = async (req, res) => {
  const userId = req.user.id;
  const results = await db.select({
      provider: integrations.provider,
      isActive: integrations.isActive,
      profileData: integrations.profileData
  }).from(integrations).where(and(eq(integrations.userId, userId), realmId && realmId !== 'all' ? eq(integrations.realmId, realmId) : undefined));

  const statusList = results.map(r => ({
      provider: r.provider,
      connected: r.isActive,
      account: r.profileData?.email
  }));
  res.json(statusList);
};

export const disconnect = async (req, res) => {
    const { provider , realmId } = req.body;
    const userId = req.user.id;
    await db.delete(integrations)
        .where(and(eq(integrations.userId, userId), eq(integrations.provider, provider)));
    res.json({ success: true });
};