import {client} from '../lib/sanity.client'

export const revalidate = 60

const FALLBACK_MAP_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d737.3188611688546!2d-2.196166640744735!3d51.72201894723951!2m3!1f0!2f0!3f0!3m2!1i1024!1i768!4f13.1!3m3!1m2!1s0x48710c418313cc5f%3A0x6e0c3c089afa1c4d!2sBrimscombe%20and%20Thrupp%20Football%20Club!5e1!3m2!1sen!2suk!4v1780823602873!5m2!1sen!2suk'
const FALLBACK_MAP_URL = 'https://maps.google.com/?q=Brimscombe+and+Thrupp+FC,+London+Road,+Brimscombe,+GL5+2SD'
const FALLBACK_BUS_URL = 'https://www.stagecoachbus.com/routes/west/67/bussage-cashes-green/xsao067.o'
const FALLBACK_W3W = 'debit.query.solutions'
const FALLBACK_W3W_URL = 'https://what3words.com/debit.query.solutions'

const h2 = {fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#2D2D2D', margin: '0 0 6px', letterSpacing: '0.03em'} as const
const h3 = {fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 800, color: '#2D2D2D', margin: '0 0 10px', lineHeight: 1.1} as const
const body = {fontFamily: "'Montserrat', sans-serif", fontSize: 12, color: '#4B5563', lineHeight: 1.65, margin: 0} as const
const card = {background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8, padding: 24} as const

function parseFixtureValue(value: unknown) {
  if (!value || typeof value !== 'string') return null
  try { return JSON.parse(value) } catch { return {id: value} }
}

function programmeFixture(programme: any) {
  return parseFixtureValue(programme.fixture) || parseFixtureValue(programme.selectedFixture) || {
    id: programme.fullTimeFixtureId,
    date: programme.matchDate,
    opponent: programme.opponent,
  }
}

function normalise(value: string) {
  return String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

async function loadMatchdayData() {
  const settingsQuery = `*[_type == "siteSettings"] | order(_updatedAt desc)[0]`
  const manualFixturesQuery = `*[_type == "fixture"] | order(date asc) {
    _id, date, opponent, team, venue, competition, kickoff, btfcScore, opponentScore, played
  }`
  const programmesQuery = `*[_type == "matchdayProgramme" && published != false] | order(_updatedAt desc) {
    _id, fixture, selectedFixture, title, fullTimeFixtureId, team, opponent, matchDate,
    "programmeUrl": programmePdf.asset->url
  }`

  const [settingsResult, manualResult, programmeResult, fullTimeResult] = await Promise.allSettled([
    client.fetch(settingsQuery, {}, {next: {revalidate: 60}}),
    client.fetch(manualFixturesQuery, {}, {next: {revalidate: 60}}),
    client.fetch(programmesQuery, {}, {next: {revalidate: 60}}),
    fetch('https://btfc-website.vercel.app/api/full-time?kind=matches&team=First%20XI&widget=969980533&division=320568525', {
      next: {revalidate: 300},
    }).then(async response => response.ok ? response.json() : {matches: []}),
  ])

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value || {} : {}
  const manualFixtures = manualResult.status === 'fulfilled' && Array.isArray(manualResult.value) ? manualResult.value : []
  const programmes = programmeResult.status === 'fulfilled' && Array.isArray(programmeResult.value) ? programmeResult.value : []
  const fullTime = fullTimeResult.status === 'fulfilled' ? fullTimeResult.value : {matches: []}

  const today = new Date().toISOString().slice(0, 10)
  const allFixtures = [...(Array.isArray(fullTime?.matches) ? fullTime.matches : []), ...manualFixtures]
  const nextHomeGame = allFixtures
    .filter((fixture: any) => fixture.team === 'First XI' && fixture.venue === 'Home' && fixture.date >= today && !fixture.played)
    .filter((fixture: any, index: number, all: any[]) => all.findIndex(candidate =>
      candidate._id === fixture._id ||
      (candidate.date === fixture.date && normalise(candidate.opponent) === normalise(fixture.opponent))
    ) === index)
    .sort((a: any, b: any) => String(a.date).localeCompare(String(b.date)))[0] || null

  const programme = nextHomeGame ? programmes.find((item: any) => {
    const selected = programmeFixture(item)
    const nextId = String(nextHomeGame._id || '')
    const selectedId = String(selected?.id || '')
    return selectedId === nextId || selectedId === nextId.replace(/^full-time-/, '') ||
      (selected?.date === nextHomeGame.date && normalise(selected?.opponent) === normalise(nextHomeGame.opponent))
  }) || null : null

  return {settings, nextHomeGame, programme}
}

export default async function MatchdayPage() {
  const {settings, nextHomeGame, programme} = await loadMatchdayData()

  const groundName = settings.groundName || 'Brackenfern Meadow'
  const rawPostcode = String(settings.postcode || 'GL5 2SD').trim().toUpperCase()
  const postcode = rawPostcode === 'GL5 2SH' || rawPostcode === 'GL52SH' ? 'GL5 2SD' : rawPostcode
  const address = [groundName, settings.addressLine1 || 'London Road, Brimscombe', settings.addressLine2, postcode].filter(Boolean).join(' · ')
  const savedOpening = String(settings.turnstileOpening || '').trim()
  const turnstileOpening = !savedOpening || /^one hour before kick-?off$/i.test(savedOpening) ? 'Approximately 1½ hours before kick-off' : savedOpening

  const facilities = [
    {icon: '🕒', title: 'Turnstiles', text: `Turnstiles normally open ${turnstileOpening.toLowerCase()}.`},
    {icon: '🍺', title: 'Clubhouse Bar', text: settings.clubhouseInformation || settings.refreshmentsInformation || 'The clubhouse bar is open before, during and after the match. A warm welcome is extended to home and away supporters. Cash and card are accepted.'},
    {icon: '🍔', title: 'Food & Drink', text: settings.foodInformation || 'Hot food, snacks and drinks are available from the clubhouse, which opens from approximately one hour before kick-off.'},
    {icon: '♿', title: 'Accessibility', text: settings.accessibilityInformation || 'Wheelchair spaces are available in the main stand, with level access from the car park. Please contact the club in advance if you need assistance.'},
    {icon: '📋', title: 'Programme', text: settings.programmeInformation || 'The official digital matchday programme is available free on the website for First XI home matches.'},
    {icon: '🅿', title: 'Parking', text: settings.parkingInformation || 'Free parking is available in the main car park at the ground. Please follow matchday signage and steward instructions when the car park is busy.'},
    {icon: '🎫', title: 'Entrance Fees', text: settings.entranceFeesInformation || `League & Cup: Adult ${settings.admissionAdult || '£7'} · Concession (65+) ${settings.admissionConcession || '£5'} · Under 16 ${settings.admissionJunior || 'Free'}. Friendlies: ${settings.friendlyAdmission || '£3'} for all. Reserves and Under 17s fixtures are free admission for all supporters.`},
  ]

  const gettingHere = [
    {icon: '🚗', title: 'By Car', text: settings.byCarInformation || `${groundName} is on London Road, Brimscombe, ${postcode}. Free parking is available in the club car park at the ground.`, link: null},
    {icon: '🚌', title: 'By Bus', text: settings.byBusInformation || 'The number 67 bus runs from Stroud town centre to Brimscombe. Alight at the War Memorial stop on London Road, approximately a two-minute walk from the ground.', link: {label: 'View 67 Bus Timetable', url: settings.busTimetableUrl || FALLBACK_BUS_URL}},
    {icon: '🚆', title: 'By Train', text: settings.byTrainInformation || 'The nearest railway station is Stroud, served by GWR. From Stroud, take the number 67 bus or a taxi to the ground.', link: null},
  ]

  const fixtureDate = nextHomeGame?.date
    ? new Date(`${nextHomeGame.date}T12:00:00`).toLocaleDateString('en-GB', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
    : 'Fixture TBC'

  return (
    <main style={{background: '#F2F2F2', minHeight: '100vh', padding: '0 0 90px'}}>
      <section style={{maxWidth: 980, margin: '0 auto', padding: '52px 24px'}}>
        <div className="mobile-feature-card" style={{background: '#041B5F', borderRadius: 10, padding: '28px 30px', color: '#fff', marginBottom: 44, boxShadow: '0 12px 32px rgba(4,27,95,.18)'}}>
          <div style={{fontFamily: "'Montserrat', sans-serif", fontSize: 10, letterSpacing: '.14em', opacity: .65, textTransform: 'uppercase', marginBottom: 12}}>Your Matchday · Next Home Fixture</div>
          <div>
            <div style={{fontFamily: "'Montserrat', sans-serif", fontSize: 11, fontWeight: 800, color: '#93C5FD', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 6}}>{nextHomeGame?.competition || settings.seasonYear || 'First XI'}</div>
            <h1 style={{fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 800, margin: '0 0 10px', lineHeight: 1}}>{nextHomeGame ? `BTFC v ${nextHomeGame.opponent}` : 'Next home fixture to be confirmed'}</h1>
            <p style={{fontFamily: "'Montserrat', sans-serif", margin: 0, color: 'rgba(255,255,255,.76)', fontSize: 13, lineHeight: 1.7}}>📅 {fixtureDate} · ⏰ {nextHomeGame?.kickoff || 'TBC'} · 📍 {groundName}</p>
          </div>
          <div className="matchday-hero-actions" style={{display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', width: '100%', marginTop: 22}}>
            <div>
              {programme?.programmeUrl && (
                <a href={programme.programmeUrl} target="_blank" rel="noopener noreferrer" style={{background: '#1149D8', padding: '13px 22px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap'}}>📖 View Match Programme</a>
              )}
            </div>
            <a href="/programmes" style={{background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,255,255,.45)', padding: '12px 22px', borderRadius: 6, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 18, color: '#fff', textDecoration: 'none', whiteSpace: 'nowrap'}}>2026/27 Programme Archive</a>
          </div>
          <style>{`
            @media(max-width:768px) {
              .matchday-hero-actions { align-items: flex-start !important; flex-direction: column !important; }
            }
          `}</style>
        </div>

        <div className="mobile-card-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 52}}>
          {facilities.map(item => <div key={item.title} style={{...card, width: '100%', maxWidth: 360, margin: '0 auto'}}><div style={{fontSize: 24, marginBottom: 10}}>{item.icon}</div><h3 style={h3}>{item.title}</h3><p style={body}>{item.text}</p></div>)}
        </div>

        <div style={{marginBottom: 44}}>
          <h2 style={h2}>Getting Here</h2>
          <p style={{...body, color: '#6B7280', marginBottom: 12}}>{address}</p>
          <a href={settings.what3wordsUrl || FALLBACK_W3W_URL} target="_blank" rel="noopener noreferrer" style={{display: 'inline-flex', marginBottom: 24, padding: '9px 14px', borderRadius: 6, background: '#fff', border: '1px solid #D1D5DB', color: '#041B5F', fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 800, textDecoration: 'none'}}>/// {settings.what3words || FALLBACK_W3W}</a>
          <div style={{borderRadius: 8, overflow: 'hidden', marginBottom: 20, border: '1px solid #E5E7EB'}}><iframe src={settings.googleMapsEmbedUrl || FALLBACK_MAP_EMBED} width="100%" height="280" style={{border: 0, display: 'block'}} allowFullScreen loading="lazy" title={`${groundName} location`} /></div>
          <div className="mobile-card-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20}}>
            {gettingHere.map(item => <div key={item.title} style={{...card, width: '100%', maxWidth: 360, margin: '0 auto'}}><div style={{fontSize: 22, marginBottom: 8}}>{item.icon}</div><h3 style={h3}>{item.title}</h3><p style={{...body, marginBottom: item.link ? 10 : 0}}>{item.text}</p>{item.link && <a href={item.link.url} target="_blank" rel="noopener noreferrer" style={{fontFamily: "'Montserrat', sans-serif", fontSize: 12, fontWeight: 700, color: '#1149D8', textDecoration: 'none'}}>{item.link.label} →</a>}</div>)}
          </div>
        </div>

        <div style={{...card, background: '#041B5F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20}}>
          <div><h3 style={{...h3, color: '#fff', fontSize: 20, margin: '0 0 8px'}}>🏟 {groundName}</h3><p style={{...body, color: 'rgba(255,255,255,.7)', fontSize: 13}}>{address}</p></div>
          <a href={settings.googleMapsUrl || FALLBACK_MAP_URL} target="_blank" rel="noopener noreferrer" style={{background: '#1149D8', padding: '10px 20px', borderRadius: 6, color: '#fff', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: 16, textDecoration: 'none'}}>Open in Maps →</a>
        </div>
      </section>
    </main>
  )
}
