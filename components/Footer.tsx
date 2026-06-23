import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-low py-20 px-5 md:px-8 flex flex-col items-center gap-4 text-center">
      <Link href="/" className="flex items-center gap-2 font-serif text-2xl font-semibold text-primary">
        <svg width="24" height="24" viewBox="0 0 48 48" aria-hidden="true">
          <rect width="48" height="48" rx="13" fill="#b97a66" />
          <path d="M24 10.5 a13.5 13.5 0 1 1 -9.3 3.7" fill="none" stroke="#fffbf6" strokeWidth="3" strokeLinecap="round" />
          <circle cx="24" cy="10.5" r="2.6" fill="#f0d9b5" />
        </svg>
        여백
      </Link>
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-on-surface-variant">
        <a href="tel:109" className="font-bold hover:text-primary transition-colors">
          자살예방상담 109
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          이용약관
        </a>
        <a href="#" className="hover:text-primary transition-colors">
          개인정보처리방침
        </a>
      </div>
      <p className="text-sm text-secondary max-w-prose">
        © 2026 여백(Yeobaek). 정보 제공 서비스이며 법률·세무 자문을 대체하지 않습니다.
      </p>
    </footer>
  );
}
