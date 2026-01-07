async function loginViaUI(page, { email, password }) {
  if (!email || !password) {
    throw new Error('Missing credentials: email/password');
  }

  await page.goto('/login');

  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);

  await page.getByRole('button', { name: /sign in/i }).click();

  await page.waitForURL(/\/profile|\/admin|\/vendor|\/staff|\/host/);
}

module.exports = {
  loginViaUI,
};
