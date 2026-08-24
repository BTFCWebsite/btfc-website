'use client'

import { useEffect } from 'react'

export default function ClubDiaryStickyHero() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 900px)')
    let hero: HTMLElement | null = null
    let spacer: HTMLDivElement | null = null
    let observer: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const clearFixed = () => {
      if (!hero) return
      hero.style.position = ''
      hero.style.top = ''
      hero.style.left = ''
      hero.style.width = ''
      hero.style.zIndex = ''
      hero.style.boxShadow = ''
      hero.style.borderRadius = ''
      if (spacer) spacer.style.height = '0px'
    }

    const visibleSiteHeaderBottom = () => {
      if (mobile.matches) return 0
      const siteHeader = Array.from(document.querySelectorAll<HTMLElement>('header')).find((header) => !header.contains(hero)) || null
      if (!siteHeader) return 0
      const rect = siteHeader.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return 0
      return Math.max(0, Math.min(rect.bottom, window.innerHeight))
    }

    const findHero = () => {
      const nextHero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | null

      if (nextHero === hero) return

      resizeObserver?.disconnect()
      resizeObserver = null
      if (spacer?.parentElement) spacer.remove()
      spacer = null
      hero = nextHero

      if (!hero) return

      spacer = document.createElement('div')
      spacer.dataset.btfcHeroSpacer = 'true'
      spacer.style.height = '0px'
      spacer.style.width = '100%'
      hero.parentElement?.insertBefore(spacer, hero)

      resizeObserver = new ResizeObserver(() => {
        if (hero && spacer && hero.style.position === 'fixed') {
          spacer.style.height = `${hero.getBoundingClientRect().height}px`
        }
      })
      resizeObserver.observe(hero)
    }

    const positionFixedHero = () => {
      if (!hero || hero.style.position !== 'fixed') return
      const top = visibleSiteHeaderBottom()
      hero.style.top = `${top}px`
    }

    const apply = () => {
      if (!hero || !document.body.contains(hero)) findHero()
      if (!hero) return

      // Measure in the normal page flow so the fixed hero keeps exactly the
      // same width/alignment as the Club Diary content on every screen size.
      clearFixed()
      const rect = hero.getBoundingClientRect()
      const height = rect.height
      const top = visibleSiteHeaderBottom()

      hero.style.position = 'fixed'
      hero.style.top = `${top}px`
      hero.style.left = `${rect.left}px`
      hero.style.width = `${rect.width}px`
      hero.style.zIndex = '250'
      hero.style.boxShadow = '0 12px 30px rgba(10,35,78,.30)'
      hero.style.borderRadius = mobile.matches ? '0 0 16px 16px' : '18px'
      if (spacer) spacer.style.height = `${height}px`
    }

    const queueApply = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(apply, 80)
    }

    findHero()
    apply()
    mobile.addEventListener('change', queueApply)
    window.addEventListener('resize', queueApply)
    window.addEventListener('scroll', positionFixedHero, { passive: true })

    observer = new MutationObserver(() => {
      if (!hero || !document.body.contains(hero)) {
        findHero()
        queueApply()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      resizeObserver?.disconnect()
      mobile.removeEventListener('change', queueApply)
      window.removeEventListener('resize', queueApply)
      window.removeEventListener('scroll', positionFixedHero)
      clearFixed()
      spacer?.remove()
    }
  }, [])

  return null
}
