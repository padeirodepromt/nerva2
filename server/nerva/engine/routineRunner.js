// server/nerva/engine/routineRunner.js
// v4: consume approvals, materialize plans into routines/operators compatible with the current schema,
// then tick active routines and simulate execution with logs.
import * as dbMod from "../../../src/db/index.js";
import * as schema from "../../../src/db/schema.js";
import { eq, and, isNull, desc } from "drizzle-orm";
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
 const value = String(cadence || "").toLowerCase();
 if (!value) return { everyMs: 15 * 60 * 1000, label: "A cada 15 min" };
 if (value.includes("30")) return { everyMs: 30 * 60 * 1000, label: cadence };
 if (value.includes("hora") || value.includes("1h") || value.includes("1 h")) {
 return { everyMs: 60 * 60 * 1000, label: cadence };
 }
 if (value.includes("di") || value.includes("day") || value.includes("24")) {
 return { everyMs: 24 * 60 * 60 * 1000, label: cadence };
 }
 return { everyMs: 15 * 60 * 1000, label: cadence };
}
function inferVerbFromStep(step) {
 const haystack = `${step?.code || ""} ${step?.title || ""} ${step?.details || ""}`.toLowerCase();
 if (haystack.includes("scan") || haystack.includes("varredura") || haystack.includes("monitor")) return "Observar";
 if (haystack.includes("class") || haystack.includes("prior") || haystack.includes("triage")) return "Classificar";
 if (haystack.includes("draft") || haystack.includes("rascunh") || haystack.includes("propor") || haystack.includes("prepar")) {
 return "Criar";
 }
 if (haystack.includes("confirm") || haystack.includes("aprova") || haystack.includes("pedir confirmação")) {
 return "Confirmar";
 }
 if (haystack.includes("log") || haystack.includes("registr")) return "Armazenar";
 return "Ajustar";
}
function planToOperators(plan) {
 const steps = Array.isArray(plan?.steps) ? plan.steps : [];
 return steps.map((step, index) => ({
 name: step.title || `Step ${index + 1}`,
 verb: inferVerbFromStep(step),
 channel: plan.channel || "System",
 autonomy: plan.autonomy || "Aprovação",
 code: step.code || `STEP.${index + 1}`,
 details: step.details || ""
 }));
}
async function materializePlan(db, approval) {
 const { nervaRoutines, nervaOperators, nervaApprovals } = schema;
 const plan = approval.payload || {};
 const area = plan.area || "Operação";
 const channel = plan.channel || "System";
 const cadence = normalizeCadence(plan.cadence);
 const routineName = approval.title || plan.title || "Rotina";
 const routineGoal = plan.intention || approval.summary || "Executar automação";
 let routine = null;
 if (approval.routineId) {
 const [existingById] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.id, approval.routineId)).limit(1);
 routine = existingById || null;
 }
 if (!routine) {
 const [existingByName] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.name, routineName)).limit(1);
 routine = existingByName || null;
 }
 if (!routine) {
 const [created] = await db
 .insert(nervaRoutines)
 .values({
 name: routineName,
 goal: routineGoal,
 area,
 status: "active",
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
 routineId: routine.id
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
 routineId: routine.id
 });
 }
 const existingOperators = await db.select().from(nervaOperators).where(eq(nervaOperators.routineId, routine.id));
 for (const op of existingOperators) {
 await insertLog(db, {
 level: "INFO",
 area,
 channel,
 code: "OPERATOR.REPLACED",
 msg: `Operador substituído: ${op.name}`,
 ctx: op.verb,
 routineId: routine.id,
 operatorId: op.id
 });
 }
 if (existingOperators.length) {
 await db.delete(nervaOperators).where(eq(nervaOperators.routineId, routine.id));
 }
 const ops = planToOperators(plan);
 const createdOperators = [];
 for (const op of ops) {
 const [createdOperator] = await db
 .insert(nervaOperators)
 .values({
 routineId: routine.id,
 name: op.name,
 verb: op.verb,
 channel: op.channel,
 autonomy: op.autonomy,
 createdAt: new Date()
 })
 .returning();
 createdOperators.push(createdOperator);
 await insertLog(db, {
 level: "INFO",
 area,
 channel: op.channel,
 code: "OPERATOR.CREATED",
 msg: `Operador criado: ${createdOperator.name}`,
 ctx: `${op.code}${op.details ? ` | ${op.details}` : ""}`,
 routineId: routine.id,
 operatorId: createdOperator.id
 });
 }
 await db.update(nervaApprovals).set({ routineId: routine.id }).where(eq(nervaApprovals.id, approval.id));
 return {
 routineId: routine.id,
 operatorIds: createdOperators.map((operator) => operator.id)
 };
}
async function runOperatorsForRoutine(db, routine) {
 const { nervaOperators, nervaApprovals } = schema;
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
 msg: "Rotina bloqueada aguardando aprovação.",
 ctx: routine.name,
 routineId: routine.id
 });
 return { blocked: true, ran: 0 };
 }
 const operators = await db.select().from(nervaOperators).where(eq(nervaOperators.routineId, routine.id));
 let ran = 0;
 for (const operator of operators) {
 ran += 1;
 await insertLog(db, {
 level: "INFO",
 area: routine.area,
 channel: operator.channel || "System",
 code: "OPERATOR.RUN.START",
 msg: `Rodando: ${operator.name}`,
 ctx: operator.verb || "Operador",
 routineId: routine.id,
 operatorId: operator.id
 });
 await insertLog(db, {
 level: "INFO",
 area: routine.area,
 channel: operator.channel || "System",
 code: "OPERATOR.RUN.DONE",
 msg: `Concluído: ${operator.name}`,
 ctx: operator.verb || "Operador",
 routineId: routine.id,
 operatorId: operator.id
 });
 }
 return { blocked: false, ran };
}
export async function runNervaEngine() {
 const db = getDb();
 if (!db) throw new Error("[NERVA] DB export not found (src/db/index.js).");
 const { nervaRoutines, nervaApprovals } = schema;
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
 for (const approval of approved) {
 if (approval.kind === "plan") {
 await insertLog(db, {
 level: "INFO",
 area: approval.payload?.area || "Operação",
 channel: "System",
 code: "PLAN.APPROVED",
 msg: `Plano aprovado: ${approval.title}`,
 ctx: approval.summary || "",
 routineId: approval.routineId ?? null,
 operatorId: approval.operatorId ?? null
 });
 await materializePlan(db, approval);
 } else {
 await insertLog(db, {
 level: "INFO",
 area: "Operação",
 channel: "System",
 code: "APPROVAL.EXECUTED",
 msg: `Executado após aprovação: ${approval.title}`,
 ctx: approval.summary || "",
 routineId: approval.routineId ?? null,
 operatorId: approval.operatorId ?? null
 });
 }
 await db.update(nervaApprovals).set({ handledAt: new Date() }).where(eq(nervaApprovals.id, approval.id));
 }
 for (const approval of rejected) {
 await insertLog(db, {
 level: "WARN",
 area: "Operação",
 channel: "System",
 code: "APPROVAL.SKIPPED",
 msg: `Recusado: ${approval.title}`,
 ctx: approval.summary || "",
 routineId: approval.routineId ?? null,
 operatorId: approval.operatorId ?? null
 });
 await db.update(nervaApprovals).set({ handledAt: new Date() }).where(eq(nervaApprovals.id, approval.id));
 }
 const routines = await db.select().from(nervaRoutines).where(eq(nervaRoutines.status, "active"));
 let ranRoutines = 0;
 let blockedRoutines = 0;
 let ranOps = 0;
 for (const routine of routines) {
 ranRoutines += 1;
 await insertLog(db, {
 level: "INFO",
 area: routine.area,
 channel: "System",
 code: "ROUTINE.TICK",
 msg: `Routine tick: ${routine.name}`,
 ctx: routine.goal,
 routineId: routine.id
 });
 const output = await runOperatorsForRoutine(db, routine);
 if (output.blocked) blockedRoutines += 1;
 ranOps += output.ran;
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