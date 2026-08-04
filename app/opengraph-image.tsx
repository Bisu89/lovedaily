import { ImageResponse } from "next/og"

export const alt =
  "LoveDaily — Everything you need to express love beautifully"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(to bottom right, #ffe4e6, #fff1f2 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 56 }}>❤️</span>
          <span style={{ fontSize: 44, fontWeight: 700, color: "#1c1917" }}>
            LoveDaily
          </span>
        </div>
        <div
          style={{
            display: "flex",
            maxWidth: 860,
            textAlign: "center",
            fontSize: 58,
            fontWeight: 600,
            color: "#1c1917",
            lineHeight: 1.2,
          }}
        >
          Everything you need to express love beautifully.
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 30,
            color: "#78716c",
          }}
        >
          AI-powered letters, messages & relationship ideas
        </div>
      </div>
    ),
    { ...size }
  )
}
