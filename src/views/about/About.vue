<template>
  <PropertyLayout>
    <!-- Hero Section -->
    <section class="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gradient-to-r from-brand-500 to-brand-600">
      <div class="absolute inset-0 bg-black/10"></div>
      <div class="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-center">
        <div class="text-center text-white">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">About Merry360X</h1>
          <p class="text-base sm:text-lg md:text-xl max-w-2xl mx-auto animate-fade-in-up delay-100">
            Your trusted partner in finding the perfect property
          </p>
        </div>
      </div>
    </section>

    <!-- Mission & Vision -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="grid md:grid-cols-2 gap-8 md:gap-12">
        <div class="bg-white rounded-xl shadow-card p-6 sm:p-8 transform transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-3 sm:mb-4">Our Mission</h2>
          <p class="text-text-secondary leading-relaxed text-sm sm:text-base">
            To revolutionize the real estate experience by providing a seamless, transparent, and user-friendly platform that connects property seekers with their dream homes. We strive to make property transactions accessible, efficient, and enjoyable for everyone.
          </p>
        </div>

        <div class="bg-white rounded-xl shadow-card p-6 sm:p-8 transform transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
          <div class="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <svg class="w-6 h-6 sm:w-8 sm:h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-text-brand-600 mb-3 sm:mb-4">Our Vision</h2>
          <p class="text-text-secondary leading-relaxed text-sm sm:text-base">
            To become the leading property platform in Rwanda and beyond, recognized for innovation, integrity, and exceptional service. We envision a future where finding and securing a property is as simple as a few clicks, empowering communities and transforming lives.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-gradient-to-br from-brand-500 to-brand-600 py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div class="text-center text-white">
            <div class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">5K+</div>
            <div class="text-xs sm:text-sm md:text-base opacity-90">Properties Listed</div>
          </div>
          <div class="text-center text-white">
            <div class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">10K+</div>
            <div class="text-xs sm:text-sm md:text-base opacity-90">Happy Clients</div>
          </div>
          <div class="text-center text-white">
            <div class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">50+</div>
            <div class="text-xs sm:text-sm md:text-base opacity-90">Cities Covered</div>
          </div>
          <div class="text-center text-white">
            <div class="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">98%</div>
            <div class="text-xs sm:text-sm md:text-base opacity-90">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h2 class="text-2xl sm:text-3xl font-bold text-text-brand-600 text-center mb-8 md:mb-12">Why Choose Us</h2>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">Easy Search</h3>
          <p class="text-text-secondary text-sm sm:text-base">Find your perfect property with our advanced search filters and intuitive interface.</p>
        </div>

        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">Verified Listings</h3>
          <p class="text-text-secondary text-sm sm:text-base">All properties are verified and authenticated to ensure transparency and trust.</p>
        </div>

        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">Best Prices</h3>
          <p class="text-text-secondary text-sm sm:text-base">Get the most competitive prices and exclusive deals on premium properties.</p>
        </div>

        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">24/7 Support</h3>
          <p class="text-text-secondary text-sm sm:text-base">Our dedicated team is always ready to assist you with any questions or concerns.</p>
        </div>

        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">Mobile App</h3>
          <p class="text-text-secondary text-sm sm:text-base">Browse and book properties on the go with our user-friendly mobile application.</p>
        </div>

        <div class="text-center group">
          <div class="w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 transform transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-600">
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-2 sm:mb-3">Expert Team</h3>
          <p class="text-text-secondary text-sm sm:text-base">Work with experienced professionals who understand your needs and preferences.</p>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="bg-white py-12 md:py-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-2xl sm:text-3xl font-bold text-text-brand-600 text-center mb-4">Meet Our Team</h2>
        <p class="text-text-secondary text-center mb-8 md:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          Our dedicated team of professionals is committed to providing you with the best property experience.
        </p>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div v-for="member in team" :key="member.id" class="text-center group">
            <div class="relative overflow-hidden rounded-xl mb-4 sm:mb-6">
              <img loading="lazy" :src="member.image" :alt="member.name" class="w-full h-64 sm:h-72 object-cover transform transition-transform duration-500 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h3 class="text-lg sm:text-xl font-bold text-text-brand-600 mb-1 sm:mb-2">{{ member.name }}</h3>
            <p class="text-brand-600 font-medium text-sm sm:text-base mb-2 sm:mb-3">{{ member.role }}</p>
            <div class="flex justify-center space-x-3">
              <a href="#" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-brand-600 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div class="bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl p-8 sm:p-12 md:p-16 text-center text-white">
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Dream Property?</h2>
        <p class="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90">
          Join thousands of satisfied customers who found their perfect home with Merry360X. Start your journey today!
        </p>
        <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <router-link to="/accommodations" class="px-6 sm:px-8 py-3 bg-white text-brand-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium transform hover:scale-105">
            Browse Properties
          </router-link>
          <router-link to="/signup" class="px-6 sm:px-8 py-3 border-2 border-white text-white rounded-lg hover:bg-white hover:text-brand-600 transition-all duration-200 font-medium transform hover:scale-105">
            Get Started
          </router-link>
        </div>
      </div>
    </section>
  </PropertyLayout>
</template>

<script setup>
import { ref } from 'vue'
import PropertyLayout from '../../components/layout/PropertyLayout.vue'

const team = ref([])
</script>
