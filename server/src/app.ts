import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.use(helmet()); // standard security headers (it also removes "X-Powered-By")
  app.use(express.json({ limit: '100kb' })); // refuse oversized request bodies
  app.use(cookieParser());

  // A "health check": a URL that answers "yes, the server is alive"
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // Real routes will be added here, one phase at a time.

  // These two must stay last.
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}