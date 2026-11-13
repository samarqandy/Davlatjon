import { expect, test, type Page } from "@playwright/test";

/** Библиотека знаменитых партий: шестнадцать партий, отбор по теме, партия, которая кончается сдачей. */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([l, key]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

test("партии: шестнадцать карточек; тема сужает список, «Все» возвращает", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/games");
  const cards = page.locator("[data-game-card]");
  await expect(cards).toHaveCount(16);
  await expect(page.locator("[data-game-count]")).toHaveText("Партий: 16");

  await page.locator('[data-game-tag="endgame"]').click();
  await expect(page.locator('[data-game-tag="endgame"]')).toHaveAttribute("aria-pressed", "true");
  await expect(cards).toHaveCount(2);
  await expect(page.locator('[data-game-card="ding-gukesh"]')).toContainText("Самый юный чемпион");
  await expect(page.locator("[data-game-count]")).toHaveText("Партий: 2");

  await page.locator('[data-game-tag="uzbekistan"]').click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Рустам Касымджанов");

  await page.locator('[data-game-tag="trap"]').click();
  await expect(cards).toHaveCount(3);

  await page.getByRole("button", { name: "Все", exact: true }).click();
  await expect(cards).toHaveCount(16);
});

test("партия со сдачей: последний ход объясняет, чем всё кончилось", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/games");
  await page.locator('[data-game-card="carlsen-karjakin"]').click();
  await expect(page).toHaveURL(/\/chess\/games\/carlsen-karjakin$/);
  await expect(page.getByRole("heading", { level: 1, name: "Ферзь в подарок" })).toBeVisible();
  await expect(page.getByText("Магнус Карлсен — Сергей Карякин · 1-0")).toBeVisible();
  const nav = page.getByRole("group", { name: "Просмотр ходов" });
  await nav.getByRole("button", { name: "В конец" }).click();
  await expect(nav).toContainText("99 / 99");
  await expect(page.getByText(/Жертва ферзя! Возьмёт король — ладья ставит мат на h8/)).toBeVisible();
  // Ферзь стоит на h6 под боем короля и пешки.
  await expect(page.locator('[data-board="game-carlsen-karjakin"] [data-square="h6"] [data-piece="wQ"]')).toBeVisible();
  // Разобранная партия отмечается в списке.
  await page.goto("/chess/games");
  await expect(page.locator('[data-game-card="carlsen-karjakin"]')).toContainText("разобрана");
});

test("«Угадай ход» в партии за чёрных: Гукеш ходит вторым", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/games/ding-gukesh");
  await expect(page.getByText(/Сыграй как Гукеш Доммараджу/)).toBeVisible();
  await page.getByRole("button", { name: "Играть «Угадай ход»" }).click();
  await expect(page.getByText(/Твой ход за чёрных/)).toBeVisible();
});

test("partiyalar oʻzbekcha: mavzular, Qosimjonov partiyasi — kirill harfisiz", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/games");
  await expect(page.locator("[data-game-card]")).toHaveCount(16);
  await page.locator('[data-game-tag="uzbekistan"]').click();
  await expect(page.locator('[data-game-tag="uzbekistan"]')).toHaveText("Oʻzbekiston");
  const card = page.locator('[data-game-card="kasimdzhanov-adams"]');
  await expect(card).toContainText("Toshkentlik chempionning gʻalabasi");
  await card.click();
  await expect(page.getByRole("heading", { level: 1, name: "Toshkentlik chempionning gʻalabasi" })).toBeVisible();
  const nav = page.getByRole("group", { name: "Yurishlarni koʻrish" });
  await nav.getByRole("button", { name: "Oxiriga" }).click();
  await expect(page.getByText(/Adams taslim boʻldi/).first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/[а-яё]/i);
});
