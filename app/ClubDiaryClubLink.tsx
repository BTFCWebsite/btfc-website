'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

export default function ClubDiaryClubLink() {
  const pathname = usePathname()
  const [mount, setMount] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (pathname !== '/club') {
      setMount(null)
      return
    }

    const section = document.querySelector('main > section')
    const hero = section?.firstElementChild
    if (!section || !hero) return

    let host = document.getElementById('club-diary-club-link') as HTMLElement | null
    if (!host) {
      host = document.createElement('div')
      host.id = 'club-diary-club-link'
      hero.insertAdjacentElement('afterend', host)
    }

    setMount(host)

    return () => {
      setMount(null)
      host?.remove()
    }
  }, [pathname])

  if (!mount) return null

  return createPortal(
    <div style={{ marginBottom: 44 }}>
      <a
        href="/club-diary"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 18,
          flexWrap: 'wrap',
          padding: '20px 24px',
          background: '#fff',
          border: '1px solid #DCE3F3',
          borderLeft: '5px solid #1149D8',
          borderRadius: 8,
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(4,27,95,.06)',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 10,
            fontWeight: 800,
            color: '#1149D8',
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            marginBottom: 5,
          }}>
            🔒 Committee &amp; Volunteers
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 25,
            fontWeight: 800,
            color: '#2D2D2D',
            lineHeight: 1.05,
            marginBottom: 5,
          }}>
            Club Diary
          </div>
          <div style={{
            fontFamily: "'Montserrat', sans-serif",
            fontSize: 12,
            color: '#6B7280',
            lineHeight: 1.55,
          }}>
            Fixtures, staff availability, clubhouse bookings, working parties and club events.
          </div>
        </div>

        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 42,
          padding: '0 18px',
          background: '#1149D8',
          color: '#fff',
          borderRadius: 6,
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 800,
          fontSize: 16,
          whiteSpace: 'nowrap',
        }}>
          Open Club Diary →
        </span>
      </a>
    </div>,
    mount
  )
}
