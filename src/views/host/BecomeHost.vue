<template>
  <MainLayout>
    <!-- Hero Section -->
    <section class="relative min-h-[500px] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1920&q=80" 
          alt="Become a Host" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-brand-600/95 to-brand-500/90"></div>
      </div>
      
      <div class="relative z-10 container mx-auto px-4 text-center text-white max-w-4xl">
        <h1 class="text-4xl md:text-6xl font-bold mb-6" style="font-family: 'Montserrat', sans-serif;">
          Share Your Space, Earn Income
        </h1>
        <p class="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
          Join thousands of hosts earning extra income by listing their properties on Merry360
        </p>
        <button @click="scrollToBenefits" class="px-8 py-4 bg-white text-brand-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl">
          Start Hosting Today
        </button>
      </div>
    </section>

    <!-- Benefits Section -->
    <section ref="benefitsSection" class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Montserrat', sans-serif; color: #484848;">
            Why Host with Merry360?
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            We make it easy to earn money from your extra space
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <!-- Benefit 1 -->
          <div class="text-center p-8 rounded-2xl bg-gray-50 hover:bg-brand-50 transition-colors">
            <div class="w-20 h-20 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Earn Extra Income</h3>
            <p class="text-gray-600">
              Set your own prices and earn money from your unused space. Our hosts earn an average of $500-2000 per month.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="text-center p-8 rounded-2xl bg-gray-50 hover:bg-brand-50 transition-colors">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Full Protection</h3>
            <p class="text-gray-600">
              Host protection insurance up to $1M, secure payments, and 24/7 support to keep you safe.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="text-center p-8 rounded-2xl bg-gray-50 hover:bg-brand-50 transition-colors">
            <div class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-bold mb-3 text-gray-900">Easy Setup</h3>
            <p class="text-gray-600">
              List your property in minutes. We provide professional photography and marketing support.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-16 md:py-24 bg-gray-50">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Montserrat', sans-serif; color: #484848;">
            How to Get Started
          </h2>
          <p class="text-gray-600 max-w-2xl mx-auto">
            It's simple and takes less than 10 minutes
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- Step 1 -->
          <div class="relative">
            <div class="text-center">
              <div class="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Tell us about your place</h3>
              <p class="text-sm text-gray-600">Share basic info like location, how many guests you can accommodate, and amenities.</p>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brand-200 -ml-8"></div>
          </div>

          <!-- Step 2 -->
          <div class="relative">
            <div class="text-center">
              <div class="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Add photos</h3>
              <p class="text-sm text-gray-600">Upload high-quality photos. We can also send a professional photographer for free!</p>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brand-200 -ml-8"></div>
          </div>

          <!-- Step 3 -->
          <div class="relative">
            <div class="text-center">
              <div class="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 class="text-lg font-bold mb-2 text-gray-900">Set your price</h3>
              <p class="text-sm text-gray-600">Choose competitive pricing. We'll suggest rates based on similar listings in your area.</p>
            </div>
            <div class="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brand-200 -ml-8"></div>
          </div>

          <!-- Step 4 -->
          <div class="text-center">
            <div class="w-16 h-16 bg-brand-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              4
            </div>
            <h3 class="text-lg font-bold mb-2 text-gray-900">Publish and earn</h3>
            <p class="text-sm text-gray-600">Your listing goes live immediately. Start accepting bookings and earning income!</p>
          </div>
        </div>

        <div class="text-center mt-12">
          <button @click="startListing" class="px-8 py-4 bg-brand-500 text-white rounded-xl font-bold text-lg hover:bg-brand-600 transition-colors shadow-lg">
            List Your Property
          </button>
        </div>
      </div>
    </section>

    <!-- Host Stories -->
    <section class="py-16 md:py-24 bg-white">
      <div class="container mx-auto px-4 max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-5xl font-bold mb-4" style="font-family: 'Montserrat', sans-serif; color: #484848;">
            Success Stories
          </h2>
          <p class="text-gray-600">See what other hosts are saying</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Testimonial 1 -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="flex items-center mb-4">
              <img src="https://i.pravatar.cc/100?img=1" alt="Host" class="w-16 h-16 rounded-full mr-4">
              <div>
                <h4 class="font-bold text-gray-900">Jean Claude</h4>
                <p class="text-sm text-gray-600">Kigali Host</p>
              </div>
            </div>
            <div class="flex mb-3">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700">
              "I've been hosting for 2 years now and it's been amazing! The extra income helps pay my mortgage and I've met wonderful guests from around the world."
            </p>
          </div>

          <!-- Testimonial 2 -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="flex items-center mb-4">
              <img src="https://i.pravatar.cc/100?img=5" alt="Host" class="w-16 h-16 rounded-full mr-4">
              <div>
                <h4 class="font-bold text-gray-900">Marie Uwase</h4>
                <p class="text-sm text-gray-600">Musanze Host</p>
              </div>
            </div>
            <div class="flex mb-3">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700">
              "The Merry360 team made everything so easy. From the listing process to getting bookings, they supported me every step of the way."
            </p>
          </div>

          <!-- Testimonial 3 -->
          <div class="bg-gray-50 rounded-2xl p-8">
            <div class="flex items-center mb-4">
              <img src="https://i.pravatar.cc/100?img=8" alt="Host" class="w-16 h-16 rounded-full mr-4">
              <div>
                <h4 class="font-bold text-gray-900">David Nkusi</h4>
                <p class="text-sm text-gray-600">Gisenyi Host</p>
              </div>
            </div>
            <div class="flex mb-3">
              <svg v-for="i in 5" :key="i" class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            </div>
            <p class="text-gray-700">
              "Within 3 months of listing my lakeside cottage, I had enough bookings to cover my annual expenses. Best decision I ever made!"
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-brand-500 to-brand-600">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Become a Host?</h2>
        <p class="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Join our community of hosts and start earning today
        </p>
        <button @click="startListing" class="px-8 py-4 bg-white text-brand-600 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-2xl">
          Get Started Now
        </button>
      </div>
    </section>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'

const router = useRouter()
const benefitsSection = ref(null)

const scrollToBenefits = () => {
  benefitsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const startListing = () => {
  alert('Host registration will open soon! For now, please contact us at host@merry360.com')
}
</script>

<style scoped>
/* Additional styles if needed */
</style>
