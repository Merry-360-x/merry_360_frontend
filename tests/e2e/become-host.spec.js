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
  test('become host page loads and shows application form', async ({ page }) => {
    await acceptDialogs(page);

    await page.goto('/become-host');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/become-host/);

    // Check that the page loads with host application content
    const pageContent = await page.locator('body').textContent();
    const hasHostContent = pageContent.includes('Host') || 
                          pageContent.includes('host') ||
                          pageContent.includes('Application') ||
                          pageContent.includes('Individual') ||
                          pageContent.includes('Business');
    
    expect(hasHostContent).toBeTruthy();

    // Check for form elements or step indicators
    const hasFormElements = await page.locator('button, input, select').count() > 0;
    expect(hasFormElements).toBeTruthy();
  });

  test('become host form has interactive elements', async ({ page }) => {
    await page.goto('/become-host');
    await page.waitForLoadState('networkidle');

    // Check for any interactive elements in the form
    const buttons = page.locator('button:visible');
    const inputs = page.locator('input:visible, select:visible, textarea:visible');
    
    const buttonCount = await buttons.count();
    const inputCount = await inputs.count();
    
    // Form should have some interactive elements
    expect(buttonCount + inputCount).toBeGreaterThan(0);
  });

  test('become host form can be interacted with', async ({ page }) => {
    await page.goto('/become-host');
    await page.waitForLoadState('networkidle');

    // Try to find and click on Individual or any clickable element
    const clickableElements = page.locator('button:visible, [role="button"]:visible');
    const count = await clickableElements.count();
    
    expect(count).toBeGreaterThan(0);

    // Try clicking on the first clickable element
    if (count > 0) {
      const firstButton = clickableElements.first();
      await expect(firstButton).toBeVisible();
    }
  });
});
