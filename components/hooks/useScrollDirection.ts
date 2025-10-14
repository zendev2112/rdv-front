'use client'

import { useState, useEffect } from 'react'

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [prevOffset, setPrevOffset] = useState(0)

  useEffect(() => {
    const threshold = 10 // Minimum scroll amount to trigger

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset

      if (Math.abs(scrollY - prevOffset) < threshold) {
        return
      }

      setScrollDirection(scrollY > prevOffset ? 'down' : 'up')
      setPrevOffset(scrollY)
    }

    window.addEventListener('scroll', updateScrollDirection)

    return () => {
      window.removeEventListener('scroll', updateScrollDirection)
    }
  }, [prevOffset])

  return scrollDirection
}
