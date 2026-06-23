import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "용어 사전",
  description: "장례·상속·보험 용어 57개를 쉽게 풀어드립니다. 검색과 분류로 빠르게 찾으세요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
