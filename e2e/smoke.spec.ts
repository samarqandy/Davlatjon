import { expect, test, type Page } from "@playwright/test";

/** Пропускаем приветственное окно, чтобы оно не мешало тестам. */
async function skipWelcome(page: Page) {
  await page.addInitScript(() => {
    const key = "davlatjon-lab:v1";
    if (!localStorage.getItem(key)) {
      localStorage.setItem(
        key,
        JSON.stringify({
          version: 1,
          welcomed: true,
          tasks: {},
          days: {},
          myProblems: [],
          reviews: {},
          settings: { hintPause: false, bigText: false },
        }),
      );
    }
  });
}

test.beforeEach(async ({ page }) => {
  await skipWelcome(page);
});

test("главная: неделя из 7 дней и сегодняшнее занятие", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Математика — это место/ })).toBeVisible();
  await expect(page.getByText("День 1. Смотри внимательно")).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/1/day/${d}"]`).first()).toBeVisible();
});

test("задача с числовым ответом: мягкая обратная связь и подсказки", async ({ page }) => {
  await page.goto("/week/1/day/1#task-1");
  await expect(page.getByRole("heading", { name: /Почти двадцать/ })).toBeVisible();
  const input = page.getByLabel("19 + 19 + 19 =");
  await input.fill("47");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Давай проверим твою идею/)).toBeVisible();
  await expect(page.getByText(/неправильно/i)).toHaveCount(0);

  await page.getByRole("button", { name: "Открыть подсказку" }).click();
  await expect(page.getByText(/Сколько раз в нём повторяется число 19/)).toBeVisible();

  await input.fill("57");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText("А ещё подумай")).toBeVisible();
});

test("робот доходит до флажка по программе", async ({ page }) => {
  await page.goto("/week/1/day/1#task-5");
  for (const dir of ["вверх", "вверх", "вверх", "вправо", "вправо", "вправо", "вправо"]) {
    await page.getByRole("button", { name: dir, exact: true }).click();
  }
  await page.getByRole("button", { name: /Запустить/ }).click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible({ timeout: 10_000 });
});

test("печать: лист заданий без ответов, ответы — только после PIN-кода", async ({ page }) => {
  await page.goto("/week/1/day/1/print");
  await expect(page.getByText("Davlatjon · задания")).toBeVisible();
  await expect(page.getByText("Ответ:")).toHaveCount(0);
  await page.getByRole("tab", { name: /Ответы/ }).click();
  await expect(page.getByRole("heading", { name: "Раздел для взрослых" })).toBeVisible();
});

test("раздел родителя: PIN-код, ответы и недельный обзор", async ({ page }) => {
  await page.goto("/parent");
  const pins = page.locator('input[type="password"]');
  await pins.nth(0).fill("2468");
  await pins.nth(1).fill("2468");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("heading", { name: /Здравствуйте/ })).toBeVisible();

  await page.goto("/parent/week/1/day/1");
  await expect(page.getByText("Ответ:").first()).toBeVisible();
  await expect(page.getByText("57").first()).toBeVisible();

  await page.goto("/parent/week/1/review");
  await expect(page.getByRole("heading", { name: "Недельный обзор" })).toBeVisible();
  await expect(page.getByText("Без ярлыков")).toBeVisible();
});

test("мои задачи: можно записать свою задачу", async ({ page }) => {
  await page.goto("/my-problems");
  await page.getByLabel("Условие задачи").fill("Сколько лап у трёх котов?");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сколько лап у трёх котов?")).toBeVisible();
});

test("главная: вторая неделя «Неделя инструментов»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Неделя инструментов/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/2/day/${d}"]`).first()).toBeVisible();
});

test("Удвоитель: из 1 в 25 за 6 команд", async ({ page }) => {
  await page.goto("/week/2/day/2#task-5");
  await expect(page.getByRole("heading", { name: /Удвоитель/ })).toBeVisible();
  const double = page.getByRole("button", { name: "Команда: удвой" });
  const plusOne = page.getByRole("button", { name: "Команда: прибавь 1" });
  for (const b of [double, plusOne, double, double, double, plusOne]) await b.click();
  await expect(page.getByText(/короче не бывает/)).toBeVisible();
});

test("ханойская башня: 3 кольца за 7 ходов", async ({ page }) => {
  await page.goto("/week/2/day/3#task-5");
  const peg = (name: string) => page.getByRole("button", { name: new RegExp(`^${name} стержень`) });
  const moves: [string, string][] = [
    ["левый", "правый"],
    ["левый", "средний"],
    ["правый", "средний"],
    ["левый", "правый"],
    ["средний", "левый"],
    ["средний", "правый"],
    ["левый", "правый"],
  ];
  for (const [from, to] of moves) {
    await peg(from).click();
    await peg(to).click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("переправа: волк, коза и капуста за 7 поездок", async ({ page }) => {
  await page.goto("/week/2/day/4#task-5");
  const board = (name: string) => page.getByRole("button", { name: `${name}: посадить в лодку` });
  const sail = page.getByRole("button", { name: /Плыть/ });
  // Сначала ошибка: без козы волк её съест.
  await board("капуста").click();
  await sail.click();
  await expect(page.getByText(/Стоп! Если крестьянин уплывёт, волк съест козу/)).toBeVisible();
  for (const who of ["коза", null, "волк", "коза", "капуста", null, "коза"]) {
    if (who) await board(who).click();
    await sail.click();
  }
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("главная: третья неделя «Неделя логики»", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Неделя логики/ })).toBeVisible();
  for (let d = 1; d <= 7; d++) await expect(page.locator(`a[href="/week/3/day/${d}"]`).first()).toBeVisible();
});

test("круги Эйлера: числа разложены по местам", async ({ page }) => {
  await page.goto("/week/3/day/3#task-3");
  const place = async (label: string, region: string) => {
    await page.getByRole("button", { name: label, exact: true }).first().click();
    await page.getByRole("button", { name: region }).click();
  };
  const plan: [string, string][] = [
    ["4", "только «Чётные»"],
    ["8", "только «Чётные»"],
    ["13", "только «Больше 10»"],
    ["17", "только «Больше 10»"],
    ["12", "в обоих кругах"],
    ["16", "в обоих кругах"],
    ["5", "вне кругов"],
    ["9", "вне кругов"],
  ];
  for (const [label, region] of plan) await place(label, region);
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Ответ совпадает/)).toBeVisible();
});

test("весы-детектив: фальшивая монета из девяти за два взвешивания", async ({ page }) => {
  await page.goto("/week/3/day/4#task-8");
  const coin = (n: number) => page.getByRole("button", { name: new RegExp(`^Монета ${n}:`) });
  const weigh = async (left: number[], right: number[]) => {
    for (const c of left) await coin(c).click();
    for (const c of right) for (let k = 0; k < 2; k++) await coin(c).click();
    await page.getByRole("button", { name: /Взвесить/ }).click();
    return (await page.getByText(/^Весы: /).textContent()) ?? "";
  };
  // Где лёгкая монета: на поднявшейся чаше, а при равновесии — на столе.
  const pick = (result: string, left: number[], right: number[], rest: number[]) =>
    result.includes("левая") ? right : result.includes("правая") ? left : rest;
  const first = await weigh([1, 2, 3], [4, 5, 6]);
  const group = pick(first, [1, 2, 3], [4, 5, 6], [7, 8, 9]);
  await page.getByRole("button", { name: "Снять монеты" }).click();
  const second = await weigh([group[0]], [group[1]]);
  const [fake] = pick(second, [group[0]], [group[1]], [group[2]]);
  await page.getByRole("button", { name: /Это фальшивая/ }).click();
  await coin(fake).click();
  await expect(page.getByText(`Фальшивая — монета № ${fake}.`, { exact: false })).toBeVisible();
});

test("обмен соседей: 5 обменов", async ({ page }) => {
  await page.goto("/week/3/day/5#task-5");
  for (const i of [0, 1, 3, 2, 1])
    await page
      .getByRole("button", { name: /^Поменять/ })
      .nth(i)
      .click();
  await expect(page.getByText(/Быстрее не бывает/)).toBeVisible();
});

test("шифр Цезаря: расшифровка", async ({ page }) => {
  await page.goto("/week/3/day/6#task-5");
  await page.getByLabel("Расшифрованное слово").fill("молодец");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Расшифровано: МОЛОДЕЦ/)).toBeVisible();
});

test("последний камешек: секрет побеждает робота", async ({ page }) => {
  await page.goto("/week/3/day/7#task-4");
  for (let turn = 0; turn < 10; turn++) {
    const text = (await page.getByText(/^Осталось:/).textContent()) ?? "";
    const left = Number(text.match(/\d+/)?.[0]);
    const take = left % 3 === 0 ? 1 : left % 3;
    await page.getByRole("button", { name: `Взять ${take}` }).click();
    if (left === take) break;
    await expect(page.getByText(`Осталось: ${left - take}`, { exact: false })).not.toBeVisible({ timeout: 5000 });
    await expect(page.getByText("🙂 Твой ход")).toBeVisible();
  }
  await expect(page.getByText(/Ты победил робота/)).toBeVisible();
});

/** Состояние с открытыми шахматными уровнями и решёнными упражнениями. */
async function chessState(page: Page, solved: string[] = [], openAll = false) {
  await page.addInitScript(
    ([ids, open]) => {
      localStorage.setItem(
        "davlatjon-lab:v1",
        JSON.stringify({
          version: 1,
          welcomed: true,
          tasks: {},
          days: {},
          myProblems: [],
          reviews: {},
          chess: Object.fromEntries((ids as string[]).map((id) => [id, { solvedAt: 1, misses: 0 }])),
          settings: { hintPause: false, bigText: false, chessOpenAll: open },
        }),
      );
    },
    [solved, openAll] as const,
  );
}

const square = (page: Page, board: string, sq: string) =>
  page.locator(`[data-board="${board}"] [data-square="${sq}"]`).click();

test("шахматная школа: шесть уровней, открыт только первый", async ({ page }) => {
  await page.goto("/chess");
  await expect(page.getByRole("heading", { name: "Шахматная школа" })).toBeVisible();
  for (const name of ["Пешка", "Конь", "Слон", "Ладья", "Ферзь", "Король"])
    await expect(page.getByText(name, { exact: true }).first()).toBeVisible();
  await expect(page.locator('a[href="/chess/pawn"]')).toBeVisible();
  await expect(page.locator('a[href="/chess/knight"]')).toHaveCount(0);
});

test("шахматы: найди клетки и ходы пешки", async ({ page }) => {
  await page.goto("/chess/pawn#exercise-1");
  for (const sq of ["e4", "a1", "h8", "d5", "c2"]) await square(page, "sq-pawn-squares", sq);
  await expect(page.getByText(/Все клетки найдены/)).toBeVisible();
  await page.goto("/chess/pawn#exercise-3");
  for (const sq of ["e3", "e4", "d3"]) await square(page, "mv-pawn-moves", sq);
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Найдено 3 из 4/)).toBeVisible();
  await square(page, "mv-pawn-moves", "f3");
  await page.getByRole("button", { name: "Проверить" }).click();
  await expect(page.getByText(/Все 4 клетки найдены/)).toBeVisible();
});

test("шахматы: звание «Пешка» открывает уровень «Конь», конь доходит до звезды за 6 ходов", async ({ page }) => {
  const pawnIds = [
    "pawn-squares",
    "pawn-board-quiz",
    "pawn-moves",
    "pawn-blocked",
    "pawn-capture",
    "pawn-promotion",
    "pawn-rules-quiz",
  ];
  await chessState(page, pawnIds);
  await page.goto("/chess");
  await expect(page.locator('a[href="/chess/knight"]')).toBeVisible();
  await expect(page.getByText(/Твоё звание/)).toBeVisible();
  await page.goto("/chess/knight#exercise-5");
  for (const sq of ["b3", "c5", "d7", "f8", "g6", "h8"]) await square(page, "st-knight-journey", sq);
  await expect(page.getByText(/Все звёзды собраны за 6 ходов/)).toBeVisible();
});

test("шахматы: мат в один ход", async ({ page }) => {
  await chessState(page, [], true);
  await page.goto("/chess/king#exercise-4");
  // Сначала ход без мата — позиция вернётся.
  await square(page, "mo-king-mate-rank", "a1");
  await square(page, "mo-king-mate-rank", "a7");
  await expect(page.getByText(/Это не шах/)).toBeVisible();
  await page.waitForTimeout(1800);
  await square(page, "mo-king-mate-rank", "a1");
  await square(page, "mo-king-mate-rank", "a8");
  await expect(page.getByText(/мат!/)).toBeVisible();
});

test("шахматы: партия с роботом — робот отвечает, ходы записываются", async ({ page }) => {
  await page.goto("/chess/play#robot-1-w");
  await expect(page.getByRole("heading", { name: /Робот «Пешка»/ })).toBeVisible();
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 10_000 });
  const moves = page.getByRole("list", { name: "Список ходов" });
  await expect(moves.getByText("e4", { exact: true })).toBeVisible();
  await expect(moves.locator("span.font-bold").nth(1)).not.toBeEmpty();
});

test("шахматы: задача по теме решается, серия считает", async ({ page }) => {
  await page.goto("/chess/puzzles#theme-mate1");
  await expect(page.getByRole("heading", { name: /Мат в 1 ход/ })).toBeVisible();
  await square(page, "puzzle-m1-backrank", "d1");
  await square(page, "puzzle-m1-backrank", "d8");
  await expect(page.getByText(/Лxd8# — мат!/)).toBeVisible();
  await page.getByRole("button", { name: "Следующая задача →" }).click();
  await expect(page.getByText("Детский мат", { exact: true })).toBeVisible();
});

test("шахматы: разбор знаменитой партии и главные моменты", async ({ page }) => {
  await page.goto("/chess/games/opera");
  await expect(page.getByRole("heading", { name: "Партия в опере" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "📷 Кто играл и где" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Молодой Пол Морфи сидит у шахматного столика" }).first()).toBeVisible();
  await expect(page.getByText("Wikimedia Commons").first()).toBeVisible();
  const next = page.getByRole("button", { name: "Ход вперёд" });
  for (let i = 0; i < 13; i++) await next.click();
  await expect(page.getByText(/Ферзь нападает сразу на две пешки/)).toBeVisible();
  await page.getByRole("button", { name: /Мат ладьёй на d8/ }).click();
  await expect(page.getByText("33 / 33")).toBeVisible();
});

test("шахматы: тренажёр дебюта принимает верные ходы", async ({ page }) => {
  await page.goto("/chess/openings#train-italian-white");
  await expect(page.getByRole("heading", { name: /Повтори дебют за белых/ })).toBeVisible();
  const play = async (from: string, to: string) => {
    await expect(page.getByText("🙂 Твой ход")).toBeVisible({ timeout: 5000 });
    await square(page, "train-italian", from);
    await square(page, "train-italian", to);
  };
  await play("e2", "e4");
  await play("g1", "f3");
  await play("d2", "d4");
  await expect(page.getByText(/В этом дебюте ходят по-другому/)).toBeVisible();
  await page.waitForTimeout(1000);
  await play("f1", "c4");
  await play("c2", "c3");
  await play("d2", "d3");
  await play("e1", "g1");
  await expect(page.getByText(/Дебют сыгран до конца/)).toBeVisible({ timeout: 5000 });
});

test("первый запуск: ребёнок называет имя и выбирает возраст, от него зависят открытые уровни шахмат", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("davlatjon-lab:v1", JSON.stringify({ version: 1 })));
  await page.goto("/");
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("heading", { name: /Добро пожаловать/ })).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Поехали! 🚀" })).toBeDisabled();
  // Приветствие читает диктор — запись есть на обоих языках.
  await expect(dialog.getByRole("button", { name: /Послушать приветствие/ })).toBeVisible();
  await dialog.getByRole("button", { name: "Oʻzbekcha" }).click();
  await expect(dialog.getByRole("button", { name: /Salomlashuvni tinglash/ })).toBeVisible();
  await dialog.getByRole("button", { name: "Русский" }).click();
  await dialog.getByRole("button", { name: "10", exact: true }).click();
  await expect(dialog.getByText(/Средний профиль/)).toBeVisible();
  // Без имени — ещё рано.
  await expect(dialog.getByRole("button", { name: "Поехали! 🚀" })).toBeDisabled();
  await dialog.getByLabel("Как тебя зовут?").fill("анна");
  await expect(dialog.getByText("Привет, Анна! 👋")).toBeVisible();
  await dialog.getByRole("button", { name: "Поехали! 🚀" }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText("Привет, Анна! 👋")).toBeVisible();
  await expect(page.getByText(/Режим занятий: 9–10 лет/)).toBeVisible();
  // Переходим по ссылке, а не через goto: при новой загрузке init-скрипты заново запишут localStorage.
  await page.getByRole("navigation", { name: "Разделы" }).getByRole("link", { name: "Шахматы" }).click();
  await expect(page).toHaveURL(/\/chess$/);
  await expect(page.getByText(/Сыграй с роботом «Конь»/)).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Слон" }).first().getByText("открыт")).toBeVisible();
  await expect(page.getByRole("listitem").filter({ hasText: "Ладья" }).first().getByText("🔒 закрыт")).toBeVisible();
});

test("шахматы: тайны — загадка, зёрна, легенда уровня и вопрос дня", async ({ page }) => {
  await page.goto("/chess/secrets");
  await expect(page.getByRole("heading", { name: "Тайны шахмат" })).toBeVisible();
  await page.getByRole("button", { name: /Мудрец попросил у царя/ }).click();
  await page.getByRole("button", { name: "Клетка 21", exact: true }).click();
  await expect(page.getByText("На ней зёрен: 1 048 576")).toBeVisible();
  await page.getByRole("button", { name: /машина обыгрывала лучших игроков/ }).click();
  await page.getByRole("button", { name: "Внутри шкафа прятался шахматист" }).click();
  await expect(page.getByText(/Точно! Внутри шкафа сидел сильный шахматист/)).toBeVisible();
  const riddle = page.getByRole("listitem").filter({ hasText: "1. Хожу буквой Г" });
  await riddle.getByRole("button", { name: "Конь" }).click();
  await expect(riddle.getByText(/✅ Верно!/)).toBeVisible();
  await page.goto("/chess/pawn");
  await expect(page.getByRole("heading", { name: /Почему из всех фигур только пешка/ })).toBeVisible();
  await page.getByRole("button", { name: "🗝️ Открыть тайну уровня" }).click();
  await expect(page.getByText(/до девяти ферзей/)).toBeVisible();
  await page.goto("/chess");
  await expect(page.getByText("🤔 Знаешь ли ты?")).toBeVisible();
  await page.getByRole("button", { name: "Показать ответ" }).click();
  await expect(page.getByRole("link", { name: "Подробнее →" })).toBeVisible();
});

test("шахматы: энциклопедия и дневник", async ({ page }) => {
  await page.goto("/chess/history");
  await expect(page.getByRole("heading", { name: "Всё о шахматах" })).toBeVisible();
  await expect(page.getByText("Фигурки с Афрасиаба", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Семь маленьких резных фигурок из слоновой кости" }).first(),
  ).toBeVisible();
  await expect(page.getByText("Гукеш Доммараджу").first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "📷 Откуда картинки" })).toBeVisible();
  await page.goto("/chess/diary");
  await page.getByPlaceholder(/папа, Али/).fill("папа");
  await page.getByRole("button", { name: /🤝 ничья/ }).click();
  await page.getByRole("button", { name: "Записать в дневник" }).click();
  await expect(page.getByText(/ничья · с папа/)).toBeVisible();
});

test("разбор партии: ошибки объясняются и становятся задачами", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "davlatjon-lab:v1",
      JSON.stringify({
        version: 1,
        welcomed: true,
        settings: { hintPause: false, bigText: false },
        chessGames: [
          {
            id: "gtest1",
            at: 1759000000000,
            mode: "robot",
            level: 3,
            color: "b",
            result: "loss",
            winner: "w",
            moves: 3,
            start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            ucis: ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"],
          },
        ],
      }),
    );
  });
  await page.goto("/chess/review");
  await page.getByRole("button", { name: /Робот «Слон» · поражение/ }).click();
  await expect(page.getByText("Твоя точность")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("heading", { name: "🎯 Главные моменты" })).toBeVisible();
  await expect(page.getByText(/Кf6 → лучше/)).toBeVisible();
  await page.getByRole("button", { name: /Кf6 → лучше/ }).click();
  await expect(page.getByText(/соперник ставит мат: Фxf7#/).first()).toBeVisible();
  await page.getByRole("link", { name: "🧩 Реши эти моменты как задачи" }).click();
  await expect(page.getByRole("heading", { name: "🧩 Задачи из твоих партий" })).toBeVisible();
  await expect(page.getByText(/Найди ход сильнее/)).toBeVisible();
  await square(page, "own-puzzle", "a7");
  await square(page, "own-puzzle", "a6");
  await expect(page.getByText("Есть ход сильнее. Подумай ещё!")).toBeVisible();
});

test("вдвоём с часами и форой", async ({ page }) => {
  await page.goto("/chess/play");
  await page.getByRole("group", { name: "Шахматные часы" }).getByRole("button", { name: "5 мин + 3 с" }).click();
  await page.getByRole("group", { name: "Фора", exact: true }).getByRole("button", { name: "без ферзя" }).click();
  await page.getByRole("button", { name: "Начать партию" }).click();
  await expect(page.getByText(/Фора: белые без ферзя/)).toBeVisible();
  await expect(page.getByLabel("Часы белых")).toHaveText("5:00");
  await expect(
    page.locator('[data-board="play"] [data-square="d1"] img, [data-board="play"] [data-square="d1"] svg'),
  ).toHaveCount(0);
  await square(page, "play", "e2");
  await square(page, "play", "e4");
  await expect(page.getByText("Ходят чёрные")).toBeVisible();
  await expect(page.getByLabel("Часы чёрных")).not.toHaveText("5:00", { timeout: 5000 });
});

test("сыграй как Морфи: угадай ход победителя", async ({ page }) => {
  await page.goto("/chess/games/opera");
  await page.getByRole("button", { name: "Играть «Угадай ход»" }).click();
  await expect(page.getByText(/Твой ход за белых/)).toBeVisible();
  await square(page, "guess-opera", "e2");
  await square(page, "guess-opera", "e4");
  await expect(page.getByText(/точно как Пол Морфи! \+3/)).toBeVisible();
});

test("тренажёр координат: цвет клетки", async ({ page }) => {
  await page.goto("/chess/coordinates");
  await page.getByRole("button", { name: /Какого цвета\?/ }).click();
  await page.getByRole("button", { name: "▶ Старт" }).click();
  const sq = (await page.locator("p.text-7xl").innerText()).trim();
  const light = ("abcdefgh".indexOf(sq[0]) + Number(sq[1])) % 2 === 0;
  await page.getByRole("button", { name: light ? "светлая" : "тёмная" }).click();
  await expect(page.getByText("Верно: 1")).toBeVisible();
});

test("озвучка: кнопки «Послушать», выключение в настройках", async ({ page }) => {
  await page.goto("/chess/pawn");
  await expect(page.getByRole("button", { name: /Послушать легенду/ })).toBeVisible();
  await page.goto("/chess/secrets");
  await page.getByRole("button", { name: /Мудрец попросил у царя/ }).click();
  await expect(page.getByRole("button", { name: /Послушать историю/ })).toBeVisible();
  await page.evaluate(() => {
    const key = "davlatjon-lab:v1";
    const s = JSON.parse(localStorage.getItem(key) ?? "{}");
    s.settings = { ...s.settings, sound: false };
    localStorage.setItem(key, JSON.stringify(s));
  });
  await page.reload();
  await page.getByRole("button", { name: /Мудрец попросил у царя/ }).click();
  await expect(page.getByRole("button", { name: /Послушать историю/ })).toHaveCount(0);
});

test("шторм, повторение, награды и PGN", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "davlatjon-lab:v1",
      JSON.stringify({
        version: 1,
        welcomed: true,
        settings: { hintPause: false, bigText: false },
        chessPuzzles: { "m1-backrank": { misses: 1, box: 1, due: "2020-01-01" } },
        chessGames: [
          {
            id: "gpgn",
            at: 1759000000000,
            mode: "robot",
            level: 1,
            color: "w",
            result: "win",
            winner: "w",
            moves: 4,
            start: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            ucis: ["e2e4", "e7e5", "f1c4", "b8c6", "d1h5", "g8f6", "h5f7"],
          },
        ],
      }),
    );
  });
  await page.goto("/chess/puzzles");
  await expect(page.getByRole("button", { name: "Повторить (1)" })).toBeVisible();
  await page.getByRole("button", { name: "Повторить (1)" }).click();
  await page.getByRole("button", { name: "Начать повторение" }).click();
  await expect(page.getByText("Задача 1 из 1")).toBeVisible();
  await page.goto("/chess/puzzles#storm");
  await page.getByRole("button", { name: "▶ Старт" }).click();
  await expect(page.getByText(/⚡ 0 · ⏱ 2:5\d|⚡ 0 · ⏱ 3:00/)).toBeVisible();
  await page.goto("/chess/awards");
  await expect(page.getByRole("heading", { name: "Мои награды и занятия" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "📅 Календарь занятий" })).toBeVisible();
  await expect(page.getByText("Первая победа").locator("..")).toContainText("получена");
  await page.goto("/chess/review#gpgn");
  await expect(page.getByRole("button", { name: "⬇️ Скачать PGN" })).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "⬇️ Скачать PGN" }).click();
  expect((await download).suggestedFilename()).toBe("partiya-gpgn.pgn");
});
