import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin';
import { updateSettings } from '../services/settingsService';
import { updateSettingsSchema } from '../validation/settingsSchemas';

export const adminSettingsRouter = Router();

// Every route in this file needs a logged-in admin.
adminSettingsRouter.use(requireAdmin);

// PUT /api/admin/settings   body: the complete settings
adminSettingsRouter.put('/', async (req, res) => {
  const data = updateSettingsSchema.parse(req.body);
  res.json({ settings: await updateSettings(data) });
});