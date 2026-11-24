import { Router } from 'express';
import { HttpError } from '../middleware/errorHandler';
import { requireAdmin } from '../middleware/requireAdmin';
import {
  createEvent,
  deleteEvent,
  getAdminEvent,
  listAdminEvents,
  setEventStatus,
  updateEvent,
} from '../services/eventService';
import { eventInputSchema, eventStatusSchema } from '../validation/eventSchemas';

export const adminEventRouter = Router();

// Every route in this file needs a logged-in admin.
adminEventRouter.use(requireAdmin);

// An id that is not 24 hex characters cannot exist, so it is simply "not found".
function eventId(raw: unknown): string {
  if (typeof raw !== 'string' || !/^[a-f0-9]{24}$/i.test(raw)) {
    throw new HttpError(404, 'EVENT_NOT_FOUND', 'Event not found');
  }
  return raw;
}

adminEventRouter.get('/', async (_req, res) => {
  res.json({ events: await listAdminEvents() });
});

adminEventRouter.get('/:id', async (req, res) => {
  res.json({ event: await getAdminEvent(eventId(req.params.id)) });
});

adminEventRouter.post('/', async (req, res) => {
  const input = eventInputSchema.parse(req.body);
  res.status(201).json({ event: await createEvent(input) });
});

adminEventRouter.put('/:id', async (req, res) => {
  const input = eventInputSchema.parse(req.body);
  res.json({ event: await updateEvent(eventId(req.params.id), input) });
});

adminEventRouter.patch('/:id/status', async (req, res) => {
  const { status } = eventStatusSchema.parse(req.body);
  res.json({ event: await setEventStatus(eventId(req.params.id), status) });
});

adminEventRouter.delete('/:id', async (req, res) => {
  await deleteEvent(eventId(req.params.id));
  res.status(204).end();
});