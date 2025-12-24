<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-brand-50 via-orange-50 to-white py-16 md:py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Become a Host on Merry360
          </h1>
          <p class="text-base md:text-lg text-gray-600 mb-8">
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

    <!-- How It Works Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p class="text-base text-gray-600">
            Getting started is easy - just follow these simple steps
          </p>
        </div>

        <div class="max-w-4xl mx-auto">
          <div class="space-y-8">
            <!-- Step 1 -->
            <div class="flex gap-6 items-start">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Create Your Host Account</h3>
                <p class="text-gray-600">
                  Fill out our simple registration form with your basic information and what you'd like to host.
                </p>
              </div>
            </div>

            <!-- Step 2 -->
            <div class="flex gap-6 items-start">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Set Up Your Listing</h3>
                <p class="text-gray-600">
                  Add photos, descriptions, pricing, and availability. Our team will help you create an attractive listing.
                </p>
              </div>
            </div>

            <!-- Step 3 -->
            <div class="flex gap-6 items-start">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Get Verified</h3>
                <p class="text-gray-600">
                  Complete a quick verification process to ensure safety and quality for all our users.
                </p>
              </div>
            </div>

            <!-- Step 4 -->
            <div class="flex gap-6 items-start">
              <div class="flex-shrink-0 w-12 h-12 bg-brand-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div class="flex-1">
                <h3 class="text-lg font-bold text-gray-900 mb-2">Start Hosting & Earning</h3>
                <p class="text-gray-600">
                  Once approved, your listing goes live! Manage bookings, communicate with guests, and start earning.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Registration Form Section -->
    <section ref="formSection" class="py-16 md:py-20 bg-gradient-to-br from-brand-50 to-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Start Your Hosting Journey</h2>
            <p class="text-lg text-gray-600">
              Fill out the form below and our team will get in touch with you within 24 hours.
            </p>
          </div>

          <form @submit.prevent="submitForm" class="bg-white rounded-2xl shadow-xl p-8">
            <!-- Personal Information -->
            <div class="mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Personal Information</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                  <input 
                    v-model="formData.fullName"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Enter your full legal name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                  <input 
                    v-model="formData.email"
                    type="email" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                  <input 
                    v-model="formData.phone"
                    type="tel" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="+250 788 123 456"
                  />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                  <input 
                    v-model="formData.location"
                    type="text" 
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="City or District, e.g., Kigali, Musanze, Rubavu"
                  />
                </div>
              </div>
            </div>

            <!-- Hosting Details -->
            <div class="mb-6">
              <h3 class="text-xl font-bold text-gray-900 mb-4">Hosting Details</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">What would you like to host? *</label>
                  <select 
                    v-model="formData.hostingType"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select hosting type</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="tour">Tours & Experiences</option>
                    <option value="transport">Transport Services</option>
                    <option value="service">Other Services</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tell us more about what you're offering *</label>
                  <textarea 
                    v-model="formData.description"
                    required
                    rows="4"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Example: I have a 3-bedroom lakeside villa in Gisenyi with stunning views, or I offer guided gorilla trekking tours in Volcanoes National Park..."
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Previous hosting experience (optional)</label>
                  <select 
                    v-model="formData.experience"
                    class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="">Select experience level</option>
                    <option value="none">No previous experience</option>
                    <option value="some">Some experience</option>
                    <option value="extensive">Extensive experience</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Terms and Submit -->
            <div class="mb-6">
              <label class="flex items-start gap-3 cursor-pointer">
                <input 
                  v-model="formData.agreeToTerms"
                  type="checkbox" 
                  required
                  class="mt-1 w-5 h-5 text-brand-500 border-gray-300 rounded focus:ring-brand-500"
                />
                <span class="text-sm text-gray-600">
                  I agree to Merry360's Terms of Service and Privacy Policy, and I understand that my application will be reviewed before approval. *
                </span>
              </label>
            </div>

            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full px-8 py-4 bg-brand-500 hover:bg-brand-600 disabled:bg-gray-400 text-white font-bold rounded-lg text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Host with Merry360?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of hosts who are earning income while sharing Rwanda's beauty with the world.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Benefit 1 -->
          <div class="bg-gradient-to-br from-brand-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Earn Extra Income</h3>
            <p class="text-gray-600">
              Set your own prices and availability. Earn money from your property, tours, or transport services on your schedule.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="bg-gradient-to-br from-orange-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Secure & Protected</h3>
            <p class="text-gray-600">
              Benefit from secure payment processing, insurance coverage, and 24/7 host support for peace of mind.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <div class="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-6">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">Global Reach</h3>
            <p class="text-gray-600">
              Connect with travelers worldwide and showcase Rwanda's unique offerings to an international audience.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What You Can Host Section -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Can You Host?</h2>
          <p class="text-lg text-gray-600">
            We welcome a variety of hosting opportunities
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Accommodation -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Accommodations</h3>
            <p class="text-sm text-gray-600">Hotels, guesthouses, apartments, or unique stays</p>
          </div>

          <!-- Tours -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Tours & Experiences</h3>
            <p class="text-sm text-gray-600">Guided tours, activities, and unique experiences</p>
          </div>

          <!-- Transport -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Transport Services</h3>
            <p class="text-sm text-gray-600">Car rentals, airport transfers, or private drivers</p>
          </div>

          <!-- Services -->
          <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center">
            <div class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Other Services</h3>
            <p class="text-sm text-gray-600">Photography, guides, consultations, and more</p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <div class="text-center mb-12">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>

          <div class="space-y-4">
            <div v-for="(faq, index) in faqs" :key="index" class="bg-white rounded-xl shadow-md overflow-hidden">
              <button 
                @click="toggleFaq(index)"
                class="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span class="font-semibold text-gray-900">{{ faq.question }}</span>
                <svg 
                  class="w-5 h-5 text-gray-500 transition-transform"
                  :class="{ 'rotate-180': faq.open }"
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div v-if="faq.open" class="px-6 pb-4">
                <p class="text-gray-600">{{ faq.answer }}</p>
              </div>
            </div>
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
import { useToast } from '../../composables/useToast'
import { sendHostApplicationEmails } from '../../services/hostApplicationEmails'

const router = useRouter()
const formSection = ref(null)
const isSubmitting = ref(false)
const { showToast } = useToast()

const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  location: '',
  hostingType: '',
  description: '',
  experience: '',
  agreeToTerms: false
})

const faqs = ref([
  {
    question: 'How much does it cost to become a host?',
    answer: 'Joining Merry360 as a host is completely free. We only charge a small service fee when you receive a booking.',
    open: false
  },
  {
    question: 'How long does the approval process take?',
    answer: 'Typically, applications are reviewed within 24-48 hours. Once approved, you can start setting up your listings immediately.',
    open: false
  },
  {
    question: 'What is the commission structure?',
    answer: 'Merry360 charges a competitive service fee of 15% on each booking. You keep 85% of your listing price.',
    open: false
  },
  {
    question: 'Can I host multiple properties or services?',
    answer: 'Yes! You can create multiple listings under one host account for different properties, tours, or services.',
    open: false
  },
  {
    question: 'How do I receive payments?',
    answer: 'Payments are processed securely through our platform and transferred to your bank account or mobile money within 3-5 business days after guest check-in.',
    open: false
  },
  {
    question: 'What kind of support do hosts receive?',
    answer: 'We provide 24/7 host support, dedicated account managers, marketing assistance, and resources to help you succeed.',
    open: false
  }
])

const scrollToForm = () => {
  formSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const toggleFaq = (index) => {
  faqs.value[index].open = !faqs.value[index].open
}

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      showToast('Please login first to apply as a host', 'error')
      router.push('/login')
      return
    }
    
    console.log('Submitting host application for user:', user.email)

    // Save host application to the database.
    // Use upsert to handle the case where a profile row doesn't exist yet.
    const fullName = String(formData.fullName || '').trim()
    const nameParts = fullName.split(/\s+/).filter(Boolean)
    const firstName = nameParts[0] || null
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : null

    const profilePayload = {
      id: user.id,
      email: user.email,
      first_name: firstName,
      last_name: lastName,
      phone_number: formData.phone || null,
      city: formData.location || null,
      host_application_status: 'pending',
      host_application_date: new Date().toISOString()
    }

    const isMissingCityColumnError = (err) => {
      const msg = String(err?.message || '')
      return msg.includes("Could not find the 'city' column")
    }

    let upsertResult = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select('id')
      .single()

    if (upsertResult.error && isMissingCityColumnError(upsertResult.error)) {
      const { city: _city, ...payloadWithoutCity } = profilePayload
      upsertResult = await supabase
        .from('profiles')
        .upsert(payloadWithoutCity, { onConflict: 'id' })
        .select('id')
        .single()
    }

    if (upsertResult.error) {
      console.error('Supabase error:', upsertResult.error)
      throw upsertResult.error
    }
    
    console.log('✅ Host application saved successfully to database!')
    console.log('📊 Admin can now see this application at /admin/host-applications')

    // Send emails (host confirmation + admin notification). If email fails, do not block success.
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', user.id)
        .single()

      const applicantName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim()

      await sendHostApplicationEmails({
        applicantEmail: user.email,
        applicantName,
        applicantId: user.id,
        appliedAt: new Date().toISOString(),
        siteUrl: window.location.origin
      })
    } catch (emailErr) {
      console.warn('Host application email failed:', emailErr)
    }

    // Simple confirmation UI (auto-dismiss)
    showToast('Application submitted successfully.', 'success', 2000)
    
    // Reset form
    Object.keys(formData).forEach(key => {
      if (key === 'agreeToTerms') {
        formData[key] = false
      } else {
        formData[key] = ''
      }
    })
    
  } catch (error) {
    console.error('Host application error:', error)
    showToast('Failed to submit application. Please try again: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}
</script>
