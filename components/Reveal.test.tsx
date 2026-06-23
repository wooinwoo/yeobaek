import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import Reveal from "./Reveal";

// jsdom에는 IntersectionObserver가 없으므로 관찰 콜백을 우리가 제어할 수 있게 stub 한다.
let observerCallback: IntersectionObserverCallback | null = null;
let observed: Element | null = null;

class MockIO {
  constructor(cb: IntersectionObserverCallback) {
    observerCallback = cb;
  }
  observe(el: Element) {
    observed = el;
  }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
}

beforeEach(() => {
  observerCallback = null;
  observed = null;
  vi.stubGlobal("IntersectionObserver", MockIO as unknown as typeof IntersectionObserver);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Reveal", () => {
  it("자식을 렌더하고 처음에는 'in' 클래스가 없다", () => {
    const { container } = render(<Reveal>본문 내용</Reveal>);
    expect(screen.getByText("본문 내용")).toBeInTheDocument();
    expect(observed).not.toBeNull();
    expect(container.firstElementChild?.className).toContain("reveal");
    expect(container.firstElementChild?.className).not.toContain("in");
  });

  it("교차(intersecting)되면 'in' 클래스가 붙는다", () => {
    const { container } = render(<Reveal>본문 내용</Reveal>);
    act(() => {
      observerCallback?.(
        [{ isIntersecting: true, target: observed! } as IntersectionObserverEntry],
        {} as IntersectionObserver
      );
    });
    expect(container.firstElementChild?.className).toContain("in");
  });
});
