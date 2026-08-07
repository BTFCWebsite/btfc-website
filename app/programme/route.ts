import {NextResponse} from 'next/server'
import {createClient} from 'next-sanity'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

function parseFixture(value: unknown) {
  if (!value || typeof value !== 'string') return null
  try { return JSON.parse(value) } catch { return null }
}

export async function GET(request: Request) {
  const programmes = await client.fetch(`*[_type == "matchdayProgramme" && published != false && defined(programmePdf.asset)] | order(_updatedAt desc) {
    selectedFixture,
    fixture,
    matchDate,
    "programmeUrl": programmePdf.asset->url
  }`, {}, {cache: 'no-store'})

  const today = new Date().toISOString().slice(0, 10)

  const prepared = (programmes || [])
    .map((programme: any) => {
      const selected = parseFixture(programme.selectedFixture) || parseFixture(programme.fixture)
      return {
        ...programme,
        fixtureDate: selected?.date || programme.matchDate || '',
      }
    })
    .filter((programme: any) => programme.programmeUrl && programme.fixtureDate >= today)
    .sort((a: any, b: any) => String(a.fixtureDate).localeCompare(String(b.fixtureDate)))

  const current = prepared[0]

  if (!current?.programmeUrl) {
    const response = NextResponse.redirect(new URL('/matchday', request.url), 302)
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    return response
  }

  const response = NextResponse.redirect(current.programmeUrl, 302)
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  return response
}
