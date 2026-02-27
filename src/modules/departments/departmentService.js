// src/modules/departments/departmentService.js
import { db } from '../../db/index.js';
import { and, eq } from 'drizzle-orm';
import { departments, userDepartments } from '../../db/schema/core.js';

export async function getDepartmentByKey(departmentKey) {
  const [row] = await db.select().from(departments).where(eq(departments.key, departmentKey)).limit(1);
  return row || null;
}

export async function getUserDepartment(userId, departmentId) {
  const [row] = await db
    .select()
    .from(userDepartments)
    .where(and(eq(userDepartments.userId, userId), eq(userDepartments.departmentId, departmentId)))
    .limit(1);

  return row || null;
}

export async function ensureUserDepartmentInstalled(userId, departmentId, config = {}) {
  const existing = await getUserDepartment(userId, departmentId);

  if (existing) {
    // reativa se necessário
    if (existing.status !== 'installed') {
      await db
        .update(userDepartments)
        .set({ status: 'installed', config: existing.config || config, updatedAt: new Date() })
        .where(eq(userDepartments.id, existing.id));
    }
    return { status: 'existing', row: existing };
  }

  await db.insert(userDepartments).values({
    userId,
    departmentId,
    status: 'installed',
    config
  });

  const created = await getUserDepartment(userId, departmentId);
  return { status: 'created', row: created };
}