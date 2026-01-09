<template>
  <div class="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center justify-center">
          <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-20 w-auto drop-shadow-lg" />
        </router-link>
        <h2 class="mt-6 text-4xl font-bold text-gray-900 dark:text-white">Create Account</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Join us to start your journey</p>
      </div>

      <!-- Welcome Bonus Banner -->
      <div class="mb-6 p-4 bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl text-white text-center">
        <div class="flex items-center justify-center gap-2 mb-1">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
          </svg>
          <span class="font-bold">Welcome Bonus!</span>
        </div>
        <p class="text-sm opacity-90">Get <strong>10 Loyalty Points</strong> when you sign up!</p>
      </div>

      <!-- Signup Card -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p class="text-sm text-red-800 dark:text-red-200">{{ errorMessage }}</p>
        </div>

        <!-- Success Alert -->
        <div v-if="successMessage" class="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
          <p class="text-sm text-green-800 dark:text-green-200">{{ successMessage }}</p>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="handleSignup" class="space-y-5">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">First Name *</label>
              <input
                v-model="firstName"
                type="text"
                required
                placeholder="John"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Last Name *</label>
              <input
                v-model="lastName"
                type="text"
                required
                placeholder="Doe"
                class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Email Address *</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number *</label>
            <input
              v-model="phone"
              type="tel"
              required
              placeholder="+250 7XX XXX XXX"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Password *</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="At least 6 characters"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password *</label>
            <input
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Re-enter your password"
              class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-brand-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Creating Account...</span>
            <span v-else>Sign Up & Earn 10 Points</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        <!-- Google Sign Up -->
        <button
          @click="handleGoogleSignUp"
          :disabled="googleLoading"
          class="w-full flex items-center justify-center gap-3 border-2 border-gray-300 dark:border-gray-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 text-gray-900 dark:text-white"
        >
          <svg class="w-6 h-6" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span v-if="googleLoading">Connecting...</span>
          <span v-else>Continue with Google</span>
        </button>
      </div>

      <!-- Sign In Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600 dark:text-gray-400">
          Already have an account?
          <router-link to="/login" class="text-brand-600 dark:text-brand-400 font-semibold hover:text-brand-700 dark:hover:text-brand-500 ml-1">
            Sign In
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { supabase } from '../../services/supabase'

const router = useRouter()
const userStore = useUserStore()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const WELCOME_BONUS_POINTS = 10

const handleSignup = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  // Validation
  if (!firstName.value || !lastName.value || !email.value || !phone.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match'
    return
  }

  loading.value = true

  try {
    // 1. Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          first_name: firstName.value,
          last_name: lastName.value,
          phone: phone.value
        }
      }
    })

    if (authError) throw authError

    // 2. Create profile with 10 welcome bonus points
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          phone: phone.value,
          role: 'user',
          loyalty_points: WELCOME_BONUS_POINTS, // 10 welcome bonus points
          loyalty_tier: 'bronze',
          created_at: new Date().toISOString()
        })

      // Profile created

      // Update user store with loyalty points
      await userStore.login({
        id: authData.user.id,
        email: authData.user.email,
        name: `${firstName.value} ${lastName.value}`,
        firstName: firstName.value,
        lastName: lastName.value,
        phone: phone.value,
        role: 'user',
        verified: true
      })

      // Add welcome bonus points to store
      userStore.addLoyaltyPoints(WELCOME_BONUS_POINTS)

      // Store auth token
      if (authData.session?.access_token) {
        localStorage.setItem('auth_token', authData.session.access_token)
      }

      successMessage.value = `Account created! You earned ${WELCOME_BONUS_POINTS} bonus points! Redirecting...`
      
      // Redirect to profile after short delay to complete profile if needed
      setTimeout(() => {
        router.push('/profile')
      }, 2000)
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to create account. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleGoogleSignUp = async () => {
  googleLoading.value = true
  errorMessage.value = ''

  try {
    const redirectUrl = `${window.location.origin}/auth/callback`
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })

    if (error) throw error

    if (data?.url) {
      window.location.href = data.url
    } else {
      throw new Error('No OAuth URL returned from Supabase')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Failed to sign up with Google. Please check your internet connection and try again.'
    googleLoading.value = false
  }
}
</script>
