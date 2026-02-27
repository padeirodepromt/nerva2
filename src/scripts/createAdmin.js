/* src/scripts/createAdmin.js
   desc: Cria ou promove um usuário para o plano ADMIN (God Mode).
   usage: node src/scripts/createAdmin.js
*/

import { db } from '../db/index.js';
import { users } from '../db/schema/core.js';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

// --- CONFIGURAÇÃO ---
const ADMIN_EMAIL = 'lucasferreirafete@gmail.com'; // <--- COLOQUE SEU EMAIL AQUI
const ADMIN_PASSWORD = 'Fete021090'; // <--- SENHA (só usada se criar novo)
const ADMIN_NAME = 'Lucas';
// ---------------------

async function main() {
  console.log(`🔍 Verificando usuário: ${ADMIN_EMAIL}...`);

  try {
    // 1. Tenta achar o usuário
    const existingUser = await db.select().from(users).where(eq(users.email, ADMIN_EMAIL)).limit(1);

    if (existingUser.length > 0) {
      // CENÁRIO A: Usuário já existe -> PROMOVER
      console.log('⚡ Usuário encontrado. Promovendo para ADMIN...');
      
      await db.update(users)
        .set({ 
            plan_type: 'ADMIN',
            role: 'admin', // Se houver coluna role, garantimos também
            updated_at: new Date()
        })
        .where(eq(users.email, ADMIN_EMAIL));

      console.log('✅ SUCESSO! Usuário agora é ADMIN.');
      console.log('➡ Faça logout e login novamente para ver as features.');

    } else {
      // CENÁRIO B: Usuário não existe -> CRIAR
      console.log('🌱 Usuário não encontrado. Criando novo ADMIN...');
      
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      
      await db.insert(users).values({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        plan_type: 'ADMIN', // A chave mágica
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log('✅ SUCESSO! Usuário Admin criado.');
      console.log(`➡ Email: ${ADMIN_EMAIL}`);
      console.log(`➡ Senha: ${ADMIN_PASSWORD}`);
    }

  } catch (error) {
    console.error('❌ ERRO:', error);
  }

  process.exit(0);
}

main();