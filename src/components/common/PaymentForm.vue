<template>
  <div>
    <div v-if="!useStripe">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <p class="text-sm font-medium text-amber-900">Payment Integration Coming Soon</p>
        <p class="text-xs text-amber-700 mt-1">Online payment will be available soon. Our team will contact you with payment instructions.</p>
      </div>
      <button @click="payMock" class="w-full px-4 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed" disabled>Payment Gateway Not Available</button>
    </div>

    <div v-else>
      <p class="text-sm text-gray-600 mb-4">Enter card details to complete payment</p>
      <div id="card-element" class="p-3 border rounded"></div>
      <button @click="handlePay" class="mt-3 px-4 py-2 bg-brand-500 text-white rounded">Pay</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { loadStripe } from '@stripe/stripe-js'
import { useCurrencyStore } from '../../stores/currency'
import { apiClient } from '@/services/api'

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const useStripe = stripeKey && stripeKey.length > 5

const card = ref(null)
const stripe = ref(null)
const elements = ref(null)

const cardNumber = ref('')
const expiry = ref('')
const cvv = ref('')

const currencyStore = useCurrencyStore()

onMounted(async () => {
  if (useStripe) {
    stripe.value = await loadStripe(stripeKey)
    elements.value = stripe.value.elements()
    const cardEl = elements.value.create('card')
    cardEl.mount('#card-element')
    card.value = cardEl
  }
})

async function handlePay() {
  if (!useStripe) return
  // Create Payment Intent via backend
  try {
    const amount = props.amount || 1000
    const res = await apiClient.post('/payments/intent', { amount, currency: currencyStore.selectedCurrency })
    // Use client_secret to confirm card via stripe
    const { error } = await stripe.value.confirmCardPayment(res.data.client_secret, {
      payment_method: { card: card.value }
    })
    if (error) {
      alert('Payment failed: ' + error.message)
    } else {
      alert('Payment successful!')
    }
  } catch (err) {
    console.error(err)
    alert('Payment failed')
  }
}

async function payMock() {
  // Payment not available yet
  alert('Payment integration coming soon. Our team will contact you with payment instructions.')
}
</script>
