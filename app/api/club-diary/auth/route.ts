import { NextRequest, NextResponse } from 'next/server'
import {
  CLUB_DIARY_COOKIE,
  authenticateDiaryUser,
  diarySessionValue,
  getDiaryClient,
  getDiarySession,
  type DiaryRole,
} from '../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function isConfigured() {
  try {
    diarySessionValue({ role: 'admin' })
    diarySessionValue({ role: 'member', name: 'Test User' })
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

  const session = getDiarySession(request)
  return NextResponse.json(
    {
      configured: true,
      authorised: Boolean(session),
      role: session?.role || null,
      name: session?.name || '',
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
  const session = authenticateDiaryUser(String(body?.pin || ''), String(body?.name || ''), requestedRole)

  if (!session) {
    return NextResponse.json(
      { error: requestedRole === 'admin' ? 'Incorrect admin PIN.' : 'Check your name and general access PIN.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true, role: session.role, name: session.name || '' })
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
