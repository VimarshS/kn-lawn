import type { RequestHandler } from 'express';
import { AdminUser } from '../models/AdminUser';
import { findValidSession } from '../services/sessionService';
import { type PublicAdmin, toPublicAdmin } from '../utils/publicAdmin';
import { SESSION_COOKIE_NAME } from '../utils/sessionCookie';
import { HttpError } from './errorHandler';

// Teach TypeScript that a request that passed the guard carries "req.admin".
declare module 'express-serve-static-core' {
  interface Request {
    admin?: PublicAdmin;
  }
}

/** Lets a request through only if it carries a valid admin session. */
export const requireAdmin: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.[SESSION_COOKIE_NAME];
  const session = typeof token === 'string' ? await findValidSession(token) : null;
  const user = session ? await AdminUser.findById(session.user) : null;

  if (!user || !user.isActive) {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Please log in');
  }

  req.admin = toPublicAdmin(user);
  next();
};