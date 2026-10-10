import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

/** 3-й этап: задание дня и опыт, сертификат о звании, короны у робота, новые тренажёры. */

const KEY = "davlatjon-lab:v1";
/** Упражнения уровня «Пешка» — из файла уровня, как их видит школа. */
const PAWN_EXERCISES = (() => {
  const src = fs.readFileSync(path.join(process.cwd(), "src/content/chess/pawn.ts"), "utf8");
  return [...src.slice(src.indexOf("exercises: [")).matchAll(/^ {6}id: "([^"]+)"/gm)].map((m) => m[1]);
})();

async function prepare(page: Page, state: Record<string, unknown> = {}, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([more, l, key]) => {
      if (localStorage.getItem(key)) return;
      // Время «сегодня» — в браузере, чтобы задание дня видело сделанное.
      const now = Date.now();
      const fill = (x: unknown): unknown =>
        x === "NOW"
          ? now
          : Array.isArray(x)
            ? x.map(fill)
            : x && typeof x === "object"
              ? Object.fromEntries(Object.entries(x).map(([k, v]) => [k, fill(v)]))
              : x;
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          settings: { hintPause: false, bigText: false, age: 9, lang: l },
          ...(fill(more) as object),
        }),
      );
    },
    [state, lang, KEY] as const,
  );
}

/** Решённая задача целиком — в том виде, в каком её хранит приложение. */
const solvedTask = { status: "solved", hints: 0, checks: 1, missed: 0, solvedAt: "NOW", timeMs: 1000, marks: {} };

const solvedToday = (ids: string[]) => Object.fromEntries(ids.map((id) => [id, { solvedAt: "NOW", misses: 0 }]));

test("задание дня: три дела, уровень и серия", async ({ page }) => {
  await prepare(page);
  await page.goto("/");
  const card = page.locator("[data-today]");
  await expect(card.locator('[data-quest="open"]')).toBeVisible();
  // Девять лет: вместо номера уровня и XP — имя уровня.
  await expect(card.locator('[data-level-name="Росточек"]')).toBeVisible();
  await expect(card.getByText(/XP/)).toHaveCount(0);
  await expect(card.getByText("Начни серию сегодня!")).toBeVisible();
  await expect(card.getByRole("link", { name: /Реши 3 задачи в тренажёре тактики/ })).toHaveAttribute(
    "href",
    "/chess/puzzles#practice",
  );
});

test("с десяти лет — номер уровня и опыт", async ({ page }) => {
  await prepare(page, { settings: { age: 11, lang: "ru", hintPause: false, bigText: false } });
  await page.goto("/");
  const card = page.locator("[data-today]");
  await expect(card.getByText("Уровень 1")).toBeVisible();
  await expect(card.getByText("0 / 50 XP")).toBeVisible();
});

test("всё сделано — звезда дня, опыт посчитан из прогресса", async ({ page }) => {
  await prepare(page, {
    chessPuzzles: solvedToday(["p1", "p2", "p3", "p4", "p5"]),
    tasks: { w1d1t1: { status: "solved", hints: 0, checks: 1, missed: 0, solvedAt: "NOW", timeMs: 1, marks: {} } },
    chess: solvedToday(["pawn-squares"]),
    chessGames: [{ id: "g1", at: "NOW", mode: "robot", level: 1, color: "w", result: "win", moves: 12 }],
  });
  await page.goto("/");
  const card = page.locator("[data-today]");
  await expect(card.locator('[data-quest="done"]')).toBeVisible();
  await expect(card.getByText(/звезда дня твоя/)).toBeVisible();
  await expect(card.locator("[data-streak]")).toHaveAttribute("data-streak", "1");
  // Опыт: 5 задач тренажёра с первой попытки, задача без подсказок, упражнение и победа над роботом.
  await expect(card.locator("[data-xp]")).toHaveAttribute("data-xp", String(5 * 8 + 15 + 5 + 15));
});

test("задание дня есть и в шахматной школе; по-узбекски — без кириллицы", async ({ page }) => {
  await prepare(page, {}, "uz");
  await page.goto("/chess");
  const card = page.locator("[data-today]");
  await expect(card.getByText("Kun vazifasi")).toBeVisible();
  expect(await card.innerText()).not.toMatch(/[Ѐ-ӿ]/);
});

test("сертификат: закрыт, пока звание не получено; потом — имя, звание и дата", async ({ page }) => {
  await prepare(page, {
    settings: { age: 9, lang: "ru", childName: "Анна" },
    chess: solvedToday(PAWN_EXERCISES.slice(1)),
  });
  await page.goto("/chess/certificate/pawn");
  await expect(page.locator('[data-certificate="locked"]')).toBeVisible();
  await expect(page.getByText(`${PAWN_EXERCISES.length - 1}/${PAWN_EXERCISES.length}`)).toBeVisible();

  await page.evaluate(
    ([key, id]) => {
      const s = JSON.parse(localStorage.getItem(key)!);
      s.chess[id] = { solvedAt: Date.now(), misses: 0 };
      localStorage.setItem(key, JSON.stringify(s));
    },
    [KEY, PAWN_EXERCISES[0]] as const,
  );
  await page.reload();
  const sheet = page.locator('[data-certificate="earned"]');
  await expect(sheet).toBeVisible();
  await expect(sheet.locator("[data-certificate-name]")).toHaveText("Анна");
  await expect(sheet.getByText("«Пешка»")).toBeVisible();
  await expect(sheet.getByText(/\d{1,2} [а-я]+ \d{4} г\./)).toBeVisible();
  await expect(page.getByRole("button", { name: /Распечатать/ })).toBeVisible();

  // Ссылка на сертификат — со страницы уровня.
  await page.goto("/chess/pawn#exercises");
  await page.locator("[data-certificate-link]").click();
  await expect(page).toHaveURL(/\/chess\/certificate\/pawn$/);
});

test("сертификат по-узбекски: латиница, узбекская дата", async ({ page }) => {
  await prepare(
    page,
    { settings: { age: 9, lang: "uz", childName: "Давлат" }, chess: solvedToday(PAWN_EXERCISES) },
    "uz",
  );
  await page.goto("/chess/certificate/pawn");
  const sheet = page.locator('[data-certificate="earned"]');
  await expect(sheet.getByText("Sertifikat")).toBeVisible();
  await expect(sheet.locator("[data-certificate-name]")).toHaveText("Davlat");
  await expect(sheet.getByText(/\d{4}-yil \d{1,2}-[a-z]+/)).toBeVisible();
  expect(await page.locator("main").innerText()).not.toMatch(/[Ѐ-ӿ]/);
});

test("робот говорит перед партией, а лучшие короны видны в выборе робота", async ({ page }) => {
  await prepare(page, {
    chessGames: [
      { id: "g1", at: "NOW", mode: "robot", level: 2, color: "w", result: "win", moves: 20, hints: 0, undos: 0 },
      { id: "g2", at: "NOW", mode: "robot", level: 3, color: "w", result: "win", moves: 20, hints: 2, undos: 0 },
    ],
  });
  await page.goto("/chess/play");
  await expect(page.locator('[data-best-crowns="3"]')).toBeVisible();
  await expect(page.locator('[data-best-crowns="2"]')).toBeVisible();
  await expect(page.getByText("😈 Главный босс")).toBeVisible();
  await page.goto("/chess/play#robot-1-w");
  await expect(page.locator("[data-robot-says]")).toContainText("Я Пешка");
});

test("тренажёр «Путь коня»: только ходы коня, звёзды за короткий путь", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills");
  await page.getByRole("button", { name: /Путь коня/ }).click();
  await page.getByRole("button", { name: "Начать", exact: true }).click();
  const board = page.locator('[data-board="knight"]');
  const { knight, star } = await board.evaluate((el) => {
    const at = (piece: string) =>
      el.querySelector(`[data-piece="${piece}"]`)?.closest("[data-square]")?.getAttribute("data-square") ?? "";
    return { knight: at("wN"), star: at("star") };
  });
  // Кратчайший путь по ходам коня на пустой доске (в первом раунде пешек нет).
  const prev = new Map<string, string>([[knight, ""]]);
  const queue = [knight];
  while (queue.length && !prev.has(star)) {
    const cur = queue.shift()!;
    for (const [dc, dr] of [
      [1, 2],
      [2, 1],
      [2, -1],
      [1, -2],
      [-1, -2],
      [-2, -1],
      [-2, 1],
      [-1, 2],
    ]) {
      const c = cur.charCodeAt(0) - 97 + dc;
      const r = Number(cur[1]) + dr;
      const sq = `${String.fromCharCode(97 + c)}${r}`;
      if (c < 0 || c > 7 || r < 1 || r > 8 || prev.has(sq)) continue;
      prev.set(sq, cur);
      queue.push(sq);
    }
  }
  const route: string[] = [];
  for (let s = star; s !== knight; s = prev.get(s)!) route.unshift(s);
  // Клетка, куда конь не ходит, — не засчитывается.
  await board.locator(`[data-square="${knight}"]`).click();
  await expect(page.locator("[data-knight-moves]")).toHaveAttribute("data-knight-moves", "0");
  for (const s of route) await board.locator(`[data-square="${s}"]`).click();
  await expect(page.locator("[data-knight-stars]")).toHaveAttribute("data-knight-stars", "3");
});

test("тренажёр «Запомни»: фигуры исчезают, ответ — клетка", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills#memory");
  await page.getByRole("button", { name: "Начать", exact: true }).click();
  const board = page.locator('[data-board="memory"]');
  await expect(page.locator('[data-memory="show"]')).toBeVisible();
  const pieces = await board.evaluate((el) =>
    Object.fromEntries(
      [...el.querySelectorAll("[data-piece]")].map((n) => [
        n.getAttribute("data-piece"),
        n.closest("[data-square]")?.getAttribute("data-square"),
      ]),
    ),
  );
  expect(Object.keys(pieces)).toHaveLength(3);
  await expect(page.locator('[data-memory="ask"]')).toBeVisible({ timeout: 8000 });
  await expect(board.locator("[data-piece]")).toHaveCount(0);
  const question = await page.locator('[data-memory="ask"]').innerText();
  const words: Record<string, string> = {
    "белый король": "wK",
    "чёрный король": "bK",
    "белый ферзь": "wQ",
    "чёрный ферзь": "bQ",
    "белая ладья": "wR",
    "чёрная ладья": "bR",
    "белый слон": "wB",
    "чёрный слон": "bB",
    "белый конь": "wN",
    "чёрный конь": "bN",
    "белая пешка": "wP",
    "чёрная пешка": "bP",
  };
  const code = Object.entries(words).find(([w]) => question.includes(w))![1];
  await board.locator(`[data-square="${pieces[code]}"]`).click();
  await expect(page.getByText("✅ Точно! Отличная память.")).toBeVisible();
});

test("тренажёр «Кто в опасности?» загружает позиции и проверяет ответ", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/drills#safety");
  await page.getByRole("button", { name: "Начать", exact: true }).click();
  await expect(page.locator('[data-board="safety"]')).toBeVisible();
  await page.getByRole("button", { name: /Готово/ }).click();
  await expect(page.locator("[data-safety]")).toBeVisible();
  await expect(page.getByRole("button", { name: "Дальше →" })).toBeVisible();
});

test("награда: звон за решённую задачу и фанфара с плашкой «Новый уровень», когда опыта хватает на следующий", async ({
  page,
}) => {
  const done = Object.fromEntries(["w1d2t1", "w1d2t2", "w1d2t3"].map((id) => [id, solvedTask]));
  await prepare(page, { tasks: done }, "ru");
  await page.addInitScript(() => {
    (window as unknown as { __rewards: string[] }).__rewards = [];
    window.addEventListener("reward-sfx", (e) =>
      (window as unknown as { __rewards: string[] }).__rewards.push((e as CustomEvent<string>).detail),
    );
  });
  await page.goto("/week/1/day/1#task-1");
  await page.locator('input[inputmode], input[type="number"], input[type="text"]').first().fill("57");
  await page.getByRole("button", { name: "Проверить" }).first().click();
  await expect(page.locator("[data-level-toast]")).toBeVisible();
  const rewards = await page.evaluate(() => (window as unknown as { __rewards: string[] }).__rewards);
  expect(rewards).toEqual(["level"]);
});

test("сертификат недели: закрыт, пока не пройдены все дни; потом — лист с именем и ссылка на главной", async ({
  page,
}) => {
  await prepare(page, {}, "ru");
  await page.goto("/certificate/week/1");
  await expect(page.locator('[data-week-certificate="locked"]')).toBeVisible();
  await expect(page.locator("[data-week-certificate-link]")).toHaveCount(0);

  const days = Object.fromEntries([1, 2, 3, 4, 5, 6, 7].map((n) => [`w1d${n}`, { completedAt: "NOW" }]));
  const named = { settings: { hintPause: false, bigText: false, age: 9, lang: "ru", childName: "Анна" } };
  await page.evaluate(
    ([key, d, s]) => localStorage.setItem(key, JSON.stringify({ version: 1, welcomed: true, ...s, days: d })),
    [KEY, Object.fromEntries(Object.entries(days).map(([k]) => [k, { completedAt: Date.now() }])), named] as const,
  );
  await page.goto("/certificate/week/1");
  const sheet = page.locator('[data-week-certificate="earned"]');
  await expect(sheet).toBeVisible();
  await expect(sheet.locator("[data-certificate-name]")).toHaveText("Анна");
  await page.goto("/");
  await page.getByText("Весь путь: все дни").click();
  await expect(page.locator("[data-week-certificate-link]")).toHaveCount(1);
});

test("коллекция героев: открыто столько карточек, сколько набрано опыта; остальные закрыты", async ({ page }) => {
  // 4 задачи × 15 XP = 60 XP → две карточки (по 30 XP).
  const done = Object.fromEntries(["w1d2t1", "w1d2t2", "w1d2t3", "w1d2t4"].map((id) => [id, solvedTask]));
  await prepare(page, { tasks: done }, "ru");
  await page.goto("/chess/collection");
  await expect(page.locator("[data-collection-count]")).toHaveText("2/23");
  await expect(page.locator('[data-hero-card="open"]')).toHaveCount(2);
  await expect(page.locator('[data-hero-card="locked"]')).toHaveCount(21);
  await expect(page.locator('[data-hero-id="sage-1"]')).toContainText("Ибн Сина");
  await page.goto("/chess");
  await page.locator("[data-more-sections] summary").click();
  await expect(page.locator('a[href="/chess/collection"]')).toBeVisible();
});

test("новая карточка: плашка со ссылкой, когда опыт переходит порог", async ({ page }) => {
  // Одна решённая задача (15 XP) + ещё одна (15) = 30 XP — ровно порог первой карточки.
  await prepare(page, { tasks: { w1d2t1: solvedTask } }, "ru");
  await page.goto("/week/1/day/1#task-1");
  await page.locator('input[inputmode], input[type="number"], input[type="text"]').first().fill("57");
  await page.getByRole("button", { name: "Проверить" }).first().click();
  await expect(page.locator("[data-card-toast]")).toBeVisible();
  await page.locator("[data-card-toast]").click();
  await expect(page).toHaveURL(/\/chess\/collection$/);
});
