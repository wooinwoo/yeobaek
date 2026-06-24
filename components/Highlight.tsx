import { Fragment } from "react";
import { highlight } from "@/lib/search";

type HighlightProps = {
  /** 원본 텍스트 */
  text: string;
  /** 강조할 검색어(토큰 분리됨) */
  query: string;
};

/**
 * 검색어와 일치하는 부분을 <mark>로 강조해 렌더한다.
 * 텍스트 분할 방식(순수 함수 highlight)을 쓰므로 dangerouslySetInnerHTML 없이 XSS 안전하다.
 */
export default function Highlight({ text, query }: HighlightProps) {
  const segments = highlight(text, query);
  return (
    <>
      {segments.map((seg, i) =>
        seg.matched ? (
          <mark
            key={i}
            className="bg-primary/15 text-primary rounded-[3px] px-0.5"
          >
            {seg.text}
          </mark>
        ) : (
          <Fragment key={i}>{seg.text}</Fragment>
        )
      )}
    </>
  );
}
