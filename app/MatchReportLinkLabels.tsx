'use client'

import { useEffect } from 'react'

export default function MatchReportLinkLabels() {
  useEffect(() => {
    function renameLinks() {
      document.querySelectorAll<HTMLAnchorElement>('a[href*="fulltime.thefa.com"]').forEach((link) => {
        const text = link.textContent?.trim()
        if (text === 'Full-Time details') link.textContent = 'Match Report'
        if (text === 'Full-Time details →') link.textContent = 'Match Report →'
      })
    }

    renameLinks()
    const observer = new MutationObserver(renameLinks)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
