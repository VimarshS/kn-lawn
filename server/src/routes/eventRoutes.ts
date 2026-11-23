import { Router } from 'express';
import { z } from 'zod';
import { HttpError } from '../middleware/errorHandler';
import { EVENT_CATEGORIES } from '../models/LawnEvent';
import { findPublicEventBySlug, listPublicEvents } from '../services/eventService';

export const eventRouter = Router();

// The category must be one of the known values. This also blocks odd input such as ?category[]=x
const listQuerySchema = z.object({ category: z.enum(EVENT_CATEGORIES).optional() });

// GET /api/events?category=wedding   Public. Published events only.
eventRouter.get('/', async (req, res) => {
  const { category } = listQuerySchema.parse(req.query);
  res.json({ events: await listPublicEvents(category) });
});

// GET /api/events/:slug   Public. 404 for a missing event AND for a draft.
eventRouter.get('/:slug', async (req, res) => {
  const event = await findPublicEventBySlug(String(req.params.slug));
  if (!event) throw new HttpError(404, 'EVENT_NOT_FOUND', 'Event not found');
  res.json({ event });
});