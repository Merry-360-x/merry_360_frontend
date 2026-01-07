const { defineConfig, devices } = require('@playwright/test');

// Load local env files for E2E runs.
// Precedence (last wins): .env -> .env.local -> .env.e2e.local
// This keeps credentials out of shell history and allows `npx playwright test` to just work.
try {
  const path = require('path');
  const dotenv = require('dotenv');

  const cwd = __dirname;
  const candidates = ['.env', '.env.local', '.env.e2e.local'];
  for (const filename of candidates) {
    dotenv.config({ path: path.join(cwd, filename), override: true });
  }
} catch {
  // If dotenv isn't available for some reason, continue without it.
}

const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4173';
const shouldStartWebServer = !process.env.E2E_NO_WEB_SERVER;

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: shouldStartWebServer
    ? {
        command: 'npm run dev -- --host 127.0.0.1 --port 4173 --strictPort',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
