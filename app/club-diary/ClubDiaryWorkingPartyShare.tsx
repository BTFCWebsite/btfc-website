'use client'

import { useEffect } from 'react'

type WorkingParty = {
  _id: string
  title: string
  category: string
  startDate: string
  endDate?: string
  startTime?: string
  notes?: string
  targetHelpers?: number
  inviteCode?: string
}

function prettyDate(value = '') {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

function inviteMessage(event: WorkingParty, url: string) {
  const when = `${prettyDate(event.startDate)}${event.startTime ? ` at ${event.startTime}` : ''}`
  const lines = [
    `⚽ BTFC Working Party – ${event.title}`,
    when,
  ]
  if (event.notes) lines.push(event.notes)
  if (event.targetHelpers) lines.push(`We are hoping for around ${event.targetHelpers} helpers.`)
  lines.push('', 'Can you help? Please tap the link and let us know:', url)
  return lines.join('\n')
}

function buttonStyle(primary = false) {
  return Object.assign(document.createElement('a').style, {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '36px',
    padding: '7px 11px',
    borderRadius: '8px',
    border: primary ? '1px solid #167c4f' : '1px solid #cbd5e1',
    background: primary ? '#167c4f' : '#fff',
    color: primary ? '#fff' : '#1e3a5f',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '11px',
    fontWeight: '800',
    textDecoration: 'none',
    cursor: 'pointer',
    boxSizing: 'border-box',
  })
}

export default function ClubDiaryWorkingPartyShare() {
  useEffect(() => {
    let cancelled = false
    let workingParties: WorkingParty[] = []
    let lastFetch = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const fetchWorkingParties = async (force = false) => {
      if (!force && Date.now() - lastFetch < 2000) return
      lastFetch = Date.now()
      try {
        const response = await fetch('/api/club-diary', { cache: 'no-store' })
        const data = await response.json().catch(() => ({}))
        if (!response.ok || data?.role !== 'admin') {
          workingParties = []
          return
        }
        workingParties = (Array.isArray(data?.events) ? data.events : []).filter((event: WorkingParty) =>
          event?.category === 'workingParty' && Boolean(event?.inviteCode)
        )
      } catch {
        workingParties = []
      }
    }

    const addShareButtons = () => {
      if (cancelled || !workingParties.length) return

      for (const article of Array.from(document.querySelectorAll('article'))) {
        const kicker = Array.from(article.querySelectorAll('p')).find((node) => node.textContent?.trim().toLowerCase() === 'working party')
        if (!kicker) continue

        const title = article.querySelector('h3')?.textContent?.trim() || ''
        const event = workingParties.find((item) => item.title === title && item.inviteCode)
        if (!event?.inviteCode) continue

        const existing = article.querySelector('[data-btfc-working-party-share]')
        if (existing) continue

        const oldShare = Array.from(article.querySelectorAll('button')).find((button) => button.textContent?.trim() === 'Share invite')
        if (!oldShare) continue
        ;(oldShare as HTMLElement).style.display = 'none'

        const url = `${window.location.origin}/club-diary/rsvp/${event.inviteCode}`
        const message = inviteMessage(event, url)
        const actions = document.createElement('div')
        actions.dataset.btfcWorkingPartyShare = 'true'
        Object.assign(actions.style, {
          display: 'flex',
          gap: '7px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
        })

        const whatsapp = document.createElement('a')
        whatsapp.href = `https://wa.me/?text=${encodeURIComponent(message)}`
        whatsapp.target = '_blank'
        whatsapp.rel = 'noopener noreferrer'
        whatsapp.textContent = 'WhatsApp'
        Object.assign(whatsapp.style, buttonStyle(true))

        const email = document.createElement('a')
        email.href = `mailto:?subject=${encodeURIComponent(`BTFC Working Party – ${event.title}`)}&body=${encodeURIComponent(message)}`
        email.textContent = 'Email'
        Object.assign(email.style, buttonStyle(false))

        const copy = document.createElement('button')
        copy.type = 'button'
        copy.textContent = 'Copy invite link'
        Object.assign(copy.style, buttonStyle(false))
        copy.addEventListener('click', async () => {
          try {
            await navigator.clipboard.writeText(url)
            const original = copy.textContent
            copy.textContent = 'Copied ✓'
            window.setTimeout(() => { copy.textContent = original }, 1600)
          } catch {
            window.prompt('Copy this working-party invite link:', url)
          }
        })

        actions.append(whatsapp, email, copy)
        oldShare.parentElement?.appendChild(actions)
      }
    }

    const refresh = async (force = false) => {
      await fetchWorkingParties(force)
      addShareButtons()
    }

    void refresh(true)

    const observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { void refresh(false) }, 250)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      observer.disconnect()
    }
  }, [])

  return null
}
