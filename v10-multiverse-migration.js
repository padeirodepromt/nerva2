/* v10-multiverse-migration.js
   desc: Refactoring Automatizado de Controllers para Prana V10.
   goal: Injetar realmId em List e Create de forma massiva.
*/
import fs from 'fs';
import path from 'path';

const controllersDir = './src/api/controllers';

// 1. Localiza todos os controllers
const files = fs.readdirSync(controllersDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
    const filePath = path.join(controllersDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Pula se o arquivo já tiver a inteligência de Realm
    if (content.includes('realmId')) {
        console.log(`⏩ [SALTADO] ${file} já está sintonizado.`);
        return;
    }

    console.log(`🌀 [MIGRANDO] ${file}...`);

    // A. GARANTIR IMPORTS (Adiciona eq e and ao import do drizzle-orm se necessário)
    if (content.includes('from \'drizzle-orm\'') && !content.includes('eq')) {
        content = content.replace(
            /import \{ (.*?) \} from 'drizzle-orm'/g,
            (match, p1) => `import { ${p1}${p1.includes('eq') ? '' : ', eq, and'} } from 'drizzle-orm'`
        );
    }

    // B. MUTAÇÃO DO MÉTODO LIST (Injeta filtro dinâmico)
    // Procura por: const all = await db.select().from(tabela);
    content = content.replace(
        /const (\w+) = await db\.select\(\)\.from\((\w+)\);/g,
        `const { realmId } = req.query;
      let query = db.select().from($2);
      if (realmId && realmId !== 'all') {
        query = query.where(eq($2.realmId, realmId));
      }
      const $1 = await query;`
    );

    // C. MUTAÇÃO DO MÉTODO CREATE (Injeta persistência de Realm)
    // Procura pelo padrão do data object com createId
    content = content.replace(
        /const data = \{ ([\s\S]*?)id: createId\('(.*?)'\)([\s\S]*?)\};/g,
        (match, before, prefix, after) => {
            return `const data = { ${before}id: createId('${prefix}'), realmId: req.body.realmId || 'personal'${after}};`;
        }
    );

    // D. ADIÇÃO DO MÉTODO UPDATE (Caso não exista)
    // Se o controller tem delete mas não tem update, injetamos o update padrão V10
    if (content.includes('async delete') && !content.includes('async update')) {
        const tableMatch = content.match(/from\((\w+)\)/);
        const tableName = tableMatch ? tableMatch[1] : null;

        if (tableName) {
            content = content.replace(
                /async delete/g,
                `async update(req, res) {
    try {
      const { id } = req.params;
      const data = { ...req.body, updatedAt: new Date() };
      delete data.id;
      await db.update(${tableName}).set(data).where(eq(${tableName}.id, id));
      res.json({ success: true, id });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async delete`
            );
        }
    }

    fs.writeFileSync(filePath, content);
});

console.log('\n✨ [CONCLUÍDO] O Multiverso foi consolidado em todos os controllers.');