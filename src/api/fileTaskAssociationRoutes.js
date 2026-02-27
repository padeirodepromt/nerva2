/* src/api/fileTaskAssociationRoutes.js
   desc: Rotas para gerenciar associações File-Task (Arquivos ↔ Tarefas).
*/

import express from 'express';
import { fileTaskAssociationController } from './controllers/fileTaskAssociationController.js';

const router = express.Router();

// === ASSOCIAÇÕES ===

// Criar associação entre arquivo e tarefa
router.post('/file-task-associations', fileTaskAssociationController.createAssociation.bind(fileTaskAssociationController));

// Listar associações (com filtros)
router.get('/file-task-associations', fileTaskAssociationController.listAssociations.bind(fileTaskAssociationController));

// === ARQUIVOS (FILES) ===

// Obter tarefas vinculadas a um arquivo
router.get('/files/:fileId/tasks', fileTaskAssociationController.getTasksByFile.bind(fileTaskAssociationController));

// Vincular tarefa a um arquivo
router.post('/files/:fileId/associate-task', (req, res) => {
  // Adiciona fileId ao body
  req.body.fileId = req.params.fileId;
  fileTaskAssociationController.createAssociation(req, res);
});

// Desvincular tarefa de um arquivo
router.delete('/files/:fileId/tasks/:taskId', (req, res) => {
  req.params.fileId = req.params.fileId;
  req.params.taskId = req.params.taskId;
  fileTaskAssociationController.deleteAssociation(req, res);
});

// === TAREFAS (TASKS) ===

// Obter arquivos vinculados a uma tarefa
router.get('/tasks/:taskId/files', fileTaskAssociationController.getFilesByTask.bind(fileTaskAssociationController));

// Vincular arquivo a uma tarefa
router.post('/tasks/:taskId/associate-file', (req, res) => {
  // Adiciona taskId ao body
  req.body.taskId = req.params.taskId;
  fileTaskAssociationController.createAssociation(req, res);
});

// Desvincular arquivo de uma tarefa
router.delete('/tasks/:taskId/files/:fileId', (req, res) => {
  req.params.fileId = req.params.fileId;
  req.params.taskId = req.params.taskId;
  fileTaskAssociationController.deleteAssociation(req, res);
});

// === GERENCIAMENTO ===

// Atualizar tipo de relacionamento
router.put('/file-task-associations/:fileId/:taskId', (req, res) => {
  req.params.fileId = req.params.fileId;
  req.params.taskId = req.params.taskId;
  fileTaskAssociationController.updateAssociation(req, res);
});

// Remover associação diretamente
router.delete('/file-task-associations/:fileId/:taskId', (req, res) => {
  req.params.fileId = req.params.fileId;
  req.params.taskId = req.params.taskId;
  fileTaskAssociationController.deleteAssociation(req, res);
});

export default router;
