import { expect, test, type Page } from "@playwright/test";

/** Приветствие пропущено; звуки доски записываются в window.__sfx. */
async function prepare(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, bigText: false, age: 9 } }),
      );
    const w = window as unknown as { __sfx: string[] };
    w.__sfx = [];
    window.addEventListener("board-sfx", (e) => w.__sfx.push((e as CustomEvent<string>).detail));
  });
}

const board = (page: Page) => page.locator('[data-board="analysis"]');
const sq = (page: Page, square: string) => board(page).locator(`[data-square="${square}"]`);
const text = async (page: Page, what: "files" | "ranks") =>
  (await board(page).locator(`[data-coords="${what}"]`).innerText()).replace(/\s/g, "");

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

test("на рамке доски — буквы снизу и цифры слева; при повороте доски они тоже поворачиваются", async ({ page }) => {
  await page.goto("/chess/analysis");
  expect(await text(page, "files")).toBe("abcdefgh");
  expect(await text(page, "ranks")).toBe("87654321");
  await page.getByRole("button", { name: /Перевернуть/ }).click();
  await expect.poll(() => text(page, "files")).toBe("hgfedcba");
  expect(await text(page, "ranks")).toBe("12345678");
});

test("ход, взятие — у каждого свой звук", async ({ page }) => {
  await page.goto("/chess/analysis");
  for (const [from, to] of [
    ["e2", "e4"],
    ["d7", "d5"],
    ["e4", "d5"],
  ]) {
    await sq(page, from).click();
    await sq(page, to).click();
  }
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __sfx: string[] }).__sfx))
    .toEqual(["move", "move", "capture"]);
});

test("пешка дошла до края — ребёнок сам выбирает фигуру", async ({ page }) => {
  await page.goto("/chess/analysis#fen=8/4P3/8/8/8/k7/8/K7_w_-_-_0_1");
  await sq(page, "e7").click();
  await sq(page, "e8").click();
  const picker = page.locator('[data-promotion="e8"]');
  await expect(picker).toBeVisible();
  await picker.getByRole("button", { name: "Конь" }).click();
  await expect(picker).toHaveCount(0);
  await expect(page.getByRole("button", { name: /e8=К/ })).toBeVisible();
});

test("ход связанной фигурой: доска объясняет, почему нельзя", async ({ page }) => {
  await page.goto("/chess/analysis#fen=4r1k1/8/8/8/8/8/4N3/4K3_w_-_-_0_1");
  await sq(page, "e2").click();
  await sq(page, "c3").click();
  await expect(board(page)).toHaveAttribute("data-rejected", "c3");
  await expect(page.locator("[data-illegal]")).toContainText("закрывает короля");
});

test("на телефоне касание с дрожанием пальца — всё равно нажатие", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "только сенсорный экран");
  await page.goto("/chess/analysis");
  const box = (await sq(page, "e2").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 3, y: y + 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  // Пешка выбрана: на e4 видна точка «сюда можно».
  await expect(sq(page, "e4").locator("div").first()).toHaveAttribute("style", /radial-gradient/);
});

test("цвета доски и набор звуков выбираются в «Моя доска и звук» и запоминаются", async ({ page }) => {
  await page.goto("/chess/play");
  await page.locator("[data-board-look-details] summary").click();
  await page.locator('[data-board-theme-pick="violet"]').click();
  await page.locator('[data-sound-set-pick="soft"]').click();
  await expect(page.locator('[data-board-theme-pick="violet"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-sound-set-pick="soft"]')).toHaveAttribute("aria-checked", "true");
  await page.goto("/chess/analysis");
  await expect(board(page)).toHaveAttribute("data-board-theme", "violet");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}").settings);
  expect(stored.boardTheme).toBe("violet");
  expect(stored.boardSoundSet).toBe("soft");
});
