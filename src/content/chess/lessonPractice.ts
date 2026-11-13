/**
 * «Закрепи»: какая тема центра задач подходит к уроку.
 *
 * В уроке одно-три упражнения — этого мало, чтобы приём запомнился: в учебных тетрадях на одну тему дают
 * десяток позиций. В банке задач их сотни на тему, поэтому после урока ведём туда. Урок есть в списке,
 * только если в центре задач есть тема про тот же приём и в ней хватает задач (у темы «Мат, а не пат» их всего две —
 * она не подходит); уроки-рассказы, партии и тесты сюда не входят.
 * Ключ — id урока курса или темы раздела «Тактика».
 */
import type { PuzzleTheme } from "./puzzles";

export const LESSON_PRACTICE: Record<string, PuzzleTheme> = {
  // Раздел «Тактика»
  fork: "fork",
  pin: "pin",
  skewer: "skewer",
  discover: "discovered",
  mates: "mate1",
  traps: "mate1",
  defence: "defense",

  // Ступень 1 «Пешка»
  "c1-promotion": "promotion",
  "c1-value": "hanging",
  "c1-exchange": "hanging",
  "c1-defence": "defense",
  "c1-mate-rook": "mate1",
  "c1-mate-bishop": "mate1",
  "c1-mate-queen": "mate1",
  "c1-mate-knight": "mate1",
  "c1-mate-pawn": "mate1",
  "c1-mate-promotion": "promotion",
  "c1-mate-opening": "mate1",
  "c1-fork-rook": "fork",
  "c1-fork-bishop": "fork",
  "c1-fork-king": "fork",
  "c1-fork-knight": "fork",
  "c1-fork-pawn": "fork",
  "c1-fork-queen": "fork",
  "c1-skewer": "skewer",
  "c1-pin": "pin",
  "c1-ladder": "mate2",

  // Ступень 2 «Конь»
  "c2-pin-mate": "pin",
  "c2-discover-mate": "discovered",
  "c2-double-check": "doublecheck",
  "c2-prepare": "mate2",
  "c2-attack": "mate2",
  "c2-defend-mate": "defense",
  "c2-trap": "trapped",
  "c2-pin-win": "pin",
  "c2-discover-win": "discovered",
  "c2-king-active": "pawnend",
  "c2-mating-net": "mate3",
  "c2-passed-pawn": "promotion",

  // Ступень 3 «Слон»
  "c3-pin-attack": "pin",
  "c3-pin-gain": "pin",
  "c3-disc-mate": "discovered",
  "c3-ambush": "discovered",
  "c3-double-mate": "doublecheck",
  "c3-disc-gain": "discovered",
  "c3-disc-attack": "discovered",
  "c3-remove-def": "defender",
  "c3-deflect": "deflection",
  "c3-decoy": "attraction",
  "c3-smothered": "smothered",
  "c3-back-rank": "backrank",

  // Ступень 4 «Ладья»
  "c4-passed": "promotion",
  "c4-passed-attack": "promotion",
  "c4-opposition": "pawnend",
  "c4-square": "pawnend",
  "c4-breakthrough": "pawnend",
  "c4-kpk-lead": "pawnend",
  "c4-kpk-defend": "pawnend",
  "c4-rook-pawn": "pawnend",
  "c4-shoulder": "pawnend",
  "c4-outside-passer": "pawnend",

  // Ступень 5 «Ферзь»
  "c5-pin-mate": "pin",
  "c5-pin-exchange": "pin",
  "c5-morphy-pin": "pin",
  "c5-double-pin": "pin",
  "c5-reti": "doublecheck",
  "c5-windmill": "discovered",
  "c5-fork": "fork",
  "c5-deflection": "deflection",
  "c5-deflection-defence": "deflection",
  "c5-decoy-net": "attraction",
  "c5-lasker": "attraction",
  "c5-decoy-fork": "attraction",
  "c5-smothered": "smothered",
  "c5-queen-trap": "trapped",
  "c5-fischer": "trapped",
  "c5-clearance": "mate3",
  "c5-back-rank": "backrank",
  "c5-open-file": "mate3",
  "c5-cooperation": "mate2",
  "c5-seize-point": "defender",
  "c5-uncastled": "mate2",
  "c5-pawn-storm": "mate3",
  "c5-nail": "mate2",
  "c5-weak-squares": "mate2",
  "c5-f7-sac": "mate2",
  "c5-h6-sac": "mate2",
  "c5-f6-sac": "mate3",
  "c5-quiet": "mate2",
  "c5-only-move": "defense",
};
