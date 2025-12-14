// Google Identity Services helper (GSI)

export async function loadGsi() {
  if (typeof window === 'undefined') return
  if (window.google && window.google.accounts) return window.google

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Failed to load GSI script'))
    document.head.appendChild(script)
  })
}

export async function renderGoogleButton({ clientId, element, callback, type = 'standard' }) {
  const google = await loadGsi()
  if (!google) throw new Error('Google Identity Services not available')

  google.accounts.id.initialize({
    client_id: clientId,
    callback
  })

  google.accounts.id.renderButton(element, {
    theme: 'outline',
    size: 'large',
    type
  })

  // Optionally show One Tap
  // google.accounts.id.prompt()
}

export default { loadGsi, renderGoogleButton }
