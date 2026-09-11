'use client'

import { useEffect, useState } from 'react'
import { loadFullTimeWidgetTable, type FullTimeLeagueRow } from './lib/fulltime.browser'

const FIRST_TEAM_TABLE_WIDGET = '251176067'

function ordinal(position: number) {
  const remainder = position % 100
  if (remainder >= 11 && remainder <= 13) return `${position}th`

  if (position % 10 === 1) return `${position}st`
  if (position % 10 === 2) return `${position}nd`
  if (position % 10 === 3) return `${position}rd`
  return `${position}th`
}

function isBtfc(row: FullTimeLeagueRow) {
  const team = row.team.toLowerCase()
  return team.includes('brimscombe') && team.includes('thrupp')
}

export default function LeaguePosition({ fallback: _fallback }: { fallback?: string }) {
  const [position, setPosition] = useState('—')

  useEffect(() => {
    let active = true

    async function refreshPosition() {
      try {
        // Use exactly the same First XI Full-Time table source as the Matches page.
        const table = await loadFullTimeWidgetTable(FIRST_TEAM_TABLE_WIDGET, 18000)
        const row = table.find(isBtfc)

        if (active) setPosition(row?.position > 0 ? ordinal(row.position) : '—')
      } catch {
        // Never fall back to the manually published Sanity league position.
        if (active) setPosition('—')
      }
    }

    refreshPosition()
    return () => { active = false }
  }, [])

  return <>{position}</>
}
