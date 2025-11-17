'use client'

import React from 'react'

interface AdPlaceholderProps {
  width?: string
  height?: string
  type?: string
  className?: string
  sticky?: boolean
}

export default function AdPlaceholder({
  width = '100%',
  height = '250px',
  type = 'Banner',
  className = '',
  sticky = false,
}: AdPlaceholderProps) {
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
      className={`border border-gray-300 flex items-center justify-center text-gray-500 ${
        sticky ? 'sticky top-4' : ''
      } ${className}`}
      style={{ ...stripeStyle, width, height }}
    >
      <div className="text-center p-4">
        <p className="text-xs mb-2">Advertisement</p>
        <p className="text-[10px] font-mono">
          {width} × {height}
        </p>
        <p className="text-[10px] uppercase tracking-wide">{type}</p>
      </div>
    </div>
  )
}