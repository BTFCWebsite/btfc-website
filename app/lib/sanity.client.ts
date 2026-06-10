import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: undefined,
})

export async function getSiteSettings() {
  return client.fetch(
    `*[_type == "siteSettings"][0]`,
    {},
    { cache: 'no-store' }
  )
}

export async function getLatestNews() {
  return client.fetch(
    `*[_type == "fixture"] | order(date asc) {
      _id, title, category, date, summary,
      "imageUrl": image.asset->url
    }`,
    {},
    { cache: 'no-store' }
  )
}

export async function getNewsArticles() {
  return client.fetch(
   `*[_type == "newsArticle"] | order(date desc)[0...3] {
      _id, title, category, date, summary, body,
      "imageUrl": image.asset->url
    }`,
    {},
    { cache: 'no-store' }
  )
}

export async function getFixtures() {
  return client.fetch(
    `*[_type == "fixture"] | order(date asc) {
      _id, date, opponent, team, venue,
      competition, kickoff, btfcScore, opponentScore, played
    }`,
    {},
    { cache: 'no-store' }
  )
}

export async function getSponsors() {
  return client.fetch(
    `*[_type == "sponsor"] | order(order asc) {
      _id, name, role, website,
      "logoUrl": logo.asset->url
    }`,
    {},
    { cache: 'no-store' }
  )
}
