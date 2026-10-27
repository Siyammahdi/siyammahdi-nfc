import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.name}, ${profile.role} in ${profile.city}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function getPortrait() {
  "use cache";
  const portrait = await readFile(path.join(process.cwd(), "assets/og-portrait.png"));
  return `data:image/png;base64,${portrait.toString("base64")}`;
}

export default async function OpengraphImage() {
  const src = await getPortrait();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0d0d0c",
          color: "#ece8df",
          padding: 72,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 640,
            height: 640,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(255,90,31,0.32), rgba(255,90,31,0) 65%)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, color: "#9a968c", letterSpacing: 3 }}>
            <div style={{ width: 12, height: 12, borderRadius: 99, background: "#ff5a1f" }} />
            {profile.cardId} · {profile.city.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 0.88, letterSpacing: -6, display: "flex", flexDirection: "column" }}>
              <span>{profile.firstName}</span>
              <span style={{ display: "flex" }}>
                {profile.lastName}
                <span style={{ color: "#ff5a1f" }}>.</span>
              </span>
            </div>
            <div style={{ marginTop: 28, fontSize: 30, color: "#9a968c", maxWidth: 620, lineHeight: 1.35 }}>
              Full-stack developer. Interface to infrastructure, then I keep it running.
            </div>
          </div>
        </div>
        <img src={src} alt="" width={470} height={487} style={{ position: "absolute", right: 40, bottom: 0 }} />
      </div>
    ),
    size,
  );
}
