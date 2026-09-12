'use client'

import { useEffect } from 'react'
import ReliableFixtures from '../ReliableFixtures'

export default function FixturesLayout({ children: _children }: { children: React.ReactNode }) {
  useEffect(() => {
    function tidyPenaltyLabels() {
      document.querySelectorAll<HTMLElement>('.reliable-mobile article').forEach((card) => {
        const penaltyLabel = Array.from(card.querySelectorAll<HTMLSpanElement>('span')).find((span) =>
          /pen/i.test(span.textContent || '')
        )
        if (!penaltyLabel) return

        const current = penaltyLabel.textContent?.trim() || ''
        const score = current.match(/(\d+)\s*-\s*(\d+)/)
        const opponent = card.querySelector('h3')?.textContent?.trim().toLowerCase() || ''

        let label = score ? `(Pens ${score[1]}-${score[2]})` : current
        if (!score && opponent.includes('yateley united')) label = '(Pens 5-4)'

        if (penaltyLabel.textContent !== label) penaltyLabel.textContent = label
        if (penaltyLabel.style.marginLeft !== 'auto') penaltyLabel.style.marginLeft = 'auto'
      })
    }

    tidyPenaltyLabels()
    const observer = new MutationObserver(tidyPenaltyLabels)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <ReliableFixtures />
}
