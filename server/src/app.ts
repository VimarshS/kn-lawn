import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { authRouter } from './routes/authRoutes';
import { settingsRouter } from './routes/settingsRoutes';
import { requireTrustedOrigin } from './middleware/requireTrustedOrigin';

export function createApp() {
  const app = express();

  app.use(helmet()); // standard security headers (it also removes "X-Powered-By")
  app.use(express.json({ limit: '100kb' })); // refuse oversized request bodies
  app.use(cookieParser());
    app.use('/api', requireTrustedOrigin);

  // A "health check": a URL that answers "yes, the server is alive"
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/api/auth', authRouter);
  app.use('/api/settings', settingsRouter);

  // These two must stay last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}