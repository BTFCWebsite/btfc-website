export const revalidate = 300

const MATCH_SHIRTS = {
  juniorHome: {
    url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-championship-viii-home-shirt-jnr',
    fallbackName: 'Championship VIII Home Shirt JNR',
  },
  seniorHome: {
    url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-championship-viii-home-shirt-snr',
    fallbackName: 'Championship VIII Home Shirt SNR',
  },
  juniorAway: {
    url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-championship-viii-away-shirt-jnr',
    fallbackName: 'Championship VIII Away Shirt JNR',
  },
  seniorAway: {
    url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-championship-viii-away-shirt-snr',
    fallbackName: 'Championship VIII Away Shirt SNR',
  },
} as const

type ShopProduct = {
  name: string
  price: string
  brand: string
  url: string
  image?: string
}

type ShopCategory = {
  title: string
  icon: string
  products: ShopProduct[]
}

function absoluteBatemansImage(value?: string | null) {
  if (!value) return undefined
  if (value.startsWith('//')) return `https:${value}`
  if (value.startsWith('/')) return `https://www.batemanssports.co.uk${value}`
  return value
}

function formatPrice(value: unknown) {
  const pennies = Number(value)
  return Number.isFinite(pennies) && pennies > 0 ? `£${(pennies / 100).toFixed(2)}` : undefined
}

async function getBatemansProduct(url: string, fallbackName: string): Promise<ShopProduct> {
  const fallback: ShopProduct = {
    name: fallbackName,
    price: 'View price',
    brand: 'Joma',
    url,
  }

  try {
    const response = await fetch(`${url}.js`, {
      next: { revalidate: 300 },
      headers: { Accept: 'application/json' },
    })

    if (response.ok) {
      const product = await response.json()
      const image = absoluteBatemansImage(product?.featured_image || product?.images?.[0])
      return {
        ...fallback,
        name: String(product?.title || fallback.name),
        price: formatPrice(product?.price) || fallback.price,
        brand: String(product?.vendor || fallback.brand),
        image,
      }
    }
  } catch {
    // Try the product page metadata below.
  }

  try {
    const response = await fetch(url, { next: { revalidate: 300 } })
    if (!response.ok) return fallback

    const html = await response.text()
    const image = absoluteBatemansImage(
      html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)?.[1]
    )
    const price = html.match(/<meta[^>]+property=["']product:price:amount["'][^>]+content=["']([^"']+)/i)?.[1]

    return {
      ...fallback,
      price: price && Number.isFinite(Number(price)) ? `£${Number(price).toFixed(2)}` : fallback.price,
      image,
    }
  } catch {
    return fallback
  }
}

export default async function ShopPage() {
  const collectionUrl = 'https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc'
  const [juniorHomeShirt, seniorHomeShirt, juniorAwayShirt, seniorAwayShirt] = await Promise.all([
    getBatemansProduct(MATCH_SHIRTS.juniorHome.url, MATCH_SHIRTS.juniorHome.fallbackName),
    getBatemansProduct(MATCH_SHIRTS.seniorHome.url, MATCH_SHIRTS.seniorHome.fallbackName),
    getBatemansProduct(MATCH_SHIRTS.juniorAway.url, MATCH_SHIRTS.juniorAway.fallbackName),
    getBatemansProduct(MATCH_SHIRTS.seniorAway.url, MATCH_SHIRTS.seniorAway.fallbackName),
  ])

  const categories: ShopCategory[] = [
    {
      title: 'Matchday Kit',
      icon: '⚽',
      products: [
        juniorHomeShirt,
        seniorHomeShirt,
        juniorAwayShirt,
        seniorAwayShirt,
      ],
    },
    {
      title: 'Players Training',
      icon: '🏃',
      products: [
        { name: 'Players Combi Training Tee', price: '£13.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-combi-s-s-training-tee-royal-royal-019965', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722689852_019965_ROYAL_1.jpg?v=1730903646&width=533' },
        { name: 'Players Olimpiada ½ Zip Top', price: 'From £29.50', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-olimpiada-zip-top-royal-019966', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722690017_019966_ROYAL_3.jpg?v=1730903645&width=533' },
        { name: 'Players Olimpiada Pants', price: '£29.50', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-olimpiada-pants-black-black-019967', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722692095_019967_BLACK_3.jpg?v=1730903660&width=533' },
        { name: 'Players Hobby II Polo Shirt', price: '£25.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-hobby-ii-polo-shirt-royal-white-royal-white-019969', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722694669_019969_ROYALWHITE_1.jpg?v=1730903675&width=533' },
        { name: 'Players Cairo II Sweatshirt', price: '£25.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-cairo-ii-sweatshirt-royal-royal-019968', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722694518_019968_ROYAL_1.jpg?v=1730903665&width=533' },
      ],
    },
    {
      title: 'Managers Range',
      icon: '🧥',
      products: [
        { name: 'Managers Combi Training Tee', price: '£13.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-managers-combi-training-tee-black-black-019970', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722694806_019970_BLACK_1.jpg?v=1730903682&width=533' },
        { name: 'Managers Olimpiada ½ Zip Top', price: 'From £29.50', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-managers-olimpiada-zip-top-black-black-019971', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722690382_019971_BLACK_3.jpg?v=1730903664&width=533' },
        { name: 'Managers Olimpiada Pants', price: '£29.50', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-managers-olimpiada-pants-black-royal-black-royal-019972', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722693548_019972_BLACKROYAL_1.jpg?v=1730903669&width=533' },
        { name: 'Managers Urban V Gilet', price: '£49.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-managers-urban-v-gilet-black-black-019973', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722765655_019973_BLACK_1.jpg?v=1730903681&width=533' },
        { name: 'Managers Trivor Winter Bench Jacket', price: '£60.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-managers-trivor-winter-bench-jacket-black-black-019974', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722694806_019970_BLACK_1.jpg?v=1730903682&width=533' },
      ],
    },
    {
      title: 'Bags',
      icon: '🎒',
      products: [
        { name: 'Estadio III Backpack', price: '£21.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-estadio-iii-backpack-royal-019975', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722857897_019975_product_image.jpg?v=1730903691&width=533' },
        { name: 'Training II Players Bag', price: '£31.00', brand: 'Joma', url: 'https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-training-ii-players-bag-royal-019976', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722853248_019976_product_image.jpg?v=1730903684&width=533' },
      ],
    },
    {
      title: 'Headwear & Accessories',
      icon: '🧢',
      products: [
        { name: 'Stadium Scarf', price: '£12.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-stadium-scarf-010211', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1656941756_010211_ROYAL_1.jpg?v=1718725467&width=533' },
        { name: 'Beanie Hat', price: '£8.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-beanie-hat-010209', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1656933856_010209_NAVY_1.jpg?v=1718725450&width=533' },
        { name: 'Snowstar Bobble Hat', price: '£10.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-bobble-hat-016866', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1656931777_016866_BLUE_1.jpg?v=1718725475&width=533' },
        { name: 'Striped Fan Bobble Hat', price: '£10.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-striped-fan-bobble-hat', image: 'https://www.batemanssports.co.uk/cdn/shop/files/brimscombeandthruppfcstripedfanbobblehatnew.jpg?v=1741104961' },
        { name: 'Snapback Trucker Cap', price: '£10.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-snapback-truker-cap-royal-white-019977', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722765961_019977_product_image.jpg?v=1730903688&width=533' },
        { name: 'Ultimate 5-Panel Cap', price: '£10.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-ultimate-5-panel-cap-royal-019978', image: 'https://www.batemanssports.co.uk/cdn/shop/files/1722853527_019978_product_image.jpg?v=1730903690&width=533' },
        { name: 'BTFC Sliders', price: '£15.00', brand: 'Batemans Sports', url: 'https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-sliders', image: 'https://www.batemanssports.co.uk/cdn/shop/files/jc092_navy_ft2.jpg?v=1777295455&width=533' },
      ],
    },
  ]

  return (
    <main style={{ background: '#F2F2F2', minHeight: '100vh', padding: '52px 24px 80px' }}>
      <section style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ background: '#041B5F', borderRadius: 12, padding: '34px 38px', marginBottom: 48, display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
          <img src="/branding/crest.png" alt="BTFC" style={{ width: 74, height: 74, borderRadius: '50%', border: '2px solid #fff' }} />
          <div style={{ flex: 1, minWidth: 260 }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: '#fff' }}>Official BTFC Merchandise</h2>
            <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,.72)', lineHeight: 1.6, fontSize: 13 }}>Powered by Batemans Sports. All items are made to order with the official BTFC badge.</p>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)' }}>Please allow 3-4 weeks for delivery. Badged or sponsor-logo items are non-returnable.</div>
          </div>
          <a href={collectionUrl} target="_blank" rel="noopener" style={{ background: '#1149D8', color: '#fff', padding: '14px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 800, textTransform: 'uppercase', fontSize: 13 }}>Full Shop</a>
        </div>

        {categories.map((cat) => (
          <div key={cat.title} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>{cat.icon}</span>
              <h2 style={{ fontWeight: 800, fontSize: 28, color: '#041B5F', margin: 0 }}>{cat.title}</h2>
              <div style={{ flex: 1, height: 2, background: '#E5E7EB', marginLeft: 8 }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 18 }}>
              {cat.products.map((p) => (
                <a key={p.name} href={p.url} target="_blank" rel="noopener"
                  style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ background: '#F9FAFB', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ textAlign: 'center', color: '#6B7280', fontSize: 12, fontWeight: 700 }}>View product image on Batemans</div>
                    )}
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#1149D8', textTransform: 'uppercase', marginBottom: 6 }}>{p.brand}</div>
                    <div style={{ fontSize: 16, color: '#2D2D2D', fontWeight: 700, marginBottom: 10 }}>{p.name}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: 22, color: '#041B5F', fontWeight: 800 }}>{p.price}</div>
                      <span style={{ fontSize: 11, color: '#1149D8', fontWeight: 700, textTransform: 'uppercase' }}>View →</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}

        <div style={{ background: '#041B5F', borderRadius: 12, padding: '44px 40px', textAlign: 'center' }}>
          <h3 style={{ fontWeight: 800, fontSize: 36, color: '#fff', marginBottom: 8 }}>Support Your Club</h3>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>Every purchase helps support Brimscombe &amp; Thrupp FC.</p>
          <a href={collectionUrl} target="_blank" rel="noopener" style={{ background: '#1149D8', color: '#fff', padding: '16px 36px', borderRadius: 8, textDecoration: 'none', fontWeight: 800, fontSize: 15, textTransform: 'uppercase' }}>Visit Full Shop</a>
        </div>
      </section>
    </main>
  )
}
