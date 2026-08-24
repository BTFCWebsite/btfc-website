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
  const [compact, setCompact] = useState(false)

  async function checkAuth() {
    const response = await fetch('/api/club-diary/auth', { cache: 'no-store' }).catch(() => null)
    if (!response?.ok) {
      setRole(null)
      return false
    }
    const data = await response.json().catch(() => ({}))
    if (!data?.authorised) {
      setRole(null)
      return false
    }
    setRole(data?.role === 'admin' ? 'admin' : 'member')
    return true
  }

  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    void checkAuth()
    const onFocus = () => void checkAuth()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  useEffect(() => {
    if (role) return
    const timer = window.setInterval(() => { void checkAuth() }, 800)
    return () => window.clearInterval(timer)
  }, [role])

  useEffect(() => {
    let cancelled = false
    let observer: MutationObserver | null = null
    let timer: ReturnType<typeof setTimeout> | null = null

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
        heroTop.appendChild(host)
      }

      setOriginals((current) => {
        if (current.add === add && current.people === people && current.security === security) return current
        return { add, people, security }
      })
      setAddDisabled(add.disabled)
      setTarget((current) => current === host ? current : host)
    }

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

  useEffect(() => {
    if (!target) return
    const heroTop = target.parentElement as HTMLElement | null

    if (compact) {
      Object.assign(target.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: '6px',
        width: '100%',
        marginLeft: '0',
        alignItems: 'stretch',
      })
      if (heroTop) {
        heroTop.style.flexDirection = 'column'
        heroTop.style.alignItems = 'stretch'
        heroTop.style.gap = '10px'
      }
    } else {
      Object.assign(target.style, {
        display: 'flex',
        gridTemplateColumns: '',
        gap: '8px',
        width: '',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginLeft: 'auto',
      })
      if (heroTop) {
        heroTop.style.flexDirection = ''
        heroTop.style.alignItems = ''
        heroTop.style.gap = ''
      }
    }
  }, [target, compact])

  async function logout() {
    await fetch('/api/club-diary/auth', { method: 'DELETE' }).catch(() => null)
    window.location.replace('/club-diary')
  }

  async function openSecurity() {
    const clickLauncher = () => {
      const button = Array.from(document.querySelectorAll<HTMLButtonElement>('button')).find((item) => {
        const label = item.textContent?.trim()
        return (label === '🔐 Security & Activity' || label === 'Security & Activity') && !item.closest('[data-btfc-hero-controls]')
      })
      if (!button) return false
      button.click()
      return true
    }

    if (originals.security && document.body.contains(originals.security)) {
      originals.security.click()
      return
    }
    if (clickLauncher()) return

    // The security component may have checked auth before the user logged in.
    // Trigger its existing focus re-check, then open it as soon as it renders.
    window.dispatchEvent(new Event('focus'))
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 100))
      if (clickLauncher()) return
    }

    window.alert('Unable to open Security & Activity. Please refresh the Club Diary and try again.')
  }

  if (!target || !role) return null

  const secondary = compact ? compactSecondaryButtonStyle : secondaryButtonStyle
  const primary = compact ? compactPrimaryButtonStyle : primaryButtonStyle

  return createPortal(
    <>
      {role === 'admin' && <button type="button" onClick={() => originals.people?.click()} style={secondary}>People &amp; access</button>}
      {role === 'admin' && <button type="button" onClick={() => void openSecurity()} style={secondary}>Security &amp; Activity</button>}
      <button type="button" onClick={() => void logout()} style={secondary}>Log out</button>
      <button type="button" disabled={addDisabled} onClick={() => originals.add?.click()} style={{ ...primary, opacity: addDisabled ? .55 : 1, cursor: addDisabled ? 'not-allowed' : 'pointer' }}>
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

const compactSecondaryButtonStyle = {
  ...secondaryButtonStyle,
  width: '100%',
  minHeight: 34,
  borderRadius: 8,
  padding: '6px 7px',
  fontSize: 9,
  lineHeight: 1.15,
} as const

const compactPrimaryButtonStyle = {
  ...primaryButtonStyle,
  width: '100%',
  minHeight: 34,
  borderRadius: 8,
  padding: '6px 7px',
  fontSize: 9,
  lineHeight: 1.15,
} as const
