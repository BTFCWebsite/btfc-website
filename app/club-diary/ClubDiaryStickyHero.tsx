'use client'

import { useEffect } from 'react'

export default function ClubDiaryStickyHero() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 900px)')
    let hero: HTMLElement | null = null
    let calendarControls: HTMLElement | null = null
    let toolbar: HTMLElement | null = null
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

    const clearToolbar = () => {
      if (!toolbar) return
      toolbar.style.position = ''
      toolbar.style.top = ''
      toolbar.style.zIndex = ''
      toolbar.style.background = ''
      toolbar.style.marginTop = ''
      toolbar.style.marginBottom = ''
      toolbar.style.paddingTop = ''
      toolbar.style.paddingBottom = ''
      toolbar.style.boxShadow = ''
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
    }

    const visibleSiteHeaderBottom = () => {
      if (mobile.matches) return 0
      const siteHeader = Array.from(document.querySelectorAll<HTMLElement>('header')).find((header) => !header.contains(hero)) || null
      if (!siteHeader) return 0
      const rect = siteHeader.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return 0
      return Math.max(0, Math.min(rect.bottom, window.innerHeight))
    }

    const findStickyRows = () => {
      calendarControls = document.querySelector<HTMLElement>('[class*="calendarControls"]')
      toolbar = document.querySelector<HTMLElement>('[class*="toolbar"]')

      if (calendarControls) {
        calendarControls.style.position = 'sticky'
        calendarControls.style.zIndex = '240'
        calendarControls.style.background = '#f2f4f7'
        calendarControls.style.paddingTop = '8px'
        calendarControls.style.paddingBottom = '7px'
        calendarControls.style.boxShadow = '0 5px 10px rgba(16,24,40,.035)'
      }

      if (toolbar) {
        toolbar.style.background = '#f2f4f7'
        toolbar.style.marginTop = '0'
        toolbar.style.marginBottom = '10px'
        toolbar.style.paddingTop = '6px'
        toolbar.style.paddingBottom = '7px'

        if (mobile.matches) {
          // On phones the category/filter row should remain part of the normal
          // document flow. Keeping it sticky creates a tall fixed stack that
          // covers the top rows of the calendar.
          toolbar.style.position = 'relative'
          toolbar.style.top = ''
          toolbar.style.zIndex = ''
          toolbar.style.boxShadow = ''
        } else {
          toolbar.style.position = 'sticky'
          toolbar.style.zIndex = '235'
          toolbar.style.boxShadow = '0 7px 12px rgba(16,24,40,.035)'
        }
      }
    }

    const positionStickyRows = () => {
      if (!calendarControls || !document.body.contains(calendarControls) || !toolbar || !document.body.contains(toolbar)) {
        findStickyRows()
      }
      if (!hero || hero.style.position !== 'fixed') return

      const heroBottom = Math.ceil(hero.getBoundingClientRect().bottom)
      if (calendarControls) calendarControls.style.top = `${heroBottom}px`

      if (toolbar) {
        if (mobile.matches) {
          toolbar.style.top = ''
        } else {
          const controlsHeight = calendarControls?.getBoundingClientRect().height || 0
          toolbar.style.top = `${heroBottom + Math.ceil(controlsHeight)}px`
        }
      }
    }

    const findHero = () => {
      const nextHero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | null

      if (nextHero === hero) {
        findStickyRows()
        return
      }

      resizeObserver?.disconnect()
      resizeObserver = null
      hero = nextHero

      if (!hero) return

      findStickyRows()
      resizeObserver = new ResizeObserver(() => positionStickyRows())
      resizeObserver.observe(hero)
    }

    const positionFixedHero = () => {
      if (!hero || hero.style.position !== 'fixed') return
      hero.style.top = `${visibleSiteHeaderBottom()}px`
      positionStickyRows()
    }

    const apply = () => {
      if (!hero || !document.body.contains(hero)) findHero()
      if (!hero) return

      clearFixed()
      const rect = hero.getBoundingClientRect()
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

      // Do not reserve a second hero-height spacer. The sticky calendar
      // controls sit directly beneath the fixed hero without a blank band.
      findStickyRows()
      positionStickyRows()
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
      if (!calendarControls || !document.body.contains(calendarControls) || !toolbar || !document.body.contains(toolbar)) {
        findStickyRows()
        positionStickyRows()
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
      clearToolbar()
      clearCalendarControls()
      clearFixed()
    }
  }, [])

  return null
}
