import { computed, ref } from 'vue'

// Tracks active uploads across the whole app (Cloudinary uploads).
// Components should call beginGlobalUpload/endGlobalUpload when starting/finishing an upload.
const activeUploads = ref(0)

export function beginGlobalUpload() {
  activeUploads.value += 1
}

export function endGlobalUpload() {
  activeUploads.value = Math.max(0, activeUploads.value - 1)
}

export const isGlobalUploading = computed(() => activeUploads.value > 0)

export function getActiveUploadCount() {
  return activeUploads.value
}
