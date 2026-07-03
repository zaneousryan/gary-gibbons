import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

// Repo layout (ALETHEIA.md §4): the Vite root is app/, but /content and /assets
// live at the repo root so they stay data, not source. fs.allow lets the dev
// server reach them; the content loader glob-imports ../../content/**/*.json.
export default defineConfig({
  root: 'app',
  plugins: [react(), tailwindcss()],
  publicDir: path.resolve(__dirname, 'assets'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
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
  server: {
    fs: {
      allow: [path.resolve(__dirname)],
    },
  },
});
