// src/api/nerva/nervaRoutes.js
// NERVA API (DB-backed): routines, operators, logs, approvals, intents, connectors catalog.
// Source of truth for platforms/connectors = DB table nerva_connectors_catalog.
import { Router } from "express";
import { z } from "zod";
import { eq, desc, and, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import * as dbMod from "../../db/index.js";
import {
 nervaRoutines,
 nervaOperators,
 nervaLogs,
 nervaApprovals,
 nervaIntents,
 nervaConnectorsCatalog
} from "../../db/schema.js";
import { compileExecutionCard } from "../../core/protocol/ExecutionCardCompiler.js";
import { compilePlan } from "../../core/protocol/PlanCompiler.js";
import { buildQuestionsPolicy } from "../../core/protocol/QuestionsPolicy.js";
const router = Router();
function getDb() {
 return dbMod.db ?? dbMod.default;
}
const db = getDb();
if (!db) {
 throw new Error(
 "[NERVA] DB export not found. Expected src/db/index.js to export { db } or default export."
 );
}
// --- helpers
async function writeLog(values) {
 const [row] = await db
 .insert(nervaLogs)
 .values({
 ts: new Date(),
 level: values.level ?? "INFO",
 area: values.area ?? "Operação",
 channel: values.channel ?? "System",
 code: values.code ?? "NERVA.EVENT",
 msg: values.msg,
 ctx: values.ctx ?? "",
 routineId: values.routineId ?? null,
 operatorId: values.operatorId ?? null
 })
 .returning();
 return row;
}
// --- Connectors Catalog (DB-backed, dynamic)
router.get("/connectors/catalog", async (_req, res) => {
 try {
 const rows = await db
 .select()
 .from(nervaConnectorsCatalog)
 .orderBy(desc(nervaConnectorsCatalog.createdAt))
 .limit(500);
 return res.json({ ok: true, catalog: rows });
 } catch (e) {
 console.error("[NERVA] catalog list error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
// Seed initial catalog (kept minimal; still DB source of truth)
router.post("/connectors/catalog/seed", async (_req, res) => {
 try {
 const existing = await db
 .select({ id: nervaConnectorsCatalog.id })
 .from(nervaConnectorsCatalog)
 .limit(1);
 if (existing.length > 0) return res.json({ ok: true, seeded: false });
 const seed = [
 {
 key: "WhatsApp",
 type: "platform",
 defaultArea: "Vendas",
 synonyms: ["whatsapp", "wa", "wpp", "zap", "zapzap", "whats"],
 needs: ["whatsapp_business_api_or_provider"],
 layers: [
 { layer: "api", stable: true },
 { layer: "sdk" },
 { layer: "ui_automation", fragile: true, optIn: true }
 ],
 risk: "medium",
 notes: "Preferir API oficial ou provedor (Twilio/Z-API etc). UI automation só opt-in.",
 isEnabled: "true"
 },
 {
 key: "Gmail",
 type: "platform",
 defaultArea: "Atendimento",
 synonyms: ["gmail", "email", "e-mail", "inbox", "caixa de entrada"],
 needs: ["google_oauth"],
 layers: [
 { layer: "api", stable: true },
 { layer: "cli" },
 { layer: "ui_automation", fragile: true, optIn: true }
 ],
 risk: "low",
 notes: "OAuth Google. API-first.",
 isEnabled: "true"
 },
 {
 key: "Sheets",
 type: "platform",
 defaultArea: "Operação",
 synonyms: ["sheets", "planilha", "google sheets", "spreadsheet"],
 needs: ["google_oauth"],
 layers: [{ layer: "api", stable: true }],
 risk: "low",
 notes: "API-first.",
 isEnabled: "true"
 },
 {
 key: "CRM",
 type: "platform",
 defaultArea: "Vendas",
 synonyms: ["crm", "pipedrive", "hubspot", "rd station", "salesforce", "pipeline"],
 needs: ["crm_api_key_or_oauth"],
 layers: [
 { layer: "api", stable: true },
 { layer: "ui_automation", fragile: true, optIn: true }
 ],
 risk: "medium",
 notes: "Conector depende do CRM específico.",
 isEnabled: "true"
 },
 {
 key: "Meta Ads",
 type: "platform",
 defaultArea: "Marketing",
 synonyms: ["meta", "facebook ads", "instagram ads", "meta ads", "fb ads", "ads meta"],
 needs: ["meta_oauth"],
 layers: [{ layer: "api", stable: true }],
 risk: "medium",
 notes: "API-first com OAuth.",
 isEnabled: "true"
 },
 {
 key: "Google Ads",
 type: "platform",
 defaultArea: "Marketing",
 synonyms: ["google ads", "adwords", "ads google"],
 needs: ["google_oauth"],
 layers: [{ layer: "api", stable: true }],
 risk: "medium",
 notes: "API-first com OAuth.",
 isEnabled: "true"
 }
 ];
 await db.insert(nervaConnectorsCatalog).values(
 seed.map((s) => ({
 ...s,
 createdAt: new Date(),
 updatedAt: new Date()
 }))
 );
 return res.json({ ok: true, seeded: true });
 } catch (e) {
 console.error("[NERVA] catalog seed error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
async function getEnabledCatalog() {
 const rows = await db.select().from(nervaConnectorsCatalog).limit(500);
 return rows.filter((r) => String(r.isEnabled) !== "false");
}
function inferPlatformFromCatalog(prompt, catalog) {
 const t = String(prompt || "").toLowerCase();
 let best = { key: "unknown", score: 0 };
 for (const item of catalog) {
 const syns = Array.isArray(item.synonyms) ? item.synonyms : [];
 let score = 0;
 for (const s of syns) {
 const ss = String(s || "").toLowerCase().trim();
 if (!ss) continue;
 if (t.includes(ss)) score += Math.min(3, Math.max(1, Math.floor(ss.length / 3)));
 }
 if (score > best.score) best = { key: item.key, score };
 }
 if (best.score <= 0) return { key: "unknown", confidence: 0.25 };
 const confidence = Math.min(0.9, 0.45 + best.score * 0.08);
 return { key: best.key, confidence };
}
// --- ROUTINES / OPERATORS
const CreateRoutineSchema = z.object({
 name: z.string().min(2).max(120),
 goal: z.string().min(3).max(280),
 area: z.string().min(1).max(60).optional().default("Operação"),
 status: z.enum(["draft", "active", "paused"]).optional().default("draft")
});
router.post("/routines", async (req, res) => {
 const parsed = CreateRoutineSchema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const [routine] = await db
 .insert(nervaRoutines)
 .values({
 name: parsed.data.name,
 goal: parsed.data.goal,
 area: parsed.data.area,
 status: parsed.data.status,
 createdAt: new Date(),
 updatedAt: new Date()
 })
 .returning();
 await writeLog({
 level: "INFO",
 area: routine.area,
 channel: "System",
 code: "ROUTINE.CREATE",
 msg: `Rotina criada: ${routine.name}`,
 ctx: routine.goal,
 routineId: routine.id
 });
 return res.json({ ok: true, routine });
 } catch (e) {
 console.error("[NERVA] create routine error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.get("/routines", async (_req, res) => {
 try {
 const routines = await db.select().from(nervaRoutines).orderBy(desc(nervaRoutines.createdAt));
 const ops = await db.select().from(nervaOperators);
 const byRoutine = new Map();
 for (const op of ops) {
 const arr = byRoutine.get(op.routineId) ?? [];
 arr.push(op);
 byRoutine.set(op.routineId, arr);
 }
 const enriched = routines.map((r) => ({ ...r, operators: byRoutine.get(r.id) ?? [] }));
 return res.json({ ok: true, routines: enriched });
 } catch (e) {
 console.error("[NERVA] list routines error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.get("/routines/:id", async (req, res) => {
 const id = req.params.id;
 try {
 const [routine] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.id, id)).limit(1);
 if (!routine) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
 const operators = await db.select().from(nervaOperators).where(eq(nervaOperators.routineId, id));
 return res.json({ ok: true, routine: { ...routine, operators } });
 } catch (e) {
 console.error("[NERVA] get routine error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
const AddOperatorSchema = z.object({
 name: z.string().min(2).max(120),
 verb: z.string().min(2).max(40),
 channel: z.string().min(1).max(80).optional().default("System"),
 autonomy: z.enum(["Sugestões", "Aprovação"]).optional().default("Aprovação")
});
router.post("/routines/:id/operators", async (req, res) => {
 const routineId = req.params.id;
 const parsed = AddOperatorSchema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const [routine] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.id, routineId)).limit(1);
 if (!routine) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
 const [operator] = await db
 .insert(nervaOperators)
 .values({
 routineId,
 name: parsed.data.name,
 verb: parsed.data.verb,
 channel: parsed.data.channel,
 autonomy: parsed.data.autonomy,
 createdAt: new Date()
 })
 .returning();
 await db.update(nervaRoutines).set({ updatedAt: new Date() }).where(eq(nervaRoutines.id, routineId));
 await writeLog({
 level: "INFO",
 area: routine.area,
 channel: operator.channel,
 code: "OPERATOR.ADD",
 msg: `Operador adicionado: ${operator.name} (${operator.verb})`,
 ctx: `Autonomia: ${operator.autonomy}`,
 routineId,
 operatorId: operator.id
 });
 return res.json({ ok: true, operator });
 } catch (e) {
 console.error("[NERVA] add operator error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
// simulated run (still helpful)
router.post("/routines/:id/run", async (req, res) => {
 const routineId = req.params.id;
 try {
 const [routine] = await db.select().from(nervaRoutines).where(eq(nervaRoutines.id, routineId)).limit(1);
 if (!routine) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
 const operators = await db.select().from(nervaOperators).where(eq(nervaOperators.routineId, routineId));
 const runId = randomUUID();
 await writeLog({
 level: "INFO",
 area: routine.area,
 channel: "System",
 code: "ROUTINE.RUN.START",
 msg: `Run iniciado (${runId})`,
 ctx: routine.name,
 routineId
 });
 for (const op of operators) {
 await writeLog({
 level: "INFO",
 area: routine.area,
 channel: op.channel,
 code: "OPERATOR.RUN",
 msg: `Executando: ${op.name}`,
 ctx: `Verbo: ${op.verb}`,
 routineId,
 operatorId: op.id
 });
 if (op.autonomy === "Aprovação") {
 await writeLog({
 level: "ALERT",
 area: routine.area,
 channel: op.channel,
 code: "APPROVAL.REQUIRED",
 msg: `Aprovação necessária para continuar (${op.name})`,
 ctx: "Fluxo pausado (aprovações via /approvals)",
 routineId,
 operatorId: op.id
 });
 break;
 }
 }
 await writeLog({
 level: "INFO",
 area: routine.area,
 channel: "System",
 code: "ROUTINE.RUN.END",
 msg: `Run finalizado (${runId})`,
 ctx: "simulado",
 routineId
 });
 return res.json({ ok: true, runId });
 } catch (e) {
 console.error("[NERVA] run routine error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
// --- LOGS
router.get("/logs", async (req, res) => {
 const { area, channel, level, routineId, operatorId, limit } = req.query;
 try {
 const lim = Math.min(Number(limit || 200), 1000);
 const where = [];
 if (area) where.push(eq(nervaLogs.area, String(area)));
 if (channel) where.push(eq(nervaLogs.channel, String(channel)));
 if (level) where.push(eq(nervaLogs.level, String(level)));
 if (routineId) where.push(eq(nervaLogs.routineId, String(routineId)));
 if (operatorId) where.push(eq(nervaLogs.operatorId, String(operatorId)));
 const logs =
 where.length > 0
 ? await db
 .select()
 .from(nervaLogs)
 .where(and(...where))
 .orderBy(desc(nervaLogs.ts))
 .limit(lim)
 : await db.select().from(nervaLogs).orderBy(desc(nervaLogs.ts)).limit(lim);
 return res.json({ ok: true, logs });
 } catch (e) {
 console.error("[NERVA] list logs error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.post("/logs", async (req, res) => {
 const Schema = z.object({
 level: z.enum(["INFO", "WARN", "ALERT", "CRIT"]).optional().default("INFO"),
 area: z.string().min(1).max(60).optional().default("Operação"),
 channel: z.string().min(1).max(80).optional().default("System"),
 code: z.string().min(1).max(80).optional().default("NERVA.EVENT"),
 msg: z.string().min(1).max(280),
 ctx: z.string().max(280).optional().default(""),
 routineId: z.string().uuid().optional(),
 operatorId: z.string().uuid().optional()
 });
 const parsed = Schema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const log = await writeLog(parsed.data);
 return res.json({ ok: true, log });
 } catch (e) {
 console.error("[NERVA] create log error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
// --- APPROVALS (payload-enabled)
router.get("/approvals", async (req, res) => {
 const { status = "pending", limit } = req.query;
 try {
 const lim = Math.min(Number(limit || 100), 500);
 const rows = await db
 .select()
 .from(nervaApprovals)
 .where(eq(nervaApprovals.status, String(status)))
 .orderBy(desc(nervaApprovals.createdAt))
 .limit(lim);
 return res.json({ ok: true, approvals: rows });
 } catch (e) {
 console.error("[NERVA] list approvals error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.post("/approvals", async (req, res) => {
 const Schema = z.object({
 kind: z.string().min(2).max(40).optional().default("action"),
 logId: z.string().uuid().optional(),
 routineId: z.string().uuid().optional().nullable(),
 operatorId: z.string().uuid().optional().nullable(),
 title: z.string().min(2).max(140),
 summary: z.string().max(280).optional().default(""),
 payload: z.any().optional().default({})
 });
 const parsed = Schema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const [approval] = await db
 .insert(nervaApprovals)
 .values({
 status: "pending",
 kind: parsed.data.kind,
 logId: parsed.data.logId ?? null,
 routineId: parsed.data.routineId ?? null,
 operatorId: parsed.data.operatorId ?? null,
 title: parsed.data.title,
 summary: parsed.data.summary,
 payload: parsed.data.payload ?? {},
 createdAt: new Date()
 })
 .returning();
 await writeLog({
 level: "ALERT",
 area: "Operação",
 channel: "System",
 code: "APPROVAL.CREATED",
 msg: approval.title,
 ctx: approval.summary,
 routineId: approval.routineId ?? null,
 operatorId: approval.operatorId ?? null
 });
 await writeLog({
 level: "INFO",
 area: "Operação",
 channel: "System",
 code: "PLAN.SUBMITTED",
 msg: `Plano submetido para aprovação: ${approval.title}`,
 ctx: approval.summary,
 routineId: approval.routineId ?? null,
 operatorId: approval.operatorId ?? null
 });
 return res.json({ ok: true, approval });
 } catch (e) {
 console.error("[NERVA] create approval error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.post("/approvals/:id/decide", async (req, res) => {
 const Schema = z.object({
 decision: z.enum(["approved", "rejected"])
 });
 const parsed = Schema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const [row] = await db.select().from(nervaApprovals).where(eq(nervaApprovals.id, req.params.id)).limit(1);
 if (!row) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
 const [updated] = await db
 .update(nervaApprovals)
 .set({ status: parsed.data.decision, decidedAt: new Date() })
 .where(eq(nervaApprovals.id, req.params.id))
 .returning();
 await writeLog({
 level: parsed.data.decision === "approved" ? "INFO" : "WARN",
 area: "Operação",
 channel: "System",
 code: "APPROVAL.DECIDED",
 msg: `${updated.status.toUpperCase()}: ${updated.title}`,
 ctx: "",
 routineId: updated.routineId ?? null,
 operatorId: updated.operatorId ?? null
 });
 return res.json({ ok: true, approval: updated });
 } catch (e) {
 console.error("[NERVA] decide approval error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
// --- INTENTS (creation pipeline)
const CreateIntentSchema = z.object({
 mode: z.enum(["panel", "prompt_short", "prompt_detailed", "suggestions"]).default("prompt_short"),
 prompt: z.string().min(2).max(600),
 platform: z.string().optional(),
 area: z.string().optional()
});
router.post("/intents", async (req, res) => {
 const parsed = CreateIntentSchema.safeParse(req.body);
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const catalog = await getEnabledCatalog();
 const inferredObj = parsed.data.platform
 ? { key: parsed.data.platform, confidence: 0.9 }
 : inferPlatformFromCatalog(parsed.data.prompt, catalog);
 const inferredPlatform = inferredObj.key;
 const pObj = catalog.find((c) => c.key === inferredPlatform) || null;
 const area = parsed.data.area || pObj?.defaultArea || "Operação";
 const [intent] = await db
 .insert(nervaIntents)
 .values({
 mode: parsed.data.mode,
 prompt: parsed.data.prompt,
 platform: inferredPlatform,
 area,
 status: "draft",
 card: {},
 plan: {},
 meta: {
 inferredPlatform,
 confidence: inferredObj.confidence,
 platformNeeds: pObj?.needs || [],
 layers: pObj?.layers || [],
 risk: pObj?.risk || "medium"
 },
 createdAt: new Date(),
 updatedAt: new Date()
 })
 .returning();
 return res.json({ ok: true, intent });
 } catch (e) {
 console.error("[NERVA] create intent error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
const CompileIntentSchema = z.object({
 platform: z.string().optional(),
 area: z.string().optional(),
 silenceHours: z.coerce.number().min(1).max(168).optional(),
 outcome: z.string().optional(),
 trigger: z.string().optional(),
 action: z.string().optional(),
 confirmation: z.string().optional(),
 storage: z.string().optional()
});
router.post("/intents/:id/compile", async (req, res) => {
 const parsed = CompileIntentSchema.safeParse(req.body || {});
 if (!parsed.success) {
 return res.status(400).json({ ok: false, error: "INVALID_BODY", details: parsed.error.flatten() });
 }
 try {
 const [intent] = await db.select().from(nervaIntents).where(eq(nervaIntents.id, req.params.id)).limit(1);
 if (!intent) return res.status(404).json({ ok: false, error: "NOT_FOUND" });
 const catalog = await getEnabledCatalog();
 const inferredObj = parsed.data.platform
 ? { key: parsed.data.platform, confidence: 0.9 }
 : inferPlatformFromCatalog(intent.prompt, catalog);
 const platform = parsed.data.platform || intent.platform || inferredObj.key;
 const catalogEntry = catalog.find((c) => c.key === platform) || null;
 const area = parsed.data.area || intent.area || catalogEntry?.defaultArea || "Operação";
 const inputs = {
 silenceHours: parsed.data.silenceHours,
 confirmation: parsed.data.confirmation,
 trigger: parsed.data.trigger,
 action: parsed.data.action,
 outcome: parsed.data.outcome,
 storage: parsed.data.storage
 };
 const cardResult = compileExecutionCard({
 prompt: intent.prompt,
 mode: intent.mode,
 platform,
 area,
 inputs,
 existingCard: intent.card || {}
 });
 const questionsPolicy = buildQuestionsPolicy({
 prompt: intent.prompt,
 mode: intent.mode,
 platform: cardResult.card.platform,
 card: cardResult.card,
 catalog,
 inputs
 });
 const planResult = compilePlan({
 prompt: intent.prompt,
 mode: intent.mode,
 platform: cardResult.card.platform,
 area,
 inputs,
 card: cardResult.card,
 catalogEntry
 });
 const lifecycleStatus = questionsPolicy.canFinalize ? "compiled" : "draft";
 const meta = {
 ...(intent.meta || {}),
 inferredPlatform: cardResult.card.platform,
 confidence: inferredObj.confidence,
 platformNeeds: catalogEntry?.needs || [],
 layers: catalogEntry?.layers || [],
 risk: catalogEntry?.risk || "medium",
 missingCardFields: cardResult.missingFields,
 questions: questionsPolicy.questions,
 cardCompilerVersion: cardResult.version,
 planCompilerVersion: planResult.version,
 questionsPolicyVersion: questionsPolicy.version
 };
 const [updated] = await db
 .update(nervaIntents)
 .set({
 platform: cardResult.card.platform,
 area,
 status: lifecycleStatus,
 card: cardResult.card,
 plan: planResult.plan,
 meta,
 updatedAt: new Date()
 })
 .where(eq(nervaIntents.id, intent.id))
 .returning();
 await writeLog({
 level: "INFO",
 area,
 channel: "System",
 code: questionsPolicy.canFinalize ? "INTENT.COMPILED" : "INTENT.QUESTIONING",
 msg: questionsPolicy.canFinalize
 ? `Intent compilado (${updated.mode})`
 : `Intent aguardando respostas mínimas (${updated.mode})`,
 ctx: `${cardResult.card.platform} | ${planResult.plan.title}`,
 routineId: null,
 operatorId: null
 });
 return res.json({
 ok: true,
 intent: updated,
 card: cardResult.card,
 plan: planResult.plan,
 questions: questionsPolicy.questions,
 cardComplete: cardResult.complete,
 missingCardFields: cardResult.missingFields,
 platformNeeds: catalogEntry?.needs || [],
 layers: catalogEntry?.layers || [],
 platformRisk: catalogEntry?.risk || "medium"
 });
 } catch (e) {
 console.error("[NERVA] compile intent error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
router.get("/intents", async (_req, res) => {
 try {
 const rows = await db.select().from(nervaIntents).orderBy(desc(nervaIntents.createdAt)).limit(200);
 return res.json({ ok: true, intents: rows });
 } catch (e) {
 console.error("[NERVA] list intents error:", e);
 return res.status(500).json({ ok: false, error: "INTERNAL_ERROR" });
 }
});
export default router;