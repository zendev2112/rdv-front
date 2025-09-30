import React from 'react'

interface SidelinesLayoutProps {
  children: React.ReactNode
  leftAd?: React.ReactNode
  rightAd?: React.ReactNode
  className?: string
}

export default function SidelinesLayout({
  children,
  leftAd,
  rightAd,
  className = '',
}: SidelinesLayoutProps) {
  const stripeStyle = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.05) 2px,
      rgba(0, 0, 0, 0.05) 3px
    )`,
    backgroundColor: '#f8f8f8',
    minHeight: '100vh',
    width: '160px',
  }

  return (
    <div className={`${className}`}>
      <div className="flex justify-center">
        {/* Left Sideline */}
        <div className="hidden xl:block flex-shrink-0" style={stripeStyle}>
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>

        {/* Main Content */}
        <div className="w-[1200px] bg-white shadow-sm min-h-screen">
          {children}
        </div>

        {/* Right Sideline */}
        <div className="hidden xl:block flex-shrink-0" style={stripeStyle}>
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>
      </div>
    </div>
  )
}
