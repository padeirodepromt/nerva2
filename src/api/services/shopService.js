/* src/api/services/shopService.js
   desc: Shop Service V1 (Lego Install)
   rule: "Hire" installs workspace capability (user_systems + agents)
         and pre-installs project toggles (project_systems=disabled) for all projects (pais e filhos).
   note: Billing is per-project when enabled.
*/

import { db } from '../../db/index.js';
import { and, eq } from 'drizzle-orm';

import { projects } from '../../db/schema/core.js';
import { agents, userAgents } from '../../db/schema/agents.js';
import { userSystems, projectSystems } from '../../db/schema/system.js';

import { AgentRegistryService } from './agentRegistryService.js';
import WidgetRegistryService from './widgetRegistryService.js';

function assertProduct(productKey) {
  const product = WidgetRegistryService.getProduct(productKey);
  if (!product) throw new Error(`Produto inválido: ${productKey}`);
  return product;
}

async function ensureUserSystem(userId, systemKey) {
  const [existing] = await db
    .select()
    .from(userSystems)
    .where(and(eq(userSystems.userId, userId), eq(userSystems.systemKey, systemKey)))
    .limit(1);

  if (existing) return existing;

  await db.insert(userSystems).values({
    userId,
    systemKey,
    status: 'installed',
    config: {}
  });

  const [created] = await db
    .select()
    .from(userSystems)
    .where(and(eq(userSystems.userId, userId), eq(userSystems.systemKey, systemKey)))
    .limit(1);

  return created || null;
}

async function ensureProjectSystemDisabled(userId, projectId, systemKey, monthlyPriceCents = 2000) {
  const [existing] = await db
    .select()
    .from(projectSystems)
    .where(and(
      eq(projectSystems.userId, userId),
      eq(projectSystems.projectId, projectId),
      eq(projectSystems.systemKey, systemKey)
    ))
    .limit(1);

  if (existing) return existing;

  // "apagado" até habilitar: status disabled
  await db.insert(projectSystems).values({
    userId,
    projectId,
    systemKey,
    status: 'disabled',
    enabledAt: new Date(), // schema exige notNull; não significa "billing start"
    monthlyPriceCents,
    flags: { installedByShop: true }
  });

  const [created] = await db
    .select()
    .from(projectSystems)
    .where(and(
      eq(projectSystems.userId, userId),
      eq(projectSystems.projectId, projectId),
      eq(projectSystems.systemKey, systemKey)
    ))
    .limit(1);

  return created || null;
}

async function listUserProjects(userId) {
  // Instala em todos os projetos do usuário (pais e filhos) via ownerId.
  return db
    .select({ id: projects.id, parentId: projects.parentId, title: projects.title })
    .from(projects)
    .where(eq(projects.ownerId, userId));
}

export const ShopService = {
  async getCatalog(userId) {
    const products = WidgetRegistryService.listProducts();

    // Systems installed
    const installedSystems = await db
      .select({ systemKey: userSystems.systemKey, status: userSystems.status })
      .from(userSystems)
      .where(eq(userSystems.userId, userId));

    const installedSet = new Set(installedSystems.map(s => s.systemKey));

    // Agents hired
    const hired = await db
      .select({ key: agents.key })
      .from(userAgents)
      .innerJoin(agents, eq(userAgents.agentId, agents.id))
      .where(and(eq(userAgents.userId, userId), eq(userAgents.isActive, true)));
    const hiredSet = new Set(hired.map(a => a.key));

    const decorated = products.map(p => {
      const neededSystems = p.installs?.userSystems || [];
      const neededAgents = p.installs?.agents || [];

      const installed = neededSystems.every(k => installedSet.has(k)) &&
        neededAgents.every(k => hiredSet.has(k));

      return {
        ...p,
        status: {
          installed,
          installedSystems: neededSystems.filter(k => installedSet.has(k)),
          installedAgents: neededAgents.filter(k => hiredSet.has(k)),
        }
      };
    });

    return { products: decorated };
  },

  async hireProduct(userId, productKey) {
    const product = assertProduct(productKey);

    // 1) ensure systems installed (workspace)
    for (const systemKey of (product.installs?.userSystems || [])) {
      await ensureUserSystem(userId, systemKey);
    }

    // 2) hire agents
    for (const agentKey of (product.installs?.agents || [])) {
      await AgentRegistryService.hireAgent(userId, agentKey);
    }

    // 3) pre-install project toggles as disabled (pais e filhos)
    const allProjects = await listUserProjects(userId);
    for (const project of allProjects) {
      for (const systemKey of (product.installs?.userSystems || [])) {
        const widget = (product.installs?.widgets || [])
          .map(wk => WidgetRegistryService.getWidget(wk))
          .find(w => w?.requires?.projectSystemKey === systemKey);

        const monthlyPriceCents = widget?.billing?.monthlyPriceCents ?? 2000;
        await ensureProjectSystemDisabled(userId, project.id, systemKey, monthlyPriceCents);
      }
    }

    return { ok: true, productKey };
  },

  async unhireProduct(userId, productKey) {
    const product = assertProduct(productKey);

    // Soft-uninstall: pause user_systems + deactivate agents.
    // We do NOT delete project data (DNA, history). We only hide/disable UI.
    for (const agentKey of (product.installs?.agents || [])) {
      await AgentRegistryService.unhireAgent(userId, agentKey);
    }

    for (const systemKey of (product.installs?.userSystems || [])) {
      await db
        .update(userSystems)
        .set({ status: 'paused', updatedAt: new Date() })
        .where(and(eq(userSystems.userId, userId), eq(userSystems.systemKey, systemKey)));
    }

    return { ok: true, productKey };
  },

  async getWidgetsForProject(userId, projectId) {
    // Installed in workspace?
    const installedSystems = await db
      .select({ systemKey: userSystems.systemKey, status: userSystems.status })
      .from(userSystems)
      .where(eq(userSystems.userId, userId));

    const installedSet = new Map(installedSystems.map(s => [s.systemKey, s.status]));

    // Enabled in project?
    const projectRows = await db
      .select({ systemKey: projectSystems.systemKey, status: projectSystems.status })
      .from(projectSystems)
      .where(and(eq(projectSystems.userId, userId), eq(projectSystems.projectId, projectId)));
    const projectMap = new Map(projectRows.map(r => [r.systemKey, r.status]));

    // Agents hired?
    const hired = await db
      .select({ key: agents.key })
      .from(userAgents)
      .innerJoin(agents, eq(userAgents.agentId, agents.id))
      .where(and(eq(userAgents.userId, userId), eq(userAgents.isActive, true)));
    const hiredSet = new Set(hired.map(a => a.key));

    const widgets = WidgetRegistryService.listWidgets().map(w => {
      const userSystemKey = w.requires?.userSystemKey;
      const projectSystemKey = w.requires?.projectSystemKey;
      const agentKey = w.requires?.agentKey;

      const installed = userSystemKey ? installedSet.get(userSystemKey) === 'installed' : true;
      const enabled = projectSystemKey ? projectMap.get(projectSystemKey) === 'enabled' : true;
      const agentReady = agentKey ? hiredSet.has(agentKey) : true;

      return {
        ...w,
        state: {
          installed,
          enabled,
          agentReady,
          // derived
          visible: installed && agentReady,
          locked: !installed || !agentReady,
          dimmed: installed && agentReady && !enabled,
        }
      };
    });

    return { projectId, widgets };
  }
};

export default ShopService;