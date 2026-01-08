<template>
  <MainLayout>
    <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 transition-all duration-200">
      <div class="container mx-auto px-4 lg:px-8">
        <!-- Header -->
        <div class="max-w-4xl mx-auto mb-8">
          <router-link :to="dashboardPath" class="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 mb-4 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Dashboard
          </router-link>
          <h1 class="text-4xl font-bold text-text-primary mb-2">Add New Property</h1>
          <p class="text-text-secondary">Follow the steps below to list your property</p>
        </div>

        <!-- Progress Indicator -->
        <div class="max-w-4xl mx-auto mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div v-for="(step, index) in steps" :key="index" class="flex items-center flex-1">
                <div class="flex flex-col items-center flex-1">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300"
                    :class="currentStep > index ? 'bg-green-500 text-white' : currentStep === index ? 'bg-brand-600 text-white ring-4 ring-brand-100 dark:ring-brand-900' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                  >
                    <svg v-if="currentStep > index" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs font-medium mt-2 text-center" :class="currentStep >= index ? 'text-text-primary' : 'text-text-muted'">
                    {{ step.title }}
                  </span>
                </div>
                <div v-if="index < steps.length - 1" class="flex-1 h-1 mx-2" :class="currentStep > index ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Container -->
        <div class="max-w-4xl mx-auto">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <form @submit.prevent="handleNext">
              <!-- Step Content -->
              <div class="p-8 min-h-[500px]">
                <!-- Step 1: Basic Information -->
                <div v-if="currentStep === 0" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Let's start with the basics</h2>
                    <p class="text-text-secondary">Tell us about your property</p>
                  </div>

                <div>
                    <label class="block text-sm font-semibold text-text-primary mb-2">Property Name *</label>
                  <input 
                    v-model="form.title"
                    type="text" 
                    required
                      placeholder="e.g., Luxury Kigali View Apartment"
                      class="w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      :class="fieldErrors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary'"
                      @input="validateField('title')"
                    />
                    <p v-if="fieldErrors.title" class="text-red-500 text-sm mt-1">{{ fieldErrors.title }}</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-text-primary mb-2">Property Type *</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        v-for="type in propertyTypes"
                        :key="type.value"
                        type="button"
                        @click="form.category = type.value"
                        class="relative p-4 border-2 rounded-xl transition-all hover:shadow-lg"
                        :class="form.category === type.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                      >
                        <div class="text-3xl mb-2">{{ type.icon }}</div>
                        <div class="text-sm font-medium text-text-primary">{{ type.label }}</div>
                        <div v-if="form.category === type.value" class="absolute top-2 right-2 w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center">
                          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        </div>
                      </button>
                    </div>
                    <p v-if="fieldErrors.category" class="text-red-500 text-sm mt-1">{{ fieldErrors.category }}</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-text-primary mb-2">Location *</label>
                  <input 
                    v-model="form.location"
                    type="text" 
                    required
                      placeholder="e.g., Kigali, Nyarugenge District"
                      class="w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                      :class="fieldErrors.location ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary'"
                      @input="validateField('location')"
                    />
                    <p v-if="fieldErrors.location" class="text-red-500 text-sm mt-1">{{ fieldErrors.location }}</p>
                </div>

                <div>
                    <label class="block text-sm font-semibold text-text-primary mb-2">Description *</label>
                  <textarea 
                    v-model="form.description"
                    required
                      rows="5"
                      placeholder="Describe your property, its unique features, nearby attractions, and what makes it special..."
                      class="w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all resize-none"
                      :class="fieldErrors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary'"
                      @input="validateField('description')"
                  ></textarea>
                    <p class="text-sm text-text-muted mt-1">{{ form.description.length }} characters (minimum 50)</p>
                    <p v-if="fieldErrors.description" class="text-red-500 text-sm mt-1">{{ fieldErrors.description }}</p>
                  </div>
                </div>

                <!-- Step 2: Property Details -->
                <div v-if="currentStep === 1" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Property Details</h2>
                    <p class="text-text-secondary">Provide information about rooms and capacity</p>
            </div>

                  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Bedrooms *</label>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="form.beds = Math.max(0, form.beds - 1)"
                          class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                  <input 
                    v-model.number="form.beds"
                    type="number" 
                    min="0"
                          required
                          class="flex-1 text-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary text-lg font-bold"
                        />
                        <button
                          type="button"
                          @click="form.beds++"
                          class="w-10 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center text-white"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </button>
                      </div>
                </div>

                <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Bathrooms *</label>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="form.baths = Math.max(0, form.baths - 1)"
                          class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                  <input 
                    v-model.number="form.baths"
                    type="number" 
                    min="0"
                          required
                          class="flex-1 text-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary text-lg font-bold"
                        />
                        <button
                          type="button"
                          @click="form.baths++"
                          class="w-10 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center text-white"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </button>
                      </div>
                </div>

                <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Max Guests *</label>
                      <div class="flex items-center gap-3">
                        <button
                          type="button"
                          @click="form.maxGuests = Math.max(1, form.maxGuests - 1)"
                          class="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                          </svg>
                        </button>
                  <input 
                    v-model.number="form.maxGuests"
                    type="number" 
                    min="1"
                          required
                          class="flex-1 text-center px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary text-lg font-bold"
                        />
                        <button
                          type="button"
                          @click="form.maxGuests++"
                          class="w-10 h-10 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors flex items-center justify-center text-white"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                          </svg>
                        </button>
                </div>
              </div>
            </div>
              
              <div>
                    <label class="block text-sm font-semibold text-text-primary mb-2">Price per Night (RWF) *</label>
                <div class="relative">
                      <span class="absolute left-4 top-4 text-text-muted font-bold">RWF</span>
                  <input 
                    v-model.number="form.price"
                    type="number" 
                    min="1"
                    required
                        placeholder="100000"
                        class="w-full pl-16 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all text-lg font-bold"
                        :class="fieldErrors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary'"
                        @input="validateField('price')"
                      />
                    </div>
                    <p v-if="fieldErrors.price" class="text-red-500 text-sm mt-1">{{ fieldErrors.price }}</p>
                  </div>
                </div>

                <!-- Step 3: Amenities -->
                <div v-if="currentStep === 2" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Amenities & Features</h2>
                    <p class="text-text-secondary">Select all amenities available at your property</p>
                  </div>

                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <button
                      v-for="amenity in availableAmenities"
                      :key="amenity.value"
                      type="button"
                      @click="toggleAmenity(amenity.value)"
                      class="p-4 border-2 rounded-xl transition-all hover:shadow-md flex items-center gap-3"
                      :class="form.amenities.includes(amenity.value) ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                    >
                      <div class="flex-shrink-0 text-2xl">{{ amenity.icon }}</div>
                      <span class="text-sm font-medium text-text-primary text-left">{{ amenity.label }}</span>
                      <div v-if="form.amenities.includes(amenity.value)" class="ml-auto w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                  <p v-if="fieldErrors.amenities" class="text-red-500 text-sm">{{ fieldErrors.amenities }}</p>
                  <p class="text-sm text-text-muted">Selected: {{ form.amenities.length }} amenities</p>
              </div>

                <!-- Step 4: Photos -->
                <div v-if="currentStep === 3" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Property Photos</h2>
                    <p class="text-text-secondary">Upload high-quality photos to attract more guests</p>
            </div>

              <PhotoUploader
                v-model="propertyImages"
                v-model:uploading="imagesUploading"
                title="Property Images"
                    subtitle="Add at least 5 photos (up to 15)"
                    :min-photos="5"
                :max-photos="15"
                folder="merry360x/properties"
              />
                  <p v-if="fieldErrors.images" class="text-red-500 text-sm">{{ fieldErrors.images }}</p>
            </div>

                <!-- Step 5: Virtual Tour (Optional) -->
                <div v-if="currentStep === 4" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">360° Virtual Tour</h2>
                    <p class="text-text-secondary">Add a virtual tour to increase bookings (Optional)</p>
                  </div>

                  <div class="bg-brand-50 dark:bg-brand-900/20 border-2 border-brand-200 dark:border-brand-800 rounded-xl p-6">
                    <div class="flex gap-4">
                      <div class="flex-shrink-0">
                        <div class="w-12 h-12 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center">
                          <svg class="w-6 h-6 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                          </svg>
                        </div>
                      </div>
                      <div>
                        <h3 class="font-bold text-brand-800 dark:text-brand-200 mb-1">Boost bookings by 40%!</h3>
                        <p class="text-sm text-brand-700 dark:text-brand-300">Properties with virtual tours get more bookings and higher prices</p>
                  </div>
                </div>
              </div>

                  <label class="flex items-center gap-3 cursor-pointer p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-brand-300 transition-all">
                  <input 
                    type="checkbox" 
                    v-model="form.vrTourEnabled"
                      class="rounded border-gray-300 dark:border-gray-600 text-brand-600 focus:ring-brand-500 w-6 h-6"
                  />
                  <div>
                      <span class="text-base font-semibold text-text-primary block">Enable Virtual Tour</span>
                      <span class="text-sm text-text-muted">Allow guests to explore in 360°</span>
                  </div>
                </label>

                  <div v-if="form.vrTourEnabled" class="space-y-4 pl-4 border-l-4 border-brand-200 dark:border-brand-800">
                  <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Platform</label>
                    <select 
                      v-model="form.vrTourType"
                        class="w-full px-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                    >
                      <option value="">Select platform...</option>
                      <option value="matterport">Matterport 3D Tour</option>
                      <option value="google_tour">Google Virtual Tour</option>
                      <option value="youtube_360">YouTube 360° Video</option>
                        <option value="custom">Custom VR Link</option>
                    </select>
                  </div>

                  <div>
                      <label class="block text-sm font-semibold text-text-primary mb-2">Virtual Tour URL</label>
                    <input 
                      v-model="form.vrTourUrl" 
                      type="url"
                      placeholder="https://my.matterport.com/show/?m=..."
                        class="w-full px-4 py-3.5 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white dark:bg-gray-700 text-text-primary"
                      />
                    </div>
                  </div>
                </div>

                <!-- Step 6: Review & Submit -->
                <div v-if="currentStep === 5" class="space-y-6">
                  <div>
                    <h2 class="text-2xl font-bold text-text-primary mb-2">Review & Publish</h2>
                    <p class="text-text-secondary">Review your listing before publishing</p>
                  </div>

                  <div class="bg-gradient-to-br from-brand-50 to-blue-50 dark:from-brand-900/20 dark:to-blue-900/20 border-2 border-brand-200 dark:border-brand-800 rounded-2xl p-8">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <!-- Left Column -->
                      <div class="space-y-4">
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Property Name</h3>
                          <p class="text-lg font-bold text-text-primary">{{ form.title }}</p>
                        </div>
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Type & Location</h3>
                          <p class="text-lg font-bold text-text-primary">{{ form.category }} • {{ form.location }}</p>
                        </div>
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Capacity</h3>
                          <p class="text-lg font-bold text-text-primary">{{ form.beds }} Beds • {{ form.baths }} Baths • {{ form.maxGuests }} Guests</p>
              </div>
            </div>

                      <!-- Right Column -->
                      <div class="space-y-4">
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Price per Night</h3>
                          <p class="text-2xl font-bold text-brand-600 dark:text-brand-400">RWF {{ form.price?.toLocaleString() }}</p>
                        </div>
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Amenities</h3>
                          <p class="text-lg font-bold text-text-primary">{{ form.amenities.length }} selected</p>
                        </div>
                        <div>
                          <h3 class="text-sm font-semibold text-text-muted mb-1">Photos</h3>
                          <p class="text-lg font-bold text-text-primary">{{ propertyImages.length }} images</p>
                        </div>
                      </div>
                    </div>

                    <!-- Images Preview -->
                    <div v-if="propertyImages.length > 0" class="mt-6">
                      <h3 class="text-sm font-semibold text-text-muted mb-3">Photo Preview</h3>
                      <div class="grid grid-cols-4 gap-2">
                        <img
                          v-for="(img, idx) in propertyImages.slice(0, 4)"
                          :key="idx"
                          :src="img.url || img.preview"
                          class="w-full h-20 object-cover rounded-lg"
                        />
                      </div>
              </div>
            </div>

                  <!-- Error Summary -->
                  <div v-if="Object.keys(fieldErrors).length > 0" class="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                    <div class="flex gap-3">
                      <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <h4 class="font-bold text-red-800 dark:text-red-300 mb-1">Please fix the following errors:</h4>
                        <ul class="text-sm text-red-700 dark:text-red-400 space-y-1">
                          <li v-for="(error, field) in fieldErrors" :key="field">• {{ error }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="border-t-2 border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
            <div class="flex gap-4">
              <button 
                    v-if="currentStep > 0"
                    type="button"
                    @click="previousStep"
                    class="px-8 py-3.5 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-text-primary font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                  >
                    ← Previous
                  </button>
                  
                  <div class="flex-1"></div>

                  <button
                    v-if="currentStep < steps.length - 1"
                    type="button"
                    @click="handleNext"
                    class="px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                  >
                    Next Step →
                  </button>

                  <button
                    v-else
                    type="button"
                    @click="handleSubmit"
                :disabled="isSubmitting || imagesUploading"
                    class="px-8 py-3.5 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                    <span v-if="isSubmitting">Publishing...</span>
                    <span v-else>🎉 Publish Property</span>
              </button>
                </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <Teleport to="body">
      <div v-if="showSuccessModal" class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
          <div class="bg-gradient-to-br from-green-500 to-green-600 p-8 text-center">
            <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2">Success!</h2>
            <p class="text-green-50">Your property has been published</p>
          </div>
          <div class="p-6 text-center">
            <p class="text-text-secondary mb-6">Redirecting to your properties...</p>
            <div class="flex gap-3">
              <button
                @click="router.push(propertiesPath)"
                class="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors"
              >
                View Properties
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import api from '../../services/api'
import { useUserStore } from '../../stores/userStore'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { success: showToastSuccess, error: showToastError } = useToast()

const isHostPortal = computed(() => String(route.path || '').startsWith('/host'))
const isAdminPortal = computed(() => String(route.path || '').startsWith('/admin'))
const basePath = computed(() => {
  if (isHostPortal.value) return '/host'
  if (isAdminPortal.value) return '/admin'
  return '/staff'
})
const dashboardPath = computed(() => basePath.value)
const propertiesPath = computed(() => `${basePath.value}/properties`)

const currentStep = ref(0)
const isSubmitting = ref(false)
const imagesUploading = ref(false)
const showSuccessModal = ref(false)
const fieldErrors = ref({})

const steps = [
  { title: 'Basics' },
  { title: 'Details' },
  { title: 'Amenities' },
  { title: 'Photos' },
  { title: 'Virtual Tour' },
  { title: 'Review' }
]

const propertyTypes = [
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'villa', label: 'Villa', icon: '🏡' },
  { value: 'apartment', label: 'Apartment', icon: '🏢' },
  { value: 'resort', label: 'Resort', icon: '🏖️' },
  { value: 'lodge', label: 'Lodge', icon: '🏕️' },
  { value: 'guesthouse', label: 'Guesthouse', icon: '🏠' },
  { value: 'motel', label: 'Motel', icon: '🛏️' },
  { value: 'hostel', label: 'Hostel', icon: '🎒' }
]

const availableAmenities = [
  { value: 'WiFi', label: 'WiFi', icon: '📶' },
  { value: 'Pool', label: 'Pool', icon: '🏊' },
  { value: 'Restaurant', label: 'Restaurant', icon: '🍽️' },
  { value: 'Spa', label: 'Spa', icon: '💆' },
  { value: 'Gym', label: 'Gym', icon: '💪' },
  { value: 'Room Service', label: 'Room Service', icon: '🛎️' },
  { value: 'Air Conditioning', label: 'AC', icon: '❄️' },
  { value: 'Parking', label: 'Parking', icon: '🚗' },
  { value: 'Kitchen', label: 'Kitchen', icon: '🍳' },
  { value: 'Beach Access', label: 'Beach', icon: '🏖️' },
  { value: 'Mountain Views', label: 'Views', icon: '⛰️' },
  { value: 'Bar', label: 'Bar', icon: '🍸' },
  { value: 'Laundry', label: 'Laundry', icon: '🧺' },
  { value: 'Security', label: 'Security', icon: '🔒' },
  { value: 'TV', label: 'TV', icon: '📺' },
  { value: 'Balcony', label: 'Balcony', icon: '🪟' }
]

const form = ref({
  title: '',
  category: '',
  location: '',
  description: '',
  beds: 1,
  baths: 1,
  maxGuests: 2,
  price: null,
  amenities: [],
  vrTourEnabled: false,
  vrTourUrl: '',
  vrTourType: '',
  latitude: null,
  longitude: null
})

const propertyImages = ref([])

function validateField(fieldName) {
  fieldErrors.value = { ...fieldErrors.value }
  delete fieldErrors.value[fieldName]

  switch (fieldName) {
    case 'title':
      if (!form.value.title || form.value.title.length < 5) {
        fieldErrors.value.title = 'Property name must be at least 5 characters'
      }
      break
    case 'location':
      if (!form.value.location || form.value.location.length < 3) {
        fieldErrors.value.location = 'Please enter a valid location'
      }
      break
    case 'description':
      if (!form.value.description || form.value.description.length < 50) {
        fieldErrors.value.description = 'Description must be at least 50 characters'
      }
      break
    case 'price':
      if (!form.value.price || form.value.price <= 0) {
        fieldErrors.value.price = 'Please enter a valid price'
      }
      break
  }
}

function validateStep(step) {
  fieldErrors.value = {}

  if (step === 0) {
    if (!form.value.title || form.value.title.length < 5) {
      fieldErrors.value.title = 'Property name must be at least 5 characters'
    }
    if (!form.value.category) {
      fieldErrors.value.category = 'Please select a property type'
    }
    if (!form.value.location || form.value.location.length < 3) {
      fieldErrors.value.location = 'Please enter a valid location'
    }
    if (!form.value.description || form.value.description.length < 50) {
      fieldErrors.value.description = 'Description must be at least 50 characters'
    }
  } else if (step === 1) {
    if (!form.value.price || form.value.price <= 0) {
      fieldErrors.value.price = 'Please enter a valid price'
    }
  } else if (step === 2) {
    if (form.value.amenities.length === 0) {
      fieldErrors.value.amenities = 'Please select at least one amenity'
    }
  } else if (step === 3) {
    if (propertyImages.value.length < 5) {
      fieldErrors.value.images = 'Please upload at least 5 photos'
    }
  }

  return Object.keys(fieldErrors.value).length === 0
}

function handleNext() {
  if (validateStep(currentStep.value)) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    showToastError('Please fix the errors before continuing')
  }
}

function previousStep() {
  currentStep.value--
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleAmenity(amenity) {
  const index = form.value.amenities.indexOf(amenity)
  if (index > -1) {
    form.value.amenities.splice(index, 1)
  } else {
    form.value.amenities.push(amenity)
  }
}

function normalizePropertyType(rawType) {
  const value = String(rawType || '').trim()
  if (!value) return 'Accommodation'

  const normalized = value.toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()

  const map = {
    hotel: 'Hotel',
    motel: 'Motel',
    resort: 'Resort',
    lodge: 'Lodge',
    apartment: 'Apartment',
    villa: 'Villa',
    guesthouse: 'Guesthouse',
    hostel: 'Hostel',
    'guest house': 'Guesthouse'
  }

  return map[normalized] || value.charAt(0).toUpperCase() + value.slice(1)
}

async function handleSubmit() {
  console.log('🔍 Starting property submission...')

  // Final validation
  if (!validateStep(0) || !validateStep(1) || !validateStep(2) || !validateStep(3)) {
    showToastError('Please complete all required fields')
    currentStep.value = 0 // Go back to first error
    return
  }

  if (imagesUploading.value) {
    showToastError('Please wait for images to finish uploading')
    return
  }

  if (!userStore.user?.id) {
    showToastError('Please login to add properties')
    router.push('/login')
    return
  }

  isSubmitting.value = true

  try {
    const imageUrls = propertyImages.value.map((img) => img.url || img.preview).filter(Boolean)
    console.log('📷 Processing', imageUrls.length, 'images')

    if (imageUrls.length === 0) {
      throw new Error('Please upload at least one image')
    }

    const propertyData = {
      name: form.value.title.trim(),
      description: form.value.description.trim(),
      type: normalizePropertyType(form.value.category),
      location: form.value.location.trim(),
      price: Number(form.value.price),
      bedrooms: Number(form.value.beds),
      bathrooms: Number(form.value.baths),
      maxGuests: Number(form.value.maxGuests),
      amenities: form.value.amenities,
      image: imageUrls[0],
      images: imageUrls,
      vr_tour_enabled: form.value.vrTourEnabled || false,
      vr_tour_url: form.value.vrTourUrl || null,
      vr_tour_type: form.value.vrTourType || null,
      latitude: form.value.latitude || null,
      longitude: form.value.longitude || null
    }

    console.log('📤 Submitting property data...', propertyData)
    console.log('API check:', typeof api.accommodations?.create)

    // Verify API method exists
    if (!api.accommodations || typeof api.accommodations.create !== 'function') {
      throw new Error('Property creation API is not available. Please contact support.')
    }

    // Add timeout protection to prevent hanging
    const createProperty = api.accommodations.create(propertyData)
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    )

    const result = await Promise.race([createProperty, timeout])
    console.log('📊 Create result:', result)

    console.log('✅ Property created successfully!')
    showSuccessModal.value = true
    showToastSuccess('Property published successfully!')

    // Redirect after delay
    setTimeout(() => {
      router.push(propertiesPath.value)
    }, 2000)

  } catch (error) {
    console.error('❌ Error creating property:', error)
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create property. Please try again.'
    
    if (error?.message) {
      errorMessage = error.message
    } else if (error?.error?.message) {
      errorMessage = error.error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }

    // Check for specific error types
    if (errorMessage.includes('host_application_status')) {
      errorMessage = 'Your host application needs approval. Please contact support.'
    } else if (errorMessage.includes('permission') || errorMessage.includes('denied')) {
      errorMessage = 'You don\'t have permission to add properties. Please contact admin.'
    } else if (errorMessage.includes('timeout')) {
      errorMessage = 'The request is taking too long. Please check your internet and try again.'
    }

    showToastError(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
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
</style>
