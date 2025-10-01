import React from 'react'

interface SidelinesLayoutProps {
  children: React.ReactNode
  leftAd?: React.ReactNode
  rightAd?: React.ReactNode
  className?: string
  sidelineWidth?: number // new prop in px
}

export default function SidelinesLayout({
  children,
  leftAd,
  rightAd,
  className = '',
  sidelineWidth = 200, // default 200px
}: SidelinesLayoutProps) {
  const stripeStyle: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.05) 2px,
      rgba(0, 0, 0, 0.05) 3px
    )`,
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    width: `${sidelineWidth}px`,
  }

  return (
    <>
      {/* Mobile/Tablet: Normal layout without sidelines */}
      <div className={`xl:hidden ${className}`}>{children}</div>

      {/* Desktop: Layout with sidelines */}
      <div className={`hidden xl:block ${className}`}>
        <div className="flex justify-center">
          {/* Left Sideline */}
          <div className="flex-shrink-0" style={stripeStyle}>
            <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
          </div>

          {/* Main Content */}
          <div className="w-[1200px] bg-white shadow-sm min-h-screen">
            {children}
          </div>

          {/* Right Sideline */}
          <div className="flex-shrink-0" style={stripeStyle}>
            <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
          </div>
        </div>
      </div>
    </>
  )
}
