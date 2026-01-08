<template>
  <div>
    <div v-if="!useFlutterwave">
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
        <p class="text-sm font-medium text-amber-900">{{ t('payment.integrationComingSoonTitle') }}</p>
        <p class="text-xs text-amber-700 mt-1">{{ t('payment.integrationComingSoonDesc') }}</p>
      </div>
      <button class="w-full px-4 py-3 bg-gray-400 text-white rounded-lg font-semibold cursor-not-allowed" disabled>{{ t('payment.gatewayNotAvailable') }}</button>
    </div>

    <div v-else>
      <p class="text-sm text-gray-600 mb-4">{{ t('payment.paySecurelyWithFlutterwave') }}</p>
      <button @click="handlePay" class="w-full px-4 py-3 bg-brand-500 text-white rounded-lg font-semibold">{{ t('payment.payNow') }}</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCurrencyStore } from '../../stores/currency'
import { startFlutterwavePayment } from '@/services/flutterwave'
import { useTranslation } from '@/composables/useTranslation'

const currencyStore = useCurrencyStore()
const { t } = useTranslation()

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
      alert(t('payment.successful'))
    } else {
      alert(t('payment.pending'))
    }
  } catch (err) {
    console.error(err)
    alert(err?.message || t('payment.failed'))
  }
}
</script>
