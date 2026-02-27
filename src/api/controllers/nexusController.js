import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js'; 
import { eq, desc, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { chatService } from '../../ai_services/chatService.js'; // Importe o serviço de IA

export const nexusController = {
  
  // --- MÉTODOS CRUD EXISTENTES (Mantidos) ---

  async getNexusByUser(req, res) { 
    try {
        const userId = req.query.userId || req.user?.id; 
        if (!userId) return res.json([]); 

        const chats = await db.select().from(schema.nexusChats)
            .where(and(eq(schema.nexusChats.userId, userId), realmId && realmId !== 'all' ? eq(schema.nexusChats.realmId, realmId) : undefined))
            .orderBy(desc(schema.nexusChats.createdAt));
            
        res.json(chats);
    } catch (error) {
        console.error('Erro ao listar chats:', error);
        res.status(500).json({ error: 'Erro interno ao listar chats' });
    }
  },
  
  async list(req, res) { return this.getNexusByUser(req, res); },

  async getNexusById(req, res) {
    try {
        const { id , realmId } = req.params;
        const [chat] = await db.select().from(schema.nexusChats).where(and(eq(schema.nexusChats.id, id), realmId && realmId !== 'all' ? eq(schema.nexusChats.realmId, realmId) : undefined));
        if (!chat) return res.status(404).json({ error: 'Chat não encontrado' });
        
        const msgs = await db.select().from(schema.nexusMessages)
            .where(and(eq(schema.nexusMessages.nexusId, id), realmId && realmId !== 'all' ? eq(schema.nexusMessages.realmId, realmId) : undefined))
            .orderBy(schema.nexusMessages.createdAt);
        
        res.json({ ...chat, messages: msgs });
    } catch (error) {
        console.error('Erro ao buscar chat:', error);
        res.status(500).json({ error: 'Erro interno ao buscar chat' });
    }
  },
  
  async get(req, res) { return this.getNexusById(req, res); },

  async createNexus(req, res) {
    try {
        const { userId, title , realmId } = req.body;
        const effectiveUserId = userId || req.user?.id;
        
        const newChat = {
            id: createId('nex'),
            userId: effectiveUserId,
            title: title || 'Nova Conversa',
            realmId: realmId || 'personal',
            createdAt: new Date()
        };
        await db.insert(schema.nexusChats).values(newChat);
        res.status(201).json(newChat);
    } catch (error) {
        console.error('Erro ao criar chat:', error);
        res.status(500).json({ error: 'Erro interno ao criar chat' });
    }
  },
  
  async create(req, res) { return this.createNexus(req, res); },

  async addNexusMessage(req, res) {
    try {
        const { id } = req.params;
        const { role, content, realmId } = req.body;
        const newMsg = {
            id: createId('msg'),
            nexusId: id,
            role,
            content,
            realmId: realmId || 'personal',
            createdAt: new Date()
        };
        await db.insert(schema.nexusMessages).values(newMsg);
        res.status(201).json(newMsg);
    } catch (error) {
        console.error('Erro ao adicionar mensagem:', error);
        res.status(500).json({ error: 'Erro interno' });
    }
  },
  
  async addMessage(req, res) { return this.addNexusMessage(req, res); },

  // --- NOVO MÉTODO: INTELIGÊNCIA (ASH) ---
  // Endpoint: POST /api/nexus/chat
  // Conecta o "Nervo" ao "Cérebro"
  async sendMessage(req, res) {
    try {
      const userId = req.user?.id || req.body.userId;
      const { message, nexusId, context , realmId } = req.body;

      if (!message || !nexusId) {
        return res.status(400).json({ error: 'Mensagem e NexusID são obrigatórios.' });
      }

      console.log(`📡 [NexusController] Processando mensagem para Nexus ${nexusId}`);
      
      // Recuperar histórico para contexto da IA
      const history = await db.select()
        .from(schema.nexusMessages)
        .where(and(eq(schema.nexusMessages.nexusId, nexusId), realmId && realmId !== 'all' ? eq(schema.nexusMessages.realmId, realmId) : undefined))
        .orderBy(desc(schema.nexusMessages.createdAt))
        .limit(10);

      const chronologicalHistory = history.reverse();

      // Executar o Chat Service com Contexto
      const result = await chatService.runChat(
        userId, 
        nexusId, 
        message, 
        chronologicalHistory, 
        context // Passa o contexto visual/projeto para o serviço
      );

      if (result.error) {
        return res.status(500).json(result);
      }

      return res.json({
        data: result,
        tokens: result?.tokens,
        toolResponse: result?.toolResponse || null,
        client_action: result?.client_action || null
      });

    } catch (error) {
      console.error('❌ [NexusController] Erro no sendMessage:', error);
      return res.status(500).json({ error: 'Erro interno na inteligência.' });
    }
  }
};