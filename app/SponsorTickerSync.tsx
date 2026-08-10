'use client'

import { useEffect } from 'react'
import { getSponsors } from './lib/sanity.client'

const PLACEHOLDERS = ['Reserves Sponsor TBC', 'U17s Sponsor TBC']

function findTickerTrack() {
  const marker = Array.from(document.querySelectorAll('span')).find(
    element => element.textContent?.trim() === 'Reserves Sponsor TBC'
  )
  return marker?.parentElement as HTMLElement | null
}

export default function SponsorTickerSync() {
  useEffect(() => {
    let cancelled = false

    async function syncTicker() {
      try {
        const sponsors = await getSponsors()
        if (cancelled) return

        const track = findTickerTrack()
        if (!track) return

        const sponsorNames = Array.from(new Set(
          (sponsors || [])
            .map((sponsor: any) => String(sponsor?.name || '').trim())
            .filter(Boolean)
        ))

        const names = [...sponsorNames, ...PLACEHOLDERS]
        if (!names.length) return

        track.replaceChildren()

        ;[...names, ...names].forEach((name, index) => {
          const span = document.createElement('span')
          span.textContent = name
          span.style.fontFamily = "'Montserrat', sans-serif"
          span.style.fontWeight = '700'
          span.style.fontSize = '10px'
          span.style.color = 'rgba(255,255,255,.7)'
          span.style.letterSpacing = '.06em'
          span.style.flexShrink = '0'
          span.style.textTransform = 'uppercase'
          span.dataset.tickerItem = String(index)
          track.appendChild(span)
        })
      } catch (error) {
        console.error('Unable to update sponsor ticker', error)
      }
    }

    syncTicker()
    return () => { cancelled = true }
  }, [])

  return null
}
