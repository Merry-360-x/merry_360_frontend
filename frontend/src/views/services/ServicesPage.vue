<template>
  <MainLayout>
    <!-- Hero Section with Image -->
    <section class="relative min-h-[400px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80" 
          alt="Services" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-brand-600/90 to-brand-500/80"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" style="font-family: 'Montserrat', sans-serif;">
          Our Comprehensive Services
        </h1>
        <p class="text-lg md:text-xl mb-8 text-white/90">
          Everything you need for an unforgettable journey in Rwanda
        </p>
      </div>
    </section>

    <!-- Services Overview -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold mb-4 text-gray-900" style="font-family: 'Montserrat', sans-serif;">
            What We Offer
          </h2>
          <div class="w-24 h-1.5 bg-brand-500 rounded-full mx-auto"></div>
        </div>

        <!-- Main Services Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <!-- Accommodation Services -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80" 
                alt="Accommodation" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">Accommodation Booking</h3>
              <p class="text-gray-600 text-sm mb-4">From luxury hotels to cozy guesthouses, find your perfect stay</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Curated selection of properties</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Best price guarantee</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>24/7 customer support</span>
                </li>
              </ul>
              <router-link to="/accommodations" class="block w-full text-center px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                Explore Stays
              </router-link>
            </div>
          </div>

          <!-- Tours & Activities -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80" 
                alt="Tours" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">Tours & Experiences</h3>
              <p class="text-gray-600 text-sm mb-4">Discover Rwanda's natural wonders and rich culture</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Gorilla trekking permits</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Expert local guides</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Small group experiences</span>
                </li>
              </ul>
              <router-link to="/tours" class="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
                Browse Tours
              </router-link>
            </div>
          </div>

          <!-- Transportation -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80" 
                alt="Transport" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">Transportation Services</h3>
              <p class="text-gray-600 text-sm mb-4">Safe and comfortable travel across Rwanda</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Airport transfers</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Car rentals with drivers</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Private & group shuttles</span>
                </li>
              </ul>
              <router-link to="/transport" class="block w-full text-center px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition-colors">
                View Options
              </router-link>
            </div>
          </div>

          <!-- Travel Planning -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488998427799-e3362cec87c3?w=800&q=80" 
                alt="Planning" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">Custom Trip Planning</h3>
              <p class="text-gray-600 text-sm mb-4">Personalized itineraries tailored to your preferences</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Expert travel consultants</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Flexible packages</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Budget-friendly options</span>
                </li>
              </ul>
              <button @click="contactPlanning" class="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Plan My Trip
              </button>
            </div>
          </div>

          <!-- Concierge Service -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800&q=80" 
                alt="Concierge" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">AI Concierge Service</h3>
              <p class="text-gray-600 text-sm mb-4">24/7 assistance powered by intelligent AI</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Instant recommendations</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Multi-language support</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Always available</span>
                </li>
              </ul>
              <button @click="openAIConcierge" class="block w-full text-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                Chat Now
              </button>
            </div>
          </div>

          <!-- Property Management -->
          <div class="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
            <div class="relative h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80" 
                alt="Business" 
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-4 left-4">
                <div class="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div class="p-6">
              <h3 class="text-xl font-bold mb-3 text-gray-900">Property Management</h3>
              <p class="text-gray-600 text-sm mb-4">Maximize your property's potential with us</p>
              <ul class="space-y-2 mb-6">
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Marketing & exposure</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Guest management</span>
                </li>
                <li class="flex items-start text-sm text-gray-700">
                  <svg class="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span>Revenue optimization</span>
                </li>
              </ul>
              <router-link to="/become-host" class="block w-full text-center px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
                Become a Host
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold mb-4" style="font-family: 'Montserrat', sans-serif; color: #484848;">
            Why Choose Merry360?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We're committed to making your Rwanda experience unforgettable
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Trusted & Secure</h3>
            <p class="text-sm text-gray-600">Your safety and security are our top priorities</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Best Price Guarantee</h3>
            <p class="text-sm text-gray-600">Get the best deals with no hidden fees</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-2">24/7 Support</h3>
            <p class="text-sm text-gray-600">Round-the-clock assistance whenever you need</p>
          </div>

          <div class="text-center">
            <div class="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
              </svg>
            </div>
            <h3 class="font-bold text-lg mb-2">Local Expertise</h3>
            <p class="text-sm text-gray-600">Deep knowledge of Rwanda's hidden gems</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-brand-500 to-brand-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Let us help you create an unforgettable experience in the Land of a Thousand Hills
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link to="/accommodations" class="px-8 py-4 bg-white text-brand-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
            Start Exploring
          </router-link>
          <button @click="contactPlanning" class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()

const contactPlanning = () => {
  alert('Our travel planning team will contact you shortly! For immediate assistance, please use our AI Concierge.')
}

const openAIConcierge = () => {
  // The AI Concierge is always available in the layout
  alert('Click the AI Trip Advisor button in the bottom right corner to start chatting!')
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style>
