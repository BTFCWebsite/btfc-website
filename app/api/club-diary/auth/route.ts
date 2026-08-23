import { NextRequest, NextResponse } from 'next/server'
import {
  CLUB_DIARY_COOKIE,
  diarySessionValue,
  getDiaryClient,
  isDiaryAuthorised,
  pinIsValid,
} from '../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isConfigured() {
  try {
    diarySessionValue()
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

  return NextResponse.json(
    { configured: true, authorised: isDiaryAuthorised(request) },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  )
}

export async function POST(request: NextRequest) {
  if (!isConfigured()) {
    return NextResponse.json({ error: 'Club Diary has not been configured yet.' }, { status: 503 })
  }

  const body = await request.json().catch(() => ({}))
  if (!pinIsValid(String(body?.pin || ''))) {
    return NextResponse.json({ error: 'Incorrect PIN.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set({
    name: CLUB_DIARY_COOKIE,
    value: diarySessionValue(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
  response.headers.set('Cache-Control', 'no-store')
  return response
}

export async function DELETE() {
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
