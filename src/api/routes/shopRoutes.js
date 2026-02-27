/* src/api/routes/shopRoutes.js
   desc: Shop Routes V1 (Lego Marketplace Rail)
   auth: protected by /api authenticate in server.js
*/

import express from 'express';
import { ShopService } from '../services/shopService.js';

const router = express.Router();

/**
 * GET /api/shop/catalog
 * Lista produtos/packs do Shop com status (instalado ou não)
 */
router.get('/catalog', async (req, res) => {
  try {
    const userId = req.user.id;
    const data = await ShopService.getCatalog(userId);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Shop] catalog error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to load catalog' });
  }
});

/**
 * POST /api/shop/hire
 * body: { productKey }
 * Instala no workspace: user_systems + agents + pré-instala toggles em projetos (disabled)
 */
router.post('/hire', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productKey } = req.body || {};
    if (!productKey) return res.status(400).json({ success: false, error: 'productKey é obrigatório' });

    const result = await ShopService.hireProduct(userId, productKey);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('[Shop] hire error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to hire product' });
  }
});

/**
 * POST /api/shop/unhire
 * body: { productKey }
 * Pausa no workspace: user_systems=paused + user_agents inactive
 */
router.post('/unhire', async (req, res) => {
  try {
    const userId = req.user.id;
    const { productKey } = req.body || {};
    if (!productKey) return res.status(400).json({ success: false, error: 'productKey é obrigatório' });

    const result = await ShopService.unhireProduct(userId, productKey);
    return res.json({ success: true, data: result });
  } catch (err) {
    console.error('[Shop] unhire error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to unhire product' });
  }
});

/**
 * GET /api/shop/project/:projectId/widgets
 * Retorna widgets + state (installed/enabled/dimmed) para o projeto.
 * Isso alimenta Sidebar dinâmica e o ShopDrawer.
 */
router.get('/project/:projectId/widgets', async (req, res) => {
  try {
    const userId = req.user.id;
    const { projectId } = req.params;
    if (!projectId) return res.status(400).json({ success: false, error: 'projectId é obrigatório' });

    const data = await ShopService.getWidgetsForProject(userId, projectId);
    return res.json({ success: true, data });
  } catch (err) {
    console.error('[Shop] project widgets error:', err);
    return res.status(500).json({ success: false, error: err?.message || 'Failed to load widgets' });
  }
});

export default router;