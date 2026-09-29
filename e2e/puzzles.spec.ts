import fs from "node:fs";
import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

/** Задачи из базы Lichess: тема без задач школы, «задачи по силам», «Дятел», узбекский интерфейс. */

type Row = [id: string, fen: string, moves: string, rating: number, mate: number, theme?: string];
const DIR = path.join(process.cwd(), "public", "puzzles");
const file = (name: string) => JSON.parse(fs.readFileSync(path.join(DIR, `${name}.json`), "utf8")).puzzles as Row[];
const byId = new Map<string, Row>();
for (const f of fs.readdirSync(DIR)) for (const row of file(f.replace(/\.json$/, ""))) byId.set(row[0], row);

/** Какую задачу выберет тренажёр без случайности: ближайшую к рейтингу, при равенстве — по ключу. */
function nearest(rows: Row[], theme: string | null, target: number): Row {
  const key = (r: Row) => `${r[5] ?? theme}/${r[0]}`;
  return [...rows].sort((a, b) => Math.abs(a[3] - target) - Math.abs(b[3] - target) || (key(a) < key(b) ? -1 : 1))[0];
}

async function prepare(page: Page, state: Record<string, unknown> = {}, lang: "ru" | "uz" = "ru") {
  await page.addInitScript(
    ([more, l]) => {
      const key = "davlatjon-lab:v1";
      if (!localStorage.getItem(key))
        localStorage.setItem(
          key,
          JSON.stringify({
            version: 1,
            welcomed: true,
            settings: { hintPause: false, bigText: false, age: 9, lang: l },
            ...more,
          }),
        );
      // Без случайности: из пяти ближайших задач берётся самая близкая.
      Math.random = () => 0;
    },
    [state, lang] as const,
  );
}

const saved = (page: Page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}")) as Promise<{
    chessRating?: { r: number; n: number };
    chessPuzzles: Record<string, { solvedAt?: number; misses: number }>;
    chessWoodpecker?: { index: number; ms: number; keys: string[] };
    settings: { puzzleLevel?: string };
  }>;

const shownBoard = (page: Page) => page.locator('[data-board^="puzzle-"]').first();

/** Решить задачу из базы, которая сейчас на доске: её id — в data-board, ходы — из файлов банка. */
async function solveShown(page: Page, lang: "ru" | "uz" = "ru") {
  const board = shownBoard(page);
  const id = (await board.getAttribute("data-board"))!.slice("puzzle-".length);
  const moves = byId.get(id)![2].split(" ");
  await expect(
    page.getByText(lang === "ru" ? /Соперник сыграл .+ Твой ход!/ : /Raqib .+ yurdi\. Navbat senda!/),
  ).toBeVisible();
  for (let i = 1; i < moves.length; i += 2) {
    await board.locator(`[data-square="${moves[i].slice(0, 2)}"]`).click();
    await board.locator(`[data-square="${moves[i].slice(2, 4)}"]`).click();
    if (moves[i][4]) await page.locator(`[data-promotion] [data-piece="${moves[i][4]}"]`).click();
    if (i + 2 < moves.length) {
      await expect(page.getByText(lang === "ru" ? /Соперник отвечает…/ : /Raqib javob beryapti…/)).toBeVisible();
      await expect(page.getByText(lang === "ru" ? /Соперник ответил/ : /bilan javob berdi/)).toBeVisible();
    }
  }
  return id;
}

test("тема без задач школы: сначала ход соперника, потом решение; рейтинг растёт", async ({ page }) => {
  await prepare(page);
  const expected = nearest(file("backrank"), "backrank", 700);
  await page.goto("/chess/puzzles#theme-backrank");
  await expect(page.getByRole("heading", { level: 1, name: /Мат по последней линии/ })).toBeVisible();
  await expect(page).toHaveURL(/#theme-backrank-bank$/);
  await expect(shownBoard(page)).toHaveAttribute("data-board", `puzzle-${expected[0]}`);
  await solveShown(page);
  await expect(page.getByText(/— мат! С первой попытки!/)).toBeVisible();
  await expect(page.getByText(/Решение: 1/)).toBeVisible();
  const s = await saved(page);
  expect(s.chessPuzzles[`backrank/${expected[0]}`].solvedAt).toBeGreaterThan(0);
  expect(s.chessRating!.n).toBe(1);
  expect(s.chessRating!.r).toBeGreaterThan(700);
  await page.getByRole("button", { name: "Следующая задача →" }).click();
  await expect(shownBoard(page)).not.toHaveAttribute("data-board", `puzzle-${expected[0]}`);
});

test("мой уровень: сложность выбирается, «задачи по силам» подбираются по рейтингу", async ({ page }) => {
  await prepare(page, { chessRating: { r: 700, rd: 150, n: 20, at: 1 } });
  await page.goto("/chess/puzzles");
  await expect(page.getByRole("heading", { name: /Мой уровень/ })).toContainText("⭐⭐");
  await page.getByRole("button", { name: "Потруднее" }).click();
  await expect(page.getByRole("button", { name: "Потруднее" })).toHaveAttribute("aria-pressed", "true");
  expect((await saved(page)).settings.puzzleLevel).toBe("hard");
  await page.getByRole("button", { name: /Решать задачи по силам/ }).click();
  await expect(page.getByRole("heading", { name: /Задачи по силам/ })).toBeVisible();
  const expected = nearest(file("mix"), null, 900);
  await expect(shownBoard(page)).toHaveAttribute("data-board", `puzzle-${expected[0]}`);
});

test("ошибка в задаче из базы: рейтинг падает, задача уходит на повторение", async ({ page }) => {
  await prepare(page);
  const expected = nearest(file("fork"), "fork", 700);
  // В «Вилке» есть задачи школы — сразу к задачам из базы.
  await page.goto("/chess/puzzles#theme-fork-bank");
  await expect(shownBoard(page)).toHaveAttribute("data-board", `puzzle-${expected[0]}`);
  await expect(page.getByText(/Соперник сыграл/)).toBeVisible();
  await page.getByRole("button", { name: /Подсказка/ }).click();
  await expect(page.getByText(/Ищи ход, после которого одна твоя фигура нападает сразу на две/)).toBeVisible();
  const s = await saved(page);
  expect(s.chessRating!.r).toBeLessThan(700);
  expect(s.chessPuzzles[`fork/${expected[0]}`].misses).toBe(1);
});

test("«Дятел»: набор из 20 задач, круг идёт по порядку, время считается", async ({ page }) => {
  await prepare(page);
  await page.goto("/chess/puzzles#woodpecker");
  await page.getByRole("button", { name: "▶ Начать первый круг" }).click();
  await expect(page.getByText(/Круг 1 из 3 · задача 1 из 20/)).toBeVisible();
  await solveShown(page);
  await expect(page.getByText(/— (мат|верно)!/)).toBeVisible();
  await page.getByRole("button", { name: "Следующая задача →" }).click();
  await expect(page.getByText(/Круг 1 из 3 · задача 2 из 20/)).toBeVisible();
  const w = (await saved(page)).chessWoodpecker!;
  expect(w.keys).toHaveLength(20);
  expect(w.index).toBe(1);
  expect(w.ms).toBeGreaterThan(0);
});

test("oʻzbekcha: bazadagi masala, mavzu va «Qizilishton» — kirill harfisiz", async ({ page }) => {
  await prepare(page, {}, "uz");
  const cyrillic = async () =>
    (await page.locator("main").innerText()).split("\n").filter((line) => /[А-Яа-яЁё]/.test(line));
  await page.goto("/chess/puzzles#theme-smothered");
  await expect(page.getByRole("heading", { level: 1, name: /Boʻgʻiq mot/ })).toBeVisible();
  await solveShown(page, "uz");
  await expect(page.getByText(/— mot!/)).toBeVisible();
  await expect(page.getByText(/Yechim: 1/)).toBeVisible();
  expect(await cyrillic()).toEqual([]);
  await page.goto("/chess/puzzles#woodpecker");
  await expect(page.getByRole("heading", { name: /Qizilishton/ })).toBeVisible();
  expect(await cyrillic()).toEqual([]);
  await page.goto("/chess/puzzles");
  await expect(page.getByRole("heading", { name: /Mening darajam/ })).toBeVisible();
  expect(await cyrillic()).toEqual([]);
});
