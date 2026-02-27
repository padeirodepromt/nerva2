/* src/api/controllers/githubIntegrationController.js */
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { githubService } from '../services/githubService.js';

// Configurações do GitHub (Certifique-se de ter isso no .env)
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
// A URL de callback deve ser algo como: http://localhost:5173/integration-callback
// Configure isso no GitHub Developer Settings

export const githubIntegrationController = {
  // 1. Iniciar Login (Redireciona para o GitHub)
  getAuthUrl: (req, res) => {
    const redirectUri = process.env.GITHUB_CALLBACK_URL || 'http://localhost:5173/integration-callback';
    const scope = 'repo user'; // Permissões necessárias
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}&state=github`;
    
    res.json({ url });
  },

  // 2. Callback (Troca o código pelo token e salva)
  callback: async (req, res) => {
    const { code, userId , realmId } = req.query;

    if (!code || !userId) {
      return res.status(400).json({ success: false, error: 'Código ou UserId faltando.' });
    }

    try {
      // Troca code por access_token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          client_id: GITHUB_CLIENT_ID,
          client_secret: GITHUB_CLIENT_SECRET,
          code
        })
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) throw new Error(tokenData.error_description);

      const accessToken = tokenData.access_token;

      // Salva no Banco de Dados
      // Verifica se já existe integração
      const existing = await db.query.integrations.findFirst({
        where: and(
            eq(schema.integrations.userId, userId),
            eq(schema.integrations.provider, 'github')
        )
      });

      if (existing) {
        await db.update(schema.integrations)
            .set({ accessToken, updatedAt: new Date() })
            .where(and(eq(schema.integrations.id, existing.id), realmId && realmId !== 'all' ? eq(schema.integrations.realmId, realmId) : undefined));
      } else {
        await db.insert(schema.integrations).values({
            id: crypto.randomUUID(),
        realmId: realmId || 'personal',
            userId,
            provider: 'github',
            accessToken,
            settings: {},
            createdAt: new Date(),
            updatedAt: new Date()
        });
      }

      res.json({ success: true, message: 'GitHub conectado com sucesso!' });

    } catch (error) {
      console.error('GitHub Callback Error:', error);
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // 3. Listar Repositórios (Usado pelo Dropdown do Projeto)
  listRepos: async (req, res) => {
    try {
        const userId = req.user?.id || req.query.userId; // Depende do seu middleware de auth

        if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

        const integration = await db.query.integrations.findFirst({
            where: and(
                eq(schema.integrations.userId, userId),
                eq(schema.integrations.provider, 'github')
            )
        });

        if (!integration || !integration.accessToken) {
            return res.json({ success: false, message: 'GitHub não conectado' });
        }

        // Chama a API do GitHub direto ou via serviço
        const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
             headers: { 
                 'Authorization': `Bearer ${integration.accessToken}`,
                 'Accept': 'application/vnd.github.v3+json'
             }
        });
        
        if (!response.ok) throw new Error('Falha ao buscar repos do GitHub');
        
        const repos = await response.json();
        
        // Retorna apenas dados essenciais para o frontend
        const simplifiedRepos = repos.map(r => ({
            id: r.id,
            name: r.name,
            full_name: r.full_name,
            private: r.private,
            html_url: r.html_url
        }));

        res.json({ success: true, repos: simplifiedRepos });

    } catch (error) {
        console.error('List Repos Error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
  }
};