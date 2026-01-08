import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCurrencyStore = defineStore('currency', () => {
  // Exchange rates relative to RWF (base currency - prices are stored in RWF)
  // 1 RWF = X in other currencies
  const exchangeRates = ref({
    RWF: 1,        // Base currency
    USD: 0.00077,  // 1 RWF = 0.00077 USD (1 USD = 1300 RWF)
    EUR: 0.00071,  // 1 RWF = 0.00071 EUR
    GBP: 0.00061,  // 1 RWF = 0.00061 GBP
    CNY: 0.0055    // 1 RWF = 0.0055 CNY
  })

  const currencies = ['RWF', 'USD', 'EUR', 'GBP', 'CNY']
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CNY: '¥',
    RWF: 'RWF'
  }
  
  // Current currency - default to RWF (Rwandan Francs)
  const storedCurrency = localStorage.getItem('merry360_currency')
  const currentCurrency = ref(storedCurrency && currencies.includes(storedCurrency) ? storedCurrency : 'RWF')
  
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
  
  // Convert price from RWF to current currency
  // Prices are stored in RWF in the database
  const convertPrice = (priceInRWF) => {
    if (!priceInRWF || priceInRWF === 0) return 0
    const rate = exchangeRates.value[currentCurrency.value]
    return priceInRWF * rate
  }
  
  // Format price with proper currency symbol
  // Prices are stored in RWF, so we convert from RWF to display currency
  const formatPrice = (priceInRWF) => {
    if (!priceInRWF || priceInRWF === 0) return '0 RWF'
    
    const convertedPrice = convertPrice(priceInRWF)
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
