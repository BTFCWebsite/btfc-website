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

    const resetHero = () => {
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

    const resetControls = () => {
      if (!calendarControls) return
      calendarControls.style.position = ''
      calendarControls.style.top = ''
      calendarControls.style.left = ''
      calendarControls.style.width = ''
      calendarControls.style.maxWidth = ''
      calendarControls.style.margin = ''
      calendarControls.style.zIndex = ''
      calendarControls.style.background = ''
      calendarControls.style.paddingTop = ''
      calendarControls.style.paddingBottom = ''
      calendarControls.style.boxShadow = ''
      calendarControls.style.boxSizing = ''
    }

    const resetToolbar = () => {
      if (!toolbar) return
      for (const property of ['position', 'top', 'right', 'bottom', 'left', 'inset', 'z-index', 'transform', 'background', 'margin-top', 'margin-bottom', 'padding-top', 'padding-bottom', 'box-shadow']) {
        toolbar.style.removeProperty(property)
      }
    }

    const ensureStickyAncestors = () => {
      if (!mobile.matches) return
      const shell = hero?.closest<HTMLElement>('[class*="shell"]') || null
      const page = shell?.closest<HTMLElement>('[class*="page"]') || null
      // overflow-x:hidden creates a scroll container on Safari and prevents
      // sticky descendants from sticking to the viewport. clip prevents side
      // overflow without becoming a scrolling ancestor.
      document.documentElement.style.overflowX = 'clip'
      document.body.style.overflowX = 'clip'
      if (page) page.style.overflowX = 'clip'
      if (shell) shell.style.overflowX = 'clip'
    }

    const visibleSiteHeaderBottom = () => {
      if (mobile.matches) return 0
      const siteHeader = Array.from(document.querySelectorAll<HTMLElement>('header')).find((header) => !header.contains(hero)) || null
      if (!siteHeader) return 0
      const rect = siteHeader.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return 0
      return Math.max(0, Math.min(rect.bottom, window.innerHeight))
    }

    const findElements = () => {
      hero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | null
      calendarControls = document.querySelector<HTMLElement>('[class*="calendarControls"]')
      toolbar = document.querySelector<HTMLElement>('[class*="toolbar"]')
    }

    const styleToolbar = () => {
      if (!toolbar) return
      toolbar.style.background = '#f2f4f7'
      toolbar.style.marginTop = '0'
      toolbar.style.marginBottom = '10px'
      toolbar.style.paddingTop = '6px'
      toolbar.style.paddingBottom = '7px'

      if (mobile.matches) {
        // The filter/category strip must stay in its actual DOM position between
        // the calendar controls and the calendar. Use !important here because
        // older enhancement code and Safari can otherwise leave a sticky/fixed
        // position behind after a re-render, which reserves a blank gap and then
        // paints the filters over the calendar.
        toolbar.style.setProperty('position', 'static', 'important')
        toolbar.style.setProperty('top', 'auto', 'important')
        toolbar.style.setProperty('right', 'auto', 'important')
        toolbar.style.setProperty('bottom', 'auto', 'important')
        toolbar.style.setProperty('left', 'auto', 'important')
        toolbar.style.setProperty('inset', 'auto', 'important')
        toolbar.style.setProperty('z-index', 'auto', 'important')
        toolbar.style.setProperty('transform', 'none', 'important')
        toolbar.style.boxShadow = ''
      } else {
        toolbar.style.position = 'sticky'
        toolbar.style.zIndex = '235'
        toolbar.style.boxShadow = '0 7px 12px rgba(16,24,40,.035)'
      }
    }

    const positionDesktop = () => {
      if (!hero || !calendarControls) return
      const top = visibleSiteHeaderBottom()
      hero.style.top = `${top}px`
      calendarControls.style.top = `${Math.ceil(hero.getBoundingClientRect().bottom)}px`
      if (toolbar) {
        toolbar.style.top = `${Math.ceil(hero.getBoundingClientRect().bottom + calendarControls.getBoundingClientRect().height)}px`
      }
    }

    const apply = () => {
      findElements()
      if (!hero || !calendarControls) return

      resetHero()
      resetControls()
      resetToolbar()
      ensureStickyAncestors()

      hero.style.zIndex = '250'
      hero.style.boxSizing = 'border-box'
      hero.style.boxShadow = '0 12px 30px rgba(10,35,78,.30)'

      calendarControls.style.zIndex = '240'
      calendarControls.style.background = '#f2f4f7'
      calendarControls.style.paddingTop = '8px'
      calendarControls.style.paddingBottom = '7px'
      calendarControls.style.boxSizing = 'border-box'

      if (mobile.matches) {
        // Both sticky elements remain in normal flow, so no manual spacer is
        // needed. The categories remain static directly below these controls.
        hero.style.position = 'sticky'
        hero.style.top = '0px'
        hero.style.left = ''
        hero.style.width = '100%'
        hero.style.maxWidth = '100%'
        hero.style.borderRadius = '0 0 16px 16px'

        calendarControls.style.position = 'sticky'
        calendarControls.style.top = `${Math.ceil(hero.getBoundingClientRect().height)}px`
        calendarControls.style.left = ''
        calendarControls.style.width = '100%'
        calendarControls.style.maxWidth = '100%'
        calendarControls.style.margin = '0'
        calendarControls.style.boxShadow = '0 8px 14px rgba(16,24,40,.08)'
      } else {
        const rect = hero.getBoundingClientRect()
        hero.style.position = 'fixed'
        hero.style.left = `${rect.left}px`
        hero.style.width = `${rect.width}px`
        hero.style.maxWidth = `${rect.width}px`
        hero.style.borderRadius = '18px'

        calendarControls.style.position = 'sticky'
        calendarControls.style.left = ''
        calendarControls.style.width = ''
        calendarControls.style.maxWidth = ''
        calendarControls.style.margin = ''
        calendarControls.style.boxShadow = '0 5px 10px rgba(16,24,40,.035)'
        positionDesktop()
      }

      styleToolbar()
    }

    const refreshPositions = () => {
      if (!hero || !calendarControls) return
      ensureStickyAncestors()
      if (mobile.matches) {
        calendarControls.style.top = `${Math.ceil(hero.getBoundingClientRect().height)}px`
        styleToolbar()
      } else if (hero.style.position === 'fixed') {
        positionDesktop()
      }
    }

    const queueApply = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(apply, 60)
    }

    apply()

    resizeObserver = new ResizeObserver(() => refreshPositions())
    if (hero) resizeObserver.observe(hero)
    if (calendarControls) resizeObserver.observe(calendarControls)

    mobile.addEventListener('change', queueApply)
    window.addEventListener('resize', queueApply)
    window.addEventListener('scroll', refreshPositions, { passive: true })

    observer = new MutationObserver(() => {
      if (!hero || !document.body.contains(hero) || !calendarControls || !document.body.contains(calendarControls)) {
        queueApply()
        return
      }
      ensureStickyAncestors()
      // Reassert the mobile toolbar flow after React/calendar mutations.
      if (!toolbar || !document.body.contains(toolbar)) toolbar = document.querySelector<HTMLElement>('[class*="toolbar"]')
      styleToolbar()
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      resizeObserver?.disconnect()
      mobile.removeEventListener('change', queueApply)
      window.removeEventListener('resize', queueApply)
      window.removeEventListener('scroll', refreshPositions)
      resetToolbar()
      resetControls()
      resetHero()
    }
  }, [])

  return null
}
