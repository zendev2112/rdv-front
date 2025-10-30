export const imageTransforms = {
  // ✅ HIGH QUALITY WITH AI UPSCALING: For main article images
  hq: 'w_1200,c_limit,e_upscale,e_improve,q_auto:best,f_auto,dpr_auto',

  // ✅ CAROUSEL: Optimized with AI enhancement
  carousel: 'w_1000,c_limit,e_upscale,e_improve,q_auto:best,f_auto,ar_16:9',

  // ✅ THUMBNAIL: For related articles with improvement
  thumbnail: 'w_400,h_300,c_fill,e_improve,q_auto:good,f_auto',

  // ✅ RESPONSIVE: Mobile with AI upscaling
  responsive: 'w_800,c_limit,e_upscale,e_improve,q_auto:best,f_auto',

  // ✅ AGGRESSIVE: For extremely poor quality images
  aggressive: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:800,e_contrast:30,e_saturation:20,q_auto:best,f_auto,dpr_auto',

  // ✅ SUPER AGGRESSIVE: Maximum enhancement for horrible quality
  superAggressive: 'w_1200,c_limit,e_upscale:400,e_improve,e_sharpen:1200,e_contrast:50,e_saturation:30,e_modulate:110,q_auto:best,f_auto,dpr_auto',

  // ✅ NOISE REDUCTION: For grainy/noisy images
  denoise: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:600,e_blur:300,q_auto:best,f_auto,dpr_auto',

  // ✅ COLOR RESTORATION: For faded/washed out images
  colorRestore: 'w_1200,c_limit,e_upscale,e_improve,e_saturation:40,e_modulate:120,e_contrast:20,q_auto:best,f_auto,dpr_auto',

  // ✅ DETAIL ENHANCEMENT: For low detail images
  detailBoost: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:1000,e_contrast:25,e_modulate:105,q_auto:best,f_auto,dpr_auto',
}

export function applyCloudinaryTransform(
  url: string,
  transform: 'hq' | 'carousel' | 'thumbnail' | 'responsive' | 'aggressive' | 'superAggressive' | 'denoise' | 'colorRestore' | 'detailBoost'
): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const parts = url.split('/upload/')
  if (parts.length !== 2) return url

  return `${parts[0]}/upload/${imageTransforms[transform]}/${parts[1]}`
}