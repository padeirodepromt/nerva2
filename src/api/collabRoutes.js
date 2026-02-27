
import express from 'express';
import { db } from '../db/index.js';
import { teamMessages, teamMembers, users } from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';

const router = express.Router();

// === CHAT DE TIME/PROJETO ===

// Listar mensagens de um Time ou Projeto
router.get('/messages', async (req, res) => {
    try {
        const { teamId, projectId, limit = 50 } = req.query;
        
        // Filtro condicional (requer pelo menos um contexto)
        if (!teamId && !projectId) {
            return res.status(400).json({ error: "Contexto (teamId ou projectId) necessário." });
        }

        const conditions = [];
        if (teamId) conditions.push(eq(teamMessages.teamId, teamId));
        if (projectId) conditions.push(eq(teamMessages.projectId, projectId));

        const messages = await db.query.teamMessages.findMany({
            where: and(...conditions),
            orderBy: [desc(teamMessages.createdAt)],
            limit: Number(limit),
            with: {
                sender: {
                    columns: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                        email: true
                    }
                }
            }
        });

        // Retorna em ordem cronológica (mais antigas primeiro) para o chat
        res.json(messages.reverse());
    } catch (error) {
        console.error("Erro ao buscar mensagens:", error);
        res.status(500).json({ error: "Erro interno ao buscar mensagens." });
    }
});

// Enviar mensagem
router.post('/messages', async (req, res) => {
    try {
        const { content, teamId, projectId, senderId } = req.body;
        // senderId deve vir do req.user (middleware de auth), mas por fallback usaremos body se admin
        // Assumindo req.user.id se disponível (middleware authenticate)
        const realSenderId = req.user?.id || senderId;

        if (!content || !realSenderId) {
            return res.status(400).json({ error: "Conteúdo e remetente obrigatórios." });
        }

        const [newMessage] = await db.insert(teamMessages).values({
            content,
            teamId,
            projectId, // Pode ser null
            senderId: realSenderId
        }).returning();

        // Popula o sender para retorno imediato na UI
        const sender = await db.query.users.findFirst({
            where: eq(users.id, realSenderId),
            columns: { id: true, name: true, avatarUrl: true }
        });

        res.json({ ...newMessage, sender });
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
        res.status(500).json({ error: "Erro ao enviar mensagem." });
    }
});

// === MEMBROS DO TIME (Para Delegação) ===

router.get('/teams/:teamId/members', async (req, res) => {
    try {
        const { teamId } = req.params;

        const members = await db.query.teamMembers.findMany({
            where: eq(teamMembers.teamId, teamId),
            with: {
                user: {
                    columns: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        // Formata para facilitar consumo no frontend (array de usuários)
        const simplifiedMembers = members.map(m => ({
            ...m.user,
            role: m.role,
            joinedAt: m.joinedAt
        }));

        res.json(simplifiedMembers);
    } catch (error) {
        console.error("Erro ao buscar membros:", error);
        res.status(500).json({ error: "Erro ao buscar membros." });
    }
});

// === CONVITES (Stub para Futuro) ===
router.post('/teams/:teamId/invite', async (req, res) => {
    // Implementação futura: Enviar email ou gerar link
    res.json({ message: "Convite registrado (simulação)." });
});

export default router;
