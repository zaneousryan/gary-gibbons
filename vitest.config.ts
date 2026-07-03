import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['app/src/**/*.test.ts', 'tools/**/*.test.ts'],
    environment: 'node',
  },
  resolve: {
    alias: {
      '@engine': path.resolve(__dirname, 'app/src/engine'),
      '@systems': path.resolve(__dirname, 'app/src/systems'),
      '@scenes': path.resolve(__dirname, 'app/src/scenes'),
      '@ui': path.resolve(__dirname, 'app/src/ui'),
      '@content': path.resolve(__dirname, 'app/src/content'),
      '@dev': path.resolve(__dirname, 'app/src/dev'),
    },
  },
});
