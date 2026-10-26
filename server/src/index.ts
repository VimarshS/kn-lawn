import express from 'express';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const app = express();

// Don't announce to the world that we use Express (a tiny security habit)
app.disable('x-powered-by');

// A "health check": a URL that answers "yes, the server is alive"
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

async function start(): Promise<void> {
  try {
    await connectDatabase();
  } catch (error) {
    // Print the reason only, never the connection address (it holds the password)
    console.error('Could not connect to MongoDB:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  app.listen(env.PORT, () => {
    console.log(`API server listening on http://localhost:${env.PORT}`);
  });
}

void start();