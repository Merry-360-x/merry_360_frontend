<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 max-w-6xl bg-white dark:bg-gray-900 min-h-screen">
      <h1 class="text-3xl font-bold text-text-brand-600 mb-8">{{ t('checkout.title') }}</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Error Message -->
          <div v-if="errors.general" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div class="flex items-center gap-2 text-red-800">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="font-medium">{{ errors.general }}</span>
            </div>
          </div>

          <!-- Stay Details -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-6">Stay Details</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                <Input v-model="stay.checkIn" type="date" :class="errors.checkIn ? 'border-red-500' : ''" />
                <p v-if="errors.checkIn" class="mt-1 text-sm text-red-600">{{ errors.checkIn }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                <Input v-model="stay.checkOut" type="date" :class="errors.checkOut ? 'border-red-500' : ''" />
                <p v-if="errors.checkOut" class="mt-1 text-sm text-red-600">{{ errors.checkOut }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                <Input v-model.number="stay.guests" type="number" min="1" :class="errors.guests ? 'border-red-500' : ''" />
                <p v-if="errors.guests" class="mt-1 text-sm text-red-600">{{ errors.guests }}</p>
              </div>
            </div>
            <p v-if="errors.dateRange" class="mt-3 text-sm text-red-600">{{ errors.dateRange }}</p>
          </Card>

          <!-- Guest Information -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-6">{{ t('checkout.guestInfo') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input v-model="guestInfo.firstName" :placeholder="t('checkout.firstName')" :class="errors.firstName ? 'border-red-500' : ''" />
                <p v-if="errors.firstName" class="mt-1 text-sm text-red-600">{{ errors.firstName }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.lastName" :placeholder="t('checkout.lastName')" :class="errors.lastName ? 'border-red-500' : ''" />
                <p v-if="errors.lastName" class="mt-1 text-sm text-red-600">{{ errors.lastName }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.email" type="email" :placeholder="t('checkout.email')" :class="errors.email ? 'border-red-500' : ''" />
                <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              <div>
                <Input v-model="guestInfo.phone" type="tel" :placeholder="t('checkout.phone')" :class="errors.phone ? 'border-red-500' : ''" />
                <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>
          </Card>

          <!-- Payment Method -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-6">{{ t('checkout.paymentMethod') }}</h2>
            <div class="space-y-4">
              <!-- Free Payment Option -->
              <label class="flex items-center p-4 border-2 border-green-200 bg-green-50 rounded-button hover:border-green-500 border-green-400 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="free" v-model="paymentMethod" class="mr-3" checked />
                <svg class="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="flex-1">
                  <span class="font-semibold text-green-700">Free Booking</span>
                  <p class="text-sm text-green-600">No payment required - Book now, pay later at property</p>
                </div>
              </label>

              <label class="flex items-center p-4 border-2 border-gray-200 rounded-button hover:border-brand-500 border-brand-400 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="card" v-model="paymentMethod" class="mr-3" />
                <svg class="w-8 h-8 mr-3 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                </svg>
                <span class="font-medium">{{ t('checkout.creditCard') }}</span>
              </label>

              <label class="flex items-center p-4 border-2 border-gray-200 rounded-button hover:border-brand-500 border-brand-400 transition-colors cursor-pointer">
                <input type="radio" name="payment" value="mobile" v-model="paymentMethod" class="mr-3" />
                <svg class="w-8 h-8 mr-3 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">{{ t('checkout.mobileMoney') }}</span>
              </label>
            </div>

            <div v-if="paymentMethod === 'free'" class="mt-6">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-blue-900 mb-1">Pay Later at Property</p>
                    <p class="text-sm text-blue-800">Your booking is secured. Payment will be collected when you check in at the property.</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="paymentMethod === 'card'" class="mt-6 space-y-4">
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-blue-900 mb-1">Pay with Flutterwave</p>
                    <p class="text-sm text-blue-800">You will be redirected to Flutterwave to complete payment securely.</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="paymentMethod === 'mobile'" class="mt-6 space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Select Provider</label>
                <div class="grid grid-cols-2 gap-3">
                  <label class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="mobileMoneyInfo.provider === 'mtn' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-gray-300'">
                    <input type="radio" name="provider" value="mtn" v-model="mobileMoneyInfo.provider" class="sr-only" />
                    <span class="font-semibold" :class="mobileMoneyInfo.provider === 'mtn' ? 'text-yellow-600' : 'text-gray-600'">MTN MoMo</span>
                  </label>
                  <label class="flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-colors" :class="mobileMoneyInfo.provider === 'airtel' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'">
                    <input type="radio" name="provider" value="airtel" v-model="mobileMoneyInfo.provider" class="sr-only" />
                    <span class="font-semibold" :class="mobileMoneyInfo.provider === 'airtel' ? 'text-red-600' : 'text-gray-600'">Airtel Money</span>
                  </label>
                </div>
              </div>
              <div>
                <Input 
                  v-model="mobileMoneyInfo.phoneNumber" 
                  type="tel" 
                  placeholder="Phone Number (250 7XX XXX XXX)"
                  :class="errors.mobilePhone ? 'border-red-500' : ''" 
                />
                <p v-if="errors.mobilePhone" class="mt-1 text-sm text-red-600">{{ errors.mobilePhone }}</p>
              </div>
              <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-start gap-3">
                  <svg class="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                  </svg>
                  <div>
                    <p class="font-medium text-blue-900 mb-1">Payment Prompt</p>
                    <p class="text-sm text-blue-800">You will complete payment securely via Flutterwave.</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Special Requests -->
          <Card padding="lg">
            <h2 class="text-2xl font-bold mb-4">Special Requests</h2>
            <textarea 
              v-model="specialRequests"
              rows="4" 
              class="w-full px-4 py-3 border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900"
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
            
            <div v-if="property.image" class="mb-4">
              <img loading="lazy" :src="property.image" :alt="property.name" class="w-full h-32 object-cover rounded-button mb-3" />
              <h4 class="font-semibold text-lg">{{ property.name }}</h4>
              <p class="text-sm text-text-secondary">{{ property.location }}</p>
            </div>

            <div class="space-y-2 py-4 border-t border-b border-gray-200 text-sm">
              <div class="flex justify-between">
                <span class="text-text-secondary">Check-in</span>
                <span class="font-medium">{{ stay.checkIn ? formatDate(stay.checkIn) : 'Not set' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Check-out</span>
                <span class="font-medium">{{ stay.checkOut ? formatDate(stay.checkOut) : 'Not set' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-text-secondary">Guests</span>
                <span class="font-medium">{{ stay.guests }} {{ stay.guests === 1 ? 'Guest' : 'Guests' }}</span>
              </div>
            </div>

            <div class="space-y-3 py-4 border-b border-gray-200">
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">{{ currencyStore.formatPrice(property.price) }} × {{ nights }} {{ nights === 1 ? 'night' : 'nights' }}</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Service fee (5%)</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(serviceFee) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-secondary">Taxes (3%)</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(taxes) }}</span>
              </div>
            </div>

            <div class="flex justify-between pt-4 mb-6">
              <span class="font-bold text-lg">Total</span>
              <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(total) }}</span>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              full-width
              :disabled="!acceptTerms"
              :loading="processing"
              @click="confirmBooking"
            >
              {{ paymentMethod === 'free' ? 'Confirm Booking' : 'Confirm & Pay' }}
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { createBooking, supabase } from '../../services/supabase'
import { startFlutterwavePayment } from '../../services/flutterwave'
import api from '../../services/api'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'

const { t } = useTranslation()
const router = useRouter()
const route = useRoute()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()

// Initialize guest info from logged-in user if available
const guestInfo = ref({
  firstName: userStore.user?.firstName || '',
  lastName: userStore.user?.lastName || '',
  email: userStore.user?.email || '',
  phone: userStore.user?.phone || ''
})

const property = ref({
  id: null,
  name: '',
  location: '',
  price: 0,
  image: ''
})

const stay = ref({
  checkIn: '',
  checkOut: '',
  guests: 2
})

function toDateInputValue(date) {
  return date.toISOString().split('T')[0]
}

async function loadProperty() {
  const { id } = route.params
  if (!id) {
    router.push('/accommodations')
    return
  }

  const response = await api.accommodations.getById(id)
  const data = response?.data
  if (!data) {
    router.push('/accommodations')
    return
  }

  property.value = {
    id: data.id,
    name: data.name,
    location: data.location,
    price: data.price,
    image: data.images?.[0] || data.image
  }
}

// Hydrate auth + defaults
onMounted(async () => {
  await userStore.initAuth()
  if (!userStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await loadProperty()

  // Hydrate stay details from URL (or apply defaults)
  const qCheckIn = route.query.checkIn != null ? String(route.query.checkIn).trim() : ''
  const qCheckOut = route.query.checkOut != null ? String(route.query.checkOut).trim() : ''
  const qGuests = route.query.guests != null && String(route.query.guests).trim()
    ? Number(route.query.guests)
    : null

  if (qCheckIn) stay.value.checkIn = qCheckIn
  if (qCheckOut) stay.value.checkOut = qCheckOut
  if (Number.isFinite(qGuests) && qGuests > 0) stay.value.guests = qGuests

  if (!stay.value.checkIn || !stay.value.checkOut) {
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 7)
    const checkOut = new Date()
    checkOut.setDate(checkOut.getDate() + 10)

    stay.value.checkIn = stay.value.checkIn || toDateInputValue(checkIn)
    stay.value.checkOut = stay.value.checkOut || toDateInputValue(checkOut)
  }
})

const paymentMethod = ref('free')
const mobileMoneyInfo = ref({
  provider: 'mtn', // mtn, airtel
  phoneNumber: ''
})

const specialRequests = ref('')
const acceptTerms = ref(false)
const processing = ref(false)

// Calculate nights between check-in and check-out
const nights = computed(() => {
  if (!stay.value.checkIn || !stay.value.checkOut) return 1
  const checkIn = new Date(stay.value.checkIn)
  const checkOut = new Date(stay.value.checkOut)
  const diffTime = Math.abs(checkOut - checkIn)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
})

// Calculate totals
const subtotal = computed(() => (property.value.price || 0) * nights.value)
const serviceFee = computed(() => Math.round(subtotal.value * 0.05)) // 5% service fee
const taxes = computed(() => Math.round(subtotal.value * 0.03)) // 3% taxes
const total = computed(() => subtotal.value + serviceFee.value + taxes.value)

const errors = ref({})

const validateBooking = () => {
  errors.value = {}
  let isValid = true

  // Validate property loaded
  if (!property.value.id) {
    errors.value.general = 'Property not found'
    return false
  }

  // Validate stay details
  if (!stay.value.checkIn) {
    errors.value.checkIn = 'Check-in date is required'
    isValid = false
  }
  if (!stay.value.checkOut) {
    errors.value.checkOut = 'Check-out date is required'
    isValid = false
  }
  if (!stay.value.guests || stay.value.guests < 1) {
    errors.value.guests = 'Guests must be at least 1'
    isValid = false
  }
  if (stay.value.checkIn && stay.value.checkOut) {
    const inDate = new Date(stay.value.checkIn)
    const outDate = new Date(stay.value.checkOut)
    if (!(outDate > inDate)) {
      errors.value.dateRange = 'Check-out must be after check-in'
      isValid = false
    }
  }

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

  // Validate payment info based on selected method
  if (paymentMethod.value === 'mobile') {
    if (!mobileMoneyInfo.value.phoneNumber) {
      errors.value.mobilePhone = 'Phone number is required'
      isValid = false
    } else if (!/^(\+?250|0)?[7][0-9]{8}$/.test(mobileMoneyInfo.value.phoneNumber.replace(/\s/g, ''))) {
      errors.value.mobilePhone = 'Invalid Rwandan phone number'
      isValid = false
    }
  }
  // No additional validation needed for 'free' payment method

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
    const firstError = document.querySelector('.text-red-600, .border-red-500')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
    return
  }

  processing.value = true
  errors.value = {}
  
  try {
    const bookingInsert = {
      user_id: userStore.user.id,
      listing_id: property.value.id,
      check_in: stay.value.checkIn,
      check_out: stay.value.checkOut,
      guests: stay.value.guests,
      total_price: total.value,
      status: paymentMethod.value === 'free' ? 'confirmed' : 'pending',
      payment_status: paymentMethod.value === 'free' ? 'pending' : 'pending'
    }

    const booking = await createBooking(bookingInsert)
    
    if (!booking) {
      throw new Error('Failed to create booking')
    }
    
    // Send confirmation emails (don't block on this)
    sendBookingEmails(booking).catch(err => {
      console.error('Failed to send booking emails:', err)
    })
    
    // Update user store with booking
    if (userStore.upcomingBookings) {
      userStore.upcomingBookings.push(booking)
    }
    
    // If free, we're done
    if (paymentMethod.value === 'free') {
      router.push({
        path: '/profile',
        query: { 
          bookingSuccess: 'true',
          bookingId: booking.id,
          tab: 'trips'
        }
      })
      return
    }

    // Paid flow: launch Flutterwave, then mark booking as paid
    const customer = {
      email: guestInfo.value.email,
      phone: guestInfo.value.phone,
      name: `${guestInfo.value.firstName} ${guestInfo.value.lastName}`.trim()
    }

    const { response } = await startFlutterwavePayment({
      amount: total.value,
      currency: currencyStore.selectedCurrency,
      customer,
      title: 'Merry 360 Booking',
      description: `Booking ${booking.id}`,
      txRef: `BOOKING_${booking.id}`,
      meta: {
        booking_id: booking.id,
        payment_method: paymentMethod.value
      }
    })

    if (response?.status === 'successful') {
      await supabase
        .from('bookings')
        .update({ payment_status: 'paid', status: 'confirmed' })
        .eq('id', booking.id)

      // Send confirmation emails after successful payment
      sendBookingEmails({
        ...booking,
        status: 'confirmed',
        payment_status: 'paid'
      }).catch(err => {
        console.error('Failed to send booking emails:', err)
      })

      router.push({
        path: '/profile',
        query: { 
          bookingSuccess: 'true',
          bookingId: booking.id,
          tab: 'trips'
        }
      })
    } else {
      errors.value.general = 'Payment was not completed. Your booking is pending payment.'
    }
  } catch (error) {
    console.error('Booking error:', error)
    errors.value.general = error.message || 'Failed to create booking. Please try again.'
  } finally {
    processing.value = false
  }
}

// Send booking confirmation emails
async function sendBookingEmails(booking) {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    
    const response = await supabase.functions.invoke('send-booking-emails', {
      body: {
        bookingId: booking.id,
        customerEmail: guestInfo.value.email,
        customerName: `${guestInfo.value.firstName} ${guestInfo.value.lastName}`.trim(),
        propertyName: property.value.name,
        checkIn: stay.value.checkIn,
        checkOut: stay.value.checkOut,
        guests: stay.value.guests,
        totalPrice: total.value,
        currency: currencyStore.selectedCurrency,
        bookingStatus: booking.status || 'pending',
        specialRequests: specialRequests.value || undefined,
        phone: guestInfo.value.phone || undefined
      }
    })

    if (response.error) {
      console.error('Email function error:', response.error)
    } else {
      console.log('Booking emails sent:', response.data)
    }
  } catch (error) {
    console.error('Failed to invoke email function:', error)
  }
}

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>
