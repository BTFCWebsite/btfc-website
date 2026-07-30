import type { ReactNode } from 'react'
import HomeNextFixture from './HomeNextFixture'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <HomeNextFixture />
    </>
  )
}
