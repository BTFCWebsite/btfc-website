import { NextRequest, NextResponse } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  isDiaryAuthorised,
  newShareToken,
  normaliseName,
  shareTokenHash,
  validDate,
  validTime,
} from '../../lib/clubDiary.server'

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
}

type StoredRsvp = {
  name: string
  response: ResponseValue
  respondedAt: string
}

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } })
}

function targetNumber(value: unknown) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.max(0, Math.min(99, Math.round(parsed)))
}

async function loadEvents() {
  const client = getDiaryClient()
  const [eventDocs, rsvpDocs] = await Promise.all([
    client.fetch<Array<{ _id: string; payload: string }>>(
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
    if (!isDiaryAuthorised(request)) return noStore({ error: 'PIN required.' }, 401)
    return noStore({ events: await loadEvents(), writeConfigured: true })
  } catch (error) {
    console.error('Unable to load club diary:', error)
    return noStore({ error: 'Club Diary is not configured yet.', writeConfigured: false }, 503)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isDiaryAuthorised(request)) return noStore({ error: 'PIN required.' }, 401)

    const body = await request.json().catch(() => ({}))
    const action = cleanText(body?.action, 30)
    const client = getDiaryClient()

    if (action === 'deleteEvent') {
      const id = cleanText(body?.id, 200)
      if (!id) return noStore({ error: 'Event id is required.' }, 400)

      const rsvps = await client.fetch<Array<{ _id: string }>>(
        `*[_type == "clubDiaryRsvp" && eventId == $id] { _id }`, { id }, { cache: 'no-store' }
      )
      let transaction = client.transaction().delete(id)
      for (const rsvp of rsvps || []) transaction = transaction.delete(rsvp._id)
      await transaction.commit()
      return noStore({ ok: true })
    }

    if (action !== 'createEvent') return noStore({ error: 'Unknown diary action.' }, 400)

    const requestedCategory = cleanText(body?.category, 30)
    const category = CATEGORIES.includes(requestedCategory as Category) ? requestedCategory as Category : null
    const startDate = validDate(body?.startDate)
    const requestedEndDate = validDate(body?.endDate)
    const endDate = requestedEndDate && requestedEndDate >= startDate ? requestedEndDate : startDate
    const startTime = validTime(body?.startTime) || undefined
    const personName = cleanText(body?.personName, 100)
    const notes = cleanText(body?.notes, 1200) || undefined
    let title = cleanText(body?.title, 160)

    if (!category) return noStore({ error: 'Choose a valid diary type.' }, 400)
    if (!startDate) return noStore({ error: 'Check the start date.' }, 400)
    if (category === 'unavailable' && !personName) {
      return noStore({ error: 'Add the name of the person who is unavailable.' }, 400)
    }

    if (!title) {
      if (category === 'unavailable') title = `${personName} unavailable`
      else if (category === 'workingParty') title = 'Club Working Party'
      else return noStore({ error: 'Add a title.' }, 400)
    }

    const inviteCode = category === 'workingParty' ? newShareToken() : undefined
    const stored: StoredEvent = {
      title,
      category,
      startDate,
      endDate,
      startTime,
      notes,
      personName: personName || undefined,
      targetHelpers: category === 'workingParty' ? targetNumber(body?.targetHelpers) : undefined,
      inviteCode,
      createdAt: new Date().toISOString(),
    }

    const created = await client.create({
      _type: 'clubDiaryEvent',
      payload: encryptDiaryPayload(stored),
      ...(inviteCode ? { shareTokenHash: shareTokenHash(inviteCode) } : {}),
    })

    return noStore({ event: { _id: created._id, ...stored, rsvps: [] } }, 201)
  } catch (error) {
    console.error('Unable to save club diary entry:', error)
    return noStore({ error: 'Unable to save this diary entry.' }, 500)
  }
}
