import { NextRequest, NextResponse } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  normaliseName,
  shareTokenHash,
} from '../../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RSVP_STATUSES = ['going', 'maybe', 'cant'] as const
type RsvpStatus = typeof RSVP_STATUSES[number]

type StoredEvent = {
  title: string
  category: string
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
  notes?: string
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

async function findEvent(token: string) {
  const client = getDiaryClient()
  const hash = shareTokenHash(token)
  const doc = await client.fetch<{ _id: string; payload: string } | null>(
    `*[_type == "clubDiaryEvent" && shareTokenHash == $hash][0] { _id, payload }`,
    { hash },
    { cache: 'no-store' }
  )
  if (!doc) return null
  const event = decryptDiaryPayload<StoredEvent>(doc.payload)
  if (event.category !== 'working-party') return null
  return { id: doc._id, ...event }
}

async function loadResponses(eventId: string) {
  const client = getDiaryClient()
  const docs = await client.fetch<Array<{ _id: string; payload: string }>>(
    `*[_type == "clubDiaryRsvp" && eventId == $eventId] { _id, payload }`,
    { eventId },
    { cache: 'no-store' }
  )
  const latest = new Map<string, StoredRsvp>()
  for (const doc of docs || []) {
    try {
      const response = decryptDiaryPayload<StoredRsvp>(doc.payload)
      const key = normaliseName(response.name)
      const current = latest.get(key)
      if (!current || response.respondedAt > current.respondedAt) latest.set(key, response)
    } catch (error) {
      console.error('Unable to decrypt club diary response', doc._id, error)
    }
  }
  return Array.from(latest.values()).sort((a, b) => a.name.localeCompare(b.name))
}

export async function GET(_request: NextRequest, context: { params: { token: string } }) {
  try {
    const token = cleanText(context.params.token, 200)
    if (!token) return noStore({ error: 'Invite not found' }, 404)
    const event = await findEvent(token)
    if (!event) return noStore({ error: 'Invite not found' }, 404)

    const responses = await loadResponses(event.id)
    return noStore({
      event: {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        endTime: event.endTime,
        notes: event.notes,
        responses,
      },
    })
  } catch (error) {
    console.error('Unable to load working party invite', error)
    return noStore({ error: 'This invite is temporarily unavailable' }, 500)
  }
}

export async function POST(request: NextRequest, context: { params: { token: string } }) {
  try {
    const token = cleanText(context.params.token, 200)
    const event = token ? await findEvent(token) : null
    if (!event) return noStore({ error: 'Invite not found' }, 404)

    const body = await request.json().catch(() => ({}))
    const name = cleanText(body?.name, 80)
    const status = RSVP_STATUSES.includes(body?.status) ? body.status as RsvpStatus : null
    if (!name) return noStore({ error: 'Please enter your name' }, 400)
    if (!status) return noStore({ error: 'Please choose a response' }, 400)

    const response: StoredRsvp = {
      name,
      status,
      respondedAt: new Date().toISOString(),
    }

    await getDiaryClient().create({
      _type: 'clubDiaryRsvp',
      eventId: event.id,
      payload: encryptDiaryPayload(response),
    })

    return noStore({ ok: true, response, responses: await loadResponses(event.id) }, 201)
  } catch (error) {
    console.error('Unable to save working party response', error)
    return noStore({ error: 'Unable to save your response' }, 500)
  }
}
