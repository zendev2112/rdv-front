import React from 'react'

interface SidelinesLayoutProps {
  children: React.ReactNode
  leftAd?: React.ReactNode
  rightAd?: React.ReactNode
  overlayAd?: React.ReactNode
  className?: string
  sidelineWidth?: number // percentage instead of px
}

export default function SidelinesLayout({
  children,
  leftAd,
  rightAd,
  overlayAd,
  className = '',
  sidelineWidth = 12, // now represents percentage (12% each side)
}: SidelinesLayoutProps) {
  const stripeStyle: React.CSSProperties = {
    backgroundColor: '#fffdfd', // Plain white instead of #f8f8f8
    minHeight: '100vh',
    flex: `0 0 ${sidelineWidth}%`,
  }

  // Children are rendered ONCE. The side stripes are siblings that only appear
  // at xl+ (desktop). Below xl, the stripes are hidden and the content column
  // takes the full width — identical to the previous mobile/tablet rendering,
  // but without duplicating the entire subtree in the DOM.
  return (
    <div className="relative">
      <div className="xl:flex xl:justify-center">
        {/* Left sideline — desktop only */}
        <div className="hidden xl:block" style={stripeStyle}>
          <div className="sticky top-[80px] p-4 flex justify-center">
            {leftAd}
          </div>
        </div>

        {/* Main content — rendered once */}
        <div
          className={`w-full xl:flex-1 xl:max-w-[1200px] xl:bg-white xl:shadow-sm xl:min-h-screen ${className}`}
        >
          {children}
        </div>

        {/* Right sideline — desktop only */}
        <div className="hidden xl:block" style={stripeStyle}>
          <div className="sticky top-[80px] p-4 flex justify-center">
            {rightAd}
          </div>
        </div>
      </div>

      {/* Overlay Ad Placeholder */}
      {overlayAd && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-100 border-4 border-red-500 p-4">
          <div className="text-center text-red-700 font-bold">
            OVERLAY AD PLACEHOLDER
          </div>
          {overlayAd}
        </div>
      )}
    </div>
  )
}
