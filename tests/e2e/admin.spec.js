const { test, expect } = require('@playwright/test');
const { loginViaUI } = require('./helpers/auth');

// Prefer dedicated admin creds, but fall back to the default E2E creds.
// The suite still verifies the logged-in user is actually admin.
const adminEmail = process.env.E2E_ADMIN_EMAIL || process.env.E2E_USER_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD || process.env.E2E_USER_PASSWORD;
const usingDedicatedAdminCreds = !!(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_PASSWORD);

async function assertAdminShell(page) {
  // Admin pages (most of them) are wrapped with AdminLayout which renders sidebar links.
  // Use href-based assertions to avoid i18n brittleness.
  await expect(page.locator('aside a[href="/admin"]')).toBeVisible();
  await expect(page.locator('aside a[href="/admin/users"]')).toBeVisible();
  await expect(page.locator('aside a[href="/admin/properties"]')).toBeVisible();
}

async function assertAdminPageLoaded(page, { headingName } = {}) {
  await assertAdminShell(page);

  const h1 = headingName
    ? page.getByRole('heading', { level: 1, name: headingName })
    : page.locator('main h1').first();

  await expect(h1).toBeVisible();
}

test.describe('Admin panel', () => {
  test.skip(
    !adminEmail || !adminPassword,
    'Missing credentials: set E2E_ADMIN_EMAIL/E2E_ADMIN_PASSWORD (preferred) or E2E_USER_EMAIL/E2E_USER_PASSWORD'
  );

  test.beforeEach(async ({ page }) => {
    // Guard code uses alert() for access-denied; make sure dialogs don\'t hang tests.
    page.on('dialog', async (dialog) => {
      try {
        await dialog.accept();
      } catch {
        // ignore
      }
    });

    await loginViaUI(page, { email: adminEmail, password: adminPassword });

    // Match the real flow: sign in -> profile -> click Admin Panel -> admin routes.
    await page.goto('/profile');

    // Prefer a stable test hook; fall back to a broad selector.
    const adminPanelButton = page.getByTestId('profile-admin-panel');
    const fallbackAdminPanelButton = page
      .locator('button:has-text("Admin"), a[href="/admin"], button:has(svg)')
      .first();

    // Give the profile time to hydrate the user role from Supabase.
    if (usingDedicatedAdminCreds) {
      await adminPanelButton.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});
    }

    const canSeeTestId = await adminPanelButton.isVisible().catch(() => false);
    const canSeeFallback = await fallbackAdminPanelButton.isVisible().catch(() => false);
    const canSeeAdminEntry = canSeeTestId || canSeeFallback;

    if (!canSeeAdminEntry) {
      if (usingDedicatedAdminCreds) {
        throw new Error('Logged in user is not admin (Admin Panel entry not visible). Check that E2E_ADMIN_EMAIL has role=admin.');
      }
      test.skip(true, 'Admin Panel button not available for this user');
    }

    if (canSeeTestId) {
      await adminPanelButton.click();
    } else {
      await fallbackAdminPanelButton.click();
    }

    // Ensure we actually navigated into the admin area.
    await page.waitForURL(/\/admin(\/|$)/, { timeout: 15_000 });

    // Confirm we actually reached the admin shell.
    await expect(page.locator('aside a[href="/admin"]')).toBeVisible({ timeout: 10_000 });
  });

  test('Dashboard loads', async ({ page }) => {
    await page.goto('/admin');
    await assertAdminPageLoaded(page);
    await expect(page.locator('main table')).toBeVisible();
  });

  test('Users page loads and profile modal opens (if data exists)', async ({ page }) => {
    await page.goto('/admin/users');
    await assertAdminPageLoaded(page, { headingName: /user management/i });

    await expect(page.getByRole('heading', { level: 2, name: /create staff account/i })).toBeVisible();
    await expect(page.locator('main table')).toBeVisible();

    // Non-destructive coverage: ensure the create-staff form has required fields.
    await expect(page.locator('input[type="email"][required]').first()).toBeVisible();
    await expect(page.locator('input[type="password"][required]').first()).toBeVisible();

    const viewButtons = page.getByRole('button', { name: /view profile/i });
    const count = await viewButtons.count();
    if (count === 0) {
      test.skip(true, 'No users available to open profile modal');
    }

    await viewButtons.first().click();
    await expect(page.getByRole('heading', { level: 2, name: /user profile/i })).toBeVisible();
  });

  test('Accommodations page loads', async ({ page }) => {
    await page.goto('/admin/accommodations');
    await assertAdminPageLoaded(page, { headingName: /accommodations management/i });
    await expect(page.locator('main table')).toBeVisible();
  });

  test('Properties page loads', async ({ page }) => {
    await page.goto('/admin/properties');
    // Title is translated; assert structure instead of text.
    await assertAdminPageLoaded(page);
  });

  test('Tours page loads', async ({ page }) => {
    await page.goto('/admin/tours');
    await assertAdminPageLoaded(page, { headingName: /tour management/i });
    await expect(page.locator('main table')).toBeVisible();
  });

  test('Transport page loads', async ({ page }) => {
    await page.goto('/admin/transport');
    await assertAdminPageLoaded(page, { headingName: /transport management/i });
    await expect(page.locator('main table')).toBeVisible();
  });

  test('Payments page loads and filter control exists', async ({ page }) => {
    await page.goto('/admin/payments');
    await assertAdminPageLoaded(page, { headingName: /payment management/i });

    // Non-mutating interaction: filter dropdown.
    const filter = page.locator('main select').first();
    await expect(filter).toBeVisible();
    await expect(page.locator('main table')).toBeVisible();
  });

  test('Analytics page loads', async ({ page }) => {
    await page.goto('/admin/analytics');
    await assertAdminPageLoaded(page, { headingName: /analytics dashboard/i });

    // Non-mutating assertion: a couple of chart section headings exist.
    await expect(page.getByRole('heading', { level: 2, name: /revenue trend/i })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: /top services/i })).toBeVisible();
  });

  test('Host applications page loads and status filters exist', async ({ page }) => {
    await page.goto('/admin/host-applications');
    await assertAdminPageLoaded(page, { headingName: /hosting applications/i });

    // These are safe (they only change local filter state).
    await expect(page.getByRole('button', { name: /pending/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /approved/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /rejected/i })).toBeVisible();
  });

  test('Live support page loads', async ({ page }) => {
    await page.goto('/admin/live-support');
    await assertAdminPageLoaded(page, { headingName: /live support conversations/i });

    await expect(page.getByRole('heading', { level: 2, name: /active conversations/i })).toBeVisible();
  });

  test('Admin create tour page loads', async ({ page }) => {
    await page.goto('/admin/create-tour');
    // This route uses CreateTour which is wrapped in MainLayout (not AdminLayout).
    await expect(page.getByRole('heading', { level: 1, name: /create tour/i })).toBeVisible();

    // Non-destructive coverage: key fields exist.
    await expect(page.getByText('Tour Title *')).toBeVisible();
    await expect(page.getByText('Location *')).toBeVisible();
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute(
      'accept',
      /image\/jpeg,image\/png,image\/webp/
    );
  });

  test('Admin create transport page loads', async ({ page }) => {
    await page.goto('/admin/create-transport');
    // This route uses CreateTransport which is wrapped in MainLayout (not AdminLayout).
    await expect(page.getByRole('heading', { level: 1, name: /create transport service/i })).toBeVisible();

    // Non-destructive coverage: key fields exist.
    await expect(page.getByText('Service Name *')).toBeVisible();
    await expect(page.getByText('Vehicle Type *')).toBeVisible();
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute(
      'accept',
      /image\/jpeg,image\/png,image\/webp/
    );
  });
});
