import { randomBytes } from 'crypto'
import type { NextRequest } from 'next/server'
import {
  cleanText,
  decryptDiaryPayload,
  diaryPersonPinHash,
  diaryPersonPinMatches,
  encryptDiaryPayload,
  getDiaryClient,
  getDiarySession,
  normaliseName,
  validPersonalPin,
  type DiarySession,
} from './clubDiary.server'

export type DiaryPerson = {
  id: string
  name: string
  isAdmin: boolean
  active: boolean
  hasPin: boolean
  createdAt: string
}

type StoredPerson = {
  name: string
  isAdmin: boolean
  active: boolean
  pinHash?: string
  createdAt: string
}

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
        hasPin: Boolean(stored.pinHash),
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

async function loadDiaryPersonDocument(id: string) {
  const cleanId = cleanText(id, 200)
  if (!cleanId) return null
  return getDiaryClient().fetch<PersonDoc | null>(
    `*[_type == "clubDiaryPerson" && _id == $id][0] { _id, payload }`,
    { id: cleanId },
    { cache: 'no-store' }
  )
}

export async function findDiaryPerson(id: string) {
  const cleanId = cleanText(id, 200)
  if (!cleanId) return null
  const people = await loadDiaryPeople(true)
  return people.find((person) => person.id === cleanId) || null
}

export async function diaryPersonPinIsValid(id: string, pin: string) {
  const doc = await loadDiaryPersonDocument(id)
  if (!doc) return false
  try {
    const stored = decryptDiaryPayload<StoredPerson>(doc.payload)
    return diaryPersonPinMatches(doc._id, pin, cleanText(stored.pinHash, 200))
  } catch {
    return false
  }
}

export async function createDiaryPerson(name: string, isAdmin: boolean, pin?: string) {
  const cleanName = cleanText(name, 100)
  if (!cleanName) throw new Error('Add a name.')
  if (pin !== undefined && pin !== '' && !validPersonalPin(pin)) throw new Error('Personal PIN must be exactly 6 digits.')

  const people = await loadDiaryPeople(true)
  if (people.some((person) => normaliseName(person.name) === normaliseName(cleanName))) {
    throw new Error('That person is already on the list.')
  }

  const hasActiveAdmin = people.some((person) => person.active && person.isAdmin)
  const id = `clubDiaryPerson.${randomBytes(12).toString('hex')}`
  const stored: StoredPerson = {
    name: cleanName,
    isAdmin: hasActiveAdmin ? Boolean(isAdmin) : true,
    active: true,
    ...(pin ? { pinHash: diaryPersonPinHash(id, pin) } : {}),
    createdAt: new Date().toISOString(),
  }

  await getDiaryClient().create({
    _id: id,
    _type: 'clubDiaryPerson',
    payload: encryptDiaryPayload(stored),
  })

  return {
    id,
    name: stored.name,
    isAdmin: stored.isAdmin,
    active: stored.active,
    hasPin: Boolean(stored.pinHash),
    createdAt: stored.createdAt,
  } satisfies DiaryPerson
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

  const doc = await loadDiaryPersonDocument(id)
  if (!doc) throw new Error('Person not found.')
  const existing = decryptDiaryPayload<StoredPerson>(doc.payload)

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
    ...(existing.pinHash ? { pinHash: existing.pinHash } : {}),
    createdAt: person.createdAt,
  }

  await getDiaryClient().patch(id).set({ payload: encryptDiaryPayload(stored) }).commit()
  return updated
}

export async function setDiaryPersonPin(id: string, pin: string) {
  if (!validPersonalPin(pin)) throw new Error('Personal PIN must be exactly 6 digits.')
  const doc = await loadDiaryPersonDocument(id)
  if (!doc) throw new Error('Person not found.')

  const stored = decryptDiaryPayload<StoredPerson>(doc.payload)
  const updated: StoredPerson = {
    ...stored,
    pinHash: diaryPersonPinHash(doc._id, pin),
  }
  await getDiaryClient().patch(doc._id).set({ payload: encryptDiaryPayload(updated) }).commit()

  return {
    id: doc._id,
    name: cleanText(updated.name, 100),
    isAdmin: Boolean(updated.isAdmin),
    active: updated.active !== false,
    hasPin: true,
    createdAt: cleanText(updated.createdAt, 50),
  } satisfies DiaryPerson
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
