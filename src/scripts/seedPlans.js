import { db } from '../db/index.js';
import * as schemaCore from '../db/schema/core.js';
import { PLANS } from '../config/plansConfig.js';

export const seedPlans = async () => {
  const existing = await db.select().from(schemaCore.plans).limit(1);
  if (existing.length > 0) return;
  for (const key of Object.keys(PLANS)) {
    const p = PLANS[key];
    await db.insert(schemaCore.plans).values({
      key: key,
      name: p.name,
      subtitle: p.subtitle,
      description: p.description,
      monthlyPrice: p.price?.monthly || 0,
      yearlyPrice: p.price?.yearly || 0,
      isOneTime: !!p.isOneTime,
      limits: p.limits || {},
      features: p.features || [],
      identity: p.identity || {},
      cta: p.cta || 'Selecionar'
    });
  }
};
