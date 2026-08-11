import { resolve } from 'node:path';
import { config } from 'dotenv';
import { env, defineConfig } from 'prisma/config';

config({ path: resolve(__dirname, '../../../.env') });

export default defineConfig({
  schema: 'schema.prisma',
  migrations: {
    path: 'migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
