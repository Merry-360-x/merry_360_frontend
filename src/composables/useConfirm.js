import { reactive, readonly } from 'vue'

const state = reactive({
  open: false,
  message: '',
  title: 'Confirm',
  confirmText: 'OK',
  cancelText: 'Cancel',
  resolve: null
})

export function confirmDialog(message, options = {}) {
  return new Promise((resolve) => {
    // If a confirm is already open, treat it as cancelled.
    if (state.open && typeof state.resolve === 'function') {
      try {
        state.resolve(false)
      } catch {
        // ignore
      }
    }

    state.open = true
    state.message = String(message ?? '')
    state.title = options.title || 'Confirm'
    state.confirmText = options.confirmText || 'OK'
    state.cancelText = options.cancelText || 'Cancel'
    state.resolve = resolve
  })
}

export function useConfirm() {
  const close = (value) => {
    const resolver = state.resolve
    state.open = false
    state.resolve = null

    if (typeof resolver === 'function') {
      resolver(Boolean(value))
    }
  }

  const onConfirm = () => close(true)
  const onCancel = () => close(false)

  return {
    state: readonly(state),
    confirm: confirmDialog,
    onConfirm,
    onCancel
  }
}
