'use client'

import { useEffect } from 'react'

export default function ClubDiaryBackNavigation() {
  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 901px)')
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const sync = () => {
      const backRow = document.querySelector<HTMLElement>('.clubDiaryBackRow')
      const heroHost = document.querySelector<HTMLElement>('[data-btfc-hero-controls]')
      let heroBack = document.querySelector<HTMLAnchorElement>('[data-btfc-hero-back]')

      // The route-level Back row is useful on login/setup screens, but once the
      // desktop diary hero is present it creates a blank band because the hero is
      // fixed. Move that navigation into the hero instead. Mobile is untouched.
      if (desktop.matches && heroHost) {
        backRow?.style.setProperty('display', 'none', 'important')

        if (!heroBack) {
          heroBack = document.createElement('a')
          heroBack.dataset.btfcHeroBack = 'true'
          heroBack.href = '/'
          heroBack.textContent = '← Back to home'
          Object.assign(heroBack.style, {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40px',
            border: '1px solid rgba(255,255,255,.38)',
            borderRadius: '10px',
            background: 'rgba(255,255,255,.10)',
            color: '#fff',
            padding: '8px 12px',
            fontFamily: "'Montserrat', sans-serif",
            fontSize: '11px',
            fontWeight: '800',
            lineHeight: '1',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          })
          heroHost.prepend(heroBack)
        }
      } else {
        backRow?.style.removeProperty('display')
        heroBack?.remove()
        heroBack = null
      }

      // Modal exits should describe where they take the user rather than just
      // saying Close.
      for (const dialog of Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))) {
        const label = dialog.getAttribute('aria-label') || ''
        if (!/People and access|Club Diary security and activity/i.test(label)) continue
        const close = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button')).find((button) =>
          button.textContent?.trim() === 'Close' || button.dataset.btfcBackToDiary === 'true'
        )
        if (close) {
          close.dataset.btfcBackToDiary = 'true'
          if (close.textContent?.trim() !== '← Back to diary') close.textContent = '← Back to diary'
        }
      }

      // The add/edit form already cancels safely; make that route explicit too.
      for (const form of Array.from(document.querySelectorAll<HTMLFormElement>('form'))) {
        const heading = form.querySelector('h2')?.textContent?.trim() || ''
        if (!/Add to Club Diary|Add my availability|Edit diary entry/i.test(heading)) continue
        const cancel = Array.from(form.querySelectorAll<HTMLButtonElement>('button')).find((button) =>
          button.textContent?.trim() === 'Cancel' || button.dataset.btfcBackToDiary === 'true'
        )
        if (cancel) {
          cancel.dataset.btfcBackToDiary = 'true'
          if (cancel.textContent?.trim() !== '← Back to diary') cancel.textContent = '← Back to diary'
        }
      }

      // A normal Day view gets a direct route back to Month. When an individual
      // item is open, the existing Back to day control takes priority.
      const dayHeader = document.querySelector<HTMLElement>('[class*="dayViewHeader"]')
      const backToDay = dayHeader?.querySelector<HTMLElement>('[data-btfc-back-to-day]') || null
      let backToMonth = dayHeader?.querySelector<HTMLButtonElement>('[data-btfc-back-to-month]') || null

      if (dayHeader && !backToMonth) {
        const monthButton = Array.from(document.querySelectorAll<HTMLButtonElement>('[class*="viewButton"]')).find((button) => button.textContent?.trim() === 'Month')
        if (monthButton) {
          backToMonth = monthButton.cloneNode(false) as HTMLButtonElement
          backToMonth.type = 'button'
          backToMonth.dataset.btfcBackToMonth = 'true'
          backToMonth.textContent = '← Back to month'
          backToMonth.addEventListener('click', () => monthButton.click())
          dayHeader.appendChild(backToMonth)
        }
      }

      if (backToMonth) backToMonth.style.display = backToDay ? 'none' : ''
    }

    const queueSync = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(sync, 30)
    }

    sync()
    desktop.addEventListener('change', sync)
    observer = new MutationObserver(queueSync)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      desktop.removeEventListener('change', sync)
      document.querySelector<HTMLElement>('.clubDiaryBackRow')?.style.removeProperty('display')
      document.querySelector<HTMLElement>('[data-btfc-hero-back]')?.remove()
      document.querySelector<HTMLElement>('[data-btfc-back-to-month]')?.remove()
    }
  }, [])

  return null
}
