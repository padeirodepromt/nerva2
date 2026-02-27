/* src/api/routes/importRoutes.js
   desc: Endpoints para importar e validar dados
   updates: Adicionado suporte para upload de ZIP (Github Repository Ingestion)
*/

import express from 'express';
import multer from 'multer'; // <--- Necessário para processar uploads de arquivos
import { authenticate as authenticateToken } from '../authMiddleware.js';
import { apiLimiter } from '../middleware/rateLimiter.js';
import { 
  handleCSVImport, handleNotionImport, handleAsanaImport,
  validateCSVConnection, validateNotionConnection, validateAsanaConnection,
  previewCSVData, previewNotionData, previewAsanaData,
  checkDuplicates,
  ashProcessTasks, applyOptimizations,
  importGithubZip // <--- Novo Controller Importado
} from '../controllers/importController.js';

const router = express.Router();

// Configuração do Multer para manter o arquivo na memória (Buffer)
// Isso permite que o AdmZip leia o arquivo diretamente sem salvar no disco
const upload = multer({ storage: multer.memoryStorage() });

// Aplicar autenticação a todos os endpoints
router.use(authenticateToken);
router.use(apiLimiter);

// ============================================================================
// IMPORTAÇÃO (Main endpoints)
// ============================================================================

/**
 * POST /api/import/csv
 * Importar dados do CSV
 */
router.post('/csv', handleCSVImport);

/**
 * POST /api/import/notion
 * Importar dados do Notion
 */
router.post('/notion', handleNotionImport);

/**
 * POST /api/import/asana
 * Importar dados do Asana
 */
router.post('/asana', handleAsanaImport);

/**
 * POST /api/import/zip
 * Importar Repositório via ZIP (Github)
 * Aceita multipart/form-data com campo 'file'
 */
router.post('/zip', upload.single('file'), importGithubZip);


// ============================================================================
// VALIDAÇÃO (Test connection)
// ============================================================================

/**
 * POST /api/import/validate/csv
 * Testar conexão CSV
 */
router.post('/validate/csv', validateCSVConnection);

/**
 * POST /api/import/validate/notion
 * Testar conexão Notion
 */
router.post('/validate/notion', validateNotionConnection);

/**
 * POST /api/import/validate/asana
 * Testar conexão Asana
 */
router.post('/validate/asana', validateAsanaConnection);

// ============================================================================
// PREVIEW (Sample data)
// ============================================================================

/**
 * POST /api/import/preview/csv
 * Obter amostra de dados CSV
 */
router.post('/preview/csv', previewCSVData);

/**
 * POST /api/import/preview/notion
 * Obter amostra Notion
 */
router.post('/preview/notion', previewNotionData);

/**
 * POST /api/import/preview/asana
 * Obter amostra Asana
 */
router.post('/preview/asana', previewAsanaData);


// ============================================================================
// DUPLICATAS (Check for duplicates)
// ============================================================================

/**
 * POST /api/import/check-duplicates
 * Detectar items duplicados
 */
router.post('/check-duplicates', checkDuplicates);

// ============================================================================
// ASH INTELLIGENCE (Smart optimization with Ash)
// ============================================================================

/**
 * POST /api/import/ash-process
 * Processar tasks com Ash para otimização inteligente
 * Analisa cada task baseado em contexto holístico do usuário
 */
router.post('/ash-process', ashProcessTasks);

/**
 * POST /api/import/apply-optimizations
 * Aplica otimizações do Ash e cria tasks otimizadas
 */
router.post('/apply-optimizations', applyOptimizations);

export default router;