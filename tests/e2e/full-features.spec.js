const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');
const { writeTempPng } = require('./helpers/testFiles');

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;

function randomEmail() {
  return `e2e.host.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;
}

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

  const created = {
    email: null,
    password: 'E2E_Test_12345!',
  };

  test('Create a new host user (admin) and switch role (host)', async ({ page }) => {
    await acceptDialogs(page);

    await loginViaUI(page, { email: adminEmail, password: adminPassword });
    await gotoAdminFromProfile(page);

    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { level: 1, name: /user management/i })).toBeVisible();

    created.email = randomEmail();

    // Create staff account (then promote to host). Form inputs are: first, last, email, password.
    const staffCreateForm = page.locator('form').first();
    const inputs = staffCreateForm.locator('input');
    await inputs.nth(0).fill('E2E');
    await inputs.nth(1).fill('Host');
    await inputs.nth(2).fill(created.email);
    await inputs.nth(3).fill(created.password);

    await staffCreateForm.getByRole('button', { name: /create staff/i }).click();

    const newRow = page.locator('tbody tr').filter({ hasText: created.email }).first();
    await expect(newRow).toBeVisible({ timeout: 30_000 });

    // Change role to host and save (tests "change role" feature).
    await newRow.locator('select').selectOption('host');

    const saveButton = newRow.getByRole('button', { name: /^save$/i });
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Save button should disappear when changes are persisted.
    await expect(saveButton).toHaveCount(0, { timeout: 30_000 });

    await logoutIfPossible(page);
  });

  test('Host can add a property (real submit)', async ({ page }) => {
    await acceptDialogs(page);

    test.skip(!created.email, 'No test user created');

    await loginViaUI(page, { email: created.email, password: created.password });

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

    test.skip(!created.email, 'No test user created');

    await loginViaUI(page, { email: created.email, password: created.password });

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

    test.skip(!created.email, 'No test user created');

    await loginViaUI(page, { email: created.email, password: created.password });

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
