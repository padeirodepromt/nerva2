/* src/api/integrationRoutes.js */
import express from 'express';
import { googleIntegrationController } from './controllers/googleIntegrationController.js';
import { githubIntegrationController } from './controllers/githubIntegrationController.js';

// --- CORREÇÃO AQUI ---
// 1. Caminho ajustado para './authMiddleware.js' (na mesma pasta 'api')
// 2. Nome ajustado para 'authenticate' (conforme seu arquivo)
import { authenticate } from './authMiddleware.js'; 

const router = express.Router();

// ============================================================================
// GOOGLE CALENDAR
// ============================================================================

// Inicia o fluxo de autenticação (Gera URL)
router.get('/google/auth', authenticate, googleIntegrationController.getAuthUrl);

// Callback (Troca Code por Token)
router.get('/google/callback', authenticate, googleIntegrationController.oauth2callback);

// Lista eventos (Usado pelo Frontend ou pelo Ash)
router.get('/google/events', authenticate, googleIntegrationController.listEvents);


// ============================================================================
// GITHUB INTEGRATION
// ============================================================================

// Inicia o fluxo de autenticação
router.get('/github/auth', authenticate, githubIntegrationController.getAuthUrl);

// Callback GitHub
router.get('/github/callback', authenticate, githubIntegrationController.callback);

// [CRÍTICO] Rota usada pelo Modal do Projeto para listar repositórios
router.get('/github/repos', authenticate, githubIntegrationController.listRepos);

export default router;