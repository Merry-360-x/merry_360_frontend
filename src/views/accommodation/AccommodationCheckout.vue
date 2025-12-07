<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 max-w-6xl bg-white dark:bg-gray-900 min-h-screen">
      <h1 class="text-3xl font-bold text-text-brand-600 dark:text-white mb-8">Complete Your Booking</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Error Message -->
          <div v-if="errors.general" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div class="flex items-center gap-2 text-red-800 dark:text-red-300">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-medium">{{ errors.general }}</span>
            </div>
          </div>

          <!-- Guest Information -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-6 dark:text-white">Guest Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="guestInfo.firstName" placeholder="First Name" :class="errors.firstName ? 'border-red-500' : ''" />
                <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.lastName" placeholder="Last Name" :class="errors.lastName ? 'border-red-500' : ''" />
                <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.email" type="email" placeholder="Email" :class="errors.email ? 'border-red-500' : ''" />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.phone" type="tel" placeholder="Phone Number (e.g., +250 7XX XXX XXX)" :class="errors.phone ? 'border-red-500' : ''" />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>
          </Card>

          <!-- Payment Method -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-6 dark:text-white">Payment Method</h2>
            <div class="space-y-4">
              <label class="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-button hover:border-brand-500 dark:hover:border-brand-400 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="card" v-model="paymentMethod" class="mr-3" checked />
                <svg class="w-8 h-8 mr-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span class="font-medium">Credit / Debit Card</span>
              </label>

              <label class="flex items-center p-4 border-2 border-gray-200 rounded-button hover:border-brand-500 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="mobile" v-model="paymentMethod" class="mr-3" />
                <svg class="w-8 h-8 mr-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">Mobile Money</span>
              </label>

              <label class="flex items-center p-4 border-2 border-gray-200 rounded-button hover:border-brand-500 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="crypto" v-model="paymentMethod" class="mr-3" />
                <svg class="w-8 h-8 mr-3 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">Cryptocurrency (Blockchain)</span>
              </label>
            </div>

            <div v-if="paymentMethod === 'card'" class="mt-6 space-y-4">
              <div>
                <Input 
                  v-model="cardInfo.number" 
                  placeholder="Card Number (1234 5678 9012 3456)" 
                  @input="formatCardNumber"
                  maxlength="19"
                  :class="errors.cardNumber ? 'border-red-500' : ''" 
                />
                <p v-if="errors.cardNumber" class="mt-1 text-sm text-red-600">{{ errors.cardNumber }}</p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <Input 
                    v-model="cardInfo.expiry" 
                    placeholder="MM/YY" 
                    @input="formatExpiry"
                    maxlength="5"
                    :class="errors.cardExpiry ? 'border-red-500' : ''" 
                  />
                  <p v-if="errors.cardExpiry" class="mt-1 text-sm text-red-600">{{ errors.cardExpiry }}</p>
                </div>
                <div>
                  <Input 
                    v-model="cardInfo.cvv" 
                    placeholder="CVV" 
                    type="password"
                    maxlength="4"
                    :class="errors.cardCvv ? 'border-red-500' : ''" 
                  />
                  <p v-if="errors.cardCvv" class="mt-1 text-sm text-red-600">{{ errors.cardCvv }}</p>
                </div>
              </div>
            </div>

            <div v-if="paymentMethod === 'crypto'" class="mt-6">
              <div class="bg-accent-blue bg-opacity-10 p-4 rounded-button">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-accent-blue mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-accent-blue mb-1">Smart Contract Payment</p>
                    <p class="text-sm text-text-secondary">Connect your wallet to complete the transaction securely on the blockchain</p>
                  </div>
                </div>
              </div>
              <Button variant="success" full-width class="mt-4">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Connect Wallet
              </Button>
            </div>
          </Card>

          <!-- Special Requests -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-4">Special Requests</h2>
            <textarea 
              v-model="specialRequests"
              rows="4" 
              class="w-full px-4 py-3 border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue"
              placeholder="Any special requirements or requests?"
            ></textarea>
          </Card>

          <!-- Terms -->
          <Card padding="lg">
            <label class="flex items-start">
              <input type="checkbox" v-model="acceptTerms" class="mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500 mr-3" />
              <span class="text-sm text-text-secondary">
                I agree to the <a href="#" class="text-brand-600 hover:underline">cancellation policy</a>, 
                <a href="#" class="text-brand-600 hover:underline">terms of service</a>, and 
                <a href="#" class="text-brand-600 hover:underline">privacy policy</a>
              </span>
            </label>
          </Card>
        </div>

        <!-- Booking Summary -->
        <div class="lg:col-span-1">
          <Card padding="lg" class="sticky top-24">
            <h3 class="font-bold text-xl mb-4">Booking Summary</h3>
            
            <div class="mb-4">
              <img loading="lazy" :src="bookingDetails.image" alt="Property" class="w-full h-32 object-cover rounded-button mb-3" />
              <h4 class="font-semibold text-lg">{{ bookingDetails.name }}</h4>
              <p class="text-sm text-text-secondary">{{ bookingDetails.location }}</p>
            </div>

            <div class="space-y-2 py-4 border-t border-b border-gray-200 text-sm">
              <div class="flex justify-between">
                <span class="text-text-secondary">Check-in</span>
                <span class="font-medium">Dec 15, 2025</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Check-out</span>
                <span class="font-medium">Dec 18, 2025</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Guests</span>
                <span class="font-medium">2 Adults</span>
              </div>
            </div>

            <div class="space-y-3 py-4 border-b border-gray-200">
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">{{ currencyStore.formatPrice(bookingDetails.price) }} × 3 nights</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(bookingDetails.price * 3) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Service fee</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(25) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Taxes</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(15) }}</span>
              </div>
            </div>

            <div class="flex justify-between pt-4 mb-6">
              <span class="font-bold text-lg">Total</span>
              <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(bookingDetails.price * 3 + 40) }}</span>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              full-width
              :disabled="!acceptTerms"
              :loading="processing"
              @click="confirmBooking"
            >
              Confirm & Pay
            </Button>

            <div class="mt-4 p-3 bg-success bg-opacity-10 rounded-button">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-success mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <div class="text-sm">
                  <p class="font-medium text-success mb-1">Free cancellation</p>
                  <p class="text-text-secondary">Cancel before Dec 10 for a full refund</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'

const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()

const guestInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

const paymentMethod = ref('card')
const cardInfo = ref({
  number: '',
  expiry: '',
  cvv: ''
})

const specialRequests = ref('')
const acceptTerms = ref(false)
const processing = ref(false)

const bookingDetails = ref({
  name: 'Kigali Serena Hotel',
  location: 'Kigali, Rwanda',
  price: 150,
  image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
})

const errors = ref({})

const validateBooking = () => {
  errors.value = {}
  let isValid = true

  // Validate guest info
  if (!guestInfo.value.firstName.trim()) {
    errors.value.firstName = 'First name is required'
    isValid = false
  }
  if (!guestInfo.value.lastName.trim()) {
    errors.value.lastName = 'Last name is required'
    isValid = false
  }
  if (!guestInfo.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.value.email)) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  if (!guestInfo.value.phone) {
    errors.value.phone = 'Phone number is required'
    isValid = false
  }

  // Validate payment info if card payment
  if (paymentMethod.value === 'card') {
    if (!cardInfo.value.number) {
      errors.value.cardNumber = 'Card number is required'
      isValid = false
    } else if (!/^\d{13,19}$/.test(cardInfo.value.number.replace(/\s/g, ''))) {
      errors.value.cardNumber = 'Invalid card number'
      isValid = false
    }
    
    if (!cardInfo.value.expiry) {
      errors.value.cardExpiry = 'Expiry date is required'
      isValid = false
    } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(cardInfo.value.expiry)) {
      errors.value.cardExpiry = 'Format should be MM/YY'
      isValid = false
    }
    
    if (!cardInfo.value.cvv) {
      errors.value.cardCvv = 'CVV is required'
      isValid = false
    } else if (!/^\d{3,4}$/.test(cardInfo.value.cvv)) {
      errors.value.cardCvv = 'Invalid CVV'
      isValid = false
    }
  }

  // Validate terms acceptance
  if (!acceptTerms.value) {
    errors.value.terms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

const confirmBooking = async () => {
  // Validate all fields
  if (!validateBooking()) {
    // Scroll to first error
    const firstError = document.querySelector('.text-red-600')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  processing.value = true
  
  try {
    // Simulate API call - Replace with actual booking endpoint
    // const response = await fetch('/api/bookings', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     accommodationId: bookingDetails.value.id,
    //     guestInfo: guestInfo.value,
    //     paymentMethod: paymentMethod.value,
    //     specialRequests: specialRequests.value
    //   })
    // })
    
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Booking successful
    router.push({
      path: '/dashboard',
      query: { bookingSuccess: 'true' }
    })
  } catch (error) {
    console.error('Booking error:', error)
    errors.value.general = 'Booking failed. Please try again.'
  } finally {
    processing.value = false
  }
}

// Format card number with spaces
const formatCardNumber = (event) => {
  let value = event.target.value.replace(/\s/g, '')
  let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value
  cardInfo.value.number = formattedValue
}

// Format expiry date
const formatExpiry = (event) => {
  let value = event.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  cardInfo.value.expiry = value
}
</script>
