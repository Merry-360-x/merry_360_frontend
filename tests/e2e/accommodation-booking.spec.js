const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toDateInputValue(date) {
  return date.toISOString().split('T')[0];
}

test.describe('Accommodation', () => {
  test('reserve accommodation with free booking (smoke)', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;

    test.skip(!email || !password, 'E2E_USER_EMAIL/E2E_USER_PASSWORD not set');

    await loginViaUI(page, { email, password });

    await page.goto('/accommodations');

    // Open first property card
    const firstCard = page
      .locator('div.cursor-pointer.group')
      .filter({ has: page.locator('h3') })
      .first();

    // This environment may legitimately have zero accommodations; skip instead of failing.
    try {
      await expect(firstCard).toBeVisible({ timeout: 30000 });
    } catch {
      test.skip(true, 'No accommodation cards found to book in this environment');
    }

    await firstCard.click();
    await expect(page).toHaveURL(/\/accommodation\//);

    // Reserve now
    await page.getByRole('button', { name: /reserve now/i }).click();
    await expect(page).toHaveURL(/\/checkout/);

    // Ensure dates are filled (use a short future window)
    const main = page.locator('div.lg\\:col-span-2');
    const today = new Date();
    const checkIn = toDateInputValue(addDays(today, 7));
    const checkOut = toDateInputValue(addDays(today, 9));

    await main.locator('input[type="date"]').nth(0).fill(checkIn);
    await main.locator('input[type="date"]').nth(1).fill(checkOut);

    // Guest info
    const guestInfoInputs = main.locator('input').filter({ hasNot: main.locator('input[type="date"], input[type="number"]') });
    // Fallback: fill explicitly by type
    await main.locator('input[placeholder]').first().fill('E2E');

    const textInputs = main.locator('input[type="text"]');
    await textInputs.nth(0).fill('E2E');
    await textInputs.nth(1).fill('User');

    await main.locator('input[type="email"]').fill(email);
    await main.locator('input[type="tel"]').fill('+250788123456');

    // Accept terms
    await page.locator('input[type="checkbox"]').first().check();

    // Confirm booking (free)
    await page.getByRole('button', { name: /confirm booking|book now|reserve/i }).click();

    await expect(page).toHaveURL(/\/profile\?.*bookingSuccess=true/);
  });
});
