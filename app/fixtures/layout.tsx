import ReliableFixtures from '../ReliableFixtures'
import FirstTeamTableCorrection from './FirstTeamTableCorrection'

export default function FixturesLayout({ children: _children }: { children: React.ReactNode }) {
  return (
    <>
      <ReliableFixtures />
      <FirstTeamTableCorrection />
    </>
  )
}
