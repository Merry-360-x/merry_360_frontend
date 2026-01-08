<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-brand-50 via-orange-50 to-brand-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse" style="animation-delay: 1s;"></div>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-block mb-6 px-6 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg animate-bounce">
            <span class="text-brand-600 dark:text-brand-400 font-bold text-sm">🏠 Become a Host Today</span>
          </div>
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
            Share Your Space, <br/>Earn <span class="text-brand-600">Extra Income</span>
          </h1>
          <p class="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10">
            Join thousands of hosts in Rwanda earning money by sharing their properties, tours, and transport services
          </p>
          <button 
            @click="scrollToForm"
            class="group px-10 py-5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
          >
            <span class="flex items-center gap-3">
              Start Application
              <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Application Form -->
    <section ref="formSection" class="py-16 bg-gray-50 dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <!-- Progress Bar -->
          <div class="mb-12">
            <div class="flex items-center justify-center gap-2 mb-4">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Application Progress</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                class="h-full bg-gradient-to-r from-brand-500 via-brand-600 to-orange-500 rounded-full transition-all duration-700 ease-out shadow-lg"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <div class="text-center mt-2">
              <span class="text-sm font-bold text-brand-600 dark:text-brand-400">{{ progress }}% Complete</span>
            </div>
          </div>

          <!-- Form Card -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
            <form @submit.prevent="handleSubmit" class="space-y-12">
              
              <!-- Section 1: Personal Information -->
              <div class="animate-fade-in">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Tell us about yourself</p>
                  </div>
                </div>
                
                <!-- Account Type Selection -->
                <div class="mb-8">
                  <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Account Type *</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        v-model="formData.accountType"
                        value="individual"
                        class="peer sr-only"
                        @change="updateProgress"
                      />
                      <div class="p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:border-gray-300 hover:shadow-md">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">Individual</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Personal hosting</p>
                          </div>
                        </div>
                      </div>
                    </label>
                    <label class="relative cursor-pointer">
                      <input
                        type="radio"
                        v-model="formData.accountType"
                        value="business"
                        class="peer sr-only"
                        @change="updateProgress"
                      />
                      <div class="p-5 border-2 border-gray-200 dark:border-gray-600 rounded-2xl transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:border-gray-300 hover:shadow-md">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg flex-shrink-0">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 class="font-bold text-gray-900 dark:text-white mb-1">Business</h3>
                            <p class="text-sm text-gray-600 dark:text-gray-400">Company or organization</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                    <input 
                      v-model="formData.firstName"
                      type="text" 
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                    <input 
                      v-model="formData.lastName"
                      type="text" 
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Enter your last name"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                    <input 
                      v-model="formData.email"
                      type="email" 
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                    <input 
                      v-model="formData.phone"
                      type="tel" 
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="+250 788 123 456"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                    <input 
                      v-model="formData.address"
                      type="text" 
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Your full address"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nationality *</label>
                    <select
                      v-model="formData.nationality"
                      required
                      @change="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      <option value="">Select your nationality</option>
                      <option value="RW">Rwanda</option>
                      <option value="KE">Kenya</option>
                      <option value="UG">Uganda</option>
                      <option value="TZ">Tanzania</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="FR">France</option>
                      <option value="DE">Germany</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">ID Number *</label>
                    <input
                      v-model="formData.idNumber"
                      type="text"
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Enter your ID number"
                    />
                  </div>
                  <div class="md:col-span-2">
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload ID Photo *</label>
                    <div class="relative">
                      <input
                        type="file"
                        ref="idPhotoInput"
                        accept="image/*"
                        @change="handleIdPhotoUpload"
                        class="hidden"
                      />
                      <button
                        type="button"
                        @click="$refs.idPhotoInput.click()"
                        class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-brand-500 transition-all flex items-center justify-center gap-3"
                      >
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <span v-if="!idPhotoPreview">Click to upload ID photo</span>
                        <span v-else class="text-brand-600 dark:text-brand-400 font-medium">✓ ID Photo Uploaded</span>
                      </button>
                      <div v-if="idPhotoPreview" class="mt-4 relative inline-block">
                        <img :src="idPhotoPreview" alt="ID Preview" class="h-32 w-auto rounded-lg shadow-lg" />
                        <button
                          type="button"
                          @click="removeIdPhoto"
                          class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                      <p v-if="uploadingIdPhoto" class="mt-2 text-sm text-brand-600 dark:text-brand-400 font-medium">Uploading...</p>
                    </div>
                  </div>

                  <!-- Business-specific fields -->
                  <template v-if="formData.accountType === 'business'">
                    <div class="md:col-span-2 mt-6 p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl border-2 border-green-200 dark:border-green-800">
                      <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                        </svg>
                        Business Information
                      </h3>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business TIN (18 digits) *</label>
                          <input
                            v-model="formData.businessTin"
                            type="text"
                            maxlength="18"
                            pattern="[0-9]{18}"
                            :required="formData.accountType === 'business'"
                            @input="updateProgress"
                            class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="Enter 18-digit TIN number"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Owner's ID Number *</label>
                          <input
                            v-model="formData.ownerIdNumber"
                            type="text"
                            :required="formData.accountType === 'business'"
                            @input="updateProgress"
                            class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="Enter owner's ID number"
                          />
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Registration Certificate *</label>
                          <div class="relative">
                            <input
                              type="file"
                              ref="businessCertInput"
                              accept="image/*,application/pdf"
                              @change="handleBusinessCertUpload"
                              class="hidden"
                            />
                            <button
                              type="button"
                              @click="$refs.businessCertInput.click()"
                              class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-brand-500 transition-all flex items-center justify-center gap-3"
                            >
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                              </svg>
                              <span v-if="!businessCertPreview">Click to upload business certificate</span>
                              <span v-else class="text-brand-600 dark:text-brand-400 font-medium">✓ Certificate Uploaded</span>
                            </button>
                            <div v-if="businessCertPreview" class="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg border-2 border-brand-200 dark:border-brand-800 flex items-center justify-between">
                              <div class="flex items-center gap-3">
                                <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span class="text-sm font-medium text-gray-900 dark:text-white">Business Certificate</span>
                              </div>
                              <button
                                type="button"
                                @click="removeBusinessCert"
                                class="w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <p v-if="uploadingBusinessCert" class="mt-2 text-sm text-brand-600 dark:text-brand-400 font-medium">Uploading certificate...</p>
                          </div>
                        </div>

                        <div class="md:col-span-2">
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Owner's ID Photo *</label>
                          <div class="relative">
                            <input
                              type="file"
                              ref="ownerIdInput"
                              accept="image/*"
                              @change="handleOwnerIdUpload"
                              class="hidden"
                            />
                            <button
                              type="button"
                              @click="$refs.ownerIdInput.click()"
                              class="w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:border-brand-500 transition-all flex items-center justify-center gap-3"
                            >
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                              </svg>
                              <span v-if="!ownerIdPreview">Click to upload owner's ID</span>
                              <span v-else class="text-brand-600 dark:text-brand-400 font-medium">✓ Owner's ID Uploaded</span>
                            </button>
                            <div v-if="ownerIdPreview" class="mt-4 relative inline-block">
                              <img :src="ownerIdPreview" alt="Owner ID Preview" class="h-32 w-auto rounded-lg shadow-lg" />
                              <button
                                type="button"
                                @click="removeOwnerIdPhoto"
                                class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                              >
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              </button>
                            </div>
                            <p v-if="uploadingOwnerIdPhoto" class="mt-2 text-sm text-brand-600 dark:text-brand-400 font-medium">Uploading...</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>

              <!-- Section 2: What You're Hosting -->
              <div class="animate-fade-in border-t-2 border-gray-200 dark:border-gray-700 pt-12">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">What You're Offering</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Choose what you want to share</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <label class="relative cursor-pointer">
                    <input
                      type="radio"
                      v-model="formData.hostingType"
                      value="accommodation"
                      class="peer sr-only"
                      @change="updateProgress"
                    />
                    <div class="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:border-gray-300 hover:shadow-lg">
                      <div class="mb-4 flex justify-center">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center shadow-lg">
                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-center">Property</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">Share your home or apartment</p>
                    </div>
                  </label>
                  <label class="relative cursor-pointer">
                    <input
                      type="radio"
                      v-model="formData.hostingType"
                      value="tour"
                      class="peer sr-only"
                      @change="updateProgress"
                    />
                    <div class="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:border-gray-300 hover:shadow-lg">
                      <div class="mb-4 flex justify-center">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg">
                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-center">Tour</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">Offer guided experiences</p>
                    </div>
                  </label>
                  <label class="relative cursor-pointer">
                    <input
                      type="radio"
                      v-model="formData.hostingType"
                      value="transport"
                      class="peer sr-only"
                      @change="updateProgress"
                    />
                    <div class="p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl transition-all peer-checked:border-brand-500 peer-checked:bg-brand-50 dark:peer-checked:bg-brand-900/20 hover:border-gray-300 hover:shadow-lg">
                      <div class="mb-4 flex justify-center">
                        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center shadow-lg">
                          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                          </svg>
                        </div>
                      </div>
                      <h3 class="font-bold text-gray-900 dark:text-white mb-1 text-center">Transport</h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 text-center">Provide transportation</p>
                    </div>
                  </label>
                </div>

                <div v-if="formData.hostingType === 'accommodation'" class="space-y-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                      <input
                        v-model="formData.propertyLocation"
                        type="text"
                        required
                        @input="updateProgress"
                        class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="e.g., Kigali, Kicukiro"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Price per Night (USD) *</label>
                      <input
                        v-model.number="formData.price"
                        type="number"
                        min="1"
                        required
                        @input="updateProgress"
                        class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                        placeholder="50"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                    <textarea 
                      v-model="formData.description"
                      required
                      @input="updateProgress"
                      rows="4"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Describe your property..."
                    ></textarea>
                  </div>
                </div>

                <div v-else-if="formData.hostingType" class="space-y-6">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                    <input
                      v-model="formData.propertyLocation"
                      type="text"
                      required
                      @input="updateProgress"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Where is your service located?"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                    <textarea 
                      v-model="formData.description"
                      required
                      @input="updateProgress"
                      rows="4"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-brand-500 transition-colors"
                      placeholder="Describe what you're offering..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Section 3: Agreement -->
              <div class="animate-fade-in border-t-2 border-gray-200 dark:border-gray-700 pt-12">
                <div class="flex items-center gap-4 mb-6">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Review & Submit</h2>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Agree to our terms and submit</p>
                  </div>
                </div>

                <div class="bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 border-2 border-brand-200 dark:border-brand-800">
                  <label class="flex items-start gap-4 cursor-pointer group">
                    <input 
                      v-model="formData.agreeToTerms"
                      type="checkbox" 
                      required
                      @change="updateProgress"
                      class="mt-1 w-6 h-6 text-brand-500 border-2 border-gray-300 rounded-lg focus:ring-brand-500 focus:ring-2 cursor-pointer"
                    />
                    <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors">
                      I agree to Merry360's <a href="#" class="text-brand-600 underline">Terms of Service</a>, 
                      <a href="#" class="text-brand-600 underline">Privacy Policy</a>, and 
                      <a href="#" class="text-brand-600 underline">Host Guidelines</a>. 
                      I understand my application will be reviewed before approval. *
                    </span>
                  </label>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex items-center justify-center pt-8">
                <button 
                  type="submit"
                  :disabled="isSubmitting || !isFormValid"
                  class="group relative px-12 py-5 bg-gradient-to-r from-brand-500 via-brand-600 to-orange-500 hover:from-brand-600 hover:via-brand-700 hover:to-orange-600 disabled:from-gray-400 disabled:via-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold text-lg rounded-2xl transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:transform-none disabled:hover:shadow-2xl"
                >
                  <span v-if="isSubmitting" class="flex items-center gap-3">
                    <svg class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </span>
                  <span v-else class="flex items-center gap-3">
                    <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Submit Application
                    <svg class="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 bg-white dark:bg-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Why Host with Merry360?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-700 dark:to-gray-800">
              <div class="text-5xl mb-4">💰</div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Earn Extra Income</h3>
              <p class="text-gray-600 dark:text-gray-400">Turn your unused space into profit</p>
            </div>
            <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-700 dark:to-gray-800">
              <div class="text-5xl mb-4">🛡️</div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure & Safe</h3>
              <p class="text-gray-600 dark:text-gray-400">Protected payments and verified guests</p>
            </div>
            <div class="text-center p-6 rounded-2xl bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-700 dark:to-gray-800">
              <div class="text-5xl mb-4">📊</div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Full Control</h3>
              <p class="text-gray-600 dark:text-gray-400">Set your own prices and availability</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { uploadToCloudinary, uploadDocumentToCloudinary } from '../../services/cloudinary'

const router = useRouter()
const formSection = ref(null)
const isSubmitting = ref(false)

// Ensure isSubmitting is reset on mount
onMounted(() => {
  isSubmitting.value = false
})

const formData = reactive({
  accountType: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  nationality: '',
  idNumber: '',
  idPhotoUrl: '',
  businessTin: '',
  businessCertUrl: '',
  ownerIdNumber: '',
  ownerIdPhotoUrl: '',
  hostingType: '',
  propertyLocation: '',
  description: '',
  price: 0,
  agreeToTerms: false
})

const idPhotoInput = ref(null)
const idPhotoPreview = ref('')
const uploadingIdPhoto = ref(false)

const businessCertInput = ref(null)
const businessCertPreview = ref('')
const uploadingBusinessCert = ref(false)

const ownerIdInput = ref(null)
const ownerIdPreview = ref('')
const uploadingOwnerIdPhoto = ref(false)

const scrollToForm = () => {
  formSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const progress = computed(() => {
  const fields = [
    formData.accountType,
    formData.firstName,
    formData.lastName,
    formData.email,
    formData.phone,
    formData.address,
    formData.nationality,
    formData.idNumber,
    formData.idPhotoUrl,
    formData.hostingType,
    formData.propertyLocation,
    formData.description,
    formData.agreeToTerms
  ]
  
  const filled = fields.filter(f => f && f !== '' && f !== 0).length
  return Math.round((filled / fields.length) * 100)
})

const isFormValid = computed(() => {
  const baseValid = formData.accountType &&
         formData.firstName &&
         formData.lastName &&
         formData.email &&
         formData.phone &&
         formData.address &&
         formData.nationality &&
         formData.idNumber &&
         formData.idPhotoUrl &&
         formData.hostingType &&
         formData.propertyLocation &&
         formData.description &&
         formData.agreeToTerms
  
  // Additional validation for business accounts
  if (formData.accountType === 'business') {
    return baseValid &&
           formData.businessTin &&
           formData.businessTin.length === 18 &&
           formData.businessCertUrl &&
           formData.ownerIdNumber &&
           formData.ownerIdPhotoUrl
  }
  
  return baseValid
})

const updateProgress = () => {
  // Just trigger reactivity
}

const handleIdPhotoUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  uploadingIdPhoto.value = true

  try {
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      idPhotoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to upload photos')
      uploadingIdPhoto.value = false
      return
    }

    // Upload to Cloudinary
    console.log('📤 Uploading ID photo to Cloudinary...')
    const result = await uploadToCloudinary(file, {
      folder: 'merry360x/host-applications/id-photos',
      public_id: `${user.id}_id_${Date.now()}`,
      resource_type: 'image'
    })

    formData.idPhotoUrl = result.secure_url
    console.log('✅ ID photo uploaded:', result.secure_url)
    updateProgress()

  } catch (error) {
    console.error('ID photo upload error:', error)
    alert(`Failed to upload ID photo: ${error.message || 'Please try again.'}`)
    idPhotoPreview.value = ''
    formData.idPhotoUrl = ''
  } finally {
    uploadingIdPhoto.value = false
  }
}

const removeIdPhoto = () => {
  formData.idPhotoUrl = ''
  idPhotoPreview.value = ''
  if (idPhotoInput.value) {
    idPhotoInput.value.value = ''
  }
  updateProgress()
}

const handleBusinessCertUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    alert('Please upload an image (JPG, PNG) or PDF file')
    return
  }

  // Validate file size (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    alert('File size must be less than 10MB')
    return
  }

  uploadingBusinessCert.value = true

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to upload documents')
      uploadingBusinessCert.value = false
      return
    }

    console.log('📤 Uploading business certificate to Cloudinary...')
    const result = await uploadDocumentToCloudinary(file, {
      folder: 'merry360x/host-applications/business-certificates',
      maxSizeBytes: 10 * 1024 * 1024,
      timeoutMs: 60000
    })

    formData.businessCertUrl = result.secure_url
    businessCertPreview.value = result.secure_url
    console.log('✅ Business certificate uploaded:', result.secure_url)
    updateProgress()

  } catch (error) {
    console.error('Business cert upload error:', error)
    alert(`Failed to upload certificate: ${error.message || 'Please try again.'}`)
    businessCertPreview.value = ''
    formData.businessCertUrl = ''
  } finally {
    uploadingBusinessCert.value = false
  }
}

const removeBusinessCert = () => {
  formData.businessCertUrl = ''
  businessCertPreview.value = ''
  if (businessCertInput.value) {
    businessCertInput.value.value = ''
  }
  updateProgress()
}

const handleOwnerIdUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    alert('Please upload an image file')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB')
    return
  }

  uploadingOwnerIdPhoto.value = true

  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      ownerIdPreview.value = e.target.result
    }
    reader.readAsDataURL(file)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('Please log in to upload photos')
      uploadingOwnerIdPhoto.value = false
      return
    }

    console.log('📤 Uploading owner ID to Cloudinary...')
    const result = await uploadToCloudinary(file, {
      folder: 'merry360x/host-applications/owner-ids',
      public_id: `${user.id}_owner_id_${Date.now()}`,
      resource_type: 'image'
    })

    formData.ownerIdPhotoUrl = result.secure_url
    console.log('✅ Owner ID uploaded:', result.secure_url)
    updateProgress()

  } catch (error) {
    console.error('Owner ID upload error:', error)
    alert(`Failed to upload owner ID: ${error.message || 'Please try again.'}`)
    ownerIdPreview.value = ''
    formData.ownerIdPhotoUrl = ''
  } finally {
    uploadingOwnerIdPhoto.value = false
  }
}

const removeOwnerIdPhoto = () => {
  formData.ownerIdPhotoUrl = ''
  ownerIdPreview.value = ''
  if (ownerIdInput.value) {
    ownerIdInput.value.value = ''
  }
  updateProgress()
}

const handleSubmit = async () => {
  console.log('🔍 Host application submission started')
  console.log('Form valid:', isFormValid.value)
  console.log('Terms agreed:', formData.agreeToTerms)
  
  // Validate terms BEFORE setting isSubmitting
  if (!formData.agreeToTerms) {
    alert('Please agree to the terms and conditions')
    return
  }
  
  if (!isFormValid.value) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  console.log('📤 Starting submission process...')
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ User not authenticated')
      isSubmitting.value = false
      alert('Please log in to submit your application')
      router.push('/login')
      return
    }
    
    console.log('✅ User authenticated:', user.email)

    console.log('💾 Saving to database...')
    const profilePayload = {
      id: user.id,
      email: user.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      host_application_status: 'pending',
      host_application_date: new Date().toISOString(),
      host_nationality: formData.nationality,
      host_id_number: formData.idNumber,
      host_id_photo: formData.idPhotoUrl,
      host_application_details: {
        accountType: formData.accountType,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        hostingType: formData.hostingType,
        propertyLocation: formData.propertyLocation,
        price: formData.hostingType === 'accommodation' ? formData.price : null,
        description: formData.description,
        idPhotoUrl: formData.idPhotoUrl,
        // Business fields (if applicable)
        businessTin: formData.accountType === 'business' ? formData.businessTin : null,
        businessCertUrl: formData.accountType === 'business' ? formData.businessCertUrl : null,
        ownerIdNumber: formData.accountType === 'business' ? formData.ownerIdNumber : null,
        ownerIdPhotoUrl: formData.accountType === 'business' ? formData.ownerIdPhotoUrl : null
      }
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (error) {
      console.error('❌ Supabase error:', error)
      throw error
    }
    
    console.log('✅ Host application saved successfully!')
    alert('Application submitted successfully! We will review it and get back to you soon.')
    
    // Reset form
    Object.keys(formData).forEach(key => {
      if (key === 'agreeToTerms') {
        formData[key] = false
      } else if (key === 'price') {
        formData[key] = 0
      } else {
        formData[key] = ''
      }
    })
    idPhotoPreview.value = ''
    if (idPhotoInput.value) {
      idPhotoInput.value.value = ''
    }
    
    // Redirect to home
    router.push('/')
    
  } catch (error) {
    console.error('Host application error:', error)
    alert('Failed to submit application. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-bounce {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
