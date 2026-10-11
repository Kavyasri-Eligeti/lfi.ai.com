const { test, expect } = require('@playwright/test');

test('services portfolio retains content and supports practice navigation', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/services', { waitUntil: 'networkidle' });
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Seven proven practices, and a new AI practice');
  await expect(page.locator('.sp-practice')).toHaveCount(8);
  await expect(page.locator('.sp-offering')).toHaveCount(26);
  await expect(page.locator('.sp-group__items li')).toHaveCount(12);
  const theme = await page.evaluate(() => {
    const heading = getComputedStyle(document.querySelector('.lf-page-hero h1'));
    const summary = getComputedStyle(document.querySelector('.sp-offering__name'));
    const copy = getComputedStyle(document.querySelector('.sp-practice__overview p'));
    const feature = getComputedStyle(document.querySelector('.sp-practice__feature'));
    const offering = getComputedStyle(document.querySelector('.sp-offering'));
    return { fonts: [heading.fontFamily, summary.fontFamily, copy.fontFamily], cards: [feature.backgroundImage, offering.backgroundImage], hero: getComputedStyle(document.querySelector('.lf-page-hero')).backgroundColor };
  });
  expect(new Set(theme.fonts).size).toBe(1);
  expect(theme.cards[0]).toBe(theme.cards[1]);
  expect(theme.hero).toBe('rgba(0, 0, 0, 0)');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  await page.getByRole('navigation', { name: 'Explore our practices' }).getByRole('link', { name: /Engineering/ }).click();
  const offering = page.locator('#engineering .sp-offering').first();
  await offering.locator('summary').click();
  await expect(offering).toHaveAttribute('open', '');
  await expect(offering.locator('.sp-offering__body')).toBeVisible();
  await expect(offering.getByRole('link')).toHaveAttribute('href', /application-development$/);
  await page.screenshot({ path: `e2e/screenshots/${info.project.name}-services-engineering.png` });
  await page.getByRole('navigation', { name: 'Services on this page' }).getByRole('link', { name: /AI Services/ }).click();
  await expect(page).toHaveURL(/#ai-services$/);
  await expect(page.locator('#ai-services h2')).toBeInViewport();
  await expect(page.locator('.sp-index__list a[aria-current]')).toContainText('AI Services');
  await expect(page.locator('#ai-services').getByRole('link', { name: 'Talk to our AI team' })).toHaveAttribute('href', '/contact');
  expect(errors).toEqual([]);
});

test('services deep links land on the matching practice', async ({ page }) => {
  await page.goto('/services#it-infrastructure', { waitUntil: 'networkidle' });
  await expect(page.locator('#it-infrastructure h2')).toBeInViewport();
  await expect(page.locator('#it-infrastructure .sp-group')).toHaveCount(3);
});
