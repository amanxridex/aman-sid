import { ImageResponse } from "next/og";

export const alt = "THE COZY THEORY — Stay Cozy, Stay You";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
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
          backgroundColor: "#121212",
          color: "#fffdf8",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Subtle decorative inner border */}
        <div
          style={{
            position: "absolute",
            inset: "20px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        />

        {/* Subtitle Pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#001540",
            }}
          />
          <span
            style={{
              fontSize: "18px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#a3a3a3",
            }}
          >
            STAY COZY, STAY YOU
          </span>
        </div>

        {/* Hero Brand Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 900,
            letterSpacing: "-0.03em",
            textTransform: "uppercase",
            marginBottom: "16px",
            textAlign: "center",
          }}
        >
          THE COZY THEORY
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "#d4d4d4",
            maxWidth: "850px",
            textAlign: "center",
            lineHeight: 1.4,
            marginBottom: "32px",
          }}
        >
          Handcrafted Stoneware Ceramics • Daily Tableware • Pure Washed Linen
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: "12px 28px",
            borderRadius: "6px",
            backgroundColor: "#001540",
            color: "#ffffff",
            fontSize: "16px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          thecozytheory.playstax.xyz
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
