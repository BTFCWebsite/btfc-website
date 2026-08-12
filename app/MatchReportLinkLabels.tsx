'use client'

import { useEffect } from 'react'

type MatchReport = {
  slug?: string
  matchData?: string
}

function normaliseUrl(value: string) {
  try {
    const url = new URL(value, window.location.origin)
    return `${url.origin}${url.pathname}${url.search}`.replace(/\/$/, '')
  } catch {
    return value.replace(/\/$/, '')
  }
}

export default function MatchReportLinkLabels() {
  useEffect(() => {
    let cancelled = false
    let reportLinks = new Map<string, string>()

    async function loadReports() {
      try {
        const response = await fetch('/api/content?type=matchReports', { cache: 'no-store' })
        if (!response.ok) return
        const reports: MatchReport[] = await response.json()
        const next = new Map<string, string>()

        for (const report of reports || []) {
          if (!report?.slug || !report?.matchData) continue
          try {
            const match = JSON.parse(report.matchData)
            if (match?.sourceUrl) next.set(normaliseUrl(match.sourceUrl), `/match-reports/${report.slug}`)
          } catch {
            // Ignore malformed historic report data rather than disrupting fixture links.
          }
        }

        if (!cancelled) {
          reportLinks = next
          updateLinks()
        }
      } catch {
        // Full-Time links remain the safe fallback if report data is unavailable.
      }
    }

    function updateLinks() {
      document.querySelectorAll<HTMLAnchorElement>('a[href*="fulltime.thefa.com"]').forEach((link) => {
        const text = link.textContent?.trim()
        if (text === 'Full-Time details') link.textContent = 'Match Report'
        if (text === 'Full-Time details →') link.textContent = 'Match Report →'

        const localReport = reportLinks.get(normaliseUrl(link.href))
        if (localReport) {
          link.href = localReport
          link.removeAttribute('target')
          link.removeAttribute('rel')
        }
      })
    }

    updateLinks()
    loadReports()
    const observer = new MutationObserver(updateLinks)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelled = true
      observer.disconnect()
    }
  }, [])

  return null
}
