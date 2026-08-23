import { NextRequest, NextResponse } from 'next/server'
import { cleanText } from '../../../lib/clubDiary.server'
import {
  createDiaryPerson,
  getVerifiedDiarySession,
  loadDiaryPeople,
  setDiaryPersonPin,
  updateDiaryPerson,
} from '../../../lib/clubDiaryPeople.server'
import { writeDiaryAudit } from '../../../lib/clubDiaryAudit.server'

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
      const person = await createDiaryPerson(
        cleanText(body?.name, 100),
        Boolean(body?.isAdmin),
        cleanText(body?.pin, 20) || undefined,
        cleanText(body?.email, 160),
        cleanText(body?.mobile, 40)
      )
      await writeDiaryAudit(session, 'person.add', 'person', person.id, `Added ${person.name}${person.isAdmin ? ' with Admin rights' : ''}`)
      return noStore({ person }, 201)
    }

    if (action === 'update') {
      const id = cleanText(body?.id, 200)
      if (!id) return noStore({ error: 'Person id is required.' }, 400)

      const before = (await loadDiaryPeople(true)).find((person) => person.id === id)
      const values: { name?: string; email?: string; mobile?: string; isAdmin?: boolean; active?: boolean } = {}
      if (body?.name !== undefined) values.name = cleanText(body.name, 100)
      if (body?.email !== undefined) values.email = cleanText(body.email, 160)
      if (body?.mobile !== undefined) values.mobile = cleanText(body.mobile, 40)
      if (typeof body?.isAdmin === 'boolean') values.isAdmin = body.isAdmin
      if (typeof body?.active === 'boolean') values.active = body.active

      const person = await updateDiaryPerson(id, values)
      const changes: string[] = []
      if (before && before.name !== person.name) changes.push(`renamed ${before.name} to ${person.name}`)
      if (before && before.email !== person.email) changes.push('updated email address')
      if (before && before.mobile !== person.mobile) changes.push('updated mobile number')
      if (before && before.isAdmin !== person.isAdmin) changes.push(person.isAdmin ? 'granted Admin rights' : 'removed Admin rights')
      if (before && before.active !== person.active) changes.push(person.active ? 'reactivated account' : 'deactivated account')
      await writeDiaryAudit(session, 'person.update', 'person', person.id, changes.length ? `${person.name}: ${changes.join(', ')}` : `Updated ${person.name}`)
      return noStore({ person })
    }

    if (action === 'setPin') {
      const id = cleanText(body?.id, 200)
      const pin = cleanText(body?.pin, 20)
      if (!id) return noStore({ error: 'Person id is required.' }, 400)
      const person = await setDiaryPersonPin(id, pin)
      await writeDiaryAudit(session, 'person.pin', 'person', person.id, `Set/reset personal PIN for ${person.name}`)
      return noStore({ person })
    }

    return noStore({ error: 'Unknown people action.' }, 400)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to update the people list.'
    return noStore({ error: message }, 400)
  }
}
