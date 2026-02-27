// src/modules/departments/departmentInstaller.js
import { db } from '../../db/index.js';
import { eq } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { departments } from '../../db/schema/core.js';

import { assertDepartmentKey, departmentRegistry } from './departmentRegistry.js';
import { ensureUserDepartmentInstalled } from './departmentService.js';

import { DEPARTMENT_FIELD_SEEDS, VALID_FIELD_TYPES, normalizeDepartmentKey } from './departmentFieldSeeds.js';

// installers de agentes já existentes
import { NeoInstaller } from '../../api/agents/neo/installer.js';
import { runFlorInstaller } from '../../api/agents/flor/florInstaller.js';

import { v4 as uuid } from 'uuid';

async function ensureDepartmentExists(departmentKey) {
  const [existing] = await db.select().from(departments).where(eq(departments.key, departmentKey)).limit(1);
  if (existing) return existing;

  // fallback (caso seed/migration não tenha rodado)
  const def = departmentRegistry[departmentKey];
  if (!def) throw new Error(`Sem registry para departmentKey=${departmentKey}`);

  await db.insert(departments).values({
    key: def.key,
    name: def.name,
    description: def.description,
    realmId: 'professional',
    config: {}
  });

  const [created] = await db.select().from(departments).where(eq(departments.key, departmentKey)).limit(1);
  return created || null;
}

async function ensureAgentsForDepartment(userId, deptDef) {
  for (const agentKey of deptDef.agents || []) {
    if (agentKey === 'neo_dev') await NeoInstaller.install(userId);
    if (agentKey === 'flor') await runFlorInstaller(userId);
    // core/ash: sem installer por enquanto (catálogo já resolve)
  }
}

async function getLatestTemplateId(departmentKey) {
  const deptKey = normalizeDepartmentKey(departmentKey);

  const result = await db.execute(sql`
    SELECT id
    FROM public.department_templates
    WHERE department_key = ${deptKey}
    ORDER BY version DESC
    LIMIT 1
  `);

  return result?.rows?.[0]?.id || null;
}

async function getTemplateFields(templateId) {
  const result = await db.execute(sql`
    SELECT name, slug, type, options, is_required, display_order
    FROM public.department_template_fields
    WHERE template_id = ${templateId}
    ORDER BY display_order ASC
  `);

  return result?.rows || [];
}

async function seedProjectFieldsFromRows(projectId, rows, note = '') {
  if (!projectId) return { created: 0, skipped: 0, note: 'no projectId' };
  if (!rows?.length) return { created: 0, skipped: 0, note: note || 'no rows' };

  let created = 0;
  let skipped = 0;

  for (const f of rows) {
    if (!f?.name || !f?.slug || !f?.type) { skipped++; continue; }
    if (!VALID_FIELD_TYPES.includes(f.type)) { skipped++; continue; }

    const existing = await db.execute(sql`
      SELECT id
      FROM public.project_custom_fields
      WHERE project_id = ${projectId} AND slug = ${f.slug}
      LIMIT 1
    `);

    if (existing?.rows?.length) { skipped++; continue; }

    const id = uuid();

    await db.execute(sql`
      INSERT INTO public.project_custom_fields
        (id, project_id, name, slug, type, options, is_required, display_order, is_from_template, created_at, updated_at)
      VALUES
        (
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

  return { created, skipped, note: note || 'seeded' };
}

async function seedProjectFields(projectId, departmentKey) {
  const deptKey = normalizeDepartmentKey(departmentKey);

  // 1) Preferência: template no DB
  try {
    const templateId = await getLatestTemplateId(deptKey);
    if (templateId) {
      const templateFields = await getTemplateFields(templateId);
      if (templateFields.length) {
        const r = await seedProjectFieldsFromRows(
          projectId,
          templateFields,
          `seeded ${deptKey} from template:${templateId}`
        );
        return { ...r, source: 'template', templateId };
      }
    }
  } catch (e) {
    console.warn('[DepartmentInstaller] Template seed falhou, usando fallback:', e?.message || e);
  }

  // 2) Fallback: hardcoded (enquanto migra)
  const fallback = DEPARTMENT_FIELD_SEEDS[deptKey] || [];
  const r2 = await seedProjectFieldsFromRows(projectId, fallback, `seeded ${deptKey} from fallback`);
  return { ...r2, source: 'fallback', templateId: null };
}

export async function installDepartment(userId, departmentKey, config = {}) {
  if (!userId) throw new Error('userId is required');

  const deptDef = assertDepartmentKey(departmentKey);

  const deptRow = await ensureDepartmentExists(departmentKey);
  if (!deptRow?.id) throw new Error(`Falha ao garantir department=${departmentKey} no catálogo`);

  const installed = await ensureUserDepartmentInstalled(userId, deptRow.id, config);

  await ensureAgentsForDepartment(userId, deptDef);

  // ✅ Se veio projectId no config, semeia fields do dept (template-first)
  const projectId = config?.projectId;
  let fieldSeed = null;

  try {
    if (projectId) fieldSeed = await seedProjectFields(projectId, departmentKey);
  } catch (e) {
    console.warn('[DepartmentInstaller] seedProjectFields falhou:', e?.message || e);
  }

  return {
    success: true,
    departmentKey,
    departmentId: deptRow.id,
    installStatus: installed.status,
    fieldSeed
  };
}

export default { installDepartment };