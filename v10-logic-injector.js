/* Prana V10 - Logic Injector
  Uso: node v10-logic-injector.js
  Descrição: Injeta automaticamente o filtro de RealmId e lógica de criação nos controllers padrão.
*/

import fs from 'fs';
import path from 'path';

const CONTROLLERS_DIR = './src/api/controllers';
const targets = ['taskController.js', 'recordController.js', 'sankalpaController.js', 'eventController.js'];

targets.forEach(file => {
  const filePath = path.join(CONTROLLERS_DIR, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  console.log(`\x1b[36m[V10 Sync]\x1b[0m Processando ${file}...`);

  // 1. Garantir que o 'and' do Drizzle esteja importado para filtros múltiplos
  if (!content.includes(' and ') && content.includes('drizzle-orm')) {
    content = content.replace(/import {([^}]*)} from 'drizzle-orm'/, (match, imports) => {
      if (!imports.includes('and')) return `import { ${imports.trim()}, and } from 'drizzle-orm'`;
      return match;
    });
  }

  // 2. Injetar Poda Radical no método list()
  // Procura por const { projectId } = req.query ou similar
  content = content.replace(/const {([^}]*projectId[^}]*)} = req.(query|params)/, 
    `const {$1, realmId} = req.$2`);

  // Adiciona a lógica de filtro and() se houver uma query de listagem
  content = content.replace(/where\(eq\(([^,]+)\.projectId,\s*projectId\)\)/g, 
    `where(and(eq($1.projectId, projectId), realmId && realmId !== 'all' ? eq($1.realmId, realmId) : undefined))`);

  // 3. Injetar RealmId no método create()
  // Captura o realmId do corpo da requisição
  content = content.replace(/const {([^}]*title[^}]*)} = req.body/, 
    `const {$1, realmId} = req.body`);

  // Injeta o realmId no objeto de inserção de dados
  if (!content.includes('realmId: realmId')) {
    content = content.replace(/id: createId\('[^']+'\),/, (match) => {
      return `${match}\n        realmId: realmId || 'personal',`;
    });
  }

  fs.writeFileSync(filePath, content);
  console.log(`\x1b[32m[Sincronizado]\x1b[0m ${file} agora é V10.`);
});

console.log("\n\x1b[35m[Concluído]\x1b[0m A consciência de Multiverso foi injetada nos controllers selecionados.");