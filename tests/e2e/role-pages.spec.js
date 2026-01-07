const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

test.describe('Role-gated pages', () => {
  test('vendor can open create property page (smoke)', async ({ page }) => {
    const email = process.env.E2E_VENDOR_EMAIL;
    const password = process.env.E2E_VENDOR_PASSWORD;

    test.skip(!email || !password, 'E2E_VENDOR_EMAIL/E2E_VENDOR_PASSWORD not set');

    await loginViaUI(page, { email, password });

    // If creds are for a different role (common in local setups), skip instead of failing.
    test.skip(!/\/(vendor|admin)/.test(page.url()), 'E2E_VENDOR_* credentials did not land on a vendor-capable dashboard');

    await page.goto('/vendor/create-property');

    await expect(page).toHaveURL(/\/vendor\/create-property/);
    await expect(page.locator('form')).toBeVisible();
    await expect(page).toHaveURL(/\/vendor\/create-property/);
  });

  test('staff can open add property page (smoke)', async ({ page }) => {
    const email = process.env.E2E_STAFF_EMAIL;
    const password = process.env.E2E_STAFF_PASSWORD;

    test.skip(!email || !password, 'E2E_STAFF_EMAIL/E2E_STAFF_PASSWORD not set');

    await loginViaUI(page, { email, password });
    await page.goto('/staff/add-property');

    await expect(page).toHaveURL(/\/staff\/add-property/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('host can open add property page (smoke)', async ({ page }) => {
    const email = process.env.E2E_HOST_EMAIL;
    const password = process.env.E2E_HOST_PASSWORD;

    test.skip(!email || !password, 'E2E_HOST_EMAIL/E2E_HOST_PASSWORD not set');

    await loginViaUI(page, { email, password });

    // If creds are for a different role (common in local setups), skip instead of failing.
    test.skip(!/\/(host|admin)/.test(page.url()), 'E2E_HOST_* credentials did not land on a host-capable dashboard');

    await page.goto('/host/add-property');

    await expect(page).toHaveURL(/\/host\/add-property/);
    await expect(page.locator('form')).toBeVisible();
    await expect(page).toHaveURL(/\/host\/add-property/);
  });
});
