// Centralized document upload validation rules.
// Mirrors the strict 2MB requirement requested by product.

export const DOCUMENT_UPLOAD_RULES = {
  maxBytes: 2 * 1024 * 1024, // 2MB
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
}

function extensionLower(name) {
  const s = String(name || '')
  const idx = s.lastIndexOf('.')
  if (idx === -1) return ''
  return s.slice(idx + 1).toLowerCase()
}

export function isAllowedDocumentFile(file, rules = DOCUMENT_UPLOAD_RULES) {
  const mime = String(file?.type || '').toLowerCase()
  if (mime && rules.allowedMimeTypes.includes(mime)) return true

  const ext = extensionLower(file?.name)
  return ext === 'pdf' || ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp'
}

export function getDocumentValidationError(file, rules = DOCUMENT_UPLOAD_RULES) {
  if (!file) return 'No file selected.'

  if (!isAllowedDocumentFile(file, rules)) {
    return 'Only PDF or JPG/PNG/WebP files are allowed.'
  }

  if (Number.isFinite(file.size) && file.size > rules.maxBytes) {
    const mb = (rules.maxBytes / (1024 * 1024)).toFixed(0)
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    return `File too large (${sizeMB}MB). Maximum: ${mb}MB.`
  }

  return null
}
