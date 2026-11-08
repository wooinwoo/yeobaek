import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ArrowRight } from "lucide-react";

const FEATURES = [
  { href: "/family-guide", title: "유족 길잡이", desc: "사망일을 입력하면 언제까지 무엇을 해야 하는지 순서대로 알려드립니다." },
  { href: "/debt-simulator", title: "빚 상속 진단", desc: "가족 구성에 맞는 한정승인·상속포기 조합을 확인합니다." },
  { href: "/inheritance", title: "상속 가이드", desc: "상속 순위와 법정상속분, 유류분, 등기까지 정리했습니다." },
  { href: "/inheritance-tax", title: "상속세 계산기", desc: "재산과 가족 구성으로 예상 상속세를 가늠합니다." },
  { href: "/obituary", title: "부고 문자", desc: "빈칸을 채우면 단정한 부고 문구를 만들어 드립니다." },
  { href: "/etiquette", title: "조문 예절", desc: "절하는 횟수, 봉투 쓰는 법처럼 막상 헷갈리는 것들." },
  { href: "/support", title: "지원금", desc: "사망일시금·장제급여 등 받을 수 있는 지원을 안내합니다." },
  { href: "/terms", title: "용어 사전", desc: "장지, 봉안당, 발인 같은 낯선 말을 쉽게 풀었습니다." },
  { href: "/community", title: "커뮤니티", desc: "먼저 같은 길을 지나온 사람들의 이야기. 익명으로." },
];

export default function Home() {
  return (
    <div className="px-5 md:px-8">
      {/* 히어로 */}
      <section className="max-w-[1120px] mx-auto pt-36 md:pt-44 pb-20 md:pb-28">
        <Reveal>
          <h1 className="font-serif text-[34px] md:text-[56px] font-semibold tracking-tight leading-[1.3] text-on-surface break-keep">
            혼자 감당하지
            <br />
            않아도 됩니다.
          </h1>
          <p className="mt-6 max-w-lg text-[17px] md:text-lg text-on-surface-variant leading-relaxed break-keep">
            장례부터 행정, 상속까지. 지금 해야 할 일을 기한과 함께 순서대로 정리해 드립니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              href="/family-guide"
              className="group inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3.5 rounded-lg font-semibold text-[15px] transition-colors hover:bg-primary-container"
            >
              지금 할 일 확인하기
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <Link
              href="/debt-simulator"
              className="text-[15px] font-medium text-on-surface-variant underline underline-offset-4 decoration-outline-variant hover:text-on-surface hover:decoration-outline transition-colors"
            >
              빚이 걱정된다면
            </Link>
          </div>
        </Reveal>
      </section>

      {/* 여백이 하는 일 */}
      <section className="max-w-[1120px] mx-auto pb-24 md:pb-32">
        <Reveal className="flex items-baseline justify-between border-b border-on-surface/80 pb-4">
          <h2 className="text-sm font-semibold text-on-surface">여백이 하는 일</h2>
          <span className="text-sm text-secondary tabular-nums">{FEATURES.length}</span>
        </Reveal>
        <ul className="grid md:grid-cols-2 md:gap-x-12">
          {FEATURES.map((f, i) => (
            <li key={f.href} className="border-b border-outline-variant">
              <Link href={f.href} className="group flex items-start gap-5 py-6">
                <span className="pt-1 text-sm text-secondary tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="block font-serif text-xl font-semibold text-on-surface group-hover:text-primary transition-colors">
                    {f.title}
                  </span>
                  <span className="mt-1.5 block text-[15px] text-on-surface-variant leading-relaxed break-keep">{f.desc}</span>
                </span>
                <ArrowRight
                  className="mt-1.5 w-4 h-4 shrink-0 text-outline transition-all group-hover:text-primary group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* 빚 상속 */}
      <section className="max-w-[1120px] mx-auto pb-28 md:pb-36">
        <Reveal className="grid md:grid-cols-[1fr_1.2fr] gap-6 md:gap-12 rounded-xl bg-surface-container-low p-8 md:p-12">
          <h2 className="font-serif text-[26px] md:text-[32px] font-semibold leading-snug text-on-surface break-keep">
            빚도 상속됩니다.
            <br />
            기한은 3개월입니다.
          </h2>
          <div>
            <p className="text-[16px] text-on-surface-variant leading-relaxed break-keep">
              상속포기와 한정승인은 상속이 시작된 것을 안 날부터 3개월 안에 신청해야 합니다. 가족 구성을 입력하면 누가
              무엇을 해야 하는지 확인할 수 있습니다.
            </p>
            <Link
              href="/debt-simulator"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold text-primary hover:gap-2.5 transition-all"
            >
              빚 상속 진단하기 <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
