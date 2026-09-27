/**
 * Схема контента программы.
 *
 * Весь контент — обычные сериализуемые данные (без функций), поэтому его можно
 * передавать из серверных компонентов в клиентские и проверять тестами.
 */

/** Разделы дня (структура из мастер-промпта, раздел 6). */
export type SectionId = "warmup" | "logic" | "pattern" | "algorithm" | "spatial" | "real" | "challenge" | "research";

/** Уровни сложности (раздел 8): 1 — комфортно … 5 — исследование. */
export type Level = 1 | 2 | 3 | 4 | 5;

/** Клетка поля: [столбец, строка], строки считаются сверху вниз, с нуля. */
export type Cell = readonly [col: number, row: number];

/** Команды робота: вверх, вниз, влево, вправо. */
export type Dir = "U" | "D" | "L" | "R";

export type ShapeKind = "circle" | "square" | "triangle" | "star";
export type ColorName = "red" | "blue" | "green" | "yellow" | "black" | "gray" | "purple" | "orange";

export interface ShapeSpec {
  shape: ShapeKind;
  color: ColorName;
}

// ---------------------------------------------------------------------------
// Иллюстрации (статичные — одинаково выглядят на экране и на бумаге)
// ---------------------------------------------------------------------------

export type Visual =
  /** Ряд чисел; `null` — пустое окошко «?». */
  | { type: "sequence"; items: (number | string | null)[] }
  /** Цепочка действий: 7 → +8 → … → ?. `null` — пустое окошко. */
  | { type: "chain"; start: number | null; steps: string[]; end: number | null }
  /** Числовая машина: таблица «вход → выход». */
  | { type: "machine"; rows: { input: number | null; output: number | null }[] }
  /** Карточки с эмодзи (животные, персонажи, домики…). */
  | { type: "cards"; items: { emoji: string; label: string; color?: ColorName }[] }
  /** Ряд фигур; `null` — пустое место «?». */
  | { type: "shapes"; items: (ShapeSpec | null)[] }
  /** Прямоугольник, разбитый на клетки (задачи «сколько квадратов»). */
  | { type: "gridFigure"; cols: number; rows: number }
  /** Фигура из кубиков в изометрии; heights[ряд][столбец], ряд 0 — дальний. */
  | { type: "isoCubes"; heights: number[][] }
  /** Весы в равновесии. */
  | { type: "balance"; scales: { left: string[]; right: string[] }[] }
  /** Треугольник с линиями из верхней вершины. */
  | { type: "triangleFan"; lines: number }
  /** Чек из магазина. */
  | { type: "receipt"; lines: { label: string; price: string }[]; total: string }
  /** Лесенки из кубиков: 1, 2, …, count ступенек. */
  | { type: "staircases"; count: number }
  /** Футболки и брюки разных цветов. */
  | { type: "outfits"; shirts: ColorName[]; pants: ColorName[] }
  /** Дерево решений из двух вопросов и четырёх коробок. */
  | {
      type: "decisionTree";
      first: string;
      second: string;
      /** Коробки в порядке: (да, да), (да, нет), (нет, да), (нет, нет). */
      boxes: [string, string, string, string];
    }
  /** Карта с координатами: столбцы — буквы, строки — числа снизу вверх. */
  | {
      type: "coordGrid";
      cols: string[];
      rows: number;
      items: { cell: string; emoji: string; label: string }[];
    }
  /** Часы со стрелками. */
  | { type: "clock"; time: string; caption?: string }
  /** Шоколадка из долек. */
  | { type: "chocolate"; cols: number; rows: number }
  /** Столб с делениями для задачи про улитку. */
  | { type: "pole"; height: number; emoji: string }
  /** Калькулятор со сломанными кнопками; target — какое число нужно получить. */
  | { type: "calculator"; broken: string[]; target?: number }
  /**
   * Фигура из клеточек (полимино). labels — надписи в клетках (в том же порядке, что cells),
   * size — размер клетки в пикселях.
   */
  | { type: "polyomino"; cells: Cell[]; labels?: string[]; size?: number }
  /** Прямоугольники из точек: cols × rows в каждой фигуре. */
  | { type: "dots"; figures: { cols: number; rows: number }[] }
  /** Дорожки из спичек: квадраты или треугольники в ряд; figures — сколько фигур в каждой дорожке. */
  | { type: "matches"; shape: "squares" | "triangles"; figures: number[] }
  /** Числовая стенка: ряды сверху вниз, каждое число — сумма двух чисел под ним. `null` — пустой кирпич. */
  | { type: "pyramid"; rows: (number | null)[][] }
  /**
   * Рабочая таблица для логических задач: ребёнок ставит ✗ и ✓.
   * На экране — интерактивная, на бумаге — пустая таблица.
   */
  | { type: "logicGrid"; rows: string[]; cols: string[]; corner?: string }
  /** Пустая таблица для записей (например, дневник исследования). printOnly — только на бумаге. */
  | { type: "table"; head: string[]; rows: string[][]; printOnly?: boolean };

// ---------------------------------------------------------------------------
// Текст условия
// ---------------------------------------------------------------------------

/**
 * Мини-разметка в тексте:
 * - `**жирный**`
 * - `` `27 + 18 = 35` `` — математическое выражение (не переносится по строкам)
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "note"; text: string }
  | { type: "visual"; visual: Visual }
  | { type: "question"; label: string; text?: string; visual?: Visual };

// ---------------------------------------------------------------------------
// Как ребёнок отвечает
// ---------------------------------------------------------------------------

export interface Option {
  id: string;
  label: string;
  visual?: Visual | { type: "shape"; shape: ShapeSpec };
}

export type Field =
  | { type: "number"; id: string; label: string; answer: number; suffix?: string }
  | { type: "time"; id: string; label: string; answer: string }
  | { type: "coord"; id: string; label: string; answer: string; cols: string[]; rows: number };

export interface RobotPuzzle {
  /** Карта: `.` пусто, `#` стена, `R` робот, `F` флажок, `*` звезда, буквы — предметы. */
  map: string[];
  legend?: Record<string, { emoji: string; name: string }>;
  mode: "build" | "trace" | "debug" | "paths" | "collect";
  /** Готовая программа (для режимов trace и debug). */
  program?: Dir[];
  /** trace: буква предмета, у которого остановится робот. */
  traceAnswer?: string;
  /** Длина самой короткой программы (проверяется тестами). */
  optimal?: number;
  /** paths: сколько всего разных кратчайших программ. */
  pathsCount?: number;
}

/** Команда исполнителя: прибавить, отнять или умножить (×2 — «удвой»). */
export interface PerformerCommand {
  op: "add" | "sub" | "mul";
  value: number;
}

export interface PerformerPuzzle {
  /** Кто выполняет команды, например «Удвоитель» 🤖 или «Кузнечик» 🦗. */
  name: string;
  emoji: string;
  start: number;
  target: number;
  commands: PerformerCommand[];
  /** Числа не могут выходить за эти границы (например, левее нуля). */
  min?: number;
  max?: number;
  /** Показать числовой луч от min до max. */
  line?: boolean;
  /** Длина самой короткой программы (проверяется тестами). */
  optimal: number;
}

export interface CrossingPuzzle {
  /** Тот, кто управляет лодкой, — без него лодка не плывёт. */
  driver: { emoji: string; name: string };
  items: { id: string; emoji: string; name: string }[];
  /** Кого нельзя оставлять вместе без driver; text — что случится («Волк съел козу!»). */
  conflicts: { eater: string; eaten: string; text: string }[];
  /** Сколько пассажиров помещается в лодку, кроме driver. */
  capacity: number;
  /** Наименьшее число переправ (проверяется тестами). */
  optimal: number;
}

export interface GraphPuzzle {
  nodes: { id: string; label: string; emoji: string; x: number; y: number }[];
  edges: { a: string; b: string; w: number }[];
  start: string;
  finish: string;
  unit: string;
  optimal: number;
}

export type AnswerSpec =
  /** Поля ввода: числа, время, клетка карты. */
  | { kind: "fields"; fields: Field[] }
  /** Выбор одного или нескольких вариантов. */
  | { kind: "choice"; prompt: string; options: Option[]; correct: string[]; multiple?: boolean }
  /** Каждому элементу — свой вариант (домики → животные, числа → коробки). */
  | { kind: "assign"; prompt: string; items: Option[]; options: Option[]; correct: Record<string, string> }
  /** Расставить по порядку. */
  | { kind: "order"; prompt: string; items: Option[]; correct: string[] }
  | { kind: "robot"; puzzle: RobotPuzzle }
  /** Дорисовать симметричную половину. `X` — закрашено; ось — справа от левой половины. */
  | { kind: "symmetry"; left: string[] }
  | { kind: "graph"; puzzle: GraphPuzzle }
  /** Волшебный квадрат: `null` — пустая клетка. */
  | { kind: "magicSquare"; grid: (number | null)[][]; answer: number[][] }
  /** Расставить знаки + и −. */
  | { kind: "signs"; rows: { numbers: number[]; result: number; answer: ("+" | "−")[] }[] }
  /** Разрезать квадрат size × size на две одинаковые части. */
  | { kind: "partition"; size: number; distinct: number }
  /** Волшебный треугольник с числами 1…6. */
  | { kind: "magicTriangle"; numbers: number[]; sums: number[] }
  /** Сломанный калькулятор: собрать разные выражения с заданным ответом. */
  | { kind: "expressions"; target: number; forbidden: string[] }
  /** Несколько правильных ответов (разные правила продолжения ряда). */
  | { kind: "rules"; label: string; known: { value: number; rule: string }[] }
  /** Исполнитель (Удвоитель, Кузнечик…): командами получить из start число target. */
  | { kind: "performer"; puzzle: PerformerPuzzle }
  /** Ханойская башня: перенести башню из disks колец на правый стержень. */
  | { kind: "hanoi"; disks: number; optimal: number }
  /** Переправа через реку. */
  | { kind: "crossing"; puzzle: CrossingPuzzle }
  /** Переливания: в одном из двух сосудов нужно получить target литров. */
  | { kind: "jugs"; capacities: [number, number]; target: number; optimal: number }
  /** Судоку: в каждой строке, столбце и прямоугольнике box (столбцов × строк) все числа по одному разу. */
  | { kind: "sudoku"; grid: (number | null)[][]; answer: number[][]; box: [number, number] }
  /** Числовая стенка-лаборатория: расставить numbers в нижнем ряду; tops — все возможные числа наверху. */
  | { kind: "wallLab"; numbers: number[]; tops: number[] }
  /** Открытая задача: ребёнок отмечает, что решил, и объясняет взрослому. */
  | { kind: "open"; prompt: string };

// ---------------------------------------------------------------------------
// Задача, день, неделя
// ---------------------------------------------------------------------------

export interface Solution {
  /** Короткий ответ. */
  answer: string;
  /** Краткое объяснение (абзацы). */
  explanation: string[];
  /** Что обсудить, другие способы, частые ошибки. */
  discuss?: string[];
}

export type PrintSpace = "none" | "lines" | "small" | "medium" | "large";

export interface Task {
  /** Стабильный идентификатор — по нему хранится прогресс. */
  id: string;
  section: SectionId;
  level: Level;
  title: string;
  body: Block[];
  answer: AnswerSpec;
  /** «А ещё подумай»: вопросы после решения. */
  followUps: string[];
  /** Лестница подсказок (раздел 9): перечитать → что известно → нарисовать → меньшая задача → направление. */
  hints: [string, string, string, string, string];
  solution: Solution;
  /** Сколько места оставить на листе для решения. */
  printSpace?: PrintSpace;
}

export interface ParentNotes {
  /** Какие навыки тренировались. */
  skills: string[];
  /** На что обратить внимание. */
  observe: string[];
  /** Какие ошибки нормальны. */
  mistakes: string[];
  /** Один вопрос после занятия. */
  question: string;
}

export interface Day {
  /** Например, "w1d3". */
  id: string;
  week: number;
  day: number;
  title: string;
  /** Привычка мыслителя, которую тренирует день. */
  habit: { emoji: string; name: string };
  emoji: string;
  /** Обращение к ребёнку в начале занятия. */
  intro: string[];
  tasks: Task[];
  parent: ParentNotes;
}

export interface ReviewQuestion {
  id: string;
  text: string;
  /** Подсказка родителю, на что смотреть. */
  hint: string;
}

export interface Week {
  number: number;
  title: string;
  subtitle: string;
  goal: string;
  days: Day[];
  review: ReviewQuestion[];
}
