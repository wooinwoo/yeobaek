"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { NAV } from "@/lib/nav";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 메뉴 열렸을 때 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // 모바일 메뉴 열렸을 때 Esc 로 닫기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-surface/95 backdrop-blur border-b border-outline-variant"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1184px] w-full flex items-center justify-between px-5 md:px-8 py-4">
        <Link
          href="/"
          className="font-serif text-[22px] font-semibold tracking-tight text-on-surface"
          onClick={() => setOpen(false)}
        >
          여백
        </Link>

        {/* 데스크탑 */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium pb-1 transition-colors ${
                  active
                    ? "text-on-surface border-b border-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            aria-label="통합 검색"
            aria-current={pathname === "/search" ? "page" : undefined}
            className={`inline-flex items-center justify-center w-9 h-9 rounded-full transition-colors ${
              pathname === "/search"
                ? "text-on-surface bg-surface-variant"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant"
            }`}
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          className="md:hidden text-on-surface p-1"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </button>
      </div>

      {/* 모바일 메뉴 */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-inverse-surface/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />
      <nav
        id="mobile-menu"
        aria-label="모바일 메뉴"
        className={`md:hidden fixed top-0 right-0 z-50 h-full w-[76%] max-w-[300px] bg-surface border-l border-outline-variant px-6 pt-20 pb-6 flex flex-col gap-1 transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          className="absolute top-5 right-5 text-3xl leading-none text-on-surface"
          aria-label="닫기"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        <Link
          href="/search"
          aria-current={pathname === "/search" ? "page" : undefined}
          onClick={() => setOpen(false)}
          className={`flex items-center gap-2 py-4 px-2 text-[17px] font-semibold border-b border-surface-container-high ${
            pathname === "/search" ? "text-primary" : "text-on-surface"
          }`}
        >
          <Search className="w-5 h-5" aria-hidden="true" />
          통합 검색
        </Link>
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={`py-4 px-2 text-[17px] font-semibold border-b border-surface-container-high ${
                active ? "text-primary" : "text-on-surface"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
