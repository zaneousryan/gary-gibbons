import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests-e2e',
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5917',
    viewport: { width: 1920, height: 1080 },
  },
  webServer: {
    command: 'npm run dev -- --port 5917 --strictPort',
    url: 'http://localhost:5917',
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
