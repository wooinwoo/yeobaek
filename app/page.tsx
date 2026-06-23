import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import {
  ClipboardCheck,
  Scale,
  HeartHandshake,
  BookOpen,
  Banknote,
  MessagesSquare,
  Calculator,
  FileText,
  Users,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  { href: "/family-guide", icon: ClipboardCheck, title: "유족 길잡이", desc: "사망일만 입력하면 무엇을 언제까지(D-day) 해야 하는지 진행상황과 함께 안내합니다." },
  { href: "/debt-simulator", icon: Scale, title: "빚 상속 진단", desc: "가족 구성을 입력하면 한정승인·상속포기 조합을 자동으로 알려드립니다." },
  { href: "/inheritance", icon: Users, title: "상속 가이드", desc: "상속 순위·법정상속분·유류분·등기까지, 누가 얼마나 받는지 정리." },
  { href: "/inheritance-tax", icon: Calculator, title: "상속세 계산기", desc: "재산·가족 구성을 입력하면 예상 상속세를 바로 가늠해 드립니다." },
  { href: "/obituary", icon: FileText, title: "부고 문자 생성기", desc: "빈칸만 채우면 단정한 부고 문구를 만들어 바로 복사할 수 있어요." },
  { href: "/etiquette", icon: HeartHandshake, title: "조문 예절", desc: "절은 몇 번, 봉투엔 뭐라 쓰는지, 막상 가면 헷갈리는 것들을 정리했어요." },
  { href: "/terms", icon: BookOpen, title: "용어 사전", desc: "장지·봉안당·발인… 낯선 장례 용어를 쉽게 풀어드립니다." },
  { href: "/support", icon: Banknote, title: "지원금", desc: "국민연금 사망일시금·장제급여 등 받을 수 있는 지원을 안내합니다." },
  { href: "/community", icon: MessagesSquare, title: "커뮤니티", desc: "먼저 같은 길을 지나온 이들의 경험과 위로. 익명으로 조용히." },
];

export default function Home() {
  return (
    <>
      {/* 히어로 */}
      <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="동틀 녘 고요한 호수"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-65"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/75 via-surface/55 to-surface" />
          <div className="absolute inset-0 bg-surface/25" />
        </div>
        <Reveal className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <h1 className="font-serif text-[34px] md:text-6xl font-semibold text-on-surface tracking-tight mb-7 leading-[1.25] text-balance break-keep">
            혼자 감당하지<br className="sm:hidden" /> 않아도 됩니다.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant mb-10 max-w-xl mx-auto leading-relaxed">
            남겨진 슬픔과 복잡한 절차들 속에서, 잠시 쉴 수 있는 여백이 되어드리겠습니다.
          </p>
          <Link
            href="/family-guide"
            className="group inline-flex items-center gap-2 bg-primary-container text-on-primary px-8 py-4 rounded-full font-semibold text-sm shadow-[0_10px_30px_rgba(120,82,60,0.25)] transition-colors duration-200 hover:bg-primary hover:shadow-[0_16px_36px_rgba(120,82,60,0.32)] motion-safe:transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.98]"
          >
            지금 필요한 도움 받기
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>
        </Reveal>
      </section>

      {/* 정서 한 줄 */}
      <section className="py-20 px-6">
        <Reveal className="max-w-2xl mx-auto text-center">
          <p className="font-serif text-2xl md:text-3xl text-secondary leading-relaxed">
            “충분히 슬퍼할 시간조차 허락되지 않는 현실.
            <br />
            우리는 당신이 마주한 막막함을 이해합니다.”
          </p>
        </Reveal>
      </section>

      {/* 여백이 하는 일 */}
      <section className="py-16 px-6">
        <div className="max-w-[1120px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-sm font-semibold tracking-widest uppercase text-secondary mb-3">
              여백이 하는 일
            </p>
            <h2 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface leading-snug">
              막막한 순간에 필요한 건,
              <br />
              정확한 다음 한 걸음.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.href} delay={(i % 3) * 80}>
                <Link
                  href={f.href}
                  className="group block h-full bg-surface-container-lowest rounded-3xl p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)] transition-shadow hover:shadow-[0_18px_40px_-14px_rgba(120,82,60,0.22)] motion-safe:transition-all motion-safe:hover:-translate-y-1 motion-reduce:transition-shadow"
                >
                  <f.icon className="w-8 h-8 text-primary mb-4" strokeWidth={1.6} />
                  <h3 className="font-serif text-xl font-semibold text-on-surface mb-2">{f.title}</h3>
                  <p className="text-on-surface-variant text-[15px] leading-relaxed mb-4">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    바로가기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 빚 상속 */}
      <section className="py-20 px-6 bg-surface-container">
        <Reveal className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface mb-5 leading-snug">
              뜻밖의 빚,
              <br />
              물려받지 마세요.
            </h2>
            <p className="text-lg text-on-surface-variant mb-7 leading-relaxed">
              슬픔을 추스를 새도 없이 다가오는 상속의 문제. 복잡한 빚 상속 진단과 법률 절차를 알기 쉽게 안내해
              드립니다. 당신의 권리를 지키는 첫 걸음을 함께합니다.
            </p>
            <Link
              href="/debt-simulator"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
            >
              빚 상속 진단 시작하기 <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)]">
            <Scale className="w-9 h-9 text-primary-container mb-4" strokeWidth={1.5} />
            <h3 className="font-serif text-2xl font-semibold text-on-surface mb-2">상속포기 / 한정승인</h3>
            <p className="text-on-surface-variant leading-relaxed">
              3개월이라는 짧은 시간. 어떤 선택이 나에게 맞는지 안전하게 확인하세요.
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center">
        <Reveal>
          <h2 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface mb-8">
            막막한 순간, 여백이 함께 걷겠습니다.
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/family-guide"
              className="bg-primary-container text-on-primary px-8 py-4 rounded-full font-semibold text-sm transition-colors duration-200 hover:bg-primary motion-safe:transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
            >
              유족 길잡이 보기
            </Link>
            <Link
              href="/etiquette"
              className="border border-outline text-primary px-8 py-4 rounded-full font-semibold text-sm transition-colors duration-200 hover:bg-surface-container motion-safe:transition-all motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.98]"
            >
              조문 예절 알아보기
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
