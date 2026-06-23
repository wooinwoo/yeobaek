# 여백 (Yeobaek) — 유족 길잡이

> 가족을 떠나보낸 직후, 무엇을 언제까지 해야 하는지 알려주는 한국형 사후 절차 안내 서비스.
> 장례 → 행정 → 보험·연금·지원금 → 상속 → 세금 → 조문예절까지, 흩어진 정보를 한 곳에서.

**라이브 데모:** _(배포 후 URL 기입)_

---

## 왜 만들었나

아버지를 갑자기 떠나보내면서, 슬퍼할 겨를도 없이 절차의 벽에 부딪혔습니다.
자택에서 돌아가시면 경찰 검안부터 받아야 한다는 것, 사망진단서를 7부씩 떼야 한다는 것,
안심상속 원스톱으로 숨은 계좌·보험을 찾을 수 있다는 것, 자동차는 6개월 안에 이전해야 과태료가 안 붙는다는 것 —
**아무도 정리해서 알려주지 않았고, 검색하면 광고와 단편 정보뿐이었습니다.**

"다음에 같은 일을 겪는 사람은 덜 막막했으면" 하는 마음으로, 그때 제가 필요했던 안내서를 직접 만들었습니다.

## 무엇을 해결하나

| 유족이 겪는 문제 | 여백의 기능 |
|---|---|
| 뭐부터 해야 할지 모름 | **유족 길잡이** — 사망일 입력 시 6단계 33개 할 일을 D-day와 함께, 진행률 추적(localStorage) |
| 빚이 더 많은데 잘못 손대면 떠안음 | **빚 상속 진단** — 가족 구성으로 단순승인/한정승인/상속포기 조합 자동 판정 |
| 누가 얼마나 상속받는지 모름 | **상속 가이드** — 순위·법정상속분·유류분·등기/세금 |
| 상속세가 얼마나 나올지 막막 | **상속세 계산기** — 재산·가족 구성으로 간이 추정 |
| 부고 문구를 어떻게 쓰지 | **부고 생성기** — 빈칸만 채우면 복사 가능한 문구 생성 |
| 조문 가서 뭘 해야 할지 모름 | **조문 예절** — 입관 전후, 분향·헌화·절, 부의금, 종교별, FAQ |
| 낯선 용어 | **용어 사전** — 장례·상속·보험 57개 용어 검색 |
| 받을 수 있는데 몰라서 못 받음 | **지원금** — 국민연금·장제급여·산재·보훈 등 + 숨은 돈 찾기 |
| 혼자 견디는 슬픔 | **커뮤니티** — 익명으로 고민·위로를 나누는 공간 (실시간 저장) |

## 핵심 기능 — 풀스택 커뮤니티

읽기 전용 정보 사이트에 그치지 않도록, 커뮤니티는 **실제 동작하는 백엔드**로 구현했습니다.

- **서버 컴포넌트**가 요청 시 DB에서 글을 읽어 첫 화면을 렌더(SSR)
- **API Route Handler**로 글 작성(`POST /api/posts`)·위로 누르기(`POST /api/posts/:id/comfort`)
- **zod**로 입력 검증, 실패 시 422와 사람이 읽을 메시지 반환
- **낙관적 업데이트(optimistic UI)** — 위로 클릭 즉시 반영, 실패 시 롤백
- 태그 필터·상대시간 표시·빈 상태 처리

## 기술 스택

- **Next.js 16** (App Router, Turbopack) · **React 19** · **TypeScript**
- **Tailwind CSS v4** — `@theme` 디자인 토큰 기반 "Warm & Soft" 시스템 (한지 크림 + 클레이 톤)
- **Prisma 7 + libSQL** — 드라이버 어댑터로 로컬은 `file:`, 프로덕션은 **Turso**(서버리스에서 쓰기 영속)
- **zod** — 런타임 입력 검증
- **lucide-react** · **Noto Serif KR + Pretendard**

### 설계 결정 메모

- **서버 컴포넌트 읽기 + Route Handler 쓰기**: 첫 페인트는 SSR로 빠르게, 변경은 명시적 API로. REST 엔드포인트라 `curl`로도 테스트 가능.
- **Prisma 7 / 드라이버 어댑터**: Prisma 7은 드라이버 어댑터가 기본이라 **Rust 쿼리 엔진 바이너리가 없어** 서버리스 콜드스타트·번들에 유리. libSQL 어댑터 하나로 로컬 SQLite 파일과 Turso 원격을 동일 코드로 처리.
- **Turso(libSQL)**: Vercel 서버리스 파일시스템은 휘발성이라 SQLite 파일로는 쓰기가 영속되지 않음. SQLite 호환이면서 원격 영속이 되는 Turso를 채택.
- **Tailwind v4 `@theme`**: 색·그림자·폰트를 토큰으로 중앙화해 톤 일관성 유지.

## 데이터 모델

```prisma
model Post {
  id        String   @id @default(cuid())
  tag       String   // 상속고민 | 마음위로 | 절차질문 | 일상공유
  title     String
  body      String
  comfort   Int      @default(0)  // '위로' 공감 수
  reply     Int      @default(0)
  createdAt DateTime @default(now())
  @@index([createdAt])
  @@index([tag])
}
```

## 로컬 실행

```bash
pnpm install                 # postinstall이 prisma generate 수행
cp .env.example .env         # 기본값이 file: 모드라 그대로 동작
pnpm prisma migrate deploy   # 로컬 SQLite에 스키마 적용 (또는 pnpm db:push)
pnpm db:seed                 # 예시 글 시드
pnpm dev                     # http://localhost:3000
```

자주 쓰는 스크립트: `pnpm db:studio`(데이터 GUI), `pnpm db:migrate`(마이그레이션 생성), `pnpm build`.

## 배포 (Vercel + Turso)

```bash
# 1) Turso DB 생성
turso db create yeobaek
turso db show yeobaek --url            # → DATABASE_URL (libsql://...)
turso db tokens create yeobaek         # → TURSO_AUTH_TOKEN

# 2) 스키마 적용 (마이그레이션 SQL을 원격 DB에 주입)
turso db shell yeobaek < prisma/migrations/*/migration.sql

# 3) 시드 (원격 DB로)
DATABASE_URL="libsql://..." TURSO_AUTH_TOKEN="ey..." pnpm db:seed
```

Vercel 환경변수에 `DATABASE_URL`(Turso libsql URL)과 `TURSO_AUTH_TOKEN`을 등록한 뒤 배포하면 됩니다.
빌드는 `prisma generate && next build`로 구성되어 있습니다.

## 콘텐츠 신뢰성과 한계

- 보험금 청구시효 3년, 국민연금 5년, 자동차 상속이전 6개월, 상속포기/한정승인 3개월,
  유류분(형제자매는 2024.4 헌재 위헌으로 폐지) 등 **법적 사실은 검증해 반영**했습니다.
- 다만 제도·금액·기한은 바뀔 수 있고 개인 상황마다 다릅니다.
  **법률·세무 판단이 필요한 부분에는 전문가 상담 권고를 함께 적었습니다.** 본 서비스는 정보 제공이며 자문을 대체하지 않습니다.

## 앞으로

- 댓글(답변) 모델 확장 — 현재는 카운트 필드만, 실제 스레드로
- 익명 인증/신고·차단으로 커뮤니티 안전성 강화
- 길잡이 진행상황 서버 동기화(계정 연동) — 지금은 localStorage
- 지역별 화장장 예약·장례식장 정보 연동
