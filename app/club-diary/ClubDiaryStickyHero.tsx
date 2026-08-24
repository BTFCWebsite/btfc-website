'use client'

import { useEffect } from 'react'

export default function ClubDiaryStickyHero() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 900px)')
    let hero: HTMLElement | null = null
    let calendarControls: HTMLElement | null = null
    let spacer: HTMLDivElement | null = null
    let observer: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const clearCalendarControls = () => {
      if (!calendarControls) return
      calendarControls.style.position = ''
      calendarControls.style.top = ''
      calendarControls.style.zIndex = ''
      calendarControls.style.background = ''
      calendarControls.style.paddingTop = ''
      calendarControls.style.paddingBottom = ''
      calendarControls.style.boxShadow = ''
    }

    const clearFixed = () => {
      if (!hero) return
      hero.style.position = ''
      hero.style.top = ''
      hero.style.left = ''
      hero.style.width = ''
      hero.style.maxWidth = ''
      hero.style.boxSizing = ''
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

    const findCalendarControls = () => {
      calendarControls = document.querySelector<HTMLElement>('[class*="calendarControls"]')
      if (!calendarControls) return
      calendarControls.style.position = 'sticky'
      calendarControls.style.zIndex = '240'
      calendarControls.style.background = '#f2f4f7'
      calendarControls.style.paddingTop = '8px'
      calendarControls.style.paddingBottom = '7px'
      calendarControls.style.boxShadow = '0 8px 14px rgba(16,24,40,.04)'
    }

    const positionCalendarControls = () => {
      if (!calendarControls || !document.body.contains(calendarControls)) findCalendarControls()
      if (!calendarControls || !hero || hero.style.position !== 'fixed') return
      calendarControls.style.top = `${Math.ceil(hero.getBoundingClientRect().bottom + 4)}px`
    }

    const findHero = () => {
      const nextHero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | null

      if (nextHero === hero) {
        if (!calendarControls || !document.body.contains(calendarControls)) findCalendarControls()
        return
      }

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
      findCalendarControls()

      resizeObserver = new ResizeObserver(() => {
        if (hero && spacer && hero.style.position === 'fixed') {
          spacer.style.height = `${hero.getBoundingClientRect().height}px`
          positionCalendarControls()
        }
      })
      resizeObserver.observe(hero)
    }

    const positionFixedHero = () => {
      if (!hero || hero.style.position !== 'fixed') return
      hero.style.top = `${visibleSiteHeaderBottom()}px`
      positionCalendarControls()
    }

    const apply = () => {
      if (!hero || !document.body.contains(hero)) findHero()
      if (!hero) return

      clearFixed()
      const rect = hero.getBoundingClientRect()
      const height = rect.height
      const top = visibleSiteHeaderBottom()

      hero.style.position = 'fixed'
      hero.style.top = `${top}px`
      hero.style.zIndex = '250'
      hero.style.boxShadow = '0 12px 30px rgba(10,35,78,.30)'
      hero.style.boxSizing = 'border-box'

      if (mobile.matches) {
        hero.style.left = '10px'
        hero.style.width = 'calc(100vw - 20px)'
        hero.style.maxWidth = 'calc(100vw - 20px)'
        hero.style.borderRadius = '0 0 16px 16px'
      } else {
        hero.style.left = `${rect.left}px`
        hero.style.width = `${rect.width}px`
        hero.style.maxWidth = `${rect.width}px`
        hero.style.borderRadius = '18px'
      }

      if (spacer) spacer.style.height = `${height}px`
      findCalendarControls()
      positionCalendarControls()
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
        return
      }
      if (!calendarControls || !document.body.contains(calendarControls)) {
        findCalendarControls()
        positionCalendarControls()
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
      clearCalendarControls()
      clearFixed()
      spacer?.remove()
    }
  }, [])

  return null
}
