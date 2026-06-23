"use client";

import { useMemo, useState } from "react";
import { PencilLine, MessageCircle, Heart, Send, X, Loader2 } from "lucide-react";
import { FILTER_TAGS, POST_TAGS, type PostDTO, type CommentDTO } from "@/lib/posts";

// 클라이언트에서 임시로 만든 낙관적 댓글 식별(롤백/치환용)
let tempSeq = 0;

function ago(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "방금 전";
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}일 전`;
  return new Date(iso).toLocaleDateString("ko-KR");
}

export default function CommunityBoard({ initialPosts }: { initialPosts: PostDTO[] }) {
  const [posts, setPosts] = useState<PostDTO[]>(initialPosts);
  const [filter, setFilter] = useState<string>("전체");
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState<(typeof POST_TAGS)[number]>(POST_TAGS[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  // 댓글: 글별 펼침 여부 / 목록 / 로딩 / 입력값 / 제출중 / 에러
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, CommentDTO[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({});
  const [commentSubmitting, setCommentSubmitting] = useState<Record<string, boolean>>({});
  const [commentError, setCommentError] = useState<Record<string, string>>({});

  const visible = useMemo(
    () => (filter === "전체" ? posts : posts.filter((p) => p.tag === filter)),
    [posts, filter],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag, title, body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "등록에 실패했어요.");
        return;
      }
      setPosts((prev) => [{ ...data }, ...prev]);
      setTitle("");
      setBody("");
      setOpen(false);
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  async function comfort(id: string) {
    if (liked[id]) return;
    // 낙관적 업데이트
    setLiked((l) => ({ ...l, [id]: true }));
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comfort: p.comfort + 1 } : p)));
    try {
      const res = await fetch(`/api/posts/${id}/comfort`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comfort: data.comfort } : p)));
    } catch {
      // 롤백
      setLiked((l) => ({ ...l, [id]: false }));
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comfort: p.comfort - 1 } : p)));
    }
  }

  async function toggleComments(id: string) {
    const next = !openComments[id];
    setOpenComments((s) => ({ ...s, [id]: next }));
    // 처음 펼칠 때만 목록을 불러온다.
    if (next && comments[id] === undefined && !loadingComments[id]) {
      setLoadingComments((s) => ({ ...s, [id]: true }));
      try {
        const res = await fetch(`/api/posts/${id}/comments`);
        if (!res.ok) throw new Error();
        const data: CommentDTO[] = await res.json();
        setComments((s) => ({ ...s, [id]: data }));
      } catch {
        setCommentError((s) => ({ ...s, [id]: "댓글을 불러오지 못했어요. 잠시 후 다시 시도해 주세요." }));
      } finally {
        setLoadingComments((s) => ({ ...s, [id]: false }));
      }
    }
  }

  async function submitComment(e: React.FormEvent, id: string) {
    e.preventDefault();
    const body = (commentDrafts[id] ?? "").trim();
    setCommentError((s) => ({ ...s, [id]: "" }));
    if (body.length < 2) {
      setCommentError((s) => ({ ...s, [id]: "댓글을 2자 이상 적어주세요." }));
      return;
    }

    // 낙관적 추가
    const tempId = `temp-${++tempSeq}`;
    const optimistic: CommentDTO = {
      id: tempId,
      postId: id,
      body,
      createdAt: new Date().toISOString(),
    };
    setComments((s) => ({ ...s, [id]: [...(s[id] ?? []), optimistic] }));
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, reply: p.reply + 1 } : p)));
    setCommentDrafts((s) => ({ ...s, [id]: "" }));
    setCommentSubmitting((s) => ({ ...s, [id]: true }));

    try {
      const res = await fetch(`/api/posts/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "등록에 실패했어요.");
      // 임시 댓글을 서버 응답으로 치환
      setComments((s) => ({
        ...s,
        [id]: (s[id] ?? []).map((c) => (c.id === tempId ? (data as CommentDTO) : c)),
      }));
    } catch (err) {
      // 롤백
      setComments((s) => ({ ...s, [id]: (s[id] ?? []).filter((c) => c.id !== tempId) }));
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, reply: p.reply - 1 } : p)));
      setCommentDrafts((s) => ({ ...s, [id]: body }));
      setCommentError((s) => ({
        ...s,
        [id]: err instanceof Error ? err.message : "등록에 실패했어요. 잠시 후 다시 시도해 주세요.",
      }));
    } finally {
      setCommentSubmitting((s) => ({ ...s, [id]: false }));
    }
  }

  return (
    <div>
      {/* 태그 필터 */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-2 rounded-full text-sm border transition-colors ${
              filter === t
                ? "bg-primary text-on-primary border-primary"
                : "bg-surface-container border-outline-variant text-on-surface-variant hover:bg-surface-variant"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* 작성 */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full text-left bg-surface-container-lowest border border-surface-variant rounded-3xl px-5 py-4 mb-5 text-on-surface-variant flex items-center gap-2 hover:border-outline-variant transition-colors"
        >
          <PencilLine className="w-4 h-4 shrink-0" /> 당신의 이야기를 들려주세요…
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="bg-surface-container-lowest border border-surface-variant rounded-3xl p-5 mb-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">익명으로 글쓰기</span>
            <button type="button" onClick={() => setOpen(false)} className="text-outline hover:text-on-surface">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {POST_TAGS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                  tag === t
                    ? "bg-primary text-on-primary border-primary"
                    : "bg-surface border-outline-variant text-on-surface-variant"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            maxLength={80}
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl outline-none focus:border-primary transition-colors"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="어떤 이야기든 편하게 남겨주세요. 판단하지 않고 듣겠습니다."
            rows={4}
            maxLength={2000}
            className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl outline-none focus:border-primary transition-colors resize-none leading-relaxed"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-primary-container text-on-primary px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary transition-colors disabled:opacity-60"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? "올리는 중…" : "올리기"}
            </button>
          </div>
        </form>
      )}

      {/* 목록 */}
      <div className="flex flex-col gap-4">
        {visible.length === 0 && (
          <p className="text-center text-outline py-16 text-sm">아직 이 분류의 글이 없어요. 첫 이야기를 남겨주세요.</p>
        )}
        {visible.map((p) => (
          <article key={p.id} className="bg-surface-container-lowest rounded-3xl p-6 shadow-[0_8px_24px_-14px_rgba(120,82,60,0.12)]">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-9 h-9 rounded-full bg-surface-variant grid place-items-center text-sm text-on-surface-variant">익</span>
              <div className="text-sm">
                <span className="font-semibold">익명</span>
                <span className="text-outline" suppressHydrationWarning> · {ago(p.createdAt)}</span>
              </div>
              <span className="ml-auto text-xs px-3 py-1 rounded-full bg-surface-variant text-on-surface-variant">{p.tag}</span>
            </div>
            <h2 className="font-serif text-lg font-semibold mb-1.5">{p.title}</h2>
            <p className="text-on-surface-variant text-sm mb-4 leading-relaxed whitespace-pre-wrap">{p.body}</p>
            <div className="flex gap-5 text-sm text-outline">
              <button
                type="button"
                onClick={() => toggleComments(p.id)}
                aria-expanded={!!openComments[p.id]}
                aria-controls={`comments-${p.id}`}
                className={`inline-flex items-center gap-1.5 transition-colors ${
                  openComments[p.id] ? "text-primary" : "hover:text-primary"
                }`}
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> 답변 {p.reply}
              </button>
              <button
                type="button"
                onClick={() => comfort(p.id)}
                disabled={liked[p.id]}
                aria-pressed={!!liked[p.id]}
                className={`inline-flex items-center gap-1.5 transition-colors ${
                  liked[p.id] ? "text-primary" : "hover:text-primary"
                }`}
              >
                <Heart className="w-4 h-4" aria-hidden="true" fill={liked[p.id] ? "currentColor" : "none"} /> 위로 {p.comfort}
              </button>
            </div>

            {openComments[p.id] && (
              <div id={`comments-${p.id}`} className="mt-5 pt-5 border-t border-surface-variant">
                {loadingComments[p.id] && comments[p.id] === undefined ? (
                  <p className="flex items-center gap-2 text-sm text-outline py-2">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> 댓글을 불러오는 중…
                  </p>
                ) : (comments[p.id]?.length ?? 0) === 0 ? (
                  <p className="text-sm text-outline py-2">아직 댓글이 없어요. 첫 위로를 건네주세요.</p>
                ) : (
                  <ul className="flex flex-col gap-3 mb-4">
                    {comments[p.id]?.map((c) => (
                      <li key={c.id} className="text-sm">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <span className="font-semibold text-on-surface">익명</span>
                          <span className="text-outline" suppressHydrationWarning>· {ago(c.createdAt)}</span>
                        </div>
                        <p className="text-on-surface-variant leading-relaxed whitespace-pre-wrap mt-1">{c.body}</p>
                      </li>
                    ))}
                  </ul>
                )}

                <form onSubmit={(e) => submitComment(e, p.id)} className="flex flex-col gap-2">
                  <label htmlFor={`comment-input-${p.id}`} className="sr-only">
                    댓글 작성
                  </label>
                  <div className="flex items-end gap-2">
                    <textarea
                      id={`comment-input-${p.id}`}
                      name="comment"
                      value={commentDrafts[p.id] ?? ""}
                      onChange={(e) => setCommentDrafts((s) => ({ ...s, [p.id]: e.target.value }))}
                      placeholder="따뜻한 한마디를 남겨주세요."
                      rows={2}
                      maxLength={1000}
                      aria-describedby={commentError[p.id] ? `comment-error-${p.id}` : undefined}
                      className="flex-1 px-4 py-2.5 text-base bg-surface border border-outline-variant rounded-xl outline-none focus-visible:border-primary transition-colors resize-none leading-relaxed"
                    />
                    <button
                      type="submit"
                      disabled={commentSubmitting[p.id]}
                      className="inline-flex items-center gap-1.5 min-h-[44px] bg-primary-container text-on-primary px-4 py-2.5 rounded-full font-semibold text-sm hover:bg-primary transition-colors disabled:opacity-60"
                    >
                      {commentSubmitting[p.id] ? (
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                      ) : (
                        <Send className="w-4 h-4" aria-hidden="true" />
                      )}
                      {commentSubmitting[p.id] ? "등록 중…" : "등록"}
                    </button>
                  </div>
                  {commentError[p.id] && (
                    <p id={`comment-error-${p.id}`} role="alert" className="text-sm text-error">
                      {commentError[p.id]}
                    </p>
                  )}
                </form>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
