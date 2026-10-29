import { z } from 'zod';

// z.string() guarantees plain text, so a request like {"email": {"$ne": ""}} is refused.
// Extra fields in the request are dropped, never passed on.
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(128),
});