import AdBanner from './AdBanner'

interface InFeedAdProps {
  imageUrl: string
  href?: string
  alt?: string
}

// House ad — in-feed square (1:1). Renders on mobile AND desktop (it lives in the
// homepage content column, unlike the desktop-only sidelines). Capped and labeled
// per the ad proposal: reserved size so the page never jumps, "PUBLICIDAD" tag,
// image + measured link — no extra load cost. Place it HIGH in the feed (right
// after the hero) so it lands on the first screens of a phone, not the bottom.
export default function InFeedAd({ imageUrl, href, alt = 'Publicidad' }: InFeedAdProps) {
  return (
    <div className="py-6 flex flex-col items-center">
      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-2">
        Publicidad
      </p>
      <div className="w-full max-w-[380px]">
        <AdBanner imageUrl={imageUrl} alt={alt} href={href} width={1024} height={1024} />
      </div>
    </div>
  )
}
