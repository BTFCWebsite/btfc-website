import { NextRequest, NextResponse } from 'next/server'
import { cleanText } from '../../../lib/clubDiary.server'
import {
  createDiaryPerson,
  getVerifiedDiarySession,
  loadDiaryPeople,
  updateDiaryPerson,
} from '../../../lib/clubDiaryPeople.server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function noStore(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  })
}

export async function GET(request: NextRequest) {
  try {
    const session = await getVerifiedDiarySession(request)
    if (!session) return noStore({ error: 'Login required.' }, 401)
    if (session.role !== 'admin') return noStore({ error: 'Administrator access required.' }, 403)

    return noStore({ people: await loadDiaryPeople(true) })
  } catch (error) {
    console.error('Unable to load Club Diary people:', error)
    return noStore({ error: 'Unable to load the people list.' }, 500)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getVerifiedDiarySession(request)
    if (!session) return noStore({ error: 'Login required.' }, 401)
    if (session.role !== 'admin') return noStore({ error: 'Administrator access required.' }, 403)

    const body = await request.json().catch(() => ({}))
    const action = cleanText(body?.action, 30)

    if (action === 'add') {
      const person = await createDiaryPerson(cleanText(body?.name, 100), Boolean(body?.isAdmin))
      return noStore({ person }, 201)
    }

    if (action === 'update') {
      const id = cleanText(body?.id, 200)
      if (!id) return noStore({ error: 'Person id is required.' }, 400)

      const values: { name?: string; isAdmin?: boolean; active?: boolean } = {}
      if (body?.name !== undefined) values.name = cleanText(body.name, 100)
      if (typeof body?.isAdmin === 'boolean') values.isAdmin = body.isAdmin
      if (typeof body?.active === 'boolean') values.active = body.active

      const person = await updateDiaryPerson(id, values)
      return noStore({ person })
    }

    return noStore({ error: 'Unknown people action.' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update the people list.'
    return noStore({ error: message }, 400)
  }
}
