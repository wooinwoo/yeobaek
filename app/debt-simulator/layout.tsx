import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "빚 상속 진단",
  description: "가족 구성을 입력하면 단순승인·한정승인·상속포기 중 우리 가족에 맞는 선택을 알려드립니다.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
