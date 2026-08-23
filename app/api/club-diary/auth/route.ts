import { NextRequest, NextResponse } from 'next/server'
import {
  CLUB_DIARY_COOKIE,
  adminPinIsValid,
  cleanText,
  diarySessionValue,
  getDiaryClient,
  type DiaryRole,
  type DiarySession,
} from '../../../lib/clubDiary.server'
import {
  createDiaryPerson,
  diaryPersonPinIsValid,
  getVerifiedDiarySession,
  loadDiaryPeople,
} from '../../../lib/clubDiaryPeople.server'
import { writeDiaryAudit } from '../../../lib/clubDiaryAudit.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isConfigured() {
  try {
    diarySessionValue({ role: 'admin' })
    getDiaryClient()
    return true
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ configured: false, authorised: false }, { status: 503 })
  }

  const session = await getVerifiedDiarySession(request)
  return NextResponse.json(
    {
      configured: true,
      authorised: Boolean(session),
      role: session?.role || null,
      name: session?.name || '',
      personId: session?.personId || '',
    },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Club Diary has not been configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  const requestedRole: DiaryRole = body?.role === 'admin' ? 'admin' : 'member'
  const pin = String(body?.pin || '')
  const people = await loadDiaryPeople(true)
  let session: DiarySession | null = null

  if (people.length === 0) {
    if (requestedRole !== 'admin' || !adminPinIsValid(pin)) {
      return NextResponse.json({ error: 'Use the Admin setup PIN to create the first administrator.' }, { status: 401 })
    }

    const bootstrapName = cleanText(body?.name, 100)
    if (!bootstrapName) {
      return NextResponse.json({ error: 'Enter your name to create the first administrator.' }, { status: 400 })
    }

    const firstAdmin = await createDiaryPerson(bootstrapName, true)
    session = { role: 'admin', personId: firstAdmin.id, name: firstAdmin.name }
  } else {
    const personId = cleanText(body?.personId, 200)
    const person = people.find((item) => item.id === personId && item.active)

    if (!person) {
      return NextResponse.json({ error: 'Choose your name from the list.' }, { status: 400 })
    }
    if (requestedRole === 'admin' && !person.isAdmin) {
      return NextResponse.json({ error: 'That person does not have administrator access.' }, { status: 403 })
    }

    let pinValid = false
    if (person.hasPin) {
      pinValid = await diaryPersonPinIsValid(person.id, pin)
    } else if (requestedRole === 'admin' && person.isAdmin) {
      // Migration/bootstrap only: once this person has a personal PIN, the shared Admin PIN stops working for them.
      pinValid = adminPinIsValid(pin)
    }

    if (!pinValid) {
      return NextResponse.json({
        error: person.hasPin
          ? 'Incorrect personal PIN.'
          : 'A diary administrator needs to set your personal PIN first.',
      }, { status: 401 })
    }

    session = { role: requestedRole, personId: person.id, name: person.name }
  }

  await writeDiaryAudit(session, 'login', 'session', session.personId, `Logged in with ${session.role === 'admin' ? 'Admin' : 'General'} access`)

  const response = NextResponse.json({
    ok: true,
    role: session.role,
    name: session.name || '',
    personId: session.personId || '',
  })
  response.cookies.set({
    name: CLUB_DIARY_COOKIE,
    value: diarySessionValue(session),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function DELETE(request: NextRequest) {
  const session = await getVerifiedDiarySession(request).catch(() => null)
  if (session) await writeDiaryAudit(session, 'logout', 'session', session.personId, 'Logged out')

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: CLUB_DIARY_COOKIE,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}
