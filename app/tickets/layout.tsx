import type { ReactNode } from 'react'

export default function TicketsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <style>{`
        main > section > div:nth-of-type(3) > .mobile-card-grid {
          align-items: stretch;
        }

        main > section > div:nth-of-type(3) > .mobile-card-grid > div {
          max-width: none !important;
          margin: 0 !important;
          height: 100%;
        }
      `}</style>
    </>
  )
}
