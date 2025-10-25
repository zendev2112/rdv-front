import React from 'react'

interface SidelinesLayoutProps {
  children: React.ReactNode
  leftAd?: React.ReactNode
  rightAd?: React.ReactNode
  className?: string
  sidelineWidth?: number // percentage instead of px
}

export default function SidelinesLayout({
  children,
  leftAd,
  rightAd,
  className = '',
  sidelineWidth = 12, // now represents percentage (12% each side)
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
    flex: `0 0 ${sidelineWidth}%`, // ✅ Use percentage instead of fixed px
  }

  return (
    <>
      {/* Mobile/Tablet: Normal layout without sidelines */}
      <div className={`xl:hidden ${className}`}>{children}</div>

      {/* Desktop: Layout with responsive sidelines */}
      <div className={`hidden xl:flex justify-center ${className}`}>
        {/* Left Sideline - Responsive */}
        <div style={stripeStyle}>
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>

        {/* Main Content - Responsive */}
        <div className="flex-1 bg-white shadow-sm min-h-screen max-w-[1200px]">
          {children}
        </div>

        {/* Right Sideline - Responsive */}
        <div style={stripeStyle}>
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>
      </div>
    </>
  )
}
