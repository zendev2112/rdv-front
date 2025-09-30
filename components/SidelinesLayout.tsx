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
  const sidelineStyle = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 2px,
      rgba(229, 231, 235, 0.3) 2px,
      rgba(229, 231, 235, 0.3) 4px
    )`,
    backgroundColor: 'white',
  }

  return (
    <div className={`min-h-screen bg-white ${className}`}>
      <div className="flex justify-center">
        {/* Left Sideline with diagonal stripes */}
        <div
          className="hidden xl:block w-[160px] flex-shrink-0"
          style={sidelineStyle}
        >
          <div className="sticky top-[180px] p-4">
            {/* Ads will be hidden but pattern visible */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-[1200px] bg-white min-h-screen shadow-sm">
          {children}
        </div>

        {/* Right Sideline with diagonal stripes */}
        <div
          className="hidden xl:block w-[160px] flex-shrink-0"
          style={sidelineStyle}
        >
          <div className="sticky top-[180px] p-4">
            {/* Ads will be hidden but pattern visible */}
          </div>
        </div>
      </div>
    </div>
  )
}
