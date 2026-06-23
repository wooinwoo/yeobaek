/* 여백 — 공유 인터랙션 (모바일 메뉴 · 체크리스트 진행률 · 상황칩 · 용어검색)
   모든 페이지에 로드. 각 블록은 해당 요소가 있을 때만 동작. */
(function () {
  "use strict";

  // ── 헤더 레이아웃 교정 (fixed + max-w + left-0 → 우측 잘림 버그) ──
  function initNavLayout() {
    var nav = document.querySelector("nav.fixed");
    if (!nav || nav.dataset.wrapped) return;
    nav.style.maxWidth = "none"; // 배경을 화면 끝까지
    var inner = document.createElement("div");
    inner.style.cssText =
      "display:flex;justify-content:space-between;align-items:center;gap:1rem;max-width:1120px;margin:0 auto;width:100%";
    while (nav.firstChild) inner.appendChild(nav.firstChild);
    nav.appendChild(inner);
    nav.dataset.wrapped = "1";
  }

  // ── 모바일 네비게이션 (햄버거 → 슬라이드 메뉴) ──
  function initMobileNav() {
    var desk = document.querySelector(".hidden.md\\:flex");
    if (!desk) return;
    var links = desk.querySelectorAll("a");
    if (!links.length) return;
    var ham = null;
    document.querySelectorAll("button").forEach(function (b) {
      if (!ham && /\bmd:hidden\b/.test(b.className) && !/md:block/.test(b.className)) ham = b;
    });
    // 햄버거 버튼이 없는 페이지엔 직접 생성 (모바일에서만 노출)
    if (!ham) {
      ham = document.createElement("button");
      ham.className = "md:hidden";
      ham.setAttribute("aria-label", "메뉴 열기");
      ham.innerHTML = '<span class="material-symbols-outlined" style="font-size:28px">menu</span>';
      ham.style.cssText = "background:none;border:0;color:#334546;cursor:pointer;align-items:center;line-height:1;padding:4px";
      var host = document.querySelector("nav.fixed > div") || document.querySelector("nav.fixed");
      if (host) host.appendChild(ham);
      // Tailwind CDN이 런타임 추가 요소의 md:hidden을 생성하지 못하므로 직접 제어
      var mq = window.matchMedia("(min-width: 768px)");
      var sync = function () { ham.style.display = mq.matches ? "none" : "inline-flex"; };
      sync();
      (mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync));
    }

    var back = document.createElement("div");
    back.style.cssText =
      "position:fixed;inset:0;background:rgba(30,27,24,.4);opacity:0;pointer-events:none;transition:opacity .3s;z-index:99";
    var panel = document.createElement("nav");
    panel.setAttribute("aria-label", "모바일 메뉴");
    panel.style.cssText =
      "position:fixed;top:0;right:0;height:100%;width:76%;max-width:300px;background:#fff8f5;box-shadow:-10px 0 40px rgba(30,27,24,.18);transform:translateX(100%);transition:transform .32s cubic-bezier(.22,.61,.36,1);z-index:100;padding:78px 24px 24px;display:flex;flex-direction:column;gap:2px;overflow-y:auto";

    links.forEach(function (a) {
      var x = document.createElement("a");
      x.href = a.getAttribute("href") || "#";
      x.textContent = (a.textContent || "").trim();
      x.style.cssText =
        "padding:15px 8px;font-size:17px;font-weight:600;color:#1e1b18;border-bottom:1px solid #efe6e2;text-decoration:none";
      panel.appendChild(x);
    });
    var close = document.createElement("button");
    close.innerHTML = "&times;";
    close.setAttribute("aria-label", "닫기");
    close.style.cssText =
      "position:absolute;top:20px;right:22px;font-size:32px;line-height:1;background:none;border:0;color:#334546;cursor:pointer";
    panel.appendChild(close);

    document.body.appendChild(back);
    document.body.appendChild(panel);

    function open() {
      panel.style.transform = "translateX(0)";
      back.style.opacity = "1";
      back.style.pointerEvents = "auto";
    }
    function shut() {
      panel.style.transform = "translateX(100%)";
      back.style.opacity = "0";
      back.style.pointerEvents = "none";
    }
    ham.addEventListener("click", open);
    close.addEventListener("click", shut);
    back.addEventListener("click", shut);
  }

  // ── 유족 길잡이: 체크박스 → 진행률 링 + % ──
  function initChecklist() {
    var ring = document.getElementById("progress-circle");
    var boxes = document.querySelectorAll('input[type="checkbox"]');
    if (!ring || !boxes.length) return;
    var C = 276.46; // 2πr (r=44)
    var pctSpan = null;
    document.querySelectorAll("span").forEach(function (s) {
      if (!pctSpan && /^\s*\d+%\s*$/.test(s.textContent)) pctSpan = s;
    });
    function update() {
      var total = boxes.length,
        done = 0;
      boxes.forEach(function (b) {
        if (b.checked) done++;
      });
      var p = Math.round((done / total) * 100);
      ring.style.transition = "stroke-dashoffset .6s cubic-bezier(.22,.61,.36,1)";
      ring.style.strokeDashoffset = C - (p / 100) * C;
      if (pctSpan) pctSpan.textContent = p + "%";
    }
    boxes.forEach(function (b) {
      b.addEventListener("change", update);
    });
    update();
    setTimeout(update, 500); // 인라인 28% 애니메이션 덮어쓰기
  }

  // ── 유족 길잡이: 상황 칩 (병원/자택 단일 선택) ──
  function initChips() {
    var chips = [].slice.call(document.querySelectorAll("button")).filter(function (b) {
      return /임종/.test(b.textContent);
    });
    if (chips.length < 2) return;
    var ON = ["border-primary", "text-primary", "bg-primary/5"];
    var OFF = ["border-outline-variant", "text-on-surface-variant", "bg-surface"];
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        chips.forEach(function (x) {
          ON.forEach(function (k) { x.classList.remove(k); });
          OFF.forEach(function (k) { x.classList.add(k); });
        });
        OFF.forEach(function (k) { c.classList.remove(k); });
        ON.forEach(function (k) { c.classList.add(k); });
      });
    });
  }

  // ── 용어 사전: 검색 + 카테고리 칩 필터 ──
  function initTermsSearch() {
    var input = document.querySelector('input[placeholder*="용어"]');
    var grid = document.querySelector("section.grid");
    if (!input || !grid) return;
    var cards = [].slice.call(grid.querySelectorAll("article"));
    var cta = grid.querySelector(":scope > :not(article)"); // '용어 추가 요청' 카드
    var CATS = ["전체", "장례", "안치", "예절", "의례", "서류", "상속"];
    var state = { cat: "전체", q: "" };

    // 카테고리 칩 수집 (텍스트가 카테고리명인 버튼)
    var chips = [].slice.call(document.querySelectorAll("button")).filter(function (b) {
      return CATS.indexOf((b.textContent || "").trim()) >= 0;
    });
    function catOf(card) {
      var tag = card.querySelector("span");
      return tag ? (tag.textContent || "").trim() : "";
    }
    function render() {
      var shown = 0;
      cards.forEach(function (c) {
        var okCat = state.cat === "전체" || catOf(c) === state.cat;
        var okQ = !state.q || (c.textContent || "").toLowerCase().indexOf(state.q) >= 0;
        var hit = okCat && okQ;
        c.style.display = hit ? "" : "none";
        if (hit) shown++;
      });
      if (cta) cta.style.display = state.cat === "전체" && !state.q ? "" : "none";
      var empty = document.getElementById("terms-empty");
      if (!empty) {
        empty = document.createElement("p");
        empty.id = "terms-empty";
        empty.textContent = "검색 결과가 없어요.";
        empty.style.cssText = "grid-column:1/-1;text-align:center;color:#727878;padding:32px";
        grid.appendChild(empty);
      }
      empty.style.display = shown ? "none" : "";
    }
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.cat = (chip.textContent || "").trim();
        chips.forEach(function (x) {
          x.classList.remove("bg-primary", "text-on-primary");
          x.classList.add("bg-surface-container", "text-on-surface-variant");
        });
        chip.classList.add("bg-primary", "text-on-primary");
        chip.classList.remove("bg-surface-container", "text-on-surface-variant");
        render();
      });
    });
    input.addEventListener("input", function () {
      state.q = input.value.trim().toLowerCase();
      render();
    });
  }

  // ── 랜딩: CTA 버튼 이동 (Stitch가 <button>으로 만들어 죽어있음) ──
  function initLandingCtas() {
    if (!document.getElementById("hero")) return; // 랜딩에서만
    var map = [
      ["도움", "family-guide.html"],
      ["유족 길잡이", "family-guide.html"],
      ["조문 예절", "etiquette.html"],
      ["빚 상속 진단", "debt-simulator.html"],
    ];
    document.querySelectorAll("button").forEach(function (b) {
      var t = (b.textContent || "").trim();
      for (var i = 0; i < map.length; i++) {
        if (t.indexOf(map[i][0]) >= 0) {
          var href = map[i][1];
          b.style.cursor = "pointer";
          b.addEventListener("click", function () {
            location.href = href;
          });
          break;
        }
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavLayout();
    initMobileNav();
    initChecklist();
    initChips();
    initTermsSearch();
    initLandingCtas();
  });
})();
