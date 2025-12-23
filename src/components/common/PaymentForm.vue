<template>
  <div>
    <div v-if="!useFlutterwave">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <p class="text-sm font-medium text-amber-900">Payment Integration Coming Soon</p>
        <p class="text-xs text-amber-700 mt-1">Online payment will be available soon. Our team will contact you with payment instructions.</p>
      </div>
      <button @click="payMock" class="w-full px-4 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed" disabled>Payment Gateway Not Available</button>
    </div>

    <div v-else>
      <p class="text-sm text-gray-600 mb-4">Pay securely with Flutterwave</p>
      <button @click="handlePay" class="w-full px-4 py-3 bg-brand-500 text-white rounded-lg font-semibold">Pay Now</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrencyStore } from '../../stores/currency'
import { startFlutterwavePayment } from '@/services/flutterwave'

const currencyStore = useCurrencyStore()

const props = defineProps({
  amount: { type: Number, default: 1000 },
  customer: { type: Object, default: () => ({}) },
  title: { type: String, default: 'Merry 360 Payment' },
  description: { type: String, default: 'Booking payment' }
})

const useFlutterwave = computed(() => {
  const k = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY
  return !!(k && k.length > 10)
})

async function handlePay() {
  try {
    const { response } = await startFlutterwavePayment({
      amount: props.amount,
      currency: currencyStore.selectedCurrency,
      customer: props.customer,
      title: props.title,
      description: props.description
    })

    if (response?.status === 'successful') {
      alert('Payment successful!')
    } else {
      alert('Payment pending/unknown. Please confirm in your payment history.')
    }
  } catch (err) {
    console.error(err)
    alert(err?.message || 'Payment failed')
  }
}

async function payMock() {
  // Payment not available yet
  alert('Payment integration coming soon. Our team will contact you with payment instructions.')
}
</script>
