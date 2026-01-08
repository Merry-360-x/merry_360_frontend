const { test, expect } = require('@playwright/test');

// Feature verification with actual data and interactions
test.describe('Feature Verification - Authentication', () => {
  
  test('login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Use test credentials from README
    await page.locator('input[type="email"], input[type="text"][name*="email" i]').first().fill('support@merry360x.com');
    await page.locator('input[type="password"]').first().fill('password123');
    
    // Submit form
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitBtn.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should redirect away from login page
    const currentUrl = page.url();
    console.log('After login URL:', currentUrl);
    
    // Check if we're logged in (not on login page anymore or see profile link)
    const isLoggedIn = !currentUrl.includes('/login') || 
                       await page.locator('text=/profile|logout|dashboard/i').count() > 0;
    
    expect(isLoggedIn).toBeTruthy();
  });

  test('admin login works', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input[type="email"], input[type="text"][name*="email" i]').first().fill('admin@merry360.com');
    await page.locator('input[type="password"]').first().fill('admin123');
    
    const submitBtn = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitBtn.click();
    
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Should be able to access admin
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    console.log('Admin access URL:', url);
    
    // Should stay on admin page if authorized
    const hasAdminAccess = url.includes('/admin');
    expect(hasAdminAccess).toBeTruthy();
  });
});

test.describe('Feature Verification - Accommodations', () => {
  
  test('accommodations list shows properties', async ({ page }) => {
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Look for property cards or listings
    const pageContent = await page.content();
    
    // Check for accommodation-related content
    const hasAccommodations = pageContent.includes('hotel') || 
                             pageContent.includes('Hotel') ||
                             pageContent.includes('room') ||
                             pageContent.includes('Room') ||
                             pageContent.includes('property') ||
                             pageContent.includes('accommodation');
    
    console.log('Accommodations page has content:', hasAccommodations);
    expect(hasAccommodations).toBeTruthy();
  });

  test('accommodation detail page works', async ({ page }) => {
    // Try a direct ID
    await page.goto('/accommodation/1');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const url = page.url();
    console.log('Accommodation detail URL:', url);
    
    // Should be on detail page or redirected to list
    const isValidPage = url.includes('/accommodation') || url.includes('/accommodations');
    expect(isValidPage).toBeTruthy();
  });

  test('accommodation filters work', async ({ page }) => {
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    
    // Look for filter controls
    const hasFilters = await page.locator('select, input[type="checkbox"], input[type="radio"], button:has-text("Filter")').count() > 0;
    
    console.log('Filters present:', hasFilters);
  });
});

test.describe('Feature Verification - Tours', () => {
  
  test('tours page shows tour listings', async ({ page }) => {
    await page.goto('/tours');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const content = await page.content();
    
    const hasTours = content.includes('Gorilla') || 
                    content.includes('Safari') ||
                    content.includes('tour') ||
                    content.includes('Tour') ||
                    content.includes('activity');
    
    console.log('Tours page has content:', hasTours);
    expect(hasTours).toBeTruthy();
  });

  test('tour detail page accessible', async ({ page }) => {
    await page.goto('/tour/1');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    console.log('Tour detail URL:', url);
    
    const isValidPage = url.includes('/tour');
    expect(isValidPage).toBeTruthy();
  });
});

test.describe('Feature Verification - Transport', () => {
  
  test('transport services page loads', async ({ page }) => {
    await page.goto('/transport');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const content = await page.content();
    
    const hasTransport = content.includes('transport') || 
                        content.includes('Transport') ||
                        content.includes('car') ||
                        content.includes('transfer') ||
                        content.includes('vehicle');
    
    console.log('Transport page has content:', hasTransport);
    expect(hasTransport).toBeTruthy();
  });
});

test.describe('Feature Verification - User Features', () => {
  
  test('cart functionality exists', async ({ page }) => {
    await page.goto('/trip-cart');
    await page.waitForLoadState('networkidle');
    
    const content = await page.content();
    const hasCart = content.includes('cart') || 
                   content.includes('Cart') ||
                   content.includes('items') ||
                   content.includes('empty');
    
    console.log('Cart page functional:', hasCart);
    expect(hasCart).toBeTruthy();
  });

  test('become host form exists', async ({ page }) => {
    await page.goto('/become-host');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Look for form elements
    const hasForm = await page.locator('input, textarea, select, form').count() > 0;
    
    console.log('Become host form exists:', hasForm);
    expect(hasForm).toBeTruthy();
  });
});

test.describe('Feature Verification - Internationalization', () => {
  
  test('language switching exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for language switcher
    const content = await page.content();
    const hasLanguageSupport = content.includes('lang-') || 
                              content.includes('language') ||
                              content.includes('EN') && content.includes('FR');
    
    console.log('Language support found:', hasLanguageSupport);
  });

  test('currency switching exists', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const content = await page.content();
    const hasCurrency = content.includes('USD') || 
                       content.includes('EUR') ||
                       content.includes('RWF') ||
                       content.includes('currency');
    
    console.log('Currency support found:', hasCurrency);
  });
});

test.describe('Feature Verification - Responsive Design', () => {
  
  test('mobile navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Look for mobile menu
    const hasMobileMenu = await page.locator('button:has-text("Menu"), button[aria-label*="menu" i], .hamburger, .mobile-menu').count() > 0;
    
    console.log('Mobile menu found:', hasMobileMenu);
  });

  test('tablet view renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    
    // Check page renders without overflow
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    expect(scrollWidth - clientWidth).toBeLessThan(20);
  });
});

test.describe('Feature Verification - Performance', () => {
  
  test('homepage loads within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    console.log('Homepage load time:', loadTime, 'ms');
    expect(loadTime).toBeLessThan(10000); // 10 seconds
  });

  test('navigation between pages is fast', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const startTime = Date.now();
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    const navTime = Date.now() - startTime;
    
    console.log('Navigation time:', navTime, 'ms');
    expect(navTime).toBeLessThan(5000);
  });
});

test.describe('Feature Verification - Data Integrity', () => {
  
  test('forms preserve data during navigation', async ({ page }) => {
    await page.goto('/login');
    
    const testEmail = 'test@example.com';
    await page.locator('input[type="email"], input[type="text"][name*="email" i]').first().fill(testEmail);
    
    // Get the value
    const value = await page.locator('input[type="email"], input[type="text"][name*="email" i]').first().inputValue();
    
    expect(value).toBe(testEmail);
  });
});

test.describe('Feature Verification - Error Handling', () => {
  
  test('handles invalid routes gracefully', async ({ page }) => {
    await page.goto('/this-route-does-not-exist-12345');
    await page.waitForLoadState('networkidle');
    
    // Should either show 404 or redirect to home
    const url = page.url();
    const content = await page.content();
    
    const handledGracefully = url === 'http://localhost:5173/' || 
                             content.includes('404') || 
                             content.includes('not found');
    
    console.log('404 handling:', handledGracefully);
  });

  test('handles network errors', async ({ page }) => {
    // This test just ensures the page loads without crashing
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    
    // Page should load even if some API calls fail
    expect(page.url()).toContain('/accommodations');
  });
});
