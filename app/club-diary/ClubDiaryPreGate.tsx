'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import ClubDiaryGate from './ClubDiaryGate'

type Role = 'member' | 'admin'
type Person = { id: string; name: string; hasPin: boolean }

type AuthState = 'checking' | 'loggedOut' | 'loggedIn' | 'setup'

const font = "'Montserrat', sans-serif"
const condensed = "'Barlow Condensed', sans-serif"

export default function ClubDiaryPreGate() {
  const [auth, setAuth] = useState<AuthState>('checking')
  const [mode, setMode] = useState<Role>('member')
  const [people, setPeople] = useState<Person[]>([])
  const [personId, setPersonId] = useState('')
  const [pin, setPin] = useState('')
  const [needsSetup, setNeedsSetup] = useState(false)
  const [setupName, setSetupName] = useState('')
  const [loadingNames, setLoadingNames] = useState(false)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  const selectedPerson = useMemo(() => people.find((person) => person.id === personId) || null, [people, personId])

  useEffect(() => { void checkAuth() }, [])
  useEffect(() => {
    if (auth === 'loggedOut') void loadNames(mode)
  }, [mode, auth])

  async function checkAuth() {
    try {
      const response = await fetch('/api/club-diary/auth', { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (response.status === 503 || data?.configured === false) {
        setAuth('setup')
        return
      }
      setAuth(data?.authorised ? 'loggedIn' : 'loggedOut')
    } catch {
      setAuth('loggedOut')
    }
  }

  async function loadNames(nextMode: Role) {
    setLoadingNames(true)
    setError('')
    setPersonId('')
    setNeedsSetup(false)
    try {
      const response = await fetch(`/api/club-diary/people/options?role=${nextMode}`, { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setPeople([])
        setError(data?.error || 'Unable to load names.')
        return
      }
      const options = Array.isArray(data?.people) ? data.people : []
      setPeople(options)
      setPersonId(options[0]?.id || '')
      setNeedsSetup(Boolean(data?.needsSetup))
    } finally {
      setLoadingNames(false)
    }
  }

  function changeMode(nextMode: Role) {
    setMode(nextMode)
    setPin('')
    setSetupName('')
    setError('')
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    setError('')
    setWorking(true)
    try {
      const response = await fetch('/api/club-diary/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: mode,
          pin,
          personId: needsSetup ? undefined : personId,
          name: needsSetup ? setupName : undefined,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data?.error || 'Unable to open the diary.')
        return
      }
      window.location.reload()
    } finally {
      setWorking(false)
    }
  }

  if (auth === 'checking') {
    return <div style={pageStyle}><div style={cardStyle}>Opening Club Diary…</div></div>
  }

  if (auth === 'setup') {
    return <div style={pageStyle}><div style={cardStyle}>
      <h1 style={titleStyle}>BTFC Club Diary</h1>
      <p style={copyStyle}>The Club Diary security settings still need to be configured in Vercel.</p>
    </div></div>
  }

  if (auth === 'loggedIn') return <ClubDiaryGate />

  const selectedNeedsPin = Boolean(selectedPerson && !selectedPerson.hasPin)
  const canUseSetupPin = selectedNeedsPin && mode === 'admin'
  const loginDisabled = working || loadingNames || (!needsSetup && (!personId || (selectedNeedsPin && !canUseSetupPin)))

  return <div style={pageStyle}>
    <form style={cardStyle} onSubmit={login}>
      <h1 style={titleStyle}>BTFC Club Diary</h1>
      <p style={copyStyle}>Private club diary for authorised officials and volunteers.</p>

      <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
        <button type="button" onClick={() => changeMode('member')} style={tabStyle(mode === 'member')}>General access</button>
        <button type="button" onClick={() => changeMode('admin')} style={tabStyle(mode === 'admin')}>Admin</button>
      </div>

      {needsSetup && mode === 'admin' ? <>
        <div style={noticeStyle}>First-time setup: create the first administrator. After opening the diary, set personal PINs for each person.</div>
        <label style={labelStyle} htmlFor="setupName">Your name</label>
        <input id="setupName" value={setupName} onChange={(event) => setSetupName(event.target.value)} autoComplete="name" required style={inputStyle} />
      </> : <>
        <label style={labelStyle} htmlFor="personSelect">Your name</label>
        <select id="personSelect" value={personId} onChange={(event) => { setPersonId(event.target.value); setPin(''); setError('') }} required style={inputStyle} disabled={loadingNames || people.length === 0}>
          {loadingNames && <option value="">Loading names…</option>}
          {!loadingNames && people.length === 0 && <option value="">No eligible names</option>}
          {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>
        {!loadingNames && people.length === 0 && <div style={noticeStyle}>{mode === 'admin' ? 'No active administrators are available.' : 'No people have been added yet. Ask a diary administrator.'}</div>}
        {selectedNeedsPin && mode === 'member' && <div style={noticeStyle}>A diary administrator needs to set a personal PIN for {selectedPerson?.name} before this account can be used.</div>}
        {canUseSetupPin && <div style={noticeStyle}>This Admin does not have a personal PIN yet. Use the existing Admin setup PIN once, then set a personal PIN from the security controls.</div>}
      </>}

      <label style={labelStyle} htmlFor="diaryPin">
        {needsSetup || canUseSetupPin ? 'Admin setup PIN' : 'Your personal 6-digit PIN'}
      </label>
      <input
        id="diaryPin"
        value={pin}
        onChange={(event) => setPin(event.target.value.replace(/\D/g, '').slice(0, needsSetup || canUseSetupPin ? 12 : 6))}
        inputMode="numeric"
        autoComplete="off"
        required
        style={inputStyle}
        placeholder={needsSetup || canUseSetupPin ? '' : '6 digits'}
      />

      <button type="submit" disabled={loginDisabled} style={primaryStyle}>
        {working ? 'Opening…' : needsSetup && mode === 'admin' ? 'Create administrator & open diary' : 'Open Diary'}
      </button>

      {error && <div style={errorStyle}>{error}</div>}
    </form>
  </div>
}

const pageStyle = { minHeight: '70vh', background: '#F2F2F2', padding: '70px 20px', display: 'grid', placeItems: 'start center' } as const
const cardStyle = { width: '100%', maxWidth: 430, boxSizing: 'border-box', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 28, boxShadow: '0 10px 30px rgba(0,0,0,.06)' } as const
const titleStyle = { fontFamily: condensed, fontSize: 34, lineHeight: 1, fontWeight: 800, color: '#152B59', margin: '0 0 10px' } as const
const copyStyle = { fontFamily: font, fontSize: 12, lineHeight: 1.55, color: '#6B7280', margin: 0 } as const
const labelStyle = { display: 'block', fontFamily: font, fontSize: 11, fontWeight: 700, color: '#374151', margin: '14px 0 6px' } as const
const inputStyle = { width: '100%', boxSizing: 'border-box', minHeight: 44, border: '1px solid #D1D5DB', borderRadius: 7, padding: '0 11px', background: '#fff', fontFamily: font, fontSize: 14, color: '#111827' } as const
const primaryStyle = { width: '100%', minHeight: 44, border: 0, borderRadius: 7, background: '#1149D8', color: '#fff', fontFamily: condensed, fontSize: 18, fontWeight: 800, marginTop: 18, cursor: 'pointer' } as const
const noticeStyle = { marginTop: 12, padding: '10px 12px', borderRadius: 7, background: '#EFF6FF', border: '1px solid #BFDBFE', fontFamily: font, fontSize: 11, lineHeight: 1.5, color: '#1E3A8A' } as const
const errorStyle = { marginTop: 12, padding: '10px 12px', borderRadius: 7, background: '#FEF2F2', border: '1px solid #FECACA', fontFamily: font, fontSize: 11, lineHeight: 1.5, color: '#991B1B' } as const
const tabStyle = (active: boolean) => ({ flex: 1, minHeight: 40, borderRadius: 7, border: active ? '1px solid #1149D8' : '1px solid #D1D5DB', background: active ? '#EAF0FF' : '#fff', color: active ? '#1149D8' : '#4B5563', fontFamily: condensed, fontSize: 16, fontWeight: 800, cursor: 'pointer' })
