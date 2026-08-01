import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'
import SponsorTileLinks from './SponsorTileLinks'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        .hero-cards > a,
        .hero-cards > div {
          background: linear-gradient(90deg, rgba(4, 27, 95, 0.30), rgba(4, 27, 95, 0.20)) !important;
          border-color: rgba(255, 255, 255, 0.28) !important;
          backdrop-filter: blur(1.5px) !important;
          -webkit-backdrop-filter: blur(1.5px) !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.08);
        }

        .hero-cards > a > div,
        .hero-cards > div > div {
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.78);
        }

        .hero-cards > a > div:first-child,
        .hero-cards > div > div:first-child {
          color: rgba(255, 255, 255, 0.82) !important;
        }

        .hero-cards > a > div:last-child,
        .hero-cards > div > div:last-child {
          color: rgba(255, 255, 255, 0.76) !important;
        }
      `}</style>
      {children}
      <HomeNextFixture />
      <SponsorTileLinks />
    </>
  )
}