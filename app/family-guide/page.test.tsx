import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FamilyGuide from "./page";

const STORE_KEY = "yeobaek-guide";

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("FamilyGuide - 진행 상황 인쇄/초기화", () => {
  it("인쇄 버튼을 누르면 window.print를 호출한다", async () => {
    const user = userEvent.setup();
    const printSpy = vi.fn();
    vi.stubGlobal("print", printSpy);

    render(<FamilyGuide />);
    await user.click(screen.getByRole("button", { name: /진행 상황 인쇄·PDF 저장/ }));

    expect(printSpy).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });

  it("체크한 항목이 없으면 초기화 버튼은 비활성이다", () => {
    render(<FamilyGuide />);
    expect(screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" })).toBeDisabled();
  });

  it("체크 후 초기화를 확인하면 진행률이 0%로 돌아가고 저장값도 비워진다", async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<FamilyGuide />);
    // 첫 체크박스를 켜면 진행률이 오른다
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    const resetBtn = screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" });
    await waitFor(() => expect(resetBtn).toBeEnabled());
    await user.click(resetBtn);

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    // localStorage에도 빈 체크 상태가 저장된다
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
      expect(saved.checked).toEqual({});
    });
  });

  it("초기화 확인을 취소하면 체크 상태가 유지된다", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    render(<FamilyGuide />);
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" }));
    expect(firstCheckbox).toBeChecked();
  });
});
