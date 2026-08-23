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
    let resizeObserver: ResizeObserver | null = null
    let hero: HTMLElement | null = null

    const placeHost = (host: HTMLElement) => {
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const horizontalInset = window.innerWidth <= 760 ? 18 : 32
      const verticalInset = window.innerWidth <= 760 ? 16 : 22
      host.style.left = `${window.scrollX + rect.right - horizontalInset}px`
      host.style.top = `${window.scrollY + rect.bottom - verticalInset}px`
    }

    const mountLogin = () => {
      if (cancelled) return

      const section = document.querySelector('main > section') as HTMLElement | null
      hero = section?.firstElementChild as HTMLElement | null
      if (!hero) {
        timer = setTimeout(mountLogin, 100)
        return
      }

      let host = document.getElementById('club-diary-club-link') as HTMLElement | null
      if (!host) {
        host = document.createElement('div')
        host.id = 'club-diary-club-link'
        document.body.appendChild(host)
      }

      placeHost(host)
      setMount(host)

      const reposition = () => host && placeHost(host)
      window.addEventListener('resize', reposition)

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(reposition)
        resizeObserver.observe(hero)
      }

      timer = setTimeout(reposition, 500)

      return () => window.removeEventListener('resize', reposition)
    }

    const cleanupResize = mountLogin()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      resizeObserver?.disconnect()
      cleanupResize?.()
      setMount(null)
      document.getElementById('club-diary-club-link')?.remove()
    }
  }, [pathname])

  if (!mount) return null

  return createPortal(
    <>
      <style>{`
        #club-diary-club-link {
          position: absolute;
          z-index: 100;
          width: 0;
          height: 0;
          margin: 0;
          padding: 0;
          pointer-events: none;
        }
        #club-diary-club-link a {
          transform: translate(-100%, -100%);
          display: flex;
          width: 154px;
          height: 154px;
          box-sizing: border-box;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          border: 1px solid rgba(255,255,255,.34);
          border-radius: 8px;
          background: rgba(18,53,116,.92);
          color: #fff;
          text-decoration: none;
          text-align: center;
          box-shadow: 0 5px 16px rgba(0,0,0,.16);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          pointer-events: auto;
        }
        #club-diary-club-link a:hover {
          background: rgba(25,69,143,.96);
        }
        #club-diary-club-link .club-diary-helper-icon {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          flex: 0 0 46px;
          border-radius: 50%;
          background: rgba(255,255,255,.14);
          font-size: 25px;
          line-height: 1;
        }
        #club-diary-club-link .club-diary-copy {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 0;
        }
        #club-diary-club-link .club-diary-internal {
          font-family: 'Montserrat', sans-serif;
          font-size: 7px;
          line-height: 1.35;
          font-weight: 800;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: rgba(255,255,255,.72);
          margin-bottom: 6px;
          white-space: normal;
        }
        #club-diary-club-link .club-diary-login {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 19px;
          line-height: 1.05;
          font-weight: 800;
          letter-spacing: .02em;
          color: #fff;
          white-space: nowrap;
        }
        @media (max-width: 760px) {
          #club-diary-club-link a {
            width: 124px;
            height: 124px;
            gap: 7px;
            padding: 10px;
          }
          #club-diary-club-link .club-diary-helper-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
            font-size: 20px;
          }
          #club-diary-club-link .club-diary-internal {
            font-size: 6px;
            margin-bottom: 4px;
          }
          #club-diary-club-link .club-diary-login {
            font-size: 16px;
          }
        }
      `}</style>
      <a href="/club-diary" aria-label="Internal Club Diary login for club officials and volunteers">
        <span className="club-diary-helper-icon" aria-hidden="true">👥</span>
        <span className="club-diary-copy">
          <span className="club-diary-internal">Internal · Club Officials &amp; Volunteers Only</span>
          <span className="club-diary-login">Club Login →</span>
        </span>
      </a>
    </>,
    mount
  )
}
