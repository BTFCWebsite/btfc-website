'use client'

import { usePathname } from 'next/navigation'

export default function MatchdayMobileTileWidth() {
  const pathname = usePathname()
  if (pathname !== '/matchday') return null

  return (
    <style>{`
      @media (max-width: 768px) {
        .mobile-card-grid > div {
          width: 100% !important;
          max-width: none !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
          box-sizing: border-box !important;
        }
      }
    `}</style>
  )
}
