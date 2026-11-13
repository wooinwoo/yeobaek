import type { Metadata, Viewport } from "next";
import { Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

// 제목용 세리프는 빌드 때 받아 자체 호스팅한다. 한글 조각은 unicode-range로 필요한 것만 내려간다.
const notoSerifKr = Noto_Serif_KR({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  variable: "--font-noto-serif-kr",
});

// 본문 Pretendard는 쓰는 글자 조각만 받는 dynamic subset을 쓴다. @font-face 규칙은 app/pretendard.css에 있다.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeobaek.wooki.cc";
const DESCRIPTION =
  "사랑하는 사람을 떠나보낸 뒤, 무엇을 언제까지 해야 하는지 당신의 상황에 맞춰 한 걸음씩 안내하는 유족 길잡이. 장례·행정·보험·연금·상속·세금·조문예절까지.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "여백, 혼자 감당하지 않아도 됩니다",
    template: "%s · 여백",
  },
  description: DESCRIPTION,
  applicationName: "여백",
  keywords: [
    "유족 길잡이", "사후 절차", "장례 절차", "사망신고", "안심상속 원스톱",
    "상속포기", "한정승인", "상속세", "유류분", "조문 예절", "부고", "장제급여",
  ],
  authors: [{ name: "여백" }],
  category: "guide",
  // url·title·description을 비워 두면 Next가 각 페이지의 경로·제목·설명으로 채운다.
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "./",
    siteName: "여백",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  // "./"는 metadataBase와 현재 경로로 풀린다. 절대 주소로 두면 모든 하위 페이지가 홈을 canonical로 가리킨다.
  alternates: { canonical: "./" },
};

export const viewport: Viewport = {
  themeColor: "#f8f7f4",
  colorScheme: "light",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "여백",
  alternateName: "여백 유족 길잡이",
  url: SITE_URL,
  inLanguage: "ko-KR",
  description: DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: "여백",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`h-full antialiased ${notoSerifKr.variable}`}>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <JsonLd data={websiteJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
