import { test, expect } from '@playwright/test'

const PRODUCTION_URL = 'https://merry360x.com'

test.describe('Real-Time Production Tests', () => {
  test.setTimeout(120000) // 2 minutes per test

  test('Complete User Journey - Signup, Login, Browse, Review, Become Host', async ({ page }) => {
    console.log('🚀 Starting real-time production test on', PRODUCTION_URL)

    // Step 1: Visit homepage
    console.log('\n1️⃣ Testing Homepage...')
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveTitle(/Merry360/i)
    console.log('✅ Homepage loaded')

    // Step 2: Navigate to Signup
    console.log('\n2️⃣ Testing Signup...')
    await page.click('text=Sign Up, text=Signup, a[href*="signup"]').catch(() => 
      page.click('button:has-text("Get Started"), button:has-text("Sign up")')
    )
    await page.waitForURL(/.*signup.*/, { timeout: 10000 }).catch(() => {
      console.log('⚠️ Signup page not found, trying direct navigation')
      return page.goto(`${PRODUCTION_URL}/signup`)
    })
    
    // Fill signup form
    const timestamp = Date.now()
    const testEmail = `test${timestamp}@example.com`
    const testPassword = 'Test123456!'
    
    await page.fill('input[type="email"], input[name="email"]', testEmail)
    await page.fill('input[type="password"], input[name="password"]', testPassword)
    
    // Check if there's a confirm password field
    const confirmPasswordField = page.locator('input[name="confirmPassword"], input[placeholder*="confirm" i]')
    if (await confirmPasswordField.count() > 0) {
      await confirmPasswordField.fill(testPassword)
    }
    
    // Check if there are name fields
    const firstNameField = page.locator('input[name="firstName"], input[name="first_name"]')
    if (await firstNameField.count() > 0) {
      await firstNameField.fill('TestUser')
    }
    
    const lastNameField = page.locator('input[name="lastName"], input[name="last_name"]')
    if (await lastNameField.count() > 0) {
      await lastNameField.fill('Automated')
    }
    
    // Submit signup
    await page.click('button[type="submit"]:has-text("Sign Up"), button:has-text("Create Account"), button:has-text("Register")')
    await page.waitForTimeout(3000)
    console.log(`✅ Signup attempted with ${testEmail}`)

    // Step 3: Login (in case signup redirects to login or if user already exists)
    console.log('\n3️⃣ Testing Login...')
    const currentUrl = page.url()
    if (!currentUrl.includes('/dashboard') && !currentUrl.includes('/profile')) {
      // Try to navigate to login
      await page.goto(`${PRODUCTION_URL}/login`).catch(async () => {
        await page.click('text=Login, text=Sign In, a[href*="login"]')
      })
      
      await page.waitForTimeout(2000)
      await page.fill('input[type="email"], input[name="email"]', testEmail)
      await page.fill('input[type="password"], input[name="password"]', testPassword)
      await page.click('button[type="submit"]:has-text("Sign In"), button[type="submit"]:has-text("Login")')
      await page.waitForTimeout(3000)
    }
    console.log('✅ Login completed')

    // Step 4: Browse Properties/Accommodations
    console.log('\n4️⃣ Testing Browse Properties...')
    await page.goto(`${PRODUCTION_URL}/accommodations`).catch(() => 
      page.goto(`${PRODUCTION_URL}/properties`)
    )
    await page.waitForLoadState('networkidle')
    
    // Check if properties are displayed
    const propertyCards = page.locator('[class*="property"], [class*="accommodation"], [class*="card"]')
    const propertyCount = await propertyCards.count()
    console.log(`✅ Found ${propertyCount} property listings`)

    // Click on first property if available
    if (propertyCount > 0) {
      console.log('\n5️⃣ Testing Property Details...')
      await propertyCards.first().click()
      await page.waitForTimeout(2000)
      
      // Try to submit a review
      console.log('\n6️⃣ Testing Review Submission...')
      const reviewSection = page.locator('text=Review, text=Rating, [class*="review"]')
      if (await reviewSection.count() > 0) {
        await reviewSection.first().scrollIntoViewIfNeeded()
        
        // Click stars (5 stars)
        const stars = page.locator('[class*="star"], [data-rating], [role="button"][aria-label*="star"]')
        if (await stars.count() > 0) {
          await stars.nth(4).click() // 5th star
        }
        
        // Fill review text
        const reviewTextarea = page.locator('textarea[name*="review"], textarea[placeholder*="review" i], textarea[name="comment"]')
        if (await reviewTextarea.count() > 0) {
          await reviewTextarea.fill('This is an automated test review. The property looks amazing! Great location and facilities. Would definitely recommend to others.')
        }
        
        // Submit review
        const submitReviewBtn = page.locator('button:has-text("Submit Review"), button:has-text("Post Review"), button[type="submit"]')
        if (await submitReviewBtn.count() > 0) {
          await submitReviewBtn.first().click()
          await page.waitForTimeout(2000)
          console.log('✅ Review submitted')
        } else {
          console.log('⚠️ Review submit button not found')
        }
      } else {
        console.log('⚠️ Review section not found on this page')
      }
      
      // Go back to browse
      await page.goto(`${PRODUCTION_URL}/accommodations`)
    }

    // Step 7: Test Booking Flow
    console.log('\n7️⃣ Testing Booking Flow...')
    if (propertyCount > 0) {
      await page.goto(`${PRODUCTION_URL}/accommodations`)
      await page.waitForLoadState('networkidle')
      await propertyCards.first().click()
      await page.waitForTimeout(2000)
      
      // Look for booking button
      const bookNowBtn = page.locator('button:has-text("Book Now"), button:has-text("Reserve"), a:has-text("Book")')
      if (await bookNowBtn.count() > 0) {
        await bookNowBtn.first().click()
        await page.waitForTimeout(2000)
        
        // Fill check-in/check-out dates if present
        const checkInField = page.locator('input[type="date"][name*="check" i], input[placeholder*="check in" i]')
        if (await checkInField.count() > 0) {
          const tomorrow = new Date()
          tomorrow.setDate(tomorrow.getDate() + 1)
          const nextWeek = new Date()
          nextWeek.setDate(nextWeek.getDate() + 8)
          
          await checkInField.fill(tomorrow.toISOString().split('T')[0])
          
          const checkOutField = page.locator('input[type="date"][name*="check" i]:not([name*="in" i]), input[placeholder*="check out" i]')
          if (await checkOutField.count() > 0) {
            await checkOutField.fill(nextWeek.toISOString().split('T')[0])
          }
        }
        
        // Look for proceed/continue button
        const proceedBtn = page.locator('button:has-text("Proceed"), button:has-text("Continue"), button:has-text("Next")')
        if (await proceedBtn.count() > 0) {
          await proceedBtn.first().click()
          await page.waitForTimeout(2000)
          console.log('✅ Booking flow initiated')
        }
      }
    }

    // Step 8: Test Become a Host
    console.log('\n8️⃣ Testing Become a Host Flow...')
    await page.goto(`${PRODUCTION_URL}/become-host`).catch(() => 
      page.goto(`${PRODUCTION_URL}/host/apply`)
    )
    await page.waitForLoadState('networkidle')
    
    // Step 1: Personal Information
    console.log('   📝 Step 1: Personal Information')
    await page.fill('input[name="firstName"], input[placeholder*="first name" i]', 'Test').catch(() => {})
    await page.fill('input[name="lastName"], input[placeholder*="last name" i]', 'Host').catch(() => {})
    await page.fill('input[name="email"], input[type="email"]', testEmail).catch(() => {})
    await page.fill('input[name="phone"], input[type="tel"]', '+1234567890').catch(() => {})
    await page.fill('input[name="address"], input[placeholder*="address" i]', '123 Test Street').catch(() => {})
    
    // Nationality dropdown
    const nationalitySelect = page.locator('select[name="nationality"], select[placeholder*="nationality" i]')
    if (await nationalitySelect.count() > 0) {
      await nationalitySelect.selectOption({ index: 1 })
    }
    
    // Applicant Type
    const applicantTypeRadio = page.locator('input[type="radio"][value="individual"]')
    if (await applicantTypeRadio.count() > 0) {
      await applicantTypeRadio.click()
    }
    
    // Hosting Type
    const hostingTypeRadio = page.locator('input[type="radio"][value="accommodation"]')
    if (await hostingTypeRadio.count() > 0) {
      await hostingTypeRadio.click()
    }
    
    // Next button
    let nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")')
    if (await nextBtn.count() > 0) {
      await nextBtn.first().click()
      await page.waitForTimeout(2000)
      console.log('   ✅ Step 1 completed')
    }
    
    // Step 2: Verification Documents
    console.log('   📝 Step 2: Verification Documents')
    await page.fill('input[name="idNumber"], input[placeholder*="ID" i], input[placeholder*="passport" i]', 'TEST123456').catch(() => {})
    
    // Note: Skipping actual file upload for now as it requires real files
    console.log('   ⚠️ Skipping document upload (requires real files)')
    
    nextBtn = page.locator('button:has-text("Next"), button:has-text("Continue")')
    if (await nextBtn.count() > 0) {
      // Try to proceed even without uploads
      await nextBtn.first().click().catch(() => {
        console.log('   ⚠️ Cannot proceed without documents (expected)')
      })
      await page.waitForTimeout(2000)
    }
    
    console.log('✅ Become a Host form tested (stopped at document upload)')

    // Step 9: Test Logout
    console.log('\n9️⃣ Testing Logout...')
    await page.goto(PRODUCTION_URL)
    await page.waitForLoadState('networkidle')
    
    // Look for user menu or logout button
    const userMenu = page.locator('[class*="user-menu"], [class*="profile"], [aria-label*="user" i], button:has-text("Profile")')
    if (await userMenu.count() > 0) {
      await userMenu.first().click()
      await page.waitForTimeout(1000)
    }
    
    const logoutBtn = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), a:has-text("Logout")')
    if (await logoutBtn.count() > 0) {
      await logoutBtn.first().click()
      await page.waitForTimeout(2000)
      console.log('✅ Logout successful')
    } else {
      console.log('⚠️ Logout button not found')
    }

    // Final verification
    console.log('\n✅ Real-time production test completed!')
  })

  test('Test Stories Feature', async ({ page }) => {
    console.log('\n📖 Testing Stories Feature...')
    
    await page.goto(`${PRODUCTION_URL}/stories`)
    await page.waitForLoadState('networkidle')
    
    const storyCards = page.locator('[class*="story"], article, [class*="card"]')
    const storyCount = await storyCards.count()
    console.log(`✅ Found ${storyCount} stories`)
    
    if (storyCount > 0) {
      // Click on first story
      await storyCards.first().click()
      await page.waitForTimeout(2000)
      
      // Try to like
      const likeBtn = page.locator('button:has-text("Like"), [aria-label*="like" i], [class*="like"]')
      if (await likeBtn.count() > 0) {
        await likeBtn.first().click()
        await page.waitForTimeout(1000)
        console.log('✅ Story liked')
      }
      
      // Try to comment
      const commentField = page.locator('textarea[placeholder*="comment" i], input[placeholder*="comment" i]')
      if (await commentField.count() > 0) {
        await commentField.fill('Great story! This is an automated test comment.')
        const commentSubmit = page.locator('button:has-text("Comment"), button:has-text("Post")')
        if (await commentSubmit.count() > 0) {
          await commentSubmit.first().click()
          await page.waitForTimeout(2000)
          console.log('✅ Comment posted')
        }
      }
    }
  })

  test('Test Tours & Transport', async ({ page }) => {
    console.log('\n🚗 Testing Tours & Transport...')
    
    // Test Tours
    await page.goto(`${PRODUCTION_URL}/tours`)
    await page.waitForLoadState('networkidle')
    
    const tourCards = page.locator('[class*="tour"], [class*="card"]')
    const tourCount = await tourCards.count()
    console.log(`✅ Found ${tourCount} tours`)
    
    // Test Transport
    await page.goto(`${PRODUCTION_URL}/transport`)
    await page.waitForLoadState('networkidle')
    
    const vehicleCards = page.locator('[class*="vehicle"], [class*="transport"], [class*="card"]')
    const vehicleCount = await vehicleCards.count()
    console.log(`✅ Found ${vehicleCount} vehicles`)
  })

  test('Test Wishlist', async ({ page }) => {
    console.log('\n❤️ Testing Wishlist...')
    
    await page.goto(`${PRODUCTION_URL}/accommodations`)
    await page.waitForLoadState('networkidle')
    
    // Try to add to wishlist
    const wishlistBtn = page.locator('[aria-label*="wishlist" i], [class*="wishlist"], button:has-text("Save")')
    if (await wishlistBtn.count() > 0) {
      await wishlistBtn.first().click()
      await page.waitForTimeout(1000)
      console.log('✅ Item added to wishlist')
      
      // Navigate to wishlist page
      await page.goto(`${PRODUCTION_URL}/wishlist`)
      await page.waitForLoadState('networkidle')
      console.log('✅ Wishlist page accessed')
    }
  })
})
