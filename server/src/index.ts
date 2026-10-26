import express from 'express';
import { env } from './config/env';

const app = express();

// Don't announce to the world that we use Express (a tiny security habit)
app.disable('x-powered-by');

// A "health check": a URL that answers "yes, the server is alive"
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});