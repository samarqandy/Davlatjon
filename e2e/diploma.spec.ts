import { expect, test, type Page } from "@playwright/test";
import { CHESS_RU, courseLessons } from "../src/content/chess/content";

/** Диплом ступени «Пешка»: закрыт, пока не решены итоговый тест и 80 % курса; потом — лист с именем ребёнка. */
const KEY = "davlatjon-lab:v1";
const lessons = courseLessons(CHESS_RU);
const ALL = [...new Set(lessons.flatMap((l) => l.exercises.map((e) => e.id)))];

async function prepare(page: Page, solved: string[], name?: string) {
  await page.addInitScript(
    ([key, ids, childName]) => {
      if (localStorage.getItem(key)) return;
      const chess = Object.fromEntries(ids.map((id) => [id, { solvedAt: Date.now() - 60_000, misses: 0 }]));
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { age: 9, lang: "ru", sound: false, animations: false, ...(childName ? { childName } : {}) },
          chess,
        }),
      );
    },
    [KEY, solved, name ?? ""] as const,
  );
}

test("диплом закрыт: видно, сколько осталось, есть путь к итоговому тесту", async ({ page }) => {
  await prepare(page, ALL.slice(0, 5));
  await page.goto("/chess/course");
  await expect(page.locator('[data-diploma-card="locked"]')).toBeVisible();
  await page.locator("[data-diploma-card]").click();
  await expect(page).toHaveURL(/\/chess\/course\/diploma$/);
  await expect(page.locator('[data-diploma="locked"]')).toBeVisible();
  await expect(page.getByRole("link", { name: "К итоговому тесту →" })).toBeVisible();
});

test("диплом получен: лист с именем и датой, карточка на странице курса", async ({ page }) => {
  await prepare(page, ALL, "Анна");
  await page.goto("/chess/course");
  await expect(page.locator('[data-diploma-card="earned"]')).toBeVisible();
  await page.goto("/chess/course/diploma");
  const sheet = page.locator('[data-certificate="earned"]');
  await expect(sheet).toBeVisible();
  await expect(sheet).toContainText("Диплом");
  await expect(sheet).toContainText("Пешка");
  await expect(page.locator("[data-certificate-name]")).toHaveText("Анна");
  // Логотип Parvoz Edu на листе загружен.
  const logo = sheet.locator("[data-certificate-logo]");
  await expect(logo).toBeVisible();
  expect(await logo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
});

test("диплом ступени «Конь»: открывается после итогового теста ступени 2", async ({ page }) => {
  const step2 = [
    ...new Set(courseLessons(CHESS_RU, CHESS_RU.course2Lessons).flatMap((l) => l.exercises.map((e) => e.id))),
  ];
  await prepare(page, step2, "Анна");
  await page.goto("/chess/course-2");
  await expect(page.locator('[data-diploma-card="earned"]')).toBeVisible();
  await page.goto("/chess/course-2/diploma");
  const sheet = page.locator('[data-certificate="earned"]');
  await expect(sheet).toContainText("Диплом");
  await expect(sheet).toContainText("Конь");
  await expect(page.locator("[data-certificate-name]")).toHaveText("Анна");
});
