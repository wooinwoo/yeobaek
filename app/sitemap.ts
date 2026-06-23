import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yeobaek.vercel.app";

const ROUTES = [
  "", // 랜딩
  "family-guide",
  "debt-simulator",
  "inheritance",
  "inheritance-tax",
  "obituary",
  "etiquette",
  "terms",
  "support",
  "community",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    changeFrequency: path === "community" ? "daily" : "monthly",
    priority: path === "" ? 1 : path === "family-guide" ? 0.9 : 0.7,
  }));
}
