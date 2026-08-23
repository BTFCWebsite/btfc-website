import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { isClubDiaryAuthorised } from '../../lib/clubDiaryAuth'

export const dynamic = 'force-dynamic'

const readClient = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

function sanityToken() {
  return String(
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    ''
  ).trim()
}

function writeClient() {
  const token = sanityToken()
  if (!token) return null
  return createClient({
    projectId: 'vm0n9zl5',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })
}

const CATEGORIES = new Set([
  'unavailable',
  'clubhouse',
  'workingParty',
  'event',
  'meeting',
  'other',
])

function clean(value: unknown, max = 500) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function validDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00Z`).getTime())
}

function validTime(value: string) {
  return !value || /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
}

function targetNumber(value: unknown) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return 0
  return Math.max(0, Math.min(99, Math.round(parsed)))
}

export async function GET(request: NextRequest) {
  if (!isClubDiaryAuthorised(request)) {
    return NextResponse.json({ error: 'PIN required.' }, { status: 401 })
  }

  try {
    const [events, rsvps] = await Promise.all([
      readClient.fetch(`*[_type == "clubDiaryEvent"] | order(startDate asc, startTime asc) {
        _id, title, category, startDate, endDate, startTime, notes, personName,
        targetHelpers, inviteCode, _createdAt
      }`, {}, { cache: 'no-store' }),
      readClient.fetch(`*[_type == "clubDiaryRsvp"] | order(_createdAt asc) {
        _id, eventId, name, response, _createdAt
      }`, {}, { cache: 'no-store' }),
    ])

    const joined = (events || []).map((event: any) => ({
      ...event,
      rsvps: (rsvps || []).filter((rsvp: any) => rsvp.eventId === event._id),
    }))

    return NextResponse.json({ events: joined, writeConfigured: Boolean(sanityToken()) }, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    console.error('Unable to load club diary:', error)
    return NextResponse.json({ error: 'Unable to load the Club Diary.' }, { status: 502 })
  }
}

export async function POST(request: NextRequest) {
  if (!isClubDiaryAuthorised(request)) {
    return NextResponse.json({ error: 'PIN required.' }, { status: 401 })
  }

  const writer = writeClient()
  if (!writer) {
    return NextResponse.json({ error: 'Diary editing has not been configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const action = clean(body?.action, 30)

  if (action === 'deleteEvent') {
    const id = clean(body?.id, 200)
    if (!id) return NextResponse.json({ error: 'Event id is required.' }, { status: 400 })
    await writer.delete(id)
    return NextResponse.json({ ok: true })
  }

  if (action !== 'createEvent') {
    return NextResponse.json({ error: 'Unknown diary action.' }, { status: 400 })
  }

  const category = clean(body?.category, 30)
  const startDate = clean(body?.startDate, 10)
  const endDate = clean(body?.endDate, 10) || startDate
  const startTime = clean(body?.startTime, 5)
  const personName = clean(body?.personName, 100)
  const notes = clean(body?.notes, 1200)
  let title = clean(body?.title, 160)

  if (!CATEGORIES.has(category)) {
    return NextResponse.json({ error: 'Choose a valid diary type.' }, { status: 400 })
  }
  if (!validDate(startDate) || !validDate(endDate) || endDate < startDate) {
    return NextResponse.json({ error: 'Check the start and end dates.' }, { status: 400 })
  }
  if (!validTime(startTime)) {
    return NextResponse.json({ error: 'Check the time.' }, { status: 400 })
  }
  if (category === 'unavailable' && !personName) {
    return NextResponse.json({ error: 'Add the name of the person who is unavailable.' }, { status: 400 })
  }

  if (!title) {
    if (category === 'unavailable') title = `${personName} unavailable`
    else if (category === 'workingParty') title = 'Club Working Party'
    else return NextResponse.json({ error: 'Add a title.' }, { status: 400 })
  }

  const event = await writer.create({
    _type: 'clubDiaryEvent',
    title,
    category,
    startDate,
    endDate,
    startTime: startTime || undefined,
    notes: notes || undefined,
    personName: personName || undefined,
    targetHelpers: category === 'workingParty' ? targetNumber(body?.targetHelpers) : undefined,
    inviteCode: category === 'workingParty' ? randomBytes(10).toString('hex') : undefined,
  })

  return NextResponse.json({ event })
}
