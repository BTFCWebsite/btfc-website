import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'
import SponsorTileLinks from './SponsorTileLinks'
import SiteBrandingUpdates from './SiteBrandingUpdates'
import ProgrammeLinks from './ProgrammeLinks'
import MatchReportLinkLabels from './MatchReportLinkLabels'
import MatchdayMobileTileWidth from './MatchdayMobileTileWidth'
import ContactsMobileTileWidth from './ContactsMobileTileWidth'
import SponsorTickerSync from './SponsorTickerSync'

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

        @media (min-width: 769px) {
          .hero-cards > a,
          .hero-cards > div {
            background: linear-gradient(135deg, rgba(10, 21, 45, 0.62), rgba(17, 73, 216, 0.34)) !important;
            border-color: rgba(255, 255, 255, 0.42) !important;
            backdrop-filter: blur(6px) saturate(115%) !important;
            -webkit-backdrop-filter: blur(6px) saturate(115%) !important;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }

          .hero-cards > a > div,
          .hero-cards > div > div {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.95), 0 0 7px rgba(0, 0, 0, 0.75) !important;
          }
        }
      `}</style>
      {children}
      <HomeNextFixture />
      <SponsorTileLinks />
      <SiteBrandingUpdates />
      <ProgrammeLinks />
      <MatchReportLinkLabels />
      <MatchdayMobileTileWidth />
      <ContactsMobileTileWidth />
      <SponsorTickerSync />
    </>
  )
}
