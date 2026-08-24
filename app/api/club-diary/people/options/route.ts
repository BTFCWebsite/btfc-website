import { NextRequest, NextResponse } from 'next/server'
import {
  adminPinIsValid,
  memberPinIsValid,
  type DiaryRole,
} from '../../../../lib/clubDiary.server'
import { loadDiaryPeople } from '../../../../lib/clubDiaryPeople.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function responseFor(role: DiaryRole, people: Awaited<ReturnType<typeof loadDiaryPeople>>) {
  const eligible = people
    .filter((person) => role === 'admin' ? person.isAdmin : !person.isAdmin)
    .map((person) => ({ id: person.id, name: person.name, hasPin: person.hasPin }))

  return NextResponse.json({
    people: eligible,
    needsSetup: role === 'admin' && people.length === 0,
  }, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

// Names are intentionally available before PIN entry so both login screens can
// present the approved dropdown. No diary data is exposed here.
export async function GET(request: NextRequest) {
  try {
    const role: DiaryRole = request.nextUrl.searchParams.get('role') === 'admin' ? 'admin' : 'member'
    const people = await loadDiaryPeople(false)
    return responseFor(role, people)
  } catch (error) {
    console.error('Unable to load Club Diary login names:', error)
    return NextResponse.json({ error: 'Unable to load names.' }, { status: 500 })
  }
}

// Retained for compatibility with the earlier two-step login UI.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const role: DiaryRole = body?.role === 'admin' ? 'admin' : 'member'
    const pin = String(body?.pin || '')
    const pinValid = role === 'admin' ? adminPinIsValid(pin) : memberPinIsValid(pin)

    if (!pinValid) {
      return NextResponse.json({ error: 'Incorrect PIN.' }, {
        status: 401,
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      })
    }

    const people = await loadDiaryPeople(false)
    return responseFor(role, people)
  } catch (error) {
    console.error('Unable to load Club Diary login names:', error)
    return NextResponse.json({ error: 'Unable to load names.' }, { status: 500 })
  }
}
