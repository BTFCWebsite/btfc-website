'use client'

import { useEffect } from 'react'

export default function ClubDiaryUnavailableCount() {
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 760px)')
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const apply = () => {
      const chips = Array.from(document.querySelectorAll<HTMLElement>('[class*="chipUnavailable"][class*="calendarChip"]'))

      for (const chip of chips) {
        const strong = chip.querySelector<HTMLElement>('strong')
        const countLine = Array.from(chip.querySelectorAll<HTMLElement>('span')).find((span) => /^\s*\d+\s+(person|people)\s*$/i.test(span.textContent || '')) || null
        const count = Number((countLine?.textContent || '').match(/\d+/)?.[0] || 0)
        if (!strong || !count) continue

        const desktopLabel = `Unavailable · ${count}`
        if (strong.textContent !== desktopLabel) strong.textContent = desktopLabel
        chip.setAttribute('aria-label', `${count} ${count === 1 ? 'person is' : 'people are'} unavailable`)

        let badge = chip.querySelector<HTMLElement>('[data-btfc-unavailable-count]')
        if (!badge) {
          badge = document.createElement('em')
          badge.dataset.btfcUnavailableCount = 'true'
          chip.appendChild(badge)
        }
        badge.textContent = String(count)

        if (mobile.matches) {
          chip.style.height = '12px'
          chip.style.minHeight = '12px'
          if (countLine) countLine.style.setProperty('display', 'none', 'important')
          strong.style.setProperty('display', 'none', 'important')
          Object.assign(badge.style, {
            display: 'block',
            width: '100%',
            height: '12px',
            lineHeight: '12px',
            margin: '0',
            padding: '0',
            color: '#fff',
            fontSize: '8px',
            fontStyle: 'normal',
            fontWeight: '900',
            textAlign: 'center',
            pointerEvents: 'none',
          })
        } else {
          if (countLine) countLine.style.setProperty('display', 'none', 'important')
          strong.style.removeProperty('display')
          strong.style.whiteSpace = 'nowrap'
          strong.style.overflow = 'hidden'
          strong.style.textOverflow = 'ellipsis'
          badge.style.display = 'none'
        }
      }
    }

    const queueApply = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(apply, 40)
    }

    apply()
    observer = new MutationObserver(queueApply)
    observer.observe(document.body, { childList: true, subtree: true })
    mobile.addEventListener('change', queueApply)
    window.addEventListener('resize', queueApply)

    return () => {
      if (timer) clearTimeout(timer)
      observer?.disconnect()
      mobile.removeEventListener('change', queueApply)
      window.removeEventListener('resize', queueApply)
    }
  }, [])

  return null
}
