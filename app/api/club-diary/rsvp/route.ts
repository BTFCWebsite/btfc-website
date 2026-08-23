import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

function token() {
  return String(
    process.env.SANITY_WRITE_TOKEN ||
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    ''
  ).trim()
}

function writer() {
  const auth = token()
  if (!auth) return null
  return createClient({
    projectId: 'vm0n9zl5',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: auth,
  })
}

function clean(value: unknown, max = 200) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max)
}

function nameKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
}

async function findEvent(code: string) {
  if (!/^[a-f0-9]{20}$/.test(code)) return null
  return client.fetch(
    `*[_type == "clubDiaryEvent" && category == "workingParty" && inviteCode == $code][0] {
      _id, title, startDate, endDate, startTime, notes, targetHelpers
    }`,
    { code },
    { cache: 'no-store' }
  )
}

export async function GET(request: NextRequest) {
  const code = clean(request.nextUrl.searchParams.get('code'), 20)
  const event = await findEvent(code)
  if (!event) return NextResponse.json({ error: 'This invitation cannot be found.' }, { status: 404 })

  const rsvps = await client.fetch(
    `*[_type == "clubDiaryRsvp" && eventId == $eventId] | order(_createdAt asc) {
      name, response
    }`,
    { eventId: event._id },
    { cache: 'no-store' }
  )

  const counts = (rsvps || []).reduce((result: Record<string, number>, rsvp: any) => {
    const response = String(rsvp?.response || '')
    if (response in result) result[response] += 1
    return result
  }, { yes: 0, maybe: 0, no: 0 })

  return NextResponse.json({ event, counts }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
}

export async function POST(request: NextRequest) {
  const write = writer()
  if (!write) {
    return NextResponse.json({ error: 'RSVPs have not been configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const code = clean(body?.code, 20)
  const name = clean(body?.name, 100)
  const response = clean(body?.response, 10)

  if (!name) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
  if (!['yes', 'maybe', 'no'].includes(response)) {
    return NextResponse.json({ error: 'Choose Yes, Maybe or No.' }, { status: 400 })
  }

  const event = await findEvent(code)
  if (!event) return NextResponse.json({ error: 'This invitation cannot be found.' }, { status: 404 })

  const key = nameKey(name)
  const existing = await write.fetch(
    `*[_type == "clubDiaryRsvp" && eventId == $eventId && nameKey == $nameKey][0]._id`,
    { eventId: event._id, nameKey: key },
    { cache: 'no-store' }
  )

  if (existing) {
    await write.patch(existing).set({ name, response }).commit()
  } else {
    await write.create({
      _type: 'clubDiaryRsvp',
      eventId: event._id,
      name,
      nameKey: key,
      response,
    })
  }

  return NextResponse.json({ ok: true, response })
}
