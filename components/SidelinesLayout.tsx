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
  return (
    <div className={`bg-white ${className}`}>
      <div className="flex min-h-screen">
        {/* Left Sideline with diagonal stripes */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sideline-pattern">
          <div className="sticky top-[180px] p-4">
            {/* Ads will be hidden but pattern visible */}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 max-w-[1200px] bg-white shadow-sm mx-auto">
          {children}
        </div>

        {/* Right Sideline with diagonal stripes */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sideline-pattern">
          <div className="sticky top-[180px] p-4">
            {/* Ads will be hidden but pattern visible */}
          </div>
        </div>
      </div>
    </div>
  )
}
