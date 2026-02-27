/* src/api/controllers/teamController.js
   desc: Gestão de Equipes (Convites, Energia e Membros).
*/
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

// Email provider - usando Resend como padrão
const sendInviteEmail = async (email, teamName, inviteLink) => {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      console.log('[TeamInvite] RESEND_API_KEY não configurada - usando mock');
      return true;
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'noreply@prana.dev',
        to: email,
        subject: `Você foi convidado para ${teamName}`,
        html: `<p>Você foi convidado para participar da equipe <strong>${teamName}</strong></p><a href="${inviteLink}">Aceitar Convite</a>`
      })
    });
    return response.ok;
  } catch (error) {
    console.error('[TeamInvite] Erro ao enviar email:', error);
    return false;
  }
};

export const teamController = {
  
  // Lista membros com métricas enriquecidas
  getTeamMembers: async (req, res) => {
    try {
      const { teamId , realmId } = req.params;
      
      // Busca membros e dados do usuário (avatar/nome)
      const members = await db.select({
          id: schema.users.id,
          name: schema.users.name,
          email: schema.users.email,
          avatarUrl: schema.users.avatarUrl,
          role: schema.teamMembers.role,
          energy: schema.teamMembers.energyStatus,
          load: schema.teamMembers.workLoad,
          status: schema.teamMembers.status
      })
      .from(schema.teamMembers)
      .innerJoin(schema.users, eq(schema.teamMembers.userId, schema.users.id))
      .where(and(eq(schema.teamMembers.teamId, teamId), realmId && realmId !== 'all' ? eq(schema.teamMembers.realmId, realmId) : undefined));

      res.json(members);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Enviar Convite
  inviteMember: async (req, res) => {
    try {
      const { teamId , realmId } = req.params;
      const { email, role } = req.body;

      // Verifica se usuário já existe no sistema
      const existingUser = await db.query.users.findFirst({
          where: eq(schema.users.email, email)
      });

      if (existingUser) {
          // Adiciona direto (simplificado para MVP)
          await db.insert(schema.teamMembers).values({
        realmId: realmId || 'personal',
              teamId,
              userId: existingUser.id,
              role: role || 'editor'
          });
          res.json({ message: "Usuário adicionado à equipe." });
      } else {
          // Cria convite pendente
          const invite = await db.insert(schema.teamInvites).values({
        realmId: realmId || 'personal',
              teamId,
              email,
              role: role || 'editor'
          }).returning();

          // Enviar email real (SendGrid/Resend)
          const inviteLink = `${process.env.APP_URL || 'http://localhost:5173'}/accept-invite?token=${invite[0]?.id}`;
          await sendInviteEmail(email, req.body.teamName || 'Prana', inviteLink);
          res.json({ message: "Convite enviado por e-mail." });
      }
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  // Atualiza Energia (Check-in)
  updateStatus: async (req, res) => {
      try {
          const { userId, energy, status , realmId } = req.body;
          // Atualiza em todos os times que o user participa
          await db.update(schema.teamMembers)
              .set({ energyStatus: energy, status: status })
              .where(and(eq(schema.teamMembers.userId, userId), realmId && realmId !== 'all' ? eq(schema.teamMembers.realmId, realmId) : undefined));
          
          res.json({ success: true });
      } catch (e) { res.status(500).json({ error: e.message }); }
  }
};