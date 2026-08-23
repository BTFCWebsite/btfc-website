'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'

type ResponseValue = 'yes' | 'maybe' | 'no'
type Invite = {
  event?: {
    title: string
    startDate: string
    endDate?: string
    startTime?: string
    notes?: string
    targetHelpers?: number
  }
  counts?: { yes: number; maybe: number; no: number }
  error?: string
}

function prettyDate(value = '') {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

export default function WorkingPartyRsvpPage() {
  const params = useParams<{ code: string }>()
  const code = useMemo(() => String(params?.code || ''), [params])
  const [invite, setInvite] = useState<Invite | null>(null)
  const [name, setName] = useState('')
  const [choice, setChoice] = useState<ResponseValue | ''>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!code) return
    void loadInvite()
  }, [code])

  async function loadInvite() {
    setError('')
    const response = await fetch(`/api/club-diary/rsvp?code=${encodeURIComponent(code)}`, { cache: 'no-store' })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setInvite({ error: data?.error || 'This invitation cannot be found.' })
      return
    }
    setInvite(data)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSaved(false)
    if (!choice) {
      setError('Please choose Going, Maybe or Can’t make it.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/club-diary/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, name, response: choice }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data?.error || 'Unable to save your response.')
        return
      }
      setSaved(true)
      await loadInvite()
    } finally {
      setSaving(false)
    }
  }

  const event = invite?.event
  const counts = invite?.counts || { yes: 0, maybe: 0, no: 0 }

  if (!invite) {
    return <main style={{ minHeight: '100vh', background: '#F2F2F2', padding: '96px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', fontFamily: "'Montserrat', sans-serif", textAlign: 'center' }}>Opening invitation…</div>
    </main>
  }

  if (!event) {
    return <main style={{ minHeight: '100vh', background: '#F2F2F2', padding: '96px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', background: '#fff', borderRadius: 10, padding: 28, border: '1px solid #E5E7EB', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 34, margin: '0 0 10px', color: '#2D2D2D' }}>Working Party</h1>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, color: '#6B7280', lineHeight: 1.6, margin: 0 }}>{invite.error || 'This invitation cannot be found.'}</p>
      </div>
    </main>
  }

  return <main style={{ minHeight: '100vh', background: '#F2F2F2', padding: '88px 18px 100px' }}>
    <div style={{ maxWidth: 620, margin: '0 auto' }}>
      <section style={{ background: '#041B5F', color: '#fff', borderRadius: 10, padding: '26px 24px', marginBottom: 16 }}>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.58)', marginBottom: 7 }}>BTFC Working Party</div>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, lineHeight: 1.05, margin: '0 0 10px' }}>{event.title}</h1>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,.78)' }}>
          <strong>{prettyDate(event.startDate)}</strong>{event.startTime ? ` · ${event.startTime}` : ''}
          {event.endDate && event.endDate !== event.startDate ? ` · until ${prettyDate(event.endDate)}` : ''}
        </div>
        {event.notes && <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,.78)', margin: '12px 0 0' }}>{event.notes}</p>}
      </section>

      <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10, padding: 24, boxShadow: '0 5px 18px rgba(4,27,95,.06)' }}>
        <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 27, color: '#2D2D2D', margin: '0 0 6px' }}>Can you help?</h2>
        <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#6B7280', lineHeight: 1.6, margin: '0 0 18px' }}>Just add your name and tap one option. No login or club PIN is needed.</p>

        <label htmlFor="rsvp-name" style={{ display: 'block', fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 800, color: '#374151', marginBottom: 6 }}>Your name</label>
        <input id="rsvp-name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={100} autoComplete="name" style={{ width: '100%', boxSizing: 'border-box', minHeight: 46, padding: '10px 12px', border: '1px solid #CBD5E1', borderRadius: 7, fontFamily: "'Montserrat', sans-serif", fontSize: 15, marginBottom: 16 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 8, marginBottom: 16 }}>
          {([
            ['yes', '✓ Going'],
            ['maybe', '? Maybe'],
            ['no', '× Can’t make it'],
          ] as [ResponseValue, string][]).map(([value, label]) => (
            <button key={value} type="button" onClick={() => setChoice(value)} style={{ minHeight: 52, borderRadius: 7, border: choice === value ? '2px solid #1149D8' : '1px solid #CBD5E1', background: choice === value ? '#F0F4FF' : '#fff', color: choice === value ? '#1149D8' : '#374151', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 800, cursor: 'pointer', padding: '8px 6px' }}>{label}</button>
          ))}
        </div>

        {error && <div style={{ background: '#FFF1F2', border: '1px solid #FECDD3', color: '#9F1239', borderRadius: 7, padding: '10px 12px', fontFamily: "'Montserrat', sans-serif", fontSize: 12, marginBottom: 12 }}>{error}</div>}
        {saved && <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', borderRadius: 7, padding: '10px 12px', fontFamily: "'Montserrat', sans-serif", fontSize: 12, marginBottom: 12 }}>Thanks — your response has been saved. You can come back to this link and change it later.</div>}

        <button type="submit" disabled={saving} style={{ width: '100%', minHeight: 48, border: 0, borderRadius: 7, background: '#1149D8', color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 800, cursor: saving ? 'default' : 'pointer', opacity: saving ? .7 : 1 }}>{saving ? 'Saving…' : 'Send my response'}</button>

        <div style={{ marginTop: 18, borderTop: '1px solid #EEF2F7', paddingTop: 14, fontFamily: "'Montserrat', sans-serif", fontSize: 11, color: '#6B7280', lineHeight: 1.6 }}>
          <strong style={{ color: '#374151' }}>{counts.yes} going</strong>{event.targetHelpers ? ` / ${event.targetHelpers} helpers wanted` : ''} · {counts.maybe} maybe
        </div>
      </form>
    </div>
  </main>
}
