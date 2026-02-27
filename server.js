/**
 * @file server.js
 * @description Servidor Principal do Prana 3.0.
 * Integração: Express (API) + Vite (Frontend) + Banco de Dados (Drizzle/Postgres).
 * ATUALIZAÇÃO: Adicionado Passport.js para Login Social.
 */

import express from 'express';
import ViteExpress from 'vite-express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import passport from 'passport'; // <--- NOVO: Import do Passport
import rateLimit from 'express-rate-limit'; // <--- NOVO: Rate Limiting

// Configuração de __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega variáveis de ambiente
dotenv.config();

// Importação da Conexão com Banco de Dados
import { db } from './src/db/index.js';

// Importação das Rotas e Middleware
import entityRoutes from './src/api/entityRoutes.js';
import aiRoutes from './src/api/aiRoutes.js';
import agentRoutes from './src/api/routes/agentRoutes.js';
import authRoutes from './src/api/authRoutes.js';
import importRoutes from './src/api/routes/importRoutes.js';
import energyRoutes from './src/api/energy/routes.js';
import calendarRoutes from './src/api/calendar/routes.js';
import fileTaskAssociationRoutes from './src/api/fileTaskAssociationRoutes.js';
import customFieldsRoutes from './src/api/routes/customFieldsRoutes.js';
import collabRoutes from './src/api/collabRoutes.js'; 
import paymentRoutes from './src/api/paymentRoutes.js'; 
import integrationRoutes from './src/api/integrationRoutes.js';
import meAccessRoutes from './src/api/routes/meAccessRoutes.js';
import brandCodeRoutes from './src/api/system/brandcode/routes.js';
import shopRoutes from './src/api/routes/shopRoutes.js';
import asaasWebhookRoutes from './src/api/webhooks/asaasWebhookRoutes.js';
import billingRoutes from "./src/api/routes/billingRoutes.js";
import { bootstrapAdminPranaProject } from "./src/api/system/brandcode/bootstrapAdminPranaProject.js";



// Middleware de Autenticação JWT
import { authenticate } from './src/api/authMiddleware.js'; 

// Configuração do Servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Essenciais
app.use(cors({
  origin: process.env.CORS_ORIGIN || [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'http://127.0.0.1:5173',
    'https://www.pranahq.com',
    'https://pranahq.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// --- NOVO: Inicialização do Passport ---
app.use(passport.initialize());

// --- NOVO: Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requests por window
  message: 'Muitas requisições deste IP, por favor tente novamente mais tarde.',
  standardHeaders: true,
  legacyHeaders: false
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas de login
  message: 'Muitas tentativas de login, tente novamente em 15 minutos',
  skipSuccessfulRequests: true // Não conta tentativas bem-sucedidas
});


// Logger de Requisições (Ritual de Observação)
app.use((req, res, next) => {
  if (!req.path.startsWith('/src') && !req.path.startsWith('/node_modules') && !req.path.startsWith('/@')) {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  }
  next();
});

// ============================================================================
// ROTAS DA API
// ============================================================================

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online', 
    system: 'Prana 3.0', 
    database: db ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

// 1. ROTAS ABERTAS (Login, Registro, Social Auth) - SEM AUTENTICAÇÃO
app.use('/api/auth/login', loginLimiter); // Rate limit especial para login
app.use('/api', authRoutes); 

// 2. WEBHOOKS PÚBLICOS (SEM AUTH)
app.use('/api/webhooks/asaas', asaasWebhookRoutes);

// 3. MIDDLEWARE DE AUTENTICAÇÃO (O Guardião da Porta)
// Protege todas as rotas ABAIXO deste ponto
app.use('/api/agents', authenticate, agentRoutes);
app.use('/api/me', authenticate, meAccessRoutes);
app.use('/api/shop', authenticate, shopRoutes);

// 4. Rate limiting global para rotas autenticadas
app.use('/api', globalLimiter);

// 5. ROTAS PROTEGIDAS (Entidades, IA, Pagamento) - COM AUTENTICAÇÃO APLICADA
app.use('/api', authenticate);
app.use('/api', entityRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/import', importRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api', fileTaskAssociationRoutes); 
app.use('/api', customFieldsRoutes); 
app.use('/api', collabRoutes); 
app.use('/api/payment', paymentRoutes); 
app.use('/api/integrations', integrationRoutes);

// 6. ROTAS DE SISTEMA (Brand Code, etc.)
app.use('/api/system/brandcode', authenticate, brandCodeRoutes);

// 7. ROTAS DE BILLING
app.use('/api/billing', authenticate, billingRoutes);


// Error Handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Erro interno do servidor', details: err.message });
});

// --- SPA ROUTING ---
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

ViteExpress.config({ mode: process.env.NODE_ENV === 'production' ? 'production' : 'development' });

await bootstrapAdminPranaProject();

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n⚡ [Prana Server] Sistema Online na porta ${PORT}`);
  console.log(`   ➜ API:     /api`);
  console.log(`   ➜ Auth:    /api/auth/login`);
  console.log(`   ➜ App:     http://localhost:${PORT}`);
  console.log(`   ➜ Banco:   Postgres/Drizzle Conectado\n`);
});

ViteExpress.bind(app, server);