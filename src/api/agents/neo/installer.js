/* src/api/agents/neo/installer.js */
import { db } from '../../../db/index.js';
import { users } from '../../../db/schema/core.js';
import { agents, userAgents } from '../../../db/schema/agents.js';
import { eq, and } from 'drizzle-orm';

export const NeoInstaller = {
  async install(userId) {
    console.log(`📡 [Provisioning] Vinculando Neo ao usuário: ${userId}...`);

    try {
      // 1. Busca o Agente Neo no Catálogo
      const [neo] = await db.select().from(agents).where(eq(agents.key, 'neo_dev')).limit(1);
      if (!neo) throw new Error('Agente Neo não encontrado no catálogo.');

      // 2. Cria ou Ativa o Vínculo
      const [existing] = await db.select().from(userAgents)
        .where(and(eq(userAgents.userId, userId), eq(userAgents.agentId, neo.id)));

      if (existing) {
        await db.update(userAgents).set({ isActive: true }).where(eq(userAgents.id, existing.id));
        return { status: 'updated', message: 'Neo reativado.' };
      } else {
        await db.insert(userAgents).values({
          userId: userId,
          agentId: neo.id,
          isActive: true,
          config: { experienceLevel: 'senior' }
        });
        return { status: 'created', message: 'Contrato do Neo assinado!' };
      }
    } catch (error) {
      console.error('❌ [NeoInstaller] Falha:', error.message);
      throw error;
    }
  }
};