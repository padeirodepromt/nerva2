// src/api/calendar/routes.js
// Events & Routines API endpoints

import { Router } from 'express';
import { db } from '../../db/index.js';
import { events, routines } from '../../db/schema.js';
import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { createId } from '../../utils/id.js';
import { getUserEmail } from '../auth/middleware.js';

const router = Router();

// ═══════════════════════════════════════════════════════════════════════════
// EVENTS ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/calendar/events
 * Create a new event
 */
router.post('/events', getUserEmail, async (req, res) => {
  try {
    const { title, date, description, projectId } = req.body;
    const email = req.user.email;

    if (!title || !date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }

    const newEvent = await db.insert(events).values({
      id: createId('evt'),
      title,
      date,
      description,
      projectId,
      createdBy: email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.json(newEvent[0]);
  } catch (error) {
    console.error('POST /events error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/calendar/events
 * List all events (optionally filtered by date range or project)
 */
router.get('/events', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { startDate, endDate, projectId } = req.query;

    let query = db.select().from(events).where(
      and(
        eq(events.createdBy, email),
        eq(events.deletedAt, null)
      )
    );

    if (startDate && endDate) {
      query = query.where(
        and(
          gte(events.date, startDate),
          lte(events.date, endDate)
        )
      );
    }

    if (projectId) {
      query = query.where(eq(events.projectId, projectId));
    }

    const result = await query.orderBy(desc(events.date));
    res.json(result);
  } catch (error) {
    console.error('GET /events error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/calendar/events/:id
 * Get single event
 */
router.get('/events/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;

    const result = await db.select().from(events).where(
      and(
        eq(events.id, id),
        eq(events.createdBy, email),
        eq(events.deletedAt, null)
      )
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('GET /events/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/calendar/events/:id
 * Update event
 */
router.put('/events/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;
    const { title, date, description, projectId } = req.body;

    const result = await db.update(events)
      .set({
        title,
        date,
        description,
        projectId,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(events.id, id),
          eq(events.createdBy, email)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('PUT /events/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/calendar/events/:id
 * Soft delete event
 */
router.delete('/events/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;

    const result = await db.update(events)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(events.id, id),
          eq(events.createdBy, email)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted', id });
  } catch (error) {
    console.error('DELETE /events/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ═══════════════════════════════════════════════════════════════════════════
// ROUTINES ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * POST /api/calendar/routines
 * Create a new routine
 */
router.post('/routines', getUserEmail, async (req, res) => {
  try {
    const { title, type, startHour, endHour, days } = req.body;
    const email = req.user.email;

    if (!title || !type || startHour === undefined || endHour === undefined || !days) {
      return res.status(400).json({ error: 'Title, type, hours, and days are required' });
    }

    if (endHour <= startHour) {
      return res.status(400).json({ error: 'End hour must be after start hour' });
    }

    const newRoutine = await db.insert(routines).values({
      id: createId('rtn'),
      title,
      type,
      startHour,
      endHour,
      days: Array.isArray(days) ? days : JSON.parse(days),
      createdBy: email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    res.json(newRoutine[0]);
  } catch (error) {
    console.error('POST /routines error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/calendar/routines
 * List all routines
 */
router.get('/routines', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;

    const result = await db.select().from(routines).where(
      and(
        eq(routines.createdBy, email),
        eq(routines.deletedAt, null)
      )
    ).orderBy(desc(routines.createdAt));

    res.json(result);
  } catch (error) {
    console.error('GET /routines error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/calendar/routines/:id
 * Get single routine
 */
router.get('/routines/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;

    const result = await db.select().from(routines).where(
      and(
        eq(routines.id, id),
        eq(routines.createdBy, email),
        eq(routines.deletedAt, null)
      )
    );

    if (result.length === 0) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('GET /routines/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * PUT /api/calendar/routines/:id
 * Update routine
 */
router.put('/routines/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;
    const { title, type, startHour, endHour, days } = req.body;

    if (endHour && startHour && endHour <= startHour) {
      return res.status(400).json({ error: 'End hour must be after start hour' });
    }

    const updateData = {
      updatedAt: new Date(),
    };
    if (title) updateData.title = title;
    if (type) updateData.type = type;
    if (startHour !== undefined) updateData.startHour = startHour;
    if (endHour !== undefined) updateData.endHour = endHour;
    if (days) updateData.days = Array.isArray(days) ? days : JSON.parse(days);

    const result = await db.update(routines)
      .set(updateData)
      .where(
        and(
          eq(routines.id, id),
          eq(routines.createdBy, email)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.json(result[0]);
  } catch (error) {
    console.error('PUT /routines/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * DELETE /api/calendar/routines/:id
 * Soft delete routine
 */
router.delete('/routines/:id', getUserEmail, async (req, res) => {
  try {
    const email = req.user.email;
    const { id } = req.params;

    const result = await db.update(routines)
      .set({ deletedAt: new Date() })
      .where(
        and(
          eq(routines.id, id),
          eq(routines.createdBy, email)
        )
      )
      .returning();

    if (result.length === 0) {
      return res.status(404).json({ error: 'Routine not found' });
    }

    res.json({ message: 'Routine deleted', id });
  } catch (error) {
    console.error('DELETE /routines/:id error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
