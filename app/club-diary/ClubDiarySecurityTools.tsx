'use client'

import { useEffect, useState } from 'react'

type Person = {
  id: string
  name: string
  isAdmin: boolean
  active: boolean
  hasPin: boolean
}

type AuditEntry = {
  id: string
  at: string
  actorName: string
  actorRole: 'member' | 'admin' | 'public' | 'system'
  action: string
  targetType: string
  summary: string
}

const font = "'Montserrat', sans-serif"
const condensed = "'Barlow Condensed', sans-serif"

export default function ClubDiarySecurityTools() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<'pins' | 'activity'>('pins')
  const [people, setPeople] = useState<Person[]>([])
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [pinValues, setPinValues] = useState<Record<string, string>>({})
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    void checkAdmin()
    const onFocus = () => void checkAdmin()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  async function checkAdmin() {
    const response = await fetch('/api/club-diary/auth', { cache: 'no-store' }).catch(() => null)
    if (!response?.ok) {
      setIsAdmin(false)
      setOpen(false)
      return
    }
    const data = await response.json().catch(() => ({}))
    const admin = Boolean(data?.authorised && data?.role === 'admin')
    setIsAdmin(admin)
    if (!admin) setOpen(false)
  }

  async function loadPeople() {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/club-diary/people', { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage(data?.error || 'Unable to load people.')
        return
      }
      setPeople(Array.isArray(data?.people) ? data.people : [])
    } finally {
      setLoading(false)
    }
  }

  async function loadActivity() {
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch('/api/club-diary/audit', { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setMessage(data?.error || 'Unable to load activity.')
        return
      }
      setEntries(Array.isArray(data?.entries) ? data.entries : [])
    } finally {
      setLoading(false)
    }
  }

  async function openTools(nextTab: 'pins' | 'activity' = 'pins') {
    setTab(nextTab)
    setOpen(true)
    if (nextTab === 'pins') await loadPeople()
    else await loadActivity()
  }

  async function setPin(person: Person) {
    const pin = String(pinValues[person.id] || '')
    if (!/^\d{6}$/.test(pin)) {
      setMessage('Personal PIN must be exactly 6 digits.')
      return
    }
    setMessage('')
    const response = await fetch('/api/club-diary/people', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setPin', id: person.id, pin }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setMessage(data?.error || 'Unable to set that PIN.')
      return
    }
    setPinValues((current) => ({ ...current, [person.id]: '' }))
    setMessage(`Personal PIN ${person.hasPin ? 'reset' : 'set'} for ${person.name}.`)
    await loadPeople()
  }

  if (!isAdmin) return null

  return <>
    <button type="button" onClick={() => void openTools('pins')} style={launcherStyle}>🔐 Security &amp; Activity</button>

    {open && <div style={overlayStyle} role="dialog" aria-modal="true" aria-label="Club Diary security and activity">
      <div style={panelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18 }}>
          <div>
            <h2 style={titleStyle}>Security &amp; Activity</h2>
            <p style={copyStyle}>Personal PINs prevent one person choosing another person&apos;s name. Activity records who changed what and when.</p>
          </div>
          <button type="button" onClick={() => setOpen(false)} style={secondaryButton}>Close</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button type="button" onClick={() => { setTab('pins'); void loadPeople() }} style={tabStyle(tab === 'pins')}>Personal PINs</button>
          <button type="button" onClick={() => { setTab('activity'); void loadActivity() }} style={tabStyle(tab === 'activity')}>Activity log</button>
        </div>

        {message && <div style={messageStyle}>{message}</div>}
        {loading && <div style={copyStyle}>Updating…</div>}

        {!loading && tab === 'pins' && <div style={{ display: 'grid', gap: 9 }}>
          <div style={noticeStyle}>Set a different 6-digit PIN for each person. PINs are never displayed after saving; an Admin can only reset them.</div>
          {people.map((person) => <div key={person.id} style={personRowStyle}>
            <div style={{ minWidth: 0 }}>
              <strong style={{ fontFamily: condensed, fontSize: 18, color: '#1F2937' }}>{person.name}</strong>
              <div style={{ fontFamily: font, fontSize: 10, color: '#6B7280', marginTop: 2 }}>
                {person.isAdmin ? 'Admin · ' : ''}{person.active ? 'Active' : 'Inactive'} · {person.hasPin ? 'PIN set' : 'PIN NOT SET'}
              </div>
            </div>
            <input
              aria-label={`New personal PIN for ${person.name}`}
              value={pinValues[person.id] || ''}
              onChange={(event) => setPinValues((current) => ({ ...current, [person.id]: event.target.value.replace(/\D/g, '').slice(0, 6) }))}
              inputMode="numeric"
              autoComplete="off"
              placeholder="6-digit PIN"
              style={pinInputStyle}
            />
            <button type="button" onClick={() => void setPin(person)} style={primaryButton}>{person.hasPin ? 'Reset PIN' : 'Set PIN'}</button>
          </div>)}
          {people.length === 0 && <div style={copyStyle}>No people have been added.</div>}
        </div>}

        {!loading && tab === 'activity' && <div style={{ display: 'grid', gap: 8 }}>
          {entries.map((entry) => <div key={entry.id} style={activityRowStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <strong style={{ fontFamily: condensed, fontSize: 17, color: '#1F2937' }}>{entry.actorName}</strong>
              <span style={{ fontFamily: font, fontSize: 10, color: '#6B7280' }}>{formatDate(entry.at)}</span>
            </div>
            <div style={{ fontFamily: font, fontSize: 11, color: '#374151', marginTop: 4 }}>{entry.summary}</div>
            <div style={{ fontFamily: font, fontSize: 9, textTransform: 'uppercase', letterSpacing: '.06em', color: '#9CA3AF', marginTop: 5 }}>{entry.action}</div>
          </div>)}
          {entries.length === 0 && <div style={copyStyle}>No activity has been recorded yet.</div>}
        </div>}
      </div>
    </div>}
  </>
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const launcherStyle = { position: 'fixed', right: 18, bottom: 18, zIndex: 120, border: '1px solid rgba(255,255,255,.24)', borderRadius: 9, padding: '10px 14px', background: '#0B2F69', color: '#fff', fontFamily: condensed, fontSize: 16, fontWeight: 800, boxShadow: '0 7px 22px rgba(0,0,0,.2)', cursor: 'pointer' } as const
const overlayStyle = { position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(5,14,32,.62)', padding: 20, overflowY: 'auto', display: 'grid', placeItems: 'start center' } as const
const panelStyle = { width: '100%', maxWidth: 820, boxSizing: 'border-box', background: '#fff', borderRadius: 12, padding: 24, marginTop: 30, boxShadow: '0 24px 70px rgba(0,0,0,.28)' } as const
const titleStyle = { fontFamily: condensed, fontSize: 30, lineHeight: 1, fontWeight: 800, color: '#152B59', margin: '0 0 6px' } as const
const copyStyle = { fontFamily: font, fontSize: 11, lineHeight: 1.55, color: '#6B7280', margin: 0 } as const
const tabStyle = (active: boolean) => ({ minHeight: 38, borderRadius: 7, padding: '0 14px', border: active ? '1px solid #1149D8' : '1px solid #D1D5DB', background: active ? '#EAF0FF' : '#fff', color: active ? '#1149D8' : '#4B5563', fontFamily: condensed, fontSize: 16, fontWeight: 800, cursor: 'pointer' })
const personRowStyle = { display: 'grid', gridTemplateColumns: 'minmax(160px,1fr) 140px auto', gap: 10, alignItems: 'center', border: '1px solid #E5E7EB', borderRadius: 8, padding: 10, background: '#fff' } as const
const pinInputStyle = { minHeight: 40, width: '100%', boxSizing: 'border-box', border: '1px solid #D1D5DB', borderRadius: 7, padding: '0 10px', fontFamily: font, fontSize: 13 } as const
const primaryButton = { minHeight: 40, border: 0, borderRadius: 7, padding: '0 13px', background: '#1149D8', color: '#fff', fontFamily: condensed, fontSize: 15, fontWeight: 800, cursor: 'pointer' } as const
const secondaryButton = { minHeight: 38, border: '1px solid #D1D5DB', borderRadius: 7, padding: '0 13px', background: '#fff', color: '#374151', fontFamily: condensed, fontSize: 15, fontWeight: 800, cursor: 'pointer' } as const
const noticeStyle = { padding: '9px 11px', borderRadius: 7, background: '#EFF6FF', border: '1px solid #BFDBFE', fontFamily: font, fontSize: 10, lineHeight: 1.5, color: '#1E3A8A' } as const
const messageStyle = { padding: '9px 11px', borderRadius: 7, background: '#F3F4F6', border: '1px solid #E5E7EB', fontFamily: font, fontSize: 10, color: '#374151', marginBottom: 12 } as const
const activityRowStyle = { border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 12px', background: '#fff' } as const
