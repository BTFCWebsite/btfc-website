'use client'

import { useEffect } from 'react'

export default function ClubDiaryLogoutSync() {
  useEffect(() => {
    let loggingOut = false

    const handleLogout = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('button')
      const label = button?.textContent?.trim()
      if (label !== 'Log out' && label !== 'Switch access') return

      event.preventDefault()
      event.stopPropagation()
      if (loggingOut) return
      loggingOut = true

      void fetch('/api/club-diary/auth', { method: 'DELETE' })
        .catch(() => null)
        .finally(() => window.location.replace('/club-diary'))
    }

    document.addEventListener('click', handleLogout, true)
    return () => document.removeEventListener('click', handleLogout, true)
  }, [])

  return null
}
