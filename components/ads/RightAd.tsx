import { SkyscraperAd, SidebarRectangleAd } from './SkyscraperAd'

export default function RightAd() {
  return (
    <div className="space-y-4">
      <SkyscraperAd position="right" />
      <SidebarRectangleAd />
    </div>
  )
}
