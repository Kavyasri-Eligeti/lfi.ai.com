// Browser tests against the production build (npm run build first).
// Uses the locally installed Google Chrome, so no browser download is needed.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  timeout: 45000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5050',
    channel: 'chrome',
    trace: 'off',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: 'node scripts/serve-build.js 5050',
    url: 'http://localhost:5050',
    reuseExistingServer: true,
  },
});
