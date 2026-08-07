import {NextResponse} from 'next/server'
import {createClient} from 'next-sanity'

export const dynamic = 'force-dynamic'

const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

function parseFixture(value: unknown) {
  if (!value || typeof value !== 'string') return null
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  const programmes = await client.fetch(`*[_type == "matchdayProgramme" && published != false && defined(programmePdf.asset)] | order(_updatedAt desc) {
    _updatedAt,
    selectedFixture,
    matchDate,
    "programmeUrl": programmePdf.asset->url
  }`)

  const today = new Date().toISOString().slice(0, 10)
  const prepared = (programmes || []).map((programme: any) => {
    const fixture = parseFixture(programme.selectedFixture)
    return {
      ...programme,
      fixtureDate: fixture?.date || programme.matchDate || '',
    }
  })

  const current = prepared
    .filter((programme: any) => programme.programmeUrl && programme.fixtureDate >= today)
    .sort((a: any, b: any) => String(a.fixtureDate).localeCompare(String(b.fixtureDate)))[0]

  const fallback = prepared.find((programme: any) => programme.programmeUrl)
  const programme = current || fallback

  if (!programme?.programmeUrl) {
    return NextResponse.redirect(new URL('/matchday', request.url), 302)
  }

  return NextResponse.redirect(programme.programmeUrl, 302)
}
