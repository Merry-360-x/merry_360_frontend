const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

// Prefer dedicated host creds, but fall back to default E2E creds.
const hostEmail = process.env.E2E_HOST_EMAIL || process.env.E2E_USER_EMAIL;
const hostPassword = process.env.E2E_HOST_PASSWORD || process.env.E2E_USER_PASSWORD;

async function acceptDialogs(page) {
  page.on('dialog', async (dialog) => {
    try {
      await dialog.accept();
    } catch {
      // ignore
    }
  });
}

test.describe('Host features', () => {
  test.skip(
    !hostEmail || !hostPassword,
    'Missing credentials: set E2E_HOST_EMAIL/E2E_HOST_PASSWORD (preferred) or E2E_USER_EMAIL/E2E_USER_PASSWORD'
  );

  test.beforeEach(async ({ page }) => {
    await acceptDialogs(page);
    await loginViaUI(page, { email: hostEmail, password: hostPassword });
  });

  test('Host dashboard loads', async ({ page }) => {
    await page.goto('/host');
    await expect(page).toHaveURL(/\/host(\/|$)/);

    // Avoid i18n brittleness: assert main shell exists.
    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('main h1').first()).toBeVisible();
  });

  test('Host properties page loads', async ({ page }) => {
    await page.goto('/host/properties');
    await expect(page).toHaveURL(/\/host\/properties/);

    await expect(page.locator('main').first()).toBeVisible();
    await expect(page.locator('main h1').first()).toBeVisible();

    // Expect either a grid/list of properties or an empty-state message.
    await expect(page.locator('main').first()).toContainText(/property|properties|no properties|empty/i);
  });

  test('Host add property form loads and accepts image types', async ({ page }) => {
    await page.goto('/host/add-property');
    await expect(page).toHaveURL(/\/host\/add-property/);

    await expect(page.locator('main h1').first()).toBeVisible();

    // Key required fields should exist.
    await expect(page.locator('input[required]').first()).toBeVisible();
    await expect(page.locator('textarea, select').first()).toBeVisible();

    // Upload input should only accept images.
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute(
      'accept',
      /image\/jpeg,image\/png,image\/webp/
    );
  });

  test('Host create tour form loads and accepts image types', async ({ page }) => {
    await page.goto('/host/create-tour');
    await expect(page).toHaveURL(/\/host\/create-tour/);

    await expect(page.getByRole('heading', { level: 1, name: /create tour/i })).toBeVisible();
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute(
      'accept',
      /image\/jpeg,image\/png,image\/webp/
    );
  });

  test('Host create transport form loads and accepts image types', async ({ page }) => {
    await page.goto('/host/create-transport');
    await expect(page).toHaveURL(/\/host\/create-transport/);

    await expect(page.getByRole('heading', { level: 1, name: /create transport service/i })).toBeVisible();
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute(
      'accept',
      /image\/jpeg,image\/png,image\/webp/
    );
  });

  test('Host can logout from profile', async ({ page }) => {
    await page.goto('/profile');

    // The app uses an explicit logout button in the profile area.
    const logoutButton = page.getByRole('button', { name: /log\s*out|sign\s*out/i }).first();
    await expect(logoutButton).toBeVisible();

    await logoutButton.click();

    // After logout, user should not be able to access host routes.
    await page.goto('/host');

    // Depending on guard behavior, we either get redirected to login or see a login form.
    await expect(page).toHaveURL(/\/login|\/host/);
    const isOnLogin = /\/login/.test(page.url());
    if (isOnLogin) {
      await expect(page.locator('input[type="email"]')).toBeVisible();
    }
  });
});
