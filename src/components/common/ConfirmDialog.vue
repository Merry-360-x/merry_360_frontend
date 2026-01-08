<template>
  <Teleport to="body">
    <div
      v-if="confirmState.open"
      class="fixed inset-0 z-[200] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      @mousedown.self="onCancel"
    >
      <button
        class="absolute inset-0 bg-black/50"
        type="button"
        aria-label="Close"
        @click="onCancel"
      />

    <div class="relative w-full max-w-md mx-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
          <h3 class="text-base font-semibold text-text-primary">
            {{ confirmState.title }}
          </h3>
        </div>

        <div class="px-5 py-4">
          <p class="text-sm text-text-secondary whitespace-pre-wrap">
            {{ confirmState.message }}
          </p>
        </div>

        <div class="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-end gap-2">
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold border border-gray-300 dark:border-gray-600 text-text-secondary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="onCancel"
          >
            {{ confirmState.cancelText }}
          </button>
          <button
            type="button"
            class="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
            @click="onConfirm"
          >
            {{ confirmState.confirmText }}
          </button>
        </div>
      </div>
    </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onBeforeUnmount, watch } from 'vue'
import { useConfirm } from '../../composables/useConfirm'

const { state, onConfirm, onCancel } = useConfirm()

const confirmState = computed(() => state)

// Prevent body scroll when dialog is open
watch(() => confirmState.value.open, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

// Cleanup on unmount
onBeforeUnmount(() => {
  document.body.style.overflow = ''
})
</script>
