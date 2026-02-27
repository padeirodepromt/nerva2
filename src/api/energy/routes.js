// src/api/energy/routes.js
// Energy Check-in Endpoints (Morning + Afternoon)
// + Diary Entries (Evening reflection)
// + Ritual Detection & Management

import { Router } from 'express';
import { db } from '../../db/index.js';
import { energyCheckIns, diaryEntries, rituals, ENERGY_TYPES, EMOTIONAL_STATES } from '../../db/schema/energy.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { createId } from '../../utils/id.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// ENERGY CHECK-IN ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/energy/check-in
 * Record energy for morning or afternoon
 * 
 * Body: {
 *   timeOfDay: 'morning' | 'afternoon',
 *   energyType: string (from ENERGY_TYPES),
 *   energyIntensity: 1-5,
 *   secondaryType?: string,
 *   secondaryIntensity?: 1-5,
 *   secondaryTime?: ISO timestamp
 * }
 */
router.post('/check-in', async (req, res) => {
  try {
    const { userId } = req.user;
    const { 
      timeOfDay, 
      energyType, 
      energyIntensity, 
      secondaryType, 
      secondaryIntensity, 
      secondaryTime 
    } = req.body;

    // Validate inputs
    if (!['morning', 'afternoon'].includes(timeOfDay)) {
      return res.status(400).json({ error: 'Invalid timeOfDay' });
    }
    if (!ENERGY_TYPES.includes(energyType)) {
      return res.status(400).json({ error: 'Invalid energyType' });
    }
    if (energyIntensity < 1 || energyIntensity > 5) {
      return res.status(400).json({ error: 'Intensity must be 1-5' });
    }
    if (secondaryType && !ENERGY_TYPES.includes(secondaryType)) {
      return res.status(400).json({ error: 'Invalid secondaryType' });
    }

    // Create check-in
    const checkIn = await db.insert(energyCheckIns).values({
      userId,
      timeOfDay,
      energyType,
      energyIntensity,
      secondaryType: secondaryType || null,
      secondaryIntensity: secondaryIntensity || null,
      secondaryTime: secondaryTime || null,
      recordedAt: new Date()
    }).returning();

    res.json({ success: true, data: checkIn[0] });
  } catch (err) {
    console.error('Energy check-in error:', err);
    res.status(500).json({ error: 'Failed to record energy' });
  }
});

/**
 * GET /api/energy/today
 * Get today's energy check-ins (morning + afternoon)
 */
router.get('/today', async (req, res) => {
  try {
    const { userId } = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const checkIns = await db
      .select()
      .from(energyCheckIns)
      .where(
        and(
          eq(energyCheckIns.userId, userId),
          gte(energyCheckIns.recordedAt, today),
          lte(energyCheckIns.recordedAt, tomorrow)
        )
      )
      .orderBy(energyCheckIns.recordedAt);

    const morning = checkIns.find(c => c.timeOfDay === 'morning');
    const afternoon = checkIns.find(c => c.timeOfDay === 'afternoon');

    res.json({ 
      success: true, 
      data: { morning, afternoon }
    });
  } catch (err) {
    console.error('Get today energy error:', err);
    res.status(500).json({ error: 'Failed to fetch energy data' });
  }
});

/**
 * GET /api/energy/week
 * Get energy data for the past 7 days
 */
router.get('/week', async (req, res) => {
  try {
    const { userId } = req.user;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const checkIns = await db
      .select()
      .from(energyCheckIns)
      .where(
        and(
          eq(energyCheckIns.userId, userId),
          gte(energyCheckIns.recordedAt, sevenDaysAgo)
        )
      )
      .orderBy(desc(energyCheckIns.recordedAt));

    // Group by day
    const byDay = {};
    checkIns.forEach(checkIn => {
      const date = checkIn.recordedAt.toISOString().split('T')[0];
      if (!byDay[date]) byDay[date] = { morning: null, afternoon: null };
      byDay[date][checkIn.timeOfDay] = checkIn;
    });

    res.json({ success: true, data: byDay });
  } catch (err) {
    console.error('Get week energy error:', err);
    res.status(500).json({ error: 'Failed to fetch week data' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// DIARY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/diary/entry
 * Create diary entry with emotional states
 * 
 * Body: {
 *   content: string (rich text),
 *   emotionalStates: string[] (up to 3 from EMOTIONAL_STATES),
 *   linkedMorningEnergyId?: string,
 *   linkedAfternoonEnergyId?: string
 * }
 */
router.post('/entry', async (req, res) => {
  try {
    const { userId } = req.user;
    const { content, emotionalStates, linkedMorningEnergyId, linkedAfternoonEnergyId } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content cannot be empty' });
    }

    if (emotionalStates && emotionalStates.length > 3) {
      return res.status(400).json({ error: 'Maximum 3 emotional states allowed' });
    }

    if (emotionalStates) {
      for (const state of emotionalStates) {
        if (!EMOTIONAL_STATES.includes(state)) {
          return res.status(400).json({ error: `Invalid emotional state: ${state}` });
        }
      }
    }

    const entryDate = new Date();
    entryDate.setHours(0, 0, 0, 0);

    const entry = await db.insert(diaryEntries).values({
      userId,
      content,
      emotionalStates: emotionalStates || [],
      linkedMorningEnergyId: linkedMorningEnergyId || null,
      linkedAfternoonEnergyId: linkedAfternoonEnergyId || null,
      entryDate
    }).returning();

    res.json({ success: true, data: entry[0] });
  } catch (err) {
    console.error('Diary entry error:', err);
    res.status(500).json({ error: 'Failed to save diary entry' });
  }
});

/**
 * GET /api/diary/today
 * Get today's diary entry
 */
router.get('/today', async (req, res) => {
  try {
    const { userId } = req.user;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const entry = await db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.userId, userId),
          eq(diaryEntries.entryDate, today)
        )
      )
      .limit(1);

    res.json({ 
      success: true, 
      data: entry[0] || null 
    });
  } catch (err) {
    console.error('Get diary error:', err);
    res.status(500).json({ error: 'Failed to fetch diary' });
  }
});

/**
 * GET /api/diary/week
 * Get diary entries for past 7 days
 */
router.get('/week', async (req, res) => {
  try {
    const { userId } = req.user;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const entries = await db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.userId, userId),
          gte(diaryEntries.entryDate, sevenDaysAgo)
        )
      )
      .orderBy(desc(diaryEntries.entryDate));

    res.json({ success: true, data: entries });
  } catch (err) {
    console.error('Get diary week error:', err);
    res.status(500).json({ error: 'Failed to fetch diary entries' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// RITUAL ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/rituals
 * Get all rituals for user
 */
router.get('/rituals', async (req, res) => {
  try {
    const { userId } = req.user;
    const userRituals = await db
      .select()
      .from(rituals)
      .where(eq(rituals.userId, userId))
      .orderBy(desc(rituals.lastActivatedAt));

    res.json({ success: true, data: userRituals });
  } catch (err) {
    console.error('Get rituals error:', err);
    res.status(500).json({ error: 'Failed to fetch rituals' });
  }
});

/**
 * POST /api/rituals
 * Create or propose a new ritual
 */
router.post('/rituals', async (req, res) => {
  try {
    const { userId } = req.user;
    const { name, description, morningEnergy, afternoonEnergy, eveningStates, dayOfWeek } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Ritual name required' });
    }

    const ritual = await db.insert(rituals).values({
      userId,
      name,
      description: description || null,
      morningEnergy: morningEnergy || null,
      afternoonEnergy: afternoonEnergy || null,
      eveningStates: eveningStates || [],
      dayOfWeek: dayOfWeek || null,
      detectionScore: 0,
      efficiencyScore: 0,
      completionRate: 0,
      isActive: true,
      autoReminder: false
    }).returning();

    res.json({ success: true, data: ritual[0] });
  } catch (err) {
    console.error('Create ritual error:', err);
    res.status(500).json({ error: 'Failed to create ritual' });
  }
});

/**
 * PATCH /api/rituals/:ritualId
 * Update ritual (toggle active, reminder, etc)
 */
router.patch('/rituals/:ritualId', async (req, res) => {
  try {
    const { userId } = req.user;
    const { ritualId } = req.params;
    const { isActive, autoReminder, reminderTime } = req.body;

    const updated = await db
      .update(rituals)
      .set({
        isActive: isActive !== undefined ? isActive : undefined,
        autoReminder: autoReminder !== undefined ? autoReminder : undefined,
        reminderTime: reminderTime || undefined,
        updatedAt: new Date()
      })
      .where(
        and(
          eq(rituals.id, ritualId),
          eq(rituals.userId, userId)
        )
      )
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({ error: 'Ritual not found' });
    }

    res.json({ success: true, data: updated[0] });
  } catch (err) {
    console.error('Update ritual error:', err);
    res.status(500).json({ error: 'Failed to update ritual' });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * GET /api/energy/constants
 * Return available energy types and emotional states
 */
router.get('/constants', (req, res) => {
  res.json({
    success: true,
    data: {
      energyTypes: ENERGY_TYPES,
      emotionalStates: EMOTIONAL_STATES,
      intensityScale: [
        { value: 1, label: 'Mínima (1/5)', description: 'Apenas tocando o trabalho' },
        { value: 2, label: 'Baixa (2/5)', description: 'Presente, mas cansado' },
        { value: 3, label: 'Normal (3/5)', description: 'Equilibrado, dia típico' },
        { value: 4, label: 'Alta (4/5)', description: 'No flow, produtivo' },
        { value: 5, label: 'Pico (5/5)', description: 'Melhor versão, impossível parar' }
      ]
    }
  });
});

export default router;
