import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchAutocomplete from "./SearchAutocomplete";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

beforeEach(() => {
  push.mockClear();
});

describe("SearchAutocomplete", () => {
  it("콤보박스 ARIA 속성을 갖는다", () => {
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-controls");
  });

  it("입력하면 제안 리스트박스가 열린다", async () => {
    const user = userEvent.setup();
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    await user.type(input, "상속세");

    expect(input).toHaveAttribute("aria-expanded", "true");
    const listbox = screen.getByRole("listbox");
    const options = within(listbox).getAllByRole("option");
    expect(options.length).toBeGreaterThan(0);
  });

  it("아래 방향키로 옵션을 활성화하고 aria-activedescendant를 갱신한다", async () => {
    const user = userEvent.setup();
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    await user.type(input, "상속");
    await user.keyboard("{ArrowDown}");

    const options = within(screen.getByRole("listbox")).getAllByRole("option");
    expect(options[0]).toHaveAttribute("aria-selected", "true");
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      options[0].getAttribute("id")
    );
  });

  it("Enter로 활성 제안을 선택하면 해당 경로로 이동한다", async () => {
    const user = userEvent.setup();
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    await user.type(input, "상속세");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledTimes(1);
    // 활성 제안이 아닌 일반 검색(/search?q=)이 아니라 특정 항목 경로여야 한다.
    expect(push.mock.calls[0][0]).not.toMatch(/^\/search\?q=/);
  });

  it("활성 제안 없이 Enter를 누르면 검색 결과 페이지로 이동한다", async () => {
    const user = userEvent.setup();
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    await user.type(input, "상속세");
    await user.keyboard("{Enter}");

    expect(push).toHaveBeenCalledWith(`/search?q=${encodeURIComponent("상속세")}`);
  });

  it("Esc로 제안 목록을 닫는다", async () => {
    const user = userEvent.setup();
    render(<SearchAutocomplete />);
    const input = screen.getByRole("combobox");
    await user.type(input, "상속");
    expect(input).toHaveAttribute("aria-expanded", "true");
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
  });
});
