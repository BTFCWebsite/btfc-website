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
    let factsGrid: HTMLElement | null = null
    let originalHeroPaddingBottom = ''

    const placeHost = (host: HTMLElement) => {
      if (!hero) return

      const mobile = window.innerWidth <= 760
      host.dataset.mobile = mobile ? 'true' : 'false'

      if (mobile) {
        // The login becomes a full-width card below the facts on mobile.
        // Extra hero padding reserves real visual space so the card never overlaps the facts.
        hero.style.paddingBottom = '146px'

        const heroRect = hero.getBoundingClientRect()
        const factsRect = factsGrid?.getBoundingClientRect()
        const left = factsRect?.left ?? heroRect.left + 18
        const top = factsRect?.bottom ? factsRect.bottom + 18 : heroRect.bottom - 120
        const width = factsRect?.width ?? Math.max(220, heroRect.width - 36)

        host.style.left = `${window.scrollX + left}px`
        host.style.top = `${window.scrollY + top}px`
        host.style.setProperty('--club-diary-mobile-width', `${Math.round(width)}px`)
        host.style.setProperty('--club-diary-mobile-height', '96px')
        host.style.removeProperty('--club-diary-tile-size')
        return
      }

      hero.style.paddingBottom = originalHeroPaddingBottom

      const heroRect = hero.getBoundingClientRect()
      const horizontalInset = 32
      host.style.left = `${window.scrollX + heroRect.right - horizontalInset}px`

      if (factsGrid) {
        const factsRect = factsGrid.getBoundingClientRect()
        const tileSize = Math.max(120, Math.round(factsRect.height))
        host.style.top = `${window.scrollY + factsRect.top}px`
        host.style.setProperty('--club-diary-tile-size', `${tileSize}px`)
      } else {
        const verticalInset = 16
        host.style.top = `${window.scrollY + heroRect.bottom - verticalInset}px`
        host.style.setProperty('--club-diary-tile-size', '154px')
      }
    }

    const mountLogin = () => {
      if (cancelled) return

      const section = document.querySelector('main > section') as HTMLElement | null
      hero = section?.firstElementChild as HTMLElement | null
      factsGrid = hero?.children?.[1] as HTMLElement | null
      if (!hero) {
        timer = setTimeout(mountLogin, 100)
        return
      }

      originalHeroPaddingBottom = hero.style.paddingBottom

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
        if (factsGrid) resizeObserver.observe(factsGrid)
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
      if (hero) hero.style.paddingBottom = originalHeroPaddingBottom
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
          transform: translateX(-100%);
          display: flex;
          width: var(--club-diary-tile-size, 154px);
          height: var(--club-diary-tile-size, 154px);
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
          #club-diary-club-link[data-mobile='true'] a {
            transform: none;
            width: var(--club-diary-mobile-width, 100%);
            height: var(--club-diary-mobile-height, 96px);
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            gap: 14px;
            padding: 14px 18px;
            text-align: left;
          }
          #club-diary-club-link[data-mobile='true'] .club-diary-helper-icon {
            width: 44px;
            height: 44px;
            flex-basis: 44px;
            font-size: 22px;
          }
          #club-diary-club-link[data-mobile='true'] .club-diary-copy {
            align-items: flex-start;
            text-align: left;
          }
          #club-diary-club-link[data-mobile='true'] .club-diary-internal {
            font-size: 7px;
            margin-bottom: 5px;
          }
          #club-diary-club-link[data-mobile='true'] .club-diary-login {
            font-size: 21px;
          }
        }
      `}</style>
      <a href="/club-diary" aria-label="Internal Club Diary login for club officials and volunteers">
        <span className="club-diary-helper-icon" aria-hidden="true">📅</span>
        <span className="club-diary-copy">
          <span className="club-diary-internal">Internal · Club Officials &amp; Volunteers Only</span>
          <span className="club-diary-login">Club Login →</span>
        </span>
      </a>
    </>,
    mount
  )
}
