'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getSponsors } from './lib/sanity.client'

function sponsorSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function SponsorTileLinks() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/sponsors') return

    let cancelled = false
    const cleanups: Array<() => void> = []

    getSponsors().then((sponsors) => {
      if (cancelled) return

      for (const sponsor of sponsors || []) {
        const name = String(sponsor?.name || '').trim()
        if (!name) continue

        const textNode = Array.from(document.querySelectorAll('h3, p')).find(
          element => element.textContent?.trim() === name
        )
        const tile = textNode?.closest('div[style*="background"]') as HTMLElement | null
        if (!tile || tile.dataset.sponsorLinked === 'true') continue

        tile.dataset.sponsorLinked = 'true'
        tile.tabIndex = 0
        tile.setAttribute('role', 'link')
        tile.setAttribute('aria-label', `View ${name}`)
        tile.style.cursor = 'pointer'
        tile.style.transition = 'transform 160ms ease, box-shadow 160ms ease'

        const open = () => router.push(`/sponsors/${sponsorSlug(name)}`)
        const keydown = (event: KeyboardEvent) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            open()
          }
        }
        const enter = () => {
          tile.style.transform = 'translateY(-2px)'
          tile.style.boxShadow = '0 10px 24px rgba(17, 73, 216, 0.12)'
        }
        const leave = () => {
          tile.style.transform = ''
          tile.style.boxShadow = ''
        }

        tile.addEventListener('click', open)
        tile.addEventListener('keydown', keydown)
        tile.addEventListener('mouseenter', enter)
        tile.addEventListener('mouseleave', leave)

        cleanups.push(() => {
          tile.removeEventListener('click', open)
          tile.removeEventListener('keydown', keydown)
          tile.removeEventListener('mouseenter', enter)
          tile.removeEventListener('mouseleave', leave)
        })
      }
    }).catch(console.error)

    return () => {
      cancelled = true
      cleanups.forEach(cleanup => cleanup())
    }
  }, [pathname, router])

  return null
}
