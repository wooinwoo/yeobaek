import { z } from "zod";

export const POST_TAGS = ["상속고민", "마음위로", "절차질문", "일상공유"] as const;
export const FILTER_TAGS = ["전체", ...POST_TAGS] as const;

export type PostTag = (typeof POST_TAGS)[number];

// 게시글 정렬 기준
export const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "comfort", label: "공감순" },
] as const;

export type SortValue = (typeof SORT_OPTIONS)[number]["value"];

// 신고 누적이 이 값 이상이면 목록에서 흐리게 처리(운영 검토 대상)
export const REPORT_HIDE_THRESHOLD = 5;

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
  reported: number;
  createdAt: string;
};

// 정렬 기준에 맞춰 글 목록을 정렬해 새 배열로 돌려준다(원본 불변).
// comfort: 위로 많은 순(동률이면 최신순), latest: 최신순.
export function sortPosts(posts: PostDTO[], sort: SortValue): PostDTO[] {
  const byLatest = (a: PostDTO, b: PostDTO) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  if (sort === "comfort") {
    return [...posts].sort((a, b) => b.comfort - a.comfort || byLatest(a, b));
  }
  return [...posts].sort(byLatest);
}

// 댓글 작성 입력 검증
export const createCommentSchema = z.object({
  body: z.string().trim().min(2, "댓글을 2자 이상 적어주세요.").max(1000, "댓글은 1000자 이내로 적어주세요."),
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;

// 클라이언트로 내려보내는 직렬화된 댓글(Date → ISO 문자열)
export type CommentDTO = {
  id: string;
  postId: string;
  body: string;
  createdAt: string;
};
