import { db } from '../../db/index.js';
import { v4 as uuid } from 'uuid';
import { sql } from 'drizzle-orm';

/**
 * Project Workflows Controller
 * Manages project workflows (statuses for KanbanView)
 * Using Drizzle ORM with raw SQL queries
 */

export const ProjectWorkflowsController = {
  /**
   * Get all workflows for a project
   */
  async getProjectWorkflows(projectId) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM project_workflows 
        WHERE project_id = ${projectId}
        ORDER BY display_order ASC
      `);
      
      const workflows = result.rows || [];
      return {
        success: true,
        data: workflows,
        count: workflows.length
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error fetching workflows:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Get a specific workflow by ID
   */
  async getWorkflow(workflowId) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM project_workflows WHERE id = ${workflowId}
      `);
      
      return {
        success: true,
        data: result.rows?.[0] || null
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error fetching workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Initialize default workflows for a new project
   * Always start with 4 default statuses: todo, in_progress, blocked, done
   */
  async initializeDefaultWorkflows(projectId) {
    try {
      const defaultWorkflows = [
        {
          status_id: 'todo',
          status_name: 'To Do',
          color: '#a8a29e',
          icon: 'IconCircle',
          display_order: 0
        },
        {
          status_id: 'in_progress',
          status_name: 'In Progress',
          color: '#3b82f6',
          icon: 'IconClock',
          display_order: 1
        },
        {
          status_id: 'blocked',
          status_name: 'Blocked',
          color: '#ef4444',
          icon: 'IconAlertTriangle',
          display_order: 2
        },
        {
          status_id: 'done',
          status_name: 'Done',
          color: '#10b981',
          icon: 'IconCheckCircle',
          display_order: 3
        }
      ];

      const created = [];

      for (const workflow of defaultWorkflows) {
        const id = uuid();
        await db.execute(sql`
          INSERT INTO project_workflows 
          (id, project_id, status_id, status_name, color, icon, display_order, is_from_template, created_at, updated_at) 
          VALUES (${id}, ${projectId}, ${workflow.status_id}, ${workflow.status_name}, ${workflow.color}, ${workflow.icon}, ${workflow.display_order}, false, now(), now())
        `);

        created.push({
          id,
          ...workflow,
          is_from_template: false,
          created_at: new Date(),
          updated_at: new Date()
        });
      }

      return {
        success: true,
        data: created
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error initializing workflows:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Create a new workflow/status
   */
  async createWorkflow(projectId, workflowData) {
    try {
      const { status_id, status_name, color, icon, display_order } = workflowData;
      
      // Validation
      if (!status_id || !status_name) {
        return {
          success: false,
          error: 'status_id and status_name are required'
        };
      }

      // Check for duplicate status_id
      const checkResult = await db.execute(sql`
        SELECT id FROM project_workflows 
        WHERE project_id = ${projectId} AND status_id = ${status_id}
      `);

      if (checkResult.rows && checkResult.rows.length > 0) {
        return {
          success: false,
          error: 'Workflow with this status_id already exists'
        };
      }

      const id = uuid();
      const order = display_order ?? 999;

      await db.execute(sql`
        INSERT INTO project_workflows 
        (id, project_id, status_id, status_name, color, icon, display_order, is_from_template, created_at, updated_at) 
        VALUES (${id}, ${projectId}, ${status_id}, ${status_name}, ${color || '#94a3b8'}, ${icon || 'IconCircle'}, ${order}, false, now(), now())
      `);

      return {
        success: true,
        data: {
          id,
          project_id: projectId,
          status_id,
          status_name,
          color: color || '#94a3b8',
          icon: icon || 'IconCircle',
          display_order: order,
          is_from_template: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error creating workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update a workflow/status
   */
  async updateWorkflow(workflowId, updateData) {
    try {
      const { status_name, color, icon, display_order } = updateData;
      
      // Get current workflow
      const workflowResult = await db.execute(sql`
        SELECT * FROM project_workflows WHERE id = ${workflowId}
      `);

      if (!workflowResult.rows || workflowResult.rows.length === 0) {
        return {
          success: false,
          error: 'Workflow not found'
        };
      }

      const currentWorkflow = workflowResult.rows[0];

      // Cannot modify template workflows
      if (currentWorkflow.is_from_template) {
        return {
          success: false,
          error: 'Cannot modify workflows inherited from templates'
        };
      }

      // Build update statement
      const setClauses = [];

      if (status_name !== undefined) {
        setClauses.push(`status_name = '${status_name}'`);
      }

      if (color !== undefined) {
        setClauses.push(`color = '${color}'`);
      }

      if (icon !== undefined) {
        setClauses.push(`icon = '${icon}'`);
      }

      if (display_order !== undefined) {
        setClauses.push(`display_order = ${display_order}`);
      }

      if (setClauses.length === 0) {
        return {
          success: false,
          error: 'No fields to update'
        };
      }

      setClauses.push('updated_at = now()');

      await db.execute(sql.raw(`
        UPDATE project_workflows 
        SET ${setClauses.join(', ')} 
        WHERE id = '${workflowId}'
      `));

      // Fetch updated workflow
      const updated = await db.execute(sql`
        SELECT * FROM project_workflows WHERE id = ${workflowId}
      `);

      return {
        success: true,
        data: updated.rows?.[0]
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error updating workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete a workflow/status
   * Note: Cannot delete template workflows, must have at least 1 workflow
   */
  async deleteWorkflow(workflowId) {
    try {
      // Get workflow
      const workflowResult = await db.execute(sql`
        SELECT * FROM project_workflows WHERE id = ${workflowId}
      `);

      if (!workflowResult.rows || workflowResult.rows.length === 0) {
        return {
          success: false,
          error: 'Workflow not found'
        };
      }

      const currentWorkflow = workflowResult.rows[0];

      // Cannot delete template workflows
      if (currentWorkflow.is_from_template) {
        return {
          success: false,
          error: 'Cannot delete workflows inherited from templates'
        };
      }

      // Check if this is the last workflow
      const countResult = await db.execute(sql`
        SELECT COUNT(*) as total FROM project_workflows WHERE project_id = ${currentWorkflow.project_id}
      `);

      const total = countResult.rows?.[0]?.total || 0;
      if (total <= 1) {
        return {
          success: false,
          error: 'Cannot delete the last workflow. A project must have at least one status.'
        };
      }

      await db.execute(sql`
        DELETE FROM project_workflows WHERE id = ${workflowId}
      `);

      return {
        success: true,
        message: 'Workflow deleted successfully'
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error deleting workflow:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Reorder workflows by display_order
   */
  async reorderWorkflows(projectId, workflowOrder) {
    try {
      // workflowOrder should be: [{ id: '...', display_order: 0 }, ...]
      
      for (const item of workflowOrder) {
        await db.execute(sql`
          UPDATE project_workflows 
          SET display_order = ${item.display_order}, updated_at = now()
          WHERE id = ${item.id} AND project_id = ${projectId}
        `);
      }

      return {
        success: true,
        message: 'Workflows reordered successfully'
      };
    } catch (error) {
      console.error('[ProjectWorkflowsController] Error reordering workflows:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
