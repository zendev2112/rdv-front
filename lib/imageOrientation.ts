export type ImageOrientation = 'portrait' | 'landscape' | 'square'

/**
 * Detect image orientation from URL
 * Returns orientation based on Cloudinary metadata or image dimensions
 */
export function detectImageOrientation(
  url: string
): ImageOrientation {
  if (!url) return 'landscape'

  try {
    // If URL has width/height in transformation, use that
    if (url.includes('w_') && url.includes('h_')) {
      const widthMatch = url.match(/w_(\d+)/)
      const heightMatch = url.match(/h_(\d+)/)

      if (widthMatch && heightMatch) {
        const width = parseInt(widthMatch[1])
        const height = parseInt(heightMatch[1])

        if (width === height) return 'square'
        if (height > width) return 'portrait'
        return 'landscape'
      }
    }

    // Fallback: assume landscape for most images
    return 'landscape'
  } catch (e) {
    return 'landscape'
  }
}

/**
 * Get CSS classes based on orientation
 */
export function getOrientationClasses(
  orientation: ImageOrientation
): string {
  switch (orientation) {
    case 'portrait':
      return 'h-[70vh] md:h-[80vh] w-auto max-w-full'
    case 'square':
      return 'h-[50vh] md:h-[60vh] w-auto max-w-full'
    case 'landscape':
    default:
      return 'h-[40vh] md:h-[60vh] w-full'
  }
}