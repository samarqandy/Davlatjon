import { expect, test } from "@playwright/test";

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
  "/chess/drills",
  "/chess/secrets",
  "/chess/awards",
  "/chess/openings",
  "/chess/games",
  "/chess/review",
  "/chess/history",
  "/chess/endgames",
  "/chess/coordinates",
  "/chess/analysis",
  "/chess/diary",
  "/my-problems",
];

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
    const wide: string[] = [];
    for (const url of PAGES) {
      await page.goto(url);
      await page.waitForLoadState("load");
      await page.waitForTimeout(400);
      const over = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (over > 1) wide.push(`${url} (+${over}px)`);
    }
    expect(wide).toEqual([]);
  });
}
