/* Prana V10 - Universal Controller Patcher
   Uso: node v10-universal-patcher.js
   Alvo: 34+ Controllers. 
   Lógica: Injeção em massa de Multiverso (Realms) e Poda Radical.
*/

import fs from 'fs';
import path from 'path';

const CONTROLLERS_DIR = './src/api/controllers';
const files = fs.readdirSync(CONTROLLERS_DIR).filter(f => f.endsWith('.js'));

console.log(`\x1b[35m[Neural OS]\x1b[0m Iniciando patch industrial em ${files.length} controllers...`);

files.forEach(file => {
  const filePath = path.join(CONTROLLERS_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 1. IMPORTAÇÃO: Garante que 'and' e 'eq' existam do drizzle-orm
  if (content.includes('drizzle-orm') && !content.includes(' and ')) {
    content = content.replace(/import {([^}]*)} from 'drizzle-orm'/, (match, imports) => {
      const trimmed = imports.trim();
      const newImports = [];
      if (!trimmed.includes('and')) newImports.push('and');
      if (!trimmed.includes('eq')) newImports.push('eq');
      return `import { ${trimmed}${newImports.length ? ', ' + newImports.join(', ') : ''} } from 'drizzle-orm'`;
    });
    modified = true;
  }

  // 2. EXTRAÇÃO: Injeta realmId em desestruturações de req.query, req.body ou req.params
  const extractPatterns = [
    /(const|let)\s+{[^}]*}(?=\s*=\s*req\.(query|body|params|params\.id))/g
  ];

  extractPatterns.forEach(pattern => {
    content = content.replace(pattern, (match) => {
      if (!match.includes('realmId')) {
        modified = true;
        return match.replace('}', ', realmId }');
      }
      return match;
    });
  });

  // 3. PODA RADICAL (SELECT/UPDATE): Transforma .where(eq(...)) em .where(and(eq(...), realmIdFilter))
  // Captura o objeto do schema sendo usado no where para manter a referência correta
  const wherePattern = /\.where\(eq\((schema\.[a-zA-Z]+|[a-zA-Z]+)\.([a-zA-Z]+),\s*([^)]+)\)\)/g;
  
  content = content.replace(wherePattern, (match, schemaObj, field, value) => {
    // Evita duplicar se o script rodar duas vezes
    if (match.includes('realmId')) return match;
    
    modified = true;
    return `.where(and(eq(${schemaObj}.${field}, ${value}), realmId && realmId !== 'all' ? eq(${schemaObj}.realmId, realmId) : undefined))`;
  });

  // 4. MANIFESTAÇÃO (INSERT): Injeta realmId no objeto de valores
  const insertPattern = /\.values\({([\s\S]*?)}\)/g;
  content = content.replace(insertPattern, (match, body) => {
    if (body.includes('realmId')) return match;
    
    modified = true;
    // Tenta inserir após o ID ou no início do objeto
    if (body.includes('id:')) {
      return `.values({${body.replace(/(id:\s*[^,]+,)/, '$1\n        realmId: realmId || \'personal\',')}})`;
    }
    return `.values({\n        realmId: realmId || 'personal',${body}})`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`\x1b[32m[OK]\x1b[0m ${file} sintonizado.`);
  } else {
    console.log(`\x1b[30m[SKIP]\x1b[0m ${file} já estava em conformidade.`);
  }
});

console.log(`\n\x1b[35m[Concluído]\x1b[0m Multiverso estabilizado em todos os controllers.`);