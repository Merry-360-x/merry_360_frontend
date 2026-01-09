<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-brand-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-8">
            <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <span class="text-brand-600 dark:text-brand-400 font-semibold text-sm">Become a Host</span>
            </div>
            <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
              Turn your space into an <span class="text-brand-600">income stream</span>
            </h1>
            <p class="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join Rwanda's premier travel platform. Apply to become a host and start listing your properties, tours, or transport services.
            </p>
          </div>
          
          <!-- Application Status Message -->
          <div v-if="hasPendingApplication" class="text-center max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12">
            <div class="mb-6">
              <div class="w-20 h-20 mx-auto mb-4 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-brand-600 dark:text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Application Under Review</h2>
              <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Your host application has been successfully submitted and is currently under review.
              </p>
              <p class="text-base text-gray-600 dark:text-gray-300 mt-4 font-medium">
                You will receive a notification within <span class="text-brand-600 dark:text-brand-400 font-bold">24-48 hours</span>.
              </p>
            </div>
            <router-link to="/profile" class="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all">
              Go to Profile
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </router-link>
          </div>
          
          <!-- CTA Button -->
          <div class="text-center" v-else-if="!showForm">
            <button @click="showForm = true" class="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105">
              Get Started
              <svg class="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Application Form -->
    <section ref="formSection" v-if="showForm && !hasPendingApplication" class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          
          <!-- Step 0: Choose Account Type -->
          <div v-if="currentStep === 0" class="animate-fade-in">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">Let's get started</h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">Are you applying as an individual or a business?</p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <!-- Individual Card -->
              <button type="button" @click="selectAccountType('individual')" class="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-left" :class="formData.applicantType === 'individual' ? 'border-brand-500 shadow-2xl' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'">
                <div class="absolute top-4 right-4">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.applicantType === 'individual' ? 'border-brand-500 bg-brand-500' : 'border-gray-300'">
                    <svg v-if="formData.applicantType === 'individual'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-brand-100 dark:bg-brand-900 rounded-2xl flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Individual</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">I'm hosting as an individual owner</p>
                </div>
              </button>

              <!-- Business Card -->
              <button type="button" @click="selectAccountType('business')" class="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 text-left" :class="formData.applicantType === 'business' ? 'border-brand-500 shadow-2xl' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'">
                <div class="absolute top-4 right-4">
                  <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all" :class="formData.applicantType === 'business' ? 'border-brand-500 bg-brand-500' : 'border-gray-300'">
                    <svg v-if="formData.applicantType === 'business'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div class="flex flex-col items-center text-center">
                  <div class="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center mb-4">
                    <svg class="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Business</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300">I'm hosting as a registered business</p>
                </div>
              </button>
            </div>

            <div class="text-center mt-12" v-if="formData.applicantType">
              <button type="button" @click="currentStep = 1" class="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-lg">
                Continue
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Bar -->
          <div v-if="currentStep > 0" class="mb-8">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium text-gray-600">Step {{ currentStep }} of {{ TOTAL_STEPS }}</span>
              <span class="text-sm font-semibold text-brand-600">{{ progress }}% Complete</span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div class="h-full bg-brand-500 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
            </div>
          </div>

          <!-- Form Card -->
          <div v-if="currentStep > 0" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form @submit.prevent="handleSubmit" novalidate>
              
              <!-- Step 1: Personal Information -->
              <div v-show="currentStep === 1" class="space-y-6">
                <div class="text-center mb-6">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Tell us about yourself</p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                    <input v-model="formData.firstName" type="text" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Enter your first name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                    <input v-model="formData.lastName" type="text" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Enter your last name" />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                  <input v-model="formData.email" type="email" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="your.email@example.com" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                  <input v-model="formData.phone" type="tel" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="+250 7XX XXX XXX" />
                </div>

                <!-- Password for new users -->
                <div v-if="!isAuthenticated">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Create Password *</label>
                  <input v-model="formData.password" type="password" required minlength="6" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Minimum 6 characters" />
                  <p class="text-xs text-gray-500 mt-1">This will be used to create your account</p>
                </div>
              </div>

              <!-- Step 2: Verification -->
              <div v-show="currentStep === 2" class="space-y-6">
                <div class="text-center mb-6">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ formData.applicantType === 'business' ? 'Business & ID Verification' : 'Identity Verification' }}</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ formData.applicantType === 'business' ? 'Provide your business and personal documents' : 'Provide your identification details' }}</p>
                </div>

                <!-- Business fields (only for business applicants) -->
                <template v-if="formData.applicantType === 'business'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Name *</label>
                    <input v-model="formData.businessName" type="text" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Your registered business name" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Identification Number (TIN) *</label>
                    <input v-model="formData.taxId" type="text" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Enter your TIN" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Business Registration Certificate *</label>
                    <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-brand-500 transition-colors">
                      <input type="file" @change="handleBusinessCertUpload" accept="image/*,.pdf" class="hidden" id="business-cert-upload" />
                      <label for="business-cert-upload" class="cursor-pointer">
                        <div v-if="!businessCertPreview" class="space-y-2">
                          <svg class="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                          </svg>
                          <p class="text-sm text-gray-600 dark:text-gray-300">Click to upload your business certificate</p>
                          <p class="text-xs text-gray-400">PNG, JPG or PDF up to 10MB</p>
                        </div>
                        <div v-else class="space-y-2">
                          <img v-if="businessCertPreview.startsWith('data:image')" :src="businessCertPreview" class="w-32 h-32 mx-auto object-cover rounded-lg" />
                          <div v-else class="flex items-center justify-center gap-2 text-brand-600">
                            <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd"></path>
                            </svg>
                            <span class="text-sm font-medium">PDF uploaded</span>
                          </div>
                          <p class="text-xs text-brand-600">Click to change</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </template>

                <!-- National ID (for both individual and business) -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">National ID Number *</label>
                  <input v-model="formData.idNumber" type="text" required class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent" placeholder="Enter your National ID number" />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">National ID Photo *</label>
                  <div class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-brand-500 transition-colors">
                    <input type="file" @change="handleIdPhotoUpload" accept="image/*" class="hidden" id="id-photo-upload" />
                    <label for="id-photo-upload" class="cursor-pointer">
                      <div v-if="!idPhotoPreview" class="space-y-2">
                        <svg class="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <p class="text-sm text-gray-600 dark:text-gray-300">Upload a clear photo of your National ID</p>
                        <p class="text-xs text-gray-400">PNG or JPG up to 10MB</p>
                      </div>
                      <div v-else class="space-y-2">
                        <img :src="idPhotoPreview" class="w-48 h-32 mx-auto object-cover rounded-lg" />
                        <p class="text-xs text-brand-600">Click to change</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Step 3: Payment Method -->
              <div v-show="currentStep === 3" class="space-y-6">
                <div class="text-center mb-6">
                  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">How would you like to receive your earnings?</p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method *</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button type="button" @click="formData.paymentMethod = 'mobile_money'" class="p-4 border-2 rounded-xl text-left transition-all" :class="formData.paymentMethod === 'mobile_money' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 dark:text-white">Mobile Money</p>
                          <p class="text-xs text-gray-500">MTN MoMo or Airtel Money</p>
                        </div>
                      </div>
                    </button>
                    <button type="button" @click="formData.paymentMethod = 'bank'" class="p-4 border-2 rounded-xl text-left transition-all" :class="formData.paymentMethod === 'bank' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300'">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                          </svg>
                        </div>
                        <div>
                          <p class="font-semibold text-gray-900 dark:text-white">Bank Account</p>
                          <p class="text-xs text-gray-500">Direct bank transfer</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <!-- Mobile Money Details -->
                <template v-if="formData.paymentMethod === 'mobile_money'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Money Provider *</label>
                    <select v-model="formData.mobileProvider" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500">
                      <option value="">Select provider</option>
                      <option value="mtn">MTN Mobile Money</option>
                      <option value="airtel">Airtel Money</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Money Number *</label>
                    <input v-model="formData.mobileNumber" type="tel" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="+250 7XX XXX XXX" />
                  </div>
                </template>

                <!-- Bank Details -->
                <template v-if="formData.paymentMethod === 'bank'">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bank Name *</label>
                    <input v-model="formData.bankName" type="text" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="e.g., Bank of Kigali" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Number *</label>
                    <input v-model="formData.bankAccountNumber" type="text" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="Enter your account number" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Account Holder Name *</label>
                    <input v-model="formData.bankAccountName" type="text" class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl focus:ring-2 focus:ring-brand-500" placeholder="Name as it appears on your account" />
                  </div>
                </template>

                <!-- Terms and Conditions -->
                <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" v-model="formData.agreeToTerms" class="mt-1 w-5 h-5 rounded border-gray-300 text-brand-600 focus:ring-brand-500" />
                    <span class="text-sm text-gray-600 dark:text-gray-300">
                      I agree to the <a href="#" class="text-brand-600 hover:underline">Terms of Service</a>, 
                      <a href="#" class="text-brand-600 hover:underline">Privacy Policy</a>, and 
                      <a href="#" class="text-brand-600 hover:underline">Host Agreement</a>.
                    </span>
                  </label>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button v-if="currentStep > 1" type="button" @click="previousStep" class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Back
                </button>
                <div v-else></div>
                
                <button v-if="currentStep < TOTAL_STEPS" type="button" @click="nextStep" class="px-8 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-colors flex items-center gap-2">
                  Continue
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </button>

                <!-- Luxury Submit Button with Progress -->
                <button 
                  v-else 
                  type="submit" 
                  :disabled="isSubmitting || !formData.agreeToTerms" 
                  class="relative px-8 py-3 min-w-[200px] overflow-hidden rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  :class="isSubmitting 
                    ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white cursor-wait' 
                    : formData.agreeToTerms 
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'"
                >
                  <!-- Progress Bar Background -->
                  <div 
                    v-if="isSubmitting"
                    class="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 transition-all duration-100 ease-out"
                    :style="{ width: `${submissionProgress}%` }"
                  >
                    <!-- Shimmer effect -->
                    <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  
                  <!-- Button Content -->
                  <span class="relative z-10 flex items-center gap-2">
                    <template v-if="isSubmitting">
                      <svg v-if="submissionProgress < 100" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span class="font-bold tabular-nums">{{ submissionProgress }}%</span>
                      <span v-if="submissionProgress < 100">Submitting...</span>
                      <span v-else>Complete!</span>
                    </template>
                    <template v-else>
                      Submit Application
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </template>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useToast } from '../../composables/useToast'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { uploadToCloudinary } from '../../services/cloudinary'

const router = useRouter()
const userStore = useUserStore()
const { success: showSuccess, error: showError } = useToast()

const TOTAL_STEPS = 3
const showForm = ref(false)
const currentStep = ref(0)
const isSubmitting = ref(false)
const submissionProgress = ref(0)
const hasPendingApplication = ref(false)
const formSection = ref(null)

// File previews
const idPhotoPreview = ref(null)
const businessCertPreview = ref(null)
const idPhotoFile = ref(null)
const businessCertFile = ref(null)

const isAuthenticated = computed(() => userStore.isAuthenticated)

const formData = reactive({
  applicantType: '', // 'individual' or 'business'
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  
  // Business fields
  businessName: '',
  taxId: '',
  
  // ID Verification
  idNumber: '',
  
  // Payment
  paymentMethod: '', // 'mobile_money' or 'bank'
  mobileProvider: '',
  mobileNumber: '',
  bankName: '',
  bankAccountNumber: '',
  bankAccountName: '',
  
  agreeToTerms: false
})

const progress = computed(() => {
  if (currentStep.value === 0) return 0
  return Math.round((currentStep.value / TOTAL_STEPS) * 100)
})

const selectAccountType = (type) => {
  formData.applicantType = type
}

const scrollToForm = () => {
  if (formSection.value) {
    formSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const nextStep = () => {
  if (validateCurrentStep()) {
    currentStep.value++
    scrollToForm()
  }
}

const previousStep = () => {
  currentStep.value--
  scrollToForm()
}

const validateCurrentStep = () => {
  if (currentStep.value === 1) {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim()) {
      showError('Please fill in all required fields')
      return false
    }
    if (!isAuthenticated.value && (!formData.password || formData.password.length < 6)) {
      showError('Please create a password (minimum 6 characters)')
      return false
    }
  } else if (currentStep.value === 2) {
    if (!formData.idNumber.trim() || !idPhotoFile.value) {
      showError('Please provide your National ID number and photo')
      return false
    }
    if (formData.applicantType === 'business') {
      if (!formData.businessName.trim() || !formData.taxId.trim() || !businessCertFile.value) {
        showError('Please provide all business details and certification')
        return false
      }
    }
  } else if (currentStep.value === 3) {
    if (!formData.paymentMethod) {
      showError('Please select a payment method')
      return false
    }
    if (formData.paymentMethod === 'mobile_money' && (!formData.mobileProvider || !formData.mobileNumber.trim())) {
      showError('Please provide your mobile money details')
      return false
    }
    if (formData.paymentMethod === 'bank' && (!formData.bankName.trim() || !formData.bankAccountNumber.trim() || !formData.bankAccountName.trim())) {
      showError('Please provide your bank account details')
      return false
    }
  }
  return true
}

const handleIdPhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    idPhotoFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      idPhotoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleBusinessCertUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    businessCertFile.value = file
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        businessCertPreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      businessCertPreview.value = 'pdf'
    }
  }
}

const uploadDocumentToCloudinary = async (file, folder) => {
  try {
    const result = await uploadToCloudinary(file, { folder })
    return result?.secure_url || result?.url || null
  } catch (err) {
    console.error('Cloudinary upload failed:', err)
    return null
  }
}

// Smooth progress animation helper
const animateProgress = (targetPercent, duration = 500) => {
  return new Promise((resolve) => {
    const startPercent = submissionProgress.value
    const diff = targetPercent - startPercent
    const startTime = Date.now()
    
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3)
      submissionProgress.value = Math.round(startPercent + diff * eased)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        resolve()
      }
    }
    animate()
  })
}

const handleSubmit = async (event) => {
  if (event) event.preventDefault()
  
  if (!formData.agreeToTerms) {
    showError('Please agree to the Terms and Conditions')
    return
  }
  
  if (!validateCurrentStep()) return
  
  isSubmitting.value = true
  submissionProgress.value = 0
  
  try {
    // Start progress animation (0% -> 15%)
    await animateProgress(15, 300)
    
    let userId = userStore.user?.id
    
    // Create account if not authenticated (15% -> 30%)
    if (!isAuthenticated.value) {
      await animateProgress(20, 200)
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone
          }
        }
      })
      
      if (authError) throw authError
      userId = authData.user?.id
      
      await animateProgress(30, 200)
      
      // Create profile
      await supabase.from('profiles').upsert({
        id: userId,
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        role: 'user',
        host_application_status: 'pending',
        host_application_date: new Date().toISOString()
      })
    }
    
    await animateProgress(35, 200)
    
    // Upload documents to Cloudinary (35% -> 65%)
    let idPhotoUrl = null
    let businessCertUrl = null
    
    if (idPhotoFile.value) {
      await animateProgress(45, 300)
      idPhotoUrl = await uploadDocumentToCloudinary(idPhotoFile.value, 'merry360x/host-documents/id-photos')
      await animateProgress(55, 200)
    } else {
      await animateProgress(55, 300)
    }
    
    if (businessCertFile.value) {
      await animateProgress(60, 200)
      businessCertUrl = await uploadDocumentToCloudinary(businessCertFile.value, 'merry360x/host-documents/business-certs')
      await animateProgress(70, 200)
    } else {
      await animateProgress(70, 300)
    }
    
    // Prepare payment details (70% -> 80%)
    await animateProgress(80, 200)
    
    const paymentDetails = formData.paymentMethod === 'mobile_money' 
      ? { method: 'mobile_money', provider: formData.mobileProvider, number: formData.mobileNumber }
      : { method: 'bank', bank_name: formData.bankName, account_number: formData.bankAccountNumber, account_name: formData.bankAccountName }
    
    // Insert host application (80% -> 95%)
    const applicationData = {
      user_id: userId,
      applicant_type: formData.applicantType,
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      id_number: formData.idNumber,
      id_photo_url: idPhotoUrl,
      business_name: formData.applicantType === 'business' ? formData.businessName : null,
      tax_id: formData.applicantType === 'business' ? formData.taxId : null,
      business_cert_url: formData.applicantType === 'business' ? businessCertUrl : null,
      payment_method: formData.paymentMethod,
      payment_details: paymentDetails,
      status: 'pending',
      created_at: new Date().toISOString()
    }
    
    await animateProgress(90, 200)
    
    const { error: insertError } = await supabase
      .from('host_applications')
      .insert(applicationData)
    
    if (insertError) {
      // If table doesn't exist, update profile instead
      await supabase
        .from('profiles')
        .update({
          host_application_status: 'pending',
          host_application_date: new Date().toISOString(),
          host_application_data: applicationData
        })
        .eq('id', userId)
    }
    
    // Complete! (95% -> 100%)
    await animateProgress(100, 400)
    
    // Brief pause to show 100%
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Update local state
    hasPendingApplication.value = true
    showSuccess('Your application has been submitted successfully!')
    
    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
  } catch (error) {
    console.error('Submission error:', error)
    showError(error.message || 'Failed to submit application. Please try again.')
    submissionProgress.value = 0
  } finally {
    isSubmitting.value = false
  }
}

// Check for existing pending application
const checkPendingApplication = async () => {
  if (!userStore.user?.id) return
  
  try {
    // Check host_applications table
    const { data: appData } = await supabase
      .from('host_applications')
      .select('status')
      .eq('user_id', userStore.user.id)
      .eq('status', 'pending')
      .single()
    
    if (appData) {
      hasPendingApplication.value = true
      return
    }
    
    // Also check profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('host_application_status')
      .eq('id', userStore.user.id)
      .single()
    
    if (profile?.host_application_status === 'pending') {
      hasPendingApplication.value = true
    }
  } catch (err) {
    // No pending application
  }
}

// Pre-fill form if authenticated
onMounted(async () => {
  await userStore.initAuth()
  
  if (userStore.user) {
    formData.firstName = userStore.user.firstName || ''
    formData.lastName = userStore.user.lastName || ''
    formData.email = userStore.user.email || ''
    formData.phone = userStore.user.phone || ''
  }
  
  await checkPendingApplication()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Luxury shimmer effect for progress bar */
.animate-shimmer {
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Tabular numbers for consistent width during counting */
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
