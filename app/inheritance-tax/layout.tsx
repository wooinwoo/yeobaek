import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "상속세 계산기",
  description: "재산과 가족 구성을 입력하면 예상 상속세를 간이 추정해 드립니다.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
