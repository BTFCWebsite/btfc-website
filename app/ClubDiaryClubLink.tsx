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
    const hero = section?.firstElementChild as HTMLElement | null
    if (!hero) return

    const previousPosition = hero.style.position
    hero.style.position = 'relative'

    let host = document.getElementById('club-diary-club-link') as HTMLElement | null
    if (!host) {
      host = document.createElement('div')
      host.id = 'club-diary-club-link'
      hero.appendChild(host)
    }

    setMount(host)

    return () => {
      setMount(null)
      host?.remove()
      hero.style.position = previousPosition
    }
  }, [pathname])

  if (!mount) return null

  return createPortal(
    <>
      <style>{`
        #club-diary-club-link {
          position: absolute;
          top: 26px;
          right: 30px;
          z-index: 2;
        }
        #club-diary-club-link a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 17px;
          border: 1px solid rgba(255,255,255,.34);
          border-radius: 7px;
          background: rgba(255,255,255,.11);
          color: #fff;
          text-decoration: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .02em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        #club-diary-club-link a:hover {
          background: rgba(255,255,255,.20);
        }
        @media (max-width: 760px) {
          #club-diary-club-link {
            position: static;
            width: 100%;
            margin-left: auto;
            display: flex;
            justify-content: flex-end;
          }
          #club-diary-club-link a {
            width: auto;
          }
        }
      `}</style>
      <a href="/club-diary" aria-label="Open private Club Diary login">
        🔒 Club Login →
      </a>
    </>,
    mount
  )
}
