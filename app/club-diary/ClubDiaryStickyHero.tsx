'use client'

import { useEffect } from 'react'

export default function ClubDiaryStickyHero() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 900px)')
    let hero: HTMLElement | null = null
    let calendarControls: HTMLElement | null = null
    let toolbar: HTMLElement | null = null
    let shell: HTMLElement | null = null
    let observer: MutationObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let controlsResizeObserver: ResizeObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const clearCalendarControls = () => {
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
      if (hero) {
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
      if (shell) shell.style.paddingTop = ''
    }

    const visibleSiteHeaderBottom = () => {
      if (mobile.matches) return 0
      const siteHeader = Array.from(document.querySelectorAll<HTMLElement>('header')).find((header) => !header.contains(hero)) || null
      if (!siteHeader) return 0
      const rect = siteHeader.getBoundingClientRect()
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return 0
      return Math.max(0, Math.min(rect.bottom, window.innerHeight))
    }

    const findRows = () => {
      calendarControls = document.querySelector<HTMLElement>('[class*="calendarControls"]')
      toolbar = document.querySelector<HTMLElement>('[class*="toolbar"]')
      shell = hero?.closest<HTMLElement>('[class*="shell"]') || null

      controlsResizeObserver?.disconnect()
      controlsResizeObserver = null
      if (calendarControls) {
        controlsResizeObserver = new ResizeObserver(() => positionRows())
        controlsResizeObserver.observe(calendarControls)
      }
    }

    const styleRows = () => {
      if (!calendarControls || !toolbar) findRows()

      if (calendarControls) {
        calendarControls.style.zIndex = '240'
        calendarControls.style.background = '#f2f4f7'
        calendarControls.style.paddingTop = '8px'
        calendarControls.style.paddingBottom = '7px'
        calendarControls.style.boxSizing = 'border-box'

        if (mobile.matches) {
          calendarControls.style.position = 'fixed'
          calendarControls.style.left = '10px'
          calendarControls.style.width = 'calc(100vw - 20px)'
          calendarControls.style.maxWidth = 'calc(100vw - 20px)'
          calendarControls.style.margin = '0'
          calendarControls.style.boxShadow = '0 8px 14px rgba(16,24,40,.08)'
        } else {
          calendarControls.style.position = 'sticky'
          calendarControls.style.left = ''
          calendarControls.style.width = ''
          calendarControls.style.maxWidth = ''
          calendarControls.style.margin = ''
          calendarControls.style.boxShadow = '0 5px 10px rgba(16,24,40,.035)'
        }
      }

      if (toolbar) {
        toolbar.style.background = '#f2f4f7'
        toolbar.style.marginTop = '0'
        toolbar.style.marginBottom = '10px'
        toolbar.style.paddingTop = '6px'
        toolbar.style.paddingBottom = '7px'

        if (mobile.matches) {
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

    const positionRows = () => {
      if (!hero || hero.style.position !== 'fixed') return
      if (!calendarControls || !toolbar || !shell) findRows()
      styleRows()

      const heroBottom = Math.ceil(hero.getBoundingClientRect().bottom)
      if (calendarControls) calendarControls.style.top = `${heroBottom}px`

      if (mobile.matches) {
        if (shell && calendarControls) {
          const controlsHeight = Math.ceil(calendarControls.getBoundingClientRect().height)
          // The hero is fixed but must not be reserved again in the document
          // flow. Reserve only the controls that are also removed from flow;
          // this mirrors the desktop fix and removes the large opening gap.
          shell.style.paddingTop = `${controlsHeight + 8}px`
        }
        if (toolbar) toolbar.style.top = ''
      } else {
        if (shell) shell.style.paddingTop = ''
        if (toolbar) {
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
        findRows()
        return
      }

      resizeObserver?.disconnect()
      resizeObserver = null
      controlsResizeObserver?.disconnect()
      controlsResizeObserver = null
      hero = nextHero

      if (!hero) return

      findRows()
      resizeObserver = new ResizeObserver(() => positionRows())
      resizeObserver.observe(hero)
    }

    const positionFixedHero = () => {
      if (!hero || hero.style.position !== 'fixed') return
      hero.style.top = `${visibleSiteHeaderBottom()}px`
      positionRows()
    }

    const apply = () => {
      if (!hero || !document.body.contains(hero)) findHero()
      if (!hero) return

      clearFixed()
      clearCalendarControls()
      clearToolbar()

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

      findRows()
      styleRows()
      positionRows()
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
        findRows()
        styleRows()
        positionRows()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      resizeObserver?.disconnect()
      controlsResizeObserver?.disconnect()
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
