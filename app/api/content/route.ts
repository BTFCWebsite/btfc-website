import { NextRequest, NextResponse } from 'next/server'
import { client } from '../../lib/sanity.client'

export const dynamic = 'force-dynamic'

const queries: Record<string, string> = {
  settings: `*[_type == "siteSettings"][0]`,
  fixtures: `*[_type == "fixture"] | order(date asc) {
    _id, date, opponent, team, venue, competition, kickoff,
    btfcScore, opponentScore, played
  }`,
  matchFeeds: `*[_type == "matchFeed" && active == true] | order(order asc) {
    team, snippet
  }`,
  players: `*[_type == "player" && active == true] | order(order asc, squadNumber asc) {
    _id, name, squadNumber, position, team, active, order,
    "imageUrl": image.asset->url, sponsorName,
    "sponsorLogoUrl": sponsorLogo.asset->url
  }`,
  staff: `*[_type == "teamStaff" && active == true] | order(order asc, name asc) {
    _id, name, role, team, active, order,
    "imageUrl": image.asset->url
  }`,
  news: `*[_type == "newsArticle"] | order(date desc) {
    _id, title, category, date, summary, body,
    "slug": slug.current, "imageUrl": image.asset->url
  }`,
  sponsors: `*[_type == "sponsor"] | order(order asc) {
    _id, name, tier, role, website, "logoUrl": logo.asset->url
  }`,
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get('type') || ''
  const query = queries[type]

  if (!query) {
    return NextResponse.json({ error: 'Unknown content type' }, { status: 400 })
  }

  try {
    const data = await client.fetch(query, {}, { cache: 'no-store' })
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    console.error(`Failed to load Sanity content: ${type}`, error)
    return NextResponse.json({ error: 'Content is temporarily unavailable' }, { status: 502 })
  }
}
