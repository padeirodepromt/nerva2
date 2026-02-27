/* src/api/controllers/importController.js
   desc: Controller para processar requisições de importação
   feat: Validação, preview, detecção de duplicatas
*/

import { 
  importFromCSV, importFromNotion, importFromAsana,
  validateCSV, previewCSV, validateNotion, previewNotion, 
  validateAsana, previewAsana, detectDuplicates
} from '../../ai_services/importService.js';
import { ashImportProcessor } from '../../ai_services/ashImportProcessor.js';
import * as holisticAnalysisService from '../../ai_services/holisticAnalysisService.js';
import { processRepoZip } from '../services/zipProcessor.js';

export async function handleCSVImport(req, res) {
  try {
    const { csvData , realmId } = req.body;
    const userId = req.user.id;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data é obrigatório' });
    }

    const result = await importFromCSV(csvData, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro em handleCSVImport:', error);
    res.status(500).json({ error: 'Falha ao processar import' });
  }
}

export async function handleNotionImport(req, res) {
  try {
    const { notionToken, notionDatabaseId , realmId } = req.body;
    const userId = req.user.id;

    if (!notionToken || !notionDatabaseId) {
      return res.status(400).json({ error: 'notionToken e notionDatabaseId são obrigatórios' });
    }

    const result = await importFromNotion(notionToken, notionDatabaseId, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro em handleNotionImport:', error);
    res.status(500).json({ error: 'Falha ao conectar ao Notion' });
  }
}

export async function handleAsanaImport(req, res) {
  try {
    const { asanaToken, asanaProjectId , realmId } = req.body;
    const userId = req.user.id;

    if (!asanaToken || !asanaProjectId) {
      return res.status(400).json({ error: 'asanaToken e asanaProjectId são obrigatórios' });
    }

    const result = await importFromAsana(asanaToken, asanaProjectId, userId);

    if (!result.success) {
      return res.status(400).json(result);
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Erro em handleAsanaImport:', error);
    res.status(500).json({ error: 'Falha ao conectar ao Asana' });
  }
}

export const importGithubZip = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo ZIP enviado.' });
    }

    const userId = req.user.id; // Do middleware de auth
    const repoName = req.body.repoName || req.file.originalname.replace('.zip', '');

    console.log(`[Import] Iniciando processamento de ZIP: ${repoName}`);

    const result = await processRepoZip(req.file.buffer, userId, repoName);

    res.json({
      success: true,
      message: `Repositório importado com sucesso. ${result.filesProcessed} arquivos processados.`,
      projectId: result.projectId
    });

  } catch (error) {
    console.error('[Import Zip] Erro:', error);
    res.status(500).json({ error: 'Falha ao processar o arquivo ZIP.' });
  }
};

// ============================================================================
// VALIDAÇÃO DE CREDENCIAIS
// ============================================================================

export async function validateCSVConnection(req, res) {
  try {
    const { csvData , realmId } = req.body;
    const result = validateCSV(csvData);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar CSV' });
  }
}

export async function validateNotionConnection(req, res) {
  try {
    const { notionToken, notionDatabaseId , realmId } = req.body;
    const result = await validateNotion(notionToken, notionDatabaseId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar Notion' });
  }
}

export async function validateAsanaConnection(req, res) {
  try {
    const { asanaToken, asanaProjectId , realmId } = req.body;
    const result = await validateAsana(asanaToken, asanaProjectId);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao validar Asana' });
  }
}

// ============================================================================
// PREVIEW DE DADOS
// ============================================================================

export async function previewCSVData(req, res) {
  try {
    const { csvData , realmId } = req.body;
    const result = previewCSV(csvData, 5);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar preview CSV' });
  }
}

export async function previewNotionData(req, res) {
  try {
    const { notionToken, notionDatabaseId , realmId } = req.body;
    const result = await previewNotion(notionToken, notionDatabaseId, 5);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar preview Notion' });
  }
}

export async function previewAsanaData(req, res) {
  try {
    const { asanaToken, asanaProjectId , realmId } = req.body;
    const result = await previewAsana(asanaToken, asanaProjectId, 5);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao gerar preview Asana' });
  }
}

// ============================================================================
// DETECÇÃO DE DUPLICATAS
// ============================================================================

export async function checkDuplicates(req, res) {
  try {
    const { csvData , realmId } = req.body;
    const userId = req.user.id;

    if (!csvData) {
      return res.status(400).json({ error: 'CSV data é obrigatório' });
    }

    const dataArray = typeof csvData === 'string' ? JSON.parse(csvData) : csvData;
    const taskHashes = dataArray.map(row => {
      const crypto = require('crypto');
      return crypto.createHash('md5')
        .update(`${row.title}|${row.description || ''}`.toLowerCase())
        .digest('hex');
    });

    const result = await detectDuplicates(userId, taskHashes);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao detectar duplicatas' });
  }
}

export async function ashProcessTasks(req, res) {
  try {
    const { tasks , realmId } = req.body;
    const userId = req.user.id;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ error: 'Tasks array é obrigatório' });
    }

    // Buscar contexto holístico do usuário
    const userContext = await holisticAnalysisService.generateInsights(userId);
    userContext.userId = userId;

    // Processar tasks com Ash
    const processedTasks = await ashImportProcessor.processImportedTasks(
      tasks,
      userContext
    );

    res.json({
      success: true,
      totalProcessed: processedTasks.length,
      processedTasks,
      preview: ashImportProcessor.getPreview(processedTasks, 5)
    });
  } catch (error) {
    console.error('Erro ao processar tasks com Ash:', error);
    res.status(500).json({ error: error.message || 'Erro ao processar com Ash' });
  }
}

export async function applyOptimizations(req, res) {
  try {
    const { processedTasks , realmId } = req.body;
    const userId = req.user.id;

    if (!processedTasks || !Array.isArray(processedTasks)) {
      return res.status(400).json({ error: 'Processed tasks array é obrigatório' });
    }

    const createdTasks = [];
    const errors = [];

    // Importar db e schema se necessário
    const { db } = await import('../../db/index.js');
    const schema = await import('../../db/schema.js');
    const { createId } = await import('../../utils/id.js');

    for (const item of processedTasks) {
      try {
        const taskData = {
          id: createId('tsk'),
          userId,
          ...item.optimized,
          source: 'import_ash_optimized',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await db.insert(schema.tasks).values(taskData);
        createdTasks.push(taskData);
      } catch (e) {
        errors.push({
          title: item.original_title,
          error: e.message
        });
      }
    }

    res.json({
      success: true,
      tasksCreated: createdTasks.length,
      errors,
      totalProcessed: processedTasks.length
    });
  } catch (error) {
    console.error('Erro ao aplicar otimizações:', error);
    res.status(500).json({ error: error.message || 'Erro ao aplicar otimizações' });
  }
}
export default {
  handleCSVImport,
  handleNotionImport,
  handleAsanaImport,
  validateCSVConnection,
  validateNotionConnection,
  validateAsanaConnection,
  previewCSVData,
  previewNotionData,
  previewAsanaData,
  checkDuplicates,
  ashProcessTasks,
  applyOptimizations
};