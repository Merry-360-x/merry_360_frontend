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
          <source src="/public/videos/Merry.mp4" type="video/mp4">
        </video>
        <div class="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 container mx-auto px-4 h-full min-h-screen flex flex-col items-center justify-center py-24">
        <h1 class="text-3xl md:text-[40px] font-bold text-white mb-8 md:mb-10 text-center tracking-wider" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.2; letter-spacing: 0.1em;">
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
        <div class="w-full max-w-4xl bg-white rounded-[20px] md:rounded-[35px] shadow-2xl p-3 md:p-2 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0" style="min-height: 70px;">
          <div class="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-0 px-2 md:px-6">
            <!-- Location -->
            <div class="md:border-r md:pr-5 pb-3 md:pb-0 border-b md:border-b-0 dark:border-gray-400" style="border-color: #DDDDDD;">
              <label class="block text-xs font-bold mb-1.5 text-white" style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: white;">{{ t('accommodation.location') }}</label>
              <input 
                type="text" 
                :placeholder="t('search.whereGoing')"
                v-model="searchQuery.location"
                class="w-full text-sm font-semibold focus:outline-none placeholder-gray-400 bg-transparent text-white"
                style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: white;"
              />
            </div>

            <!-- Check In -->
            <div class="md:border-r md:px-5 pb-3 md:pb-0 border-b md:border-b-0 dark:border-gray-400 relative" style="border-color: #DDDDDD;">
              <label class="block text-xs font-bold mb-1.5 text-white" style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: white;">{{ t('search.checkIn') }}</label>
              <input 
                type="date" 
                v-model="searchQuery.checkIn"
                :min="minCheckInDate"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-white cursor-pointer"
                style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: white;"
              />
            </div>

            <!-- Check Out -->
            <div class="md:border-r md:px-5 pb-3 md:pb-0 border-b md:border-b-0 dark:border-gray-400 relative" style="border-color: #DDDDDD;">
              <label class="block text-xs font-bold mb-1.5 text-white" style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: white;">{{ t('search.checkOut') }}</label>
              <input 
                type="date" 
                v-model="searchQuery.checkOut"
                :min="minCheckOutDate"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-white cursor-pointer"
                style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: white;"
              />
            </div>

            <!-- Guests -->
            <div class="md:pl-5 relative">
              <label class="block text-xs font-bold mb-1.5 text-white" style="font-family: 'Montserrat', sans-serif; font-size: 12px; color: white;">{{ t('accommodation.guests') }}</label>
              <button 
                type="button"
                @click="showGuestSelector = !showGuestSelector"
                class="w-full text-sm font-semibold focus:outline-none bg-transparent text-white text-left cursor-pointer flex items-center justify-between"
                style="font-family: 'Montserrat', sans-serif; font-size: 14px; color: white;"
              >
                <span>{{ guestSummary }}</span>
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              
              <!-- Guest Selector Dropdown -->
              <div v-if="showGuestSelector" class="absolute top-full left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-72 z-50 border border-gray-200 dark:border-gray-700">
                <div class="space-y-4">
                  <!-- Adults -->
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-semibold text-gray-900 dark:text-white">Adults</div>
                      <div class="text-xs text-gray-500">Ages 13+</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('adults')"
                        :disabled="guestCounts.adults <= 1"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.adults }}</span>
                      <button 
                        @click="incrementGuests('adults')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
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
                      <div class="font-semibold text-gray-900 dark:text-white">Children</div>
                      <div class="text-xs text-gray-500">Ages 2-12</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('children')"
                        :disabled="guestCounts.children <= 0"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.children }}</span>
                      <button 
                        @click="incrementGuests('children')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
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
                      <div class="font-semibold text-gray-900 dark:text-white">Infants</div>
                      <div class="text-xs text-gray-500">Under 2</div>
                    </div>
                    <div class="flex items-center gap-3">
                      <button 
                        @click="decrementGuests('infants')"
                        :disabled="guestCounts.infants <= 0"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500 disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                        </svg>
                      </button>
                      <span class="w-8 text-center font-semibold">{{ guestCounts.infants }}</span>
                      <button 
                        @click="incrementGuests('infants')"
                        class="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center hover:border-brand-500"
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
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="mb-8 md:mb-12 text-center">
        <h2 class="text-2xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">Latest on the Property Listing</h2>
        <div class="w-24 md:w-36 h-1.5 rounded-full mx-auto bg-brand-500"></div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in latestProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Nearby Listed Properties -->
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 max-w-7xl mx-auto">
        <div class="text-center md:text-left mb-4 md:mb-0">
          <h2 class="text-2xl md:text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3;">{{ t('home.nearbyProperties') }}</h2>
          <div class="w-24 md:w-36 h-1.5 rounded-full md:mx-0 mx-auto bg-brand-500"></div>
        </div>
        <button class="font-bold text-sm flex items-center hover:opacity-80 transition-all hover:scale-105 duration-200 text-gray-800 dark:text-gray-200" style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px;">
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
        <h2 class="text-4xl font-bold mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 36px; line-height: 48px; color: white;">{{ t('home.topRated') }}</h2>
        <div class="w-36 h-1.5 rounded-full mx-auto" style="background: white;"></div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in topRatedProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Try Hosting Banner -->
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="relative rounded-[30px] md:rounded-[50px] overflow-hidden max-w-7xl mx-auto shadow-2xl" style="min-height: 300px; height: auto;">
        <img loading="lazy" 
          src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&q=80" 
          alt="Try Hosting" 
          class="w-full h-full object-cover absolute inset-0" style="min-height: 300px;"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-transparent flex flex-col items-start justify-center px-6 md:px-20 py-12 md:py-16">
          <h2 class="text-2xl md:text-5xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 800; line-height: 1.3; color: #000000;">Try Hosting With Us</h2>
          <p class="text-sm md:text-base mb-6 md:mb-8" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.5; color: #000000; max-width: 400px;">Earn extra just by renting your property...</p>
          <button class="px-8 md:px-12 py-3 md:py-4 text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg" style="background: #ef4444; font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 14px; min-width: 180px; height: 48px;">
            Become A Host
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Properties -->
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="mb-8 md:mb-12 text-center">
        <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">{{ t('home.featured') }}</h2>
        <div class="w-24 md:w-36 h-1.5 rounded-full mx-auto" style="background: white;"></div>
      </div>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        <PropertyCard v-for="property in featuredProperties" :key="property.id" :property="property" />
      </div>
    </section>

    <!-- Browse For More -->
    <section class="py-12 md:py-20" style="background: #EFF0F2;">
      <div class="container mx-auto px-4">
        <div class="max-w-7xl mx-auto text-center px-4 md:px-8">
          <h2 class="text-2xl md:text-5xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">Browse For More Properties</h2>
          <p class="text-sm md:text-base mb-8 md:mb-10" style="font-family: 'Montserrat', sans-serif; font-weight: 500; line-height: 1.5; color: #9A9A9A;">Explore properties by their categories/types...</p>
          <button class="px-8 md:px-12 py-3 md:py-4 text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg mx-auto" style="background: #FE4F4F; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; min-width: 180px; height: 48px;">
            Find A Property
          </button>
        </div>
      </div>
    </section>

    <!-- Property Rental Guides & Tips -->
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="mb-8 md:mb-12 text-center">
        <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">{{ t('home.guides') }}</h2>
        <div class="w-24 md:w-36 h-1.5 rounded-full mx-auto" style="background: white;"></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
        <div v-for="guide in guides" :key="guide.id" class="rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300" style="background: #E0E2E6;">
          <div class="relative">
            <img loading="lazy" :src="guide.image" :alt="guide.title" class="w-full object-cover h-48 md:h-64 lg:h-80" />
          </div>
          <div class="p-4 md:p-6">
            <h3 class="text-base md:text-lg font-bold mb-2" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">{{ guide.title }}</h3>
            <span class="inline-block text-xs md:text-sm font-semibold" style="font-family: 'Montserrat', sans-serif; font-weight: 600; color: #9A9A9A;">
              {{ guide.category }}
            </span>
          </div>
        </div>
      </div>
      <div class="text-center mt-8 md:mt-12">
        <button class="px-8 md:px-12 py-3 md:py-4 text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg" style="background: #FF3B3B; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; min-width: 180px; height: 48px;">
          View All Blogs
        </button>
      </div>
    </section>

    <!-- Download Mobile App -->
    <section class="py-12 md:py-20" style="background: #EFF0F2;">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl mx-auto">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">Download Our Mobile App</h2>
            <p class="text-sm md:text-base mb-6 md:mb-10" style="font-family: 'Montserrat', sans-serif; font-weight: 500; line-height: 1.5; color: #9A9A9A;">Available for free on these platforms</p>
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <button class="px-4 md:px-6 py-3 rounded-md flex items-center justify-center gap-2 md:gap-3 hover:scale-105 transition-all duration-200 shadow-md w-full sm:w-auto" style="background: #E0E2E6; min-width: 150px; height: 52px;">
                <svg class="w-5 h-5" fill="#484848" viewBox="0 0 24 24">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 15px; color: #484848;">PlayStore</span>
              </button>
              <button class="px-6 py-3 rounded-md flex items-center gap-3 hover:scale-105 transition-all duration-200 shadow-md" style="background: #E0E2E6; width: 172px; height: 52px;">
                <svg class="w-5 h-5" fill="#484848" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span style="font-family: 'Montserrat', sans-serif; font-weight: 600; font-size: 15px; color: #484848;">AppleStore</span>
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
    <section class="container mx-auto px-4 py-12 md:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center max-w-7xl mx-auto">
        <div>
          <h2 class="text-2xl md:text-4xl font-bold mb-3 md:mb-4" style="font-family: 'Montserrat', sans-serif; font-weight: 700; line-height: 1.3; color: white;">Discover More About Property Rental</h2>
          <div class="w-24 md:w-36 h-1.5 rounded-full mb-6 md:mb-8" style="background: white;"></div>
          <p class="mb-6 md:mb-8 text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 400; line-height: 1.6; color: #9A9A9A;">
            Discover more about our exceptional property rentals, where comfort meets modern living for every kind of traveler. Explore thoughtfully designed spaces that feel like home, and enjoy a seamless booking experience from start to finish.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 md:gap-8 mb-6 md:mb-10">
            <button class="font-bold hover:scale-105 transition-all duration-200 text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 700; color: white;">
              Ask A Question
            </button>
            <button class="font-bold hover:scale-105 transition-all duration-200 text-sm md:text-base" style="font-family: 'Montserrat', sans-serif; font-weight: 700; color: white;">
              Find A Property
            </button>
          </div>
          <button class="px-8 md:px-12 py-3 md:py-4 text-white rounded-full hover:scale-105 transition-all duration-200 shadow-lg w-full sm:w-auto" style="background: #FF3B3B; font-family: 'Montserrat', sans-serif; font-weight: 700; font-size: 14px; min-width: 180px; height: 48px;">
            Discover More
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
    <section class="py-12 md:py-20" style="background: #E8EAEC;">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-6xl mx-auto">
          <div class="text-center md:text-left md:w-48 mb-2 md:mb-0">
            <h2 class="font-bold mb-1 text-base md:text-lg" style="font-family: 'Montserrat', sans-serif; font-weight: 700; color: white;">NEWSLETTER</h2>
            <p class="text-xs md:text-sm" style="font-family: 'Montserrat', sans-serif; font-weight: 500; color: white;">Stay Upto Date</p>
          </div>
          <div class="flex items-center gap-3 md:gap-4 flex-1 max-w-3xl w-full">
            <input 
              type="email" 
              placeholder="Your Email..." 
              class="flex-1 px-4 md:px-6 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 transition-all text-sm md:text-base"
              style="background: #FFFFFF; border: 1px solid #E8EAEC; font-family: 'Montserrat', sans-serif; font-weight: 500; color: #484848; height: 48px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"
            />
            <button class="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-200 flex-shrink-0 shadow-lg" style="background: #FF3B3B;">
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

const latestProperties = ref([
  {
    id: 1,
    title: 'Modern Apartment',
    location: 'Kigali, Rwanda',
    price: 120,
    beds: 3,
    baths: 2,
    area: 1200,
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
    badge: 'For Sale',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&sat=-100',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&crop=left',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&crop=right',
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80&crop=top'
    ]
  },
  {
    id: 2,
    title: 'Luxury Villa',
    location: 'Rubavu, Rwanda',
    price: 250,
    beds: 5,
    baths: 4,
    area: 2500,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    badge: 'Featured',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&sat=-100',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&crop=left',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&crop=right',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80&crop=top'
    ]
  },
  {
    id: 3,
    title: 'Cozy House',
    location: 'Musanze, Rwanda',
    price: 85,
    beds: 4,
    baths: 3,
    area: 1800,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
    badge: 'New',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&sat=-100',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&crop=left',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&crop=right',
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80&crop=top'
    ]
  },
  {
    id: 4,
    title: 'Lake View Property',
    location: 'Kivu, Rwanda',
    price: 180,
    beds: 3,
    baths: 2,
    area: 1500,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
    badge: 'Hot Offer',
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&sat=-100',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&crop=left',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&crop=right',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80&crop=top'
    ]
  }
])

const nearbyProperties = ref(latestProperties.value)
const topRatedProperties = ref(latestProperties.value)
const featuredProperties = ref([...latestProperties.value, ...latestProperties.value].slice(0, 6))

const guides = ref([
  {
    id: 1,
    title: 'Choose the right apartment',
    category: 'Apartment',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'
  },
  {
    id: 2,
    title: 'Best environment for rental',
    category: 'Environment',
    image: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=400&q=80'
  },
  {
    id: 3,
    title: 'Things About Apartment',
    category: 'Tips',
    image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400&q=80'
  }
])

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
