import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'
import SponsorTileLinks from './SponsorTileLinks'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <HomeNextFixture />
      <SponsorTileLinks />
    </>
  )
}