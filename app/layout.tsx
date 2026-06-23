import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeobaek.vercel.app";
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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "여백",
    title: "여백, 혼자 감당하지 않아도 됩니다",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "여백, 혼자 감당하지 않아도 됩니다",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#fbf6ef",
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
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface text-on-surface">
        <JsonLd data={websiteJsonLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
