import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

/**
 * «База партий мастеров» для учеников (GAMES-2): поиск в той же базе, что у доски тренера, партия ход за ходом
 * по адресу «#id», «Назад» возвращает к тому же месту списка, эндшпиль, доска анализа, PGN с лицензией.
 */
const KEY = "davlatjon-lab:v1";
/** Карлсен — Каруана, чемпионат мира 2018, партия 1 (Википедия): 229 полуходов, эндшпиль с 86-го. */
const WCC = "wp-1379339785-0";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([key, lang]) => {
      if (localStorage.getItem(key)) return;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 10, lang, sound: false, animations: false },
        }),
      );
    },
    [KEY, lang] as const,
  );
}

const items = (page: Page) => page.locator("[data-games-item]:visible");
const count = async (page: Page) => Number(await page.getAttribute("[data-games-count]", "data-games-count"));
const game = (page: Page) => page.locator("[data-games-game]");
const ply = async (page: Page) => Number(await game(page).getAttribute("data-games-ply"));

async function axe(page: Page, scope: string) {
  const result = await new AxeBuilder({ page })
    .include(scope)
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"])
    .analyze();
  return result.violations.map((v) => `${v.impact} ${v.id}: ${v.nodes[0].target.join(" ")}`);
}

test("со страницы «Знаменитые партии» — в базу; поиск, партия ход за ходом, «Назад» — к той же строке списка", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/games");
  await page.locator("[data-games-base-link]").click();
  await expect(page).toHaveURL(/\/chess\/games\/base$/);
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  expect(await count(page)).toBeGreaterThan(800);
  expect(await axe(page, "main")).toEqual([]);

  await page.locator("[data-games-search]").fill("Синдаров");
  await expect.poll(() => count(page)).toBeLessThan(200);
  const found = await count(page);
  const row = items(page).nth(2);
  const id = (await row.getAttribute("data-games-item"))!;
  await row.click();

  // Экран партии: адрес «#id», список спрятан, фокус на заголовке, начальная позиция.
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(game(page)).toHaveAttribute("data-games-game", id);
  await expect(page.locator("#game-base-title")).toBeFocused();
  await expect(page.locator("#game-base-title")).toContainText("Sindarov");
  await expect(items(page)).toHaveCount(0);
  expect(await ply(page)).toBe(0);
  expect(await axe(page, "[data-games-game]")).toEqual([]);

  await page.locator("[data-move-nav]").getByRole("button", { name: "Дальше" }).click();
  expect(await ply(page)).toBe(1);
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => ply(page)).toBe(2);
  // Второй полуход — ответ чёрных: «1… e5».
  await expect(page.locator("[data-games-note]")).toContainText("1…");

  // «Смотреть» — ходы идут сами.
  await page.locator("[data-games-play]").click();
  await expect.poll(() => ply(page), { timeout: 5_000 }).toBeGreaterThan(2);
  await page.locator("[data-games-play]").click();

  // «Назад»: список с тем же запросом, фокус — на открытой партии.
  await page.locator("[data-games-back]").click();
  await expect(game(page)).toHaveCount(0);
  await expect(page).toHaveURL(/\/chess\/games\/base$/);
  await expect(page.locator("[data-games-search]")).toHaveValue("Синдаров");
  expect(await count(page)).toBe(found);
  await expect(page.locator(`[data-games-item="${id}"]`)).toBeFocused();
});

test("прямая ссылка на партию: «К эндшпилю», подпись, доска анализа с той же позицией", async ({ page }) => {
  await prepare(page);
  await page.goto(`/chess/games/base#${WCC}`);
  await expect(game(page)).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("#game-base-title")).toHaveText("Caruana, Fabiano – Carlsen, Magnus");
  await expect(game(page)).toContainText("Сицилианская защита (B31)");
  await expect(page.locator("[data-games-source] a").first()).toHaveAttribute(
    "href",
    /^https:\/\/en\.wikipedia\.org\/.*oldid=1379339785/,
  );

  await page.locator("[data-games-endgame]").click();
  expect(await ply(page)).toBe(86);
  await expect(page.locator("[data-games-note]")).toContainText("эндшпиль");

  const href = (await page.locator("[data-games-analysis]").getAttribute("href"))!;
  const fen = decodeURIComponent(href.split("#fen=")[1]);
  expect(fen.split(" ")).toHaveLength(6);
  await page.locator("[data-games-analysis]").click();
  await expect(page).toHaveURL(/\/chess\/analysis#fen=/);
  await expect(page.locator("[data-board]").first()).toBeVisible();

  // Вошли по ссылке — «Назад» в партии ведёт к списку базы, а не со страницы; фокус — на заголовок списка.
  await page.goto(`/chess/games/base#${WCC}`);
  await page.locator("[data-games-back]").click();
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  await expect(page).toHaveURL(/\/chess\/games\/base#?$/);
  await expect(page.locator("#games-base-title")).toBeFocused();
});

test("якорь страницы — не партия: «Перейти к содержанию» оставляет список; испорченная ссылка не роняет страницу", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/chess/games/base#main");
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  await expect(game(page)).toHaveCount(0);
  await page.goto("/chess/games/base#50%");
  await expect(page.locator("[data-games-not-found]")).toBeVisible({ timeout: 15_000 });
});

test("PGN: игроки, турнир, ECO, источник и лицензия; ходы до конца партии", async ({ page }) => {
  await prepare(page);
  await page.goto(`/chess/games/base#${WCC}`);
  await expect(game(page)).toBeVisible({ timeout: 15_000 });
  const [download] = await Promise.all([page.waitForEvent("download"), page.locator("[data-games-pgn]").click()]);
  expect(download.suggestedFilename()).toBe(`partiya-${WCC}.pgn`);
  const pgn = fs.readFileSync((await download.path())!, "utf8");
  for (const tag of [
    '[White "Caruana, Fabiano"]',
    '[Black "Carlsen, Magnus"]',
    '[Event "World Chess Championship 2018"]',
    '[ECO "B31"]',
    '[License "CC BY-SA 4.0 https://creativecommons.org/licenses/by-sa/4.0/"]',
  ])
    expect(pgn).toContain(tag);
  expect(pgn).toMatch(/\[Source "https:\/\/en\.wikipedia\.org\/.*oldid=1379339785"\]/);
  expect(pgn).toMatch(/115\. [\s\S]*1\/2-1\/2\s*$/);
});

test("нет такой партии — понятная надпись и путь к списку", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/games/base#no-such-game");
  await expect(page.locator("[data-games-not-found]")).toBeVisible({ timeout: 15_000 });
  expect(await axe(page, "main")).toEqual([]);
  await page.locator("[data-games-back]").click();
  await expect(items(page).first()).toBeVisible();
  await expect(page.locator("#games-base-title")).toBeFocused();
});

test("разделы для учеников: знаменитые, эндшпиль, короткие победы, кнопка дебюта", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/games/base");
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  const all = await count(page);
  for (const section of ["famous", "endgame", "short"]) {
    const button = page.locator(`[data-games-section="${section}"]`);
    // Число на кнопке раздела — сколько партий в нём; список догоняет его (useDeferredValue), ждём совпадения.
    const expected = Number((await button.innerText()).match(/\d+/)![0]);
    expect(expected).toBeGreaterThan(20);
    expect(expected).toBeLessThan(all);
    await button.click();
    await expect.poll(() => count(page)).toBe(expected);
  }
  await page.locator('[data-games-section="all"]').click();
  await page.locator('[data-games-opening-group="g:qg"]').click();
  await expect(page.locator('[data-games-opening-group="g:qg"]')).toHaveAttribute("aria-pressed", "true");
  await expect.poll(() => count(page)).toBeLessThan(all);
  for (const text of (await items(page).allTextContents()).slice(0, 10)) expect(text).toMatch(/ферзев/i);
});

test("oʻzbek tilida: roʻyxat va partiya ekranida rus harflari yoʻq", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/uz/chess/games/base");
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  await expect(page.locator("h1")).toHaveText("Ustalar partiyalari bazasi");
  await page.locator("[data-games-sources] summary").click();
  const cyr = async () => (await page.locator("main").innerText()).match(/[А-Яа-яЁё]/g) ?? [];
  expect(await cyr()).toEqual([]);
  await items(page).first().click();
  await expect(game(page)).toBeVisible();
  await page.locator("[data-games-endgame], [data-games-pgn]").first().waitFor();
  expect(await cyr()).toEqual([]);
});

test("телефон: кнопки — рядами с прокруткой вбок, первая партия списка видна без долгой прокрутки", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "phone", "только телефон");
  await prepare(page);
  await page.goto("/chess/games/base");
  await expect(items(page).first()).toBeVisible({ timeout: 15_000 });
  const vh = page.viewportSize()!.height;
  const first = (await items(page).first().boundingBox())!;
  expect(first.y).toBeLessThan(vh * 1.2);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test("телефон: доска партии и панель ходов на первом экране, подписи кнопок не обрезаны", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "только телефон");
  await prepare(page);
  await page.goto(`/chess/games/base#${WCC}`);
  await expect(game(page)).toBeVisible({ timeout: 15_000 });
  await page.locator("[data-games-endgame]").click();
  const vh = page.viewportSize()!.height;
  for (const loc of [page.locator(`[data-board="base-${WCC}"]`), page.locator("[data-move-nav]")]) {
    const b = (await loc.boundingBox())!;
    expect(b.y).toBeGreaterThanOrEqual(0);
    expect(b.y + b.height).toBeLessThanOrEqual(vh);
  }
  const cut = await page
    .locator("[data-move-nav] button span")
    .evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth).map((e) => e.textContent));
  expect(cut).toEqual([]);
});
