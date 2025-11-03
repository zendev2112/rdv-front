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
  return (
    <div
      className={`bg-gray-100 border border-gray-300 rounded-lg p-4 h-fit ${
        sticky ? 'sticky' : ''
      } ${className}`}
      style={sticky ? { top: '120px' } : {}}
    >
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4 font-medium">Publicidad</p>
        <div className="bg-white border-2 border-dashed border-gray-300 rounded flex items-center justify-center" style={{ minHeight: '300px' }}>
          <p className="text-gray-400 text-sm">Ad Space</p>
        </div>
      </div>
    </div>
  )
}