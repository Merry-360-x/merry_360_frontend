function getCloudinaryConfig() {
  const cloudName = String(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '').trim()
  const uploadPreset = String(import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '').trim()

  if (!cloudName || !uploadPreset) {
    throw new Error('Uploads are not configured yet. Please try again later.')
  }

  return { cloudName, uploadPreset }
}

async function readErrorMessage(response) {
  try {
    const data = await response.json()
    return data?.error?.message || ''
  } catch {
    try {
      const text = await response.text()
      return String(text || '').slice(0, 300)
    } catch {
      return ''
    }
  }
}

function toUserMessage(rawMessage, { status } = {}) {
  const message = String(rawMessage || '').trim()
  const lower = message.toLowerCase()

  if (!message) return 'Upload failed. Please try again.'

  if (status === 401) {
    return 'Uploads are not enabled yet. Please try again later.'
  }

  // Common Cloudinary configuration errors (keep non-technical wording).
  if (lower.includes('upload preset') && (lower.includes('not found') || lower.includes('invalid') || lower.includes('must be specified'))) {
    return 'Uploads are not enabled yet. Please try again later.'
  }
  if (lower.includes('unsigned') && lower.includes('disabled')) {
    return 'Uploads are not enabled yet. Please try again later.'
  }
  if (lower.includes('must supply') && (lower.includes('api_key') || lower.includes('api key'))) {
    return 'Uploads are not enabled yet. Please try again later.'
  }
  if (status === 413 || lower.includes('file size') || lower.includes('too large')) {
    return 'This file is too large. Please choose a smaller file.'
  }

  // Avoid leaking technical details to end users.
  if (/(cors|preflight|network error|failed to fetch)/i.test(message)) {
    return 'Network error while uploading. Please check your connection and try again.'
  }

  return message
}

export async function uploadToCloudinary(file, options = {}) {
  const { cloudName, uploadPreset } = getCloudinaryConfig()

  // Detect if file is video
  const isVideo = file.type?.startsWith('video/')

  // Basic type validation
  if (!isVideo) {
    const allowed = new Set(['image/jpeg', 'image/png', 'image/webp'])
    const mime = String(file.type || '').toLowerCase()
    if (mime && !allowed.has(mime)) {
      throw new Error('Only JPG, PNG, or WebP images are allowed.')
    }
  }
  
  // Validate file size - different limits for images vs videos
  // Allow larger images (up to 10MB) - Cloudinary will compress them server-side
  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for images
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxMB = isVideo ? '100MB' : '10MB'
    throw new Error(`File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}).`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  // Apply compression transformations for images
  // Cloudinary will compress large images server-side for fast delivery
  if (!isVideo) {
    // Eager transformation: compress on upload for faster subsequent access
    formData.append('eager', 'q_auto:eco,f_auto,w_1920,c_limit')
    formData.append('eager_async', 'true')
  }
  
  if (options.folder) {
    formData.append('folder', options.folder)
  }

  // Avoid indefinite hangs (network/TLS/CORS). Default shorter timeout for images.
  const timeoutMs =
    typeof options.timeoutMs === 'number'
      ? options.timeoutMs
      : isVideo
        ? 90_000
        : 30_000

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  // Use appropriate resource type
  const resourceType = isVideo ? 'video' : 'image'
  let response
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Cloudinary upload timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const rawMessage = await readErrorMessage(response)
    throw new Error(toUserMessage(rawMessage || 'Cloudinary upload failed', { status: response.status }))
  }

  const data = await response.json()
  return data
}

// Upload PDFs and other non-image documents to Cloudinary.
// Uses resource type 'raw' for PDFs and keeps images as 'image'.
export async function uploadDocumentToCloudinary(file, options = {}) {
  const { cloudName, uploadPreset } = getCloudinaryConfig()

  const mime = String(file?.type || '').toLowerCase()
  const isImage = mime.startsWith('image/')
  const isPdf = mime === 'application/pdf'

  if (!isImage && !isPdf) {
    throw new Error('Only images or PDF documents are allowed.')
  }

  const maxSize = typeof options.maxSizeBytes === 'number' ? options.maxSizeBytes : 10 * 1024 * 1024
  if (file?.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxMB = (maxSize / (1024 * 1024)).toFixed(0)
    throw new Error(`File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}MB). Please compress before uploading.`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  if (options.folder) {
    formData.append('folder', options.folder)
  }

  const timeoutMs = typeof options.timeoutMs === 'number' ? options.timeoutMs : 45_000
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  const resourceType = isImage ? 'image' : 'raw'
  let response
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
      method: 'POST',
      body: formData,
      signal: controller.signal
    })
  } catch (err) {
    if (err?.name === 'AbortError') {
      throw new Error('Cloudinary upload timed out. Please try again.')
    }
    throw err
  } finally {
    clearTimeout(timeoutId)
  }

  if (!response.ok) {
    const rawMessage = await readErrorMessage(response)
    throw new Error(toUserMessage(rawMessage || 'Cloudinary upload failed', { status: response.status }))
  }

  const data = await response.json()
  return data
}

export default { uploadToCloudinary, uploadDocumentToCloudinary }
