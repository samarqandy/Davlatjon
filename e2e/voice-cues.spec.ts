import { expect, test, type Page } from "@playwright/test";

/** Голос после ответа зависит от ситуации: «почти», совет по ходу попыток, похвала за упорство; «Посмотри на доску» в математике не звучит. */
const KEY = "davlatjon-lab:v1";

async function prepare(page: Page, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([key, l]) => {
      if (!localStorage.getItem(key))
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            welcomed: true,
            settings: { hintPause: false, bigText: false, age: 9, lang: l, sound: true },
          }),
        );
      // Записываем, какие файлы пытались проиграть; сам звук не нужен.
      const played: string[] = [];
      (window as unknown as { __played: string[] }).__played = played;
      class FakeAudio {
        src: string;
        onended: (() => void) | null = null;
        constructor(src: string) {
          this.src = src;
          played.push(src);
        }
        play() {
          return Promise.resolve();
        }
        pause() {}
      }
      (window as unknown as { Audio: unknown }).Audio = FakeAudio;
    },
    [KEY, lang] as const,
  );
}

const played = (page: Page) => page.evaluate(() => (window as unknown as { __played: string[] }).__played);

async function answer(page: Page, value: string) {
  await page.locator('input[inputmode], input[type="number"], input[type="text"]').first().fill(value);
  await page.getByRole("button", { name: "Проверить" }).first().click();
}

test("математика: число рядом — «почти», дальше — совет по ходу попыток, верный ответ после ошибок — похвала за упорство", async ({
  page,
}) => {
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  await answer(page, "58");
  await expect.poll(() => played(page)).toContain("/audio/retry-close.mp3");
  await answer(page, "999");
  await expect
    .poll(async () =>
      (await played(page)).some((s) => /retry-(idea|small|reread|steps|hint|adult|generic)\.mp3/.test(s)),
    )
    .toBe(true);
  await answer(page, "57");
  await expect.poll(async () => (await played(page)).some((s) => /praise-persist-\d\.mp3/.test(s))).toBe(true);
  // Ни разу в математике не прозвучали шахматные реплики.
  const all = await played(page);
  expect(all.filter((s) => /retry-2|chess-|praise-2|praise-3/.test(s))).toEqual([]);
});

test("математика: верный ответ с первого раза — похвала за внимательность", async ({ page }) => {
  await prepare(page);
  await page.goto("/week/1/day/1#task-1");
  await answer(page, "57");
  await expect.poll(async () => (await played(page)).some((s) => /praise-first-\d\.mp3/.test(s))).toBe(true);
});

test("по-узбекски звучат узбекские записи", async ({ page }) => {
  await prepare(page, "uz");
  await page.goto("/week/1/day/1#task-1");
  await page.locator('input[inputmode], input[type="number"], input[type="text"]').first().fill("58");
  await page.getByRole("button", { name: "Tekshirish" }).first().click();
  await expect.poll(() => played(page)).toContain("/audio/uz/retry-close.mp3");
});

test("быстрые примеры для малыша: вопрос читается сам; шахматное упражнение озвучено", async ({ page }) => {
  await prepare(page);
  await page.addInitScript(() => {
    const s = JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}");
    s.settings = { ...s.settings, age: 5 };
    localStorage.setItem("davlatjon-lab:v1", JSON.stringify(s));
  });
  await page.goto("/quick");
  await page.locator("[data-quick-start]").click();
  await expect.poll(async () => (await played(page)).some((s) => /\/audio\/quick-[a-z-]+\.mp3$/.test(s))).toBe(true);

  await page.goto("/chess/pawn#exercises");
  await page.getByRole("button", { name: "Послушать" }).first().click();
  await expect.poll(() => played(page)).toContain("/audio/exercises/pawn-squares.mp3");
});
