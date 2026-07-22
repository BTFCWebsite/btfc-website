'use client'

import { useEffect, useState } from 'react'
import { getMatchFeeds } from './lib/sanity.client'

type LeagueRow = {
  position: number
  team: string
}

function ordinal(position: number) {
  const remainder = position % 100
  if (remainder >= 11 && remainder <= 13) return `${position}th`

  if (position % 10 === 1) return `${position}st`
  if (position % 10 === 2) return `${position}nd`
  if (position % 10 === 3) return `${position}rd`
  return `${position}th`
}

export default function LeaguePosition({ fallback }: { fallback: string }) {
  const [position, setPosition] = useState(fallback)

  useEffect(() => {
    let active = true

    async function refreshPosition() {
      try {
        const feeds = await getMatchFeeds()
        const firstTeamFeed = (feeds || []).find((feed: any) => {
          const team = String(feed?.team || '').toLowerCase().replace(/[^a-z0-9]/g, '')
          return team.includes('first') && feed?.snippet
        })
        const division = firstTeamFeed?.snippet?.match(/[?&]divisionseason=(\d+)/i)?.[1]
        if (!division) return

        const response = await fetch(`/api/full-time?kind=table&division=${division}&team=First+XI`)
        if (!response.ok) return

        const data = await response.json()
        const row = (data.table as LeagueRow[] | undefined)?.find(({ team }) =>
          team.toLowerCase().includes('brimscombe') && team.toLowerCase().includes('thrupp')
        )

        if (active && row?.position > 0) setPosition(ordinal(row.position))
      } catch {
        // Keep the published Sanity value when Full-Time is temporarily unavailable.
      }
    }

    refreshPosition()
    return () => { active = false }
  }, [])

  return <>{position}</>
}
