import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
})

export async function getSiteSettings() {
  return client.fetch(`*[_type == "siteSettings"][0]`)
}

export async function getLatestNews() {
  return client.fetch(`
    *[_type == "newsArticle"] | order(date desc)[0...3] {
      _id, title, category, date, summary,
      "imageUrl": image.asset->url
    }
  `)
}

export async function getNewsArticles() {
  return client.fetch(`
    *[_type == "newsArticle"] | order(date desc) {
      _id, title, category, date, summary, body,
      "imageUrl": image.asset->url
    }
  `)
}

export async function getFixtures() {
  return client.fetch(`
    *[_type == "fixture"] | order(date desc) {
      _id, date, opponent, team, venue,
      competition, kickoff, btfcScore, opponentScore, played
    }
  `)
}

export async function getSponsors() {
  return client.fetch(`
    *[_type == "sponsor"] | order(order asc) {
      _id, name, role, website,
      "logoUrl": logo.asset->url
    }
  `)
}
