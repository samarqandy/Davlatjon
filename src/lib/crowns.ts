/**
 * Короны за победы над роботом. Помощь ничего не отнимает: победа всегда приносит 👑.
 * Корону с золотым блеском (три) даёт победа в режиме «Сам» — ребёнок заранее выбрал играть без подсказок и
 * отмены ходов; с форой (у робота нет фигуры) — две. Подсказка в обычной партии — умный ход, а не потеря.
 */
import type { Lang } from "./lang";
import type { ChessGameRecord } from "./state";

export type Crowns = 0 | 1 | 2 | 3;

/** Короны за победу: обычная — одна, в режиме «Сам» — три (с форой — две). */
export function crownsForWin(solo: boolean, odds = false): Crowns {
  if (!solo) return 1;
  return odds ? 2 : 3;
}

/** Сколько корон принесла партия. Партии, записанные до режима «Сам», считаются по-старому: их короны не отнимаются. */
export function crownsFor(g: Pick<ChessGameRecord, "mode" | "result" | "hints" | "undos" | "odds" | "solo">): Crowns {
  if (g.mode !== "robot" || g.result !== "win") return 0;
  if (g.solo !== undefined) return crownsForWin(g.solo, !!g.odds);
  if (g.hints === undefined && g.undos === undefined) return 1;
  const help = (g.hints ?? 0) + (g.undos ?? 0);
  const c: Crowns = help === 0 ? 3 : help <= 3 ? 2 : 1;
  return g.odds ? (Math.min(c, 2) as Crowns) : c;
}

/** Лучший результат против робота этого уровня. */
export function bestCrowns(games: readonly ChessGameRecord[], level: number): Crowns {
  let best: Crowns = 0;
  for (const g of games) if (g.mode === "robot" && g.level === level) best = Math.max(best, crownsFor(g)) as Crowns;
  return best;
}

export interface RobotPersona {
  /** Что робот говорит перед партией. */
  hello: string;
  /** Когда ребёнок победил. */
  lost: string;
  /** Когда победил робот. */
  won: string;
}

const PERSONA: Record<number, Record<Lang, RobotPersona>> = {
  1: {
    ru: {
      hello: "Привет! Я Пешка. Хожу куда глаза глядят… но мат замечу!",
      lost: "Ой-ой! Вот это ход! Сдаюсь — ты сильнее.",
      won: "Ура, победа! Честно, это случайно вышло…",
    },
    uz: {
      hello: "Salom! Men Piyodaman. Qayoqqa koʻzim tushsa, oʻsha yoqqa yuraman… lekin motni sezib qolaman!",
      lost: "Voy-voy! Mana bu yurish! Taslimman — sen kuchliroqsan.",
      won: "Hurra, yutdim! Rostini aytsam, tasodifan boʻldi…",
    },
  },
  2: {
    ru: {
      hello: "Иго-го! Я Конь. Люблю прыгать и хватать фигуры, которые плохо стоят.",
      lost: "Иго-го… Все фигуры под защитой — мне нечего было хватать!",
      won: "Прыг-скок — и победа! Следи за фигурами, которые никто не защищает.",
    },
    uz: {
      hello: "Igo-go! Men Otman. Sakrashni va yomon turgan donalarni urib olishni yaxshi koʻraman.",
      lost: "Igo-go… Hamma donalaring himoyada — urib oladiganga hech narsa qolmadi!",
      won: "Sakrab-sakrab — gʻalaba! Himoyasiz qolgan donalaringga eʼtibor ber.",
    },
  },
  3: {
    ru: {
      hello: "Здравствуй! Я Слон. Смотрю на два хода вперёд — по диагонали, конечно.",
      lost: "Вот это да! Этот ход я не заметил даже по диагонали.",
      won: "На этот раз победа моя, но ты играешь всё лучше. Попробуй ещё!",
    },
    uz: {
      hello: "Assalomu alaykum! Men Filman. Ikki yurish oldinga qarayman — albatta, diagonal boʻylab.",
      lost: "Ana xolos! Bu yurishni hatto diagonalda ham koʻrmabman.",
      won: "Bu safar gʻalaba meniki, lekin sen tobora yaxshi oʻynayapsan. Yana urinib koʻr!",
    },
  },
  4: {
    ru: {
      hello: "Я Ладья — крепость на колёсах. Считаю на три хода. Готовься к настоящей битве!",
      lost: "Крепость пала! Такой игре позавидует любой шахматист.",
      won: "Крепость устояла! Загляни в разбор партии — там видно, где всё решилось.",
    },
    uz: {
      hello: "Men Ruxman — gʻildirakli qalʼa. Uch yurish oldinga hisoblayman. Haqiqiy jangga tayyorlan!",
      lost: "Qalʼa qulab tushdi! Bunday oʻyinga har qanday shaxmatchi havas qiladi.",
      won: "Qalʼa bardosh berdi! Partiya tahliliga qara — hammasi qayerda hal boʻlgani koʻrinadi.",
    },
  },
  5: {
    ru: {
      hello: "Я Ферзь — главный босс. Считаю на четыре хода. Посмотрим, что ты умеешь!",
      lost: "Невероятно! Победа над самим Ферзём — это уровень чемпиона!",
      won: "Босс снова победил. Но каждая партия со мной делает тебя сильнее.",
    },
    uz: {
      hello: "Men Farzinman — bosh boss. Toʻrt yurish oldinga hisoblayman. Qani, nimalarga qodirligingni koʻraylik!",
      lost: "Aql bovar qilmaydi! Farzinning oʻzini yengding — bu chempionlar darajasi!",
      won: "Boss yana yutdi. Lekin men bilan har bir partiya seni kuchliroq qiladi.",
    },
  },
};

export function robotPersona(level: number, lang: Lang): RobotPersona | undefined {
  return PERSONA[level]?.[lang];
}

/** Последний уровень робота — босс. */
export const BOSS_LEVEL = 5;
