// Browser tests against the production build (npm run build first).
// Uses the locally installed Google Chrome, so no browser download is needed.
const { defineConfig, devices } = require('@playwright/test');
const port = Number(process.env.LFI_E2E_PORT || 5050);

module.exports = defineConfig({
  testDir: './e2e',
  outputDir: './e2e/.results',
  timeout: 45000,
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${port}`,
    channel: 'chrome',
    trace: 'off',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } },
  ],
  webServer: {
    command: `node scripts/serve-build.js ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
  },
});
