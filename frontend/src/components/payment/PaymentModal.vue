<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transition-colors duration-200">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100">Payment</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 dark:text-gray-400 mt-1">Choose your preferred payment method</p>
      </div>

      <!-- Payment Methods -->
      <div class="p-6">
        <!-- Amount Display -->
        <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
          <p class="text-sm text-gray-600 dark:text-gray-400">Total Amount</p>
          <p class="text-3xl font-bold text-gray-900 dark:text-gray-100">{{ formatCurrency(amount) }}</p>
        </div>

        <!-- Payment Method Selection -->
        <div class="space-y-3 mb-6">
          <label 
            v-for="method in paymentMethods" 
            :key="method.id"
            class="flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all"
            :class="selectedMethod === method.id ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
          >
            <input 
              type="radio" 
              :value="method.id" 
              v-model="selectedMethod" 
              class="w-4 h-4 text-brand-600"
            />
            <div class="ml-4 flex-1">
              <div class="flex items-center gap-3">
                <component :is="method.icon" class="w-8 h-8" />
                <div>
                  <p class="font-semibold text-gray-900 dark:text-gray-100">{{ method.name }}</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">{{ method.description }}</p>
                </div>
              </div>
            </div>
          </label>
        </div>

        <!-- Bank Card Form -->
        <div v-if="selectedMethod === 'card'" class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Card Number</label>
            <input 
              v-model="cardForm.number"
              type="text" 
              maxlength="19"
              placeholder="1234 5678 9012 3456"
              @input="formatCardNumber"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Expiry Date</label>
              <input 
                v-model="cardForm.expiry"
                type="text" 
                maxlength="5"
                placeholder="MM/YY"
                @input="formatExpiry"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CVV</label>
              <input 
                v-model="cardForm.cvv"
                type="text" 
                maxlength="4"
                placeholder="123"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Cardholder Name</label>
            <input 
              v-model="cardForm.name"
              type="text" 
              placeholder="John Doe"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        <!-- Mobile Money Form -->
        <div v-if="selectedMethod === 'mtn' || selectedMethod === 'airtel'" class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input 
              v-model="mobileForm.phone"
              type="tel" 
              placeholder="+250 78X XXX XXX"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            You will receive a prompt on your phone to confirm the payment of {{ formatCurrency(amount) }}
          </p>
        </div>

        <!-- Pay Button -->
        <button 
          @click="processPayment"
          :disabled="processing || !isFormValid"
          class="w-full py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="processing" class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>Pay {{ formatCurrency(amount) }}</span>
        </button>

        <!-- Security Note -->
        <p class="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          🔒 Your payment is secured with 256-bit SSL encryption
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  bookingDetails: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['close', 'success', 'error'])

const selectedMethod = ref('card')
const processing = ref(false)

const cardForm = ref({
  number: '',
  expiry: '',
  cvv: '',
  name: ''
})

const mobileForm = ref({
  phone: ''
})

// Payment method icons as render functions
const CardIcon = () => h('svg', { class: 'w-8 h-8 text-blue-600', fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z' })
])

const MTNIcon = () => h('svg', { class: 'w-8 h-8', viewBox: '0 0 24 24', fill: 'none' }, [
  h('circle', { cx: '12', cy: '12', r: '10', fill: '#FFCC00' }),
  h('text', { x: '12', y: '16', 'text-anchor': 'middle', 'font-size': '8', 'font-weight': 'bold', fill: '#000' }, 'MTN')
])

const AirtelIcon = () => h('svg', { class: 'w-8 h-8', viewBox: '0 0 24 24', fill: 'none' }, [
  h('circle', { cx: '12', cy: '12', r: '10', fill: '#ED1C24' }),
  h('text', { x: '12', y: '14', 'text-anchor': 'middle', 'font-size': '6', 'font-weight': 'bold', fill: '#fff' }, 'airtel')
])

const paymentMethods = [
  { id: 'card', name: 'Bank Card', description: 'Visa, Mastercard, etc.', icon: CardIcon },
  { id: 'mtn', name: 'MTN Mobile Money', description: 'Pay with MTN MoMo', icon: MTNIcon },
  { id: 'airtel', name: 'Airtel Money', description: 'Pay with Airtel Money', icon: AirtelIcon }
]

const isFormValid = computed(() => {
  if (selectedMethod.value === 'card') {
    return cardForm.value.number.length >= 16 && 
           cardForm.value.expiry.length === 5 && 
           cardForm.value.cvv.length >= 3 &&
           cardForm.value.name.length > 0
  }
  if (selectedMethod.value === 'mtn' || selectedMethod.value === 'airtel') {
    return mobileForm.value.phone.length >= 10
  }
  return false
})

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: props.currency
  }).format(amount)
}

function formatCardNumber(e) {
  let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '')
  value = value.match(/.{1,4}/g)?.join(' ') || value
  cardForm.value.number = value
}

function formatExpiry(e) {
  let value = e.target.value.replace(/\D/g, '')
  if (value.length >= 2) {
    value = value.slice(0, 2) + '/' + value.slice(2, 4)
  }
  cardForm.value.expiry = value
}

async function processPayment() {
  processing.value = true

  try {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Generate transaction reference
    const txRef = `MERRY360_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Emit success with payment details
    emit('success', {
      transactionRef: txRef,
      method: selectedMethod.value,
      amount: props.amount,
      currency: props.currency,
      status: 'successful',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Payment error:', error)
    emit('error', error)
  } finally {
    processing.value = false
  }
}
</script>
