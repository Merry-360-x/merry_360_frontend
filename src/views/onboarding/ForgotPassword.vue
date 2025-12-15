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
        <h2 class="mt-6 text-3xl font-bold text-text-brand-600 dark:text-white">{{ t('auth.forgotPasswordTitle') }}</h2>
        <p class="mt-2 text-text-secondary dark:text-gray-300">{{ t('auth.forgotPasswordSubtitle') }}</p>
      </div>

      <!-- Form -->
      <Card padding="lg" class="animate-slide-in">
        <form v-if="!emailSent" @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-text-brand-600 dark:text-white mb-2">{{ t('auth.emailAddress') }}</label>
            <Input
              v-model="email"
              type="email"
              placeholder="you@example.com"
              :error="error"
              :icon="emailIcon"
            />
          </div>

          <!-- Submit Button -->
          <Button 
            type="submit" 
            variant="primary" 
            size="lg" 
            full-width
            :loading="loading"
          >
            {{ t('auth.resetPassword') }}
          </Button>

          <!-- Back to Login -->
          <div class="text-center">
            <router-link to="/login" class="text-sm text-text-secondary dark:text-gray-400 hover:text-brand-600 inline-flex items-center">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              {{ t('auth.backToLogin') }}
            </router-link>
          </div>
        </form>

        <!-- Success Message -->
        <div v-else class="text-center space-y-4">
          <div class="w-16 h-16 bg-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-text-brand-600 dark:text-white">{{ t('auth.checkEmail') }}</h3>
          <p class="text-text-secondary dark:text-gray-300">
            {{ t('auth.checkEmailDesc') }}<br>
            <span class="font-medium text-text-brand-600 dark:text-white">{{ email }}</span>
          </p>
          <Button variant="primary" size="md" full-width @click="router.push('/login')">
            {{ t('auth.backToLogin') }}
          </Button>
          <button @click="resendEmail" class="text-sm text-brand-600 hover:text-opacity-80 dark:text-brand-400">
            {{ t('auth.resendEmail') }}
          </button>
        </div>
      </Card>
    </div>
  </div>
  </MainLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTranslation } from '../../composables/useTranslation'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'

const router = useRouter()

const email = ref('')
const error = ref('')
const loading = ref(false)
const emailSent = ref(false)

const emailIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`
}

const validateEmail = () => {
  error.value = ''
  
  if (!email.value) {
    error.value = 'Email is required'
    return false
  }
  
  if (!/\S+@\S+\.\S+/.test(email.value)) {
    error.value = 'Email is invalid'
    return false
  }
  
  return true
}

const handleSubmit = async () => {
  if (!validateEmail()) return

  loading.value = true
  
  // Simulate API call
  setTimeout(() => {
    loading.value = false
    emailSent.value = true
  }, 1500)
}

const resendEmail = () => {
  emailSent.value = false
}
</script>

<script>
import MainLayout from '../../components/layout/MainLayout.vue'
export default {
  components: { MainLayout }
}
</script>
