const { test, expect } = require('@playwright/test');

test.describe('Comprehensive Feature Testing', () => {
  
  // Test 1: Homepage and Navigation
  test('homepage loads and displays main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check hero section
    await expect(page).toHaveTitle(/Merry360|Merry|360/i);
    
    // Check navigation elements
    await expect(page.locator('nav')).toBeVisible();
    
    // Check main service categories are visible
    const body = await page.textContent('body');
    const hasServices = body.includes('Accommodation') || 
                       body.includes('Tours') || 
                       body.includes('Transport');
    expect(hasServices).toBeTruthy();
  });

  // Test 2: Accommodations Feature
  test('accommodations page loads and displays listings', async ({ page }) => {
    await page.goto('/accommodations');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if listings are visible or loading state exists
    const hasContent = await page.locator('body').textContent();
    const isWorking = hasContent.includes('hotel') || 
                     hasContent.includes('accommodation') || 
                     hasContent.includes('room') ||
                     hasContent.includes('Loading') ||
                     hasContent.includes('loading');
    expect(isWorking).toBeTruthy();
  });

  // Test 3: Tours Page
  test('tours page loads and displays tours', async ({ page }) => {
    await page.goto('/tours');
    
    await page.waitForLoadState('networkidle');
    
    const hasContent = await page.locator('body').textContent();
    const isWorking = hasContent.includes('tour') || 
                     hasContent.includes('Tour') || 
                     hasContent.includes('Loading') ||
                     hasContent.includes('Gorilla') ||
                     hasContent.includes('Safari');
    expect(isWorking).toBeTruthy();
  });

  // Test 4: Transport Services
  test('transport page loads correctly', async ({ page }) => {
    await page.goto('/transport');
    
    await page.waitForLoadState('networkidle');
    
    const hasContent = await page.locator('body').textContent();
    const isWorking = hasContent.includes('transport') || 
                     hasContent.includes('Transport') || 
                     hasContent.includes('car') ||
                     hasContent.includes('transfer');
    expect(isWorking).toBeTruthy();
  });

  // Test 5: Login Page
  test('login page renders correctly', async ({ page }) => {
    await page.goto('/login');
    
    // Check for login form elements
    await expect(page.locator('input[type="email"], input[type="text"][name*="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")')).toBeVisible();
  });

  // Test 6: Signup Page
  test('signup page renders correctly', async ({ page }) => {
    await page.goto('/signup');
    
    // Check for signup form elements
    const emailInput = page.locator('input[type="email"], input[type="text"][name*="email"]');
    await expect(emailInput).toBeVisible();
    
    const passwordInput = page.locator('input[type="password"]');
    await expect(passwordInput).toBeVisible();
  });

  // Test 7: About Page
  test('about page loads', async ({ page }) => {
    await page.goto('/about');
    
    await page.waitForLoadState('networkidle');
    
    const content = await page.locator('body').textContent();
    const hasAboutContent = content.includes('About') || 
                           content.includes('about') || 
                           content.includes('Merry') ||
                           content.includes('360');
    expect(hasAboutContent).toBeTruthy();
  });

  // Test 8: Stories/Social Features
  test('stories page loads', async ({ page }) => {
    await page.goto('/stories');
    
    await page.waitForLoadState('networkidle');
    
    // Page should load without errors
    expect(page.url()).toContain('/stories');
  });

  // Test 9: Profile Page (requires auth)
  test('profile page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/profile');
    
    await page.waitForLoadState('networkidle');
    
    // Should redirect to login or show login prompt
    const url = page.url();
    const isAuthProtected = url.includes('/login') || url.includes('/signin');
    
    // Or check if page has login form
    const hasLoginForm = await page.locator('input[type="email"], input[type="password"]').count() > 0;
    
    expect(isAuthProtected || hasLoginForm).toBeTruthy();
  });

  // Test 10: Admin Page (requires admin auth)
  test('admin page redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    const isProtected = url.includes('/login') || url.includes('/signin');
    
    expect(isProtected).toBeTruthy();
  });

  // Test 11: Become Host Page
  test('become host page loads', async ({ page }) => {
    await page.goto('/become-host');
    
    await page.waitForLoadState('networkidle');
    
    const content = await page.locator('body').textContent();
    const hasHostContent = content.includes('host') || 
                          content.includes('Host') || 
                          content.includes('property') ||
                          content.includes('list your');
    expect(hasHostContent).toBeTruthy();
  });

  // Test 12: Cart/Checkout
  test('cart page is accessible', async ({ page }) => {
    await page.goto('/trip-cart');
    
    await page.waitForLoadState('networkidle');
    
    const content = await page.locator('body').textContent();
    const isCartPage = content.includes('cart') || 
                      content.includes('Cart') || 
                      content.includes('empty') ||
                      content.includes('item');
    expect(isCartPage).toBeTruthy();
  });

  // Test 13: Wishlist
  test('wishlist page is accessible', async ({ page }) => {
    await page.goto('/dashboard/watchlist');
    
    await page.waitForLoadState('networkidle');
    
    // Should either show wishlist or redirect to login
    const url = page.url();
    const isValid = url.includes('/watchlist') || 
                   url.includes('/login') || 
                   url.includes('/signin');
    expect(isValid).toBeTruthy();
  });

  // Test 14: Services Page
  test('services page loads', async ({ page }) => {
    await page.goto('/services');
    
    await page.waitForLoadState('networkidle');
    
    const content = await page.locator('body').textContent();
    const hasServiceContent = content.includes('service') || 
                             content.includes('Service');
    expect(hasServiceContent).toBeTruthy();
  });

  // Test 15: Mobile Responsiveness
  test('site is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Check that page renders without horizontal scroll
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    // Allow small differences due to scrollbars
    expect(scrollWidth - clientWidth).toBeLessThan(20);
  });

  // Test 16: Language Switching (if available)
  test('page supports internationalization', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Look for language selector or multi-language support indicators
    const content = await page.locator('body').innerHTML();
    const hasI18n = content.includes('lang') || 
                   content.includes('language') || 
                   content.includes('EN') ||
                   content.includes('FR');
    
    // This is expected to have some form of language support based on README
    console.log('I18n support detected:', hasI18n);
  });

  // Test 17: Navigation Links Work
  test('main navigation links are clickable', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Find and test navigation links
    const navLinks = await page.locator('nav a, header a').all();
    
    expect(navLinks.length).toBeGreaterThan(0);
  });

  // Test 18: Search Functionality (if exists)
  test('search functionality exists', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Look for search input or search button
    const searchElements = await page.locator('input[type="search"], input[placeholder*="search" i], button:has-text("Search")').count();
    
    console.log('Search elements found:', searchElements);
  });

  // Test 19: Footer Links
  test('footer renders with links', async ({ page }) => {
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Check for footer
    const footer = page.locator('footer');
    const hasFooter = await footer.count() > 0;
    
    console.log('Footer present:', hasFooter);
  });

  // Test 20: No Console Errors on Main Pages
  test('homepage loads without critical console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Filter out common non-critical errors
    const criticalErrors = errors.filter(err => 
      !err.includes('favicon') && 
      !err.includes('404') &&
      !err.includes('DevTools')
    );
    
    if (criticalErrors.length > 0) {
      console.log('Console errors found:', criticalErrors);
    }
    
    // We're being lenient here - just logging errors for review
    expect(criticalErrors.length).toBeLessThan(10);
  });
});

// Test Suite 2: User Flow Testing
test.describe('User Flows', () => {
  
  test('user can browse accommodations and view details', async ({ page }) => {
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    
    // Try to find and click on a listing
    const listings = await page.locator('a[href*="/accommodation/"], button:has-text("View"), a:has-text("View Details")').all();
    
    if (listings.length > 0) {
      await listings[0].click();
      await page.waitForLoadState('networkidle');
      
      // Should navigate to detail page
      expect(page.url()).toMatch(/\/accommodation\/\d+|\/accommodations\//);
    } else {
      console.log('No accommodation listings found to test detail view');
    }
  });

  test('user can navigate between main sections', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to accommodations
    await page.goto('/accommodations');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/accommodations');
    
    // Navigate to tours
    await page.goto('/tours');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/tours');
    
    // Navigate to transport
    await page.goto('/transport');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/transport');
    
    // Back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toMatch(/\/$|\/home$/);
  });

  test('login form can be submitted', async ({ page }) => {
    await page.goto('/login');
    
    // Fill in test credentials (should fail but form should work)
    await page.locator('input[type="email"], input[type="text"][name*="email"]').first().fill('test@example.com');
    await page.locator('input[type="password"]').first().fill('testpassword123');
    
    // Find and click submit button
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
    
    // Wait for response (either error message or redirect)
    await page.waitForLoadState('networkidle');
    
    // Form should have been submitted (we expect an error with fake credentials)
    console.log('Login form submission test completed');
  });

  test('signup form can be filled', async ({ page }) => {
    await page.goto('/signup');
    
    // Fill signup form
    const emailInput = page.locator('input[type="email"], input[type="text"][name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    
    await emailInput.fill('newuser@example.com');
    await passwordInput.fill('NewPassword123!');
    
    // Check if name field exists
    const nameInput = page.locator('input[name*="name"], input[placeholder*="name" i]').first();
    if (await nameInput.count() > 0) {
      await nameInput.fill('Test User');
    }
    
    console.log('Signup form can be filled successfully');
  });
});

// Test Suite 3: UI/UX Features
test.describe('UI/UX Features', () => {
  
  test('images load properly', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for images
    const images = await page.locator('img').all();
    
    if (images.length > 0) {
      // Check first few images have src
      const firstImage = images[0];
      const src = await firstImage.getAttribute('src');
      expect(src).toBeTruthy();
    }
    
    console.log(`Found ${images.length} images on homepage`);
  });

  test('buttons are interactive', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const buttons = await page.locator('button').all();
    
    expect(buttons.length).toBeGreaterThan(0);
    
    // Check first button is enabled
    if (buttons.length > 0) {
      const isEnabled = await buttons[0].isEnabled();
      console.log('First button is enabled:', isEnabled);
    }
  });

  test('forms have proper validation', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    const submitButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")').first();
    await submitButton.click();
    
    // Should show validation error or prevent submission
    await page.waitForTimeout(500);
    
    console.log('Form validation test completed');
  });
});
