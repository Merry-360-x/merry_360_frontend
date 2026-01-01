// Client-side image optimization helpers (resize + compress)

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality)
  })
}

function renameWithExtension(filename, mimeType) {
  const ext = mimeType === 'image/webp' ? 'webp' : 'jpg'
  const base = filename.replace(/\.[^.]+$/, '')
  return `${base}.${ext}`
}

async function decodeToImageBitmap(file) {
  // createImageBitmap is fastest when available
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file)
    return { bitmap, width: bitmap.width, height: bitmap.height, close: () => bitmap.close?.() }
  }

  // Fallback: HTMLImageElement
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image()
      el.onload = () => resolve(el)
      el.onerror = reject
      el.src = url
    })
    return {
      bitmap: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => {}
    }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function pickOutputMimeType(inputType) {
  // Preserve alpha where possible by preferring webp for png.
  if (inputType === 'image/png') return 'image/webp'
  if (inputType === 'image/webp') return 'image/webp'
  return 'image/jpeg'
}

export async function optimizeImageFile(
  file,
  {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.82,
    minSavingsRatio = 0.95
  } = {}
) {
  if (!file || !file.type?.startsWith('image/')) return file

  const decoded = await decodeToImageBitmap(file)
  try {
    const scale = Math.min(1, maxWidth / decoded.width, maxHeight / decoded.height)

    // If we are not resizing and the file is already reasonably small, skip work.
    if (scale === 1 && file.size <= 600 * 1024) {
      return file
    }

    const targetWidth = Math.max(1, Math.round(decoded.width * scale))
    const targetHeight = Math.max(1, Math.round(decoded.height * scale))

    const canvas = document.createElement('canvas')
    canvas.width = targetWidth
    canvas.height = targetHeight

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return file

    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // drawImage works with both ImageBitmap and HTMLImageElement
    ctx.drawImage(decoded.bitmap, 0, 0, targetWidth, targetHeight)

    const preferredType = pickOutputMimeType(file.type)

    // Try preferred type; fallback to jpeg if unsupported.
    let blob = await canvasToBlob(canvas, preferredType, quality)
    let outType = preferredType

    if (!blob && preferredType !== 'image/jpeg') {
      blob = await canvasToBlob(canvas, 'image/jpeg', quality)
      outType = 'image/jpeg'
    }

    if (!blob) return file

    // If optimization didn't meaningfully reduce size, keep original.
    if (blob.size >= file.size * minSavingsRatio) {
      return file
    }

    return new File([blob], renameWithExtension(file.name || 'image', outType), {
      type: outType,
      lastModified: Date.now()
    })
  } catch (e) {
    return file
  } finally {
    decoded.close?.()
  }
}

export async function fileToDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}
