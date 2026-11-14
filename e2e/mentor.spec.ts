import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * Доска тренера (/chess/mentor): три режима (ходить, рисовать, расставлять), урок из нескольких досок,
 * режим класса для интерактивной панели и проектора (#present), пульт для презентаций и «шторка».
 */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page) {
  await page.addInitScript(
    ([key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, lang: "ru", sound: false, animations: false },
        }),
      );
    },
    [KEY] as const,
  );
}

const root = (page: Page) => page.locator("[data-mentor]");
const sq = (page: Page, s: string) => page.locator(`[data-board="mentor"] [data-square="${s}"]`);
const press = (loc: Locator, mobile: boolean) => (mobile ? loc.tap() : loc.click());

async function open(page: Page, hash = "") {
  await page.goto(`/chess/mentor${hash}`);
  await expect(root(page)).toHaveAttribute("data-mentor-ready", "");
}

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

test("страница: начальная позиция, ходы нажатием, пульт листает ходы", async ({ page, isMobile }) => {
  await open(page);
  await expect(root(page)).toHaveAttribute("data-mentor-mode", "move");
  await expect(root(page)).toHaveAttribute("data-mentor-boards", "1");
  await expect(root(page)).toHaveAttribute("data-mentor-fen", /^rnbqkbnr\/pppppppp\/8\/8\/8\/8\/PPPPPPPP\/RNBQKBNR w/);
  await press(sq(page, "e2"), isMobile);
  await press(sq(page, "e4"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
  await press(sq(page, "e7"), isMobile);
  await press(sq(page, "e5"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "2");
  // Доска в фокусе — PageUp / PageDown всё равно листают ходы (пульт), а не двигают курсор доски.
  await page.locator('[data-board="mentor"]').focus();
  await page.keyboard.press("PageUp");
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
  await page.keyboard.press("PageDown");
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "2");
  // «Назад» на середине и другой ход — пробный вариант; «Вернуться к партии» — партия на месте.
  await page.keyboard.press("PageUp");
  await press(sq(page, "c7"), isMobile);
  await press(sq(page, "c5"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-trial", "");
  await press(page.locator("[data-mentor-trial-bar] [data-mentor-return]"), isMobile);
  await expect(root(page)).not.toHaveAttribute("data-mentor-trial", /.*/);
  await expect(root(page)).toHaveAttribute("data-mentor-total", "2");
});

test("в начале первым может пойти любой цвет: нажатие на чёрную фигуру — ход чёрных", async ({ page, isMobile }) => {
  await open(page);
  await press(sq(page, "d7"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-fen", / b /);
  await press(sq(page, "d5"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
});

test("рисовать: стрелка двумя нажатиями, кружок, знак, «Стереть» и «Отменить»", async ({ page, isMobile }) => {
  await open(page);
  await press(page.locator('[data-mentor-mode-button="draw"]'), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-mode", "draw");
  await press(sq(page, "e2"), isMobile);
  await press(sq(page, "e4"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "1");
  await expect(page.locator('[data-mentor-arrow="e2e4"][data-color="G"]')).toHaveCount(1);
  // Та же стрелка тем же цветом — убирается.
  await press(sq(page, "e2"), isMobile);
  await press(sq(page, "e4"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "0");
  // Другой цвет — красная стрелка; ход коня рисуется «буквой Г».
  await press(page.locator('[data-mentor-color="R"]'), isMobile);
  await press(sq(page, "g1"), isMobile);
  await press(sq(page, "f3"), isMobile);
  await expect(page.locator('[data-mentor-arrow="g1f3"][data-color="R"]')).toHaveCount(1);
  await press(sq(page, "d5"), isMobile);
  await press(sq(page, "d5"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-rings", "1");
  await press(page.locator('[data-mentor-tool="tick"]'), isMobile);
  await press(sq(page, "e5"), isMobile);
  await expect(page.locator('[data-mentor-sign="e5"][data-kind="tick"]')).toBeVisible();
  // Ходы в режиме рисования не делаются.
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "0");
  await press(page.locator("[data-mentor-clear]"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "0");
  await expect(root(page)).toHaveAttribute("data-mentor-rings", "0");
  await expect(root(page)).toHaveAttribute("data-mentor-signs", "0");
  await press(page.locator("[data-mentor-undo]").first(), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "1");
  await expect(root(page)).toHaveAttribute("data-mentor-rings", "1");
  await expect(root(page)).toHaveAttribute("data-mentor-signs", "1");
});

test("стрелка на перевёрнутой доске идёт от своей клетки к своей", async ({ page, isMobile }) => {
  await open(page);
  await press(page.getByRole("button", { name: /^Поворот/ }).first(), isMobile);
  await press(page.locator('[data-mentor-mode-button="draw"]'), isMobile);
  await press(sq(page, "e2"), isMobile);
  await press(sq(page, "e4"), isMobile);
  const arrow = page.locator('[data-mentor-arrow="e2e4"]');
  await expect(arrow).toHaveCount(1);
  const a = (await arrow.boundingBox())!;
  const e2 = (await sq(page, "e2").boundingBox())!;
  const e4 = (await sq(page, "e4").boundingBox())!;
  // Чёрные внизу: e2 сверху, e4 ниже неё — стрелка идёт вниз, от середины e2 к e4.
  expect(e4.y).toBeGreaterThan(e2.y);
  expect(a.y).toBeGreaterThanOrEqual(e2.y);
  expect(a.y).toBeLessThan(e2.y + e2.height);
  expect(a.y + a.height).toBeGreaterThan(e4.y);
  expect(a.y + a.height).toBeLessThanOrEqual(e4.y + e4.height);
  expect(a.x).toBeGreaterThan(e2.x);
  expect(a.x + a.width).toBeLessThan(e2.x + e2.width);
});

test("расстановка: пустая доска, фигуры из набора, пешку на последнюю горизонталь поставить нельзя", async ({
  page,
  isMobile,
}) => {
  await open(page);
  await press(page.locator('[data-mentor-mode-button="setup"]'), isMobile);
  await press(page.locator("[data-mentor-empty]"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-fen", "8/8/8/8/8/8/8/8 w - - 0 1");
  for (const [piece, square] of [
    ["wK", "e1"],
    ["bK", "e8"],
    ["wQ", "d1"],
  ]) {
    await press(page.locator(`[data-mentor-palette-piece="${piece}"]`), isMobile);
    await press(sq(page, square), isMobile);
  }
  await expect(root(page)).toHaveAttribute("data-mentor-fen", "4k3/8/8/8/8/8/8/3QK3 w - - 0 1");
  // Та же фигура на ту же клетку — убирается.
  await press(sq(page, "d1"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-fen", "4k3/8/8/8/8/8/8/4K3 w - - 0 1");
  await press(page.locator('[data-mentor-palette-piece="wP"]'), isMobile);
  await press(sq(page, "e8"), isMobile);
  await expect(page.locator('[data-board="mentor"]')).toHaveAttribute("data-rejected", "e8");
  // Очередь хода.
  await press(page.locator("[data-mentor-turn-button]"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-fen", "4k3/8/8/8/8/8/8/4K3 b - - 0 1");
});

test("готовые позиции: «Пешечный бой» ставит позицию и задание", async ({ page, isMobile }) => {
  await open(page);
  await press(page.locator('[data-mentor-mode-button="setup"]'), isMobile);
  await press(page.locator("[data-mentor-presets-button]"), isMobile);
  await press(page.locator('[data-mentor-preset="pawns"]'), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-fen", "8/pppppppp/8/8/8/8/PPPPPPPP/8 w - - 0 1");
  await expect(page.locator("[data-mentor-task]")).toHaveText("Проведите пешку в ферзи первыми");
  // В пешечном бою пешки ходят по правилам, хотя королей нет.
  await press(page.locator('[data-mentor-mode-button="move"]'), isMobile);
  await press(sq(page, "e2"), isMobile);
  await press(sq(page, "e4"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
});

test("урок из нескольких досок сохраняется в браузере", async ({ page, isMobile }) => {
  await open(page);
  await press(page.locator("[data-mentor-add]"), isMobile);
  await press(page.locator("[data-mentor-add]"), isMobile);
  await expect(page.locator("[data-mentor-slide]")).toHaveCount(3);
  await expect(root(page)).toHaveAttribute("data-mentor-board", "2");
  await page.locator("[data-mentor-task-input]").fill("Ход белых. Мат в 1 ход");
  await press(page.locator('[data-mentor-mode-button="draw"]'), isMobile);
  await press(sq(page, "d2"), isMobile);
  await press(sq(page, "d4"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "1");
  // Сохранение — через 400 мс после правки.
  await page.waitForTimeout(700);
  await page.reload();
  await expect(root(page)).toHaveAttribute("data-mentor-ready", "");
  await expect(page.locator("[data-mentor-slide]")).toHaveCount(3);
  await expect(root(page)).toHaveAttribute("data-mentor-board", "2");
  await expect(page.locator("[data-mentor-task-input]")).toHaveValue("Ход белых. Мат в 1 ход");
  await expect(root(page)).toHaveAttribute("data-mentor-arrows", "1");
  // «Дальше» в конце последней доски — некуда; «Назад» в начале доски — на прошлую доску.
  await press(page.locator("[data-mentor-prev]"), isMobile);
  await expect(root(page)).toHaveAttribute("data-mentor-board", "1");
});

test("доска тренера есть в списке разделов шахматной школы", async ({ page }) => {
  await page.goto("/chess");
  const more = page.locator("details").filter({ has: page.locator('a[href="/chess/mentor"]') });
  if (await more.count()) await more.first().evaluate((d) => ((d as HTMLDetailsElement).open = true));
  await expect(page.locator('a[href="/chess/mentor"]').first()).toBeVisible();
});

test("oʻzbek tili: sahifada rus harflari yoʻq", async ({ page }) => {
  await page.addInitScript(() => {
    const raw = localStorage.getItem("davlatjon-lab:v1");
    if (!raw) return;
    const s = JSON.parse(raw);
    s.settings.lang = "uz";
    localStorage.setItem("davlatjon-lab:v1", JSON.stringify(s));
  });
  for (const hash of ["", "#present"]) {
    await page.goto(`/uz/chess/mentor${hash}`);
    await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
    await expect(root(page)).toHaveAttribute("data-mentor-ready", "");
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const lines = (await page.locator("main").innerText())
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => /[А-Яа-яЁё]/.test(l));
    expect(lines, hash || "page").toEqual([]);
  }
});

test.describe("режим класса", () => {
  test.skip(({ isMobile }) => isMobile, "размеры панели проверяем в настольном браузере");

  for (const [w, h, min] of [
    [1920, 1080, 0.88],
    [3840, 2160, 0.88],
    [1366, 768, 0.85],
    [1280, 800, 0.85],
    [1024, 768, 0.85],
  ] as const)
    test(`${w}×${h}: доска во всю высоту, кнопки крупные и в зоне досягаемости, страница не листается`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: w, height: h });
      await open(page);
      await page.locator("[data-mentor-present-button]").click();
      await expect(root(page)).toHaveAttribute("data-present", "");
      await expect(page).toHaveURL(/#present$/);
      await expect(page.locator("[data-site-header]")).toBeHidden();
      await expect(page.locator("[data-site-footer]")).toBeHidden();
      const m = await page.evaluate(() => {
        const frame = document.querySelector('[data-board="mentor"]')!.getBoundingClientRect();
        const turn = document.querySelector(".mentor-turn")!;
        const ctrls = [...document.querySelectorAll<HTMLElement>("[data-mentor-control]")].map((b) => {
          const r = b.getBoundingClientRect();
          return {
            name: (b.getAttribute("aria-label") || b.innerText).trim(),
            w: r.width,
            h: r.height,
            cy: (r.top + r.height / 2) / innerHeight,
            left: r.left / innerWidth,
            right: (innerWidth - r.right) / innerWidth,
            hot: b.dataset.mentorControl === "hot",
          };
        });
        return {
          side: Math.min(frame.width, frame.height),
          scroll: document.scrollingElement!.scrollHeight,
          hscroll: document.scrollingElement!.scrollWidth,
          turnFont: parseFloat(getComputedStyle(turn).fontSize),
          ctrls,
        };
      });
      expect(m.scroll).toBeLessThanOrEqual(h);
      expect(m.hscroll).toBeLessThanOrEqual(w);
      expect(m.side / h).toBeGreaterThanOrEqual(min);
      expect(m.turnFont / h).toBeGreaterThanOrEqual(w / h > 1.5 ? 0.045 : 0.025);
      expect(m.ctrls.length).toBeGreaterThan(10);
      for (const c of m.ctrls) {
        expect(c.w, c.name).toBeGreaterThanOrEqual(56);
        expect(c.h, c.name).toBeGreaterThanOrEqual(56);
        expect(c.cy, c.name).toBeGreaterThanOrEqual(0.1);
        expect(c.cy, c.name).toBeLessThanOrEqual(0.95);
        expect(c.left, c.name).toBeGreaterThanOrEqual(0.029);
        expect(c.right, c.name).toBeGreaterThanOrEqual(0.029);
        if (c.hot) expect(c.cy, c.name).toBeGreaterThanOrEqual(0.4);
      }
    });

  test("полный экран и «экран не гаснет» — по нажатию; «Назад» браузера выходит из режима класса", async ({ page }) => {
    await page.addInitScript(() => {
      const w = window as unknown as { __fs: number; __wake: number };
      w.__fs = 0;
      w.__wake = 0;
      Object.defineProperty(Document.prototype, "fullscreenEnabled", { get: () => true, configurable: true });
      Element.prototype.requestFullscreen = function () {
        w.__fs++;
        return Promise.resolve();
      };
      Object.defineProperty(navigator, "wakeLock", {
        value: {
          request: () => {
            w.__wake++;
            return Promise.resolve({ released: false, release: () => Promise.resolve() });
          },
        },
        configurable: true,
      });
    });
    await open(page);
    await sq(page, "e2").click();
    await sq(page, "e4").click();
    await page.locator("[data-mentor-present-button]").click();
    await expect(root(page)).toHaveAttribute("data-present", "");
    await expect.poll(() => page.evaluate(() => (window as unknown as { __fs: number }).__fs)).toBe(1);
    await expect.poll(() => page.evaluate(() => (window as unknown as { __wake: number }).__wake)).toBe(1);
    await page.goBack();
    await expect(root(page)).not.toHaveAttribute("data-present", /.*/);
    await expect(page).toHaveURL(/\/chess\/mentor$/);
    await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
    await expect(page.locator("[data-site-header]")).toBeVisible();
    // Кнопка «Выход» — то же самое и не оставляет в истории шага, который вернул бы режим класса.
    await page.locator("[data-mentor-present-button]").click();
    await expect(root(page)).toHaveAttribute("data-present", "");
    await page.locator("[data-mentor-exit]").click();
    await expect(root(page)).not.toHaveAttribute("data-present", /.*/);
    await expect(page).toHaveURL(/\/chess\/mentor$/);
  });

  test("шторка: точка, «и» на русской раскладке, нажатие на шторку; пробел на кнопке не листает ходы", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await open(page);
    await sq(page, "e2").click();
    await sq(page, "e4").click();
    await page.locator("[data-mentor-present-button]").click();
    await page.keyboard.press("Period");
    await expect(root(page)).toHaveAttribute("data-mentor-curtain", "");
    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "и", code: "KeyB" })));
    await expect(root(page)).not.toHaveAttribute("data-mentor-curtain", /.*/);
    await page.keyboard.press("Period");
    await page.locator("[data-mentor-curtain-layer]").click();
    await expect(root(page)).not.toHaveAttribute("data-mentor-curtain", /.*/);
    // Нажатие на шторку не выбрало фигуру и не сделало ход.
    await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
    await page.locator("[data-mentor-curtain-button]").focus();
    await page.keyboard.press("Space");
    await expect(root(page)).toHaveAttribute("data-mentor-curtain", "");
    await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
    // В режиме класса меню по долгому нажатию (правая кнопка) не открывается.
    const prevented = await page.evaluate(() =>
      ["[data-mentor-control]", '[data-mentor-part="info"]', '[data-coords="files"]'].map((sel) => {
        const e = new MouseEvent("contextmenu", { bubbles: true, cancelable: true });
        document.querySelector(sel)!.dispatchEvent(e);
        return e.defaultPrevented;
      }),
    );
    expect(prevented).toEqual([true, true, true]);
  });

  test("на других страницах подвал на месте", async ({ page }) => {
    await page.goto("/chess");
    await expect(page.locator("[data-site-footer]")).toBeVisible();
  });
});

test("телефон: касание двумя пальцами не делает ход", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "только сенсорный экран");
  await open(page);
  const a = (await sq(page, "e2").boundingBox())!;
  const b = (await sq(page, "e4").boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  const pt = (box: { x: number; y: number; width: number; height: number }, id: number) => ({
    x: box.x + box.width / 2,
    y: box.y + box.height / 2,
    id,
  });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [pt(a, 1)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [pt(a, 1), pt(b, 2)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [pt(a, 1)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [pt(b, 1)] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(200);
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "0");
  // Те же касания одним пальцем — ход делается: значит, ход выше не сделан именно из-за второго пальца.
  for (const box of [a, b]) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [pt(box, 1)] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  }
  await expect(root(page)).toHaveAttribute("data-mentor-ply", "1");
});

test("меньше движения: стрелка появляется сразу, без анимации", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Анимации в настройках включены — выключает их только системное «меньше движения».
  await page.addInitScript(() => {
    const s = JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}");
    s.settings = { ...s.settings, animations: true };
    localStorage.setItem("davlatjon-lab:v1", JSON.stringify(s));
  });
  await open(page);
  await page.locator('[data-mentor-mode-button="draw"]').click();
  await sq(page, "e2").click();
  await sq(page, "e4").click();
  await page.waitForTimeout(50);
  const running = await page.evaluate(
    () =>
      document
        .getAnimations()
        .filter((a) => a.playState === "running" && Number(a.effect?.getComputedTiming().duration ?? 0) > 1).length,
  );
  expect(running).toBe(0);
  const opacity = await page
    .locator('[data-mentor-arrow="e2e4"] [data-mentor-core]')
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(opacity)).toBeGreaterThan(0.9);
});
