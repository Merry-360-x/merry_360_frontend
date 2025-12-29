export async function uploadToCloudinary(file, options = {}) {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary is not configured (VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET)')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)

  if (options.folder) {
    formData.append('folder', options.folder)
  }

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
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
