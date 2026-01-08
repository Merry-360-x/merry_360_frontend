<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-brand-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24 overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-brand-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-orange-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-5xl mx-auto">
          <div class="text-center mb-8">
            <div class="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
              <span class="text-brand-600 dark:text-brand-400 font-semibold text-sm">Become a Host</span>
          </div>
            <h1 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white leading-tight">
              Turn your space into an <span class="text-brand-600">income stream</span>
          </h1>
            <p class="text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join Rwanda's premier travel platform. List your accommodations, tours, or transport services and start earning today.
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
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Application Under Review
              </h2>
              <p class="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                Your host application has been successfully submitted and is currently under review.
              </p>
              <p class="text-base text-gray-600 dark:text-gray-300 mt-4 font-medium">
                You will receive a notification within <span class="text-brand-600 dark:text-brand-400 font-bold">24-48 hours</span> regarding the status of your application.
              </p>
            </div>
            <div class="mt-8">
              <router-link 
                to="/profile"
                class="inline-flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all"
              >
                Go to Profile
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </router-link>
            </div>
          </div>
          
          <!-- CTA Button -->
          <div class="text-center" v-else-if="!showForm">
          <button 
              @click="showForm = true"
              class="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105"
            >
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
    <section ref="formSection" v-if="showForm" class="py-16 bg-white dark:bg-gray-900">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-5xl mx-auto">
          
          <!-- Step 0: Choose Account Type (Individual vs Business) -->
          <div v-if="currentStep === 0" class="animate-fade-in">
            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Let's get started
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                First, tell us about yourself
              </p>
            </div>

            <div class="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <!-- Individual Card -->
              <button
                type="button"
                @click="selectAccountType('individual')"
                class="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                :class="formData.applicantType === 'individual' ? 'border-brand-500 shadow-2xl' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
              >
                <div class="absolute top-4 right-4">
                  <div 
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="formData.applicantType === 'individual' ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'"
                  >
                    <svg v-if="formData.applicantType === 'individual'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex flex-col items-center text-center">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Individual</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    I'm hosting as an individual owner
                  </p>
                  <ul class="text-left space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>Simple application process</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>Personal ID verification</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>Perfect for homeowners</span>
                    </li>
                  </ul>
                </div>
              </button>

              <!-- Business Card -->
              <button
                type="button"
                @click="selectAccountType('business')"
                class="group relative p-8 bg-white dark:bg-gray-800 rounded-3xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                :class="formData.applicantType === 'business' ? 'border-brand-500 shadow-2xl' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
              >
                <div class="absolute top-4 right-4">
                  <div 
                    class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all"
                    :class="formData.applicantType === 'business' ? 'border-brand-500 bg-brand-500' : 'border-gray-300 dark:border-gray-600'"
                  >
                    <svg v-if="formData.applicantType === 'business'" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <div class="flex flex-col items-center text-center">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">Business</h3>
                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    I'm hosting as a registered business
                  </p>
                  <ul class="text-left space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>Multiple listings allowed</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>Business verification</span>
                    </li>
                    <li class="flex items-start gap-1.5">
                      <span class="text-green-500 mt-0.5">•</span>
                      <span>For hotels & agencies</span>
                    </li>
                  </ul>
                </div>
              </button>
            </div>

            <div class="text-center mt-12" v-if="formData.applicantType">
              <button
                type="button"
                @click="currentStep = 1"
                class="inline-flex items-center gap-2 px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Continue
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Progress Bar (only show after step 0) -->
          <div v-if="currentStep > 0 || isSubmitting" class="mb-12">
            <div class="flex items-center justify-center gap-2 mb-4">
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">
                {{ isSubmitting ? 'Submitting Application...' : 'Application Progress' }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden relative">
              <div 
                class="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                :style="{ width: `${isSubmitting ? submissionProgress : progress}%` }"
              >
                <!-- Animated shimmer effect during submission -->
                <div 
                  v-if="isSubmitting && submissionProgress < 100"
                  class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                ></div>
              </div>
            </div>
            <div class="text-center mt-2">
              <span class="text-sm font-semibold text-brand-600 dark:text-brand-400">
                {{ isSubmitting ? `${submissionProgress}%` : `${progress}% Complete` }}
              </span>
            </div>
          </div>

          <div v-if="currentStep > 0" class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <div class="flex items-center justify-between max-w-3xl mx-auto">
              <!-- Step 1 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 1 ? 'bg-brand-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>1</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">Personal Info</span>
              </div>

              <!-- Connector Line 1 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 2 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 2 ? 'bg-brand-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 2" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>2</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">Verification</span>
              </div>

              <!-- Connector Line 2 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 3 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 3 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 3 ? 'bg-brand-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 3" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>3</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">Listing Type</span>
              </div>

              <!-- Connector Line 3 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 4 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 4 -->
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 4 ? 'bg-brand-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 4" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>4</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">Details</span>
              </div>

              <!-- Connector Line 4 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 5 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 5 -->
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 5 ? 'bg-brand-500 text-white shadow-lg' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 5" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>5</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">Submit</span>
              </div>
            </div>
          </div>

          <!-- Form Card -->
          <div v-if="currentStep > 0" class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden transition-colors duration-200">
            <form @submit.prevent="handleSubmit" @click.stop novalidate>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-0">
                <!-- Left: Guidance Panel -->
                <div class="lg:col-span-1 bg-gradient-to-br from-brand-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-8 lg:p-10">
                  <div class="sticky top-8">
                    <div class="inline-block px-4 py-1.5 bg-white dark:bg-gray-800 rounded-full mb-4">
                      <span class="text-sm font-bold text-brand-600 dark:text-brand-400">
                        Step {{ currentStep }} of {{ TOTAL_STEPS }}
                      </span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {{ stepMeta.title }}
                  </h3>
                    <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {{ stepMeta.description }}
                  </p>

                  <div v-if="stepMeta.checklist?.length" class="mt-8">
                      <p class="text-sm font-bold text-gray-900 dark:text-white mb-4">What you'll need:</p>
                      <ul class="space-y-3">
                        <li v-for="item in stepMeta.checklist" :key="item" class="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300">
                          <svg class="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                    </div>
                  </div>
                </div>

                <!-- Right: Inputs -->
                <div class="lg:col-span-2 p-8 lg:p-12">
                  <!-- Step 1: Personal Information -->
                  <div v-show="currentStep === 1" class="animate-fade-in">
                    <div class="space-y-5">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.firstName') }} *</label>
                          <input 
                            v-model="formData.firstName"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            :placeholder="t('hostApplication.placeholder.firstName')"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.lastName') }} *</label>
                          <input 
                            v-model="formData.lastName"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            :placeholder="t('hostApplication.placeholder.lastName')"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.emailAddress') }} *</label>
                          <input 
                            v-model="formData.email"
                            type="email" 
                            required
                            :disabled="isAuthenticated"
                            class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            :placeholder="t('hostApplication.placeholder.email')"
                          />
                          <p v-if="isAuthenticated" class="mt-1 text-xs text-gray-500">Logged in as: {{ formData.email }}</p>
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.phoneNumber') }} *</label>
                          <input 
                            v-model="formData.phone"
                            type="tel" 
                            required
                            class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            :placeholder="t('hostApplication.placeholder.phone')"
                          />
                        </div>
                      </div>

                      <!-- Password field for new users -->
                      <div v-if="!isAuthenticated" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">Create Password *</label>
                          <input 
                            v-model="formData.password"
                            type="password" 
                            required
                            minlength="6"
                            class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                            placeholder="Minimum 6 characters"
                          />
                          <p class="mt-1 text-xs text-gray-500">We'll create an account for you with this email and password</p>
                        </div>
                        <div class="flex items-center">
                          <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 w-full">
                            <p class="text-sm text-blue-800 dark:text-blue-200">
                              <strong>New to Merry360?</strong> We'll create your account automatically when you submit your application.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.address') }} *</label>
                        <input 
                          v-model="formData.address"
                          type="text" 
                          required
                          class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                          :placeholder="t('hostApplication.placeholder.address')"
                        />
                      </div>

                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.nationality') }} *</label>
                          <select
                            v-model="formData.nationality"
                            required
                          class="w-full px-4 py-3.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                          >
                            <option value="">{{ t('hostApplication.options.selectNationality') }}</option>
                            <option v-for="n in nationalityOptions" :key="n.value" :value="n.value">{{ n.label }}</option>
                          </select>
                        </div>

                        <div>
                        <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.hostingType') }} *</label>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <button
                            type="button"
                            @click="formData.hostingType = 'accommodation'"
                            class="p-4 border-2 rounded-xl transition-all"
                            :class="formData.hostingType === 'accommodation' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                          >
                            <div class="text-center">
                              <div class="font-semibold text-sm text-text-primary">{{ t('hostApplication.options.hostingAccommodation') }}</div>
                        </div>
                          </button>
                          <button
                            type="button"
                            @click="formData.hostingType = 'tour'"
                            class="p-4 border-2 rounded-xl transition-all"
                            :class="formData.hostingType === 'tour' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                          >
                            <div class="text-center">
                              <div class="font-semibold text-sm text-text-primary">{{ t('hostApplication.options.hostingTour') }}</div>
                      </div>
                          </button>
                          <button
                            type="button"
                            @click="formData.hostingType = 'transport'"
                            class="p-4 border-2 rounded-xl transition-all"
                            :class="formData.hostingType === 'transport' ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'"
                          >
                            <div class="text-center">
                              <div class="font-semibold text-sm text-text-primary">{{ t('hostApplication.options.hostingTransport') }}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 2: Verification -->
                  <div v-show="currentStep === 2" class="animate-fade-in">
                    <div class="space-y-4">
                      <div v-if="formData.applicantType === 'business'" class="space-y-4">
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.businessName') }} *</label>
                          <input 
                            v-model="formData.businessName"
                            type="text" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="t('hostApplication.placeholder.businessName')"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.taxId') }} *</label>
                          <input 
                            v-model="formData.taxId"
                            type="text" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="t('hostApplication.placeholder.taxId')"
                          />
                        </div>

                        <div>
                          <DocumentUpload
                            v-model="businessRegCertDoc"
                            :label="t('hostApplication.labels.businessRegistrationCertificate')"
                            :hint="t('hostApplication.uploadHintBusinessCert')"
                            accept="image/*,.pdf"
                          />
                        </div>
                      </div>

                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.idNumber') }} *</label>
                          <input
                            v-model="formData.idNumber"
                            type="text"
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="t('hostApplication.placeholder.idNumber')"
                          />
                        </div>

                        <div>
                          <DocumentUpload
                            v-model="idDocumentDoc"
                            :label="t('hostApplication.labels.uploadIdDocument')"
                            :hint="t('hostApplication.uploadHintId')"
                            accept="image/*,.pdf"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 3: Listing Basics -->
                  <div v-show="currentStep === 3" class="animate-fade-in">
                    <div class="space-y-4">
                      <!-- Amenities Selector -->
                      <AmenitiesSelector
                        v-if="formData.hostingType === 'accommodation'"
                        v-model="formData.amenities"
                        title="Tell guests what your place has to offer"
                        subtitle="You can add more amenities after you publish your listing."
                      />
                      
                      <!-- Property Details Counters -->
                      <PropertyDetails
                        v-if="formData.hostingType === 'accommodation'"
                        v-model="formData.propertyDetails"
                        title="Share some basics about your place"
                        subtitle="You'll add more details later, like bed types."
                        class="mt-8"
                      />

                      <!-- Location and Price (typed) -->
                      <div v-if="formData.hostingType === 'accommodation'" class="mt-8">
                        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                          <h3 class="text-lg font-bold text-text-primary mb-2">Where is your property located?</h3>
                          <p class="text-sm text-text-muted mb-6">Type the location now. You’ll pin it on the map later when adding the property from your dashboard.</p>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                              <input
                                v-model="formData.propertyLocation"
                                type="text"
                                required
                                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="e.g., Kigali, Kicukiro"
                              />
                            </div>

                            <div>
                              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nightly Price *</label>
                              <input
                                v-model.number="formData.price"
                                type="number"
                                min="1"
                                required
                                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="e.g., 50"
                              />
                            </div>

                            <div>
                              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Street Address (optional)</label>
                              <input
                                v-model="formData.propertyAddress"
                                type="text"
                                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                placeholder="e.g., KK 309 Street"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- Fallback for non-accommodation types -->
                      <div v-if="formData.hostingType !== 'accommodation'">
                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ listingLabels.locationLabel }} *</label>
                          <input 
                            v-model="formData.propertyLocation"
                            type="text" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="listingLabels.locationPlaceholder"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ listingLabels.capacityLabel }} *</label>
                          <input 
                            v-model="formData.capacity"
                            type="number" 
                            required
                            min="1"
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="listingLabels.capacityPlaceholder"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Step 4: Listing Details -->
                  <div v-show="currentStep === 4" class="animate-fade-in">
                    <div class="space-y-8">
                      <!-- Photo Uploader -->
                      <PhotoUploader
                        v-if="formData.hostingType === 'accommodation'"
                        v-model="formData.photos"
                        v-model:uploading="photosUploading"
                        title="Choose at least 5 photos"
                        subtitle="Drag to reorder"
                        :min-photos="5"
                        :max-photos="20"
                        folder="merry360x/host-applications"
                      />

                      <!-- Description -->
                      <div>
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ listingLabels.descriptionLabel }} *</label>
                        <textarea 
                          v-model="formData.description"
                          required
                          rows="5"
                          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                          :placeholder="listingLabels.descriptionPlaceholder"
                        ></textarea>
                      </div>

                      <!-- Fallback file upload for non-accommodation -->
                      <div v-if="formData.hostingType !== 'accommodation'">
                        <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ listingLabels.uploadLabel }}</label>
                        <input 
                          type="file"
                          @change="handleFileUpload"
                          multiple
                          accept="image/*,.pdf"
                          class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ listingLabels.uploadHint }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Step 5: Review & Submit -->
                  <div v-show="currentStep === 5" class="animate-fade-in">
                    <div class="space-y-6">
                      <!-- Terms and Conditions Text -->
                      <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700">
                        <h3 class="text-lg font-bold text-text-primary mb-3">Terms and Conditions</h3>
                        <div class="space-y-4 text-sm text-text-secondary">
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">1. Host Responsibilities</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>Provide accurate and truthful information about your property or service</li>
                              <li>Maintain the quality and standards described in your listing</li>
                              <li>Respond to guest inquiries within 24 hours</li>
                              <li>Honor confirmed bookings and availability calendars</li>
                              <li>Comply with local laws, regulations, and tax requirements</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">2. Listing Standards</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>Photos must accurately represent your property/service</li>
                              <li>Amenities listed must be available and functional</li>
                              <li>Pricing must be transparent with no hidden fees</li>
                              <li>Property must meet safety and cleanliness standards</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">3. Cancellation Policy</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>You must honor your chosen cancellation policy</li>
                              <li>Last-minute cancellations may result in penalties</li>
                              <li>Refunds are processed according to the cancellation policy</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">4. Payments and Fees</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>Merry360 charges a service fee on each booking</li>
                              <li>Payments are processed securely through our platform</li>
                              <li>You are responsible for applicable taxes</li>
                              <li>Payouts are made according to the payment schedule</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">5. Privacy and Data</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>Your personal information is protected under our Privacy Policy</li>
                              <li>Guest information must be kept confidential</li>
                              <li>We may use your listing for marketing purposes</li>
                            </ul>
                          </div>
                          
                          <div>
                            <h4 class="font-semibold text-text-primary mb-2">6. Account Termination</h4>
                            <ul class="list-disc list-inside space-y-1 ml-2">
                              <li>We reserve the right to suspend or terminate accounts for violations</li>
                              <li>Fraudulent activity will result in immediate termination</li>
                              <li>You may close your account at any time</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <!-- Agreement Checkbox -->
                      <div :class="[
                        'bg-white dark:bg-gray-900 rounded-lg p-4 border-2 transition-all',
                        formData.agreeToTerms 
                          ? 'border-brand-500 shadow-md' 
                          : 'border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20'
                      ]">
                        <label class="flex items-start gap-3 cursor-pointer">
                          <input 
                            v-model="formData.agreeToTerms"
                            type="checkbox" 
                            required
                            class="mt-1 w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500 focus:ring-2 cursor-pointer"
                          />
                          <span class="text-sm font-medium text-text-primary">
                            I have read and agree to Merry360's Terms and Conditions, Privacy Policy, and Host Guidelines. I understand that my application will be reviewed before approval. *
                          </span>
                        </label>
                        <p v-if="!formData.agreeToTerms" class="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                          ⚠️ You must agree to the terms and conditions to submit your application.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="lg:col-span-3 flex items-center justify-between px-8 lg:px-12 py-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    v-if="currentStep > 1"
                    type="button"
                    @click="previousStep"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all border border-gray-300 dark:border-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back
                  </button>
                  <button 
                    v-else-if="currentStep === 1"
                    type="button"
                    @click="currentStep = 0"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all border border-gray-300 dark:border-gray-600"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back
                  </button>
                  <div v-else></div>

                  <button 
                    v-if="currentStep < TOTAL_STEPS"
                    type="button"
                    @click="nextStep"
                    :disabled="currentStep === 4 && photosUploading"
                    class="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                  >
                    Next
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                  </button>
                  <button 
                    v-else
                    type="submit"
                    :disabled="isSubmitting || photosUploading"
                    @click="!formData.agreeToTerms ? handleTermsClick($event) : null"
                    :class="[
                      'group inline-flex items-center gap-3 px-10 py-4 font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl',
                      !formData.agreeToTerms 
                        ? 'bg-gray-400 hover:bg-gray-500 text-white' 
                        : 'bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white',
                      (isSubmitting || photosUploading) && 'disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed'
                    ]"
                  >
                    <span v-if="isSubmitting" class="flex items-center gap-3">
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                    <span v-else class="flex items-center gap-3">
                      <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Submit Application
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ t('hostApplication.benefits.title') }}</h2>
          <p class="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {{ t('hostApplication.benefits.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Benefit 1 -->
          <div class="bg-gradient-to-br from-brand-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('hostApplication.benefits.earnTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('hostApplication.benefits.earnDesc') }}
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-gradient-to-br from-orange-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('hostApplication.benefits.secureTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('hostApplication.benefits.secureDesc') }}
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-gradient-to-br from-red-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mb-4">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">{{ t('hostApplication.benefits.reachTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('hostApplication.benefits.reachDesc') }}
            </p>
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
import AmenitiesSelector from '../../components/host/AmenitiesSelector.vue'
import PropertyDetails from '../../components/host/PropertyDetails.vue'
import PhotoUploader from '../../components/host/PhotoUploader.vue'
import DocumentUpload from '../../components/host/DocumentUpload.vue'
// Map is selected later when creating a property in dashboard.
import { supabase, uploadFile } from '../../services/supabase'
import { uploadDocumentToCloudinary } from '../../services/cloudinary'
import { useTranslation } from '@/composables/useTranslation'
import { useToast } from '@/composables/useToast'
import { useUserStore } from '@/stores/userStore'
import isoCountries from 'i18n-iso-countries'
import enIsoCountries from 'i18n-iso-countries/langs/en.json'
import worldCountries from 'world-countries'

const router = useRouter()
const { t } = useTranslation()
const { error: showToastError, success: showToastSuccess } = useToast()
const userStore = useUserStore()
const formSection = ref(null)
const isSubmitting = ref(false)
const submissionProgress = ref(0)
const currentStep = ref(0)
const showForm = ref(false)
const isAuthenticated = ref(false)
const hasPendingApplication = ref(false)
const applicationStatus = ref(null)

// Check authentication status and application status on mount
onMounted(async () => {
  isSubmitting.value = false
  photosUploading.value = false
  submissionProgress.value = 0
  
  // Check if user is authenticated
  try {
    const { data: { user } } = await supabase.auth.getUser()
    isAuthenticated.value = !!user
    if (user && formData.email === '') {
      // Pre-fill email if user is logged in
      formData.email = user.email || ''
    }
    
    // Check if user has already submitted an application
    if (user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('host_application_status, host_application_date')
        .eq('id', user.id)
        .single()
      
      if (!error && profile) {
        applicationStatus.value = profile.host_application_status
        if (profile.host_application_status === 'pending') {
          hasPendingApplication.value = true
        } else if (profile.host_application_status === 'approved') {
          // User is already approved, they can access host dashboard
          hasPendingApplication.value = false
        } else if (profile.host_application_status === 'rejected') {
          // User was rejected, allow them to apply again
          hasPendingApplication.value = false
        }
      }
    }
  } catch (error) {
    console.log('User not authenticated, allowing application as new user')
    isAuthenticated.value = false
  }
})

const TOTAL_STEPS = 5 // Steps 1-5 after account type selection

const selectAccountType = (type) => {
  formData.applicantType = type
}

isoCountries.registerLocale(enIsoCountries)

const fallbackNationalities = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi',
  'Cabo Verde','Cambodia','Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (Congo-Brazzaville)','Costa Rica','Côte d’Ivoire','Croatia','Cuba','Cyprus','Czechia',
  'Democratic Republic of the Congo','Denmark','Djibouti','Dominica','Dominican Republic',
  'Ecuador','Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia',
  'Fiji','Finland','France',
  'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana',
  'Haiti','Honduras','Hungary',
  'Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Jamaica','Japan','Jordan',
  'Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
  'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg',
  'Madagascar','Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar',
  'Namibia','Nauru','Nepal','Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway',
  'Oman',
  'Pakistan','Palau','Palestine State','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal',
  'Qatar',
  'Romania','Russia','Rwanda',
  'Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria',
  'Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu',
  'Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan',
  'Vanuatu','Vatican City','Venezuela','Vietnam',
  'Yemen',
  'Zambia','Zimbabwe'
]

const nationalityOptions = computed(() => {
  try {
    const namesByIso2 = isoCountries.getNames('en', { select: 'official' })
    const options = Object.entries(namesByIso2)
      .map(([cca2, countryName]) => {
        const match = worldCountries.find((c) => c.cca2 === cca2)
        const demonym = match?.demonyms?.eng?.m
        const label = demonym || countryName
        return { value: label, label }
      })

    // Ensure unique list (some demonyms may repeat)
    const unique = new Map(options.map((o) => [o.value, o]))
    return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label))
  } catch (e) {
    const unique = new Map(fallbackNationalities.map((n) => [n, { value: n, label: n }]))
    return Array.from(unique.values()).sort((a, b) => a.label.localeCompare(b.label))
  }
})

const stepMeta = computed(() => {
  if (currentStep.value === 1) {
    return {
      title: t('hostApplication.stepTitles.personalInformation'),
      description: t('hostApplication.layout.personalInfoDesc'),
      checklist: []
    }
  }

  if (currentStep.value === 2) {
    const base = {
      title: t('hostApplication.stepTitles.verification'),
      description:
        formData.applicantType === 'business'
          ? t('hostApplication.layout.verificationBusinessDesc')
          : t('hostApplication.layout.verificationIndividualDesc')
    }

    const checklist =
      formData.applicantType === 'business'
        ? [
            t('hostApplication.labels.businessName'),
            t('hostApplication.labels.taxId'),
            t('hostApplication.labels.businessRegistrationCertificate'),
            t('hostApplication.labels.idNumber'),
            t('hostApplication.labels.uploadIdDocument')
          ]
        : [t('hostApplication.labels.idNumber'), t('hostApplication.labels.uploadIdDocument')]

    return { ...base, checklist }
  }

  const listingDescKey =
    formData.hostingType === 'tour'
      ? 'hostApplication.layout.listingTourDesc'
      : formData.hostingType === 'transport'
        ? 'hostApplication.layout.listingTransportDesc'
        : formData.hostingType === 'service'
          ? 'hostApplication.layout.listingServiceDesc'
          : 'hostApplication.layout.listingAccommodationDesc'

  if (currentStep.value === 3) {
    return {
      title: listingStepLabels.value.step3Title,
      description: t(listingDescKey),
      checklist: [listingLabels.value.locationLabel, listingLabels.value.capacityLabel]
    }
  }

  if (currentStep.value === 4) {
    return {
      title: listingStepLabels.value.step4Title,
      description: t('hostApplication.layout.listingDetailsDesc'),
      checklist: [listingLabels.value.descriptionLabel, listingLabels.value.uploadLabel]
    }
  }

  return {
    title: t('hostApplication.stepTitles.reviewSubmit'),
    description: t('hostApplication.layout.reviewSubmitDesc'),
    checklist: [t('hostApplication.layout.termsChecklist')]
  }
})

const listingLabels = computed(() => {
  const type = formData.hostingType
  if (type === 'tour') {
    return {
      locationLabel: t('hostApplication.labels.listingLocationTour'),
      locationPlaceholder: t('hostApplication.placeholder.listingLocationTour'),
      capacityLabel: t('hostApplication.labels.listingCapacityTour'),
      capacityPlaceholder: t('hostApplication.placeholder.listingCapacityTour'),
      descriptionLabel: t('hostApplication.labels.listingDescriptionTour'),
      descriptionPlaceholder: t('hostApplication.placeholder.listingDescriptionTour'),
      uploadLabel: t('hostApplication.labels.uploadListingMediaTour'),
      uploadHint: t('hostApplication.uploadHintListingMediaTour')
    }
  }

  if (type === 'transport') {
    return {
      locationLabel: t('hostApplication.labels.listingLocationTransport'),
      locationPlaceholder: t('hostApplication.placeholder.listingLocationTransport'),
      capacityLabel: t('hostApplication.labels.listingCapacityTransport'),
      capacityPlaceholder: t('hostApplication.placeholder.listingCapacityTransport'),
      descriptionLabel: t('hostApplication.labels.listingDescriptionTransport'),
      descriptionPlaceholder: t('hostApplication.placeholder.listingDescriptionTransport'),
      uploadLabel: t('hostApplication.labels.uploadListingMediaTransport'),
      uploadHint: t('hostApplication.uploadHintListingMediaTransport')
    }
  }

  if (type === 'service') {
    return {
      locationLabel: t('hostApplication.labels.listingLocationService'),
      locationPlaceholder: t('hostApplication.placeholder.listingLocationService'),
      capacityLabel: t('hostApplication.labels.listingCapacityService'),
      capacityPlaceholder: t('hostApplication.placeholder.listingCapacityService'),
      descriptionLabel: t('hostApplication.labels.listingDescriptionService'),
      descriptionPlaceholder: t('hostApplication.placeholder.listingDescriptionService'),
      uploadLabel: t('hostApplication.labels.uploadListingMediaService'),
      uploadHint: t('hostApplication.uploadHintListingMediaService')
    }
  }

  return {
    locationLabel: t('hostApplication.labels.listingLocationAccommodation'),
    locationPlaceholder: t('hostApplication.placeholder.listingLocationAccommodation'),
    capacityLabel: t('hostApplication.labels.listingCapacityAccommodation'),
    capacityPlaceholder: t('hostApplication.placeholder.listingCapacityAccommodation'),
    descriptionLabel: t('hostApplication.labels.listingDescriptionAccommodation'),
    descriptionPlaceholder: t('hostApplication.placeholder.listingDescriptionAccommodation'),
    uploadLabel: t('hostApplication.labels.uploadListingMediaAccommodation'),
    uploadHint: t('hostApplication.uploadHintListingMediaAccommodation')
  }
})

const listingStepLabels = computed(() => {
  const type = formData.hostingType

  const step3Key =
    type === 'tour'
      ? 'hostApplication.steps.listingBasicsTour'
      : type === 'transport'
        ? 'hostApplication.steps.listingBasicsTransport'
        : type === 'service'
          ? 'hostApplication.steps.listingBasicsService'
          : type === 'accommodation'
            ? 'hostApplication.steps.listingBasicsAccommodation'
            : 'hostApplication.steps.listingBasics'

  const step4Key =
    type === 'tour'
      ? 'hostApplication.steps.listingDetailsTour'
      : type === 'transport'
        ? 'hostApplication.steps.listingDetailsTransport'
        : type === 'service'
          ? 'hostApplication.steps.listingDetailsService'
          : type === 'accommodation'
            ? 'hostApplication.steps.listingDetailsAccommodation'
            : 'hostApplication.steps.listingDetails'

  const step3TitleKey =
    type === 'tour'
      ? 'hostApplication.stepTitles.listingBasicsTour'
      : type === 'transport'
        ? 'hostApplication.stepTitles.listingBasicsTransport'
        : type === 'service'
          ? 'hostApplication.stepTitles.listingBasicsService'
          : type === 'accommodation'
            ? 'hostApplication.stepTitles.listingBasicsAccommodation'
            : 'hostApplication.stepTitles.listingBasics'

  const step4TitleKey =
    type === 'tour'
      ? 'hostApplication.stepTitles.listingDetailsTour'
      : type === 'transport'
        ? 'hostApplication.stepTitles.listingDetailsTransport'
        : type === 'service'
          ? 'hostApplication.stepTitles.listingDetailsService'
          : type === 'accommodation'
            ? 'hostApplication.stepTitles.listingDetailsAccommodation'
            : 'hostApplication.stepTitles.listingDetails'

  return {
    step3: t(step3Key),
    step4: t(step4Key),
    step3Title: t(step3TitleKey),
    step4Title: t(step4TitleKey)
  }
})

const formData = reactive({
  // Step 1: Personal Info
  firstName: '',
  lastName: '',
  email: '',
  password: '', // For new users to create account
  phone: '',
  address: '',
  nationality: '',
  applicantType: '',
  idNumber: '',
  
  // Step 2: Business Info
  businessName: '',
  taxId: '',
  
  // Step 3: Property Details
  hostingType: '',
  propertyLocation: '',
  capacity: '',
  description: '',
  agreeToTerms: false,
  
  // New fields for Airbnb-style flow
  amenities: [],
  propertyDetails: { guests: 4, bedrooms: 1, beds: 1, bathrooms: 1 },
  photos: [],
  location: { lat: null, lng: null },
  price: 0,
  propertyAddress: ''
})

const uploadedFiles = ref([])
const idDocumentDoc = ref(null)
const businessRegCertDoc = ref(null)
const photosUploading = ref(false)

const scrollToForm = () => {
  if (formSection.value) {
    formSection.value.scrollIntoView({ behavior: 'smooth' })
  } else {
    // If form section doesn't exist yet, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const progress = computed(() => {
  if (currentStep.value === 0) return 0
  return Math.round((currentStep.value / TOTAL_STEPS) * 100)
})

const nextStep = () => {
  if (currentStep.value === 4 && photosUploading.value) {
    alert('Please wait for your photo uploads to finish.')
    return
  }
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.nationality || !formData.hostingType) {
      alert(t('hostApplication.validation.step1Required'))
      return false
    }
    // Require password for new users
    if (!isAuthenticated.value && (!formData.password || formData.password.length < 6)) {
      alert('Please create a password (minimum 6 characters) to create your account.')
      return false
    }
  } else if (currentStep.value === 2) {
    if (!formData.idNumber || !idDocumentDoc.value) {
      alert(t('hostApplication.validation.step2Required'))
      return false
    }

    if (formData.applicantType === 'business') {
      if (!formData.businessName || !formData.taxId || !businessRegCertDoc.value) {
        alert(t('hostApplication.validation.step2Required'))
        return false
      }
    }
  } else if (currentStep.value === 3) {
    // Step 3 validation - only check required fields when clicking Next
    // Don't block user from selecting amenities/property details
    if (formData.hostingType === 'accommodation') {
      const price = Number(formData.price)
      const locationText = String(formData.propertyLocation || '').trim()
      const hasPrice = Number.isFinite(price) && price > 0

      if (!locationText || !hasPrice) {
        showToastError('Please fill in the location and price fields before proceeding to the next step.')
        return false
      }
    } else {
      if (!formData.propertyLocation || !formData.capacity) {
        showToastError('Please fill in the location and capacity fields before proceeding to the next step.')
        return false
      }
    }
  } else if (currentStep.value === 4) {
    if (!formData.description) {
      alert(t('hostApplication.validation.step4Required'))
      return false
    }
    
    // For accommodation, require at least 5 photos
    if (formData.hostingType === 'accommodation') {
      if (!formData.photos || formData.photos.length < 5) {
        alert('Please upload at least 5 photos of your accommodation.')
        return false
      }
    }
  }
  return true
}

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files)
}

const uploadHostDocument = async (userId, kind, file) => {
  const bucket = import.meta.env.VITE_HOST_DOCUMENTS_BUCKET || 'host-documents'
  const originalName = file?.name || ''
  const ext = originalName.includes('.') ? originalName.split('.').pop() : ''
  const safeExt = ext ? `.${ext.toLowerCase()}` : ''
  const path = `host-applications/${userId}/${kind}-${Date.now()}${safeExt}`

  // Prefer Supabase Storage (private bucket recommended). If bucket/policies are not set up,
  // fall back to Cloudinary to avoid blocking host registration.
  try {
    await uploadFile(bucket, path, file)
    return `${bucket}:${path}`
  } catch (err) {
    console.error('Supabase storage upload failed for host document:', {
      bucket,
      path,
      message: err?.message,
      status: err?.status,
      name: err?.name
    })

    try {
      const result = await uploadDocumentToCloudinary(file, { folder: 'merry360x/host-documents' })
      return result?.secure_url || result?.url || null
    } catch (cloudErr) {
      console.error('Cloudinary fallback upload failed for host document:', {
        message: cloudErr?.message,
        name: cloudErr?.name
      })
      throw err
    }
  }
}

const handleTermsClick = (event) => {
  // Prevent form submission
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  // Scroll to checkbox and highlight it
  const checkboxContainer = document.querySelector('.bg-white.dark\\:bg-gray-900.rounded-lg.p-4.border-2')
  if (checkboxContainer) {
    checkboxContainer.scrollIntoView({ behavior: 'smooth', block: 'center' })
    // Add a brief highlight animation
    checkboxContainer.classList.add('animate-pulse', 'ring-4', 'ring-red-300')
    setTimeout(() => {
      checkboxContainer.classList.remove('animate-pulse', 'ring-4', 'ring-red-300')
    }, 2000)
    
    // Focus the checkbox
    const checkbox = checkboxContainer.querySelector('input[type="checkbox"]')
    if (checkbox) {
      checkbox.focus()
    }
  }
  
  showToastError('Please check the box above to agree to the Terms and Conditions before submitting.')
}

const handleSubmit = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  
  // Only allow submission on the final step (step 5)
  if (currentStep.value !== TOTAL_STEPS) {
    // Don't auto-advance - user must click Next button to proceed through steps
    showToastError('Please complete all steps and click "Next" to proceed. You are currently on step ' + currentStep.value + ' of ' + TOTAL_STEPS + '.')
    return
  }
  
  // Validate terms BEFORE setting isSubmitting to avoid button getting stuck
  // Only check this on the final step (step 5) where terms are shown
  if (!formData.agreeToTerms) {
    handleTermsClick()
    return
  }
  
  // Validate photos for accommodation type
  if (formData.hostingType === 'accommodation') {
    if (!formData.photos || formData.photos.length < 5) {
      alert('Please upload at least 5 photos of your accommodation before submitting.')
      return
    }
  }
  
  // Check if photos are still uploading
  if (photosUploading.value) {
    alert('Please wait for photo uploads to finish before submitting.')
    return
  }

  isSubmitting.value = true
  submissionProgress.value = 0
  
  // Animate progress bar
  const progressInterval = setInterval(() => {
    if (submissionProgress.value < 90) {
      submissionProgress.value += 10
    }
  }, 200)
  
  try {
    // Get current user or create account for new users
    let user
    let userId
    
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    
    if (!currentUser) {
      // New user - create account first
      console.log('📝 Creating account for new user...')
      
      if (!formData.password || formData.password.length < 6) {
        alert('Please create a password (minimum 6 characters) to create your account.')
      isSubmitting.value = false
        return
      }
      
      // Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone
          }
        }
      })
      
      if (signUpError) {
        console.error('❌ Sign up error:', signUpError)
        if (signUpError.message.includes('already registered')) {
          alert('An account with this email already exists. Please log in first, then apply to become a host.')
      router.push('/login')
        } else {
          alert('Failed to create account: ' + signUpError.message)
        }
        isSubmitting.value = false
      return
    }
    
      if (!authData.user) {
        alert('Account creation failed. Please try again.')
        isSubmitting.value = false
        return
      }
      
      user = authData.user
      userId = authData.user.id
      
      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          role: 'user',
          loyalty_points: 0,
          loyalty_tier: 'bronze',
          created_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.warn('Profile creation warning:', profileError)
        // Continue anyway - profile might be created by trigger
      }
      
      console.log('✅ Account created successfully:', user.email)
    } else {
      // Existing user
      user = currentUser
      userId = currentUser.id
    console.log('✅ User authenticated:', user.email)
    }

    // Upload required documents (store storage paths, not public URLs)
    let idDocumentPath = null
    let businessRegCertPath = null

    console.log('📄 Uploading documents...')
    console.log('ID doc:', idDocumentDoc.value?.file?.name)
    console.log('Business cert:', businessRegCertDoc.value?.file?.name)

    try {
      if (idDocumentDoc.value?.file) {
        console.log('⬆️ Uploading ID document...')
        idDocumentPath = await uploadHostDocument(userId, 'id-document', idDocumentDoc.value.file)
        console.log('✅ ID document uploaded:', idDocumentPath)
      }

      if (formData.applicantType === 'business' && businessRegCertDoc.value?.file) {
        console.log('⬆️ Uploading business certificate...')
        businessRegCertPath = await uploadHostDocument(userId, 'business-registration-certificate', businessRegCertDoc.value.file)
        console.log('✅ Business cert uploaded:', businessRegCertPath)
      }
    } catch (uploadErr) {
      console.error('❌ Host document upload error:', uploadErr)
      isSubmitting.value = false
      alert(t('hostApplication.validation.uploadFailed'))
      return
    }

    console.log('💾 Saving to database...')
    
    // Extract photo URLs from formData.photos
    const photoUrls = Array.isArray(formData.photos) 
      ? formData.photos.map(img => img.url || img.preview || img).filter(Boolean)
      : []
    console.log('📷 Photos to save:', photoUrls.length, photoUrls)
    
    const profilePayload = {
      id: userId,
      email: user.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      host_application_status: 'pending',
      host_application_date: new Date().toISOString(),

      // Extended host-application fields
      host_applicant_type: formData.applicantType,
      host_nationality: formData.nationality,
      host_id_number: formData.idNumber,
      host_id_document_path: idDocumentPath,
      host_business_name: formData.applicantType === 'business' ? formData.businessName : null,
      host_business_tax_number: formData.applicantType === 'business' ? formData.taxId : null,
      host_business_registration_certificate_path: formData.applicantType === 'business' ? businessRegCertPath : null,
      host_application_details: {
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
        hostingType: formData.hostingType,
        // Listing basics
        propertyLocation: formData.propertyLocation || null,
        capacity: formData.hostingType === 'accommodation' ? null : formData.capacity,

        // Accommodation listing basics
        amenities: formData.hostingType === 'accommodation' ? (formData.amenities || []) : null,
        propertyDetails: formData.hostingType === 'accommodation' ? (formData.propertyDetails || null) : null,
        location: null,
        price: formData.hostingType === 'accommodation' ? (formData.price || 0) : null,
        propertyAddress: formData.hostingType === 'accommodation' ? (formData.propertyAddress || '') : null,
        description: formData.description,
        photos: photoUrls, // Include photos array
        additionalFilesCount: uploadedFiles.value?.length || 0
      }
    }

    // Add timeout protection with proper error handling
    console.log('📤 Upserting profile with payload:', JSON.stringify(profilePayload, null, 2))
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout - please try again')), 30000)
    )

    let result
    try {
      const upsertPromise = supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })
        .select()
      
      result = await Promise.race([upsertPromise, timeoutPromise])
      console.log('📥 Upsert result:', result)
    } catch (raceError) {
      console.error('❌ Promise race error:', raceError)
      if (raceError?.message?.includes('timeout') || raceError?.message?.includes('Request timeout')) {
        console.error('⏱️ Request timed out after 30 seconds')
        throw new Error('Request timeout - please try again')
      }
      throw raceError
    }

    // Check for errors in the result
    if (!result) {
      console.error('❌ No result returned from upsert')
      throw new Error('No response from server. Please try again.')
    }

    const { data, error } = result

    if (error) {
      console.error('❌ Supabase error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      let errorMessage = t('hostApplication.submittedFailed')
      if (error?.message?.includes('timeout')) {
        errorMessage = 'Request timeout - please try again'
      } else if (error?.message?.includes('permission') || error?.message?.includes('denied') || error?.message?.includes('RLS') || error?.code === '42501') {
        errorMessage = 'You do not have permission to submit host applications. Please contact support.'
      } else if (error?.code === '23505') {
        errorMessage = 'Application already exists. Please contact support.'
      } else if (error?.code === '42703') {
        errorMessage = 'Database schema error. Please contact support.'
      } else if (error.message) {
        errorMessage = error.message
      } else if (error.hint) {
        errorMessage = error.hint
      }
      
      showToastError(errorMessage)
      isSubmitting.value = false
      return
    }

    // Verify data was saved
    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.warn('⚠️ Upsert returned no data, but no error. Checking if profile exists...')
      // Try to fetch the profile to verify it was saved
      const { data: verifyData, error: verifyError } = await supabase
        .from('profiles')
        .select('id, host_application_status')
        .eq('id', userId)
        .single()
      
      if (verifyError || !verifyData) {
        console.error('❌ Could not verify profile was saved:', verifyError)
        throw new Error('Failed to save application. Please try again.')
      }
      
      if (verifyData.host_application_status !== 'pending') {
        console.warn('⚠️ Profile exists but status is not pending:', verifyData.host_application_status)
        // Try to update it again
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            host_application_status: 'pending',
            host_application_date: new Date().toISOString()
          })
          .eq('id', userId)
        
        if (updateError) {
          console.error('❌ Failed to update profile status:', updateError)
          throw new Error('Failed to update application status. Please contact support.')
        }
      }
    }
    
    console.log('✅ Host application saved successfully!', data)
    
    // Complete progress bar to 100%
    clearInterval(progressInterval)
    submissionProgress.value = 100
    
    // Update user store if new account was created
    if (!currentUser) {
      console.log('🔄 Initializing user store for new user...')
      try {
        await userStore.initAuth()
        console.log('✅ User store initialized')
      } catch (storeError) {
        console.warn('⚠️ User store init warning:', storeError)
        // Continue anyway - user is created
      }
    }
    
    // Update application status
    hasPendingApplication.value = true
    applicationStatus.value = 'pending'
    
    console.log('🎉 Application submitted successfully!')
    showToastSuccess('Application submitted successfully! Your application is now under review.')
    
    // Small delay to show success message and progress completion
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    currentStep.value = 0
    showForm.value = false
    Object.keys(formData).forEach(key => {
      if (key === 'agreeToTerms') {
        formData[key] = false
      } else if (key === 'photos') {
        formData[key] = []
      } else if (key === 'propertyDetails') {
        formData[key] = { guests: 4, bedrooms: 1, beds: 1, bathrooms: 1 }
      } else if (key === 'amenities') {
        formData[key] = []
      } else if (key === 'password') {
        formData[key] = '' // Clear password
      } else {
        formData[key] = ''
      }
    })

    idDocumentDoc.value = null
    businessRegCertDoc.value = null
    uploadedFiles.value = []
    
    // Reset form and hide it to show the review message
    currentStep.value = 0
    showForm.value = false
    
    // Scroll to top to show the review message
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    // Don't redirect - show the review message on the same page
    // This avoids the host privileges error
    
  } catch (error) {
    // Clear progress interval on error
    if (progressInterval) clearInterval(progressInterval)
    submissionProgress.value = 0
    
    console.error('❌ Host application error:', error)
    console.error('Error stack:', error?.stack)
    console.error('Error name:', error?.name)
    console.error('Error cause:', error?.cause)
    
    let errorMessage = t('hostApplication.submittedFailed')
    if (error?.message) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    }
    
    if (errorMessage.includes('timeout')) {
      errorMessage = 'The request is taking too long. Please check your internet connection and try again.'
    } else if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      errorMessage = 'Network error. Please check your internet connection and try again.'
    } else if (!errorMessage || errorMessage === t('hostApplication.submittedFailed')) {
      errorMessage = 'Failed to submit application. Please try again or contact support if the problem persists.'
    }
    
    showToastError(errorMessage)
    console.error('❌ Final error message shown to user:', errorMessage)
  } finally {
    isSubmitting.value = false
    console.log('🏁 Submission process finished. isSubmitting set to false.')
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
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

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>
