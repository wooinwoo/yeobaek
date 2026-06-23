import { ImageResponse } from "next/og";

export const alt = "여백, 혼자 감당하지 않아도 됩니다";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BRAND = "여백";
const TITLE = "혼자 감당하지 않아도 됩니다";
const SUB = "유족 길잡이 · 사후 절차 안내";

// satori는 woff2를 못 다룬다. Google Fonts에서 TTF/WOFF를 받아 시그니처를 검증하고,
// 실패하면 null을 반환해 영문 폴백으로 렌더(빌드가 절대 깨지지 않도록).
async function loadKoreanFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const api = `https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700&text=${encodeURIComponent(text)}`;
    const css = await (
      await fetch(api, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 6.1; rv:6.0) Gecko/20110814 Firefox/6.0" },
      })
    ).text();
    const urls = [...css.matchAll(/url\((https:\/\/[^)]+)\)/g)].map((m) => m[1]);
    const fontUrl = urls.find((u) => u.endsWith(".ttf")) ?? urls.find((u) => u.endsWith(".woff")) ?? urls[0];
    if (!fontUrl) return null;
    const buf = await (await fetch(fontUrl)).arrayBuffer();
    const s = new Uint8Array(buf.slice(0, 4));
    const tag = String.fromCharCode(s[0], s[1], s[2], s[3]);
    const valid =
      (s[0] === 0 && s[1] === 1 && s[2] === 0 && s[3] === 0) || // TTF
      tag === "OTTO" || tag === "true" || tag === "ttcf" || tag === "wOFF"; // OTF/TTF/WOFF
    return valid ? buf : null;
  } catch {
    return null;
  }
}

export default async function Og() {
  const font = await loadKoreanFont(BRAND + TITLE + SUB + "여백");
  const ko = !!font;

  const brand = ko ? BRAND : "yeobaek";
  const title = ko ? TITLE : "You are not alone in this.";
  const sub = ko ? SUB : "A step-by-step guide for the bereaved";
  const foot = ko ? "장례 · 행정 · 상속 · 조문까지 한 걸음씩" : "funeral · paperwork · inheritance · condolence";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fdf8f2 0%, #f5ebdf 55%, #ece0d2 100%)",
          padding: "72px 80px",
          fontFamily: ko ? "Noto Serif KR" : "sans-serif",
          color: "#3e352d",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#b97a66",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 22, height: 22, borderRadius: 999, background: "#f0d9b5" }} />
          </div>
          <div style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1 }}>{brand}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.25, letterSpacing: -2 }}>{title}</div>
          <div style={{ fontSize: 34, color: "#7a6e62", fontWeight: 500 }}>{sub}</div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 64, height: 6, borderRadius: 999, background: "#b97a66" }} />
          <div style={{ fontSize: 24, color: "#a8998a" }}>{foot}</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: ko ? [{ name: "Noto Serif KR", data: font!, weight: 700, style: "normal" }] : [],
    },
  );
}
