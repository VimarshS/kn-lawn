import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import { HttpError } from '../middleware/errorHandler';
import { loginRateLimiter } from '../middleware/rateLimiters';
import { AdminUser } from '../models/AdminUser';
import { createSession, destroySession } from '../services/sessionService';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  clearSessionCookie,
  SESSION_COOKIE_NAME,
  setSessionCookie,
} from '../utils/sessionCookie';
import { loginSchema } from '../validation/authSchemas';
import { requireAdmin } from '../middleware/requireAdmin';
import { toPublicAdmin } from '../utils/publicAdmin';

export const authRouter = Router();

// A throwaway hash. When the email is unknown we still verify against it, so the
// answer takes the same time and does not reveal which emails have accounts.
const dummyHash = hashPassword(randomBytes(16).toString('hex'));

// /** The only admin fields that may ever be sent to a browser. */
// function toPublicAdmin(user: {
//   _id: { toString(): string };
//   name: string;
//   email: string;
//   role: string;
// }) {
//   return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
// }

// POST /api/auth/login   body: { email, password }
authRouter.post('/login', loginRateLimiter, async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  const user = await AdminUser.findOne({ email }).select('+passwordHash');
  const passwordOk = await verifyPassword(user?.passwordHash ?? (await dummyHash), password);

  if (!user || !user.isActive || !passwordOk) {
    throw new HttpError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect');
  }

  // If this browser already had a session, end it. Every login starts a fresh one.
  const oldToken: unknown = req.cookies?.[SESSION_COOKIE_NAME];
  if (typeof oldToken === 'string') await destroySession(oldToken);

  const { token, expiresAt } = await createSession(user._id);
  setSessionCookie(res, token, expiresAt);
  await AdminUser.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

  res.json({ user: toPublicAdmin(user) });
});

// POST /api/auth/logout   no body. Always succeeds.
authRouter.post('/logout', async (req, res) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE_NAME];
  if (typeof token === 'string') await destroySession(token);
  clearSessionCookie(res);
  res.status(204).end();
});

// GET /api/auth/me   Who am I? The website calls this when it loads.
authRouter.get('/me', requireAdmin, (req, res) => {
  res.json({ user: req.admin });
});