'use client'

import { useEffect } from 'react'

export default function ClubDiaryMonthDetails() {
  useEffect(() => {
    const enhance = () => {
      const monthDays = Array.from(document.querySelectorAll<HTMLElement>('[class*="monthDay"]'))

      for (const cell of monthDays) {
        const chips = Array.from(cell.querySelectorAll<HTMLElement>('[class*="calendarChip"]'))
        if (!chips.length) continue

        for (const chip of chips) {
          const title = chip.querySelector<HTMLElement>('strong')
          if (title) {
            title.style.display = '-webkit-box'
            title.style.webkitBoxOrient = 'vertical'
            title.style.webkitLineClamp = '2'
            title.style.overflow = 'hidden'
            title.style.whiteSpace = 'normal'
            title.style.wordBreak = 'break-word'
          }

          if (!chip.querySelector('[data-month-details]')) {
            const detail = document.createElement('span')
            detail.dataset.monthDetails = 'true'
            detail.textContent = 'View details →'
            detail.style.display = 'block'
            detail.style.marginTop = '4px'
            detail.style.fontSize = '9px'
            detail.style.fontWeight = '800'
            detail.style.lineHeight = '1.2'
            detail.style.color = '#475467'
            chip.appendChild(detail)
          }

          chip.style.cursor = 'pointer'
          if (chip.tagName !== 'BUTTON') {
            chip.setAttribute('role', 'button')
            chip.setAttribute('tabindex', '0')
          }
        }
      }
    }

    const openDayFromChip = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const chip = element?.closest<HTMLElement>('[class*="monthDay"] [class*="calendarChip"]')
      if (!chip) return false

      const cell = chip.closest<HTMLElement>('[class*="monthDay"]')
      const dayButton = cell?.querySelector<HTMLButtonElement>('[class*="dayNumber"]')
      if (!dayButton) return false

      dayButton.click()
      return true
    }

    const handleClick = (event: MouseEvent) => {
      if (!openDayFromChip(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      if (!openDayFromChip(event.target)) return
      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
    }

    enhance()
    const observer = new MutationObserver(() => enhance())
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  return null
}
