import { NextRequest, NextResponse } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  normaliseName,
  shareTokenHash,
} from '../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ResponseValue = 'yes' | 'maybe' | 'no'
type StoredEvent = {
  title: string
  category: string
  startDate: string
  endDate?: string
  startTime?: string
  notes?: string
  targetHelpers?: number
  inviteCode?: string
}
type StoredRsvp = {
  name: string
  response: ResponseValue
  respondedAt: string
}

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: { 'Cache-Control': 'no-store, max-age=0' } })
}

async function findEvent(code: string) {
  if (!code) return null
  const client = getDiaryClient()
  const hash = shareTokenHash(code)
  const doc = await client.fetch<{ _id: string; payload: string } | null>(
    `*[_type == "clubDiaryEvent" && shareTokenHash == $hash][0] { _id, payload }`,
    { hash },
    { cache: 'no-store' }
  )
  if (!doc) return null

  const event = decryptDiaryPayload<StoredEvent>(doc.payload)
  if (event.category !== 'workingParty' || event.inviteCode !== code) return null
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
      console.error('Unable to decrypt club diary RSVP', doc._id, error)
    }
  }
  return Array.from(latest.values())
}

function countsFor(responses: StoredRsvp[]) {
  return responses.reduce((counts, response) => {
    counts[response.response] += 1
    return counts
  }, { yes: 0, maybe: 0, no: 0 })
}

export async function GET(request: NextRequest) {
  try {
    const code = cleanText(request.nextUrl.searchParams.get('code'), 200)
    const event = await findEvent(code)
    if (!event) return noStore({ error: 'This invitation cannot be found.' }, 404)

    const responses = await loadResponses(event.id)
    return noStore({
      event: {
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        startTime: event.startTime,
        notes: event.notes,
        targetHelpers: event.targetHelpers,
      },
      counts: countsFor(responses),
    })
  } catch (error) {
    console.error('Unable to load working party invitation:', error)
    return noStore({ error: 'This invitation is temporarily unavailable.' }, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const code = cleanText(body?.code, 200)
    const name = cleanText(body?.name, 100)
    const response = cleanText(body?.response, 10) as ResponseValue

    if (!name) return noStore({ error: 'Please enter your name.' }, 400)
    if (!['yes', 'maybe', 'no'].includes(response)) {
      return noStore({ error: 'Choose Going, Maybe or Can’t make it.' }, 400)
    }

    const event = await findEvent(code)
    if (!event) return noStore({ error: 'This invitation cannot be found.' }, 404)

    const stored: StoredRsvp = {
      name,
      response,
      respondedAt: new Date().toISOString(),
    }

    await getDiaryClient().create({
      _type: 'clubDiaryRsvp',
      eventId: event.id,
      payload: encryptDiaryPayload(stored),
    })

    const responses = await loadResponses(event.id)
    return noStore({ ok: true, response, counts: countsFor(responses) }, 201)
  } catch (error) {
    console.error('Unable to save working party response:', error)
    return noStore({ error: 'Unable to save your response.' }, 500)
  }
}
