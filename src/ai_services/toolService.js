/* src/ai_services/toolService.js
   desc: Motor de Ferramentas Swarm V12 (Registry Universal).
   feat: Lê os Contratos de Identidade (Adapters) e isola completamente a lógica de execução.
   arch: Nenhuma lógica de negócio reside aqui. Apenas orquestração e blindagem de segurança.
*/

import { db } from '../db/index.js';
import { agents, userAgents } from '../db/schema/agents.js';
import { eq, and } from 'drizzle-orm';

// --- 1. IMPORTAÇÃO DOS CONTRATOS DE IDENTIDADE (ADAPTERS) ---
import * as ashAdapter from '../api/agents/ash/ashAdapter.js';
import * as neoAdapter from '../api/agents/neo/neoAdapter.js';
import * as florAdapter from '../api/agents/flor/florAdapter.js';

// --- 2. REGISTO CENTRALIZADO ---
// Montamos o catálogo com base nas exportações dos Adapters
const AGENT_ADAPTERS = {
  [ashAdapter.key]: ashAdapter,
  [neoAdapter.key]: neoAdapter,
  [florAdapter.key]: florAdapter, // 'flor_creator' ou 'flor' dependendo do seu db
};

const PACKS = {
  NEO_PRO: 'PACK_NEO_PRO',
  BRAND_CODE: 'PACK_BRAND_CODE', // Exemplo de Pack Premium da Flor
};

// --- FUNÇÕES DE SEGURANÇA / BILLING ---

function hasPack(activePacks, packId) {
  if (!activePacks) return false;
  if (Array.isArray(activePacks)) return activePacks.includes(packId);
  if (activePacks instanceof Set) return activePacks.has(packId);
  if (typeof activePacks === 'object') return !!activePacks[packId];
  return false;
}

async function hasActiveAgentContract(userId, agentKey) {
  if (!userId || !agentKey) return false;
  const [agent] = await db.select().from(agents).where(eq(agents.key, agentKey)).limit(1);
  if (!agent) return false;

  const [contract] = await db
    .select()
    .from(userAgents)
    .where(
      and(
        eq(userAgents.userId, userId),
        eq(userAgents.agentId, agent.id),
        eq(userAgents.isActive, true)
      )
    )
    .limit(1);

  return !!contract;
}

// --- 3. MONTADOR DE ARSENAL ---

/**
 * Constrói o objeto { declarations, handlers } lendo um grupo de ferramentas
 */
function extractTools(toolsObject = {}) {
  const declarations = [];
  const handlers = {};

  for (const [key, tool] of Object.entries(toolsObject)) {
    // Tratamento para arrays de schemas (Estilo FlorTools antigo)
    if (key === 'schemas' && Array.isArray(tool)) {
       declarations.push(...tool);
       continue;
    }
    
    // Tratamento Padrão V12 (declaration + handler)
    if (tool?.declaration?.name && typeof tool.handler === 'function') {
      declarations.push(tool.declaration);
      handlers[tool.declaration.name] = tool.handler;
    }
  }
  return { declarations, handlers };
}

/**
 * Resolve o conjunto exato de ferramentas para um agente específico, validando Packs.
 */
export function resolveToolsetForAgent(agentKey = 'ash', options = {}) {
  const key = agentKey.toLowerCase();
  const adapter = AGENT_ADAPTERS[key];
  
  // Fallback de segurança: Se não achar o agente, tenta devolver as ferramentas do Ash
  if (!adapter) {
    console.warn(`[ToolService] Agente '${agentKey}' não encontrado no Registry. Fallback para 'ash'.`);
    return resolveToolsetForAgent('ash', options);
  }

  const arsenal = { declarations: [], handlers: {} };

  // Helper para adicionar ao arsenal
  const addTools = (toolsObject) => {
    if (!toolsObject) return;
    const extracted = extractTools(toolsObject);
    arsenal.declarations.push(...extracted.declarations);
    
    // Se o objecto for do estilo FlorTools (que não expõe handlers nativos no formato Swarm),
    // o Adapter dela (ou o ToolService) precisa fazer o map manual. Mas assumindo
    // que migrámos para V12 no florTools.js, isto funciona perfeitamente:
    Object.assign(arsenal.handlers, extracted.handlers);
  };

  const activePacks = options?.activePacks;

  // =========================================================
  // FASE 1: NÚCLEO DO AGENTE (Core + Agência Sistémica)
  // =========================================================
  
  // 1. O Core Técnico
  if (adapter[`${adapter.key}CoreTools`]) addTools(adapter[`${adapter.key}CoreTools`]);
  else if (adapter[`${adapter.key.split('_')[0]}CoreTools`]) addTools(adapter[`${adapter.key.split('_')[0]}CoreTools`]);
  
  // 2. Os Poderes de Interface (Herdados do Ash)
  if (adapter.systemAgencyTools) addTools(adapter.systemAgencyTools);
  
  // 3. Exceção Estrutural do Ash (Generalista Mestre)
  if (adapter.key === 'ash') {
    addTools(adapter.ashCoreTools);
    addTools(adapter.ashPlanningTools);
    addTools(adapter.ashHolisticTools);
    addTools(adapter.ashIntegrationTools);
  }

  // =========================================================
  // FASE 2: PACKS ESPECÍFICOS DO AGENTE (Billing)
  // =========================================================
  
  // Neo Pro Tools (Elite)
  if (adapter.key.startsWith('neo') && hasPack(activePacks, PACKS.NEO_PRO)) {
    addTools(adapter.neoPlusTools);
  }
  
  // Flor Plus Tools (Holístico + BrandCode)
  if (adapter.key.startsWith('flor')) {
     addTools(adapter.florPlusTools);
  }

  return {
    declarations: arsenal.declarations,
    handlers: arsenal.handlers,
    registryName: adapter.key
  };
}

/**
 * getInjectedToolAllowlist(context)
 * Se o Orchestrator injetou context.tools, usamos isso como allowlist absoluta.
 */
function getInjectedToolAllowlist(context) {
  const injected = context?.tools;
  if (!Array.isArray(injected) || injected.length === 0) return null;
  const names = injected.map((d) => d?.name).filter(Boolean);
  return names.length ? new Set(names) : null;
}

// --- 4. EXECUTOR CANÔNICO ---

export async function executeToolCall(toolName, args, agentKey, options = {}) {
  const context = options?.context || {};
  const userId = args?.userId || context?.userId;

  // 1. Validação de Contrato (Apenas para Especialistas Pagos - Ex: Neo)
  if (agentKey.startsWith('neo') && neoAdapter.neoPlusTools) {
     const isEliteTool = Object.values(neoAdapter.neoPlusTools).some(t => t?.declaration?.name === toolName);
     if (isEliteTool) {
        const neoProActive = hasPack(context?.activePacks || options?.activePacks, PACKS.NEO_PRO);
        if (!neoProActive) return { success: false, error: `Tool Neo Pro não disponível: requer PACK_NEO_PRO ativo.` };
        
        const contracted = await hasActiveAgentContract(userId, 'neo_dev');
        if (!contracted) return { success: false, error: `Exige contratação prévia do agente NEO.` };
     }
  }

  // 2. Allowlist do Orquestrador
  const injectedAllowlist = getInjectedToolAllowlist(context);
  if (injectedAllowlist && !injectedAllowlist.has(toolName)) {
    return { success: false, error: `Tool não permitida pelo contexto injetado: ${toolName}` };
  }

  // 3. Resolve as ferramentas autorizadas e executa
  const { handlers } = resolveToolsetForAgent(agentKey, { activePacks: context?.activePacks || options?.activePacks });
  const fn = handlers[toolName];

  if (!fn) {
    return { success: false, error: `Tool não disponível para o agente '${agentKey}': ${toolName}` };
  }

  try {
    return await fn(args, { context, agentKey, options });
  } catch (e) {
    console.error(`[ToolService] Falha na tool ${toolName}:`, e);
    return { success: false, error: e?.message || String(e) };
  }
}

export default {
  resolveToolsetForAgent,
  executeToolCall,
};