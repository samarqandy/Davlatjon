import { expect, test, type Page } from "@playwright/test";

/** Узбекский интерфейс: язык выбран заранее, приветствие пропущено. */
async function uzbek(page: Page, extra: Record<string, unknown> = {}) {
  await page.addInitScript((more) => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, lang: "uz", age: 9 },
          ...more,
        }),
      );
    }
  }, extra);
}

const CYRILLIC = /[А-Яа-яЁё]/;

/**
 * Текст страницы без кириллицы. Исключения: таблица «как фигура называется на разных языках»
 * и переключатель языка, где русский язык назван по-русски.
 */
const ALLOWED = [/ruscha:/i, /^Русский$/, /^Til · Язык$/];

async function expectNoCyrillic(page: Page, url: string) {
  await page.goto(url);
  // Ждём, пока страница перейдёт на узбекский (LangSync ставит отметку после гидратации).
  await expect(page.locator("html")).toHaveAttribute("data-lang", "uz");
  const text = await page.locator("body").innerText();
  const bad = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => CYRILLIC.test(line) && !ALLOWED.some((re) => re.test(line)));
  expect(bad, url).toEqual([]);
}

test.describe("oʻzbek tili", () => {
  test.beforeEach(async ({ page }) => {
    await uzbek(page);
  });

  const pages = [
    "/",
    "/week/1/day/1",
    "/week/2/day/4",
    "/week/3/day/6",
    "/week/1/day/1/print",
    "/my-problems",
    "/chess",
    "/chess/pawn",
    "/chess/queen",
    "/chess/secrets",
    "/chess/puzzles",
    "/chess/play",
    "/chess/openings",
    "/chess/games",
    "/chess/games/opera",
    "/chess/review",
    "/chess/coordinates",
    "/chess/awards",
    "/chess/diary",
    "/chess/history",
    "/chess/endgames",
    "/chess/analysis",
    "/chess/drills",
    "/chess/drills#knight",
    "/chess/certificate/pawn",
  ];

  for (const url of pages) {
    test(`sahifada rus harflari yoʻq: ${url}`, async ({ page }) => {
      await expectNoCyrillic(page, url);
    });
  }

  test("ota-onalar boʻlimi ham oʻzbekcha", async ({ page }) => {
    await page.goto("/parent");
    const pins = page.locator('input[type="password"]');
    await pins.nth(0).fill("2468");
    await pins.nth(1).fill("2468");
    await page.getByRole("button", { name: "Saqlash" }).click();
    await expect(page.locator("main")).toBeVisible();
    for (const url of [
      "/parent",
      "/parent/week/1/day/1",
      "/parent/week/3/review",
      "/parent/guide",
      "/parent/chess",
      "/parent/settings",
    ]) {
      await expectNoCyrillic(page, url);
    }
  });

  test("tab sarlavhasi va yurishlar yozuvi — oʻzbekcha", async ({ page }) => {
    await page.goto("/chess/pawn");
    await expect(page).toHaveTitle(/Shaxmat · Piyoda · Davlatjon$/);
    await page.goto("/chess/games/opera");
    await expect(page.locator("main")).toContainText("♘");
  });
});

test("tilni almashtirish: RU → UZ → RU, tanlov saqlanadi", async ({ page }) => {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, bigText: false } }),
      );
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Математика — это место/ })).toBeVisible();
  await page.getByRole("button", { name: "UZ" }).click();
  await expect(page.getByRole("heading", { name: /Matematika/ })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "uz");
  // Переходим по ссылке: при перезагрузке init-скрипт не должен затереть выбор (он пишет, только если пусто).
  await page.reload();
  await expect(page.getByRole("heading", { name: /Matematika/ })).toBeVisible();
  await page.getByRole("button", { name: "RU" }).click();
  await expect(page.getByRole("heading", { name: /Математика — это место/ })).toBeVisible();
});

test("endshpil: kvadrat qoidasi va yagona toʻgʻri yurish", async ({ page }) => {
  await uzbek(page);
  await page.goto("/chess/endgames");
  await expect(page.getByRole("heading", { name: "Endshpil maktabi" })).toBeVisible();
  const first = page.locator("#square li").first();
  await first.getByRole("button", { name: /Yetib oladi/ }).click();
  await expect(first.getByText("Toʻgʻri!")).toBeVisible();
  // Оппозиция: белый король d4 → e4.
  const opp = page.locator("#opposition li").first();
  await opp.locator('[data-square="d4"]').click();
  await opp.locator('[data-square="e4"]').click();
  await expect(opp.getByText("Toʻgʻri!")).toBeVisible();
});

test("tahlil taxtasi: yurish, orqaga, FEN", async ({ page }) => {
  await uzbek(page);
  await page.goto("/chess/analysis");
  await expect(page.getByRole("heading", { name: "Tahlil taxtasi" })).toBeVisible();
  await page.locator('[data-board="analysis"] [data-square="e2"]').click();
  await page.locator('[data-board="analysis"] [data-square="e4"]').click();
  await expect(page.getByRole("button", { name: /1\. e4/ })).toBeVisible();
  await page.getByRole("button", { name: "Orqaga" }).click();
  await expect(page.getByText("Oqlar yuradi")).toBeVisible();
});

test("kirish: sozlanmagan saytda hisobsiz ishlashi aytiladi", async ({ page }) => {
  await uzbek(page);
  await page.goto("/parent/settings");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Saqlash" }).click();
  await expect(page.getByRole("heading", { name: /Hisob/ })).toBeVisible();
  await expect(page.getByText(/Hisobsiz ham hammasi ishlaydi/)).toBeVisible();
  const me = await page.request.get("/api/auth/me");
  expect(await me.json()).toEqual({ user: null, providers: { google: false, telegram: false } });
});
