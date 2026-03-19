// server/nerva/engine/routineRunner.js
// v3: approved PLAN -> creates/updates Routine + Operators, then ticks routines and runs operators.

import * as dbMod from "../../../src/db/index.js";
import * as schema from "../../../src/db/schema.js";
import { eq, and, isNull, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

function getDb() {
  return dbMod.db ?? dbMod.default;
}

async function insertLog(
  db,
  { level = "INFO", area = "Operação", channel = "System", code, msg, ctx = "", routineId = null, operatorId = null }
) {
  await db.insert(schema.nervaLogs).values({
    ts: new Date(),
    level,
    area,
    channel,
    code,
    msg,
    ctx,
    routineId,
    operatorId
  });
}

function normalizeCadence(cadence) {
  const c = String(cadence || "").toLowerCase();
  if (!c) return { everyMs: 15 * 60 * 1000, label: "A cada 15 min" };

  // super simples por enquanto (sem cron)
  if (c.includes("1h") || c.includes("1 h") || c.includes("hora")) return { everyMs: 60 * 60 * 1000, label: cadence };
  if (c.includes("30")) return { everyMs: 30 * 60 * 1000, label: cadence };
  if (c.includes("di") || c.includes("day") || c.includes("24")) return { everyMs: 24 * 60 * 60 * 1000, label: cadence };

  return { everyMs: 15 * 60 * 1000, label: cadence };
}

function planToOperators(plan) {
  const steps = Array.isArray(plan?.steps) ? plan.steps : [];
  return steps.map((s, idx) => ({
    name: s.title || `Step ${idx + 1}`,
    code: s.code || "ACTION.STEP",
    details: s.details || "",
    kind: "action",
    config: {
      code: s.code || "ACTION.STEP",
      details: s.details || ""
    }
  }));
}

/**
 * Upsert-like routine:
 * - if approval.routineId exists -> update it
 * - else try find routine with same name (plan.title)
 * - else create new
 */
async function materializePlan(db, approval) {
  const { nervaRoutines, nervaOperators, nervaApprovals } = schema;

  const plan = approval.payload || {};
  const area = plan.area || "Operação";
  const channel = plan.channel || "System";
  const autonomy = plan.autonomy || "Aprovação";
  const cadence = normalizeCadence(plan.cadence);

  const routineName = approval.title || plan.title || "Rotina";
  const routineGoal = plan.intention || approval.summary || "Executar automação";

  // 1) resolve routine
  let routine = null;

  if (approval.routineId) {
    const [r] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.id, approval.routineId)).limit(1);
    routine = r || null;
  }

  if (!routine) {
    const [r] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.name, routineName)).limit(1);
    routine = r || null;
  }

  if (!routine) {
    const [created] = await db
      .insert(nervaRoutines)
      .values({
        // se sua tabela usa uuid defaultRandom, não precisa passar id
        name: routineName,
        goal: routineGoal,
        area,
        status: "active",
        operators: [],
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    routine = created;

    await insertLog(db, {
      level: "INFO",
      area,
      channel: "System",
      code: "ROUTINE.MATERIALIZED",
      msg: `Rotina criada a partir do plano: ${routineName}`,
      ctx: cadence.label,
      routineId: routine.id,
      operatorId: null
    });
  } else {
    await db
      .update(nervaRoutines)
      .set({
        goal: routineGoal,
        area,
        status: "active",
        updatedAt: new Date()
      })
      .where(eq(nervaRoutines.id, routine.id));

    await insertLog(db, {
      level: "INFO",
      area,
      channel: "System",
      code: "ROUTINE.MATERIALIZED",
      msg: `Rotina atualizada a partir do plano: ${routineName}`,
      ctx: cadence.label,
      routineId: routine.id,
      operatorId: null
    });
  }

  // 2) create operators for steps (minimal: recreate each time for now)
  const ops = planToOperators(plan);

  const createdOperators = [];
  for (const op of ops) {
    const [createdOp] = await db
      .insert(nervaOperators)
      .values({
        name: op.name,
        desc: op.details,
        area,
        channel,
        verb: "Agir",
        autonomy,
        routineId: routine.id,
        // depends on your schema: if you have config json, keep it there
        config: op.config ?? {},
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();

    createdOperators.push(createdOp);

    await insertLog(db, {
      level: "INFO",
      area,
      channel: "System",
      code: "OPERATOR.CREATED",
      msg: `Operador criado: ${createdOp.name}`,
      ctx: op.code,
      routineId: routine.id,
      operatorId: createdOp.id
    });
  }

  // 3) link operator ids inside routine.operators if your column exists as json/array
  try {
    const ids = createdOperators.map((o) => o.id);
    await db
      .update(nervaRoutines)
      .set({ operators: ids, updatedAt: new Date() })
      .where(eq(nervaRoutines.id, routine.id));
  } catch {
    // if your routine table doesn't have operators column or type mismatch, ignore.
  }

  // 4) mark approval handled (the caller will set handledAt; here we just ensure routineId is set)
  await db
    .update(nervaApprovals)
    .set({ routineId: routine.id })
    .where(eq(nervaApprovals.id, approval.id));

  return { routineId: routine.id, operatorIds: createdOperators.map((o) => o.id) };
}

async function runOperatorsForRoutine(db, routine) {
  const { nervaOperators, nervaApprovals } = schema;

  // gate: any pending approvals for routine blocks
  const pending = await db
    .select({ id: nervaApprovals.id })
    .from(nervaApprovals)
    .where(and(eq(nervaApprovals.status, "pending"), eq(nervaApprovals.routineId, routine.id)))
    .limit(1);

  if (pending.length > 0) {
    await insertLog(db, {
      level: "ALERT",
      area: routine.area,
      channel: "System",
      code: "ROUTINE.BLOCKED",
      msg: `Rotina bloqueada aguardando aprovação`,
      ctx: routine.name,
      routineId: routine.id,
      operatorId: null
    });
    return { blocked: true, ran: 0 };
  }

  // load operators
  const ops = await db.select().from(nervaOperators).where(eq(nervaOperators.routineId, routine.id));

  let ran = 0;
  for (const op of ops) {
    ran += 1;

    await insertLog(db, {
      level: "INFO",
      area: op.area || routine.area,
      channel: op.channel || "System",
      code: "OPERATOR.RUN.START",
      msg: `Rodando: ${op.name}`,
      ctx: op.desc || "",
      routineId: routine.id,
      operatorId: op.id
    });

    // Simulação realista: aqui depois entra “connector layer”
    await insertLog(db, {
      level: "INFO",
      area: op.area || routine.area,
      channel: op.channel || "System",
      code: "OPERATOR.RUN.DONE",
      msg: `Concluído: ${op.name}`,
      ctx: "",
      routineId: routine.id,
      operatorId: op.id
    });
  }

  return { blocked: false, ran };
}

export async function runNervaEngine() {
  const db = getDb();
  if (!db) throw new Error("[NERVA] DB export not found (src/db/index.js).");

  const { nervaRoutines, nervaApprovals } = schema;

  // 1) consume decided approvals (idempotent)
  const approved = await db
    .select()
    .from(nervaApprovals)
    .where(and(isNull(nervaApprovals.handledAt), eq(nervaApprovals.status, "approved")))
    .orderBy(desc(nervaApprovals.decidedAt))
    .limit(50);

  const rejected = await db
    .select()
    .from(nervaApprovals)
    .where(and(isNull(nervaApprovals.handledAt), eq(nervaApprovals.status, "rejected")))
    .orderBy(desc(nervaApprovals.decidedAt))
    .limit(50);

  for (const a of approved) {
    if (a.kind === "plan") {
      await insertLog(db, {
        level: "INFO",
        area: (a.payload?.area) || "Operação",
        channel: "System",
        code: "PLAN.APPROVED",
        msg: `Plano aprovado: ${a.title}`,
        ctx: a.summary || "",
        routineId: a.routineId ?? null,
        operatorId: a.operatorId ?? null
      });

      await materializePlan(db, a);
    } else {
      await insertLog(db, {
        level: "INFO",
        area: "Operação",
        channel: "System",
        code: "APPROVAL.EXECUTED",
        msg: `Executado após aprovação: ${a.title}`,
        ctx: a.summary || "",
        routineId: a.routineId ?? null,
        operatorId: a.operatorId ?? null
      });
    }

    await db.update(nervaApprovals).set({ handledAt: new Date() }).where(eq(nervaApprovals.id, a.id));
  }

  for (const a of rejected) {
    await insertLog(db, {
      level: "WARN",
      area: "Operação",
      channel: "System",
      code: "APPROVAL.SKIPPED",
      msg: `Recusado: ${a.title}`,
      ctx: a.summary || "",
      routineId: a.routineId ?? null,
      operatorId: a.operatorId ?? null
    });

    await db.update(nervaApprovals).set({ handledAt: new Date() }).where(eq(nervaApprovals.id, a.id));
  }

  // 2) tick active routines (run operators)
  const routines = await db.select().from(nervaRoutines).where(eq(nervaRoutines.status, "active"));

  let ranRoutines = 0;
  let blockedRoutines = 0;
  let ranOps = 0;

  for (const r of routines) {
    ranRoutines += 1;

    await insertLog(db, {
      level: "INFO",
      area: r.area,
      channel: "System",
      code: "ROUTINE.TICK",
      msg: `Routine tick: ${r.name}`,
      ctx: r.goal,
      routineId: r.id,
      operatorId: null
    });

    const out = await runOperatorsForRoutine(db, r);
    if (out.blocked) blockedRoutines += 1;
    ranOps += out.ran;
  }

  return {
    ok: true,
    routines: routines.length,
    ranRoutines,
    blockedRoutines,
    ranOps,
    approvalsApproved: approved.length,
    approvalsRejected: rejected.length
  };
}