import { createHash, randomBytes } from 'node:crypto';
import { Types } from 'mongoose';
import { AdminSession } from '../models/AdminSession';

export const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, whatever happens
export const SESSION_IDLE_MS = 24 * 60 * 60 * 1000; // 24 hours without being used

// A fast hash is fine here: the token is 256 random bits, so it cannot be guessed.
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Starts a session. Returns the token to put in the cookie (it is never stored as it is). */
export async function createSession(
  userId: Types.ObjectId,
): Promise<{ token: string; expiresAt: Date }> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS);
  await AdminSession.create({ tokenHash: hashToken(token), user: userId, expiresAt });
  return { token, expiresAt };
}

/** Returns the session for a cookie token, or null if it is unknown, expired or idle. */
export async function findValidSession(token: string) {
  if (!token || token.length > 200) return null;

  const session = await AdminSession.findOne({ tokenHash: hashToken(token) });
  if (!session) return null;

  const now = Date.now();
  const expired = session.expiresAt.getTime() <= now;
  const idle = now - session.lastSeenAt.getTime() > SESSION_IDLE_MS;
  if (expired || idle) {
    await session.deleteOne();
    return null;
  }

  // Record activity, but at most once a minute, so we don't write on every request.
  if (now - session.lastSeenAt.getTime() > 60_000) {
    session.lastSeenAt = new Date(now);
    await session.save();
  }
  return session;
}

/** Ends one session (logout). */
export async function destroySession(token: string): Promise<void> {
  if (!token || token.length > 200) return;
  await AdminSession.deleteOne({ tokenHash: hashToken(token) });
}

/** Ends every session of one user (used after a password change). */
export async function destroyAllSessionsForUser(userId: Types.ObjectId): Promise<void> {
  await AdminSession.deleteMany({ user: userId });
}