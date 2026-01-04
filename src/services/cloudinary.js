export async function uploadToCloudinary(file, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

  // Detect if file is video
  const isVideo = file.type?.startsWith('video/')
  
  // Validate file size - different limits for images vs videos
  const maxSize = isVideo ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB for video, 10MB for images
  if (file.size > maxSize) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2)
    const maxMB = isVideo ? '100MB' : '10MB'
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

  // Use appropriate resource type
  const resourceType = isVideo ? 'video' : 'image'
  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error?.message || 'Cloudinary upload failed')
  }

  const data = await response.json()
  return data
}

export default { uploadToCloudinary }
