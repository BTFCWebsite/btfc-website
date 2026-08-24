import type { Metadata } from 'next'
import ClubDiaryPreGate from './ClubDiaryPreGate'
import ClubDiarySecurityTools from './ClubDiarySecurityTools'
import ClubDiaryLogoutSync from './ClubDiaryLogoutSync'
import ClubDiaryMonthDetails from './ClubDiaryMonthDetails'
import ClubDiaryUnavailableCount from './ClubDiaryUnavailableCount'
import ClubDiaryWorkingPartyShare from './ClubDiaryWorkingPartyShare'
import ClubDiaryDeleteFeedback from './ClubDiaryDeleteFeedback'
import ClubDiaryHeroControls from './ClubDiaryHeroControls'
import ClubDiaryStickyHero from './ClubDiaryStickyHero'
import ClubDiaryBackNavigation from './ClubDiaryBackNavigation'

export const metadata: Metadata = {
  title: 'Club Diary | Brimscombe & Thrupp FC',
  description: 'Private BTFC operations diary.',
  robots: { index: false, follow: false },
}

export default function ClubDiaryPage() {
  return <>
    <ClubDiaryPreGate />
    <ClubDiarySecurityTools />
    <ClubDiaryLogoutSync />
    <ClubDiaryMonthDetails />
    <ClubDiaryUnavailableCount />
    <ClubDiaryWorkingPartyShare />
    <ClubDiaryDeleteFeedback />
    <ClubDiaryHeroControls />
    <ClubDiaryStickyHero />
    <ClubDiaryBackNavigation />
  </>
}
