import { NextRequest, NextResponse } from 'next/server'
import { CLUB_DIARY_COOKIE, diarySessionValue, pinIsValid } from '../../../lib/clubDiary.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    if (!pinIsValid(String(body?.pin || ''))) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set(CLUB_DIARY_COOKIE, diarySessionValue(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 180,
    })
    response.headers.set('Cache-Control', 'no-store')
    return response
  } catch (error) {
    console.error('Club diary login failed', error)
    return NextResponse.json({ error: 'Club Diary is not configured yet' }, { status: 503 })
  }
}
