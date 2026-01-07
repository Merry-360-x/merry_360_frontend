const { test, expect } = require('@playwright/test');

test.describe('Tours + Transport (public)', () => {
  test('tours list loads', async ({ page }) => {
    await page.goto('/tours');
    await expect(page.getByPlaceholder('Search tours by name or location...')).toBeVisible();

    const durationSelect = page
      .locator('select')
      .filter({ has: page.locator('option', { hasText: 'Any Duration' }) })
      .first();
    await expect(durationSelect).toBeVisible();
    await expect(durationSelect.locator('option')).toHaveText([
      'Any Duration',
      'Half Day',
      'Full Day',
      'Multi Day'
    ]);
  });

  test('transport services loads', async ({ page }) => {
    await page.goto('/transport');
    // Transport page uses i18n for headings; assert stable structure instead.
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('select option[value="taxi"]')).toHaveCount(1);
    await expect(page.locator('select option[value="shuttle"]')).toHaveCount(1);
    await expect(page.locator('select option[value="rental"]')).toHaveCount(1);
  });

  test('transport list loads', async ({ page }) => {
    await page.goto('/transport/list');
    await expect(page.getByPlaceholder('Search transport services')).toBeVisible();
    await expect(page.getByText('Transportation Services')).toBeVisible();
  });
});
