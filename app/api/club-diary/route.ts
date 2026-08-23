import { NextRequest, NextResponse } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  newShareToken,
  normaliseName,
  shareTokenHash,
  validDate,
  validTime,
  type DiarySession,
} from '../../lib/clubDiary.server'
import { getVerifiedDiarySession } from '../../lib/clubDiaryPeople.server'
import { writeDiaryAudit } from '../../lib/clubDiaryAudit.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CATEGORIES = ['unavailable', 'clubhouse', 'workingParty', 'event', 'meeting', 'other'] as const
type Category = typeof CATEGORIES[number]
type ResponseValue = 'yes' | 'maybe' | 'no'

type StoredEvent = {
  title: string
  category: Category
  startDate: string
  endDate?: string
  startTime?: string
  notes?: string
  personName?: string
  targetHelpers?: number
  inviteCode?: string
  createdAt: string
  updatedAt?: string
}

type StoredRsvp = {
  name: string
  response: ResponseValue
  respondedAt: string
}

type EventDoc = { _id: string; payload: string }

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } })
}

function targetNumber(value: unknown) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.max(0, Math.min(99, Math.round(parsed)))
}

function canManageEvent(session: DiarySession, event: StoredEvent) {
  if (session.role === 'admin') return true
  return event.category === 'unavailable' &&
    Boolean(session.name) &&
    normaliseName(event.personName) === normaliseName(session.name)
}

function eventAuditText(event: StoredEvent) {
  const who = event.category === 'unavailable' ? (event.personName || event.title) : event.title
  const dates = event.endDate && event.endDate !== event.startDate
    ? `${event.startDate} to ${event.endDate}`
    : event.startDate
  return `${who} · ${dates}`
}

async function loadEventDocument(id: string) {
  if (!id) return null
  return getDiaryClient().fetch<EventDoc | null>(
    `*[_type == "clubDiaryEvent" && _id == $id][0] { _id, payload }`,
    { id },
    { cache: 'no-store' }
  )
}

function eventFromBody(body: any, session: DiarySession, existing?: StoredEvent): { event?: StoredEvent; error?: string } {
  const requestedCategory = cleanText(body?.category, 30)
  const category: Category | null = session.role === 'member'
    ? 'unavailable'
    : CATEGORIES.includes(requestedCategory as Category) ? requestedCategory as Category : null

  const startDate = validDate(body?.startDate)
  const requestedEndDate = validDate(body?.endDate)
  const endDate = requestedEndDate && startDate && requestedEndDate >= startDate ? requestedEndDate : startDate
  const startTime = validTime(body?.startTime) || undefined
  const personName = session.role === 'member'
    ? cleanText(session.name, 100)
    : cleanText(body?.personName, 100)
  const notes = cleanText(body?.notes, 1200) || undefined
  let title = cleanText(body?.title, 160)

  if (!category) return { error: 'Choose a valid diary type.' }
  if (!startDate) return { error: 'Check the start date.' }
  if (category === 'unavailable' && !personName) return { error: 'Add the name of the person who is unavailable.' }

  if (session.role === 'member') title = `${personName} unavailable`
  if (!title) {
    if (category === 'unavailable') title = `${personName} unavailable`
    else if (category === 'workingParty') title = 'Club Working Party'
    else return { error: 'Add a title.' }
  }

  const inviteCode = category === 'workingParty'
    ? (existing?.category === 'workingParty' && existing.inviteCode ? existing.inviteCode : newShareToken())
    : undefined
  const now = new Date().toISOString()

  return {
    event: {
      title,
      category,
      startDate,
      endDate,
      startTime: category === 'unavailable' ? undefined : startTime,
      notes,
      personName: category === 'unavailable' ? personName : undefined,
      targetHelpers: category === 'workingParty' ? targetNumber(body?.targetHelpers) : undefined,
      inviteCode,
      createdAt: existing?.createdAt || now,
      updatedAt: existing ? now : undefined,
    },
  }
}

async function loadEvents(session: DiarySession) {
  const client = getDiaryClient()
  const [eventDocs, rsvpDocs] = await Promise.all([
    client.fetch<Array<EventDoc>>(
      `*[_type == "clubDiaryEvent"] { _id, payload }`, {}, { cache: 'no-store' }
    ),
    client.fetch<Array<{ _id: string; eventId: string; payload: string }>>(
      `*[_type == "clubDiaryRsvp"] { _id, eventId, payload }`, {}, { cache: 'no-store' }
    ),
  ])

  const responsesByEvent = new Map<string, StoredRsvp[]>()
  for (const doc of rsvpDocs || []) {
    try {
      const response = decryptDiaryPayload<StoredRsvp>(doc.payload)
      const list = responsesByEvent.get(doc.eventId) || []
      list.push(response)
      responsesByEvent.set(doc.eventId, list)
    } catch (error) {
      console.error('Unable to decrypt club diary RSVP', doc._id, error)
    }
  }

  return (eventDocs || []).flatMap((doc) => {
    try {
      const event = decryptDiaryPayload<StoredEvent>(doc.payload)
      const latest = new Map<string, StoredRsvp>()
      for (const response of responsesByEvent.get(doc._id) || []) {
        const key = normaliseName(response.name)
        const current = latest.get(key)
        if (!current || response.respondedAt > current.respondedAt) latest.set(key, response)
      }

      return [{
        _id: doc._id,
        title: event.title,
        category: event.category,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        notes: event.notes,
        personName: event.personName,
        targetHelpers: event.targetHelpers,
        inviteCode: event.inviteCode,
        canEdit: canManageEvent(session, event),
        rsvps: Array.from(latest.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ name, response }) => ({ name, response })),
      }]
    } catch (error) {
      console.error('Unable to decrypt club diary event', doc._id, error)
      return []
    }
  }).sort((a, b) => {
    const byDate = a.startDate.localeCompare(b.startDate)
    if (byDate !== 0) return byDate
    return String(a.startTime || '').localeCompare(String(b.startTime || ''))
  })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getVerifiedDiarySession(request)
    if (!session) return noStore({ error: 'Login required.' }, 401)
    return noStore({
      events: await loadEvents(session),
      writeConfigured: true,
      role: session.role,
      name: session.name || '',
    })
  } catch (error) {
    console.error('Unable to load club diary:', error)
    return noStore({ error: 'Club Diary is not configured yet.', writeConfigured: false }, 503)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getVerifiedDiarySession(request)
    if (!session) return noStore({ error: 'Login required.' }, 401)

    const body = await request.json().catch(() => ({}))
    const action = cleanText(body?.action, 30)
    const client = getDiaryClient()

    if (action === 'deleteEvent') {
      const id = cleanText(body?.id, 200)
      if (!id) return noStore({ error: 'Event id is required.' }, 400)

      const doc = await loadEventDocument(id)
      if (!doc) return noStore({ error: 'Diary entry not found.' }, 404)
      const event = decryptDiaryPayload<StoredEvent>(doc.payload)
      if (!canManageEvent(session, event)) return noStore({ error: 'You cannot alter this diary entry.' }, 403)

      const rsvps = await client.fetch<Array<{ _id: string }>>(
        `*[_type == "clubDiaryRsvp" && eventId == $id] { _id }`, { id }, { cache: 'no-store' }
      )
      let transaction = client.transaction().delete(id)
      for (const rsvp of rsvps || []) transaction = transaction.delete(rsvp._id)
      await transaction.commit()
      await writeDiaryAudit(session, 'event.delete', 'event', id, `Deleted ${eventAuditText(event)}`)
      return noStore({ ok: true })
    }

    if (action === 'updateEvent') {
      const id = cleanText(body?.id, 200)
      if (!id) return noStore({ error: 'Event id is required.' }, 400)

      const doc = await loadEventDocument(id)
      if (!doc) return noStore({ error: 'Diary entry not found.' }, 404)
      const existing = decryptDiaryPayload<StoredEvent>(doc.payload)
      if (!canManageEvent(session, existing)) return noStore({ error: 'You cannot alter this diary entry.' }, 403)

      const parsed = eventFromBody(body, session, existing)
      if (!parsed.event) return noStore({ error: parsed.error || 'Check this diary entry.' }, 400)
      const updated = parsed.event

      let patch = client.patch(id).set({ payload: encryptDiaryPayload(updated) })
      if (updated.inviteCode) patch = patch.set({ shareTokenHash: shareTokenHash(updated.inviteCode) })
      else patch = patch.unset(['shareTokenHash'])
      await patch.commit()

      if (existing.category === 'workingParty' && updated.category !== 'workingParty') {
        const rsvps = await client.fetch<Array<{ _id: string }>>(
          `*[_type == "clubDiaryRsvp" && eventId == $id] { _id }`, { id }, { cache: 'no-store' }
        )
        if (rsvps?.length) {
          let transaction = client.transaction()
          for (const rsvp of rsvps) transaction = transaction.delete(rsvp._id)
          await transaction.commit()
        }
      }

      await writeDiaryAudit(session, 'event.update', 'event', id, `Updated ${eventAuditText(updated)}`)
      return noStore({ event: { _id: id, ...updated, canEdit: true } })
    }

    if (action !== 'createEvent') return noStore({ error: 'Unknown diary action.' }, 400)

    const parsed = eventFromBody(body, session)
    if (!parsed.event) return noStore({ error: parsed.error || 'Check this diary entry.' }, 400)
    const stored = parsed.event

    const created = await client.create({
      _type: 'clubDiaryEvent',
      payload: encryptDiaryPayload(stored),
      ...(stored.inviteCode ? { shareTokenHash: shareTokenHash(stored.inviteCode) } : {}),
    })

    await writeDiaryAudit(session, 'event.create', 'event', created._id, `Added ${eventAuditText(stored)}`)
    return noStore({ event: { _id: created._id, ...stored, canEdit: true, rsvps: [] } }, 201)
  } catch (error) {
    console.error('Unable to save club diary entry:', error)
    return noStore({ error: 'Unable to save this diary entry.' }, 500)
  }
}
