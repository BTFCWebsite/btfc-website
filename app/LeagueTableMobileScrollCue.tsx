'use client'

import { useEffect } from 'react'

const LEAGUE_HEADERS = 'pos|team|p|w|d|l|gd|pts'

function markLeagueTables() {
  if (window.location.pathname !== '/fixtures') return

  for (const table of Array.from(document.querySelectorAll('table'))) {
    const headings = Array.from(table.querySelectorAll('thead th'))
      .map((cell) => (cell.textContent || '').trim().toLowerCase())
      .join('|')

    if (headings !== LEAGUE_HEADERS) continue
    const scroller = table.parentElement
    if (scroller) scroller.classList.add('league-table-mobile-scroll')
  }
}

export default function LeagueTableMobileScrollCue() {
  useEffect(() => {
    if (window.location.pathname !== '/fixtures') return

    markLeagueTables()
    const observer = new MutationObserver(markLeagueTables)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <style>{`
      .league-table-mobile-scroll::before {
        display: none;
      }

      @media (max-width: 768px) {
        .league-table-mobile-scroll::before {
          content: 'Scroll  →';
          display: block;
          position: sticky;
          left: 0;
          width: fit-content;
          padding: 9px 12px 7px;
          font-family: 'Montserrat', sans-serif;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
          color: #1149D8;
          background: #fff;
          z-index: 2;
        }
      }
    `}</style>
  )
}
