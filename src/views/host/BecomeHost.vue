<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-brand-50 dark:from-gray-800 via-orange-50 dark:via-gray-700 to-white dark:to-gray-900 py-16 md:py-24 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Become a Host on Merry360
          </h1>
          <p class="text-base md:text-lg text-gray-600 dark:text-gray-400 mb-8">
            Share your unique space, experiences, or services with travelers from around the world and earn extra income.
          </p>
          <button 
            @click="scrollToForm"
            class="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full text-base transition-all shadow-lg hover:shadow-xl"
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>

    <!-- Multi-Step Registration Form -->
    <section ref="formSection" class="py-16 md:py-20 bg-gradient-to-br from-brand-50 dark:from-gray-900 to-white dark:to-gray-800 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Start Your Hosting Journey</h2>
            <p class="text-lg text-gray-600 dark:text-gray-400">
              Complete the 3-step registration process
            </p>
          </div>

          <!-- Step Indicator -->
          <div class="mb-12">
            <div class="flex items-center justify-between max-w-2xl mx-auto">
              <!-- Step 1 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 1 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                >
                  <svg v-if="currentStep > 1" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>1</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Personal Info</span>
              </div>

              <!-- Connector Line 1 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 2 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 2 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 2 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                >
                  <svg v-if="currentStep > 2" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>2</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Business Info</span>
              </div>

              <!-- Connector Line 2 -->
              <div class="flex-1 h-1 mx-2" :class="currentStep >= 3 ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700'"></div>

              <!-- Step 3 -->
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300"
                  :class="currentStep >= 3 ? 'bg-brand-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'"
                >
                  <svg v-if="currentStep > 3" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span v-else>3</span>
                </div>
                <span class="mt-2 text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300">Property Details</span>
              </div>
            </div>
          </div>

          <!-- Form Card -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 transition-colors duration-200">
            <form @submit.prevent="handleSubmit">
              <!-- Step 1: Personal Information -->
              <div v-show="currentStep === 1" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Personal Information</h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
                      <input 
                        v-model="formData.firstName"
                        type="text" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
                      <input 
                        v-model="formData.lastName"
                        type="text" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
                      <input 
                        v-model="formData.email"
                        type="email" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
                      <input 
                        v-model="formData.phone"
                        type="tel" 
                        required
                        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="+250 788 123 456"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Address *</label>
                    <input 
                      v-model="formData.address"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Street address, City"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nationality *</label>
                    <input 
                      v-model="formData.nationality"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g., Rwandan, Kenyan, etc."
                    />
                  </div>
                </div>
              </div>

              <!-- Step 2: Business Information -->
              <div v-show="currentStep === 2" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Business Information</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Name *</label>
                    <input 
                      v-model="formData.businessName"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Your company or individual business name"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Type *</label>
                    <select 
                      v-model="formData.businessType"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select business type</option>
                      <option value="individual">Individual/Sole Proprietor</option>
                      <option value="company">Registered Company</option>
                      <option value="partnership">Partnership</option>
                      <option value="ngo">NGO/Non-Profit</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tax ID / TIN Number</label>
                    <input 
                      v-model="formData.taxId"
                      type="text" 
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Optional - if registered"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Years in Business *</label>
                    <select 
                      v-model="formData.yearsInBusiness"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select experience</option>
                      <option value="new">Just Starting</option>
                      <option value="1-2">1-2 Years</option>
                      <option value="3-5">3-5 Years</option>
                      <option value="5+">5+ Years</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Bank Account Details *</label>
                    <input 
                      v-model="formData.bankAccount"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Bank name and account number for payouts"
                    />
                  </div>
                </div>
              </div>

              <!-- Step 3: Property/Service Details -->
              <div v-show="currentStep === 3" class="animate-fade-in">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Property & Service Details</h3>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">What would you like to host? *</label>
                    <select 
                      v-model="formData.hostingType"
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value="">Select hosting type</option>
                      <option value="accommodation">Accommodation (Hotel, Guesthouse, Villa)</option>
                      <option value="tour">Tours & Experiences</option>
                      <option value="transport">Transport Services</option>
                      <option value="service">Other Services</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Property/Service Location *</label>
                    <input 
                      v-model="formData.propertyLocation"
                      type="text" 
                      required
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g., Kigali, Musanze, Gisenyi"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Number of Units/Capacity *</label>
                    <input 
                      v-model="formData.capacity"
                      type="number" 
                      required
                      min="1"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="e.g., 5 rooms, 10 guests, 3 vehicles"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Detailed Description *</label>
                    <textarea 
                      v-model="formData.description"
                      required
                      rows="5"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Tell us about your property/service: amenities, unique features, target audience, pricing expectations..."
                    ></textarea>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload Photos/Documents</label>
                    <input 
                      type="file"
                      @change="handleFileUpload"
                      multiple
                      accept="image/*,.pdf"
                      class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload photos of your property or relevant documents (optional)</p>
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
                        I agree to Merry360's Terms of Service and Privacy Policy, and I understand that my application will be reviewed before approval. *
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
                  Previous
                </button>
                <div v-else></div>

                <button 
                  v-if="currentStep < 3"
                  type="button"
                  @click="nextStep"
                  class="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  Next Step
                </button>
                <button 
                  v-else
                  type="submit"
                  :disabled="isSubmitting"
                  class="px-6 py-3 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all shadow-lg"
                >
                  {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 md:py-20 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Why Host with Merry360?</h2>
          <p class="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Join thousands of hosts who are earning income while sharing Rwanda's beauty with the world.
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
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Earn Extra Income</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Set your own prices and availability. Earn money from your property, tours, or transport services on your schedule.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-gradient-to-br from-orange-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Secure & Protected</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Benefit from secure payment processing, insurance coverage, and 24/7 host support for peace of mind.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-gradient-to-br from-red-50 dark:from-gray-800 to-white dark:to-gray-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Global Reach</h3>
            <p class="text-gray-600 dark:text-gray-400">
              Connect with travelers worldwide and showcase Rwanda's unique offerings to an international audience.
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

const router = useRouter()
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
      alert('Please fill in all required fields in Step 1')
      return false
    }
  } else if (currentStep.value === 2) {
    if (!formData.businessName || !formData.businessType || !formData.yearsInBusiness || !formData.bankAccount) {
      alert('Please fill in all required fields in Step 2')
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
    alert('Please agree to the terms and conditions')
    return
  }

  isSubmitting.value = true
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      alert('Please login first to apply as a host')
      router.push('/login')
      return
    }
    
    console.log('Submitting host application for user:', user.email)

    // Save to database
    const profilePayload = {
      id: user.id,
      email: formData.email,
      first_name: formData.firstName,
      last_name: formData.lastName,
      phone_number: formData.phone,
      host_application_status: 'pending',
      host_application_date: new Date().toISOString(),
      host_application_data: JSON.stringify({
        ...formData,
        submittedAt: new Date().toISOString()
      })
    }

    const { error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }
    
    console.log('✅ Host application saved successfully!')
    alert('Application submitted successfully! We will review your application and get back to you within 24-48 hours.')
    
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
    alert('Failed to submit application. Please try again.')
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
