'use client'

import { useEffect } from 'react'

export default function ClubDiaryMonthTileNavigation() {
  useEffect(() => {
    const openDay = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null
      const tile = element?.closest<HTMLElement>('[class*="monthDay"] [class*="calendarChip"]')
      if (!tile) return false

      const day = tile.closest<HTMLElement>('[class*="monthDay"]')
      const dayButton = day?.querySelector<HTMLButtonElement>('[class*="dayNumber"]')
      if (!dayButton) return false

      dayButton.click()
      return true
    }

    const onClick = (event: MouseEvent) => {
      const element = event.target instanceof Element ? event.target : null
      if (!element?.closest('[class*="monthDay"] [class*="calendarChip"]')) return

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      openDay(event.target)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      const element = event.target instanceof Element ? event.target : null
      if (!element?.closest('[class*="monthDay"] [class*="calendarChip"]')) return

      event.preventDefault()
      event.stopPropagation()
      event.stopImmediatePropagation()
      openDay(event.target)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown, true)
    }
  }, [])

  return null
}
