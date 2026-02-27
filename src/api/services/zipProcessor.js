import AdmZip from 'adm-zip';
import { db } from '../../db/index.js';
import { projects } from '../../db/schema/core.js'; // Ou papyrusDocuments
import { papyrusDocuments } from '../../db/schema/docs.js';
import { createId } from '../../utils/id.js';

// Extensões permitidas (Texto/Código)
const ALLOWED_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.html', '.css', '.scss', 
  '.json', '.md', '.txt', '.py', '.java', '.c', '.cpp', 
  '.sql', '.prisma', '.env.example', '.yml', '.yaml'
]);

// Pastas ignoradas
const IGNORED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage', 
  '.next', '.cache', 'vendor', 'tmp'
]);

export const processRepoZip = async (fileBuffer, userId, repoName) => {
  const zip = new AdmZip(fileBuffer);
  const zipEntries = zip.getEntries();
  
  // 1. Criar o Projeto Container
  const projectId = createId('proj');
  await db.insert(projects).values({
    id: projectId,
    title: repoName || 'Repositório Importado',
    description: 'Importado via ZIP Upload',
    ownerId: userId,
    status: 'active',
    type: 'professional',
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const documentsToInsert = [];
  let fileCount = 0;

  // 2. Iterar sobre os arquivos do ZIP
  for (const entry of zipEntries) {
    if (entry.isDirectory) continue;

    const pathParts = entry.entryName.split('/');
    const fileName = pathParts.pop();
    const extension = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';

    // Verifica se está em pasta ignorada
    if (pathParts.some(part => IGNORED_DIRS.has(part))) continue;

    // Verifica se a extensão é válida
    if (!ALLOWED_EXTENSIONS.has(extension)) continue;

    // Lê o conteúdo
    const content = zip.readAsText(entry);
    if (!content || content.trim().length === 0) continue;

    fileCount++;

    // Prepara para inserção em lote (Batch)
    documentsToInsert.push({
      id: createId('doc'),
      title: entry.entryName, // O caminho completo serve como título para contexto
      content: { text: content }, // Estrutura JSONB do Papyrus
      ownerId: userId,
      projectId: projectId, // Assumindo que adicionamos essa coluna em docs.js
      type: 'code_file',
      tags: ['repository_import', extension.replace('.', '')],
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // 3. Inserção em Massa (Mais performance)
  if (documentsToInsert.length > 0) {
      // Drizzle aceita insert de array. Dividimos em chunks se for muito grande
      const chunkSize = 50; 
      for (let i = 0; i < documentsToInsert.length; i += chunkSize) {
          const chunk = documentsToInsert.slice(i, i + chunkSize);
          await db.insert(papyrusDocuments).values(chunk);
      }
  }

  return { 
    success: true, 
    projectId, 
    filesProcessed: fileCount 
  };
};
