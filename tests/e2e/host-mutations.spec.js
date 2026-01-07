const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');
const { writeTempPng } = require('./helpers/testFiles');

const hostEmail = process.env.E2E_HOST_EMAIL || process.env.E2E_USER_EMAIL;
const hostPassword = process.env.E2E_HOST_PASSWORD || process.env.E2E_USER_PASSWORD;
const mutationOk = process.env.E2E_MUTATION_OK === '1';

function uniqueLabel(prefix) {
  return `${prefix} ${new Date().toISOString()} ${Math.random().toString(16).slice(2, 8)}`;
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

test.describe('Host mutations (creates real data)', () => {
  test.setTimeout(180_000);

  test.skip(!mutationOk, 'Set E2E_MUTATION_OK=1 to allow production data mutation tests.');
  test.skip(
    !hostEmail || !hostPassword,
    'Missing credentials: set E2E_HOST_EMAIL/E2E_HOST_PASSWORD (preferred) or E2E_USER_EMAIL/E2E_USER_PASSWORD'
  );

  test.beforeEach(async ({ page }) => {
    await acceptDialogs(page);
    await loginViaUI(page, { email: hostEmail, password: hostPassword });
  });

  test('Create a property as host', async ({ page }, testInfo) => {
    const pngPath = await writeTempPng(testInfo.outputPath('upload.png'));

    await page.goto('/host/add-property');
    await expect(page).toHaveURL(/\/host\/add-property/);

    // Required basics.
    const requiredTextInputs = page.locator('form input[type="text"][required]');
    await expect(requiredTextInputs).toHaveCount(2);

    await requiredTextInputs.nth(0).fill(uniqueLabel('E2E Host Property'));
    await page.locator('form select[required]').first().selectOption('hotel');
    await requiredTextInputs.nth(1).fill('Kigali');
    await page.locator('form textarea[required]').first().fill('E2E created property for validation.');

    await page.locator('form input[type="number"][required]').first().fill('123');

    // Amenities: at least one.
    await page.locator('form input[type="checkbox"]').first().check();

    // Upload at least one image.
    const fileInput = page.locator('input[type="file"][accept="image/jpeg,image/png,image/webp"]').first();
    await fileInput.setInputFiles(pngPath);

    // Wait until preview thumbnails have non-blob src (upload finished).
    await page.waitForFunction(() => {
      const imgs = Array.from(document.querySelectorAll('img.w-full.h-24.object-cover.rounded-lg'));
      if (imgs.length === 0) return false;
      return imgs.every((img) => !img.src.startsWith('blob:'));
    }, null, { timeout: 120_000 });

    // Submit and expect redirect to properties list.
    await page.locator('form button[type="submit"]').click();
    await page.waitForURL(/\/host\/properties/, { timeout: 30_000 });
  });

  test('Create a tour as host', async ({ page }, testInfo) => {
    const pngPath = await writeTempPng(testInfo.outputPath('upload.png'));

    await page.goto('/host/create-tour');
    await expect(page).toHaveURL(/\/host\/create-tour/);

    await page.getByPlaceholder('E.g., Gorilla Trekking Adventure').fill(uniqueLabel('E2E Host Tour'));
    await page.getByPlaceholder('E.g., Volcanoes National Park').fill('Volcanoes National Park');
    await page.getByPlaceholder('Describe your tour experience...').fill('E2E created tour for validation.');

    await page.getByPlaceholder('E.g., 3 Days 2 Nights').fill('1 Day');
    await page
      .locator('main select')
      .filter({ has: page.locator('option[value="Easy"]') })
      .first()
      .selectOption('Easy');

    const spinbuttons = page.locator('main input[type="number"], main [role="spinbutton"]');
    await expect(spinbuttons).toHaveCount(2);
    await spinbuttons.nth(0).fill('50');
    await spinbuttons.nth(1).fill('6');

    const fileInput = page.locator('input[type="file"][accept="image/jpeg,image/png,image/webp"]').first();
    await fileInput.setInputFiles(pngPath);

    await expect(page.locator('img[alt^="Tour image"]').first()).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: /^Create Tour$/ }).click();

    await expect(page.getByText('Tour created successfully!')).toBeVisible({ timeout: 20_000 });
    await page.waitForURL(/\/host(\/|$)/, { timeout: 20_000 });
  });

  test('Create a transport service as host', async ({ page }, testInfo) => {
    const pngPath = await writeTempPng(testInfo.outputPath('upload.png'));

    await page.goto('/host/create-transport');
    await expect(page).toHaveURL(/\/host\/create-transport/);

    await page.getByPlaceholder('E.g., Kigali Airport Transfer').fill(uniqueLabel('E2E Host Transport'));
    await page
      .locator('main select')
      .filter({ has: page.locator('option[value="Car"]') })
      .first()
      .selectOption('Car');
    await page.getByPlaceholder('E.g., Kigali Airport → City Center').fill('Kigali Airport → City Center');
    await page.getByPlaceholder('Describe your transport service...').fill('E2E created transport for validation.');

    const spinbuttons = page.locator('main input[type="number"], main [role="spinbutton"]');
    await expect(spinbuttons).toHaveCount(2);
    await spinbuttons.nth(0).fill('4');
    await spinbuttons.nth(1).fill('30');

    const fileInput = page.locator('input[type="file"][accept="image/jpeg,image/png,image/webp"]').first();
    await fileInput.setInputFiles(pngPath);

    await expect(page.locator('img[alt^="Vehicle image"]').first()).toBeVisible({ timeout: 30_000 });

    await page.getByRole('button', { name: /^Create Service$/ }).click();

    await expect(page.getByText('Transport service created successfully!')).toBeVisible({ timeout: 20_000 });
    await page.waitForURL(/\/host(\/|$)/, { timeout: 20_000 });
  });
});
