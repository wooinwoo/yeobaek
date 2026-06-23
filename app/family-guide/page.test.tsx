import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
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

  it("체크 후 인라인 확인에서 '지우기'를 누르면 진행률이 0%로 돌아가고 저장값도 비워진다", async () => {
    const user = userEvent.setup();

    render(<FamilyGuide />);
    // 첫 체크박스를 켜면 진행률이 오른다
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(firstCheckbox);
    expect(firstCheckbox).toBeChecked();

    const resetBtn = screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" });
    await waitFor(() => expect(resetBtn).toBeEnabled());
    await user.click(resetBtn);

    // 인라인 확인 UI가 뜨고, '지우기'를 눌러야 실제로 비워진다
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "지우기" }));

    expect(screen.getAllByRole("checkbox")[0]).not.toBeChecked();
    // 확인 UI는 사라진다
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    // localStorage에도 빈 체크 상태가 저장된다
    await waitFor(() => {
      const saved = JSON.parse(localStorage.getItem(STORE_KEY) ?? "{}");
      expect(saved.checked).toEqual({});
    });
  });

  it("인라인 확인에서 '취소'를 누르면 체크 상태가 유지된다", async () => {
    const user = userEvent.setup();

    render(<FamilyGuide />);
    const firstCheckbox = screen.getAllByRole("checkbox")[0];
    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" }));
    const dialog = await screen.findByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: "취소" }));

    expect(firstCheckbox).toBeChecked();
    // 확인 UI가 닫히고 초기화 버튼이 다시 보인다
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "체크한 진행 상황 모두 지우기" }),
    ).toBeInTheDocument();
  });
});
