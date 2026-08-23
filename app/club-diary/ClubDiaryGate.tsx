'use client'

import { FormEvent, useEffect, useState } from 'react'
import ClubDiaryApp from './ClubDiaryApp'

type Role = 'member' | 'admin'
type LoginPerson = { id: string; name: string }
type ManagedPerson = LoginPerson & { isAdmin: boolean; active: boolean; createdAt: string }

type AuthState = {
  checking: boolean
  configured: boolean
  authorised: boolean
  role: Role | null
  name: string
}

const initialAuth: AuthState = {
  checking: true,
  configured: true,
  authorised: false,
  role: null,
  name: '',
}

const font = "'Montserrat', sans-serif"
const condensed = "'Barlow Condensed', sans-serif"

export default function ClubDiaryGate() {
  const [auth, setAuth] = useState<AuthState>(initialAuth)
  const [mode, setMode] = useState<Role>('member')
  const [pin, setPin] = useState('')
  const [people, setPeople] = useState<LoginPerson[]>([])
  const [personId, setPersonId] = useState('')
  const [pinChecked, setPinChecked] = useState(false)
  const [needsSetup, setNeedsSetup] = useState(false)
  const [setupName, setSetupName] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const [manageOpen, setManageOpen] = useState(false)
  const [managedPeople, setManagedPeople] = useState<ManagedPerson[]>([])
  const [newName, setNewName] = useState('')
  const [newAdmin, setNewAdmin] = useState(false)
  const [manageError, setManageError] = useState('')

  useEffect(() => { void checkAuth() }, [])

  useEffect(() => {
    if (!auth.authorised) return

    const interceptSwitch = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const button = target?.closest('button')
      if (!button || button.textContent?.trim() !== 'Switch access') return
      event.preventDefault()
      event.stopPropagation()
      void logout()
    }

    document.addEventListener('click', interceptSwitch, true)
    return () => document.removeEventListener('click', interceptSwitch, true)
  }, [auth.authorised])

  async function checkAuth() {
    try {
      const response = await fetch('/api/club-diary/auth', { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (response.status === 503 || data?.configured === false) {
        setAuth({ checking: false, configured: false, authorised: false, role: null, name: '' })
        return
      }
      setAuth({
        checking: false,
        configured: true,
        authorised: Boolean(data?.authorised),
        role: data?.role === 'admin' ? 'admin' : data?.role === 'member' ? 'member' : null,
        name: String(data?.name || ''),
      })
    } catch {
      setAuth({ checking: false, configured: true, authorised: false, role: null, name: '' })
    }
  }

  function resetLogin(nextMode: Role) {
    setMode(nextMode)
    setPin('')
    setPeople([])
    setPersonId('')
    setPinChecked(false)
    setNeedsSetup(false)
    setSetupName('')
    setError('')
  }

  async function loadNames(event: FormEvent) {
    event.preventDefault()
    setError('')
    setWorking(true)
    try {
      const response = await fetch('/api/club-diary/people/options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: mode, pin }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data?.error || 'Unable to check that PIN.')
        return
      }
      const options = Array.isArray(data?.people) ? data.people : []
      setPeople(options)
      setPersonId(options[0]?.id || '')
      setNeedsSetup(Boolean(data?.needsSetup))
      setPinChecked(true)
    } finally {
      setWorking(false)
    }
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
      setAuth({
        checking: false,
        configured: true,
        authorised: true,
        role: data?.role === 'admin' ? 'admin' : 'member',
        name: String(data?.name || ''),
      })
    } finally {
      setWorking(false)
    }
  }

  async function logout() {
    await fetch('/api/club-diary/auth', { method: 'DELETE' }).catch(() => null)
    setManageOpen(false)
    resetLogin('member')
    setAuth({ checking: false, configured: true, authorised: false, role: null, name: '' })
  }

  async function loadManagedPeople() {
    setManageError('')
    const response = await fetch('/api/club-diary/people', { cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setManageError(data?.error || 'Unable to load people.')
      return
    }
    setManagedPeople(Array.isArray(data?.people) ? data.people : [])
  }

  async function openManage() {
    setManageOpen(true)
    await loadManagedPeople()
  }

  async function addPerson(event: FormEvent) {
    event.preventDefault()
    setManageError('')
    const response = await fetch('/api/club-diary/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add', name: newName, isAdmin: newAdmin }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setManageError(data?.error || 'Unable to add that person.')
      return
    }
    setNewName('')
    setNewAdmin(false)
    await loadManagedPeople()
  }

  async function updatePerson(person: ManagedPerson, changes: Partial<Pick<ManagedPerson, 'name' | 'isAdmin' | 'active'>>) {
    setManageError('')
    const response = await fetch('/api/club-diary/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id: person.id, ...changes }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setManageError(data?.error || 'Unable to update that person.')
      return
    }
    await loadManagedPeople()
  }

  if (auth.checking) {
    return <div style={pageStyle}><div style={cardStyle}>Opening Club Diary…</div></div>
  }

  if (!auth.configured) {
    return <div style={pageStyle}><div style={cardStyle}>
      <h1 style={titleStyle}>BTFC Club Diary</h1>
      <p style={copyStyle}>The Club Diary security settings still need to be configured in Vercel.</p>
    </div></div>
  }

  if (!auth.authorised) {
    return <div style={pageStyle}>
      <form style={cardStyle} onSubmit={pinChecked ? login : loadNames}>
        <h1 style={titleStyle}>BTFC Club Diary</h1>
        <p style={copyStyle}>Private club diary for authorised officials and volunteers.</p>

        <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
          <button type="button" onClick={() => resetLogin('member')} style={tabStyle(mode === 'member')}>General access</button>
          <button type="button" onClick={() => resetLogin('admin')} style={tabStyle(mode === 'admin')}>Admin</button>
        </div>

        {!pinChecked && <>
          <label style={labelStyle} htmlFor="diaryPin">{mode === 'admin' ? 'Admin PIN' : 'General access PIN'}</label>
          <input id="diaryPin" value={pin} onChange={(event) => setPin(event.target.value)} inputMode="numeric" autoComplete="off" required style={inputStyle} />
          <button type="submit" disabled={working} style={primaryStyle}>{working ? 'Checking…' : 'Continue'}</button>
        </>}

        {pinChecked && needsSetup && <>
          <div style={noticeStyle}>First-time setup: create the first administrator. After login you can add everyone else from <strong>People &amp; access</strong>.</div>
          <label style={labelStyle} htmlFor="setupName">Your name</label>
          <input id="setupName" value={setupName} onChange={(event) => setSetupName(event.target.value)} autoComplete="name" required style={inputStyle} />
          <button type="submit" disabled={working} style={primaryStyle}>{working ? 'Opening…' : 'Create administrator & open diary'}</button>
        </>}

        {pinChecked && !needsSetup && <>
          <label style={labelStyle} htmlFor="personSelect">Your name</label>
          <select id="personSelect" value={personId} onChange={(event) => setPersonId(event.target.value)} required style={inputStyle}>
            {people.length === 0 && <option value="">No eligible names</option>}
            {people.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
          </select>
          {people.length === 0
            ? <div style={noticeStyle}>{mode === 'admin' ? 'No active administrators are available.' : 'No people have been added yet. Ask a diary administrator.'}</div>
            : <button type="submit" disabled={working || !personId} style={primaryStyle}>{working ? 'Opening…' : 'Open Diary'}</button>}
          <button type="button" onClick={() => { setPinChecked(false); setPeople([]); setPersonId(''); setError('') }} style={secondaryStyle}>Use a different PIN</button>
        </>}

        {error && <div style={errorStyle}>{error}</div>}
      </form>
    </div>
  }

  return <>
    <div style={accountBarStyle}>
      <div><strong>{auth.name}</strong><span style={{ opacity: .68 }}> · {auth.role === 'admin' ? 'Admin' : 'General access'}</span></div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {auth.role === 'admin' && <button type="button" onClick={() => void openManage()} style={accountButtonStyle}>People &amp; access</button>}
        <button type="button" onClick={() => void logout()} style={accountButtonStyle}>Log out</button>
      </div>
    </div>

    <ClubDiaryApp />

    {manageOpen && <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="People and access">
      <div style={manageCardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center' }}>
          <div><h2 style={{ ...titleStyle, fontSize: 28, marginBottom: 3 }}>People &amp; access</h2><p style={{ ...copyStyle, margin: 0 }}>All active people appear under General access. Only people marked Admin appear under Admin login.</p></div>
          <button type="button" onClick={() => setManageOpen(false)} style={secondaryStyle}>Close</button>
        </div>

        <form onSubmit={addPerson} style={{ ...sectionStyle, marginTop: 20 }}>
          <strong style={{ fontFamily: condensed, fontSize: 20 }}>Add person</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) auto auto', gap: 10, marginTop: 10, alignItems: 'center' }}>
            <input value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="Full name" required style={{ ...inputStyle, margin: 0 }} />
            <label style={checkStyle}><input type="checkbox" checked={newAdmin} onChange={(event) => setNewAdmin(event.target.checked)} /> Admin</label>
            <button type="submit" style={{ ...primaryStyle, margin: 0 }}>Add</button>
          </div>
        </form>

        {manageError && <div style={errorStyle}>{manageError}</div>}

        <div style={{ ...sectionStyle, marginTop: 14 }}>
          <strong style={{ fontFamily: condensed, fontSize: 20 }}>Approved people</strong>
          <div style={{ display: 'grid', gap: 9, marginTop: 10 }}>
            {managedPeople.map((person) => <PersonRow key={person.id} person={person} onUpdate={updatePerson} />)}
            {managedPeople.length === 0 && <div style={copyStyle}>No people added yet.</div>}
          </div>
        </div>
      </div>
    </div>}
  </>
}

function PersonRow({ person, onUpdate }: { person: ManagedPerson; onUpdate: (person: ManagedPerson, changes: Partial<Pick<ManagedPerson, 'name' | 'isAdmin' | 'active'>>) => Promise<void> }) {
  const [name, setName] = useState(person.name)
  useEffect(() => setName(person.name), [person.name])

  return <div style={{ display: 'grid', gridTemplateColumns: 'minmax(180px, 1fr) auto auto auto', gap: 9, alignItems: 'center', padding: 10, border: '1px solid #E5E7EB', borderRadius: 8, background: person.active ? '#fff' : '#F3F4F6' }}>
    <input value={name} onChange={(event) => setName(event.target.value)} onBlur={() => { if (name.trim() && name.trim() !== person.name) void onUpdate(person, { name: name.trim() }) }} style={{ ...inputStyle, margin: 0 }} />
    <label style={checkStyle}><input type="checkbox" checked={person.isAdmin} onChange={(event) => void onUpdate(person, { isAdmin: event.target.checked })} /> Admin</label>
    <label style={checkStyle}><input type="checkbox" checked={person.active} onChange={(event) => void onUpdate(person, { active: event.target.checked })} /> Active</label>
    <span style={{ fontFamily: font, fontSize: 11, color: '#6B7280' }}>{person.active ? 'Available' : 'Hidden'}</span>
  </div>
}

const pageStyle = { minHeight: '70vh', background: '#F2F2F2', padding: '70px 20px', display: 'grid', placeItems: 'start center' } as const
const cardStyle = { width: '100%', maxWidth: 430, boxSizing: 'border-box', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 28, boxShadow: '0 10px 30px rgba(0,0,0,.06)' } as const
const titleStyle = { fontFamily: condensed, fontSize: 34, lineHeight: 1, fontWeight: 800, color: '#152B59', margin: '0 0 10px' } as const
const copyStyle = { fontFamily: font, fontSize: 12, lineHeight: 1.55, color: '#6B7280' } as const
const labelStyle = { display: 'block', fontFamily: font, fontSize: 11, fontWeight: 700, color: '#374151', marginBottom: 6 } as const
const inputStyle = { width: '100%', boxSizing: 'border-box', minHeight: 44, border: '1px solid #D1D5DB', borderRadius: 7, padding: '10px 12px', fontFamily: font, fontSize: 14, background: '#fff', color: '#111827', marginBottom: 12 } as const
const primaryStyle = { width: '100%', minHeight: 44, border: 0, borderRadius: 7, background: '#1149D8', color: '#fff', padding: '10px 14px', fontFamily: font, fontWeight: 800, cursor: 'pointer', marginTop: 2 } as const
const secondaryStyle = { minHeight: 40, border: '1px solid #D1D5DB', borderRadius: 7, background: '#fff', color: '#374151', padding: '8px 12px', fontFamily: font, fontWeight: 700, cursor: 'pointer', marginTop: 9 } as const
const errorStyle = { marginTop: 12, padding: 10, borderRadius: 7, background: '#FEF2F2', color: '#991B1B', fontFamily: font, fontSize: 12 } as const
const noticeStyle = { marginBottom: 14, padding: 10, borderRadius: 7, background: '#EFF6FF', color: '#1E3A8A', fontFamily: font, fontSize: 11, lineHeight: 1.5 } as const
const tabStyle = (active: boolean) => ({ minHeight: 38, border: active ? '1px solid #1149D8' : '1px solid #D1D5DB', borderRadius: 7, background: active ? '#1149D8' : '#fff', color: active ? '#fff' : '#374151', padding: '8px 13px', fontFamily: font, fontWeight: 800, cursor: 'pointer' })
const accountBarStyle = { maxWidth: 1180, margin: '18px auto 0', padding: '9px 14px', border: '1px solid #DDE3EE', borderRadius: 8, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', fontFamily: font, fontSize: 11, color: '#374151' } as const
const accountButtonStyle = { minHeight: 34, border: '1px solid #CBD5E1', borderRadius: 6, background: '#F8FAFC', color: '#1E3A5F', padding: '6px 10px', fontFamily: font, fontSize: 11, fontWeight: 800, cursor: 'pointer' } as const
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(5,15,35,.58)', padding: 18, overflowY: 'auto', display: 'grid', placeItems: 'start center' } as const
const manageCardStyle = { width: '100%', maxWidth: 760, boxSizing: 'border-box', marginTop: 40, background: '#fff', borderRadius: 10, padding: 22, boxShadow: '0 20px 60px rgba(0,0,0,.25)' } as const
const sectionStyle = { border: '1px solid #E5E7EB', borderRadius: 8, padding: 14, background: '#F9FAFB' } as const
const checkStyle = { display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', fontFamily: font, fontSize: 11, color: '#374151' } as const
