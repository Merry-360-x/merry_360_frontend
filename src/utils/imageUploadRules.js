// Centralized image upload validation rules.
// Keep images small to avoid slow uploads and sluggish UX.

export const IMAGE_UPLOAD_RULES = {
  // Hard limit for the final image we upload/store.
  maxBytes: 2 * 1024 * 1024, // 2MB

  // If a user selects something enormous, fail fast.
  maxInputBytes: 2 * 1024 * 1024, // 2MB

  // Only allow common web-safe formats.
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}

export function formatBytes(bytes) {
  const n = Number(bytes)
  if (!Number.isFinite(n)) return '0B'
  if (n < 1024) return `${n}B`
  const kb = n / 1024
  if (kb < 1024) return `${kb.toFixed(1)}KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)}MB`
}

function extensionLower(name) {
  const s = String(name || '')
  const idx = s.lastIndexOf('.')
  if (idx === -1) return ''
  return s.slice(idx + 1).toLowerCase()
}

export function isAllowedImageFile(file, rules = IMAGE_UPLOAD_RULES) {
  const mime = String(file?.type || '').toLowerCase()
  if (mime && rules.allowedMimeTypes.includes(mime)) return true

  // Some browsers/flows provide empty mime types; fall back to extension.
  const ext = extensionLower(file?.name)
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp'
}

export function getImageValidationError(file, rules = IMAGE_UPLOAD_RULES) {
  if (!file) return 'No file selected.'

  if (!isAllowedImageFile(file, rules)) {
    return 'Only JPG, PNG, or WebP images are allowed.'
  }

  if (Number.isFinite(file.size) && file.size > rules.maxInputBytes) {
    return `File too large (${formatBytes(file.size)}). Please choose an image under ${formatBytes(rules.maxInputBytes)}.`
  }

  return null
}

export function getFinalImageSizeError(file, rules = IMAGE_UPLOAD_RULES) {
  if (!file) return 'No file selected.'

  if (Number.isFinite(file.size) && file.size > rules.maxBytes) {
    return `Image is still too large after optimization (${formatBytes(file.size)}). Please compress it under ${formatBytes(rules.maxBytes)}.`
  }

  return null
}
