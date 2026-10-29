import { rateLimit } from 'express-rate-limit';

// Slows down password guessing: 10 FAILED logins per 15 minutes per IP address.
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true, // only failed attempts count
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      error: {
        code: 'TOO_MANY_ATTEMPTS',
        message: 'Too many failed login attempts. Please try again later.',
      },
    });
  },
});