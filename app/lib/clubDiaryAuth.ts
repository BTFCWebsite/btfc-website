import { createHmac, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'

export const CLUB_DIARY_COOKIE = 'btfc_club_diary'

function configuredPin() {
  return String(process.env.CLUB_DIARY_PIN || '').trim()
}

function secretKey() {
  return String(process.env.CLUB_DIARY_SECRET || configuredPin()).trim()
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left)
  const b = Buffer.from(right)
  return a.length === b.length && timingSafeEqual(a, b)
}

export function clubDiaryConfigured() {
  return Boolean(configuredPin())
}

export function validClubDiaryPin(input: string) {
  const pin = configuredPin()
  return Boolean(pin) && safeEqual(String(input || '').trim(), pin)
}

export function clubDiarySessionToken() {
  const key = secretKey()
  if (!key) return ''
  return createHmac('sha256', key).update('btfc-club-diary-session-v1').digest('hex')
}

export function isClubDiaryAuthorised(request: NextRequest) {
  const expected = clubDiarySessionToken()
  const supplied = request.cookies.get(CLUB_DIARY_COOKIE)?.value || ''
  return Boolean(expected && supplied && safeEqual(supplied, expected))
}
