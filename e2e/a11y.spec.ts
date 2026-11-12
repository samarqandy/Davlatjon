import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * Доступность: axe-core проверяет экраны на нарушения WCAG 2.1 A и AA (контраст, подписи кнопок и полей, роли)
 * и на «хорошую практику» (один главный заголовок, порядок заголовков, разные названия у областей страницы).
 *
 * Считаются нарушения любого уровня. До 12.11.2026 считались только серьёзные и только на двенадцати главных
 * экранах в начальном состоянии; широкий замер (63 экрана и 15 состояний после действий, обе темы, телефон и
 * ноутбук) нашёл то, что туда не попадало: белый текст на зелёной кнопке «готово» (2,5:1), подпись без роли
 * у взятых фигур, экраны упражнения и партии без главного заголовка, пропуск уровня заголовков в уроке.
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
  return scan(page, url);
}

async function scan(page: Page, where: string) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return result.violations.map(
    (v) => `${where} — ${v.impact} ${v.id} (${v.nodes.length}): ${v.nodes[0].target.join(" ")}`,
  );
}

test("главные экраны: нет нарушений доступности (светлая тема)", async ({ page }) => {
  test.slow();
  await prepare(page);
  const found: string[] = [];
  for (const url of PAGES) found.push(...(await violations(page, url)));
  expect(found).toEqual([]);
});

test("главные экраны: нет нарушений доступности (тёмная тема)", async ({ page }) => {
  test.slow();
  await prepare(page, "dark");
  const found: string[] = [];
  for (const url of PAGES) found.push(...(await violations(page, url)));
  expect(found).toEqual([]);
});

/** Экраны урока, упражнения, партии и просмотра — там, где ребёнок проводит больше всего времени. */
const SCREENS = [
  "/week/1/day/1#finish",
  "/chess/course#c1-rook",
  "/chess/course#c1-rook-exercise-1",
  "/chess/tactics#fork",
  "/chess/tactics#fork-dictionary",
  "/chess/pawn#exercise-1",
  "/chess/play#robot-1-w",
  "/chess/endgames",
  "/chess/endgames#square",
  "/chess/endgames#square-1",
  "/chess/openings#open-italian",
  "/chess/games/opera",
  "/chess/analysis",
  "/chess/history",
  "/chess/puzzles#theme-backrank",
  "/parent",
  "/quick",
];

for (const theme of [undefined, "dark"] as const)
  test(`урок, упражнение, партия: нет нарушений доступности (${theme ? "тёмная" : "светлая"} тема)`, async ({
    page,
  }) => {
    test.slow();
    await prepare(page, theme);
    const found: string[] = [];
    for (const url of SCREENS) found.push(...(await violations(page, url)));
    expect(found).toEqual([]);
  });

/** Состояния после действий: карточка ответа, ход на доске, подсказка — то, чего нет на только что открытом экране. */
const AFTER: [name: string, url: string, act: (page: Page) => Promise<void>][] = [
  [
    "упражнение: неверный ответ",
    "/chess/course-5#c5-only-move-exercise-3",
    async (page) => {
      await page.locator('[data-choice="h2h3"]').click();
      await expect(page.getByText("не лучший выбор")).toBeVisible();
    },
  ],
  [
    "упражнение: верный ответ",
    "/chess/course-5#c5-only-move-exercise-3",
    async (page) => {
      await page.locator('[data-choice="a7a1"]').click();
      await expect(page.getByText(/Почему так/)).toBeVisible();
    },
  ],
  [
    "упражнение: подсказка",
    "/chess/course#c1-rook-exercise-1",
    async (page) => {
      await page.getByRole("button", { name: "Подсказка" }).click();
    },
  ],
  [
    "партия с роботом после хода",
    "/chess/play#robot-1-w",
    async (page) => {
      await page.locator('[data-square="e2"]').click();
      await page.locator('[data-square="e4"]').click();
      await expect(page.locator('[data-square="e4"] [data-piece="wP"]')).toBeVisible();
    },
  ],
  [
    "эндшпиль: ответ и объяснение",
    "/chess/endgames#square-1",
    async (page) => {
      await page.getByRole("button", { name: "Догонит", exact: true }).click();
      await expect(page.getByText("Почему так")).toBeVisible();
    },
  ],
  [
    "доска анализа после хода",
    "/chess/analysis",
    async (page) => {
      await page.locator('[data-square="e2"]').click();
      await page.locator('[data-square="e4"]').click();
      await expect(page.locator("[data-opening]")).toBeVisible();
    },
  ],
];

for (const theme of [undefined, "dark"] as const)
  test(`после ответа, хода и подсказки: нет нарушений доступности (${theme ? "тёмная" : "светлая"} тема)`, async ({
    page,
  }) => {
    test.slow();
    await prepare(page, theme);
    const found: string[] = [];
    for (const [name, url, act] of AFTER) {
      // Каждая сцена — с чистой страницы: иначе переход между якорями одной страницы оставил бы прежнее состояние.
      await page.goto("about:blank");
      await page.goto(url, { waitUntil: "networkidle" });
      await act(page);
      found.push(...(await scan(page, name)));
    }
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
  "/chess/endgames#square",
  "/chess/endgames#square-1",
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
