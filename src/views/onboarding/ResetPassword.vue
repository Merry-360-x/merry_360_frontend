<template>
  <MainLayout>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div class="max-w-md w-full">
        <div class="text-center mb-8">
          <router-link to="/" class="inline-flex items-center justify-center">
            <img loading="lazy" src="/merry-360-logo.png" alt="Merry360X" class="h-16 w-auto" />
          </router-link>
          <h2 class="mt-6 text-3xl font-bold text-text-brand-600">Reset Password</h2>
          <p class="mt-2 text-text-secondary">Set a new password for your account.</p>
        </div>

        <Card padding="lg">
          <div v-if="!ready" class="text-text-secondary text-sm">
            Loading…
          </div>

          <div v-else-if="!hasRecoverySession" class="space-y-4">
            <p class="text-text-secondary">
              This reset link is invalid or expired. Please request a new password reset email.
            </p>
            <Button variant="primary" size="lg" full-width @click="router.push('/forgot-password')">
              Request new reset link
            </Button>
          </div>

          <form v-else @submit.prevent="handleUpdate" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-text-brand-600 mb-2">New Password</label>
              <Input v-model="password" type="password" placeholder="Enter new password" :error="error" />
            </div>

            <div>
              <label class="block text-sm font-medium text-text-brand-600 mb-2">Confirm New Password</label>
              <Input v-model="confirm" type="password" placeholder="Confirm new password" :error="error" />
            </div>

            <Button type="submit" variant="primary" size="lg" full-width :loading="loading">
              Update password
            </Button>

            <div v-if="success" class="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">
              Password updated. You can now log in.
            </div>
          </form>
        </Card>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../../components/layout/MainLayout.vue'
import Card from '../../components/common/Card.vue'
import Input from '../../components/common/Input.vue'
import Button from '../../components/common/Button.vue'
import { supabase } from '../../services/supabase'

const router = useRouter()

const ready = ref(false)
const hasRecoverySession = ref(false)

const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

onMounted(async () => {
  try {
    const { data } = await supabase.auth.getSession()
    hasRecoverySession.value = Boolean(data?.session)

    // In Supabase recovery flow, this page is loaded after redirectTo.
    // If the session isn't available yet, the user needs a fresh link.
  } finally {
    ready.value = true
  }
})

const handleUpdate = async () => {
  error.value = ''
  success.value = false

  if (!password.value || password.value.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    const { error: updateError } = await supabase.auth.updateUser({ password: password.value })
    if (updateError) throw updateError

    success.value = true

    // Sign out to force fresh login
    await supabase.auth.signOut().catch(() => {})

    setTimeout(() => {
      router.push('/login')
    }, 700)
  } catch (err) {
    console.error('Reset password error:', err)
    error.value = err?.message || 'Failed to update password'
  } finally {
    loading.value = false
  }
}
</script>
