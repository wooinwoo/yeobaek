import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "부고 문자 생성기",
  description: "빈칸만 채우면 단정한 부고 문구를 만들어 바로 복사할 수 있어요.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
