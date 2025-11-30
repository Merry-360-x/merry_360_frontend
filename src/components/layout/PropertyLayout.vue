<template>
  <div class="min-h-screen flex flex-col bg-white font-sans">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="px-4 sm:px-6">
        <div class="flex items-center justify-between h-14">
          <!-- Logo -->
          <router-link to="/home" class="flex items-center">
            <img src="/logo.png" alt="Merry360" class="h-12" />
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center space-x-6">
            <router-link 
              v-for="item in navigation"
              :key="item.name"
              :to="item.to" 
              class="text-sm text-gray-600 hover:text-primary transition-colors"
            >
              {{ item.name }}
            </router-link>
          </nav>

          <!-- Desktop Right -->
          <div class="hidden lg:flex items-center gap-2">
            <select v-model="selectedLanguage" @change="changeLanguage" class="px-2 py-1 border border-gray-200 rounded text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-primary bg-white">
              <option value="EN">EN</option>
              <option value="RW">RW</option>
              <option value="FR">FR</option>
            </select>

            <router-link to="/dashboard/watchlist" class="relative p-1.5 hover:bg-gray-50 rounded" title="Wishlist">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span v-if="watchlistCount > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ watchlistCount }}</span>
            </router-link>

            <router-link to="/trip-cart" class="relative p-1.5 hover:bg-gray-50 rounded" title="Cart">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ cartCount }}</span>
            </router-link>

            <router-link 
              to="/login"
              class="px-4 py-1.5 border border-primary text-primary text-sm rounded hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {{ t('nav.login') }}
            </router-link>
          </div>

          <!-- Mobile Right -->
          <div class="flex lg:hidden items-center gap-1">
            <router-link to="/dashboard/watchlist" class="relative p-1.5">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              <span v-if="watchlistCount > 0" class="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ watchlistCount }}</span>
            </router-link>

            <router-link to="/trip-cart" class="relative p-1.5">
              <svg class="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span v-if="cartCount > 0" class="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">{{ cartCount }}</span>
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
        <div v-if="mobileMenuOpen" class="fixed inset-y-0 right-0 w-64 bg-white shadow-2xl lg:hidden z-50">
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
    <footer class="bg-white border-t border-gray-200 mt-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
          <!-- Logo & Description -->
          <div class="col-span-2 sm:col-span-1">
            <img src="/logo.png" alt="Merry360" class="h-16 mb-2" />
            <p class="text-text-secondary text-xs">
              © 2025 Merry360. All rights reserved
            </p>
          </div>

          <!-- Company Links -->
          <div>
            <h3 class="font-medium text-text-primary mb-2 text-sm">COMPANY</h3>
            <ul class="space-y-1">
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">About</a></li>
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">Blog</a></li>
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">Contact</a></li>
            </ul>
          </div>

          <!-- Help & Support -->
          <div>
            <h3 class="font-medium text-text-primary mb-2 text-sm">SUPPORT</h3>
            <ul class="space-y-1">
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">Documentation</a></li>
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">FAQs</a></li>
              <li><a href="#" class="text-text-secondary hover:text-primary text-xs">Terms</a></li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="col-span-2 sm:col-span-1">
            <h3 class="font-medium text-text-primary mb-2 text-sm">CONTACT</h3>
            <ul class="space-y-1.5">
              <li class="flex items-center text-xs">
                <svg class="w-3 h-3 mr-1.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span class="text-text-secondary">support@merry360x.com</span>
              </li>
              <li class="flex items-center text-xs">
                <svg class="w-3 h-3 mr-1.5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <span class="text-text-secondary">(123) 456-7890</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <!-- Social Links -->
          <div class="flex items-center space-x-3">
            <a href="#" class="text-text-secondary hover:text-primary">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" class="text-text-secondary hover:text-primary">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
            <a href="#" class="text-text-secondary hover:text-primary">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
              </svg>
            </a>
            <a href="#" class="text-text-secondary hover:text-primary">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>

          <!-- Simple Text -->
          <p class="text-xs text-text-secondary">Merry360 - Travel made simple</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'

const userStore = useUserStore()
const mobileMenuOpen = ref(false)
const { t } = useTranslation()

const navigation = computed(() => [
  { name: t('nav.home'), to: '/home' },
  { name: t('nav.accommodations'), to: '/accommodations' },
  { name: t('nav.tours'), to: '/tours' },
  { name: t('nav.transport'), to: '/transport' },
  { name: t('nav.services'), to: '/services' },
  { name: t('nav.myTrips'), to: '/dashboard' },
])

// Language selection
const selectedLanguage = ref(userStore.preferences.language)

const changeLanguage = () => {
  userStore.setLanguage(selectedLanguage.value)
}

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
