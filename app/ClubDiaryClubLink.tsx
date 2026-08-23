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

    let hero: HTMLElement | null = null
    let host: HTMLElement | null = null
    let observer: MutationObserver | null = null
    let cancelled = false
    let previousPosition = ''

    const attach = () => {
      if (cancelled || host?.isConnected) return Boolean(host?.isConnected)

      const section = document.querySelector('main > section')
      hero = section?.firstElementChild as HTMLElement | null
      if (!hero) return false

      previousPosition = hero.style.position
      hero.style.position = 'relative'

      host = document.getElementById('club-diary-club-link') as HTMLElement | null
      if (!host) {
        host = document.createElement('div')
        host.id = 'club-diary-club-link'
        hero.appendChild(host)
      }

      setMount(host)
      observer?.disconnect()
      return true
    }

    if (!attach()) {
      observer = new MutationObserver(() => {
        attach()
      })
      observer.observe(document.body, { childList: true, subtree: true })

      window.setTimeout(() => attach(), 100)
      window.setTimeout(() => attach(), 350)
      window.setTimeout(() => attach(), 800)
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      setMount(null)
      host?.remove()
      if (hero) hero.style.position = previousPosition
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
          z-index: 5;
        }
        #club-diary-club-link a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 17px;
          border: 1px solid rgba(255,255,255,.38);
          border-radius: 7px;
          background: rgba(255,255,255,.13);
          color: #fff;
          text-decoration: none;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .02em;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
          box-shadow: 0 4px 14px rgba(0,0,0,.12);
        }
        #club-diary-club-link a:hover {
          background: rgba(255,255,255,.22);
        }
        @media (max-width: 760px) {
          #club-diary-club-link {
            position: static;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 4px;
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
