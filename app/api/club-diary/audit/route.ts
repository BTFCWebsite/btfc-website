import { NextRequest, NextResponse } from 'next/server'
import { getVerifiedDiarySession } from '../../../lib/clubDiaryPeople.server'
import { loadDiaryAudit } from '../../../lib/clubDiaryAudit.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getVerifiedDiarySession(request)
    if (!session) return NextResponse.json({ error: 'Login required.' }, { status: 401 })
    if (session.role !== 'admin') return NextResponse.json({ error: 'Administrator access required.' }, { status: 403 })

    const entries = await loadDiaryAudit(250)
    return NextResponse.json({ entries }, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('Unable to load Club Diary audit log:', error)
    return NextResponse.json({ error: 'Unable to load activity log.' }, { status: 500 })
  }
}
