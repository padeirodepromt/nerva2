/* src/api/authRoutes.js */
import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import * as authController from './controllers/authController.js';
import { userController } from './controllers/userController.js';
import { authLimiter } from './middleware/rateLimiter.js';
import { authenticate } from './authMiddleware.js'; // <--- Importante: Importar o middleware

// Importa a configuração do Passport para registrar as estratégias
import './services/passportConfig.js'; 

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'prana-secret-key-change-me-now';

// Helper para capturar erros async sem travar o servidor
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// ============================================================================
// AUTH TRADICIONAL (Email/Senha)
// ============================================================================
router.post('/login', authLimiter, asyncHandler(authController.login));
router.post('/register', authLimiter, asyncHandler(authController.register));

// --- Rotas de Password Reset ---
router.post('/password-reset', authLimiter, asyncHandler(userController.requestPasswordReset));
router.post('/password-reset/confirm', authLimiter, asyncHandler(userController.confirmPasswordReset));

// --- Rotas Protegidas de Usuário ---
// Adicionamos 'authenticate' aqui porque este arquivo é carregado ANTES do middleware global no server.js
router.get('/users/me', authenticate, asyncHandler(authController.getMe));
router.get('/profile', authenticate, asyncHandler(userController.getProfile));
router.put('/profile', authenticate, asyncHandler(userController.updateProfile));
router.post('/logout', authenticate, asyncHandler(userController.logout));
router.post('/change-password', authenticate, asyncHandler(userController.changePassword));
router.post('/users/device-token', authenticate, asyncHandler(userController.saveDeviceToken));

// ============================================================================
// SOCIAL AUTH (OAuth)
// ============================================================================

/**
 * Helper: Gera token e redireciona para o Frontend
 * Esta função é chamada após o sucesso do login social.
 */
const socialRedirect = (req, res) => {
    const user = req.user;
    
    // Gera o Token do Prana
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
    );
    
    // Define a URL do Frontend (Produção ou Local)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    // Redireciona o navegador do usuário de volta para o App React
    // Passando o token via Query Param para ser capturado
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
};

// --- GOOGLE ---
router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { session: false, failureRedirect: '/login?error=social_failed' }), 
    socialRedirect
);

// --- GITHUB ---
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback', 
    passport.authenticate('github', { session: false, failureRedirect: '/login?error=social_failed' }), 
    socialRedirect
);

// --- FACEBOOK (Opcional - Deixe comentado se não usar agora) ---
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/callback', 
    passport.authenticate('facebook', { session: false, failureRedirect: '/login?error=social_failed' }), 
    socialRedirect
);

export default router;