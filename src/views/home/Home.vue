<template>
  <MainLayout>
    <!-- Hero Section with Search -->
    <section class="relative min-h-screen overflow-hidden">
      <!-- Background Video Carousel with Overlay -->
      <div class="absolute inset-0">
        <!-- Background Video -->
        <video 
          autoplay 
          muted 
          loop
          playsinline
          class="w-full h-full object-cover"
        >
          <source src="/videos/Merry.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container mx-auto px-4 h-full min-h-screen flex flex-col items-center justify-center py-24">
        <h1 class="text-3xl md:text-4xl font-bold text-white mb-8 md:mb-10 text-center tracking-wider" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.2; letter-spacing: 0.1em;">
          {{ t('transport.bookNow').toUpperCase() }}
        </h1>

        <!-- Category Tabs -->
        <div class="flex gap-6 md:gap-12 mb-8 md:mb-10 overflow-x-auto pb-1">
          <button 
            v-for="category in categories" 
            :key="category"
            @click="selectedCategory = category"
            class="text-white text-sm md:text-base font-semibold pb-2 transition-all relative whitespace-nowrap"
            style="font-family: 'Montserrat', sans-serif; font-weight: 600;"
            :class="selectedCategory === category ? 'border-b-2 border-white' : 'opacity-80 hover:opacity-100'"
          >
            {{ category }}
          </button>
        </div>

        <!-- Search Box -->
        <div class="w-full max-w-4xl bg-white rounded-lg p-4 md:p-3 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0" style="min-height: 70px;">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0 px-2 md:px-6">
            <!-- Location -->
            <div class="md:border-r md:pr-5 pb-3 md:pb-0 border-b md:border-b-0 border-gray-300">
              <label class="block text-xs font-bold mb-1.5 text-gray-700" style="font-family: 'Montserrat', sans-serif;">{{ t('accommodation.location') }}</label>
              <input 
                type="text" 
                :placeholder="t('search.whereGoing')"
                v-model="searchQuery.location"
                class="w-full text-sm font-semibold focus:outline-none placeholder-gray-400 bg-transparent text-gray-900"
                style="font-family: 'Montserrat', sans-serif;"
              />
            </div>

            <!-- Check In -->
            <div class="md:border-r md:px-5 pb-3 md:pb-0 border-b md:border-b-0 border-gray-300 relative">
              <label class="block text-xs font-bold mb-1.5 text-gray-700" style="font-family: 'Montserrat', sans-serif;">{{ t('search.checkIn') }}</label>
              <input 
                type="date" 
                v-model="searchQuery.checkIn"
                :min="minCheckInDate"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-gray-900 cursor-pointer"
                style="font-family: 'Montserrat', sans-serif;"
              />
            </div>

            <!-- Check Out -->
            <div class="md:border-r md:px-5 pb-3 md:pb-0 border-b md:border-b-0 border-gray-300 relative">
              <label class="block text-xs font-bold mb-1.5 text-gray-700" style="font-family: 'Montserrat', sans-serif;">{{ t('search.checkOut') }}</label>
              <input 
                type="date" 
                v-model="searchQuery.checkOut"
                :min="minCheckOutDate"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-gray-900 cursor-pointer"
                style="font-family: 'Montserrat', sans-serif;"
              />
            </div>

            <!-- Guests -->
            <div class="md:pl-5 relative">
              <label class="block text-xs font-bold mb-1.5 text-gray-700" style="font-family: 'Montserrat', sans-serif;">{{ t('accommodation.guests') }}</label>
              <button 
                type="button"
                @click="showGuestSelector = !showGuestSelector"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-gray-900 text-left cursor-pointer flex items-center justify-between"
                style="font-family: 'Montserrat', sans-serif;"
              >
                <span>{{ guestSummary }}</span>
                <svg class="w-4 h-4 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Guest Selector Dropdown -->
              <div v-if="showGuestSelector" class="absolute top-full left-0 mt-2 bg-white rounded p-4 w-72 z-50 border border-gray-200">
                <div class="space-y-4">
                  <!-- Adults -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-900">{{ t('accommodation.adults') }}</div>
                      <div class="text-xs text-gray-500">{{ t('accommodation.adultsDesc') }}</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('adults')"
                        :disabled="guestCounts.adults <= 1"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.adults }}</span>
                      <button 
                        @click="incrementGuests('adults')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Children -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-900">{{ t('accommodation.children') }}</div>
                      <div class="text-xs text-gray-500">{{ t('accommodation.childrenDesc') }}</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('children')"
                        :disabled="guestCounts.children <= 0"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.children }}</span>
                      <button 
                        @click="incrementGuests('children')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- Infants -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-900">{{ t('accommodation.infants') }}</div>
                      <div class="text-xs text-gray-500">{{ t('accommodation.infantsDesc') }}</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('infants')"
                        :disabled="guestCounts.infants <= 0"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.infants }}</span>
                      <button 
                        @click="incrementGuests('infants')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-brand-500"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Search Button -->
          <button 
            @click="handleSearch"
            class="w-full md:w-[54px] h-[54px] rounded-full flex items-center justify-center hover:scale-105 transition-all duration-200 flex-shrink-0 md:mr-2 shadow-lg"
            style="background: #FE4F4F;"
          >
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Latest on the Property Listing -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="mb-6 md:mb-8 text-center">
        <h2 class="text-xl md:text-3xl font-bold text-gray-800" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.latestProperties') }}</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Nearby Listed Properties -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="flex flex-col md:flex-row items-center justify-between mb-6 md:mb-8 max-w-7xl mx-auto">
        <div class="text-center md:text-left mb-4 md:mb-0">
          <h2 class="text-xl md:text-3xl font-bold text-gray-800" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.nearbyProperties') }}</h2>
        </div>
        <button class="font-bold text-sm flex items-center hover:opacity-80 transition-all hover:scale-105 duration-200 text-gray-800" style="font-family: 'Montserrat', sans-serif; font-weight: 700;">
          <svg class="w-5 h-5 md:w-6 md:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
          {{ t('accommodation.location') }}
        </button>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in nearbyProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Top Rated Properties -->
    <section class="container mx-auto px-4 py-20">
      <div class="mb-12 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.topRated') }}</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in topRatedProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Try Hosting Banner -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="relative rounded-lg overflow-hidden max-w-7xl mx-auto" style="min-height: 300px; height: auto;">
        <img loading="lazy" 
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80" 
          alt="Try Hosting" 
          class="w-full h-full object-cover absolute inset-0" style="min-height: 300px;"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent flex flex-col items-start justify-center px-6 md:px-20 py-12 md:py-16">
          <h2 class="text-xl md:text-4xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 800; line-height: 1.3; color: #000000;">{{ t('home.tryHosting') }}</h2>
          <p class="text-sm md:text-base mb-6 md:mb-8" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.5; color: #000000; max-width: 400px;">{{ t('home.tryHostingDesc') }}</p>
          <router-link to="/become-host" class="px-8 md:px-12 py-3 md:py-4 text-sm md:text-base text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg inline-flex items-center justify-center" style="background: #ef4444; font-family: 'Montserrat', sans-serif; font-weight: 800; min-width: 180px; height: 48px;">
            {{ t('home.tryHosting') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="mb-6 md:mb-8 text-center">
        <h2 class="text-2xl md:text-4xl font-bold text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.featured') }}</h2>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in featuredProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Browse For More -->
    <section class="py-8 md:py-12 bg-gray-100 dark:bg-gray-800">
      <div class="container mx-auto px-4">
        <div class="max-w-7xl mx-auto text-center px-4 md:px-8">
          <h2 class="text-xl md:text-4xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-gray-100" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.browseMore') }}</h2>
          <p class="text-sm md:text-base mb-8 md:mb-10 text-gray-600 dark:text-gray-400" style="font-family: 'Montserrat', sans-serif; font-weight: 500; line-height: 1.5;">{{ t('home.browseDesc') }}</p>
          <router-link to="/accommodations" class="inline-block px-8 md:px-12 py-3 text-sm md:text-base text-white rounded hover:opacity-90 transition-opacity mx-auto" style="background: #FE4F4F; font-family: 'Montserrat', sans-serif; font-weight: 600;">
            {{ t('home.findProperty') }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- Property Rental Guides & Tips -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="mb-6 md:mb-8 text-center">
        <h2 class="text-2xl md:text-4xl font-bold text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.guides') }}</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div v-for="guide in guides" :key="guide.id" class="rounded-lg overflow-hidden transition-opacity hover:opacity-90" style="background: #E0E2E6;">
          <div class="relative">
            <img loading="lazy" :src="guide.image" :alt="guide.title" class="w-full object-cover h-48 md:h-64 lg:h-80" />
          </div>
          <div class="p-4 md:p-6">
            <h3 class="text-base md:text-lg font-bold mb-2 text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ guide.title }}</h3>
            <span class="inline-block text-xs md:text-sm font-semibold" style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #9A9A9A;">
              {{ guide.category }}
            </span>
          </div>
        </div>
      </div>
      <div class="text-center mt-8 md:mt-12">
        <button class="px-8 md:px-12 py-3 text-white rounded hover:opacity-90 transition-opacity" style="background: #FF3B3B; font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 14px;">
          {{ t('home.viewAllBlogs') }}
        </button>
      </div>
    </section>

    <!-- Download Mobile App -->
    <section class="py-8 md:py-12 bg-gray-100">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl mx-auto">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.downloadApp') }}</h2>
            <p class="text-sm md:text-base mb-6 md:mb-10 text-gray-600" style="font-family: 'Montserrat', sans-serif; font-weight: 500; line-height: 1.5;">{{ t('home.downloadDesc') }}</p>
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <button class="px-4 md:px-6 py-3 rounded flex items-center justify-center gap-2 md:gap-3 hover:opacity-90 transition-opacity w-full sm:w-auto" style="background: #E0E2E6;">
                <svg class="w-5 h-5" fill="#484848" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span class="text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #484848;">{{ t('home.playStore') }}</span>
              </button>
              <button class="px-6 py-3 rounded flex items-center gap-3 hover:opacity-90 transition-opacity" style="background: #E0E2E6;">
                <svg class="w-5 h-5" fill="#484848" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span class="text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #484848;">{{ t('home.appleStore') }}</span>
              </button>
            </div>
          </div>
          <div class="flex-1 flex justify-center mt-8 md:mt-0">
            <div class="w-40 h-40 md:w-52 md:h-52 rounded-xl flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #9A9A9A 0%, #C2C6CC 100%);">
              <svg class="w-20 h-20 md:w-28 md:h-28 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 1H7c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 18H7V5h10v14z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Discover More -->
    <section class="container mx-auto px-4 py-8 md:py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
        <div>
          <h2 class="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.discoverMore') }}</h2>
          <p class="mb-6 md:mb-8 text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 400; line-height: 1.6; color: #9A9A9A;">
            {{ t('home.discoverDesc') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4 md:gap-8 mb-6 md:mb-10">
            <button class="font-semibold hover:opacity-80 transition-opacity text-sm md:text-base text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 600;">
              {{ t('home.askQuestion') }}
            </button>
            <button class="font-semibold hover:opacity-80 transition-opacity text-sm md:text-base text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 600;">
              {{ t('home.findProperty') }}
            </button>
          </div>
          <button class="px-8 md:px-12 py-3 md:py-4 text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg w-full sm:w-auto" style="background: #FF3B3B; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; min-width: 180px; height: 48px;">
            {{ t('home.learnMore') }}
          </button>
        </div>
        <div class="mt-8 md:mt-0">
          <div class="relative rounded-xl overflow-hidden shadow-2xl">
            <img loading="lazy" 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" 
              alt="Property" 
              class="w-full h-64 md:h-96 lg:h-[437px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="py-8 md:py-12 bg-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-6xl mx-auto">
          <div class="text-center md:text-left md:w-48 mb-2 md:mb-0">
            <h2 class="font-bold mb-1 text-base md:text-lg text-gray-900" style="font-family: 'Montserrat', sans-serif; font-weight: 700;">{{ t('home.newsletter') }}</h2>
            <p class="text-xs md:text-sm text-gray-700" style="font-family: 'Montserrat', sans-serif; font-weight: 500;">{{ t('home.newsletterDesc') }}</p>
          </div>
          <div class="flex items-center gap-3 md:gap-4 flex-1 max-w-3xl w-full">
            <input 
              type="email" 
              :placeholder="t('home.emailPlaceholder')" 
              class="flex-1 px-4 md:px-6 py-3 rounded focus:outline-none text-sm md:text-base bg-white border border-gray-200 text-gray-900 placeholder:text-gray-500 text-gray-400"
              style="font-family: 'Montserrat', sans-serif; font-weight: 500;"
            />
            <button class="w-12 h-12 md:w-14 md:h-14 rounded flex items-center justify-center hover:opacity-90 transition-opacity flex-shrink-0 bg-brand-500" style="background: #FF3B3B;">
              <svg class="w-5 h-5 md:w-7 md:h-7 text-white transform rotate-90" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '@/components/layout/MainLayout.vue'
import PropertyCard from '@/components/common/PropertyCard.vue'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()

const categories = computed(() => [t('home.accommodations'), 'Hotels', 'Motels', 'Hostels'])
const selectedCategory = ref(computed(() => t('home.accommodations')).value)
const showGuestSelector = ref(false)

const searchQuery = ref({
  location: '',
  checkIn: '',
  checkOut: '',
  guests: ''
})

const guestCounts = ref({
  adults: 1,
  children: 0,
  infants: 0
})

const minCheckInDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

const minCheckOutDate = computed(() => {
  if (searchQuery.value.checkIn) {
    const checkIn = new Date(searchQuery.value.checkIn)
    checkIn.setDate(checkIn.getDate() + 1)
    return checkIn.toISOString().split('T')[0]
  }
  return minCheckInDate.value
})

const guestSummary = computed(() => {
  const total = guestCounts.value.adults + guestCounts.value.children + guestCounts.value.infants
  if (total === 0) return t('accommodation.guests')
  const parts = []
  if (guestCounts.value.adults > 0) parts.push(`${guestCounts.value.adults} adult${guestCounts.value.adults > 1 ? 's' : ''}`)
  if (guestCounts.value.children > 0) parts.push(`${guestCounts.value.children} child${guestCounts.value.children > 1 ? 'ren' : ''}`)
  if (guestCounts.value.infants > 0) parts.push(`${guestCounts.value.infants} infant${guestCounts.value.infants > 1 ? 's' : ''}`)
  return parts.join(', ')
})

const incrementGuests = (type) => {
  guestCounts.value[type]++
}

const decrementGuests = (type) => {
  if (guestCounts.value[type] > 0) {
    if (type === 'adults' && guestCounts.value[type] === 1) return
    guestCounts.value[type]--
  }
}

const latestProperties = ref([])
const nearbyProperties = ref([])
const topRatedProperties = ref([])
const featuredProperties = ref([])

const guides = ref([])

const handleSearch = () => {
  router.push('/accommodations')
}

// Hero Video Carousel
const currentVideoIndex = ref(0)
const heroVideos = ref([
  {
    category: 'accommodations',
    url: 'https://cdn.coverr.co/videos/coverr-modern-hotel-room-with-city-view-9138/1080p.mp4'
  },
  {
    category: 'tours',
    url: 'https://cdn.coverr.co/videos/coverr-mountain-landscape-aerial-view-2754/1080p.mp4'
  },
  {
    category: 'transport',
    url: 'https://cdn.coverr.co/videos/coverr-driving-through-city-streets-3945/1080p.mp4'
  }
])

const nextVideo = () => {
  currentVideoIndex.value = (currentVideoIndex.value + 1) % heroVideos.value.length
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
