import type { CookieOptions, Response } from 'express';
import { env } from '../config/env';

export const SESSION_COOKIE_NAME = 'kn_session';

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true, // JavaScript on the page cannot read this cookie
    secure: env.NODE_ENV === 'production', // HTTPS only on the real website
    sameSite: 'lax', // not sent with most cross-site requests
    path: '/',
  };
}

export function setSessionCookie(res: Response, token: string, expiresAt: Date): void {
  res.cookie(SESSION_COOKIE_NAME, token, { ...cookieOptions(), expires: expiresAt });
}

export function clearSessionCookie(res: Response): void {
  res.clearCookie(SESSION_COOKIE_NAME, cookieOptions());
}