import { z } from "zod";

export const POST_TAGS = ["상속고민", "마음위로", "절차질문", "일상공유"] as const;
export const FILTER_TAGS = ["전체", ...POST_TAGS] as const;

export type PostTag = (typeof POST_TAGS)[number];

// 글 작성 입력 검증
export const createPostSchema = z.object({
  tag: z.enum(POST_TAGS),
  title: z.string().trim().min(2, "제목을 2자 이상 적어주세요.").max(80),
  body: z.string().trim().min(5, "내용을 5자 이상 적어주세요.").max(2000),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

// 클라이언트로 내려보내는 직렬화된 글(Date → ISO 문자열)
export type PostDTO = {
  id: string;
  tag: string;
  title: string;
  body: string;
  comfort: number;
  reply: number;
  createdAt: string;
};
