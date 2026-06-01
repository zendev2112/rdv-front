export const imageTransforms = {
  // Main article images — dpr_auto removed (causes 2400px images on 2x DPR devices), q_auto:good reduces file size ~35%
  hq: 'w_1200,c_limit,e_improve,q_auto:good,f_auto',

  // Carousel — q_auto:good sufficient for carousel thumbnails
  carousel: 'w_1000,c_limit,e_upscale,e_improve,q_auto:good,f_auto,ar_16:9',

  // Thumbnail — already good
  thumbnail: 'w_400,h_300,c_fill,e_improve,q_auto:good,f_auto',

  // Mobile responsive images
  responsive: 'w_828,c_limit,e_improve,q_auto:good,f_auto',

  // Enhancement variants — dpr_auto removed across the board
  aggressive: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:800,e_contrast:30,e_saturation:20,q_auto:best,f_auto',

  superAggressive: 'w_1200,c_limit,e_upscale:400,e_improve,e_sharpen:1200,e_contrast:50,e_saturation:30,e_modulate:110,q_auto:best,f_auto',

  denoise: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:600,e_blur:300,q_auto:best,f_auto',

  colorRestore: 'w_1200,c_limit,e_upscale,e_improve,e_saturation:40,e_modulate:120,e_contrast:20,q_auto:best,f_auto',

  detailBoost: 'w_1200,c_limit,e_upscale,e_improve,e_sharpen:1000,e_contrast:25,e_modulate:105,q_auto:best,f_auto',
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