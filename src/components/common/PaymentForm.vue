<template>
  <div>
    <div v-if="!useStripe">
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Stripe not configured - using mock payment flow for demo.</p>
      <input v-model="cardNumber" placeholder="Card number (mock)" class="w-full p-3 border rounded mb-2" />
      <div class="grid grid-cols-2 gap-2">
        <input v-model="expiry" placeholder="MM/YY" class="p-3 border rounded" />
        <input v-model="cvv" placeholder="CVV" class="p-3 border rounded" />
      </div>
      <button @click="payMock" class="mt-3 px-4 py-2 bg-brand-500 text-white rounded">Pay (Demo)</button>
    </div>

    <div v-else>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Enter card details to complete payment</p>
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
  // Create Payment Intent via backend (mock fallback)
  try {
    const amount = 1000 // demo amount
    const res = await apiClient.post('/payments/intent', { amount, currency: currencyStore.selectedCurrency })
    // ideally use client_secret and confirm card via stripe
    alert('Payment flow created (demo). Replace with a backend Payment Intent for production.')
  } catch (err) {
    console.error(err)
    alert('Payment failed')
  }
}

async function payMock() {
  // Simulate success via API
  try {
    const res = await apiClient.post('/payments/intent', { amount: 1000, currency: currencyStore.selectedCurrency })
    await apiClient.post(`/payments/${res.data.intentId}/confirm`)
    alert('Mock payment succeeded')
  } catch (err) {
    alert('Payment error')
  }
}
</script>
