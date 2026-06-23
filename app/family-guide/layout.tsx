import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "유족 길잡이",
  description: "사망일을 입력하면 무엇을 언제까지 해야 하는지 D-day와 함께 단계별로 안내합니다.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
