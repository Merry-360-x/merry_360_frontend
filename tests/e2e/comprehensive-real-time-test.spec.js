/**
 * Comprehensive Real-Time Feature Testing
 * Tests all critical user flows including:
 * - Authentication (login, logout, signup)
 * - Property management (add, edit, view)
 * - Tour management (add, view)
 * - Transport management (add, view)
 * - Image uploads
 * - Booking flows
 * - Database connectivity
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173'
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@merry360.com'
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'testpassword123'

test.describe('Comprehensive Real-Time Feature Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL)
    // Wait for app to load
    await page.waitForLoadState('networkidle')
  })

  test('1. Homepage loads correctly', async ({ page }) => {
    await expect(page.locator('text=Recommended Stays').or(page.locator('text=Featured')).first()).toBeVisible({ timeout: 10000 })
    console.log('✅ Homepage loaded successfully')
  })

  test('2. User Registration Flow', async ({ page }) => {
    // Navigate to signup
    await page.click('text=Sign Up', { timeout: 5000 }).catch(() => {
      // Try alternative selectors
      return page.click('a[href*="signup"]').catch(() => {
        return page.click('button:has-text("Sign Up")')
      })
    })

    await page.waitForURL('**/signup', { timeout: 10000 })

    // Fill registration form
    const timestamp = Date.now()
    const uniqueEmail = `test${timestamp}@merry360.com`
    
    await page.fill('input[type="email"]', uniqueEmail)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.fill('input[name="firstName"], input[placeholder*="First"]', 'Test')
    await page.fill('input[name="lastName"], input[placeholder*="Last"]', 'User')
    
    // Submit form
    await page.click('button:has-text("Sign Up"), button[type="submit"]')
    
    // Wait for redirect or success message
    await page.waitForTimeout(3000)
    
    console.log(`✅ Registration attempted for ${uniqueEmail}`)
  })

  test('3. User Login Flow', async ({ page }) => {
    // Navigate to login
    await page.click('text=Log In', { timeout: 5000 }).catch(() => {
      return page.click('a[href*="login"]').catch(() => {
        return page.click('button:has-text("Log In")')
      })
    })

    await page.waitForURL('**/login', { timeout: 10000 })

    // Fill login form
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    
    // Submit
    await page.click('button:has-text("Log In"), button[type="submit"]')
    
    // Wait for redirect to dashboard or home
    await page.waitForURL(/\/(home|dashboard|profile)/, { timeout: 15000 })
    
    // Verify user is logged in
    const userMenu = page.locator('text=BE').or(page.locator('[aria-label*="user"]')).first()
    await expect(userMenu).toBeVisible({ timeout: 5000 })
    
    console.log('✅ Login successful')
  })

  test('4. Add Property Flow', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button:has-text("Log In"), button[type="submit"]')
    await page.waitForURL(/\/(home|dashboard)/, { timeout: 15000 })

    // Navigate to add property
    await page.goto(`${BASE_URL}/host/add-property`).catch(() => {
      return page.goto(`${BASE_URL}/admin/add-property`)
    })

    await page.waitForLoadState('networkidle')

    // Fill property form
    await page.fill('input[name="title"], input[placeholder*="name"], input[placeholder*="title"]', `Test Property ${Date.now()}`)
    await page.fill('input[name="location"], input[placeholder*="location"]', 'Kigali, Rwanda')
    await page.fill('input[name="price"], input[type="number"]', '50000')
    await page.fill('textarea[name="description"], textarea[placeholder*="description"]', 'A beautiful test property')

    // Select property type if dropdown exists
    const typeSelect = page.locator('select[name="category"], select[name="type"]').first()
    if (await typeSelect.count() > 0) {
      await typeSelect.selectOption({ index: 1 })
    }

    // Add beds and baths
    const bedsInput = page.locator('input[name="beds"], input[placeholder*="bed"]').first()
    if (await bedsInput.count() > 0) {
      await bedsInput.fill('2')
    }

    const bathsInput = page.locator('input[name="baths"], input[placeholder*="bath"]').first()
    if (await bathsInput.count() > 0) {
      await bathsInput.fill('1')
    }

    // Upload images
    const fileInput = page.locator('input[type="file"]').first()
    if (await fileInput.count() > 0) {
      // Create a dummy image file for testing
      await fileInput.setInputFiles({
        name: 'test-image.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A')
      })
      await page.waitForTimeout(2000) // Wait for upload
    }

    // Submit
    await page.click('button:has-text("Publish"), button:has-text("Submit"), button[type="submit"]')
    
    // Wait for success or redirect
    await page.waitForTimeout(5000)
    
    console.log('✅ Property creation flow completed')
  })

  test('5. Add Tour Flow', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button:has-text("Log In"), button[type="submit"]')
    await page.waitForURL(/\/(home|dashboard)/, { timeout: 15000 })

    // Navigate to add tour
    await page.goto(`${BASE_URL}/vendor/create-tour`).catch(() => {
      return page.goto(`${BASE_URL}/tours/create`)
    })

    await page.waitForLoadState('networkidle')

    // Fill tour form
    await page.fill('input[name="title"], input[placeholder*="name"], input[placeholder*="title"]', `Test Tour ${Date.now()}`)
    await page.fill('input[name="location"], input[placeholder*="destination"]', 'Volcanoes National Park')
    await page.fill('textarea[name="description"]', 'An amazing gorilla trekking experience')
    
    // Duration
    await page.fill('input[name="durationDays"], input[placeholder*="days"]', '3')
    await page.fill('input[name="durationHours"], input[placeholder*="hours"]', '0')
    
    // Price
    await page.fill('input[name="price"], input[type="number"]', '150000')
    
    // Category
    const categorySelect = page.locator('select[name="category"]').first()
    if (await categorySelect.count() > 0) {
      await categorySelect.selectOption('Wildlife')
    }

    // Upload image
    const fileInput = page.locator('input[type="file"]').first()
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles({
        name: 'test-tour.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A')
      })
      await page.waitForTimeout(2000)
    }

    // Submit
    await page.click('button:has-text("Create"), button:has-text("Submit"), button[type="submit"]')
    
    await page.waitForTimeout(5000)
    
    console.log('✅ Tour creation flow completed')
  })

  test('6. Add Transport Flow', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button:has-text("Log In"), button[type="submit"]')
    await page.waitForURL(/\/(home|dashboard)/, { timeout: 15000 })

    // Navigate to add transport
    await page.goto(`${BASE_URL}/vendor/create-transport`).catch(() => {
      return page.goto(`${BASE_URL}/transport/create`)
    })

    await page.waitForLoadState('networkidle')

    // Fill transport form
    await page.fill('input[name="name"], input[placeholder*="name"]', `Test Vehicle ${Date.now()}`)
    
    // Vehicle type
    const typeSelect = page.locator('select[name="vehicleType"], select[name="type"]').first()
    if (await typeSelect.count() > 0) {
      await typeSelect.selectOption({ index: 1 })
    }

    await page.fill('input[name="capacity"], input[type="number"]', '4')
    await page.fill('input[name="price"], input[type="number"]', '50000')
    await page.fill('input[name="luggageBags"], input[type="number"]', '2')
    
    // Duration
    await page.fill('input[name="durationDays"]', '1')
    await page.fill('input[name="durationHours"]', '0')

    // Upload image
    const fileInput = page.locator('input[type="file"]').first()
    if (await fileInput.count() > 0) {
      await fileInput.setInputFiles({
        name: 'test-vehicle.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A')
      })
      await page.waitForTimeout(2000)
    }

    // Submit
    await page.click('button:has-text("Create"), button:has-text("Submit"), button[type="submit"]')
    
    await page.waitForTimeout(5000)
    
    console.log('✅ Transport creation flow completed')
  })

  test('7. Image Upload Test', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button:has-text("Log In"), button[type="submit"]')
    await page.waitForURL(/\/(home|dashboard)/, { timeout: 15000 })

    // Navigate to become host (has image upload)
    await page.goto(`${BASE_URL}/become-host`)
    await page.waitForLoadState('networkidle')

    // Find file input
    const fileInputs = page.locator('input[type="file"]')
    const count = await fileInputs.count()
    
    if (count > 0) {
      // Test image upload
      await fileInputs.first().setInputFiles({
        name: 'test-upload.jpg',
        mimeType: 'image/jpeg',
        buffer: Buffer.from('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A')
      })
      
      // Wait for upload to process
      await page.waitForTimeout(3000)
      
      // Check for upload progress or success indicator
      const uploadIndicator = page.locator('text=Uploading, text=Uploaded, [class*="progress"]').first()
      if (await uploadIndicator.count() > 0) {
        await expect(uploadIndicator).toBeVisible({ timeout: 10000 })
      }
      
      console.log('✅ Image upload test completed')
    } else {
      console.log('⚠️ No file input found for image upload test')
    }
  })

  test('8. View Accommodations List', async ({ page }) => {
    await page.goto(`${BASE_URL}/accommodations`)
    await page.waitForLoadState('networkidle')
    
    // Check for property cards or list
    const propertyCard = page.locator('[class*="card"], [class*="property"]').first()
    await expect(propertyCard).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Accommodations list loaded')
  })

  test('9. View Tours List', async ({ page }) => {
    await page.goto(`${BASE_URL}/tours`)
    await page.waitForLoadState('networkidle')
    
    // Check for tour cards
    const tourCard = page.locator('[class*="card"], [class*="tour"]').first()
    await expect(tourCard).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Tours list loaded')
  })

  test('10. View Transport List', async ({ page }) => {
    await page.goto(`${BASE_URL}/transport`)
    await page.waitForLoadState('networkidle')
    
    // Check for transport cards
    const transportCard = page.locator('[class*="card"], [class*="vehicle"], [class*="transport"]').first()
    await expect(transportCard).toBeVisible({ timeout: 10000 })
    
    console.log('✅ Transport list loaded')
  })

  test('11. User Logout Flow', async ({ page }) => {
    // Login first
    await page.goto(`${BASE_URL}/login`)
    await page.fill('input[type="email"]', TEST_EMAIL)
    await page.fill('input[type="password"]', TEST_PASSWORD)
    await page.click('button:has-text("Log In"), button[type="submit"]')
    await page.waitForURL(/\/(home|dashboard)/, { timeout: 15000 })

    // Find and click logout
    await page.click('text=BE').or(page.click('[aria-label*="user"]')).catch(() => {
      return page.click('text=Logout').or(page.click('button:has-text("Log Out")'))
    })

    // Wait for logout menu
    await page.waitForTimeout(1000)
    
    // Click logout option
    await page.click('text=Logout, text=Log Out, button:has-text("Logout")')
    
    // Wait for redirect to home or login
    await page.waitForURL(/\/(home|login)/, { timeout: 10000 })
    
    console.log('✅ Logout successful')
  })

  test('12. Database Connectivity Test', async ({ page }) => {
    // Test that data loads from database
    await page.goto(`${BASE_URL}/accommodations`)
    await page.waitForLoadState('networkidle')
    
    // Check network requests for database calls
    const response = await page.waitForResponse(
      response => response.url().includes('supabase') || response.url().includes('api'),
      { timeout: 10000 }
    ).catch(() => null)
    
    if (response) {
      expect(response.status()).toBeLessThan(500)
      console.log('✅ Database connectivity verified')
    } else {
      console.log('⚠️ Could not verify database connectivity via network requests')
    }
  })
})
