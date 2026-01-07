const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');
const { writeTempPng } = require('./helpers/testFiles');

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const hostEmail = process.env.E2E_HOST_EMAIL;
const hostPassword = process.env.E2E_HOST_PASSWORD;

async function acceptDialogs(page) {
  page.on('dialog', async (dialog) => {
    try {
      await dialog.accept();
    } catch {
      // ignore
    }
  });
}

async function logoutIfPossible(page) {
  await page.goto('/profile');
  const logoutButton = page.getByRole('button', { name: /logout/i });
  const canSee = await logoutButton.isVisible().catch(() => false);
  if (canSee) {
    await logoutButton.click();
    await page.waitForURL(/\/(login|$)/, { timeout: 15_000 }).catch(() => {});
  }
}

async function gotoAdminFromProfile(page) {
  await page.goto('/profile');
  const btn = page.getByTestId('profile-admin-panel');
  await btn.waitFor({ state: 'visible', timeout: 20_000 });
  await btn.click();
  await page.waitForURL(/\/admin(\/|$)/, { timeout: 20_000 });
}

test.describe.serial('Full feature flows (mutating)', () => {
  test.skip(!process.env.E2E_MUTATION_OK, 'Set E2E_MUTATION_OK=1 to run mutating end-to-end flows');
  test.skip(!adminEmail || !adminPassword, 'Set E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD');

  test.setTimeout(240_000);

  test('Admin can change a user role and save', async ({ page }) => {
    await acceptDialogs(page);

    await loginViaUI(page, { email: adminEmail, password: adminPassword });
    await gotoAdminFromProfile(page);

    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { level: 1, name: /user management/i })).toBeVisible();

    // Avoid mutating real users: pick a synthetic test user if present.
    // The admin table includes rows with emails like test_...@merry360.test.
    const targetRow = page.locator('tbody tr').filter({ hasText: '@merry360.test' }).first();
    await expect(targetRow).toBeVisible({ timeout: 30_000 });

    const roleSelect = targetRow.locator('select').first();
    const originalRole = await roleSelect.inputValue();
    const nextRole = originalRole === 'host' ? 'user' : 'host';

    await roleSelect.selectOption(nextRole);

    const saveButton = targetRow.getByRole('button', { name: /^save$/i });
    await expect(saveButton).toBeVisible({ timeout: 30_000 });
    await saveButton.click();
    await expect(saveButton).toHaveCount(0, { timeout: 30_000 });

    // Revert role back to minimize persistent changes.
    await roleSelect.selectOption(originalRole);
    const revertSave = targetRow.getByRole('button', { name: /^save$/i });
    await expect(revertSave).toBeVisible({ timeout: 30_000 });
    await revertSave.click();
    await expect(revertSave).toHaveCount(0, { timeout: 30_000 });

    await logoutIfPossible(page);
  });

  test('Host can add a property (real submit)', async ({ page }) => {
    await acceptDialogs(page);

    test.skip(!hostEmail || !hostPassword, 'Set E2E_HOST_EMAIL/E2E_HOST_PASSWORD');

    await loginViaUI(page, { email: hostEmail, password: hostPassword });

    await page.goto('/host/add-property');
    await expect(page).toHaveURL(/\/host\/add-property/);

    const form = page.locator('form').first();

    // Fill required fields (order-based to avoid i18n issues).
    const requiredTextInputs = form.locator('input[required][type="text"]');
    await requiredTextInputs.nth(0).fill(`E2E Property ${Date.now()}`);

    await form.locator('select[required]').first().selectOption('hotel');

    await requiredTextInputs.nth(1).fill('Kigali');

    await form.locator('textarea[required]').first().fill('E2E created property for end-to-end testing.');

    await form.locator('input[required][type="number"]').first().fill('120');

    // Amenities are required by validation.
    const firstAmenity = form.locator('input[type="checkbox"]').first();
    await firstAmenity.check();

    // Upload at least one image.
    const imagePath = writeTempPng({ name: 'property' });
    const fileInput = form.locator('input[type="file"]').first();
    await fileInput.setInputFiles(imagePath);

    // Wait for upload/preview to settle.
    await expect(form.locator('img').first()).toBeVisible({ timeout: 90_000 });

    await form.locator('button[type="submit"]').click();

    // App redirects back to properties after create.
    await expect(page).toHaveURL(/\/host\/properties/, { timeout: 60_000 });

    await logoutIfPossible(page);
  });

  test('Host can create a tour (real submit)', async ({ page }) => {
    await acceptDialogs(page);

    test.skip(!hostEmail || !hostPassword, 'Set E2E_HOST_EMAIL/E2E_HOST_PASSWORD');

    await loginViaUI(page, { email: hostEmail, password: hostPassword });

    await page.goto('/host/create-tour');
    await expect(page).toHaveURL(/\/host\/create-tour/);

    await page.locator('input[placeholder*="Gorilla"]').fill(`E2E Tour ${Date.now()}`);
    await page.locator('input[placeholder*="Volcanoes"]').fill('Volcanoes National Park');
    await page.locator('textarea').first().fill('E2E created tour for end-to-end testing.');
    await page.locator('input[placeholder*="Days"]').fill('1 Day');
    await page.locator('select').first().selectOption('Easy');
    await page.locator('input[type="number"]').first().fill('50');
    await page.locator('input[type="number"]').nth(1).fill('5');

    const imagePath = writeTempPng({ name: 'tour' });
    await page.locator('input[type="file"]').first().setInputFiles(imagePath);

    await expect(page.locator('img[alt^="Tour image"]').first()).toBeVisible({ timeout: 90_000 });

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/tour created successfully/i)).toBeVisible({ timeout: 60_000 });

    await logoutIfPossible(page);
  });

  test('Host can create a transport service (real submit)', async ({ page }) => {
    await acceptDialogs(page);

    test.skip(!hostEmail || !hostPassword, 'Set E2E_HOST_EMAIL/E2E_HOST_PASSWORD');

    await loginViaUI(page, { email: hostEmail, password: hostPassword });

    await page.goto('/host/create-transport');
    await expect(page).toHaveURL(/\/host\/create-transport/);

    await page.locator('input[placeholder*="Airport"]').fill(`E2E Transport ${Date.now()}`);
    await page.locator('select').first().selectOption('Car');
    await page.locator('input[placeholder*="→"]').fill('Kigali Airport → City Center');
    await page.locator('textarea').first().fill('E2E created transport service for end-to-end testing.');
    await page.locator('input[type="number"]').first().fill('4');
    await page.locator('input[type="number"]').nth(1).fill('25');

    const imagePath = writeTempPng({ name: 'transport' });
    await page.locator('input[type="file"]').first().setInputFiles(imagePath);

    await expect(page.locator('img[alt^="Vehicle image"]').first()).toBeVisible({ timeout: 90_000 });

    await page.locator('button[type="submit"]').click();

    await expect(page.getByText(/transport service created successfully/i)).toBeVisible({ timeout: 60_000 });

    await logoutIfPossible(page);
  });
});
