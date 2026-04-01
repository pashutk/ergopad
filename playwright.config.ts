import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  ignoreSnapshots: !!process.env.CI,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:5173/ergopad',
    reuseExistingServer: !process.env.CI,
  },
});
