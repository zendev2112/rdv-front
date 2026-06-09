// Custom next/image loader for Cloudinary.
// Makes every Cloudinary image serve in the optimal format (WebP/AVIF via
// f_auto), with automatic quality (q_auto:good), AT THE WIDTH ACTUALLY
// DISPLAYED (w_<width>, which next/image computes per device). c_limit prevents
// upscaling images smaller than the requested width.
//
// Non-Cloudinary URLs (YouTube, Supabase, La Nación) are returned untouched:
// the loader leaves them alone.

interface LoaderArgs {
  src: string
  width: number
  quality?: number
}

// Is the first segment after /upload/ already a Cloudinary transformation?
// (e.g. "w_1200,c_limit,e_improve"). If so, we replace it so we control the
// sizing ourselves and avoid chained transformations that would re-upscale.
function isTransformation(segment: string): boolean {
  return /(^|,)(w|h|c|f|q|e|ar|dpr|g|b|o|r|fl)_/.test(segment)
}

export default function cloudinaryLoader({ src, width }: LoaderArgs): string {
  if (!src) return src

  // Passthrough: not a Cloudinary URL, so we don't touch it.
  if (!src.includes('res.cloudinary.com') || !src.includes('/upload/')) {
    return src
  }

  const [base, rest] = src.split('/upload/')
  const segments = rest.split('/')

  // If a transformation was already baked into the URL, drop it.
  if (segments.length > 1 && isTransformation(segments[0])) {
    segments.shift()
  }

  const transform = `f_auto,q_auto:good,w_${width},c_limit`
  return `${base}/upload/${transform}/${segments.join('/')}`
}
