import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'
import SponsorTileLinks from './SponsorTileLinks'
import SiteBrandingUpdates from './SiteBrandingUpdates'
import ProgrammeLinks from './ProgrammeLinks'
import MatchReportLinkLabels from './MatchReportLinkLabels'
import MatchdayMobileTileWidth from './MatchdayMobileTileWidth'
import ContactsMobileTileWidth from './ContactsMobileTileWidth'
import SponsorTickerSync from './SponsorTickerSync'
import SiteSeo from './SiteSeo'
import LeagueTableMobileScrollCue from './LeagueTableMobileScrollCue'
import MatchdayProgrammeHeroButton from './MatchdayProgrammeHeroButton'
import LiveTeamResults from './LiveTeamResults'

// Deployment marker: restored stable version from 1 August 2026.
export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteSeo />
      <style>{`
        .hero-cards > a,
        .hero-cards > div {
          background: rgba(8, 18, 40, 0.20) !important;
          border-color: rgba(255, 255, 255, 0.30) !important;
          backdrop-filter: blur(10px) saturate(110%) !important;
          -webkit-backdrop-filter: blur(10px) saturate(110%) !important;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .hero-cards > a > div,
        .hero-cards > div > div {
          text-shadow: 0 2px 5px rgba(0, 0, 0, 0.82);
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
            background: rgba(8, 18, 40, 0.16) !important;
            border-color: rgba(255, 255, 255, 0.32) !important;
            backdrop-filter: blur(14px) saturate(115%) !important;
            -webkit-backdrop-filter: blur(14px) saturate(115%) !important;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.16) !important;
            padding-top: 8px !important;
            padding-bottom: 8px !important;
          }

          .hero-cards > a > div,
          .hero-cards > div > div {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.82), 0 0 5px rgba(0, 0, 0, 0.42) !important;
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
      <LeagueTableMobileScrollCue />
      <MatchdayProgrammeHeroButton />
      <LiveTeamResults />
    </>
  )
}
