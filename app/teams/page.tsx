```tsx
'use client'

export default function TeamsPage() {
  const teams = [
    {
      title: "First Team",
      league: "Hellenic League Premier Division",
      manager: "First Team Management",
      image: "/teams/first-team.jpg",
      description:
        "Competing at Step 5 of the National League System, the First Team represents the highest level of football at Brimscombe & Thrupp FC.",
      accent: "#1149D8",
    },
    {
      title: "Reserve Team",
      league: "Stroud & District Football League",
      manager: "Reserve Team Management",
      image: "/teams/reserves.jpg",
      description:
        "Our Reserve Team provides a vital pathway between youth and senior football whilst competing strongly every week.",
      accent: "#1149D8",
    },
    {
      title: "Under 17s",
      league: "Gloucestershire Youth Football",
      manager: "U17 Management",
      image: "/teams/u17.jpg",
      description:
        "The new Under 17s side continues the club’s commitment to youth development and creating the next generation of BTFC players.",
      accent: "#1149D8",
    },
  ]

  return (
    <main
      style={{
        background: "#F2F2F2",
        minHeight: "100vh",
        padding: "96px 24px 80px",
      }}
    >
      <section style={{ maxWidth: 1240, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h1
            style={{
              fontSize: 54,
              fontWeight: 900,
              color: "#041B5F",
              marginBottom: 10,
              lineHeight: 1,
            }}
          >
            Teams
          </h1>

          <p
            style={{
              color: "#6B7280",
              fontSize: 16,
              maxWidth: 700,
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            From senior football through to youth development, Brimscombe &
            Thrupp FC continues to provide competitive football and a pathway
            for players across the club.
          </p>

          <div
            style={{
              width: 60,
              height: 4,
              background: "#1149D8",
              margin: "18px auto 0",
              borderRadius: 2,
            }}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
            gap: 28,
          }}
        >
          {teams.map((team) => (
            <div
              key={team.title}
              style={{
                background: "#041B5F",
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 18px 40px rgba(0,0,0,.12)",
                border: "1px solid rgba(255,255,255,.06)",
                transition: "all .25s ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  height: 240,
                  overflow: "hidden",
                  background:
                    "linear-gradient(135deg,#041B5F 0%, #1149D8 100%)",
                }}
              >
                <img
                  src={team.image}
                  alt={team.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    opacity: 0.82,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(4,27,95,.95), rgba(4,27,95,.25))",
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 24,
                    left: 24,
                    right: 24,
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      background: "#1149D8",
                      color: "#fff",
                      padding: "6px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 800,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {team.league}
                  </div>

                  <h2
                    style={{
                      color: "#fff",
                      fontSize: 34,
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {team.title}
                  </h2>
                </div>
              </div>

              <div style={{ padding: 28 }}>
                <p
                  style={{
                    color: "rgba(255,255,255,.72)",
                    lineHeight: 1.7,
                    fontSize: 15,
                    marginTop: 0,
                    marginBottom: 24,
                  }}
                >
                  {team.description}
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 20,
                    marginBottom: 24,
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "rgba(255,255,255,.5)",
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        marginBottom: 6,
                        letterSpacing: ".08em",
                      }}
                    >
                      Management
                    </div>

                    <div
                      style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: 700,
                      }}
                    >
                      {team.manager}
                    </div>
                  </div>

                  <img
                    src="/crest.png"
                    alt="BTFC"
                    style={{
                      width: 58,
                      height: 58,
                    }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <a
                    href="/fixtures"
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: "#1149D8",
                      color: "#fff",
                      padding: "14px 18px",
                      borderRadius: 10,
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Fixtures
                  </a>

                  <a
                    href="/news"
                    style={{
                      flex: 1,
                      minWidth: 120,
                      background: "rgba(255,255,255,.08)",
                      border: "1px solid rgba(255,255,255,.1)",
                      color: "#fff",
                      padding: "14px 18px",
                      borderRadius: 10,
                      textDecoration: "none",
                      fontWeight: 800,
                      fontSize: 13,
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    Latest News
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 64,
            background: "#041B5F",
            borderRadius: 18,
            padding: "50px 40px",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#fff",
              marginBottom: 14,
            }}
          >
            Join The Club
          </h3>

          <p
            style={{
              maxWidth: 720,
              margin: "0 auto 28px",
              color: "rgba(255,255,255,.68)",
              lineHeight: 1.7,
              fontSize: 15,
            }}
          >
            Interested in joining Brimscombe & Thrupp FC as a player,
            volunteer, sponsor or supporter? Get in touch and become part of
            the club.
          </p>

          <a
            href="/contact"
            style={{
              display: "inline-block",
              background: "#1149D8",
              color: "#fff",
              padding: "16px 34px",
              borderRadius: 10,
              textDecoration: "none",
              fontWeight: 900,
              fontSize: 14,
              textTransform: "uppercase",
            }}
          >
            Contact The Club
          </a>
        </div>
      </section>
    </main>
  )
}
```
