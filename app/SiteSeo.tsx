export default function SiteSeo() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: 'Brimscombe & Thrupp FC',
    alternateName: 'The Lilywhites',
    url: 'https://www.brimscombeandthruppfc.co.uk/',
    logo: 'https://www.brimscombeandthruppfc.co.uk/branding/crest.png',
    sport: 'Football',
    foundingDate: '1886',
    email: 'info@brimscombeandthruppfc.co.uk',
    telephone: '+44 7814 854108',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'London Road, Brimscombe',
      addressLocality: 'Stroud',
      postalCode: 'GL5 2SD',
      addressCountry: 'GB',
    },
    memberOf: {
      '@type': 'SportsOrganization',
      name: 'Hellenic League Division One',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
