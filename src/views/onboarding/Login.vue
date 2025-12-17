<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center justify-center space-x-2">
          <div class="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center">
            <span class="text-white font-bold text-2xl">M</span>
          </div>
          <span class="text-2xl font-bold text-text-brand-600 dark:text-white">{{ t('auth.brandName') }}</span>
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-text-brand-600 dark:text-white">{{ t('auth.welcomeBack') }}</h2>
        <p class="mt-2 text-text-secondary dark:text-gray-300">{{ t('auth.loginSubtitle') }}</p>
      </div>

      <!-- Login Form -->
      <Card padding="lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.emailAddress') }}</label>
            <Input
              v-model="formData.email"
              type="email"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.password') }}</label>
            <Input
              v-model="formData.password"
              type="password"
              placeholder="Enter your password"
            />
            <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input type="checkbox" v-model="formData.remember" class="rounded border-gray-300 text-brand-600 focus:ring-brand-500">
              <span class="ml-2 text-sm text-text-secondary dark:text-gray-300">{{ t('auth.rememberMe') }}</span>
            </label>
            <router-link to="/forgot-password" class="text-sm text-brand-600 hover:text-opacity-80">
              {{ t('auth.forgotPassword') }}
            </router-link>
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            full-width
            :loading="loading"
          >
            {{ t('auth.login') }}
          </Button>

          <!-- Social Login -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-300">{{ t('auth.orSignInWith') }}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              @click.prevent="handleGoogleSignIn" 
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

          <!-- Language Selection -->
          <div class="pt-4">
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">Language</label>
            <select v-model="selectedLanguage" class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
              <option value="en">English</option>
              <option value="rw">Kinyarwanda</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </form>
      </Card>

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-text-secondary dark:text-gray-300">
          {{ t('auth.dontHaveAccount') }}
          <router-link to="/signup" class="text-brand-600 font-medium hover:text-opacity-80 ml-1">
            {{ t('auth.signup') }}
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { useAppStore } from '../../stores/app'
import { useFormValidation } from '../../composables/useFormValidation'
import { useTranslation } from '../../composables/useTranslation'
import { validators } from '../../utils/validation'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import { signIn, signInWithGoogle } from '../../services/auth'
import googleService from '../../services/google'
import mockApiService from '../../services/mockApi'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
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
const formData = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const selectedLanguage = ref('en')

watch(selectedLanguage, (newLang) => {
  appStore.setLanguage(newLang)
})

const validationRules = {
  email: validators.email,
  password: (value) => validators.required(value, 'Password')
}

const handleLogin = async () => {
  // Clear previous errors
  clearErrors()
  
  // Validate form
  const isValid = validateAll(formData, validationRules)
  
  if (!isValid) {
    return
  }

  loading.value = true
  
  try {
    // Use the unified auth service
    const response = await signIn({ email: formData.email, password: formData.password })

    // Login the user in local store
    userStore.login({
      id: response.user.id,
      name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || response.user.email,
      email: response.user.email,
      firstName: response.user.firstName || '',
      lastName: response.user.lastName || '',
      phone: response.user.phone || '',
      role: response.user.role || 'user',
      verified: response.user.verified || false,
      dateOfBirth: '',
      bio: 'Travel enthusiast exploring Rwanda and beyond',
      memberSince: 'Dec 2025'
    })

    // Store auth token
    if (response.token) {
      localStorage.setItem('auth_token', response.token)
    }

    // Navigate based on role
    if (response.user.role === 'admin') {
      router.push('/admin')
    } else if (response.user.role === 'vendor') {
      router.push('/vendor')
    } else {
      router.push('/profile')
    }
  } catch (error) {
    console.error('Login error:', error)
    setError('email', error.message || 'Invalid email or password')
    setError('password', ' ')
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  loading.value = true
  try {
    console.log('Starting Google Sign-In...')
    const response = await signInWithGoogle()
    console.log('Google Sign-In response:', response)
    
    userStore.login({
      id: response.user.id,
      name: `${response.user.firstName || ''} ${response.user.lastName || ''}`.trim() || response.user.email,
      email: response.user.email,
      firstName: response.user.firstName || response.user.displayName || '',
      lastName: response.user.lastName || '',
      phone: response.user.phone || '',
      role: 'user',
      verified: true
    })
    if (response.token) localStorage.setItem('auth_token', response.token)
    router.push('/profile')
  } catch (error) {
    console.error('Google sign-in error:', error)
    setError('email', error.message || 'Failed to sign in with Google. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>
