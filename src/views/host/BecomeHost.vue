<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-white via-orange-50 to-white dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 py-16 md:py-24 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
            {{ t('hostApplication.heroTitle') }}
          </h1>
          <p class="text-base md:text-lg text-text-secondary mb-8">
            {{ t('hostApplication.heroSubtitle') }}
          </p>
          <button 
            @click="scrollToForm"
            class="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full text-base transition-all shadow-lg hover:shadow-xl"
          >
            {{ t('hostApplication.getStartedToday') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Multi-Step Registration Form -->
    <section ref="formSection" class="py-16 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-bold text-text-primary mb-4">{{ t('hostApplication.startJourneyTitle') }}</h2>
            <p class="text-lg text-text-secondary">
              {{ t('hostApplication.startJourneySubtitle') }}
            </p>
          </div>

          <!-- Step Indicator -->
          <div class="mb-12">
            <div class="flex items-center justify-between max-w-2xl mx-auto">
              <!-- Step 1 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 1 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>1</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">{{ t('hostApplication.steps.personalInfo') }}</span>
              </div>

              <!-- Connector Line 1 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 2 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 2 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 2" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>2</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">{{ t('hostApplication.steps.businessInfo') }}</span>
              </div>

              <!-- Connector Line 2 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 3 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 3 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 3 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-primary'"
                >
                  <svg v-if="currentStep > 3" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>3</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">{{ t('hostApplication.steps.propertyDetails') }}</span>
              </div>
            </div>
          </div>

          <!-- Form Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-200">
            <form @submit.prevent="handleSubmit">
              <!-- Step 1: Personal Information -->
              <div v-show="currentStep === 1" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-text-primary mb-6">{{ t('hostApplication.stepTitles.personalInformation') }}</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.firstName') }} *</label>
                      <input 
                        v-model="formData.firstName"
                        type="text" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        :placeholder="t('hostApplication.placeholder.firstName')"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.lastName') }} *</label>
                      <input 
                        v-model="formData.lastName"
                        type="text" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.address') }} *</label>
                    <input 
                      v-model="formData.address"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.address')"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.nationality') }} *</label>
                    <input 
                      v-model="formData.nationality"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.nationality')"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 2: Business Information -->
              <div v-show="currentStep === 2" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-text-primary mb-6">{{ t('hostApplication.stepTitles.businessInformation') }}</h3>
                <div class="space-y-4">
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
                    <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.businessType') }} *</label>
                    <select 
                      v-model="formData.businessType"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">{{ t('hostApplication.options.selectBusinessType') }}</option>
                      <option value="individual">{{ t('hostApplication.options.businessTypeIndividual') }}</option>
                      <option value="company">{{ t('hostApplication.options.businessTypeCompany') }}</option>
                      <option value="partnership">{{ t('hostApplication.options.businessTypePartnership') }}</option>
                      <option value="ngo">{{ t('hostApplication.options.businessTypeNgo') }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.taxId') }}</label>
                    <input 
                      v-model="formData.taxId"
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.taxId')"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.yearsInBusiness') }} *</label>
                    <select 
                      v-model="formData.yearsInBusiness"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">{{ t('hostApplication.options.selectYearsInBusiness') }}</option>
                      <option value="new">{{ t('hostApplication.options.yearsNew') }}</option>
                      <option value="1-2">{{ t('hostApplication.options.years1to2') }}</option>
                      <option value="3-5">{{ t('hostApplication.options.years3to5') }}</option>
                      <option value="5+">{{ t('hostApplication.options.years5plus') }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.bankAccount') }} *</label>
                    <input 
                      v-model="formData.bankAccount"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.bankAccount')"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Property/Service Details -->
              <div v-show="currentStep === 3" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">{{ t('hostApplication.stepTitles.propertyServiceDetails') }}</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.hostingType') }} *</label>
                    <select 
                      v-model="formData.hostingType"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">{{ t('hostApplication.options.selectHostingType') }}</option>
                      <option value="accommodation">{{ t('hostApplication.options.hostingAccommodation') }}</option>
                      <option value="tour">{{ t('hostApplication.options.hostingTour') }}</option>
                      <option value="transport">{{ t('hostApplication.options.hostingTransport') }}</option>
                      <option value="service">{{ t('hostApplication.options.hostingOther') }}</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.propertyLocation') }} *</label>
                    <input 
                      v-model="formData.propertyLocation"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.propertyLocation')"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.capacity') }} *</label>
                    <input 
                      v-model="formData.capacity"
                      type="number" 
                      required
                      min="1"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.capacity')"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.description') }} *</label>
                    <textarea 
                      v-model="formData.description"
                      required
                      rows="5"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      :placeholder="t('hostApplication.placeholder.description')"
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.uploadPhotos') }}</label>
                    <input 
                      type="file"
                      @change="handleFileUpload"
                      multiple
                      accept="image/*,.pdf"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('hostApplication.uploadHint') }}</p>
                  </div>

                  <div class="mt-6">
                    <label class="flex items-start gap-3 cursor-pointer">
                      <input 
                        v-model="formData.agreeToTerms"
                        type="checkbox" 
                        required
                        class="mt-1 w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                      />
                      <span class="text-sm text-gray-600 dark:text-gray-400">
                        {{ t('hostApplication.termsAgreement') }} *
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button 
                  v-if="currentStep > 1"
                  type="button"
                  @click="previousStep"
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg transition-all"
                >
                  {{ t('hostApplication.previous') }}
                </button>
                <div v-else></div>

                <button 
                  v-if="currentStep < 3"
                  type="button"
                  @click="nextStep"
                  class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  {{ t('hostApplication.nextStep') }}
                </button>
                <button 
                  v-else
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  {{ isSubmitting ? t('hostApplication.submitting') : t('hostApplication.submitApplication') }}
                </button>
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase } from '../../services/supabase'
import { useTranslation } from '@/composables/useTranslation'

const router = useRouter()
const { t } = useTranslation()
const formSection = ref(null)
const isSubmitting = ref(false)
const currentStep = ref(1)

const formData = reactive({
  // Step 1: Personal Info
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  nationality: '',
  
  // Step 2: Business Info
  businessName: '',
  businessType: '',
  taxId: '',
  yearsInBusiness: '',
  bankAccount: '',
  
  // Step 3: Property Details
  hostingType: '',
  propertyLocation: '',
  capacity: '',
  description: '',
  agreeToTerms: false
})

const uploadedFiles = ref([])

const scrollToForm = () => {
  formSection.value?.scrollIntoView({ behavior: 'smooth' })
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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.nationality) {
      alert(t('hostApplication.validation.step1Required'))
      return false
    }
  } else if (currentStep.value === 2) {
    if (!formData.businessName || !formData.businessType || !formData.yearsInBusiness || !formData.bankAccount) {
      alert(t('hostApplication.validation.step2Required'))
      return false
    }
  }
  return true
}

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files)
}

const handleSubmit = async () => {
  if (!formData.agreeToTerms) {
    alert(t('hostApplication.validation.termsRequired'))
    return
  }

  isSubmitting.value = true
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert(t('hostApplication.loginRequired'))
      router.push('/login')
      return
    }
    
    console.log('Submitting host application for user:', user.email)

    // Save to database
    const profilePayload = {
      id: user.id,
      email: user.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone: formData.phone,
      host_application_status: 'pending',
      host_application_date: new Date().toISOString()
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('✅ Host application saved successfully!')
    alert(t('hostApplication.submittedSuccess'))
    
    // Reset form
    currentStep.value = 1
    Object.keys(formData).forEach(key => {
      if (key === 'agreeToTerms') {
        formData[key] = false
      } else {
        formData[key] = ''
      }
    })
    
    // Redirect to home
    router.push('/')
    
  } catch (error) {
    console.error('Host application error:', error)
    alert(t('hostApplication.submittedFailed'))
  } finally {
    isSubmitting.value = false
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
</style>
