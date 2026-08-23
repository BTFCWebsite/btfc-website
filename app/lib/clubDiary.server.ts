import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { createClient } from 'next-sanity'
import type { NextRequest } from 'next/server'

export const CLUB_DIARY_COOKIE = 'btfc-club-diary'
export type DiaryRole = 'member' | 'admin'
export type DiarySession = { role: DiaryRole; name?: string }

type RequiredEnv =
  | 'CLUB_DIARY_MEMBER_PIN'
  | 'CLUB_DIARY_ADMIN_PIN'
  | 'CLUB_DIARY_DATA_KEY'
  | 'SANITY_API_WRITE_TOKEN'

function requiredEnv(name: RequiredEnv) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not configured`)
  return value
}

function dataKey() {
  return createHash('sha256').update(requiredEnv('CLUB_DIARY_DATA_KEY')).digest()
}

function sessionSigningKey() {
  return createHmac('sha256', dataKey())
    .update(`sessions:${requiredEnv('CLUB_DIARY_MEMBER_PIN')}:${requiredEnv('CLUB_DIARY_ADMIN_PIN')}`)
    .digest()
}

export function getDiaryClient() {
  return createClient({
    projectId: 'vm0n9zl5',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: requiredEnv('SANITY_API_WRITE_TOKEN'),
  })
}

export function encryptDiaryPayload(value: unknown) {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', dataKey(), iv)
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ])
  const tag = cipher.getAuthTag()
  return `v1.${iv.toString('base64url')}.${tag.toString('base64url')}.${encrypted.toString('base64url')}`
}

export function decryptDiaryPayload<T>(value: string): T {
  const [version, ivText, tagText, payloadText] = String(value || '').split('.')
  if (version !== 'v1' || !ivText || !tagText || !payloadText) throw new Error('Invalid diary payload')

  const decipher = createDecipheriv('aes-256-gcm', dataKey(), Buffer.from(ivText, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'))
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payloadText, 'base64url')),
    decipher.final(),
  ])
  return JSON.parse(decrypted.toString('utf8')) as T
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function authenticateDiaryUser(pin: string, name: string, requestedRole: DiaryRole): DiarySession | null {
  const suppliedPin = String(pin || '')
  if (requestedRole === 'admin') {
    return safeEqual(suppliedPin, requiredEnv('CLUB_DIARY_ADMIN_PIN')) ? { role: 'admin' } : null
  }

  const cleanName = cleanText(name, 100)
  if (!cleanName) return null
  return safeEqual(suppliedPin, requiredEnv('CLUB_DIARY_MEMBER_PIN'))
    ? { role: 'member', name: cleanName }
    : null
}

export function diarySessionValue(session: DiarySession = { role: 'admin' }) {
  const payload = Buffer.from(JSON.stringify(session), 'utf8').toString('base64url')
  const signature = createHmac('sha256', sessionSigningKey()).update(payload).digest('base64url')
  return `${payload}.${signature}`
}

export function getDiarySession(request: NextRequest): DiarySession | null {
  try {
    const supplied = request.cookies.get(CLUB_DIARY_COOKIE)?.value || ''
    const [payload, signature] = supplied.split('.')
    if (!payload || !signature) return null
    const expected = createHmac('sha256', sessionSigningKey()).update(payload).digest('base64url')
    if (!safeEqual(signature, expected)) return null

    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as DiarySession
    if (parsed?.role === 'admin') return { role: 'admin' }
    if (parsed?.role === 'member' && cleanText(parsed.name, 100)) {
      return { role: 'member', name: cleanText(parsed.name, 100) }
    }
    return null
  } catch {
    return null
  }
}

export function isDiaryAuthorised(request: NextRequest) {
  return getDiarySession(request) !== null
}

// Kept for compatibility while the feature branch transitions to two access levels.
export function pinIsValid(pin: string) {
  return safeEqual(String(pin || ''), requiredEnv('CLUB_DIARY_ADMIN_PIN'))
}

export function newShareToken() {
  return randomBytes(24).toString('base64url')
}

export function shareTokenHash(token: string) {
  return createHmac('sha256', dataKey()).update(`share:${token}`).digest('hex')
}

export function cleanText(value: unknown, maxLength = 500) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, maxLength)
}

export function normaliseName(value: unknown) {
  return cleanText(value, 80).toLocaleLowerCase('en-GB')
}

export function validDate(value: unknown) {
  const text = String(value || '')
  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : ''
}

export function validTime(value: unknown) {
  const text = String(value || '')
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text) ? text : ''
}
