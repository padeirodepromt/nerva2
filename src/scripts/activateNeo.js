/* Para rodar: node src/scripts/activateNeo.js [seu_email]
*/
import { db } from '../db/index.js';
import { users } from '../db/schema/core.js';
import { agents, userAgents } from '../db/schema/agents.js';
import { eq, and } from 'drizzle-orm';

async function activateNeo() {
  const email = process.argv[2];
  if (!email) {
    console.error('❌ Por favor, forneça o email do usuário: node activateNeo.js user@example.com');
    process.exit(1);
  }

  console.log(`📡 Iniciando ativação do Neo para: ${email}...`);

  try {
    // 1. Busca o Usuário
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error('Usuário não encontrado.');

    // 2. Busca o Agente Neo no Catálogo
    const [neo] = await db.select().from(agents).where(eq(agents.key, 'neo_dev')).limit(1);
    if (!neo) throw new Error('Agente Neo não encontrado no catálogo. Certifique-se de que o servidor rodou o syncConfigs() primeiro.');

    // 3. Cria ou Ativa o Vínculo
    const [existing] = await db.select().from(userAgents)
      .where(and(eq(userAgents.userId, user.id), eq(userAgents.agentId, neo.id)));

    if (existing) {
      await db.update(userAgents).set({ isActive: true }).where(eq(userAgents.id, existing.id));
      console.log('✅ Neo já estava vinculado. Status atualizado para ATIVO.');
    } else {
      await db.insert(userAgents).values({
        userId: user.id,
        agentId: neo.id,
        isActive: true,
        config: { experienceLevel: 'senior' }
      });
      console.log('🚀 Contrato assinado! Neo agora é seu Agente Especialista.');
    }

  } catch (error) {
    console.error('❌ Falha na ativação:', error.message);
  } finally {
    process.exit();
  }
}

activateNeo();