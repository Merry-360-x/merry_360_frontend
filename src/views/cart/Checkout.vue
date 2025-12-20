<template>
  <MainLayout>
    <section class="py-12 md:py-16 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Checkout Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Guest Information -->
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Guest Information</h2>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                      <input 
                        v-model="guestInfo.firstName"
                        type="text" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                      <input 
                        v-model="guestInfo.lastName"
                        type="text" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input 
                      v-model="guestInfo.email"
                      type="email" 
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input 
                      v-model="guestInfo.phone"
                      type="tel" 
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Special Requests (Optional)</label>
                    <textarea 
                      v-model="guestInfo.specialRequests"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      placeholder="Any special requirements or requests..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Booking Details -->
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Booking Details</h2>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Check-in Date *</label>
                      <input 
                        v-model="bookingDetails.checkIn"
                        type="date" 
                        required
                        :min="minDate"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Check-out Date *</label>
                      <input 
                        v-model="bookingDetails.checkOut"
                        type="date" 
                        required
                        :min="bookingDetails.checkIn || minDate"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Number of Guests *</label>
                    <input 
                      v-model.number="bookingDetails.guests"
                      type="number" 
                      min="1"
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="bg-white rounded-xl shadow-lg p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
                <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                    </svg>
                    <div>
                      <p class="text-sm font-medium text-amber-900">Payment Integration Coming Soon</p>
                      <p class="text-xs text-amber-700 mt-1">Your booking will be confirmed and our team will contact you with payment instructions.</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-500 transition-colors">
                    <input type="radio" value="bank_transfer" v-model="paymentMethod" class="w-4 h-4 text-brand-600" />
                    <span class="ml-3 text-gray-900 font-medium">Bank Transfer</span>
                  </label>
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-500 transition-colors">
                    <input type="radio" value="mobile_money" v-model="paymentMethod" class="w-4 h-4 text-brand-600" />
                    <span class="ml-3 text-gray-900 font-medium">Mobile Money</span>
                  </label>
                  <label class="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-brand-500 transition-colors">
                    <input type="radio" value="pay_on_arrival" v-model="paymentMethod" class="w-4 h-4 text-brand-600" />
                    <span class="ml-3 text-gray-900 font-medium">Pay on Arrival</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
                
                <div class="space-y-3 mb-4">
                  <div v-for="item in tripCart" :key="`${item.type}-${item.id}`" class="flex gap-3 pb-3 border-b border-gray-200">
                    <img :src="item.image" :alt="item.name || item.title" class="w-16 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-gray-900">{{ item.name || item.title }}</p>
                      <p class="text-xs text-gray-500">{{ item.type }}</p>
                      <p class="text-sm font-bold text-brand-600 mt-1">
                        {{ currencyStore.formatPrice(typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2 mb-4 pb-4 border-b border-gray-200">
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span class="font-semibold">{{ currencyStore.formatPrice(subtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600">
                    <span>Service Fee</span>
                    <span class="font-semibold">{{ currencyStore.formatPrice(serviceFee) }}</span>
                  </div>
                </div>

                <div class="flex justify-between text-xl font-bold text-gray-900 mb-6">
                  <span>Total</span>
                  <span class="text-brand-600">{{ currencyStore.formatPrice(total) }}</span>
                </div>

                <button 
                  @click="confirmBooking" 
                  :disabled="isProcessing || !isFormValid"
                  class="w-full px-6 py-4 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isProcessing">Processing...</span>
                  <span v-else>Confirm Booking</span>
                </button>

                <p class="text-xs text-gray-500 mt-4 text-center">
                  By confirming, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import api from '../../services/api'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()

const isProcessing = ref(false)
const paymentMethod = ref('bank_transfer')

const guestInfo = ref({
  firstName: userStore.user?.user_metadata?.full_name?.split(' ')[0] || '',
  lastName: userStore.user?.user_metadata?.full_name?.split(' ')[1] || '',
  email: userStore.user?.email || '',
  phone: userStore.user?.user_metadata?.phone || '',
  specialRequests: ''
})

const bookingDetails = ref({
  checkIn: '',
  checkOut: '',
  guests: 1
})

const tripCart = computed(() => userStore.tripCart)

const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const subtotal = computed(() => {
  return tripCart.value.reduce((sum, item) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price
    return sum + (price || 0)
  }, 0)
})

const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const total = computed(() => subtotal.value + serviceFee.value)

const isFormValid = computed(() => {
  return guestInfo.value.firstName &&
         guestInfo.value.lastName &&
         guestInfo.value.email &&
         guestInfo.value.phone &&
         bookingDetails.value.checkIn &&
         bookingDetails.value.checkOut &&
         bookingDetails.value.guests > 0 &&
         paymentMethod.value
})

const confirmBooking = async () => {
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  if (!userStore.user) {
    alert('Please login to complete your booking')
    router.push('/login')
    return
  }

  isProcessing.value = true

  try {
    // Create bookings for each item in cart
    const bookingPromises = tripCart.value.map(item => {
      return api.bookings.create({
        item_id: item.id,
        item_type: item.type,
        check_in: bookingDetails.value.checkIn,
        check_out: bookingDetails.value.checkOut,
        guests: bookingDetails.value.guests,
        total_price: typeof item.price === 'string' 
          ? parseInt(item.price.replace(/[^0-9]/g, '')) 
          : item.price,
        guest_info: {
          firstName: guestInfo.value.firstName,
          lastName: guestInfo.value.lastName,
          email: guestInfo.value.email,
          phone: guestInfo.value.phone
        },
        special_requests: guestInfo.value.specialRequests,
        payment_method: paymentMethod.value,
        status: 'pending'
      })
    })

    const bookings = await Promise.all(bookingPromises)

    // Clear cart after successful booking
    userStore.clearCart()

    // Show success message
    alert(`Booking confirmed! Booking ID: ${bookings[0].id}\n\nOur team will contact you shortly with payment instructions.`)

    // Redirect to my bookings page
    router.push('/dashboard/bookings')

  } catch (error) {
    console.error('Booking error:', error)
    alert('Failed to create booking. Please try again or contact support.')
  } finally {
    isProcessing.value = false
  }
}
</script>
