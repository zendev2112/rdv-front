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
    <div className={`bg-white ${className}`} style={{ minHeight: '100vh' }}>
      <div className="flex justify-center" style={{ minHeight: '100vh' }}>
        {/* Left Sideline */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sideline-pattern">
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>

        {/* Main Content */}
        <div
          className="w-[1200px] bg-white shadow-sm"
          style={{ minHeight: '100vh' }}
        >
          {children}
        </div>

        {/* Right Sideline */}
        <div className="hidden xl:block w-[160px] flex-shrink-0 sideline-pattern">
          <div className="sticky top-[180px] p-4">{/* Ads hidden */}</div>
        </div>
      </div>
    </div>
  )
}
