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
    <div className={`bg-white min-h-full ${className}`}>
      <div className="flex justify-center">
        {/* Left Sideline */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0">
          <div className="w-full sideline-pattern">
            <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-[1200px] bg-white shadow-sm min-h-full">
          {children}
        </div>

        {/* Right Sideline */}
        <div className="hidden xl:flex w-[160px] flex-shrink-0">
          <div className="w-full sideline-pattern">
            <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
