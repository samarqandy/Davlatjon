import { expect, test, type Page } from "@playwright/test";

/** Мини-игры без королей (MINI-1): выбор на странице игры, ход ребёнка, ответ робота, запись в историю. */

const board = (page: Page) => page.locator('[data-board="play"]');
const sq = (page: Page, square: string) => board(page).locator(`[data-square="${square}"]`);

test("«Ладья против пешек»: ребёнок берёт пешку, робот отвечает, ходов короля нет", async ({ page }) => {
  await page.goto("/chess/play");
  const section = page.locator("[data-mini-games]");
  await expect(section.getByRole("heading", { name: /Мини-игры без королей/ })).toBeVisible();
  await expect(section.locator("[data-mini-start]")).toHaveCount(10);
  await section.locator('[data-mini-start="rook-1"]').click();
  await expect(page).toHaveURL(/#mini-rook-1$/);
  await expect(page.getByRole("heading", { level: 1, name: /Ладья против пешек/ })).toBeVisible();
  await expect(page.locator("[data-mini-about]")).toContainText("Королей нет");
  // Ладья a1 забирает пешку a7: её никто не защищает.
  await sq(page, "a1").click();
  await sq(page, "a7").click();
  await expect(sq(page, "a7").locator("[data-piece]")).toHaveAttribute("data-piece", "wR");
  // Робот ответил: одна из оставшихся пешек b7, c7, d7 сделала ход.
  await expect
    .poll(
      async () => {
        let left = 0;
        for (const s of ["b7", "c7", "d7"]) left += await sq(page, s).locator('[data-piece="bP"]').count();
        return left;
      },
      { timeout: 10_000 },
    )
    .toBe(2);
  await expect(page.locator("[data-play-status]")).not.toContainText(/Победа|выиграл/);
});

test("oʻzbekcha: mini-oʻyinlar boʻlimi va oʻyin ekrani kirill harfisiz", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "davlatjon-lab:v1",
      JSON.stringify({
        version: 1,
        welcomed: true,
        settings: { hintPause: false, bigText: false, lang: "uz", age: 9 },
      }),
    );
  });
  await page.goto("/chess/play");
  await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
  const section = page.locator("[data-mini-games]");
  await expect(section.getByRole("heading", { name: /Shohsiz mini-oʻyinlar/ })).toBeVisible();
  expect(await section.innerText()).not.toMatch(/[А-Яа-яЁё]/);
  await section.locator('[data-mini-start="squad-2"]').click();
  await expect(page.getByRole("heading", { level: 1, name: /Qoʻshin qoʻshinga qarshi/ })).toBeVisible();
  expect(await page.locator("[data-mini-about]").innerText()).not.toMatch(/[А-Яа-яЁё]/);
});
