import { expect, test, type Page } from "@playwright/test";

/** Приветствие пропущено; звуки доски записываются в window.__sfx. */
async function prepare(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key))
      localStorage.setItem(
        key,
        JSON.stringify({ version: 1, welcomed: true, settings: { hintPause: false, bigText: false, age: 9 } }),
      );
    const w = window as unknown as { __sfx: string[] };
    w.__sfx = [];
    window.addEventListener("board-sfx", (e) => w.__sfx.push((e as CustomEvent<string>).detail));
  });
}

const board = (page: Page) => page.locator('[data-board="analysis"]');
const sq = (page: Page, square: string) => board(page).locator(`[data-square="${square}"]`);
const text = async (page: Page, what: "files" | "ranks") =>
  (await board(page).locator(`[data-coords="${what}"]`).innerText()).replace(/\s/g, "");

test.beforeEach(async ({ page }) => {
  await prepare(page);
});

test("на рамке доски — буквы снизу и цифры слева; при повороте доски они тоже поворачиваются", async ({ page }) => {
  await page.goto("/chess/analysis");
  expect(await text(page, "files")).toBe("abcdefgh");
  expect(await text(page, "ranks")).toBe("87654321");
  await page.getByRole("button", { name: /Перевернуть/ }).click();
  await expect.poll(() => text(page, "files")).toBe("hgfedcba");
  expect(await text(page, "ranks")).toBe("12345678");
});

test("ход, взятие — у каждого свой звук", async ({ page }) => {
  await page.goto("/chess/analysis");
  for (const [from, to] of [
    ["e2", "e4"],
    ["d7", "d5"],
    ["e4", "d5"],
  ]) {
    await sq(page, from).click();
    await sq(page, to).click();
  }
  await expect
    .poll(() => page.evaluate(() => (window as unknown as { __sfx: string[] }).__sfx))
    .toEqual(["move", "move", "capture"]);
});

test("пешка дошла до края — ребёнок сам выбирает фигуру", async ({ page }) => {
  await page.goto("/chess/analysis#fen=8/4P3/8/8/8/k7/8/K7_w_-_-_0_1");
  await sq(page, "e7").click();
  await sq(page, "e8").click();
  const picker = page.locator('[data-promotion="e8"]');
  await expect(picker).toBeVisible();
  await picker.getByRole("button", { name: "Конь" }).click();
  await expect(picker).toHaveCount(0);
  await expect(page.getByRole("button", { name: /e8=К/ })).toBeVisible();
});

test("ход связанной фигурой: доска объясняет, почему нельзя", async ({ page }) => {
  await page.goto("/chess/analysis#fen=4r1k1/8/8/8/8/8/4N3/4K3_w_-_-_0_1");
  await sq(page, "e2").click();
  await sq(page, "c3").click();
  await expect(board(page)).toHaveAttribute("data-rejected", "c3");
  await expect(page.locator("[data-illegal]")).toContainText("закрывает короля");
});

test("на телефоне касание с дрожанием пальца — всё равно нажатие", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "только сенсорный экран");
  await page.goto("/chess/analysis");
  const box = (await sq(page, "e2").boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 3, y: y + 2 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  // Пешка выбрана: на e4 видна точка «сюда можно».
  await expect(sq(page, "e4").locator("div").first()).toHaveAttribute("style", /radial-gradient/);
});

test("нажатие: фигура выбрана — видны точки; другая своя фигура — выбор переходит; та же — выбор снят", async ({
  page,
}) => {
  await page.goto("/chess/analysis");
  const dot = (square: string) => sq(page, square).locator("div").first();
  await sq(page, "e2").click();
  await expect(dot("e4")).toHaveAttribute("style", /radial-gradient/);
  await sq(page, "g1").click();
  await expect(dot("f3")).toHaveAttribute("style", /radial-gradient/);
  await expect(dot("e4")).not.toHaveAttribute("style", /radial-gradient/);
  await sq(page, "g1").click();
  await expect(dot("f3")).not.toHaveAttribute("style", /radial-gradient/);
  // Ничего не сходили: конь на месте.
  await expect(sq(page, "g1").locator('[data-piece="wN"]')).toBeVisible();
});

test("король под шахом отмечен и в игре, и при просмотре: доска анализа и дебют", async ({ page }) => {
  await page.goto("/chess/analysis");
  for (const [from, to] of [
    ["e2", "e4"],
    ["f7", "f6"],
    ["d1", "h5"],
  ]) {
    await sq(page, from).click();
    await sq(page, to).click();
  }
  const red = /radial-gradient\(circle,\s*rgba\(239, 68, 68/;
  await expect(sq(page, "e8").locator("div").first()).toHaveAttribute("style", red);
  // Просмотр дебюта открывается на последнем ходе: ловушка Легаля кончается матом королю на e7.
  await page.goto("/chess/openings#open-legal-trap");
  const viewer = page.locator('[data-board="opening-legal-trap"]');
  await expect(viewer.locator('[data-square="e7"] div').first()).toHaveAttribute("style", red);
});

test("доска анализа называет дебют по ходам; при шаге назад название снова общее; по-узбекски — латиницей", async ({
  page,
}) => {
  await page.goto("/chess/analysis");
  const opening = page.locator("[data-opening]");
  // Пока ходов нет, названия нет — и книга дебютов не загружена.
  await expect(opening).toHaveCount(0);
  const play = async (moves: [string, string][]) => {
    for (const [from, to] of moves) {
      await sq(page, from).click();
      await sq(page, to).click();
    }
  };
  await play([["e2", "e4"]]);
  await expect(opening).toHaveText("Название дебюта: Дебют королевской пешки");
  await play([
    ["e7", "e5"],
    ["g1", "f3"],
    ["b8", "c6"],
    ["f1", "c4"],
  ]);
  await expect(opening).toHaveText("Название дебюта: Итальянская партия");
  await expect(opening).toHaveAttribute("data-opening", "Italian Game");
  await page.getByRole("button", { name: "Назад", exact: true }).click();
  await page.getByRole("button", { name: "Назад", exact: true }).click();
  await expect(opening).toHaveText("Название дебюта: Дебют королевского коня");
  await page.getByRole("button", { name: "В конец" }).click();
  await page.getByRole("button", { name: "UZ" }).click();
  await expect(opening).toHaveText("Debyut nomi: Italyan partiyasi");
});

/** Рисунок фигуры, которую сейчас ведут: её копия лежит не в клетке. */
const inHand = (page: Page) =>
  board(page).evaluate((root) => {
    const copy = [...root.querySelectorAll("[data-piece]")].find((el) => !el.closest("[data-square]"));
    const r = copy?.firstElementChild?.getBoundingClientRect();
    return r ? { top: r.top, bottom: r.bottom, width: r.width, middle: r.top + r.height / 2 } : null;
  });

test("фигуру ведут пальцем: она крупнее и над пальцем, клетка под пальцем обведена; ход ставится", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "phone", "только сенсорный экран");
  await page.goto("/chess/analysis");
  const from = (await sq(page, "e2").boundingBox())!;
  const to = (await sq(page, "e4").boundingBox())!;
  const x = from.x + from.width / 2;
  const finger = to.y + to.height / 2;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y: from.y + from.height / 2 }] });
  for (let i = 1; i <= 8; i++) {
    const y = from.y + from.height / 2 + ((finger - from.y - from.height / 2) * i) / 8;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
  }
  await expect.poll(() => inHand(page)).not.toBeNull();
  const piece = (await inHand(page))!;
  // Почти вдвое крупнее клетки; середина — выше пальца, а не под ним; низ фигуры палец почти не закрывает.
  expect(piece.width).toBeGreaterThan(to.width * 1.6);
  expect(finger - piece.middle).toBeGreaterThan(to.height * 0.4);
  expect(piece.bottom - finger).toBeLessThan(to.height * 0.5);
  // Клетка под пальцем: рамка и широкое кольцо, которое видно вокруг пальца.
  await expect(sq(page, "e4")).toHaveAttribute("style", /box-shadow:[^;]*18px[^;]*inset/);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(sq(page, "e4").locator('[data-piece="wP"]')).toBeVisible();
  expect(await inHand(page)).toBeNull();
});

test("фигуру ведут мышью: она под указателем и лишь чуть приподнята, клетка обведена рамкой; ход ставится", async ({
  page,
}, info) => {
  test.skip(info.project.name === "phone", "мышь — на компьютере");
  await page.goto("/chess/analysis");
  const from = (await sq(page, "g1").boundingBox())!;
  const to = (await sq(page, "f3").boundingBox())!;
  const pointer = { x: to.x + to.width / 2, y: to.y + to.height / 2 };
  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(pointer.x, pointer.y, { steps: 8 });
  await expect.poll(() => inHand(page)).not.toBeNull();
  const piece = (await inHand(page))!;
  expect(piece.width).toBeGreaterThan(to.width * 1.05);
  expect(piece.width).toBeLessThan(to.width * 1.3);
  expect(Math.abs(piece.middle - pointer.y)).toBeLessThan(to.height * 0.15);
  await expect(sq(page, "f3")).toHaveAttribute("style", /box-shadow:[^;]*4px inset/);
  await expect(sq(page, "f3")).not.toHaveAttribute("style", /18px/);
  await page.mouse.up();
  await expect(sq(page, "f3").locator('[data-piece="wN"]')).toBeVisible();
});

test("цвета доски и набор звуков выбираются в «Моя доска и звук» и запоминаются", async ({ page }) => {
  await page.goto("/chess/play");
  await page.locator("[data-board-look-details] summary").click();
  await page.locator('[data-board-theme-pick="violet"]').click();
  await page.locator('[data-sound-set-pick="soft"]').click();
  await expect(page.locator('[data-board-theme-pick="violet"]')).toHaveAttribute("aria-checked", "true");
  await expect(page.locator('[data-sound-set-pick="soft"]')).toHaveAttribute("aria-checked", "true");
  await page.goto("/chess/analysis");
  await expect(board(page)).toHaveAttribute("data-board-theme", "violet");
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}").settings);
  expect(stored.boardTheme).toBe("violet");
  expect(stored.boardSoundSet).toBe("soft");
});

// Карточки в списках показывают позицию картинкой, а не настоящей доской: список из 18 дебютов с настоящими
// досками оживал на медленном телефоне 2,1 с. Картинка — один рисунок; фигуры обычного набора лежат на странице
// один раз, картинки на них ссылаются.
test("в списке дебютов позиции нарисованы картинками: фигуры на месте, настоящих досок нет, набор фигур — выбранный", async ({
  page,
}) => {
  await page.goto("/chess/openings");
  const thumbs = page.locator("[data-board-thumb]");
  await expect(thumbs).toHaveCount(18);
  await expect(page.locator("[data-board]")).toHaveCount(0);
  // Итальянская партия после 6…0-0: все 32 фигуры на доске, белый слон стоит на c4.
  const italian = page.getByRole("button", { name: /Итальянская партия/ }).locator("[data-board-thumb]");
  await expect(italian.locator("[data-piece]")).toHaveCount(32);
  const bishop = italian.locator('use[data-piece="wB"][x="2"][y="4"]');
  await expect(bishop).toHaveCount(1);
  // Ссылка ведёт на рисунок фигуры, и он на странице один; фигура действительно нарисована (у неё есть размер).
  await expect(page.locator("svg[data-piece-sprite] symbol#piece-wB")).toHaveCount(1);
  expect((await bishop.boundingBox())!.width).toBeGreaterThan(8);
  // Картинка — не кнопка в кнопке: для экранного диктора у карточки одно название.
  await expect(italian).toHaveAttribute("aria-hidden", "true");

  // Набор-картинки («Объёмные»): те же позиции, фигуры — файлами набора, общий рисунок не нужен.
  await page.evaluate((key) => {
    const state = JSON.parse(localStorage.getItem(key) ?? "{}");
    state.settings = { ...state.settings, pieceSet: "celtic" };
    localStorage.setItem(key, JSON.stringify(state));
  }, "davlatjon-lab:v1");
  await page.reload();
  await expect(thumbs).toHaveCount(18);
  await expect(italian.locator('image[data-piece="wB"][x="2"][y="4"]')).toHaveAttribute(
    "href",
    "/pieces/celtic/wB.svg",
  );
  await expect(page.locator("svg[data-piece-sprite]")).toHaveCount(0);

  // В списке партий карточка выше картинки: рамка доски не должна тянуться на всю высоту карточки.
  await page.goto("/chess/games");
  await expect(thumbs).toHaveCount(8);
  const sizes = await thumbs.evaluateAll((els) =>
    els.map((el) => el.getBoundingClientRect()).map((r) => [r.width, r.height]),
  );
  for (const [width, height] of sizes) expect(Math.abs(width - height)).toBeLessThanOrEqual(1);

  // Карточка по-прежнему открывает дебют.
  await page.goto("/chess/openings");
  await page.getByRole("button", { name: /Итальянская партия/ }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Итальянская партия" })).toBeVisible();
  await expect(page.locator('[data-board="opening-italian"]')).toBeVisible();
});

// Библиотека доски даёт каждой фигуре роль кнопки без названия; названия ставим мы. Раньше — после отрисовки:
// 15–30 мс (на слабом телефоне до 150 мс) на доске стояли 16–32 безымянные кнопки, и проверка доступности
// изредка попадала в это окно.
test("фигуры на доске не бывают без названия ни в одном кадре — когда доска появляется и после хода", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const w = window as unknown as { __unnamed: number };
    w.__unnamed = 0;
    const tick = () => {
      const pieces = document.querySelectorAll('[aria-roledescription="draggable"]:not([aria-label])');
      w.__unnamed = Math.max(w.__unnamed, pieces.length);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  const worst = () => page.evaluate(() => (window as unknown as { __unnamed: number }).__unnamed);

  await page.goto("/chess/puzzles#practice");
  await expect(page.locator('[aria-roledescription="draggable"]').first()).toBeVisible();
  // Соперник делает первый ход задачи — фигуры перерисовываются.
  await page.waitForTimeout(1500);
  expect(await worst()).toBe(0);

  // Доска анализа приходит готовым HTML: до оживления страницы названий нет (их может поставить только скрипт),
  // но и нажать на фигуру ещё нельзя. Считаем с момента, когда страница ожила.
  await page.goto("/chess/analysis");
  await expect(board(page).locator('[aria-roledescription="draggable"][aria-label]')).toHaveCount(32);
  await page.evaluate(() => void ((window as unknown as { __unnamed: number }).__unnamed = 0));
  await sq(page, "e2").click();
  await sq(page, "e4").click();
  await expect(board(page).locator('[aria-label="белая пешка, e4"]')).toHaveCount(1);
  await sq(page, "g8").click();
  await sq(page, "f6").click();
  await expect(board(page).locator('[aria-label="чёрный конь, f6"]')).toHaveCount(1);
  expect(await worst()).toBe(0);
});

test("набор фигур выбирается в «Моя доска и звук»: доска рисует его, ходы работают, выбор запоминается", async ({
  page,
}) => {
  await page.goto("/chess/play");
  await page.locator("[data-board-look-details] summary").click();
  await expect(page.locator('[data-piece-set-pick="classic"]')).toHaveAttribute("aria-checked", "true");
  // Авторы свободных наборов названы рядом с выбором: этого требуют их лицензии.
  await expect(page.locator("[data-piece-credits]")).toContainText("Maurizio Monge (MIT)");
  await expect(page.locator("[data-piece-credits]")).toContainText("Alexis Luengas (Apache 2.0)");
  await page.locator('[data-piece-set-pick="celtic"]').click();
  await expect(page.locator('[data-piece-set-pick="celtic"]')).toHaveAttribute("aria-checked", "true");

  await page.goto("/chess/analysis");
  const knight = sq(page, "g1").locator("img");
  await expect(knight).toHaveAttribute("src", "/pieces/celtic/wN.svg");
  // Картинка загрузилась, а не осталась пустым местом.
  await expect.poll(() => knight.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  // Всего 32 фигуры, и у каждой для экранного диктора осталось название.
  await expect(board(page).locator("img")).toHaveCount(32);
  await expect(board(page).locator('[aria-label="белый конь, g1"]')).toHaveCount(1);
  // Ход нажатиями работает так же, как с классическими фигурами.
  await sq(page, "e2").click();
  await sq(page, "e4").click();
  await expect(sq(page, "e4").locator("img")).toHaveAttribute("src", "/pieces/celtic/wP.svg");
  await expect(sq(page, "e2").locator("img")).toHaveCount(0);

  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("davlatjon-lab:v1") ?? "{}").settings);
  expect(stored.pieceSet).toBe("celtic");
  // Вернуться к классическим: картинок на доске нет, фигуры рисуются кодом.
  await page.goto("/chess/play");
  await page.locator("[data-board-look-details] summary").click();
  await page.locator('[data-piece-set-pick="classic"]').click();
  await page.goto("/chess/analysis");
  await expect(sq(page, "g1").locator("svg")).toHaveCount(1);
  await expect(board(page).locator("img")).toHaveCount(0);
});

test("в углу рамки — чей ход: □ белые, ■ чёрные; после хода квадратик меняется", async ({ page }) => {
  await page.goto("/chess/analysis");
  const turn = board(page).locator(".board-turn");
  await expect(turn).toHaveAttribute("data-turn", "w");
  await expect(board(page)).toHaveAttribute("aria-label", /ходят белые/);
  await sq(page, "e2").click();
  await sq(page, "e4").click();
  await expect(turn).toHaveAttribute("data-turn", "b");
});

test("на телефоне задание и чей ход — над доской задачи, а доска целиком на экране", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "раскладка для телефона");
  await page.goto("/chess/puzzles#theme-mate1");
  const prompt = page.locator("[data-puzzle-prompt]");
  await expect(prompt).toBeVisible();
  const promptBox = (await prompt.boundingBox())!;
  const boardBox = (await page.locator('[data-board^="puzzle-"]').boundingBox())!;
  expect(promptBox.y + promptBox.height).toBeLessThanOrEqual(boardBox.y);
  expect(boardBox.y + boardBox.height).toBeLessThanOrEqual(page.viewportSize()!.height);
});

test("в упражнениях уровня «Следующее упражнение» оставляет доску на экране", async ({ page }, info) => {
  test.skip(info.project.name !== "phone", "раскладка для телефона");
  await page.goto("/chess/pawn#exercises");
  await page.getByRole("button", { name: "Следующее упражнение →" }).click();
  await expect(page).toHaveURL(/#exercise-2$/);
  const top = page.locator("#exercises-top");
  await expect.poll(async () => (await top.boundingBox())!.y).toBeLessThan(120);
});
