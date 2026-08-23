'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import { getFixtures, getMatchFeeds } from '../lib/sanity.client'
import { loadFullTimeWidgetMatches } from '../lib/fulltime.browser'
import styles from './ClubDiary.module.css'

type Category = 'unavailable' | 'clubhouse' | 'workingParty' | 'event' | 'meeting' | 'other'
type Filter = 'all' | 'fixtures' | 'availability' | 'clubhouse' | 'workingParty'
type TeamKey = 'first' | 'reserves' | 'u17s'

type Rsvp = { name: string; response: 'yes' | 'maybe' | 'no' }
type DiaryEvent = {
  _id: string
  title: string
  category: Category
  startDate: string
  endDate?: string
  startTime?: string
  notes?: string
  personName?: string
  targetHelpers?: number
  inviteCode?: string
  rsvps?: Rsvp[]
}
type Fixture = {
  _id: string
  date: string
  opponent: string
  team: string
  venue: string
  competition?: string
  kickoff?: string
  played?: boolean
  btfcScore?: number
  opponentScore?: number
}

const defaults: Record<TeamKey, { team: string; widgets: string[] }> = {
  first: { team: 'First XI', widgets: ['969980533'] },
  reserves: { team: 'Reserves', widgets: ['681011209'] },
  u17s: { team: 'Under 17s', widgets: [] },
}

const labels: Record<Category, string> = {
  unavailable: 'Holiday / unavailable',
  clubhouse: 'Clubhouse booking',
  workingParty: 'Working party',
  event: 'Club event',
  meeting: 'Meeting',
  other: 'Other',
}

function teamKey(value = ''): TeamKey | null {
  const v = value.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (v.includes('u17') || v.includes('under17')) return 'u17s'
  if (v.includes('reserve')) return 'reserves'
  if (v.includes('first')) return 'first'
  return null
}

function normalise(value = '') {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function todayIso() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

function prettyDate(value: string) {
  const d = new Date(`${value}T12:00:00`)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
}

function fixtureStyle(team: string) {
  const key = teamKey(team)
  if (key === 'reserves') return styles.fixtureReserves
  if (key === 'u17s') return styles.fixtureU17
  return styles.fixtureFirst
}

function fixtureLabel(team: string) {
  const key = teamKey(team)
  if (key === 'reserves') return 'RESERVES FIXTURE'
  if (key === 'u17s') return 'UNDER 17s FIXTURE'
  return 'FIRST XI FIXTURE'
}

function resultText(fixture: Fixture) {
  if (!fixture.played || fixture.btfcScore == null || fixture.opponentScore == null) return 'v'
  return fixture.venue === 'Home'
    ? `${fixture.btfcScore}-${fixture.opponentScore}`
    : `${fixture.opponentScore}-${fixture.btfcScore}`
}

export default function ClubDiaryApp() {
  const today = useMemo(() => todayIso(), [])
  const [auth, setAuth] = useState<'checking' | 'login' | 'ready' | 'setup'>('checking')
  const [pin, setPin] = useState('')
  const [authError, setAuthError] = useState('')
  const [events, setEvents] = useState<DiaryEvent[]>([])
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [loading, setLoading] = useState(false)
  const [writeConfigured, setWriteConfigured] = useState(true)
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [category, setCategory] = useState<Category>('unavailable')
  const [title, setTitle] = useState('')
  const [personName, setPersonName] = useState('')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [startTime, setStartTime] = useState('')
  const [targetHelpers, setTargetHelpers] = useState('8')
  const [notes, setNotes] = useState('')

  useEffect(() => { void checkAuth() }, [])
  useEffect(() => { if (auth === 'ready') void refreshAll() }, [auth])

  async function checkAuth() {
    try {
      const response = await fetch('/api/club-diary/auth', { cache: 'no-store' })
      const data = await response.json().catch(() => ({}))
      if (response.status === 503 || data?.configured === false) setAuth('setup')
      else setAuth(data?.authorised ? 'ready' : 'login')
    } catch {
      setAuth('login')
    }
  }

  async function login(event: FormEvent) {
    event.preventDefault()
    setAuthError('')
    const response = await fetch('/api/club-diary/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      setAuthError(data?.error || 'Unable to open the diary.')
      return
    }
    setPin('')
    setAuth('ready')
  }

  async function loadFixtureData() {
    try {
      const [feeds, manual] = await Promise.all([getMatchFeeds(), getFixtures()])
      const configs: Record<TeamKey, { team: string; widgets: string[] }> = {
        first: { ...defaults.first, widgets: [...defaults.first.widgets] },
        reserves: { ...defaults.reserves, widgets: [...defaults.reserves.widgets] },
        u17s: { ...defaults.u17s, widgets: [...defaults.u17s.widgets] },
      }

      for (const feed of feeds || []) {
        const key = teamKey(String(feed?.team || ''))
        if (!key || !feed?.snippet || key === 'reserves') continue
        const widget = String(feed.snippet).match(/\blrcode\s*=\s*['\"](\d+)['\"]/i)?.[1]
        if (widget) configs[key].widgets = [widget]
      }

      const live = await Promise.all((Object.keys(configs) as TeamKey[]).map(async (key) => {
        const config = configs[key]
        if (!config.widgets.length) return [] as Fixture[]
        const settled = await Promise.allSettled(config.widgets.map((widget) => loadFullTimeWidgetMatches(widget, config.team, 15000)))
        return settled.flatMap((item) => item.status === 'fulfilled' ? item.value : []) as Fixture[]
      }))

      const manualFixtures = (manual || []).map((item: any) => ({
        _id: String(item?._id || ''),
        date: String(item?.date || ''),
        opponent: String(item?.opponent || ''),
        team: String(item?.team || 'First XI'),
        venue: String(item?.venue || ''),
        competition: String(item?.competition || ''),
        kickoff: String(item?.kickoff || ''),
        played: Boolean(item?.played),
        btfcScore: item?.btfcScore,
        opponentScore: item?.opponentScore,
      })) as Fixture[]

      const combined = [...manualFixtures, ...live.flat()]
        .filter((item) => item.date && item.opponent)
        .filter((item, index, all) => all.findIndex((other) =>
          other._id === item._id || (
            other.date === item.date &&
            teamKey(other.team) === teamKey(item.team) &&
            normalise(other.opponent) === normalise(item.opponent)
          )
        ) === index)
        .sort((a, b) => a.date.localeCompare(b.date))

      setFixtures(combined)
    } catch (error) {
      console.error('Club Diary fixture load failed', error)
      setFixtures([])
    }
  }

  async function refreshAll() {
    setLoading(true)
    try {
      const [response] = await Promise.all([
        fetch('/api/club-diary', { cache: 'no-store' }),
        loadFixtureData(),
      ])
      if (response.status === 401) {
        setAuth('login')
        return
      }
      const data = await response.json().catch(() => ({}))
      if (response.ok) {
        setEvents(Array.isArray(data?.events) ? data.events : [])
        setWriteConfigured(data?.writeConfigured !== false)
      }
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setCategory('unavailable')
    setTitle('')
    setPersonName('')
    setStartDate(today)
    setEndDate(today)
    setStartTime('')
    setTargetHelpers('8')
    setNotes('')
    setFormError('')
  }

  async function saveEvent(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setFormError('')
    try {
      const response = await fetch('/api/club-diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'createEvent', category, title, personName,
          startDate, endDate, startTime, targetHelpers, notes,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setFormError(data?.error || 'Unable to save this entry.')
        return
      }
      setAdding(false)
      resetForm()
      await refreshAll()
    } finally {
      setSaving(false)
    }
  }

  async function removeEvent(id: string) {
    if (!window.confirm('Remove this diary entry?')) return
    const response = await fetch('/api/club-diary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deleteEvent', id }),
    })
    if (response.ok) await refreshAll()
  }

  async function shareInvite(event: DiaryEvent) {
    if (!event.inviteCode) return
    const url = `${window.location.origin}/club-diary/rsvp/${event.inviteCode}`
    const text = `${event.title} - ${prettyDate(event.startDate)}. Please let us know if you can help.`
    if (navigator.share) {
      try {
        await navigator.share({ title: event.title, text, url })
        return
      } catch {}
    }
    window.prompt('Copy this link into WhatsApp, text or email:', `${text}\n${url}`)
  }

  function unavailableOn(date: string) {
    return events
      .filter((event) => event.category === 'unavailable')
      .filter((event) => event.startDate <= date && (event.endDate || event.startDate) >= date)
      .map((event) => event.personName || event.title)
      .filter(Boolean)
      .filter((name, index, all) => all.indexOf(name) === index)
  }

  const items = useMemo(() => {
    const diaryItems = events.map((event) => ({ kind: 'diary' as const, date: event.startDate, event }))
    const fixtureItems = fixtures.filter((fixture) => !fixture.played || fixture.date >= today)
      .map((fixture) => ({ kind: 'fixture' as const, date: fixture.date, fixture }))
    return [...diaryItems, ...fixtureItems]
      .filter((item) => item.date >= today)
      .filter((item) => {
        if (filter === 'all') return true
        if (filter === 'fixtures') return item.kind === 'fixture'
        if (item.kind !== 'diary') return false
        if (filter === 'availability') return item.event.category === 'unavailable'
        if (filter === 'clubhouse') return item.event.category === 'clubhouse'
        return item.event.category === 'workingParty'
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [events, fixtures, filter, today])

  const grouped = useMemo(() => items.reduce<Record<string, typeof items>>((result, item) => {
    if (!result[item.date]) result[item.date] = []
    result[item.date].push(item)
    return result
  }, {}), [items])

  if (auth === 'checking') return <div className={styles.page}><div className={styles.loading}>Opening Club Diary…</div></div>

  if (auth === 'setup') {
    return <div className={styles.page}><div className={styles.shell}><div className={styles.loginWrap}><div className={styles.loginCard}>
      <h1>BTFC Club Diary</h1>
      <p>The diary is installed. The private club PIN still needs to be set in Vercel before it can be opened.</p>
    </div></div></div></div>
  }

  if (auth === 'login') {
    return <div className={styles.page}><div className={styles.shell}><div className={styles.loginWrap}>
      <form className={styles.loginCard} onSubmit={login}>
        <h1>BTFC Club Diary</h1>
        <p>Enter the club PIN. You should only need to do this once on this phone.</p>
        <input className={styles.pinInput} value={pin} onChange={(e) => setPin(e.target.value)} inputMode="numeric" autoComplete="off" aria-label="Club PIN" required />
        <button className={styles.primaryButton} type="submit" style={{ width: '100%' }}>Open Diary</button>
        {authError && <div className={styles.error}>{authError}</div>}
      </form>
    </div></div></div>
  }

  return <div className={styles.page}><div className={styles.shell}>
    <section className={styles.hero}><div className={styles.heroTop}>
      <div><h1 className={styles.title}>Club Diary</h1><p className={styles.subtitle}>Fixtures, availability, clubhouse bookings and club jobs in one place.</p></div>
      <button className={styles.addButton} type="button" disabled={!writeConfigured} onClick={() => { resetForm(); setAdding(true) }}>+ Add</button>
    </div></section>

    {!writeConfigured && <div className={styles.notice}>The diary can be viewed, but editing and RSVPs need the Sanity write token added in Vercel.</div>}

    {adding && <form className={styles.panel} onSubmit={saveEvent}>
      <h2>Add to Club Diary</h2>
      <div className={styles.formGrid}>
        <div className={`${styles.field} ${styles.full}`}><label htmlFor="category">What are you adding?</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as Category)}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </div>
        {category === 'unavailable'
          ? <div className={`${styles.field} ${styles.full}`}><label htmlFor="person">Who is unavailable?</label><input id="person" value={personName} onChange={(e) => setPersonName(e.target.value)} placeholder="e.g. Paul Day" required /></div>
          : <div className={`${styles.field} ${styles.full}`}><label htmlFor="title">What is it?</label><input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={category === 'workingParty' ? 'Club Working Party' : 'e.g. 50th Birthday Party'} /></div>}
        <div className={styles.field}><label htmlFor="start">{category === 'unavailable' ? 'From' : 'Date'}</label><input id="start" type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); if (endDate < e.target.value) setEndDate(e.target.value) }} required /></div>
        <div className={styles.field}><label htmlFor="end">{category === 'unavailable' ? 'Until' : 'End date (if needed)'}</label><input id="end" type="date" value={endDate} min={startDate} onChange={(e) => setEndDate(e.target.value)} /></div>
        {category !== 'unavailable' && <div className={styles.field}><label htmlFor="time">Start time</label><input id="time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div>}
        {category === 'workingParty' && <div className={styles.field}><label htmlFor="helpers">Ideal number of helpers</label><input id="helpers" type="number" min="1" max="99" value={targetHelpers} onChange={(e) => setTargetHelpers(e.target.value)} /></div>}
        <div className={`${styles.field} ${styles.full}`}><label htmlFor="notes">Notes (optional)</label><textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything people need to know" /></div>
      </div>
      {formError && <div className={styles.error}>{formError}</div>}
      <div className={styles.formActions}><button className={styles.primaryButton} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button><button className={styles.secondaryButton} type="button" disabled={saving} onClick={() => setAdding(false)}>Cancel</button></div>
    </form>}

    <div className={styles.toolbar} aria-label="Diary filters">
      {([['all','Everything'],['fixtures','Fixtures'],['availability','Availability'],['clubhouse','Clubhouse'],['workingParty','Working parties']] as [Filter,string][]).map(([value,label]) => <button key={value} type="button" className={`${styles.filterButton} ${filter === value ? styles.filterActive : ''}`} onClick={() => setFilter(value)}>{label}</button>)}
    </div>

    {loading && <div className={styles.loading}>Updating diary and fixtures…</div>}
    {!loading && Object.keys(grouped).length === 0 && <div className={styles.emptyCard}>Nothing coming up in this view.</div>}

    {!loading && Object.entries(grouped).map(([date, dayItems]) => {
      const unavailable = unavailableOn(date)
      const homeFixture = dayItems.some((item) => item.kind === 'fixture' && item.fixture.venue === 'Home')
      return <section className={styles.day} key={date}>
        <div className={styles.dayHeader}><h2>{prettyDate(date)}</h2>{homeFixture && unavailable.length > 0 && <span>Cover to check</span>}</div>
        {dayItems.map((item) => {
          if (item.kind === 'fixture') {
            const f = item.fixture
            return <article className={`${styles.card} ${fixtureStyle(f.team)}`} key={`fixture-${f._id}`}>
              <p className={styles.kicker}>{fixtureLabel(f.team)}</p>
              <h3 className={styles.cardTitle}>{f.venue === 'Home' ? 'BTFC' : f.opponent} {resultText(f)} {f.venue === 'Home' ? f.opponent : 'BTFC'}</h3>
              <p className={styles.meta}>{f.venue} · {f.kickoff && f.kickoff !== 'TBC' ? f.kickoff : 'Time TBC'}{f.competition ? ` · ${f.competition}` : ''}</p>
              {unavailable.length > 0 && <div className={styles.warning}>{unavailable.length >= 2 ? '⚠ Staffing check: ' : 'Unavailable: '}{unavailable.join(', ')}</div>}
            </article>
          }

          const event = item.event
          const yes = (event.rsvps || []).filter((rsvp) => rsvp.response === 'yes')
          const maybe = (event.rsvps || []).filter((rsvp) => rsvp.response === 'maybe')
          return <article className={`${styles.card} ${styles[event.category]}`} key={event._id}>
            <div className={styles.cardTop}><div><p className={styles.kicker}>{labels[event.category]}</p><h3 className={styles.cardTitle}>{event.title}</h3></div><button className={styles.dangerButton} type="button" onClick={() => void removeEvent(event._id)}>Remove</button></div>
            <p className={styles.meta}>{event.startTime ? `${event.startTime} · ` : ''}{event.endDate && event.endDate !== event.startDate ? `Until ${prettyDate(event.endDate)}` : ''}{event.notes ? `${event.endDate && event.endDate !== event.startDate ? ' · ' : ''}${event.notes}` : ''}</p>
            {event.category === 'workingParty' && <div className={styles.rsvpBox}>
              <div className={styles.rsvpLine}><div><strong>{yes.length} confirmed</strong>{event.targetHelpers ? ` / ${event.targetHelpers} wanted` : ''}{maybe.length ? ` · ${maybe.length} maybe` : ''}</div><button className={styles.shareButton} type="button" onClick={() => void shareInvite(event)}>Share invite</button></div>
              {yes.length > 0 && <div className={styles.names}>Coming: {yes.map((rsvp) => rsvp.name).join(', ')}</div>}
            </div>}
          </article>
        })}
      </section>
    })}

    <p className={styles.tip}>Tip: on your phone choose “Add to Home Screen” once, then the Club Diary opens like an app.</p>
  </div></div>
}
