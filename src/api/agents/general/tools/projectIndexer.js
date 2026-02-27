import fs from 'fs/promises';
import path from 'path';

/**
 * Ferramenta compartilhada para Agentes (Ash, Neo, etc.)
 * Gera um mapa do projeto ignorando o que é ruído.
 */
export async function getProjectMap(basePath = process.cwd(), ignoreList = ['node_modules', '.git', 'dist', '.next']) {
  async function scan(dir) {
    const files = await fs.readdir(dir, { withFileTypes: true });
    const nodes = [];

    for (const file of files) {
      if (ignoreList.includes(file.name)) continue;

      const fullPath = path.join(dir, file.name);
      const relativePath = path.relative(basePath, fullPath);

      if (file.isDirectory()) {
        nodes.push({
          name: file.name,
          path: relativePath,
          type: 'directory',
          children: await scan(fullPath)
        });
      } else {
        nodes.push({
          name: file.name,
          path: relativePath,
          type: 'file',
          extension: path.extname(file.name)
        });
      }
    }
    return nodes;
  }

  return await scan(basePath);
}