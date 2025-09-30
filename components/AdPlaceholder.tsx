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
  return (
    <div
      className={`bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 ${
        sticky ? 'sticky top-4' : ''
      } ${className}`}
      style={{ width, height }}
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