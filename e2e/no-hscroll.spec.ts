import { expect, test, type Page } from "@playwright/test";

/** На телефоне ни одна детская страница не должна прокручиваться вбок: иначе всё рисуется вдвое мельче. */

const KEY = "davlatjon-lab:v1";

const PAGES = [
  "/",
  "/week/1/day/1",
  "/week/1/day/1#task-1",
  "/week/2/day/3",
  "/week/3/day/5",
  "/chess",
  "/chess/pawn",
  "/chess/knight",
  "/chess/puzzles",
  "/chess/play",
  "/chess/play#robot-1-w?b=1",
  "/chess/online",
  "/chess/drills",
  "/chess/secrets",
  "/chess/awards",
  "/chess/openings",
  "/chess/games",
  "/chess/games/base",
  "/chess/games/base#wp-1379339785-0",
  "/chess/review",
  "/chess/history",
  "/chess/endgames",
  "/chess/endgames#square",
  "/chess/endgames#play-1",
  "/chess/endgames/pieces",
  "/chess/endgames/pieces#eg-lucena",
  "/chess/endgames/pieces#eg-philidor-exercise-1",
  "/chess/coordinates",
  "/chess/analysis",
  "/chess/mentor",
  "/chess/diary",
  "/my-problems",
  "/about",
  "/quick",
  "/chess/collection",
  "/chess/tests",
  "/chess/tests#test-3-1",
  "/chess/tactics",
  "/chess/tactics#pin-exercise-3",
  "/certificate/week/1",
  "/privacy",
  "/chess/tournaments",
  "/chess/tournaments#new",
  "/chess/glossary",
];

/** Адреса, которых нет в общем списке: курс по ступеням, центр задач в режиме решения, экран игры, «Успехи». */
const MORE = ["/chess/course", "/chess/course-5", "/chess/puzzles#practice", "/chess/play", "/achievements"];

/** Какие страницы шире экрана и на сколько пикселей. */
async function tooWide(page: Page, urls: string[]): Promise<string[]> {
  const wide: string[] = [];
  for (const url of urls) {
    await page.goto(url);
    await page.waitForLoadState("load");
    await page.waitForTimeout(400);
    // «Весь путь» на главной у младших свёрнут — раскрываем: под ним самая широкая часть страницы.
    await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
    const over = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (over > 1) wide.push(`${url} (+${over}px)`);
    // Шапка прилипает к верху и страницу не раздвигает: если её кнопки не помещаются, они просто обрезаются.
    const clipped = await page.evaluate(() =>
      [...document.querySelectorAll("[data-site-header] a, [data-site-header] button")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.right > window.innerWidth + 1;
      }),
    );
    if (clipped) wide.push(`${url} (кнопки шапки обрезаны)`);
    // Подписи нижнего меню — в одну строку: перенос («Мои / задачи») сдвигает значок и выглядит поломкой.
    const navWrapped = await page.evaluate(() => {
      const links = [...document.querySelectorAll("[data-bottom-nav] a")].filter(
        (el) => el.getBoundingClientRect().width > 0,
      );
      const heights = links.map((el) => Math.round(el.getBoundingClientRect().height));
      return heights.some((h) => h > Math.min(...heights) + 2);
    });
    if (navWrapped) wide.push(`${url} (подпись нижнего меню в две строки)`);
  }
  return wide;
}

for (const lang of ["ru", "uz"] as const) {
  test(`${lang}: страницы не шире экрана`, async ({ page }, info) => {
    test.skip(info.project.name !== "phone", "проверка нужна для телефона");
    await page.addInitScript(
      ([l, key]) =>
        localStorage.setItem(
          key,
          JSON.stringify({ version: 1, welcomed: true, settings: { age: 9, lang: l, childName: "Анна" } }),
        ),
      [lang, KEY] as const,
    );
    expect(await tooWide(page, [...PAGES, ...MORE])).toEqual([]);
  });

  // Самые узкие телефоны — 320 px (iPhone SE первого поколения, недорогие Android).
  test(`${lang}: страницы не шире экрана 320 px`, async ({ page }, info) => {
    test.skip(info.project.name !== "phone", "проверка нужна для телефона");
    test.slow();
    await page.setViewportSize({ width: 320, height: 640 });
    await page.addInitScript(
      ([l, key]) =>
        localStorage.setItem(
          key,
          JSON.stringify({ version: 1, welcomed: true, settings: { age: 9, lang: l, childName: "Анна" } }),
        ),
      [lang, KEY] as const,
    );
    expect(await tooWide(page, [...PAGES, ...MORE])).toEqual([]);
  });
}
