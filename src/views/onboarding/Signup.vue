<template>
  <MainLayout>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8 animate-fade-in">
        <router-link to="/" class="inline-flex items-center justify-center space-x-2">
          <div class="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-2xl">M</span>
          </div>
          <span class="text-2xl font-bold text-text-brand-600">Merry360X</span>
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-text-brand-600">Create Account</h2>
        <p class="mt-2 text-text-secondary">Start your journey today</p>
      </div>

      <!-- Signup Form -->
      <Card padding="lg" class="animate-slide-in">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">Full Name</label>
            <Input
              v-model="formData.name"
              type="text"
              placeholder="John Doe"
              :error="errors.name"
              :icon="userIcon"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">Email Address</label>
            <Input
              v-model="formData.email"
              type="email"
              placeholder="you@example.com"
              :error="errors.email"
              :icon="emailIcon"
            />
          </div>

          <!-- Phone -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">Phone Number</label>
            <Input
              v-model="formData.phone"
              type="tel"
              placeholder="+250 7XX XXX XXX"
              :error="errors.phone"
              :icon="phoneIcon"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">Password</label>
            <Input
              v-model="formData.password"
              type="password"
              placeholder="At least 8 characters"
              :error="errors.password"
              :icon="lockIcon"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">Confirm Password</label>
            <Input
              v-model="formData.confirmPassword"
              type="password"
              placeholder="Confirm your password"
              :error="errors.confirmPassword"
              :icon="lockIcon"
            />
          </div>

          <!-- Terms -->
          <div class="flex items-start">
            <input 
              type="checkbox" 
              v-model="formData.acceptTerms" 
              class="mt-1 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
            >
            <span class="ml-2 text-sm text-text-secondary">
              I agree to the 
              <a href="#" class="text-brand-600 hover:text-opacity-80">Terms of Service</a> 
              and 
              <a href="#" class="text-brand-600 hover:text-opacity-80">Privacy Policy</a>
            </span>
          </div>
          <div v-if="errors.acceptTerms" class="text-sm text-error">{{ errors.acceptTerms }}</div>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            full-width
            :loading="loading"
          >
            Create Account
          </Button>

          <!-- Social Signup -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white text-text-secondary">Or sign up with</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button type="button" class="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-button hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-sm font-medium">Google</span>
            </button>
            <button type="button" class="flex items-center justify-center px-4 py-3 border border-gray-200 rounded-button hover:bg-gray-50 transition-colors">
              <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-sm font-medium">Facebook</span>
            </button>
          </div>
        </form>
      </Card>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-text-secondary">
          Already have an account? 
          <router-link to="/login" class="text-brand-600 font-medium hover:text-opacity-80 ml-1">
            Sign in
          </router-link>
        </p>
      </div>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'

const router = useRouter()
const appStore = useAppStore()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
})

const errors = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: ''
})

const loading = ref(false)

const userIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>`
}

const emailIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
}

const phoneIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>`
}

const lockIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>`
}

const validateForm = () => {
  let isValid = true
  errors.value = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  }

  if (!formData.value.name) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  if (!formData.value.email) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!/\S+@\S+\.\S+/.test(formData.value.email)) {
    errors.value.email = 'Email is invalid'
    isValid = false
  }

  if (!formData.value.phone) {
    errors.value.phone = 'Phone is required'
    isValid = false
  }

  if (!formData.value.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (formData.value.password.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (formData.value.password !== formData.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match'
    isValid = false
  }

  if (!formData.value.acceptTerms) {
    errors.value.acceptTerms = 'You must accept the terms and conditions'
    isValid = false
  }

  return isValid
}

const handleSignup = async () => {
  if (!validateForm()) return

  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    appStore.login({
      name: formData.value.name,
      email: formData.value.email
    })
    loading.value = false
    router.push('/home')
  }, 1500)
}
</script>

<script>
import MainLayout from '../../components/layout/MainLayout.vue'
export default {
  components: { MainLayout }
}
</script>
