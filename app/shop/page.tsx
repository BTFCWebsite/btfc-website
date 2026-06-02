export default function ShopPage() {
  const collectionUrl =
    "https://www.batemanssports.co.uk/collections/club-shops-football-brimscombe-thrupp-fc"

  const products = [
    ["🩴", "BRIMSCOMBE & THRUPP FC SLIDERS", "£15.00", "Batemans Sports", "https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-sliders"],
    ["👕", "TIGER VI HOME SHIRT JNR", "£26.00", "Joma", "https://www.batemanssports.co.uk/products/brimscombe-thrupp-fc-tiger-vi-hom-shirt-jnr"],
    ["👕", "TIGER VI HOME SHIRT SNR", "£29.50", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-senior-tiger-vi-home-shirt-white-royal-white-royal-019958"],
    ["👕", "SENIOR TOLETUM V AWAY SHIRT", "£28.00", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-senior-toletum-v-away-shirt-green-green-019961"],
    ["🏃", "PLAYERS COMBI S/S TRAINING TEE", "£13.00", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-combi-s-s-training-tee-royal-royal-019965"],
    ["🏃", "PLAYERS OLIMPIADA ½ ZIP TOP", "From £29.50", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-olimpiada-zip-top-royal-019966"],
    ["👖", "PLAYERS OLIMPIADA PANTS", "£29.50", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-olimpiada-pants-black-black-019967"],
    ["👕", "PLAYERS HOBBY II POLO SHIRT", "£25.00", "Joma", "https://www.batemanssports.co.uk/products/joma-brimscombe-thrupp-fc-players-hobby-ii-polo-shirt-royal-white-royal-white-019969"],
    ["👕", "PLAYERS CAIRO II SWEATSHIRT", "£25.00", "Joma", collectionUrl],
    ["🩳", "CHAMPIONSHIP VII BERMUDA SHORTS", "£21.50", "Joma", collectionUrl],
    ["🎒", "ESTADIO III BACKPACK", "£21.00", "Joma", collectionUrl],
    ["🎒", "TRAINING II PLAYERS BAG", "£31.00", "Joma", collectionUrl],
    ["🏃", "MANAGERS COMBI TRAINING TEE", "£13.00", "Joma", collectionUrl],
    ["🏃", "MANAGERS OLIMPIADA ½ ZIP TOP", "From £29.50", "Joma", collectionUrl],
    ["👖", "MANAGERS OLIMPIADA PANTS", "£29.50", "Joma", collectionUrl],
    ["🦺", "MANAGERS URBAN V GILET", "£49.00", "Joma", collectionUrl],
    ["🧥", "MANAGERS TRIVOR WINTER BENCH JACKET", "£60.00", "Joma", collectionUrl],
    ["🧢", "BEANIE HAT", "£8.00", "Batemans Sports", collectionUrl],
    ["🧢", "SNOWSTAR BOBBLE HAT", "£10.00", "Batemans Sports", collectionUrl],
    ["🧣", "STADIUM SCARF", "£12.00", "Batemans Sports", collectionUrl],
    ["🧢", "SNAPBACK TRUCKER CAP", "£10.00", "Batemans Sports", collectionUrl],
    ["🧢", "ULTIMATE 5-PANEL CAP", "£10.00", "Batemans Sports", collectionUrl],
    ["🧢", "STRIPED FAN BOBBLE HAT", "£10.00", "Batemans Sports", collectionUrl],
  ]

  return (
    <main style={{ padding: "100px 24px 70px", background: "#F2F2F2", minHeight: "100vh" }}>
      <section style={{ maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <h1 style={{ fontSize: 48, color: "#2D2D2D", marginBottom: 8, fontWeight: 950 }}>Club Shop</h1>
          <p style={{ color: "#6B7280" }}>Official Brimscombe & Thrupp FC merchandise</p>
          <div style={{ width: 52, height: 4, background: "#1149D8", margin: "12px auto 0" }} />
        </div>

        <div style={{ background: "#041B5F", borderRadius: 10, padding: "32px 36px", marginBottom: 36, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ fontSize: 50 }}>🛒</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 30, color: "#fff", marginBottom: 8 }}>Official BTFC Merchandise</h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,.7)", marginBottom: 14 }}>
              Shop the full Batemans Sports BTFC range. The collection currently lists 23 products.
            </p>
            <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 6, padding: "8px 14px", display: "inline-block", fontSize: 11, color: "rgba(255,255,255,.65)", marginBottom: 16 }}>
              ⓘ Please allow 3–4 weeks for delivery. Badged, initialled or sponsor-logo items are non-returnable.
            </div>
            <br />
            <a href={collectionUrl} target="_blank" style={{ display: "inline-block", background: "#1149D8", color: "#fff", padding: "13px 26px", borderRadius: 6, fontWeight: 900, textDecoration: "none", textTransform: "uppercase" }}>
              Visit Full Batemans Shop →
            </a>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 18 }}>
          {products.map(([icon, name, price, brand, url]) => (
            <a
              key={name}
              href={url}
              target="_blank"
              style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderRadius: 10,
                padding: 20,
                textDecoration: "none",
                boxShadow: "0 8px 22px rgba(0,0,0,.04)",
                display: "flex",
                flexDirection: "column",
                minHeight: 210,
              }}
            >
              <div style={{ fontSize: 44, marginBottom: 14 }}>{icon}</div>
              <div style={{ fontSize: 10, color: "#1149D8", fontWeight: 900, textTransform: "uppercase", marginBottom: 8 }}>{brand}</div>
              <h2 style={{ color: "#2D2D2D", fontSize: 17, lineHeight: 1.2, marginBottom: 10, fontWeight: 950 }}>{name}</h2>
              <div style={{ marginTop: "auto" }}>
                <div style={{ fontSize: 22, color: "#041B5F", fontWeight: 950, marginBottom: 10 }}>{price}</div>
                <div style={{ color: "#1149D8", fontWeight: 900, fontSize: 12, textTransform: "uppercase" }}>View Product →</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}
