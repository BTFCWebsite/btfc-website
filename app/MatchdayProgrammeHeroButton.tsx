'use client'

import { useEffect } from 'react'

function ensureProgrammeButton() {
  if (window.location.pathname !== '/matchday') return

  const actions = document.querySelector('.matchday-hero-actions') as HTMLElement | null
  if (!actions) return

  const existing = Array.from(actions.querySelectorAll('a')).find((link) =>
    (link.textContent || '').toLowerCase().includes('view match programme')
  )
  if (existing) return

  const firstSlot = actions.firstElementChild as HTMLElement | null
  const link = document.createElement('a')
  link.href = '/programme'
  link.target = '_blank'
  link.rel = 'noopener noreferrer'
  link.dataset.matchdayProgrammeFallback = 'true'
  link.textContent = '📖 View Match Programme'
  Object.assign(link.style, {
    display: 'inline-block',
    background: '#1149D8',
    padding: '13px 22px',
    borderRadius: '6px',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: '800',
    fontSize: '18px',
    color: '#fff',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  })

  if (firstSlot) firstSlot.appendChild(link)
  else actions.prepend(link)
}

export default function MatchdayProgrammeHeroButton() {
  useEffect(() => {
    ensureProgrammeButton()
    const observer = new MutationObserver(ensureProgrammeButton)
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return null
}
