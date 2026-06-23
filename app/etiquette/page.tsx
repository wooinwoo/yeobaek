import type { Metadata } from "next";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "조문 예절",
  description: "빈소에 들어서는 순간부터 나오는 순간까지 — 분향·절·부의금·종교별 예절을 빠짐없이 안내합니다.",
};

const card = "bg-surface-container-lowest rounded-3xl p-7 md:p-8 shadow-[0_10px_30px_-12px_rgba(120,82,60,0.1)]";
const h2 = "font-serif text-2xl md:text-3xl font-semibold text-on-surface mb-5 scroll-mt-24";

const TOC = [
  ["timing", "언제 가나"],
  ["coffin", "입관 전·후"],
  ["dress", "복장"],
  ["order", "조문 순서"],
  ["incense", "분향·헌화"],
  ["bow", "절하는 법"],
  ["words", "위로의 말"],
  ["money", "부의금"],
  ["taboo", "삼갈 것"],
  ["religion", "종교별"],
  ["faq", "자주 묻는 질문"],
];

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[34px_1fr] gap-4 py-4 border-t border-surface-variant first:border-0 items-start">
      <span className="grid place-items-center w-7 h-7 rounded-full bg-primary text-on-primary text-sm font-bold">{n}</span>
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-on-surface-variant text-sm mt-1 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}

export default function Etiquette() {
  return (
    <div className="pt-24 pb-20 px-5 md:px-8">
      <div className="max-w-[820px] mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-serif text-[26px] md:text-5xl font-semibold text-on-surface mb-4">조문 예절</h1>
          <p className="text-lg text-on-surface-variant">
            처음이라 막막하시죠. 빈소에 들어서는 순간부터 나오는 순간까지, 하나도 빠짐없이 차근차근 알려드릴게요.
          </p>
        </div>

        {/* 빠른 이동 */}
        <nav className="flex flex-wrap justify-center gap-2 mb-12">
          {TOC.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="px-3.5 py-1.5 rounded-full text-sm border border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary transition-colors">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-12">
          {/* 언제 가나 */}
          <section id="timing">
            <h2 className={h2}>언제 조문 가나요</h2>
            <div className={card}>
              <ul className="space-y-3 text-on-surface-variant">
                <li>· <b className="text-on-surface">부고를 받으면 가급적 빈소가 차려진 뒤</b> 방문합니다. 보통 <b className="text-on-surface">둘째 날(저녁 무렵)</b>이 무난합니다.</li>
                <li>· <b className="text-on-surface">첫날·입관 전</b>은 유족이 경황이 없고 빈소 정리 전일 수 있어 피하는 편입니다.</li>
                <li>· <b className="text-on-surface">발인 당일</b>은 아주 가까운 사이가 아니면 삼갑니다. 유족이 가장 바쁜 때입니다.</li>
                <li>· 너무 이른 아침·늦은 밤은 피하고, 오래 머물지 않습니다.</li>
                <li>· 도저히 못 가면 <b className="text-on-surface">부의금 송금 + 위로 문자</b>로 마음을 전해도 됩니다. (장례 후 따로 찾아뵙는 것도 좋습니다)</li>
              </ul>
            </div>
          </section>

          {/* 입관 전·후 */}
          <section id="coffin">
            <h2 className={h2}>입관(성복) 전과 후, 예절이 달라요</h2>
            <div className={`${card} mb-4`}>
              <p className="text-on-surface-variant leading-relaxed mb-3">
                <b className="text-on-surface">입관(入棺)</b>은 염습한 고인을 관에 모시는 의례로, 보통 <b className="text-on-surface">둘째 날</b>에 합니다. 입관이 끝나면 상주들이 정식으로 상복을 갖춰 입고(<b className="text-on-surface">성복 成服</b>) 첫 제사(성복제)를 올립니다. <b className="text-on-surface">이때부터 빈소가 정식으로 차려지고 분향·재배 같은 정식 조문 예절이 시작됩니다.</b>
              </p>
              <p className="text-on-surface-variant leading-relaxed bg-error-container/40 rounded-2xl px-4 py-3 text-sm">
                자택에서 돌아가셨거나 사고·변사로 <b>경찰 검시·부검</b>을 받는 경우, 시신 인도가 늦어져 <b>입관·성복이 장례 둘째 날 등 중간에</b> 이뤄지기도 합니다. 그래서 일찍 조문 가면 아직 성복 전일 수 있어요.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={card}>
                <h3 className="font-semibold mb-2">성복(입관) 전이라면</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  아직 정식으로 상을 치르기 전입니다. <b>분향·정식 절은 생략</b>하기도 하고, 고인께는 절을 하지 않거나 <b>한 번만</b>, 상주와는 맞절 없이 <b>가볍게 목례하며 위로의 말만</b> 전합니다. (상주도 아직 상복을 갖춰 입지 않은 상태)
                </p>
              </div>
              <div className={`${card} bg-primary-fixed-dim/20`}>
                <h3 className="font-semibold mb-2 text-primary">성복(입관) 후라면</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  정식 조문입니다. <b>분향(또는 헌화) → 영정에 재배(두 번) → 상주와 맞절(한 번)</b> 순으로 예를 갖춥니다. 아래 ‘조문 순서’가 이 경우를 기준으로 합니다.
                </p>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm mt-4">
              헷갈리면 호상소·도우미에게 <b>“성복 하셨나요?”</b> 한마디 여쭤보거나 안내를 따르면 됩니다. 요즘은 구분 없이 정식으로 하는 경우도 많습니다.
            </p>
          </section>

          {/* 복장 */}
          <section id="dress">
            <h2 className={h2}>복장</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className={card}>
                <h3 className="font-semibold mb-2">남성</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">검정 양복 + 흰 셔츠 + 검정 넥타이가 기본. 검정 양말·구두. 무지(無地)로, 화려한 시계·장신구는 빼세요. 양복이 없으면 어두운 무채색 정장·점퍼도 괜찮습니다.</p>
              </div>
              <div className={card}>
                <h3 className="font-semibold mb-2">여성</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">검정 원피스·정장 등 무채색. 진한 화장·향수·반짝이는 액세서리는 자제. 스타킹은 살색보다 <b>검정</b>이 무난. 노출이 적은 옷으로.</p>
              </div>
              <div className={card}>
                <h3 className="font-semibold mb-2">학생 · 급할 때</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">학생은 교복이 정장입니다. 급히 가야 한다면 <b>단정한 어두운 평상복</b>도 괜찮아요. 다만 청바지·반바지·트레이닝복·화려한 색·로고 옷·슬리퍼는 피합니다.</p>
              </div>
              <div className={`${card} bg-error-container/40`}>
                <h3 className="font-semibold mb-2 text-error">꼭 피할 것</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed"><b>맨발은 금물</b> — 신발을 벗고 빈소에 들어가니 반드시 양말·스타킹을 신으세요. 흰색·원색 정장, 모자, 짙은 화장도 피합니다.</p>
              </div>
            </div>
          </section>

          {/* 조문 순서 */}
          <section id="order">
            <h2 className={h2}>빈소에서, 이 순서대로</h2>
            <p className="text-on-surface-variant text-sm mb-4 -mt-2">※ 아래는 <b>성복(입관) 후 정식 조문</b> 기준입니다. 성복 전이라면 위 ‘입관 전·후’ 안내를 참고하세요.</p>
            <div className={card}>
              <ol>
                <Step n={1} title="도착 — 외투·모자를 벗습니다">입구에서 코트·모자·목도리를 벗어 손에 들거나 맡깁니다. 휴대폰은 무음으로.</Step>
                <Step n={2} title="부의금 전달 · 방명록 작성">호상소(접수대)나 부의함에 봉투를 넣고, 방명록(부의록)에 이름을 적습니다. 부의금은 보통 이때 전합니다.</Step>
                <Step n={3} title="상주에게 가벼운 목례">빈소에 들어서며 상주와 눈이 마주치면 가볍게 목례합니다. 아직 길게 말하지 않습니다.</Step>
                <Step n={4} title="분향 또는 헌화">영정 앞으로 가 향을 피우거나(분향) 국화를 올립니다(헌화). 무엇을 할지는 빈소 안내와 종교를 따릅니다.</Step>
                <Step n={5} title="영정에 절(재배) 또는 묵념">영정·위패를 향해 두 번 절(재배)하거나, 종교에 따라 잠시 묵념·기도합니다.</Step>
                <Step n={6} title="상주와 맞절(한 번) · 위로의 말">돌아서서 상주와 한 번 맞절(또는 목례)하고, 짧게 위로를 건넵니다.</Step>
                <Step n={7} title="물러나기">두세 걸음 뒤로 물러난 뒤 돌아섭니다. (영정에 등을 곧장 보이지 않습니다)</Step>
                <Step n={8} title="접객실에서 — 권하면 잠시">유족이 식사를 권하면 사양 말고 잠시 자리합니다. 오래 머물지 않고 조용히 일어납니다.</Step>
              </ol>
            </div>
          </section>

          {/* 분향 · 헌화 */}
          <section id="incense">
            <h2 className={h2}>분향 · 헌화 — 동작 하나하나</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className={card}>
                <h3 className="font-semibold text-primary mb-3">분향(焚香)하는 법</h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-on-surface-variant text-sm leading-relaxed">
                  <li>오른손으로 향을 <b>한 개(또는 세 개, 홀수)</b> 집습니다.</li>
                  <li>왼손으로 오른손목을 가볍게 받칩니다.</li>
                  <li>촛불에 향을 대어 불을 붙입니다.</li>
                  <li><b>입으로 불어 끄지 않습니다.</b> 왼손으로 가볍게 흔들거나 손바람으로 끕니다.</li>
                  <li>두 손으로 향로에 정중히 꽂습니다. (여러 개면 하나씩)</li>
                  <li>한 걸음 물러나 잠시 묵념 후 절합니다.</li>
                </ol>
              </div>
              <div className={card}>
                <h3 className="font-semibold text-primary mb-3">헌화(獻花)하는 법</h3>
                <ol className="list-decimal pl-5 space-y-1.5 text-on-surface-variant text-sm leading-relaxed">
                  <li>국화를 두 손으로 공손히 받습니다.</li>
                  <li>오른손으로 줄기 아래를 잡고 왼손으로 꽃을 받칩니다.</li>
                  <li><b>꽃봉오리가 영정(제단) 쪽</b>을 향하도록 헌화대에 올립니다. (빈소 안내를 따르세요)</li>
                  <li>두 손을 모으고 잠시 묵념합니다.</li>
                  <li>한두 걸음 물러난 뒤 상주에게 인사합니다.</li>
                </ol>
                <p className="text-xs text-outline mt-3">헌화는 주로 기독교·천주교식 빈소에서 합니다.</p>
              </div>
            </div>
          </section>

          {/* 절하는 법 */}
          <section id="bow">
            <h2 className={h2}>절하는 법 — 공수부터 큰절까지</h2>
            <div className={`${card} mb-4`}>
              <p className="text-on-surface-variant mb-4">조문(흉사)에서는 손을 포개는 <b>공수(拱手)</b>가 <b>평소(좋은 일)와 반대</b>입니다.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-surface-container rounded-2xl p-5">
                  <h4 className="font-semibold mb-1">남성</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed"><b>오른손을 위로</b> 포갭니다. 두 손을 눈높이로 올렸다가 바닥에 짚고 큰절. 영정에 <b>두 번(재배)</b>, 상주와 <b>한 번</b> 맞절.</p>
                </div>
                <div className="bg-surface-container rounded-2xl p-5">
                  <h4 className="font-semibold mb-1">여성</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed"><b>왼손을 위로</b> 포갭니다. 포갠 손을 어깨높이로 올리고 앉으며 큰절. 절하는 횟수는 남성과 같습니다.</p>
                </div>
              </div>
            </div>
            <div className={`${card} bg-surface-container`}>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                ※ 무릎·허리가 불편하거나, 임신·부상 등으로 큰절이 어려우면 <b>정중히 서서 묵념</b>해도 결례가 아닙니다. 마음이 우선입니다.
              </p>
            </div>
          </section>

          {/* 위로의 말 */}
          <section id="words">
            <h2 className={h2}>무슨 말을 건네야 할까요</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-3xl p-7 bg-primary-fixed-dim/20 border border-primary-fixed-dim/40">
                <h3 className="font-semibold text-primary mb-3">이렇게 말해요</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-on-surface-variant text-sm">
                  <li>“삼가 고인의 명복을 빕니다.”</li>
                  <li>“얼마나 상심이 크십니까.”</li>
                  <li>“뭐라 위로의 말씀을 드려야 할지….”</li>
                  <li>“고생 많으셨습니다. 힘내세요.”</li>
                  <li>말이 떠오르지 않으면, 말없이 손을 잡아드려도 충분합니다.</li>
                </ul>
                <p className="text-xs text-outline mt-3">짧게. 길게 붙잡고 이야기하지 않습니다. 악수는 보통 하지 않습니다.</p>
              </div>
              <div className="rounded-3xl p-7 bg-surface-container">
                <h3 className="font-semibold mb-3">상주의 인사</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  상주는 “고맙습니다”, “바쁘신데 와주셔서 감사합니다” 정도면 충분합니다. 굳이 사연을 길게 설명하지 않아도 됩니다. 조문객이 절하면 함께 맞절합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 부의금 */}
          <section id="money">
            <h2 className={h2}>부의금(조의금)</h2>
            <div className={`${card} mb-4`}>
              <h3 className="font-semibold mb-3">봉투 쓰는 법</h3>
              <p className="text-on-surface-variant text-sm mb-4">봉투 <b>앞면 가운데에 세로로</b> 아래 중 하나를 씁니다.</p>
              <div className="border-2 border-dashed border-surface-variant rounded-2xl p-7 text-center bg-surface-container">
                <div className="font-serif text-3xl tracking-[0.3em] text-on-surface">賻 儀</div>
                <div className="text-sm text-on-surface-variant mt-2">부의(賻儀) · 근조(謹弔) · 조의(弔意) · 추모(追慕)</div>
                <div className="text-xs text-outline mt-3">— 뒷면 왼쪽 아래에 소속과 이름을 세로로 적습니다 —</div>
              </div>
            </div>
            <div className={`${card} mb-4`}>
              <h3 className="font-semibold mb-3">금액은 얼마가 적당할까요</h3>
              <p className="text-on-surface-variant text-sm mb-4">정답은 없습니다. 관계와 형편에 맞추되, 보통 <b>홀수(3·5·7만 원)</b>로 하는 관례가 있고 10만 원 단위는 예외로 봅니다. 참고용 기준:</p>
              <div className="overflow-hidden rounded-2xl border border-surface-variant text-sm">
                <table className="w-full">
                  <tbody>
                    {[
                      ["얼굴만 아는 사이 · 직장 타부서", "3만 원"],
                      ["일반 지인 · 직장 동료", "5만 원"],
                      ["가까운 친구·동료, 신세 진 사이", "10만 원"],
                      ["친척·아주 가까운 사이", "10만 원 이상 (형편껏)"],
                    ].map(([who, amt], i) => (
                      <tr key={i} className={i % 2 ? "bg-surface-container-low" : "bg-surface-container-lowest"}>
                        <td className="px-4 py-3 text-on-surface-variant">{who}</td>
                        <td className="px-4 py-3 font-semibold text-right whitespace-nowrap">{amt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="text-on-surface-variant text-sm mt-4 space-y-1.5">
                <li>· 빳빳한 <b>신권은 오히려 피하기도</b> 합니다(미리 준비한 느낌). 깨끗한 헌 지폐면 충분합니다.</li>
                <li>· 봉투가 없으면 빈소에 비치된 것을 씁니다. 직접 못 가면 <b>계좌 이체</b>로 전해도 됩니다.</li>
              </ul>
            </div>
          </section>

          {/* 삼갈 것 */}
          <section id="taboo">
            <h2 className={h2}>삼가야 할 것</h2>
            <div className={`${card} bg-error-container/30`}>
              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-on-surface-variant text-sm">
                {[
                  "사망 원인·경위를 캐묻기",
                  "“호상이네요” 같은 표현",
                  "큰 소리로 웃거나 떠들기",
                  "잔 부딪치기·“위하여” 건배",
                  "종교 권유, 정치·사업 이야기",
                  "오래 머물며 자리 차지하기",
                  "빈소·영정 사진 촬영",
                  "유족에게 술 강권하기",
                  "부의금 액수를 큰 소리로 말하기",
                  "아이를 데려가 뛰놀게 두기",
                ].map((t) => (
                  <li key={t} className="flex gap-2 items-start"><X className="w-4 h-4 text-error shrink-0 mt-0.5" strokeWidth={2.2} /> <span>{t}</span></li>
                ))}
              </ul>
            </div>
          </section>

          {/* 종교별 */}
          <section id="religion">
            <h2 className={h2}>종교별 차이</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["불교 · 전통", "분향 후 영정에 재배(두 번), 상주와 맞절. 합장(두 손 모음)으로 예를 표하기도."],
                ["기독교(개신교)", "절 대신 헌화·묵념·기도. 향은 피우지 않는 경우가 많습니다. 빈소 안내를 따르세요."],
                ["천주교", "헌화·성호·묵념. 분향을 하기도 합니다. 연도(위령 기도)에 함께하기도 합니다."],
                ["무교 · 모를 때", "빈소에 차려진 대로 따라 합니다. 향이 있으면 분향, 꽃이 있으면 헌화. 헷갈리면 정중히 묵념해도 됩니다."],
              ].map(([t, d]) => (
                <div key={t} className={card}>
                  <h3 className="font-semibold text-primary mb-1.5">{t}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className={h2}>자주 묻는 질문</h2>
            <div className="flex flex-col gap-3">
              {[
                ["절은 몇 번 하나요?", "영정·위패 앞에서 두 번(재배), 그 뒤 상주와 한 번 맞절합니다. 종교에 따라 묵념으로 대신합니다."],
                ["분향과 헌화, 둘 다 하나요?", "보통 빈소에 준비된 한 가지만 합니다. 향이 있으면 분향, 국화가 있으면 헌화입니다."],
                ["임신부·환자도 절을 해야 하나요?", "아니요. 무리하지 말고 정중히 서서 묵념하면 됩니다. 마음이 우선입니다."],
                ["아이를 데려가도 되나요?", "조용히 있을 수 있는 나이라면 괜찮습니다. 떠들거나 뛰지 않도록 미리 일러두세요."],
                ["회사 동료 부모상, 꼭 가야 하나요?", "친분에 따라 다릅니다. 못 가면 부의금과 위로 문자로 마음을 전해도 결례가 아닙니다."],
                ["조화(근조화환)는 어떻게 보내나요?", "꽃집·온라인으로 빈소에 보낼 수 있습니다. 리본에 ‘謹弔(근조)’와 보내는 사람(소속·이름)을 적습니다."],
              ].map(([q, a]) => (
                <details key={q} className="group bg-surface-container-lowest rounded-2xl border border-surface-variant overflow-hidden">
                  <summary className="cursor-pointer list-none px-5 py-4 font-semibold flex justify-between items-center">
                    {q}
                    <ChevronDown className="w-4 h-4 text-outline group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <p className="px-5 pb-4 text-on-surface-variant text-sm leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 mt-12">
          <p className="text-on-surface-variant text-sm">
            예절은 지역·가풍·종교에 따라 조금씩 다릅니다. 핵심은 <b>정중함과 조용함</b>이에요. 형식이 헷갈리면 빈소 도우미나 다른 조문객을 따라 하셔도 충분합니다. 용어가 낯설면{" "}
            <Link href="/terms" className="text-primary font-semibold">용어 사전</Link>을 참고하세요.
          </p>
        </div>
      </div>
    </div>
  );
}
