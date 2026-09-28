import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

// Unit tests only: pure logic, no Twenty server needed.
export default defineConfig({
  plugins: [
    tsconfigPaths({
      projects: ['tsconfig.spec.json'],
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    include: ['src/**/*.test.ts'],
  },
});
