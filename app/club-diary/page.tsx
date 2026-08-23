import type { Metadata } from 'next'
import ClubDiaryPreGate from './ClubDiaryPreGate'
import ClubDiarySecurityTools from './ClubDiarySecurityTools'

export const metadata: Metadata = {
  title: 'Club Diary | Brimscombe & Thrupp FC',
  description: 'Private BTFC operations diary.',
  robots: { index: false, follow: false },
}

export default function ClubDiaryPage() {
  return <>
    <ClubDiaryPreGate />
    <ClubDiarySecurityTools />
  </>
}
