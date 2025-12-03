<template>
  <MainLayout>
    <!-- AI Concierge Modal -->
    <AIConcierge v-if="showAIConcierge" @close="showAIConcierge = false" />
    
    <!-- Hero Section with Search -->
    <section class="relative bg-gradient-to-br from-gray-800 to-gray-700 py-12 md:py-16">
      <!-- Content -->
      <div class="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center justify-center">
        <h1 class="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-center">{{ t('hero.title') }}</h1>
        <p class="text-white/90 text-xs sm:text-sm mb-6 text-center max-w-2xl px-4">
          {{ t('hero.tagline') }}
        </p>
        
        <!-- Search Form - Desktop One Line Design -->
        <div class="hidden lg:block w-full max-w-6xl bg-white rounded-full shadow-2xl p-2 hover:shadow-primary/20 transition-all duration-300">
          <div class="flex items-center gap-1">
            <!-- Location -->
            <div class="flex-1 flex items-center px-4 py-2 border-r border-gray-200 group hover:bg-gray-50 rounded-l-full transition-colors">
              <svg class="w-5 h-5 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input 
                v-model="searchForm.location" 
                type="text" 
                placeholder="Where to?" 
                class="w-full bg-transparent border-0 focus:outline-none text-sm text-gray-900 placeholder-gray-400 font-medium"
              />
            </div>

            <!-- Check-in -->
            <div class="flex items-center px-3 py-2 border-r border-gray-200 group hover:bg-gray-50 transition-colors min-w-[140px]">
              <svg class="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input 
                v-model="searchForm.checkIn" 
                type="date" 
                class="bg-transparent border-0 focus:outline-none text-xs text-gray-900 w-full"
              />
            </div>

            <!-- Check-out -->
            <div class="flex items-center px-3 py-2 border-r border-gray-200 group hover:bg-gray-50 transition-colors min-w-[140px]">
              <svg class="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <input 
                v-model="searchForm.checkOut" 
                type="date" 
                class="bg-transparent border-0 focus:outline-none text-xs text-gray-900 w-full"
              />
            </div>

            <!-- Guests -->
            <div class="flex items-center px-3 py-2 group hover:bg-gray-50 transition-colors min-w-[100px]">
              <svg class="w-4 h-4 text-primary mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <input 
                v-model="searchForm.adults" 
                type="number" 
                min="1" 
                placeholder="2" 
                class="bg-transparent border-0 focus:outline-none text-xs text-gray-900 w-12 text-center font-medium"
              />
              <span class="text-xs text-gray-500 ml-1">guests</span>
            </div>

            <!-- Search Button -->
            <button 
              @click="handleSearch" 
              class="px-6 py-3 bg-primary hover:bg-red-600 text-white rounded-full font-semibold transition-all duration-300 flex items-center gap-2 text-sm shadow-lg hover:shadow-xl hover:scale-105 ml-1"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span>{{ t('home.search') }}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Search Form -->
        <div class="lg:hidden w-full max-w-md bg-white rounded-2xl shadow-2xl p-4">
          <div class="space-y-3">
            <!-- Location -->
            <div class="flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
              <svg class="w-5 h-5 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <input 
                v-model="searchForm.location" 
                type="text" 
                placeholder="Where to?" 
                class="w-full bg-transparent border-0 focus:outline-none text-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <!-- Check-in -->
              <div class="flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
                <svg class="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <input 
                  v-model="searchForm.checkIn" 
                  type="date" 
                  class="bg-transparent border-0 focus:outline-none text-xs text-gray-900 w-full"
                />
              </div>

              <!-- Check-out -->
              <div class="flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
                <svg class="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <input 
                  v-model="searchForm.checkOut" 
                  type="date" 
                  class="bg-transparent border-0 focus:outline-none text-xs text-gray-900 w-full"
                />
              </div>
            </div>

            <!-- Guests -->
            <div class="flex items-center px-3 py-2.5 bg-gray-50 rounded-xl">
              <svg class="w-4 h-4 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
              <input 
                v-model="searchForm.adults" 
                type="number" 
                min="1" 
                placeholder="2" 
                class="bg-transparent border-0 focus:outline-none text-sm text-gray-900 w-12 text-center"
              />
              <span class="text-sm text-gray-500 ml-1">guests</span>
            </div>

            <!-- Search Button -->
            <button 
              @click="handleSearch" 
              class="w-full px-4 py-3 bg-primary hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              {{ t('home.search') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Recommended Stays -->
    <section class="bg-white py-8 md:py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <div>
            <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-1">Recommended Stays</h2>
            <p class="text-text-secondary text-xs sm:text-sm">Handpicked accommodations just for you</p>
          </div>
          <button class="text-primary hover:text-red-600 font-medium flex items-center transition-colors text-sm self-start sm:self-auto">
            View all
            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          <PropertyCard
            v-for="property in latestProperties"
            :key="property.id"
            :property="property"
          />
        </div>
      </div>
    </section>

    <!-- Featured Tours -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-1">Featured Tours</h2>
          <p class="text-text-secondary text-xs sm:text-sm">Unforgettable experiences across Rwanda</p>
        </div>
        <button class="text-primary hover:text-red-600 font-medium flex items-center transition-colors text-sm self-start sm:self-auto">
          View all
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
        <div v-for="tour in featuredTours" :key="tour.id" class="bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
          <div class="relative overflow-hidden h-48 sm:h-52 md:h-56">
            <img :src="tour.image" :alt="tour.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <span class="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-text-primary text-xs font-semibold rounded-full">{{ tour.category }}</span>
          </div>
          <div class="p-4 sm:p-5">
            <h3 class="font-bold text-base sm:text-lg text-text-primary mb-1.5 sm:mb-2 line-clamp-2">{{ tour.title }}</h3>
            <p class="text-text-secondary text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{{ tour.description }}</p>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1 text-xs sm:text-sm text-text-secondary">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                <span>{{ tour.duration }}</span>
              </div>
              <div class="text-base sm:text-lg font-bold text-primary">{{ currencyStore.formatPrice(tour.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Nearby Listed Properties -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Nearby Listed Properties</h2>
        <button class="text-primary hover:text-red-600 font-medium flex items-center text-sm transition-colors">
          View more
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <PropertyCard
          v-for="property in nearbyProperties"
          :key="property.id"
          :property="property"
        />
      </div>
    </section>

    <!-- Top Rated Properties -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary">Top Rated Properties</h2>
        <button class="text-primary hover:text-red-600 font-medium flex items-center text-sm transition-colors">
          View more
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <PropertyCard
          v-for="property in topRatedProperties"
          :key="property.id"
          :property="property"
        />
      </div>
    </section>



    <!-- Featured Properties -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-6">Featured Properties on our Listing</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <PropertyCard
          v-for="property in featuredProperties"
          :key="property.id"
          :property="property"
        />
      </div>

      <div class="text-center">
        <button class="px-6 sm:px-8 py-2.5 sm:py-3 bg-white border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 font-medium transform hover:scale-105">
          Browse More Property
        </button>
      </div>
    </section>

    <!-- Property Rental Guides -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold text-text-primary mb-6">Property Rental Guides & Tips</h2>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div v-for="guide in guides" :key="guide.id" class="bg-white rounded-xl shadow-card overflow-hidden hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
          <div class="relative overflow-hidden">
            <img :src="guide.image" :alt="guide.title" class="w-full h-48 sm:h-56 object-cover transform transition-transform duration-500 hover:scale-110" />
          </div>
          <div class="p-4 sm:p-6">
            <span class="inline-block px-3 py-1 bg-primary text-white text-xs font-medium rounded-full mb-3">{{ guide.category }}</span>
            <h3 class="font-semibold text-base sm:text-lg text-text-primary mb-2">{{ guide.title }}</h3>
          </div>
        </div>
      </div>

      <div class="text-center mt-6 sm:mt-8">
        <button class="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium transform hover:scale-105">
          View All
        </button>
      </div>
    </section>

    <!-- Download App -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="bg-gray-100 rounded-xl md:rounded-2xl p-6 sm:p-8 md:p-12">
        <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">Download Our Mobile App</h2>
            <p class="text-text-secondary mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              Discover more about property buying, selling and renting with our mobile app. Available on iOS and Android.
            </p>
            <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button class="px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center transform hover:scale-105">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span class="text-sm sm:text-base">App Store</span>
              </button>
              <button class="px-5 sm:px-6 py-2.5 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 flex items-center justify-center transform hover:scale-105">
                <svg class="w-5 h-5 sm:w-6 sm:h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 01-.276-.545V2.36c0-.222.077-.41.276-.546zm10.889 10.893l2.701 2.701-3.927 2.268-5.862-5.869 6.088-6.088 3.927 2.268-2.927 2.72zm.473-9.419L3.06.382c-.24-.14-.487-.179-.722-.166L13.97 12l1.001-.712zM2.338 23.784c.235.013.482-.026.722-.166l11.911-6.906-1.001-.712-11.632 11.784z"/>
                </svg>
                <span class="text-sm sm:text-base">Google Play</span>
              </button>
            </div>
          </div>
          <div class="flex justify-center order-first md:order-last">
            <div class="w-48 h-72 sm:w-56 sm:h-80 md:w-64 md:h-96 bg-gray-300 rounded-3xl flex items-center justify-center shadow-lg">
              <svg class="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <h2 class="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">Your Partner in Business Growth</h2>
          <p class="text-text-secondary mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
            At Merry 360 Global, we specialize in providing management and marketing services tailored to the real estate and tourism industries. Our goal is to empower our clients with effective strategies that enhance operational efficiency, visibility, and customer loyalty.
          </p>
          <p class="text-text-secondary mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
            We pride ourselves on delivering measurable results for our clients, helping them to increase sales and productivity. Our strategic support has consistently driven improvements, fostering long-term relationships and a loyal customer base.
          </p>
          
          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-primary mb-1">180+</div>
              <div class="text-xs text-text-secondary">Properties Managed</div>
            </div>
            <div class="text-center p-4 bg-gray-50 rounded-lg">
              <div class="text-3xl font-bold text-primary mb-1">3000+</div>
              <div class="text-xs text-text-secondary">Customers Served</div>
            </div>
          </div>
          
          <button @click="navigateTo('/about')" class="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-white rounded-lg hover:bg-red-600 transition-all duration-200 font-medium transform hover:scale-105">
            Learn More About Us
          </button>
        </div>
        <div class="order-first md:order-last">
          <div class="relative overflow-hidden rounded-xl shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80"
              alt="Property"
              class="w-full h-64 sm:h-80 md:h-96 object-cover transform transition-transform duration-500 hover:scale-105"
            />
            <span class="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs sm:text-sm font-medium rounded-full shadow-lg">Featured</span>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useCurrencyStore } from '../../stores/currency'
import { useTranslation } from '../../composables/useTranslation'
import MainLayout from '../../components/layout/MainLayout.vue'
import PropertyCard from '../../components/common/PropertyCard.vue'
import AIConcierge from '../../components/ai/AIConcierge.vue'

const router = useRouter()
const userStore = useUserStore()
const currencyStore = useCurrencyStore()
const { t } = useTranslation()

// Add sample data on first load
onMounted(() => {
  // Only add if empty (first time)
  if (userStore.watchlistCount === 0) {
    // Add sample properties to watchlist
    userStore.addToWatchlist({
      id: 101,
      type: 'property',
      name: 'Lake Kivu Resort',
      location: 'Rubavu, Rwanda',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
      price: '750,000',
      beds: 3,
      baths: 2
    })
    
    userStore.addToWatchlist({
      id: 102,
      type: 'tour',
      title: 'Akagera Safari Experience',
      category: 'WILDLIFE',
      description: 'Two-day safari adventure',
      image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80',
      price: '280,000',
      duration: '2 days'
    })
  }
  
  if (userStore.cartCount === 0) {
    // Add sample item to cart
    userStore.addToCart({
      id: 201,
      type: 'property',
      name: 'Kigali City Apartment',
      location: 'Kigali, Rwanda',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
      price: '450,000',
      beds: 2,
      baths: 1
    })
  }
  
  // Add some loyalty points
  if (userStore.loyaltyPoints === 0) {
    userStore.addLoyaltyPoints(2500) // Silver tier
  }
})

const searchForm = ref({
  location: 'Kigali, Rwanda',
  checkIn: '',
  checkOut: '',
  adults: 2,
  children: 0,
  rooms: 1
})

const showAIConcierge = ref(false)

const handleSearch = () => {
  console.log('Search:', searchForm.value)
}

const navigateTo = (path) => {
  router.push(path)
}

const featuredTours = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1571752239935-74f3d4d23816?w=600&q=80',
    category: 'NATURE',
    title: 'Gorilla Trekking Experience',
    description: 'Get up close with mountain gorillas in Volcanoes National Park',
    duration: '3 days',
    price: 1500
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=600&q=80',
    category: 'CULTURE',
    title: 'Kigali City Tour',
    description: 'Explore the vibrant capital city and its rich history',
    duration: '1 day',
    price: 80
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1516826435551-36a8a09e4526?w=600&q=80',
    category: 'ADVENTURE',
    title: 'Lake Kivu Island Hopping',
    description: 'Discover beautiful islands and pristine beaches',
    duration: '2 days',
    price: 250
  }
])

const latestProperties = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80',
    badge: 'Featured',
    title: 'Modern Apartment',
    location: 'Kigali, Rwanda',
    beds: 3,
    baths: 2,
    area: 1200,
    price: 150
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80',
    badge: 'Hot Offer',
    title: 'Luxury Villa',
    location: 'Musanze, Rwanda',
    beds: 4,
    baths: 3,
    area: 2500,
    price: 250
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    badge: 'New Listing',
    title: 'Family House',
    location: 'Gisenyi, Rwanda',
    beds: 5,
    baths: 3,
    area: 1800,
    price: 200
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    badge: 'Featured',
    title: 'Cozy Cottage',
    location: 'Rubavu, Rwanda',
    beds: 2,
    baths: 1,
    area: 900,
    price: 120
  }
])

const nearbyProperties = ref([...latestProperties.value])
const topRatedProperties = ref([...latestProperties.value])
const featuredProperties = ref([...latestProperties.value, ...latestProperties.value.slice(0, 2)])

const guides = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80',
    category: 'Tips',
    title: 'Choose the right apartment'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&q=80',
    category: 'Guide',
    title: 'Best and convenient for rental'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80',
    category: 'Tips',
    title: 'Steps house Apartment'
  }
])
</script>
