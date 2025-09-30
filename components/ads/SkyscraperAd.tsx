// components/ads/SkyscraperAd.tsx
interface SkyscraperAdProps {
  position: 'left' | 'right'
  adUnit?: string
}

export function SkyscraperAd({ position, adUnit }: SkyscraperAdProps) {
  return (
    <div className="w-[160px] h-[600px] bg-gray-200 border border-gray-300 flex flex-col items-center justify-center text-xs text-gray-500">
      <div className="text-center p-2">
        <div className="mb-2">Advertisement</div>
        <div className="text-[10px]">160 x 600</div>
        <div className="text-[10px] capitalize">{position} Skyscraper</div>
      </div>
    </div>
  )
}

// components/ads/SidebarRectangleAd.tsx
export function SidebarRectangleAd() {
  return (
    <div className="w-[160px] h-[250px] bg-gray-200 border border-gray-300 flex flex-col items-center justify-center text-xs text-gray-500">
      <div className="text-center p-2">
        <div className="mb-2">Advertisement</div>
        <div className="text-[10px]">160 x 250</div>
        <div className="text-[10px]">Rectangle</div>
      </div>
    </div>
  )
}
