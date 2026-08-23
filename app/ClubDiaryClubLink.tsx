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

    let cancelled = false
    let timer: ReturnType<typeof setTimeout> | null = null

    const mountLogin = () => {
      if (cancelled) return

      const section = document.querySelector('main > section') as HTMLElement | null
      const hero = section?.firstElementChild as HTMLElement | null
      if (!section || !hero) {
        timer = setTimeout(mountLogin, 100)
        return
      }

      const previousSectionPosition = section.style.position
      section.style.position = 'relative'

      let host = document.getElementById('club-diary-club-link') as HTMLElement | null
      if (!host) {
        host = document.createElement('div')
        host.id = 'club-diary-club-link'
        hero.insertAdjacentElement('afterend', host)
      }

      host.dataset.previousSectionPosition = previousSectionPosition
      setMount(host)
    }

    mountLogin()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      setMount(null)
      const host = document.getElementById('club-diary-club-link') as HTMLElement | null
      const section = document.querySelector('main > section') as HTMLElement | null
      if (section && host?.dataset.previousSectionPosition !== undefined) {
        section.style.position = host.dataset.previousSectionPosition
      }
      host?.remove()
    }
  }, [pathname])

  if (!mount) return null

  return createPortal(
    <>
      <style>{`
        #club-diary-club-link {
          position: absolute;
          top: 28px;
          right: 32px;
          z-index: 20;
          height: 0;
          margin: 0;
          padding: 0;
        }
        #club-diary-club-link a {
          display: inline-flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          min-height: 54px;
          padding: 7px 16px 8px;
          border: 1px solid rgba(255,255,255,.38);
          border-radius: 7px;
          background: rgba(255,255,255,.13);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        #club-diary-club-link a:hover {
          background: rgba(255,255,255,.22);
        }
        #club-diary-club-link .club-diary-internal {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
          color: rgba(255,255,255,.68);
          margin-bottom: 3px;
        }
        #club-diary-club-link .club-diary-login {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 17px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: .02em;
          color: #fff;
        }
        @media (max-width: 760px) {
          #club-diary-club-link {
            top: 20px;
            right: 18px;
          }
          #club-diary-club-link a {
            min-height: 48px;
            padding: 6px 11px 7px;
          }
          #club-diary-club-link .club-diary-internal {
            font-size: 7px;
          }
          #club-diary-club-link .club-diary-login {
            font-size: 15px;
          }
        }
      `}</style>
      <a href="/club-diary" aria-label="Internal Club Diary login for club officials and volunteers">
        <span className="club-diary-internal">🔒 Internal · Club Officials &amp; Volunteers Only</span>
        <span className="club-diary-login">Club Login →</span>
      </a>
    </>,
    mount
  )
}
