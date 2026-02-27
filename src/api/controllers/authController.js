/* src/api/controllers/authController.js */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../db/index.js';
import { users, plans } from '../../db/schema/core.js'; 
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

const JWT_SECRET = process.env.JWT_SECRET || 'prana-secret-key-change-me-now';

/**
 * REGISTRO (Criação de Conta)
 * - Cria usuário vinculado obrigatoriamente ao plano SEED.
 * - Verifica se o plano existe para evitar erros de banco de dados.
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, realmId } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
    }

    // 1. Verifica duplicidade de email (sem considerar realm, emails são únicos globalmente)
    const [existingUser] = await db.select().from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);
    if (existingUser) {
      return res.status(409).json({ error: 'Este email já está enraizado no Prana.' });
    }

    // 2. Verifica se o plano SEED existe no banco
    const [seedPlan] = await db.select().from(plans)
      .where(eq(plans.key, 'SEED'))
      .limit(1);
    
    if (!seedPlan) {
      console.error('[CRITICAL] Plano SEED não encontrado no banco de dados.');
      return res.status(500).json({ error: 'Erro de configuração do sistema (Plano Base ausente).' });
    }

    // 3. Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Cria o usuário vinculado ao plano SEED
    const newUserId = createId();
    const newUser = {
      id: newUserId,
      name,
      email: email.toLowerCase(),
      password_hash: hashedPassword,
      realmId: realmId || 'personal',
      planType: 'SEED',
      role: 'user',
      credits: 100,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const [createdUser] = await db.insert(users).values(newUser).returning();

    // 5. Gera Token JWT
    const token = jwt.sign({ id: newUserId, email: createdUser.email }, JWT_SECRET, { expiresIn: '7d' });
    
    const { password_hash: _, ...userSafe } = createdUser;

    res.status(201).json({ success: true, token, user: userSafe });

  } catch (error) {
    console.error('[Auth Register] Erro:', error);
    res.status(500).json({ error: 'Falha ao cultivar nova conta.' });
  }
};

/**
 * LOGIN (Entrada no Sistema)
 */
export const login = async (req, res) => {
  try {
    const { email, password, realmId } = req.body;
    
    const [user] = await db.select().from(users)
      .where(eq(users.email, email.toLowerCase()))
      .limit(1);

    if (!user || !user.password_hash) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Credenciais inválidas.' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    const { password_hash: _, ...userSafe } = user;
    res.json({ success: true, token, user: userSafe });

  } catch (error) {
    console.error('[Auth Login] Erro:', error);
    res.status(500).json({ error: 'Falha no portal de acesso.' });
  }
};

/**
 * GET ME (Sessão Persistente)
 * - Valida o token JWT e retorna dados do usuário
 */
export const getMe = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });
        
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const [user] = await db.select().from(users)
          .where(eq(users.id, decoded.id))
          .limit(1);
        
        if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
        
        const { password_hash: _, ...userSafe } = user;
        res.json({ success: true, data: userSafe }); 

    } catch (error) {
        res.status(401).json({ error: 'Sessão expirada.' });
    }
};