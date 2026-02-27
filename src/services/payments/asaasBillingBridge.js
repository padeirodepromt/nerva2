/* src/services/payments/asaasBillingBridge.js
   desc: Billing Bridge (Asaas) V1.1 — No asaasCustomerId persisted
   relies:
   - env ASAAS_API_URL / ASAAS_API_KEY
   - plansConfig.js exports PLAN_DETAILS
*/

import { asaasClient } from "./asaasClient.js";
import { PLAN_DETAILS } from "../../config/plansConfig.js";

function toBRL(valueCents) {
  const n = Number(valueCents);
  if (!Number.isFinite(n) || n < 0) throw new Error("valueCents inválido");
  return Number((n / 100).toFixed(2));
}

function yyyyMmDdFromNow(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Resolve o preço mensal do plano (em cents) a partir do plansConfig.js
 */
export function resolvePlanMonthlyValueCents(planKey) {
  if (!planKey) return null;
  const plan = PLAN_DETAILS?.[planKey];
  const monthly = plan?.price?.monthly;
  if (!Number.isFinite(monthly)) return null;
  return Math.round(Number(monthly) * 100);
}

/**
 * ensureAsaasCustomer (stateless)
 * - busca por email no Asaas
 * - cria se não existir
 * - NÃO persiste localmente (por decisão do seu schema)
 */
export async function ensureAsaasCustomer(user) {
  if (!user?.email) throw new Error("user.email obrigatório");

  const found = await asaasClient.findCustomerByEmail(user.email);
  if (found?.id) return found.id;

  const created = await asaasClient.createCustomer({
    name: user.name || user.email,
    email: user.email,
    cpfCnpj: user.cpfCnpj || undefined,
  });

  if (!created?.id) throw new Error("Falha ao criar customer no Asaas");
  return created.id;
}

/**
 * Payment Link RECURRENT (bom para checkout simples, inclusive PIX)
 */
export async function createRecurringPaymentLink({
  customerId,
  name,
  description,
  valueCents,
  cycle = "MONTHLY",
  billingType = "PIX",
  externalReference,
  endDate,
}) {
  const value = toBRL(valueCents);

  const payload = {
    name: name || "Prana",
    description: description || "Assinatura Prana",
    chargeType: "RECURRENT",
    billingType,
    value,
    cycle,
    externalReference: externalReference || undefined,
    endDate: endDate || undefined,
  };

  // alguns ambientes aceitam customer aqui; se ignorar, ok.
  if (customerId) payload.customer = customerId;

  const res = await asaasClient.post("/paymentLinks", payload);
  const url = res?.url || res?.link || null;

  return { ...res, url };
}

/**
 * Subscription (melhor para audit por subscriptionId + webhook)
 */
export async function createSubscription({
  customerId,
  valueCents,
  cycle = "MONTHLY",
  billingType = "PIX",
  description,
  externalReference,
  nextDueDateDaysFromNow = 1,
}) {
  if (!customerId) throw new Error("customerId obrigatório");
  const payload = {
    customer: customerId,
    billingType,
    cycle,
    value: toBRL(valueCents),
    nextDueDate: yyyyMmDdFromNow(nextDueDateDaysFromNow),
    description: description || "Assinatura Prana",
    externalReference: externalReference || undefined,
  };

  const res = await asaasClient.post("/subscriptions", payload);
  if (!res?.id) throw new Error("Falha ao criar subscription no Asaas");
  return res;
}

/**
 * Checkout para plano (puxa preço do plansConfig.js)
 * - default: paymentLink (mais simples)
 * - opcional: subscription (mais auditável)
 */
export async function createPlanCheckout({
  planKey,
  user,
  prefer = "paymentLink", // "paymentLink" | "subscription"
}) {
  const valueCents = resolvePlanMonthlyValueCents(planKey);
  if (valueCents == null) throw new Error(`Plano sem preço mensal: ${planKey}`);

  const customerId = await ensureAsaasCustomer(user);
  const externalReference = `plan:${planKey}:user:${user?.id || "unknown"}`;

  const name = `Prana • Plano ${planKey}`;
  const description = `Assinatura Prana - Plano ${planKey}`;

  if (prefer === "subscription") {
    const sub = await createSubscription({
      customerId,
      valueCents,
      cycle: "MONTHLY",
      billingType: "PIX",
      description,
      externalReference,
    });

    return { kind: "subscription", subscription: sub, checkoutUrl: null, customerId };
  }

  const link = await createRecurringPaymentLink({
    customerId,
    name,
    description,
    valueCents,
    cycle: "MONTHLY",
    billingType: "PIX",
    externalReference,
  });

  return { kind: "paymentLink", paymentLink: link, checkoutUrl: link.url || null, customerId };
}