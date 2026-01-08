const { test, expect } = require('@playwright/test');
const { writeTempPng } = require('./helpers/testFiles');

async function acceptDialogs(page) {
  page.on('dialog', async (dialog) => {
    try {
      await dialog.accept();
    } catch {
      // ignore
    }
  });
}

async function selectFirstNonEmptyOption(selectLocator) {
  const value = await selectLocator.evaluate((el) => {
    const opt = Array.from(el.options || []).find((o) => o.value);
    return opt ? opt.value : '';
  });
  expect(value, 'Expected a non-empty option value').toBeTruthy();
  await selectLocator.selectOption(value);
}

async function clickNext(page) {
  const nextButton = page.locator('form button[type="button"]:visible').last();
  await expect(nextButton).toBeEnabled();
  await nextButton.click();
}

test.describe('Become Host', () => {
  test('submits without native hidden-required validation errors', async ({ page }, testInfo) => {
    await acceptDialogs(page);

    const invalidControlErrors = [];
    page.on('console', (msg) => {
      const text = msg.text() || '';
      if (text.includes("An invalid form control") && text.includes('not focusable')) {
        invalidControlErrors.push(text);
      }
    });

    // Mock Cloudinary uploads so E2E does not depend on external services.
    await page.route('https://api.cloudinary.com/**', async (route) => {
      const url = route.request().url();
      if (!/\/upload(\?|$)/.test(url)) {
        return route.fallback();
      }

      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          secure_url: `https://example.com/e2e/${Date.now()}.png`,
          url: `https://example.com/e2e/${Date.now()}.png`,
          public_id: `e2e/${Date.now()}`
        })
      });
    });

    const pngPath = writeTempPng({ name: `become-host-${testInfo.parallelIndex}` });

    await page.goto('/become-host');
    await expect(page).toHaveURL(/\/become-host/);

    // Step 1: fill required fields.
    const textRequired = page.locator('form input[type="text"][required]:visible');
    await expect(textRequired).toHaveCount(3);
    await textRequired.nth(0).fill('E2E');
    await textRequired.nth(1).fill('Host');
    await textRequired.nth(2).fill('Kigali');

    await page.locator('form input[type="email"][required]:visible').fill('e2e-host@example.com');
    await page.locator('form input[type="tel"][required]:visible').fill('+250700000000');

    const selects = page.locator('form select[required]:visible');
    await expect(selects).toHaveCount(3);

    // Nationality varies by dataset; pick first non-empty.
    await selectFirstNonEmptyOption(selects.nth(0));

    // Applicant type: individual.
    await selects.nth(1).selectOption('individual');

    // Hosting type: choose non-accommodation to avoid photo uploader requirement.
    await selects.nth(2).selectOption('service');

    await clickNext(page);

    // Step 2: ID number + upload document.
    await page.locator('form input[type="text"][required]:visible').fill('E2E-ID-123');

    // DocumentUpload triggers a modal; use the real file chooser flow.
    const [chooser] = await Promise.all([
      page.waitForEvent('filechooser'),
      page.locator('form').getByText('Choose File').first().click()
    ]);
    await chooser.setFiles(pngPath);

    // Upload modal appears and requires explicit confirm.
    await expect(page.getByText('Upload document')).toBeVisible();
    const uploadButton = page.getByRole('button', { name: /^Upload$/ });
    await expect(uploadButton).toBeVisible();
    await uploadButton.click();

    // After upload, the preview row should show controls.
    await expect(page.locator('form').getByRole('button', { name: /^View$/ }).first()).toBeVisible({ timeout: 30_000 });

    await clickNext(page);

    // Step 3: listing basics for non-accommodation.
    const listingText = page.locator('form input[type="text"][required]:visible');
    await expect(listingText).toHaveCount(1);
    await listingText.first().fill('Kigali');

    await page.locator('form input[type="number"][required]:visible').fill('2');

    await clickNext(page);

    // Step 4: description.
    await page.locator('form textarea[required]:visible').fill('E2E listing description');
    await clickNext(page);

    // Step 5: agree to terms and submit.
    await page.locator('form input[type="checkbox"][required]:visible').check();
    await page.locator('form button[type="submit"]:visible').click();

    // Not logged in: app should redirect to login (and not be blocked by native validation).
    await page.waitForURL(/\/login/, { timeout: 15_000 });

    expect(invalidControlErrors, 'Should not hit native hidden required validation errors').toEqual([]);
  });
});
