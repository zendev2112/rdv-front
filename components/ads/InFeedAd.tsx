import AdBanner from './AdBanner'

// House ad — in-feed square (1:1). Renders on mobile AND desktop (it lives in the
// homepage content column, unlike the desktop-only sidelines). Capped and labeled
// per the ad proposal: reserved size so the page never jumps, "PUBLICIDAD" tag,
// image + measured link — no extra load cost.
const AD_URL =
  'https://res.cloudinary.com/dptdloagw/image/upload/v1784803682/mayorista-juan-huevos_lhjeit.jpg'

// The flyer's own contact number — a click goes straight to WhatsApp.
const AD_HREF = 'https://wa.me/5492923651823'

export default function InFeedAd() {
  return (
    <div className="py-6 flex flex-col items-center">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">
        Publicidad
      </p>
      <div className="w-full max-w-[380px]">
        <AdBanner
          imageUrl={AD_URL}
          alt="Mayorista Juan Huevos — venta por mayor en Coronel Suárez"
          href={AD_HREF}
          width={1024}
          height={1024}
        />
      </div>
    </div>
  )
}
