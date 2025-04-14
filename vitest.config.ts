import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/resources/**'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', 'tests/**/*.ts', '**/*.d.ts'],
    },
  },
  resolve: {
    alias: {
      '@framework': resolve(__dirname, 'src'),
      '@plugins': resolve(__dirname, 'plugins'),
    },
  },
});