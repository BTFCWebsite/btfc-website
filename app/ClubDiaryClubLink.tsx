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
    let resizeHandler: (() => void) | null = null

    const mountLogin = () => {
      if (cancelled) return

      const section = document.querySelector('main > section') as HTMLElement | null
      const hero = section?.firstElementChild as HTMLElement | null
      if (!section || !hero) {
        timer = setTimeout(mountLogin, 100)
        return
      }

      const previousSectionPosition = section.style.position
      const previousHeroPaddingBottom = hero.style.paddingBottom
      section.style.position = 'relative'
      hero.style.paddingBottom = window.innerWidth <= 760 ? '88px' : '96px'

      let host = document.getElementById('club-diary-club-link') as HTMLElement | null
      if (!host) {
        host = document.createElement('div')
        host.id = 'club-diary-club-link'
        hero.insertAdjacentElement('afterend', host)
      }

      host.dataset.previousSectionPosition = previousSectionPosition
      host.dataset.previousHeroPaddingBottom = previousHeroPaddingBottom

      const placeHost = () => {
        if (!host || !hero) return
        hero.style.paddingBottom = window.innerWidth <= 760 ? '88px' : '96px'
        host.style.top = `${hero.offsetTop + hero.offsetHeight}px`
        host.style.left = window.innerWidth <= 760 ? '18px' : '32px'
      }

      placeHost()
      resizeHandler = placeHost
      window.addEventListener('resize', resizeHandler)

      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(placeHost)
        resizeObserver.observe(hero)
      }

      setMount(host)
    }

    mountLogin()

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      if (resizeHandler) window.removeEventListener('resize', resizeHandler)
      resizeObserver?.disconnect()
      setMount(null)

      const host = document.getElementById('club-diary-club-link') as HTMLElement | null
      const section = document.querySelector('main > section') as HTMLElement | null
      const hero = section?.firstElementChild as HTMLElement | null
      if (section && host?.dataset.previousSectionPosition !== undefined) {
        section.style.position = host.dataset.previousSectionPosition
      }
      if (hero && host?.dataset.previousHeroPaddingBottom !== undefined) {
        hero.style.paddingBottom = host.dataset.previousHeroPaddingBottom
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
          z-index: 20;
          height: 0;
          margin: 0;
          padding: 0;
        }
        #club-diary-club-link a {
          transform: translateY(calc(-100% - 18px));
          display: inline-flex;
          align-items: center;
          gap: 11px;
          min-height: 58px;
          padding: 7px 15px 8px 10px;
          border: 1px solid rgba(255,255,255,.34);
          border-radius: 8px;
          background: rgba(255,255,255,.10);
          color: #fff;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0,0,0,.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          white-space: nowrap;
        }
        #club-diary-club-link a:hover {
          background: rgba(255,255,255,.18);
        }
        #club-diary-club-link .club-diary-helper-icon {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          border-radius: 50%;
          background: rgba(255,255,255,.15);
          font-size: 21px;
          line-height: 1;
        }
        #club-diary-club-link .club-diary-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
        }
        #club-diary-club-link .club-diary-internal {
          font-family: 'Montserrat', sans-serif;
          font-size: 8px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: .09em;
          text-transform: uppercase;
          color: rgba(255,255,255,.68);
          margin-bottom: 4px;
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
          #club-diary-club-link a {
            transform: translateY(calc(-100% - 14px));
            min-height: 52px;
            gap: 8px;
            padding: 6px 11px 7px 8px;
          }
          #club-diary-club-link .club-diary-helper-icon {
            width: 34px;
            height: 34px;
            flex-basis: 34px;
            font-size: 18px;
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
        <span className="club-diary-helper-icon" aria-hidden="true">🙋</span>
        <span className="club-diary-copy">
          <span className="club-diary-internal">Internal · Club Officials &amp; Volunteers Only</span>
          <span className="club-diary-login">Club Login →</span>
        </span>
      </a>
    </>,
    mount
  )
}
