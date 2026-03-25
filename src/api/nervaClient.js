// src/api/nervaClient.js
const BASE = ""; // same-origin
async function http(path, { method = "GET", body } = {}) {
 const res = await fetch(`${BASE}${path}`, {
 method,
 headers: body ? { "Content-Type": "application/json" } : undefined,
 body: body ? JSON.stringify(body) : undefined
 });
 const data = await res.json().catch(() => ({}));
 if (!res.ok) {
 const msg = data?.error || `HTTP_${res.status}`;
 throw new Error(msg);
 }
 return data;
}
export const nervaClient = {
 getLogs: ({ limit = 200, area, channel, level, routineId, operatorId } = {}) => {
 const qs = new URLSearchParams();
 if (limit) qs.set("limit", String(limit));
 if (area && area !== "Tudo") qs.set("area", area);
 if (channel && channel !== "Todos") qs.set("channel", channel);
 if (level && level !== "Tudo") qs.set("level", level);
 if (routineId) qs.set("routineId", routineId);
 if (operatorId) qs.set("operatorId", operatorId);
 return http(`/api/nerva/logs?${qs.toString()}`);
 },
 getConnectorsCatalog: () => http(`/api/nerva/connectors/catalog`),
 seedConnectorsCatalog: () => http(`/api/nerva/connectors/catalog/seed`, { method: "POST" }),
 getRoutines: () => http(`/api/nerva/routines`),
 createRoutine: (payload) => http(`/api/nerva/routines`, { method: "POST", body: payload }),
 addOperator: (routineId, payload) =>
 http(`/api/nerva/routines/${routineId}/operators`, { method: "POST", body: payload }),
 getApprovals: ({ status = "pending", limit = 50 } = {}) =>
 http(`/api/nerva/approvals?status=${encodeURIComponent(status)}&limit=${limit}`),
 createApproval: (payload) => http(`/api/nerva/approvals`, { method: "POST", body: payload }),
 decideApproval: (id, decision) =>
 http(`/api/nerva/approvals/${id}/decide`, { method: "POST", body: { decision } }),
 createIntent: (payload) => http(`/api/nerva/intents`, { method: "POST", body: payload }),
 compileIntent: (id, payload = {}) => http(`/api/nerva/intents/${id}/compile`, { method: "POST", body: payload }),
 listIntents: () => http(`/api/nerva/intents`)
};