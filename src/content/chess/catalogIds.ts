/**
 * Задачи школы и знаменитые партии — только id, без позиций и текстов: наградам нужен лишь счёт решённого
 * и просмотренного, а сами разделы весят десятки килобайт. Совпадение с контентом проверяет
 * tests/counts.test.ts.
 */
export const CLASSIC_PUZZLE_IDS: readonly string[] = [
  "m1-backrank",
  "m1-scholar",
  "m1-queen-king",
  "m1-ladder",
  "m1-queen-rank",
  "m1-rook-king",
  "m1-queen-opposition",
  "m1-bishop-rook",
  "m1-arabian",
  "m1-two-bishops",
  "m1-black-rank",
  "m1-fools",
  "m1-promotion",
  "m2-king-queen",
  "m2-two-rooks",
  "m2-black-rooks",
  "m2-king-rook",
  "m2-promotion",
  "m2-smothered",
  "m2-anastasia",
  "m2-opera",
  "m3-reti",
  "hang-knight",
  "hang-knight-black",
  "fork-knight",
  "fork-pawn",
  "fork-rook",
  "pin-queen",
  "skewer-bishop",
  "skewer-rook",
  "discovered-check",
  "stale-queen-1",
  "stale-queen-2",
];

export const FAMOUS_GAME_IDS: readonly string[] = [
  "fools-mate",
  "scholars-mate",
  "legal",
  "opera",
  "immortal",
  "evergreen",
  "reti-tartakower",
  "game-of-the-century",
];
