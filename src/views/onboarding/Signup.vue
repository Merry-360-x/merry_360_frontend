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

        <div id="googleSignInButton" class="flex justify-center"></div>
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
  if (!googleClientId) return
  
  try {
    // Load Google Identity Services library
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredentialResponse
      })
      
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        { 
          theme: 'outline', 
          size: 'large',
          width: 300,
          text: 'signup_with'
        }
      )
    }
  } catch (err) {
    console.error('Failed to load Google Sign-In', err)
  }
})

const handleGoogleCredentialResponse = async (response) => {
  try {
    const idToken = response.credential
    const profile = JSON.parse(atob(idToken.split('.')[1]))
    
    userStore.login({
      id: profile.sub,
      name: profile.name || profile.email,
      email: profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
      phone: '',
      role: 'user',
      verified: true
    })
    
    localStorage.setItem('auth_token', idToken)
    router.push('/profile')
  } catch (err) {
    console.error('Google sign-up error', err)
  }
}

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
</script>

<script>
import MainLayout from '../../components/layout/MainLayout.vue'
export default {
  components: { MainLayout }
}
</script>
