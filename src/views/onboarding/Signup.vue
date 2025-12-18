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
          <span class="text-2xl font-bold text-text-brand-600 dark:text-white">{{ t('auth.brandName') }}</span>
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-text-brand-600 dark:text-white">{{ t('auth.createAccount') }}</h2>
        <p class="mt-2 text-text-secondary dark:text-gray-300">{{ t('auth.signupSubtitle') }}</p>
      </div>

      <!-- Signup Form -->
      <Card padding="lg" class="animate-slide-in">
        <form @submit.prevent="handleSignup" class="space-y-5">
          <!-- Full Name -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.fullName') }}</label>
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
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.emailAddress') }}</label>
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
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.phoneNumber') }}</label>
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
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.password') }}</label>
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
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.confirmPassword') }}</label>
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
            <span class="ml-2 text-sm text-text-secondary dark:text-gray-300">
              {{ t('auth.termsAgree') }}
              <a href="#" class="text-brand-600 hover:text-opacity-80">{{ t('auth.termsOfService') }}</a> 
              {{ t('auth.and') }}
              <a href="#" class="text-brand-600 hover:text-opacity-80">{{ t('auth.privacyPolicy') }}</a>
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
            {{ t('auth.signup') }}
          </Button>
        </form>

        <!-- Social Signup -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-300">{{ t('auth.orSignUpWith') }}</span>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button 
            type="button" 
            @click="handleGoogleSignIn" 
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Google</span>
          </button>
          <button 
            type="button" 
            class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-200">Facebook</span>
          </button>
        </div>
      </Card>

      <!-- Login Link -->
      <div class="mt-6 text-center">
        <p class="text-text-secondary dark:text-gray-300">
          {{ t('auth.alreadyHaveAccount') }}
          <router-link to="/login" class="text-brand-600 font-medium hover:text-opacity-80 ml-1">
            {{ t('auth.login') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useFormValidation } from '../../composables/useFormValidation'
import { useTranslation } from '../../composables/useTranslation'
import { validators } from '../../utils/validation'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import { signUp, signInWithGoogle } from '../../services/auth'
import googleService from '../../services/google'
import mockApiService from '../../services/mockApi'

const router = useRouter()
const userStore = useUserStore()
const { errors, validateAll, setError, clearErrors } = useFormValidation()
const { t } = useTranslation()

const gsiButton = ref(null)
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

onMounted(async () => {
  if (!googleClientId || !gsiButton.value) return
  try {
    await googleService.renderGoogleButton({
      clientId: googleClientId,
      element: gsiButton.value,
      callback: async (response) => {
        try {
          const idToken = response.credential
          const profile = JSON.parse(atob(idToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
          const backendRes = await mockApiService.auth.socialSignIn({
            email: profile.email,
            firstName: profile.given_name,
            lastName: profile.family_name,
            picture: profile.picture
          })

          userStore.login({
            id: backendRes.user.id,
            name: `${backendRes.user.firstName || ''} ${backendRes.user.lastName || ''}`.trim() || backendRes.user.email,
            email: backendRes.user.email,
            firstName: backendRes.user.firstName || '',
            lastName: backendRes.user.lastName || '',
            phone: backendRes.user.phone || '',
            role: backendRes.user.role || 'user',
            verified: true
          })

          if (backendRes.token) localStorage.setItem('auth_token', backendRes.token)
          router.push('/profile')
        } catch (err) {
          console.error('GSI callback error', err)
        }
      }
    })
  } catch (err) {
    console.error('Failed to render Google button', err)
  }
})
const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false
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

const validationRules = {
  name: validators.name,
  email: validators.email,
  phone: validators.phone,
  password: validators.password,
  confirmPassword: (value) => validators.confirmPassword(formData.value.password, value),
  acceptTerms: validators.terms
}

const handleSignup = async () => {
  // Clear previous errors
  clearErrors()
  
  // Validate form
  const isValid = validateAll(formData.value, validationRules)
  
  if (!isValid) {
    return
  }

  loading.value = true
  
  try {
    // Use the unified auth service
    const nameParts = formData.value.name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    const response = await signUp({
      firstName,
      lastName,
      email: formData.value.email,
      phone: formData.value.phone,
      password: formData.value.password
    })
    
    // Register user
    userStore.login({
      id: response.user.id,
      name: `${response.user.firstName} ${response.user.lastName}`,
      email: response.user.email,
      firstName: response.user.firstName,
      lastName: response.user.lastName,
      phone: response.user.phone,
      role: response.user.role,
      verified: response.user.verified,
      dateOfBirth: '',
      bio: '',
      memberSince: 'Dec 2025'
    })
    
    // Store auth token
    localStorage.setItem('auth_token', response.token)
    
    // Navigate to home
    router.push('/')
  } catch (error) {
    console.error('Signup error:', error)
    setError('email', error.message || 'Registration failed. Email may already be in use.')
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  try {
    console.log('Starting Google Sign-In from Signup...')
    // Supabase OAuth will redirect the browser to Google
    await signInWithGoogle()
  } catch (error) {
    console.error('Google sign-in error:', error)
  }
}
</script>

<script>
import MainLayout from '../../components/layout/MainLayout.vue'
export default {
  components: { MainLayout }
}
</script>
