import { db } from '../../db/index.js';
import { v4 as uuid } from 'uuid';
import { sql } from 'drizzle-orm';

/**
 * Project Custom Fields Controller
 * Catálogo de colunas (governança + UI).
 * Valores vivem em JSONB (tasks.customData / records.properties).
 */

const VALID_TYPES = ['text', 'number', 'dropdown', 'date', 'member', 'checkbox'];

/**
 * Seeds mínimos por Departamento (pode evoluir para templates/installer)
 * Regra: Fields pertencem ao Departamento.
 */
const DEPARTMENT_FIELD_SEEDS = {
  dev: [
    { name: 'Tipo', slug: 'task_type', type: 'dropdown', options: { items: ['bug', 'feature', 'refactor', 'chore'] }, is_required: false, display_order: 10 },
    { name: 'Área', slug: 'area', type: 'dropdown', options: { items: ['frontend', 'backend', 'infra', 'db'] }, is_required: false, display_order: 20 },
    { name: 'Complexidade', slug: 'complexity', type: 'dropdown', options: { items: ['S', 'M', 'L', 'XL'] }, is_required: false, display_order: 30 },
    { name: 'Ambiente', slug: 'env', type: 'dropdown', options: { items: ['local', 'staging', 'prod'] }, is_required: false, display_order: 40 },
    { name: 'Repo', slug: 'repo', type: 'text', options: null, is_required: false, display_order: 50 },
    { name: 'Branch', slug: 'branch', type: 'text', options: null, is_required: false, display_order: 60 },
    { name: 'PR Link', slug: 'pr_link', type: 'text', options: null, is_required: false, display_order: 70 },
    { name: 'Review', slug: 'review_needed', type: 'checkbox', options: null, is_required: false, display_order: 80 },
  ],

  narrative: [
    { name: 'Plataforma', slug: 'platform', type: 'dropdown', options: { items: ['instagram', 'youtube', 'tiktok', 'linkedin', 'newsletter', 'blog'] }, is_required: false, display_order: 10 },
    { name: 'Intenção', slug: 'intent', type: 'dropdown', options: { items: ['atrair', 'nutrir', 'converter', 'autoridade', 'comunidade'] }, is_required: false, display_order: 20 },
    { name: 'Persona', slug: 'persona', type: 'text', options: null, is_required: false, display_order: 30 },
    { name: 'Pilar', slug: 'pillar', type: 'text', options: null, is_required: false, display_order: 40 },
    { name: 'Formato', slug: 'format', type: 'dropdown', options: { items: ['carrossel', 'reels', 'story', 'post', 'artigo', 'email'] }, is_required: false, display_order: 50 },
    { name: 'Hook', slug: 'hook', type: 'text', options: null, is_required: false, display_order: 60 },
  ],

  core: []
};

function normalizeDepartmentKey(departmentKey) {
  if (!departmentKey) return 'core';
  const k = String(departmentKey).toLowerCase().trim();
  if (k === 'dev' || k === 'narrative' || k === 'core') return k;
  // fallback: qualquer coisa fora do mapa vira core
  return 'core';
}

export const ProjectFieldsController = {
  /**
   * Get all custom fields for a project
   */
  async getProjectFields(projectId) {
    try {
      const fields = await db.execute(sql`
        SELECT * FROM project_custom_fields 
        WHERE project_id = ${projectId}
        ORDER BY display_order ASC
      `);

      return {
        success: true,
        data: fields.rows || [],
        count: (fields.rows || []).length
      };
    } catch (error) {
      console.error('[ProjectFieldsController] Error fetching fields:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Initialize default fields for a department (idempotente)
   * POST /api/projects/:projectId/fields/initialize?departmentKey=dev|narrative|core
   */
  async initializeDepartmentFields(projectId, departmentKey) {
    try {
      const deptKey = normalizeDepartmentKey(departmentKey);
      const seed = DEPARTMENT_FIELD_SEEDS[deptKey] || [];

      if (seed.length === 0) {
        return {
          success: true,
          message: `No fields to seed for department: ${deptKey}`,
          created: 0,
          skipped: 0
        };
      }

      let created = 0;
      let skipped = 0;

      for (const f of seed) {
        // validação mínima
        if (!f.name || !f.slug || !f.type) {
          skipped++;
          continue;
        }
        if (!VALID_TYPES.includes(f.type)) {
          skipped++;
          continue;
        }

        // slug unique por projeto: se já existe, pula
        const existing = await db.execute(sql`
          SELECT id FROM project_custom_fields 
          WHERE project_id = ${projectId} AND slug = ${f.slug}
          LIMIT 1
        `);

        if (existing.rows && existing.rows.length > 0) {
          skipped++;
          continue;
        }

        const id = uuid();

        await db.execute(sql`
          INSERT INTO project_custom_fields 
          (id, project_id, name, slug, type, options, is_required, display_order, is_from_template, created_at, updated_at) 
          VALUES (
            ${id},
            ${projectId},
            ${f.name},
            ${f.slug},
            ${f.type},
            ${f.options ? JSON.stringify(f.options) : null},
            ${!!f.is_required},
            ${Number.isFinite(f.display_order) ? f.display_order : 0},
            true,
            now(),
            now()
          )
        `);

        created++;
      }

      return {
        success: true,
        message: `Seeded department fields: ${deptKey}`,
        created,
        skipped
      };
    } catch (error) {
      console.error('[ProjectFieldsController] Error initializing department fields:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Get a specific field by ID
   */
  async getField(fieldId) {
    try {
      const result = await db.execute(sql`
        SELECT * FROM project_custom_fields WHERE id = ${fieldId}
      `);

      return {
        success: true,
        data: result.rows?.[0] || null
      };
    } catch (error) {
      console.error('[ProjectFieldsController] Error fetching field:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Create a new custom field (manual, user-created)
   */
  async createField(projectId, fieldData) {
    try {
      const { name, slug, type, options, is_required, display_order } = fieldData;

      if (!name || !slug || !type) {
        return { success: false, error: 'Name, slug, and type are required' };
      }

      if (!VALID_TYPES.includes(type)) {
        return { success: false, error: `Invalid type. Must be one of: ${VALID_TYPES.join(', ')}` };
      }

      // Check for duplicate slug
      const existing = await db.execute(sql`
        SELECT id FROM project_custom_fields 
        WHERE project_id = ${projectId} AND slug = ${slug}
      `);

      if (existing.rows && existing.rows.length > 0) {
        return { success: false, error: 'Field with this slug already exists' };
      }

      const id = uuid();
      const order = Number.isFinite(display_order) ? display_order : 0;

      await db.execute(sql`
        INSERT INTO project_custom_fields 
        (id, project_id, name, slug, type, options, is_required, display_order, is_from_template, created_at, updated_at) 
        VALUES (
          ${id},
          ${projectId},
          ${name},
          ${slug},
          ${type},
          ${options ? JSON.stringify(options) : null},
          ${!!is_required},
          ${order},
          false,
          now(),
          now()
        )
      `);

      return {
        success: true,
        data: {
          id,
          project_id: projectId,
          name,
          slug,
          type,
          options,
          is_required: !!is_required,
          display_order: order,
          is_from_template: false
        }
      };
    } catch (error) {
      console.error('[ProjectFieldsController] Error creating field:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Update a custom field
   * Note: Cannot change type or template status
   */
  async updateField(fieldId, updateData) {
    try {
      const { name, options, is_required, display_order } = updateData;

      const fieldResult = await db.execute(sql`
        SELECT * FROM project_custom_fields WHERE id = ${fieldId}
      `);

      if (!fieldResult.rows || fieldResult.rows.length === 0) {
        return { success: false, error: 'Field not found' };
      }

      const currentField = fieldResult.rows[0];

      // Cannot modify template fields
      if (currentField.is_from_template) {
        return { success: false, error: 'Cannot modify fields inherited from templates' };
      }

      const setClauses = [];

      if (name !== undefined) setClauses.push(`name = '${String(name).replace(/'/g, "''")}'`);
      if (options !== undefined) {
        const serialized = options ? JSON.stringify(options).replace(/'/g, "''") : null;
        setClauses.push(`options = ${serialized ? `'${serialized}'` : 'null'}`);
      }
      if (is_required !== undefined) setClauses.push(`is_required = ${!!is_required}`);
      if (display_order !== undefined) setClauses.push(`display_order = ${Number(display_order)}`);

      if (setClauses.length === 0) {
        return { success: false, error: 'No fields to update' };
      }

      setClauses.push('updated_at = now()');

      await db.execute(sql.raw(`
        UPDATE project_custom_fields 
        SET ${setClauses.join(', ')} 
        WHERE id = '${fieldId}'
      `));

      const updated = await db.execute(sql`
        SELECT * FROM project_custom_fields WHERE id = ${fieldId}
      `);

      return { success: true, data: updated.rows?.[0] };
    } catch (error) {
      console.error('[ProjectFieldsController] Error updating field:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Delete a custom field
   * Note: Cannot delete template fields
   */
  async deleteField(fieldId) {
    try {
      const fieldResult = await db.execute(sql`
        SELECT * FROM project_custom_fields WHERE id = ${fieldId}
      `);

      if (!fieldResult.rows || fieldResult.rows.length === 0) {
        return { success: false, error: 'Field not found' };
      }

      const currentField = fieldResult.rows[0];

      if (currentField.is_from_template) {
        return { success: false, error: 'Cannot delete fields inherited from templates' };
      }

      await db.execute(sql`
        DELETE FROM project_custom_fields WHERE id = ${fieldId}
      `);

      return { success: true, message: 'Field deleted successfully' };
    } catch (error) {
      console.error('[ProjectFieldsController] Error deleting field:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Reorder fields by display_order
   */
  async reorderFields(projectId, fieldOrder) {
    try {
      for (const item of fieldOrder) {
        await db.execute(sql`
          UPDATE project_custom_fields 
          SET display_order = ${item.display_order}, updated_at = now()
          WHERE id = ${item.id} AND project_id = ${projectId}
        `);
      }

      return { success: true, message: 'Fields reordered successfully' };
    } catch (error) {
      console.error('[ProjectFieldsController] Error reordering fields:', error);
      return { success: false, error: error.message };
    }
  }
};