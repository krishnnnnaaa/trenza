import 'dotenv/config';
import ws from 'ws';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined');
}

neonConfig.webSocketConstructor = ws

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle({
  client: pool
});