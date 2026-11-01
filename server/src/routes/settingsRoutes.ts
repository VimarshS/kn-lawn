import { Router } from 'express';
import { getPublicSettings } from '../services/settingsService';

export const settingsRouter = Router();

// GET /api/settings   Public. Contact details and venue information.
settingsRouter.get('/', async (_req, res) => {
  res.json({ settings: await getPublicSettings() });
});