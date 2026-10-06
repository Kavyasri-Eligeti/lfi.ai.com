// End-to-end checks of the production build in real Chrome, at desktop and
// mobile sizes. Full-page screenshots are written to e2e/screenshots/.
const { test, expect } = require('@playwright/test');

const ROUTES = [
  ['/', /intelligence that moves business forward/i],
  ['/solutions', /enterprise solutions and ai products/i],
  ['/services', /seven practices/i],
  ['/industries', /eight industries/i],
  ['/company', /driving innovation and transformation/i],
  ['/careers', /world-leading innovative team/i],
  ['/contact', /what you want to build/i],
];

const watchConsole = (page) => {
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (err) => errors.push(err.message));
  return errors;
};

for (const [route, title] of ROUTES) {
  test(`${route} renders cleanly`, async ({ page }, info) => {
    const errors = watchConsole(page);
    await page.goto(route, { waitUntil: 'networkidle' });
    await expect(page.getByRole('heading', { level: 1, name: title })).toBeVisible();
    // No horizontal page scroll at this viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // Scroll through once so in-view reveals and lazy images run, then capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    const name = route === '/' ? 'home' : route.slice(1);
    await page.screenshot({ path: `e2e/screenshots/${info.project.name}-${name}.png`, fullPage: true });
    expect(errors).toEqual([]);
  });
}

test('legacy catalogue and tool routes still load', async ({ page }) => {
  for (const route of ['/catalogue', '/BankingAnalytics', '/TelecomAnalytics', '/BankingTelecomAnalytics', '/resume-summarizer', '/jd-cv-comparison', '/golf-analyzer']) {
    const res = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(res.status()).toBe(200);
    await expect(page.locator('#root')).not.toBeEmpty();
  }
});

test('old /demos link lands on the catalogue', async ({ page }) => {
  await page.goto('/demos');
  await expect(page).toHaveURL(/\/solutions#products$/);
  await expect(page.getByRole('heading', { level: 2, name: /the lfi ai catalogue/i })).toBeVisible();
});

test('keyboard: the skip link is the first stop and moves to main', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: /skip to main content/i });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
});

test('catalogue search filters results', async ({ page }) => {
  await page.goto('/solutions#products');
  await page.getByLabel('Search demos').fill('fraud');
  await expect(page.getByRole('status').filter({ hasText: 'Showing' })).toContainText(/Showing [1-9] of 38/);
  await page.getByRole('button', { name: 'Clear filters' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Showing' })).toContainText('Showing 38 of 38');
});

test('mobile menu opens, traps the page behind and closes with Escape', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile', 'mobile only');
  await page.goto('/');
  const button = page.getByRole('button', { name: 'Menu' });
  await button.click();
  await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeVisible();
  expect(await page.evaluate(() => document.getElementById('main').inert)).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('navigation', { name: 'Mobile' })).toBeHidden();
  await expect(button).toBeFocused();
});

test('the homepage hero plays the WebGL DNA theatre', async ({ page }, info) => {
  const errors = watchConsole(page);
  await page.goto('/');
  await expect(page.locator('.th-stage.is-ready canvas')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('.th-hero--still')).toHaveCount(0);
  await page.mouse.move(1100, 400);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `e2e/screenshots/${info.project.name}-hero-webgl.png` });
  expect(errors).toEqual([]);
});

test('reduced motion keeps the still hero and the card deck', async ({ browser }, info) => {
  test.skip(info.project.name !== 'desktop', 'desktop only');
  const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  await page.goto('/');
  await page.waitForTimeout(3500);
  await expect(page.locator('.th-stage canvas')).toHaveCount(0);
  await expect(page.locator('.th-hero--still')).toHaveCount(1);
  await context.close();
});
