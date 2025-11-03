'use client'

import { ReactNode } from 'react'
import SidelinesLayout from './SidelinesLayout'

export default function ArticlePageLayout({
  children,
  stickyContent,
  sidelineWidth,
}: {
  children: ReactNode
  stickyContent: ReactNode
  sidelineWidth: number
}) {
  return (
    <div className="hidden md:block pt-[80px]">
      <div style={{ display: 'flex', gap: '1rem', paddingLeft: '2rem' }}>
        {/* ✅ STICKY SIDEBAR - OUTSIDE SidelinesLayout */}
        <div
          style={{
            position: 'sticky',
            top: '120px',
            height: 'fit-content',
            flexShrink: 0,
          }}
        >
          {stickyContent}
        </div>

        {/* ✅ MAIN CONTENT - INSIDE SidelinesLayout */}
        <div style={{ flex: 1 }}>
          <SidelinesLayout sidelineWidth={sidelineWidth}>
            {children}
          </SidelinesLayout>
        </div>
      </div>
    </div>
  )
}