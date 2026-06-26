# 배포 가이드 (Vercel + Turso)

여백을 **Vercel**(Next.js 앱) + **Turso**(libSQL 원격 DB)로 배포하는 전체 절차입니다.
로컬 개발은 `file:` SQLite 모드라 계정이 필요 없고, 프로덕션만 Turso를 씁니다.

> 한 줄 요약: Turso DB 만들고 → 스키마를 1회 push → Vercel에 환경변수 2개 넣고 → 배포.

---

## 0. 사전 준비

- GitHub에 저장소가 올라가 있어야 합니다(Vercel이 연결).
- [Turso CLI](https://docs.turso.tech/cli/installation) 설치 및 로그인:

  ```bash
  curl -sSfL https://get.tur.so/install.sh | bash   # 설치
  turso auth login                                  # 브라우저 로그인
  ```

---

## 1. Turso DB 생성 → URL/토큰 발급

```bash
# 1) DB 생성 (이름은 자유. 여기서는 yeobaek)
turso db create yeobaek

# 2) DATABASE_URL 로 쓸 접속 URL 확인 (libsql://... 형태)
turso db show yeobaek --url

# 3) TURSO_AUTH_TOKEN 으로 쓸 인증 토큰 발급
turso db tokens create yeobaek
```

- 2번 출력값 → `DATABASE_URL` (예: `libsql://yeobaek-<org>.turso.io`)
- 3번 출력값 → `TURSO_AUTH_TOKEN` (`eyJ...` 형태의 긴 문자열)

이 두 값은 **시크릿**입니다. 코드/저장소에 커밋하지 말고 Vercel 환경변수로만 넣으세요.

---

## 2. Turso DB에 스키마 적용 (배포 전 1회, 수동)

Vercel 빌드는 `prisma generate`만 수행합니다(스키마를 DB에 밀어넣지 않음).
따라서 **테이블 생성은 배포 전에 로컬에서 1회 수동으로** 해야 합니다.

로컬 셸에서 위에서 받은 값을 임시로 export 한 뒤 `db:push` 합니다.

```bash
export DATABASE_URL="libsql://yeobaek-<org>.turso.io"   # 1번에서 받은 URL
export TURSO_AUTH_TOKEN="eyJ..."                         # 1번에서 받은 토큰

pnpm db:push     # prisma/schema.prisma 를 Turso DB에 반영 (Post / Comment 테이블 생성)
```

> `db:push`는 마이그레이션 히스토리 없이 스키마 상태를 그대로 반영합니다. 이 프로젝트 규모엔 충분합니다.
> 마이그레이션 히스토리를 유지하려면 `db:push` 대신 `pnpm prisma migrate deploy`를 같은 환경변수로 실행하세요.

적용 확인:

```bash
turso db shell yeobaek ".tables"   # Post, Comment 가 보이면 성공
```

### (선택) 시드 데이터

빈 커뮤니티가 허전하면 예시 글/댓글을 넣을 수 있습니다(이미 글이 있으면 건너뜀).

```bash
# 위 export 가 유지된 같은 셸에서
pnpm db:seed
```

운영 데이터를 직접 쌓을 계획이면 시드는 건너뛰어도 됩니다.

작업이 끝나면 셸의 임시 환경변수는 닫거나 `unset` 하세요. 로컬 개발은 다시 `file:` 모드로 돌아갑니다.

---

## 3. Vercel 프로젝트 연결

1. [vercel.com](https://vercel.com) 로그인 → **Add New → Project** → 이 GitHub 저장소 Import.
2. Framework Preset은 **Next.js**로 자동 감지됩니다.
3. 빌드 설정은 **기본값 그대로** 두면 됩니다(별도 `vercel.json` 불필요):
   - Install Command: `pnpm install` (자동) — `postinstall`이 `prisma generate` 수행
   - Build Command: `pnpm build` (= `prisma generate && next build`)
   - Output: Next.js 기본
   - Node.js Version: 20.x (`package.json`의 `engines.node`에 `>=20` 명시)

---

## 4. Vercel 환경변수 입력

프로젝트 **Settings → Environment Variables** 에서 다음 2개를 **Production**(필요 시 Preview도)에 추가합니다.

| Key | Value | 비고 |
|---|---|---|
| `DATABASE_URL` | `libsql://yeobaek-<org>.turso.io` | 1번에서 받은 URL. `libsql://`로 시작하면 코드가 자동으로 원격 모드 |
| `TURSO_AUTH_TOKEN` | `eyJ...` | 1번에서 받은 토큰 |

> 코드 동작: `lib/db.ts`는 `DATABASE_URL`이 `libsql://`(또는 `http(s)`/`ws`)로 시작하면
> 원격 모드로 보고 `TURSO_AUTH_TOKEN`을 어댑터에 전달합니다. `file:`이면 토큰 없이 로컬 모드로 동작합니다.

---

## 5. 배포

환경변수를 넣은 뒤 **Deploy**(또는 main 브랜치에 push) 하면 빌드가 시작됩니다.
빌드 로그에서 `prisma generate`와 `next build`가 성공하는지 확인합니다.

---

## 6. 배포 후 확인 포인트

1. 배포된 URL 접속 → 홈/주요 페이지가 정상 렌더되는지.
2. `/community` 진입 → 2번에서 시드를 넣었다면 예시 글이 보이는지.
3. **커뮤니티 글 작성** → 새 글을 등록하고 목록에 즉시 반영되는지(원격 쓰기 검증의 핵심).
4. 작성한 글에 **댓글/위로/신고** 동작 → 카운트가 증가/저장되는지.
5. 새로고침 후에도 데이터가 유지되는지(서버리스에서 Turso 영속 확인).

문제가 생기면 Vercel **Functions/Runtime Logs**에서 DB 연결 오류(토큰 누락/URL 오타)를 먼저 확인하세요.

---

## 트러블슈팅

- **`SQLITE_AUTH` / 인증 오류**: `TURSO_AUTH_TOKEN`이 비었거나 다른 DB의 토큰. 1번 3단계로 재발급.
- **테이블 없음(`no such table: Post`)**: 2번 스키마 push를 안 했거나 다른 DB에 함. `DATABASE_URL`이 가리키는 DB에 push 했는지 확인.
- **로컬에서 갑자기 Turso로 붙음**: 셸에 export한 `DATABASE_URL`이 남아 있는 경우. `unset DATABASE_URL TURSO_AUTH_TOKEN` 후 다시 시도.
