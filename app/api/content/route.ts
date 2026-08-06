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

const queries: Record<string, string> = {
  settings: `*[_type == "siteSettings"] | order(_updatedAt desc)[0]`,
  fixtures: `*[_type == "fixture"] | order(date asc) {
    _id, date, opponent, team, venue, competition, kickoff,
    btfcScore, opponentScore, played,
    "programmeUrl": programmePdf.asset->url
  }`,
  matchFeeds: `*[_type == "matchFeed" && active == true] | order(order asc) { team, snippet }`,
  players: `*[_type == "player" && active == true] | order(order asc, squadNumber asc) {
    _id, name, squadNumber, position, team, active, order,
    "imageUrl": coalesce(photo.asset->url, image.asset->url), bio,
    sponsorName, sponsorUrl, sponsorMessage,
    "sponsorLogoUrl": sponsorLogo.asset->url
  }`,
  staff: `*[_type == "teamStaff" && active == true] | order(order asc, name asc) {
    _id, name, role, team, active, order, "imageUrl": image.asset->url
  }`,
  news: `*[_type == "newsArticle"] | order(date desc) {
    _id, title, category, date, summary, body,
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

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || ''
  const query = queries[type]
  if (!query) return NextResponse.json({ error: 'Unknown content type' }, { status: 400 })

  try {
    if (type === 'settings' || type === 'players' || type === 'staff') {
      const data = await freshClient.fetch(query, {}, { cache: 'no-store' })

      if (type === 'settings') {
        const postcode = String(data?.postcode || '').trim().toUpperCase()
        const corrected = postcode === 'GL5 2SH' || postcode === 'GL52SH'
          ? { ...data, postcode: 'GL5 2SD' }
          : data
        return NextResponse.json(corrected, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
      }

      return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store, max-age=0' } })
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
