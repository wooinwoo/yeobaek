"use client";

import { useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { suggestSearch, type SearchSuggestion } from "@/lib/search";
import Highlight from "@/components/Highlight";

type SearchAutocompleteProps = {
  /** 초기 입력값 */
  defaultValue?: string;
  /** input의 id (label 연결용). 미지정 시 자동 생성. */
  inputId?: string;
  /** sr-only label 텍스트 */
  label?: string;
  /** placeholder */
  placeholder?: string;
  /** 제출 버튼 노출 여부(헤더 등 좁은 곳에서는 숨김) */
  showButton?: boolean;
  /** 제안 최대 개수 */
  limit?: number;
};

/**
 * ARIA 콤보박스 패턴의 검색 입력.
 * - 입력 시 인덱스 기반 제안 드롭다운(role="listbox"/option).
 * - 키보드: 위/아래로 이동, Enter 선택/제출, Esc 닫기.
 * - aria-expanded / aria-activedescendant / aria-controls로 상태를 노출.
 */
export default function SearchAutocomplete({
  defaultValue = "",
  inputId,
  label = "사이트 통합 검색",
  placeholder = "예: 상속포기, 부의금, 상속세, 안심상속",
  showButton = true,
  limit = 6,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const reactId = useId();
  const id = inputId ?? `search-${reactId}`;
  const listId = `${id}-listbox`;

  const [input, setInput] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const suggestions = useMemo<SearchSuggestion[]>(
    () => suggestSearch(input, limit),
    [input, limit]
  );
  const showList = open && suggestions.length > 0;

  function go(query: string) {
    const next = query.trim();
    setOpen(false);
    setActive(-1);
    if (next) {
      router.push(`/search?q=${encodeURIComponent(next)}`);
    } else {
      router.push("/search");
    }
  }

  function selectSuggestion(s: SearchSuggestion) {
    setInput(s.label);
    setOpen(false);
    setActive(-1);
    router.push(s.href);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (showList && active >= 0 && active < suggestions.length) {
      selectSuggestion(suggestions[active]);
      return;
    }
    go(input);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      e.preventDefault();
      setOpen(true);
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      if (showList) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    }
  }

  const activeId =
    showList && active >= 0 ? `${id}-option-${active}` : undefined;

  return (
    <form onSubmit={handleSubmit} role="search" className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-outline"
          aria-hidden="true"
        />
        <input
          id={id}
          type="search"
          name="q"
          autoComplete="off"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // 옵션 클릭(mousedown) 처리 시간을 벌기 위해 닫힘을 지연한다.
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full min-h-[44px] pl-12 text-base bg-surface-container-lowest border border-outline-variant outline-none focus:border-primary transition-colors ${
            showButton ? "pr-24 py-3.5 rounded-2xl" : "pr-4 py-3 rounded-xl"
          }`}
        />
        {showButton ? (
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[40px] px-4 rounded-xl bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary/90"
          >
            검색
          </button>
        ) : null}
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="검색 제안"
        hidden={!showList}
        className="absolute z-50 left-0 right-0 mt-2 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-[0_12px_32px_-18px_rgba(120,82,60,0.5)] overflow-hidden"
      >
        {suggestions.map((s, i) => (
          <li
            key={`${s.href}-${s.label}`}
            id={`${id}-option-${i}`}
            role="option"
            aria-selected={i === active}
            // onMouseDown은 input blur보다 먼저 실행되어 선택을 보장한다.
            onMouseDown={(e) => {
              e.preventDefault();
              if (blurTimer.current) clearTimeout(blurTimer.current);
              selectSuggestion(s);
            }}
            onMouseEnter={() => setActive(i)}
            className={`flex items-center gap-3 px-4 min-h-[44px] cursor-pointer ${
              i === active ? "bg-surface-variant" : ""
            }`}
          >
            <Search
              className="w-4 h-4 text-outline shrink-0"
              aria-hidden="true"
            />
            <span className="flex-1 text-base text-on-surface truncate">
              <Highlight text={s.label} query={input} />
            </span>
            <span className="text-xs text-outline shrink-0">{s.category}</span>
          </li>
        ))}
      </ul>
    </form>
  );
}
