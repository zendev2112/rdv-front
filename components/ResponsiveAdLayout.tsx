// components/ResponsiveAdLayout.tsx
import { useEffect, useState } from 'react'
import SidelinesLayout from './SidelinesLayout'

export function ResponsiveAdLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSidelines, setShowSidelines] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setShowSidelines(window.innerWidth >= 1280) // xl breakpoint
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  if (!showSidelines) {
    // On smaller screens, render without sidelines
    return <div className="min-h-screen bg-white">{children}</div>
  }

  // On larger screens, render with sidelines
  return <SidelinesLayout>{children}</SidelinesLayout>
}
