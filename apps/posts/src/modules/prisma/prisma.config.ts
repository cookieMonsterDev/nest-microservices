import { resolve } from 'node:path';
import { config } from 'dotenv';
import { defineConfig } from 'prisma/config';

config({ path: resolve(__dirname, '../../../.env') });

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    // Use process.env (not env()) so `prisma generate` works without DATABASE_URL (e.g. CI).
    url: process.env.DATABASE_URL,
  },
});
