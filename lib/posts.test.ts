import { describe, it, expect } from "vitest";
import { createCommentSchema, createPostSchema } from "./posts";

describe("createCommentSchema", () => {
  it("정상 댓글을 통과시킨다", () => {
    const r = createCommentSchema.safeParse({ body: "함께 견뎌요." });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.body).toBe("함께 견뎌요.");
  });

  it("앞뒤 공백을 trim 한다", () => {
    const r = createCommentSchema.safeParse({ body: "  위로를 보냅니다  " });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.body).toBe("위로를 보냅니다");
  });

  it("trim 후 2자 미만이면 거부한다(경계값)", () => {
    expect(createCommentSchema.safeParse({ body: "  네  " }).success).toBe(false); // trim 후 '네' = 1자
    expect(createCommentSchema.safeParse({ body: "네" }).success).toBe(false); // 1자
    expect(createCommentSchema.safeParse({ body: "응원" }).success).toBe(true); // 2자
  });

  it("공백만 입력하면 거부한다", () => {
    expect(createCommentSchema.safeParse({ body: "     " }).success).toBe(false);
  });

  it("1000자까지 허용, 1001자는 거부한다(경계값)", () => {
    expect(createCommentSchema.safeParse({ body: "가".repeat(1000) }).success).toBe(true);
    expect(createCommentSchema.safeParse({ body: "가".repeat(1001) }).success).toBe(false);
  });

  it("body 누락/타입 오류를 거부한다", () => {
    expect(createCommentSchema.safeParse({}).success).toBe(false);
    expect(createCommentSchema.safeParse({ body: 123 }).success).toBe(false);
  });
});

describe("createPostSchema (회귀)", () => {
  it("정상 글을 통과시킨다", () => {
    const r = createPostSchema.safeParse({ tag: "마음위로", title: "제목입니다", body: "내용을 적어요" });
    expect(r.success).toBe(true);
  });

  it("알 수 없는 태그를 거부한다", () => {
    expect(createPostSchema.safeParse({ tag: "광고", title: "제목", body: "내용입니다" }).success).toBe(false);
  });
});
