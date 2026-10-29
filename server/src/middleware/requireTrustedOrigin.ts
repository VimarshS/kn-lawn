import type { RequestHandler } from 'express';
import { env } from '../config/env';
import { HttpError } from './errorHandler';

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
const allowedOrigin = new URL(env.CLIENT_ORIGIN).origin;

/**
 * Refuses state-changing requests that a browser sends from another website.
 * Browsers always attach an Origin header to such requests, and a malicious
 * website cannot fake it. Requests with no Origin (curl, scripts) are not
 * browser attacks, so they pass.
 */
export const requireTrustedOrigin: RequestHandler = (req, _res, next) => {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (origin && origin !== allowedOrigin) {
    throw new HttpError(403, 'FORBIDDEN_ORIGIN', 'Request not allowed from this website');
  }
  next();
};