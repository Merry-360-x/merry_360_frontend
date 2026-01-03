<template>
  <MainLayout>
    <section class="py-12 md:py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8">{{ t('checkout.title') }}</h1>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Checkout Form -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Guest Information -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('checkout.guestInfo') }}</h2>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.firstName') }} *</label>
                      <input 
                        v-model="guestInfo.firstName"
                        type="text" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.lastName') }} *</label>
                      <input 
                        v-model="guestInfo.lastName"
                        type="text" 
                        required
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.email') }} *</label>
                    <input 
                      v-model="guestInfo.email"
                      type="email" 
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.phone') }} *</label>
                    <input 
                      v-model="guestInfo.phone"
                      type="tel" 
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.specialRequests') }} ({{ t('common.optional') }})</label>
                    <textarea 
                      v-model="guestInfo.specialRequests"
                      rows="3"
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      :placeholder="t('checkout.specialRequestsPlaceholder')"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Booking Details -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('checkout.bookingDetails') }}</h2>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.checkInDate') }} *</label>
                      <input 
                        v-model="bookingDetails.checkIn"
                        type="date" 
                        required
                        :min="minDate"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.checkOutDate') }} *</label>
                      <input 
                        v-model="bookingDetails.checkOut"
                        type="date" 
                        required
                        :min="bookingDetails.checkIn || minDate"
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{{ t('checkout.numberOfGuests') }} *</label>
                    <input 
                      v-model.number="bookingDetails.guests"
                      type="number" 
                      min="1"
                      required
                      class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              <!-- Payment Method Selection -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors duration-200">
                <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('checkout.paymentMethod') }}</h2>
                
                <div class="space-y-3">
                  <label 
                    v-for="method in paymentMethods" 
                    :key="method.id"
                    class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
                    :class="paymentMethod === method.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
                  >
                    <input type="radio" :value="method.id" v-model="paymentMethod" class="w-4 h-4 text-brand-600" />
                    <div class="ml-4 flex-1">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="method.bgColor">
                          <component :is="method.icon" class="w-5 h-5" :class="method.iconColor" />
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 dark:text-gray-100">{{ t(method.nameKey) }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ t(method.descriptionKey) }}</p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Order Summary -->
            <div class="lg:col-span-1">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24 transition-colors duration-200">
                <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('cart.orderSummary') }}</h3>
                
                <div class="space-y-3 mb-4">
                  <div v-for="item in tripCart" :key="`${item.type}-${item.id}`" class="flex gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <img :src="item.image" :alt="item.name || item.title" class="w-16 h-16 object-cover rounded-lg" />
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ item.name || item.title }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">{{ t(itemTypeLabelKey[item.type] || item.type) }}</p>
                      <p class="text-sm font-bold text-brand-600 dark:text-brand-400 mt-1">
                        {{ currencyStore.formatPrice(typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) }}
                      </p>
                    </div>
                  </div>
                </div>

                <div class="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{{ t('cart.subtotal') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">{{ currencyStore.formatPrice(subtotal) }}</span>
                  </div>
                  <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{{ t('checkout.serviceFee') }}</span>
                    <span class="font-semibold text-gray-900 dark:text-gray-100">{{ currencyStore.formatPrice(serviceFee) }}</span>
                  </div>
                </div>

                <div class="flex justify-between text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                  <span>{{ t('cart.total') }}</span>
                  <span class="text-brand-600 dark:text-brand-400">{{ currencyStore.formatPrice(total) }}</span>
                </div>

                <button 
                  @click="proceedToPayment" 
                  :disabled="isProcessing || !isFormValid"
                  class="w-full px-6 py-4 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isProcessing">{{ t('checkout.processing') }}</span>
                  <span v-else>{{ t('checkout.proceedToPayment') }}</span>
                </button>

                <p class="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">
                  {{ t('checkout.termsNotice') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Payment Modal -->
    <PaymentModal 
      :isOpen="showPaymentModal"
      :amount="total"
      :currency="currencyStore.currentCurrency"
      :bookingDetails="bookingDetails"
      @close="showPaymentModal = false"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />

    <!-- Success Modal -->
    <BookingSuccessModal 
      :isOpen="showSuccessModal"
      :booking="completedBooking"
      @close="handleSuccessClose"
      @viewBooking="goToBookings"
    />
  </MainLayout>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { createBooking, supabase } from '../../services/supabase'
import { useTranslation } from '../../composables/useTranslation'
import MainLayout from '../../components/layout/MainLayout.vue'
import PaymentModal from '../../components/payment/PaymentModal.vue'
import BookingSuccessModal from '../../components/payment/BookingSuccessModal.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()

const isProcessing = ref(false)
const showPaymentModal = ref(false)
const showSuccessModal = ref(false)
const completedBooking = ref({})
const paymentMethod = ref('card')

const guestInfo = ref({
  firstName: userStore.user?.firstName || '',
  lastName: userStore.user?.lastName || '',
  email: userStore.user?.email || '',
  phone: userStore.user?.phone || '',
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

// Payment method icons
const CardIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' })
])

const MobileIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z' })
])

const paymentMethods = [
  { id: 'card', nameKey: 'checkout.bankCard', descriptionKey: 'checkout.bankCardDesc', icon: CardIcon, bgColor: 'bg-blue-100 dark:bg-blue-900', iconColor: 'text-blue-600 dark:text-blue-400' },
  { id: 'mtn', nameKey: 'checkout.mtnMobileMoney', descriptionKey: 'checkout.mtnMobileMoneyDesc', icon: MobileIcon, bgColor: 'bg-yellow-100 dark:bg-yellow-900', iconColor: 'text-yellow-600 dark:text-yellow-400' },
  { id: 'airtel', nameKey: 'checkout.airtelMoney', descriptionKey: 'checkout.airtelMoneyDesc', icon: MobileIcon, bgColor: 'bg-red-100 dark:bg-red-900', iconColor: 'text-red-600 dark:text-red-400' }
]

const itemTypeLabelKey = {
  accommodation: 'nav.accommodations',
  tour: 'nav.tours',
  transport: 'nav.transport',
  service: 'nav.services'
}

function proceedToPayment() {
  if (!isFormValid.value) {
    alert(t('checkout.fillRequiredFields'))
    return
  }

  if (!userStore.user) {
    alert(t('auth.loginToCompleteBooking'))
    router.push('/login')
    return
  }

  showPaymentModal.value = true
}

async function handlePaymentSuccess(paymentResult) {
  showPaymentModal.value = false
  isProcessing.value = true

  try {
    // Create bookings for each item in cart
    const created = []
    for (const item of tripCart.value) {
      const price = typeof item.price === 'string'
        ? parseInt(item.price.replace(/[^0-9]/g, ''))
        : item.price

      const booking = await createBooking({
        user_id: userStore.user.id,
        listing_id: item.id,
        item_type: item.type,
        check_in: bookingDetails.value.checkIn,
        check_out: bookingDetails.value.checkOut,
        guests: bookingDetails.value.guests,
        total_price: price || 0,
        guest_first_name: guestInfo.value.firstName,
        guest_last_name: guestInfo.value.lastName,
        guest_email: guestInfo.value.email,
        guest_phone: guestInfo.value.phone,
        special_requests: guestInfo.value.specialRequests,
        payment_method: paymentResult.method,
        payment_status: 'paid',
        status: 'confirmed',
        transaction_ref: paymentResult.transactionRef
      })

      created.push(booking)
      
      // Send confirmation emails for each booking
      sendBookingEmails(booking, item).catch(err => {
        console.error('Failed to send booking emails:', err)
      })
    }

    // Clear cart
    userStore.clearCart()

    // Set completed booking data for success modal
    const firstItem = tripCart.value[0] || {}
    completedBooking.value = {
      id: created[0]?.id?.substring(0, 8) || t('common.na'),
      propertyName: firstItem.name || firstItem.title || t('common.property'),
      propertyImage: firstItem.image,
      location: firstItem.location || t('accommodation.location'),
      rating: firstItem.rating || 4.8,
      checkIn: bookingDetails.value.checkIn,
      checkOut: bookingDetails.value.checkOut,
      guests: bookingDetails.value.guests,
      paymentMethod: paymentResult.method,
      transactionRef: paymentResult.transactionRef,
      amount: total.value,
      email: guestInfo.value.email
    }

    showSuccessModal.value = true

  } catch (error) {
    console.error('Booking error:', error)
    alert(t('checkout.bookingFailed'))
  } finally {
    isProcessing.value = false
  }
}

function handlePaymentError(error) {
  showPaymentModal.value = false
  alert(t('checkout.paymentFailed'))
}

// Send booking confirmation emails
async function sendBookingEmails(booking, item) {
  try {
    const response = await supabase.functions.invoke('send-booking-emails', {
      body: {
        bookingId: booking.id,
        customerEmail: guestInfo.value.email,
        customerName: `${guestInfo.value.firstName} ${guestInfo.value.lastName}`.trim(),
        propertyName: item.name || item.title || 'Your booking',
        checkIn: bookingDetails.value.checkIn,
        checkOut: bookingDetails.value.checkOut,
        guests: bookingDetails.value.guests,
        totalPrice: booking.total_price,
        currency: currencyStore.selectedCurrency,
        bookingStatus: booking.status || 'confirmed',
        specialRequests: guestInfo.value.specialRequests || undefined,
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

function handleSuccessClose() {
  showSuccessModal.value = false
  router.push('/')
}

function goToBookings() {
  showSuccessModal.value = false
  router.push('/profile')
}
</script>
