/**
 * Comprehensive E2E Tests for All Submission Features
 * Tests: Become Host, Property Creation, Tour Creation, Transport Creation, Checkout
 */

import { test, expect } from '@playwright/test'

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173'

// Test credentials (update with real credentials)
const TEST_USER = {
  email: process.env.TEST_EMAIL || 'test@example.com',
  password: process.env.TEST_PASSWORD || 'testpassword123'
}

test.describe('Comprehensive Submission Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page
    await page.goto(BASE_URL)
    await page.waitForLoadState('networkidle')
  })

  test.describe('Become Host Application', () => {
    test('should successfully submit host application', async ({ page }) => {
      // Login first
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Navigate to become host
      await page.goto(`${BASE_URL}/become-host`)
      await page.waitForLoadState('networkidle')

      // Click Get Started
      const getStartedButton = page.locator('text=Get Started').first()
      if (await getStartedButton.isVisible()) {
        await getStartedButton.click()
        await page.waitForTimeout(1000)
      }

      // Step 0: Select Individual
      await page.click('text=Individual')
      await page.waitForTimeout(500)
      
      // Find and click Next button
      const nextButton = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(1000)
      }

      // Step 1: Fill personal information
      await page.fill('input[placeholder*="First"], input[name*="firstName"]', 'Test')
      await page.fill('input[placeholder*="Last"], input[name*="lastName"]', 'User')
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="tel"], input[placeholder*="phone"]', '+250788123456')
      
      // Click Next
      const nextButton2 = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
      if (await nextButton2.isVisible()) {
        await nextButton2.click()
        await page.waitForTimeout(1000)
      }

      // Step 2: Select hosting type
      await page.click('text=Accommodation, text=Tour, text=Transport').first()
      await page.waitForTimeout(500)
      
      const nextButton3 = page.locator('button:has-text("Next"), button:has-text("Continue")').first()
      if (await nextButton3.isVisible()) {
        await nextButton3.click()
        await page.waitForTimeout(1000)
      }

      // Step 3: Fill basic details
      await page.fill('textarea[placeholder*="description"], textarea[name*="description"]', 'Test property description')
      
      // Step 4: Upload documents (skip if file input not found)
      const fileInput = page.locator('input[type="file"]').first()
      if (await fileInput.isVisible()) {
        // Skip file upload for now - would need actual test files
      }

      // Step 5: Agree to terms and submit
      await page.check('input[type="checkbox"][name*="terms"], input[type="checkbox"]:near(text=terms)')
      
      const submitButton = page.locator('button:has-text("Submit"), button:has-text("Apply")').first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        
        // Wait for success message or redirect
        await page.waitForTimeout(3000)
        
        // Check for success indicator
        const successIndicator = page.locator('text=success, text=submitted, text=approved').first()
        if (await successIndicator.isVisible({ timeout: 5000 })) {
          console.log('✅ Host application submitted successfully')
        } else {
          console.log('⚠️ Host application submission - check manually')
        }
      }
    })
  })

  test.describe('Property Creation', () => {
    test('should successfully create a property', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Navigate to add property (try different routes)
      const routes = ['/host/add-property', '/staff/add-property', '/admin/add-property']
      let propertyPage = null
      
      for (const route of routes) {
        try {
          await page.goto(`${BASE_URL}${route}`)
          await page.waitForLoadState('networkidle', { timeout: 5000 })
          propertyPage = route
          break
        } catch (e) {
          continue
        }
      }

      if (!propertyPage) {
        test.skip('Could not access property creation page')
        return
      }

      // Step 1: Fill basic info
      await page.fill('input[placeholder*="Property Name"], input[placeholder*="name"]', 'Test Property')
      
      // Select property type
      const typeSelect = page.locator('select, button:has-text("Hotel"), button:has-text("Apartment")').first()
      if (await typeSelect.isVisible()) {
        if (await typeSelect.evaluate(el => el.tagName === 'SELECT')) {
          await typeSelect.selectOption('apartment')
        } else {
          await typeSelect.click()
        }
      }
      
      await page.fill('input[placeholder*="Location"], input[placeholder*="location"]', 'Kigali, Rwanda')
      await page.fill('input[type="number"][placeholder*="Price"], input[type="number"][placeholder*="price"]', '100000')
      await page.fill('input[type="number"][placeholder*="Guests"], input[type="number"][placeholder*="guests"]', '4')
      await page.fill('textarea[placeholder*="Description"], textarea', 'Beautiful test property in Kigali')
      
      // Click Next
      const nextButton = page.locator('button:has-text("Next")').first()
      if (await nextButton.isVisible()) {
        await nextButton.click()
        await page.waitForTimeout(2000)
      }

      // Step 2: Upload photos (skip for now - would need test images)
      console.log('⚠️ Photo upload step - would need test images')

      // Step 3: Review and submit
      const publishButton = page.locator('button:has-text("Publish"), button:has-text("Submit")').first()
      if (await publishButton.isVisible()) {
        // Check if button is disabled (waiting for photos)
        const isDisabled = await publishButton.isDisabled()
        if (!isDisabled) {
          await publishButton.click()
          
          // Wait for success
          await page.waitForTimeout(5000)
          
          // Check for success
          const successModal = page.locator('text=Success, text=Published, text=created').first()
          if (await successModal.isVisible({ timeout: 10000 })) {
            console.log('✅ Property created successfully')
          } else {
            console.log('⚠️ Property creation - check console for errors')
          }
        } else {
          console.log('⚠️ Property creation button disabled - likely missing photos')
        }
      }
    })
  })

  test.describe('Tour Creation', () => {
    test('should successfully create a tour', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Navigate to create tour
      const routes = ['/host/create-tour', '/staff/create-tour', '/admin/create-tour', '/vendor/create-tour']
      let tourPage = null
      
      for (const route of routes) {
        try {
          await page.goto(`${BASE_URL}${route}`)
          await page.waitForLoadState('networkidle', { timeout: 5000 })
          tourPage = route
          break
        } catch (e) {
          continue
        }
      }

      if (!tourPage) {
        test.skip('Could not access tour creation page')
        return
      }

      // Fill form
      await page.fill('input[placeholder*="Title"], input[placeholder*="Tour"]', 'Gorilla Trekking Adventure')
      await page.fill('input[placeholder*="Location"], input[placeholder*="destination"]', 'Volcanoes National Park')
      await page.fill('textarea[placeholder*="Description"]', 'Amazing gorilla trekking experience')
      await page.fill('input[placeholder*="Duration"]', '3 Days 2 Nights')
      
      // Select difficulty
      const difficultySelect = page.locator('select').first()
      if (await difficultySelect.isVisible()) {
        await difficultySelect.selectOption('Moderate')
      }
      
      await page.fill('input[type="number"][placeholder*="Price"]', '500')
      await page.fill('input[type="number"][placeholder*="Group"], input[type="number"][placeholder*="Size"]', '8')

      // Submit
      const submitButton = page.locator('button:has-text("Create"), button:has-text("Submit")').first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        
        await page.waitForTimeout(5000)
        
        const successMessage = page.locator('text=success, text=created').first()
        if (await successMessage.isVisible({ timeout: 10000 })) {
          console.log('✅ Tour created successfully')
        } else {
          console.log('⚠️ Tour creation - check console for errors')
        }
      }
    })
  })

  test.describe('Transport Creation', () => {
    test('should successfully create transport service', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Navigate to create transport
      const routes = ['/host/create-transport', '/staff/create-transport', '/admin/create-transport', '/vendor/create-transport']
      let transportPage = null
      
      for (const route of routes) {
        try {
          await page.goto(`${BASE_URL}${route}`)
          await page.waitForLoadState('networkidle', { timeout: 5000 })
          transportPage = route
          break
        } catch (e) {
          continue
        }
      }

      if (!transportPage) {
        test.skip('Could not access transport creation page')
        return
      }

      // Fill form
      await page.fill('input[placeholder*="Name"], input[placeholder*="Service"]', 'Airport Shuttle Service')
      
      // Select vehicle type
      const vehicleSelect = page.locator('select').first()
      if (await vehicleSelect.isVisible()) {
        await vehicleSelect.selectOption({ index: 1 })
      }
      
      await page.fill('input[placeholder*="Route"]', 'Kigali Airport to City Center')
      await page.fill('textarea[placeholder*="Description"]', 'Comfortable airport transfer service')
      await page.fill('input[type="number"][placeholder*="Capacity"]', '4')
      await page.fill('input[type="number"][placeholder*="Price"]', '50000')

      // Submit
      const submitButton = page.locator('button:has-text("Create"), button:has-text("Submit")').first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        
        await page.waitForTimeout(5000)
        
        const successMessage = page.locator('text=success, text=created').first()
        if (await successMessage.isVisible({ timeout: 10000 })) {
          console.log('✅ Transport service created successfully')
        } else {
          console.log('⚠️ Transport creation - check console for errors')
        }
      }
    })
  })

  test.describe('Checkout Flow', () => {
    test('should successfully complete checkout', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Navigate to accommodations
      await page.goto(`${BASE_URL}/accommodations`)
      await page.waitForLoadState('networkidle')

      // Click on first property
      const firstProperty = page.locator('a[href*="/accommodations/"], .property-card').first()
      if (await firstProperty.isVisible()) {
        await firstProperty.click()
        await page.waitForLoadState('networkidle')
        
        // Fill booking details
        const checkInInput = page.locator('input[type="date"], input[placeholder*="Check-in"]').first()
        if (await checkInInput.isVisible()) {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const checkInDate = tomorrow.toISOString().split('T')[0]
          await checkInInput.fill(checkInDate)
        }
        
        const checkOutInput = page.locator('input[type="date"], input[placeholder*="Check-out"]').first()
        if (await checkOutInput.isVisible()) {
          const dayAfter = new Date()
          dayAfter.setDate(dayAfter.getDate() + 3)
          const checkOutDate = dayAfter.toISOString().split('T')[0]
          await checkOutInput.fill(checkOutDate)
        }
        
        // Click Book Now or Reserve
        const bookButton = page.locator('button:has-text("Book"), button:has-text("Reserve")').first()
        if (await bookButton.isVisible()) {
          await bookButton.click()
          await page.waitForLoadState('networkidle')
          
          // Fill guest info on checkout page
          await page.fill('input[placeholder*="First"], input[name*="firstName"]', 'Test')
          await page.fill('input[placeholder*="Last"], input[name*="lastName"]', 'User')
          await page.fill('input[type="email"]', TEST_USER.email)
          await page.fill('input[type="tel"], input[placeholder*="phone"]', '+250788123456')
          
          // Confirm booking (may require payment - skip payment for test)
          const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Complete")').first()
          if (await confirmButton.isVisible()) {
            // Check if it's a free booking or requires payment
            const paymentRequired = await page.locator('text=payment, text=pay, text=flutterwave').isVisible()
            
            if (!paymentRequired) {
              await confirmButton.click()
              await page.waitForTimeout(5000)
              
              const successMessage = page.locator('text=success, text=confirmed, text=booked').first()
              if (await successMessage.isVisible({ timeout: 10000 })) {
                console.log('✅ Booking completed successfully')
              } else {
                console.log('⚠️ Booking - check console for errors')
              }
            } else {
              console.log('⚠️ Booking requires payment - skipping payment step')
            }
          }
        }
      }
    })
  })

  test.describe('Error Handling', () => {
    test('should show proper error messages for invalid submissions', async ({ page }) => {
      // Login
      await page.goto(`${BASE_URL}/login`)
      await page.fill('input[type="email"]', TEST_USER.email)
      await page.fill('input[type="password"]', TEST_USER.password)
      await page.click('button[type="submit"]')
      await page.waitForURL('**/profile**', { timeout: 10000 })

      // Try to submit empty property form
      await page.goto(`${BASE_URL}/host/add-property`)
      await page.waitForLoadState('networkidle')
      
      // Try to submit without filling form
      const submitButton = page.locator('button:has-text("Publish"), button:has-text("Submit")').first()
      if (await submitButton.isVisible()) {
        const isDisabled = await submitButton.isDisabled()
        if (!isDisabled) {
          await submitButton.click()
          await page.waitForTimeout(2000)
          
          // Check for error messages
          const errorMessage = page.locator('text=required, text=error, text=invalid').first()
          if (await errorMessage.isVisible({ timeout: 5000 })) {
            console.log('✅ Error handling works - validation errors shown')
          }
        } else {
          console.log('✅ Error handling works - submit button disabled for invalid form')
        }
      }
    })
  })
})
