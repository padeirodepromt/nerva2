/**
 * @file passportConfig.js
 * @description Configuração das estratégias de Login Social (Google, GitHub, Facebook).
 * Gerencia a criação automática de usuários no plano "SEED" se eles ainda não existirem.
 */

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { db } from '../../db/index.js';
import { users, plans } from '../../db/schema/core.js';
import { eq } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';

/**
 * Lógica Central: Encontrar ou Criar Usuário
 */
const findOrCreateUser = async (profile, provider, done) => {
  try {
    // 1. Extrair email (prioridade máxima)
    const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

    if (!email) {
      return done(new Error(`O provedor ${provider} não forneceu um email público.`));
    }

    // 2. Verificar se o usuário já existe no banco
    const [existingUser] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);

    if (existingUser) {
      // Se já existe, atualizamos o avatar se ele não tiver um
      if (!existingUser.avatarUrl && profile.photos && profile.photos[0]) {
         await db.update(users)
           .set({ avatarUrl: profile.photos[0].value })
           .where(eq(users.id, existingUser.id));
      }
      return done(null, existingUser);
    }

    // 3. Se NÃO existe, vamos criar (Fluxo de Cadastro Automático)
    
    // Busca o plano SEED para garantir integridade
    const [seedPlan] = await db.select().from(plans).where(eq(plans.key, 'SEED')).limit(1);
    
    // Define nome (usa username se display name falhar)
    const displayName = profile.displayName || profile.username || 'Viajante Prana';
    
    const newUser = {
      id: createId(),
      name: displayName,
      email: email.toLowerCase(),
      // Senha placeholder para indicar que é conta social (não permite login por senha direta sem reset)
      password_hash: `social_${provider}_managed`, 
      avatarUrl: profile.photos ? profile.photos[0].value : null,
      
      // Vincula ao Plano Gratuito
      planType: seedPlan ? 'SEED' : 'SEED', 
      credits: 100,
      role: 'user',
      
      // Metadados
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();
    return done(null, createdUser);

  } catch (err) {
    console.error(`Erro na estratégia ${provider}:`, err);
    return done(err, null);
  }
};

// --- ESTRATÉGIAS ---

// 1. Google
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/google/callback`
      }, 
      (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, 'google', done)
    ));
}

// 2. Facebook
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, 'facebook', done)
    ));
}

// 3. GitHub
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.API_URL || 'http://localhost:3000'}/api/auth/github/callback`,
        scope: [ 'user:email' ]
      },
      (accessToken, refreshToken, profile, done) => findOrCreateUser(profile, 'github', done)
    ));
}

// Serialização (necessária para o Passport internal logic, mesmo usando JWT depois)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => done(null, { id }));