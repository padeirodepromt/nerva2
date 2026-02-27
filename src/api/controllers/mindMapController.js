/* canvas: src/api/controllers/mindMapController.js
   desc: Controlador V3 (Full Features). Suporta Edges e Delete Node.
*/
import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

export const mindMapController = {
  // --- MAPAS ---
  async listMaps(req, res) {
    try {
      const { projectId , realmId } = req.query;
      // Se projectId for 'null' string, busca globais. Se undefined, busca tudo.
      const maps = await db.select().from(schema.mindMaps);
      res.json(maps);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async createMap(req, res) {
    try {
      const { title, projectId, createdBy , realmId } = req.body;
      const newMap = {
        id: createId('map'),
        title: title || 'Novo Mapa',
        projectId: projectId || null,
        createdBy,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.insert(schema.mindMaps).values(newMap);
      
      // Cria Raiz
      await db.insert(schema.mindMapNodes).values({
          id: createId('node'),
        realmId: realmId || 'personal',
          mapId: newMap.id,
          label: title || 'Ideia Central',
          type: 'root',
          position: { x: 0, y: 0 },
          createdAt: new Date()
      });
      res.status(201).json(newMap);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async getMap(req, res) {
      try {
          const [map] = await db.select().from(schema.mindMaps).where(and(eq(schema.mindMaps.id, req.params.id), realmId && realmId !== 'all' ? eq(schema.mindMaps.realmId, realmId) : undefined));
          if (!map) return res.status(404).json({ error: "Mapa não encontrado" });
          res.json(map);
      } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // --- NÓS ---
  async listNodes(req, res) {
    try {
      const { mapId , realmId } = req.query;
      if (!mapId) return res.status(400).json({ error: "mapId obrigatório" });
      const nodes = await db.select().from(schema.mindMapNodes).where(and(eq(schema.mindMapNodes.mapId, mapId), realmId && realmId !== 'all' ? eq(schema.mindMapNodes.realmId, realmId) : undefined));
      res.json(nodes);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async createNode(req, res) {
    try {
      const { mapId, label, type, position, node_type , realmId } = req.body;
      const newNode = {
        id: createId('node'),
        mapId,
        label,
        type: type || 'idea',
        data: { node_type },
        position: position || { x: 0, y: 0 },
        createdAt: new Date()
      };
      await db.insert(schema.mindMapNodes).values(newNode);
      res.status(201).json(newNode);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async updateNode(req, res) {
    try {
      const { id , realmId } = req.params;
      const [updated] = await db.update(schema.mindMapNodes)
        .set({ ...req.body, updatedAt: new Date() })
        .where(and(eq(schema.mindMapNodes.id, id), realmId && realmId !== 'all' ? eq(schema.mindMapNodes.realmId, realmId) : undefined))
        .returning();
      res.json(updated);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async deleteNode(req, res) {
    try {
      await db.delete(schema.mindMapNodes).where(and(eq(schema.mindMapNodes.id, req.params.id), realmId && realmId !== 'all' ? eq(schema.mindMapNodes.realmId, realmId) : undefined));
      res.json({ message: "Deletado" });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // --- EDGES (Conexões) ---
  async listEdges(req, res) {
    try {
      const { mapId , realmId } = req.query;
      if (!mapId) return res.status(400).json({ error: "mapId obrigatório" });
      const edges = await db.select().from(schema.mindMapEdges).where(and(eq(schema.mindMapEdges.mapId, mapId), realmId && realmId !== 'all' ? eq(schema.mindMapEdges.realmId, realmId) : undefined));
      res.json(edges);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async createEdge(req, res) {
    try {
      const { mapId, source, target , realmId } = req.body;
      // ReactFlow manda 'source' e 'target', o banco usa 'sourceId' e 'targetId'
      const newEdge = {
        id: createId('edge'),
        mapId,
        sourceId: source,
        targetId: target,
        createdAt: new Date()
      };
      await db.insert(schema.mindMapEdges).values(newEdge);
      res.status(201).json(newEdge);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  async deleteEdge(req, res) {
      try {
          // ReactFlow deleta pelo ID da aresta
          await db.delete(schema.mindMapEdges).where(and(eq(schema.mindMapEdges.id, req.params.id), realmId && realmId !== 'all' ? eq(schema.mindMapEdges.realmId, realmId) : undefined));
          res.json({ success: true });
      } catch (e) { res.status(500).json({ error: e.message }); }
  }
};