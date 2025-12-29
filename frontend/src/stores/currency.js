import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', () => {
  // Exchange rates relative to USD
  const exchangeRates = ref({
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    CNY: 7.24,
    RWF: 1300
  })

  const currencies = ['USD', 'EUR', 'GBP', 'CNY', 'RWF']
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CNY: '¥',
    RWF: 'RWF'
  }
  
  // Current currency - default to USD
  const storedCurrency = localStorage.getItem('merry360_currency')
  const currentCurrency = ref(storedCurrency && currencies.includes(storedCurrency) ? storedCurrency : 'USD')
  
  // Set currency
  const setCurrency = (currency) => {
    if (currencies.includes(currency)) {
      currentCurrency.value = currency
      localStorage.setItem('merry360_currency', currency)
    }
  }
  
  // Toggle between currencies (cycle through)
  const toggleCurrency = () => {
    const currentIndex = currencies.indexOf(currentCurrency.value)
    const nextIndex = (currentIndex + 1) % currencies.length
    setCurrency(currencies[nextIndex])
  }
  
  // Convert price based on current currency
  const convertPrice = (priceInUSD) => {
    const rate = exchangeRates.value[currentCurrency.value]
    return priceInUSD * rate
  }
  
  // Format price with proper currency symbol
  const formatPrice = (priceInUSD) => {
    const convertedPrice = convertPrice(priceInUSD)
    const formatted = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: currentCurrency.value === 'RWF' ? 0 : 2,
      maximumFractionDigits: currentCurrency.value === 'RWF' ? 0 : 2
    }).format(convertedPrice)
    
    const symbol = currencySymbols[currentCurrency.value]
    
    if (currentCurrency.value === 'RWF' || currentCurrency.value === 'CNY') {
      return `${formatted} ${symbol}`
    }
    return `${symbol}${formatted}`
  }
  
  // Get currency symbol
  const currencySymbol = computed(() => {
    return currencySymbols[currentCurrency.value]
  })
  
  return {
    currentCurrency,
    exchangeRates,
    currencies,
    currencySymbols,
    setCurrency,
    toggleCurrency,
    convertPrice,
    formatPrice,
    currencySymbol
  }
})
