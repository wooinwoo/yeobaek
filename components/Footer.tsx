import Link from "next/link";

export default function Footer() {
  return (
    <footer className="px-5 md:px-8 border-t border-outline-variant">
      <div className="max-w-[1120px] mx-auto py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div>
          <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-on-surface">
            여백
          </Link>
          <p className="mt-2 text-sm text-secondary max-w-prose break-keep">
            정보 제공 서비스이며 법률·세무 자문을 대체하지 않습니다.
          </p>
        </div>
        <div className="flex flex-col gap-3 md:items-end text-sm">
          <p className="text-on-surface">
            마음이 힘들 땐 <a href="tel:109" className="font-semibold underline underline-offset-4">자살예방상담 109</a>
          </p>
          <div className="flex gap-5 text-on-surface-variant">
            <a href="#" className="hover:text-on-surface transition-colors">이용약관</a>
            <a href="#" className="hover:text-on-surface transition-colors">개인정보처리방침</a>
          </div>
          <p className="text-secondary">© 2026 여백</p>
        </div>
      </div>
    </footer>
  );
}
