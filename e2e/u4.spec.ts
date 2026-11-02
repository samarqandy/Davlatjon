import { expect, test, type Page } from "@playwright/test";

/**
 * U4: доска с клавиатуры, праздник за пройденную тему, цвет хода (верно/не то), выключатель анимаций
 * для CSS, фокус на новой задаче, PIN-ошибка для диктора.
 */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, extra: Record<string, unknown> = {}, settings: Record<string, unknown> = {}) {
  await page.addInitScript(
    ([key, more, s]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, lang: "ru", sound: false, ...s },
          ...more,
        }),
      );
    },
    [KEY, extra, settings] as const,
  );
}

const solved = (ids: string[]) =>
  Object.fromEntries(ids.map((id) => [id, { solvedAt: Date.now() - 60_000, misses: 0 }]));

/** Подсветка клетки: библиотека красит внутренний слой клетки. */
const squareColor = (page: Page, board: string, sq: string) =>
  page
    .locator(`[data-board="${board}"] [data-square="${sq}"] > div`)
    .last()
    .evaluate((el) => getComputedStyle(el).backgroundColor);

const OTHERS = ["c1-check-rook", "c1-check-knight", "c1-check-bishop", "c1-check-queen", "c1-check-pawn"];

test("доска с клавиатуры: Tab на доску, стрелки, Enter — упражнение решается без мыши, тема — с праздником", async ({
  page,
}) => {
  await prepare(page, { chess: solved(OTHERS) });
  await page.goto("/chess/course#c1-check-exercise-1");
  const board = page.locator('[data-board="pk-king-who-checks"]');
  await expect(board).toHaveAttribute("role", "application");
  // Фигуры — не отдельные остановки Tab: доска — одна.
  await expect(board.locator('[aria-roledescription="draggable"][tabindex]')).toHaveCount(0);
  await board.focus();
  await expect(board).toHaveAttribute("data-cursor", "d4");
  await page.keyboard.press("ArrowDown");
  await expect(board).toHaveAttribute("data-cursor", "d3");
  await expect(board.locator("[data-board-said]")).toContainText("d3");
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-celebration]")).toBeVisible();
  await expect(page.locator("[data-celebration]")).toContainText("Тема пройдена");
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["king-who-checks"]?.solvedAt).toBeTruthy();
});

test("пройденная раньше тема при новом заходе — без салюта", async ({ page }) => {
  await prepare(page, { chess: solved(["king-who-checks", ...OTHERS]) });
  await page.goto("/chess/course#c1-check-exercise-1");
  await expect(page.getByRole("button", { name: /Упражнение 1: .*\(решено\)/ })).toBeVisible();
  await expect(page.locator("[data-celebration]")).toHaveCount(0);
});

test("ход с клавиатуры: выбрать фигуру и клетку; верная клетка — зелёная", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course#c1-check-exercise-2");
  const board = page.locator('[data-board="mo-c1-check-rook"]');
  await board.focus();
  for (const key of ["Home", "PageDown", "Enter", "PageUp"]) await page.keyboard.press(key);
  await expect(board).toHaveAttribute("data-cursor", "a8");
  await page.keyboard.press("Enter");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  expect(await squareColor(page, "mo-c1-check-rook", "a8")).toContain("16, 185, 129");
});

test("неверный ход — клетка красная, пока ход не вернулся", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/course#c1-check-exercise-2");
  const sq = (s: string) => page.locator(`[data-board="mo-c1-check-rook"] [data-square="${s}"]`);
  await sq("a1").click();
  await sq("a5").click();
  await expect(page.getByText("Это не шах.")).toBeVisible();
  expect(await squareColor(page, "mo-c1-check-rook", "a5")).toContain("239, 68, 68");
});

test("родитель выключил анимации: html[data-motion=off] и CSS-анимации не крутятся", async ({ page }) => {
  await prepare(page, {}, { animations: false });
  await page.goto("/week/1/day/1");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "off");
  await page.waitForTimeout(300);
  const running = await page.evaluate(
    () =>
      document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations === Infinity)
        .length,
  );
  expect(running).toBe(0);
});

test("«Дальше» — фокус на заголовке новой задачи", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/1/day/7#task-2");
  await page.getByRole("button", { name: "Дальше →" }).last().click();
  await expect(page).toHaveURL(/#task-3$/);
  const focused = await page.evaluate(() => document.activeElement?.hasAttribute("data-step-heading"));
  expect(focused).toBe(true);
});

test("PIN-коды не совпали — сообщение для диктора (role=alert), поле помечено", async ({ page }) => {
  await prepare(page);
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("1234");
  await pins.nth(1).fill("4321");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.locator("#pin-error[role=alert]")).toContainText("не совпадают");
  await expect(pins.nth(0)).toHaveAttribute("aria-invalid", "true");
});
