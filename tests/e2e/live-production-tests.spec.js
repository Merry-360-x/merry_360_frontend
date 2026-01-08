import { test, expect } from '@playwright/test'

const PRODUCTION_URL = 'https://merry360x.com'

test.describe('Real-Time Production Tests', () => {
  test.setTimeout(180000) // 3 minutes

  test('1. Homepage & Navigation', async ({ page }) => {
    console.log('🚀 Test 1: Homepage & Navigation on', PRODUCTION_URL)
    
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('domcontentloaded')
    console.log('✅ Homepage loaded')
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/1-homepage.png', fullPage: true })
    console.log('📸 Homepage screenshot saved')
  })

  test('2. Browse Accommodations', async ({ page }) => {
    console.log('\n🏠 Test 2: Browse Accommodations')
    
    await page.goto(`${PRODUCTION_URL}/accommodations`)
    await page.waitForLoadState('domcontentloaded')
    
    const propertyCards = await page.locator('[class*="property"], [class*="accommodation"], [class*="card"], article').count()
    console.log(`✅ Found ${propertyCards} property listings`)
    
    await page.screenshot({ path: 'test-results/2-accommodations.png', fullPage: true })
  })

  test('3. Signup Flow', async ({ page }) => {
    console.log('\n👤 Test 3: Signup Flow')
    
    await page.goto(`${PRODUCTION_URL}/signup`)
    await page.waitForLoadState('domcontentloaded')
    
    const timestamp = Date.now()
    const testEmail = `livetest${timestamp}@merry360x.com`
    const testPassword = 'TestPass123!'
    
    await page.screenshot({ path: 'test-results/3-signup-before.png' })
    
    // Fill signup form
    await page.fill('input[type="email"]', testEmail).catch(() => 
      page.fill('input[name="email"]', testEmail)
    )
    await page.fill('input[type="password"]', testPassword).catch(() => 
      page.fill('input[name="password"]', testPassword)
    )
    
    console.log(`✅ Filled signup form with ${testEmail}`)
    await page.screenshot({ path: 'test-results/3-signup-filled.png' })
    
    // Submit
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    await page.screenshot({ path: 'test-results/3-signup-after.png' })
    console.log('✅ Signup submitted')
  })

  test('4. Login Flow', async ({ page }) => {
    console.log('\n🔐 Test 4: Login Flow')
    
    await page.goto(`${PRODUCTION_URL}/login`)
    await page.waitForLoadState('domcontentloaded')
    
    await page.screenshot({ path: 'test-results/4-login-before.png' })
    
    // Use existing test account
    await page.fill('input[type="email"]', 'bebisdavy@gmail.com').catch(() => 
      page.fill('input[name="email"]', 'bebisdavy@gmail.com')
    )
    await page.fill('input[type="password"]', 'Test123!').catch(() => 
      page.fill('input[name="password"]', 'Test123!')
    )
    
    console.log('✅ Filled login form')
    await page.screenshot({ path: 'test-results/4-login-filled.png' })
    
    // Submit
    await page.click('button[type="submit"]')
    await page.waitForTimeout(5000)
    
    await page.screenshot({ path: 'test-results/4-login-after.png', fullPage: true })
    console.log('✅ Login submitted')
  })

  test('5. View Property & Add Review', async ({ page }) => {
    console.log('\n⭐ Test 5: View Property & Add Review')
    
    // Login first
    await page.goto(`${PRODUCTION_URL}/login`)
    await page.fill('input[type="email"]', 'bebisdavy@gmail.com')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    // Browse properties
    await page.goto(`${PRODUCTION_URL}/accommodations`)
    await page.waitForLoadState('domcontentloaded')
    
    const firstProperty = page.locator('[class*="property"], [class*="card"]').first()
    if (await firstProperty.count() > 0) {
      await firstProperty.click()
      await page.waitForTimeout(2000)
      
      await page.screenshot({ path: 'test-results/5-property-detail.png', fullPage: true })
      console.log('✅ Viewing property details')
      
      // Try to add review
      const reviewTextarea = page.locator('textarea')
      if (await reviewTextarea.count() > 0) {
        await reviewTextarea.first().fill('Automated test review: This property looks amazing!')
        
        const stars = page.locator('[class*="star"]')
        if (await stars.count() >= 5) {
          await stars.nth(4).click() // 5 stars
        }
        
        await page.screenshot({ path: 'test-results/5-review-filled.png' })
        
        const submitBtn = page.locator('button:has-text("Submit"), button:has-text("Post")')
        if (await submitBtn.count() > 0) {
          await submitBtn.first().click()
          await page.waitForTimeout(2000)
          console.log('✅ Review submitted')
        }
      }
    } else {
      console.log('⚠️ No properties found to review')
    }
    
    await page.screenshot({ path: 'test-results/5-review-complete.png', fullPage: true })
  })

  test('6. Become a Host Application', async ({ page }) => {
    console.log('\n🏡 Test 6: Become a Host')
    
    // Login first
    await page.goto(`${PRODUCTION_URL}/login`)
    await page.fill('input[type="email"]', 'bebisdavy@gmail.com')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    // Go to become host page
    await page.goto(`${PRODUCTION_URL}/become-host`)
    await page.waitForLoadState('domcontentloaded')
    
    await page.screenshot({ path: 'test-results/6-host-step1.png', fullPage: true })
    
    // Fill step 1
    await page.fill('input[name="firstName"]', 'LiveTest').catch(() => {})
    await page.fill('input[name="lastName"]', 'User').catch(() => {})
    await page.fill('input[name="phone"]', '+250788123456').catch(() => {})
    await page.fill('input[name="address"]', 'KG 123 St, Kigali').catch(() => {})
    
    const nationalitySelect = page.locator('select[name="nationality"]')
    if (await nationalitySelect.count() > 0) {
      await nationalitySelect.selectOption('Rwanda')
    }
    
    const individualRadio = page.locator('input[value="individual"]')
    if (await individualRadio.count() > 0) {
      await individualRadio.click()
    }
    
    const accommodationRadio = page.locator('input[value="accommodation"]')
    if (await accommodationRadio.count() > 0) {
      await accommodationRadio.click()
    }
    
    await page.screenshot({ path: 'test-results/6-host-step1-filled.png', fullPage: true })
    console.log('✅ Step 1 filled')
    
    // Click next
    const nextBtn = page.locator('button:has-text("Next")')
    if (await nextBtn.count() > 0) {
      await nextBtn.click()
      await page.waitForTimeout(2000)
      await page.screenshot({ path: 'test-results/6-host-step2.png', fullPage: true })
      console.log('✅ Proceeded to step 2')
    }
  })

  test('7. Create Booking', async ({ page }) => {
    console.log('\n📅 Test 7: Create Booking')
    
    // Login
    await page.goto(`${PRODUCTION_URL}/login`)
    await page.fill('input[type="email"]', 'bebisdavy@gmail.com')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    // Go to accommodations
    await page.goto(`${PRODUCTION_URL}/accommodations`)
    await page.waitForLoadState('domcontentloaded')
    
    const firstProperty = page.locator('[class*="property"], [class*="card"]').first()
    if (await firstProperty.count() > 0) {
      await firstProperty.click()
      await page.waitForTimeout(2000)
      
      const bookBtn = page.locator('button:has-text("Book"), button:has-text("Reserve")')
      if (await bookBtn.count() > 0) {
        await bookBtn.first().click()
        await page.waitForTimeout(2000)
        
        await page.screenshot({ path: 'test-results/7-booking-form.png', fullPage: true })
        console.log('✅ Booking form opened')
        
        // Fill dates if present
        const dateInputs = page.locator('input[type="date"]')
        if (await dateInputs.count() >= 2) {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const nextWeek = new Date()
          nextWeek.setDate(nextWeek.getDate() + 8)
          
          await dateInputs.nth(0).fill(tomorrow.toISOString().split('T')[0])
          await dateInputs.nth(1).fill(nextWeek.toISOString().split('T')[0])
          
          await page.screenshot({ path: 'test-results/7-booking-filled.png', fullPage: true })
          console.log('✅ Booking dates filled')
        }
      }
    }
  })

  test('8. Logout', async ({ page }) => {
    console.log('\n🚪 Test 8: Logout')
    
    // Login first
    await page.goto(`${PRODUCTION_URL}/login`)
    await page.fill('input[type="email"]', 'bebisdavy@gmail.com')
    await page.fill('input[type="password"]', 'Test123!')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(3000)
    
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('domcontentloaded')
    
    // Look for user menu
    const userMenuSelectors = [
      '[class*="user"]',
      '[aria-label*="user" i]',
      'button:has-text("Profile")',
      '[class*="profile"]',
      '[class*="avatar"]'
    ]
    
    for (const selector of userMenuSelectors) {
      const menu = page.locator(selector)
      if (await menu.count() > 0) {
        await menu.first().click()
        await page.waitForTimeout(1000)
        break
      }
    }
    
    await page.screenshot({ path: 'test-results/8-user-menu.png' })
    
    const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")')
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click()
      await page.waitForTimeout(2000)
      console.log('✅ Logged out')
    } else {
      console.log('⚠️ Logout button not found')
    }
    
    await page.screenshot({ path: 'test-results/8-logout-complete.png', fullPage: true })
  })
})
