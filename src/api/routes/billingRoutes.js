import express from "express";
import { authenticate } from "../authMiddleware.js"; // Importar de authMiddleware
import { SYSTEM_PROJECT_PRICING_CENTS } from "../../config/systemsPricing.js";
import { createProjectSystemSubscription } from "../../services/billing/billingService.js";

const router = express.Router();

/**
 * POST /api/billing/project/:projectId/system/:systemKey/subscribe
 * Cria subscription Asaas (PIX) para um systemKey por projeto ativo.
 * Salva subscriptionId em project_systems.flags.
 */
router.post("/project/:projectId/system/:systemKey/subscribe", authenticate, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { projectId, systemKey } = req.params;

    const valueCents =
      Number(req.body?.valueCents) ||
      SYSTEM_PROJECT_PRICING_CENTS?.[systemKey];

    if (!valueCents) {
      return res.status(400).json({ ok: false, error: "Preço não configurado para este systemKey." });
    }

    const result = await createProjectSystemSubscription({
      userId,
      projectId,
      systemKey,
      valueCents,
      billingType: "PIX",
      cycle: "MONTHLY",
      description: `Assinatura Prana - ${systemKey} (Projeto ${projectId})`,
      externalReference: `user:${userId}:project:${projectId}:system:${systemKey}`,
    });

    return res.json({ ok: true, data: result });
  } catch (e) {
    console.error("[billingRoutes] subscribe error:", e);
    return res.status(500).json({ ok: false, error: e.message || "Falha ao assinar." });
  }
});

export default router;