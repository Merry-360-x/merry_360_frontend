<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center justify-center">
          <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-16 w-auto" />
        </router-link>
        <h2 class="mt-6 text-3xl font-bold text-text-brand-600">{{ t('auth.welcomeBack') }}</h2>
        <p class="mt-2 text-text-secondary">{{ t('auth.loginSubtitle') }}</p>
      </div>

      <!-- Login Form -->
      <Card padding="lg">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">{{ t('auth.emailAddress') }}</label>
            <Input
              v-model="formData.email"
              type="email"
              placeholder="you@example.com"
            />
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 mb-2">{{ t('auth.password') }}</label>
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
              <span class="ml-2 text-sm text-text-secondary">{{ t('auth.rememberMe') }}</span>
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
        </form>

        <!-- Social Login -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-text-secondary">{{ t('auth.orSignInWith') }}</span>
          </div>
        </div>

        <Button 
          type="button"
          variant="outline" 
          size="lg" 
          full-width
          @click="handleGoogleSignIn"
          :loading="googleLoading"
          class="flex items-center justify-center gap-3"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {{ t('auth.continueWithGoogle') }}
        </Button>

        <!-- Language Selection -->
        <div class="pt-4">
          <label class="block text-sm font-medium text-text-brand-600 mb-2">Language</label>
          <select v-model="selectedLanguage" class="w-full px-4 py-3 border border-gray-200 rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20 bg-white text-gray-900">
            <option value="en">English</option>
            <option value="rw">Kinyarwanda</option>
            <option value="fr">Français</option>
          </select>
        </div>
      </Card>

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-text-secondary">
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

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const { errors, validateAll, setError, clearErrors } = useFormValidation()
const { t } = useTranslation()

const formData = reactive({
  email: '',
  password: '',
  remember: false
})

const loading = ref(false)
const googleLoading = ref(false)

const handleGoogleSignIn = async () => {
  try {
    console.log('🔵 Google sign-in button clicked')
    googleLoading.value = true
    
    console.log('🔵 Calling signInWithGoogle...')
    await signInWithGoogle()
    
    // Note: If redirect works, code below won't execute
    console.log('🔵 signInWithGoogle completed')
  } catch (err) {
    console.error('❌ Google sign-in error:', err)
    alert(`Google sign-in failed: ${err.message}`)
    googleLoading.value = false
  }
}
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
</script>
