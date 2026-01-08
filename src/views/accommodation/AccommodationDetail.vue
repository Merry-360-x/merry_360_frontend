<template>
  <MainLayout>
    <div class="container mx-auto px-4 lg:px-8 py-8 bg-white dark:bg-gray-900 min-h-screen">
      <!-- Back Button -->
      <button @click="router.back()" class="flex items-center text-sm text-text-secondary hover:text-brand-600 dark:text-brand-400 mb-6 transition-colors">
        <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Back to listings
      </button>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Image Gallery -->
          <div class="grid grid-cols-4 gap-2 rounded-card overflow-hidden">
            <div class="col-span-4 row-span-2 h-96 relative bg-gray-200 dark:bg-gray-700">
              <!-- Placeholder while main image loads (no external placeholder image) -->
              <div
                v-if="!mainImageLoaded || mainImageError || !accommodation.mainImage"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <div class="w-16 h-16 mx-auto rounded-full bg-white/30 backdrop-blur-sm mb-3 flex items-center justify-center">
                    <span class="text-white font-extrabold text-lg">BR</span>
                  </div>
                  <p class="text-white font-semibold">Brazil</p>
                </div>
              </div>
              <img 
                loading="lazy" 
                decoding="async"
                :src="accommodation.mainImage" 
                :alt="accommodation.name" 
                @load="handleMainImageLoad"
                @error="handleMainImageError"
                class="w-full h-full object-cover"
                v-show="mainImageLoaded && !mainImageError && accommodation.mainImage"
              />
              <button class="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-button shadow-lg flex items-center gap-1.5 hover:bg-gray-50 transition-colors text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                View all photos
              </button>
            </div>
            <div v-for="(img, index) in accommodation.gallery" :key="index" class="h-32 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
              <div
                v-if="!galleryLoaded[index] || galleryError[index]"
                class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-600 via-yellow-400 to-sky-600"
              >
                <div class="text-center animate-pulse">
                  <span class="text-white font-bold text-xs">Brazil</span>
                </div>
              </div>
              <img 
                loading="lazy" 
                decoding="async"
                :src="img" 
                :alt="`Gallery ${index + 1}`" 
                @load="() => handleGalleryLoad(index)"
                @error="() => handleGalleryError(index)"
                class="w-full h-full object-cover"
                v-show="galleryLoaded[index] && !galleryError[index]"
              />
            </div>
          </div>

          <!-- Header Info -->
          <Card padding="lg">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h1 class="text-2xl font-bold text-text-brand-600">{{ accommodation.name }}</h1>
                  <button 
                    @click="openDirections"
                    class="inline-flex items-center px-2.5 py-1 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
                    :title="t('accommodation.getDirections')"
                  >
                    <svg class="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                    </svg>
                    {{ t('accommodation.getDirections') }}
                  </button>
                  <span v-if="accommodation.eco" class="inline-flex items-center px-3 py-1 bg-success bg-opacity-10 text-success text-sm font-medium rounded-full">
                    <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm0-10a4 4 0 100 8 4 4 0 000-8z"/>
                    </svg>
                    Eco-Certified
                  </span>
                </div>
                <div class="flex items-center gap-4 text-sm text-text-secondary">
                  <span class="flex items-center">
                    <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    {{ accommodation.location }}
                  </span>
                  <span class="flex items-center font-semibold text-text-brand-600">
                    {{ accommodation.rating }}
                    <svg class="w-4 h-4 ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="ml-1 text-text-secondary font-normal">({{ accommodation.reviews }} reviews)</span>
                  </span>
                </div>
              </div>
              <div class="flex gap-2">
                <button class="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-500 border-brand-400 hover:text-brand-600 text-brand-400 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </button>
                <button class="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-500 border-brand-400 hover:text-brand-600 text-brand-400 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </Card>

          <!-- VR/AR Preview -->
          <Card v-if="accommodation.vrTourEnabled && accommodation.vrTourUrl" padding="lg">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-bold">360° Virtual Tour</h2>
              <span class="px-3 py-1 bg-blue-500 bg-opacity-10 text-blue-600 text-sm font-medium rounded-full flex items-center gap-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                {{ accommodation.vrTourType === 'matterport' ? 'Matterport 3D' : accommodation.vrTourType === 'google_tour' ? 'Google Tour' : accommodation.vrTourType === 'youtube_360' ? 'YouTube 360°' : 'VR Tour' }}
              </span>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <iframe 
                v-if="accommodation.vrTourType === 'matterport'"
                :src="accommodation.vrTourUrl"
                class="w-full h-[500px]"
                frameborder="0"
                allowfullscreen
                allow="vr; xr; accelerometer; magnetometer; gyroscope"
              ></iframe>
              <iframe 
                v-else-if="accommodation.vrTourType === 'youtube_360'"
                :src="getYouTubeEmbedUrl(accommodation.vrTourUrl)"
                class="w-full h-[500px]"
                frameborder="0"
                allowfullscreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></iframe>
              <iframe 
                v-else-if="accommodation.vrTourType === 'google_tour'"
                :src="accommodation.vrTourUrl"
                class="w-full h-[500px]"
                frameborder="0"
                allowfullscreen
              ></iframe>
              <div v-else class="h-[500px] flex items-center justify-center">
                <a 
                  :href="accommodation.vrTourUrl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex flex-col items-center gap-3 hover:scale-105 transition-transform"
                >
                  <div class="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <span class="text-blue-600 font-semibold">Open Virtual Tour</span>
                  <span class="text-sm text-gray-500">Click to launch in new window</span>
                </a>
              </div>
            </div>
          </Card>

          <!-- Host Info -->
          <Card v-if="accommodation.host_id" padding="lg">
            <HostInfo :host-id="accommodation.host_id" />
          </Card>

          <!-- Description -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">About this place</h2>
            <p class="text-sm text-text-secondary leading-relaxed">{{ accommodation.description }}</p>
          </Card>

          <!-- Transportation Options -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Transportation Options</h2>
            <p class="text-sm text-text-secondary mb-4">Get to and from this property with ease</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div v-for="transport in transportOptions" :key="transport.id" 
                :class="[
                  'border border-gray-200 rounded-lg p-3 hover:border-red-500 border-brand-400 hover:shadow-md transition-all cursor-pointer group relative',
                  { 'animate-pulse-once bg-green-50': transport.justAdded }
                ]">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors">
                    <svg v-if="!transport.justAdded" class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    <svg v-else class="w-5 h-5 text-green-500 animate-bounce-once" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div class="flex-1">
                    <h3 class="text-sm font-semibold text-text-brand-600 mb-1">{{ transport.name }}</h3>
                    <p class="text-xs text-text-secondary mb-2">{{ transport.description }}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-base font-bold text-brand-600">{{ formatPrice(transport.price) }}</span>
                      <button 
                        @click="addTransportToCart(transport)" 
                        :disabled="transport.justAdded"
                        :class="[
                          'text-xs font-semibold transition-all',
                          transport.justAdded 
                            ? 'text-green-500 cursor-not-allowed' 
                            : 'text-brand-600 hover:text-brand-700 hover:scale-105'
                        ]">
                        <span v-if="!transport.justAdded">Add to Trip Cart</span>
                        <span v-else class="flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          Added!
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Amenities -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Amenities</h2>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="amenity in accommodation.amenities" :key="amenity" class="flex items-center gap-2">
                <div class="w-6 h-6 bg-brand-500 bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span class="text-sm text-text-brand-600">{{ amenity }}</span>
              </div>
            </div>
          </Card>

          <!-- Reviews -->
          <Card padding="lg">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold">Guest Reviews</h2>
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold text-text-brand-600">{{ accommodation.rating }}</span>
                <div>
                  <div class="flex text-yellow-500">
                    <svg v-for="i in 5" :key="i" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <p class="text-sm text-text-secondary">{{ accommodation.reviews }} reviews</p>
                </div>
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="review in accommodation.reviewsList" :key="review.id" class="border-b border-gray-100 pb-4 last:border-0">
                <div class="flex items-start gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-accent-blue flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                    {{ review.author.charAt(0) }}
                  </div>
                  <div class="flex-1">
                    <div class="flex items-center justify-between mb-2">
                      <div>
                        <h4 class="text-sm font-semibold text-text-brand-600">{{ review.author }}</h4>
                        <p class="text-xs text-text-secondary">{{ review.date }}</p>
                      </div>
                      <div class="flex items-center gap-1">
                        <span class="text-sm font-semibold">{{ review.rating }}</span>
                        <svg class="w-3.5 h-3.5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    </div>
                    <p class="text-sm text-text-secondary">{{ review.comment }}</p>
                  </div>
                </div>
              </div>
            </div>

            <Button variant="outline" full-width class="mt-6">
              View all {{ accommodation.reviews }} reviews
            </Button>
          </Card>

          <!-- Location Map -->
          <Card padding="lg">
            <h2 class="text-xl font-bold mb-4">Location</h2>
            <div class="space-y-4">
              <!-- Map Container -->
              <div class="relative w-full h-80 bg-gray-100 rounded-xl overflow-hidden">
                <iframe
                  :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(accommodation.location + ', Rwanda')}&zoom=14`"
                  width="100%"
                  height="100%"
                  style="border:0;"
                  allowfullscreen=""
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                  class="absolute inset-0"
                ></iframe>
              </div>
              
              <!-- Location Details -->
              <div class="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <svg class="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <div class="flex-1">
                  <p class="font-semibold text-gray-900 mb-1">{{ accommodation.location }}</p>
                  <p class="text-sm text-gray-600">Rwanda</p>
                </div>
                <button
                  @click="openDirections"
                  class="px-4 py-2 bg-brand-500 text-white rounded-lg text-sm font-semibold hover:bg-brand-600 transition-colors flex items-center gap-1.5"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                  </svg>
                  Directions
                </button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Booking Sidebar -->
        <div class="lg:col-span-1">
          <Card padding="lg" class="sticky top-24">
            <div class="mb-6">
              <div class="flex items-baseline gap-2 mb-1 justify-center">
                <span class="text-xl font-bold text-brand-600">{{ currencyStore.formatPrice(accommodation.price) }}</span>
                <span class="text-xs text-text-secondary whitespace-nowrap">/night</span>
              </div>
              <p class="text-xs text-center text-text-secondary">Includes taxes and fees</p>
            </div>

            <div class="space-y-3 mb-6">
              <div>
                <label class="block text-xs font-medium mb-1.5">Check-in</label>
                <input v-model="stay.checkIn" type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Check-out</label>
                <input v-model="stay.checkOut" type="date" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900" />
              </div>
              <div>
                <label class="block text-xs font-medium mb-1.5">Guests</label>
                <select v-model.number="stay.guests" class="w-full px-3 py-2 text-sm border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-accent-blue bg-white text-gray-900">
                  <option :value="1">1 Guest</option>
                  <option :value="2">2 Guests</option>
                  <option :value="3">3 Guests</option>
                  <option :value="4">4 Guests</option>
                  <option :value="5">5+ Guests</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 mb-3">
              <Button variant="outline" size="sm" @click="addToCart">
                Add to Trip Cart
              </Button>
              <Button variant="primary" size="sm" @click="goToCheckout">
                Reserve Now
              </Button>
            </div>
            <p class="text-xs text-center text-text-secondary">You won't be charged yet</p>

            <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">{{ currencyStore.formatPrice(accommodation.price) }} × {{ nights }} night{{ nights === 1 ? '' : 's' }}</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">Service fee</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(serviceFee) }}</span>
              </div>
              <div class="flex justify-between text-xs">
                <span class="text-text-secondary">Taxes</span>
                <span class="font-semibold">{{ currencyStore.formatPrice(taxes) }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="text-sm font-semibold">Total</span>
                <span class="text-lg font-bold text-brand-600">{{ currencyStore.formatPrice(total) }}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <!-- Cross Category Suggestions -->
      <CrossCategorySuggestions 
        currentCategory="accommodation" 
        :currentLocation="accommodation.location" 
      />
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useCurrencyStore } from '../../stores/currency'
import { useUserStore } from '../../stores/userStore'
import { useTranslation } from '../../composables/useTranslation'
import { useToast } from '../../composables/useToast.js'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Button from '../../components/common/Button.vue'
import CrossCategorySuggestions from '../../components/common/CrossCategorySuggestions.vue'
import HostInfo from '../../components/common/HostInfo.vue'

const router = useRouter()
const { success } = useToast()
const route = useRoute()
const currencyStore = useCurrencyStore()
const userStore = useUserStore()
const { t } = useTranslation()

const mainImageError = ref(false)
const mainImageLoaded = ref(false)
const galleryLoaded = ref([])
const galleryError = ref([])

const resetImageLoadingState = () => {
  mainImageError.value = false
  mainImageLoaded.value = false

  const gallery = Array.isArray(accommodation.value?.gallery) ? accommodation.value.gallery : []
  galleryLoaded.value = new Array(gallery.length).fill(false)
  galleryError.value = new Array(gallery.length).fill(false)
}

const handleMainImageLoad = () => {
  mainImageLoaded.value = true
}

const handleMainImageError = () => {
  mainImageError.value = true
}

const handleGalleryLoad = (index) => {
  if (!Array.isArray(galleryLoaded.value)) galleryLoaded.value = []
  galleryLoaded.value[index] = true
}

const handleGalleryError = (index) => {
  if (!Array.isArray(galleryError.value)) galleryError.value = []
  galleryError.value[index] = true
}

const stay = ref({
  checkIn: '',
  checkOut: '',
  guests: 2
})

function toDateInputValue(date) {
  return date.toISOString().split('T')[0]
}

const nights = computed(() => {
  if (!stay.value.checkIn || !stay.value.checkOut) return 1
  const inDate = new Date(stay.value.checkIn)
  const outDate = new Date(stay.value.checkOut)
  const diffTime = Math.abs(outDate - inDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays || 1
})

const subtotal = computed(() => (accommodation.value.price || 0) * nights.value)
const serviceFee = computed(() => Math.round(subtotal.value * 0.05))
const taxes = computed(() => Math.round(subtotal.value * 0.03))
const total = computed(() => subtotal.value + serviceFee.value + taxes.value)

const buildBookingQuery = () => {
  const q = route.query.q != null ? String(route.query.q).trim() : ''
  const guests = Number(stay.value.guests)
  const inDate = String(stay.value.checkIn || '').trim()
  const outDate = String(stay.value.checkOut || '').trim()

  return {
    ...(q ? { q } : {}),
    ...(Number.isFinite(guests) && guests > 0 ? { guests: String(guests) } : {}),
    ...(inDate ? { checkIn: inDate } : {}),
    ...(outDate ? { checkOut: outDate } : {})
  }
}

const goToCheckout = () => {
  router.push({
    path: `/accommodation/${accommodation.value.id}/checkout`,
    query: buildBookingQuery()
  })
}

const openDirections = () => {
  // Get the property location and open in Google Maps
  const location = encodeURIComponent(accommodation.value.location + ', ' + accommodation.value.name)
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${location}`
  window.open(mapsUrl, '_blank')
}

const addToCart = () => {
  // Add accommodation to cart
  const cartItem = {
    id: Date.now(),
    type: 'accommodation',
    name: accommodation.value.name,
    location: accommodation.value.location,
    price: accommodation.value.price,
    image: accommodation.value.mainImage
  }
  userStore.addToCart(cartItem)
  success(`${accommodation.value.name} added to cart!`)
}

const addTransportToCart = (transport) => {
  const cartItem = {
    id: Date.now(),
    type: 'transport',
    name: transport.name,
    description: transport.description,
    price: transport.price,
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
  }
  userStore.addToCart(cartItem)
  success(`${transport.name} added to trip cart!`)
  
  // Trigger animation
  transport.justAdded = true
  setTimeout(() => {
    transport.justAdded = false
  }, 2000)
}

const transportOptions = ref([
  {
    id: 1,
    name: 'Airport Transfer',
    description: 'Direct transfer from Kigali Airport',
    price: 25,
    justAdded: false
  },
  {
    id: 2,
    name: 'Private Car Rental',
    description: 'Luxury sedan with driver',
    price: 50,
    justAdded: false
  },
  {
    id: 3,
    name: 'Taxi Service',
    description: 'On-demand city transportation',
    price: 15,
    justAdded: false
  }
])

const formatPrice = (price) => {
  return currencyStore.formatPrice(price)
}

const getYouTubeEmbedUrl = (url) => {
  // Extract video ID from various YouTube URL formats
  const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube.com/embed/${videoIdMatch[1]}`
  }
  return url
}

const accommodation = ref({
  id: route.params.id,
  name: 'Kigali Serena Hotel',
  location: 'Kigali, Rwanda',
  price: 150,
  rating: 4.8,
  reviews: 324,
  eco: true,
  mainImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200',
  gallery: [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400'
  ],
  description: 'Experience luxury in the heart of Kigali at the Serena Hotel.',
  amenities: [],
  reviewsList: []
})

import api from '../../services/api'

onMounted(async () => {
  // Hydrate booking sidebar from URL (or use sensible defaults)
  const qCheckIn = route.query.checkIn != null ? String(route.query.checkIn).trim() : ''
  const qCheckOut = route.query.checkOut != null ? String(route.query.checkOut).trim() : ''
  const qGuests = route.query.guests != null && String(route.query.guests).trim() ? Number(route.query.guests) : null

  if (qCheckIn) stay.value.checkIn = qCheckIn
  if (qCheckOut) stay.value.checkOut = qCheckOut
  if (Number.isFinite(qGuests) && qGuests > 0) stay.value.guests = qGuests

  if (!stay.value.checkIn || !stay.value.checkOut) {
    const checkIn = new Date()
    checkIn.setDate(checkIn.getDate() + 7)
    const checkOut = new Date()
    checkOut.setDate(checkOut.getDate() + 10)

    stay.value.checkIn = stay.value.checkIn || toDateInputValue(checkIn)
    stay.value.checkOut = stay.value.checkOut || toDateInputValue(checkOut)
  }

  try {
    const response = await api.accommodations.getById(route.params.id)
    accommodation.value = {
      ...response.data,
      mainImage: response.data.images[0] || response.data.image,
      gallery: response.data.images.slice(1) || [],
      eco: response.data.ecoFriendly
    }

    resetImageLoadingState()
  } catch (error) {
    console.error('Failed to load accommodation:', error)
  }
})

watch(
  () => [accommodation.value?.mainImage, accommodation.value?.gallery?.length],
  () => resetImageLoadingState(),
  { immediate: true }
)
</script>

<style scoped>
@keyframes pulse-once {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes bounce-once {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-5px);
  }
}

.animate-pulse-once {
  animation: pulse-once 0.6s ease-in-out;
}

.animate-bounce-once {
  animation: bounce-once 0.6s ease-in-out;
}
</style>
