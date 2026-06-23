"use client";

import { useEffect, useRef, useState } from "react";

export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVis(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    const t = setTimeout(() => setVis(true), 1500); // 안전 폴백
    return () => {
      io.disconnect();
      clearTimeout(t);
    };
  }, []);

  // 등장 지연은 CSS 변수(--reveal-delay)로 globals.css의 .reveal.in 애니메이션에 전달한다.
  // 인라인 style 대신 정적 Tailwind 임의 프로퍼티 클래스로 매핑해 RS 인라인 CSS 금지 룰을 지킨다.
  // (Tailwind JIT는 런타임 템플릿 문자열을 스캔하지 못하므로 클래스명은 정적이어야 한다.)
  const delayClass =
    delay >= 160 ? "[--reveal-delay:160ms]" : delay >= 80 ? "[--reveal-delay:80ms]" : "";

  return (
    <div ref={ref} className={`${className} reveal ${delayClass} ${vis ? "in" : ""}`}>
      {children}
    </div>
  );
}
