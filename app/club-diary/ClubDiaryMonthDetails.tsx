'use client'

import { useEffect } from 'react'

function mobileBarColour(chip: HTMLElement) {
  const classes = chip.className
  if (classes.includes('chipFirst')) return '#2E75B6'
  if (classes.includes('chipReserves')) return '#3A9152'
  if (classes.includes('chipU17')) return '#D89B19'
  if (classes.includes('chipUnavailable')) return '#D85858'
  if (classes.includes('chipClubhouse')) return '#7A5BC8'
  if (classes.includes('chipWorkingParty')) return '#D9722C'
  if (classes.includes('chipEvent')) return '#148A8A'
  if (classes.includes('chipMeeting')) return '#56647A'
  return '#7A8494'
}

export default function ClubDiaryMonthDetails() {
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)')

    const openDayForCell = (cell: HTMLElement | null) => {
      const dayButton = cell?.querySelector<HTMLButtonElement>('[class*="dayNumber"]')
      if (!dayButton) return
      dayButton.click()
    }

    const enhance = () => {
      const monthDays = Array.from(document.querySelectorAll<HTMLElement>('[class*="monthDay"]'))
      const firstCell = monthDays[0]
      const monthGrid = firstCell?.parentElement as HTMLElement | null
      const calendarScroller = monthGrid?.parentElement as HTMLElement | null
      const calendarPanel = calendarScroller?.parentElement as HTMLElement | null
      const weekHeader = calendarScroller?.querySelector<HTMLElement>('[class*="weekHeader"]') || null
      const shell = calendarPanel?.closest<HTMLElement>('[class*="shell"]') || null
      const page = shell?.closest<HTMLElement>('[class*="page"]') || null
      const calendarControls = document.querySelector<HTMLElement>('[class*="calendarControls"]')
      const calendarNav = document.querySelector<HTMLElement>('[class*="calendarNav"]')
      const calendarPeriod = document.querySelector<HTMLElement>('[class*="calendarPeriod"]')
      const viewButtons = document.querySelector<HTMLElement>('[class*="viewButtons"]')
      const toolbar = document.querySelector<HTMLElement>('[class*="toolbar"]')

      document.documentElement.style.overflowX = media.matches ? 'hidden' : ''
      document.body.style.overflowX = media.matches ? 'hidden' : ''

      if (page) {
        page.style.width = media.matches ? '100%' : ''
        page.style.maxWidth = media.matches ? '100vw' : ''
        page.style.boxSizing = media.matches ? 'border-box' : ''
        page.style.overflowX = media.matches ? 'hidden' : ''
      }

      if (shell) {
        shell.style.width = media.matches ? '100%' : ''
        shell.style.maxWidth = media.matches ? '100%' : ''
        shell.style.minWidth = media.matches ? '0' : ''
        shell.style.boxSizing = media.matches ? 'border-box' : ''
        shell.style.overflowX = media.matches ? 'hidden' : ''
      }

      if (calendarControls) {
        calendarControls.style.width = media.matches ? '100%' : ''
        calendarControls.style.maxWidth = media.matches ? '100%' : ''
        calendarControls.style.minWidth = media.matches ? '0' : ''
        calendarControls.style.boxSizing = media.matches ? 'border-box' : ''
        calendarControls.style.display = media.matches ? 'grid' : ''
        calendarControls.style.gridTemplateColumns = media.matches ? 'minmax(0, 1fr)' : ''
        calendarControls.style.gap = media.matches ? '10px' : ''
      }

      if (calendarNav) {
        calendarNav.style.width = media.matches ? '100%' : ''
        calendarNav.style.maxWidth = media.matches ? '100%' : ''
        calendarNav.style.minWidth = media.matches ? '0' : ''
        calendarNav.style.boxSizing = media.matches ? 'border-box' : ''
        calendarNav.style.display = media.matches ? 'grid' : ''
        calendarNav.style.gridTemplateColumns = media.matches ? '44px auto 44px minmax(0, 1fr)' : ''
        calendarNav.style.gap = media.matches ? '8px' : ''
      }

      if (calendarPeriod) {
        calendarPeriod.style.minWidth = media.matches ? '0' : ''
        calendarPeriod.style.width = media.matches ? 'auto' : ''
        calendarPeriod.style.maxWidth = media.matches ? '100%' : ''
        calendarPeriod.style.overflow = media.matches ? 'hidden' : ''
        calendarPeriod.style.whiteSpace = media.matches ? 'nowrap' : ''
        calendarPeriod.style.textOverflow = media.matches ? 'ellipsis' : ''
        calendarPeriod.style.textAlign = media.matches ? 'right' : ''
        calendarPeriod.style.alignSelf = media.matches ? 'center' : ''
      }

      if (viewButtons) {
        viewButtons.style.width = media.matches ? '100%' : ''
        viewButtons.style.maxWidth = media.matches ? '100%' : ''
        viewButtons.style.minWidth = media.matches ? '0' : ''
        viewButtons.style.boxSizing = media.matches ? 'border-box' : ''
        viewButtons.style.display = media.matches ? 'grid' : ''
        viewButtons.style.gridTemplateColumns = media.matches ? 'repeat(3, minmax(0, 1fr))' : ''
        viewButtons.style.gap = media.matches ? '8px' : ''
        for (const button of Array.from(viewButtons.children) as HTMLElement[]) {
          button.style.width = media.matches ? '100%' : ''
          button.style.minWidth = media.matches ? '0' : ''
          button.style.maxWidth = media.matches ? '100%' : ''
          button.style.boxSizing = media.matches ? 'border-box' : ''
          button.style.paddingLeft = media.matches ? '4px' : ''
          button.style.paddingRight = media.matches ? '4px' : ''
        }
      }

      if (toolbar) {
        toolbar.style.width = media.matches ? '100%' : ''
        toolbar.style.maxWidth = media.matches ? '100%' : ''
        toolbar.style.minWidth = media.matches ? '0' : ''
        toolbar.style.boxSizing = media.matches ? 'border-box' : ''
      }

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
          headerCell.style.maxWidth = media.matches ? '100%' : ''
          headerCell.style.boxSizing = media.matches ? 'border-box' : ''
          headerCell.style.padding = media.matches ? '7px 0' : ''
          headerCell.style.fontSize = media.matches ? '9px' : ''
          headerCell.style.overflow = media.matches ? 'hidden' : ''
        }
      }
      if (calendarScroller) {
        calendarScroller.style.width = media.matches ? '100%' : ''
        calendarScroller.style.maxWidth = media.matches ? '100%' : ''
        calendarScroller.style.minWidth = media.matches ? '0' : ''
        calendarScroller.style.boxSizing = media.matches ? 'border-box' : ''
        calendarScroller.style.overflowX = media.matches ? 'hidden' : ''
        if (media.matches && calendarScroller.scrollLeft !== 0) calendarScroller.scrollLeft = 0
      }
      if (calendarPanel) {
        calendarPanel.style.width = media.matches ? '100%' : ''
        calendarPanel.style.maxWidth = media.matches ? '100%' : ''
        calendarPanel.style.minWidth = media.matches ? '0' : ''
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
            chip.style.height = '8px'
            chip.style.minHeight = '8px'
            chip.style.margin = '0 0 4px'
            chip.style.padding = '0'
            chip.style.borderLeftWidth = '0'
            chip.style.borderRadius = '999px'
            chip.style.overflow = 'hidden'
            chip.style.cursor = 'pointer'
            chip.style.touchAction = 'manipulation'
            chip.style.backgroundColor = mobileBarColour(chip)
            chip.style.boxShadow = 'inset 0 0 0 1px rgba(0,0,0,.08)'
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
            chip.style.touchAction = ''
            chip.style.backgroundColor = ''
            chip.style.boxShadow = ''

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

          if (chip.dataset.btfcMonthOpen !== 'true') {
            chip.dataset.btfcMonthOpen = 'true'
            chip.addEventListener('click', (event) => {
              event.preventDefault()
              event.stopPropagation()
              event.stopImmediatePropagation()
              openDayForCell(chip.closest<HTMLElement>('[class*="monthDay"]'))
            })
            chip.addEventListener('keydown', (event) => {
              if (event.key !== 'Enter' && event.key !== ' ') return
              event.preventDefault()
              event.stopPropagation()
              openDayForCell(chip.closest<HTMLElement>('[class*="monthDay"]'))
            })
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

        if (cell.dataset.btfcMonthCellOpen !== 'true') {
          cell.dataset.btfcMonthCellOpen = 'true'
          cell.addEventListener('click', (event) => {
            if (!media.matches) return
            const target = event.target instanceof Element ? event.target : null
            if (target?.closest('[class*="calendarChip"]') || target?.closest('[class*="dayNumber"]') || target?.closest('[class*="moreItems"]')) return
            openDayForCell(cell)
          })
        }
      }
    }

    enhance()
    const observer = new MutationObserver(() => enhance())
    observer.observe(document.body, { childList: true, subtree: true })
    media.addEventListener('change', enhance)
    window.addEventListener('resize', enhance)

    return () => {
      document.documentElement.style.overflowX = ''
      document.body.style.overflowX = ''
      observer.disconnect()
      media.removeEventListener('change', enhance)
      window.removeEventListener('resize', enhance)
    }
  }, [])

  return null
}
