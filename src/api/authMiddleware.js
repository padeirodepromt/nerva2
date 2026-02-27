/* src/api/authMiddleware.js
 * O Guardião das Rotas.
 * CRÍTICO para resolver o erro 401 em /api/tasks, /api/projects etc.
 */

import jwt from 'jsonwebtoken';
import { db } from '../db/index.js';
import { users } from '../../db/schema.js'; 
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'prana-secret-key-change-me-now';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        // 1. Verifica se o token existe (Bearer Token)
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1];
        
        // 2. Verifica e decodifica o token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // 3. Busca o usuário no banco de dados
        // [CRITICAL FIX]: Usa .limit(1) para garantir o retorno correto do Drizzle ORM
        const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

        if (!user) {
            return res.status(401).json({ error: 'Usuário do token não encontrado no DB.' });
        }

        // 4. Injeta o usuário na requisição
        // Nota: O schema do seu DB usa 'password_hash' (segundo o authController)
        const { password_hash: _, ...userSafe } = user;
        req.user = userSafe; 
        
        next(); // Permite que a requisição prossiga para o controlador
        
    } catch (error) {
        // Captura erros de expiração ou assinatura inválida
        console.error("[AuthMiddleware] Erro na validação:", error.message);
        return res.status(401).json({ error: 'Sessão inválida ou expirada.' });
    }
};