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
          align-items: center;
          justify-content: center;
          gap: 7px;
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
          box-shadow: 0 4px 14px rgba(0,0,0,.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        #club-diary-club-link a:hover {
          background: rgba(255,255,255,.22);
        }
        @media (max-width: 760px) {
          #club-diary-club-link {
            top: 22px;
            right: 20px;
          }
          #club-diary-club-link a {
            min-height: 38px;
            padding: 0 13px;
            font-size: 14px;
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
