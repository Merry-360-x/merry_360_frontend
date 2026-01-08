<template>
  <MainLayout>
    <!-- Merry360 Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-orange-600 dark:from-brand-700 dark:via-brand-800 dark:to-orange-800 py-20 md:py-28">
      <!-- Animated Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-10 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div class="absolute top-20 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>
      
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">
          <div class="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold animate-fade-in-down">
            🌟 Join Merry360 Host Community
          </div>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white animate-fade-in-up">
            Start Earning with<br/>
            <span class="text-yellow-300">Merry360</span>
          </h1>
          <p class="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            List your property, tour, or transport service and reach thousands of travelers across Rwanda
          </p>
          <button 
            @click="scrollToForm"
            class="group px-10 py-4 bg-white hover:bg-yellow-50 text-brand-600 font-bold rounded-2xl text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:scale-105 animate-fade-in-up animation-delay-400"
          >
            <span class="flex items-center gap-3">
              Begin Your Journey
              <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Application Form Section -->
    <section ref="formSection" class="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          
          <!-- Progress Steps -->
          <div class="mb-12">
            <div class="flex items-center justify-between relative">
              <!-- Progress Bar Background -->
              <div class="absolute top-6 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <!-- Active Progress Bar -->
              <div 
                class="absolute top-6 left-0 h-1 bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500 ease-out"
                :style="{ width: ((currentStep - 1) / (TOTAL_STEPS - 1)) * 100 + '%' }"
              ></div>
              
              <!-- Steps -->
              <div 
                v-for="step in TOTAL_STEPS" 
                :key="step"
                class="relative flex flex-col items-center z-10"
                :class="step === TOTAL_STEPS ? 'ml-auto' : ''"
              >
                <div 
                  class="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-300 transform"
                  :class="[
                    currentStep >= step 
                      ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-lg scale-110' 
                      : 'bg-white dark:bg-gray-800 text-gray-400 shadow',
                    currentStep === step ? 'ring-4 ring-brand-200 dark:ring-brand-900 animate-pulse-slow' : ''
                  ]"
                >
                  <svg v-if="currentStep > step" class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else class="text-xl">{{ step }}</span>
                </div>
                <span 
                  class="mt-3 text-xs md:text-sm font-medium text-center max-w-[80px] transition-colors duration-300"
                  :class="currentStep >= step ? 'text-brand-600 dark:text-brand-400 font-semibold' : 'text-gray-500'"
                >
                  {{ getStepLabel(step) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Form Card with Merry360 Design -->
          <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
            <!-- Step Header -->
            <div class="bg-gradient-to-r from-brand-500 to-brand-600 px-8 py-6">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-white/80 text-sm font-medium mb-1">
                    Step {{ currentStep }} of {{ TOTAL_STEPS }}
                  </p>
                  <h3 class="text-2xl md:text-3xl font-bold text-white">
                    {{ stepMeta.title }}
                  </h3>
                </div>
                <div class="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <span class="text-3xl">{{ getStepIcon(currentStep) }}</span>
                </div>
              </div>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="p-8">
                <!-- Step Description -->
                <p class="text-text-secondary mb-8">
                  {{ stepMeta.description }}
                </p>

                  <div v-if="stepMeta.checklist?.length" class="mt-8">
                    <p class="text-sm font-semibold text-text-primary">{{ t('hostApplication.layout.checklistTitle') }}</p>
                    <ul class="mt-3 space-y-2">
                      <li v-for="item in stepMeta.checklist" :key="item" class="flex items-start gap-3 text-sm text-text-secondary">
                        <span class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                        <span>{{ item }}</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Right: Inputs -->
                <div>
                  <!-- Step 1: Personal Information -->
                  <div v-show="currentStep === 1" class="animate-fade-in">
                    <div class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.firstName') }} *</label>
                          <input 
                            v-model="formData.firstName"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            :placeholder="t('hostApplication.placeholder.firstName')"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.lastName') }} *</label>
                          <input 
                            v-model="formData.lastName"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            :placeholder="t('hostApplication.placeholder.lastName')"
                          />
                        </div>
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.emailAddress') }} *</label>
                          <input 
                            v-model="formData.email"
                            type="email" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="t('hostApplication.placeholder.email')"
                          />
                        </div>
                        <div>
                          <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.phoneNumber') }} *</label>
                          <input 
                            v-model="formData.phone"
                            type="tel" 
                            required
                            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            :placeholder="t('hostApplication.placeholder.phone')"
                          />
                        </div>
                      </div>

                      <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.address') }} *</label>
                        <input 
                          v-model="formData.address"
                          type="text" 
                          required
                          class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                          :placeholder="t('hostApplication.placeholder.address')"
                        />
                      </div>

                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.nationality') }} *</label>
                          <select
                            v-model="formData.nationality"
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                          >
                            <option value="">{{ t('hostApplication.options.selectNationality') }}</option>
                            <option v-for="n in nationalityOptions" :key="n.value" :value="n.value">{{ n.label }}</option>
                          </select>
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.applicantType') }} *</label>
                          <select
                            v-model="formData.applicantType"
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                          >
                            <option value="">{{ t('hostApplication.options.selectApplicantType') }}</option>
                            <option value="individual">{{ t('hostApplication.options.applicantTypeIndividual') }}</option>
                            <option value="business">{{ t('hostApplication.options.applicantTypeBusiness') }}</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.hostingType') }} *</label>
                        <select 
                          v-model="formData.hostingType"
                          required
                          class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                        >
                          <option value="">{{ t('hostApplication.options.selectHostingType') }}</option>
                          <option value="accommodation">{{ t('hostApplication.options.hostingAccommodation') }}</option>
                          <option value="tour">{{ t('hostApplication.options.hostingTour') }}</option>
                          <option value="transport">{{ t('hostApplication.options.hostingTransport') }}</option>
                          <option value="service">{{ t('hostApplication.options.hostingOther') }}</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <!-- Step 2: Verification -->
                  <div v-show="currentStep === 2" class="animate-fade-in">
                    <div class="space-y-4">
                      <div v-if="formData.applicantType === 'business'" class="space-y-4">
                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.businessName') }} *</label>
                          <input 
                            v-model="formData.businessName"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            :placeholder="t('hostApplication.placeholder.businessName')"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.taxId') }} *</label>
                          <input 
                            v-model="formData.taxId"
                            type="text" 
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
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
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ t('hostApplication.labels.idNumber') }} *</label>
                          <input
                            v-model="formData.idNumber"
                            type="text"
                            required
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
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
                          <h3 class="text-xl font-bold text-text-primary mb-2">Where is your property located?</h3>
                          <p class="text-sm text-text-muted mb-6">Type the location now. You’ll pin it on the map later when adding the property from your dashboard.</p>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="md:col-span-2">
                              <label class="block text-sm font-semibold text-text-primary mb-2">Location *</label>
                              <input
                                v-model="formData.propertyLocation"
                                type="text"
                                required
                                class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                                placeholder="e.g., Kigali, Kicukiro"
                              />
                            </div>

                            <div>
                              <label class="block text-sm font-semibold text-text-primary mb-2">Nightly Price *</label>
                              <input
                                v-model.number="formData.price"
                                type="number"
                                min="1"
                                required
                                class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                                placeholder="e.g., 50"
                              />
                            </div>

                            <div>
                              <label class="block text-sm font-semibold text-text-primary mb-2">Street Address (optional)</label>
                              <input
                                v-model="formData.propertyAddress"
                                type="text"
                                class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
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
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            :placeholder="listingLabels.locationPlaceholder"
                          />
                        </div>

                        <div>
                          <label class="block text-sm font-semibold text-text-primary mb-2">{{ listingLabels.capacityLabel }} *</label>
                          <input 
                            v-model="formData.capacity"
                            type="number" 
                            required
                            min="1"
                            class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
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
                        <label class="block text-sm font-semibold text-text-primary mb-2">{{ listingLabels.descriptionLabel }} *</label>
                        <textarea 
                          v-model="formData.description"
                          required
                          rows="5"
                          class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                          :placeholder="listingLabels.descriptionPlaceholder"
                        ></textarea>
                      </div>

                      <!-- Fallback file upload for non-accommodation -->
                      <div v-if="formData.hostingType !== 'accommodation'">
                        <label class="block text-sm font-semibold text-text-primary mb-2">{{ listingLabels.uploadLabel }}</label>
                        <input 
                          type="file"
                          @change="handleFileUpload"
                          multiple
                          accept="image/*,.pdf"
                          class="w-full px-4 py-3.5 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
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
                        <h3 class="text-xl font-bold text-text-primary mb-4">Terms and Conditions</h3>
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
                      <div class="bg-white dark:bg-gray-900 rounded-lg p-4 border-2 border-brand-500">
                        <label class="flex items-start gap-3 cursor-pointer">
                          <input 
                            v-model="formData.agreeToTerms"
                            type="checkbox" 
                            required
                            class="mt-1 w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
                          />
                          <span class="text-sm font-medium text-text-primary">
                            I have read and agree to Merry360's Terms and Conditions, Privacy Policy, and Host Guidelines. I understand that my application will be reviewed before approval. *
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Navigation Buttons -->
                <div class="md:col-span-2 flex items-center justify-between mt-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button 
                    v-if="currentStep > 1"
                    type="button"
                    @click="previousStep"
                    class="px-6 py-3.5 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span class="flex items-center gap-2">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                      </svg>
                      {{ t('hostApplication.previous') }}
                    </span>
                  </button>
                  <div v-else></div>

                  <button 
                    v-if="currentStep < TOTAL_STEPS"
                    type="button"
                    @click="nextStep"
                    :disabled="currentStep === 4 && photosUploading"
                    class="group px-8 py-3.5 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  >
                    <span class="flex items-center gap-2">
                      {{ t('hostApplication.nextStep') }}
                      <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                      </svg>
                    </span>
                  </button>
                  <button 
                    v-else
                    type="submit"
                    :disabled="isSubmitting || photosUploading || !formData.agreeToTerms"
                    class="group relative px-10 py-4 bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none disabled:hover:shadow-xl"
                  >
                    <span v-if="isSubmitting" class="flex items-center gap-3">
                      <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ t('hostApplication.submitting') }}
                    </span>
                    <span v-else class="flex items-center gap-3">
                      <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ t('hostApplication.submitApplication') }}
                      <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
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
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{{ t('hostApplication.benefits.title') }}</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {{ t('hostApplication.benefits.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Benefit 1 -->
          <div class="bg-gradient-to-br from-brand-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ t('hostApplication.benefits.earnTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('hostApplication.benefits.earnDesc') }}
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-gradient-to-br from-orange-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ t('hostApplication.benefits.secureTitle') }}</h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ t('hostApplication.benefits.secureDesc') }}
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-gradient-to-br from-red-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{{ t('hostApplication.benefits.reachTitle') }}</h3>
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
import isoCountries from 'i18n-iso-countries'
import enIsoCountries from 'i18n-iso-countries/langs/en.json'
import worldCountries from 'world-countries'

const router = useRouter()
const { t } = useTranslation()
const formSection = ref(null)
const isSubmitting = ref(false)
const currentStep = ref(1)

// Ensure isSubmitting is reset on mount (in case of stuck state)
onMounted(() => {
  isSubmitting.value = false
  photosUploading.value = false
})

const TOTAL_STEPS = 5

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
  formSection.value?.scrollIntoView({ behavior: 'smooth' })
}

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.nationality || !formData.applicantType || !formData.hostingType) {
      alert(t('hostApplication.validation.step1Required'))
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
    if (formData.hostingType === 'accommodation') {
      const price = Number(formData.price)
      const locationText = String(formData.propertyLocation || '').trim()
      const hasPrice = Number.isFinite(price) && price > 0

      if (!locationText || !hasPrice) {
        alert(t('hostApplication.validation.step3Required'))
        return false
      }
    } else {
      if (!formData.propertyLocation || !formData.capacity) {
        alert(t('hostApplication.validation.step3Required'))
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

const handleSubmit = async () => {
  console.log('🔍 Host application submission started')
  console.log('Terms agreed:', formData.agreeToTerms)
  console.log('Photos:', formData.photos?.length || 0)
  
  // Validate terms BEFORE setting isSubmitting to avoid button getting stuck
  if (!formData.agreeToTerms) {
    alert(t('hostApplication.validation.termsRequired'))
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
  console.log('📤 Starting submission process...')
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('❌ User not authenticated')
      isSubmitting.value = false
      alert(t('hostApplication.loginRequired'))
      router.push('/login')
      return
    }
    
    console.log('✅ User authenticated:', user.email)

    // Upload required documents (store storage paths, not public URLs)
    let idDocumentPath = null
    let businessRegCertPath = null

    console.log('📄 Uploading documents...')
    console.log('ID doc:', idDocumentDoc.value?.file?.name)
    console.log('Business cert:', businessRegCertDoc.value?.file?.name)

    try {
      if (idDocumentDoc.value?.file) {
        console.log('⬆️ Uploading ID document...')
        idDocumentPath = await uploadHostDocument(user.id, 'id-document', idDocumentDoc.value.file)
        console.log('✅ ID document uploaded:', idDocumentPath)
      }

      if (formData.applicantType === 'business' && businessRegCertDoc.value?.file) {
        console.log('⬆️ Uploading business certificate...')
        businessRegCertPath = await uploadHostDocument(user.id, 'business-registration-certificate', businessRegCertDoc.value.file)
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
      id: user.id,
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

    const { error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (error) {
      console.error('❌ Supabase error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }
    
    console.log('✅ Host application saved successfully!')
    alert(t('hostApplication.submittedSuccess'))
    
    // Reset form
    currentStep.value = 1
    Object.keys(formData).forEach(key => {
      if (key === 'agreeToTerms') {
        formData[key] = false
      } else if (key === 'photos') {
        formData[key] = []
      } else {
        formData[key] = ''
      }
    })

    idDocumentDoc.value = null
    businessRegCertDoc.value = null
    uploadedFiles.value = []
    
    // Redirect to home
    router.push('/')
    
  } catch (error) {
    console.error('Host application error:', error)
    alert(t('hostApplication.submittedFailed'))
  } finally {
    isSubmitting.value = false
  }
}

// Helper function for step labels
const getStepLabel = (step) => {
  const labels = {
    1: t('hostApplication.steps.personalInfo'),
    2: t('hostApplication.steps.verification'),
    3: listingStepLabels.value.step3,
    4: listingStepLabels.value.step4,
    5: t('hostApplication.steps.submit')
  }
  return labels[step] || `Step ${step}`
}

// Helper function for step icons
const getStepIcon = (step) => {
  const icons = {
    1: '👤',
    2: '✓',
    3: '🏠',
    4: '📸',
    5: '🚀'
  }
  return icons[step] || '📝'
}
</script>

<style scoped>
/* Merry360 Animations */
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

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.5s ease-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

.animation-delay-400 {
  animation-delay: 0.4s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
