import { db } from '../../db/index.js';
import * as schema from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import astrologyService from '../../ai_services/astrologyService.js';

export const astralProfileController = {
  async getAstralProfile(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId obrigatório" });

      const profile = await db.query.astralProfiles.findFirst({
        where: eq(schema.astralProfiles.userId, userId),
      });
      
      if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });
      res.json(profile);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },
  
  // Alias para o padrão 'get'
  async get(req, res) { return this.getAstralProfile(req, res); },

  async upsertAstralProfile(req, res) {
    try {
      const { userId, birthDate, birthTime, birthPlace , realmId } = req.body;
      
      if (!userId || !birthDate) {
        return res.status(400).json({ error: "userId e birthDate obrigatórios" });
      }

      // Calcula a carta astrológica completa usando o serviço
      const chartDate = new Date(birthDate);
      if (birthTime) {
        const [hours, minutes] = birthTime.split(':');
        chartDate.setHours(parseInt(hours) || 0, parseInt(minutes) || 0);
      }

      const fullChart = astrologyService.getFullAstrologicalChart(chartDate);

      const values = {
        userId,
        birthDate: chartDate,
        birthTime,
        birthPlace,
        sunSign: fullChart.sun.sign,
        moonSign: fullChart.moon.sign,
        risingSign: fullChart.rising.sign,
        chartData: fullChart, // Salva a carta completa com todas as 6 posições
        updatedAt: new Date()
      };

      // Tenta update primeiro ou insert
      const existing = await db.query.astralProfiles.findFirst({ where: eq(schema.astralProfiles.userId, userId) });
      
      let result;
      if (existing) {
        [result] = await db.update(schema.astralProfiles).set(values).where(and(eq(schema.astralProfiles.userId, userId), realmId && realmId !== 'all' ? eq(schema.astralProfiles.realmId, realmId) : undefined)).returning();
      } else {
        values.id = createId('ast');
        [result] = await db.insert(schema.astralProfiles).values(values).returning();
      }
      
      res.json(result);
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // Alias
  async upsert(req, res) { return this.upsertAstralProfile(req, res); },

  // Novo endpoint para obter carta astrológica de análise do céu
  async getFullChart(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId obrigatório" });

      const profile = await db.query.astralProfiles.findFirst({
        where: eq(schema.astralProfiles.userId, userId),
      });
      
      if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });
      
      // Retorna chartData completo com todas as 6 posições planetárias
      res.json({
        ...profile,
        chart: profile.chartData || {} // Garante que sempre retorna a carta
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // Novo endpoint para análise do céu de hoje
  async getSkyAnalysisToday(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId obrigatório" });

      const profile = await db.query.astralProfiles.findFirst({
        where: eq(schema.astralProfiles.userId, userId),
      });
      
      if (!profile) return res.status(404).json({ error: "Perfil não encontrado" });
      
      // Análise de hoje comparando com o mapa de nascimento
      const todayChart = astrologyService.getCurrentTransit();
      const birthChart = profile.chartData || {};

      res.json({
        today: todayChart,
        birth: birthChart,
        analysis: {
          date: new Date().toISOString(),
          message: "Análise do céu de hoje baseada em sua carta natal"
        }
      });
    } catch (e) { res.status(500).json({ error: e.message }); }
  },

  // Gera/atualiza documento astral como arquivo no sistema
  async generateAstralDocument(req, res) {
    try {
      const userId = req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId obrigatório" });

      // Buscar perfil astrológico
      const profile = await db.query.astralProfiles.findFirst({
        where: eq(schema.astralProfiles.userId, userId),
      });
      
      if (!profile) return res.status(404).json({ error: "Perfil astrológico não encontrado. Sincronize seu mapa natal primeiro." });
      
      // Buscar análise de hoje
      const todayChart = astrologyService.getCurrentTransit();
      const birthChart = profile.chartData || {};
      
      // Gerar conteúdo do documento
      const documentContent = generateAstralDocumentContent(profile, todayChart, birthChart);
      
      // Verificar se documento já existe
      const existingDoc = await db.query.papyrusDocuments.findFirst({
        where: and(
          eq(schema.papyrusDocuments.authorId, userId),
          eq(schema.papyrusDocuments.documentType, 'astral-reading')
        )
      });

      let result;
      if (existingDoc) {
        // Atualizar documento existente
        [result] = await db.update(schema.papyrusDocuments).set({
          content: documentContent,
          updatedAt: new Date()
        }).where(and(eq(schema.papyrusDocuments.id, existingDoc.id), realmId && realmId !== 'all' ? eq(schema.papyrusDocuments.realmId, realmId) : undefined)).returning();
      } else {
        // Criar novo documento
        [result] = await db.insert(schema.papyrusDocuments).values({
          id: createId('doc'),
        realmId: realmId || 'personal',
          title: `🌟 Seu Mapa Astrológico - ${new Date().toLocaleDateString('pt-BR')}`,
          content: documentContent,
          authorId: userId,
          documentType: 'astral-reading',
          isPrivate: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          currentVersion: 1
        }).returning();
      }

      res.json({
        ...result,
        message: existingDoc ? "Documento astral atualizado" : "Documento astral criado"
      });
    } catch (e) { 
      console.error('[Astral Document] Erro:', e.message);
      res.status(500).json({ error: e.message }); 
    }
  }
};

/**
 * Gera conteúdo formatado do documento astrológico
 */
function generateAstralDocumentContent(profile, todayChart, birthChart) {
  const birthSun = birthChart.luminaries?.sun;
  const birthMoon = birthChart.luminaries?.moon;
  const todaySun = todayChart.luminaries?.sun;

  return `# 🌟 Seu Mapa Astrológico Pessoal

**Data do Relatório:** ${new Date().toLocaleDateString('pt-BR')}
**Sua Data de Nascimento:** ${new Date(profile.birthDate).toLocaleDateString('pt-BR')} às ${profile.birthTime || '12h'}
**Local:** ${profile.birthPlace || 'Desconhecido'}

---

## ☉ Seu Sol Natal - Sua Essência

Você nasceu com o **Sol em ${profile.sunSign}**. Esta é a chama que define quem você é fundamentalmente. 

O Sol representa:
- Sua identidade core e essência
- Seu propósito de vida
- Como você brilha e se expressa
- Sua criatividade e vitalidade

**${profile.sunSign}** traz características únicas que moldam sua jornada. Seu Sol é a bússola que guia suas grandes decisões.

---

## 🌙 Sua Lua Natal - Seu Mundo Emocional

Você nasceu com a **Lua em ${profile.moonSign}**. Enquanto o Sol é quem você é, a Lua é quem você *sente* que é.

A Lua governa:
- Suas emoções e instintos
- Necessidades psicológicas profundas
- Seu mundo interior e intuição
- Como você processa os sentimentos

**${profile.moonSign}** adiciona complexidade emocional única. É a parte de você que ninguém vê imediatamente, mas que você sente intensamente.

---

## ↑ Seu Ascendente - Sua Máscara Social

Seu Ascendente é **${profile.risingSign || 'em breve calculado'}**. Esta é a energia que você projeta ao mundo, sua primeira impressão.

O Ascendente é:
- Como os outros te veem inicialmente
- Sua energia superficial e comportamento
- A porta de entrada para sua personalidade
- Sua aparência e presença

---

## 🌍 Os Transitos de Hoje

**O Sol está em ${todaySun?.sign || 'desconhecido'}**

Hoje, o cosmos oferece uma vibração única que ressoa com sua natureza pessoal. Os transitos não são apenas espetáculos celestiais - eles ecoam dentro de você.

### Como Hoje Afeta Você

Seu Sol natal em ${profile.sunSign} encontra-se em diálogo com a energia de hoje. Esta convergência traz oportunidades específicas para integração entre:
- **Quem você é fundamentalmente** (Sol natal em ${profile.sunSign})
- **O que o universo oferece hoje** (Sol em ${todaySun?.sign})

Confie em sua intuição (Lua em ${profile.moonSign}) e honre sua essência (Sol em ${profile.sunSign}). Esta é a alquimia diária de sua vida.

---

## ✨ Sua Jornada Cósmica

Você não é acidental. Seu nascimento em data, hora e lugar específicos foram escolhas cósmicas. O universo não cria coincidências - cria sincronicidades.

**Lembre-se:**
- Seus desafios de hoje não vêm para puní-lo, mas para evoluir você
- A sabedoria que precisa já está dentro de você (escrita em suas estrelas)
- Os transitos são convites para crescimento consciente
- Você é co-criador do seu destino

---

*Relatório gerado automaticamente pelo sistema Prana 3.0*
*Sua próxima análise será atualizada quando as condições cósmicas significativas mudarem.*`;
}