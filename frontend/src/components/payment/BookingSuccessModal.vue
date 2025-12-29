<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transition-colors duration-200">
      <!-- Success Animation -->
      <div class="bg-gradient-to-br from-green-400 to-green-600 p-8 text-center">
        <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg class="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
        <p class="text-green-100">Your reservation has been successfully made</p>
      </div>

      <!-- Booking Details -->
      <div class="p-6">
        <div class="space-y-4">
          <!-- Booking ID -->
          <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking Reference</p>
            <p class="text-lg font-mono font-bold text-gray-900 dark:text-gray-100">{{ booking.id || 'N/A' }}</p>
          </div>

          <!-- Property Info -->
          <div class="flex gap-4">
            <img 
              :src="booking.propertyImage || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
              :alt="booking.propertyName"
              class="w-24 h-24 rounded-xl object-cover"
            />
            <div>
              <h3 class="font-bold text-gray-900 dark:text-gray-100">{{ booking.propertyName || 'Property' }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking.location || 'Location' }}</p>
              <div class="flex items-center gap-1 mt-1">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <span class="text-sm text-gray-600 dark:text-gray-400">{{ booking.rating || '4.8' }}</span>
              </div>
            </div>
          </div>

          <!-- Dates -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Check-in</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100">{{ formatDate(booking.checkIn) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Check-out</p>
              <p class="font-semibold text-gray-900 dark:text-gray-100">{{ formatDate(booking.checkOut) }}</p>
            </div>
          </div>

          <!-- Guests -->
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Guests</p>
            <p class="font-semibold text-gray-900 dark:text-gray-100">{{ booking.guests || 1 }} {{ booking.guests === 1 ? 'Guest' : 'Guests' }}</p>
          </div>

          <!-- Payment Info -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600 dark:text-gray-400">Payment Method</span>
              <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatPaymentMethod(booking.paymentMethod) }}</span>
            </div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-gray-600 dark:text-gray-400">Transaction ID</span>
              <span class="font-mono text-sm text-gray-900 dark:text-gray-100">{{ booking.transactionRef || 'N/A' }}</span>
            </div>
            <div class="flex justify-between items-center text-lg">
              <span class="font-semibold text-gray-900 dark:text-gray-100">Total Paid</span>
              <span class="font-bold text-green-600 dark:text-green-400">{{ formatCurrency(booking.amount) }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex gap-4 mt-6">
          <button 
            @click="$emit('viewBooking')"
            class="flex-1 px-4 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors"
          >
            View My Bookings
          </button>
          <button 
            @click="$emit('close')"
            class="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-colors"
          >
            Continue Browsing
          </button>
        </div>

        <!-- Confirmation Email Note -->
        <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          📧 A confirmation email has been sent to {{ booking.email || 'your email' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  booking: {
    type: Object,
    default: () => ({})
  }
})

defineEmits(['close', 'viewBooking'])

function formatDate(dateStr) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

function formatCurrency(amount) {
  if (!amount) return '$0.00'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

function formatPaymentMethod(method) {
  const methods = {
    'card': 'Bank Card',
    'mtn': 'MTN Mobile Money',
    'airtel': 'Airtel Money',
    'bank_transfer': 'Bank Transfer',
    'mobile_money': 'Mobile Money',
    'pay_on_arrival': 'Pay on Arrival'
  }
  return methods[method] || method || 'N/A'
}
</script>
