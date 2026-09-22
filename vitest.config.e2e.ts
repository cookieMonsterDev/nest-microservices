import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    root: './',
    include: ['apps/**/*.e2e-spec.ts'],
    // e2e specs share a real Postgres DB per app (deleteMany in beforeEach/afterAll) —
    // run spec files sequentially so multiple files for the same app don't race.
    fileParallelism: false,
  },
});
