'use client'

import { useEffect } from 'react'

export default function ClubDiaryLogoutSync() {
  useEffect(() => {
    let loggingOut = false

    const tidyAccessButtons = () => {
      for (const button of Array.from(document.querySelectorAll<HTMLButtonElement>('button'))) {
        if (button.textContent?.trim() === 'Switch access') button.style.display = 'none'
      }
    }

    const handleLogout = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('button')
      const label = button?.textContent?.trim()
      if (label !== 'Log out') return

      event.preventDefault()
      event.stopPropagation()
      if (loggingOut) return
      loggingOut = true

      void fetch('/api/club-diary/auth', { method: 'DELETE' })
        .catch(() => null)
        .finally(() => window.location.replace('/club-diary'))
    }

    tidyAccessButtons()
    const observer = new MutationObserver(tidyAccessButtons)
    observer.observe(document.body, { childList: true, subtree: true })
    document.addEventListener('click', handleLogout, true)

    return () => {
      observer.disconnect()
      document.removeEventListener('click', handleLogout, true)
    }
  }, [])

  return null
}
