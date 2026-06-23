import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const MIN = 60 * 1000;
const SEED = [
  {
    tag: "상속고민",
    title: "한정승인 절차가 너무 복잡하게 느껴집니다.",
    body: "아버지께서 갑작스럽게 돌아가시고 남기신 빚을 알게 되었습니다. 한정승인을 하려고 하는데 혼자 준비하려니 막막하네요. 혹시 경험 있으신 분들 조언 좀 부탁드립니다…",
    comfort: 12,
    createdAt: new Date(Date.now() - 10 * MIN),
    comments: [
      { body: "저도 작년에 한정승인 직접 했어요. 재산목록 작성이 제일 까다로웠는데, 막막하면 법률구조공단 무료 상담부터 받아보세요.", createdAt: new Date(Date.now() - 8 * MIN) },
      { body: "기한이 3개월이라 마음이 급하시겠지만, 빚 규모 파악이 안 되면 특별한정승인도 가능하니 너무 자책하지 마세요.", createdAt: new Date(Date.now() - 5 * MIN) },
    ],
  },
  {
    tag: "마음위로",
    title: "오늘 문득 너무 보고 싶네요",
    body: "비가 오니까 어머니 생각이 많이 납니다. 괜찮아진 줄 알았는데 아직인가 봐요. 시간이 약이라는 말이 맞을까요?",
    comfort: 45,
    createdAt: new Date(Date.now() - 60 * MIN),
    comments: [
      { body: "괜찮아졌다가도 사소한 순간에 다시 무너지는 게 자연스러운 거래요. 천천히 가셔도 됩니다.", createdAt: new Date(Date.now() - 50 * MIN) },
      { body: "저는 아직도 비 오는 날엔 한참 멍하니 있어요. 그래도 그게 그분을 기억하는 방식이라 생각해요.", createdAt: new Date(Date.now() - 40 * MIN) },
      { body: "오늘 하루도 잘 버티셨어요. 충분합니다.", createdAt: new Date(Date.now() - 30 * MIN) },
    ],
  },
  {
    tag: "절차질문",
    title: "사망신고 후 은행 계좌 정리는 어떻게 하나요?",
    body: "동사무소에서 사망신고는 마쳤습니다. 고인의 통장에 있는 소액의 예금을 인출하려면 어떤 서류가 필요한지 궁금합니다.",
    comfort: 1,
    reported: 1,
    createdAt: new Date(Date.now() - 180 * MIN),
    comments: [
      { body: "안심상속 원스톱 서비스로 먼저 계좌부터 조회해 보세요. 기본증명서, 가족관계증명서, 상속인 신분증이 필요합니다.", createdAt: new Date(Date.now() - 170 * MIN) },
    ],
  },
  {
    tag: "일상공유",
    title: "49재를 지내고 왔습니다",
    body: "정신없이 장례를 치르고 어느새 49재까지 끝났네요. 막상 다 끝나니 이제야 실감이 납니다. 다들 잘 버티고 계신가요.",
    comfort: 27,
    createdAt: new Date(Date.now() - 26 * 60 * MIN),
    comments: [
      { body: "절차가 끝난 뒤가 더 힘들더라고요. 잘 견뎌오셨습니다.", createdAt: new Date(Date.now() - 24 * 60 * MIN) },
    ],
  },
];

async function main() {
  const existing = await prisma.post.count();
  if (existing > 0) {
    console.log(`이미 ${existing}개의 글이 있어 시드를 건너뜁니다.`);
    return;
  }
  for (const { comments, ...post } of SEED) {
    await prisma.post.create({
      data: {
        ...post,
        reply: comments.length, // 답변 수 = 댓글 수로 일관 유지
        comments: { create: comments },
      },
    });
  }
  console.log(`시드 ${SEED.length}개 생성 완료.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
