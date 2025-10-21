'use client'

import { useEffect, useState } from 'react'

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [scrollThreshold, setScrollThreshold] = useState(0)

  useEffect(() => {
    let lastScrollY = 0

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // ✅ Delay nav hide until scroll > 200px (increased from immediate)
      if (currentScrollY > 200) {
        if (currentScrollY > lastScrollY) {
          setScrollDirection('down')
        } else {
          setScrollDirection('up')
        }
      } else {
        setScrollDirection('up')
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return scrollDirection
}
