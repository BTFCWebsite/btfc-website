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

function findSponsorCard(start: Element, name: string) {
  let current: HTMLElement | null = start as HTMLElement

  while (current && current !== document.body) {
    const text = current.textContent || ''
    const rect = current.getBoundingClientRect()
    const hasLogo = Boolean(current.querySelector('img'))
    const containsName = text.includes(name)
    const looksLikeCard = rect.width >= 180 && rect.height >= 70 && hasLogo && containsName

    if (looksLikeCard) return current
    current = current.parentElement
  }

  return null
}

export default function SponsorTileLinks() {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (pathname !== '/sponsors' && pathname !== '/') return

    let cancelled = false
    let observer: MutationObserver | null = null
    const cleanups = new Map<HTMLElement, () => void>()

    getSponsors().then((sponsors) => {
      if (cancelled) return

      const sponsorList = (sponsors || [])
        .map((sponsor: any) => ({ ...sponsor, name: String(sponsor?.name || '').trim() }))
        .filter((sponsor: any) => sponsor.name)

      function linkTiles() {
        if (cancelled) return

        if (pathname === '/') {
          const heading = Array.from(document.querySelectorAll('h2')).find(
            element => element.textContent?.trim() === 'Club Sponsors'
          )
          if (heading) heading.textContent = 'Club Main Sponsors'
        }

        for (const sponsor of sponsorList) {
          const textNode = Array.from(document.querySelectorAll('h3, p, div')).find(
            element => element.textContent?.trim() === sponsor.name
          )
          if (!textNode) continue

          const tile = findSponsorCard(textNode, sponsor.name)
          if (!tile || tile.dataset.sponsorLinked === 'true') continue

          tile.dataset.sponsorLinked = 'true'
          tile.tabIndex = 0
          tile.setAttribute('role', 'link')
          tile.setAttribute('aria-label', `View ${sponsor.name} sponsor profile`)
          tile.style.cursor = 'pointer'
          tile.style.transition = 'transform 160ms ease, box-shadow 160ms ease'

          let cue: HTMLDivElement | null = null
          if (pathname === '/sponsors') {
            cue = document.createElement('div')
            cue.textContent = 'View Sponsor →'
            cue.style.marginTop = '12px'
            cue.style.color = '#1149D8'
            cue.style.fontFamily = "'Montserrat', sans-serif"
            cue.style.fontSize = '10px'
            cue.style.fontWeight = '800'
            cue.style.letterSpacing = '.06em'
            cue.style.textTransform = 'uppercase'
            tile.appendChild(cue)
          }

          const open = (event?: Event) => {
            event?.preventDefault()
            event?.stopPropagation()
            router.push(`/sponsors/${sponsorSlug(sponsor.name)}`)
          }
          const keydown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              open(event)
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

          cleanups.set(tile, () => {
            tile.removeEventListener('click', open)
            tile.removeEventListener('keydown', keydown)
            tile.removeEventListener('mouseenter', enter)
            tile.removeEventListener('mouseleave', leave)
            cue?.remove()
            delete tile.dataset.sponsorLinked
          })
        }
      }

      linkTiles()
      observer = new MutationObserver(linkTiles)
      observer.observe(document.body, { childList: true, subtree: true })
    }).catch(console.error)

    return () => {
      cancelled = true
      observer?.disconnect()
      cleanups.forEach(cleanup => cleanup())
      cleanups.clear()
    }
  }, [pathname, router])

  return null
}
