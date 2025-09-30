// components/SidelinesLayout.tsx
import React from 'react'
import AdPlaceholder from './AdPlaceholder'

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
    <div className={`min-h-screen bg-gray-100 ${className}`}>
      <div className="flex justify-center">
        {/* Left Sideline */}
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-[180px] p-4">
            {leftAd || (
              <div className="space-y-4">
                <AdPlaceholder
                  width="160px"
                  height="600px"
                  type="Skyscraper"
                  className="bg-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-[1200px] bg-white min-h-screen shadow-sm">
          {children}
        </div>

        {/* Right Sideline */}
        <div className="hidden xl:block w-[160px] flex-shrink-0">
          <div className="sticky top-[180px] p-4">
            {rightAd || (
              <div className="space-y-4">
                <AdPlaceholder
                  width="160px"
                  height="600px"
                  type="Skyscraper"
                  className="bg-gray-200"
                />
                <AdPlaceholder
                  width="160px"
                  height="250px"
                  type="Rectangle"
                  className="bg-gray-200"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
