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
    backgroundColor: '#fffdfd', // ✅ Plain white instead of #f8f8f8
    minHeight: '100vh',
    flex: `0 0 ${sidelineWidth}%`,
  }

  return (
    <div className="relative">
      <>
        {/* Mobile/Tablet: Normal layout without sidelines */}
        <div className={`xl:hidden ${className}`}>{children}</div>

        {/* Desktop: Layout with responsive sidelines */}
        <div className={`hidden xl:flex justify-center ${className}`}>
          {/* Left Sideline - Responsive */}
          <div style={stripeStyle}>
            <div className="sticky top-[180px] p-4">{leftAd}</div>
          </div>

          {/* Main Content - Responsive */}
          <div className="flex-1 bg-white shadow-sm min-h-screen max-w-[1200px]">
            {children}
          </div>

          {/* Right Sideline - Responsive */}
          <div style={stripeStyle}>
            <div className="sticky top-[180px] p-4">{rightAd}</div>
          </div>
        </div>
      </>

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
