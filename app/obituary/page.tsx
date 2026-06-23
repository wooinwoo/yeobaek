"use client";

import { useMemo, useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Obituary() {
  const [f, setF] = useState({
    name: "",
    age: "",
    when: "",
    place: "",
    room: "",
    funeralOut: "",
    burial: "",
    chief: "",
    contact: "",
    account: "",
  });
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF({ ...f, [k]: e.target.value });

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("[부고]");
    L.push("");
    const who = f.name ? `${f.name}님` : "고인";
    L.push(`${who}께서 ${f.age ? `향년 ${f.age}세로 ` : ""}별세하셨기에 삼가 알려드립니다.`);
    if (f.when) L.push(`▪ 별세: ${f.when}`);
    if (f.place) L.push(`▪ 빈소: ${f.place}${f.room ? ` ${f.room}` : ""}`);
    if (f.funeralOut) L.push(`▪ 발인: ${f.funeralOut}`);
    if (f.burial) L.push(`▪ 장지: ${f.burial}`);
    if (f.chief) L.push(`▪ 상주: ${f.chief}`);
    L.push("");
    L.push("고인의 명복을 빌어주시는 모든 분께 깊이 감사드립니다.");
    if (f.contact) L.push(`연락처: ${f.contact}`);
    if (f.account) L.push(`마음 전하실 곳: ${f.account}`);
    return L.join("\n");
  }, [f]);

  const COPIED_RESET_MS = 1800; // '복사됨' 표시 유지 시간

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_RESET_MS);
    } catch {
      // 클립보드 권한 거부·미지원 브라우저: 아래 안내로 직접 복사하도록 유도
      setCopyFailed(true);
    }
  };

  const field = (label: string, k: keyof typeof f, ph: string, type = "text") => (
    <label className="block">
      <span className="text-sm font-medium text-on-surface-variant">{label}</span>
      <input
        type={type}
        value={f[k]}
        onChange={set(k)}
        placeholder={ph}
        className="mt-1 w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-lg outline-none focus:border-primary transition-colors"
      />
    </label>
  );

  return (
    <div className="pt-24 pb-24 px-5 md:px-8">
      <div className="max-w-[900px] mx-auto">
        <div className="text-sm text-on-surface-variant text-center mb-2">홈 · 부고 문자 생성기</div>
        <h1 className="font-serif text-[26px] md:text-4xl font-semibold text-on-surface text-center mb-3">
          부고 문자, 대신 정리해 드릴게요
        </h1>
        <p className="text-on-surface-variant text-center mb-9">
          정신없는 와중에 형식 갖춰 쓰기 어려운 부고. 빈칸만 채우면 단정한 문구를 만들어 드립니다.
        </p>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* 입력 */}
          <div className="bg-surface-container-lowest rounded-3xl p-7 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.12)] grid gap-4">
            {field("고인 성함", "name", "예) 홍길동")}
            {field("향년 (나이)", "age", "예) 78")}
            {field("별세 일시", "when", "예) 2026년 6월 16일 오전")}
            {field("빈소 (장례식장)", "place", "예) ○○병원 장례식장")}
            {field("호실", "room", "예) 특실 3호")}
            {field("발인 일시", "funeralOut", "예) 6월 18일 오전 7시")}
            {field("장지", "burial", "예) ○○추모공원")}
            {field("상주", "chief", "예) 자녀 일동")}
            {field("연락처", "contact", "예) 010-0000-0000")}
            {field("부의금 계좌 (선택)", "account", "예) ○○은행 000-0000-0000 (예금주 홍길동)")}
          </div>

          {/* 미리보기 */}
          <div className="md:sticky md:top-24">
            <div className="bg-surface-container rounded-3xl p-6">
              <div className="text-sm text-on-surface-variant mb-3">미리보기</div>
              <pre className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-on-surface min-h-[220px]">
                {text}
              </pre>
            </div>
            <button
              onClick={copy}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary px-6 py-3.5 rounded-full font-semibold text-sm hover:bg-primary transition-colors"
            >
              {copied ? <><Check className="w-4 h-4" /> 복사됨</> : <><Copy className="w-4 h-4" /> 부고 문구 복사하기</>}
            </button>
            {copyFailed ? (
              <p role="status" className="text-xs text-error mt-3 text-center">
                자동 복사가 안 됐어요. 위 미리보기 글을 길게 눌러 직접 복사해 주세요.
              </p>
            ) : (
              <p className="text-xs text-outline mt-3 text-center">복사해서 문자·카카오톡으로 바로 보내실 수 있어요.</p>
            )}
          </div>
        </div>

        {/* 부고 보내는 법 */}
        <section className="mt-14">
          <h2 className="font-serif text-2xl font-semibold text-on-surface mb-5">부고, 이렇게 보내세요</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
              <h3 className="font-semibold mb-2">누구에게 · 언제</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">가까운 가족·친지께 <b className="text-on-surface">먼저 전화</b>로 알리고, 빈소·발인 일정이 정해지면 지인·직장에 문자/카톡으로 부고를 보냅니다. 너무 이른 새벽·늦은 밤은 피하세요.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
              <h3 className="font-semibold mb-2">담아야 할 것</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">고인 성함·별세 일시, <b className="text-on-surface">빈소(장소·호실)</b>, 발인 일시, 장지, 상주, 연락처. 위 양식에 채우면 자동으로 정리돼요.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
              <h3 className="font-semibold mb-2">부의금 계좌</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">못 오시는 분들을 위해 부고에 <b className="text-on-surface">부의금 계좌를 넣는 건 일반적</b>이에요. 위 양식의 ‘부의금 계좌’에 적으면 문구에 자동으로 들어갑니다. 다만 <b className="text-on-surface">예금주·계좌번호를 정확히</b> 확인하고, 요즘 부고를 사칭한 스미싱 문자도 있으니 되도록 <b className="text-on-surface">아는 사람에게만</b> 보내세요.</p>
            </div>
            <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]">
              <h3 className="font-semibold mb-2">장례 후 답례</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">조문·부의해 주신 분들께 장례 뒤 <b className="text-on-surface">감사 인사</b>를 전하면 좋습니다. 짧은 문자 한 통이면 충분해요.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
