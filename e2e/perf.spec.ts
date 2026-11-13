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
    // Ждём шрифты, каждый раз пересчитывая раскладку. Просто `await document.fonts.ready` в CI однажды не дождался
    // за 30 с, хотя оба файла шрифта пришли за 80 мс (трасса PR 112): пока скрипты придержаны, страница стоит, и
    // Chromium может не пересчитать раскладку сам — а без этого «шрифты готовы» не наступает. Опрос по таймеру, а не
    // по кадрам: кадров у неподвижной страницы тоже может не быть.
    await page.waitForFunction(
      () => {
        void document.body.offsetHeight;
        return document.fonts.status === "loaded";
      },
      undefined,
      { polling: 100 },
    );
    const before = await tops();
    await release();
    await expect(page.locator("[data-today]")).toBeVisible();
    await page.waitForLoadState("networkidle");
    const after = await tops();
    // «Задание дня» раньше вырастало после загрузки на 360–420 px и сдвигало всё, что ниже.
    for (const [i, top] of before.entries()) expect(Math.abs(after[i] - top), `блок ${i}`).toBeLessThanOrEqual(4);
  });

/**
 * Сколько килобайт скриптов нужно самой странице (в сжатом виде, как по сети):
 * html — скрипты из её HTML, без них страница не оживёт; page — они же плюс то, что страница догружает сама
 * (живая птица, доска-превью).
 *
 * Чтобы число не зависело от случая, отключаем два посторонних источника запросов:
 * — service worker (test.use ниже): перехваченный им запрос браузер показывает с весом 0 байт, и сумма
 *   менялась от того, успел ли он включиться;
 * — предзагрузку соседних страниц: Next.js заранее скачивает скрипты страниц, на которые ведут ссылки
 *   (на главной это ещё около 470 КиБ). Это вес других страниц — его показывает `npm run vitals`.
 */
async function scriptWeight(page: Page, path: string): Promise<{ html: number; page: number }> {
  await page.route("**/*", (route) => (route.request().headers().rsc ? route.abort() : route.fallback()));
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  const fromHtml = new Map<string, boolean>();
  const scripts = new Set<string>();
  let html = 0;
  let all = 0;
  cdp.on("Network.requestWillBeSent", (e) => {
    fromHtml.set(e.requestId, e.initiator.type === "parser");
  });
  cdp.on("Network.responseReceived", (e) => {
    if (e.type === "Script") scripts.add(e.requestId);
  });
  cdp.on("Network.loadingFinished", (e) => {
    if (!scripts.has(e.requestId)) return;
    all += e.encodedDataLength;
    if (fromHtml.get(e.requestId)) html += e.encodedDataLength;
  });
  await page.goto(path);
  await page.waitForLoadState("networkidle");
  return { html: Math.round(html / 1024), page: Math.round(all / 1024) };
}

const KNOWN = { version: 1, welcomed: true, settings: { age: 9, lang: "ru", childName: "Али" } };

test.describe("вес скриптов", () => {
  test.use({ serviceWorkers: "block" });

  test("главная: скриптов в HTML — не больше 245 КиБ, шахматная доска её не задерживает", async ({
    page,
    isMobile,
  }) => {
    await seed(page, KNOWN);
    // Было 275 КиБ: главная тянула доску, шесть уровней шахматной школы и список записей диктора.
    const weight = await scriptWeight(page, "/");
    expect(weight.html).toBeLessThanOrEqual(245);
    // На широком экране после первого экрана догружается движок живой птицы (около 60 КиБ).
    expect(weight.page).toBeLessThanOrEqual(isMobile ? 245 : 305);
  });

  test("главная шахмат: скриптов в HTML — вдвое меньше прежнего", async ({ page, isMobile }) => {
    await seed(page, KNOWN);
    // Было 503 КиБ: все уроки пяти ступеней, тактика, истории и тайны на двух языках. Теперь страница получает
    // с сервера сводку (названия и счётчики). На широком экране догружается доска-превью задачи дня.
    const weight = await scriptWeight(page, "/chess");
    expect(weight.html).toBeLessThanOrEqual(250);
    expect(weight.page).toBeLessThanOrEqual(isMobile ? 250 : 290);
  });
});

for (const path of ["/", "/chess", "/chess/puzzles", "/chess/course", "/achievements", "/week/1/day/1"])
  test(`страница не перерисовывается заново в другой день: ${path}`, async ({ page }) => {
    // Страницы собраны заранее. Если на первой отрисовке стоит что-то зависящее от даты («задача дня»),
    // в любой день, кроме дня сборки, браузер выбрасывает готовый HTML и рисует страницу заново (ошибка 418).
    await page.clock.setFixedTime(new Date(Date.now() + 9 * 86_400_000));
    await seed(page, KNOWN);
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(errors.filter((m) => /#41[89]|#42[135]|hydrat/i.test(m))).toEqual([]);
  });
