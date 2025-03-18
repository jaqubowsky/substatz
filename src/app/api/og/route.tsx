import { LogoSection } from "@/lib/shared-image-components";
import { ImageResponse } from "@vercel/og";

export const runtime = "edge";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "64px",
              width: "100%",
              height: "100%",
              position: "relative",
            }}
          >
            {/* Enhanced gradient backgrounds */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "60%",
                height: "60%",
                background:
                  "radial-gradient(circle at top right, rgba(255, 100, 30, 0.25), rgba(255, 100, 30, 0))",
                filter: "blur(80px)",
                zIndex: 1,
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "50%",
                height: "50%",
                background:
                  "radial-gradient(circle at bottom left, rgba(255, 80, 0, 0.15), rgba(255, 80, 0, 0))",
                filter: "blur(100px)",
                zIndex: 1,
              }}
            />

            <div
              style={{
                display: "flex",
                marginBottom: "40px",
                zIndex: 2,
                position: "relative",
              }}
            >
              <LogoSection size="large" />
            </div>

            <div
              style={{
                display: "flex",
                position: "relative",
                zIndex: 2,
                marginTop: "auto",
                marginBottom: "auto",
                width: "100%",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxWidth: "55%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    fontSize: 80,
                    fontWeight: 800,
                    lineHeight: 1.1,
                    color: "#111",
                  }}
                >
                  <div style={{ display: "flex" }}>All your</div>
                  <div
                    style={{
                      display: "flex",
                      background: "linear-gradient(90deg, #FF4800, #FF7E30)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    subscriptions
                  </div>
                  <div style={{ display: "flex" }}>in one place</div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(0, 0, 0, 0.05)",
                  borderRadius: "12px",
                  padding: "24px",
                  gap: "16px",
                  boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.03)",
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#666",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ display: "flex" }}>Total Monthly</span>
                  <span
                    style={{
                      display: "flex",
                      fontSize: 24,
                      fontWeight: 700,
                      background: "linear-gradient(90deg, #FF4800, #FF7E30)",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    $44,97
                  </span>
                </div>

                <div
                  style={{
                    width: "220px",
                    height: "1px",
                    background: "rgba(0, 0, 0, 0.1)",
                  }}
                />

                {["Netflix", "Spotify", "Adobe"].map((sub, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: 14,
                      color: "#444",
                    }}
                  >
                    <span style={{ display: "flex" }}>{sub}</span>
                    <span style={{ display: "flex" }}>
                      ${i === 0 ? "19.99" : i === 1 ? "9.99" : "14.99"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                position: "relative",
                zIndex: 2,
                marginTop: "40px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(90deg, #FF4800, #FF7E30)",
                  borderRadius: "8px",
                  padding: "14px 28px",
                  color: "white",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                Start tracking today →
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response("Failed to generate image", { status: 500 });
  }
}
