<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 font-sans">
    <!-- Header -->
    <header class="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-b border-white/20 dark:border-gray-700/20">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20 md:h-24">
          <!-- Logo -->
          <router-link to="/" class="flex items-center">
            <img loading="lazy" src="/logo.png" alt="Merry360" class="h-12 md:h-16 w-auto" />
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-1">
            <router-link 
              v-for="item in navigation"
              :key="item.name"
              :to="item.to" 
              class="text-sm text-gray-700 font-medium hover:text-brand-600 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600"
            >
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Desktop Right -->
          <div class="hidden lg:flex items-center gap-2">
            <!-- Currency Toggle -->
            <button 
              @click="currencyStore.toggleCurrency()"
              class="px-4 py-2 border border-brand-500 rounded-[20px] text-sm font-medium text-gray-700 hover:text-brand-600 transition-all bg-transparent flex items-center gap-2"
              :title="'Switch to ' + (currencyStore.currentCurrency === 'USD' ? 'RWF' : 'USD')"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ currencyStore.currentCurrency }}
            </button>

            <select v-model="languageStore.currentLanguage" @change="languageStore.setLanguage(languageStore.currentLanguage)" class="px-4 py-2 border border-brand-500 rounded-[20px] text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-transparent cursor-pointer transition-all">
              <option value="EN">EN</option>
              <option value="RW">RW</option>
              <option value="FR">FR</option>
              <option value="ZH">中文</option>
            </select>

            <router-link to="/dashboard/watchlist" class="relative p-1.5 hover:bg-transparent rounded" title="Wishlist">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span v-if="watchlistCount > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ watchlistCount }}</span>
            </router-link>

            <router-link 
              to="/login"
              class="relative flex items-center gap-2 bg-transparent border border-gray-200 rounded-[20px] px-2 py-1 hover:shadow-md transition-all"
            >
              <svg class="w-5 h-5 text-gray-800 dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="2" rx="1"/>
                <rect x="2" y="11" width="20" height="2" rx="1"/>
                <rect x="2" y="17" width="20" height="2" rx="1"/>
              </svg>
              <svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </router-link>
          </div>

          <!-- Mobile Right -->
          <div class="flex lg:hidden items-center gap-1">
            <!-- Currency Toggle Mobile -->
            <button 
              @click="currencyStore.toggleCurrency()"
              class="px-3 py-1.5 border border-brand-500 rounded-[15px] text-xs font-semibold text-gray-700 hover:text-brand-600 transition-all bg-transparent"
            >
              {{ currencyStore.currentCurrency }}
            </button>

            <router-link to="/dashboard/watchlist" class="relative p-1.5">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span v-if="watchlistCount > 0" class="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ watchlistCount }}</span>
            </router-link>

            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-1.5 text-gray-900"
              aria-label="Menu"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Slide-out Menu -->
      <transition
        enter-active-class="transition-transform duration-300"
        enter-from-class="translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-300"
        leave-from-class="translate-x-0"
        leave-to-class="translate-x-full"
      >
        <div v-if="mobileMenuOpen" class="fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-2xl lg:hidden z-50">
          <div class="h-full flex flex-col">
            <!-- Menu Header -->
            <div class="flex items-center justify-between p-4 border-b">
              <span class="font-bold text-gray-900">Menu</span>
              <button @click="mobileMenuOpen = false" class="p-1">
                <svg class="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Menu Items -->
            <nav class="flex-1 overflow-y-auto p-4 space-y-1">
              <router-link 
                v-for="item in navigation"
                :key="item.name"
                :to="item.to" 
                @click="mobileMenuOpen = false"
                class="block py-2.5 px-3 text-sm text-gray-900 hover:bg-gray-50 rounded transition-colors"
              >
                {{ item.name }}
              </router-link>
              
              <div class="pt-4 mt-4 border-t">
                <select v-model="selectedLanguage" @change="changeLanguage" class="w-full px-3 py-2 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary bg-white">
                  <option value="EN">English</option>
                  <option value="RW">Kinyarwanda</option>
                  <option value="FR">Français</option>
                </select>
              </div>

              <router-link to="/login" @click="mobileMenuOpen = false" class="block mt-4 py-2.5 px-3 bg-primary text-white text-sm text-center rounded font-medium">
                {{ t('nav.login') }}
              </router-link>
            </nav>
          </div>
        </div>
      </transition>

      <!-- Mobile Menu Overlay -->
      <transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-300"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="mobileMenuOpen" @click="mobileMenuOpen = false" class="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"></div>
      </transition>
    </header>

    <!-- Main Content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-t border-white/10 mt-20 relative overflow-hidden">
      <div class="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-2xl">M</span>
              </div>
              <span class="text-xl font-bold text-white tracking-tight">Merry<span class="text-red-300">360X</span></span>
            </div>
            <p class="text-white/80 text-sm leading-relaxed">Discover the warmth of African hospitality with modern travel solutions.</p>
          </div>
          <div>
            <h4 class="font-bold mb-5 text-red-400 text-base" style="font-family: 'Montserrat', sans-serif;">Explore</h4>
            <ul class="space-y-3 text-white/70 text-sm">
              <li><router-link to="/accommodations" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">🏠 Accommodations</router-link></li>
              <li><router-link to="/tours" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">🌍 Tours</router-link></li>
              <li><router-link to="/transport" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">🚗 Transport</router-link></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-5 text-red-400 text-base" style="font-family: 'Montserrat', sans-serif;">Company</h4>
            <ul class="space-y-3 text-white/70 text-sm">
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">About Us</a></li>
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">Contact</a></li>
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold mb-5 text-red-400 text-base" style="font-family: 'Montserrat', sans-serif;">Support</h4>
            <ul class="space-y-3 text-white/70 text-sm">
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">Help Center</a></li>
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">Safety</a></li>
              <li><a href="#" class="hover:text-red-400 transition-all hover:translate-x-1 inline-block">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p class="text-white/60 text-sm">© 2025 Merry360X. All rights reserved.</p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-white/60 hover:text-red-400 text-sm transition-colors">Privacy</a>
            <a href="#" class="text-white/60 hover:text-red-400 text-sm transition-colors">Terms</a>
            <a href="#" class="text-white/60 hover:text-red-400 text-sm transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useLanguageStore } from '../../stores/language'
import { useTranslation } from '../../composables/useTranslation'

const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const languageStore = useLanguageStore()
const mobileMenuOpen = ref(false)
const { t } = useTranslation()

const navigation = computed(() => [
  { name: t('nav.home'), to: '/' },
  { name: t('nav.accommodations'), to: '/accommodations' },
  { name: t('nav.tours'), to: '/tours' },
  { name: t('nav.transport'), to: '/transport' },
  { name: t('nav.myTrips'), to: '/profile' },
])

// Theme toggle
const isDarkMode = computed(() => userStore.preferences.theme === 'dark')

const toggleTheme = () => {
  userStore.toggleTheme()
  // Apply theme to document
  const isDark = userStore.preferences.theme === 'dark'
  if (isDark) {
    document.documentElement.classList.add('dark')
    document.body.style.backgroundColor = '#1a202c'
    document.body.style.color = '#f7fafc'
  } else {
    document.documentElement.classList.remove('dark')
    document.body.style.backgroundColor = '#ffffff'
    document.body.style.color = '#000000'
  }
}

// Watchlist and cart counts
const watchlistCount = computed(() => userStore.watchlistCount)
const cartCount = computed(() => userStore.cartCount)
</script>
