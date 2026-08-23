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
} from '../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const CATEGORIES = ['availability', 'clubhouse', 'working-party', 'event', 'meeting', 'other'] as const
const RSVP_STATUSES = ['going', 'maybe', 'cant'] as const

type Category = typeof CATEGORIES[number]
type RsvpStatus = typeof RSVP_STATUSES[number]

type StoredEvent = {
  title: string
  category: Category
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  notes?: string
  person?: string
  createdAt: string
  shareToken?: string
}

type StoredRsvp = {
  name: string
  status: RsvpStatus
  respondedAt: string
}

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } })
}

async function loadEvents() {
  const client = getDiaryClient()
  const [eventDocs, rsvpDocs] = await Promise.all([
    client.fetch<Array<{ _id: string; payload: string }>>(
      `*[_type == "clubDiaryEvent"] { _id, payload }`,
      {},
      { cache: 'no-store' }
    ),
    client.fetch<Array<{ _id: string; eventId: string; payload: string }>>(
      `*[_type == "clubDiaryRsvp"] { _id, eventId, payload }`,
      {},
      { cache: 'no-store' }
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

  return (eventDocs || []).flatMap(doc => {
    try {
      const event = decryptDiaryPayload<StoredEvent>(doc.payload)
      const latest = new Map<string, StoredRsvp>()
      for (const response of responsesByEvent.get(doc._id) || []) {
        const key = normaliseName(response.name)
        const current = latest.get(key)
        if (!current || response.respondedAt > current.respondedAt) latest.set(key, response)
      }
      const responses = Array.from(latest.values()).sort((a, b) => a.name.localeCompare(b.name))
      return [{ id: doc._id, ...event, responses }]
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
    if (!isDiaryAuthorised(request)) return noStore({ error: 'PIN required' }, 401)
    return noStore({ events: await loadEvents() })
  } catch (error) {
    console.error('Unable to load club diary', error)
    return noStore({ error: 'Club Diary is not configured yet' }, 503)
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isDiaryAuthorised(request)) return noStore({ error: 'PIN required' }, 401)

    const body = await request.json().catch(() => ({}))
    const category = CATEGORIES.includes(body?.category) ? body.category as Category : 'other'
    const startDate = validDate(body?.startDate)
    const requestedEndDate = validDate(body?.endDate)
    const endDate = requestedEndDate && requestedEndDate >= startDate ? requestedEndDate : undefined
    const startTime = validTime(body?.startTime) || undefined
    const endTime = validTime(body?.endTime) || undefined
    const person = cleanText(body?.person, 80)
    let title = cleanText(body?.title, 120)
    const notes = cleanText(body?.notes, 1200) || undefined

    if (!startDate) return noStore({ error: 'A valid start date is required' }, 400)
    if (category === 'availability') {
      if (!person) return noStore({ error: 'Please enter who is unavailable' }, 400)
      title = `${person} unavailable`
    }
    if (!title) return noStore({ error: 'Please enter a title' }, 400)

    const shareToken = category === 'working-party' ? newShareToken() : undefined
    const stored: StoredEvent = {
      title,
      category,
      startDate,
      endDate,
      startTime,
      endTime,
      notes,
      person: person || undefined,
      createdAt: new Date().toISOString(),
      shareToken,
    }

    const client = getDiaryClient()
    const created = await client.create({
      _type: 'clubDiaryEvent',
      payload: encryptDiaryPayload(stored),
      ...(shareToken ? { shareTokenHash: shareTokenHash(shareToken) } : {}),
    })

    return noStore({ event: { id: created._id, ...stored, responses: [] } }, 201)
  } catch (error) {
    console.error('Unable to create club diary event', error)
    return noStore({ error: 'Unable to save this diary entry' }, 500)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    if (!isDiaryAuthorised(request)) return noStore({ error: 'PIN required' }, 401)
    const id = cleanText(request.nextUrl.searchParams.get('id'), 200)
    if (!id) return noStore({ error: 'Event id is required' }, 400)

    const client = getDiaryClient()
    const exists = await client.fetch<string | null>(`*[_type == "clubDiaryEvent" && _id == $id][0]._id`, { id }, { cache: 'no-store' })
    if (!exists) return noStore({ error: 'Diary entry not found' }, 404)

    const rsvps = await client.fetch<Array<{ _id: string }>>(
      `*[_type == "clubDiaryRsvp" && eventId == $id] { _id }`,
      { id },
      { cache: 'no-store' }
    )

    let transaction = client.transaction().delete(id)
    for (const response of rsvps || []) transaction = transaction.delete(response._id)
    await transaction.commit()
    return noStore({ ok: true })
  } catch (error) {
    console.error('Unable to delete club diary event', error)
    return noStore({ error: 'Unable to remove this diary entry' }, 500)
  }
}
