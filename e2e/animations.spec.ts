import { expect, test, type Page } from "@playwright/test";

/** Птица Парвоз, взлёт опыта и салют: реагируют на ответы, уважают «уменьшить движение» и настройку родителя. */

const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, opts: { settings?: Record<string, unknown>; levelUp?: boolean } = {}) {
  await page.addInitScript(
    ([o, key]) => {
      if (localStorage.getItem(key)) return;
      const now = Date.now();
      // Три решённые задачи подводят опыт к границе уровня: ещё одно решение — новый уровень (как в gamification.spec).
      const tasks = o.levelUp
        ? Object.fromEntries(
            ["w1d2t1", "w1d2t2", "w1d2t3"].map((id) => [
              id,
              { status: "solved", hints: 0, checks: 1, missed: 0, solvedAt: now, timeMs: 1000, marks: {} },
            ]),
          )
        : {};
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          tasks,
          settings: { hintPause: false, bigText: false, age: 9, lang: "ru", sound: false, ...o.settings },
        }),
      );
    },
    [opts, KEY] as const,
  );
}

async function answer(page: Page, value: string) {
  await page.goto("/week/1/day/1#task-1");
  await page.locator('input[inputmode], input[type="number"], input[type="text"]').first().fill(value);
  await page.getByRole("button", { name: "Проверить" }).first().click();
}

test("верный ответ: птица радуется, опыт взлетает", async ({ page }) => {
  await prepare(page);
  await answer(page, "57");
  const bird = page.locator('[aria-live] [data-mascot][data-mood="correct"]');
  await expect(bird).toBeVisible();
  await expect(bird).toHaveAttribute("data-motion", "on");
  await expect(page.locator("[data-xp-toast]")).toBeVisible();
});

test("неверный ответ: птица мягко задумывается — без «неправильно» и без тряски", async ({ page }) => {
  await prepare(page);
  await answer(page, "1");
  const bird = page.locator('[aria-live] [data-mascot][data-mood="incorrect"]');
  await expect(bird).toBeVisible();
  await expect(bird.locator("img")).not.toHaveClass(/animate-shake/);
  await expect(page.locator("[data-xp-toast]")).toHaveCount(0);
});

test("новый уровень: салют на весь экран, не ловит касания и не даёт полос прокрутки", async ({ page }) => {
  await prepare(page, { levelUp: true });
  await answer(page, "57");
  await expect(page.locator("[data-level-toast]")).toBeVisible();
  const confetti = page.locator("[data-confetti]");
  await expect(confetti).toBeVisible();
  await expect(confetti).toHaveCSS("pointer-events", "none");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(
    true,
  );
  // Салют сам убирается.
  await expect(confetti).toHaveCount(0, { timeout: 6000 });
});

test("«уменьшить движение» в системе: птица неподвижна, салюта нет, награда всё равно видна", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await prepare(page, { levelUp: true });
  await answer(page, "57");
  await expect(page.locator("[data-level-toast]")).toBeVisible();
  await expect(page.locator("[data-confetti]")).toHaveCount(0);
  await expect(page.locator('[data-mascot][data-motion="off"]').first()).toBeVisible();
  await expect(page.locator('[data-mascot][data-motion="on"]')).toHaveCount(0);
});

test("родитель выключил анимации: то же самое без птичьих прыжков и салюта", async ({ page }) => {
  await prepare(page, { levelUp: true, settings: { animations: false } });
  await answer(page, "57");
  await expect(page.locator("[data-level-toast]")).toBeVisible();
  await expect(page.locator("[data-confetti]")).toHaveCount(0);
  await expect(page.locator('[data-mascot][data-motion="on"]')).toHaveCount(0);
});

test("птица Rive: файл загружается, WASM — с нашего домена, без сторонних запросов", async ({ page }) => {
  const external: string[] = [];
  const own: string[] = [];
  page.on("request", (r) => {
    const u = r.url();
    if (/\.wasm|\.riv/.test(u)) own.push(u);
    if (/unpkg|jsdelivr/.test(u)) external.push(u);
  });
  await prepare(page);
  await page.goto("/quick");
  const bird = page.locator("[data-mascot]").first();
  await expect(bird).toHaveAttribute("data-engine", "rive", { timeout: 15000 });
  expect(own.some((u) => u.includes("/vendor/rive/rive.wasm"))).toBe(true);
  expect(own.some((u) => u.includes("/animations/mascot.riv"))).toBe(true);
  expect(external).toEqual([]);
});

test("если анимации выключены, файл Rive и WASM даже не запрашиваются", async ({ page }) => {
  const asked: string[] = [];
  page.on("request", (r) => /\.wasm|\.riv/.test(r.url()) && asked.push(r.url()));
  await prepare(page, { settings: { animations: false } });
  await page.goto("/quick");
  await expect(page.locator("[data-mascot]").first()).toHaveAttribute("data-engine", "fallback");
  expect(asked).toEqual([]);
});

test("настройки родителя: переключатель «Анимации» сохраняется", async ({ page }) => {
  await prepare(page);
  await page.goto("/parent/settings");
  // Первый вход — родитель придумывает PIN.
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  const toggle = page.getByRole("checkbox", { name: /Анимации/ });
  await expect(toggle).toBeChecked();
  await toggle.setChecked(false, { force: true });
  await expect(toggle).not.toBeChecked();
  const stored = await page.evaluate((key) => JSON.parse(localStorage.getItem(key) ?? "{}").settings?.animations, KEY);
  expect(stored).toBe(false);
});
