import { existsSync } from 'node:fs';
import { z } from 'zod';

// Load server/.env if it exists. On a real host there is no .env file;
// the hosting service provides the settings instead, so this is optional.
if (existsSync('.env')) {
  process.loadEnvFile();
}

// The list of settings the server needs, and the rules each must follow.
const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:3000'),
  MONGODB_URI: z.string().startsWith('mongodb'),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error('Invalid environment settings:');
  for (const issue of result.error.issues) {
    // Print only the setting name and the problem, never the value.
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = result.data;