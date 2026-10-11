const { test, expect } = require('@playwright/test');
const routes = ['/', '/solutions', '/services', '/industries', '/company', '/careers', '/contact'];

async function settled(page) {
  await page.waitForTimeout(1800);
  await expect(page.locator('.lf-curtain')).toHaveCount(0, { timeout: 15000 });
  await expect(page.locator('.lf-page')).toHaveCSS('opacity', '1');
  await expect(page.locator('.lf-chapter-content h1')).toHaveCount(1);
  await page.waitForTimeout(250);
}

async function crossPanel(page, backward) {
  await page.evaluate(async (back) => {
    const path = location.pathname;
    const panel = document.querySelector(back ? '.lf-previous' : '.lf-next:not(.lf-previous)');
    for (let i = 0; i <= 24; i++) {
      const top = panel.getBoundingClientRect().top + window.scrollY;
      const start = back ? top + panel.offsetHeight - innerHeight : top - innerHeight;
      const end = back ? top : top + panel.offsetHeight - innerHeight;
      window.scrollTo(0, start + (end - start) * i / 24);
      await new Promise(resolve => setTimeout(resolve, 50));
      if (location.pathname !== path) break;
    }
    for (let i = 0; i < 3 && location.pathname === path; i++) {
      window.scrollTo(0, back ? 0 : document.documentElement.scrollHeight);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }, backward);
}

test('every chapter flows forward, backward, then forward again', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  test.setTimeout(120000);
  for (let i = 0; i < routes.length - 1; i++) {
    await page.goto(routes[i]);
    await settled(page);
    await expect(page).toHaveURL(new RegExp(`${routes[i] === '/' ? '/' : routes[i]}$`));
    await crossPanel(page, false);
    await expect(page).toHaveURL(new RegExp(`${routes[i + 1]}$`));
    await settled(page);
    const arrival = await page.evaluate(() => ({ y: scrollY, start: document.querySelector('.lf-chapter-content').offsetTop }));
    expect(Math.abs(arrival.y - arrival.start)).toBeLessThan(5);
    await crossPanel(page, true);
    await expect(page).toHaveURL(new RegExp(`${routes[i] === '/' ? '/' : routes[i]}$`));
    await settled(page);
    await crossPanel(page, false);
    await expect(page).toHaveURL(new RegExp(`${routes[i + 1]}$`));
    await settled(page);
    await expect(page).toHaveURL(new RegExp(`${routes[i + 1]}$`));
  }
  expect(errors).toEqual([]);
});

test('reduced motion offers explicit previous and next links', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/services');
  await expect(page.getByRole('region', { name: 'Previous: AI Solutions' })).toContainText('AI Solutions');
  await expect(page.getByRole('region', { name: 'Next: Industries' })).toContainText('Industries');
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(500);
  await expect(page).toHaveURL(/\/services$/);
});
