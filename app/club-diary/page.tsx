import type { Metadata } from 'next'
import ClubDiaryPreGate from './ClubDiaryPreGate'
import ClubDiarySecurityTools from './ClubDiarySecurityTools'
import ClubDiaryLogoutSync from './ClubDiaryLogoutSync'
import ClubDiaryMonthDetails from './ClubDiaryMonthDetails'

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
  </>
}
