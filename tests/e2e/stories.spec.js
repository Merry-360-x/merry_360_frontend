const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

test.describe('Stories', () => {
  test('create story, like, comment, delete (smoke)', async ({ page }) => {
    const email = process.env.E2E_USER_EMAIL;
    const password = process.env.E2E_USER_PASSWORD;

    test.skip(!email || !password, 'E2E_USER_EMAIL/E2E_USER_PASSWORD not set');

    await loginViaUI(page, { email, password });

    await page.goto('/stories');

    // Open create modal (button text is translated; use a loose match)
    await page.getByRole('button').filter({ hasText: /add story|share/i }).first().click();

    const unique = Date.now();
    const title = `E2E Story ${unique}`;
    const location = 'Kigali';
    const content = 'E2E automated story content';

    const modal = page.locator('form').filter({ has: page.locator('input[required][type="text"]') }).first();

    const requiredTextInputs = modal.locator('input[required][type="text"]');
    await requiredTextInputs.nth(0).fill(title);
    await requiredTextInputs.nth(1).fill(location);
    await modal.locator('textarea[required]').fill(content);

    await modal.locator('button[type="submit"]').click();

    // Modal should close
    await expect(page.locator('form').filter({ hasText: title })).toHaveCount(0);

    // Open the newly-created story (inserted at the top of the grid)
    await page.getByText(title).first().click();

    // Like
    const likeButton = page.locator('button:has(svg path[d^="M4.318 6.318"])').first();
    await likeButton.click();

    // Open comments
    const commentButton = page.locator('button:has(svg path[d^="M8 12h.01"])').first();
    await commentButton.click();

    const commentText = `Nice story ${unique}`;
    await page.locator('input[type="text"]').filter({ hasNotText: title }).last().fill(commentText);
    await page.getByRole('button', { name: /post/i }).click();

    await expect(page.getByText(commentText)).toBeVisible();

    // Delete story to keep DB clean
    await page.locator('button:has(svg path[d^="M19 7l-.867"])').first().click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByRole('button', { name: /delete|ok/i }).click();

    // Viewer closes after delete
    await expect(page.getByText(title)).toHaveCount(0);
  });
});
