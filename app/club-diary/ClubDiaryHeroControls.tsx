'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Role = 'member' | 'admin' | null

type Originals = {
  add: HTMLButtonElement | null
  people: HTMLButtonElement | null
  security: HTMLButtonElement | null
}

const font = "'Montserrat', sans-serif"

export default function ClubDiaryHeroControls() {
  const [role, setRole] = useState<Role>(null)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  const [originals, setOriginals] = useState<Originals>({ add: null, people: null, security: null })
  const [addDisabled, setAddDisabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

    const checkAuth = async () => {
      const response = await fetch('/api/club-diary/auth', { cache: 'no-store' }).catch(() => null)
      if (!response?.ok || cancelled) {
        setRole(null)
        return
      }
      const data = await response.json().catch(() => ({}))
      if (cancelled || !data?.authorised) {
        setRole(null)
        return
      }
      setRole(data?.role === 'admin' ? 'admin' : 'member')
    }

    const arrange = () => {
      if (cancelled) return

      const buttons = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[]
      const add = buttons.find((button) => /^\+ Add(?: availability)?$/.test(button.textContent?.trim() || '')) || null
      const people = buttons.find((button) => button.textContent?.trim() === 'People & access') || null
      const security = buttons.find((button) => button.textContent?.trim() === '🔐 Security & Activity' || button.textContent?.trim() === 'Security & Activity') || null
      const logout = buttons.find((button) => button.textContent?.trim() === 'Log out' && !button.closest('[data-btfc-hero-controls]')) || null

      if (!add || !logout) return

      const hero = Array.from(document.querySelectorAll('section')).find((section) =>
        section.querySelector('h1')?.textContent?.trim() === 'Club Diary'
      ) as HTMLElement | undefined
      const heroTop = hero?.firstElementChild as HTMLElement | null
      if (!hero || !heroTop) return

      const originalHeroActions = add.parentElement as HTMLElement | null
      if (originalHeroActions && !originalHeroActions.dataset.btfcHeroControls) {
        originalHeroActions.style.display = 'none'
      }

      const accountBar = logout.parentElement?.parentElement as HTMLElement | null
      if (accountBar && !accountBar.closest('section')) accountBar.style.display = 'none'
      if (security) security.style.display = 'none'

      let host = heroTop.querySelector<HTMLElement>('[data-btfc-hero-controls]')
      if (!host) {
        host = document.createElement('div')
        host.dataset.btfcHeroControls = 'true'
        Object.assign(host.style, {
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginLeft: 'auto',
        })
        heroTop.appendChild(host)
      }

      setOriginals((current) => {
        if (current.add === add && current.people === people && current.security === security) return current
        return { add, people, security }
      })
      setAddDisabled(add.disabled)
      setTarget((current) => current === host ? current : host)
    }

    void checkAuth()
    arrange()

    observer = new MutationObserver(() => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(arrange, 60)
    })
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled'] })

    return () => {
      cancelled = true
      if (timer) clearTimeout(timer)
      observer?.disconnect()
    }
  }, [])

  async function logout() {
    await fetch('/api/club-diary/auth', { method: 'DELETE' }).catch(() => null)
    window.location.replace('/club-diary')
  }

  if (!target || !role) return null

  return createPortal(
    <>
      {role === 'admin' && <button type="button" onClick={() => originals.people?.click()} style={secondaryButtonStyle}>People &amp; access</button>}
      {role === 'admin' && <button type="button" onClick={() => originals.security?.click()} style={secondaryButtonStyle}>Security &amp; Activity</button>}
      <button type="button" onClick={() => void logout()} style={secondaryButtonStyle}>Log out</button>
      <button type="button" disabled={addDisabled} onClick={() => originals.add?.click()} style={{ ...primaryButtonStyle, opacity: addDisabled ? .55 : 1, cursor: addDisabled ? 'not-allowed' : 'pointer' }}>
        {role === 'admin' ? '+ Add' : '+ Add availability'}
      </button>
    </>,
    target
  )
}

const secondaryButtonStyle = {
  minHeight: 40,
  border: '1px solid rgba(255,255,255,.38)',
  borderRadius: 10,
  background: 'rgba(255,255,255,.10)',
  color: '#fff',
  padding: '8px 12px',
  fontFamily: font,
  fontSize: 11,
  fontWeight: 800,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
} as const

const primaryButtonStyle = {
  minHeight: 40,
  border: 0,
  borderRadius: 10,
  background: '#fff',
  color: '#0B2F69',
  padding: '8px 13px',
  fontFamily: font,
  fontSize: 11,
  fontWeight: 900,
  whiteSpace: 'nowrap',
} as const
