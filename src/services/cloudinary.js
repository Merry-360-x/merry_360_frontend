export async function uploadToCloudinary(file, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

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
  // Images are kept small to avoid slow uploads and laggy pages.
  const maxSize = isVideo ? 100 * 1024 * 1024 : 2 * 1024 * 1024 // 100MB for video, 2MB for images
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxMB = isVideo ? '100MB' : '2MB'
    throw new Error(`File size (${sizeMB}MB) exceeds maximum allowed size (${maxMB}). Please compress before uploading.`)
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  // Apply compression transformations
  if (!isVideo) {
    formData.append('quality', 'auto:eco') // Eco quality for images
    formData.append('fetch_format', 'auto') // Auto format (WebP when supported)
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
    const data = await response.json()
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  const data = await response.json()
  return data
}

// Upload PDFs and other non-image documents to Cloudinary.
// Uses resource type 'raw' for PDFs and keeps images as 'image'.
export async function uploadDocumentToCloudinary(file, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

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
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  const data = await response.json()
  return data
}

export default { uploadToCloudinary, uploadDocumentToCloudinary }
