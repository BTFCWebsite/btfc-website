'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function ContactsMobileTileWidth() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/contact') return

    function applyWidths() {
      const heading = Array.from(document.querySelectorAll('h2')).find(
        element => element.textContent?.trim() === 'Department Contacts'
      )
      const grid = heading?.nextElementSibling?.nextElementSibling as HTMLElement | null
      if (!grid) return

      Array.from(grid.children).forEach(child => {
        const card = child as HTMLElement
        if (window.innerWidth <= 768) {
          card.style.setProperty('width', '100%', 'important')
          card.style.setProperty('max-width', 'none', 'important')
          card.style.setProperty('margin-left', '0', 'important')
          card.style.setProperty('margin-right', '0', 'important')
          card.style.setProperty('box-sizing', 'border-box', 'important')
        } else {
          card.style.removeProperty('width')
          card.style.removeProperty('max-width')
          card.style.removeProperty('margin-left')
          card.style.removeProperty('margin-right')
          card.style.removeProperty('box-sizing')
        }
      })
    }

    applyWidths()
    window.addEventListener('resize', applyWidths)
    return () => window.removeEventListener('resize', applyWidths)
  }, [pathname])

  return null
}
