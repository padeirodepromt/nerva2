/* src/api/agents/neo/neoRefactorService.js */

import fs from 'fs/promises';
import path from 'path';
import { AgentLogService } from '../general/services/agentLogService.js';

export const NeoRefactorService = {
  async apply(userId, logId, filePath, proposedCode) {
    const fullPath = path.resolve(process.cwd(), filePath);

    // 🛡️ Segurança: impede sair do diretório do projeto
    if (!fullPath.startsWith(process.cwd())) {
      throw new Error('Violação de Segurança: Tentativa de acesso fora do diretório permitido.');
    }

    try {
      // 1) Backup
      const originalCode = await fs.readFile(fullPath, 'utf-8');
      await fs.writeFile(`${fullPath}.bak`, originalCode);

      // 2) Aplicar refatoração
      await fs.writeFile(fullPath, proposedCode);

      // 3) Log de sucesso
      await AgentLogService.log({
        agentId: 'neo_dev',
        targetAgentId: null,
        userId,
        type: 'REFACTOR',
        content: {
          logId,
          filePath,
          originalCode,
          proposedCode,
          timestamp: new Date().toISOString(),
        },
        impactScore: 80,
      });

      return { success: true, message: 'Refatoração aplicada com sucesso.', filePath };
    } catch (error) {
      // Log de falha
      await AgentLogService.log({
        agentId: 'neo_dev',
        targetAgentId: null,
        userId,
        type: 'REFACTOR',
        content: {
          logId,
          filePath,
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        impactScore: 20,
      });

      throw error;
    }
  },
};
