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
  "/chess/tournaments",
  "/chess/tournaments#new",
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

/**
 * Область нажатия: на телефоне любая кнопка, поле и ссылка-блок — не меньше 44 px (ребёнок попадает пальцем).
 * Не считаем: клетки доски (их размер задаёт доска), ссылки внутри строки текста, флажки и переключатели
 * (нажимается вся подпись), ссылку «Перейти к содержимому» (видна только с клавиатуры).
 * У сегментов полоски задач высота та же — 44 px, а ширина может быть меньше: их много в одну строку.
 */
const TOUCH_PAGES = [
  "/",
  "/week/1/day/1",
  "/week/1/day/1#task-1",
  "/week/1/day/1#finish",
  "/chess",
  "/chess/course",
  "/chess/course#c1-rook-exercise-1",
  "/chess/puzzles",
  "/chess/puzzles#practice",
  "/chess/play",
  "/chess/play#robot-1-w",
  "/chess/pawn",
  "/chess/tactics",
  "/chess/endgames",
  "/chess/secrets",
  "/chess/history",
  "/achievements",
  "/my-problems",
  "/quick",
  "/chess/tournaments",
  "/chess/tournaments#new",
];

test("область нажатия на телефоне: кнопки, поля и ссылки-блоки не меньше 44 px", async ({ page, isMobile }) => {
  test.skip(!isMobile, "область нажатия проверяем на телефоне");
  test.slow();
  await prepare(page);
  const small: string[] = [];
  for (const url of TOUCH_PAGES) {
    await page.goto("/privacy");
    await page.waitForLoadState("networkidle");
    await page.goto(url);
    await page.waitForLoadState("networkidle");
    // Раскрывающиеся блоки проверяем вместе с тем, что внутри.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const found = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("a[href],button,input,select,summary,[role=button]")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          if (r.width <= 1 || r.height <= 1 || cs.visibility === "hidden") return false;
          if (el.closest("[data-board]") || el.classList.contains("sr-only")) return false;
          if (el instanceof HTMLInputElement && ["checkbox", "radio", "range"].includes(el.type)) return false;
          if (el.tagName === "A" && cs.display === "inline") return false;
          const strip = !!el.closest("[data-step-strip]") || !!el.closest("header ol");
          return r.height < 43.5 || r.width < (strip ? 24 : 43.5);
        })
        .map((el) => {
          const r = el.getBoundingClientRect();
          const name = (el.getAttribute("aria-label") || el.innerText || "").trim().slice(0, 24);
          return `${Math.round(r.width)}×${Math.round(r.height)} «${name}»`;
        }),
    );
    small.push(...found.map((x) => `${url}: ${x}`));
  }
  expect(small).toEqual([]);
});
