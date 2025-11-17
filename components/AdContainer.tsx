'use client'

import React from 'react'

interface AdContainerProps {
  sticky?: boolean
  className?: string
}

export default function AdContainer({
  sticky = true,
  className = '',
}: AdContainerProps) {
  const stripeStyle: React.CSSProperties = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.05) 2px,
      rgba(0, 0, 0, 0.05) 3px
    )`,
    backgroundColor: '#f8f8f8',
  }

  return (
    <div
      className={`border border-gray-300 rounded-lg p-4 h-fit ${
        sticky ? 'sticky' : ''
      } ${className}`}
      style={sticky ? { ...stripeStyle, top: '120px' } : stripeStyle}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4 font-medium">Publicidad</p>
        <div
          className="bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
          style={{ minHeight: '300px' }}
        >
          <p className="text-gray-400 text-sm">Ad Space</p>
        </div>
      </div>
    </div>
  )
}