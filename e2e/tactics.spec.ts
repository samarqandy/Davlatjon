import { expect, test, type Page } from "@playwright/test";

/** Тактика: четыре темы, урок, упражнения «найди ход» с проверкой, прогресс и узбекская версия. */
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
          settings: { hintPause: false, bigText: false, age: 9, lang: l, sound: false, animations: false },
        }),
      );
    },
    [lang, KEY] as const,
  );
}

const square = (page: Page, id: string, sq: string) =>
  page.locator(`[data-board="mo-${id}"] [data-square="${sq}"]`).click();

test("тактика: четыре темы, урок листается, упражнение проверяет ход и сохраняет прогресс", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess");
  await page.locator("[data-more-sections] summary").click();
  await page.locator('a[href="/chess/tactics"]').first().click();
  await expect(page.getByRole("heading", { name: /Тактика/ })).toBeVisible();
  for (const id of ["fork", "pin", "skewer", "discover"])
    await expect(page.locator(`[data-tactic="${id}"]`)).toBeVisible();

  await page.locator('[data-tactic="fork"]').click();
  await expect(page.getByRole("heading", { name: "Одна фигура — две цели" })).toBeVisible();
  await page.getByRole("button", { name: /Дальше/ }).click();
  await expect(page.getByRole("heading", { name: "Ладья и слон" })).toBeVisible();

  await page.goto("/chess/tactics#fork-exercise-1");
  // Неверный ход: ладья не нападает на две цели.
  await square(page, "tac-fork-rook", "d1");
  await square(page, "tac-fork-rook", "d2");
  await expect(page.getByText(/Пока нападение только на одну цель/)).toBeVisible();
  await page.waitForTimeout(1900); // позиция сама возвращается к началу
  // Верный ход.
  await square(page, "tac-fork-rook", "d1");
  await square(page, "tac-fork-rook", "d5");
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY);
  expect(stored["tac-fork-rook"]?.solvedAt).toBeTruthy();
});

test("тактика: связка — верный ход принимается, а ход без связки получает подсказку", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/tactics#pin-exercise-1");
  await square(page, "tac-pin-bishop", "f1");
  await square(page, "tac-pin-bishop", "c4");
  await expect(page.getByText(/Связки пока нет/)).toBeVisible();
  await page.waitForTimeout(1900);
  await square(page, "tac-pin-bishop", "f1");
  await square(page, "tac-pin-bishop", "b5");
  await expect(page.getByText(/Почему так/)).toBeVisible();
});

test("тактика по-узбекски: темы и упражнения без русских букв", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/chess/tactics");
  await expect(page.getByRole("heading", { name: /Taktika/ })).toBeVisible();
  await page.locator('[data-tactic="skewer"]').click();
  await expect(page.getByRole("heading", { name: "Rentgen, yaʼni oʻtib ketuvchi zarba" })).toBeVisible();
  const main = await page.locator("main").innerText();
  expect(main).not.toMatch(/[А-Яа-яЁё]/);
  await page.goto("/chess/tactics#skewer-exercise-2");
  await square(page, "tac-skewer-bishop", "h3");
  await square(page, "tac-skewer-bishop", "g2");
  await expect(page.getByText(/Nega shunday/)).toBeVisible();
});
