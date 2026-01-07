const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

test.describe('Profile', () => {
  test('update personal info (smoke)', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;

    test.skip(!email || !password, 'E2E_USER_EMAIL/E2E_USER_PASSWORD not set');

    await loginViaUI(page, { email, password });

    await page.goto('/profile');

    // The profile defaults to the Trips tab; switch to the Personal Info tab first.
    await page.getByRole('button', { name: /personal/i }).click();

    // Enable editing
    await page.getByRole('button', { name: /edit/i }).click();

    const firstName = `E2E${Date.now()}`;
    const lastName = 'User';

    // Fill the first/last name inputs (placeholders are stable and not i18n-driven).
    await page.getByPlaceholder('John', { exact: true }).fill(firstName);
    await page.getByPlaceholder('Doe', { exact: true }).fill(lastName);

    // Accept the alert that confirms update.
    page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await page.getByRole('button', { name: /save changes/i }).click();

    // Should be out of edit mode (save button disappears)
    await expect(page.getByRole('button', { name: /save changes/i })).toHaveCount(0);
  });
});
