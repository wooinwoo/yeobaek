import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommunityBoard from "./CommunityBoard";
import type { PostDTO, CommentDTO } from "@/lib/posts";

function makePost(over: Partial<PostDTO>): PostDTO {
  return {
    id: "p1",
    tag: "마음위로",
    title: "제목",
    body: "본문",
    comfort: 0,
    reply: 0,
    reported: 0,
    createdAt: "2026-06-01T00:00:00.000Z",
    ...over,
  };
}

// 글 두 개: 태그/위로 수가 다르고 정렬·필터 검증에 쓰인다.
const POSTS: PostDTO[] = [
  makePost({
    id: "older-popular",
    tag: "상속고민",
    title: "상속을 어떻게 결정해야 할지",
    body: "빚이 많은 것 같아 걱정입니다.",
    comfort: 10,
    reply: 2,
    createdAt: "2026-05-01T00:00:00.000Z",
  }),
  makePost({
    id: "newer-quiet",
    tag: "마음위로",
    title: "오늘은 조금 견딜 만했어요",
    body: "여기 와서 이야기를 남깁니다.",
    comfort: 1,
    reply: 0,
    createdAt: "2026-06-10T00:00:00.000Z",
  }),
];

// fetch 응답을 손쉽게 만들기 위한 헬퍼
function jsonResponse(body: unknown, ok = true, status = 200) {
  return Promise.resolve({
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CommunityBoard - 목록 렌더", () => {
  it("초기 글 목록을 모두 보여준다", () => {
    render(<CommunityBoard initialPosts={POSTS} />);
    expect(screen.getByText("상속을 어떻게 결정해야 할지")).toBeInTheDocument();
    expect(screen.getByText("오늘은 조금 견딜 만했어요")).toBeInTheDocument();
  });

  it("글이 없으면 빈 상태 안내를 보여준다", () => {
    render(<CommunityBoard initialPosts={[]} />);
    expect(
      screen.getByText("아직 올라온 이야기가 없어요. 첫 이야기를 남겨주세요.")
    ).toBeInTheDocument();
  });
});

describe("CommunityBoard - 태그 필터", () => {
  it("태그를 누르면 해당 분류 글만 남고, 빈 분류는 안내를 띄운다", async () => {
    const user = userEvent.setup();
    render(<CommunityBoard initialPosts={POSTS} />);

    const filterGroup = screen.getByRole("group", { name: "태그 필터" });
    await user.click(within(filterGroup).getByRole("button", { name: "상속고민" }));

    expect(screen.getByText("상속을 어떻게 결정해야 할지")).toBeInTheDocument();
    expect(screen.queryByText("오늘은 조금 견딜 만했어요")).not.toBeInTheDocument();

    // 글이 없는 분류로 전환하면 맞춤 빈 상태 문구가 나온다
    await user.click(within(filterGroup).getByRole("button", { name: "일상공유" }));
    expect(
      screen.getByText("'일상공유' 분류에는 아직 글이 없어요. 첫 이야기를 남겨주세요.")
    ).toBeInTheDocument();
  });
});

describe("CommunityBoard - 정렬 토글", () => {
  it("공감순으로 바꾸면 위로가 많은 글이 먼저 나온다", async () => {
    const user = userEvent.setup();
    render(<CommunityBoard initialPosts={POSTS} />);

    // 기본(최신순): newer-quiet가 먼저
    let titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles[0]).toBe("오늘은 조금 견딜 만했어요");

    const sortGroup = screen.getByRole("group", { name: "정렬 기준" });
    await user.click(within(sortGroup).getByRole("button", { name: "공감순" }));

    titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(titles[0]).toBe("상속을 어떻게 결정해야 할지");
  });
});

describe("CommunityBoard - 글 작성 폼", () => {
  it("폼을 열고 짧은 입력으로 제출하면 서버 검증 에러를 보여준다", async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockImplementation(() => jsonResponse({ error: "제목을 2자 이상 적어주세요." }, false, 400));

    render(<CommunityBoard initialPosts={POSTS} />);
    await user.click(screen.getByRole("button", { name: /당신의 이야기를 들려주세요/ }));

    await user.type(screen.getByLabelText("제목"), "짧");
    await user.type(screen.getByLabelText("내용"), "짧음");
    await user.click(screen.getByRole("button", { name: /올리기/ }));

    expect(await screen.findByText("제목을 2자 이상 적어주세요.")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/posts", expect.objectContaining({ method: "POST" }));
  });

  it("정상 입력이면 새 글을 목록 맨 앞에 낙관적으로 추가하고 폼을 닫는다", async () => {
    const user = userEvent.setup();
    const created = makePost({
      id: "fresh",
      tag: "절차질문",
      title: "사망신고는 어디서 하나요",
      body: "주민센터에 가면 되는지 궁금합니다.",
      createdAt: "2026-06-20T00:00:00.000Z",
    });
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse(created));

    render(<CommunityBoard initialPosts={POSTS} />);
    await user.click(screen.getByRole("button", { name: /당신의 이야기를 들려주세요/ }));
    await user.type(screen.getByLabelText("제목"), "사망신고는 어디서 하나요");
    await user.type(screen.getByLabelText("내용"), "주민센터에 가면 되는지 궁금합니다.");
    await user.click(screen.getByRole("button", { name: /올리기/ }));

    const titles = await waitFor(() => {
      const list = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
      expect(list[0]).toBe("사망신고는 어디서 하나요");
      return list;
    });
    expect(titles).toContain("오늘은 조금 견딜 만했어요");
    // 작성 폼이 닫혀 다시 트리거 버튼이 보인다
    expect(screen.getByRole("button", { name: /당신의 이야기를 들려주세요/ })).toBeInTheDocument();
  });
});

describe("CommunityBoard - 위로(낙관적 업데이트/롤백)", () => {
  it("위로를 누르면 즉시 +1, 서버 응답값으로 맞춘다", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({ comfort: 99 }));

    render(<CommunityBoard initialPosts={POSTS} />);
    const comfortBtn = screen.getByRole("button", { name: /^위로 1$/ });
    await user.click(comfortBtn);

    // 서버가 99를 돌려주면 그 값으로 표시되고 버튼은 비활성(중복 방지)
    await waitFor(() => expect(screen.getByRole("button", { name: /^위로 99$/ })).toBeDisabled());
  });

  it("위로 요청이 실패하면 수치를 원래대로 롤백한다", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({}, false, 500));

    render(<CommunityBoard initialPosts={POSTS} />);
    await user.click(screen.getByRole("button", { name: /^위로 1$/ }));

    // 낙관적으로 2가 됐다가 실패 롤백으로 다시 1, 버튼은 재클릭 가능
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /^위로 1$/ });
      expect(btn).not.toBeDisabled();
    });
  });

  it("위로 0인 글이 실패해도 음수로 내려가지 않고 0으로 복원된다", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({}, false, 500));

    // comfort=0 글 하나만
    render(<CommunityBoard initialPosts={[makePost({ id: "zero", title: "위로 0", comfort: 0 })]} />);
    await user.click(screen.getByRole("button", { name: /^위로 0$/ }));

    // 낙관적 1 → 실패 롤백. 원래 값(0)으로 복원되어야 한다(언더플로우 방지)
    await waitFor(() => {
      const btn = screen.getByRole("button", { name: /^위로 0$/ });
      expect(btn).not.toBeDisabled();
    });
  });

  it("200 응답에 comfort 필드가 없으면 낙관적 값을 유지한다", async () => {
    const user = userEvent.setup();
    // ok=true지만 카운트 필드 없음
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({}, true, 200));

    render(<CommunityBoard initialPosts={POSTS} />);
    await user.click(screen.getByRole("button", { name: /^위로 1$/ }));

    // 필드가 없으니 낙관적으로 올린 2를 유지하고, 버튼은 비활성(중복 방지)
    await waitFor(() => expect(screen.getByRole("button", { name: /^위로 2$/ })).toBeDisabled());
  });
});

describe("CommunityBoard - 신고(낙관적 업데이트/롤백)", () => {
  it("신고 실패 시 원래 값으로 복원하고 다시 신고 가능해진다", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({}, false, 500));

    render(<CommunityBoard initialPosts={[makePost({ id: "rep", title: "신고 대상", reported: 0 })]} />);
    await user.click(screen.getByRole("button", { name: /이 글 신고하기/ }));

    // 실패 롤백 후 다시 신고 버튼이 활성(중복 방지 해제)
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /이 글 신고하기/ })).not.toBeDisabled(),
    );
  });

  it("200 응답에 reported 필드가 없으면 낙관적 값을 유지한다", async () => {
    const user = userEvent.setup();
    vi.spyOn(global, "fetch").mockImplementation(() => jsonResponse({}, true, 200));

    render(<CommunityBoard initialPosts={[makePost({ id: "rep2", title: "신고", reported: 0 })]} />);
    await user.click(screen.getByRole("button", { name: /이 글 신고하기/ }));

    // 신고 완료 표시(중복 방지)로 비활성 유지
    await waitFor(() => expect(screen.getByRole("button", { name: /신고 접수됨/ })).toBeDisabled());
  });
});

describe("CommunityBoard - 댓글 토글/작성", () => {
  it("답변을 펼치면 댓글을 불러와 보여준다", async () => {
    const user = userEvent.setup();
    const comments: CommentDTO[] = [
      { id: "c1", postId: "newer-quiet", body: "힘내세요. 곁에 있을게요.", createdAt: "2026-06-11T00:00:00.000Z" },
    ];
    vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (String(url).includes("/comments")) return jsonResponse(comments);
      return jsonResponse({});
    });

    render(<CommunityBoard initialPosts={POSTS} />);
    // newer-quiet 글의 답변 버튼(답변 0)
    await user.click(screen.getByRole("button", { name: /답변 0/ }));

    expect(await screen.findByText("힘내세요. 곁에 있을게요.")).toBeInTheDocument();
  });

  it("댓글이 2자 미만이면 fetch 없이 검증 에러를 띄운다", async () => {
    const user = userEvent.setup();
    // 첫 펼침 시 빈 목록을 돌려주고, 그 외 호출은 추적
    const fetchMock = vi.spyOn(global, "fetch").mockImplementation((url) => {
      if (String(url).includes("/comments")) return jsonResponse([]);
      return jsonResponse({});
    });

    render(<CommunityBoard initialPosts={POSTS} />);
    await user.click(screen.getByRole("button", { name: /답변 0/ }));
    await screen.findByText("아직 댓글이 없어요. 첫 위로를 건네주세요.");

    const callsAfterLoad = fetchMock.mock.calls.length;
    await user.type(screen.getByLabelText("댓글 작성"), "응");
    await user.click(screen.getByRole("button", { name: /등록/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent("댓글을 2자 이상 적어주세요.");
    // 검증 실패는 네트워크 요청을 보내지 않는다
    expect(fetchMock.mock.calls.length).toBe(callsAfterLoad);
  });
});
