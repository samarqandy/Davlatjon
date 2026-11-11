import { expect, test, type Page, type Route } from "@playwright/test";

/**
 * Скорость главной: что ребёнок видит до загрузки скриптов и не прыгает ли страница после неё.
 * Скрипты страницы придерживаем сами — так «до загрузки» не зависит от скорости машины, на которой идёт тест.
 */

const KEY = "davlatjon-lab:v1";

const seed = (page: Page, state: Record<string, unknown>) =>
  page.addInitScript(([key, s]) => localStorage.setItem(key, JSON.stringify(s)), [KEY, state] as const);

/** Придержать скрипты страницы: до release() она остаётся такой, какой пришла с сервера. */
async function holdScripts(page: Page) {
  const held: Route[] = [];
  let open = false;
  await page.route("**/_next/static/chunks/*.js", (route) => (open ? route.continue() : void held.push(route)));
  return async () => {
    open = true;
    await Promise.all(held.map((route) => route.continue()));
  };
}

test("первое знакомство: окно приветствия открыто ещё до загрузки скриптов, нажатия до загрузки не пропадают", async ({
  page,
}) => {
  const release = await holdScripts(page);
  await page.goto("/", { waitUntil: "commit" });
  const dialog = page.locator("dialog[data-welcome-step]");
  await expect(dialog).toBeVisible();
  // Окно — настоящее модальное: его открыл скрипт рядом с ним, а не компонент.
  await expect(dialog).toHaveJSProperty("open", true);
  expect(await dialog.evaluate((d) => d.matches(":modal"))).toBe(true);
  await expect(dialog.getByRole("heading", { name: /Добро пожаловать/ })).toBeVisible();
  await expect(dialog).not.toHaveAttribute("data-live", "");

  // Ребёнок нажал раньше, чем кнопки ожили: язык, потом «Дальше».
  await dialog.locator('[data-early="lang-uz"]').click();
  await dialog.locator('[data-early="next"]').click();
  await expect(dialog).toHaveAttribute("data-welcome-step", "0");

  await release();
  await expect(dialog).toHaveAttribute("data-welcome-step", "1");
  await expect(dialog.getByRole("heading", { name: "Necha yoshdasan?" })).toBeVisible();
  // Дальше окно работает как обычно, и нажатия второй раз не повторяются.
  await dialog.getByRole("button", { name: "Orqaga" }).click();
  await expect(dialog).toHaveAttribute("data-welcome-step", "0");
  await dialog.locator('[data-early="next"]').click();
  await dialog.getByRole("button", { name: /Ketdik/ }).click();
  await expect(dialog).toHaveCount(0);
  await expect(page.locator("html")).not.toHaveAttribute("data-first", "");
});

test("кто уже знаком, окна приветствия не видит — ни до загрузки скриптов, ни после", async ({ page }) => {
  await seed(page, { version: 1, welcomed: true, settings: { age: 9, lang: "ru", childName: "Али" } });
  const release = await holdScripts(page);
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  const dialog = page.locator("dialog[data-welcome-step]");
  await expect(dialog).toBeHidden();
  await release();
  await expect(page.locator("[data-today]")).toBeVisible();
  await expect(dialog).toHaveCount(0);
});

for (const [name, state] of [
  ["новичок", { version: 1 }],
  ["младший с именем", { version: 1, welcomed: true, settings: { age: 7, lang: "ru", childName: "Али" } }],
  ["старший", { version: 1, welcomed: true, settings: { age: 11, lang: "ru", childName: "Али" } }],
] as const)
  test(`главная не прыгает после загрузки скриптов: ${name}`, async ({ page }) => {
    await seed(page, state);
    const release = await holdScripts(page);
    await page.goto("/", { waitUntil: "commit" });
    await expect(page.locator("[data-quick-card]")).toBeAttached();
    // Блоки первого и второго экрана: занятие дня, «Быстрые примеры», шахматная школа.
    const tops = () =>
      page.evaluate(() =>
        ["[data-next-step]", "[data-quick-card]", "#chess-home"].map((sel) =>
          Math.round((document.querySelector(sel)?.getBoundingClientRect().top ?? NaN) + window.scrollY),
        ),
      );
    await page.evaluate(() => document.fonts.ready);
    const before = await tops();
    await release();
    await expect(page.locator("[data-today]")).toBeVisible();
    await page.waitForLoadState("networkidle");
    const after = await tops();
    // «Задание дня» раньше вырастало после загрузки на 360–420 px и сдвигало всё, что ниже.
    for (const [i, top] of before.entries()) expect(Math.abs(after[i] - top), `блок ${i}`).toBeLessThanOrEqual(4);
  });

test("главная: скриптов при загрузке — не больше 245 КиБ, шахматная доска её не задерживает", async ({ page }) => {
  await seed(page, { version: 1, welcomed: true, settings: { age: 9, lang: "ru", childName: "Али" } });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const scripts = new Map<string, string>();
  let bytes = 0;
  cdp.on("Network.responseReceived", (e) => {
    if (e.type === "Script") scripts.set(e.requestId, e.response.url);
  });
  cdp.on("Network.loadingFinished", (e) => {
    if (scripts.has(e.requestId)) bytes += e.encodedDataLength;
  });
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  // Было 275 КиБ: главная тянула доску, шесть уровней шахматной школы и список записей диктора.
  expect(Math.round(bytes / 1024)).toBeLessThanOrEqual(245);
});
