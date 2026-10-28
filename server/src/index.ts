import { createApp } from './app';
import { connectDatabase } from './config/database';
import { env } from './config/env';

async function start(): Promise<void> {
  try {
    await connectDatabase();
  } catch (error) {
    // Print the reason only, never the connection address (it holds the password)
    console.error('Could not connect to MongoDB:', error instanceof Error ? error.message : error);
    process.exit(1);
  }

  createApp().listen(env.PORT, () => {
    console.log(`API server listening on http://localhost:${env.PORT}`);
  });
}

void start();