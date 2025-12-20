<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center justify-center">
          <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-20 w-auto drop-shadow-lg" />
        </router-link>
        <h2 class="mt-6 text-4xl font-bold text-gray-900">Welcome Back</h2>
        <p class="mt-2 text-gray-600">Sign in to continue your journey</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Error Alert -->
        <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-sm text-red-800">{{ errorMessage }}</p>
        </div>

        <!-- Email/Password Form -->
        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              v-model="email"
              type="email"
              required
              placeholder="your@email.com"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              v-model="password"
              type="password"
              required
              placeholder="Enter your password"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-brand-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign In</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <!-- Google Sign In -->
        <button
          @click="handleGoogleSignIn"
          :disabled="googleLoading"
          class="w-full flex items-center justify-center gap-3 border-2 border-gray-300 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
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

      <!-- Sign Up Link -->
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          Don't have an account?
          <router-link to="/signup" class="text-brand-600 font-semibold hover:text-brand-700 ml-1">
            Sign Up
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

const email = ref('')
const password = ref('')
const loading = ref(false)
const googleLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter email and password'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error

    // Get user profile from database
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    // Update user store
    userStore.login({
      id: data.user.id,
      email: data.user.email,
      name: profile ? `${profile.first_name} ${profile.last_name}` : data.user.email,
      firstName: profile?.first_name || '',
      lastName: profile?.last_name || '',
      phone: profile?.phone || '',
      role: profile?.role || 'user',
      verified: true
    })

    // Store auth token
    if (data.session?.access_token) {
      localStorage.setItem('auth_token', data.session.access_token)
    }

    // Navigate based on role
    const isAdmin = data.user.email === 'admin@merry360x.com' || data.user.email === 'bebisdavy@gmail.com'
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/profile')
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Invalid email or password. Please try again.'
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  googleLoading.value = true
  errorMessage.value = ''

  try {
    console.log('🔵 Google sign-in initiated')
    
    // Use production URL for OAuth redirect
    const redirectUrl = window.location.hostname === 'localhost' 
      ? 'http://localhost:5173/auth/callback'
      : 'https://merry-360-frontend.vercel.app/auth/callback'
    
    console.log('Redirect URL:', redirectUrl)
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    })

    if (error) {
      console.error('❌ OAuth error:', error)
      throw error
    }

    console.log('✅ OAuth data received:', data)

    // Redirect to Google
    if (data?.url) {
      console.log('🔗 Redirecting to:', data.url)
      window.location.href = data.url
    } else {
      throw new Error('No OAuth URL returned from Supabase')
    }
  } catch (error) {
    console.error('❌ Google sign-in error:', error)
    errorMessage.value = error.message || 'Failed to sign in with Google. Please check your internet connection and try again.'
    googleLoading.value = false
  }
}
</script>
