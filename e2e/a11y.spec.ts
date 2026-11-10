import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Доступность: axe-core проверяет главные экраны на нарушения WCAG 2.1 A и AA (контраст, подписи кнопок и полей,
 * роли, порядок заголовков). Проверяем серьёзные и критические нарушения — они мешают пользоваться страницей.
 */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, theme?: "dark") {
  await page.addInitScript(
    ([key, th]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: {
            hintPause: false,
            bigText: false,
            age: 9,
            lang: "ru",
            sound: false,
            animations: false,
            theme: th,
          },
        }),
      );
    },
    [KEY, theme] as const,
  );
}

const PAGES = [
  "/",
  "/week/1/day/1#task-1",
  "/chess",
  "/chess/course",
  "/chess/puzzles",
  "/chess/puzzles#practice",
  "/chess/play",
  "/achievements",
  "/my-problems",
  "/about",
];

async function violations(page: Page, url: string) {
  await page.goto(url, { waitUntil: "networkidle" });
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  return result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => `${url} — ${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(" ")}`);
}

test("главные экраны: нет серьёзных нарушений доступности (светлая тема)", async ({ page }) => {
  test.slow();
  await prepare(page);
  const found: string[] = [];
  for (const url of PAGES) found.push(...(await violations(page, url)));
  expect(found).toEqual([]);
});

test("главные экраны: нет серьёзных нарушений доступности (тёмная тема)", async ({ page }) => {
  test.slow();
  await prepare(page, "dark");
  const found: string[] = [];
  for (const url of PAGES) found.push(...(await violations(page, url)));
  expect(found).toEqual([]);
});
