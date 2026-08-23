import { NextRequest, NextResponse } from 'next/server'
import {
  CLUB_DIARY_COOKIE,
  clubDiaryConfigured,
  clubDiarySessionToken,
  validClubDiaryPin,
} from '../../../lib/clubDiaryAuth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  if (!clubDiaryConfigured()) {
    return NextResponse.json({ configured: false, authorised: false }, { status: 503 })
  }

  const expected = clubDiarySessionToken()
  const supplied = request.cookies.get(CLUB_DIARY_COOKIE)?.value || ''
  return NextResponse.json({ configured: true, authorised: Boolean(expected && supplied === expected) })
}

export async function POST(request: NextRequest) {
  if (!clubDiaryConfigured()) {
    return NextResponse.json({ error: 'Club Diary PIN has not been configured.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  if (!validClubDiaryPin(String(body?.pin || ''))) {
    return NextResponse.json({ error: 'Incorrect PIN.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: CLUB_DIARY_COOKIE,
    value: clubDiarySessionToken(),
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: CLUB_DIARY_COOKIE,
    value: '',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
  return response
}
