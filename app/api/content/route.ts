import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { client } from '../../lib/sanity.client'

export const revalidate = 60

const freshClient = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

const settingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0]`
const fixturesQuery = `*[_type == "fixture"] | order(date asc) {
  _id, date, opponent, team, venue, competition, kickoff,
  btfcScore, opponentScore, played,
  "programmeUrl": programmePdf.asset->url
}`
const playersQuery = `*[_type == "player" && active == true] | order(order asc, squadNumber asc) {
  _id, name, squadNumber, position, team, active, order,
  "imageUrl": coalesce(photo.asset->url, image.asset->url), bio,
  sponsorName, sponsorUrl, sponsorMessage,
  "sponsorLogoUrl": sponsorLogo.asset->url
}`
const staffQuery = `*[_type == "teamStaff" && active == true] | order(order asc, name asc) {
  _id, name, role, team, active, order, "imageUrl": image.asset->url
}`

const queries: Record<string, string> = {
  settings: settingsQuery,
  fixtures: fixturesQuery,
  programmes: `*[_type == "matchdayProgramme" && published != false] | order(_updatedAt desc) {
    _id, fixture, selectedFixture, title, fullTimeFixtureId, team, opponent, matchDate,
    "programmeUrl": programmePdf.asset->url
  }`,
  matchReports: `*[_type == "matchReport" && published == true] | order(_updatedAt desc) {
    _id, headline, matchData, report, "slug": slug.current, published
  }`,
  matchFeeds: `*[_type == "matchFeed" && active == true] | order(order asc) { team, snippet }`,
  players: playersQuery,
  staff: staffQuery,
  news: `*[_type == "newsArticle"] | order(date desc) {
    _id, title, category, date, showUntil, summary, body,
    "slug": slug.current, "imageUrl": image.asset->url
  }`,
  sponsors: `*[_type == "sponsor"] | order(order asc) {
    _id, name, tier, role, about, contactName, phone, email, website,
    "logoUrl": logo.asset->url
  }`,
  sponsorshipPackages: `*[_type == "sponsorshipPackage"] | order(order asc) {
    _id, name, icon, colour, featured, available, currentSponsor,
    description, priceNote, benefits, order
  }`,
}

function correctSettings(data: any) {
  const postcode = String(data?.postcode || '').trim().toUpperCase()
  return postcode === 'GL5 2SH' || postcode === 'GL52SH'
    ? { ...data, postcode: 'GL5 2SD' }
    : data
}

function mergeFixtures(live: any[], manual: any[]) {
  const combined = [...(live || []), ...(manual || [])]
  return combined.filter((fixture: any, index: number, all: any[]) =>
    all.findIndex((candidate: any) =>
      candidate?._id === fixture?._id ||
      (
        candidate?.date === fixture?.date &&
        String(candidate?.team || '').toLowerCase() === String(fixture?.team || '').toLowerCase() &&
        String(candidate?.opponent || '').toLowerCase() === String(fixture?.opponent || '').toLowerCase()
      )
    ) === index
  )
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || ''

  try {
    if (type === 'teams') {
      const [players, staff, fixtures, settings] = await Promise.all([
        client.fetch(playersQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(staffQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(fixturesQuery, {}, { next: { revalidate: 60 } }),
        client.fetch(settingsQuery, {}, { next: { revalidate: 60 } }),
      ])
      return NextResponse.json(
        { players, staff, fixtures, settings: correctSettings(settings) },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
      )
    }

    if (type === 'player') {
      const id = request.nextUrl.searchParams.get('id') || ''
      if (!id) return NextResponse.json({ error: 'Player id is required' }, { status: 400 })
      const player = await freshClient.fetch(
        `*[_type == "player" && active == true && (_id == $id || name == $id)][0] {
          _id, name, squadNumber, position, team, active, order,
          "imageUrl": coalesce(photo.asset->url, image.asset->url), bio,
          sponsorName, sponsorUrl, sponsorMessage,
          "sponsorLogoUrl": sponsorLogo.asset->url
        }`,
        { id },
        { cache: 'no-store' }
      )
      return NextResponse.json(player, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
    }

    if (type === 'fixtures') {
      const manualFixtures = await freshClient.fetch(fixturesQuery, {}, { cache: 'no-store' })
      let liveFirstXi: any[] = []

      try {
        const fullTimeUrl = new URL('/api/full-time', request.nextUrl.origin)
        fullTimeUrl.searchParams.set('team', 'First XI')
        fullTimeUrl.searchParams.set('widget', '969980533')
        fullTimeUrl.searchParams.set('division', '320568525')
        fullTimeUrl.searchParams.set('kind', 'matches')

        const response = await fetch(fullTimeUrl, { cache: 'no-store' })
        if (response.ok) {
          const payload = await response.json()
          liveFirstXi = Array.isArray(payload?.matches) ? payload.matches : []
        }
      } catch (error) {
        console.error('Unable to merge live Full-Time fixtures into content feed:', error)
      }

      return NextResponse.json(
        mergeFixtures(liveFirstXi, manualFixtures || []),
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    const query = queries[type]
    if (!query) return NextResponse.json({ error: 'Unknown content type' }, { status: 400 })

    if (type === 'settings' || type === 'players' || type === 'staff' || type === 'programmes' || type === 'matchReports' || type === 'news') {
      const data = await freshClient.fetch(query, {}, { cache: 'no-store' })
      return NextResponse.json(
        type === 'settings' ? correctSettings(data) : data,
        { headers: { 'Cache-Control': 'no-store, max-age=0' } }
      )
    }

    const data = await client.fetch(query, {}, { next: { revalidate: 60 } })
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (error) {
    console.error(`Failed to load Sanity content: ${type}`, error)
    return NextResponse.json(
      { error: 'Content is temporarily unavailable' },
      { status: 502, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
