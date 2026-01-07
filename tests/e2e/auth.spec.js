const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

test.describe('Auth', () => {
  test('sign in and sign out', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;

    test.skip(!email || !password, 'E2E_USER_EMAIL/E2E_USER_PASSWORD not set');

    await loginViaUI(page, { email, password });
  // Depending on the user's role, the app may land on a role dashboard.
  await expect(page).toHaveURL(/\/(profile|admin|vendor|staff)/);

  // The logout button is reliably present on the Profile page.
  await page.goto('/profile');

    // Use mobile viewport to avoid the desktop confirm dialog.
    await page.setViewportSize({ width: 390, height: 844 });

    await expect(page.getByRole('button', { name: /logout/i })).toBeVisible();
    await page.getByRole('button', { name: /logout/i }).click();

    // After logout it redirects to home.
    await expect(page).toHaveURL(/\/$/);

    // Confirm we're truly signed out by hitting an auth-gated route.
    await page.goto('/staff');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});
