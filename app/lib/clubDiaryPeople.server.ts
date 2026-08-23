import type { NextRequest } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  encryptDiaryPayload,
  getDiaryClient,
  getDiarySession,
  normaliseName,
  type DiarySession,
} from './clubDiary.server'

export type DiaryPerson = {
  id: string
  name: string
  isAdmin: boolean
  active: boolean
  createdAt: string
}

type StoredPerson = Omit<DiaryPerson, 'id'>
type PersonDoc = { _id: string; payload: string }

export async function loadDiaryPeople(includeInactive = true): Promise<DiaryPerson[]> {
  const docs = await getDiaryClient().fetch<PersonDoc[]>(
    `*[_type == "clubDiaryPerson"] { _id, payload }`,
    {},
    { cache: 'no-store' }
  )

  return (docs || []).flatMap((doc) => {
    try {
      const stored = decryptDiaryPayload<StoredPerson>(doc.payload)
      const person: DiaryPerson = {
        id: doc._id,
        name: cleanText(stored.name, 100),
        isAdmin: Boolean(stored.isAdmin),
        active: stored.active !== false,
        createdAt: cleanText(stored.createdAt, 50) || new Date(0).toISOString(),
      }
      if (!person.name || (!includeInactive && !person.active)) return []
      return [person]
    } catch (error) {
      console.error('Unable to decrypt Club Diary person', doc._id, error)
      return []
    }
  }).sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))
}

export async function findDiaryPerson(id: string) {
  const cleanId = cleanText(id, 200)
  if (!cleanId) return null
  const people = await loadDiaryPeople(true)
  return people.find((person) => person.id === cleanId) || null
}

export async function createDiaryPerson(name: string, isAdmin: boolean) {
  const cleanName = cleanText(name, 100)
  if (!cleanName) throw new Error('Add a name.')

  const people = await loadDiaryPeople(true)
  if (people.some((person) => normaliseName(person.name) === normaliseName(cleanName))) {
    throw new Error('That person is already on the list.')
  }

  const hasActiveAdmin = people.some((person) => person.active && person.isAdmin)
  const stored: StoredPerson = {
    name: cleanName,
    isAdmin: hasActiveAdmin ? Boolean(isAdmin) : true,
    active: true,
    createdAt: new Date().toISOString(),
  }

  const created = await getDiaryClient().create({
    _type: 'clubDiaryPerson',
    payload: encryptDiaryPayload(stored),
  })

  return { id: created._id, ...stored } satisfies DiaryPerson
}

export async function updateDiaryPerson(id: string, values: { name?: string; isAdmin?: boolean; active?: boolean }) {
  const people = await loadDiaryPeople(true)
  const person = people.find((item) => item.id === id)
  if (!person) throw new Error('Person not found.')

  const requestedName = values.name === undefined ? person.name : cleanText(values.name, 100)
  if (!requestedName) throw new Error('Add a name.')
  if (people.some((item) => item.id !== id && normaliseName(item.name) === normaliseName(requestedName))) {
    throw new Error('That person is already on the list.')
  }

  const updated: DiaryPerson = {
    ...person,
    name: requestedName,
    isAdmin: typeof values.isAdmin === 'boolean' ? values.isAdmin : person.isAdmin,
    active: typeof values.active === 'boolean' ? values.active : person.active,
  }

  const otherActiveAdmins = people.filter((item) => item.id !== id && item.active && item.isAdmin)
  if ((!updated.active || !updated.isAdmin) && person.active && person.isAdmin && otherActiveAdmins.length === 0) {
    throw new Error('At least one active administrator must remain.')
  }

  const stored: StoredPerson = {
    name: updated.name,
    isAdmin: updated.isAdmin,
    active: updated.active,
    createdAt: person.createdAt,
  }

  await getDiaryClient().patch(id).set({ payload: encryptDiaryPayload(stored) }).commit()
  return updated
}

export async function getVerifiedDiarySession(request: NextRequest): Promise<DiarySession | null> {
  const session = getDiarySession(request)
  if (!session) return null

  const people = await loadDiaryPeople(true)

  // Bootstrap admin session used only while the first approved person is being created.
  if (!session.personId) {
    if (session.role === 'admin' && people.length === 0) return session
    return null
  }

  const person = people.find((item) => item.id === session.personId)
  if (!person || !person.active) return null
  if (session.role === 'admin' && !person.isAdmin) return null

  return {
    role: session.role,
    personId: person.id,
    name: person.name,
  }
}
