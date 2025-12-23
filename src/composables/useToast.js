import { ref } from 'vue'

const toasts = ref([])
let toastId = 0

export function useToast() {
  const addToast = (message, type = 'success', duration = 3000) => {
    const id = toastId++
    const toast = {
      id,
      message,
      type,
      duration,
      visible: true
    }
    
    toasts.value.push(toast)
    
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }
  
  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }
  
  const success = (message, duration) => {
    return addToast(message, 'success', duration)
  }
  
  const error = (message, duration) => {
    return addToast(message, 'error', duration)
  }
  
  const warning = (message, duration) => {
    return addToast(message, 'warning', duration)
  }
  
  const info = (message, duration) => {
    return addToast(message, 'info', duration)
  }

  // Backwards-compatible API used across the app
  // showToast(message, type?, duration?)
  const showToast = (message, type = 'success', duration = 3000) => {
    return addToast(message, type, duration)
  }
  
  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    showToast
  }
}
