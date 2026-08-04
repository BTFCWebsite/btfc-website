import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'
import SponsorTileLinks from './SponsorTileLinks'
import SiteBrandingUpdates from './SiteBrandingUpdates'
import ProgrammeLinks from './ProgrammeLinks'

// Deployment marker: restored stable version from 1 August 2026.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        .hero-cards > a,
        .hero-cards > div {
          background: rgba(0, 0, 0, 0.14) !important;
          border-color: rgba(255, 255, 255, 0.34) !important;
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.20), inset 0 1px 0 rgba(255, 255, 255, 0.10);
        }

        .hero-cards > a > div,
        .hero-cards > div > div {
          text-shadow: 0 2px 6px rgba(0, 0, 0, 0.92);
        }

        .hero-cards > a > div:first-child,
        .hero-cards > div > div:first-child {
          color: rgba(255, 255, 255, 0.90) !important;
        }

        .hero-cards > a > div:last-child,
        .hero-cards > div > div:last-child {
          color: rgba(255, 255, 255, 0.86) !important;
        }

        .hero-cards > a span {
          color: #fff !important;
          font-weight: 900 !important;
        }
      `}</style>
      {children}
      <HomeNextFixture />
      <SponsorTileLinks />
      <SiteBrandingUpdates />
      <ProgrammeLinks />
    </>
  )
}
