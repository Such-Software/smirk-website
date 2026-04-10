import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Smirk Wallet";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          backgroundColor: "#0a0a0a",
          gap: "24px",
        }}
      >
        {/* Smirk emoji as placeholder for logo */}
        <div style={{ fontSize: 120, display: "flex" }}>😏</div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#fbeb0a",
            display: "flex",
          }}
        >
          Smirk Wallet
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a1a1aa",
            display: "flex",
          }}
        >
          BTC • LTC • XMR • WOW • GRIN
        </div>
        <div
          style={{
            fontSize: 22,
            color: "#71717a",
            display: "flex",
          }}
        >
          Multi-coin crypto wallet & tipping extension
        </div>
      </div>
    ),
    { ...size }
  );
}
