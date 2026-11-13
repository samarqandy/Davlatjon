import { expect, test, type Page } from "@playwright/test";

/** Школа эндшпиля, часть 2 (ладья, ферзь, слон): вход со страницы эндшпиля, урок, упражнения, вопросы, узбекская версия. */
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

/** Переход по якорю на той же странице — после полной загрузки, иначе Next вернёт начальный адрес. */
async function openHash(page: Page, url: string) {
  await page.waitForLoadState("networkidle");
  await page.goto(url);
}

const solved = (page: Page) =>
  page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").chess ?? {}, KEY) as Promise<
    Record<string, { solvedAt?: string }>
  >;

test("эндшпиль, часть 2: карточка на странице эндшпиля ведёт к пяти урокам", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/endgames");
  const link = page.locator("[data-endgame-pieces-link]");
  await expect(link).toContainText("Ладья, ферзь и слон");
  await expect(link).toContainText("0 / 10");
  await link.click();
  await expect(page).toHaveURL(/\/chess\/endgames\/pieces$/);
  await expect(page.getByRole("heading", { level: 1, name: "Эндшпиль: ладья, ферзь и слон" })).toBeVisible();
  await expect(page.locator("[data-endgame-topic]")).toHaveCount(5);
  await page.locator('[data-endgame-topic="eg-lucena"]').click();
  await expect(page).toHaveURL(/#eg-lucena$/);
  await expect(page.getByRole("heading", { level: 1, name: /Мост/ })).toBeVisible();
  await expect(page.getByText("Урок 1", { exact: true })).toBeVisible();
});

test("мост: ранний мост — «не лучший выбор», король к ладье — верно; затем сам мост", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/endgames/pieces");
  await openHash(page, "/chess/endgames/pieces#eg-lucena-exercise-1");
  await page.locator('[data-choice="c4f4"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="f6e5"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  await openHash(page, "/chess/endgames/pieces#eg-lucena-exercise-2");
  await page.locator('[data-choice="c4e4"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
  const stored = await solved(page);
  for (const id of ["eg-lucena-king", "eg-lucena-bridge"]) expect(stored[id]?.solvedAt, id).toBeTruthy();
  // Прогресс виден в списке уроков и на карточке школы эндшпиля.
  await openHash(page, "/chess/endgames/pieces");
  await expect(page.locator('[data-endgame-topic="eg-lucena"]')).toContainText("✓ пройдено");
  await page.goto("/chess/endgames");
  await expect(page.locator("[data-endgame-pieces-link]")).toContainText("2 / 10");
});

test("Филидор: защищаются чёрные — доска повёрнута, ладья держит шестую горизонталь", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/endgames/pieces");
  await openHash(page, "/chess/endgames/pieces#eg-philidor-exercise-1");
  await expect(page.locator('[data-turn-mark="b"]').first()).toBeVisible();
  const board = page.locator('[data-board="ch-eg-philidor-wait"]');
  // Доска со стороны чёрных: h8 — левее и ниже, чем a1.
  const h8 = await board.locator('[data-square="h8"]').boundingBox();
  const a1 = await board.locator('[data-square="a1"]').boundingBox();
  expect(h8!.x).toBeLessThan(a1!.x);
  expect(h8!.y).toBeGreaterThan(a1!.y);
  await page.locator('[data-choice="h6h8"]').click();
  await expect(page.getByText("не лучший выбор")).toBeVisible();
  await page.locator('[data-choice="h6g6"]').click();
  await expect(page.getByText(/Почему так/)).toBeVisible();
});

test("ладейная и слоновая пешка: три вопроса про пат", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/endgames/pieces");
  await openHash(page, "/chess/endgames/pieces#eg-queen-rook-pawn-exercise-2");
  await expect(page.getByText("Вопрос 1 из 3")).toBeVisible();
  await page.getByRole("button", { name: "победа белых", exact: true }).click();
  await expect(page.getByText("Подумай ещё.")).toBeVisible();
  await page.getByRole("button", { name: "пат", exact: true }).click();
  await expect(page.getByText("Вопрос 2 из 3")).toBeVisible();
  await page.getByRole("button", { name: "пат", exact: true }).click();
  await expect(page.getByText("Вопрос 3 из 3")).toBeVisible();
  await page.getByRole("button", { name: "ладейной и слоновой", exact: true }).click();
  await expect(page.getByText(/Все ответы верные/)).toBeVisible();
  expect((await solved(page))["eg-queen-rook-pawn-quiz"]?.solvedAt).toBeTruthy();
});

test("endshpil, 2-qism oʻzbekcha: sarlavha, darslar va mashq — kirill harfisiz", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/endgames");
  await expect(page.locator("[data-endgame-pieces-link]")).toContainText("Rux, farzin va fil");
  await page.locator("[data-endgame-pieces-link]").click();
  // Ссылки внутри сайта — без «/uz»: язык берётся из настроек.
  await expect(page).toHaveURL(/\/chess\/endgames\/pieces$/);
  await expect(page.getByRole("heading", { level: 1, name: "Endshpil: rux, farzin va fil" })).toBeVisible();
  await expect(page).toHaveTitle(/Endshpil: rux, farzin va fil/);
  await expect(page.locator("main")).not.toContainText(/[а-яё]/i);
  await openHash(page, "/uz/chess/endgames/pieces#eg-wrong-bishop-exercise-2");
  await page.locator('[data-choice="a6a7"]').click();
  await page.locator('[data-choice="d3e4"]').click();
  await expect(page.locator("main")).toContainText("♗e4+!");
  await expect(page.locator("main")).not.toContainText(/[а-яё]/i);
});

test("словарь: термины эндшпиля — отдельным разделом, ссылка ведёт в урок", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/glossary");
  await page.locator('[data-glossary-group="endgame"]').click();
  const entries = page.locator("[data-glossary-entry]");
  await expect(entries).toHaveCount(8);
  await page.locator("[data-glossary-search]").fill("Лусены");
  await expect(entries).toHaveCount(1);
  await entries.first().getByRole("link").click();
  await expect(page).toHaveURL(/\/chess\/endgames\/pieces#eg-lucena$/);
  await expect(page.getByRole("heading", { level: 1, name: /Мост/ })).toBeVisible();
});
