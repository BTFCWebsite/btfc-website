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
      const grid = heading?.parentElement?.querySelector('div[style*="display: grid"]') as HTMLElement | null
      if (!grid) return

      if (window.innerWidth <= 768) {
        grid.style.setProperty('grid-template-columns', 'minmax(0, 1fr)', 'important')
        grid.style.setProperty('width', '100%', 'important')

        Array.from(grid.children).forEach(child => {
          const card = child as HTMLElement
          card.style.setProperty('width', '100%', 'important')
          card.style.setProperty('max-width', '100%', 'important')
          card.style.setProperty('margin-left', '0', 'important')
          card.style.setProperty('margin-right', '0', 'important')
          card.style.setProperty('box-sizing', 'border-box', 'important')
        })
      } else {
        grid.style.removeProperty('grid-template-columns')
        grid.style.removeProperty('width')
        Array.from(grid.children).forEach(child => {
          const card = child as HTMLElement
          card.style.removeProperty('width')
          card.style.removeProperty('max-width')
          card.style.removeProperty('margin-left')
          card.style.removeProperty('margin-right')
          card.style.removeProperty('box-sizing')
        })
      }
    }

    applyWidths()

    // Officials are loaded from Sanity after the page first renders, so reapply
    // when those cards arrive rather than only on the initial empty grid.
    const observer = new MutationObserver(applyWidths)
    observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', applyWidths)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', applyWidths)
    }
  }, [pathname])

  return null
}
