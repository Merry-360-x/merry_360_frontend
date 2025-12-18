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
        </form>

        <!-- Social Login -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-text-secondary dark:text-gray-300">{{ t('auth.orSignInWith') }}</span>
          </div>
        </div>

        <div id="googleSignInButton" class="flex justify-center"></div>

        <!-- Language Selection -->
        <div class="pt-4">
          <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">Language</label>
          <select v-model="selectedLanguage" class="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-button focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-opacity-20 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <option value="en">English</option>
            <option value="rw">Kinyarwanda</option>
            <option value="fr">Français</option>
          </select>
        </div>
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
import { setUserProfile } from '../../services/supabase'
import googleService from '../../services/google'
import mockApiService from '../../services/mockApi'

const router = useRouter()
const userStore = useUserStore()
const appStore = useAppStore()
const { errors, validateAll, setError, clearErrors } = useFormValidation()
const { t } = useTranslation()

const googleClientId = '270563800148-mafsbml3i6h01gjeo7qdlruc75a1s63i.apps.googleusercontent.com'

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
          text: 'signin_with'
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
    
    // Check if this is the admin email
    const isAdmin = profile.email === 'admin@merry360x.com' || profile.email === 'bebisdavy@gmail.com'
    
    const userData = {
      id: profile.sub,
      name: profile.name || profile.email,
      email: profile.email,
      firstName: profile.given_name || '',
      lastName: profile.family_name || '',
      phone: '',
      role: isAdmin ? 'admin' : 'user',
      verified: true
    }
    
    // Save to local store
    userStore.login(userData)
    localStorage.setItem('auth_token', idToken)
    
    // Save profile to Supabase
    try {
      await setUserProfile(profile.sub, {
        email: profile.email,
        first_name: profile.given_name || '',
        last_name: profile.family_name || '',
        full_name: profile.name || '',
        avatar_url: profile.picture || '',
        role: isAdmin ? 'admin' : 'user',
        loyalty_points: 0,
        loyalty_tier: 'bronze',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    } catch (dbError) {
      console.warn('Failed to save profile to Supabase:', dbError)
      // Continue anyway - user is logged in locally
    }
    
    // Redirect based on role
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/profile')
    }
  } catch (err) {
    console.error('Google sign-in error', err)
    setError('email', 'Failed to sign in with Google')
  }
}

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
</script>
