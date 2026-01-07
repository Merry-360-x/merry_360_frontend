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
                <span class="mt-2 text-xs md:text-sm font-medium text-text-secondary">{{ t('hostApplication.steps.verification') }}</span>
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

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.nationality') }} *</label>
                      <select
                        v-model="formData.nationality"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">{{ t('hostApplication.options.selectNationality') }}</option>
                        <option v-for="n in nationalities" :key="n" :value="n">{{ n }}</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-semibold text-text-secondary mb-2">{{ t('hostApplication.labels.applicantType') }} *</label>
                      <select
                        v-model="formData.applicantType"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-text-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      >
                        <option value="">{{ t('hostApplication.options.selectApplicantType') }}</option>
                        <option value="individual">{{ t('hostApplication.options.applicantTypeIndividual') }}</option>
                        <option value="business">{{ t('hostApplication.options.applicantTypeBusiness') }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Business Information -->
              <div v-show="currentStep === 2" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-text-primary mb-6">{{ t('hostApplication.stepTitles.verification') }}</h3>
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
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.businessRegistrationCertificate') }} *</label>
                      <input
                        type="file"
                        @change="handleBusinessCertUpload"
                        accept="image/*,.pdf"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('hostApplication.uploadHintBusinessCert') }}</p>
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
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{{ t('hostApplication.labels.uploadIdDocument') }} *</label>
                      <input
                        type="file"
                        @change="handleIdUpload"
                        accept="image/*,.pdf"
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ t('hostApplication.uploadHintId') }}</p>
                    </div>
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import { supabase, uploadFile } from '../../services/supabase'
import { useTranslation } from '@/composables/useTranslation'
import isoCountries from 'i18n-iso-countries'
import enIsoCountries from 'i18n-iso-countries/langs/en.json'

const router = useRouter()
const { t } = useTranslation()
const formSection = ref(null)
const isSubmitting = ref(false)
const currentStep = ref(1)

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

const nationalities = computed(() => {
  try {
    const names = isoCountries.getNames('en', { select: 'official' })
    const list = Array.from(new Set(Object.values(names).filter(Boolean)))
    return list.sort((a, b) => a.localeCompare(b))
  } catch (e) {
    return fallbackNationalities
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
  agreeToTerms: false
})

const uploadedFiles = ref([])
const idDocumentFile = ref(null)
const businessRegCertFile = ref(null)

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
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.nationality || !formData.applicantType) {
      alert(t('hostApplication.validation.step1Required'))
      return false
    }
  } else if (currentStep.value === 2) {
    if (!formData.idNumber || !idDocumentFile.value) {
      alert(t('hostApplication.validation.step2Required'))
      return false
    }

    if (formData.applicantType === 'business') {
      if (!formData.businessName || !formData.taxId || !businessRegCertFile.value) {
        alert(t('hostApplication.validation.step2Required'))
        return false
      }
    }
  }
  return true
}

const handleFileUpload = (event) => {
  uploadedFiles.value = Array.from(event.target.files)
}

const handleIdUpload = (event) => {
  const file = event?.target?.files?.[0]
  idDocumentFile.value = file || null
}

const handleBusinessCertUpload = (event) => {
  const file = event?.target?.files?.[0]
  businessRegCertFile.value = file || null
}

const uploadHostDocument = async (userId, kind, file) => {
  const bucket = 'host-documents'
  const originalName = file?.name || ''
  const ext = originalName.includes('.') ? originalName.split('.').pop() : ''
  const safeExt = ext ? `.${ext.toLowerCase()}` : ''
  const path = `host-applications/${userId}/${kind}-${Date.now()}${safeExt}`
  await uploadFile(bucket, path, file)
  return path
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

    // Upload required documents (store storage paths, not public URLs)
    let idDocumentPath = null
    let businessRegCertPath = null

    try {
      if (idDocumentFile.value) {
        idDocumentPath = await uploadHostDocument(user.id, 'id-document', idDocumentFile.value)
      }

      if (formData.applicantType === 'business' && businessRegCertFile.value) {
        businessRegCertPath = await uploadHostDocument(user.id, 'business-registration-certificate', businessRegCertFile.value)
      }
    } catch (uploadErr) {
      console.error('Host document upload error:', uploadErr)
      alert(t('hostApplication.validation.uploadFailed'))
      return
    }

    // Save to database
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
        propertyLocation: formData.propertyLocation,
        capacity: formData.capacity,
        description: formData.description,
        additionalFilesCount: uploadedFiles.value?.length || 0
      }
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

    idDocumentFile.value = null
    businessRegCertFile.value = null
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
