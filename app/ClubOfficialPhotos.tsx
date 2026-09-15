'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'vm0n9zl5',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
})

type ClubOfficial = {
  name?: string
  role?: string
  department?: string
  imageUrl?: string
}

const officialsQuery = `
*[_type == "clubOfficial" && active != false]
| order(displayOrder asc)
{
  name,
  role,
  department,
  "imageUrl": coalesce(
    photo.asset->url,
    image.asset->url,
    picture.asset->url,
    headshot.asset->url,
    profileImage.asset->url,
    portrait.asset->url
  )
}
`

function normalise(value = '') {
  return String(value).trim().toLowerCase().replace(/\s+/g, ' ')
}

function createPhoto(official: ClubOfficial, size: number) {
  const img = document.createElement('img')
  img.src = official.imageUrl || ''
  img.alt = official.role ? `${official.name}, ${official.role}` : official.name || 'Club official'
  img.width = size
  img.height = size
  img.loading = 'lazy'
  img.decoding = 'async'
  img.style.width = `${size}px`
  img.style.height = `${size}px`
  img.style.objectFit = 'cover'
  img.style.objectPosition = 'center'
  img.style.borderRadius = '50%'
  img.style.flex = '0 0 auto'
  img.style.border = '2px solid #E5E7EB'
  img.dataset.clubOfficialPhoto = 'true'
  return img
}

export default function ClubOfficialPhotos() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/club' && pathname !== '/contact') return

    let cancelled = false
    let observer: MutationObserver | null = null

    async function enhanceOfficials() {
      let officials: ClubOfficial[] = []
      try {
        officials = await client.fetch<ClubOfficial[]>(officialsQuery)
      } catch (error) {
        console.error('Failed to load club official photos:', error)
        return
      }

      if (cancelled) return

      const byName = new Map(
        officials
          .filter(official => official.name && official.imageUrl)
          .map(official => [normalise(official.name), official])
      )

      function applyPhotos() {
        if (pathname === '/club') {
          document.querySelectorAll<HTMLTableRowElement>('.club-officials-table tbody tr').forEach(row => {
            if (row.dataset.officialPhotoEnhanced === 'true') return
            const details = row.querySelector<HTMLElement>('.club-official-details')
            if (!details) return

            const name = details.textContent?.trim() || ''
            const official = byName.get(normalise(name))
            if (!official?.imageUrl) return

            details.textContent = ''
            const wrapper = document.createElement('div')
            wrapper.style.display = 'flex'
            wrapper.style.alignItems = 'center'
            wrapper.style.gap = '12px'
            wrapper.appendChild(createPhoto(official, 48))

            const label = document.createElement('span')
            label.textContent = name
            wrapper.appendChild(label)
            details.appendChild(wrapper)
            row.dataset.officialPhotoEnhanced = 'true'
          })
        }

        if (pathname === '/contact') {
          const heading = Array.from(document.querySelectorAll('h2')).find(
            element => element.textContent?.trim() === 'Department Contacts'
          )
          const grid = heading?.parentElement?.querySelector('div[style*="display: grid"]')
          if (!grid) return

          Array.from(grid.children).forEach(child => {
            const card = child as HTMLElement
            if (card.dataset.officialPhotoEnhanced === 'true') return

            const nameLine = card.querySelector('p')
            const fullText = nameLine?.textContent?.trim() || ''
            const matched = officials.find(official => {
              const name = normalise(official.name)
              return Boolean(name && normalise(fullText).startsWith(name))
            })
            if (!matched?.imageUrl) return

            const h3 = card.querySelector('h3')
            if (!h3) return
            h3.insertAdjacentElement('beforebegin', createPhoto(matched, 72))
            const photo = h3.previousElementSibling as HTMLElement | null
            if (photo) photo.style.marginBottom = '14px'
            card.dataset.officialPhotoEnhanced = 'true'
          })
        }
      }

      applyPhotos()
      observer = new MutationObserver(applyPhotos)
      observer.observe(document.body, { childList: true, subtree: true })
    }

    enhanceOfficials()

    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [pathname])

  return null
}
