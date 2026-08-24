'use client'

import { useEffect } from 'react'

export default function ClubDiaryMonthDetails() {
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')

    const enhance = () => {
      const monthDays = Array.from(document.querySelectorAll<HTMLElement>('[class*="monthDay"]'))
      const firstCell = monthDays[0]
      const monthGrid = firstCell?.parentElement as HTMLElement | null
      const calendarScroller = monthGrid?.parentElement as HTMLElement | null
      const calendarPanel = calendarScroller?.parentElement as HTMLElement | null
      const weekHeader = calendarScroller?.querySelector<HTMLElement>('[class*="weekHeader"]') || null

      document.documentElement.style.overflowX = media.matches ? 'hidden' : ''
      document.body.style.overflowX = media.matches ? 'hidden' : ''

      if (monthGrid) {
        monthGrid.style.minWidth = media.matches ? '0' : ''
        monthGrid.style.width = media.matches ? '100%' : ''
        monthGrid.style.maxWidth = media.matches ? '100%' : ''
        monthGrid.style.boxSizing = media.matches ? 'border-box' : ''
        monthGrid.style.gridTemplateColumns = media.matches ? 'repeat(7, minmax(0, 1fr))' : ''
      }
      if (weekHeader) {
        weekHeader.style.minWidth = media.matches ? '0' : ''
        weekHeader.style.width = media.matches ? '100%' : ''
        weekHeader.style.maxWidth = media.matches ? '100%' : ''
        weekHeader.style.boxSizing = media.matches ? 'border-box' : ''
        weekHeader.style.gridTemplateColumns = media.matches ? 'repeat(7, minmax(0, 1fr))' : ''
        for (const headerCell of Array.from(weekHeader.children) as HTMLElement[]) {
          headerCell.style.minWidth = media.matches ? '0' : ''
          headerCell.style.padding = media.matches ? '7px 0' : ''
          headerCell.style.fontSize = media.matches ? '9px' : ''
          headerCell.style.overflow = media.matches ? 'hidden' : ''
        }
      }
      if (calendarScroller) {
        calendarScroller.style.width = media.matches ? '100%' : ''
        calendarScroller.style.maxWidth = media.matches ? '100%' : ''
        calendarScroller.style.boxSizing = media.matches ? 'border-box' : ''
        calendarScroller.style.overflowX = media.matches ? 'hidden' : ''
        if (media.matches && calendarScroller.scrollLeft !== 0) calendarScroller.scrollLeft = 0
      }
      if (calendarPanel) {
        calendarPanel.style.width = media.matches ? '100%' : ''
        calendarPanel.style.maxWidth = media.matches ? '100%' : ''
        calendarPanel.style.boxSizing = media.matches ? 'border-box' : ''
      }
      if (media.matches && window.scrollX !== 0) {
        window.scrollTo({ left: 0, top: window.scrollY, behavior: 'auto' })
      }

      for (const cell of monthDays) {
        cell.style.minWidth = media.matches ? '0' : ''
        cell.style.maxWidth = media.matches ? '100%' : ''
        cell.style.boxSizing = media.matches ? 'border-box' : ''
        cell.style.minHeight = media.matches ? '66px' : ''
        cell.style.padding = media.matches ? '4px' : ''
        cell.style.cursor = media.matches ? 'pointer' : ''
        cell.style.overflow = media.matches ? 'hidden' : ''

        const dayNumber = cell.querySelector<HTMLElement>('[class*="dayNumber"]')
        if (dayNumber) {
          dayNumber.style.width = media.matches ? '24px' : ''
          dayNumber.style.height = media.matches ? '24px' : ''
          dayNumber.style.fontSize = media.matches ? '12px' : ''
          dayNumber.style.minWidth = media.matches ? '0' : ''
        }

        const chips = Array.from(cell.querySelectorAll<HTMLElement>('[class*="calendarChip"]'))
        for (const chip of chips) {
          const title = chip.querySelector<HTMLElement>('strong')
          const spans = Array.from(chip.querySelectorAll<HTMLElement>('span'))

          if (media.matches) {
            chip.style.width = '100%'
            chip.style.maxWidth = '100%'
            chip.style.boxSizing = 'border-box'
            chip.style.height = '6px'
            chip.style.minHeight = '6px'
            chip.style.margin = '0 0 3px'
            chip.style.padding = '0'
            chip.style.borderLeftWidth = '0'
            chip.style.borderRadius = '999px'
            chip.style.overflow = 'hidden'
            chip.style.cursor = 'pointer'
            if (title) title.style.display = 'none'
            for (const span of spans) span.style.display = 'none'
          } else {
            chip.style.width = ''
            chip.style.maxWidth = ''
            chip.style.boxSizing = ''
            chip.style.height = ''
            chip.style.minHeight = ''
            chip.style.margin = ''
            chip.style.padding = ''
            chip.style.borderLeftWidth = ''
            chip.style.borderRadius = ''
            chip.style.overflow = ''
            chip.style.cursor = 'pointer'

            if (title) {
              title.style.display = '-webkit-box'
              title.style.webkitBoxOrient = 'vertical'
              title.style.webkitLineClamp = '2'
              title.style.overflow = 'hidden'
              title.style.whiteSpace = 'normal'
              title.style.wordBreak = 'break-word'
            }
            for (const span of spans) span.style.display = ''
          }

          if (!chip.querySelector('[data-month-details]')) {
            const detail = document.createElement('span')
            detail.dataset.monthDetails = 'true'
            detail.textContent = 'View details →'
            detail.style.marginTop = '4px'
            detail.style.fontSize = '9px'
            detail.style.fontWeight = '800'
            detail.style.lineHeight = '1.2'
            detail.style.color = '#475467'
            chip.appendChild(detail)
          }

          const detail = chip.querySelector<HTMLElement>('[data-month-details]')
          if (detail) detail.style.display = media.matches ? 'none' : 'block'

          if (chip.tagName !== 'BUTTON') {
            chip.setAttribute('role', 'button')
            chip.setAttribute('tabindex', '0')
          }
        }

        const more = cell.querySelector<HTMLElement>('[class*="moreItems"]')
        if (more) {
          more.style.maxWidth = media.matches ? '100%' : ''
          more.style.overflow = media.matches ? 'hidden' : ''
          more.style.fontSize = media.matches ? '8px' : ''
          more.style.padding = media.matches ? '0' : ''
          more.style.minHeight = media.matches ? '0' : ''
          more.style.lineHeight = media.matches ? '1.1' : ''
        }
      }
    }

    const dayButtonFor = (element: Element | null) => {
      const cell = element?.closest<HTMLElement>('[class*="monthDay"]')
      if (!cell) return null
      return cell.querySelector<HTMLButtonElement>('[class*="dayNumber"]')
    }

    const openDayFromChip = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const chip = element?.closest<HTMLElement>('[class*="monthDay"] [class*="calendarChip"]')
      if (!chip) return false
      const dayButton = dayButtonFor(chip)
      if (!dayButton) return false
      dayButton.click()
      return true
    }

    const openDayFromCell = (target: EventTarget | null) => {
      if (!media.matches) return false
      const element = target instanceof Element ? target : null
      const cell = element?.closest<HTMLElement>('[class*="monthDay"]')
      if (!cell) return false
      const dayButton = dayButtonFor(cell)
      if (!dayButton || element === dayButton || element?.closest('[class*="dayNumber"]')) return false
      dayButton.click()
      return true
    }

    const handleClick = (event: MouseEvent) => {
      if (!openDayFromChip(event.target) && !openDayFromCell(event.target)) return
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
    media.addEventListener('change', enhance)
    document.addEventListener('click', handleClick, true)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.documentElement.style.overflowX = ''
      document.body.style.overflowX = ''
      observer.disconnect()
      media.removeEventListener('change', enhance)
      document.removeEventListener('click', handleClick, true)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [])

  return null
}
