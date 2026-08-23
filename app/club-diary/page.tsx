import type { Metadata } from 'next'
import ClubDiaryGate from './ClubDiaryGate'

export const metadata: Metadata = {
  title: 'Club Diary | Brimscombe & Thrupp FC',
  description: 'Private BTFC operations diary.',
  robots: { index: false, follow: false },
}

export default function ClubDiaryPage() {
  return <ClubDiaryGate />
}
