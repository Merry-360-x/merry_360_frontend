<template>
  <div class="min-h-screen flex flex-col bg-white dark:bg-gray-900 font-sans transition-colors duration-200">
    <!-- Header -->
    <header class="bg-white/80 dark:bg-gray-800/80 lg:bg-white dark:lg:bg-gray-800 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div class="container mx-auto px-3 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 sm:h-20">
          <!-- Logo -->
          <router-link to="/" class="flex items-center flex-shrink-0 mr-2 sm:mr-4">
            <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-10 sm:h-10 md:h-12 w-auto" />
          </router-link>

          <!-- Desktop Navigation -->
          <nav class="hidden lg:flex items-center gap-0">
            <router-link 
              to="/"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
              exact
            >
              {{ t('nav.home') }}
            </router-link>
            <router-link 
              to="/accommodations"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
            >
              {{ t('nav.accommodations') }}
            </router-link>
            <router-link 
              to="/tours"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
            >
              {{ t('nav.tours') }}
            </router-link>
            <router-link 
              to="/transport"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
            >
              {{ t('nav.transport') }}
            </router-link>
            <router-link 
              to="/services"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
            >
              {{ t('nav.services') }}
            </router-link>
            <router-link 
              to="/stories"
              class="text-sm text-text-secondary font-medium hover:text-brand-600 dark:hover:text-brand-400 transition-all px-4 py-2 border border-transparent rounded-[25px]"
              active-class="!border-brand-500 !text-brand-600 dark:!text-brand-400"
            >
              {{ t('nav.stories') }}
            </router-link>
            <router-link
              v-if="canSeeHostPortal"
              to="/host"
              class="text-sm text-white font-medium hover:bg-red-600 transition-all px-4 py-2 bg-red-500 rounded-[25px] ml-4"
            >
              {{ t('nav.hostDashboard') }}
            </router-link>
            <router-link
              v-else
              to="/become-host"
              class="text-sm text-white font-medium hover:bg-red-600 transition-all px-4 py-2 bg-red-500 rounded-[25px] ml-4"
            >
              {{ t('nav.becomeHost') }}
            </router-link>
          </nav>

          <!-- Desktop Right -->
          <div class="hidden lg:flex items-center gap-2">
            <!-- Dark Mode Toggle -->
            <button
              @click="themeStore.toggleTheme()"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              title="Toggle Dark Mode"
            >
              <svg v-if="!themeStore.isDark" class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
              </svg>
              <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </button>

            <!-- Currency Selector -->
            <select 
              v-model="currencyStore.currentCurrency" 
              @change="currencyStore.setCurrency(currencyStore.currentCurrency)" 
              class="px-2.5 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold text-text-secondary dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white cursor-pointer transition-all"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="CNY">¥ CNY</option>
              <option value="RWF">RWF</option>
            </select>

            <select v-model="languageStore.currentLanguage" @change="languageStore.setLanguage(languageStore.currentLanguage)" class="px-2.5 py-1 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold text-text-secondary dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white cursor-pointer transition-all">
              <option value="EN">EN</option>
              <option value="RW">RW</option>
              <option value="FR">FR</option>
              <option value="ZH">中文</option>
              <option value="SW">SW</option>
            </select>

            <router-link to="/trip-cart" class="relative px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-full text-sm font-semibold text-text-secondary hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-all">
              {{ t('nav.tripCart') }}
              <span v-if="userStore.cartCount > 0" class="ml-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center">{{ userStore.cartCount }}</span>
            </router-link>

            <router-link to="/dashboard/watchlist" class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" :title="t('nav.wishlist')">
              <svg class="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </router-link>

            <!-- User Menu (when authenticated) -->
            <div v-if="userStore.isAuthenticated" class="relative" v-click-outside="closeUserMenu">
              <button 
                @click.stop="showUserMenu = !showUserMenu"
                class="relative flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-full pl-2 pr-3 py-1.5 hover:border-brand-500 hover:shadow-md transition-all"
              >
                <div class="w-8 h-8 bg-gradient-to-br from-brand-500 to-red-600 rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ userStore.user?.name?.substring(0, 2).toUpperCase() || 'JO' }}</span>
                </div>
                <svg class="w-4 h-4 text-text-secondary dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>

              <!-- Dropdown Menu -->
              <transition name="dropdown">
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50">
                  <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                    <p class="font-semibold text-sm text-text-primary">{{ userStore.user?.name || 'User' }}</p>
                    <p class="text-xs text-text-secondary">{{ userStore.user?.email || '' }}</p>
                  </div>
                  
                  <router-link 
                    to="/profile" 
                    @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                      <span class="text-sm">{{ t('nav.myProfile') }}</span>
                  </router-link>

                  <router-link 
                    v-if="canSeeStaffPortal"
                    to="/staff" 
                    @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                      <span class="text-sm">{{ t('nav.staffPortal') }}</span>
                  </router-link>

                  <router-link
                    v-if="canSeeHostPortal"
                    to="/host"
                    @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                      <span class="text-sm">{{ t('nav.hostDashboard') }}</span>
                  </router-link>

                  <router-link 
                    to="/dashboard/watchlist" 
                    @click="showUserMenu = false"
                    class="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <svg class="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                      <span class="text-sm">{{ t('nav.wishlist') }}</span>
                  </router-link>

                  <div class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                    <button 
                      @click="handleLogout"
                      class="flex items-center gap-3 px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors w-full text-left text-red-600 dark:text-red-400"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                      </svg>
                      <span class="text-sm font-medium">{{ t('auth.logout') }}</span>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Login Button (when not authenticated) -->
            <router-link 
              v-else
              to="/login"
              class="relative flex items-center gap-2 bg-transparent border border-gray-200 dark:border-gray-600 rounded-[20px] px-2 py-1 hover:shadow-md transition-all"
            >
              <svg class="w-5 h-5 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 24 24">
                <rect x="2" y="5" width="20" height="2" rx="1"/>
                <rect x="2" y="11" width="20" height="2" rx="1"/>
                <rect x="2" y="17" width="20" height="2" rx="1"/>
              </svg>
              <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </router-link>
          </div>

          <!-- Mobile Right -->
          <div class="flex lg:hidden items-center gap-1 sm:gap-2">
            <router-link to="/dashboard/watchlist" class="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </router-link>

            <button 
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="p-2 text-gray-900 dark:text-gray-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
    </header>

    <!-- Mobile Menu Drawer -->
    <transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="fixed inset-0 z-50 lg:hidden">
        <!-- Backdrop -->
        <div 
          class="fixed inset-0 bg-black/60 backdrop-blur-sm"
          @click="mobileMenuOpen = false"
        ></div>
        
        <!-- Menu Panel -->
        <div class="fixed top-0 right-0 bottom-0 w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl overflow-y-auto transition-colors duration-200">
          <!-- Header -->
          <div class="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('nav.menu') }}</h3>
              <button @click="mobileMenuOpen = false" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Currency + Language (mobile menu header) -->
            <div class="mt-3 flex gap-2">
              <select
                v-model="currencyStore.currentCurrency"
                @change="currencyStore.setCurrency(currencyStore.currentCurrency)"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold text-text-secondary dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white cursor-pointer transition-all"
                aria-label="Currency"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="CNY">¥ CNY</option>
                <option value="RWF">RWF</option>
              </select>

              <select
                v-model="languageStore.currentLanguage"
                @change="languageStore.setLanguage(languageStore.currentLanguage)"
                class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-xs font-semibold text-text-secondary dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-white cursor-pointer transition-all"
                aria-label="Language"
              >
                <option value="EN">EN</option>
                <option value="RW">RW</option>
                <option value="FR">FR</option>
                <option value="ZH">中文</option>
                <option value="SW">SW</option>
              </select>
            </div>
          </div>

          <div class="p-6">
            <!-- User Profile Section (when authenticated) -->
            <div v-if="userStore.isAuthenticated" class="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span class="text-gray-600 dark:text-gray-300 text-sm font-medium">{{ userStore.user?.name?.substring(0, 2).toUpperCase() || 'U' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{{ userStore.user?.name || 'User' }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ userStore.user?.email || '' }}</p>
                </div>
              </div>
            </div>

            <!-- Login Button (when not authenticated) -->
            <div v-else class="mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
              <router-link 
                to="/login" 
                @click="mobileMenuOpen = false"
                class="block w-full py-2.5 px-4 bg-brand-500 text-white text-center rounded-lg text-sm font-medium hover:bg-brand-600 transition-colors"
              >
                {{ t('auth.login') }}
              </router-link>
            </div>

            <!-- Navigation Links -->
            <nav class="space-y-1 mb-6">
              <router-link 
                to="/"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                {{ t('nav.home') }}
              </router-link>
              <router-link 
                to="/accommodations"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                {{ t('nav.accommodations') }}
              </router-link>
              <router-link 
                to="/tours"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ t('nav.tours') }}
              </router-link>
              <router-link 
                to="/transport"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                </svg>
                {{ t('nav.transport') }}
              </router-link>
              <router-link 
                to="/services"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                {{ t('nav.services') }}
              </router-link>
              <router-link 
                to="/stories"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {{ t('nav.stories') }}
              </router-link>
              <router-link 
                to="/become-host"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                {{ t('nav.becomeHost') }}
              </router-link>

              <router-link
                v-if="canSeeHostPortal"
                to="/host"
                class="flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
                @click="mobileMenuOpen = false"
              >
                <svg class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                {{ t('nav.hostDashboard') }}
              </router-link>
            </nav>

            <!-- Divider -->
            <div class="border-t border-gray-100 dark:border-gray-700 my-6"></div>

            <!-- Settings Section -->
            <div class="space-y-3">
              <!-- Dark Mode Toggle -->
              <button
                @click="themeStore.toggleTheme()"
                class="w-full flex items-center gap-3 py-2.5 px-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
              >
                <svg v-if="!themeStore.isDark" class="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                <span>{{ themeStore.isDark ? t('theme.lightMode') : t('theme.darkMode') }}</span>
              </button>

              <select 
                v-model="currencyStore.currentCurrency"
                @change="currencyStore.setCurrency(currencyStore.currentCurrency)"
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
              >
                <option value="USD">$ USD</option>
                <option value="EUR">€ EUR</option>
                <option value="GBP">£ GBP</option>
                <option value="CNY">¥ CNY</option>
                <option value="RWF">RWF</option>
              </select>

              <select 
                v-model="languageStore.currentLanguage" 
                @change="languageStore.setLanguage(languageStore.currentLanguage)" 
                class="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-500"
              >
                <option value="EN">English</option>
                <option value="RW">Kinyarwanda</option>
                <option value="FR">Français</option>
                <option value="ZH">中文</option>
                <option value="SW">Kiswahili</option>
              </select>
            </div>

            <!-- Logout Button -->
            <div v-if="userStore.isAuthenticated" class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button 
                @click="handleLogout"
                class="w-full px-3 py-2.5 text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors text-center"
              >
                {{ t('auth.logout') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot></slot>
    </main>

    <!-- Mode Selector Popup -->
    <transition name="fade">
      <div v-if="showModeSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4" @click="showModeSelector = false">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full animate-scale-in" @click.stop>
          <button @click="showModeSelector = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">How can we help?</h3>
            <p class="text-gray-600 text-sm">Choose the service you need</p>
          </div>
          
          <div class="space-y-4">
            <button 
              @click="selectMode('advisor')"
              class="w-full p-6 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <h4 class="font-bold text-lg mb-1">AI Trip Advisor</h4>
                  <p class="text-white/80 text-sm">Get recommendations, plan trips, explore Rwanda</p>
                </div>
                <svg class="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </button>
            
            <button 
              @click="selectMode('support')"
              class="w-full p-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
                <div class="text-left flex-1">
                  <h4 class="font-bold text-lg mb-1">Customer Support</h4>
                  <p class="text-white/80 text-sm">Get help with bookings, payments, or issues</p>
                </div>
                <svg class="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- AI Concierge Component -->
    <AIConcierge 
      :isOpen="showAIConcierge" 
      :mode="chatMode"
      @close="showAIConcierge = false" 
      @minimize="aiMinimized = true; showAIConcierge = false"
      @switchMode="handleSwitchMode"
    />

    <!-- Unified Help Button -->
    <button
      v-if="!showAIConcierge"
      @click="showModeSelector = true"
      class="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all transform hover:scale-110 flex items-center justify-center group"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
      </svg>
      <span class="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></span>
    </button>

    <!-- Footer -->
    <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-8 sm:mt-20 relative overflow-hidden transition-colors duration-200">
      <div class="container mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-16 relative z-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-12">
          <div>
            <div class="flex items-center space-x-3 mb-6">
              <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-14 w-auto" />
            </div>
            <p class="text-text-secondary text-sm leading-relaxed">{{ t('footer.tagline') }}</p>
          </div>
          <div class="hidden sm:block">
            <h4 class="font-bold mb-5 text-text-primary text-base" style="font-family: 'Montserrat', sans-serif;">{{ t('footer.explore') }}</h4>
            <ul class="space-y-3 text-text-secondary text-sm">
              <li><router-link to="/accommodations" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('nav.accommodations') }}</router-link></li>
              <li><router-link to="/tours" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('nav.tours') }}</router-link></li>
              <li><router-link to="/transport" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('nav.transport') }}</router-link></li>
            </ul>
          </div>
          <div class="hidden sm:block">
            <h4 class="font-bold mb-5 text-text-primary text-base" style="font-family: 'Montserrat', sans-serif;">{{ t('footer.company') }}</h4>
            <ul class="space-y-3 text-text-secondary text-sm">
              <li><router-link to="/about" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('footer.aboutUs') }}</router-link></li>
              <li><a href="mailto:support@merry360.com" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('footer.contact') }}</a></li>
              <li><router-link to="/become-host" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('nav.becomeHost') }}</router-link></li>
            </ul>
          </div>
          <div class="hidden sm:block">
            <h4 class="font-bold mb-5 text-text-primary text-base" style="font-family: 'Montserrat', sans-serif;">{{ t('footer.support') }}</h4>
            <ul class="space-y-3 text-text-secondary text-sm">
              <li><a href="mailto:support@merry360.com" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('footer.helpCenter') }}</a></li>
              <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('footer.safety') }}</a></li>
              <li><a href="#" class="hover:text-brand-500 dark:hover:text-brand-400 transition-all hover:translate-x-1 inline-block">{{ t('footer.terms') }}</a></li>
            </ul>
          </div>
        </div>
        <div class="mt-6 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p class="text-text-secondary text-sm">© 2025 Merry360X. All rights reserved.</p>
          <div class="flex space-x-4 mt-3 md:mt-0">
            <a href="#" class="text-text-secondary hover:text-brand-500 dark:hover:text-brand-400 text-sm transition-colors">{{ t('footer.privacy') }}</a>
            <a href="#" class="text-text-secondary hover:text-brand-500 dark:hover:text-brand-400 text-sm transition-colors">{{ t('footer.terms') }}</a>
            <a href="#" class="text-text-secondary hover:text-brand-500 dark:hover:text-brand-400 text-sm transition-colors">{{ t('footer.cookies') }}</a>
          </div>
        </div>
      </div>
    </footer>


  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useLanguageStore } from '../../stores/language'
import { useThemeStore } from '../../stores/theme'
import { useTranslation } from '../../composables/useTranslation'
import AIConcierge from '../ai/AIConcierge.vue'
import { confirmDialog } from '../../composables/useConfirm'
import { useToast } from '../../composables/useToast'
import { signOut as signOutAuth } from '../../services/auth'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const languageStore = useLanguageStore()
const themeStore = useThemeStore()
const { t } = useTranslation()

// Initialize theme on mount
onMounted(() => {
  themeStore.initTheme()
})

const mobileMenuOpen = ref(false)
const showAIConcierge = ref(false)
const showUserMenu = ref(false)
const aiMinimized = ref(false)
const showModeSelector = ref(false)
const chatMode = ref('advisor') // 'advisor' or 'support'

const canSeeStaffPortal = computed(() => {
  const role = userStore.user?.role
  return role === 'staff' || role === 'admin'
})

const canSeeHostPortal = computed(() => {
  const role = userStore.user?.role
  return role === 'host' || role === 'admin'
})

const mobileNavigation = [
  { name: 'Home', to: '/home' },
  { name: 'Accommodations', to: '/accommodations' },
  { name: 'Tours', to: '/tours' },
  { name: 'Transport', to: '/transport' },
  { name: 'My Trips', to: '/profile' }
]

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const handleLogout = async () => {
  // Close menus first so the confirm dialog is always visible/clickable on mobile.
  showUserMenu.value = false
  mobileMenuOpen.value = false

  const { info, success, error: showError } = useToast()

  const isMobileViewport =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(max-width: 1023px)').matches

  // Mobile fallback: force logout without confirm.
  if (isMobileViewport) {
    try {
      info('Signing out…', 1200)
      await signOutAuth()
      success(t('auth.logoutSuccess'))
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      showError(t('auth.logoutError') || 'Failed to logout')
    }
    return
  }

  // Let the menu overlay unmount before opening the confirm.
  await nextTick()
  await new Promise((resolve) => setTimeout(resolve, 60))

  const ok = await confirmDialog(t('auth.logoutConfirm'), {
    title: t('auth.logout'),
    confirmText: t('auth.logout'),
    cancelText: t('common.cancel')
  })

  if (!ok) return

  try {
    info('Signing out…', 1200)

    // Sign out from Supabase (this triggers SIGNED_OUT event which calls store.logout())
    await signOutAuth()

    success(t('auth.logoutSuccess'))
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
    showError(t('auth.logoutError') || 'Failed to logout')
  }
}

const selectMode = (mode) => {
  chatMode.value = mode
  showModeSelector.value = false
  showAIConcierge.value = true
}

const handleSwitchMode = () => {
  showAIConcierge.value = false
  setTimeout(() => {
    showModeSelector.value = true
  }, 300)
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style scoped>
/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Mobile menu slide animation */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-active > div:last-child,
.mobile-menu-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Scale animation */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from > div:last-child,
.mobile-menu-leave-to > div:last-child {
  transform: translateX(100%);
}

.mobile-menu-enter-to > div:last-child,
.mobile-menu-leave-from > div:last-child {
  transform: translateX(0);
}

/* AI Button transitions */
.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from {
  transform: translateX(100px);
  opacity: 0;
}
.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.3s ease;
}
.scale-fade-enter-from {
  transform: scale(0);
  opacity: 0;
}
.scale-fade-leave-to {
  transform: scale(0);
  opacity: 0;
}
</style>
