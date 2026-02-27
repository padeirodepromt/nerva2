import express from 'express';
import { ProjectFieldsController } from '../controllers/ProjectFieldsController.js';
import { ProjectWorkflowsController } from '../controllers/ProjectWorkflowsController.js';

const router = express.Router();

/**
 * PROJECT CUSTOM FIELDS ROUTES
 */

/**
 * GET /api/projects/:projectId/fields
 * Get all custom fields for a project
 */
router.get('/projects/:projectId/fields', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await ProjectFieldsController.getProjectFields(projectId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in GET /fields:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/projects/:projectId/fields/:fieldId
 * Get a specific field
 */
router.get('/projects/:projectId/fields/:fieldId', async (req, res) => {
  try {
    const { fieldId } = req.params;
    const result = await ProjectFieldsController.getField(fieldId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in GET /fields/:fieldId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/fields
 * Create a new custom field
 */
router.post('/projects/:projectId/fields', async (req, res) => {
  try {
    const { projectId } = req.params;
    const fieldData = req.body;
    
    const result = await ProjectFieldsController.createField(projectId, fieldData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /fields:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/projects/:projectId/fields/initialize', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { departmentKey } = req.query; // dev | narrative | core
    const result = await ProjectFieldsController.initializeDepartmentFields(projectId, departmentKey);
    if (!result.success) return res.status(400).json(result);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /fields/initialize:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/projects/:projectId/fields/:fieldId
 * Update a field
 */
router.put('/projects/:projectId/fields/:fieldId', async (req, res) => {
  try {
    const { fieldId } = req.params;
    const updateData = req.body;
    
    const result = await ProjectFieldsController.updateField(fieldId, updateData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in PUT /fields/:fieldId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/projects/:projectId/fields/:fieldId
 * Delete a field
 */
router.delete('/projects/:projectId/fields/:fieldId', async (req, res) => {
  try {
    const { fieldId } = req.params;
    
    const result = await ProjectFieldsController.deleteField(fieldId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in DELETE /fields/:fieldId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/fields/reorder
 * Reorder fields
 */
router.post('/projects/:projectId/fields/reorder', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { fieldOrder } = req.body;
    
    const result = await ProjectFieldsController.reorderFields(projectId, fieldOrder);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in POST /fields/reorder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PROJECT WORKFLOWS ROUTES
 */

/**
 * GET /api/projects/:projectId/workflows
 * Get all workflows for a project
 */
router.get('/projects/:projectId/workflows', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await ProjectWorkflowsController.getProjectWorkflows(projectId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in GET /workflows:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/projects/:projectId/workflows/:workflowId
 * Get a specific workflow
 */
router.get('/projects/:projectId/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const result = await ProjectWorkflowsController.getWorkflow(workflowId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in GET /workflows/:workflowId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/workflows/initialize
 * Initialize default workflows for a project
 */
router.post('/projects/:projectId/workflows/initialize', async (req, res) => {
  try {
    const { projectId } = req.params;
    const result = await ProjectWorkflowsController.initializeDefaultWorkflows(projectId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /workflows/initialize:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/workflows
 * Create a new workflow
 */
router.post('/projects/:projectId/workflows', async (req, res) => {
  try {
    const { projectId } = req.params;
    const workflowData = req.body;
    
    const result = await ProjectWorkflowsController.createWorkflow(projectId, workflowData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Error in POST /workflows:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * PUT /api/projects/:projectId/workflows/:workflowId
 * Update a workflow
 */
router.put('/projects/:projectId/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    const updateData = req.body;
    
    const result = await ProjectWorkflowsController.updateWorkflow(workflowId, updateData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in PUT /workflows/:workflowId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * DELETE /api/projects/:projectId/workflows/:workflowId
 * Delete a workflow
 */
router.delete('/projects/:projectId/workflows/:workflowId', async (req, res) => {
  try {
    const { workflowId } = req.params;
    
    const result = await ProjectWorkflowsController.deleteWorkflow(workflowId);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in DELETE /workflows/:workflowId:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/projects/:projectId/workflows/reorder
 * Reorder workflows
 */
router.post('/projects/:projectId/workflows/reorder', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { workflowOrder } = req.body;
    
    const result = await ProjectWorkflowsController.reorderWorkflows(projectId, workflowOrder);
    
    if (!result.success) {
      return res.status(400).json(result);
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error in POST /workflows/reorder:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
